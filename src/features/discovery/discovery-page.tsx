import { useState, useMemo, useEffect } from "react";
import Link from "@/components/Link";
import {
  Search,
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  Filter,
  ArrowRight,
  Layers,
  RotateCcw,
  LayoutGrid,
  List,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import {
  LESSONS_DATA,
  type Lesson,
  getCefrBadgeStyle,
  TOPIC_OPTIONS,
  CEFR_LEVELS,
} from "@/data/discoveryData";

// Helper function to remove Vietnamese diacritics / accents for smart search matching
const removeAccents = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "recent" },
  { label: "Nhiều từ vựng", value: "vocab" },
  { label: "Đọc ngắn (< 6 phút)", value: "time_asc" },
  { label: "Đọc sâu (> 8 phút)", value: "time_desc" },
];

export default function DiscoveryPage() {
  // State for filtering & layout
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [selectedCefr, setSelectedCefr] = useState<string>("All");
  const [selectedReadTime, setSelectedReadTime] = useState<"All" | "short" | "medium" | "long">("All");
  const [sortBy, setSortBy] = useState<"recent" | "vocab" | "time_asc" | "time_desc">("recent");
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({
    "imperial-hue": true,
  });
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);

  // Dynamic items per page based on view mode (Grid = 12, List = 20)
  const itemsPerPage = viewMode === "grid" ? 12 : 20;

  // Reset pagination when filters or view mode change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTopic, selectedCefr, selectedReadTime, searchQuery, sortBy, onlyBookmarked, viewMode]);

  // Toggle Favorite Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Count per Topic
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { All: LESSONS_DATA.length };
    LESSONS_DATA.forEach((lesson) => {
      counts[lesson.category] = (counts[lesson.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Smart Filter & Sort Logic
  const filteredLessons = useMemo(() => {
    return LESSONS_DATA.filter((lesson) => {
      // If filtering only bookmarked stories
      if (onlyBookmarked && !bookmarks[lesson.id]) return false;

      // Filter by Topic
      const matchTopic =
        selectedTopic === "All" || lesson.category === selectedTopic;

      // Filter by CEFR Level
      const matchCefr =
        selectedCefr === "All" || lesson.cefrLevel === selectedCefr;

      // Filter by Reading Time Duration
      const readMinutes = parseInt(lesson.readTime);
      const matchTime =
        selectedReadTime === "All" ||
        (selectedReadTime === "short" && readMinutes < 6) ||
        (selectedReadTime === "medium" && readMinutes >= 6 && readMinutes <= 8) ||
        (selectedReadTime === "long" && readMinutes > 8);

      // Smart Accent-Insensitive Search Query Matching
      const q = searchQuery.toLowerCase().trim();
      const normalizedQ = removeAccents(q);

      const matchSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        removeAccents(lesson.title.toLowerCase()).includes(normalizedQ) ||
        lesson.vietnameseTitle.toLowerCase().includes(q) ||
        removeAccents(lesson.vietnameseTitle.toLowerCase()).includes(normalizedQ) ||
        lesson.summary.toLowerCase().includes(q) ||
        removeAccents(lesson.summary.toLowerCase()).includes(normalizedQ) ||
        lesson.categoryVi.toLowerCase().includes(q) ||
        removeAccents(lesson.categoryVi.toLowerCase()).includes(normalizedQ);

      return matchTopic && matchCefr && matchTime && matchSearch;
    }).sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      if (sortBy === "vocab") {
        return b.vocabCount - a.vocabCount;
      }
      if (sortBy === "time_asc") {
        return parseInt(a.readTime) - parseInt(b.readTime);
      }
      if (sortBy === "time_desc") {
        return parseInt(b.readTime) - parseInt(a.readTime);
      }
      return 0;
    });
  }, [selectedTopic, selectedCefr, selectedReadTime, searchQuery, sortBy, onlyBookmarked, bookmarks]);

  // Pagination Calculation
  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / itemsPerPage));
  const paginatedLessons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLessons.slice(start, start + itemsPerPage);
  }, [filteredLessons, currentPage, itemsPerPage]);

  const resetAllFilters = () => {
    setSelectedTopic("All");
    setSelectedCefr("All");
    setSelectedReadTime("All");
    setSearchQuery("");
    setOnlyBookmarked(false);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedTopic !== "All" ||
    selectedCefr !== "All" ||
    selectedReadTime !== "All" ||
    searchQuery.trim() !== "" ||
    onlyBookmarked;

  return (
    <main className="min-h-screen bg-[#FBF7EE] text-[#3F5550] relative selection:bg-[#BFE3EA] selection:text-[#1E4B43] pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Category Tabs Scrollbar */}
        <section className="mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {TOPIC_OPTIONS.map((topic) => {
              const isActive = selectedTopic === topic.value;
              const count = topicCounts[topic.value] || 0;
              return (
                <button
                  key={topic.value}
                  onClick={() => setSelectedTopic(topic.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#1E4B43] text-[#FBF7EE] shadow-md border border-[#D9B76A]/50 scale-102"
                      : "bg-[#F6EEDC] text-[#3F5550] hover:bg-[#E8DFCB] border border-[rgba(30,75,67,0.10)]"
                  }`}
                >
                  <span className="text-base">{topic.icon}</span>
                  <span>{topic.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? "bg-[#D9B76A] text-[#1E4B43]"
                        : "bg-[#E8DFCB] text-[#1E4B43]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Smart Filter & Search Toolbar */}
        <section className="mb-8 relative z-30">
          <div className="p-6 rounded-3xl bg-[#F6EEDC]/90 border border-[rgba(30,75,67,0.12)] shadow-[0_4px_20px_-4px_rgba(30,75,67,0.06)] backdrop-blur-sm space-y-5 relative z-30">
            {/* Top Row: Search Input, Bookmarks, Sort & View Mode */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Smart Search Box */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7E79]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm thông minh (gõ không dấu: banh mi, hue, son doong)..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.16)] text-sm text-[#1E4B43] placeholder-[#8C9692] focus:outline-none focus:ring-2 focus:ring-[#1E4B43]/30 focus:border-[#1E4B43] transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8C9692] hover:text-[#1E4B43] p-1 rounded-full hover:bg-[#E8DFCB]"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Toolbar Controls */}
              <div className="flex items-center gap-3 justify-between lg:justify-end flex-wrap">
                {/* Bookmarked Filter Pill */}
                <button
                  onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                    onlyBookmarked
                      ? "bg-[#1E4B43] text-[#FBF7EE] border-[#D9B76A]/60 shadow-sm"
                      : "bg-[#FBF7EE] text-[#1E4B43] border-[rgba(30,75,67,0.18)] hover:bg-[#F6EEDC] shadow-xs hover:border-[#D9B76A]"
                  }`}
                >
                  <Star className={`w-4 h-4 ${onlyBookmarked ? "fill-[#D9B76A] text-[#D9B76A]" : "text-[#D9B76A]"}`} />
                  <span>Đã lưu</span>
                </button>

                {/* Custom React Floating Sort Dropdown Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-[#FBF7EE] px-4 py-2.5 rounded-2xl border border-[rgba(30,75,67,0.18)] text-xs font-bold text-[#1E4B43] shadow-xs hover:border-[#D9B76A] transition-all cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#D9B76A] shrink-0" />
                    <span className="text-[#6E7E79]">Sắp xếp:</span>
                    <span className="font-extrabold text-[#1E4B43]">
                      {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-[#1E4B43] transition-transform duration-200 ${
                        isSortOpen ? "rotate-180 text-[#D9B76A]" : ""
                      }`}
                    />
                  </button>

                  {isSortOpen && (
                    <>
                      {/* Invisible Backdrop Overlay to close on click outside */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsSortOpen(false)}
                      />

                      {/* Custom Floating Popover Dropdown Card */}
                      <div className="absolute right-0 top-full mt-2 w-52 bg-[#FBF7EE] border border-[#D9B76A]/40 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 backdrop-blur-md">
                        {SORT_OPTIONS.map((opt) => {
                          const isSelected = sortBy === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setSortBy(opt.value as any);
                                setIsSortOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#1E4B43] text-[#FBF7EE] shadow-xs"
                                  : "text-[#3F5550] hover:bg-[#F6EEDC] hover:text-[#1E4B43]"
                              }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#D9B76A]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-[#FBF7EE] p-1 rounded-2xl border border-[rgba(30,75,67,0.18)] shadow-xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-[#1E4B43] text-[#FBF7EE] shadow-xs scale-102"
                        : "text-[#6E7E79] hover:text-[#1E4B43] hover:bg-[#F6EEDC]"
                    }`}
                    title="Chế độ lưới (Grid 12 bài/trang)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
                      viewMode === "list"
                        ? "bg-[#1E4B43] text-[#FBF7EE] shadow-xs scale-102"
                        : "text-[#6E7E79] hover:text-[#1E4B43] hover:bg-[#F6EEDC]"
                    }`}
                    title="Chế độ danh sách (List 20 bài/trang)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Row: CEFR Level & Reading Time Duration Smart Filters */}
            <div className="pt-3 border-t border-[rgba(30,75,67,0.10)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* CEFR Level Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B43] flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  Trình độ CEFR:
                </span>
                {CEFR_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedCefr(lvl)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      selectedCefr === lvl
                        ? "bg-[#1E4B43] text-[#FBF7EE] shadow-xs border border-[#D9B76A]/50"
                        : "bg-[#FBF7EE] text-[#1E4B43] hover:bg-[#E8DFCB] border border-[rgba(30,75,67,0.12)]"
                    }`}
                  >
                    {lvl === "All" ? "Tất cả" : lvl}
                  </button>
                ))}
              </div>

              {/* Reading Duration Filter */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-[#1E4B43] flex items-center gap-1 mr-1">
                  <Clock className="w-3.5 h-3.5 text-[#D9B76A]" />
                  Thời lượng:
                </span>
                {[
                  { label: "Tất cả", value: "All" },
                  { label: "< 6 phút", value: "short" },
                  { label: "6-8 phút", value: "medium" },
                  { label: "> 8 phút", value: "long" },
                ].map((dur) => (
                  <button
                    key={dur.value}
                    onClick={() => setSelectedReadTime(dur.value as any)}
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${
                      selectedReadTime === dur.value
                        ? "bg-[#1E4B43] text-[#FBF7EE] shadow-xs"
                        : "bg-[#FBF7EE] text-[#3F5550] hover:bg-[#E8DFCB] border border-[rgba(30,75,67,0.10)]"
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Active Filter Badges Bar */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-[rgba(30,75,67,0.10)] flex items-center justify-between gap-3 flex-wrap text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#6E7E79]">Bộ lọc đang chọn:</span>

                  {selectedTopic !== "All" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E4B43] text-[#FBF7EE] font-bold">
                      Chủ đề: {TOPIC_OPTIONS.find((t) => t.value === selectedTopic)?.label}
                      <button onClick={() => setSelectedTopic("All")} className="hover:text-[#D9B76A]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCefr !== "All" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E4B43] text-[#FBF7EE] font-bold">
                      CEFR: {selectedCefr}
                      <button onClick={() => setSelectedCefr("All")} className="hover:text-[#D9B76A]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedReadTime !== "All" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E4B43] text-[#FBF7EE] font-bold">
                      Thời lượng: {selectedReadTime === "short" ? "< 6 phút" : selectedReadTime === "medium" ? "6-8 phút" : "> 8 phút"}
                      <button onClick={() => setSelectedReadTime("All")} className="hover:text-[#D9B76A]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E4B43] text-[#FBF7EE] font-bold">
                      Từ khóa: "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="hover:text-[#D9B76A]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {onlyBookmarked && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E4B43] text-[#FBF7EE] font-bold">
                      ⭐️ Bài viết đã lưu
                      <button onClick={() => setOnlyBookmarked(false)} className="hover:text-[#D9B76A]">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 font-bold text-[#1E4B43] hover:underline underline-offset-2 ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Đặt lại tất cả
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Lesson Catalog Display */}
        <section className="mb-12 relative z-10">
          {filteredLessons.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center rounded-3xl bg-[#F6EEDC]/60 border border-dashed border-[rgba(30,75,67,0.25)] p-8">
              <div className="w-16 h-16 rounded-full bg-[#E8DFCB] flex items-center justify-center mx-auto mb-4 text-[#1E4B43]">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1E4B43]">
                Không tìm thấy bài học phù hợp
              </h3>
              <p className="text-sm text-[#3F5550] mt-2 max-w-md mx-auto">
                {onlyBookmarked
                  ? "Bạn chưa lưu bài học nào trong danh mục này."
                  : `Không tìm thấy câu chuyện văn hóa nào khớp với các bộ lọc hiện tại.`}
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] shadow-sm transition-all"
              >
                Đặt lại tất cả bộ lọc
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedLessons.map((lesson) => {
                const isBookmarked = !!bookmarks[lesson.id];
                return (
                  <article
                    key={lesson.id}
                    className="group relative rounded-3xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] shadow-[0_4px_20px_-4px_rgba(30,75,67,0.06)] hover:shadow-[0_12px_32px_-6px_rgba(30,75,67,0.16)] transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
                  >
                    {/* Card Cover & Header Illustration */}
                    <div
                      className={`relative h-48 w-full bg-gradient-to-br ${lesson.gradient} p-6 flex flex-col justify-between overflow-hidden`}
                    >
                      {/* Traditional Border Grid Overlay */}
                      <div className="absolute inset-2.5 border border-[#D9B76A]/25 rounded-2xl pointer-events-none" />

                      {/* Top Category Badge & Bookmark Action */}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FBF7EE]/90 backdrop-blur-sm text-[#1E4B43] border border-[rgba(30,75,67,0.15)] shadow-xs">
                          {lesson.categoryVi}
                        </span>
                        <button
                          onClick={() => toggleBookmark(lesson.id)}
                          className="p-2 rounded-full bg-[#FBF7EE]/85 hover:bg-[#FBF7EE] text-[#1E4B43] transition-all shadow-xs hover:scale-110"
                          aria-label="Bookmark lesson"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-[#1E4B43] fill-[#1E4B43]" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-[#1E4B43]" />
                          )}
                        </button>
                      </div>

                      {/* Center Emblem Symbol */}
                      <div className="relative z-10 my-auto text-center">
                        <span className="text-4xl filter drop-shadow-md transition-transform duration-300 group-hover:scale-115 inline-block">
                          {lesson.iconSymbol}
                        </span>
                      </div>

                      {/* Bottom CEFR & Duration Pills */}
                      <div className="relative z-10 flex items-center justify-between text-[11px] font-bold tracking-wider uppercase">
                        <span
                          className={`px-2.5 py-0.5 rounded-md border shadow-xs ${getCefrBadgeStyle(
                            lesson.cefrLevel
                          )}`}
                        >
                          CEFR {lesson.cefrLevel}
                        </span>
                        <span className="flex items-center gap-1 text-[#F6EEDC]">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.readTime}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between bg-[#FBF7EE]">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#1E4B43] leading-snug group-hover:text-[#D9B76A] transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-[#6E7E79] mt-1 font-medium italic">
                          {lesson.vietnameseTitle}
                        </p>
                        <p className="text-xs text-[#3F5550] mt-3 line-clamp-3 leading-relaxed">
                          {lesson.summary}
                        </p>
                      </div>

                      {/* Card Footer Details */}
                      <div className="mt-6 pt-4 border-t border-[rgba(30,75,67,0.10)] flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#6E7E79] flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#1E4B43]" />
                          {lesson.vocabCount} Từ vựng
                        </span>
                        <Link
                          href={`/reader?story=${lesson.id}`}
                          className="font-bold text-[#1E4B43] group-hover:text-[#D9B76A] inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Đọc tiếp</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* List View Layout */
            <div className="space-y-4">
              {paginatedLessons.map((lesson) => {
                const isBookmarked = !!bookmarks[lesson.id];
                return (
                  <article
                    key={lesson.id}
                    className="group rounded-2xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#D9B76A]/60"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lesson.gradient} flex items-center justify-center shrink-0 shadow-xs border border-[#D9B76A]/30`}
                      >
                        <span className="text-2xl">{lesson.iconSymbol}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCefrBadgeStyle(
                              lesson.cefrLevel
                            )}`}
                          >
                            CEFR {lesson.cefrLevel}
                          </span>
                          <span className="text-[11px] font-bold text-[#1E4B43] bg-[#1E4B43]/10 px-2 py-0.5 rounded">
                            {lesson.categoryVi}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-[#1E4B43] group-hover:text-[#D9B76A] transition-colors leading-snug">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-[#6E7E79] italic">
                          {lesson.vietnameseTitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-[#3F5550] shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[rgba(30,75,67,0.10)]">
                      <div className="flex items-center gap-3 text-[#6E7E79]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {lesson.vocabCount} từ vựng
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmark(lesson.id)}
                          className="p-2 rounded-xl bg-[#F6EEDC] hover:bg-[#E8DFCB] text-[#1E4B43] transition-colors"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 fill-[#1E4B43]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <Link
                          href={`/reader?story=${lesson.id}`}
                          className="px-4 py-2 rounded-xl bg-[#1E4B43] hover:bg-[#163D37] text-[#FBF7EE] font-bold inline-flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <span>Đọc bài</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D9B76A]" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredLessons.length > 0 && totalPages > 1 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#F6EEDC]/80 border border-[rgba(30,75,67,0.12)]">
              <div className="text-xs font-semibold text-[#6E7E79]">
                Hiển thị <strong className="text-[#1E4B43]">{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong className="text-[#1E4B43]">{Math.min(currentPage * itemsPerPage, filteredLessons.length)}</strong> trên tổng số <strong className="text-[#1E4B43]">{filteredLessons.length}</strong> bài học
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.14)] text-[#1E4B43] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E8DFCB] transition-all shadow-xs"
                  title="Trang trước"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all ${
                        currentPage === page
                          ? "bg-[#1E4B43] text-[#FBF7EE] shadow-xs border border-[#D9B76A]/50 scale-105"
                          : "bg-[#FBF7EE] text-[#3F5550] hover:bg-[#E8DFCB] border border-[rgba(30,75,67,0.10)]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.14)] text-[#1E4B43] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E8DFCB] transition-all shadow-xs"
                  title="Trang sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Poetic Heritage Banner CTA */}
        <section className="rounded-3xl bg-gradient-to-r from-[#F6EEDC] via-[#FBF7EE] to-[#F6EEDC] border border-[#D9B76A]/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-3xl mb-2 block">🪷</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E4B43]">
              "Mỗi bài học là một chuyến du hành văn hóa"
            </h2>
            <p className="text-sm text-[#3F5550] mt-3 leading-relaxed">
              Hãy duy trì thói quen đọc 10 phút mỗi ngày để vừa am hiểu sâu sắc văn hóa dân tộc, vừa nâng tầm tiếng Anh chuẩn academic & IELTS.
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-[#1E4B43] bg-[#FBF7EE] hover:bg-[#F6EEDC] border border-[#D9B76A] shadow-sm transition-all"
              >
                <span>Quay về Trang Chủ VieCultures</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
