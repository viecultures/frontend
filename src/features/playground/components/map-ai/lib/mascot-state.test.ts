import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveMascotState } from './mascot-state';

const idle = { active: true, speaking: false, busy: false, celebrating: false, sleeping: false };

test('mascot follows playback, never a request, and playback overrides sleep or celebration', () => {
  assert.equal(resolveMascotState({ ...idle, busy: true }), 'idle');
  assert.equal(resolveMascotState({ ...idle, speaking: true, sleeping: true, celebrating: true, busy: true }), 'talking');
  assert.equal(resolveMascotState({ ...idle, speaking: false }), 'idle');
});

test('inactive screens stay idle and waiting or recording cannot look asleep or celebrate', () => {
  assert.equal(resolveMascotState({ ...idle, active: false, speaking: true, sleeping: true }), 'idle');
  assert.equal(resolveMascotState({ ...idle, busy: true, sleeping: true, celebrating: true }), 'idle');
  assert.equal(resolveMascotState({ ...idle, sleeping: true }), 'sleeping');
  assert.equal(resolveMascotState({ ...idle, celebrating: true }), 'celebrating');
});
