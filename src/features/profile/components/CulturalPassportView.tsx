import React, { useState } from 'react';
import { Award, Compass, Lock, CheckCircle2, MapPin, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paths } from '@/routes/paths';
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
      <div className="relative rounded-3xl bg-[#1E4B43] text-[#FBF7EE] p-6 sm:p-8 shadow-xl border-2 border-[#D9B76A] overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-radial from-[#D9B76A]/10 to-transparent pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full border-4 border-[#D9B76A]/20 pointer-events-none flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border border-[#D9B76A]/30 text-5xl flex items-center justify-center opacity-30 select-none">
            🪷
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9B76A]/20 text-[#D9B76A] text-xs font-bold uppercase tracking-widest border border-[#D9B76A]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hộ Chiếu Văn Hóa Cá Nhân</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FBF7EE]">
              Hành Trình Khám Phá Di Sản Ba Miền
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed">
              Mỗi bài đọc song ngữ hoàn thành được dập một con dấu <strong>Mộc Son Đỏ</strong> chính thống lên Hộ chiếu. Thu thập đủ bộ Mộc Son để xác lập danh hiệu <em>Sứ Giả Văn Hóa Việt</em>.
            </p>
          </div>

          {/* Passport Identity Seal Badge */}
          <div className="shrink-0 p-4 rounded-2xl bg-black/30 border border-[#D9B76A]/50 text-center space-y-1 min-w-[200px] backdrop-blur-sm">
            <span className="text-[10px] uppercase tracking-widest text-[#D9B76A] font-bold block">
              SỐ HỘ CHIẾU DI SẢN
            </span>
            <div className="font-mono text-sm sm:text-base font-bold text-white tracking-widest">
              VC-PASSPORT-2026
            </div>
            <div className="text-[11px] text-stone-300 font-serif pt-1 border-t border-white/10">
              Chủ sở hữu: <strong className="text-[#D9B76A]">{profile.name}</strong>
            </div>
          </div>
        </div>

        {/* Regional Progress Counter */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/5 py-2 px-3 rounded-xl border border-white/10">
            <span className="block text-[10px] text-stone-300 uppercase tracking-wider font-semibold">
              Miền Bắc
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-[#D9B76A]">
              {northCount} / 3 Mộc
            </span>
          </div>

          <div className="bg-white/5 py-2 px-3 rounded-xl border border-white/10">
            <span className="block text-[10px] text-stone-300 uppercase tracking-wider font-semibold">
              Miền Trung
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-[#D9B76A]">
              {centralCount} / 3 Mộc
            </span>
          </div>

          <div className="bg-white/5 py-2 px-3 rounded-xl border border-white/10">
            <span className="block text-[10px] text-stone-300 uppercase tracking-wider font-semibold">
              Miền Nam
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-[#D9B76A]">
              {southCount} / 3 Mộc
            </span>
          </div>
        </div>
      </div>

      {/* 2. Regional Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F6EEDC] dark:bg-[#122A22] border border-[#D9B76A]/40 shadow-xs">
          <button
            type="button"
            onClick={() => setSelectedRegion('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRegion === 'all'
                ? 'bg-[#1E4B43] text-[#FBF7EE] shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-[#1E4B43] dark:hover:text-[#D9B76A]'
            }`}
          >
            Tất Cả ({seals.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedRegion('north')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRegion === 'north'
                ? 'bg-[#1E4B43] text-[#FBF7EE] shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-[#1E4B43] dark:hover:text-[#D9B76A]'
            }`}
          >
            Miền Bắc
          </button>
          <button
            type="button"
            onClick={() => setSelectedRegion('central')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRegion === 'central'
                ? 'bg-[#1E4B43] text-[#FBF7EE] shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-[#1E4B43] dark:hover:text-[#D9B76A]'
            }`}
          >
            Miền Trung
          </button>
          <button
            type="button"
            onClick={() => setSelectedRegion('south')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedRegion === 'south'
                ? 'bg-[#1E4B43] text-[#FBF7EE] shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-[#1E4B43] dark:hover:text-[#D9B76A]'
            }`}
          >
            Miền Nam
          </button>
        </div>

        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          Đã đạt <strong>{unlockedCount}</strong> / {seals.length} con dấu di sản
        </span>
      </div>

      {/* 3. Cultural Seals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredSeals.map((seal) => (
          <div
            key={seal.id}
            className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between border-2 ${
              seal.isUnlocked
                ? 'bg-[#FBF7EE] dark:bg-[#122A22] border-[#9E2A2B]/40 hover:border-[#9E2A2B] shadow-sm hover:shadow-md'
                : 'bg-[#F6EEDC]/60 dark:bg-[#122A22]/50 border-stone-300 dark:border-stone-800 border-dashed opacity-80'
            }`}
          >
            {/* Top Status & Code */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono tracking-wider text-stone-400 dark:text-stone-500 uppercase">
                {seal.sealCode}
              </span>

              {seal.isUnlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9E2A2B] dark:text-[#E07A5F] bg-[#9E2A2B]/10 px-2 py-0.5 rounded-full border border-[#9E2A2B]/30">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ĐÃ DẬP MỘC</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-500 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                  <span>CHƯA MỞ</span>
                </span>
              )}
            </div>

            {/* Stamp Stamp Center Visual */}
            <div
              onClick={() => seal.isUnlocked && setInspectingSeal(seal)}
              className={`my-3 py-4 flex flex-col items-center justify-center text-center cursor-pointer group ${
                !seal.isUnlocked && 'cursor-default'
              }`}
            >
              {seal.isUnlocked ? (
                <div className="relative p-4 rounded-full border-2 border-dashed border-[#9E2A2B] bg-[#9E2A2B]/5 shadow-xs w-28 h-28 flex flex-col items-center justify-center group-hover:scale-105 group-hover:rotate-2 transition-all">
                  <span className="text-3xl mb-0.5">{seal.badgeIcon}</span>
                  <span className="font-serif font-black text-[9px] uppercase tracking-wider text-[#9E2A2B]">
                    MỘC SON
                  </span>
                  <span className="text-[8px] font-mono text-[#9E2A2B]/80 font-bold truncate max-w-[80px]">
                    {seal.province}
                  </span>
                  <div className="absolute inset-1 rounded-full border border-[#9E2A2B]/20 pointer-events-none" />
                </div>
              ) : (
                <div className="p-4 rounded-full border-2 border-dashed border-stone-300 dark:border-stone-700 w-28 h-28 flex flex-col items-center justify-center text-stone-400 dark:text-stone-600">
                  <span className="text-3xl mb-1 grayscale opacity-40">{seal.badgeIcon}</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider">
                    KHÓA
                  </span>
                </div>
              )}
            </div>

            {/* Title & Province */}
            <div className="text-center space-y-1 mb-4">
              <h4 className="font-serif font-bold text-base sm:text-lg text-[#1E4B43] dark:text-[#FBF7EE] line-clamp-1">
                {seal.titleVi}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-sans line-clamp-1 italic">
                {seal.titleEn}
              </p>
              <div className="flex items-center justify-center gap-1 text-[11px] text-stone-400 pt-0.5">
                <MapPin className="w-3 h-3 text-[#D9B76A]" />
                <span>{seal.province}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-200 dark:border-white/10 flex items-center justify-between text-xs">
              {seal.isUnlocked ? (
                <>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Ngày: {seal.stampedAt}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspectingSeal(seal)}
                    className="font-bold text-[#1E4B43] dark:text-[#D9B76A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Xem Mộc</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <Link
                  to={paths.reader({ postId: seal.postId })}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#1E4B43]/10 hover:bg-[#1E4B43] text-[#1E4B43] hover:text-[#FBF7EE] dark:text-[#D9B76A] dark:hover:text-[#122A22] font-bold text-xs transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Học bài này để dập Mộc</span>
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
