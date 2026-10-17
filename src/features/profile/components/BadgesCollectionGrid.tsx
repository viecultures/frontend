import React, { useState } from 'react';
import {
  Award,
  Compass,
  BookMarked,
  Sparkles,
  Flame,
  ShieldCheck,
  PenTool,
  Crown,
  MapPin,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import type { UserBadge, BadgeCategory } from '../types';

interface BadgesCollectionGridProps {
  badges: UserBadge[];
}

const CATEGORY_TABS: { key: 'all' | BadgeCategory; label: string }[] = [
  { key: 'all', label: 'Tất Cả' },
  { key: 'heritage', label: 'Khám Phá Di Sản' },
  { key: 'vocab', label: 'Vốn Từ Ngữ Cảnh' },
  { key: 'streak', label: 'Kỷ Luật Chuyên Cần' },
  { key: 'community', label: 'Cộng Đồng Không Phán Xét' },
];

export const BadgesCollectionGrid: React.FC<BadgesCollectionGridProps> = ({ badges }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | BadgeCategory>('all');

  const filteredBadges = badges.filter((b) => {
    if (activeCategory === 'all') return true;
    return b.category === activeCategory;
  });

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6" />;
      case 'BookMarked':
        return <BookMarked className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'PenTool':
        return <PenTool className="w-6 h-6" />;
      case 'Crown':
        return <Crown className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#F6EEDC] dark:bg-[#122A22] border border-[#D9B76A]/40 shadow-xs">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveCategory(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === tab.key
                  ? 'bg-[#1E4B43] text-[#FBF7EE] shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-[#1E4B43] dark:hover:text-[#D9B76A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          Đạt được <strong>{unlockedCount}</strong> / {badges.length} huy hiệu
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredBadges.map((badge) => {
          const progressPercent = Math.min(
            100,
            Math.round((badge.currentProgress / badge.maxProgress) * 100)
          );

          return (
            <div
              key={badge.id}
              className={`rounded-3xl p-5 border-2 flex flex-col justify-between transition-all duration-300 ${
                badge.isUnlocked
                  ? 'bg-[#FBF7EE] dark:bg-[#122A22] border-[#D9B76A] shadow-md hover:shadow-lg'
                  : 'bg-[#F6EEDC]/60 dark:bg-[#122A22]/40 border-stone-200 dark:border-stone-800 opacity-75'
              }`}
            >
              <div>
                {/* Header: Status Icon & Exp */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                      badge.isUnlocked
                        ? 'bg-[#1E4B43] text-[#D9B76A] border border-[#D9B76A]'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                    }`}
                  >
                    {renderIcon(badge.iconName)}
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#D9B76A]/20 text-[#1E4B43] dark:text-[#D9B76A] border border-[#D9B76A]/40">
                    +{badge.rewardExp} EXP
                  </span>
                </div>

                {/* Badge Title & Description */}
                <h4 className="font-serif font-bold text-base text-[#1E4B43] dark:text-[#FBF7EE] mb-1">
                  {badge.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-300 font-sans leading-relaxed line-clamp-2">
                  {badge.subtitle}
                </p>
              </div>

              {/* Progress or Unlocked Stamp */}
              <div className="mt-5 pt-3 border-t border-stone-200 dark:border-white/10">
                {badge.isUnlocked ? (
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đã đạt được</span>
                    </span>
                    <span className="font-mono text-stone-400 font-normal">
                      {badge.unlockedAt}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-500">
                      <span>Tiến độ</span>
                      <span className="font-mono">
                        {badge.currentProgress} / {badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1E4B43] dark:bg-[#D9B76A] h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
