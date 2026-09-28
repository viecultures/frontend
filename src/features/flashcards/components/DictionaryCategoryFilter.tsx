import React from "react";
import {
  ChevronDown,
  BookOpen,
  Landmark,
  UtensilsCrossed,
  Palette,
  Mountain,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface CategoryOption {
  label: string;
  value: string;
}

interface DictionaryCategoryFilterProps {
  categories: CategoryOption[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  All: BookOpen,
  Heritage: Landmark,
  Cuisine: UtensilsCrossed,
  Crafts: Palette,
  Nature: Mountain,
  Folklore: Sparkles,
};

export function DictionaryCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: DictionaryCategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <div
        role="tablist"
        aria-label="Lọc theo chủ đề bài đọc"
        className="flex items-center gap-2 flex-wrap text-xs font-bold"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          const IconComponent = CATEGORY_ICONS[cat.value] || BookOpen;

          return (
            <button
              key={cat.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat.value)}
              className={`px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2 focus-ring ${
                isActive
                  ? "bg-heritage-green text-warm-ivory shadow-md font-bold border border-antique-gold/60 scale-105"
                  : "bg-surface text-text-body hover:bg-rice-paper hover:text-heritage-green border border-line shadow-2xs"
              }`}
            >
              <IconComponent
                className={`w-4 h-4 ${
                  isActive ? "text-antique-gold" : "text-heritage-green/70"
                }`}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-xs font-bold text-text-secondary bg-surface px-4 py-2 rounded-full border border-line shadow-xs">
        <span className="text-text-secondary">Hiển thị:</span>
        <span className="text-heritage-green font-bold">
          {categories.find((c) => c.value === selectedCategory)?.label || "Tất cả"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-antique-gold" />
      </div>
    </div>
  );
}
