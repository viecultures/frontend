/**
 * Daily Streak Tracking Service
 * Implements BR-06 and habit_tracking.md contracts:
 * - Consecutive daily activity increments streak
 * - Same-day activities preserve active status without duplicate increments
 * - Missed days trigger Streak Freeze protection if available, or reset streak to 1
 * - Preserves streak history across offline/guest and authenticated states
 */

export interface StreakState {
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  streakProtected: boolean;
  streakFreezeCount: number;
}

export interface StreakUpdateResult {
  nextStreak: StreakState;
  isNewDay: boolean;
  status: 'ALREADY_ACTIVE_TODAY' | 'STREAK_INCREMENTED' | 'STREAK_PRESERVED_BY_FREEZE' | 'STREAK_RESET' | 'STREAK_INITIALIZED';
  message: string;
}

/**
 * Normalizes a date to YYYY-MM-DD string in local time.
 */
export function formatLocalDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculates calendar day difference between two YYYY-MM-DD strings.
 */
export function getCalendarDayDiff(fromDateStr: string, toDateStr: string): number {
  if (!fromDateStr || !toDateStr) return 999;
  const [y1, m1, d1] = fromDateStr.split('-').map(Number);
  const [y2, m2, d2] = toDateStr.split('-').map(Number);
  const dFrom = new Date(y1, m1 - 1, d1);
  const dTo = new Date(y2, m2 - 1, d2);
  const diffTime = dTo.getTime() - dFrom.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Evaluates and returns the updated streak state based on the current active date.
 */
export function calculateStreakUpdate(
  current: StreakState,
  targetDateStr: string = formatLocalDate()
): StreakUpdateResult {
  const { streakDays, lastActiveDate, streakProtected, streakFreezeCount } = current;

  // 1. Initial streak (first time ever)
  if (!lastActiveDate) {
    const nextStreak: StreakState = {
      streakDays: Math.max(1, streakDays || 1),
      lastActiveDate: targetDateStr,
      streakProtected,
      streakFreezeCount,
    };
    return {
      nextStreak,
      isNewDay: true,
      status: 'STREAK_INITIALIZED',
      message: `Khởi đầu chuỗi học tập: Ngày 1!`,
    };
  }

  const dayDiff = getCalendarDayDiff(lastActiveDate, targetDateStr);

  // 2. Same day activity: already counted today
  if (dayDiff === 0) {
    return {
      nextStreak: {
        ...current,
        streakDays: Math.max(1, streakDays),
      },
      isNewDay: false,
      status: 'ALREADY_ACTIVE_TODAY',
      message: `Hôm nay bạn đã duy trì chuỗi ${Math.max(1, streakDays)} ngày!`,
    };
  }

  // 3. Exactly consecutive next day
  if (dayDiff === 1) {
    const nextDays = (streakDays || 0) + 1;
    return {
      nextStreak: {
        ...current,
        streakDays: nextDays,
        lastActiveDate: targetDateStr,
      },
      isNewDay: true,
      status: 'STREAK_INCREMENTED',
      message: `Tuyệt vời! Chuỗi học tập đạt ${nextDays} ngày liên tiếp!`,
    };
  }

  // 4. Missed 1 or more days: check freeze protection
  if (dayDiff > 1) {
    const hasProtection = streakProtected || streakFreezeCount > 0;
    if (hasProtection) {
      const nextFreezeCount = streakProtected
        ? streakFreezeCount
        : Math.max(0, streakFreezeCount - 1);

      const nextDays = (streakDays || 0) + 1;
      return {
        nextStreak: {
          streakDays: nextDays,
          lastActiveDate: targetDateStr,
          streakProtected: false,
          streakFreezeCount: nextFreezeCount,
        },
        isNewDay: true,
        status: 'STREAK_PRESERVED_BY_FREEZE',
        message: `Bình Giữ Chuỗi (Streak Freeze) đã bảo vệ chuỗi của bạn! Tiếp tục đạt ${nextDays} ngày!`,
      };
    }

    // 5. Unprotected streak break: restart from day 1
    return {
      nextStreak: {
        streakDays: 1,
        lastActiveDate: targetDateStr,
        streakProtected,
        streakFreezeCount,
      },
      isNewDay: true,
      status: 'STREAK_RESET',
      message: `Chuỗi học tập đã được làm mới: Ngày 1! Hãy kiên trì mỗi ngày nhé!`,
    };
  }

  // Negative diff (time traveled backwards / clock skew): preserve current
  return {
    nextStreak: current,
    isNewDay: false,
    status: 'ALREADY_ACTIVE_TODAY',
    message: `Chuỗi học tập: ${streakDays} ngày.`,
  };
}
