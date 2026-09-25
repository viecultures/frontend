import React from 'react';
import { Search, Layers, Award } from 'lucide-react';
import type { Category, CEFRLevel } from '@/types';

interface FilterBarProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  selectedLevel: CEFRLevel | 'all';
  onSelectLevel: (lvl: CEFRLevel | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalLessons?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedLevel,
  onSelectLevel,
  searchQuery,
  onSearchChange,
}) => {
  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất cả chủ đề', icon: '✨' },
    { id: 'heritage', label: 'Lịch sử & Di sản', icon: '🏛️' },
    { id: 'cuisine', label: 'Ẩm thực Việt', icon: '🍜' },
    { id: 'landscapes', label: 'Danh lam thắng cảnh', icon: '⛰️' },
    { id: 'festivals', label: 'Nghệ thuật & Dân gian', icon: '🎨' },
    { id: 'traditions', label: 'Đời sống & Truyền thống', icon: '🎋' },
  ];

  const levels: (CEFRLevel | 'all')[] = ['all', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="w-full glass-card p-6 sm:p-8 mb-10 border border-white/15">
      
      {/* Top row: Search & CEFR Band */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Search Input with soft pill shape */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bài đọc (Tranh Đông Hồ, Đại Nội Huế, Áo Dài, Bánh mì...)"
            className="w-full pl-12 pr-12 py-3.5 bg-black/40 border border-white/15 rounded-full text-white placeholder-white/50 text-sm font-normal focus:outline-none focus:border-[#FCE5B5] focus:bg-black/60 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/70 hover:text-white bg-white/10 px-2.5 py-1 rounded-full"
            >
              Xóa
            </button>
          )}
        </div>

        {/* CEFR Level Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-semibold text-white/70 flex items-center gap-1 shrink-0 mr-1 uppercase">
            <Award className="w-4 h-4 text-[#F5D280]" /> Trình độ:
          </span>
          <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/15">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-[#FCE5B5] text-[#18221E] shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {lvl === 'all' ? 'Tất cả' : lvl}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Category Tabs in Pill Shapes */}
      <div className="flex items-center gap-2.5 overflow-x-auto mt-6 pt-6 border-t border-white/10 scrollbar-none">
        <span className="text-xs font-semibold text-white/70 flex items-center gap-1 shrink-0 mr-1 uppercase">
          <Layers className="w-4 h-4 text-[#F5D280]" /> Chủ đề:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 border transition-all ${
                isActive
                  ? 'bg-[#FCE5B5] text-[#18221E] font-semibold border-[#FCE5B5] shadow-md'
                  : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
