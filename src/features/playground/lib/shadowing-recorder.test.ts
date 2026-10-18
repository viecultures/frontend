import test from 'node:test';
import assert from 'node:assert/strict';
import { SentenceRecorder } from './shadowing-recorder';
import type { CapturedAudio, RecorderPhase } from './shadowing-recorder';

class FakeRecorder {
  state = 'inactive'; mimeType = 'audio/mp4';
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  start() { this.state = 'recording'; }
  stop() { this.state = 'inactive'; }
  flush() { this.ondataavailable?.({ data: new Blob(['final'], { type: this.mimeType }) }); this.onstop?.(); }
}
function fixture(getStream?: () => Promise<MediaStream>) {
  const phases: RecorderPhase[] = [], errors: string[] = [], commits: CapturedAudio[] = [];
  let stopped = 0, time = 0;
  const track = { onended: null, stop: () => { stopped++; } };
  const stream = { getTracks: () => [track] } as unknown as MediaStream;
  const fake = new FakeRecorder();
  const controller = new SentenceRecorder({ phase: phase => phases.push(phase), error: error => errors.push(error) }, {
    getStream: getStream ?? (() => Promise.resolve(stream)), createRecorder: () => fake as unknown as MediaRecorder, supports: mime => mime === 'audio/mp4', now: () => time,
  });
  return { controller, fake, stream, phases, errors, commits, stopped: () => stopped, setTime: (value: number) => { time = value; } };
}
test('commit waits for final chunk, uses actual MIME and stops microphone', async () => {
  const f = fixture(); await f.controller.start(async () => 62.1, audio => f.commits.push(audio), 10000);
  f.setTime(1700); f.controller.stop(); assert.equal(f.commits.length, 0); assert.equal(f.phases.at(-1), 'stopping');
  f.fake.flush(); assert.equal(f.commits.length, 1); assert.equal(f.commits[0].blob.type, 'audio/mp4');
  assert.equal(f.commits[0].duration, 1.7); assert.equal(f.commits[0].timelineStart, 62.1); assert.equal(f.stopped(), 1);
});
test('cancel while permission is pending stops late stream without committing', async () => {
  let resolve!: (stream: MediaStream) => void;
  const f = fixture(() => new Promise(done => { resolve = done; }));
  const pending = f.controller.start(async () => 0, audio => f.commits.push(audio), 10000);
  f.controller.cancel(); resolve(f.stream); await pending;
  assert.equal(f.stopped(), 1); assert.equal(f.commits.length, 0); assert.equal(f.phases.at(-1), 'idle');
});
test('cancelled generation ignores delayed final chunk and does not erase an earlier take', async () => {
  const f = fixture(); await f.controller.start(async () => 0, audio => f.commits.push(audio), 10000);
  const delayedStop = f.fake.onstop, delayedChunk = f.fake.ondataavailable;
  f.controller.cancel(); delayedChunk?.({ data: new Blob(['late']) }); delayedStop?.();
  assert.equal(f.commits.length, 0); assert.equal(f.stopped(), 1);
});
test('memory overrun cancels pending take and frees microphone', async () => {
  const f = fixture(); await f.controller.start(async () => 0, audio => f.commits.push(audio), 2);
  f.fake.ondataavailable?.({ data: new Blob(['oversized']) });
  assert.equal(f.commits.length, 0); assert.equal(f.errors.length, 1); assert.equal(f.stopped(), 1); assert.equal(f.phases.at(-1), 'idle');
});
test('prepare failure and recorder error both release stream', async () => {
  const f = fixture(); await f.controller.start(async () => { throw new Error('buffering'); }, audio => f.commits.push(audio), 10000);
  assert.equal(f.stopped(), 1); assert.match(f.errors[0], /buffering/);
  const g = fixture(); await g.controller.start(async () => 0, audio => g.commits.push(audio), 10000);
  g.fake.onerror?.(); assert.equal(g.stopped(), 1); assert.equal(g.commits.length, 0);
});
