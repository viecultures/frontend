import { Modal } from '@/components/ui/modal';
import React, { useState, useEffect } from 'react';
import { useAppNavigate } from '@/routes/useAppNavigate';
import {
  Award,
  ArrowRight,
  CheckCircle2,
  X,
  Crown,
  UserCheck,
  LogIn,
  RotateCcw,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { getStoredUser } from '@/utils/auth-storage';
import { paths, PATHS } from '@/routes/paths';
import type { FoodStickerAwardDto, StampClaimResponse } from '@/features/reader/types/rewardTypes';

export interface MocSonSealModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId?: string;
  articleTitle?: string;
  storyId?: string | null;
  hasStamp?: boolean;
  stampAwardedAt?: string | null;
  onClaimStamp?: () => Promise<StampClaimResponse | null>;
  onAfterStamp?: (claimResp?: StampClaimResponse | null) => void;
  onOpenStickerReveal?: (sticker: FoodStickerAwardDto) => void;
  wordsLearnedCount?: number;
  source?: 'reader' | 'flashcard';
}

function formatDateDisplay(isoDateString?: string | null): string {
  if (!isoDateString) {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  }
  try {
    const d = new Date(isoDateString);
    if (isNaN(d.getTime())) return isoDateString;
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return isoDateString;
  }
}

/**
 * MocSonSealModal: Ceremonial Cultural Red Seal ("Mộc Son Đỏ v2") Ritual.
 * Aligned with Reward System v1.0 specifications:
 * 1. Cultural Red Seal stamping animation with synthesized audio resonance.
 * 2. Independent of Streak and XP milestones (Decoupled per P5c architecture).
 * 3. Server-authoritative: Plays stamp animation only upon verified newStamp=true.
 * 4. Displays already-owned state if previously awarded without replaying animations.
 * 5. Provides clear guest login prompt and idempotent error retry handling.
 */
export const MocSonSealModal: React.FC<MocSonSealModalProps> = ({
  isOpen,
  onClose,
  articleId = 'tet-holiday',
  articleTitle = 'Tết Cổ Truyền: Đổi Mới, Nhớ Về Cội Nguồn & Phong Vị Ba Miền',
  storyId,
  hasStamp = false,
  stampAwardedAt,
  onClaimStamp,
  onAfterStamp,
  onOpenStickerReveal,
  wordsLearnedCount = 4,
  source = 'reader',
}) => {
  const navigate = useAppNavigate();

  const [isStamped, setIsStamped] = useState<boolean>(Boolean(hasStamp));
  const [isNewAward, setIsNewAward] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [isAnimatingStamp, setIsAnimatingStamp] = useState<boolean>(false);
  const [stampCode, setStampCode] = useState<string>('');
  const [stampedDate, setStampedDate] = useState<string>('');
  const [claimError, setClaimError] = useState<string | null>(null);
  const [unlockedSticker, setUnlockedSticker] = useState<FoodStickerAwardDto | null>(null);
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    if (isOpen) {
      setUser(getStoredUser());
      setClaimError(null);
      setUnlockedSticker(null);
      if (hasStamp) {
        setIsStamped(true);
        setIsNewAward(false);
        setStampedDate(formatDateDisplay(stampAwardedAt));
        setStampCode(storyId ? `VN-MOC-${storyId.toUpperCase()}` : 'VN-MOC-AWARDED');
      } else {
        setIsStamped(false);
        setIsNewAward(false);
        setStampedDate('');
        setStampCode('');
      }
    }
  }, [isOpen, hasStamp, stampAwardedAt, storyId]);

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

  const handleApplyStamp = async () => {
    if (isStamped || isClaiming || isAnimatingStamp) return;

    if (!user) {
      handleLoginToPreserve();
      return;
    }

    if (!onClaimStamp) {
      setClaimError('Thiếu thông tin kết nối dịch vụ phần thưởng.');
      return;
    }

    setIsClaiming(true);
    setClaimError(null);

    try {
      const claimResp = await onClaimStamp();
      if (!claimResp) {
        throw new Error('Máy chủ không phản hồi kết quả nhận Mộc Son.');
      }

      if (claimResp.newStamp) {
        // First-time award: Play audio ritual and run stamp drop animation
        setIsAnimatingStamp(true);
        playSealAudioRitual();

        setTimeout(() => {
          setIsStamped(true);
          setIsNewAward(true);
          setStampCode(`VN-MOC-${claimResp.stampId ? claimResp.stampId.substring(0, 8).toUpperCase() : 'AWARDED'}`);
          setStampedDate(formatDateDisplay(claimResp.awardedAt));
          if (claimResp.unlockedSticker?.newUnlock) {
            setUnlockedSticker(claimResp.unlockedSticker);
          }
          setIsAnimatingStamp(false);
          setIsClaiming(false);

          if (onAfterStamp) {
            onAfterStamp(claimResp);
          }
        }, 650);
      } else {
        // Already owned: Immediately present stamped state without replaying animation
        setIsStamped(true);
        setIsNewAward(false);
        setStampCode(`VN-MOC-${claimResp.stampId ? claimResp.stampId.substring(0, 8).toUpperCase() : 'AWARDED'}`);
        setStampedDate(formatDateDisplay(claimResp.awardedAt));
        setIsClaiming(false);

        if (onAfterStamp) {
          onAfterStamp(claimResp);
        }
      }
    } catch (err: unknown) {
      setIsClaiming(false);
      setIsAnimatingStamp(false);
      if (onAfterStamp) {
        try {
          await onAfterStamp();
        } catch {
          // ignore refetch failure
        }
      }
      const msg = (err as Error)?.message || 'Không thể nhận Mộc Son. Vui lòng thử lại.';
      setClaimError(msg);
    }
  };

  const handleLoginToPreserve = () => {
    onClose();
    const currentPath = window.location.pathname + window.location.search;
    navigate(paths.login({ redirect: currentPath }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Đóng Mộc Son Hoàn Thành"
      hideHeader
      className="max-w-xl bg-warm-ivory text-ink-soft border-4 border-antique-gold rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8"
      backdropClassName="bg-black/80 backdrop-blur-md"
    >
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
          {isStamped ? 'Mộc Son Di Sản Đã Nhận' : 'Đóng Mộc Son Đỏ Di Sản'}
        </h2>
        <p className="text-xs sm:text-sm font-sans italic text-stone-600 max-w-md mx-auto line-clamp-2">
          "{articleTitle}"
        </p>
      </div>

      {/* Certificate Parchment Body */}
      <div className="relative py-6 px-4 sm:px-6 bg-rice-paper border-2 border-dashed border-antique-gold rounded-2xl max-w-lg mx-auto flex flex-col items-center justify-center min-h-[220px] shadow-inner text-center">
        {/* Error notification if claim failed */}
        {claimError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center justify-between gap-2 max-w-sm w-full">
            <div className="flex items-center gap-1.5 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{claimError}</span>
            </div>
            <button
              type="button"
              onClick={handleApplyStamp}
              disabled={isClaiming}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Thử lại</span>
            </button>
          </div>
        )}

        {/* Stamped Seal vs Stamping Action */}
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
                {stampCode || 'VN-MOC-AWARDED'} • {stampedDate || 'Hôm nay'}
              </span>
            </div>

            {/* Achievement indicator */}
            <div className="absolute -top-1 -right-1 bg-amber-400 text-stone-900 rounded-full p-1 shadow-md animate-bounce">
              <Award className="w-4 h-4" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <p className="text-xs sm:text-sm text-stone-600 max-w-xs leading-relaxed mx-auto">
              Dập con dấu <strong>Mộc Son Đỏ truyền thống</strong> để chính thức ghi nhận thành tựu khám phá câu chuyện di sản này.
            </p>

            <button
              type="button"
              onClick={handleApplyStamp}
              disabled={isClaiming || isAnimatingStamp}
              className="px-8 py-3.5 rounded-full bg-[#9E2A2B] hover:bg-[#852223] text-white font-sans font-bold text-xs sm:text-sm shadow-xl border border-antique-gold transition-all transform hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Award className="w-4 h-4 text-antique-gold group-hover:rotate-12 transition-transform" />
              <span>
                {isAnimatingStamp
                  ? 'Đang dập mộc son…'
                  : isClaiming
                  ? 'Đang kết nối máy chủ…'
                  : 'Dập Mộc Son Đỏ'}
              </span>
            </button>
          </div>
        )}

        {/* Mascot Encouragement Box */}
        {isStamped && (
          <div className="mt-4 p-3 rounded-xl bg-antique-gold/15 border border-antique-gold/30 text-left max-w-md w-full flex items-start gap-2.5 animate-in fade-in duration-300">
            <div className="w-7 h-7 rounded-full bg-antique-gold text-heritage-forest flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              <Sparkles size={14} className="text-heritage-forest" />
            </div>
            <div className="text-xs text-stone-700">
              <p className="font-bold text-heritage-green">Linh vật Rùa Đồng Hành:</p>
              <p className="mt-0.5 leading-snug">
                {isNewAward
                  ? `Chúc mừng bạn đã chính thức nhận Mộc Son "${articleTitle.split(':')[0]}" vào Hộ Chiếu Di Sản!`
                  : `Bạn đã sở hữu Mộc Son cho câu chuyện "${articleTitle.split(':')[0]}".`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Auth Status & Retention Navigation */}
      <div className="mt-5 space-y-4">
        {!user ? (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Bạn đang đọc dưới tư cách Khách
              </span>
              <p className="text-[11px] text-stone-600">
                Đăng nhập để lưu giữ vĩnh viễn Mộc Son vào Hộ Chiếu Di Sản!
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
              Mộc Son được chứng nhận cho người học: <strong>{user.name || user.email}</strong>.
            </span>
          </div>
        )}

        {/* New Food Sticker Unlock Transition Banner */}
        {unlockedSticker && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-antique-gold/25 to-amber-500/15 border-2 border-antique-gold/70 text-center animate-in fade-in zoom-in-95 duration-500 shadow-md">
            <span className="text-[11px] font-sans font-bold text-amber-900 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles size={14} className="text-amber-700 animate-pulse" />
              Mở Khóa Tem Ẩm Thực Di Sản Mới!
            </span>
            <p className="text-xs text-stone-800 font-medium mt-1">
              Bạn đã hoàn thành trọn bộ câu chuyện và mở khóa Tem <strong>{unlockedSticker.displayName}</strong>.
            </p>
            {onOpenStickerReveal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStickerReveal(unlockedSticker);
                }}
                className="mt-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-antique-gold text-white text-xs font-bold shadow-md hover:shadow-lg inline-flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Award size={15} />
                <span>Khai Mở Tem Ẩm Thực Ngay</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
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
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs shadow-md transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Tiếp tục bài học</span>
            <ArrowRight className="w-4 h-4 text-antique-gold" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MocSonSealModal;
