import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resumeAudioOutput } from './utils';

test('resume begins synchronously, before the caller yields to a network request', async () => {
  let called = false;
  let ready!: () => void;
  const context = {
    state: 'suspended',
    resume() { called = true; return new Promise<void>(resolve => { ready = () => { context.state = 'running'; resolve(); }; }); },
  };
  const pending = resumeAudioOutput(context as unknown as AudioContext);
  assert.equal(called, true);
  ready();
  await pending;
});

test('running output does not resume again', async () => {
  await resumeAudioOutput({ state: 'running', resume() { throw new Error('unexpected resume'); } } as unknown as AudioContext);
});

test('autoplay rejection reaches the caller for retry', async () => {
  await assert.rejects(resumeAudioOutput({ state: 'suspended', resume: () => Promise.reject(new Error('NotAllowedError')) } as unknown as AudioContext), /NotAllowedError/);
});

test('blocked resume times out instead of hanging connection indefinitely', async () => {
  await assert.rejects(resumeAudioOutput({ state: 'suspended', resume: () => new Promise<void>(() => {}) } as unknown as AudioContext, 10), /Không thể mở âm thanh/);
});

test('closed output fails clearly', async () => {
  await assert.rejects(resumeAudioOutput({ state: 'closed' } as AudioContext), /đã đóng/);
});
