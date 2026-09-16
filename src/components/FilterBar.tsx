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
    { id: 'heritage', label: 'Lịch sử & Di sản', icon: '🏛️' },
    { id: 'cuisine', label: 'Ẩm thực Việt', icon: '🍜' },
    { id: 'landscapes', label: 'Danh lam thắng cảnh', icon: '⛰️' },
    { id: 'traditions', label: 'Đời sống & Truyền thống', icon: '🎋' },
  ];

  const levels: (CEFRLevel | 'all')[] = ['all', 'A2', 'B1', 'B2', 'C1'];

  return (
    <div className="w-full bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 mb-10 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bài đọc (Huế, Bánh mì, Hội An, Vịnh Hạ Long, Áo dài...)"
            className="w-full pl-12 pr-4 py-3.5 bg-slate-950/80 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-2 py-1 rounded-lg"
            >
              Xóa
            </button>
          )}
        </div>

        {/* CEFR Level Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Award className="w-4 h-4 text-amber-400" /> Trình độ:
          </span>
          <div className="flex items-center bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 scale-105'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                {lvl === 'all' ? 'Tất cả' : lvl}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Topics Category Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto mt-6 pt-6 border-t border-slate-800/80 scrollbar-none">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-2">
          <Layers className="w-4 h-4 text-emerald-400" /> Chủ đề:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                  : 'bg-slate-950/60 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
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
