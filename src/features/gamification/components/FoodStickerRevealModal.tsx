import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { paths } from '@/routes/paths';
import {
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  MapPin,
  ArrowRight,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import type { FoodStickerAwardDto } from '@/features/reader/types/rewardTypes';
import { getFoodArtwork } from '../data/foodArtworkManifest';

export interface FoodStickerRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: FoodStickerAwardDto | null;
  onNavigatePassport?: () => void;
  mode?: 'reveal' | 'view';
}

function formatDate(isoString?: string | null): string {
  if (!isoString) {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  }
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return isoString;
  }
}

/**
 * Format story identifiers for friendly display in the snapshot badge.
 * e.g. "pho-chapter-1" -> "Chương 1", "bun-cha-2" -> "Chương 2"
 */
function formatStoryTag(storyId: string, index: number): string {
  const match = storyId.match(/chapter-(\d+)/i) || storyId.match(/-(\d+)(?:-[a-z0-9]+)?$/i);
  if (match) {
    return `Chương ${match[1]}`;
  }
  return `Bài ${index + 1}`;
}

export const FoodStickerRevealModal: React.FC<FoodStickerRevealModalProps> = ({
  isOpen,
  onClose,
  sticker,
  onNavigatePassport,
  mode = 'reveal',
}) => {
  const navigate = useAppNavigate();
  const [imageError, setImageError] = useState<boolean>(false);

  if (!sticker) return null;

  const isViewMode = mode === 'view';
  const artwork = getFoodArtwork(sticker.foodId, sticker.displayName);
  const FallbackIcon = artwork.fallbackIcon;
  const displayName = sticker.displayName || artwork.nameVi;
  const unlockedDate = formatDate(sticker.unlockedAt);
  const storiesCount = sticker.requiredStoriesSnapshot?.length || 0;

  const handleGoPassport = () => {
    onClose();
    if (onNavigatePassport) {
      onNavigatePassport();
    } else {
      navigate(paths.profile({ tab: 'passport' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isViewMode ? 'Chi Tiết Tem Ẩm Thực Di Sản' : 'Mở Khóa Tem Món Ăn Di Sản'}
      hideHeader
      className="max-w-lg bg-warm-ivory text-ink-soft border-4 border-antique-gold rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-8 selection:bg-antique-gold/20"
      backdropClassName="bg-black/80 backdrop-blur-md"
    >
      {/* Dismiss Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors cursor-pointer z-10"
        aria-label="Đóng cửa sổ"
      >
        <X className="w-5 h-5" />
      </button>

      {/* ── Ceremonial Header ──────────────────────────────────────────────── */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-antique-gold/20 border border-antique-gold/40 text-antique-gold font-sans font-bold text-[11px] uppercase tracking-wider">
          <Sparkles
            size={13}
            className={`text-antique-gold ${isViewMode ? '' : 'animate-pulse motion-reduce:animate-none'}`}
          />
          <span>{isViewMode ? 'Tem Di Sản Đã Khai Mở' : 'Thành Tựu Ẩm Thực Di Sản'}</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-black text-heritage-green tracking-tight mt-1">
          {isViewMode ? displayName : 'Khai Mở Tem Di Sản'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
          {isViewMode
            ? 'Tem di sản ẩm thực đã được chứng thực và lưu giữ trang trọng trong Hộ Chiếu Văn Hóa của bạn.'
            : 'Bạn đã hoàn thành toàn bộ các bài đọc và được trao tặng Tem Ẩm Thực chính thức.'}
        </p>
      </div>

      {/* ── Gold Reveal Visual Frame ───────────────────────────────────────── */}
      <div className="my-5 flex flex-col items-center">
        <div
          className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl p-2.5 bg-gradient-to-b from-warm-ivory via-amber-50/70 to-warm-ivory border-2 border-antique-gold shadow-2xl shadow-amber-900/15 flex flex-col items-center justify-between transition-transform duration-500 hover:scale-105 motion-reduce:hover:scale-100 motion-reduce:transition-none"
        >
          {/* Inner Decorative Stamp Border */}
          <div className="w-full h-full rounded-2xl border border-dashed border-antique-gold/60 p-2 flex flex-col items-center justify-between overflow-hidden relative">
            {/* Top Label */}
            <div className="w-full flex items-center justify-between text-[10px] font-sans font-bold text-stone-500 px-1">
              <span className="flex items-center gap-1 text-heritage-green">
                <MapPin size={11} className="text-antique-gold" />
                {artwork.provinceVi}
              </span>
              <span className="text-antique-gold font-mono">v{sticker.ruleVersion}</span>
            </div>

            {/* Central Artwork or Heritage Fallback Icon */}
            <div className="my-auto w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center bg-stone-100 border border-antique-gold/30">
              {(artwork.illustrationSrc || artwork.imageSrc) && !imageError ? (
                <img
                  src={artwork.illustrationSrc || artwork.imageSrc}
                  alt={artwork.altTextVi || displayName}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300 motion-reduce:transition-none"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-heritage-green/5 text-heritage-green">
                  <FallbackIcon size={42} className="text-heritage-green stroke-[1.5]" />
                  <span className="text-[10px] font-serif font-bold mt-1 text-antique-gold">Di Sản</span>
                </div>
              )}
            </div>

            {/* Bottom Stamp Label */}
            <div className="w-full text-center border-t border-antique-gold/30 pt-1">
              <span className="font-serif text-sm font-black text-heritage-green block truncate">
                {displayName}
              </span>
              <span className="text-[9px] font-sans font-semibold text-stone-500 uppercase tracking-widest block">
                {artwork.regionVi}
              </span>
            </div>
          </div>

          {/* Golden Seal Ribbon Badge */}
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-antique-gold text-stone-900 rounded-full p-2 shadow-lg border border-white">
            <ShieldCheck size={18} className="text-heritage-forest" />
          </div>
        </div>

        {/* Description caption */}
        <p className="text-xs text-stone-600 text-center max-w-sm mt-3 px-2 italic font-serif leading-relaxed">
          &ldquo;{artwork.descriptionVi}&rdquo;
        </p>
      </div>

      {/* ── Metadata & Verification Details ────────────────────────────────── */}
      <div className="space-y-3 bg-stone-50/80 border border-stone-200/80 rounded-2xl p-4 text-xs">
        <div className="flex items-center justify-between text-stone-700">
          <span className="flex items-center gap-1.5 font-semibold text-heritage-green">
            <Calendar size={14} className="text-antique-gold" />
            Ngày mở khóa:
          </span>
          <span className="font-medium font-mono">{unlockedDate}</span>
        </div>

        <div className="flex items-start justify-between text-stone-700 pt-2 border-t border-stone-200/60">
          <span className="flex items-center gap-1.5 font-semibold text-heritage-green shrink-0 mt-0.5">
            <BookOpen size={14} className="text-antique-gold" />
            Bài đọc đã chứng thực ({storiesCount}):
          </span>
          <div className="flex flex-wrap justify-end gap-1 max-w-[240px]">
            {sticker.requiredStoriesSnapshot && sticker.requiredStoriesSnapshot.length > 0 ? (
              sticker.requiredStoriesSnapshot.map((storyId, idx) => (
                <span
                  key={storyId}
                  className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium flex items-center gap-1"
                >
                  <CheckCircle2 size={11} className="text-emerald-600" />
                  {formatStoryTag(storyId, idx)}
                </span>
              ))
            ) : (
              <span className="text-stone-500 italic">Trọn bộ hành trình ẩm thực</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Companion Turtle Mascot Box ─────────────────────────────────────── */}
      <div className="mt-4 p-3.5 rounded-2xl bg-antique-gold/15 border border-antique-gold/30 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-warm-ivory border border-antique-gold/40 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
          <img
            src="/brand/viecultures-mascot-logo.png"
            alt="Linh vật Rùa Đội Nón Lá"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Graceful fallback to SVG icon if mascot png is not reachable
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div className="text-xs text-stone-700 leading-snug">
          <p className="font-bold text-heritage-green flex items-center gap-1">
            <Sparkles size={13} className="text-antique-gold" />
            Linh vật Rùa Đồng Hành:
          </p>
          <p className="mt-0.5">
            {isViewMode ? (
              <>Tem di sản ẩm thực của <strong>{displayName}</strong> đã được xác thực toàn bộ và lưu giữ vĩnh viễn trong Hộ Chiếu Văn Hóa của bạn.</>
            ) : (
              <>Chúc mừng bạn đã hoàn thành trọn bộ câu chuyện về <strong>{displayName}</strong>! Tem di sản ẩm thực đã được gắn trang trọng vào Hộ Chiếu Văn Hóa của bạn.</>
            )}
          </p>
        </div>
      </div>

      {/* ── Action Buttons ─────────────────────────────────────────────────── */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
        {isViewMode ? (
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg"
          >
            <CheckCircle2 size={15} className="text-antique-gold" />
            <span>Đóng</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleGoPassport}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg hover:scale-102 active:scale-98 motion-reduce:hover:scale-100 motion-reduce:transition-none"
            >
              <Award size={15} className="text-antique-gold" />
              <span>Xem Hộ Chiếu Di Sản</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-antique-gold text-heritage-green hover:bg-antique-gold/15 font-sans font-bold text-xs transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Tiếp tục học bài</span>
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default FoodStickerRevealModal;
