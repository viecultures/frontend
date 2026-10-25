import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  checkPassiveModeration,
  detectUsedVocab,
  getWordVariants,
  validateReflectionText,
  MIN_REFLECTION_LENGTH,
} from './reflectionsModeration';

test('checkPassiveModeration approves clean cultural reflections in English and bilingual', () => {
  const reflection1 = 'I visited Ngọ Môn Gate and felt the deep sacred spirit of ancient Vietnam.';
  const res1 = checkPassiveModeration(reflection1);
  assert.equal(res1.isClean, true);
  assert.equal(res1.status, 'published');

  const reflection2 = 'Bánh chưng reminds me of my grandmother wrapping dong leaves on New Year eve. Rất ấm áp!';
  const res2 = checkPassiveModeration(reflection2);
  assert.equal(res2.isClean, true);
  assert.equal(res2.status, 'published');
});

test('checkPassiveModeration flags commercial spam links to pending_review (EC-03.1)', () => {
  const spam1 = 'Check out this secret discount website at https://buy-cheap-stuff.xyz now!';
  const res1 = checkPassiveModeration(spam1);
  assert.equal(res1.isClean, false);
  assert.equal(res1.status, 'pending_review');
  assert.ok(res1.flaggedKeywords && res1.flaggedKeywords.length > 0);

  const spam2 = 'Play free online games and poker at www.supercasino.top today';
  const res2 = checkPassiveModeration(spam2);
  assert.equal(res2.isClean, false);
  assert.equal(res2.status, 'pending_review');
});

test('checkPassiveModeration flags toxic profanity to pending_review (EC-03.1)', () => {
  const toxicEn = 'This cultural tradition is complete bullshit and fuck everyone';
  const resEn = checkPassiveModeration(toxicEn);
  assert.equal(resEn.isClean, false);
  assert.equal(resEn.status, 'pending_review');

  const toxicVi = 'Đúng là đồ chó đẻ và khốn nạn lừa đảo';
  const resVi = checkPassiveModeration(toxicVi);
  assert.equal(resVi.isClean, false);
  assert.equal(resVi.status, 'pending_review');
});

test('validateReflectionText enforces 10 characters minimum (EC-03.3)', () => {
  assert.equal(MIN_REFLECTION_LENGTH, 10);

  // Less than 10 characters -> invalid
  const short1 = validateReflectionText('');
  assert.equal(short1.isValid, false);
  assert.equal(short1.length, 0);

  const short2 = validateReflectionText('Nice post');
  assert.equal(short2.isValid, false);
  assert.equal(short2.length, 9);
  assert.ok(short2.error?.includes('at least 10 characters'));

  // Exactly 10 characters or more -> valid
  const valid10 = validateReflectionText('1234567890');
  assert.equal(valid10.isValid, true);
  assert.equal(valid10.length, 10);

  const longValid = validateReflectionText('The architectural symmetry of the temple is stunning.');
  assert.equal(longValid.isValid, true);
});

test('detectUsedVocab recognizes exact and lemmatized word variants (EC-03.2)', () => {
  const vocabList = [
    { id: 'v1', word: 'preserve' },
    { id: 'v2', word: 'city' },
    { id: 'v3', word: 'ancestor' },
    { id: 'v4', word: 'custom' },
  ];

  // Text contains: "preserved" (lemma of preserve), "cities" (lemma of city), "ancestors" (lemma of ancestor)
  const text = 'Our ancestors built ancient cities and preserved their timeless customs.';
  const detected = detectUsedVocab(text, vocabList);

  assert.deepEqual(detected.matchedVocabIds.sort(), ['v1', 'v2', 'v3', 'v4'].sort());
  assert.deepEqual(detected.matchedWords.sort(), ['preserve', 'city', 'ancestor', 'custom'].sort());
});

test('getWordVariants handles irregulars and standard English inflections', () => {
  const cityVariants = getWordVariants('city');
  assert.ok(cityVariants.includes('cities'));

  const preserveVariants = getWordVariants('preserve');
  assert.ok(preserveVariants.includes('preserved'));
  assert.ok(preserveVariants.includes('preserving'));

  const childVariants = getWordVariants('child');
  assert.ok(childVariants.includes('children'));
});
