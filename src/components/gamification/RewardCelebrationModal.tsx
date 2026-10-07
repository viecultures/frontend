import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Coins,
  TrendingUp,
  Flame,
  Award,
  Crown,
  CheckCircle2,
  Zap,
  X,
} from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';

export const RewardCelebrationModal: React.FC = () => {
  const { activeCelebration, dismissCelebration } = useGamification();

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeCelebration) {
        dismissCelebration();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCelebration, dismissCelebration]);

  if (!activeCelebration) return null;

  const {
    title,
    subtitle,
    coinsEarned,
    xpEarned,
    bonusMultiplier,
    bonusReason,
    isLevelUp,
    newLevel,
    unlockedBadge,
  } = activeCelebration;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissCelebration}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 320 }}
          className="relative w-full max-w-md bg-heritage-dark border-2 border-antique-gold/70 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-warm-ivory z-10 overflow-hidden text-center space-y-6"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-antique-gold/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={dismissCelebration}
            className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-ring"
            aria-label="Đóng bảng phần thưởng"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Emblem Icon */}
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', damping: 15 }}
              className="relative"
            >
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-antique-gold to-antique-rich p-0.5 shadow-[0_0_30px_rgba(217,183,106,0.5)] flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-heritage-dark flex items-center justify-center">
                  {isLevelUp ? (
                    <Crown className="w-10 h-10 text-antique-gold animate-bounce" />
                  ) : unlockedBadge ? (
                    <Award className="w-10 h-10 text-antique-gold" />
                  ) : (
                    <Sparkles className="w-10 h-10 text-antique-gold" />
                  )}
                </div>
              </div>

              {/* Floating Mini Badges */}
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 text-white border-2 border-heritage-dark shadow-md">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-antique-gold bg-antique-gold/15 px-3 py-1 rounded-full border border-antique-gold/30 inline-block">
              {isLevelUp ? 'THĂNG HẠNG CẤP ĐỘ' : 'PHẦN THƯỞNG XUẤT SẮC'}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-warm-ivory leading-tight pt-1">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xs mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Level Up Special Banner */}
          {isLevelUp && newLevel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-antique-gold/30 to-amber-500/20 border border-antique-gold/50 space-y-1"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-antique-gold">
                <Crown className="w-4 h-4 fill-antique-gold" />
                <span>CHÚC MỪNG BẠN ĐÃ ĐẠT {newLevel}!</span>
              </div>
              <p className="text-[11px] text-white/90">
                Mở khóa danh hiệu mới và nhiều bài học di sản chuyên sâu.
              </p>
            </motion.div>
          )}

          {/* Reward Metrics Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Coins Earned */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="p-3.5 rounded-2xl bg-black/40 border border-antique-gold/30 flex flex-col items-center justify-center space-y-1"
            >
              <div className="p-1.5 rounded-xl bg-antique-gold/20 text-antique-gold">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white/70 uppercase">Xu Văn Hóa</span>
              <span className="font-mono text-2xl font-black text-antique-gold tracking-tight">
                +{coinsEarned}
              </span>
            </motion.div>

            {/* XP Earned */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/30 flex flex-col items-center justify-center space-y-1"
            >
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-white/70 uppercase">Kinh Nghiệm</span>
              <span className="font-mono text-2xl font-black text-emerald-400 tracking-tight">
                +{xpEarned} XP
              </span>
            </motion.div>
          </div>

          {/* Bonus Multiplier Pill / Reason */}
          {bonusReason && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white/10 rounded-full text-xs font-semibold text-amber-300 border border-white/10"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{bonusReason}</span>
            </motion.div>
          )}

          {/* Unlocked Badge Showcase */}
          {unlockedBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="p-3.5 rounded-2xl bg-rice-paper/10 border border-antique-gold/40 flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-antique-gold text-heritage-dark flex items-center justify-center font-bold shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-antique-gold uppercase block">
                  HUY HIỆU MỚI MỞ KHÓA
                </span>
                <h4 className="text-xs font-bold text-warm-ivory">{unlockedBadge.name}</h4>
                <p className="text-[10px] text-white/70 line-clamp-1">{unlockedBadge.description}</p>
              </div>
            </motion.div>
          )}

          {/* CTA Button */}
          <button
            onClick={dismissCelebration}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-antique-gold to-antique-rich text-heritage-dark font-extrabold text-sm shadow-[0_4px_20px_rgba(217,183,106,0.4)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer focus-ring"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Tuyệt Vời! Tiếp Tục Học</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RewardCelebrationModal;
