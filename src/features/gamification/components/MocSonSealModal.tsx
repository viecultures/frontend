import { Modal } from '@/components/ui/modal';
import React, { useState, useEffect } from 'react';
import { useAppNavigate } from '@/routes/useAppNavigate';
import {
  Award,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Crown,
  BookOpen,
  UserCheck,
  LogIn,
  RotateCcw,
} from 'lucide-react';
import { getStoredUser } from '@/utils/auth-storage';
import { paths, PATHS } from '@/routes/paths';
import { profileService } from '@/features/profile/services/profileService';
import { useGamification } from '@/context/GamificationContext';
import { StreakBadge } from './StreakBadge';
import { READER_NEXT_LESSON_INFO } from '@/features/reader/data/learningLoopData';

export interface MocSonSealModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId?: string;
  articleTitle?: string;
  wordsLearnedCount?: number;
  source?: 'reader' | 'flashcard';
  onAfterStamp?: () => void;
}

/**
 * MocSonSealModal: Ceremonial Red Seal ("Mộc Son Đỏ") Activation Ritual.
 * Implements Acceptance Criteria for TASK-006:
 * 1. Cultural Red Seal stamping animation with synthesized audio resonance.
 * 2. Increments and displays continuous Daily Streak counter (Day 1, Day 2...).
 * 3. Prompts non-authenticated users to login/register to preserve their seal & streak.
 * 4. High-fidelity Warm Heritage aesthetic with Mascot praise and retention loop.
 */
export const MocSonSealModal: React.FC<MocSonSealModalProps> = ({
  isOpen,
  onClose,
  articleId = 'tet-holiday',
  articleTitle = 'Tết Cổ Truyền: Đổi Mới, Nhớ Về Cội Nguồn & Phong Vị Ba Miền',
  wordsLearnedCount = 4,
  source = 'flashcard',
  onAfterStamp,
}) => {
  const navigate = useAppNavigate();
  const { stats, recordDailyStreak, earnReward } = useGamification();

  const [isStamped, setIsStamped] = useState<boolean>(false);
  const [isAnimatingStamp, setIsAnimatingStamp] = useState<boolean>(false);
  const [stampCode, setStampCode] = useState<string>('');
  const [stampedDate, setStampedDate] = useState<string>('');
  const [streakResultMsg, setStreakResultMsg] = useState<string>('');
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    if (isOpen) {
      setUser(getStoredUser());
      // Check if this article was already stamped previously
      const seals = profileService.getCulturalSeals();
      const existing = seals.find((s) => s.id === articleId || s.postId === articleId);
      if (existing && existing.isUnlocked && existing.stampedAt) {
        setIsStamped(true);
        setStampedDate(existing.stampedAt);
        setStampCode(existing.sealCode || `VN-MOC-${Math.floor(1000 + Math.random() * 9000)}`);
      } else {
        setIsStamped(false);
        setStampedDate('');
        setStampCode(`VN-MOC-${Math.floor(1000 + Math.random() * 9000)}`);
      }
    }
  }, [isOpen, articleId]);

  if (!isOpen) return null;

  // Synthesized authentic ceremonial bronze gong / seal strike chime
  const playSealAudioRitual = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();

      // Fundamental resonance (traditional seal thump + bell chime)
      const osc = audioCtx.createOscillator();
      const strikeOsc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const strikeGain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

      strikeOsc.type = 'sine';
      strikeOsc.frequency.setValueAtTime(150, audioCtx.currentTime);
      strikeOsc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.1);
      strikeGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      strikeOsc.connect(strikeGain);
      strikeGain.connect(audioCtx.destination);

      osc.start();
      strikeOsc.start();
      osc.stop(audioCtx.currentTime + 1.2);
      strikeOsc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // AudioContext unavailable in environment
    }
  };

  const handleApplyStamp = () => {
    if (isStamped || isAnimatingStamp) return;
    setIsAnimatingStamp(true);
    playSealAudioRitual();

    setTimeout(() => {
      // 1. Unlock cultural seal in passport
      try {
        profileService.unlockSeal(articleId);
      } catch (err) {
        console.error('Failed to unlock seal in profileService:', err);
      }

      // 2. Increment and evaluate continuous daily streak
      try {
        const result = recordDailyStreak();
        setStreakResultMsg(result.message);
      } catch (err) {
        console.error('Failed to record daily streak:', err);
      }

      // 3. Award XP milestone
      try {
        void earnReward('DAILY_CHECKIN', {
          title: 'Đóng Mộc Son Hoàn Thành Bài!',
          description: `Hoàn thành bài đọc ${articleTitle} và giữ vững chuỗi học tập.`,
        });
      } catch {
        // ignore reward errors
      }

      const today = new Date();
      const dateString = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
      setStampedDate(dateString);
      setIsStamped(true);
      setIsAnimatingStamp(false);

      if (onAfterStamp) {
        onAfterStamp();
      }
    }, 700);
  };

  const handleLoginToPreserve = () => {
    onClose();
    const currentPath = window.location.pathname + window.location.search;
    navigate(paths.login({ redirect: currentPath }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đóng Mộc Son Hoàn Thành" hideHeader className="max-w-xl bg-warm-ivory text-ink-soft border-4 border-antique-gold rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8" backdropClassName="bg-black/80 backdrop-blur-md">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors cursor-pointer z-10"
          aria-label="Đóng cửa sổ"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & Heritage Certificate Ribbon */}
        <div className="text-center space-y-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-antique-gold/15 text-antique-gold font-bold text-[10px] tracking-widest uppercase border border-antique-gold/30">
            <Award className="w-3.5 h-3.5 text-antique-gold" />
            <span>Nghi Thức Văn Hóa • Vietnamese Heritage</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-heritage-green">
            Đóng Mộc Son Hoàn Thành
          </h2>
          <p className="text-xs sm:text-sm font-sans italic text-stone-600 max-w-md mx-auto line-clamp-2">
            "{articleTitle}"
          </p>
        </div>

        {/* Certificate Parchment Body */}
        <div className="relative py-6 px-4 sm:px-6 bg-rice-paper border-2 border-dashed border-antique-gold rounded-2xl max-w-lg mx-auto flex flex-col items-center justify-center min-h-[220px] shadow-inner text-center">
          {/* Daily Streak Indicator */}
          <div className="mb-4">
            <StreakBadge
              variant="pill"
              streakDays={stats.streakDays}
              showMultiplier={true}
              className="shadow-sm"
            />
          </div>

          {/* Stamped vs Stamping Action */}
          {isStamped ? (
            <div className="relative animate-in zoom-in-75 duration-500 transform hover:scale-105 transition-transform my-2">
              {/* Red Seal ("Mộc Son Đỏ") Circle */}
              <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full border-4 border-[#9E2A2B] bg-[#9E2A2B]/10 flex flex-col items-center justify-center p-3 text-[#9E2A2B] shadow-[0_0_35px_rgba(158,42,43,0.35)] rotate-[-6deg] select-none">
                <div className="w-full text-center border-b border-[#9E2A2B]/40 pb-1">
                  <span className="text-[9px] font-serif uppercase tracking-widest font-black block">
                    DI SẢN VIỆT NAM
                  </span>
                </div>
                <div className="my-1.5 py-0.5 w-full text-center border-y-2 border-[#9E2A2B]">
                  <span className="font-serif text-sm sm:text-base font-black tracking-wider block">
                    ĐÃ HOÀN THÀNH
                  </span>
                </div>
                <span className="text-[9px] font-sans uppercase tracking-wider font-bold">
                  MỘC SON BẢN SẮC
                </span>
                <span className="text-[8px] font-mono mt-1 opacity-90 block">
                  {stampCode} • {stampedDate || 'Hôm nay'}
                </span>
              </div>

              {/* Achievement badge */}
              <div className="absolute -top-1 -right-1 bg-amber-400 text-stone-900 rounded-full p-1 shadow-md animate-bounce">
                <Award className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <p className="text-xs sm:text-sm text-stone-600 max-w-xs leading-relaxed mx-auto">
                Dập con dấu <strong>Mộc Son Đỏ truyền thống</strong> để chính thức ghi nhận thành tựu bài học và kích hoạt chuỗi học tập hôm nay.
              </p>

              <button
                type="button"
                onClick={handleApplyStamp}
                disabled={isAnimatingStamp}
                className="px-8 py-3.5 rounded-full bg-[#9E2A2B] hover:bg-[#852223] text-white font-sans font-bold text-xs sm:text-sm shadow-xl border border-antique-gold transition-all transform hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2 group"
              >
                <Award className="w-4 h-4 text-antique-gold group-hover:rotate-12 transition-transform" />
                <span>{isAnimatingStamp ? 'Đang dập mộc son…' : 'Dập Mộc Son Đỏ'}</span>
              </button>
            </div>
          )}

          {/* Mascot Encouragement Box (per habit_tracking.md) */}
          {isStamped && (
            <div className="mt-4 p-3 rounded-xl bg-antique-gold/15 border border-antique-gold/30 text-left max-w-md w-full flex items-start gap-2.5 animate-in fade-in duration-300">
              <div className="w-7 h-7 rounded-full bg-antique-gold text-heritage-forest flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                <Award size={14} className="text-heritage-forest" />
              </div>
              <div className="text-xs text-stone-700">
                <p className="font-bold text-heritage-green">Mascot Đồng Hành:</p>
                <p className="mt-0.5 leading-snug">
                  "Chúc mừng bạn đã mở khóa thành công Mộc Son <strong>{articleTitle.split(':')[0]}</strong> và nắm vững {wordsLearnedCount} từ vựng mới hôm nay!"
                </p>
                {streakResultMsg && (
                  <p className="mt-1 font-semibold text-[#9E2A2B] inline-flex items-center gap-1">
                    <Flame size={13} className="text-[#9E2A2B]" /> {streakResultMsg}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── AUTH STATUS & PRESERVATION PROMPT (Acceptance Criteria 3) ── */}
        <div className="mt-5 space-y-4">
          {!user ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Bạn đang học dưới tư cách Khách
                </span>
                <p className="text-[11px] text-stone-600">
                  Đăng nhập để lưu giữ vĩnh viễn Mộc Son và Chuỗi ngày học vào Hộ Chiếu Di Sản!
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoginToPreserve}
                className="px-4 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-white text-xs font-bold shadow-md inline-flex items-center gap-1.5 shrink-0 transition-transform hover:scale-105 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-antique-gold" />
                <span>Đăng nhập lưu Mộc Son</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-center gap-2 text-xs">
              <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Mộc Son đã được bảo lưu an toàn trong Hộ Chiếu Di Sản của <strong>{user.name || user.email}</strong>.
              </span>
            </div>
          )}

          {/* Retention & Navigation Loop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(paths.profile({ tab: 'passport' }));
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-antique-gold text-heritage-green hover:bg-antique-gold/15 font-sans font-bold text-xs transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-antique-gold" />
              <span>Xem Hộ Chiếu Di Sản</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(paths.reader({ postId: 'imperial-hue' }));
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs shadow-md transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Bài tiếp theo: Cố Đô Huế</span>
              <ArrowRight className="w-4 h-4 text-antique-gold" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(PATHS.pricing);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#9E2A2B] hover:bg-[#852223] text-white font-sans font-bold text-xs shadow-md transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-yellow-300" />
              <span>Gói Plus (49k)</span>
            </button>
          </div>
        </div>
    </Modal>
  );
};

export default MocSonSealModal;
