import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.MAP_AI_BASE_URL || 'http://127.0.0.1:5197';
const output = 'docs/ai_log/reader-workspace-flow';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH });
const errors = [];
try {
  for (const width of [1440, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await page.route('**/api/posts/workspace-test', route => route.fulfill({ json: {
      id: 'workspace-test', titleEn: 'Imperial architecture in Hue', titleVi: 'Kiến trúc cung đình Huế', level: 'B1',
      summary: 'Explore royal buildings and cultural heritage in Hue.',
      paragraphs: [{ enText: 'We protect our architectural heritage.', viText: 'Chúng ta bảo vệ di sản kiến trúc.' }],
      vocabularies: [{ id: 'heritage', word: 'heritage', pos: 'noun', viMeaning: 'di sản', enDefinition: 'Traditions passed down through generations.', contextSentence: 'We protect our heritage.' }], questions: [],
    } }));
    await page.addInitScript(() => {
      localStorage.setItem('vie_current_user', JSON.stringify({ name: 'Workspace test', email: 'workspace@example.test', role: 'USER' }));
      localStorage.setItem('vie_user_is_pro', 'true');
      localStorage.setItem('custom_gemini_api_key', 'mock-only');
    });
    await page.goto(`${base}/reader?postId=workspace-test&level=Level%202`);
    await page.getByRole('button', { name: 'AI Companion', exact: true }).click();
    await page.getByRole('button', { name: 'Express my opinion in English', exact: true }).click();
    await page.getByRole('button', { name: 'Send message', exact: true }).click();
    const draft = 'I want to practise describing the buildings in Hue.';
    await page.getByRole('textbox', { name: 'Message the companion' }).fill(draft);
    await page.evaluate(async () => {
      const { GenAILiveClient } = await import('/src/features/playground/components/map-ai/lib/genai-live-client.ts');
      const connect = GenAILiveClient.prototype.connect;
      window.flowTest = { sessions: [], responses: [], contents: [] };
      GenAILiveClient.prototype.connect = function(config) {
        this.client = { live: { connect: async ({ callbacks }) => {
          const session = { callbacks, config, closed: false };
          window.flowTest.sessions.push(session);
          setTimeout(() => callbacks.onmessage({ setupComplete: {} }), 0);
          return {
            close() { session.closed = true; },
            sendClientContent(content) { window.flowTest.contents.push(content); }, sendRealtimeInput() {},
            sendToolResponse(response) { window.flowTest.responses.push(response); },
          };
        } } };
        return connect.call(this, config);
      };
    });
    await page.getByRole('button', { name: 'Continue in AI workspace', exact: true }).click();
    await page.waitForURL('**/ai-workspace?**');
    assert.equal(new URL(page.url()).pathname, '/ai-workspace');
    const chat = page.locator('.map-ai-app.ai-chat-ui');
    const input = chat.getByRole('textbox', { name: 'Text prompt' });
    await input.waitFor({ state: 'visible' });
    assert.equal(await input.inputValue(), draft);
    assert.equal(await page.evaluate(() => window.flowTest.sessions.length), 0, 'Navigation must not connect or enable the microphone');
    assert.ok((await chat.boundingBox()).y >= 50 && (await chat.boundingBox()).y < 90, 'Deep link opens the chat screen');
    await chat.getByRole('button', { name: 'Reading reference', exact: true }).click();
    await chat.getByRole('article', { name: 'Reader reference', exact: true }).waitFor();
    await chat.getByText('Explore royal buildings and cultural heritage in Hue.', { exact: true }).waitFor();
    await chat.getByText('di sản', { exact: true }).waitFor();
    await chat.screenshot({ path: `${output}/reference-${width}.png`, animations: 'disabled' });
    await chat.getByRole('button', { name: 'Close content', exact: true }).click();
    await chat.getByRole('button', { name: 'Send message', exact: true }).click();
    await page.waitForFunction(() => window.flowTest.contents.some(content => content.turnComplete === true));
    assert.equal(await page.evaluate(() => window.flowTest.sessions.length), 1);
    const sent = await page.evaluate(() => window.flowTest.contents);
    assert.equal(sent.length, 1, 'The UI handoff must not inject or restore a Live session');
    assert.match(JSON.stringify(sent), /I want to practise describing the buildings in Hue/);
    assert.ok(!JSON.stringify(sent).includes('Try this speaking frame'), 'Preview assistant replies must not become live AI history');
    await page.evaluate(() => window.flowTest.sessions[0].callbacks.onmessage({ serverContent: {
      outputTranscription: { text: 'We can practise describing the royal buildings.', finished: true }, turnComplete: true,
    } }));
    await chat.getByText('We can practise describing the royal buildings.', { exact: true }).waitFor();
    await chat.screenshot({ path: `${output}/workspace-${width}.png`, animations: 'disabled' });
    await chat.getByRole('link', { name: 'Back to Reader', exact: true }).click();
    await page.waitForURL('**/reader?**');
    await page.goBack();
    await chat.locator('.control-tray').waitFor();
    assert.equal(await page.evaluate(() => window.flowTest.sessions.length), 1);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.reload();
    await chat.getByRole('region', { name: 'Reading context' }).waitFor();
    assert.equal(await chat.getByRole('region', { name: 'Reading context' }).getAttribute('title'), 'Imperial architecture in Hue');
    await chat.getByRole('button', { name: 'Dismiss reading reference', exact: true }).click();
    assert.equal(await chat.getByRole('region', { name: 'Reading context' }).count(), 0);
    await page.close();
    console.log(`${width}px: Reader → workspace, draft/reference, explicit send only, return and deep link PASS`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
