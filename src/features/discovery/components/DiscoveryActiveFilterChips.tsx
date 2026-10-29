import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, RotateCcw, Star } from 'lucide-react';
import { TOPIC_OPTIONS } from '@/data/discoveryData';

interface DiscoveryActiveFilterChipsProps {
  selectedTopic: string;
  onClearTopic: () => void;
  selectedCefr: string;
  onClearCefr: () => void;
  selectedReadTime: 'All' | 'short' | 'medium' | 'long';
  onClearReadTime: () => void;
  searchQuery: string;
  onClearSearch: () => void;
  onlyBookmarked: boolean;
  onClearBookmarked: () => void;
  onResetAllFilters: () => void;
}

export const DiscoveryActiveFilterChips: React.FC<DiscoveryActiveFilterChipsProps> = ({
  selectedTopic,
  onClearTopic,
  selectedCefr,
  onClearCefr,
  selectedReadTime,
  onClearReadTime,
  searchQuery,
  onClearSearch,
  onlyBookmarked,
  onClearBookmarked,
  onResetAllFilters,
}) => {
  const { t } = useTranslation('discovery');

  const hasActiveFilters =
    selectedTopic !== 'All' ||
    selectedCefr !== 'All' ||
    selectedReadTime !== 'All' ||
    searchQuery.trim() !== '' ||
    onlyBookmarked;

  if (!hasActiveFilters) return null;

  const getTopicLabel = (val: string) => {
    switch (val) {
      case 'Heritage':
        return t('topic_tabs.heritage');
      case 'Cuisine':
        return t('topic_tabs.cuisine');
      case 'Crafts':
        return t('topic_tabs.crafts');
      case 'Nature':
        return t('topic_tabs.nature');
      case 'Folklore':
        return t('topic_tabs.folklore');
      default:
        return TOPIC_OPTIONS.find((tp) => tp.value === val)?.label || val;
    }
  };

  const getDurationLabel = (val: string) => {
    switch (val) {
      case 'short':
        return t('filter_toolbar.duration_short');
      case 'medium':
        return t('filter_toolbar.duration_medium');
      case 'long':
        return t('filter_toolbar.duration_long');
      default:
        return val;
    }
  };

  return (
    <div className="pt-3 border-t border-heritage-green/10 flex items-center justify-between gap-3 flex-wrap text-xs animate-in fade-in duration-200">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-text-secondary">{t('active_chips.active_filters_label')}</span>

        {selectedTopic !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <span>{t('active_chips.topic_chip', { topic: getTopicLabel(selectedTopic) })}</span>
            <button
              type="button"
              onClick={onClearTopic}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title={t('active_chips.clear_topic_title')}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {selectedCefr !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <span>{t('active_chips.level_chip', { level: selectedCefr })}</span>
            <button
              type="button"
              onClick={onClearCefr}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title={t('active_chips.clear_level_title')}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {selectedReadTime !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <span>
              {t('active_chips.duration_chip', { duration: getDurationLabel(selectedReadTime) })}
            </span>
            <button
              type="button"
              onClick={onClearReadTime}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title={t('active_chips.clear_duration_title')}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {searchQuery && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <span>{t('active_chips.keyword_chip', { query: searchQuery })}</span>
            <button
              type="button"
              onClick={onClearSearch}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title={t('active_chips.clear_keyword_title')}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {onlyBookmarked && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <Star className="w-3.5 h-3.5 fill-antique-gold text-antique-gold" />
            <span>{t('active_chips.saved_chip')}</span>
            <button
              type="button"
              onClick={onClearBookmarked}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title={t('active_chips.clear_saved_title')}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onResetAllFilters}
        className="inline-flex items-center gap-1.5 font-bold text-heritage-green hover:text-antique-rich underline underline-offset-2 ml-auto cursor-pointer focus-ring px-2 py-1 rounded-lg"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{t('active_chips.reset_all')}</span>
      </button>
    </div>
  );
};

export default DiscoveryActiveFilterChips;