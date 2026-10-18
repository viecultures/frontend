// Run against Vite. BE/YouTube are deterministic fixtures; microphone capture and
// MediaRecorder/Blob decoding are real Chromium APIs using a synthetic device.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.SHADOWING_PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.SHADOWING_TEST_URL || 'http://127.0.0.1:5186';
await mkdir('docs/ai_log/practice-workspace', { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.SHADOWING_CHROMIUM_EXECUTABLE || undefined, args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['microphone'] });
const page = await context.newPage();
const errors = [], uploads = [];
let failBackend = false;
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (/shadowing\/evaluate|recordings|upload/.test(request.url()) && request.method() === 'POST') uploads.push(request.url()); });
await page.route('**/api/**', async route => {
  if (!route.request().url().includes('/ytb-transcript')) return route.fulfill({ status: 404, body: '{}' });
  if (failBackend) return route.fulfill({ status: 503, body: 'Transcript unavailable' });
  const starts = [2, 5, 62, 65, 122, 125];
  return route.fulfill({ contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ success: true, data: {
    videoId: 'kXYiU_JCYtU', title: 'Three minute browser fixture', author: 'Test', languageCode: 'en', languageName: 'English', isGenerated: false, reliabilityLevel: 1,
    snippets: starts.map((start, i) => ({ text: `This is original practice sentence number ${i + 1}.`, start, duration: 2 })),
  } }) });
});
await page.addInitScript(() => {
  const originalCreate = URL.createObjectURL, originalRevoke = URL.revokeObjectURL;
  window.__shURLs = new Set(); window.__shAudios = [];
  URL.createObjectURL = function(blob) { const url = originalCreate.call(URL, blob); if (blob.type.startsWith('audio/')) window.__shURLs.add(url); return url; };
  URL.revokeObjectURL = function(url) { window.__shURLs.delete(url); return originalRevoke.call(URL, url); };
  const NativeAudio = window.Audio;
  window.__shStreams = [];
  const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = async (...args) => { const stream = await getUserMedia(...args); window.__shStreams.push(stream); return stream; };
  window.Audio = function(...args) { const audio = new NativeAudio(...args); window.__shAudios.push(audio); return audio; };
  window.Audio.prototype = NativeAudio.prototype;
  window.YT = { Player: class {
    anchor = 0; started = performance.now(); state = 2; volume = 100; rate = 1; muted = false;
    constructor(element, options) {
      this.events = options.events; window.__shPlayer = this;
      element.textContent = 'YouTube player fixture · 03:00'; element.style.cssText = 'height:100%;display:grid;place-items:center;color:#f6d888;font:18px Georgia';
      queueMicrotask(() => this.events.onReady({ target: this }));
    }
    getCurrentTime() { return this.anchor + (this.state === 1 ? (performance.now() - this.started) / 1000 * this.rate : 0); }
    getDuration() { return 180; }
    getPlayerState() { return this.state; }
    getPlaybackRate() { return this.rate; }
    getVolume() { return this.volume; }
    isMuted() { return this.muted; }
    seekTo(time) { this.anchor = time; this.started = performance.now(); }
    playVideo() { if (this.state !== 1) { this.started = performance.now(); this.state = 1; this.events.onStateChange({ target: this, data: 1 }); } }
    pauseVideo() { this.anchor = this.getCurrentTime(); this.state = 2; this.events.onStateChange({ target: this, data: 2 }); }
    setPlaybackRate(rate) { this.anchor = this.getCurrentTime(); this.started = performance.now(); this.rate = rate; }
    setVolume(volume) { this.volume = volume; }
    mute() { this.muted = true; }
    unMute() { this.muted = false; }
    destroy() { this.state = -1; }
  } };
});

try {
  await page.goto(`${baseURL}/playground`);
  await page.getByLabel('YouTube video URL',{exact:true}).fill('kXYiU_JCYtU');
  await page.getByRole('button',{name:'Open video',exact:true}).click();
  await page.getByRole('button',{name:'Start practice',exact:true}).click();
  await page.getByRole('button',{name:'Listen',exact:true}).waitFor();
  await page.evaluate(()=>window.__shPlayer.events.onError({target:window.__shPlayer,data:150}));
  await page.getByRole('alert').waitFor();
  assert.equal(await page.getByRole('button',{name:'Listen',exact:true}).isDisabled(),true,'YouTube failure must disable practice playback');
  assert.equal(await page.getByRole('button',{name:'Record sentence',exact:true}).isDisabled(),true);
  await page.evaluate(()=>{window.__shPlayer.state=1;window.__shPlayer.events.onStateChange({target:window.__shPlayer,data:1});});
  await page.getByRole('alert').waitFor({state:'hidden'});
  assert.equal(await page.getByRole('button',{name:'Listen',exact:true}).isEnabled(),true);
  await page.evaluate(()=>window.__shPlayer.events.onAutoplayBlocked());
  await page.getByRole('alert').waitFor();
  assert.equal(await page.getByRole('button',{name:'Listen',exact:true}).isDisabled(),true);
  await page.evaluate(()=>{window.__shPlayer.state=1;window.__shPlayer.events.onStateChange({target:window.__shPlayer,data:1});});
  await page.getByRole('alert').waitFor({state:'hidden'});
  assert.equal(await page.getByRole('button',{name:'Listen',exact:true}).isEnabled(),true);
  await page.getByRole('button',{name:'Practice settings',exact:true}).click();
  await page.getByRole('button',{name:'Edit transcript and parts',exact:true}).click();
  await page.getByRole('button',{name:'Hủy thay đổi',exact:true}).click();
  assert.equal(await page.getByRole('button',{name:'Listen',exact:true}).isEnabled(),true);
  assert.deepEqual(errors,[]);
  console.log('PASS: player errors disable practice; manual playback clears error and restores practice without reload.');
} finally {await browser.close();}
