import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.UI_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.UI_BASE_URL || 'http://127.0.0.1:5188';
const output = 'docs/ai_log/reader-article-format';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const format = sheet => sheet.evaluate(element => {
  const style = selector => getComputedStyle(element.querySelector(selector));
  const root = getComputedStyle(element);
  const title = style('h1'), label = style('.reader-sheet-heading > span'), body = style('.reader-article-body');
  return { padding: root.padding, radius: root.borderRadius, border: root.borderColor, background: root.backgroundColor,
    title: [title.fontFamily, title.fontSize, title.fontWeight, title.lineHeight, title.color],
    label: [label.fontSize, label.fontWeight, label.color, label.backgroundColor],
    body: [body.fontFamily, body.fontSize, body.lineHeight, body.color], imageHeight: style('img').height };
});
try {
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.route('**/*unsplash*', route => route.abort());
    await page.goto(`${base}/reader`);
    await page.waitForLoadState('networkidle');
    const english = page.locator('[data-article-language="en"]');
    const vietnamese = page.locator('[data-article-language="vi"]');
    assert.equal(await page.locator('.reader-language-sheet').count(), 2);
    assert.equal(await vietnamese.locator('.reader-article-body > p').count(), 5);
    await english.hover();
    await page.mouse.wheel(0, 250);
    await page.waitForFunction(() => {
      const sheets = [...document.querySelectorAll('.reader-language-sheet')];
      const ratios = sheets.map(s => s.scrollTop / (s.scrollHeight - s.clientHeight));
      return ratios[0] > 0 && Math.abs(ratios[0] - ratios[1]) < .02;
    });
    for (const theme of ['paper', 'dark']) {
      const nav = page.getByRole('navigation', { name: 'Reading tools' });
      await nav.getByRole('button', { name: 'Bilingual', exact: true }).click();
      await nav.getByRole('button', { name: 'Reading settings', exact: true }).click();
      await page.locator('.reader-navbar-settings-panel').getByRole('button', { name: theme === 'paper' ? 'Paper' : 'Dark', exact: true }).click();
      await page.keyboard.press('Escape');
      await english.evaluate(element => Promise.all(element.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {}))));
      const expected = await format(english);
      assert.equal(await english.evaluate(e => getComputedStyle(e).maxHeight), '750px');
      await nav.getByRole('button', { name: 'English only', exact: true }).click();
      await page.waitForURL('**mode=extensive');
      assert.equal(await page.locator('.reader-language-sheet').count(), 1);
      assert.equal(await english.evaluate(e => getComputedStyle(e).maxHeight), 'none');
      assert.deepEqual(await format(english), expected);
      assert.equal(await english.locator('.reader-article-body > p').count(), 5);
      assert.equal(await english.locator('.reader-sheet-heading').innerText(), 'English original\nEN');
      await english.getByRole('button', { name: 'sacred', exact: true }).click();
      await page.locator('.in-place-dictionary-popup').waitFor();
      await page.getByTitle('Close definition').click();
      await english.screenshot({ path: `${output}/english-only-${theme}-${width}.png` });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    console.log(`${width}px: shared Paper/Dark formatting, original scrolling/layout and sample vocabulary PASS`);
    await page.close();
  }
  // Intercept only the test article, without requiring or changing a backend.
  const page = await browser.newPage();
  await page.route('**/*unsplash*', route => route.abort());
  await page.route('**/api/posts/format-test', route => route.fulfill({ json: {
    id: 'format-test', titleEn: 'Shared article formatting', titleVi: 'Định dạng bài đọc', level: 'B1',
    paragraphs: [{ id: 'p1', orderIndex: 0, enText: 'A sacred tradition brings the family together.', viText: 'Một truyền thống thiêng liêng gắn kết gia đình.' }],
    vocabularies: [{ id: 'sacred', word: 'sacred', viMeaning: 'thiêng liêng', pos: 'adjective' }], questions: [],
  } }));
  await page.goto(`${base}/reader?postId=format-test`);
  for (const mode of ['Bilingual', 'English only']) {
    await page.getByRole('navigation', { name: 'Reading tools' }).getByRole('button', { name: mode, exact: true }).click();
    const word = page.locator('[data-article-language="en"] .reader-article-body').getByRole('button', { name: 'sacred', exact: true });
    await word.click();
    await page.locator('.in-place-dictionary-popup').getByText('thiêng liêng', { exact: true }).waitFor();
    await page.getByTitle('Close definition').click();
  }
  console.log('Data-backed paragraphs: shared vocabulary highlighting/lookup in both modes PASS');
} finally {
  await browser.close();
}
