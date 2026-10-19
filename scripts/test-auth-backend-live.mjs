// Uses the running frontend and backend; does not mock authentication or create accounts.
// Supply VIECULTURES_SMOKE_EMAIL and VIECULTURES_SMOKE_PASSWORD for an existing test account.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.UI_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.AUTH_TEST_URL || 'http://localhost:5174';
const backend = process.env.AUTH_BACKEND_URL || 'http://localhost:8080';
const email = process.env.VIECULTURES_SMOKE_EMAIL;
const password = process.env.VIECULTURES_SMOKE_PASSWORD;
assert.ok(email && password, 'Set credentials for an existing test account before running.');
const browser = await chromium.launch({ headless: true, executablePath: process.env.UI_CHROMIUM_EXECUTABLE || undefined });
try {
  for (const width of [1440, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    try {
      const page = await context.newPage();
      const errors = [];
      const apiResponses = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.url().startsWith(backend)) apiResponses.push({ path: new URL(response.url()).pathname, status: response.status() }); });
      await page.goto(`${base}/login?redirect=/profile`, { waitUntil: 'networkidle' });
      await page.getByLabel('Email / Tên Đăng Nhập', { exact: true }).fill(email);
      await page.getByLabel('Mật Khẩu / Password', { exact: true }).fill(`${password}-invalid-smoke-check`);
      const badRequest = page.waitForResponse(response => response.url() === `${backend}/api/v1/auth/login` && response.request().method() === 'POST');
      await page.getByRole('button', { name: 'Đăng Nhập Ngay', exact: true }).click();
      assert.equal((await badRequest).status(), 401);
      await page.getByRole('alert').waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem('vie_auth_token')), null);
      assert.ok(new URL(page.url()).pathname === '/login');
      await page.getByLabel('Mật Khẩu / Password', { exact: true }).fill(password);
      const loginRequest = page.waitForResponse(response => response.url() === `${backend}/api/v1/auth/login` && response.request().method() === 'POST');
      const profileRequest = page.waitForResponse(response => response.url() === `${backend}/api/v1/auth/me`).catch(async error => {
        console.error(JSON.stringify({ pathname: new URL(page.url()).pathname, apiResponses, errors, tokenPresent: await page.evaluate(() => !!localStorage.getItem('vie_auth_token')) }));
        throw error;
      });
      await page.getByRole('button', { name: 'Đăng Nhập Ngay', exact: true }).click();
      const login = await loginRequest;
      assert.equal(login.status(), 200);
      await page.waitForURL('**/profile');
      const profile = await profileRequest;
      assert.equal(profile.status(), 200);
      const data = (await profile.json()).data;
      assert.equal(data.email, email);
      await page.getByText(data.name, { exact: true }).first().waitFor();
      assert.equal(await page.evaluate(() => (localStorage.getItem('vie_auth_token') || '').split('.').length), 3);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('vie_current_user')).email), email);
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ width, rejectedPassword: 401, login: login.status(), profile: profile.status(), backend, jwtStored: true, runtimeErrors: errors.length }));
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
