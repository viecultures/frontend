import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Filter,
  Clock,
  Star,
  X,
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react';
import { CEFR_LEVELS } from '@/data/discoveryData';

interface DiscoveryFilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onlyBookmarked: boolean;
  onToggleBookmarked: () => void;
  sortBy: 'recent' | 'vocab' | 'time_asc' | 'time_desc';
  onSortChange: (sort: 'recent' | 'vocab' | 'time_asc' | 'time_desc') => void;
  isSortOpen: boolean;
  onToggleSortOpen: () => void;
  onCloseSort: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  selectedCefr: string;
  onSelectCefr: (cefr: string) => void;
  selectedReadTime: 'All' | 'short' | 'medium' | 'long';
  onSelectReadTime: (time: 'All' | 'short' | 'medium' | 'long') => void;
}

export const DiscoveryFilterToolbar: React.FC<DiscoveryFilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onlyBookmarked,
  onToggleBookmarked,
  sortBy,
  onSortChange,
  isSortOpen,
  onToggleSortOpen,
  onCloseSort,
  viewMode,
  onViewModeChange,
  selectedCefr,
  onSelectCefr,
  selectedReadTime,
  onSelectReadTime,
}) => {
  const { t } = useTranslation('discovery');

  const sortOptions = [
    { label: t('filter_toolbar.sort_recent'), value: 'recent' },
    { label: t('filter_toolbar.sort_vocab'), value: 'vocab' },
    { label: t('filter_toolbar.sort_time_asc'), value: 'time_asc' },
    { label: t('filter_toolbar.sort_time_desc'), value: 'time_desc' },
  ];

  const durationOptions = [
    { label: t('filter_toolbar.duration_all'), value: 'All' },
    { label: t('filter_toolbar.duration_short'), value: 'short' },
    { label: t('filter_toolbar.duration_medium'), value: 'medium' },
    { label: t('filter_toolbar.duration_long'), value: 'long' },
  ];

  return (
    <section className="mb-8 relative z-30">
      <div className="p-6 rounded-3xl bg-rice-paper/90 border border-heritage-green/12 shadow-[0_4px_20px_-4px] shadow-heritage-green/6 backdrop-blur-sm space-y-5 relative z-30">
        {/* Top Row: Search Input, Bookmarks, Sort & View Mode */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Smart Search Box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('filter_toolbar.search_placeholder')}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-warm-ivory border border-heritage-green/16 text-sm text-heritage-green placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-heritage-green/30 focus:border-heritage-green transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted hover:text-heritage-green p-1 rounded-full hover:bg-mist-cloud cursor-pointer"
                title={t('filter_toolbar.clear_search_title')}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Toolbar Controls */}
          <div className="flex items-center gap-3 justify-between lg:justify-end flex-wrap">
            {/* Bookmarked Filter Pill */}
            <button
              type="button"
              onClick={onToggleBookmarked}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                onlyBookmarked
                  ? 'bg-heritage-green text-warm-ivory border-antique-gold/60 shadow-sm'
                  : 'bg-warm-ivory text-heritage-green border-heritage-green/18 hover:bg-rice-paper shadow-xs hover:border-antique-gold'
              }`}
            >
              <Star
                className={`w-4 h-4 ${
                  onlyBookmarked ? 'fill-antique-gold text-antique-gold' : 'text-antique-gold'
                }`}
              />
              <span>{t('filter_toolbar.saved_stories')}</span>
            </button>

            {/* Custom React Floating Sort Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={onToggleSortOpen}
                className="flex items-center gap-2 bg-warm-ivory px-4 py-2.5 rounded-2xl border border-heritage-green/18 text-xs font-bold text-heritage-green shadow-xs hover:border-antique-gold transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-antique-gold shrink-0" />
                <span className="text-text-secondary">{t('filter_toolbar.sort_label')}</span>
                <span className="font-extrabold text-heritage-green">
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-heritage-green transition-transform duration-200 ${
                    isSortOpen ? 'rotate-180 text-antique-gold' : ''
                  }`}
                />
              </button>

              {isSortOpen && (
                <>
                  {/* Invisible Backdrop Overlay to close on click outside */}
                  <div className="fixed inset-0 z-40" onClick={onCloseSort} />

                  {/* Custom Floating Popover Dropdown Card */}
                  <div className="absolute right-0 top-full mt-2 w-52 bg-warm-ivory border border-antique-gold/40 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 backdrop-blur-md">
                    {sortOptions.map((opt) => {
                      const isSelected = sortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            onSortChange(opt.value as any);
                            onCloseSort();
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-heritage-green text-warm-ivory shadow-xs'
                              : 'text-text-body hover:bg-rice-paper hover:text-heritage-green'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-antique-gold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-warm-ivory p-1 rounded-2xl border border-heritage-green/18 shadow-xs">
              <button
                type="button"
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-heritage-green text-warm-ivory shadow-xs scale-102'
                    : 'text-text-secondary hover:text-heritage-green hover:bg-rice-paper'
                }`}
                title={t('filter_toolbar.grid_view_title')}
                aria-label={t('filter_toolbar.grid_view_aria')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-heritage-green text-warm-ivory shadow-xs scale-102'
                    : 'text-text-secondary hover:text-heritage-green hover:bg-rice-paper'
                }`}
                title={t('filter_toolbar.list_view_title')}
                aria-label={t('filter_toolbar.list_view_aria')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Row: Level & Reading Time Duration Smart Filters */}
        <div className="pt-3 border-t border-heritage-green/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Level Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-heritage-green flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              {t('filter_toolbar.level_label')}
            </span>
            {CEFR_LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onSelectCefr(lvl)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCefr === lvl
                    ? 'bg-heritage-green text-warm-ivory shadow-xs border border-antique-gold/50'
                    : 'bg-warm-ivory text-heritage-green hover:bg-mist-cloud border border-heritage-green/12'
                }`}
              >
                {lvl === 'All' ? t('filter_toolbar.level_all') : lvl}
              </button>
            ))}
          </div>

          {/* Reading Duration Filter */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-heritage-green flex items-center gap-1 mr-1">
              <Clock className="w-3.5 h-3.5 text-antique-gold" />
              {t('filter_toolbar.duration_label')}
            </span>
            {durationOptions.map((dur) => (
              <button
                key={dur.value}
                type="button"
                onClick={() => onSelectReadTime(dur.value as any)}
                className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  selectedReadTime === dur.value
                    ? 'bg-heritage-green text-warm-ivory shadow-xs'
                    : 'bg-warm-ivory text-text-body hover:bg-mist-cloud border border-heritage-green/10'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryFilterToolbar;