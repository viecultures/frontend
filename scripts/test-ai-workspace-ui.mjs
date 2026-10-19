import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.MAP_AI_BASE_URL || 'http://127.0.0.1:5197';
const output = 'docs/ai_log/ai-workspace-ui';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH });
const errors = [];
try {
  for (const width of [1440, 768, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width < 500 ? 800 : 1000 } });
    page.setDefaultTimeout(15000);
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto(`${base}/ai-workspace`);
    await page.getByRole('heading', { name: 'AI workspace', exact: true }).waitFor();
    const chat = page.locator('.map-ai-app.ai-chat-ui');
    const welcome = page.getByRole('region', { name: 'Start a conversation' });
    await welcome.getByRole('heading', { name: 'Let’s talk about Vietnam.' }).waitFor();
    assert.equal(await page.locator('#screen-dictation-shadowing').count(), 0, 'Dedicated chat page should not mount the lab screens');
    assert.equal(await welcome.locator('p').count(), 1, 'Introduction has one concise instruction');
    assert.ok((await welcome.boundingBox()).height < 300, 'Welcome stays compact');
    assert.equal(await welcome.getByRole('button').count(), 4);
    const style = await welcome.getByRole('button').first().evaluate(element => ({
      radius: getComputedStyle(element).borderRadius, weight: getComputedStyle(element).fontWeight,
      family: getComputedStyle(element).fontFamily, height: element.getBoundingClientRect().height,
    }));
    assert.equal(style.radius, '12px');
    assert.equal(style.weight, '400');
    assert.match(style.family, /Be Vietnam Pro/);
    assert.ok(style.height >= 44);
    await page.screenshot({ path: `${output}/dark-${width}.png`, animations: 'disabled' });
    const settingsButton = chat.getByRole('button', { name: 'Settings', exact: true });
    await settingsButton.click();
    const settings = page.getByRole('dialog', { name: 'Speaking settings' });
    await settings.waitFor();
    await settings.getByRole('combobox', { name: 'Speaking level' }).selectOption('Level 1');
    assert.equal(await settings.getByRole('combobox', { name: 'Speaking level' }).inputValue(), 'Level 1');
    await settings.getByRole('combobox', { name: 'Corrections' }).selectOption('after-turn');
    await settings.getByRole('combobox', { name: 'Voice' }).selectOption('Kore');
    const download = page.waitForEvent('download');
    await settings.getByRole('button', { name: 'Export history', exact: true }).click();
    assert.match((await download).suggestedFilename(), /^cultural-speaking-session-/);
    await page.screenshot({ path: `${output}/settings-${width}.png`, animations: 'disabled' });
    await settings.getByRole('combobox', { name: 'Appearance' }).selectOption('light');
    await page.keyboard.press('Escape');
    await settings.waitFor({ state: 'hidden' });
    assert.equal(await settingsButton.evaluate(element => document.activeElement === element), true);
    assert.equal(await chat.locator('.transcription-container').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(251, 247, 238)');
    await page.screenshot({ path: `${output}/light-${width}.png`, animations: 'disabled' });
    await chat.getByRole('button', { name: 'Story practice', exact: true }).click();
    await chat.getByRole('button', { name: 'Continue practice', exact: true }).waitFor();
    await chat.getByRole('button', { name: 'Free talk', exact: true }).click();
    await page.evaluate(async () => {
      const { dispatchTool } = await import('/src/features/playground/components/map-ai/lib/tools/tool-dispatcher.ts');
      await dispatchTool('openMap', { provinceName: 'Hà Nội' }, { view: 'chat', allowMapTools: true, tutorMode: 'free-conversation' });
    });
    await chat.getByRole('complementary', { name: 'Vietnam map', exact: true }).waitFor();
    for (const tab of await chat.getByRole('tablist', { name: 'Choose a map region' }).getByRole('tab').all()) {
      const bounds = await tab.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width, 'All map region tabs remain reachable');
    }
    const placeClose = await chat.getByTitle('Close place details').boundingBox();
    const regionTabs = await chat.getByRole('tablist', { name: 'Choose a map region' }).boundingBox();
    assert.ok(placeClose.y >= regionTabs.y + regionTabs.height, 'Place-card header must not sit behind the region tabs');
    await page.screenshot({ path: `${output}/map-${width}.png`, animations: 'disabled' });
    await chat.getByRole('button', { name: 'Close content', exact: true }).click();
    await page.evaluate(async () => {
      const { dispatchTool } = await import('/src/features/playground/components/map-ai/lib/tools/tool-dispatcher.ts');
      await dispatchTool('openArticleDetail', { articleId: 'ha-long-bay' }, { view: 'chat', allowMapTools: true, tutorMode: 'free-conversation' });
    });
    const article = chat.getByRole('article', { name: 'Story details', exact: true });
    await article.getByRole('heading', { name: 'Bilingual introduction', exact: true }).waitFor();
    assert.ok(await article.locator('[lang=en]').count());
    assert.ok(await article.locator('[lang=vi]').count());
    await page.screenshot({ path: `${output}/story-${width}.png`, animations: 'disabled' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.close();
    console.log(`${width}px: compact welcome, shared typography/corners, English settings, focus, themes, map/story and dedicated page PASS`);
  }
  const page = await browser.newPage();
  await page.goto(`${base}/playground?view=chat&story=ha-long-bay&level=Level%202`);
  await page.waitForURL('**/ai-workspace?**');
  assert.equal(new URL(page.url()).searchParams.get('story'), 'ha-long-bay');
  await page.close();
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
