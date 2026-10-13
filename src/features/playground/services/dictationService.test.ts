import test from 'node:test';
import assert from 'node:assert/strict';
import {
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
