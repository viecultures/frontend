import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadStudyDeck, studyDeckFromArticle } from './studyDeck';
import { readerApiService } from '@/features/reader/services/readerApiService';
import { cacheArticle } from '@/features/learning/lib/learningStorage';
import type { ReadingPostItem } from '@/features/admin/types/adminTypes';

const post: ReadingPostItem = { id: 'backend-test-id', topicGroup: 'ao-dai', titleEn: 'Ao Dai', titleVi: 'Áo dài', topic: 'Crafts', level: 'A2', vocabularies: [
  { id: 'silk-id', word: 'silk', viMeaning: 'Lụa', contextSentence: 'This ao dai is made from silk.' },
  { id: 'tailor-id', word: 'tailor', viMeaning: 'Thợ may' },
] };

test('backend vocabulary, identity and level survive conversion', () => {
  const article = readerApiService.mapPostToReaderData(post);
  const deck = studyDeckFromArticle(article, 'Level 2');
  assert.equal(deck.lesson.id, post.id);
  assert.equal(deck.lesson.cefrLevel, 'Level 1');
  assert.deepEqual(deck.cards.map(card => [card.id, card.word]), [['silk-id', 'silk'], ['tailor-id', 'tailor']]);
  for (const card of deck.cards) assert.equal(card.options?.[card.correctIndex!], card.viMeaning);
});

test('local Reader and study share complete vocabulary including Tet and Sa Pa', () => {
  for (const id of ['tet-holiday', 'dong-ho-paintings', 'sapa-terraces']) {
    const article = readerApiService.getLocalArticle(id, 'Level 1')!;
    assert.ok(article?.vocabularies.length, id);
    assert.deepEqual(studyDeckFromArticle(article, 'Level 1').cards.map(card => card.id), article.vocabularies.map(word => word.id));
    if (id !== 'tet-holiday') assert.equal(article.vocabMap.sacred, undefined);
  }
});

test('direct backend link loads its words, unknown link fails, cached Reader works offline', async () => {
  const storage = new Map<string, string>();
  const oldStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => storage.get(key) || null, setItem: (key: string, value: string) => storage.set(key, value) } });
  const oldFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify(post), { status: 200 });
    assert.equal((await loadStudyDeck(post.id, 'Level 1'))?.cards[0].word, 'silk');
    globalThis.fetch = async () => new Response('', { status: 404 });
    assert.equal(await loadStudyDeck('not-a-real-article', 'Level 1'), null);
    cacheArticle(readerApiService.mapPostToReaderData(post), 'Level 1');
    assert.equal((await loadStudyDeck(post.id, 'Level 1'))?.lesson.title, 'Ao Dai');
  } finally {
    globalThis.fetch = oldFetch;
    if (oldStorage) Object.defineProperty(globalThis, 'localStorage', oldStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
