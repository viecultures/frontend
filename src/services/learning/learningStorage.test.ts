import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readSavedVocabulary, saveVocabulary, writeLearningValue } from './learningStorage';
import { VOCAB_DATABASE } from '@/data/readerData';

test('saved vocabulary persists separately for each article and level', () => {
  const values = new Map<string, string>();
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) || null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  try {
    assert.equal(saveVocabulary('a', 'Level 1', [VOCAB_DATABASE.sacred]), true);
    assert.equal(readSavedVocabulary('a', 'Level 1')[0].word, 'sacred');
    assert.deepEqual(readSavedVocabulary('b', 'Level 1'), []);
    assert.deepEqual(readSavedVocabulary('a', 'Level 2'), []);
    saveVocabulary('a', 'Level 1', []);
    assert.deepEqual(readSavedVocabulary('a', 'Level 1'), []);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

test('blocked storage reports failure without throwing', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Storage blocked');
    },
  });
  try {
    assert.equal(writeLearningValue('anything', {}), false);
    assert.deepEqual(readSavedVocabulary('a', 'Level 1'), []);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
