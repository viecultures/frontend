import React from 'react';
import { Flame, ShieldCheck, Sparkles, Award } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';

export interface StreakBadgeProps {
  streakDays?: number;
  variant?: 'pill' | 'badge' | 'card' | 'banner';
  showMultiplier?: boolean;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

/**
 * StreakBadge: Cultural Daily Streak indicator matching Warm Heritage aesthetic.
 * Visualizes continuous daily learning progress with ceremonial flame and multiplier perks.
 */
export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streakDays: propStreakDays,
  variant = 'badge',
  showMultiplier = true,
  className = '',
  onClick,
  interactive = false,
}) => {
  const { stats, streakMultiplier, openMissions } = useGamification();
  const effectiveStreak = propStreakDays !== undefined ? propStreakDays : stats.streakDays;
  const effectiveMultiplier = streakMultiplier;
  const isProtected = stats.streakProtected || stats.streakFreezeCount > 0;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (interactive) {
      openMissions();
    }
  };

  const isClickable = Boolean(onClick || interactive);
  const Component = isClickable ? 'button' : 'div';

  // 1. Pill variant (compact for headers or toolbar rows)
  if (variant === 'pill') {
    return (
      <Component
        type={isClickable ? 'button' : undefined}
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-300 font-sans text-xs font-bold shadow-xs transition-transform ${
          isClickable ? 'hover:scale-105 cursor-pointer' : ''
        } ${className}`}
        title={`Chuỗi ${effectiveStreak} ngày liên tiếp${effectiveMultiplier > 1 ? ` (+${Math.round((effectiveMultiplier - 1) * 100)}% XP)` : ''}`}
        aria-label={`Chuỗi học tập ${effectiveStreak} ngày`}
      >
        <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
        <span className="font-mono tracking-tight">{effectiveStreak} Ngày</span>
        {showMultiplier && effectiveMultiplier > 1 && (
          <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200 font-mono">
            {effectiveMultiplier}x
          </span>
        )}
      </Component>
    );
  }

  // 2. Banner variant (for dashboard banners or reader summary)
  if (variant === 'banner') {
    return (
      <Component
        type={isClickable ? 'button' : undefined}
        onClick={handleClick}
        className={`w-full p-4 rounded-2xl border border-antique-gold/40 bg-gradient-to-r from-amber-500/10 via-warm-ivory to-orange-500/10 dark:from-heritage-forest/80 dark:to-[#1A3D34] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md ${
          isClickable ? 'hover:border-antique-gold cursor-pointer' : ''
        } ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Flame className="w-6 h-6 fill-current animate-bounce" />
          </div>
          <div className="text-left space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
                Daily Habit Loop
              </span>
              {isProtected && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Được bảo vệ
                </span>
              )}
            </div>
            <h4 className="font-sans text-base font-bold text-heritage-green dark:text-warm-ivory">
              Chuỗi Học Tập: <span className="text-[#9E2A2B] dark:text-amber-400 font-extrabold">{effectiveStreak} Ngày Liên Tiếp</span>
            </h4>
            <p className="text-xs text-ink-soft">
              {effectiveStreak >= 1
                ? 'Duy trì đều đặn 10–15 phút mỗi ngày để mở khóa trọn vẹn văn hóa di sản.'
                : 'Hoàn thành bài đọc hoặc ôn thẻ để bắt đầu Chuỗi Ngày 1 hôm nay!'}
            </p>
          </div>
        </div>

        {showMultiplier && effectiveMultiplier > 1 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-antique-gold/15 border border-antique-gold/30 text-antique-gold font-bold text-xs shrink-0">
            <Sparkles className="w-4 h-4 text-antique-gold" />
            <span>Bonus {effectiveMultiplier}x XP</span>
          </div>
        )}
      </Component>
    );
  }

  // 3. Card variant (for profile / passport / modal)
  if (variant === 'card') {
    return (
      <Component
        type={isClickable ? 'button' : undefined}
        onClick={handleClick}
        className={`p-4 rounded-2xl border-2 border-dashed border-antique-gold/60 bg-rice-paper dark:bg-heritage-forest/60 text-center space-y-2 relative overflow-hidden ${
          isClickable ? 'hover:scale-[1.02] transition-transform cursor-pointer' : ''
        } ${className}`}
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25 mx-auto">
          <Flame className="w-7 h-7 fill-current animate-pulse text-yellow-100" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-antique-gold block">
            Học Tập Bền Bỉ
          </span>
          <span className="text-2xl font-extrabold text-[#9E2A2B] dark:text-amber-400 font-serif">
            Day {effectiveStreak}
          </span>
          <p className="text-xs text-ink-soft mt-0.5">
            {effectiveStreak} ngày liên tục giữ vững ngọn lửa di sản
          </p>
        </div>
        {showMultiplier && effectiveMultiplier > 1 && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>+{Math.round((effectiveMultiplier - 1) * 100)}% Hệ số kinh nghiệm</span>
          </div>
        )}
      </Component>
    );
  }

  // 4. Default Badge variant (clean cultural stamp badge)
  return (
    <Component
      type={isClickable ? 'button' : undefined}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-antique-gold/40 bg-rice-paper dark:bg-heritage-forest/80 shadow-xs transition-all ${
        isClickable ? 'hover:border-antique-gold hover:shadow-md cursor-pointer' : ''
      } ${className}`}
      title={`Chuỗi ${effectiveStreak} ngày liên tiếp`}
      aria-label={`Chuỗi ${effectiveStreak} ngày`}
    >
      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-xs">
        <Flame className="w-4 h-4 fill-current animate-pulse" />
      </div>
      <div className="text-left">
        <span className="text-[10px] font-bold uppercase tracking-wider text-antique-gold block leading-none">
          Daily Streak
        </span>
        <span className="text-xs font-bold text-heritage-green dark:text-warm-ivory leading-tight">
          Day {effectiveStreak}
        </span>
      </div>
      {showMultiplier && effectiveMultiplier > 1 && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-200 font-bold border border-amber-500/20">
          {effectiveMultiplier}x
        </span>
      )}
    </Component>
  );
};

export default StreakBadge;
