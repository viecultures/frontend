import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { ConversationTurn } from './conversation-state';
import { getConversationSuggestions } from './conversation-suggestions';

function turn(role: ConversationTurn['role'], text: string, extra: Partial<ConversationTurn> = {}): ConversationTurn {
  return { id: `${role}-${text}`, role, text, source: 'text', timestamp: new Date(0), isFinal: true, ...extra };
}

test('follow-ups appear only after a completed assistant answer', () => {
  const user = turn('user', 'Explain this story');
  assert.deepEqual(getConversationSuggestions('free-conversation', true, [user]), []);
  assert.deepEqual(getConversationSuggestions('free-conversation', true, [user, turn('agent', 'One moment', { isFinal: false })]), []);
  assert.deepEqual(getConversationSuggestions('free-conversation', true, [user, turn('agent', 'Answer', { interrupted: true })]), []);
});

test('story practice follows learner intent and selected story', () => {
  const answer = turn('agent', 'Here is an answer.');
  assert.deepEqual(getConversationSuggestions('free-conversation', false, [turn('user', 'Hello'), answer]).map(item => item.id),
    ['chooseStory', 'findTopic', 'openMap']);
  assert.deepEqual(getConversationSuggestions('free-conversation', true, [turn('user', 'Explain the meaning'), answer]).map(item => item.id),
    ['simplerStory', 'exampleStory', 'expressStory']);
  assert.deepEqual(getConversationSuggestions('free-conversation', true, [turn('user', 'Help me express my opinion'), answer]).map(item => item.id),
    ['rephraseStory', 'exampleStory', 'deeperStory']);
});

test('free talk shows a source follow-up only when the latest response includes a source', () => {
  const user = turn('user', 'Can you verify this claim?');
  const answer = turn('agent', 'I found a source.');
  assert.equal(getConversationSuggestions('open-conversation', false, [user, answer])[0].id, 'checkSource');
  const source = turn('system', '', { toolResponse: { type: 'wikipedia_sources', sources: [{ url: 'https://example.com' }] } });
  assert.equal(getConversationSuggestions('open-conversation', false, [user, source, answer])[0].id, 'discussSource');
  assert.equal(getConversationSuggestions('open-conversation', false, [user, source, answer, turn('user', 'Tell me a story'), answer])[0].id, 'continueTale');
});
