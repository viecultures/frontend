import React, { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Landmark, Volume2, X, MapPin, Utensils, Bot, ChevronDown, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
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
  const { t } = useTranslation('playground');
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const matchingLandmarks = React.useMemo(() => {
    return VIETNAM_LANDMARKS.filter(item => item.provinceId === provinceDetail.id);
  }, [provinceDetail.id]);
  return (
    <div className="ai-workspace-place-card absolute top-4 right-4 z-30 w-72 sm:w-80 bg-white/95 dark:bg-[#162420]/95 backdrop-blur-xl border border-heritage-green/20 dark:border-antique-gold/30 rounded-2xl shadow-2xl p-3.5 animate-in fade-in zoom-in-95 duration-200 select-text">
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <button type="button" className="flex flex-1 min-w-0 items-center gap-2 text-left" aria-expanded={expanded} aria-controls={detailsId} aria-label={expanded ? t('playground.hover_card.collapse_aria', { name: provinceDetail.name }) : t('playground.hover_card.expand_aria', { name: provinceDetail.name })} onClick={() => setExpanded(value => !value)}>
          <div className="w-7 h-7 rounded-lg bg-heritage-green text-antique-gold flex items-center justify-center shrink-0 shadow-sm">
            <Landmark className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="font-serif font-bold text-sm text-heritage-green dark:text-warm-ivory leading-tight">
                {provinceDetail.name}
              </h3>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-heritage-green/10 dark:bg-antique-gold/20 text-heritage-green dark:text-antique-gold font-medium">
                {provinceDetail.regionName}
              </span>
            </div>
            {expanded && <p className="text-[10.5px] text-[#5D706A] dark:text-[#8E9F99] leading-none mt-0.5">
              {provinceDetail.capital}
            </p>}
          </div>
          <ChevronDown size={16} className={`shrink-0 ml-auto text-antique-gold ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onSpeak(
                `Tỉnh ${provinceDetail.name}, ${provinceDetail.regionName}. ${provinceDetail.summary}`
              )
            }
            className="p-1 rounded-md text-[#5D706A] hover:text-heritage-green dark:text-[#8E9F99] dark:hover:text-antique-gold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            title={t('playground.hover_card.listen_title')}
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#5D706A] hover:text-heritage-green dark:text-[#8E9F99] dark:hover:text-antique-gold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            title={t('playground.hover_card.close_title')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div id={detailsId} hidden={!expanded} className="mt-2 pt-2 border-t border-black/5 dark:border-white/10">
      {/* Highlights & Specialties Summary */}
      <div className="space-y-2 text-xs">
        {/* UNESCO / Heritage Title */}
        {provinceDetail.unescoTitle && (
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/20 text-[10.5px] flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
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
            <span className="font-semibold flex items-center gap-1 text-antique-gold">
              <BookOpen className="w-3 h-3 text-antique-gold" /> {t('playground.hover_card.viecultures_stories')}
            </span>
            <span className="text-[9.5px] font-mono">{t('playground.hover_card.stories_count', { count: matchingLandmarks.length })}</span>
          </div>
          <div className="space-y-1">
            {matchingLandmarks.slice(0, 2).map((art) => (
              <a
                key={art.id}
                href={paths.reader({ article: art.id, level: art.level || 'Level 2' })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-1.5 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-antique-gold/10 dark:hover:bg-antique-gold/15 border border-black/5 dark:border-white/10 hover:border-antique-gold/30 transition-all group text-left cursor-pointer"
                title={t('playground.hover_card.open_story_title', { title: art.title })}
              >
                <div className="min-w-0 pr-1.5">
                  <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200 group-hover:text-antique-gold truncate">
                    {art.title}
                  </p>
                  <p className="text-[9.5px] text-gray-500 dark:text-gray-400 truncate">
                    {art.level} • {art.readTime}
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-antique-gold shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Ask AI Mini Button */}
      <button
        disabled={disabled}
        onClick={() => onAskAi(provinceDetail.name)}
        className="w-full mt-2.5 py-1.5 px-3 rounded-lg bg-heritage-green hover:bg-[#15342F] text-antique-gold font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
      >
        <Bot className="w-3 h-3" />
        <span>{t('playground.hover_card.ask_ai_btn', { name: provinceDetail.name })}</span>
        <ChevronRight className="w-3 h-3 ml-auto" />
      </button>
      </div>
    </div>
  );
};

export default ProvinceHoverCard;
