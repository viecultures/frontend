// Optional network smoke: real IFrame SDK + official embeddable demo. Only the
// transcript response is a fixture, using the reported sentence 20–21 boundaries.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.SHADOWING_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.SHADOWING_CHROMIUM_EXECUTABLE || undefined,
  args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
const videoId = process.env.SHADOWING_VIDEO_ID || 'M7lc1UVf-VE';
const ranges = [{ start: 54.846, duration: 3.254 }, { start: 58.183, duration: 0.959 }];
await page.route('**/api/v1/ytb-transcript**', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ success: true,
  data: { videoId, title: 'Real SDK seek smoke', snippets: ranges.map((range, index) => ({ ...range, text: `Timing fixture sentence ${index + 1}.` })) } }) }));
try {
  await page.goto(`${process.env.SHADOWING_TEST_URL || 'http://127.0.0.1:5186'}/playground`);
  await page.getByRole('textbox', { name: /^(YouTube video URL|Link video YouTube)$/ }).fill(videoId);
  await page.getByRole('button', { name: /^(Open video|Lấy transcript từ BE)$/ }).click();
  await page.locator('.sh-video iframe[title="Practice video"]').waitFor({ timeout: 30000 });
  if (await page.getByRole('button', { name: 'Edit transcript', exact: true }).isVisible()) {
    await page.getByRole('button', { name: 'Edit transcript', exact: true }).click();
  }
  await page.evaluate(() => {
    const player = window.YT.get(document.querySelector('.sh-video iframe').id);
    window.__seekSmokePlayer = player; window.__seekSmokeCommands = [];
    for (const name of ['seekTo', 'pauseVideo']) {
      const original = player[name].bind(player);
      player[name] = (...args) => {
        window.__seekSmokeCommands.push({ name, args, time: player.getCurrentTime(), state: player.getPlayerState() });
        return original(...args);
      };
    }
  });
  const results = [];
  for (const index of [0, 1, 1]) {
    await page.getByRole('button', { name: 'Nghe câu', exact: true }).nth(index).click();
    // play() pauses BEFORE seeking. Only a pause AFTER the latest seek is an end.
    await page.waitForFunction(() => {
      const commands = window.__seekSmokeCommands;
      const lastSeek = commands.findLastIndex(command => command.name === 'seekTo');
      return lastSeek >= 0 && commands.slice(lastSeek + 1).some(command => command.name === 'pauseVideo');
    }, null, { timeout: 20000 });
    const pause = await page.evaluate(() => window.__seekSmokeCommands.at(-1));
    const end = ranges[index].start + ranges[index].duration;
    assert.ok(pause.time >= end - 0.000001, `Early pause: ${pause.time} < ${end}`);
    assert.ok(pause.time < end + 1, `Missed boundary: ${pause.time} > ${end} + 1s`);
    results.push({ requestedStart: ranges[index].start, requestedEnd: end, pauseCommandAt: pause.time });
    await page.waitForFunction(() => window.__seekSmokePlayer.getPlayerState() === 2);
  }
  console.log(JSON.stringify({ pass: true, videoId, results }));
} catch (error) {
  console.error(await page.locator('.sh-video-column').innerText().catch(() => 'Player not mounted'));
  throw error;
} finally { await browser.close(); }
