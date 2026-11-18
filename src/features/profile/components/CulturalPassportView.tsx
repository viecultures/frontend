import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flower2,
  Lock,
  CheckCircle2,
  MapPin,
  BookOpen,
  ArrowRight,
  Stamp as StampIcon,
  Utensils,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { paths } from '@/routes/paths';
import { ProfileSealIcon } from './ProfileSealIcon';
import { SealDetailModal } from './SealDetailModal';
import { FoodStickerCard } from './FoodStickerCard';
import { StoryStampsSection } from './StoryStampsSection';
import { FoodStickerRevealModal } from '@/features/gamification/components/FoodStickerRevealModal';
import { FOOD_ARTWORK_MANIFEST } from '@/features/gamification/data/foodArtworkManifest';
import { useHeritagePassport } from '../hooks/useHeritagePassport';
import type { CulturalSeal, RegionType, UserProfileData } from '../types';
import type { FoodStickerAwardDto } from '@/features/reader/types/rewardTypes';

export type PassportCollectionTab = 'foods' | 'stamps' | 'legacy';

interface CulturalPassportViewProps {
  seals: CulturalSeal[];
  profile: UserProfileData;
  initialRegion?: 'all' | RegionType;
}

export const CulturalPassportView: React.FC<CulturalPassportViewProps> = ({
  seals,
  profile,
  initialRegion = 'all',
}) => {
  const { t } = useTranslation('profile');

  // Sub-navigation tab within Passport
  const [activeTab, setActiveTab] = useState<PassportCollectionTab>(() =>
    initialRegion !== 'all' ? 'legacy' : 'foods'
  );

  // Legacy Regional Seal States
  const [selectedRegion, setSelectedRegion] = useState<'all' | RegionType>(initialRegion);
  const [inspectingSeal, setInspectingSeal] = useState<CulturalSeal | null>(null);

  // Reward System v2 Real Data Hook
  const {
    isGuest,
    isLoading,
    error,
    stamps,
    foodProgress,
    reconcilingFoodId,
    reconcileError,
    reconcileSuccessSticker,
    refetch,
    reconcileFood,
    clearReconcileFeedback,
  } = useHeritagePassport();

  // Inspecting Food Sticker State (modal view)
  const [inspectingSticker, setInspectingSticker] = useState<FoodStickerAwardDto | null>(null);

  // Legacy counts
  const legacyUnlockedCount = seals.filter((s) => s.isUnlocked).length;
  const filteredSeals = seals.filter((s) => {
    if (selectedRegion === 'all') return true;
    return s.region === selectedRegion;
  });

  // Food Stickers counts
  const manifestFoods = Object.values(FOOD_ARTWORK_MANIFEST);
  const totalFoodsCount = manifestFoods.length;
  const unlockedFoodsCount = foodProgress.filter((p) =>
    Boolean(p.stickerUnlocked ?? (p as unknown as { isStickerUnlocked?: boolean })?.isStickerUnlocked)
  ).length;

  return (
    <div className="space-y-6">
      {/* ── 1. Cultural Passport Header Banner ─────────────────────────────── */}
      <div className="relative rounded-3xl bg-heritage-green text-warm-ivory p-5 sm:p-6 md:p-8 shadow-xl border-2 border-antique-gold overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-radial from-antique-gold/10 to-transparent pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full border-4 border-antique-gold/20 pointer-events-none flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border border-antique-gold/30 text-5xl flex items-center justify-center opacity-30 select-none">
            <Flower2 className="size-14" aria-hidden="true" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-antique-gold/20 text-antique-gold text-xs font-bold uppercase tracking-widest border border-antique-gold/40">
              <MapPin aria-hidden="true" className="w-3.5 h-3.5" />
              <span>{t('profile.passport.tag')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-warm-ivory">
              {t('profile.passport.title')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed">
              Lưu giữ toàn bộ Dấu ấn Di sản, Tem Ẩm thực và Mộc Son bài đọc được chứng thực qua hành trình học tập văn hóa.
            </p>
          </div>

          {/* Passport Identity Seal Badge */}
          <div className="w-full sm:w-auto shrink-0 p-4 rounded-2xl bg-black/30 border border-antique-gold/50 text-center space-y-1 min-w-0 sm:min-w-[190px] backdrop-blur-sm">
            <span className="text-[10px] uppercase tracking-widest text-antique-gold font-bold block">
              {t('profile.passport.reference_label')}
            </span>
            <div className="font-mono text-sm sm:text-base font-bold text-white tracking-widest">
              VC-PASSPORT-2026
            </div>
            <div className="text-[11px] text-stone-300 font-serif pt-1 border-t border-white/10 truncate">
              {t('profile.passport.belongs_to')} <strong className="text-antique-gold">{profile.name}</strong>
            </div>
          </div>
        </div>

        {/* ── 3 Unified Metric Counters ────────────────────────────────────── */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs">
          <div className="bg-white/5 py-2 px-1.5 sm:px-3 rounded-xl border border-white/10">
            <span className="block text-[9px] sm:text-[10px] text-stone-300 uppercase tracking-wider font-semibold truncate">
              Tem Ẩm Thực
            </span>
            <span className="font-serif font-bold text-xs sm:text-base text-antique-gold">
              {unlockedFoodsCount} / {totalFoodsCount}
            </span>
          </div>

          <div className="bg-white/5 py-2 px-1.5 sm:px-3 rounded-xl border border-white/10">
            <span className="block text-[9px] sm:text-[10px] text-stone-300 uppercase tracking-wider font-semibold truncate">
              Mộc Son Bài Đọc
            </span>
            <span className="font-serif font-bold text-xs sm:text-base text-antique-gold">
              {stamps.length}
            </span>
          </div>

          <div className="bg-white/5 py-2 px-1.5 sm:px-3 rounded-xl border border-white/10">
            <span className="block text-[9px] sm:text-[10px] text-stone-300 uppercase tracking-wider font-semibold truncate">
              Dấu Ấn Vùng Miền
            </span>
            <span className="font-serif font-bold text-xs sm:text-base text-antique-gold">
              {legacyUnlockedCount} / {seals.length}
            </span>
          </div>
        </div>
      </div>

      {/* ── Error Banner & Retry ─────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <RefreshCw size={12} />
            <span>Thử lại</span>
          </button>
        </div>
      )}

      {/* ── Reconcile Error Notification ──────────────────────────────────── */}
      {reconcileError && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-amber-600 shrink-0" />
            <span>{reconcileError}</span>
          </div>
          <button
            type="button"
            onClick={clearReconcileFeedback}
            className="text-stone-500 hover:text-stone-900 font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* ── Guest User Notice ────────────────────────────────────────────── */}
      {isGuest && (
        <div className="p-4 rounded-2xl bg-antique-gold/15 border border-antique-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
            <Sparkles size={16} className="text-antique-gold shrink-0" />
            <span>
              Bạn đang duyệt ở chế độ khách. Hãy đăng nhập để lưu trữ vĩnh viễn Tem Di Sản và Mộc Son vào Hộ Chiếu của bạn.
            </span>
          </div>
          <Link
            to={paths.login()}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-white font-bold transition-all shadow-xs"
          >
            Đăng nhập
          </Link>
        </div>
      )}

      {/* ── 2. Collection Switcher Tabs ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3 max-w-full">
        <div className="w-full sm:w-auto flex items-center gap-1.5 p-1 rounded-2xl bg-rice-paper dark:bg-stone-900 border border-antique-gold/40 shadow-xs overflow-x-auto max-w-full scrollbar-none">
          <button
            type="button"
            aria-pressed={activeTab === 'foods'}
            onClick={() => setActiveTab('foods')}
            className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'foods'
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
            }`}
          >
            <Utensils size={14} className={activeTab === 'foods' ? 'text-antique-gold' : ''} />
            <span>Tem Ẩm Thực Di Sản</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'foods'
                  ? 'bg-antique-gold/30 text-antique-gold'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {unlockedFoodsCount}/{totalFoodsCount}
            </span>
          </button>

          <button
            type="button"
            aria-pressed={activeTab === 'stamps'}
            onClick={() => setActiveTab('stamps')}
            className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'stamps'
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
            }`}
          >
            <StampIcon size={14} className={activeTab === 'stamps' ? 'text-antique-gold' : ''} />
            <span>Mộc Son Bài Đọc</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'stamps'
                  ? 'bg-antique-gold/30 text-antique-gold'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {stamps.length}
            </span>
          </button>

          <button
            type="button"
            aria-pressed={activeTab === 'legacy'}
            onClick={() => setActiveTab('legacy')}
            className={`shrink-0 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'legacy'
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
            }`}
          >
            <MapPin size={14} className={activeTab === 'legacy' ? 'text-antique-gold' : ''} />
            <span>Dấu Ấn Vùng Miền</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'legacy'
                  ? 'bg-antique-gold/30 text-antique-gold'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {legacyUnlockedCount}/{seals.length}
            </span>
          </button>
        </div>

        {/* Dynamic header label per tab */}
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          {activeTab === 'foods' && '6 Món ăn di sản Đồng Bằng Sông Hồng'}
          {activeTab === 'stamps' && `${stamps.length} Mộc Son chứng thực đã trao`}
          {activeTab === 'legacy' && `${legacyUnlockedCount}/${seals.length} Dấu ấn đã khám phá`}
        </span>
      </div>

      {/* ── 3. Tab Contents ──────────────────────────────────────────────── */}

      {/* TAB A: Food Stickers Collection */}
      {activeTab === 'foods' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {manifestFoods.map((food) => {
              const progress = foodProgress.find((p) => p.foodId === food.foodId);
              return (
                <FoodStickerCard
                  key={food.foodId}
                  foodId={food.foodId}
                  progress={progress}
                  onInspect={(sticker) => setInspectingSticker(sticker)}
                  onReconcile={(foodId) => void reconcileFood(foodId)}
                  isReconciling={reconcilingFoodId === food.foodId}
                  isGuest={isGuest}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* TAB B: Story Stamps Collection */}
      {activeTab === 'stamps' && (
        <StoryStampsSection stamps={stamps} isLoading={isLoading} isGuest={isGuest} />
      )}

      {/* TAB C: Regional Seals Collection (Legacy) */}
      {activeTab === 'legacy' && (
        <div className="space-y-6">
          {/* Regional Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="profile-filter-bar flex items-center gap-1.5 p-1 rounded-2xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 shadow-xs overflow-x-auto max-w-full scrollbar-none">
              <button
                type="button"
                aria-pressed={selectedRegion === 'all'}
                onClick={() => setSelectedRegion('all')}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === 'all'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
                }`}
              >
                {t('profile.passport_view.filter_count', { count: seals.length })}
              </button>
              <button
                type="button"
                aria-pressed={selectedRegion === 'north'}
                onClick={() => setSelectedRegion('north')}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === 'north'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
                }`}
              >
                {t('profile.passport.filter_north')}
              </button>
              <button
                type="button"
                aria-pressed={selectedRegion === 'central'}
                onClick={() => setSelectedRegion('central')}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === 'central'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
                }`}
              >
                {t('profile.passport.filter_central')}
              </button>
              <button
                type="button"
                aria-pressed={selectedRegion === 'south'}
                onClick={() => setSelectedRegion('south')}
                className={`shrink-0 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === 'south'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
                }`}
              >
                {t('profile.passport.filter_south')}
              </button>
            </div>
          </div>

          {/* Legacy Seals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSeals.map((seal) => (
              <div
                key={seal.id}
                className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between border-2 ${
                  seal.isUnlocked
                    ? 'bg-warm-ivory dark:bg-heritage-forest border-terracotta/40 hover:border-terracotta shadow-sm hover:shadow-md'
                    : 'bg-rice-paper/60 dark:bg-heritage-forest/50 border-stone-300 dark:border-stone-800 border-dashed opacity-80'
                }`}
              >
                {/* Top Status & Code */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono tracking-wider text-stone-400 dark:text-stone-500 uppercase">
                    {seal.sealCode}
                  </span>

                  {seal.isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full border border-terracotta/30">
                      <CheckCircle2 aria-hidden="true" className="w-3 h-3" />
                      <span>{t('profile.passport_view.collected_badge')}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
                      <Lock aria-hidden="true" className="w-3 h-3" />
                      <span>{t('profile.passport_view.locked_badge')}</span>
                    </span>
                  )}
                </div>

                {/* Stamp Stamp Center Visual */}
                <button
                  type="button"
                  disabled={!seal.isUnlocked}
                  aria-label={t('profile.passport_view.aria_view_stamp', { title: seal.titleEn })}
                  onClick={() => setInspectingSeal(seal)}
                  className={`profile-stamp-button my-3 py-4 flex flex-col items-center justify-center text-center cursor-pointer group ${
                    !seal.isUnlocked && 'cursor-default'
                  }`}
                >
                  {seal.isUnlocked ? (
                    <div className="relative p-3 rounded-full border-2 border-dashed border-terracotta bg-terracotta/5 shadow-xs w-32 h-32 flex flex-col items-center justify-center transition-all">
                      <ProfileSealIcon postId={seal.postId} className="size-8 mb-1 text-terracotta" />
                      <span className="font-serif font-black text-[9px] text-terracotta">
                        {t('profile.seal_modal.heritage_stamp')}
                      </span>
                      <span className="text-[8px] font-mono text-terracotta/80 font-bold truncate max-w-[80px]">
                        {seal.province}
                      </span>
                      <div className="absolute inset-1 rounded-full border border-terracotta/20 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="p-4 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-700 w-28 h-28 flex flex-col items-center justify-center text-stone-400 dark:text-stone-600">
                      <ProfileSealIcon postId={seal.postId} className="size-8 mb-1 opacity-50" />
                      <span className="text-[9px] uppercase font-bold tracking-wider">
                        {t('profile.passport_view.locked_badge')}
                      </span>
                    </div>
                  )}
                </button>

                {/* Title & Province */}
                <div className="text-center space-y-1 mb-4">
                  <h4 className="font-serif font-bold text-base sm:text-lg text-heritage-green dark:text-warm-ivory line-clamp-1">
                    {seal.titleEn}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-sans line-clamp-1 italic">
                    {seal.titleVi}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-stone-400 pt-0.5">
                    <MapPin aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                    <span>{seal.province}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-stone-200 dark:border-white/10 flex items-center justify-between text-xs">
                  {seal.isUnlocked ? (
                    <>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {t('profile.seal_modal.collected_at', { date: seal.stampedAt || '' })}
                      </span>
                      <button
                        type="button"
                        onClick={() => setInspectingSeal(seal)}
                        className="font-bold text-heritage-green dark:text-antique-gold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{t('profile.passport_view.view_stamp_btn')}</span>
                        <ArrowRight aria-hidden="true" className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <Link
                      to={paths.reader({ postId: seal.postId })}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-heritage-green/10 hover:bg-heritage-green text-heritage-green hover:text-warm-ivory dark:text-antique-gold dark:hover:text-warm-ivory font-bold text-xs transition-all cursor-pointer"
                    >
                      <BookOpen aria-hidden="true" className="w-3.5 h-3.5" />
                      <span>{t('profile.passport_view.explore_story_btn')}</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Detail Modal for Food Sticker ─────────────────────────────────── */}
      <FoodStickerRevealModal
        isOpen={Boolean(inspectingSticker || reconcileSuccessSticker)}
        onClose={() => {
          setInspectingSticker(null);
          clearReconcileFeedback();
        }}
        sticker={inspectingSticker || reconcileSuccessSticker}
        mode={reconcileSuccessSticker ? 'reveal' : 'view'}
      />

      {/* ── Detail Modal for Legacy Regional Seal ─────────────────────────── */}
      <SealDetailModal
        seal={inspectingSeal}
        isOpen={!!inspectingSeal}
        onClose={() => setInspectingSeal(null)}
      />
    </div>
  );
};
