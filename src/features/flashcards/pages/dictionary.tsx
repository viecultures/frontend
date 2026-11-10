import { useTranslation } from 'react-i18next';
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ArrowUpRight, BookOpen, BookmarkCheck, RefreshCw, Wifi, WifiOff, Loader2 } from "lucide-react";
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { listSavedArticles } from '@/services/learning/learningStorage';
import { LESSONS_DATA, type Lesson } from "@/data/discoveryData";
import { readerApiService } from '@/features/reader/services/readerApiService';
import FlashcardSidebarLayout from "../components/flashcard-sidebar-layout";
import {
  DictionaryDailyHero,
  DictionaryQuickActionCards,
  DictionaryCategoryFilter,
  DictionaryLibraryGrid,
  DictionaryPagination,
  DictionaryInspectorModal,
} from "../components";
import { SavedVocabularyDecks } from '../components/SavedVocabularyDecks';
import { paths } from '@/routes/paths';
import { VOCABULARY_CATEGORY_LABELS, VOCABULARY_PAGE_SIZE } from '../lib/vocabulary-catalog';
import '../dictionary-components.css';

const TOPIC_GRADIENTS: Record<string, string> = {
  Heritage: 'from-[#1b3d33] via-[#244e43] to-[#386554]',
  Cuisine: 'from-[#803d23] via-[#9b583b] to-[#b87550]',
  Crafts: 'from-[#8e6e36] via-[#b59258] to-[#c6a970]',
  Nature: 'from-[#2e5950] via-[#47776c] to-[#639183]',
  Folklore: 'from-[#65332d] via-[#7e4943] to-[#a36350]',
};

interface CatalogCacheEntry {
  lessons: Lesson[];
  totalElements: number;
  totalPages: number;
  topicCounts: Record<string, number>;
}

export default function DictionaryPage() {
  const { t, i18n } = useTranslation('flashcards');
  const isVi = i18n.language.toLowerCase().startsWith('vi');
  const navigate = useAppNavigate();
  const libraryRef = useRef<HTMLElement>(null);
  const savedDecksRef = useRef<HTMLDivElement>(null);
  const [sortOrder, setSortOrder] = useState<string>("default");

  // API State
  const [apiLessons, setApiLessons] = useState<Lesson[]>([]);
  const [serverTotalElements, setServerTotalElements] = useState<number>(0);
  const [serverTotalPages, setServerTotalPages] = useState<number>(1);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [vocabVersion, setVocabVersion] = useState<number>(0);

  // Inspector Modal state
  const [inspectLesson, setInspectLesson] = useState<Lesson | null>(null);

  // In-memory catalog cache for instant page switching
  const catalogCacheRef = useRef<Map<string, CatalogCacheEntry>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce search query input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync saved vocabulary modifications
  useEffect(() => {
    const handleUpdate = () => setVocabVersion((v) => v + 1);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('vie_vocab_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('vie_vocab_updated', handleUpdate);
    };
  }, []);

  const isMyVocab = selectedCategory === "MyVocab";

  // Fetch catalog with server-side pagination, caching, and 6s timeout fallback
  const fetchCatalogLessons = useCallback(async (
    page: number,
    category: string,
    query: string,
    sort: string,
    forceRefresh: boolean = false
  ) => {
    if (category === "MyVocab") {
      setIsLoading(false);
      return;
    }

    const trimmedQuery = query.trim().toLowerCase();
    const cacheKey = `${category}_${trimmedQuery}_${sort}_${page}`;

    if (!forceRefresh && catalogCacheRef.current.has(cacheKey)) {
      const cached = catalogCacheRef.current.get(cacheKey)!;
      setApiLessons(cached.lessons);
      setServerTotalElements(cached.totalElements);
      setServerTotalPages(cached.totalPages);
      if (cached.topicCounts) setTopicCounts(cached.topicCounts);
      setIsApiConnected(true);
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    try {
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const topicParam = category === "All" ? undefined : category;

      const catalogData = await readerApiService.getCatalog({
        topic: topicParam,
        query: trimmedQuery || undefined,
        sortBy: sort,
        page: Math.max(0, page - 1),
        size: VOCABULARY_PAGE_SIZE,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (catalogData && Array.isArray(catalogData.items)) {
        const mappedLessons = catalogData.items.map((item) => {
          const lesson = readerApiService.mapCatalogLessonToDiscoveryLesson(item);
          if (TOPIC_GRADIENTS[lesson.category]) {
            lesson.gradient = TOPIC_GRADIENTS[lesson.category];
          }
          return lesson;
        });

        const entry: CatalogCacheEntry = {
          lessons: mappedLessons,
          totalElements: catalogData.totalElements ?? mappedLessons.length,
          totalPages: catalogData.totalPages ?? Math.max(1, Math.ceil((catalogData.totalElements ?? mappedLessons.length) / VOCABULARY_PAGE_SIZE)),
          topicCounts: catalogData.topicCounts ?? {},
        };

        catalogCacheRef.current.set(cacheKey, entry);
        setApiLessons(entry.lessons);
        setServerTotalElements(entry.totalElements);
        setServerTotalPages(entry.totalPages);
        setTopicCounts(entry.topicCounts);
        setIsApiConnected(true);
      } else {
        setIsApiConnected(false);
      }
    } catch (err: unknown) {
      if ((err as Error)?.name !== 'AbortError') {
        console.warn('[DictionaryPage] Không thể kết nối API bài viết, kích hoạt chế độ dự phòng mock data:', err);
        setIsApiConnected(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when page, category, debounced search or sort order changes
  useEffect(() => {
    fetchCatalogLessons(currentPage, selectedCategory, debouncedQuery, sortOrder);
  }, [currentPage, selectedCategory, debouncedQuery, sortOrder, fetchCatalogLessons]);

  // Clean up in-flight requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const savedArticles = useMemo(
    () => listSavedArticles().filter(({ count }) => count > 0),
    [vocabVersion]
  );

  const savedWordCount = useMemo(
    () => savedArticles.reduce((count, entry) => count + entry.count, 0),
    [savedArticles]
  );

  const totalCatalogDecks = useMemo(() => {
    if (!isApiConnected) return LESSONS_DATA.length;
    const sum = Object.values(topicCounts).reduce((acc, curr) => acc + curr, 0);
    return sum > 0 ? sum : serverTotalElements;
  }, [isApiConnected, topicCounts, serverTotalElements]);

  const categoryOptions = useMemo(() => [
    { label: `${t('categories.all', 'All')} (${totalCatalogDecks})`, value: "All" },
    {
      value: "MyVocab",
      label: `${t('categories.MyVocab', 'Từ vựng của tôi')}${savedWordCount > 0 ? ` (${savedWordCount})` : ''}`,
    },
    ...Object.entries(VOCABULARY_CATEGORY_LABELS).map(([value]) => {
      const count = isApiConnected
        ? (topicCounts[value] ?? 0)
        : LESSONS_DATA.filter((l) => l.category === value).length;
      return {
        value,
        label: count > 0 ? `${t(`categories.${value}`, value)} (${count})` : t(`categories.${value}`, value),
      };
    }),
  ], [t, savedWordCount, totalCatalogDecks, isApiConnected, topicCounts]);

  // Fallback Filtered Lessons when offline or API disconnected
  const fallbackFilteredLessons = useMemo(() => {
    if (isMyVocab) return [];
    const lessons = LESSONS_DATA.filter((lesson) => {
      const matchCat =
        selectedCategory === "All" || lesson.category === selectedCategory;
      const q = debouncedQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.vietnameseTitle.toLowerCase().includes(q) ||
        lesson.summary.toLowerCase().includes(q) ||
        Boolean(lesson.summaryVi?.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
    if (sortOrder === "name") {
      lessons.sort((a, b) =>
        isVi
          ? (a.vietnameseTitle || a.title).localeCompare(b.vietnameseTitle || b.title, "vi")
          : a.title.localeCompare(b.title, "en")
      );
    }
    if (sortOrder === "newest") lessons.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    return lessons;
  }, [isMyVocab, selectedCategory, debouncedQuery, sortOrder, isVi]);

  // Filtered Saved Articles (My Vocabulary)
  const filteredSavedArticles = useMemo(() => {
    if (!isMyVocab) return [];
    const q = debouncedQuery.toLowerCase().trim();
    const list = savedArticles.filter(({ article }) => {
      if (!q) return true;
      const titleEn = (article.titleEn || '').toLowerCase();
      const titleVi = (article.titleVi || '').toLowerCase();
      return titleEn.includes(q) || titleVi.includes(q);
    });
    if (sortOrder === "name") {
      list.sort((a, b) => {
        const titleA = isVi ? articleTitle(a.article, true) : articleTitle(a.article, false);
        const titleB = isVi ? articleTitle(b.article, true) : articleTitle(b.article, false);
        return titleA.localeCompare(titleB, isVi ? "vi" : "en");
      });
    }
    return list;
  }, [isMyVocab, debouncedQuery, savedArticles, sortOrder, isVi]);

  function articleTitle(article: { titleEn?: string; titleVi?: string }, preferVi: boolean): string {
    if (preferVi) return article.titleVi || article.titleEn || '';
    return article.titleEn || article.titleVi || '';
  }

  const totalCount = useMemo(() => {
    if (isMyVocab) return filteredSavedArticles.length;
    if (isApiConnected) return serverTotalElements;
    return fallbackFilteredLessons.length;
  }, [isMyVocab, filteredSavedArticles.length, isApiConnected, serverTotalElements, fallbackFilteredLessons.length]);

  const totalPages = useMemo(() => {
    if (isMyVocab) return Math.max(1, Math.ceil(filteredSavedArticles.length / VOCABULARY_PAGE_SIZE));
    if (isApiConnected) return Math.max(1, serverTotalPages);
    return Math.max(1, Math.ceil(fallbackFilteredLessons.length / VOCABULARY_PAGE_SIZE));
  }, [isMyVocab, filteredSavedArticles.length, isApiConnected, serverTotalPages, fallbackFilteredLessons.length]);

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedLessons = useMemo(() => {
    if (isMyVocab) return [];
    if (isApiConnected) return apiLessons;
    const startIndex = (safeCurrentPage - 1) * VOCABULARY_PAGE_SIZE;
    return fallbackFilteredLessons.slice(startIndex, startIndex + VOCABULARY_PAGE_SIZE);
  }, [isMyVocab, isApiConnected, apiLessons, fallbackFilteredLessons, safeCurrentPage]);

  const paginatedSavedArticles = useMemo(() => {
    if (!isMyVocab) return [];
    const startIndex = (safeCurrentPage - 1) * VOCABULARY_PAGE_SIZE;
    return filteredSavedArticles.slice(startIndex, startIndex + VOCABULARY_PAGE_SIZE);
  }, [isMyVocab, filteredSavedArticles, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    libraryRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  };

  const handleRefreshSync = () => {
    catalogCacheRef.current.clear();
    fetchCatalogLessons(currentPage, selectedCategory, debouncedQuery, sortOrder, true);
  };

  // Audio Pronunciation
  const playAudio = (word: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = "en-US";
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleGoToStudy = (lessonId: string) => {
    navigate(paths.flashcardStudy({ deck: lessonId }));
  };

  const defaultHeroLessonId = apiLessons[0]?.id || LESSONS_DATA[0]?.id || "imperial-hue";

  return (
    <FlashcardSidebarLayout>
      <div className="vocab-library-page">
        {/* Daily recommendation and quick actions */}
        <div className="space-y-4">
          <DictionaryDailyHero
            searchQuery={searchQuery}
            onChangeSearch={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
          />

          <DictionaryQuickActionCards
            onGoToRecent={() => handleGoToStudy(defaultHeroLessonId)}
            onExploreMore={() => {
              setSelectedCategory("All");
              setCurrentPage(1);
              libraryRef.current?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                block: "start",
              });
            }}
            onReviewSaved={() => {
              setSelectedCategory("MyVocab");
              setCurrentPage(1);
              libraryRef.current?.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                block: 'start',
              });
            }}
            savedWordCount={savedWordCount}
          />
        </div>

        {!isMyVocab && savedWordCount > 0 && (
          <div ref={savedDecksRef} className="vocab-saved-decks">
            <SavedVocabularyDecks />
          </div>
        )}

        {/* Cultural vocabulary catalog */}
        <section ref={libraryRef} className="vocab-library-section" aria-labelledby="vocab-library-title">
          <div className="vocab-library-heading">
            <div>
              <div className="flex items-center gap-2">
                <p className="vocab-eyebrow">{t('dictionary.catalog_eyebrow', 'LEARN LANGUAGE THROUGH HERITAGE')}</p>
                
              </div>
              <h2 id="vocab-library-title">
                {isMyVocab
                  ? t('categories.MyVocab', 'Từ vựng của tôi')
                  : t('dictionary.catalog_title', 'Vocabulary decks')}{' '}
                <span>{isMyVocab ? savedWordCount : totalCount}</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {!isApiConnected && !isLoading && (
                <button
                  type="button"
                  onClick={handleRefreshSync}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-line bg-surface hover:bg-surface-muted text-ink-soft inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  title={t('dictionary.reconnect_api', 'Thử kết nối lại API')}
                >
                  <RefreshCw size={13} />
                  <span>{t('dictionary.retry_sync', 'Đồng bộ lại')}</span>
                </button>
              )}
              <label className="vocab-sort">
                <span>{t('dictionary.sort_label', 'Sort by:')}</span>
                <select
                  aria-label={t('dictionary.sort_label', 'Sort vocabulary decks')}
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="default">{t('dictionary.sort_recommended', 'Recommended')}</option>
                  <option value="newest">{t('dictionary.sort_newest', 'Newest')}</option>
                  <option value="name">{t('dictionary.sort_name', 'Name A–Z')}</option>
                </select>
              </label>
            </div>
          </div>

          {/* Category Filter Pills */}
          <DictionaryCategoryFilter
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
          />

          <p className="vocab-results" role="status">
            {isMyVocab
              ? (debouncedQuery
                  ? t('dictionary.decks_found', { count: filteredSavedArticles.length, query: debouncedQuery, defaultValue: `${filteredSavedArticles.length} decks found for “${debouncedQuery}”` })
                  : t('saved_decks.words_count', { count: savedWordCount, defaultValue: `${savedWordCount} saved words` }))
              : (debouncedQuery
                  ? t('dictionary.decks_found', { count: totalCount, query: debouncedQuery, defaultValue: `${totalCount} decks found for “${debouncedQuery}”` })
                  : t('dictionary.decks_to_explore', { count: totalCount, defaultValue: `${totalCount} decks to explore` }))}
          </p>

          {/* Content Area with 5-State Handling */}
          {isLoading ? (
            <div className="space-y-4" role="status" aria-busy="true" aria-label={t('dictionary.loading_decks', 'Đang tải dữ liệu bài học...')}>
              <div className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-surface-muted border border-line text-ink-soft text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-antique-gold shrink-0" aria-hidden="true" />
                <span>{t('dictionary.loading_catalog', 'Đang tải danh mục từ vựng di sản...')}</span>
              </div>
              <div className="vocab-library-grid">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="vocab-deck vocab-skeleton-card border border-line rounded-3xl overflow-hidden bg-surface">
                    <div className="h-44 vocab-shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 vocab-shimmer rounded-md w-1/3" />
                      <div className="h-6 vocab-shimmer rounded-md w-3/4" />
                      <div className="h-4 vocab-shimmer rounded-md w-full" />
                      <div className="h-4 vocab-shimmer rounded-md w-2/3" />
                      <div className="pt-2 flex justify-between gap-3">
                        <div className="h-9 vocab-shimmer rounded-full w-1/2" />
                        <div className="h-9 vocab-shimmer rounded-full w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isMyVocab ? (
            savedArticles.length === 0 ? (
              <div className="vocab-empty" role="status">
                <BookmarkCheck size={36} aria-hidden="true" />
                <h3>{t('saved_decks.empty_title', 'Chưa có từ vựng nào được lưu')}</h3>
                <p>{t('saved_decks.empty_desc', 'Hãy lưu các từ vựng mới khi đọc bài để tạo sổ từ và ôn tập flashcard cá nhân.')}</p>
                <button
                  type="button"
                  className="vocab-button vocab-button-gold mt-2 inline-flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setSelectedCategory('All');
                    setCurrentPage(1);
                  }}
                >
                  <BookOpen size={16} aria-hidden="true" />
                  <span>{t('saved_decks.empty_explore', 'Khám phá từ vựng')}</span>
                </button>
              </div>
            ) : filteredSavedArticles.length === 0 ? (
              <div className="vocab-empty" role="status">
                <BookmarkCheck size={32} aria-hidden="true" />
                <h3>{t('dictionary.no_matching_decks', 'No matching decks')}</h3>
                <p>{t('dictionary.no_matching_decks_desc', 'Try another search or select All topics.')}</p>
              </div>
            ) : (
              <div className="vocab-notebook-grid">
                {paginatedSavedArticles.map(({ article, level, count }) => {
                  const title = isVi ? articleTitle(article, true) : articleTitle(article, false);
                  return (
                    <Link
                      key={`${article.id}:${level}`}
                      className="vocab-notebook-card"
                      to={paths.flashcardStudy({ deck: article.id, level, saved: true })}
                    >
                      <span className="vocab-notebook-card-main">
                        <span className="vocab-notebook-cover" aria-hidden="true">
                          {article.imageUrl ? <img src={article.imageUrl} alt="" loading="lazy" /> : <BookOpen size={24} />}
                        </span>
                        <span className="vocab-notebook-card-copy">
                          <span className="vocab-notebook-level">{level}</span>
                          <strong>{title}</strong>
                          <span>{t('saved_decks.words_count', { count, defaultValue: `${count} saved words` })}</span>
                        </span>
                      </span>
                      <span className="vocab-notebook-card-action">
                        {t('saved_decks.review_action', 'Review saved words')}
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            )
          ) : (
            <DictionaryLibraryGrid
              lessons={paginatedLessons}
              onGoToStudy={handleGoToStudy}
              onInspectLesson={setInspectLesson}
            />
          )}

          {/* Pagination Controls with loading synchronization */}
          <DictionaryPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalDecks={totalCount}
            itemsPerPage={VOCABULARY_PAGE_SIZE}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </section>
      </div>

      {/* DICTIONARY INSPECTOR MODAL WITH ON-DEMAND LAZY FETCH */}
      <DictionaryInspectorModal
        lesson={inspectLesson}
        onClose={() => setInspectLesson(null)}
        onPlayAudio={playAudio}
        onGoToStudy={handleGoToStudy}
      />

    </FlashcardSidebarLayout>
  );
}
