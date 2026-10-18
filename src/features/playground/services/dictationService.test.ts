import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DictationApiService,
  generateHintScaffold,
  computeLocalDictationDiff
} from './dictationService.js';

test('generateHintScaffold masks inner letters while preserving first char and punctuation', () => {
  const result = generateHintScaffold("Hello world, don't stop!");
  assert.equal(result, "H____ w____, d__'_ s___!");

  const shortWords = generateHintScaffold("I am at a loss");
  assert.equal(shortWords, "I a_ a_ a l___");
});

test('computeLocalDictationDiff accurately marks exact match as 100%', () => {
  const res = computeLocalDictationDiff(
    "I've become so numb",
    "I've become so numb"
  );
  assert.equal(res.accuracy, 100);
  assert.equal(res.matchedWords, 4);
  assert.equal(res.diff.every(d => d.status === 'correct'), true);
});

test('computeLocalDictationDiff handles missing words without misaligning following words', () => {
  const res = computeLocalDictationDiff(
    "I become so numb",
    "I have become so numb"
  );
  // 'have' should be marked missing, remaining 4 words should be correct
  assert.equal(res.matchedWords, 4);
  assert.equal(res.wordCount, 5);
  assert.equal(res.accuracy, 80);

  const missingToken = res.diff.find(d => d.status === 'missing');
  assert.ok(missingToken);
  assert.equal(missingToken?.expected, 'have');

  const correctWords = res.diff.filter(d => d.status === 'correct').map(d => d.word);
  assert.deepEqual(correctWords, ['I', 'become', 'so', 'numb']);
});

test('computeLocalDictationDiff detects typos as incorrect with expected replacement', () => {
  const res = computeLocalDictationDiff(
    "I bocome so numb",
    "I become so numb"
  );
  assert.equal(res.matchedWords, 3);
  const incorrect = res.diff.find(d => d.status === 'incorrect');
  assert.ok(incorrect);
  assert.equal(incorrect?.word, 'bocome');
  assert.equal(incorrect?.expected, 'become');
});

test('computeLocalDictationDiff matches normalized contractions (cant vs can\'t)', () => {
  const res = computeLocalDictationDiff(
    "I cant feel you there",
    "I can't feel you there"
  );
  assert.equal(res.accuracy, 100);
  assert.equal(res.matchedWords, 5);
});


test('transcript uses configured backend origin and preserves YouTube query parameters', async t => {
  const payload = { success: true, data: { videoId: 'kXYiU_JCYtU', snippets: [] } };
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const url = new URL(String(input));
    assert.equal(url.origin, 'http://localhost:8080');
    assert.equal(url.pathname, '/api/v1/ytb-transcript');
    assert.equal(url.searchParams.get('videoUrl'), 'https://www.youtube.com/watch?v=kXYiU_JCYtU');
    assert.equal(url.searchParams.get('lang'), 'en');
    assert.equal(url.searchParams.get('mode'), 'SHADOWING');
    return Response.json(payload);
  });
  const result = await new DictationApiService('http://localhost:8080/').fetchYtbTranscript('https://www.youtube.com/watch?v=kXYiU_JCYtU');
  assert.deepEqual(result.data, payload);
  assert.equal(result.error, null);
});

test('transcript 404 identifies the API route instead of blaming the video', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('Not found', { status: 404 }));
  const result = await new DictationApiService('http://localhost:8080').fetchYtbTranscript('kXYiU_JCYtU');
  assert.equal(result.data, null);
  assert.match(result.error ?? '', /HTTP 404.*backend API address and route/);
});

test('HTML fallback from frontend is not accepted as a transcript', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('<html>App</html>', { headers: { 'Content-Type': 'text/html' } }));
  const result = await new DictationApiService('').fetchYtbTranscript('kXYiU_JCYtU');
  assert.equal(result.data, null);
  assert.match(result.error ?? '', /web page instead of the API/);
});

test('offline backend and timeout have distinct actionable transcript errors', async t => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('fetch failed'); });
  const api = new DictationApiService('http://localhost:8080');
  assert.match((await api.fetchYtbTranscript('kXYiU_JCYtU')).error ?? '', /backend is running/);
  fetchMock.mock.mockImplementation(async () => { throw new DOMException('Timed out', 'AbortError'); });
  assert.match((await api.fetchYtbTranscript('kXYiU_JCYtU')).error ?? '', /timed out/);
});
