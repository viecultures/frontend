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
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseURL}/playground`);
    await page.waitForLoadState('networkidle');
    const hub = page.locator('.sh-hub');
    const settings = page.getByRole('button', { name: 'Practice settings', exact: true });
    await page.getByRole('heading', { name: 'Practice with a video you enjoy', exact: true }).waitFor();
    assert.equal(await page.locator('.sh-workspace').isVisible(), false);
    assert.equal(await page.locator('.sh-source-options').getAttribute('open'), null);
    await page.screenshot({ path: `docs/ai_log/practice-workspace/start-${width}.png` });
    await page.locator('.sh-source-options summary').click();
    await page.getByLabel('Sentence grouping', { exact: true }).selectOption('SENTENCE');
    await page.getByLabel('Sentence grouping', { exact: true }).selectOption('SHADOWING');
    await settings.click();
    const dialog = page.getByRole('dialog', { name: 'Practice settings', exact: true });
    await dialog.waitFor();
    const bounds = await page.locator('.sh-settings-panel').boundingBox();
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
    await page.getByRole('button', { name: 'Dark', exact: true }).click();
    assert.equal(await hub.getAttribute('data-theme'), 'dark');
    await page.getByRole('button', { name: 'Paper', exact: true }).click();
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await page.getByLabel('YouTube video URL', { exact: true }).fill('kXYiU_JCYtU');
    await page.getByRole('button', { name: 'Open video', exact: true }).click();
    await page.getByRole('button', { name: 'Start practice', exact: true }).waitFor();
    await page.waitForFunction(() => ![...document.querySelectorAll('button')].find(b => b.textContent.includes('Start practice'))?.disabled);
    await page.getByRole('button', { name: 'Start practice', exact: true }).click();
    await page.getByRole('region', { name: 'Shadowing practice', exact: true }).waitFor();
    assert.equal(await page.getByRole('form').count(), 0);
    await settings.click();
    await page.getByLabel('Listening speed', { exact: true }).selectOption('0.75');
    await page.getByLabel('Repeat sample sentence', { exact: true }).check();
    await page.getByLabel('Pause after each sentence', { exact: true }).uncheck();
    await page.screenshot({ path: `docs/ai_log/practice-workspace/settings-${width}.png` });
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => window.__shPlayer.rate), .75);
    if (width <= 1000) {
      await page.getByRole('button', { name: 'Collapse video', exact: true }).click();
      assert.equal(await page.locator('.sh-video').isVisible(), false);
      await page.getByRole('button', { name: 'Show video', exact: true }).click();
      assert.equal(await page.locator('.sh-video').isVisible(), true);
    }
    await page.getByRole('tab', { name: 'Dictation', exact: true }).click();
    await page.getByLabel('Your dictation', { exact: true }).fill('This is original practice sentence number 1.');
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await page.getByText('Word match: 100%', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Hint', exact: true }).click();
    await page.getByText('Word hint', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Answer', exact: true }).click();
    await page.getByText('Original sentence', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Next sentence', exact: true }).click();
    assert.equal(await page.getByLabel('Your dictation', { exact: true }).inputValue(), '');
    assert.equal(await page.getByRole('button', { name: 'Answer', exact: true }).getAttribute('aria-pressed'), 'false');
    assert.equal(await page.locator('.sh-dictation-result').count(), 0);
    await page.getByLabel('Your dictation', { exact: true }).fill('This is practice');
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await page.locator('.sh-diff-missing').first().waitFor();
    assert.match(await page.locator('.sh-diff').innerText(), /Missing:/);
    await page.locator('summary').filter({ hasText: 'Browse transcript' }).click();
    await page.getByLabel('Search dictation sentences', { exact: true }).fill('no sentence matches this query');
    await page.getByText('No matching sentences.', { exact: true }).waitFor();
    await page.getByLabel('Search dictation sentences', { exact: true }).fill('number 4');
    await page.locator('.sh-sentence-list .sh-sentence').click();
    assert.match(await page.locator('.sh-step-caption').innerText(), /Sentence 4 of 6/);
    await page.getByLabel('Search dictation sentences', { exact: true }).fill('');
    await page.locator('summary').filter({ hasText: 'Browse transcript' }).click();
    await page.getByLabel('Your dictation', { exact: true }).fill('This is original practice sentence number 4.');
    await page.getByRole('button', { name: 'Check answer', exact: true }).click();
    await page.getByText('Word match: 100%', { exact: true }).waitFor();
    await settings.click();
    await page.getByRole('button', { name: 'Dark', exact: true }).click();
    await page.keyboard.press('Escape');
    await page.getByLabel('Your dictation', { exact: true }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `docs/ai_log/practice-workspace/dictation-dark-${width}.png` });
    await settings.click();
    await page.getByRole('button', { name: 'Paper', exact: true }).click();
    await page.keyboard.press('Escape');
    await page.screenshot({ path: `docs/ai_log/practice-workspace/dictation-${width}.png` });

    await page.getByRole('tab', { name: 'Shadowing', exact: true }).click();
    await settings.click();
    await page.getByRole('button', { name: 'Change video', exact: true }).click();
    await page.getByRole('dialog', { name: 'Open a video', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('region', { name: 'Shadowing practice', exact: true }).waitFor();
    await settings.click();
    await page.getByRole('button', { name: 'Edit transcript and parts', exact: true }).click();
    await page.getByRole('heading', { name: 'Biên tập trước khi luyện', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Hủy thay đổi', exact: true }).click();
    await page.getByRole('button', { name: 'Record sentence', exact: true }).scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await page.locator('.sh-content').evaluate(el => el.scrollWidth > el.clientWidth), false);
    if (width <= 1000) assert.equal(await page.locator('.sh-content').evaluate(el => el.scrollHeight > el.clientHeight + 1), false, 'Mobile card must contain its full practice panel');
    const workspace = await page.locator('.sh-content').boundingBox();
    assert.ok(workspace.x >= 0 && workspace.x + workspace.width <= width);
    await page.screenshot({ path: `docs/ai_log/practice-workspace/ready-${width}.png` });
    console.log(`${width}px: start/settings/source/prepare/practice, media collapse, modes, editor and bounds PASS`);
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(uploads, []);
} finally { await browser.close(); }
