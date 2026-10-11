import React, { useState, useMemo, useEffect } from 'react';
import { LESSONS_DATA, getLessonStatsForLevel, type Lesson, type LevelType } from '@/data/discoveryData';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { readerApiService } from '@/features/reader/services/readerApiService';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendLessons, setBackendLessons] = useState<Lesson[]>([]);

  // Fetch backend posts and merge into catalog seamlessly
  useEffect(() => {
    let isMounted = true;
    readerApiService
      .getAllPosts()
      .then((posts) => {
        if (!isMounted || !posts || posts.length === 0) return;
        const mapped: Lesson[] = posts.map((post) => {
          const levelMapped: LevelType =
            post.level === 'A1' || post.level === 'A2'
              ? 'Level 1'
              : post.level === 'C1' || post.level === 'C2'
              ? 'Level 3'
              : 'Level 2';

          const readTimeStr =
            post.readTime || `${Math.max(2, Math.ceil((post.wordCount || 250) / 100))} min read`;
          const vocabCount = post.vocabularies?.length || 8;

          return {
            id: post.id,
            title: post.titleEn,
            vietnameseTitle: post.titleVi,
            category: (['Heritage', 'Cuisine', 'Crafts', 'Nature', 'Folklore'].includes(post.topic)
              ? post.topic
              : 'Heritage') as any,
            categoryVi: post.topic || 'Văn hóa & Phong tục',
            cefrLevel: levelMapped,
            availableLevels: ['Level 1', 'Level 2', 'Level 3'],
            levelDetails: {
              'Level 1': { readTime: '3 min read', vocabCount: 6, summary: post.summary },
              'Level 2': { readTime: readTimeStr, vocabCount, summary: post.summary },
              'Level 3': { readTime: '6 min read', vocabCount: 12, summary: post.summary },
            },
            readTime: readTimeStr,
            vocabCount,
            summary: post.summary || '',
            gradient: 'from-amber-600/40 via-emerald-800/60 to-heritage-green/90',
            iconSymbol: '🏛️',
            imageUrl:
              post.imageUrl ||
              'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80',
            featured: false,
            dateAdded: post.createdAt || new Date().toISOString(),
          };
        });
        setBackendLessons(mapped);
      })
      .catch((err) => {
        console.warn('[Discovery] Không thể tải bài từ API backend:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Merge backend posts ahead of static catalog (avoiding duplicate IDs)
  const catalogLessons = useMemo(() => {
    if (backendLessons.length === 0) return LESSONS_DATA;
    const backendIds = new Set(backendLessons.map((l) => l.id));
    const dedupedLessons = LESSONS_DATA.filter((l) => !backendIds.has(l.id));
    return [...backendLessons, ...dedupedLessons];
  }, [backendLessons]);

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

  // Dynamic items per page based on view mode (Grid = 12, List = 20)
  const itemsPerPage = viewMode === 'grid' ? 12 : 20;

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
    const counts: Record<string, number> = { All: catalogLessons.length };
    catalogLessons.forEach((lesson) => {
      counts[lesson.category] = (counts[lesson.category] || 0) + 1;
    });
    return counts;
  }, [catalogLessons]);

  // Smart Filter & Sort Logic
  const filteredLessons = useMemo(() => {
    return catalogLessons.filter((lesson) => {
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
      const readMinutes = parseInt(levelStats.readTime);

      const matchTime =
        selectedReadTime === 'All' ||
        (selectedReadTime === 'short' && readMinutes < 6) ||
        (selectedReadTime === 'medium' && readMinutes >= 6 && readMinutes <= 8) ||
        (selectedReadTime === 'long' && readMinutes > 8);

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
      const statsA = getLessonStatsForLevel(a, selectedCefr);
      const statsB = getLessonStatsForLevel(b, selectedCefr);

      if (sortBy === 'recent') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      if (sortBy === 'vocab') {
        return statsB.vocabCount - statsA.vocabCount;
      }
      if (sortBy === 'time_asc') {
        return parseInt(statsA.readTime) - parseInt(statsB.readTime);
      }
      if (sortBy === 'time_desc') {
        return parseInt(statsB.readTime) - parseInt(statsA.readTime);
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
    setSelectedTopic('All');
    setSelectedCefr('All');
    setSelectedReadTime('All');
    setSearchQuery('');
    setOnlyBookmarked(false);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-warm-ivory text-text-body relative selection:bg-sky-mist selection:text-heritage-green pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* 1. Interactive Vietnam Map Spotlight Section */}
        <DiscoverySpotlight
          activePinIndex={activePinIndex}
          onSelectPinIndex={setActivePinIndex}
          onMouseEnter={() => setIsAutoTour(false)}
          onMouseLeave={() => setIsAutoTour(true)}
        />

        {/* 2. Topic Category Pill Tabs */}
        <DiscoveryTopicTabs
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          topicCounts={topicCounts}
        />

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
