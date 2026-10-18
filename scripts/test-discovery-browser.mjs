// Run against Vite with the workspace Playwright runtime; no production dependency.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.UI_PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.UI_TEST_URL || 'http://127.0.0.1:5188';
const output = process.env.UI_TEST_OUTPUT || 'docs/ai_log/discovery-editorial';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.UI_CHROMIUM_EXECUTABLE || undefined });
const errors = [];
const report = { layouts: [], checks: [] };
const context = await browser.newContext({ reducedMotion: 'reduce' });
// Exercise Discovery after the existing global install prompt has been dismissed.
await context.addInitScript(() => sessionStorage.setItem('viecultures_pwa_dismissed', 'true'));
const page = await context.newPage();
page.on('pageerror', error => errors.push(error.message));
await context.route('**/api/posts/catalog?*', route => route.fulfill({ status: 503, body: '{}' }));
await context.route('https://images.unsplash.com/**', route => route.abort());

async function openDiscovery() {
  await page.goto(`${baseURL}/discovery`);
  await page.waitForLoadState('networkidle');
  await page.getByRole('heading', { name: 'Stories from Vietnam', exact: true }).waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function noOverflow(label) {
  const size = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
  assert.ok(size.content <= size.viewport + 1, `${label}: ${JSON.stringify(size)}`);
}
async function storyIds() { return page.locator('.discovery-story').evaluateAll(items => items.map(item => item.dataset.storyId)); }
async function assertCards() {
  const cards = await page.locator('.discovery-story--card').evaluateAll(items => items.map(item => {
    const rect = item.getBoundingClientRect();
    return { w: rect.width, h: rect.height, scroll: item.scrollHeight, links: item.querySelectorAll('a').length, buttons: item.querySelectorAll('button').length,
      image: item.querySelector('.discovery-story-image').getBoundingClientRect().height,
      titleSize: getComputedStyle(item.querySelector('h3')).fontSize,
      clipped: [...item.querySelectorAll('h3,p')].some(child => child.scrollHeight > child.clientHeight + 1),
      bookmark: item.querySelector('button').getBoundingClientRect().height };
  }));
  for (const card of cards) {
    assert.equal(card.links, 1); assert.equal(card.buttons, 1);
    assert.ok(card.bookmark >= 44);
    assert.ok(card.scroll <= card.h + 1);
    assert.ok(!card.clipped);
    assert.equal(card.titleSize, '22px');
    assert.ok(card.w / card.h <= .81 && card.w / card.h > .60, `Readable portrait card: ${JSON.stringify(card)}`);
    assert.ok(Math.abs(card.image - (card.w - 2) * 9 / 16) < 2, '16:9 image inside portrait card');
  }
  return cards[0];
}

try {
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 700 ? 812 : 1000 });
    await openDiscovery();
    await noOverflow(`reading ${width}`);
    assert.equal(await page.locator('.discovery-story--lead').count(), 1);
    assert.equal(await page.locator('.discovery-story--support').count(), 2);
    assert.equal(await page.locator('.discovery-story--card').count(), 6);
    const ids = await storyIds(); assert.equal(new Set(ids).size, ids.length, 'No duplicated lead stories');
    const first = await assertCards();
    const lead = await page.locator('.discovery-story--lead').boundingBox();
    assert.ok(lead.y < (width < 700 ? 550 : 450), 'Lead story is near the top');
    const link = page.locator('.discovery-story--lead a');
    await link.focus();
    assert.ok(await link.evaluate(el => getComputedStyle(el).boxShadow !== 'none' || getComputedStyle(el).outlineStyle !== 'none'), 'Visible keyboard focus');
    await page.evaluate(() => window.scrollTo(0, 0));
    if ([375, 1440].includes(width)) await page.screenshot({ path: `${output}/reading-${width}.png`, fullPage: true });

    await page.getByRole('button', { name: 'By place', exact: true }).click();
    await page.getByLabel('Choose a place', { exact: true }).waitFor();
    await noOverflow(`places ${width}`);
    const map = await page.locator('.discovery-map').boundingBox();
    if (width < 700) assert.equal(map.height, 320);
    await page.getByLabel('Choose a place', { exact: true }).selectOption('hue');
    assert.deepEqual((await storyIds()).sort(), ['imperial-hue', 'non-la-culture']);
    await page.getByRole('heading', { name: 'Huế', exact: true, level: 2 }).waitFor();
    // Trigger the actual province path handler as well as the accessible native select.
    await page.locator('#province-ha-noi').dispatchEvent('click');
    await page.getByRole('heading', { name: 'Hà Nội', exact: true, level: 2 }).waitFor();
    assert.ok(!(await storyIds()).includes('imperial-hue'), 'Map click changes the result list');
    await page.getByLabel('Choose a place', { exact: true }).selectOption('hue');
    await page.evaluate(() => window.scrollTo(0, 0));
    if ([375, 1440].includes(width)) await page.screenshot({ path: `${output}/places-${width}.png`, fullPage: true });
    await page.getByLabel('Choose a place', { exact: true }).selectOption('cao-bang');
    await page.getByRole('heading', { name: 'No matching stories yet' }).waitFor();
    await page.getByRole('button', { name: 'View all stories', exact: true }).click();
    assert.equal(await page.getByLabel('Choose a place', { exact: true }).inputValue(), '');
    await page.getByRole('group', { name: 'Explore by', exact: true }).getByRole('button', { name: 'Stories', exact: true }).click();
    report.layouts.push({ width, firstCard: first, leadY: lead.y, mapHeight: map.height });
    console.log(`Discovery reading + geography: ${width}px PASS`);
  }
  report.checks.push('7 viewport widths; image ratio; portrait cards; two targets/card; keyboard focus; map selection; empty province; reset');

  await page.setViewportSize({ width: 1440, height: 1000 });
  await openDiscovery();
  const seen = new Set(await storyIds());
  while (await page.getByRole('button', { name: 'Next', exact: true }).isEnabled()) {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    assert.ok(await page.locator('#discovery-results-heading').evaluate(el => document.activeElement === el), 'Pagination restores focus to results');
    for (const id of await storyIds()) { assert.ok(!seen.has(id), `Duplicate across pages: ${id}`); seen.add(id); }
  }
  assert.equal(seen.size, 22, 'Every story reachable exactly once');
  await page.getByRole('searchbox', { name: 'Search stories' }).fill('  dong ho  ');
  assert.deepEqual(await storyIds(), ['dong-ho-paintings']);
  await page.getByRole('button', { name: 'Save story:', exact: false }).click();
  await page.reload(); await page.waitForLoadState('networkidle');
  await page.getByRole('searchbox', { name: 'Search stories' }).fill('dong ho');
  assert.equal(await page.locator('.discovery-save').getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: 'Clear search' }).click();
  await page.getByRole('button', { name: /^Filters/ }).click();
  await page.getByLabel('Saved stories only').check();
  assert.deepEqual(await storyIds(), ['dong-ho-paintings']);
  await page.getByRole('button', { name: /^Unsave story:/ }).click();
  await page.getByRole('heading', { name: 'No matching saved stories' }).waitFor();
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  assert.equal(await page.getByRole('combobox', { name: /level|proficiency/i }).count(), 0, 'No proficiency selector');
  await page.getByRole('combobox', { name: 'Reading time', exact: true }).selectOption('short');
  assert.ok((await page.locator('.discovery-story-footer > span').allTextContents()).every(text => parseInt(text, 10) <= 5));
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await page.getByRole('combobox', { name: 'Topic', exact: true }).selectOption('Cuisine');
  assert.ok((await page.locator('.discovery-category').allTextContents()).every(value => value.includes('Food & drink')));
  await page.getByRole('combobox', { name: 'Sort by', exact: true }).selectOption('time_asc');
  const times = await page.locator('.discovery-story-footer > span').allTextContents();
  const minutes = times.map(text => parseInt(text, 10));
  assert.deepEqual(minutes, [...minutes].sort((a, b) => a - b));
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click();
  const firstLink = page.locator('.discovery-story--lead a');
  const expectedHref = await firstLink.getAttribute('href');
  await firstLink.click();
  await page.waitForURL(`${baseURL}${expectedHref}`);
  assert.ok(page.url().includes('/reader?story=imperial-hue'));
  report.checks.push('22 stories without duplicates; accent-insensitive search; durable bookmarks; saved empty state; duration filters without proficiency UI; actual Reader navigation');

  const backend = await browser.newContext();
  await backend.addInitScript(() => sessionStorage.setItem('viecultures_pwa_dismissed', 'true'));
  const apiPage = await backend.newPage({ viewport: { width: 375, height: 812 } });
  apiPage.on('pageerror', error => errors.push(error.message));
  const fixture = {
    id: 'api-long-story', titleEn: 'A long English title about cultural memory and traditional craftsmanship in Vietnam',
    titleVi: 'Câu chuyện về ký ức văn hóa và những người thợ gìn giữ nghề truyền thống qua nhiều thế hệ',
    category: 'Crafts', categoryVi: 'Nghệ thuật & Làng nghề', region: 'Việt Nam', imageUrl: '/missing-test-image.jpg',
    summary: 'Một câu chuyện dài để kiểm tra khả năng đọc đầy đủ nội dung khi tiêu đề xuống nhiều dòng trên màn hình nhỏ.',
    primaryLevel: 'Level 3', availableLevels: ['Level 3'], featured: false, readTime: '12 phút đọc', vocabCount: 10,
    levelDetails: { 'Level 3': { postId: 'actual-api-post', readTime: '12 phút đọc', vocabCount: 10 } }, createdAt: '2026-10-18',
  };
  let requests = 0;
  await backend.route('**/api/posts/catalog?*', route => {
    requests++;
    const second = new URL(route.request().url()).searchParams.get('page') === '1';
    return route.fulfill({ json: { items: second ? [{ ...fixture, id: 'api-second-page' }] : [fixture], totalPages: 2 } });
  });
  await backend.route('https://images.unsplash.com/**', route => route.abort());
  await apiPage.goto(`${baseURL}/discovery`); await apiPage.waitForLoadState('networkidle');
  assert.ok(requests >= 2, 'Fetch subsequent backend catalog pages');
  await apiPage.getByRole('searchbox', { name: 'Search stories' }).fill('ký ức');
  const apiCard = apiPage.locator('[data-story-id="api-long-story"]');
  await apiCard.waitFor();
  assert.ok((await apiCard.locator('a').getAttribute('href')).includes('postId=actual-api-post'));
  assert.equal(await apiCard.locator('.discovery-image-fallback').count(), 1, 'Broken image has a useful fallback');
  assert.ok(await apiCard.locator('h3').evaluate(el => el.scrollHeight <= el.clientHeight + 1), 'Full long title');
  await apiPage.getByRole('button', { name: /^Filters/ }).click();
  await apiPage.getByRole('combobox', { name: 'Reading time', exact: true }).selectOption('short');
  assert.equal(await apiPage.locator('[data-story-id="api-long-story"]').count(), 0, 'Duration filtering keeps catalog entries consistent');
  await apiPage.getByRole('button', { name: 'Clear filters', exact: true }).click();
  await apiPage.evaluate(() => localStorage.setItem('viecultures_app_settings', JSON.stringify({ language: 'en', theme: 'light' })));
  await apiPage.reload(); await apiPage.waitForLoadState('networkidle');
  await apiPage.getByRole('searchbox', { name: 'Search stories' }).fill('cultural memory');
  assert.equal(await apiPage.locator('[data-story-id="api-long-story"] h3').innerText(), fixture.titleEn);
  assert.ok(!(await apiPage.locator('main').innerText()).includes('Level 3'), 'No visible level metadata');
  await apiPage.screenshot({ path: `${output}/long-title-375.png`, fullPage: true });
  report.checks.push('API pagination; real post IDs; available levels; broken image fallback; untruncated long titles; English title preference');
  await backend.close();

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3, reducedMotion: 'reduce' });
  await touch.addInitScript(() => sessionStorage.setItem('viecultures_pwa_dismissed', 'true'));
  await touch.route('**/api/posts/catalog?*', route => route.fulfill({ json: { items: [], totalPages: 1 } }));
  await touch.route('https://images.unsplash.com/**', route => route.abort());
  const touchPage = await touch.newPage();
  touchPage.on('pageerror', error => errors.push(error.message));
  await touchPage.goto(`${baseURL}/discovery`); await touchPage.waitForLoadState('networkidle');
  await touchPage.getByRole('button', { name: 'By place', exact: true }).tap();
  await touchPage.getByLabel('Choose a place', { exact: true }).selectOption('hue');
  await touchPage.locator('[data-story-id="imperial-hue"] .discovery-save').tap();
  assert.equal(await touchPage.locator('[data-story-id="imperial-hue"] .discovery-save').getAttribute('aria-pressed'), 'true');
  await touchPage.getByRole('group', { name: 'Explore by', exact: true }).getByRole('button', { name: 'Stories', exact: true }).tap();
  await touchPage.locator('.discovery-story--lead a').tap();
  await touchPage.waitForURL(/\/reader\?/);
  await touch.close();
  report.checks.push('Topic and ascending read-time filters; mobile touch mode switch, save, and Reader navigation');

  await openDiscovery();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('storage blocked'); }; });
  const save = page.locator('.discovery-story--lead .discovery-save');
  await save.click();
  assert.equal(await save.getAttribute('aria-pressed'), 'false');
  await page.getByText('Unable to save on this device.', { exact: false }).waitFor({ state: 'attached' });
  await page.getByText('The story service is unavailable.', { exact: false }).waitFor();
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await page.getByText('The story service is unavailable.', { exact: false }).waitFor();
  report.checks.push('Offline catalog with usable local stories; retry; storage failure does not falsely save');
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
