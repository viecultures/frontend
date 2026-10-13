import assert from 'node:assert/strict';
import { test } from 'node:test';
import EventEmitter from 'eventemitter3';
import type { Content, LiveConnectConfig, Part, LiveClientToolResponse } from '@google/genai';
import type { LiveClientEventTypes } from './genai-live-client';
import type { ConversationAudioPort } from './conversation-audio';
import { SessionController } from './session-controller';
import { useLogStore } from './conversation-state';
import { buildSessionConfiguration } from './session-config';
import { SYSTEM_INSTRUCTIONS } from './constants';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function fixture() {
  useLogStore.getState().clearTurns();
  const events = new EventEmitter<LiveClientEventTypes>();
  const calls: string[] = [];
  const messages: (Part | Part[])[] = [];
  const prefills: Content[][] = [];
  let configuration: LiveConnectConfig | undefined;
  let setup = Promise.resolve(true);
  let unlock = Promise.resolve();
  let level = 'Level 2';
  const client = {
    on: events.on.bind(events), off: events.off.bind(events),
    connect: (config: LiveConnectConfig) => { calls.push('connect'); configuration = config; return setup; },
    disconnect: () => { calls.push('disconnect'); return true; },
    prefill: (turns: Content[]) => { calls.push('prefill'); prefills.push(turns); },
    send: (parts: Part | Part[]) => { calls.push('send'); messages.push(parts); },
    sendToolResponse: (_response: LiveClientToolResponse) => { calls.push('tool-response'); },
    endAudioInput: () => {}, sendRealtimeInput: () => {},
  };
  const audio: ConversationAudioPort = {
    unlock: () => { calls.push('unlock'); return unlock; },
    startMicrophone: async () => { calls.push('mic-start'); },
    stopMicrophone: () => { calls.push('mic-stop'); },
    addAudio: () => {}, stopPlayback: () => {}, completePlayback: () => {},
    setMuted: () => {}, dispose: () => { calls.push('audio-dispose'); }, playing: false,
  };
  let dispatch = async (_name: string, _args: unknown, _context: { isCurrent: () => boolean }): Promise<string | object> => 'ok';
  const controller = new SessionController({
    client, audio,
    configuration: () => ({ config: { systemInstruction: 'Tutor settings only' }, systemPrompt: 'Tutor settings only', model: 'test' }),
    dispatchTool: (name, args, context) => dispatch(name, args, context),
    toolPolicy: () => ({ allowMapTools: true, tutorMode: 'free-conversation' }),
    setLevel: value => { level = value; }, setMuted: () => {}, clearMarkers: () => {},
  });
  controller.attach(); controller.setActiveView('chat'); calls.length = 0;
  return {
    controller, client, audio, events, calls, messages, prefills,
    get config() { return configuration; }, get level() { return level; },
    setSetup(value: Promise<boolean>) { setup = value; },
    setUnlock(value: Promise<void>) { unlock = value; },
    setDispatch(value: typeof dispatch) { dispatch = value; },
  };
}

test('resume unlocks synchronously, waits for setup, then prefills before one new prompt', async () => {
  const f = fixture();
  const setup = deferred<boolean>(); f.setSetup(setup.promise);
  const log = useLogStore.getState();
  log.addTurn({ role: 'user', text: 'Tell me about Huế', isFinal: true });
  log.addTurn({ role: 'agent', text: 'Huế has a historic citadel.', isFinal: true });
  const pending = f.controller.resumeConversation({ input: 'voice' });
  assert.deepEqual(f.calls, ['unlock']);
  await Promise.resolve();
  assert.deepEqual(f.calls, ['unlock', 'connect']);
  assert.equal(f.controller.getSnapshot().isRestoringContext, true);
  setup.resolve(true);
  assert.equal((await pending).status, 'ok');
  assert.deepEqual(f.calls, ['unlock', 'connect', 'prefill', 'send', 'mic-start']);
  assert.deepEqual(f.prefills[0].map(t => t.role), ['user', 'model']);
  assert.equal(f.messages.length, 1);
  assert.equal(useLogStore.getState().turns.length, 2);
  assert.deepEqual(f.config, { systemInstruction: 'Tutor settings only' });
  f.controller.dispose();
});

test('switching view cancels pending setup without sending history, prompt or microphone', async () => {
  const f = fixture(); const setup = deferred<boolean>(); f.setSetup(setup.promise);
  const pending = f.controller.startConversation({ input: 'voice' });
  await Promise.resolve();
  f.controller.setActiveView('immersive');
  setup.resolve(true);
  assert.equal((await pending).status, 'cancelled');
  assert.equal(f.controller.getSnapshot().connectionStatus, 'idle');
  assert.equal(f.messages.length, 0); assert.ok(!f.calls.includes('mic-start'));
  assert.ok(f.calls.includes('audio-dispose'));
  f.controller.dispose();
});

test('autoplay failure retains unsent prompt, retry sends it once and text never starts mic', async () => {
  const f = fixture(); f.setUnlock(Promise.reject(new Error('Autoplay blocked')));
  assert.equal((await f.controller.sendMessage({ text: 'Food in Huế?', source: 'composer' })).status, 'error');
  assert.equal(f.controller.getSnapshot().pendingPrompt, 'Food in Huế?');
  assert.ok(!f.calls.includes('connect')); assert.equal(useLogStore.getState().turns.length, 0);
  f.setUnlock(Promise.resolve());
  assert.equal((await f.controller.retry()).status, 'ok');
  assert.equal(f.messages.length, 1); assert.equal(useLogStore.getState().turns.length, 1);
  assert.ok(!f.calls.includes('mic-start'));
  f.controller.dispose();
});

test('repeat resume preserves session identity and never adds hidden controls to history', async () => {
  const f = fixture();
  await f.controller.sendMessage({ text: 'Hello', source: 'composer' });
  const first = useLogStore.getState().sessionMetadata!;
  f.controller.stopConversation();
  await f.controller.resumeConversation({ input: 'text' });
  const second = useLogStore.getState().sessionMetadata!;
  assert.equal(first.sessionId, second.sessionId);
  assert.notEqual(first.connectionId, second.connectionId);
  await f.controller.sendControlInstruction('Change level now');
  f.controller.stopConversation();
  await f.controller.resumeConversation({ input: 'text' });
  assert.equal(useLogStore.getState().turns.length, 1);
  assert.equal(f.prefills[1].length, 1);
  f.controller.dispose();
});

test('double submit and inactive screen cannot start a second connection', async () => {
  const f = fixture(); const setup = deferred<boolean>(); f.setSetup(setup.promise);
  const first = f.controller.sendMessage({ text: 'first', source: 'map' });
  assert.equal((await f.controller.sendMessage({ text: 'second', source: 'map' })).status, 'busy');
  setup.resolve(true); await first;
  f.controller.setActiveView(null);
  assert.equal((await f.controller.startConversation({ input: 'voice' })).status, 'inactive');
  assert.equal(f.messages.length, 1);
  f.controller.dispose();
});

test('late tool results after view change do not send responses or remain waiting', async () => {
  const f = fixture(); const done = deferred<string>();
  let current: (() => boolean) | undefined;
  f.setDispatch(async (_name, _args, context) => { current = context.isCurrent; return done.promise; });
  await f.controller.startConversation({ input: 'text' });
  f.events.emit('toolcall', { functionCalls: [{ id: 'tool-1', name: 'highlightMapProvince', args: { provinceName: 'Huế' } }] });
  assert.equal(current?.(), true);
  f.controller.setActiveView('immersive');
  assert.equal(current?.(), false);
  done.resolve('ok'); await Promise.resolve(); await Promise.resolve();
  assert.ok(!f.calls.includes('tool-response'));
  assert.equal(useLogStore.getState().isAwaitingFunctionResponse, false);
  f.controller.dispose();
});

test('level changes commit only after a successful control send', async () => {
  const f = fixture(); await f.controller.startConversation({ input: 'text' });
  f.client.send = () => { throw new Error('Connection failed'); };
  const result = await f.controller.changeLevel('Level 3');
  assert.equal(result.status, 'error'); assert.equal(f.level, 'Level 2');
  f.controller.dispose();
});

test('same config enables transcription and filters map and guided tools for both views', () => {
  const settings = { systemPrompt: SYSTEM_INSTRUCTIONS, model: 'test', voice: 'Zephyr', proficiencyLevel: 'Level 2', tutorMode: 'free-conversation' as const, correctionMode: 'off' as const, mapContextMode: 'off' as const };
  const result = buildSessionConfiguration(settings, ['highlightMapProvince', 'loadLessonDiscussionPlan', 'displayCulturalVocab'].map(name => ({ name, isEnabled: true })));
  assert.deepEqual(result.config.inputAudioTranscription, {});
  assert.deepEqual(result.config.outputAudioTranscription, {});
  const tool = result.config.tools?.[0];
  assert.ok(tool && 'functionDeclarations' in tool);
  assert.deepEqual(tool.functionDeclarations?.map(d => d.name), ['displayCulturalVocab']);
});
