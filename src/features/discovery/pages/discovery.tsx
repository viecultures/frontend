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
  MapPin,
  Sparkles,
} from "lucide-react";
import {
  LESSONS_DATA,
  type Lesson,
  getCefrBadgeStyle,
  TOPIC_OPTIONS,
  CEFR_LEVELS,
} from "@/data/discoveryData";
import VietnamMapCarousel from "@/features/discovery/components/vietnam-map-carousel";
import { VIETNAM_LANDMARKS } from "@/data/landmarksData";
import { ArticleCardSkeleton } from "@/components/ui/skeleton";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Smooth brief transition skeleton when changing major filters
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 220);
    return () => clearTimeout(timer);
  }, [selectedTopic, selectedCefr, selectedReadTime, sortBy]);

  // Interactive Map Spotlight State
  const [activePinIndex, setActivePinIndex] = useState<number>(2);
  const [isAutoTour, setIsAutoTour] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoTour) return;
    const interval = setInterval(() => {
      setActivePinIndex((prev) => (prev + 1) % VIETNAM_LANDMARKS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoTour]);

  const safePinIndex = Math.max(0, Math.min(activePinIndex, VIETNAM_LANDMARKS.length - 1));
  const activeLandmark = VIETNAM_LANDMARKS[safePinIndex] || VIETNAM_LANDMARKS[0];

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
    <main className="min-h-screen bg-warm-ivory text-text-body relative selection:bg-sky-mist selection:text-heritage-green pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* INTERACTIVE VIETNAM MAP SPOTLIGHT SECTION FOR DISCOVERY HUB */}
        <section className="mb-10 relative z-20">
          {/* Header Title (Simple & Left-Aligned) */}
          <div className="mb-4 text-left">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-heritage-green flex items-center gap-2">
              <MapPin className="w-5 h-5 text-antique-gold" />
              Khám Phá Bản Đồ Di Sản
            </h2>
            <p className="text-xs text-text-secondary mt-1">
              Nhấp vào các tỉnh thành 📍 trên bản đồ để xem bài đọc tiêu điểm và học từ vựng di sản song ngữ.
            </p>
          </div>

          {/* Seamless 4:6 Grid (40% Map : 60% Content) without Outer Card Container */}
          <div
            className="grid grid-cols-1 lg:grid-cols-10 gap-6 sm:gap-8 items-stretch"
            onMouseEnter={() => setIsAutoTour(false)}
            onMouseLeave={() => setIsAutoTour(true)}
          >
            {/* LEFT COLUMN: Map Container (40% Width) */}
            <div className="lg:col-span-4 relative bg-heritage-forest border border-heritage-green/20 rounded-2xl p-2.5 shadow-md flex flex-col justify-between items-center h-full overflow-hidden min-h-[440px]">
              <VietnamMapCarousel
                activeIndex={activePinIndex}
                onSelectLandmark={setActivePinIndex}
                showRegionTabs={false}
                showPoiInfoBox={false}
              />
            </div>

            {/* RIGHT COLUMN: Landmark Article Content (60% Width - Direct Layout without Card Frame) */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full">

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-heritage-green/10 border border-heritage-green/15 text-heritage-green text-xs font-bold mb-3 w-fit">
                <MapPin className="w-3.5 h-3.5 text-antique-gold" />
                <span>{activeLandmark.locationNameVi}</span>
              </div>

              {/* Feature Image Banner */}
              <div className="relative h-40 sm:h-44 rounded-2xl overflow-hidden mb-3.5 border border-heritage-green/15 shadow-xs group">
                <img
                  src={activeLandmark.image}
                  alt={activeLandmark.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-heritage-green/80 via-black/10 to-transparent" />

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-heritage-green text-warm-ivory shadow-xs">
                    {activeLandmark.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-antique-gold text-heritage-green shadow-xs">
                    Band {activeLandmark.level}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-medium text-warm-ivory">
                  <span className="bg-heritage-green/90 px-3 py-0.5 rounded-full border border-white/20 backdrop-blur-md text-[11px]">
                    ⏱️ {activeLandmark.readTime} đọc song ngữ
                  </span>
                  <span className="bg-antique-gold text-heritage-green px-3 py-0.5 rounded-full font-extrabold text-[11px] shadow-xs">
                    🌟 Di Sản Tiêu Điểm
                  </span>
                </div>
              </div>

              {/* Article Titles */}
              <div className="space-y-0.5 mb-2.5">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-heritage-green leading-snug">
                  {activeLandmark.title}
                </h3>
                <p className="text-xs font-bold text-antique-gold">
                  {activeLandmark.titleVi}
                </p>
              </div>

              {/* Bilingual Excerpt Box */}
              <div className="space-y-1.5 mb-3 bg-rice-paper p-3.5 rounded-2xl border border-heritage-green/12 shadow-xs">
                <p className="text-xs sm:text-sm text-heritage-green leading-relaxed font-serif">
                  "{activeLandmark.excerptEn}"
                </p>
                <p className="text-xs text-text-secondary leading-relaxed italic border-t border-heritage-green/8 pt-1.5 font-sans">
                  "{activeLandmark.excerptVi}"
                </p>
              </div>

              {/* Vocabulary Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-xs font-extrabold text-heritage-green/70">Từ vựng di sản:</span>
                {activeLandmark.vocabHighlights.map((vocab, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-xl text-xs font-bold bg-heritage-green/10 text-heritage-green border border-heritage-green/12"
                  >
                    ✨ {vocab}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-heritage-green/10">
                <Link
                  href={`/reader?story=${activeLandmark.id}`}
                  className="px-5 py-2.5 text-xs font-extrabold flex items-center gap-2 rounded-full bg-heritage-green text-warm-ivory hover:bg-heritage-dark shadow-md hover:scale-102 transition-all focus-ring"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Đọc Song Ngữ &amp; AI Shadowing</span>
                </Link>

                <Link
                  href={`/flashcards`}
                  className="px-4 py-2.5 text-xs font-bold flex items-center gap-2 rounded-full bg-rice-paper text-heritage-green border border-heritage-green/20 hover:bg-mist-cloud transition-all focus-ring"
                >
                  <Sparkles className="w-4 h-4 text-antique-gold" />
                  <span>Ôn Flashcard Địa Danh</span>
                </Link>
              </div>

            </div>

          </div>
        </section>

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
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/50 scale-102"
                      : "bg-rice-paper text-text-body hover:bg-mist-cloud border border-heritage-green/10"
                    }`}
                >
                  <span className="text-base">{topic.icon}</span>
                  <span>{topic.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isActive
                        ? "bg-antique-gold text-heritage-green"
                        : "bg-mist-cloud text-heritage-green"
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
          <div className="p-6 rounded-3xl bg-rice-paper/90 border border-heritage-green/12 shadow-[0_4px_20px_-4px] shadow-heritage-green/6 backdrop-blur-sm space-y-5 relative z-30">
            {/* Top Row: Search Input, Bookmarks, Sort & View Mode */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              {/* Smart Search Box */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm thông minh (gõ không dấu: banh mi, hue, son doong)..."
                  className="w-full pl-11 pr-10 py-3 rounded-2xl bg-warm-ivory border border-heritage-green/16 text-sm text-heritage-green placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-heritage-green/30 focus:border-heritage-green transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted hover:text-heritage-green p-1 rounded-full hover:bg-mist-cloud"
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
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${onlyBookmarked
                      ? "bg-heritage-green text-warm-ivory border-antique-gold/60 shadow-sm"
                      : "bg-warm-ivory text-heritage-green border-heritage-green/18 hover:bg-rice-paper shadow-xs hover:border-antique-gold"
                    }`}
                >
                  <Star className={`w-4 h-4 ${onlyBookmarked ? "fill-antique-gold text-antique-gold" : "text-antique-gold"}`} />
                  <span>Đã lưu</span>
                </button>

                {/* Custom React Floating Sort Dropdown Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSortOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-warm-ivory px-4 py-2.5 rounded-2xl border border-heritage-green/18 text-xs font-bold text-heritage-green shadow-xs hover:border-antique-gold transition-all cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-antique-gold shrink-0" />
                    <span className="text-text-secondary">Sắp xếp:</span>
                    <span className="font-extrabold text-heritage-green">
                      {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-heritage-green transition-transform duration-200 ${isSortOpen ? "rotate-180 text-antique-gold" : ""
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
                      <div className="absolute right-0 top-full mt-2 w-52 bg-warm-ivory border border-antique-gold/40 rounded-2xl shadow-xl z-50 p-1.5 space-y-1 backdrop-blur-md">
                        {SORT_OPTIONS.map((opt) => {
                          const isSelected = sortBy === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setSortBy(opt.value as any);
                                setIsSortOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${isSelected
                                  ? "bg-heritage-green text-warm-ivory shadow-xs"
                                  : "text-text-body hover:bg-rice-paper hover:text-heritage-green"
                                }`}
                            >
                              <span>{opt.label}</span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-antique-gold" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-warm-ivory p-1 rounded-2xl border border-heritage-green/18 shadow-xs">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${viewMode === "grid"
                        ? "bg-heritage-green text-warm-ivory shadow-xs scale-102"
                        : "text-text-secondary hover:text-heritage-green hover:bg-rice-paper"
                      }`}
                    title="Chế độ lưới (Grid 12 bài/trang)"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${viewMode === "list"
                        ? "bg-heritage-green text-warm-ivory shadow-xs scale-102"
                        : "text-text-secondary hover:text-heritage-green hover:bg-rice-paper"
                      }`}
                    title="Chế độ danh sách (List 20 bài/trang)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Row: CEFR Level & Reading Time Duration Smart Filters */}
            <div className="pt-3 border-t border-heritage-green/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* CEFR Level Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-heritage-green flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5" />
                  Trình độ CEFR:
                </span>
                {CEFR_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedCefr(lvl)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${selectedCefr === lvl
                        ? "bg-heritage-green text-warm-ivory shadow-xs border border-antique-gold/50"
                        : "bg-warm-ivory text-heritage-green hover:bg-mist-cloud border border-heritage-green/12"
                      }`}
                  >
                    {lvl === "All" ? "Tất cả" : lvl}
                  </button>
                ))}
              </div>

              {/* Reading Duration Filter */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-heritage-green flex items-center gap-1 mr-1">
                  <Clock className="w-3.5 h-3.5 text-antique-gold" />
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
                    className={`px-3 py-1 rounded-xl font-bold transition-all ${selectedReadTime === dur.value
                        ? "bg-heritage-green text-warm-ivory shadow-xs"
                        : "bg-warm-ivory text-text-body hover:bg-mist-cloud border border-heritage-green/10"
                      }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Active Filter Badges Bar */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-heritage-green/10 flex items-center justify-between gap-3 flex-wrap text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-text-secondary">Bộ lọc đang chọn:</span>

                  {selectedTopic !== "All" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
                      Chủ đề: {TOPIC_OPTIONS.find((t) => t.value === selectedTopic)?.label}
                      <button onClick={() => setSelectedTopic("All")} className="hover:text-antique-gold">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCefr !== "All" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
                      CEFR: {selectedCefr}
                      <button onClick={() => setSelectedCefr("All")} className="hover:text-antique-gold">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedReadTime !== "All" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
                      Thời lượng: {selectedReadTime === "short" ? "< 6 phút" : selectedReadTime === "medium" ? "6-8 phút" : "> 8 phút"}
                      <button onClick={() => setSelectedReadTime("All")} className="hover:text-antique-gold">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
                      Từ khóa: "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="hover:text-antique-gold">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {onlyBookmarked && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-heritage-green text-warm-ivory font-bold">
                      ⭐️ Bài viết đã lưu
                      <button onClick={() => setOnlyBookmarked(false)} className="hover:text-antique-gold">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 font-bold text-heritage-green hover:underline underline-offset-2 ml-auto focus-ring"
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
          {isLoading ? (
            /* Loading Shimmer Skeletons (Rice-paper tone) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <ArticleCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredLessons.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center rounded-3xl bg-rice-paper/60 border border-dashed border-heritage-green/25 p-8">
              <div className="w-16 h-16 rounded-full bg-mist-cloud flex items-center justify-center mx-auto mb-4 text-heritage-green">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-heritage-green">
                Không tìm thấy bài học phù hợp
              </h3>
              <p className="text-sm text-text-body mt-2 max-w-md mx-auto">
                {onlyBookmarked
                  ? "Bạn chưa lưu bài học nào trong danh mục này."
                  : `Không tìm thấy câu chuyện văn hóa nào khớp với các bộ lọc hiện tại.`}
              </p>
              <button
                onClick={resetAllFilters}
                className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm transition-all focus-ring"
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
                    className="group relative rounded-3xl bg-warm-ivory border border-heritage-green/12 shadow-[0_4px_20px_-4px] shadow-heritage-green/6 hover:shadow-[0_12px_32px_-6px] shadow-heritage-green/16 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 focus-ring"
                  >
                    {/* Card Cover (Clean Image without Overlay & Middle Icon) */}
                    <div className="relative h-48 w-full bg-gradient-to-br from-heritage-green to-heritage-dark overflow-hidden">
                      {lesson.imageUrl ? (
                        <img
                          src={lesson.imageUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {lesson.iconSymbol}
                        </div>
                      )}
                    </div>

                    {/* Card Body & Metadata Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between bg-warm-ivory">
                      <div className="space-y-3">
                        {/* Metadata Row 1: Category Badge & Bookmark Button */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-heritage-green/10 text-heritage-green border border-heritage-green/15 shadow-xs">
                            {lesson.categoryVi}
                          </span>
                          <button
                            onClick={() => toggleBookmark(lesson.id)}
                            className="p-1.5 rounded-full bg-mist-cloud/60 hover:bg-mist-cloud text-heritage-green transition-all"
                            aria-label="Bookmark lesson"
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-4 h-4 text-heritage-green fill-heritage-green" />
                            ) : (
                              <Bookmark className="w-4 h-4 text-heritage-green" />
                            )}
                          </button>
                        </div>

                        {/* Story Title & Summary */}
                        <div>
                          <h3 className="font-serif text-xl font-bold text-heritage-green leading-snug group-hover:text-antique-gold transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="text-xs text-text-secondary mt-1 font-medium italic">
                            {lesson.vietnameseTitle}
                          </p>
                          <p className="text-xs text-text-body mt-2.5 line-clamp-3 leading-relaxed">
                            {lesson.summary}
                          </p>
                        </div>

                        {/* Metadata Row 2: CEFR Badge & Reading Time */}
                        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase pt-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-md border shadow-xs ${getCefrBadgeStyle(
                              lesson.cefrLevel
                            )}`}
                          >
                            CEFR {lesson.cefrLevel}
                          </span>
                          <span className="flex items-center gap-1 text-text-secondary">
                            <Clock className="w-3.5 h-3.5 text-antique-gold" />
                            {lesson.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer: Vocab Count & Read Action */}
                      <div className="mt-5 pt-4 border-t border-heritage-green/10 flex items-center justify-between text-xs">
                        <span className="font-semibold text-text-secondary flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-heritage-green" />
                          {lesson.vocabCount} Từ vựng
                        </span>
                        <Link
                          href={`/reader?story=${lesson.id}`}
                          className="font-bold text-heritage-green group-hover:text-antique-gold inline-flex items-center gap-1 transition-colors focus-ring"
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
                    className="group rounded-2xl bg-warm-ivory border border-heritage-green/12 p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-antique-gold/60 focus-ring"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${lesson.gradient} flex items-center justify-center shrink-0 shadow-xs border border-antique-gold/30 overflow-hidden relative`}
                      >
                        {lesson.imageUrl ? (
                          <img
                            src={lesson.imageUrl}
                            alt={lesson.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-2xl">{lesson.iconSymbol}</span>
                        )}
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
                          <span className="text-[11px] font-bold text-heritage-green bg-heritage-green/10 px-2 py-0.5 rounded">
                            {lesson.categoryVi}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-heritage-green group-hover:text-antique-gold transition-colors leading-snug">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-text-secondary italic">
                          {lesson.vietnameseTitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-text-body shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-heritage-green/10">
                      <div className="flex items-center gap-3 text-text-secondary">
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
                          className="p-2 rounded-xl bg-rice-paper hover:bg-mist-cloud text-heritage-green transition-colors"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 fill-heritage-green" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                        <Link
                          href={`/reader?story=${lesson.id}`}
                          className="px-4 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold inline-flex items-center gap-1.5 transition-all shadow-xs focus-ring"
                        >
                          <span>Đọc bài</span>
                          <ArrowRight className="w-3.5 h-3.5 text-antique-gold" />
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
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-rice-paper/80 border border-heritage-green/12">
              <div className="text-xs font-semibold text-text-secondary">
                Hiển thị <strong className="text-heritage-green">{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong className="text-heritage-green">{Math.min(currentPage * itemsPerPage, filteredLessons.length)}</strong> trên tổng số <strong className="text-heritage-green">{filteredLessons.length}</strong> bài học
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-warm-ivory border border-heritage-green/14 text-heritage-green disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mist-cloud transition-all shadow-xs"
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
                      className={`w-8 h-8 rounded-xl text-xs font-extrabold transition-all ${currentPage === page
                          ? "bg-heritage-green text-warm-ivory shadow-xs border border-antique-gold/50 scale-105"
                          : "bg-warm-ivory text-text-body hover:bg-mist-cloud border border-heritage-green/10"
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
                  className="p-2 rounded-xl bg-warm-ivory border border-heritage-green/14 text-heritage-green disabled:opacity-40 disabled:cursor-not-allowed hover:bg-mist-cloud transition-all shadow-xs"
                  title="Trang sau"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Poetic Heritage Banner CTA */}
        <section className="rounded-3xl bg-gradient-to-r from-rice-paper via-warm-ivory to-rice-paper border border-antique-gold/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-3xl mb-2 block">🪷</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-green">
              "Mỗi bài học là một chuyến du hành văn hóa"
            </h2>
            <p className="text-sm text-text-body mt-3 leading-relaxed">
              Hãy duy trì thói quen đọc 10 phút mỗi ngày để vừa am hiểu sâu sắc văn hóa dân tộc, vừa nâng tầm tiếng Anh chuẩn academic & IELTS.
            </p>
            <div className="mt-6">
              <Link
                href="/home"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-warm-ivory hover:bg-rice-paper border border-antique-gold shadow-sm transition-all focus-ring"
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
