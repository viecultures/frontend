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
  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất cả chủ đề', icon: '✨' },
    { id: 'van-hoa', label: 'Nếp sống & văn hóa', icon: '🎋' },
    { id: 'truyen-thuyet', label: 'Truyền thuyết', icon: '🏛️' },
    { id: 'am-thuc', label: 'Ẩm thực', icon: '🍜' },
    { id: 'le-hoi', label: 'Lễ hội & sắc màu', icon: '🎨' },
  ];

  const levels: (CEFRLevel | 'all')[] = ['all', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="w-full heritage-card p-6 sm:p-8 mb-10 border border-[#E8DFCB] bg-[#FDFBF7]">
      
      {/* Top row: Search & CEFR Band */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Search Input with soft pill shape */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B635B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bài đọc (Tranh Đông Hồ, Đại Nội Huế, Áo Dài, Bánh mì...)"
            className="w-full pl-12 pr-12 py-3.5 bg-[#F6EEDC] border border-[#E8DFCB] rounded-full text-[#2C2523] placeholder-[#6B635B] text-sm font-normal focus:outline-none focus:border-[#1E4B43] focus:bg-[#FDFBF7] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6B635B] hover:text-[#1E4B43] bg-[#E8DFCB] px-2.5 py-1 rounded-full"
            >
              Xóa
            </button>
          )}
        </div>

        {/* CEFR Level Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-semibold text-[#6B635B] flex items-center gap-1 shrink-0 mr-1 uppercase">
            <Award className="w-4 h-4 text-[#D9B76A]" /> Trình độ:
          </span>
          <div className="flex items-center bg-[#F6EEDC] p-1 rounded-full border border-[#E8DFCB]">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-[#1E4B43] text-white shadow-xs'
                    : 'text-[#6B635B] hover:text-[#1E4B43] hover:bg-[#E8DFCB]/50'
                }`}
              >
                {lvl === 'all' ? 'Tất cả' : lvl}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Category Tabs in Pill Shapes */}
      <div className="flex items-center gap-2.5 overflow-x-auto mt-6 pt-6 border-t border-[#E8DFCB] scrollbar-none">
        <span className="text-xs font-semibold text-[#6B635B] flex items-center gap-1 shrink-0 mr-1 uppercase">
          <Layers className="w-4 h-4 text-[#D9B76A]" /> Chủ đề:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2 border transition-all ${
                isActive
                  ? 'bg-[#1E4B43] text-white font-semibold border-[#1E4B43] shadow-xs'
                  : 'bg-[#F6EEDC] text-[#2C2523] border-[#E8DFCB] hover:bg-[#E8DFCB] hover:text-[#1E4B43]'
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
