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
  CheckCircle2,
} from 'lucide-react';
import { profileLabel } from '../profile-copy';
import type { UserBadge, BadgeCategory } from '../types';

interface BadgesCollectionGridProps {
  badges: UserBadge[];
}

const CATEGORY_TABS: { key: 'all' | BadgeCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'heritage', label: 'Heritage' },
  { key: 'vocab', label: 'Vocabulary' },
  { key: 'streak', label: 'Learning habits' },
  { key: 'community', label: 'Community' },
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
        return <Compass aria-hidden="true" className="w-6 h-6" />;
      case 'MapPin':
        return <MapPin aria-hidden="true" className="w-6 h-6" />;
      case 'BookMarked':
        return <BookMarked aria-hidden="true" className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles aria-hidden="true" className="w-6 h-6" />;
      case 'Flame':
        return <Flame aria-hidden="true" className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck aria-hidden="true" className="w-6 h-6" />;
      case 'PenTool':
        return <PenTool aria-hidden="true" className="w-6 h-6" />;
      case 'Crown':
        return <Crown aria-hidden="true" className="w-6 h-6" />;
      default:
        return <Award aria-hidden="true" className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 shadow-xs">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              aria-pressed={activeCategory === tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === tab.key
                  ? 'bg-heritage-green text-warm-ivory shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          Unlocked <strong>{unlockedCount}</strong> / {badges.length} badges
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
                  ? 'bg-warm-ivory dark:bg-heritage-forest border-antique-gold shadow-md hover:shadow-lg'
                  : 'bg-rice-paper/60 dark:bg-heritage-forest/40 border-stone-200 dark:border-stone-800 opacity-75'
              }`}
            >
              <div>
                {/* Header: Status Icon & Exp */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                      badge.isUnlocked
                        ? 'bg-heritage-green text-antique-gold border border-antique-gold'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                    }`}
                  >
                    {renderIcon(badge.iconName)}
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-antique-gold/20 text-heritage-green dark:text-antique-gold border border-antique-gold/40">
                    +{badge.rewardExp} EXP
                  </span>
                </div>

                {/* Badge Title & Description */}
                <h4 className="font-serif font-bold text-base text-heritage-green dark:text-warm-ivory mb-1">
                  {profileLabel(badge.title)}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-300 font-sans leading-relaxed line-clamp-2">
                  {profileLabel(badge.subtitle)}
                </p>
              </div>

              {/* Progress or Unlocked Stamp */}
              <div className="mt-5 pt-3 border-t border-stone-200 dark:border-white/10">
                {badge.isUnlocked ? (
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                    <span className="font-mono text-stone-400 font-normal">
                      {badge.unlockedAt}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-stone-500">
                      <span>Progress</span>
                      <span className="font-mono">
                        {badge.currentProgress} / {badge.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-heritage-green dark:bg-antique-gold h-full rounded-full transition-all"
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
