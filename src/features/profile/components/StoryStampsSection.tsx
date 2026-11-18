import React from 'react';
import {
  Sparkles,
  BookOpen,
  Calendar,
  MapPin,
  CheckCircle2,
  LogIn,
  ArrowRight,
  Stamp as StampIcon,
} from 'lucide-react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { paths } from '@/routes/paths';
import { getFoodArtwork } from '@/features/gamification/data/foodArtworkManifest';
import type { StoryStampDto } from '@/features/reader/types/rewardTypes';

export interface StoryStampsSectionProps {
  stamps: StoryStampDto[];
  isLoading: boolean;
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

export const StoryStampsSection: React.FC<StoryStampsSectionProps> = ({
  stamps,
  isLoading,
  isGuest,
}) => {
  if (isGuest) {
    return (
      <div className="p-8 rounded-3xl bg-warm-ivory dark:bg-heritage-forest border-2 border-dashed border-antique-gold/60 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-antique-gold/20 border border-antique-gold/40 flex items-center justify-center text-heritage-green dark:text-antique-gold">
          <StampIcon size={28} />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-serif text-xl font-bold text-heritage-green dark:text-warm-ivory">
            Khám Phá Bộ Sưu Tập Mộc Son
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Đăng nhập tài khoản để nhận Mộc Son đỏ thắm chứng thực mỗi khi bạn hoàn thành một bài đọc di sản.
          </p>
        </div>
        <Link
          to={paths.login()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <LogIn size={15} className="text-antique-gold" />
          <span>Đăng nhập để lưu Mộc Son</span>
        </Link>
      </div>
    );
  }

  if (isLoading && stamps.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-44 rounded-3xl bg-stone-100 dark:bg-stone-800 animate-pulse border border-stone-200 dark:border-stone-700"
          />
        ))}
      </div>
    );
  }

  if (stamps.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-warm-ivory dark:bg-heritage-forest border-2 border-dashed border-antique-gold/60 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-antique-gold/20 border border-antique-gold/40 flex items-center justify-center text-heritage-green dark:text-antique-gold">
          <StampIcon size={28} />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-serif text-xl font-bold text-heritage-green dark:text-warm-ivory">
            Chưa có Mộc Son nào trong Hộ Chiếu
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Mỗi bài đọc trong hành trình ẩm thực di sản khi được đọc kỹ sẽ mở khóa một Mộc Son trang trọng.
            Hãy bắt đầu bài đọc đầu tiên của bạn ngay hôm nay!
          </p>
        </div>
        <Link
          to={paths.reader()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-white font-sans font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <BookOpen size={15} className="text-antique-gold" />
          <span>Khám phá bài đọc di sản</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  // Group stamps by foodId
  const groupedStamps = stamps.reduce<Record<string, StoryStampDto[]>>((acc, stamp) => {
    const key = stamp.foodId || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(stamp);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groupedStamps).map(([foodKey, groupStamps]) => {
        const artwork = getFoodArtwork(foodKey);
        return (
          <div key={foodKey} className="space-y-4">
            {/* Group Header */}
            <div className="flex items-center justify-between border-b border-antique-gold/30 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-antique-gold/20 text-antique-gold border border-antique-gold/40">
                  <Sparkles size={14} />
                </span>
                <div>
                  <h4 className="font-serif font-black text-base sm:text-lg text-heritage-green dark:text-warm-ivory">
                    Hành trình {artwork.nameVi}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {artwork.provinceVi} &bull; {artwork.regionVi}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-antique-gold/15 text-stone-700 dark:text-stone-300 border border-antique-gold/30">
                {groupStamps.length} Mộc Son
              </span>
            </div>

            {/* Stamps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupStamps.map((stamp) => (
                <div
                  key={stamp.stampId}
                  className="relative rounded-2xl p-4 sm:p-5 bg-warm-ivory dark:bg-heritage-forest border border-amber-800/20 dark:border-amber-500/20 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Top Status */}
                  <div className="flex items-center justify-between mb-3 text-[11px]">
                    <span className="font-mono text-stone-400 uppercase tracking-wider text-[10px]">
                      {stamp.awardSource === 'READING_POST' ? 'Bài đọc hoàn thành' : stamp.awardSource}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full border border-terracotta/30">
                      <CheckCircle2 size={11} />
                      <span>Đã đóng dấu</span>
                    </span>
                  </div>

                  {/* Stamp Visual Emblem */}
                  <div className="my-2 py-2 flex flex-col items-center justify-center text-center">
                    <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-terracotta bg-terracotta/5 p-2 flex flex-col items-center justify-center text-terracotta shadow-xs">
                      <StampIcon size={24} className="mb-0.5 stroke-[1.5]" />
                      <span className="font-serif font-black text-[9px] uppercase tracking-wider">
                        Mộc Son Di Sản
                      </span>
                      <span className="text-[8px] font-mono opacity-80 truncate max-w-[75px]">
                        {artwork.nameVi}
                      </span>
                      <div className="absolute inset-1 rounded-full border border-terracotta/20 pointer-events-none" />
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="text-center space-y-1 mb-3">
                    <h5 className="font-serif font-bold text-sm sm:text-base text-heritage-green dark:text-warm-ivory line-clamp-2">
                      {stamp.storyTitleEn || 'Câu Chuyện Di Sản'}
                    </h5>
                    <div className="flex items-center justify-center gap-1 text-[11px] text-stone-500 font-mono pt-1">
                      <Calendar size={12} className="text-antique-gold" />
                      <span>{formatDate(stamp.awardedAt)}</span>
                    </div>
                  </div>

                  {/* Reader Link */}
                  <div className="pt-2.5 border-t border-stone-200 dark:border-stone-800">
                    <Link
                      to={paths.reader()}
                      className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-heritage-green dark:text-antique-gold hover:bg-antique-gold/10 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <BookOpen size={12} />
                      <span>Đọc lại câu chuyện</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
