import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStreakUpdate,
  formatLocalDate,
  getCalendarDayDiff,
  type StreakState,
} from './streakService';
import { profileService, INITIAL_SEALS } from '@/features/profile/services/profileService';

test('formatLocalDate formats date accurately to YYYY-MM-DD', () => {
  const d = new Date(2026, 9, 25); // Oct 25, 2026
  const formatted = formatLocalDate(d);
  assert.equal(formatted, '2026-10-25');
});

test('getCalendarDayDiff computes day difference between two dates correctly', () => {
  assert.equal(getCalendarDayDiff('2026-10-24', '2026-10-25'), 1);
  assert.equal(getCalendarDayDiff('2026-10-20', '2026-10-25'), 5);
  assert.equal(getCalendarDayDiff('2026-10-25', '2026-10-25'), 0);
});

test('profileService unlocks seal and marks it stamped with date', () => {
  const seals = profileService.unlockSeal('tet-holiday');
  const tetSeal = seals.find((s) => s.id === 'seal-tet' || s.postId === 'tet-holiday');
  assert.ok(tetSeal, 'Tet seal should be found');
  assert.equal(tetSeal.isUnlocked, true);
  assert.ok(tetSeal.stampedAt, 'Should have stampedAt timestamp');
});

test('habit loop streak preserves continuity across consecutive days', () => {
  let streak: StreakState = {
    streakDays: 1,
    lastActiveDate: '2026-10-24',
    streakProtected: false,
    streakFreezeCount: 1,
  };

  // Day 2
  const day2 = calculateStreakUpdate(streak, '2026-10-25');
  assert.equal(day2.nextStreak.streakDays, 2);
  assert.equal(day2.isNewDay, true);

  // Same day study does not double-count
  const day2Again = calculateStreakUpdate(day2.nextStreak, '2026-10-25');
  assert.equal(day2Again.nextStreak.streakDays, 2);
  assert.equal(day2Again.isNewDay, false);

  // Day 3
  const day3 = calculateStreakUpdate(day2.nextStreak, '2026-10-26');
  assert.equal(day3.nextStreak.streakDays, 3);
  assert.equal(day3.isNewDay, true);
});
