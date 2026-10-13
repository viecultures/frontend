import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { createElement, useState, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useVietnamMap, type UseVietnamMapOptions } from '@/utils/useVietnamMap';
import { MapPoiLayer } from '@/components/map/MapPoiLayer';
import { MapAiMarkersLayer } from '@/components/map/MapAiMarkersLayer';
import { VietnamMap } from '@/components/map/VietnamMap';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import { LESSON_AGENT_CATALOG } from '@/data/lessonAgentCatalog';
import { geoToSvg } from '@/utils/vietnamMapUtils';
import { useMapStore, type MapMarker, type MapState } from './map-state';
import { useLogStore, useSettings } from './state';
import { useAiMapLessonStore } from './lesson-state';
import { findProvinceByName } from './svg-map-controller';
import { dispatchTool, type ToolContext } from './tools/tool-dispatcher';
import { toolRegistry, findLandmarkByTopicOrName } from './tools/tool-registry';

const guided: ToolContext = { tutorMode: 'guided-lesson', allowMapTools: true };
const marker: MapMarker = { position: { lat: 21, lng: 105, altitude: 0 }, label: 'AI place', showLabel: true, placeId: 'ha-noi' };

beforeEach(() => {
  useMapStore.setState(useMapStore.getInitialState(), true);
  useSettings.setState({ tutorMode: 'guided-lesson', mapContextMode: 'on-demand', activeLessonId: LESSON_AGENT_CATALOG[0].id });
  useLogStore.getState().clearTurns();
  useAiMapLessonStore.getState().resetLesson();
});

type MapHook = ReturnType<typeof useVietnamMap>;

// React's server renderer supports render-phase updates: exercise the real hook
// across rerenders without mocking React or adding a DOM dependency.
function exerciseMap(options: UseVietnamMapOptions | ((step: number) => UseVietnamMapOptions), steps: Array<(map: MapHook) => void>) {
  function Probe() {
    const [step, next] = useState(0);
    const map = useVietnamMap(typeof options === 'function' ? options(step) : options);
    if (step < steps.length) { steps[step](map); next(step + 1); }
    return null;
  }
  renderToStaticMarkup(createElement(Probe));
}

test('undefined selection is uncontrolled and persists after province clicks', () => {
  exerciseMap({}, [
    map => { assert.equal(map.selectedProvinceId, null); map.selectProvince('ha-noi'); },
    map => { assert.equal(map.selectedProvinceId, 'ha-noi'); assert.equal(map.activeRegion, 'north'); map.selectProvince('can-tho'); },
    map => { assert.equal(map.selectedProvinceId, 'can-tho'); assert.equal(map.activeRegion, 'south'); },
  ]);
});

test('default selection initializes once and does not overwrite subsequent selection', () => {
  exerciseMap(step => ({ defaultSelectedId: step === 0 ? 'ha-noi' : 'can-tho' }), [
    map => assert.equal(map.selectedProvinceId, 'ha-noi'),
    map => { assert.equal(map.selectedProvinceId, 'ha-noi'); map.selectProvince('da-nang'); },
    map => assert.equal(map.selectedProvinceId, 'da-nang'),
  ]);
});

test('null/string selection and region props remain authoritative until parent changes them', () => {
  const selections: Array<string | null> = [];
  exerciseMap(step => ({
    selectedProvinceId: step < 2 ? null : step === 2 ? 'ha-noi' : null,
    activeRegion: 'all',
    onSelectProvince: province => selections.push(province?.id ?? null),
  }), [
    map => map.selectProvince('can-tho'),
    map => { assert.equal(map.selectedProvinceId, null); assert.equal(map.activeRegion, 'all'); },
    map => { assert.equal(map.selectedProvinceId, 'ha-noi'); map.selectProvince('da-nang'); },
    map => assert.equal(map.selectedProvinceId, null),
  ]);
  assert.deepEqual(selections, ['can-tho', 'da-nang']);
});

test('external controlled province changes silently focus an uncontrolled region', () => {
  const calls: string[] = [];
  const provinces = [null, 'ha-noi', 'da-nang', 'can-tho', null, 'unknown-province'] as const;
  const regions = ['all', 'north', 'central', 'south', 'south', 'south'] as const;
  exerciseMap(step => ({
    selectedProvinceId: provinces[Math.min(step, provinces.length - 1)],
    onSelectProvince: () => calls.push('province'),
    onSelectRegion: () => calls.push('region'),
  }), regions.map((region, step) => map => {
    assert.equal(map.selectedProvinceId, provinces[step]);
    assert.equal(map.activeRegion, region);
  }));
  assert.deepEqual(calls, []);
});

test('initial controlled province focuses locally, but unchanged props do not undo explicit region actions', () => {
  const calls: string[] = [];
  exerciseMap({
    selectedProvinceId: 'ha-noi',
    onSelectRegion: region => calls.push(region),
  }, [
    map => { assert.equal(map.activeRegion, 'north'); map.setActiveRegion('south'); },
    map => { assert.equal(map.activeRegion, 'south'); map.resetToAll(true); },
    map => assert.equal(map.activeRegion, 'all'),
  ]);
  assert.deepEqual(calls, ['south', 'all']);
});

test('controlled region remains authoritative when the controlled province changes externally', () => {
  const calls: string[] = [];
  exerciseMap(step => ({
    selectedProvinceId: step === 0 ? 'ha-noi' : 'can-tho',
    activeRegion: 'central',
    onSelectRegion: () => calls.push('region'),
    onSelectProvince: () => calls.push('province'),
  }), [
    map => assert.equal(map.activeRegion, 'central'),
    map => { assert.equal(map.selectedProvinceId, 'can-tho'); assert.equal(map.activeRegion, 'central'); },
  ]);
  assert.deepEqual(calls, []);
});

test('automatic province focus emits only the province event, never a user region-tab event', () => {
  const calls: string[] = [];
  exerciseMap({
    onSelectRegion: region => { calls.push('region'); useMapStore.getState().selectRegion(region, 'user'); },
    onSelectProvince: province => { calls.push('province'); useMapStore.getState().selectProvince(province?.id ?? null, 'user'); },
  }, [map => map.selectProvince('ha-noi')]);
  assert.deepEqual(calls, ['province']);
  assert.equal(useMapStore.getState().highlightedPlaceId, 'ha-noi');
});

test('POI emits only a landmark transaction and preserves (landmark, province)', () => {
  const landmark = VIETNAM_LANDMARKS[0];
  const province = VIETNAM_34_PROVINCES.find(p => p.id === landmark.provinceId)!;
  const calls: string[] = [];
  let click!: (event: { stopPropagation(): void }) => void;
  function Probe() {
    const layer = MapPoiLayer({
      landmarks: [landmark], provinces: [province], selectedProvinceId: null, activeRegion: 'all',
      onSelectLandmarkProvince: p => { calls.push('province'); useMapStore.getState().selectProvince(p.id, 'user'); },
      onSelectLandmark: (l, p) => { assert.equal(l, landmark); assert.equal(p, province); calls.push('landmark'); useMapStore.getState().selectLandmark(l.id, 'user'); },
    }) as ReactElement<{ children: Array<ReactElement<{ onClick: typeof click }>> }>;
    click = layer.props.children[0].props.onClick;
    return layer;
  }
  renderToStaticMarkup(createElement('svg', null, createElement(Probe)));
  click({ stopPropagation() {} });
  assert.deepEqual(calls, ['landmark']);
  assert.equal(useMapStore.getState().selectedLandmarkId, landmark.id);
});

test('landmark hook focuses local state and emits one atomic consumer transaction', () => {
  const landmark = VIETNAM_LANDMARKS[0];
  const province = VIETNAM_34_PROVINCES.find(p => p.id === landmark.provinceId)!;
  const calls: string[] = [];
  const snapshots: MapState[] = [];
  const unsubscribe = useMapStore.subscribe(state => snapshots.push(state));
  try {
    exerciseMap({
      onSelectRegion: () => calls.push('region'),
      onSelectProvince: () => calls.push('province'),
      onSelectLandmark: (l, p) => {
        assert.equal(l, landmark); assert.equal(p, province);
        calls.push('landmark'); useMapStore.getState().selectLandmark(l.id, 'user');
      },
    }, [
      map => map.selectLandmark(landmark, province),
      map => {
        assert.equal(map.selectedProvinceId, province.id);
        assert.equal(map.selectedLandmarkId, landmark.id);
        assert.equal(map.activeRegion, province.region);
      },
    ]);
    assert.deepEqual(calls, ['landmark']);
    assert.equal(snapshots.length, 1);
    assert.equal(snapshots[0].selectedLandmarkId, landmark.id);
    assert.equal(snapshots[0].selectedProvinceId, province.id);
  } finally { unsubscribe(); }
});

test('landmark hook falls back to one province callback for legacy consumers', () => {
  const landmark = VIETNAM_LANDMARKS[0];
  const province = VIETNAM_34_PROVINCES.find(p => p.id === landmark.provinceId)!;
  const calls: string[] = [];
  exerciseMap({
    onSelectRegion: () => calls.push('region'),
    onSelectProvince: p => calls.push(p!.id),
  }, [
    map => map.selectLandmark(landmark, province),
    map => {
      assert.equal(map.selectedProvinceId, province.id);
      assert.equal(map.selectedLandmarkId, landmark.id);
    },
  ]);
  assert.deepEqual(calls, [province.id]);
});

test('explicit region-tab action still notifies the consumer', () => {
  const regions: string[] = [];
  exerciseMap({ onSelectRegion: region => regions.push(region) }, [
    map => map.setActiveRegion('south'),
    map => assert.equal(map.activeRegion, 'south'),
  ]);
  assert.deepEqual(regions, ['south']);
});

test('landmark control supports undefined, null and parent updates; region selection clears local landmark', () => {
  const landmark = VIETNAM_LANDMARKS[0];
  const province = VIETNAM_34_PROVINCES.find(p => p.id === landmark.provinceId)!;
  exerciseMap({}, [
    map => { map.selectProvince(province); map.selectLandmark(landmark, province); },
    map => { assert.equal(map.selectedLandmarkId, landmark.id); map.setActiveRegion('south'); },
    map => assert.equal(map.selectedLandmarkId, null),
  ]);
  exerciseMap(step => ({ selectedLandmarkId: step < 2 ? null : landmark.id }), [
    map => map.selectLandmark(landmark, province),
    map => assert.equal(map.selectedLandmarkId, null),
    map => assert.equal(map.selectedLandmarkId, landmark.id),
  ]);
});

test('atomic actions publish exactly one coherent snapshot, replacing stale landmarks/markers/routes', () => {
  useMapStore.getState().selectLandmark(VIETNAM_LANDMARKS[0].id, 'user');
  useMapStore.getState().setRoutePolyline([{ lat: 21, lng: 105 }]);
  const snapshots: MapState[] = [];
  const unsubscribe = useMapStore.subscribe(state => snapshots.push(state));
  try {
    useMapStore.getState().selectProvince('ha-noi', { source: 'ai', markers: [marker] });
    assert.equal(snapshots.length, 1);
    assert.equal(snapshots[0].cameraTarget?.provinceId, 'ha-noi');
    assert.equal(snapshots[0].highlightedPlaceId, 'ha-noi');
    assert.equal(snapshots[0].selectedLandmarkId, null);
    assert.equal(snapshots[0].routePolyline, null);
    assert.deepEqual(snapshots[0].markers, [marker]);
    assert.equal(snapshots[0].source, 'ai');
    useMapStore.getState().selectRegion('south', 'user');
    assert.equal(snapshots.length, 2);
    assert.deepEqual(snapshots[1].cameraTarget, { region: 'south' });
    assert.equal(snapshots[1].selectedProvinceId, null);
    assert.deepEqual(snapshots[1].markers, []);
  } finally { unsubscribe(); }
});

test('clearSelection preserves region, resetMap returns to all, invalid IDs are no-ops', () => {
  useMapStore.getState().selectLandmark(VIETNAM_LANDMARKS[0].id, 'user');
  const before = useMapStore.getState();
  useMapStore.getState().selectProvince('does-not-exist', 'ai');
  useMapStore.getState().selectLandmark('does-not-exist', 'ai');
  assert.equal(useMapStore.getState(), before);
  useMapStore.getState().clearSelection();
  assert.deepEqual(useMapStore.getState().cameraTarget, { region: before.cameraTarget?.region });
  assert.equal(useMapStore.getState().selectedLandmarkId, null);
  useMapStore.getState().resetMap();
  assert.deepEqual(useMapStore.getState().cameraTarget, { region: 'all' });
});

test('dispatcher rejects unknown names and malformed args without mutating stores', async () => {
  const map = useMapStore.getState();
  const lesson = useAiMapLessonStore.getState();
  const invalid: Array<[string, unknown]> = [
    ['focusMapRegion', { region: 'west' }], ['focusMapRegion', null],
    ['highlightMapProvince', { provinceName: '   ' }],
    ['highlightMapProvince', { provinceName: 12 }],
    ['highlightMapProvince', { provinceName: 'Hanoi', injected: true }],
    ['loadLessonDiscussionPlan', { lessonId: 'ha-long-bay', level: 'expert' }],
    ['recordLessonQuizResult', { totalQuestions: 0, correctAnswers: 0 }],
    ['recordLessonQuizResult', { totalQuestions: 2, correctAnswers: 3 }],
    ['recordLessonQuizResult', { totalQuestions: 2.5, correctAnswers: 1 }],
    ['recordLessonQuizResult', { totalQuestions: 2, correctAnswers: NaN }],
    ['displayCulturalVocab', { word: 'heritage' }],
    ['evaluateSpeechOrGrammar', { targetPhrase: 'hello', feedback: '' }],
  ];
  for (const [name, args] of invalid) {
    const result = await dispatchTool(name, args, guided);
    assert.equal((result as { error: string }).error, 'INVALID_ARGUMENTS');
  }
  for (const name of ['unknown', 'toString', '__proto__']) {
    assert.equal((await dispatchTool(name, {}, guided) as { error: string }).error, 'UNKNOWN_TOOL');
  }
  assert.equal(useMapStore.getState(), map);
  assert.equal(useAiMapLessonStore.getState(), lesson);
  assert.equal(useLogStore.getState().turns.length, 0);
});

test('map off blocks explicit tools and lesson auto-focus while lesson loading still works', async () => {
  for (const settingOff of [false, true]) {
    useSettings.setState({ mapContextMode: settingOff ? 'off' : 'always' });
    const context = { ...guided, allowMapTools: settingOff };
    const before = useMapStore.getState();
    for (const [name, args] of [['highlightMapProvince', { provinceName: 'Hanoi' }], ['focusMapRegion', { region: 'south' }]] as const) {
      assert.equal((await dispatchTool(name, args, context) as { error: string }).error, 'MAP_TOOLS_DISABLED');
    }
    const loaded = await dispatchTool('loadLessonDiscussionPlan', { lessonId: 'ha-long-bay' }, context);
    assert.equal((loaded as { lessonId: string }).lessonId, 'ha-long-bay');
    assert.equal(useAiMapLessonStore.getState().session?.lessonId, 'ha-long-bay');
    assert.equal(useMapStore.getState(), before);
  }
});

test('unknown lesson ID is rejected without the catalog fallback or any writes', async () => {
  const before = useSettings.getState();
  const result = await dispatchTool('loadLessonDiscussionPlan', { lessonId: 'does-not-exist' }, guided);
  assert.equal((result as { error: string }).error, 'LESSON_NOT_FOUND');
  assert.equal(useSettings.getState(), before);
  assert.equal(useAiMapLessonStore.getState().session, null);
  assert.equal(useLogStore.getState().turns.length, 0);
});

test('stale calls and cancellation immediately before mutation leave stores untouched', async () => {
  const before = useMapStore.getState();
  for (const isCurrent of [() => false, (() => { let checks = 0; return () => ++checks < 3; })()]) {
    const result = await dispatchTool('highlightMapProvince', { provinceName: 'Hanoi' }, { ...guided, isCurrent });
    assert.equal((result as { error: string }).error, 'STALE_CALL');
    assert.equal(useMapStore.getState(), before);
  }
});

test('cancellation during lesson loading prevents later mutations', async () => {
  let current = true;
  const unsubscribe = useSettings.subscribe(() => { current = false; });
  try {
    const result = await dispatchTool('loadLessonDiscussionPlan', { lessonId: 'ha-long-bay' }, { ...guided, isCurrent: () => current });
    assert.equal((result as { error: string }).error, 'STALE_CALL');
    assert.equal(useAiMapLessonStore.getState().session, null);
    assert.equal(useMapStore.getState().cameraTarget, null);
    assert.equal(useLogStore.getState().turns.length, 0);
  } finally { unsubscribe(); }
});

test('free conversation rejects guided tools and does not mutate lesson progress via vocabulary', async () => {
  const context: ToolContext = { tutorMode: 'free-conversation', allowMapTools: true };
  for (const [name, args] of [['listCulturalLessons', {}], ['loadLessonDiscussionPlan', { lessonId: 'ha-long-bay' }], ['recordLessonQuizResult', { totalQuestions: 1, correctAnswers: 1 }]] as const) {
    assert.equal((await dispatchTool(name, args, context) as { error: string }).error, 'GUIDED_MODE_REQUIRED');
  }
  const before = useAiMapLessonStore.getState();
  await dispatchTool('displayCulturalVocab', { word: 'heritage', vietnameseMeaning: 'di sản' }, context);
  assert.equal(useAiMapLessonStore.getState(), before);
  assert.equal(useLogStore.getState().turns.length, 1);
});

test('successful AI selection is atomic and legacy registry also enforces validation', async () => {
  const snapshots: MapState[] = [];
  const unsubscribe = useMapStore.subscribe(state => snapshots.push(state));
  try {
    const result = await dispatchTool('highlightMapProvince', { provinceName: ' Hà Nội ', culturalTopic: 'Phở' }, guided);
    assert.equal(typeof result, 'string');
    assert.equal(snapshots.length, 1);
    assert.equal(snapshots[0].highlightedPlaceId, 'ha-noi');
    assert.equal(snapshots[0].selectedProvinceId, 'ha-noi');
    assert.equal(snapshots[0].selectedLandmarkId, 'pho-hanoi-history');
    assert.deepEqual(snapshots[0].markers, []);
    await toolRegistry.focusMapRegion({ region: 'invalid' }, guided);
    assert.equal(snapshots.length, 1);
    await toolRegistry.focusMapRegion({ region: 'south' }, guided);
    assert.equal(snapshots.length, 2);
    assert.deepEqual(snapshots[1].markers, []);
  } finally { unsubscribe(); }
});

test('province lookup rejects empty and ambiguous names but accepts aliases and IDs', () => {
  assert.equal(findProvinceByName('  '), undefined);
  assert.equal(findProvinceByName('quang'), undefined);
  assert.equal(findProvinceByName('Hanoi')?.id, 'ha-noi');
  assert.equal(findProvinceByName('ha-noi')?.id, 'ha-noi');
});

test('optional marker layer projects coordinates, escapes labels, and skips invalid positions', () => {
  const projected = geoToSvg(marker.position.lat, marker.position.lng);
  const markup = renderToStaticMarkup(createElement('svg', null, createElement(MapAiMarkersLayer, {
    markers: [{ ...marker, label: '<script>bad</script>' }, { ...marker, position: { lat: NaN, lng: 100 } }],
  })));
  assert.ok(markup.includes(`translate(${projected.x}, ${projected.y})`));
  assert.ok(markup.includes('&lt;script&gt;bad&lt;/script&gt;'));
  assert.ok(!markup.includes('<script>'));
  assert.ok(!markup.includes('NaN'));
  assert.equal((markup.match(/<title>/g) ?? []).length, 1);
  assert.doesNotThrow(() => renderToStaticMarkup(createElement(VietnamMap)));
  const withMarker = renderToStaticMarkup(createElement(VietnamMap, { markers: [marker] }));
  assert.ok(withMarker.includes('AI place'));
});

test('findLandmarkByTopicOrName matches Vietnamese and English landmark names, accents, and province context', () => {
  assert.equal(findLandmarkByTopicOrName('Chợ nổi Cái Răng', 'can-tho')?.id, 'cai-rang-floating-market');
  assert.equal(findLandmarkByTopicOrName('cho noi cai rang')?.id, 'cai-rang-floating-market');
  assert.equal(findLandmarkByTopicOrName('Cái Răng', 'can-tho')?.id, 'cai-rang-floating-market');
  assert.equal(findLandmarkByTopicOrName('Phở', 'ha-noi')?.id, 'pho-hanoi-history');
  assert.equal(findLandmarkByTopicOrName('Vịnh Hạ Long', 'quang-ninh')?.id, 'ha-long-bay');
  assert.equal(findLandmarkByTopicOrName('Ha Long Bay')?.id, 'ha-long-bay');
  assert.equal(findLandmarkByTopicOrName('Nonexistent topic 12345', 'ha-noi'), undefined);
  assert.equal(findLandmarkByTopicOrName(''), undefined);
});

test('highlightMapProvince selects province cleanly without markers when no landmark is matched', async () => {
  useMapStore.setState(useMapStore.getInitialState(), true);
  await dispatchTool('highlightMapProvince', { provinceName: 'Cần Thơ' }, guided);
  const state = useMapStore.getState();
  assert.equal(state.selectedProvinceId, 'can-tho');
  assert.equal(state.selectedLandmarkId, null);
  assert.deepEqual(state.markers, []);
});

test('getVieCultureArticles retrieves curated articles from landmarks data and syncs map', async () => {
  useMapStore.setState(useMapStore.getInitialState(), true);
  useLogStore.getState().clearTurns();

  const result = await dispatchTool('getVieCultureArticles', { provinceName: 'Cần Thơ', topic: 'Cái Răng' }, guided) as any;
  assert.equal(result.platform, 'VieCultures Cultural Reading Library');
  assert.ok(result.count > 0);
  assert.equal(result.articles[0].id, 'cai-rang-floating-market');

  // Verify map synchronized to the landmark
  assert.equal(useMapStore.getState().selectedLandmarkId, 'cai-rang-floating-market');
  assert.equal(useMapStore.getState().selectedProvinceId, 'can-tho');

  // Verify system turn added to log
  const turns = useLogStore.getState().turns;
  assert.equal(turns.length, 1);
  assert.equal(turns[0].role, 'system');
  assert.ok(turns[0].text.includes('Thư viện bài đọc VieCultures'));
  assert.equal((turns[0].toolResponse as any)?.type, 'vieculture_articles');
  assert.ok(Array.isArray((turns[0].toolResponse as any)?.articles));
  assert.equal((turns[0].toolResponse as any)?.articles[0].id, 'cai-rang-floating-market');
});

