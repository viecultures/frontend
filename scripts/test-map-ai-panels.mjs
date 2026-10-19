import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

// Run with Vite running. Gemini transport is mocked; the session and tool dispatcher are real.
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.MAP_AI_BASE_URL || 'http://127.0.0.1:5196';
const output = 'docs/ai_log/map-chat-tools';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH });
const errors = [];

try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('vie_current_user', JSON.stringify({ name: 'Map test', email: 'map@example.test', role: 'USER' }));
      localStorage.setItem('custom_gemini_api_key', 'mock-transport-only');
    });
    await page.goto(`${base}/playground`);
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
      const { GenAILiveClient } = await import('/src/features/playground/components/map-ai/lib/genai-live-client.ts');
      const connect = GenAILiveClient.prototype.connect;
      window.panelTest = { sessions: [], responses: [] };
      GenAILiveClient.prototype.connect = function(config) {
        this.client = { live: { connect: async ({ callbacks }) => {
          const session = { config, callbacks, closed: false };
          window.panelTest.sessions.push(session);
          setTimeout(() => callbacks.onmessage({ setupComplete: {} }), 10);
          return {
            close() { session.closed = true; },
            sendClientContent() {}, sendRealtimeInput() {},
            sendToolResponse(response) { window.panelTest.responses.push(response); },
          };
        } } };
        return connect.call(this, config);
      };
    });
    const chat = page.locator('#screen-vietnam-map-ai');
    await chat.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
    await chat.locator('.control-tray').waitFor();
    await chat.scrollIntoViewIfNeeded();
    assert.equal(await chat.locator('.chat-tool-panel').count(), 0);
    const consoleBox = await chat.locator('.console-panel').boundingBox();
    assert.ok(consoleBox.width >= width - 2, 'Closed panel leaves full-width chat');
    if (width < 768) await chat.getByTitle('Toggle text input').click();
    await chat.getByRole('textbox', { name: 'Text prompt' }).fill('Mở bản đồ Hà Nội');
    await chat.getByRole('button', { name: 'Send message', exact: true }).click();
    await page.waitForFunction(() => window.panelTest.sessions.length === 1);
    const names = await page.evaluate(() => window.panelTest.sessions[0].config.tools[0].functionDeclarations.map(tool => tool.name));
    assert.ok(names.includes('openMap') && names.includes('openArticleDetail'));

    let callNumber = 0;
    async function callTool(name, args) {
      const id = `panel-${++callNumber}`;
      await page.evaluate(({ name, args, id }) => window.panelTest.sessions.at(-1).callbacks.onmessage({ toolCall: { functionCalls: [{ id, name, args }] } }), { name, args, id });
      await page.waitForFunction(id => window.panelTest.responses.some(response => response.functionResponses?.some(item => item.id === id)), id);
    }
    await callTool('openMap', { provinceName: 'Hà Nội' });
    await chat.getByRole('complementary', { name: 'Vietnam map', exact: true }).waitFor();
    assert.ok(await chat.locator('svg').count() > 0);
    assert.equal(await page.evaluate(async () => (await import('/src/features/playground/components/map-ai/lib/map-state.ts')).useMapStore.getState().selectedProvinceId), 'ha-noi');
    await chat.getByRole('button', { name: 'Close content' }).click();
    assert.equal(await chat.locator('.chat-tool-panel').count(), 0);

    await callTool('getVieCultureArticles', { topic: 'Vịnh Hạ Long' });
    assert.equal(await chat.locator('.chat-tool-panel').count(), 0);
    await callTool('openArticleDetail', { articleId: 'ha-long-bay' });
    const article = chat.getByRole('article', { name: 'Story details' });
    await article.waitFor();
    assert.match(await article.innerText(), /Vịnh Hạ Long/);
    assert.ok(await article.locator('[lang=en]').count() > 0);
    assert.ok(await article.locator('[lang=vi]').count() > 0);
    const box = await chat.locator('.chat-tool-panel').boundingBox();
    assert.ok(box.width > 200 && box.height > 250);
    assert.ok(box.x >= -1 && box.x + box.width <= width + 1, 'Panel stays within viewport');
    assert.ok(await chat.getByRole('textbox', { name: 'Text prompt' }).isVisible());
    await chat.screenshot({ path: `${output}/article-${width}.png`, animations: 'disabled' });
    await article.getByRole('button', { name: 'Show on map' }).click();
    await chat.getByRole('complementary', { name: 'Vietnam map', exact: true }).waitFor();
    await page.evaluate(() => document.activeElement?.blur());
    await page.keyboard.press('Escape');
    assert.equal(await chat.locator('.chat-tool-panel').count(), 0);

    // Existing article cards also open local details without navigating away.
    const detailButton = chat.getByRole('button', { name: 'Story details', exact: true }).first();
    await detailButton.click();
    await article.waitFor();
    assert.equal(new URL(page.url()).pathname, '/playground');
    await chat.getByRole('button', { name: 'Close content' }).click();

    // Immersive retains its always-visible map and original tool declarations.
    await page.evaluate(() => document.activeElement?.blur());
    const immersive = page.locator('#screen-vietnam-map-immersive');
    await immersive.evaluate(element => element.scrollIntoView({ behavior: 'instant', block: 'start' }));
    await immersive.scrollIntoViewIfNeeded();
    await immersive.locator('main svg').first().waitFor();
    const immersiveConfiguration = await page.evaluate(async () => {
      const { buildSessionConfiguration } = await import('/src/features/playground/components/map-ai/lib/session-config.ts');
      const { useSettings, useTools } = await import('/src/features/playground/components/map-ai/lib/state.ts');
      return buildSessionConfiguration(useSettings.getState(), useTools.getState().tools, 'immersive');
    });
    const immersiveNames = immersiveConfiguration.config.tools[0].functionDeclarations.map(tool => tool.name);
    assert.ok(!immersiveNames.includes('openMap') && !immersiveNames.includes('openArticleDetail'));
    assert.ok(!immersiveConfiguration.systemPrompt.includes('AI MAP CHAT PANELS'));
    assert.equal(await immersive.locator('.chat-tool-panel').count(), 0);
    await immersive.getByRole('button', { name: 'Microphone', exact: true }).waitFor();
    console.log(`PASS ${width}px: actual session → tool → panel, close/Escape, article cards, immersive unchanged`);
    await page.close();
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
