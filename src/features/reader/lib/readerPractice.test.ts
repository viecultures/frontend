import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPracticeSegments, checkDictation, practiceModeFrom } from './readerPractice';
import { getDefaultReaderArticle } from '../data/defaultReaderArticle';

const base = getDefaultReaderArticle('Level 2');

test('practice comes from the same complete bilingual article and its questions', () => {
  assert.equal(base.paragraphs.length, 5);
  assert.ok(base.paragraphs.every(p => p.enText && p.viText));
  assert.equal(base.questions?.length, 2);
  assert.ok(base.questions?.every(q => q.question && q.options.some(o => o.key === q.correctKey)));
  assert.equal(buildPracticeSegments(base)[0].text, 'Tết Nguyên Đán, often called simply Tết, is described as the most important and sacred holiday in Vietnamese culture.');
});

test('sentence segmentation preserves abbreviations and skips empty paragraphs', () => {
  const segments = buildPracticeSegments({ ...base, paragraphs: [
    { orderIndex: 0, enText: ' ', viText: '' },
    { orderIndex: 1, enText: 'Dr. Tran visits Hue. He enjoys the music!', viText: '' },
  ] });
  assert.deepEqual(segments.map(s => s.text), ['Dr. Tran visits Hue.', 'He enjoys the music!']);
  assert.deepEqual(segments.map(s => s.id), ['1-0', '1-1']);
  assert.deepEqual(buildPracticeSegments({ ...base, paragraphs: [] }), []);
});

test('paragraph audio alignment remains a whole passage; no sentence timestamps are invented', () => {
  const segments = buildPracticeSegments({ ...base, paragraphs: [{
    orderIndex: 0, enText: 'First sentence. Second sentence.', viText: '', audioTimestampStart: 0, audioTimestampEnd: 4.5,
  }] });
  assert.equal(segments.length, 1);
  assert.equal(segments[0].text, 'First sentence. Second sentence.');
  assert.deepEqual(segments[0].audioRange, { start: 0, end: 4.5 });
});

test('invalid, reversed and nonfinite alignment uses text-based passages', () => {
  for (const [start, end] of [[-1, 2], [3, 2], [NaN, 5], [1, Infinity]]) {
    const segments = buildPracticeSegments({ ...base, paragraphs: [{ orderIndex: 0, enText: 'One. Two.', viText: '', audioTimestampStart: start, audioTimestampEnd: end }] });
    assert.equal(segments.length, 2);
    assert.ok(segments.every(s => !s.audioRange));
  }
});

test('dictation accepts case, punctuation, smart quotes and Unicode composition', () => {
  assert.deepEqual(checkDictation('Tết: Don’t forget family!', "tết dont forget FAMILY."), { correct: true, accuracy: 100 });
  assert.equal(checkDictation('We visit the temple.', 'we visit temple').correct, false);
});

test('dictation counts inserted, repeated and missing words instead of scoring by keywords', () => {
  assert.deepEqual(checkDictation('We visit the temple.', 'We visit temple.'), { correct: false, accuracy: 75 });
  assert.deepEqual(checkDictation('We visit the temple.', 'We visit the old temple.'), { correct: false, accuracy: 80 });
  assert.equal(checkDictation('We visit the temple.', 'temple temple temple temple').accuracy, 25);
  assert.deepEqual(checkDictation('We visit the temple.', ''), { correct: false, accuracy: 0 });
  assert.deepEqual(checkDictation('', ''), { correct: false, accuracy: 0 });
});

test('unknown practice modes open Questions and valid modes are shareable', () => {
  assert.equal(practiceModeFrom(null), 'questions');
  assert.equal(practiceModeFrom('invalid'), 'questions');
  assert.equal(practiceModeFrom('dictation'), 'dictation');
  assert.equal(practiceModeFrom('shadowing'), 'shadowing');
});
