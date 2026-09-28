import React from 'react';
import { X, RotateCcw } from 'lucide-react';
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
    <div className="pt-3 border-t border-heritage-green/10 flex items-center justify-between gap-3 flex-wrap text-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-text-secondary">Bộ lọc đang chọn:</span>

        {selectedTopic !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
            Chủ đề: {TOPIC_OPTIONS.find((t) => t.value === selectedTopic)?.label}
            <button
              type="button"
              onClick={onClearTopic}
              className="hover:text-antique-gold cursor-pointer"
              title="Xóa lọc chủ đề"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {selectedCefr !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
            CEFR: {selectedCefr}
            <button
              type="button"
              onClick={onClearCefr}
              className="hover:text-antique-gold cursor-pointer"
              title="Xóa lọc CEFR"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {selectedReadTime !== 'All' && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
            Thời lượng:{' '}
            {selectedReadTime === 'short'
              ? '< 6 phút'
              : selectedReadTime === 'medium'
              ? '6-8 phút'
              : '> 8 phút'}
            <button
              type="button"
              onClick={onClearReadTime}
              className="hover:text-antique-gold cursor-pointer"
              title="Xóa lọc thời lượng"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {searchQuery && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
            Từ khóa: "{searchQuery}"
            <button
              type="button"
              onClick={onClearSearch}
              className="hover:text-antique-gold cursor-pointer"
              title="Xóa từ khóa"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {onlyBookmarked && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
            ⭐️ Bài viết đã lưu
            <button
              type="button"
              onClick={onClearBookmarked}
              className="hover:text-antique-gold cursor-pointer"
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
        className="inline-flex items-center gap-1 font-bold text-heritage-green hover:underline underline-offset-2 ml-auto cursor-pointer focus-ring"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Đặt lại tất cả
      </button>
    </div>
  );
};

export default DiscoveryActiveFilterChips;
