import type { GamificationStats } from '@/types';

export function completionRewardKey(id: string) {
  const normalized = id.trim().toLowerCase().replace(/[-_\s]+/g, '');
  return 'FLASHCARD_DECK_COMPLETED:' + (normalized === 'tetfestivities' ? 'tetholiday' : normalized);
}

export function applyCompletionReward(stats: GamificationStats, key: string, xp: number, coins: number): GamificationStats | null {
  if (!key || stats.rewardedActivities?.[key]) return null;
  return { ...stats, xp: stats.xp + xp, coins: stats.coins + coins,
    rewardedActivities: { ...stats.rewardedActivities, [key]: true } };
}
