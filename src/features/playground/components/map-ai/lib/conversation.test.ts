import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildCulturalTutorPrompt, SYSTEM_INSTRUCTIONS } from './constants';
import { GenAILiveClient } from './genai-live-client';
import { getProvinceCultureData } from '../data/vietnamProvincesDetail';

test('uncurated province fallback uses map name and region without invented landmarks', () => {
  const detail = getProvinceCultureData('vinh-long');
  assert.equal(detail.name, 'Vĩnh Long');
  assert.equal(detail.region, 'south');
  assert.deepEqual(detail.landmarks, []);
});

test('conversation excludes guided instructions and retains current on-demand landmark flow', () => {
  const prompt = buildCulturalTutorPrompt(SYSTEM_INSTRUCTIONS, { mode: 'free-conversation', correctionMode: 'off', mapContextMode: 'on-demand', level: 'Level 1' });
  assert.ok(!prompt.includes('MUST CALL loadLessonDiscussionPlan'));
  assert.ok(prompt.includes('asks to locate, explore or show a place'));
  assert.ok(prompt.includes('when focusing on a specific landmark'));
  assert.ok(prompt.includes('Do not correct mistakes unless'));
  assert.ok(prompt.includes('ACTIVE LEVEL: Level 1'));
});

test('guided mode retains its lesson workflow', () => {
  const prompt = buildCulturalTutorPrompt(SYSTEM_INSTRUCTIONS, { mode: 'guided-lesson', correctionMode: 'off', mapContextMode: 'on-demand', level: 'Level 2' });
  assert.ok(prompt.includes('MUST CALL loadLessonDiscussionPlan'));
});

test('connection waits for setup, not just socket open, then sends exactly one prompt', async () => {
  const client = new GenAILiveClient('test-key');
  const sent: unknown[] = [];
  let callbacks: any;
  (client as any).client = { live: { connect: async (options: any) => {
    callbacks = options.callbacks;
    callbacks.onopen();
    return { sendRealtimeInput: (input: unknown) => sent.push(input), close() {} };
  } } };
  const pending = client.connect({ systemInstruction: 'conversation' });
  await Promise.resolve();
  assert.equal(client.status, 'connecting');
  callbacks.onmessage({ setupComplete: {} });
  assert.equal(await pending, true);
  assert.equal(sent.length, 0);
  client.sendRealtimeText('Tell me about Hue');
  assert.deepEqual(sent, [{ text: 'Tell me about Hue' }]);
  client.disconnect();
});

test('setup cancellation returns failure and closes the pending session', async () => {
  // Node has Event but no browser ErrorEvent.
  (globalThis as any).ErrorEvent ??= class extends Event { message: string; constructor(type: string, init: any = {}) { super(type); this.message = init.message || ''; } };
  const client = new GenAILiveClient('test-key');
  let closed = false;
  (client as any).client = { live: { connect: async () => ({ close() { closed = true; } }) } };
  const pending = client.connect({});
  await Promise.resolve();
  client.disconnect();
  assert.equal(await pending, false);
  assert.equal(client.status, 'disconnected');
  assert.equal(closed, true);
});

test('Sesame flow and pedagogical profanity boundary are present in free conversation', () => {
  const prompt = buildCulturalTutorPrompt(SYSTEM_INSTRUCTIONS, {
    mode: 'free-conversation',
    correctionMode: 'off',
    mapContextMode: 'on-demand',
    level: 'Level 3',
  });
  assert.ok(prompt.includes('Sesame Flow'));
  assert.ok(prompt.includes('NEVER interrogate the learner or mechanically end turns with formulaic questions'));
  assert.ok(prompt.includes('PEDAGOGICAL & LANGUAGE BOUNDARY'));
  assert.ok(prompt.includes('LEVEL 3 (B2–C1 - ADVANCED & CULTURAL AMBASSADOR)'));
  assert.ok(prompt.includes('IN-DEPTH STORYTELLING'));
});

test('profanity filtering blocks vulgar words and prevents raw translations', async () => {
  const { isProfaneWord, lookupWordInstant } = await import('./dictionary-service');
  assert.equal(isProfaneWord('fuck'), true);
  assert.equal(isProfaneWord('What the fuck?'), true);
  assert.equal(isProfaneWord('shit'), true);
  assert.equal(isProfaneWord('bustling'), false);
  assert.equal(isProfaneWord('heritage'), false);

  const profaneResult = await lookupWordInstant('fuck', 'What the fuck?');
  assert.equal(profaneResult.isProfane, true);
  assert.ok(profaneResult.viMeaning.includes('ngôn từ nhạy cảm'));
  assert.ok(profaneResult.enDefinition?.includes('blocked'));

  const normalResult = await lookupWordInstant('bustling');
  assert.equal(normalResult.isProfane, undefined);
  assert.ok(normalResult.viMeaning.includes('Nhộn nhịp'));
});

test('VieCultures brand acoustic mapping and article library guidance are present in prompt', () => {
  const prompt = buildCulturalTutorPrompt(SYSTEM_INSTRUCTIONS, {
    mode: 'free-conversation',
    correctionMode: 'off',
    mapContextMode: 'on-demand',
    level: 'Level 2',
  });
  assert.ok(prompt.includes('via cultures'));
  assert.ok(prompt.includes('vee cultures'));
  assert.ok(prompt.includes('getVieCultureArticles'));
  assert.ok(prompt.includes('VieCultures'));
  assert.ok(prompt.includes('BRAND IDENTITY & VIECULTURES LIBRARY'));
  assert.ok(SYSTEM_INSTRUCTIONS.includes('BRAND IDENTITY & VIECULTURES ARTICLE LIBRARY'));
});

