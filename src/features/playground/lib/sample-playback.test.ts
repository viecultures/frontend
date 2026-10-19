import test from 'node:test';
import assert from 'node:assert/strict';
import { SamplePlayback } from './sample-playback';
import type { SampleOptions } from './sample-playback';
import type { ShadowingPlayer } from '../types/shadowing';

function fixture() {
  let now = 0;
  const options: SampleOptions = { rate: 1, loop: false, autoPause: true };
  const commands: { name: string; time: number }[] = [];
  const player = {
    time: 59.125, state: 2, rate: 1,
    getCurrentTime() { return this.time; }, getPlayerState() { return this.state; },
    pauseVideo() { commands.push({ name: 'pause', time: this.time }); },
    playVideo() { commands.push({ name: 'play', time: this.time }); },
    seekTo(time: number) { commands.push({ name: 'seek', time }); },
    setPlaybackRate(rate: number) { this.rate = rate; }, unMute() {},
  };
  let current: ShadowingPlayer | null = player as unknown as ShadowingPlayer;
  const playback = new SamplePlayback(() => current, () => options, () => now);
  return { player, playback, options, commands,
    setNow(value: number) { now = value; },
    replacePlayer(value: ShadowingPlayer | null) { current = value; },
    pauses: () => commands.filter(command => command.name === 'pause').length,
  };
}

test('sentence 21: cached time near its end cannot acknowledge a pending seek', () => {
  const f = fixture();
  f.playback.play(58.183, 59.142);
  f.player.state = 1; // Playing state arrives before the new SDK time.
  f.playback.tick();
  assert.equal(f.pauses(), 1); // Only the explicit pause BEFORE seeking.
  f.player.time = 58.183; f.playback.tick();
  f.player.time = 59.130; f.playback.tick();
  assert.equal(f.pauses(), 1);
  f.player.time = 59.142; f.playback.tick();
  assert.equal(f.pauses(), 2);
});

test('a cached middle-of-sentence time is not accepted as arrival at its start', () => {
  const f = fixture(); f.player.time = 58.9; f.player.state = 1;
  f.playback.play(58.183, 59.142); f.playback.tick();
  f.player.time = 59.16; f.playback.tick();
  assert.equal(f.pauses(), 1);
  f.player.time = 58.19; f.playback.tick();
  f.player.time = 59.15; f.playback.tick();
  assert.equal(f.pauses(), 2);
});

test('replacing sentence 20 with 21 discards the old end boundary', () => {
  const f = fixture(); f.player.time = 54.846; f.player.state = 1;
  f.playback.play(54.846, 58.1); f.playback.tick();
  f.playback.play(58.183, 59.142);
  f.player.time = 58.1; f.playback.tick();
  assert.equal(f.pauses(), 2);
  f.player.time = 58.183; f.playback.tick();
  f.player.time = 58.9; f.playback.tick();
  assert.equal(f.pauses(), 2);
  f.player.time = 59.142; f.playback.tick();
  assert.equal(f.pauses(), 3);
});

test('loop waits for a fresh start after every seek instead of seeking repeatedly at the cached end', () => {
  const f = fixture(); f.options.loop = true;
  f.player.time = 58.183; f.player.state = 1;
  f.playback.play(58.183, 59.142); f.playback.tick();
  f.player.time = 59.15; f.playback.tick();
  for (let i = 0; i < 10; i++) f.playback.tick();
  assert.equal(f.commands.filter(command => command.name === 'seek').length, 2);
  f.player.time = 58.183; f.playback.tick();
  f.player.time = 59.15; f.playback.tick();
  assert.equal(f.commands.filter(command => command.name === 'seek').length, 3);
});

test('buffering and paused clocks cannot trigger auto-pause or a loop', () => {
  const f = fixture(); f.player.time = 58.183; f.player.state = 1;
  f.playback.play(58.183, 59.142); f.playback.tick();
  for (const state of [3, 2]) {
    f.player.state = state; f.player.time = 59.2; f.playback.tick();
    assert.equal(f.pauses(), 1);
  }
  f.player.state = 1; f.player.time = 58.8; f.playback.tick();
  f.player.time = 59.142; f.playback.tick();
  assert.equal(f.pauses(), 2);
});

test('seek arrival may be reported while buffering before PLAYING arrives later in a short sentence', () => {
  const f = fixture(); f.playback.play(58.183, 59.142);
  f.player.time = 58.183; f.player.state = 3; f.playback.tick();
  f.player.time = 58.855; f.player.state = 1; f.playback.tick();
  assert.equal(f.pauses(), 1);
  f.player.time = 59.15; f.playback.tick();
  assert.equal(f.pauses(), 2);
});

test('auto-pause follows the media clock at every supported speed, including a speed change', () => {
  for (const rate of [0.75, 1, 1.25]) {
    const f = fixture(); f.options.rate = rate; f.player.time = 58.183; f.player.state = 1;
    f.playback.play(58.183, 59.142); f.playback.tick();
    assert.equal(f.player.rate, rate);
    f.setNow(5000); f.player.time = 58.5; f.playback.tick();
    assert.equal(f.pauses(), 1);
    f.player.rate = 1.25; f.player.time = 59.141; f.playback.tick();
    assert.equal(f.pauses(), 1);
    f.player.time = 59.143; f.playback.tick();
    assert.equal(f.pauses(), 2);
  }
});

test('stop and cleanup cannot pause another playback owner or a replacement player', () => {
  const f = fixture(); f.playback.stop(); assert.equal(f.pauses(), 0);
  f.playback.play(58.183, 59.142); f.playback.stop();
  const count = f.pauses(); f.playback.stop(); f.playback.tick(); assert.equal(f.pauses(), count);
  f.playback.play(58.183, 59.142); f.replacePlayer(null); f.playback.stop();
  assert.equal(f.pauses(), count + 1); // The last play() paused before its seek.
});

test('unconfirmed seek expires; auto-pause off releases ownership without pausing', () => {
  const f = fixture(); f.playback.play(58.183, 59.142);
  f.setNow(15001); f.playback.tick(); assert.equal(f.pauses(), 2);
  const g = fixture(); g.options.autoPause = false; g.player.time = 58.183; g.player.state = 1;
  g.playback.play(58.183, 59.142); g.playback.tick();
  g.player.time = 59.142; g.playback.tick(); g.playback.stop();
  assert.equal(g.pauses(), 1);
});

test('invalid boundaries never send player commands', () => {
  const f = fixture();
  for (const [start, end] of [[NaN, 59], [58, Infinity], [-1, 2], [58, 58], [59, 58]]) f.playback.play(start, end);
  assert.deepEqual(f.commands, []);
});
