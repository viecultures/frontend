import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Coins, Flame, Crown, Award, ChevronRight } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';

interface GamificationHeaderPillProps {
  className?: string;
  compact?: boolean;
}

export const GamificationHeaderPill: React.FC<GamificationHeaderPillProps> = ({
  className = '',
  compact = false,
}) => {
  const { stats, currentLevelInfo, streakMultiplier, openMissions } = useGamification();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
      onClick={openMissions}
      className={`inline-flex items-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 pl-2.5 sm:pl-3 bg-heritage-dark/80 hover:bg-heritage-dark border border-antique-gold/30 hover:border-antique-gold/60 rounded-full shadow-lg backdrop-blur-md transition-all cursor-pointer group focus-ring-dark select-none ${className}`}
      title="Bấm để xem Nhiệm vụ, Chuỗi học tập và Đổi quà"
      aria-label="Mở bảng nhiệm vụ và tiến độ học tập"
    >
      {/* 1. Cultural Coins Wallet */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-antique-gold">
        <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-antique-gold shrink-0 group-hover:rotate-12 transition-transform" />
        <span className="font-mono text-[11px] sm:text-xs tracking-tight">{stats.coins}</span>
      </div>

      {/* Mini Divider */}
      <div className="w-px h-3.5 bg-white/20" />

      {/* 2. Streak Flame */}
      <div
        className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-300"
        title={`Chuỗi ${stats.streakDays} ngày liên tiếp${streakMultiplier > 1 ? ` (Bonus ${streakMultiplier}x XP)` : ''}`}
      >
        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
        <span className="font-mono">{stats.streakDays}</span>
        {streakMultiplier > 1 && !compact && (
          <span className="hidden sm:inline-block text-[9px] px-1 rounded bg-amber-400/20 text-amber-300 font-mono">
            {streakMultiplier}x
          </span>
        )}
      </div>

      {/* Mini Divider */}
      <div className="w-px h-3.5 bg-white/20 hidden xs:block" />

      {/* 3. Level Badge with XP mini progress bar */}
      <div className="hidden xs:flex items-center gap-1.5">
        <div className="flex items-center gap-1 text-[11px] font-bold text-sky-mist">
          <Crown className="w-3 h-3 text-antique-gold shrink-0" />
          <span className="whitespace-nowrap">{currentLevelInfo.level}</span>
        </div>

        {/* Linear Mini XP Bar */}
        {!compact && (
          <div
            className="hidden md:block w-10 h-1.5 bg-white/20 rounded-full overflow-hidden"
            title={`Tiến độ: ${currentLevelInfo.levelXP}/${currentLevelInfo.neededXP} XP (${currentLevelInfo.progressPercent}%)`}
          >
            <div
              className="h-full bg-gradient-to-r from-antique-gold to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${currentLevelInfo.progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Tiny Arrow Action Indicator */}
      <div className="w-4 h-4 rounded-full bg-white/10 group-hover:bg-antique-gold group-hover:text-heritage-dark text-white/60 flex items-center justify-center transition-colors shrink-0">
        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.button>
  );
};

export default GamificationHeaderPill;
