import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.UI_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.UI_BASE_URL || 'http://127.0.0.1:5198';
const output = process.env.UI_OUTPUT_DIR || 'docs/ai_log/reader-practice';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.UI_CHROMIUM_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true,
  args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
});
const errors = [];
const first = 'Tết Nguyên Đán, often called simply Tết, is described as the most important and sacred holiday in Vietnamese culture.';

async function capture(page, filename) {
  await page.evaluate(() => { window.scrollTo({ top: 0, behavior: 'instant' }); });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await page.screenshot({ path: `${output}/${filename}.png` });
}

async function switchMode(page, name) {
  await page.getByRole('tab', { name, exact: true }).click();
  await page.getByRole('tabpanel', { name, exact: true }).waitFor();
}

async function openPage(url = '/reader', denyMicrophone = false) {
  const context = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1440, height: 1050 } });
  await context.addInitScript(deny => {
    window.__spoken = [];
    window.__micStreams = [];
    window.__samples = [];
    const OriginalAudio = window.Audio;
    window.Audio = new Proxy(OriginalAudio, { construct(Target, args) { const audio = new Target(...args); window.__samples.push(audio); return audio; } });
    if (window.speechSynthesis) {
      window.speechSynthesis.speak = utterance => { window.__spoken.push(utterance.text); };
      window.speechSynthesis.cancel = () => {};
    }
    const getStream = navigator.mediaDevices?.getUserMedia.bind(navigator.mediaDevices);
    if (getStream) navigator.mediaDevices.getUserMedia = async options => {
      if (deny) throw new DOMException('Permission denied', 'NotAllowedError');
      const stream = await getStream(options); window.__micStreams.push(stream); return stream;
    };
  }, denyMicrophone);
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/api/posts/practice-test', route => route.fulfill({ json: {
    id: 'practice-test', titleEn: 'A morning in Hue', titleVi: 'Buổi sáng ở Huế', level: 'B1',
    summary: 'A story about Hue.', imageUrl: '/images/landing/hue-citadel.jpg', shadowingAudioUrl: '/audio/puck/sentence_1.wav',
    paragraphs: [
      { id: 'one', orderIndex: 0, enText: 'The city wakes slowly. People cross the bridge.', viText: 'Thành phố thức giấc chậm rãi.', audioTimestampStart: 0, audioTimestampEnd: 0.7 },
      { id: 'two', orderIndex: 1, enText: 'Families visit the market. They buy fresh flowers.', viText: 'Các gia đình đi chợ.' },
    ],
    vocabularies: [{ id: 'bridge', word: 'bridge', pos: 'noun', viMeaning: 'cây cầu', ipa: '/brɪdʒ/' }],
    questions: [{ id: 'hue-question', orderIndex: 0, question: 'What do people cross?', options: JSON.stringify([{ key: 'A', text: 'The river.' }, { key: 'B', text: 'The bridge.' }]), correctKey: 'B', explanation: 'The opening passage mentions the bridge.' }],
  } }));
  await page.route('**/api/posts/no-transcript', route => route.fulfill({ json: { id: 'no-transcript', titleEn: 'An empty article', titleVi: 'Bài trống', level: 'B1', paragraphs: [], questions: [], vocabularies: [] } }));
  await page.route('**/api/posts/bad-timing', route => route.fulfill({ json: { id: 'bad-timing', titleEn: 'Invalid timing', titleVi: 'Mốc âm thanh sai', level: 'B1', shadowingAudioUrl: '/audio/puck/sentence_1.wav', paragraphs: [{ orderIndex: 0, enText: 'A passage with invalid audio bounds.', viText: '', audioTimestampStart: 99999, audioTimestampEnd: 100001 }], questions: [], vocabularies: [] } }));
  await page.goto(base + url);
  await page.locator('.reader-desk-toolbar').waitFor();
  return { page, context };
}

try {
  const { page, context } = await openPage();
  assert.equal(await page.locator('.reader-language-sheet').count(), 2);
  assert.equal(await page.locator('.reader-dictation-component, #reader-flashcards').count(), 0);
  await page.locator('[data-article-language="en"]').getByRole('button', { name: 'sacred', exact: true }).click();
  await page.locator('.in-place-dictionary-popup').waitFor();
  await page.getByTitle('Close definition').click();
  await page.screenshot({ path: `${output}/reading-desktop.png` });
  await page.locator('.reader-workspace-switch').click();
  await page.waitForURL('**mode=practice');
  await page.getByRole('tablist', { name: 'Practice modes' }).waitFor();
  assert.equal(await page.getByRole('tab').count(), 3);
  assert.equal(await page.getByRole('heading', { name: 'Listening & Speaking', exact: true }).count(), 1);
  await page.locator('.rp-question input').first().check();
  await page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await page.getByText('Correct. Well done!', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Next question' }).click();
  await page.getByRole('button', { name: 'Previous question' }).click();
  assert.equal(await page.locator('.rp-question input').first().isChecked(), true);
  await capture(page, 'questions-desktop');

  await switchMode(page, 'Dictation');
  assert.equal((await page.locator('.rp-source').innerText()).includes(first), false, 'Dictation does not leak the transcript');
  assert.equal(await page.evaluate(() => window.__micStreams.length), 0, 'No microphone access before Record');
  await page.getByRole('button', { name: 'Play sample', exact: true }).click();
  assert.equal(await page.evaluate(() => window.__spoken.at(-1)), first, 'Untimed samples read the selected passage');
  await page.getByLabel('Your transcription').fill(first.toUpperCase());
  await page.getByRole('button', { name: 'Check transcription' }).click();
  await page.getByText('Your transcription matches.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Next passage' }).click();
  await page.getByRole('button', { name: 'Previous passage' }).click();
  assert.equal(await page.getByLabel('Your transcription').inputValue(), first.toUpperCase());
  await page.getByRole('button', { name: 'Try again', exact: true }).click();
  await capture(page, 'dictation-desktop');

  await switchMode(page, 'Shadowing');
  assert.equal((await page.locator('.rp-source').innerText()).includes(first), true);
  await page.getByRole('button', { name: 'Record my voice', exact: true }).click();
  await page.getByRole('button', { name: /^Stop recording/ }).waitFor();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: /^Stop recording/ }).click();
  await page.getByRole('heading', { name: 'Your recording', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.__micStreams.every(stream => stream.getTracks().every(track => track.readyState === 'ended'))), true, 'Recording releases the microphone');
  const voice = page.getByLabel('Your shadowing recording');
  assert.match(await voice.getAttribute('src'), /^blob:/);
  await voice.evaluate(audio => audio.play());
  await page.waitForFunction(() => document.querySelector('audio[aria-label="Your shadowing recording"]').currentTime > 0);
  await capture(page, 'shadowing-desktop');
  await page.getByRole('button', { name: 'Record again', exact: true }).click();
  await page.getByRole('button', { name: /^Stop recording/ }).waitFor();
  await switchMode(page, 'Dictation');
  await page.waitForFunction(() => window.__micStreams.every(stream => stream.getTracks().every(track => track.readyState === 'ended')));
  await switchMode(page, 'Shadowing');
  await page.getByRole('heading', { name: 'Your recording', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Next passage' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Your recording', exact: true }).count(), 0);
  await page.getByRole('button', { name: 'Previous passage' }).click();
  await page.getByRole('heading', { name: 'Your recording', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Delete recording', exact: true }).click();
  assert.equal(await voice.count(), 0);

  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const mode of ['Questions', 'Dictation', 'Shadowing']) {
      await switchMode(page, mode);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${mode} fits ${width}px`);
      if (width === 375) await page.screenshot({ path: `${output}/${mode.toLowerCase()}-mobile.png` });
    }
    console.log(`${width}px: all three practice modes fit`);
  }
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await page.screenshot({ path: `${output}/shadowing-dark.png` });
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  await page.getByRole('button', { name: 'Back to reading', exact: true }).first().click();
  await page.locator('[data-article-language="vi"]').waitFor();
  assert.equal(await page.locator('.reader-language-sheet').count(), 2);
  await context.close();
  console.log('Reading, dictionary, questions, dictation scoring, real recorder, playback, cancellation and mode state PASS');

  const api = await openPage('/reader?postId=practice-test&level=Level+2&mode=practice');
  await api.page.getByText('What do people cross?', { exact: false }).waitFor();
  await api.page.locator('.rp-question input[value="B"]').check();
  await api.page.getByRole('button', { name: 'Check answer', exact: true }).click();
  await api.page.getByText('The opening passage mentions the bridge.', { exact: true }).waitFor();
  await switchMode(api.page, 'Dictation');
  assert.equal((await api.page.locator('.rp-source').innerText()).includes('The city wakes slowly.'), false);
  await api.page.getByRole('button', { name: 'Play sample', exact: true }).click();
  await api.page.waitForFunction(() => window.__samples.some(audio => audio.src.includes('sentence_1.wav') && audio.currentTime > 0));
  await api.page.waitForFunction(() => window.__samples.at(-1).paused);
  await api.page.getByLabel('Your transcription').fill('The city wakes slowly. People cross the bridge.');
  await api.page.getByRole('button', { name: 'Check transcription' }).click();
  await api.page.getByText('Your transcription matches.', { exact: true }).waitFor();
  await api.page.getByRole('button', { name: 'Next passage' }).click();
  await api.page.getByRole('button', { name: 'Play sample', exact: true }).click();
  assert.equal(await api.page.evaluate(() => window.__spoken.at(-1)), 'Families visit the market.');
  await api.page.getByLabel('Your transcription').fill('Draft from this article');
  await switchMode(api.page, 'Questions');
  await api.page.getByRole('tab', { name: 'Questions', exact: true }).focus();
  await api.page.keyboard.press('ArrowRight');
  await api.page.getByRole('tabpanel', { name: 'Dictation', exact: true }).waitFor();
  assert.equal(await api.page.getByLabel('Your transcription').inputValue(), 'Draft from this article');
  await api.page.goto(base + '/reader?postId=no-transcript&mode=practice&practice=dictation');
  await api.page.getByRole('heading', { name: 'A transcript is needed', exact: true }).waitFor();
  assert.equal(await api.page.getByLabel('Your transcription').count(), 0);
  await api.page.goto(base + '/reader?postId=bad-timing&mode=practice&practice=dictation');
  await api.page.getByRole('button', { name: 'Play sample', exact: true }).click();
  await api.page.getByRole('alert').filter({ hasText: 'Audio timing does not match' }).waitFor();
  await api.context.close();
  console.log('API questions, real aligned audio, browser fallback, no answer leak and article reset PASS');

  const denied = await openPage('/reader?mode=extensive&practice=shadowing', true);
  await denied.page.getByRole('button', { name: 'Record my voice', exact: true }).click();
  await denied.page.getByRole('alert').filter({ hasText: 'Microphone access was denied' }).waitFor();
  assert.equal(await denied.page.getByRole('button', { name: 'Record my voice', exact: true }).isEnabled(), true);
  await switchMode(denied.page, 'Dictation');
  await denied.page.getByLabel('Your transcription').fill('Still usable after microphone denial');
  assert.equal(await denied.page.getByLabel('Your transcription').inputValue(), 'Still usable after microphone denial');
  await denied.context.close();
  assert.deepEqual(errors, []);
  console.log('Legacy extensive links, denied microphone recovery and no browser runtime errors PASS');
} finally {
  await browser.close();
}
