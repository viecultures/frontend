import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  MapPin,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { paths } from '@/routes/paths';
import { getFoodArtwork } from '@/features/gamification/data/foodArtworkManifest';
import { HeritageStickerFrame } from '@/features/gamification/components/HeritageStickerFrame';
import type {
  FoodJourneyProgressDto,
  FoodStickerAwardDto,
} from '@/features/reader/types/rewardTypes';

export interface FoodStickerCardProps {
  foodId: string;
  progress?: FoodJourneyProgressDto | null;
  onInspect: (sticker: FoodStickerAwardDto) => void;
  onReconcile: (foodId: string) => void;
  isReconciling: boolean;
  isGuest: boolean;
}

function formatDate(isoString?: string | null): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return isoString;
  }
}

export const FoodStickerCard: React.FC<FoodStickerCardProps> = ({
  foodId,
  progress,
  onInspect,
  onReconcile,
  isReconciling,
  isGuest,
}) => {
  const [imageError, setImageError] = useState(false);
  const artwork = getFoodArtwork(foodId, progress?.displayName);
  const FallbackIcon = artwork.fallbackIcon;
  const artworkSrc = artwork.illustrationSrc || artwork.imageSrc;

  const isUnlocked = Boolean(
    progress?.stickerUnlocked ?? (progress as unknown as { isStickerUnlocked?: boolean })?.isStickerUnlocked
  );

  // Honest progress resolution: do not fabricate 1 or 3 when progress is unknown
  const hasProgress = Boolean(progress);
  const totalStories = hasProgress
    ? progress?.totalRequiredStories || progress?.requiredStoryIds?.length || 0
    : null;
  const completedStories = hasProgress
    ? progress?.completedStoriesCount || progress?.completedStoryIds?.length || 0
    : null;

  const progressPercent =
    totalStories !== null && totalStories > 0
      ? Math.min(100, Math.round(((completedStories || 0) / totalStories) * 100))
      : 0;

  const isEligibleForReconcile =
    !isUnlocked &&
    hasProgress &&
    totalStories !== null &&
    totalStories > 0 &&
    (completedStories || 0) >= totalStories &&
    !isGuest;

  const handleInspectClick = () => {
    if (!isUnlocked) return;
    const stickerDto: FoodStickerAwardDto = progress?.stickerAward || {
      stickerId: `award-${foodId}`,
      foodId: foodId,
      displayName: progress?.displayName || artwork.nameVi,
      ruleVersion: progress?.ruleVersion || 1,
      unlockedAt: new Date().toISOString(),
      newUnlock: false,
      requiredStoriesSnapshot: progress?.requiredStoryIds || [],
      awardSource: 'JOURNEY_RECONCILE',
    };
    onInspect(stickerDto);
  };

  return (
    <div
      className={`relative rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 border-2 ${
        isUnlocked
          ? 'bg-warm-ivory dark:bg-heritage-forest border-antique-gold/60 hover:border-antique-gold shadow-md hover:shadow-xl'
          : 'bg-stone-50/80 dark:bg-stone-900/40 border-stone-300/80 dark:border-stone-800 border-dashed opacity-90'
      }`}
    >
      {/* ── Top Header Row ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-stone-500 dark:text-stone-400">
          <MapPin size={12} className="text-antique-gold shrink-0" />
          <span className="truncate max-w-[130px]">{artwork.provinceVi}</span>
        </span>

        {isUnlocked ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 shadow-xs">
            <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>Đã Mở Khóa</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 dark:text-stone-400 bg-stone-200/60 dark:bg-stone-800 px-2.5 py-0.5 rounded-full">
            <Lock size={11} className="text-stone-400" />
            <span>Chưa Mở Khóa</span>
          </span>
        )}
      </div>

      {/* ── Center Artwork Presentation (Separated Heritage Frame) ───────── */}
      <div className="my-2 flex flex-col items-center">
        <HeritageStickerFrame
          isUnlocked={isUnlocked}
          size="md"
          lockedProgressPercent={hasProgress && totalStories !== null ? progressPercent : null}
          onClick={isUnlocked ? handleInspectClick : undefined}
          ariaLabel={isUnlocked ? `Xem chi tiết tem ${artwork.nameVi}` : `Tem ${artwork.nameVi} đang khóa`}
        >
          {artworkSrc && !imageError ? (
            <img
              src={artworkSrc}
              alt={artwork.altTextVi || artwork.nameVi}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isUnlocked
                  ? 'brightness-100 contrast-105'
                  : 'grayscale opacity-40 brightness-75 contrast-75'
              }`}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-2">
              <FallbackIcon
                size={40}
                className={isUnlocked ? 'text-heritage-green' : 'text-stone-400 dark:text-stone-600'}
              />
              <span className="text-[10px] font-sans font-medium text-stone-500 mt-1">
                {artwork.nameVi}
              </span>
            </div>
          )}
        </HeritageStickerFrame>
      </div>

      {/* ── Cuisine Identity Text ────────────────────────────────────────── */}
      <div className="text-center space-y-1 my-3">
        <h4 className="font-serif font-black text-base sm:text-lg text-heritage-green dark:text-warm-ivory truncate">
          {artwork.nameVi}
        </h4>
        <p className="text-xs text-stone-500 dark:text-stone-400 font-sans line-clamp-1 italic">
          {artwork.nameEn}
        </p>
        <p className="text-[11px] text-stone-600 dark:text-stone-400 font-sans line-clamp-2 mt-1 leading-relaxed">
          {artwork.descriptionVi}
        </p>
      </div>

      {/* ── Progress / Actions Footer ────────────────────────────────────── */}
      <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
        {isUnlocked ? (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-stone-500 font-mono">
              {progress?.stickerAward?.unlockedAt
                ? `Mở khóa: ${formatDate(progress.stickerAward.unlockedAt)}`
                : 'Đã hoàn thành'}
            </span>
            <button
              type="button"
              onClick={handleInspectClick}
              className="font-bold text-heritage-green dark:text-antique-gold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Chi tiết</span>
              <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Progress Bar & Story Count */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-sans font-medium text-stone-600 dark:text-stone-400">
                <span>Tiến trình hành trình</span>
                <span className="font-mono font-bold text-heritage-green dark:text-antique-gold">
                  {hasProgress && totalStories !== null
                    ? `${completedStories}/${totalStories} bài`
                    : '— / — bài'}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-antique-gold to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${hasProgress ? progressPercent : 0}%` }}
                />
              </div>
              {!hasProgress && (
                <p className="text-[10px] text-stone-500 dark:text-stone-400 italic">
                  {isGuest
                    ? 'Đăng nhập tài khoản để đồng bộ tiến trình'
                    : 'Đang tải dữ liệu tiến trình từ máy chủ...'}
                </p>
              )}
            </div>

            {/* Reconciliation Callout vs Standard Reader Link */}
            {isEligibleForReconcile ? (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1.5 text-center">
                <p className="text-[11px] text-amber-900 dark:text-amber-200 font-medium leading-snug">
                  Bạn đã hoàn thành đủ {totalStories}/{totalStories} bài đọc!
                </p>
                <button
                  type="button"
                  disabled={isReconciling}
                  onClick={() => onReconcile(foodId)}
                  className="w-full py-1.5 px-3 rounded-lg bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs shadow-xs transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw
                    size={13}
                    className={`text-antique-gold ${isReconciling ? 'animate-spin' : ''}`}
                  />
                  <span>{isReconciling ? 'Đang đối soát...' : 'Đối Soát & Nhận Tem'}</span>
                </button>
              </div>
            ) : (
              <Link
                to={paths.reader()}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-heritage-green/10 hover:bg-heritage-green text-heritage-green hover:text-white dark:text-antique-gold dark:hover:text-stone-900 font-bold text-xs transition-all cursor-pointer"
              >
                <BookOpen size={13} />
                <span>Khám phá bài đọc</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
