import test from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS_DATA } from '@/data/discoveryData';
import { DEFAULT_FILTERS, activeLevel, filterCatalog, mergeCatalog, normalizeSearch, readBookmarkState, selectEditorial } from './catalog';
import type { CatalogLesson } from '@/features/reader/services/readerApiService';

test('Vietnamese search accepts accents, case and whitespace', () => {
  assert.equal(normalizeSearch('ĐÔNG HỒ'), 'dong ho');
  const results = filterCatalog(LESSONS_DATA, { ...DEFAULT_FILTERS, query: '  dong ho  ' }, {});
  assert.deepEqual(results.map(item => item.id), ['dong-ho-paintings']);
  assert.deepEqual(filterCatalog(LESSONS_DATA, { ...DEFAULT_FILTERS, query: 'dat va lua' }, {}).map(item => item.id), ['bat-trang-pottery']);
  assert.deepEqual(filterCatalog(LESSONS_DATA, { ...DEFAULT_FILTERS, query: 'clay and fire' }, {}).map(item => item.id), ['bat-trang-pottery']);
});
test('province filters match geography and do not expand national stories to every province', () => {
  const results = filterCatalog(LESSONS_DATA, { ...DEFAULT_FILTERS, province: 'hue' }, {});
  assert.ok(results.length > 0);
  assert.ok(results.every(item => item.provinceId === 'hue'));
  assert.equal(filterCatalog(LESSONS_DATA, { ...DEFAULT_FILTERS, province: 'cao-bang' }, {}).length, 0);
});
test('editorial stories and paginated list cover catalog once', () => {
  const stories = filterCatalog(LESSONS_DATA, DEFAULT_FILTERS, {});
  const editorial = selectEditorial(stories);
  assert.equal(editorial.length, 3);
  assert.equal(new Set(editorial.map(item => item.category)).size, 3);
  const rest = stories.filter(item => !editorial.includes(item));
  const seen = editorial.map(item => item.id);
  for (let page = 0; page < Math.ceil(rest.length / 6); page++) seen.push(...rest.slice(page * 6, (page + 1) * 6).map(item => item.id));
  assert.equal(seen.length, LESSONS_DATA.length);
  assert.equal(new Set(seen).size, LESSONS_DATA.length);
});
test('API versions replace duplicate local stories and keep real available levels and post IDs', () => {
  const original = LESSONS_DATA.find(item => item.id === 'imperial-hue')!;
  const remote: CatalogLesson = {
    id: original.id, titleEn: original.title, titleVi: original.vietnameseTitle,
    category: original.category, categoryVi: original.categoryVi, region: 'Huế',
    imageUrl: original.imageUrl || '', summary: original.summary, featured: true,
    totalReads: 0, likesCount: 0, readTime: '11 phút đọc', vocabCount: 16,
    availableLevels: ['Level 3'], primaryLevel: 'Level 3',
    levelDetails: { 'Level 3': { postId: 'real-post-3', readTime: '11 phút đọc', vocabCount: 16 } },
  };
  const result = mergeCatalog([original], [remote], () => ({ ...original, title: 'Updated title', cefrLevel: 'Level 2' }));
  assert.equal(result.length, 1);
  assert.equal(result[0].provinceId, 'hue');
  assert.deepEqual(result[0].availableLevels, ['Level 3']);
  assert.equal(result[0].postIds?.['Level 3'], 'real-post-3');
  assert.equal(activeLevel(result[0], 'All'), 'Level 3');
  assert.equal(filterCatalog(result, { ...DEFAULT_FILTERS, level: 'Level 1' }, {}).length, 0);
});
test('saved and duration filters combine using selected level statistics', () => {
  const saved = { 'imperial-hue': true };
  assert.equal(filterCatalog(LESSONS_DATA, { ...DEFAULT_FILTERS, saved: true, level: 'Level 1', duration: 'short' }, saved).length, 1);
  assert.equal(filterCatalog(LESSONS_DATA, { ...DEFAULT_FILTERS, saved: true, level: 'Level 3', duration: 'short' }, saved).length, 0);
  assert.deepEqual(readBookmarkState(['bad']), {});
  assert.deepEqual(readBookmarkState({ yes: true, no: 'true', false: false }), { yes: true });
});
