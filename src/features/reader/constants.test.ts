import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUDIO_SPEEDS,
  getActiveParagraphIndex,
  formatAudioTime,
} from './constants';

test('AUDIO_SPEEDS strictly adheres to system_constants.md invariant [1x, 0.8x, 0.5x]', () => {
  const values = AUDIO_SPEEDS.map((s) => s.value);
  assert.deepEqual(values, [1.0, 0.8, 0.5]);

  const labels = AUDIO_SPEEDS.map((s) => s.label);
  assert.deepEqual(labels, ['1x', '0.8x', '0.5x']);

  // Strictly verify no forbidden speeds are present
  const forbidden = [0.75, 1.2, 1.25, 1.5, 2.0];
  for (const f of forbidden) {
    assert.equal(values.includes(f), false, `Forbidden speed ${f} must not exist`);
  }
});

test('getActiveParagraphIndex correctly syncs with timestamped paragraphs', () => {
  const paragraphs = [
    { orderIndex: 0, audioTimestampStart: 0, audioTimestampEnd: 20 },
    { orderIndex: 1, audioTimestampStart: 20, audioTimestampEnd: 45 },
    { orderIndex: 2, audioTimestampStart: 45, audioTimestampEnd: 70 },
  ];

  // At 5s -> paragraph 0
  assert.equal(getActiveParagraphIndex(5, 70, paragraphs), 0);
  // At 20s -> paragraph 1
  assert.equal(getActiveParagraphIndex(20, 70, paragraphs), 1);
  // At 30s -> paragraph 1
  assert.equal(getActiveParagraphIndex(30, 70, paragraphs), 1);
  // At 55s -> paragraph 2
  assert.equal(getActiveParagraphIndex(55, 70, paragraphs), 2);
  // Beyond last end -> last paragraph
  assert.equal(getActiveParagraphIndex(75, 70, paragraphs), 2);
});

test('getActiveParagraphIndex falls back proportionally when timestamps are omitted', () => {
  const paragraphs = [
    { orderIndex: 0 },
    { orderIndex: 1 },
    { orderIndex: 2 },
    { orderIndex: 3 },
  ];
  const duration = 100;

  // 10s of 100s -> first quarter (0)
  assert.equal(getActiveParagraphIndex(10, duration, paragraphs), 0);
  // 30s of 100s -> second quarter (1)
  assert.equal(getActiveParagraphIndex(30, duration, paragraphs), 1);
  // 60s of 100s -> third quarter (2)
  assert.equal(getActiveParagraphIndex(60, duration, paragraphs), 2);
  // 85s of 100s -> fourth quarter (3)
  assert.equal(getActiveParagraphIndex(85, duration, paragraphs), 3);
});

test('getActiveParagraphIndex handles empty or edge case inputs safely', () => {
  assert.equal(getActiveParagraphIndex(0, 0, []), -1);
  assert.equal(getActiveParagraphIndex(10, 0, undefined), -1);
});

test('formatAudioTime formats seconds to MM:SS correctly', () => {
  assert.equal(formatAudioTime(0), '0:00');
  assert.equal(formatAudioTime(5), '0:05');
  assert.equal(formatAudioTime(65), '1:05');
  assert.equal(formatAudioTime(140), '2:20');
  assert.equal(formatAudioTime(NaN), '0:00');
  assert.equal(formatAudioTime(-10), '0:00');
});
