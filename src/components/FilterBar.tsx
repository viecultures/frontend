import React from 'react';
import { Search, Layers, Award } from 'lucide-react';
import type { Category, CEFRLevel } from '../types';

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
  const categories: { id: Category; label: string; icon: string; bg: string }[] = [
    { id: 'all', label: 'Tất cả chủ đề', icon: '❖', bg: 'bg-[#FAF6EE]' },
    { id: 'heritage', label: 'Lịch sử & Di sản', icon: '🏛️', bg: 'bg-[#F8E9CF]' },
    { id: 'cuisine', label: 'Ẩm thực Việt', icon: '🍜', bg: 'bg-[#FAF6EE]' },
    { id: 'landscapes', label: 'Danh lam thắng cảnh', icon: '⛰️', bg: 'bg-[#F8E9CF]' },
    { id: 'festivals', label: 'Nghệ thuật & Dân gian', icon: '🎨', bg: 'bg-[#FAF6EE]' },
    { id: 'traditions', label: 'Đời sống & Truyền thống', icon: '🎋', bg: 'bg-[#F8E9CF]' },
  ];

  const levels: (CEFRLevel | 'all')[] = ['all', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="w-full bg-[#F8E9CF] p-6 rounded-[4px] border-2 border-[#12332B] shadow-[5px_5px_0px_#12332B] mb-10">
      
      {/* Top row: Search & CEFR Band */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Search Input with woodcut border */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A635D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bài đọc (Tranh Đông Hồ, Đại Nội Huế, Áo Dài, Bánh mì...)"
            className="w-full pl-12 pr-12 py-3.5 bg-[#FAF6EE] border-2 border-[#12332B] rounded-[3px] text-[#12332B] placeholder-[#4A635D] text-sm font-medium focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_#12332B] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#12332B] bg-[#E58396] px-2 py-1 rounded-[2px] border border-[#12332B]"
            >
              Xóa
            </button>
          )}
        </div>

        {/* CEFR Level Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-bold text-[#12332B] flex items-center gap-1 shrink-0 mr-1 uppercase">
            <Award className="w-4 h-4 text-[#EAA22E]" /> Trình độ:
          </span>
          <div className="flex items-center bg-[#FAF6EE] p-1 rounded-[3px] border-2 border-[#12332B]">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-3 py-1.5 rounded-[2px] text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-[#1A7368] text-[#FAF6EE] shadow-[1px_1px_0px_#12332B]'
                    : 'text-[#12332B] hover:bg-[#F8E9CF]'
                }`}
              >
                {lvl === 'all' ? 'Tất cả' : lvl}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto mt-6 pt-5 border-t-2 border-[#12332B]/20">
        <span className="text-xs font-bold text-[#12332B] flex items-center gap-1 shrink-0 mr-1 uppercase">
          <Layers className="w-4 h-4 text-[#1A7368]" /> Chủ đề:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-[3px] text-xs sm:text-sm font-bold flex items-center gap-2 border-2 border-[#12332B] transition-all ${
                isActive
                  ? 'bg-[#1A7368] text-white shadow-[3px_3px_0px_#12332B] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-[#FAF6EE] text-[#12332B] hover:bg-[#F8E9CF] shadow-[2px_2px_0px_#12332B]'
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
