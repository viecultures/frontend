import React, { useState, useMemo, useEffect } from 'react';
import { LESSONS_DATA, getLessonStatsForLevel, type Lesson, type LevelType } from '@/data/discoveryData';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { readerApiService } from '@/features/reader/services/readerApiService';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { Sparkles } from 'lucide-react';

// Modular Discovery Sub-components
import { DiscoverySpotlight } from '../components/DiscoverySpotlight';
import { DiscoveryTopicTabs } from '../components/DiscoveryTopicTabs';
import { DiscoveryFilterToolbar } from '../components/DiscoveryFilterToolbar';
import { DiscoveryActiveFilterChips } from '../components/DiscoveryActiveFilterChips';
import { DiscoveryArticleGrid } from '../components/DiscoveryArticleGrid';
import { DiscoveryPagination } from '../components/DiscoveryPagination';
import { DiscoveryHeroQuoteBanner } from '../components/DiscoveryHeroQuoteBanner';

// Helper function to remove Vietnamese diacritics / accents for smart search matching
const removeAccents = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

export default function DiscoveryPage() {
  // State for filtering & layout
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedCefr, setSelectedCefr] = useState<string>('All');
  const [selectedReadTime, setSelectedReadTime] = useState<'All' | 'short' | 'medium' | 'long'>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'vocab' | 'time_asc' | 'time_desc'>('recent');
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({
    'imperial-hue': true,
  });
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [filterSource, setFilterSource] = useState<'all' | 'db'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendLessons, setBackendLessons] = useState<Lesson[]>([]);

  // Fetch backend grouped catalog and merge into catalog seamlessly
  useEffect(() => {
    let isMounted = true;
    readerApiService
      .getCatalog()
      .then((catalog) => {
        if (!isMounted || !catalog || !catalog.items || catalog.items.length === 0) return;
        const mapped: Lesson[] = catalog.items.map((item) =>
          readerApiService.mapCatalogLessonToDiscoveryLesson(item)
        );
        setBackendLessons(mapped);
      })
      .catch((err) => {
        console.warn('[Discovery] Không thể tải danh mục bài từ API backend:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Giữ lại mockdata hiện tại (LESSONS_DATA) sau đó thêm các data thật từ DB phía sau
  const catalogLessons = useMemo(() => {
    if (backendLessons.length === 0) return LESSONS_DATA;
    const mockIds = new Set(LESSONS_DATA.map((l) => l.id));
    const dedupedBackend = backendLessons.filter((l) => !mockIds.has(l.id));
    return [...LESSONS_DATA, ...dedupedBackend];
  }, [backendLessons]);

  // Smooth brief transition skeleton when changing major filters
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 220);
    return () => clearTimeout(timer);
  }, [selectedTopic, selectedCefr, selectedReadTime, sortBy, filterSource]);

  // Interactive Map Spotlight State
  const [activePinIndex, setActivePinIndex] = useState<number>(2);
  const [isAutoTour, setIsAutoTour] = useState<boolean>(true);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string | null>(null);

  useEffect(() => {
    if (!isAutoTour) return;
    const interval = setInterval(() => {
      setActivePinIndex((prev) => (prev + 1) % VIETNAM_LANDMARKS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoTour]);

  // Dynamic items per page based on view mode (Grid = 12, List = 20)
  const itemsPerPage = viewMode === 'grid' ? 12 : 20;

  // Reset pagination when filters or view mode change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTopic, selectedCefr, selectedReadTime, searchQuery, sortBy, onlyBookmarked, viewMode, filterSource]);

  // Toggle Favorite Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Count per Topic
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { All: catalogLessons.length };
    catalogLessons.forEach((lesson) => {
      counts[lesson.category] = (counts[lesson.category] || 0) + 1;
    });
    return counts;
  }, [catalogLessons]);

  // Smart Filter & Sort Logic
  const filteredLessons = useMemo(() => {
    return catalogLessons.filter((lesson) => {
      // Lọc theo nguồn: chỉ xem bài thật từ Database nếu được chọn
      if (filterSource === 'db' && !lesson.isFromDatabase) return false;

      if (selectedProvinceId && lesson.provinceId !== selectedProvinceId && !lesson.isNational) return false;

      // If filtering only bookmarked stories
      if (onlyBookmarked && !bookmarks[lesson.id]) return false;

      // Filter by Topic
      const matchTopic =
        selectedTopic === 'All' || lesson.category === selectedTopic;

      // Filter by Level (Every lesson supports Level 1, Level 2, Level 3)
      const matchCefr =
        selectedCefr === 'All' ||
        lesson.availableLevels?.includes(selectedCefr as any) ||
        lesson.cefrLevel === selectedCefr;

      // Level-specific stats for duration filtering
      const levelStats = getLessonStatsForLevel(lesson, selectedCefr);
      const readMinutes = parseInt(levelStats?.readTime || '3') || 3;

      const matchTime =
        selectedReadTime === 'All' ||
        (selectedReadTime === 'short' && readMinutes < 6) ||
        (selectedReadTime === 'medium' && readMinutes >= 6 && readMinutes <= 8) ||
        (selectedReadTime === 'long' && readMinutes > 8);

      // Smart Accent-Insensitive Search Query Matching (Null-safe)
      const q = searchQuery.toLowerCase().trim();
      const normalizedQ = removeAccents(q);

      const title = lesson.title || '';
      const viTitle = lesson.vietnameseTitle || '';
      const summary = lesson.summary || '';
      const catVi = lesson.categoryVi || '';

      const matchSearch =
        !q ||
        title.toLowerCase().includes(q) ||
        removeAccents(title.toLowerCase()).includes(normalizedQ) ||
        viTitle.toLowerCase().includes(q) ||
        removeAccents(viTitle.toLowerCase()).includes(normalizedQ) ||
        summary.toLowerCase().includes(q) ||
        removeAccents(summary.toLowerCase()).includes(normalizedQ) ||
        catVi.toLowerCase().includes(q) ||
        removeAccents(catVi.toLowerCase()).includes(normalizedQ);

      return matchTopic && matchCefr && matchTime && matchSearch;
    }).sort((a, b) => {
      const statsA = getLessonStatsForLevel(a, selectedCefr);
      const statsB = getLessonStatsForLevel(b, selectedCefr);

      if (sortBy === 'recent') {
        const dateA = a.dateAdded ? new Date(a.dateAdded).getTime() : 0;
        const dateB = b.dateAdded ? new Date(b.dateAdded).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'vocab') {
        return (statsB?.vocabCount || 0) - (statsA?.vocabCount || 0);
      }
      if (sortBy === 'time_asc') {
        return (parseInt(statsA?.readTime || '3') || 3) - (parseInt(statsB?.readTime || '3') || 3);
      }
      if (sortBy === 'time_desc') {
        return (parseInt(statsB?.readTime || '3') || 3) - (parseInt(statsA?.readTime || '3') || 3);
      }
      return 0;
    });
  }, [selectedTopic, selectedCefr, selectedReadTime, searchQuery, sortBy, onlyBookmarked, bookmarks, filterSource, catalogLessons]);

  // Pagination Calculation
  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / itemsPerPage));
  const paginatedLessons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLessons.slice(start, start + itemsPerPage);
  }, [filteredLessons, currentPage, itemsPerPage]);

  const resetAllFilters = () => {
    setSelectedTopic('All');
    setSelectedCefr('All');
    setSelectedReadTime('All');
    setSearchQuery('');
    setOnlyBookmarked(false);

    setFilterSource('all');
    setSelectedProvinceId(null);
    setSelectedProvinceName(null);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-warm-ivory text-text-body relative selection:bg-sky-mist selection:text-heritage-green pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* 1. Interactive Vietnam Map Spotlight Section */}
        <DiscoverySpotlight
          activePinIndex={activePinIndex}
          onSelectPinIndex={(idx) => {
            setIsAutoTour(false);
            setActivePinIndex(idx);
          }}
          onSelectProvince={(province: ProvinceMapItem | null) => {
            setIsAutoTour(false);
            setSelectedProvinceId(province?.id ?? null);
            setSelectedProvinceName(province?.name ?? null);
          }}
          onMouseEnter={() => setIsAutoTour(false)}
          onMouseLeave={() => setIsAutoTour(true)}
        />

        {/* 2. Topic Category Pill Tabs */}
        <DiscoveryTopicTabs
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          topicCounts={topicCounts}
        />

        {selectedProvinceId && (
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-heritage-green">
            <span className="rounded-full bg-heritage-green/10 px-3 py-1.5 border border-heritage-green/15">
              Đang xem bài học tại {selectedProvinceName}
            </span>
            <button
              type="button"
              onClick={() => { setSelectedProvinceId(null); setSelectedProvinceName(null); }}
              className="rounded-full px-2.5 py-1.5 text-text-secondary hover:bg-mist-cloud transition-colors"
            >
              Xóa lọc
            </button>
          </div>
        )}

        {/* 3. Filter, Search, Sort & View Mode Toolbar */}
        <DiscoveryFilterToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onlyBookmarked={onlyBookmarked}
          onToggleBookmarked={() => setOnlyBookmarked(!onlyBookmarked)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isSortOpen={isSortOpen}
          onToggleSortOpen={() => setIsSortOpen((prev) => !prev)}
          onCloseSort={() => setIsSortOpen(false)}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedCefr={selectedCefr}
          onSelectCefr={setSelectedCefr}
          selectedReadTime={selectedReadTime}
          onSelectReadTime={setSelectedReadTime}
        />

        {/* 4. Active Filters Chips */}
        <div className="-mt-4 mb-8">
          <DiscoveryActiveFilterChips
            selectedTopic={selectedTopic}
            onClearTopic={() => setSelectedTopic('All')}
            selectedCefr={selectedCefr}
            onClearCefr={() => setSelectedCefr('All')}
            selectedReadTime={selectedReadTime}
            onClearReadTime={() => setSelectedReadTime('All')}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onlyBookmarked={onlyBookmarked}
            onClearBookmarked={() => setOnlyBookmarked(false)}
            onResetAllFilters={resetAllFilters}
          />
        </div>

        {/* 4.5. Nguồn dữ liệu & Nút chuyển nhanh xem bài thật từ Database */}
        {backendLessons.length > 0 && (
          <div className="-mt-4 mb-6 flex flex-wrap items-center justify-between gap-3 bg-emerald-950/5 border border-emerald-600/20 rounded-2xl p-3 px-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-heritage-green">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>
                Cơ sở dữ liệu: <strong className="font-bold text-emerald-800">{backendLessons.length} bài viết từ DB</strong> đang được xếp sau {LESSONS_DATA.length} bài mẫu (ở trang sau hoặc bấm xem riêng bài DB).
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterSource('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterSource === 'all'
                  ? 'bg-heritage-green text-warm-ivory shadow-xs'
                  : 'bg-warm-ivory text-text-secondary hover:text-heritage-green border border-heritage-green/15'
                  }`}
              >
                Tất cả bài ({catalogLessons.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterSource('db')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${filterSource === 'db'
                  ? 'bg-emerald-700 text-warm-ivory shadow-xs ring-2 ring-emerald-500/50'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-600/25'
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chỉ xem bài từ DB ({backendLessons.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. Article Catalog Display (Grid / List) */}
        <section className="mb-12 relative z-10">
          <DiscoveryArticleGrid
            isLoading={isLoading}
            lessons={paginatedLessons}
            viewMode={viewMode}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
            onlyBookmarked={onlyBookmarked}
            onResetAllFilters={resetAllFilters}
            selectedCefr={selectedCefr}
          />

          {/* 6. Pagination Bar */}
          <DiscoveryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalLessons={filteredLessons.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </section>

        {/* 7. Poetic Heritage Call-to-Action Banner */}
        <DiscoveryHeroQuoteBanner />
      </div>
    </main>
  );
}
