import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createReviewSession, rateCard, restoreReviewSession } from './reviewSession';
import { resolveDeckCards, resolveLessonForDeck } from '@/data/flashcardsData';

test('unknown article never becomes a different lesson or invented deck', () => {
  assert.equal(resolveLessonForDeck('unknown-backend-id'), null);
  assert.deepEqual(resolveDeckCards('unknown-backend-id'), []);
});

test('landmark deck uses its translated vocabulary, not placeholder concepts', () => {
  const cards = resolveDeckCards('sapa-terraces');
  assert.ok(cards.some(card => card.word === 'Sculpted mountain terraces'));
  assert.ok(!cards.some(card => card.word === 'heritage'));
});

test('skipping to last card cannot complete a session', () => {
  const cards = resolveDeckCards('dong-ho-paintings');
  const initial = createReviewSession(cards);
  const last = { ...initial, currentIndex: cards.length - 1 };
  const next = rateCard(last, cards[last.currentIndex].id, 'mastered');
  assert.equal(next.complete, false);
  assert.equal(next.currentIndex, 0);
});

test('all answers finish; revised ratings remain mutually exclusive', () => {
  const cards = resolveDeckCards('dong-ho-paintings');
  let session = createReviewSession(cards);
  session = rateCard(session, cards[0].id, 'review');
  session = rateCard(session, cards[0].id, 'mastered');
  session = rateCard(session, cards[1].id, 'review');
  assert.equal(session.complete, true);
  assert.deepEqual(Object.values(session.ratings).sort(), ['mastered', 'review']);
  assert.deepEqual(restoreReviewSession(JSON.parse(JSON.stringify(session)), cards), session);
});

test('changed vocabulary invalidates old completion', () => {
  const cards = resolveDeckCards('dong-ho-paintings');
  let session = createReviewSession(cards);
  for (const card of cards) session = rateCard(session, card.id, 'mastered');
  assert.equal(restoreReviewSession(session, [...cards, { ...cards[0], id: 'new' }]).complete, false);
});
