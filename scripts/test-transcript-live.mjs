// Real local backend and real YouTube; no transcript/player interception.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.SHADOWING_PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.SHADOWING_TEST_URL || 'http://127.0.0.1:5188';
const videoURL = process.env.SHADOWING_VIDEO_URL || 'https://www.youtube.com/watch?v=UtF6Jej8yb4';
await mkdir('docs/ai_log/transcript-live', { recursive: true });
const browser = await chromium.launch({headless:true,executablePath:process.env.SHADOWING_CHROMIUM_EXECUTABLE || undefined});
try {
 for(const width of [1440,375]) {
  const page = await browser.newPage({viewport:{width,height:900}});
  await page.goto(`${baseURL}/playground`, {waitUntil:'domcontentloaded'});
  await page.getByLabel('YouTube video URL',{exact:true}).fill(videoURL);
  const responsePromise=page.waitForResponse(r=>r.url().includes('/api/v1/ytb-transcript?'),{timeout:25000});
  await page.getByRole('button',{name:'Open video',exact:true}).click();
  const response=await responsePromise;
  assert.equal(response.status(),200);
  assert.equal(response.headers()['access-control-allow-origin'],new URL(baseURL).origin);
  const json=await response.json();
  assert.equal(json.success,true);
  assert.ok(json.data.snippets.length>0);
  await page.getByText('Transcript ready',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Edit transcript',exact:true}).click();
  await page.getByLabel('Nội dung câu 1',{exact:true}).waitFor();
  assert.equal(await page.locator('.sh-editor-row').count(),json.data.snippets.length);
  assert.ok((await page.getByLabel('Nội dung câu 1',{exact:true}).inputValue()).trim().length>0);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`docs/ai_log/transcript-live/editor-${width}.png`});
  console.log(JSON.stringify({width,status:response.status(),title:json.data.title,sentences:json.data.snippets.length,editorRows:await page.locator('.sh-editor-row').count(),playerNotice:await page.locator('.sh-video-column [role="alert"]').allTextContents()}));
  await page.close();
 }
} finally {await browser.close();}
