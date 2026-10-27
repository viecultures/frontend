import React, { useState } from 'react';
import { Flower2, Lock, CheckCircle2, MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/routes/paths';
import { ProfileSealIcon } from './ProfileSealIcon';
import { SealDetailModal } from './SealDetailModal';
import type { CulturalSeal, RegionType, UserProfileData } from '../types';

interface CulturalPassportViewProps {
  seals: CulturalSeal[];
  profile: UserProfileData;
}

export const CulturalPassportView: React.FC<CulturalPassportViewProps> = ({
  seals,
  profile,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | RegionType>('all');
  const [inspectingSeal, setInspectingSeal] = useState<CulturalSeal | null>(null);

  const filteredSeals = seals.filter((s) => {
    if (selectedRegion === 'all') return true;
    return s.region === selectedRegion;
  });

  const unlockedCount = seals.filter((s) => s.isUnlocked).length;
  const northCount = seals.filter((s) => s.region === 'north' && s.isUnlocked).length;
  const centralCount = seals.filter((s) => s.region === 'central' && s.isUnlocked).length;
  const southCount = seals.filter((s) => s.region === 'south' && s.isUnlocked).length;

  return (
    <div className="space-y-6">
      {/* 1. Cultural Passport Header Banner */}
      <div className="relative rounded-3xl bg-heritage-green text-warm-ivory p-6 sm:p-8 shadow-xl border-2 border-antique-gold overflow-hidden">
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
              <span>Your cultural passport</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-warm-ivory">
              Stories across three regions
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed">
              Explore cultural stories and collect heritage stamps along the way.
            </p>
          </div>

          {/* Passport Identity Seal Badge */}
          <div className="shrink-0 p-4 rounded-2xl bg-black/30 border border-antique-gold/50 text-center space-y-1 min-w-[200px] backdrop-blur-sm">
            <span className="text-[10px] uppercase tracking-widest text-antique-gold font-bold block">
              Passport reference
            </span>
            <div className="font-mono text-sm sm:text-base font-bold text-white tracking-widest">
              VC-PASSPORT-2026
            </div>
            <div className="text-[11px] text-stone-300 font-serif pt-1 border-t border-white/10">
              Belongs to: <strong className="text-antique-gold">{profile.name}</strong>
            </div>
          </div>
        </div>

        {/* Regional Progress Counter */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/5 py-2 px-3 rounded-xl border border-white/10">
            <span className="block text-[10px] text-stone-300 uppercase tracking-wider font-semibold">
              North
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-antique-gold">
              {northCount} / 3 stamps
            </span>
          </div>

          <div className="bg-white/5 py-2 px-3 rounded-xl border border-white/10">
            <span className="block text-[10px] text-stone-300 uppercase tracking-wider font-semibold">
              Central
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-antique-gold">
              {centralCount} / 3 stamps
            </span>
          </div>

          <div className="bg-white/5 py-2 px-3 rounded-xl border border-white/10">
            <span className="block text-[10px] text-stone-300 uppercase tracking-wider font-semibold">
              South
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-antique-gold">
              {southCount} / 3 stamps
            </span>
          </div>
        </div>
      </div>

      {/* 2. Regional Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="profile-filter-bar flex items-center gap-1.5 p-1 rounded-2xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 shadow-xs">
          <button
            type="button"
            aria-pressed={selectedRegion === 'all'}
            onClick={() => setSelectedRegion('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRegion === 'all'
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
            }`}
          >
            All ({seals.length})
          </button>
          <button
            type="button"
            aria-pressed={selectedRegion === 'north'}
            onClick={() => setSelectedRegion('north')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRegion === 'north'
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
            }`}
          >
            North
          </button>
          <button
            type="button"
            aria-pressed={selectedRegion === 'central'}
            onClick={() => setSelectedRegion('central')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRegion === 'central'
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
            }`}
          >
            Central
          </button>
          <button
            type="button"
            aria-pressed={selectedRegion === 'south'}
            onClick={() => setSelectedRegion('south')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRegion === 'south'
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green dark:hover:text-antique-gold'
            }`}
          >
            South
          </button>
        </div>

        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          Collected <strong>{unlockedCount}</strong> / {seals.length} heritage stamps
        </span>
      </div>

      {/* 3. Cultural Seals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredSeals.map((seal) => (
          <div
            key={seal.id}
            className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between border-2 ${
              seal.isUnlocked
                ? 'bg-warm-ivory dark:bg-heritage-forest border-[#9E2A2B]/40 hover:border-[#9E2A2B] shadow-sm hover:shadow-md'
                : 'bg-rice-paper/60 dark:bg-heritage-forest/50 border-stone-300 dark:border-stone-800 border-dashed opacity-80'
            }`}
          >
            {/* Top Status & Code */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-wider text-stone-400 dark:text-stone-500 uppercase">
                {seal.sealCode}
              </span>

              {seal.isUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9E2A2B] dark:text-[#E07A5F] bg-[#9E2A2B]/10 px-2 py-0.5 rounded-full border border-[#9E2A2B]/30">
                  <CheckCircle2 aria-hidden="true" className="w-3 h-3" />
                  <span>Collected</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
                  <Lock aria-hidden="true" className="w-3 h-3" />
                  <span>Locked</span>
                </span>
              )}
            </div>

            {/* Stamp Stamp Center Visual */}
            <button
              type="button"
              disabled={!seal.isUnlocked}
              aria-label={`View stamp: ${seal.titleEn}`}
              onClick={() => setInspectingSeal(seal)}
              className={`profile-stamp-button my-3 py-4 flex flex-col items-center justify-center text-center cursor-pointer group ${
                !seal.isUnlocked && 'cursor-default'
              }`}
            >
              {seal.isUnlocked ? (
                <div className="relative p-3 rounded-full border-2 border-dashed border-[#9E2A2B] bg-[#9E2A2B]/5 shadow-xs w-32 h-32 flex flex-col items-center justify-center transition-all">
                  <ProfileSealIcon postId={seal.postId} className="size-8 mb-1 text-[#9E2A2B] dark:text-[#E07A5F]" />
                  <span className="font-serif font-black text-[9px] text-[#9E2A2B] dark:text-[#E07A5F]">
                    Heritage stamp
                  </span>
                  <span className="text-[8px] font-mono text-[#9E2A2B]/80 dark:text-[#E07A5F] font-bold truncate max-w-[80px]">
                    {seal.province}
                  </span>
                  <div className="absolute inset-1 rounded-full border border-[#9E2A2B]/20 pointer-events-none" />
                </div>
              ) : (
                <div className="p-4 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-700 w-28 h-28 flex flex-col items-center justify-center text-stone-400 dark:text-stone-600">
                  <ProfileSealIcon postId={seal.postId} className="size-8 mb-1 opacity-50" />
                  <span className="text-[9px] uppercase font-bold tracking-wider">
                    Locked
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
                    Collected: {seal.stampedAt}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspectingSeal(seal)}
                    className="font-bold text-heritage-green dark:text-antique-gold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View stamp</span>
                    <ArrowRight aria-hidden="true" className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <Link
                  to={paths.reader({ postId: seal.postId })}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-heritage-green/10 hover:bg-heritage-green text-heritage-green hover:text-warm-ivory dark:text-antique-gold dark:hover:text-warm-ivory font-bold text-xs transition-all cursor-pointer"
                >
                  <BookOpen aria-hidden="true" className="w-3.5 h-3.5" />
                  <span>Explore this story</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Inspecting Seal Modal */}
      <SealDetailModal
        seal={inspectingSeal}
        isOpen={!!inspectingSeal}
        onClose={() => setInspectingSeal(null)}
      />
    </div>
  );
};
