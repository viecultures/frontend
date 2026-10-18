// UI foundation checks against Vite. Use the workspace's Playwright runtime if
// Playwright is not installed locally; no production dependency is required.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.UI_PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.UI_TEST_URL || 'http://127.0.0.1:5187';
const outputDir = process.env.UI_TEST_OUTPUT || 'docs/ai_log/uiux-foundation';
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.UI_CHROMIUM_EXECUTABLE || undefined });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));

async function checkContrast() {
  const ratios = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const rgb = name => root.getPropertyValue(`--color-${name}`).trim().replace('#', '').match(/../g).map(value => parseInt(value, 16) / 255);
    const luminance = color => color.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
    const pairs = [
      ['ink', 'surface'], ['ink-soft', 'surface'], ['ink-faint', 'surface'],
      ['text-muted', 'surface-raised'], ['on-action', 'action'], ['on-action', 'action-hover'],
      ['accent-ink', 'accent-soft'], ['success', 'success-soft'], ['info', 'info-soft'],
      ['warning', 'warning-soft'], ['danger', 'danger-soft'], ['focus', 'surface'],
    ];
    return pairs.map(([text, background]) => {
      const a = luminance(rgb(text)), b = luminance(rgb(background));
      return { pair: `${text}/${background}`, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
    });
  });
  for (const { pair, ratio } of ratios) assert.ok(ratio >= (pair.startsWith('focus/') ? 3 : 4.5), `${pair}: ${ratio.toFixed(2)}`);
  return ratios.map(({ pair, ratio }) => `${pair}: ${ratio.toFixed(2)}`);
}

try {
  const report = { viewports: [], contrast: {}, routes: [] };
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${baseURL}/design-system`);
    await page.waitForLoadState('networkidle');
    await page.getByRole('heading', { name: /Ít phân tâm hơn/ }).waitFor();
    const layout = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth, bodyCursor: getComputedStyle(document.body).cursor }));
    assert.ok(layout.content <= width + 1, `Preview overflow at ${width}: ${layout.content}`);
    assert.equal(layout.bodyCursor, 'auto');
    const primary = page.getByRole('button', { name: 'Đọc bài mẫu', exact: true });
    assert.ok((await primary.boundingBox()).height >= 44);
    assert.ok(await primary.evaluate(el => parseFloat(getComputedStyle(el).fontSize) >= 16));
    report.viewports.push({ width, ...layout });
    if (width === 375 || width === 1440) await page.screenshot({ path: `${outputDir}/foundation-${width}.png`, fullPage: true });
  }

  report.contrast.light = await checkContrast();
  const trigger = page.getByRole('button', { name: 'Đọc bài mẫu', exact: true });
  await trigger.focus();
  assert.ok(await trigger.evaluate(el => getComputedStyle(el).boxShadow !== 'none'), 'Visible keyboard focus');
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Một buổi sáng ở Hà Nội' });
  await dialog.waitFor();
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)), 'Focus must stay inside the dialog');
  }
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  assert.ok(await trigger.evaluate(el => document.activeElement === el), 'Restore focus to trigger');
  await page.getByRole('button', { name: 'Xem giao diện tối' }).click();
  report.contrast.dark = await checkContrast();
  await page.screenshot({ path: `${outputDir}/foundation-dark.png`, fullPage: true });
  await trigger.click();
  await dialog.waitFor();
  assert.equal(await dialog.locator('[data-slot="modal-panel"]').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(20, 46, 39)');
  await page.getByRole('button', { name: 'Close dialog', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  await page.getByRole('button', { name: 'Xem giao diện sáng' }).click();

  await page.setViewportSize({ width: 375, height: 900 });
  const menu = page.getByRole('button', { name: 'Open navigation', exact: true });
  await menu.click();
  assert.equal(await page.getByRole('button', { name: 'Close navigation' }).getAttribute('aria-expanded'), 'true');
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button', { name: 'Discover' }).click();
  await page.waitForURL('**/discovery');
  assert.equal(await page.getByRole('button', { name: 'Open navigation' }).getAttribute('aria-expanded'), 'false');

  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ['/', '/discovery', '/dictionary', '/reader', '/flashcard-study', '/playground']) {
      await page.goto(`${baseURL}${path}`);
      await page.waitForLoadState('networkidle');
      const layout = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
      assert.ok(layout.content <= width + 1, `${path} overflow at ${width}: ${layout.content}`);
      report.routes.push({ path, ...layout });
      if (path === '/discovery' && [375, 1440].includes(width)) await page.screenshot({ path: `${outputDir}/discovery-${width}.png`, fullPage: true });
    }
  }
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  await page.screenshot({ path: `${outputDir}/failure.png`, fullPage: true });
  console.error(await page.locator('[role="dialog"]').evaluateAll(elements => elements.map(element => ({
    box: element.getBoundingClientRect().toJSON(),
    display: getComputedStyle(element).display,
    visibility: getComputedStyle(element).visibility,
    descendants: [...element.querySelectorAll('div')].slice(0, 5).map(child => ({ className: child.className, box: child.getBoundingClientRect().toJSON() })),
  }))));
  throw error;
} finally {
  await browser.close();
}
