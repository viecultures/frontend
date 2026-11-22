import type { RefObject } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Lesson } from "@/data/discoveryData";
import { DiscoveryArticleGrid } from "../DiscoveryArticleGrid";
import { DiscoveryPagination } from "../DiscoveryPagination";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";

type SelectedProvince = (typeof VIETNAM_34_PROVINCES)[number] | undefined;

interface JourneyArticlesSectionProps {
  articlesRef: RefObject<HTMLDivElement | null>;
  selectedProvince: SelectedProvince;
  getLocalizedProvinceName: (name: string) => string;
  isEn: boolean;
  totalItems: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  selectedCefr: string;
  setSelectedCefr: (level: string) => void;
  isLoading: boolean;
  lessons: Lesson[];
  bookmarks: Record<string, boolean>;
  onToggleBookmark: (id: string) => void;
  onResetAllFilters: () => void;
  errorMessage: string | null;
  onRetry: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function JourneyArticlesSection({
  articlesRef,
  selectedProvince,
  getLocalizedProvinceName,
  isEn,
  totalItems,
  searchQuery,
  setSearchQuery,
  pageSize,
  setPageSize,
  selectedTopic,
  setSelectedTopic,
  selectedCefr,
  setSelectedCefr,
  isLoading,
  lessons,
  bookmarks,
  onToggleBookmark,
  onResetAllFilters,
  errorMessage,
  onRetry,
  currentPage,
  totalPages,
  onPageChange,
}: JourneyArticlesSectionProps) {
  const { t } = useTranslation("discovery");
  const topics = [
    { id: "All", labelVi: "Tất cả", labelEn: "All" },
    { id: "Cuisine", labelVi: "Ẩm thực", labelEn: "Cuisine" },
    { id: "Heritage", labelVi: "Di sản", labelEn: "Heritage" },
    { id: "Crafts", labelVi: "Làng nghề", labelEn: "Crafts" },
    { id: "Nature", labelVi: "Danh thắng", labelEn: "Nature" },
    { id: "Folklore", labelVi: "Lễ hội", labelEn: "Folklore" },
  ];
  const levels = ["All", "Level 1", "Level 2", "Level 3"];

  return (
    <div ref={articlesRef} className="journey-library-group" id="journey-other-articles">
      <div className="journey-library-section-heading">
        <div>
          <h2>{isEn ? "Standalone Readings" : "Các bài đọc khác"}</h2>
          <small className="journey-library-subheading">
            {selectedProvince
              ? isEn
                ? `Standalone cultural stories from ${getLocalizedProvinceName(selectedProvince.name)}`
                : `Bài đọc độc lập khám phá văn hóa tại ${getLocalizedProvinceName(selectedProvince.name)}`
              : isEn
                ? "Independent cultural readings not part of the structured series above."
                : "Các bài đọc văn hóa song ngữ độc lập, không thuộc lộ trình học phía trên."}
          </small>
        </div>
        <span className="font-semibold text-text-secondary">
          {isEn ? `${totalItems} articles` : `${totalItems} bài đọc`}
        </span>
      </div>

      <div className="mb-6 p-4 rounded-3xl bg-rice-paper/70 dark:bg-heritage-dark/60 border border-heritage-green/15 dark:border-antique-gold/25 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={isEn ? "Search readings by dish, location, heritage..." : "Tìm kiếm bài đọc theo tên món ăn, địa danh, di sản..."}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark border border-heritage-green/20 dark:border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold focus:ring-2 focus:ring-antique-gold/30 transition-all placeholder:text-text-muted/70"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-heritage-green cursor-pointer"
                aria-label={isEn ? "Clear search" : "Xóa tìm kiếm"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 justify-end text-xs text-text-muted shrink-0">
            <span>{isEn ? "Per page:" : "Mỗi trang:"}</span>
            <div className="inline-flex rounded-xl bg-warm-ivory dark:bg-heritage-dark border border-heritage-green/20 dark:border-antique-gold/30 p-0.5">
              {[9, 12, 18].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPageSize(size)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${pageSize === size ? "bg-heritage-green text-warm-ivory shadow-xs" : "text-text-secondary hover:text-heritage-green"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1 border-t border-heritage-green/10 dark:border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {topics.map((topic) => {
              const active = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${active ? "bg-heritage-green text-warm-ivory font-bold shadow-xs scale-102" : "bg-warm-ivory/80 dark:bg-white/5 text-text-secondary hover:bg-warm-ivory hover:text-heritage-green border border-heritage-green/10"}`}
                >
                  {isEn ? topic.labelEn : topic.labelVi}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 justify-between lg:justify-end shrink-0">
            <div className="flex items-center gap-1">
              {levels.map((level) => {
                const active = selectedCefr === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedCefr(level)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${active ? "bg-antique-gold text-heritage-dark shadow-xs ring-1 ring-antique-gold" : "bg-warm-ivory/60 dark:bg-white/5 text-text-muted hover:text-text-body border border-heritage-green/10"}`}
                  >
                    {level === "All" ? (isEn ? "All Levels" : "Mọi cấp độ") : level}
                  </button>
                );
              })}
            </div>
            {(searchQuery || selectedTopic !== "All" || selectedCefr !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTopic("All");
                  setSelectedCefr("All");
                }}
                className="text-xs text-red-600 hover:text-red-700 underline font-semibold ml-1 cursor-pointer"
              >
                {isEn ? "Reset" : "Xóa lọc"}
              </button>
            )}
          </div>
        </div>
      </div>

      <DiscoveryArticleGrid
        isLoading={isLoading}
        lessons={lessons}
        viewMode="grid"
        bookmarks={bookmarks}
        onToggleBookmark={onToggleBookmark}
        onlyBookmarked={false}
        onResetAllFilters={onResetAllFilters}
        selectedCefr={selectedCefr}
        errorMessage={errorMessage}
        onRetry={onRetry}
      />
      <DiscoveryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={onPageChange}
        ariaLabel={isEn ? "Standalone readings pagination" : "Phân trang các bài đọc khác"}
        itemLabel={isEn ? "readings" : "bài đọc"}
        showSinglePage={true}
      />
    </div>
  );
}
