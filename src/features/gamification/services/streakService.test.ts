import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStreakUpdate,
  getCalendarDayDiff,
  formatLocalDate,
  type StreakState,
} from './streakService';

test('streak starts at Day 1 when initialized with no prior active date', () => {
  const initial: StreakState = {
    streakDays: 0,
    lastActiveDate: '',
    streakProtected: false,
    streakFreezeCount: 0,
  };

  const result = calculateStreakUpdate(initial, '2026-10-25');
  assert.equal(result.isNewDay, true);
  assert.equal(result.nextStreak.streakDays, 1);
  assert.equal(result.nextStreak.lastActiveDate, '2026-10-25');
  assert.equal(result.status, 'STREAK_INITIALIZED');
});

test('streak does not increment multiple times on the same date', () => {
  const current: StreakState = {
    streakDays: 3,
    lastActiveDate: '2026-10-25',
    streakProtected: false,
    streakFreezeCount: 1,
  };

  const result = calculateStreakUpdate(current, '2026-10-25');
  assert.equal(result.isNewDay, false);
  assert.equal(result.nextStreak.streakDays, 3);
  assert.equal(result.status, 'ALREADY_ACTIVE_TODAY');
});

test('streak increments by 1 on consecutive calendar day', () => {
  const current: StreakState = {
    streakDays: 4,
    lastActiveDate: '2026-10-24',
    streakProtected: false,
    streakFreezeCount: 0,
  };

  const result = calculateStreakUpdate(current, '2026-10-25');
  assert.equal(result.isNewDay, true);
  assert.equal(result.nextStreak.streakDays, 5);
  assert.equal(result.nextStreak.lastActiveDate, '2026-10-25');
  assert.equal(result.status, 'STREAK_INCREMENTED');
});

test('streak freeze protects streak when 1 or more days are missed', () => {
  const current: StreakState = {
    streakDays: 7,
    lastActiveDate: '2026-10-20', // missed 5 days
    streakProtected: true,
    streakFreezeCount: 1,
  };

  const result = calculateStreakUpdate(current, '2026-10-25');
  assert.equal(result.isNewDay, true);
  assert.equal(result.nextStreak.streakDays, 8);
  assert.equal(result.nextStreak.streakProtected, false);
  assert.equal(result.status, 'STREAK_PRESERVED_BY_FREEZE');
});

test('unprotected streak resets to Day 1 when days are missed', () => {
  const current: StreakState = {
    streakDays: 12,
    lastActiveDate: '2026-10-22', // missed 3 days
    streakProtected: false,
    streakFreezeCount: 0,
  };

  const result = calculateStreakUpdate(current, '2026-10-25');
  assert.equal(result.isNewDay, true);
  assert.equal(result.nextStreak.streakDays, 1);
  assert.equal(result.status, 'STREAK_RESET');
});
