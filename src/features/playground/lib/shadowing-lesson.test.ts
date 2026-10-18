import test from 'node:test';
import assert from 'node:assert/strict';
import { applyDraft, draftFromLesson, extractYouTubeId, MAX_SESSION_BYTES, reconcileTakes, replayRange, sentenceSignature, takeAtTime, totalTakeBytes, validateDraft } from './shadowing-lesson';
import { shadowingSessionReducer } from '../hooks/useShadowingSession';
import type { ShadowingTake, TranscriptDraft } from '../types/shadowing';

function draft(): TranscriptDraft {
  return { videoId: 'abcdefghijk', title: 'Three minute lesson', rows: [
    { id: 'a', text: 'First sentence.', start: '2', end: '4', partStart: true, partTitle: 'Introduction' },
    { id: 'b', text: 'Second sentence.', start: '5', end: '7', partStart: false, partTitle: '' },
    { id: 'c', text: 'Another idea.', start: '62', end: '65', partStart: true, partTitle: 'Another idea' },
  ] };
}
const lesson = () => applyDraft(draft(), 180);
const take = (id = 'a'): ShadowingTake => {
  const sentence = lesson().sentences.find(s => s.id === id)!;
  return { sentenceId: id, blob: new Blob(['audio']), duration: sentence.duration, timelineStart: sentence.start, mimeType: 'audio/webm', signature: sentenceSignature(sentence), validity: 'valid' };
};

test('YouTube parser supports watch, short, embed and rejects other hosts', () => {
  for (const input of ['abcdefghijk', 'https://www.youtube.com/watch?v=abcdefghijk&t=3', 'https://youtu.be/abcdefghijk', 'https://www.youtube.com/shorts/abcdefghijk']) assert.equal(extractYouTubeId(input), 'abcdefghijk');
  assert.equal(extractYouTubeId('https://example.com/watch?v=abcdefghijk'), null);
});
test('parts cover the whole video without rebasing sentence timestamps', () => {
  const result = lesson();
  assert.deepEqual(result.parts.map(p => [p.start, p.end, p.sentenceIds]), [[0, 62, ['a', 'b']], [62, 180, ['c']]]);
  assert.equal(result.sentences[2].start, 62);
  assert.deepEqual(applyDraft(draftFromLesson(result), 180), result);
});
test('editor rejects overlap, empty timing, blank text, duplicate ID and out-of-video end', () => {
  const invalid = draft(); invalid.rows[1] = { ...invalid.rows[1], id: 'a', start: '', end: '181', text: '' };
  const errors = validateDraft(invalid, 180).join(' ');
  assert.match(errors, /ID/); assert.match(errors, /nội dung/); assert.match(errors, /đầu/); assert.match(errors, /vượt/); assert.match(errors, /chồng/);
});
test('parts can be regrouped without invalidating or copying audio payloads', () => {
  const original = lesson(), originalTake = take();
  const changed = draft(); changed.rows[1].partStart = true; changed.rows[1].partTitle = 'New section';
  const reconciled = reconcileTakes(original, applyDraft(changed, 180), { a: originalTake });
  assert.equal(reconciled.a.validity, 'valid'); assert.equal(reconciled.a.blob, originalTake.blob);
});
test('timing edits invalidate only affected take, text edits require review', () => {
  const original = lesson(), changed = draft(); changed.rows[0].text = 'Corrected text'; changed.rows[2].start = '63';
  const reconciled = reconcileTakes(original, applyDraft(changed, 180), { a: take('a'), b: take('b'), c: take('c') });
  assert.equal(reconciled.a.validity, 'needs-review'); assert.equal(reconciled.b.validity, 'valid'); assert.equal(reconciled.c.validity, 'needs-rerecord');
});
test('removed sentences and different video drop their takes', () => {
  const changed = draft(); changed.rows.splice(1, 1);
  assert.equal(reconcileTakes(lesson(), applyDraft(changed, 180), { b: take('b') }).b, undefined);
  assert.deepEqual(reconcileTakes(lesson(), { ...lesson(), videoId: 'zyxwvutsrqp' }, { a: take() }), {});
});
test('one take per sentence is preserved across parts; replacement leaves other parts untouched', () => {
  const first = take('a'), other = take('c');
  let state = { lesson: lesson(), takes: { a: first, c: other } };
  const replacement = { ...take('a'), blob: new Blob(['new']) };
  state = shadowingSessionReducer(state, { type: 'take', take: replacement }) as typeof state;
  assert.equal(state.takes.a, replacement); assert.equal(state.takes.c, other); assert.equal(Object.keys(state.takes).length, 2);
  assert.equal(totalTakeBytes(state.takes), replacement.blob.size + other.blob.size);
});
test('a stale recorder callback cannot attach audio to an edited sentence', () => {
  const state = { lesson: lesson(), takes: { a: take() } };
  const next = shadowingSessionReducer(state, { type: 'take', take: { ...take(), signature: 'old-revision' } });
  assert.equal(next, state);
});
test('global memory limit includes takes in all parts', () => {
  const state = { lesson: lesson(), takes: { c: take('c') } };
  const oversized = { ...take('a'), blob: new Blob([new Uint8Array(MAX_SESSION_BYTES)]) };
  assert.equal(shadowingSessionReducer(state, { type: 'take', take: oversized }), state);
});
test('review confirmation is allowed for text edits but not timing edits', () => {
  const state = { lesson: lesson(), takes: { a: { ...take(), validity: 'needs-review' as const }, c: { ...take('c'), validity: 'needs-rerecord' as const } } };
  assert.equal(shadowingSessionReducer(state, { type: 'confirm', sentenceId: 'a' }).takes.a.validity, 'valid');
  assert.equal(shadowingSessionReducer(state, { type: 'confirm', sentenceId: 'c' }).takes.c.validity, 'needs-rerecord');
});
test('part replay uses absolute range, skips gaps and never leaks audio from another part', () => {
  const result = lesson(), takes = { a: take('a'), c: take('c') };
  const range = replayRange(result, { kind: 'part', partId: result.parts[0].id });
  assert.equal(takeAtTime(result, takes, range, 2.5)?.offset, 0.5);
  assert.equal(takeAtTime(result, takes, range, 20), null);
  assert.equal(takeAtTime(result, takes, range, 63), null);
  assert.equal(takeAtTime(result, takes, replayRange(result, { kind: 'video' }), 63)?.take.sentenceId, 'c');
});
test('short takes become silent, invalid takes are excluded from replay', () => {
  const result = lesson(), range = { start: 0, end: 180 };
  assert.equal(takeAtTime(result, { a: { ...take(), duration: 0.2 } }, range, 3), null);
  assert.equal(takeAtTime(result, { a: { ...take(), validity: 'needs-review' } }, range, 3), null);
});
