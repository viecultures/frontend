import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useChatWorkspace } from './chat-workspace';
import { useMapStore } from './map-state';
import { useSettings, useTools } from './state';
import { dispatchTool, type ToolContext } from './tools/tool-dispatcher';
import { buildSessionConfiguration } from './session-config';
import { ChatArticleDetail } from '../components/ChatArticleDetail';

const chat: ToolContext = { view: 'chat', tutorMode: 'free-conversation', allowMapTools: true };

beforeEach(() => {
  useChatWorkspace.getState().closePanel();
  useMapStore.setState(useMapStore.getInitialState(), true);
  useSettings.setState({ tutorMode: 'free-conversation', mapContextMode: 'on-demand' });
});

test('chat starts without a panel; map tools open and focus the map on demand', async () => {
  assert.equal(useChatWorkspace.getState().panel, null);
  await dispatchTool('openMap', {}, chat);
  assert.deepEqual(useChatWorkspace.getState().panel, { type: 'map' });
  assert.equal(useMapStore.getState().cameraTarget?.region, 'all');
  useChatWorkspace.getState().closePanel();
  await dispatchTool('openMap', { provinceName: 'Hà Nội' }, chat);
  assert.equal(useMapStore.getState().selectedProvinceId, 'ha-noi');
  assert.deepEqual(useChatWorkspace.getState().panel, { type: 'map' });
  useChatWorkspace.getState().closePanel();
  await dispatchTool('focusMapRegion', { region: 'south' }, chat);
  assert.equal(useMapStore.getState().cameraTarget?.region, 'south');
  assert.deepEqual(useChatWorkspace.getState().panel, { type: 'map' });
});

test('article search keeps the panel closed, explicit article tool opens bilingual details without moving the map', async () => {
  const result = await dispatchTool('getVieCultureArticles', { topic: 'Vịnh Hạ Long' }, chat) as { articles: Array<{ id: string }> };
  assert.equal(useChatWorkspace.getState().panel, null);
  const map = useMapStore.getState();
  const articleId = result.articles[0].id;
  assert.equal(articleId, 'ha-long-bay');
  await dispatchTool('openArticleDetail', { articleId }, chat);
  assert.deepEqual(useChatWorkspace.getState().panel, { type: 'article', articleId });
  assert.equal(useMapStore.getState(), map);
  const markup = renderToStaticMarkup(createElement(ChatArticleDetail, { articleId, onShowMap: () => {} }));
  assert.ok(markup.includes('lang="en"'));
  assert.ok(markup.includes('lang="vi"'));
  assert.ok(markup.includes('Bilingual introduction'));
  assert.ok(markup.includes('article=ha-long-bay'));
  useChatWorkspace.getState().closePanel();
  assert.equal(useChatWorkspace.getState().panel, null);
});

test('invalid, unknown, stale and disabled tool calls do not open or replace panels', async () => {
  await dispatchTool('openArticleDetail', { articleId: 'ha-long-bay' }, chat);
  const panel = useChatWorkspace.getState().panel;
  const cases: Array<[string, unknown, ToolContext, string]> = [
    ['openMap', { provinceName: 'Hanoi', region: 'south' }, chat, 'INVALID_ARGUMENTS'],
    ['openMap', { region: 'west' }, chat, 'INVALID_ARGUMENTS'],
    ['openArticleDetail', { articleId: 'unknown' }, chat, 'ARTICLE_NOT_FOUND'],
    ['openArticleDetail', { articleId: ' ' }, chat, 'INVALID_ARGUMENTS'],
    ['openMap', {}, { ...chat, isCurrent: () => false }, 'STALE_CALL'],
    ['openArticleDetail', { articleId: 'trang-an' }, { ...chat, isCurrent: () => false }, 'STALE_CALL'],
    ['openMap', {}, { ...chat, allowMapTools: false }, 'MAP_TOOLS_DISABLED'],
    ['openMap', {}, { ...chat, view: 'immersive' }, 'CHAT_VIEW_REQUIRED'],
    ['openArticleDetail', { articleId: 'ha-long-bay' }, { ...chat, view: 'immersive' }, 'CHAT_VIEW_REQUIRED'],
  ];
  for (const [name, args, context, error] of cases) {
    assert.equal((await dispatchTool(name, args, context) as { error: string }).error, error);
    assert.equal(useChatWorkspace.getState().panel, panel);
  }
  await dispatchTool('openMap', { provinceName: 'unknown-province' }, chat);
  assert.equal(useChatWorkspace.getState().panel, panel);
});

test('map-off still allows article details, immersive tools keep the chat panel closed', async () => {
  useSettings.setState({ mapContextMode: 'off' });
  assert.equal((await dispatchTool('openMap', {}, chat) as { error: string }).error, 'MAP_TOOLS_DISABLED');
  await dispatchTool('openArticleDetail', { articleId: 'ha-long-bay' }, chat);
  assert.equal(useChatWorkspace.getState().panel?.type, 'article');
  useChatWorkspace.getState().closePanel();
  useSettings.setState({ mapContextMode: 'on-demand' });
  await dispatchTool('highlightMapProvince', { provinceName: 'Hanoi' }, { ...chat, view: 'immersive' });
  assert.equal(useMapStore.getState().selectedProvinceId, 'ha-noi');
  assert.equal(useChatWorkspace.getState().panel, null);
});

test('new tool declarations and panel instructions are scoped to chat sessions', () => {
  const settings = useSettings.getState();
  const tools = useTools.getState().tools;
  const names = (view: 'chat' | 'immersive') => buildSessionConfiguration(settings, tools, view)
    .config.tools?.flatMap(tool => 'functionDeclarations' in tool ? tool.functionDeclarations?.map(item => item.name) ?? [] : []) ?? [];
  assert.ok(names('chat').includes('openMap'));
  assert.ok(names('chat').includes('openArticleDetail'));
  assert.ok(!names('immersive').includes('openMap'));
  assert.ok(!names('immersive').includes('openArticleDetail'));
  assert.ok(!buildSessionConfiguration(settings, tools, 'immersive').systemPrompt.includes('AI MAP CHAT PANELS'));
  assert.ok(!buildSessionConfiguration({ ...settings, mapContextMode: 'off' }, tools, 'chat')
    .config.tools?.some(tool => 'functionDeclarations' in tool && tool.functionDeclarations?.some(item => item.name === 'openMap')));
});
