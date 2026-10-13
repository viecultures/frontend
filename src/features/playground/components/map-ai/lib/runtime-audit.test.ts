import assert from 'node:assert/strict';
import { test, type TestContext } from 'node:test';
import EventEmitter from 'eventemitter3';
import { LiveServerMessage, Session, type LiveCallbacks } from '@google/genai';
import { GenAILiveClient, type LiveClientEventTypes } from './genai-live-client';
import { ConversationAudio, type ConversationAudioPort } from './conversation-audio';
import { SessionController, type SessionDependencies } from './session-controller';
import { useLogStore } from './conversation-state';
import { buildResumeHistory } from './conversation-history';

// Audit regressions assert the required behavior; failures identify implementation bugs.
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

async function flush() {
  for (let index = 0; index < 12; index++) await Promise.resolve();
}

function serverMessage(fields: Partial<LiveServerMessage>): LiveServerMessage {
  return Object.assign(new LiveServerMessage(), fields);
}

function controllerFixture(t: TestContext) {
  useLogStore.getState().clearTurns();
  const events = new EventEmitter<LiveClientEventTypes>();
  let disconnects = 0;
  let disposed = 0;
  const sent: unknown[] = [];
  const client: SessionDependencies['client'] = {
    on: events.on.bind(events), off: events.off.bind(events),
    connect: async () => true,
    disconnect: () => { disconnects++; return true; },
    prefill: () => {}, send: parts => { sent.push(parts); },
    sendToolResponse: () => {}, endAudioInput: () => {}, sendRealtimeInput: () => {},
  };
  const audio: ConversationAudioPort = {
    unlock: async () => {}, startMicrophone: async () => {}, stopMicrophone: () => {},
    addAudio: () => {}, stopPlayback: () => {}, completePlayback: () => {},
    setMuted: () => {}, dispose: () => { disposed++; }, playing: false,
  };
  const controller = new SessionController({
    client, audio,
    configuration: () => ({ config: {}, systemPrompt: 'Tutor', model: 'test' }),
    toolPolicy: () => ({ allowMapTools: true, tutorMode: 'free-conversation' }),
    dispatchTool: async () => 'ok', setLevel: () => {}, setMuted: () => {}, clearMarkers: () => {},
  });
  controller.attach();
  controller.setActiveView('chat');
  disconnects = 0;
  disposed = 0;
  t.after(() => { controller.dispose(); useLogStore.getState().clearTurns(); });
  return { controller, events, audio, sent, get disconnects() { return disconnects; }, get disposed() { return disposed; } };
}

test('audit: an in-flight response tail must not complete the requested end summary', async t => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const f = controllerFixture(t);
  await f.controller.startConversation({ input: 'text' });
  f.events.emit('outputTranscription', 'The old answer begins', false);
  assert.equal((await f.controller.endConversation()).status, 'ok');
  assert.equal(f.sent.length, 1); // Drain the old response before sending the summary.

  // These packets were generated before the server received the summary request.
  f.events.emit('outputTranscription', ' and the old answer ends.', true);
  f.events.emit('turncomplete');
  assert.equal(f.sent.length, 2);
  t.mock.timers.tick(250);
  assert.equal(f.controller.getSnapshot().connectionStatus, 'ending',
    'old response packets closed the connection before the summary could arrive');
  assert.equal(f.disconnects, 0);
  f.events.emit('outputTranscription', 'The actual summary.', true);
  f.events.emit('turncomplete');
  t.mock.timers.tick(250);
  assert.equal(f.controller.getSnapshot().connectionStatus, 'idle');
  assert.equal(f.disconnects, 1);
});

test('audit: output transcription arriving after turncomplete must not create an unfinished turn', async t => {
  const f = controllerFixture(t);
  await f.controller.startConversation({ input: 'text' });
  f.events.emit('outputTranscription', 'Vietnamese', false);
  const originalId = useLogStore.getState().turns[0].id;
  f.events.emit('turncomplete');
  // The SDK documents transcription as independent of model-turn ordering.
  f.events.emit('outputTranscription', ' culture.', true);
  const turns = useLogStore.getState().turns;
  assert.equal(turns.length, 1, 'late transcription split an already completed response');
  assert.equal(turns[0].id, originalId);
  assert.equal(turns[0].text, 'Vietnamese culture.');
  assert.equal(turns[0].isFinal, true);
  assert.equal(useLogStore.getState().activeAgentTurnId, null);
});

test('audit: interruption drains its turncomplete before requesting a separate summary', async t => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const f = controllerFixture(t);
  await f.controller.startConversation({ input: 'text' });
  f.events.emit('outputTranscription', 'Old answer', false);
  await f.controller.endConversation();
  f.events.emit('interrupted');
  assert.equal(f.sent.length, 1);
  f.events.emit('turncomplete');
  assert.equal(f.sent.length, 2);
  t.mock.timers.tick(250);
  assert.equal(f.controller.getSnapshot().connectionStatus, 'ending');
  f.events.emit('outputTranscription', 'Summary', true);
  f.events.emit('turncomplete');
  assert.deepEqual(useLogStore.getState().turns.map(turn => turn.text), ['Old answer', 'Summary']);
  t.mock.timers.tick(250);
  assert.equal(f.controller.getSnapshot().connectionStatus, 'idle');
});

test('audit: summary timeout and explicit stop both release pending work', async t => {
  t.mock.timers.enable({ apis: ['setInterval', 'Date'] });
  const f = controllerFixture(t);
  await f.controller.startConversation({ input: 'text' });
  await f.controller.endConversation();
  assert.equal((await f.controller.endConversation()).status, 'busy');
  t.mock.timers.tick(60000);
  assert.equal(f.controller.getSnapshot().connectionStatus, 'idle');
  assert.equal(f.sent.length, 1);
  await f.controller.startConversation({ input: 'text' });
  await f.controller.endConversation();
  f.controller.stopConversation();
  f.events.emit('turncomplete');
  t.mock.timers.tick(60000);
  assert.equal(f.sent.length, 2);
  assert.equal(f.disconnects, 2);
});

test('audit: late input completion cannot make End wait for a nonexistent response', async t => {
  const f = controllerFixture(t);
  await f.controller.startConversation({ input: 'text' });
  f.events.emit('turncomplete');
  f.events.emit('inputTranscription', '', true);
  assert.equal((await f.controller.endConversation()).status, 'ok');
  assert.equal(f.sent.length, 2);
});

test('audit: a completed summary waits for queued playback before disconnecting', async t => {
  t.mock.timers.enable({ apis: ['setInterval'] });
  const f = controllerFixture(t);
  let playing = true;
  Object.defineProperty(f.audio, 'playing', { get: () => playing });
  await f.controller.startConversation({ input: 'text' });
  f.events.emit('turncomplete');
  await f.controller.endConversation();
  f.events.emit('outputTranscription', 'The summary.', true);
  f.events.emit('turncomplete');
  t.mock.timers.tick(250);
  assert.equal(f.controller.getSnapshot().connectionStatus, 'ending');
  playing = false;
  t.mock.timers.tick(250);
  assert.equal(f.controller.getSnapshot().connectionStatus, 'idle');
  assert.equal(f.disconnects, 1);
});

test('audit: stop cancels the result of a pending microphone enable and ignores late events', async t => {
  const f = controllerFixture(t);
  const permission = deferred<void>();
  f.audio.startMicrophone = () => permission.promise;
  await f.controller.startConversation({ input: 'text' });
  const pending = f.controller.setMicrophoneEnabled(true);
  f.controller.stopConversation();
  permission.resolve();
  assert.equal((await pending).status, 'cancelled');
  f.events.emit('outputTranscription', 'Stale text', true);
  f.events.emit('audio', new ArrayBuffer(2));
  assert.equal(f.controller.getSnapshot().connectionStatus, 'idle');
  assert.equal(f.disposed, 1);
  assert.deepEqual(useLogStore.getState().turns, []);
});

test('audit: dispose and reattach do not duplicate listeners under effect replay', async t => {
  const f = controllerFixture(t);
  f.controller.dispose();
  f.controller.attach();
  f.controller.attach();
  f.controller.setActiveView('chat');
  await f.controller.startConversation({ input: 'text' });
  f.events.emit('outputTranscription', 'One copy', true);
  assert.equal(f.events.listenerCount('outputTranscription'), 1);
  assert.equal(useLogStore.getState().turns[0].text, 'One copy');
});

function mockSdk(t: TestContext) {
  const client = new GenAILiveClient('test-key');
  const attempts: { callbacks: LiveCallbacks; ready: ReturnType<typeof deferred<Session>> }[] = [];
  (client as unknown as { client: unknown }).client = { live: { connect: ({ callbacks }: { callbacks: LiveCallbacks }) => {
    const ready = deferred<Session>();
    attempts.push({ callbacks, ready });
    return ready.promise;
  } } };
  t.after(() => client.disconnect());
  function session() {
    let closes = 0;
    return {
      value: { close: () => { closes++; }, sendClientContent() {}, sendRealtimeInput() {} } as unknown as Session,
      get closes() { return closes; },
    };
  }
  return { client, attempts, session };
}

test('audit: callbacks from a replaced connection cannot affect the current connection', async t => {
  const f = mockSdk(t);
  const first = f.client.connect({});
  f.attempts[0].ready.resolve(f.session().value);
  f.attempts[0].callbacks.onmessage(serverMessage({ setupComplete: {} }));
  assert.equal(await first, true);
  f.client.disconnect();
  const second = f.client.connect({});
  f.attempts[1].ready.resolve(f.session().value);
  f.attempts[1].callbacks.onmessage(serverMessage({ setupComplete: {} }));
  assert.equal(await second, true);

  const received: string[] = [];
  f.client.on('outputTranscription', () => received.push('transcript'));
  f.client.on('error', () => received.push('error'));
  f.client.on('close', () => received.push('close'));
  f.attempts[0].callbacks.onmessage(serverMessage({ serverContent: { outputTranscription: { text: 'old' } } }));
  f.attempts[0].callbacks.onerror?.({ message: 'old error' } as ErrorEvent);
  f.attempts[0].callbacks.onclose?.({ reason: 'old close', type: 'close' } as CloseEvent);
  assert.deepEqual(received, []);
  assert.equal(f.client.status, 'connected');
});

test('audit: stopping before SDK resolution releases connect and closes the late session', async t => {
  const f = mockSdk(t);
  const first = f.client.connect({});
  f.client.disconnect();
  assert.equal(await first, false);

  const second = f.client.connect({});
  const current = f.session();
  f.attempts[1].ready.resolve(current.value);
  f.attempts[1].callbacks.onmessage(serverMessage({ setupComplete: {} }));
  assert.equal(await second, true);
  const late = f.session();
  f.attempts[0].ready.resolve(late.value);
  await flush();
  assert.equal(late.closes, 1);
  assert.equal(current.closes, 0);
  assert.equal(f.client.status, 'connected');
});

test('audit: actual SDK serializes prefill as role-preserving clientContent with turnComplete false', async t => {
  const f = mockSdk(t);
  const wire: unknown[] = [];
  const sdkSession = new Session(
    { send: (message: string) => { wire.push(JSON.parse(message)); }, close() {} } as ConstructorParameters<typeof Session>[0],
    { isVertexAI: () => false } as ConstructorParameters<typeof Session>[1],
  );
  const history = buildResumeHistory([
    { role: 'user', text: 'Tell me about Huế', source: 'composer' },
    { role: 'system', text: 'Vocabulary card', source: 'system' },
    { role: 'agent', text: 'Huế has a citadel.', source: 'transcription' },
    { role: 'user', text: 'Hidden resume instruction', source: 'resume' },
  ]);
  assert.throws(() => f.client.prefill(history), /chưa sẵn sàng/);
  const connecting = f.client.connect({});
  assert.throws(() => f.client.prefill(history), /chưa sẵn sàng/);
  f.attempts[0].ready.resolve(sdkSession);
  f.attempts[0].callbacks.onmessage(serverMessage({ setupComplete: {} }));
  assert.equal(await connecting, true);
  f.client.prefill([]);
  assert.deepEqual(wire, []);
  f.client.prefill(history);
  assert.deepEqual(wire, [{ clientContent: {
    turns: [
      { role: 'user', parts: [{ text: 'Tell me about Huế' }] },
      { role: 'model', parts: [{ text: 'Huế has a citadel.' }] },
    ],
    turnComplete: false,
  } }]);
  f.client.send({ text: 'Continue with architecture.' });
  assert.deepEqual(wire[1], { clientContent: {
    turns: [{ role: 'user', parts: [{ text: 'Continue with architecture.' }] }],
    turnComplete: true,
  } });
  assert.equal(wire.length, 2);
});

test('audit: stopped microphone releases a late permission grant before waiting for audio resume', async t => {
  const permission = deferred<MediaStream>();
  const resumed = deferred<void>();
  let stoppedTracks = 0;
  let resumeCalls = 0;
  const descriptors = new Map<string, PropertyDescriptor | undefined>();
  function global(name: string, value: unknown) {
    descriptors.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  }
  class FakeAudioContext {
    state = 'suspended';
    sampleRate = 16000;
    audioWorklet = { addModule: async () => {} };
    async resume() { resumeCalls++; await resumed.promise; this.state = 'running'; }
    async close() { this.state = 'closed'; }
    createMediaStreamSource() { return { connect() {}, disconnect() {} }; }
  }
  class FakeAudioWorkletNode {
    port = { postMessage() {}, onmessage: null };
    disconnect() {}
  }
  global('window', { AudioContext: FakeAudioContext });
  global('navigator', { mediaDevices: { getUserMedia: () => permission.promise } });
  global('AudioWorkletNode', FakeAudioWorkletNode);
  t.mock.method(URL, 'createObjectURL', () => 'blob:audit');
  const audio = new ConversationAudio(() => {});
  const pending = audio.startMicrophone({ sendRealtimeInput() {} });
  t.after(async () => {
    resumed.resolve();
    await pending;
    audio.dispose();
    for (const [name, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  });

  // The user stops while the permission prompt is open, then grants permission.
  audio.dispose();
  permission.resolve({ getTracks: () => [{ stop: () => { stoppedTracks++; } }] } as unknown as MediaStream);
  await flush();
  assert.equal(resumeCalls, 0, 'cancelled permission must not create or resume an input AudioContext');
  assert.equal(stoppedTracks, 1,
    'the cancelled stream stays live until AudioRecorder.start finishes its unbounded resume');
});
