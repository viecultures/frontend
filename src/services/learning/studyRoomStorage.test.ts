import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readReadingHistory, saveReadingBookmark, readStudyTasks, saveStudyTasks, readingHistoryKey, type ReadingBookmark } from '@/features/home/lib/studyRoomStorage';
import { writeLearningValue } from './learningStorage';

function withStorage(check: () => void) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  } });
  try { check(); } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
}

const bookmark: ReadingBookmark = {
  id: 'imperial-hue', title: 'Inside Hue', image: '/images/landing/hue-citadel.jpg',
  topic: 'Heritage', level: 'Level 1', position: 0.42, updatedAt: 100,
};

test('returning to a story keeps its position, distinguishes levels and isolates accounts', () => withStorage(() => {
  saveReadingBookmark('learner-a', bookmark);
  saveReadingBookmark('learner-a', { ...bookmark, level: 'Level 2', position: 0.7, updatedAt: 200 });
  saveReadingBookmark('learner-a', { ...bookmark, position: 0.55, updatedAt: 300 });
  const history = readReadingHistory('learner-a');
  assert.equal(history.length, 2);
  assert.equal(history[0].level, 'Level 1');
  assert.equal(history[0].position, 0.55);
  assert.equal(history[1].position, 0.7);
  assert.deepEqual(readReadingHistory('learner-b'), []);
}));

test('malformed reading state cannot produce a fake resume card', () => withStorage(() => {
  writeLearningValue(readingHistoryKey('learner'), [null, false, {}, { ...bookmark, position: 7 }, { ...bookmark, updatedAt: 'yesterday' }, bookmark]);
  assert.deepEqual(readReadingHistory('learner'), [bookmark]);
  writeLearningValue(readingHistoryKey('learner'), { position: 0.5 });
  assert.deepEqual(readReadingHistory('learner'), []);
}));

test('study goals survive returning to the room without leaking to a second account', () => withStorage(() => {
  const tasks = [{ id: 'goal-1', label: 'Read a story', completed: false }];
  assert.equal(saveStudyTasks('learner-a', tasks), true);
  assert.deepEqual(readStudyTasks('learner-a'), tasks);
  saveStudyTasks('learner-a', [{ ...tasks[0], completed: true }]);
  assert.equal(readStudyTasks('learner-a')[0].completed, true);
  assert.deepEqual(readStudyTasks('learner-b'), []);
}));
