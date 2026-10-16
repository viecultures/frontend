import React from 'react';
import { Landmark, Volume2, X, Sparkles, MapPin, Utensils, Bot, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
import type { ProvinceCultureData } from '../types';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { paths } from '@/routes/paths';

interface ProvinceHoverCardProps {
  provinceDetail: ProvinceCultureData;
  disabled?: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
  onAskAi: (provinceName: string) => void;
}

export const ProvinceHoverCard: React.FC<ProvinceHoverCardProps> = ({
  provinceDetail,
  disabled = false,
  onClose,
  onSpeak,
  onAskAi,
}) => {
  const matchingLandmarks = React.useMemo(() => {
    return VIETNAM_LANDMARKS.filter(item => item.provinceId === provinceDetail.id);
  }, [provinceDetail.id]);
  return (
    <div className="absolute top-4 right-4 z-30 w-72 sm:w-80 bg-white/95 dark:bg-[#162420]/95 backdrop-blur-xl border border-[#1E4B43]/20 dark:border-[#D4AF37]/30 rounded-2xl shadow-2xl p-3.5 animate-in fade-in zoom-in-95 duration-200 select-text">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1E4B43] text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
            <Landmark className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-bold text-sm text-[#1E4B43] dark:text-[#FBF7EE] leading-tight">
                {provinceDetail.name}
              </h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1E4B43]/10 dark:bg-[#D4AF37]/20 text-[#1E4B43] dark:text-[#D4AF37] font-medium">
                {provinceDetail.regionName}
              </span>
            </div>
            <p className="text-[10.5px] text-[#5D706A] dark:text-[#8E9F99] leading-none mt-0.5">
              {provinceDetail.capital}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onSpeak(
                `Tỉnh ${provinceDetail.name}, ${provinceDetail.regionName}. ${provinceDetail.summary}`
              )
            }
            className="p-1 rounded-md text-[#5D706A] hover:text-[#1E4B43] dark:text-[#8E9F99] dark:hover:text-[#D4AF37] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            title="Nghe phát âm giới thiệu"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#5D706A] hover:text-[#1E4B43] dark:text-[#8E9F99] dark:hover:text-[#D4AF37] hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            title="Đóng menu"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Highlights & Specialties Summary */}
      <div className="space-y-2 text-xs">
        {/* UNESCO / Heritage Title */}
        {provinceDetail.unescoTitle && (
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/20 text-[10.5px] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="line-clamp-1 font-medium">{provinceDetail.unescoTitle}</span>
          </div>
        )}

        {/* Cultural Highlights (Top 2-3) */}
        <div className="flex items-start gap-1.5 text-[11px] text-[#1E2925] dark:text-[#D1E0DA]">
          <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            {provinceDetail.landmarks.slice(0, 3).join(' • ')}
          </span>
        </div>

        {/* Culinary Specialties */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#1E2925] dark:text-[#D1E0DA]">
          <Utensils className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="line-clamp-1 font-medium text-amber-900 dark:text-amber-300">
            {provinceDetail.specialties.slice(0, 3).join(', ')}
          </span>
        </div>
      </div>

      {/* Matching VieCultures Reading Articles */}
      {matchingLandmarks.length > 0 && (
        <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-[#5D706A] dark:text-[#8E9F99]">
            <span className="font-semibold flex items-center gap-1 text-[#D4AF37]">
              <BookOpen className="w-3 h-3 text-[#D4AF37]" /> Bài đọc VieCultures
            </span>
            <span className="text-[9.5px] font-mono">{matchingLandmarks.length} bài</span>
          </div>
          <div className="space-y-1">
            {matchingLandmarks.slice(0, 2).map((art) => (
              <a
                key={art.id}
                href={paths.reader({ article: art.id, level: art.level || 'Level 2' })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-[#D4AF37]/10 dark:hover:bg-[#D4AF37]/15 border border-black/5 dark:border-white/10 hover:border-[#D4AF37]/30 transition-all group text-left cursor-pointer"
                title={`Mở bài đọc: ${art.titleVi}`}
              >
                <div className="min-w-0 pr-1.5">
                  <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200 group-hover:text-[#D4AF37] truncate">
                    {art.titleVi}
                  </p>
                  <p className="text-[9.5px] text-gray-500 dark:text-gray-400 truncate">
                    {art.level} • {art.readTime}
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#D4AF37] shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Ask AI Mini Button */}
      <button
        disabled={disabled}
        onClick={() => onAskAi(provinceDetail.name)}
        className="w-full mt-2.5 py-1.5 px-3 rounded-lg bg-[#1E4B43] hover:bg-[#15342F] text-[#D4AF37] font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
      >
        <Bot className="w-3 h-3" />
        <span>Hỏi Sứ Giả AI về {provinceDetail.name}</span>
        <ChevronRight className="w-3 h-3 ml-auto" />
      </button>
    </div>
  );
};

export default ProvinceHoverCard;
