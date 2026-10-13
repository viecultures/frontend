// Run against Vite: MAP_AI_BASE_URL=http://127.0.0.1:5173 node scripts/test-map-ai-runtime.mjs
// Optional PLAYWRIGHT_MODULE / PLAYWRIGHT_EXECUTABLE_PATH use an existing local installation.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, permissions: ['microphone'] });
page.setDefaultTimeout(15000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const baseUrl = process.env.MAP_AI_BASE_URL || 'http://127.0.0.1:5173';
await page.route('**/*', route => new URL(route.request().url()).origin === new URL(baseUrl).origin ? route.continue() : route.abort());
await page.addInitScript(() => {
  if (window !== window.top) return;
  localStorage.setItem('custom_gemini_api_key', 'browser-test-not-a-real-key');
  window.runtimeTest = { contexts: [], streams: [], calls: [], sessions: [] };
  const NativeContext = window.AudioContext;
  window.AudioContext = class extends NativeContext {
    constructor(options) {
      super(options);
      window.runtimeTest.contexts.push(this);
      window.runtimeTest.calls.push({ type: 'context', gesture: navigator.userActivation.isActive });
    }
    resume() { window.runtimeTest.calls.push({ type: 'resume', gesture: navigator.userActivation.isActive }); return super.resume(); }
  };
  const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = async options => {
    const stream = await getUserMedia(options);
    window.runtimeTest.streams.push(stream);
    return stream;
  };
});
try {
  await page.goto(`${baseUrl}/playground`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    const { GenAILiveClient } = await import('/src/features/playground/components/map-ai/lib/genai-live-client.ts');
    const connect = GenAILiveClient.prototype.connect;
    GenAILiveClient.prototype.connect = function(config) {
      this.client = { live: { connect: async ({ callbacks }) => {
        const session = { callbacks, closed: false, messages: [], config };
        window.runtimeTest.sessions.push(session);
        window.runtimeTest.calls.push({ type: 'setup' });
        setTimeout(() => callbacks.onmessage({ setupComplete: {} }), 20);
        return {
          close() { session.closed = true; },
          sendClientContent(message) { session.messages.push(message); },
          sendRealtimeInput() {}, sendToolResponse() {},
        };
      } } };
      return connect.call(this, config);
    };
  });
  console.log('Rendered controls:', await page.locator('button').allTextContents());
  await page.keyboard.press('2');
  const play = page.getByRole('button', { name: 'Bắt đầu đàm thoại', exact: true });
  await play.waitFor();
  await page.waitForTimeout(700);
  await play.click();
  await page.waitForFunction(() => window.runtimeTest.streams.length === 1 && window.runtimeTest.contexts.length === 2);
  await page.getByTitle('Tắt microphone', { exact: true }).waitFor();
  const first = await page.evaluate(() => ({ calls: window.runtimeTest.calls, messages: window.runtimeTest.sessions[0].messages }));
  assert.equal(first.calls[0].type, 'context');
  assert.equal(first.calls[0].gesture, true);
  assert.ok(first.calls.findIndex(call => call.type === 'setup') > 0);
  assert.equal(first.messages.length, 1);
  await page.evaluate(() => window.runtimeTest.sessions[0].callbacks.onmessage({ serverContent: {
    outputTranscription: { text: 'Discover the cultural heritage of Huế.', finished: true }, turnComplete: true,
    modelTurn: { parts: [{ inlineData: { mimeType: 'audio/pcm;rate=24000', data: btoa('\0'.repeat(4800)) } }] },
  } }));
  await page.getByText('Discover the cultural heritage of Huế.', { exact: true }).waitFor();
  await page.keyboard.press('3');
  await page.waitForFunction(() => window.runtimeTest.sessions[0].closed && window.runtimeTest.contexts.every(context => context.state === 'closed') && window.runtimeTest.streams.every(stream => stream.getTracks().every(track => track.readyState === 'ended')));
  await page.waitForTimeout(700);
  assert.equal(await page.evaluate(() => window.runtimeTest.sessions.length), 1);
  await page.keyboard.press('2');
  const resume = page.getByRole('button', { name: 'Tiếp tục đàm thoại', exact: true });
  await resume.waitFor();
  await page.waitForTimeout(700);
  await resume.click();
  await page.waitForFunction(() => window.runtimeTest.sessions.length === 2 && window.runtimeTest.sessions[1].messages.length === 2);
  const second = await page.evaluate(() => ({ config: window.runtimeTest.sessions[1].config, messages: window.runtimeTest.sessions[1].messages }));
  assert.equal(second.messages[0].turnComplete, false);
  assert.equal(second.messages[0].turns[0].role, 'model');
  assert.equal(second.messages[1].turnComplete, true);
  assert.ok(!JSON.stringify(second.config).includes('Discover the cultural heritage'));
  assert.ok(!Object.hasOwn(second.config, 'history'));
  await page.getByRole('button', { name: 'Dừng đàm thoại', exact: true }).click();
  await page.waitForFunction(() => window.runtimeTest.sessions[1].closed && window.runtimeTest.contexts.every(context => context.state === 'closed'));
  for (const path of ['/', '/discovery']) {
    await page.goto(new URL(path, baseUrl).href);
    await page.waitForLoadState('networkidle');
    const provinces = page.locator('#layer-provinces path');
    await provinces.first().waitFor();
    assert.equal(await provinces.count(), 34);
    await provinces.first().dispatchEvent('click');
    await page.waitForFunction(() => document.querySelector('#layer-provinces path')?.getAttribute('stroke-width') === '2.5px');
    console.log(`PASS: ${path} map renders 34 provinces and selects a province (DOM click smoke).`);
  }
  assert.deepEqual(errors, []);
  console.log('PASS: real WebAudio gesture ordering, native fake-device recorder/worklets, screen-change cleanup, no auto-reconnect, role-preserving resume wire protocol, stop cleanup. SDK network only is mocked.');
} catch (error) {
  console.error('Runtime diagnostic:', await page.evaluate(() => ({
    calls: window.runtimeTest?.calls,
    contexts: window.runtimeTest?.contexts.map(context => context.state),
    streams: window.runtimeTest?.streams.map(stream => stream.getTracks().map(track => track.readyState)),
    sessions: window.runtimeTest?.sessions.map(session => ({ closed: session.closed, messages: session.messages.length })),
    alerts: [...document.querySelectorAll('[role="alert"]')].map(element => element.textContent),
    buttons: [...document.querySelectorAll('button')].map(element => element.title || element.getAttribute('aria-label') || element.textContent),
  })));
  throw error;
} finally { await browser.close(); }
