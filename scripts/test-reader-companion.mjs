import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.UI_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.UI_BASE_URL || 'http://127.0.0.1:5193';
const output = 'docs/ai_log/reader-companion';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.UI_CHROMIUM_EXECUTABLE, headless: true });
const errors = [];
async function openReader(width = 1440, access = 'pro') {
  const page = await browser.newPage({ viewport: { width, height: width < 500 ? 740 : 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(access => {
    if (access !== 'guest') localStorage.setItem('vie_current_user', JSON.stringify({ name: 'Reader test', email: 'reader@example.test', role: 'USER' }));
    if (access === 'pro') localStorage.setItem('vie_user_is_pro', 'true');
  }, access);
  await page.route('**/*unsplash*', route => route.abort());
  await page.route('**/api/posts/companion-test', route => route.fulfill({ json: {
    id: 'companion-test', titleEn: 'Inside imperial Hue', titleVi: 'Bên trong kinh thành Huế', level: 'B1',
    summary: 'Explore royal architecture in Hue.',
    paragraphs: [{ id: 'p1', orderIndex: 0, enText: 'The architectural heritage of Hue is remarkable.', viText: 'Di sản kiến trúc Huế rất đặc sắc.' }],
    vocabularies: [{ id: 'architecture', word: 'architectural', viMeaning: 'thuộc về kiến trúc', enDefinition: 'Related to the design of buildings.', pos: 'adjective', ipa: '/ɑːkɪˈtektʃərəl/', contextSentence: 'The architectural heritage of Hue is remarkable.' }], questions: [],
  } }));
  await page.goto(`${base}/reader?postId=companion-test&level=Level%202`);
  await page.getByRole('button', { name: 'AI Companion', exact: true }).click();
  await page.getByRole('heading', { name: 'AI Cultural Companion', exact: true }).waitFor();
  return page;
}
try {
  for (const width of [1440, 375, 320]) {
    const page = await openReader(width);
    const panel = page.locator('.reader-companion-panel');
    await panel.getByText('Inside imperial Hue', { exact: true }).waitFor();
    assert.equal(await panel.getByRole('button', { name: 'Close AI companion' }).evaluate(button => {
      const rect = button.getBoundingClientRect();
      return button.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
    }), true, 'Reader toolbar must not cover the companion header');
    assert.equal(await panel.getByText(/Bánh Chưng/).count(), 0);
    await panel.screenshot({ path: `${output}/tools-${width}.png`, animations: 'disabled' });
    await panel.getByRole('button', { name: /Start with this story/ }).click();
    assert.equal(await panel.locator('ol li').count(), 3);
    await panel.getByRole('button', { name: /Open this story’s vocabulary/ }).click();
    await page.getByRole('button', { name: 'Close vocabulary' }).waitFor();
    assert.equal(await panel.count(), 0);
    await page.getByRole('button', { name: 'Close vocabulary' }).click();
    await page.getByRole('button', { name: 'AI Companion', exact: true }).click();
    await panel.getByRole('button', { name: /Word in context/ }).click();
    await panel.getByRole('button', { name: 'architectural', exact: true }).click();
    await panel.getByText('thuộc về kiến trúc', { exact: true }).waitFor();
    assert.match(await panel.locator('blockquote').innerText(), /heritage of Hue/);
    if (width === 1440) {
      let releaseLookup;
      const pendingLookup = new Promise(resolve => { releaseLookup = resolve; });
      await page.route('**/api/vocabularies/lookup?word=companiontestword', async route => {
        await pendingLookup;
        await route.fulfill({ json: { word: 'companiontestword', viMeaning: 'Kết quả tra cứu thử nghiệm', enDefinition: 'A dictionary service test result.', pos: 'noun', contextSentence: 'A test sentence from the dictionary.' } });
      });
      await panel.getByRole('textbox', { name: 'Which word would you like to explore?' }).fill('companiontestword');
      await panel.getByRole('button', { name: 'Look up word', exact: true }).click();
      await panel.getByRole('status').waitFor();
      assert.equal(await panel.getByRole('button', { name: 'Look up word', exact: true }).isDisabled(), true);
      releaseLookup();
      await panel.getByText('A dictionary service test result.', { exact: true }).waitFor();
      await panel.screenshot({ path: `${output}/lookup-desktop.png`, animations: 'disabled' });
    }
    await panel.getByRole('button', { name: 'Understand the story', exact: true }).click();
    const input = panel.getByRole('textbox', { name: 'Message the companion' });
    assert.match(await input.inputValue(), /Inside imperial Hue/);
    assert.equal(await panel.locator('.reader-companion-tools').count(), 1, 'Drafting should keep tools visible');
    await panel.getByRole('button', { name: 'Send message', exact: true }).click();
    assert.equal(await panel.locator('.reader-companion-tools').count(), 0);
    assert.equal(await panel.locator('.reader-companion-message').count(), 2);
    assert.match(await panel.getByRole('log').innerText(), /Explore royal architecture in Hue/);
    await panel.screenshot({ path: `${output}/chat-${width}.png`, animations: 'disabled' });
    await input.fill('   ');
    assert.equal(await panel.getByRole('button', { name: 'Send message' }).isDisabled(), true);
    await input.press('Enter');
    assert.equal(await panel.locator('.reader-companion-message').count(), 2);
    await panel.getByRole('button', { name: 'Learning tools', exact: true }).click();
    await panel.getByRole('button', { name: 'Back to chat', exact: true }).click();
    assert.equal(await panel.locator('.reader-companion-message').count(), 2);
    await input.fill('My own question');
    await input.press('Shift+Enter');
    assert.equal(await panel.locator('.reader-companion-message').count(), 2);
    await input.press('Enter');
    assert.equal(await panel.locator('.reader-companion-message').count(), 4);
    await panel.getByText(/Live AI replies are not connected/).waitFor();
    await input.press('Escape');
    const launcher = page.getByRole('button', { name: 'AI Companion', exact: true });
    assert.equal(await launcher.getAttribute('aria-expanded'), 'false');
    assert.equal(await launcher.evaluate(e => document.activeElement === e), true);
    await launcher.click();
    assert.equal(await panel.locator('.reader-companion-message').count(), 4);
    const bounds = await panel.boundingBox();
    assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= width);
    assert.equal(await panel.evaluate(e => e.scrollWidth > e.clientWidth), false);
    if (width === 1440) {
      await panel.getByRole('button', { name: 'Close AI companion' }).click();
      const nav = page.getByRole('navigation', { name: 'Reading tools' });
      await nav.getByRole('button', { name: 'English only', exact: true }).click();
      await nav.getByRole('button', { name: 'Reading settings', exact: true }).click();
      await page.locator('.reader-navbar-settings-panel').getByRole('button', { name: 'Dark', exact: true }).click();
      await page.keyboard.press('Escape');
      await launcher.click();
      assert.equal(await panel.locator('.reader-companion-message').count(), 4, 'Reading mode and theme should preserve conversation');
      assert.equal(await page.locator('.reader-companion').getAttribute('data-theme'), 'dark');
      await panel.screenshot({ path: `${output}/dark-desktop.png`, animations: 'disabled' });
    }
    await panel.getByRole('button', { name: 'Learning tools', exact: true }).click();
    await panel.getByRole('button', { name: /Review vocabulary/ }).click();
    await page.waitForURL('**/flashcard-study?**');
    assert.equal(new URL(page.url()).searchParams.get('deck'), 'companion-test');
    assert.equal(new URL(page.url()).searchParams.get('level'), 'Level 2');
    await page.close();
    console.log(`${width}px: story tools, actual lookup, draft/send focus, history, keyboard, layout and review route PASS`);
  }
  for (const access of ['guest', 'basic']) {
    const page = await openReader(375, access);
    const panel = page.locator('.reader-companion-panel');
    assert.equal(await panel.getByRole('textbox', { name: 'Message the companion' }).count(), 0);
    await panel.getByRole('button', { name: 'Understand the story', exact: true }).click();
    await panel.getByText(/Prepared prompt: Help me understand/).waitFor();
    await panel.getByRole('button', { name: /Word in context/ }).click();
    await panel.getByRole('button', { name: 'architectural', exact: true }).click();
    await panel.getByText('thuộc về kiến trúc', { exact: true }).waitFor();
    await panel.getByRole('button', { name: access === 'guest' ? 'Sign in to chat' : 'Explore Pro', exact: true }).click();
    await page.waitForURL(access === 'guest' ? '**/login?**' : '**/pricing');
    if (access === 'guest') assert.equal(new URL(page.url()).searchParams.get('redirect'), '/reader?postId=companion-test&level=Level%202');
    await page.close();
    console.log(`${access}: dictionary remains usable; existing chat access and redirect preserved PASS`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
