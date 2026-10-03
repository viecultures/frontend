import React from 'react';
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
  const hasActiveFilters =
    selectedTopic !== 'All' ||
    selectedCefr !== 'All' ||
    selectedReadTime !== 'All' ||
    searchQuery.trim() !== '' ||
    onlyBookmarked;

  if (!hasActiveFilters) return null;

  return (
    <div className="pt-3 border-t border-heritage-green/10 flex items-center justify-between gap-3 flex-wrap text-xs animate-in fade-in duration-200">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-text-secondary">Bộ lọc đang chọn:</span>

        {selectedTopic !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <span>Chủ đề: {TOPIC_OPTIONS.find((t) => t.value === selectedTopic)?.label}</span>
            <button
              type="button"
              onClick={onClearTopic}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title="Xóa lọc chủ đề"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {selectedCefr !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <span>Trình độ: {selectedCefr}</span>
            <button
              type="button"
              onClick={onClearCefr}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title="Xóa lọc trình độ"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {selectedReadTime !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <span>
              Thời lượng:{' '}
              {selectedReadTime === 'short'
                ? '< 6 phút'
                : selectedReadTime === 'medium'
                ? '6-8 phút'
                : '> 8 phút'}
            </span>
            <button
              type="button"
              onClick={onClearReadTime}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title="Xóa lọc thời lượng"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {searchQuery && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <span>Từ khóa: &ldquo;{searchQuery}&rdquo;</span>
            <button
              type="button"
              onClick={onClearSearch}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title="Xóa từ khóa"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {onlyBookmarked && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xs border border-antique-gold/40">
            <Star className="w-3.5 h-3.5 fill-antique-gold text-antique-gold" />
            <span>Bài viết đã lưu</span>
            <button
              type="button"
              onClick={onClearBookmarked}
              className="hover:text-antique-gold cursor-pointer p-0.5"
              title="Xóa lọc bài đã lưu"
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
        <span>Đặt lại tất cả</span>
      </button>
    </div>
  );
};

export default DiscoveryActiveFilterChips;
