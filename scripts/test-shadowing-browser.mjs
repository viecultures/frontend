// Run against Vite. BE/YouTube are deterministic fixtures; microphone capture and
// MediaRecorder/Blob decoding are real Chromium APIs using a synthetic device.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.SHADOWING_PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.SHADOWING_TEST_URL || 'http://127.0.0.1:5186';
await mkdir('docs/ai_log', { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.SHADOWING_CHROMIUM_EXECUTABLE || undefined, args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['microphone'] });
const page = await context.newPage();
const errors = [], uploads = [];
let failBackend = false;
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (/shadowing\/evaluate|recordings|upload/.test(request.url()) && request.method() === 'POST') uploads.push(request.url()); });
await page.route('http://localhost:8080/**', async route => {
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
  await page.waitForLoadState('networkidle');
  await page.getByLabel('Link video YouTube', { exact: true }).fill('https://www.youtube.com/watch?v=kXYiU_JCYtU');
  await page.getByRole('button', { name: 'Lấy transcript từ BE', exact: true }).click();
  await page.getByRole('heading', { name: 'Biên tập trước khi luyện' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Lấy transcript từ BE', exact: true }).isDisabled(), true);
  await page.getByLabel('Nội dung câu 1', { exact: true }).fill('An edited sentence for the first part.');
  await page.getByLabel('Bắt đầu câu 1', { exact: true }).fill('2.1');
  await page.getByLabel('Bắt đầu phần mới tại câu 3', { exact: true }).check();
  await page.getByLabel('Tên phần tại câu 3', { exact: true }).fill('Second topic');
  await page.getByLabel('Bắt đầu phần mới tại câu 5', { exact: true }).check();
  await page.getByLabel('Tên phần tại câu 5', { exact: true }).fill('Third topic');
  await page.getByRole('button', { name: 'Áp dụng và luyện', exact: true }).click();
  await page.getByRole('heading', { name: 'Lồng tiếng từng câu' }).waitFor();
  const navigation = page.getByRole('navigation', { name: 'Các phần luyện' });
  assert.equal(await navigation.getByRole('button').count(), 3);
  assert.match(await page.getByRole('region', { name: 'Luyện shadowing' }).innerText(), /0\/6 câu/);

  async function record() {
    await page.getByRole('button', { name: /^(Thu câu này|Thu lại câu này)$/ }).click();
    await page.getByRole('button', { name: /Dừng thu ·/ }).waitFor();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /Dừng thu ·/ }).click();
    await page.getByLabel('Bản thu câu đang chọn', { exact: true }).waitFor();
  }
  await record();
  assert.match(await navigation.getByRole('button').nth(0).innerText(), /1\/2 câu/);
  await navigation.getByRole('button').nth(1).click();
  await record();
  assert.match(await navigation.getByRole('button').nth(1).innerText(), /1\/2 câu/);
  await navigation.getByRole('button').nth(0).click();
  await page.getByLabel('Bản thu câu đang chọn', { exact: true }).waitFor();
  assert.match(await page.getByRole('region', { name: 'Luyện shadowing' }).innerText(), /2\/6 câu/);

  failBackend = true;
  await page.getByRole('button', { name: 'Lấy transcript từ BE', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'HTTP 503' }).waitFor();
  assert.match(await page.getByRole('region', { name: 'Luyện shadowing' }).innerText(), /2\/6 câu/);
  failBackend = false;

  // Leaving this mounted screen must cancel the pending take and close the mic.
  await page.getByRole('button', { name: 'Thu lại câu này', exact: true }).click();
  await page.getByRole('button', { name: /Dừng thu ·/ }).waitFor();
  await page.locator('#screen-vietnam-map-ai').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => window.__shStreams.every(stream => stream.getTracks().every(track => track.readyState === 'ended')));
  await page.locator('#screen-dictation-shadowing').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Thu lại câu này', exact: true }).waitFor();
  assert.match(await page.getByRole('region', { name: 'Luyện shadowing' }).innerText(), /2\/6 câu/);

  // Retry failure must preserve the previous committed Blob and progress.
  await page.evaluate(() => { window.__shGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices); navigator.mediaDevices.getUserMedia = () => Promise.reject(new DOMException('Microphone denied', 'NotAllowedError')); });
  await page.getByRole('button', { name: 'Thu lại câu này', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Chưa được cấp quyền microphone' }).waitFor();
  assert.match(await navigation.getByRole('button').nth(0).innerText(), /1\/2 câu/);
  await page.evaluate(() => { navigator.mediaDevices.getUserMedia = window.__shGetUserMedia; });

  // Section replay must stop at its end and restore source volume.
  await page.getByRole('button', { name: 'Nghe lại phần này', exact: true }).click();
  await page.waitForFunction(() => window.__shPlayer.state === 1 && window.__shPlayer.volume === 20);
  await page.waitForTimeout(100);
  await page.evaluate(() => window.__shPlayer.seekTo(61.85));
  await page.getByRole('button', { name: 'Về luyện câu', exact: true }).waitFor({ state: 'hidden' });
  assert.equal(await page.evaluate(() => window.__shPlayer.state), 2);
  assert.equal(await page.evaluate(() => window.__shPlayer.volume), 100);

  // Full replay crosses section boundaries; seek into the middle of a valid take.
  await page.getByRole('button', { name: 'Phát lại toàn video', exact: true }).click();
  await page.waitForTimeout(150);
  await page.evaluate(() => window.__shPlayer.seekTo(62.15));
  await page.waitForFunction(() => window.__shAudios.some(audio => !audio.paused));
  await page.getByRole('button', { name: 'Dừng / tiếp tục', exact: true }).click();
  await page.waitForFunction(() => window.__shAudios.every(audio => audio.paused));
  await page.getByRole('button', { name: 'Dừng / tiếp tục', exact: true }).click();
  await page.waitForFunction(() => window.__shPlayer.state === 1);
  await page.getByRole('button', { name: 'Về luyện câu', exact: true }).click();

  // Edit one sentence's timing. Other section keeps its valid take.
  await page.getByRole('button', { name: 'Biên tập', exact: true }).click();
  await page.getByLabel('Kết thúc câu 1', { exact: true }).fill('4.2');
  await page.getByRole('button', { name: 'Áp dụng và luyện', exact: true }).click();
  await page.getByText('Timing đã đổi. Cần thu lại câu này trước khi nghe toàn bài.', { exact: true }).waitFor();
  assert.match(await navigation.getByRole('button').nth(1).innerText(), /1\/2 câu/);
  await record();
  assert.match(await page.getByRole('region', { name: 'Luyện shadowing' }).innerText(), /2\/6 câu/);
  const liveURLs = await page.evaluate(() => window.__shURLs.size);
  assert.ok(liveURLs <= 1, `Leaked audio object URLs: ${liveURLs}`);

  // A fresh BE candidate is a draft, not an overwrite of existing recordings.
  await page.getByRole('button', { name: 'Lấy transcript từ BE', exact: true }).click();
  await page.getByRole('heading', { name: 'Biên tập trước khi luyện' }).waitFor();
  await page.getByRole('button', { name: 'Hủy thay đổi', exact: true }).click();
  assert.match(await page.getByRole('region', { name: 'Luyện shadowing' }).innerText(), /2\/6 câu/);

  await page.getByRole('tab', { name: 'Dictation', exact: true }).click();
  await page.getByLabel('Bài chép chính tả', { exact: true }).fill('An edited sentence for the first part.');
  await page.getByRole('button', { name: 'Kiểm tra', exact: true }).click();
  await page.getByText('Độ khớp từ: 100%', { exact: true }).waitFor();
  await page.getByRole('tab', { name: 'Shadowing', exact: true }).click();
  assert.match(await page.getByRole('region', { name: 'Luyện shadowing' }).innerText(), /2\/6 câu/);
  await page.screenshot({ path: 'docs/ai_log/shadowing-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'docs/ai_log/shadowing-mobile.png', fullPage: true });
  const videoBox = await page.locator('.sh-video').boundingBox();
  assert.ok(videoBox && videoBox.x + videoBox.width <= 390, `Mobile video is clipped: ${JSON.stringify(videoBox)}`);
  await page.getByRole('button', { name: 'Thu lại câu này', exact: true }).scrollIntoViewIfNeeded();
  const practiceBox = await page.locator('.sh-content').boundingBox();
  assert.ok(practiceBox && practiceBox.x + practiceBox.width <= 390, `Mobile practice is clipped: ${JSON.stringify(practiceBox)}`);
  await page.screenshot({ path: 'docs/ai_log/shadowing-mobile-practice.png', fullPage: true });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  assert.deepEqual(uploads, []);
  assert.deepEqual(errors, []);
  await page.getByRole('button', { name: 'Về Phòng Học', exact: true }).click();
  await page.waitForFunction(() => window.__shURLs.size === 0);
  console.log('PASS: BE editor, 3 parts, real microphone/Blob capture, RAM across parts, retry/BE failure, scoped replay, pause/resume, timing invalidation, screen cleanup, Dictation, responsive layout, no uploads.');
} catch (error) {
  await page.screenshot({ path: 'docs/ai_log/shadowing-failure.png', fullPage: true });
  console.error('Page errors:', errors);
  console.error((await page.locator('.sh-hub').innerText({ timeout: 1000 }).catch(() => page.locator('body').innerText({ timeout: 1000 }).catch(() => 'Page unavailable'))).slice(0, 8000));
  throw error;
} finally { await browser.close(); }
