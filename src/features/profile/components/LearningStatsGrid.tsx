import React from 'react';
import { Flame, Award, BookMarked, Clock, ShieldCheck } from 'lucide-react';
import type { UserProfileData } from '../types';

interface LearningStatsGridProps {
  profile: UserProfileData;
  unlockedSealsCount: number;
  totalSealsCount: number;
}

export const LearningStatsGrid: React.FC<LearningStatsGridProps> = ({
  profile,
  unlockedSealsCount,
  totalSealsCount,
}) => {
  return (
    <div className="profile-stats-grid grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
      {/* 1. Daily Streak */}
      <div className="rounded-2xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 p-4 sm:p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-antique-gold transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Learning streak
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame aria-hidden="true" className="w-4 h-4 fill-current" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-black text-2xl sm:text-3xl text-heritage-green dark:text-antique-gold">
              {profile.streakDays}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              days in a row
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400">
            <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-emerald-500" />
            <span>{profile.streakFreezeAvailable} streak protection available</span>
          </div>
        </div>
      </div>

      {/* 2. Mộc Son Di Sản */}
      <div className="rounded-2xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 p-4 sm:p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-antique-gold transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Heritage passport
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#9E2A2B]/10 text-[#9E2A2B] flex items-center justify-center">
            <Award aria-hidden="true" className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-black text-2xl sm:text-3xl text-[#9E2A2B] dark:text-antique-gold">
              {unlockedSealsCount}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              / {totalSealsCount} stamps
            </span>
          </div>
          <div className="w-full bg-black/10 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#9E2A2B] dark:bg-antique-gold h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalSealsCount ? (unlockedSealsCount / totalSealsCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Vocabulary in context */}
      <div className="rounded-2xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 p-4 sm:p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-antique-gold transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Vocabulary
          </span>
          <div className="w-8 h-8 rounded-xl bg-heritage-green/10 dark:bg-antique-gold/15 text-heritage-green dark:text-antique-gold flex items-center justify-center">
            <BookMarked aria-hidden="true" className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-black text-2xl sm:text-3xl text-heritage-green dark:text-warm-ivory">
              {profile.totalVocabMastered}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              words mastered
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px] sm:text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ● {profile.totalVocabMastered} mastered
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              ● {profile.totalVocabLearning} learning
            </span>
          </div>
        </div>
      </div>

      {/* 4. Tích Lũy Thời Gian Học */}
      <div className="rounded-2xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 p-4 sm:p-5 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-antique-gold transition-all">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Learning time
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Clock aria-hidden="true" className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-black text-2xl sm:text-3xl text-heritage-green dark:text-antique-gold">
              {(profile.totalReadTimeMinutes / 60).toFixed(1)}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
              hours with cultural stories
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400">
            <span>Target: {profile.dailyTargetMinutes} min / day</span>
          </div>
        </div>
      </div>
    </div>
  );
};
