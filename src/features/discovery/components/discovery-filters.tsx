import React from "react";
import { Search, Filter, Volume2 } from "lucide-react";

interface DiscoveryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCefr: string;
  onSelectCefr: (cefr: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  audioOnly: boolean;
  onToggleAudioOnly: () => void;
}

export const DiscoveryFilters: React.FC<DiscoveryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCefr,
  onSelectCefr,
  selectedCategory,
  onSelectCategory,
  audioOnly,
  onToggleAudioOnly
}) => {
  const cefrLevels = ["All", "A2", "B1", "B2", "C1"];
  const categories = ["All", "History", "Heritage", "Culinary Arts", "Traditional Arts"];

  return (
    <div className="rounded-2xl border border-amber-500/20 glass-panel p-5 space-y-4 shadow-sm">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search cultural materials by keyword, food, history, or title..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-500/20 bg-white/70 dark:bg-zinc-800/70 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-amber-500/10 pt-3">
        {/* CEFR Level Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" /> CEFR:
          </span>
          <div className="flex gap-1 bg-amber-500/10 p-1 rounded-xl">
            {cefrLevels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectCefr(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCefr === lvl
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-amber-800 dark:hover:text-amber-300"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? "bg-amber-100 dark:bg-zinc-800 border-amber-500 text-amber-900 dark:text-amber-300 font-bold"
                  : "border-amber-500/20 text-zinc-600 dark:text-zinc-400 hover:bg-amber-500/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Audio Only Switch */}
        <button
          onClick={onToggleAudioOnly}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            audioOnly
              ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-500/40"
              : "border-amber-500/20 text-zinc-600 dark:text-zinc-400 hover:bg-amber-500/10"
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> Audio Available
        </button>
      </div>
    </div>
  );
};
