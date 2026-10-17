import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCompletionReward, completionRewardKey } from './rewardLedger';
import type { GamificationStats } from '@/types';

const initial: GamificationStats = {
  coins: 0,
  xp: 0,
  level: 'Level 1',
  streakDays: 0,
  lastActiveDate: '',
  streakProtected: false,
  streakFreezeCount: 0,
  unlockedBadges: [],
  equippedTitle: '',
  inventory: [],
  completedMissions: {},
};

test('completion grants once and persisted state rejects replay', () => {
  const key = completionRewardKey('article-1');
  const awarded = applyCompletionReward(initial, key, 40, 25)!;
  assert.equal(awarded.xp, 40);
  assert.equal(awarded.coins, 25);
  assert.equal(applyCompletionReward(JSON.parse(JSON.stringify(awarded)), key, 40, 25), null);
  assert.equal(applyCompletionReward(awarded, completionRewardKey('article-2'), 40, 25)?.xp, 80);
});

test('aliases share the same claim regardless of mode or level', () => {
  assert.equal(completionRewardKey('tet-festivities'), completionRewardKey('tet-holiday'));
  assert.equal(completionRewardKey('Dong_Ho Paintings'), completionRewardKey('dong-ho-paintings'));
});
