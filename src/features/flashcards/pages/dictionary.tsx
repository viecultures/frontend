import { useTranslation } from 'react-i18next';
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { ArrowUpRight, BookOpen, BookmarkCheck, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { listSavedArticles } from '@/services/learning/learningStorage';
import { LESSONS_DATA, type Lesson, type LevelType } from "@/data/discoveryData";
import { readerApiService } from '@/features/reader/services/readerApiService';
import type { ReadingPostItem } from '@/features/admin/types/adminTypes';
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

function mapTopicToCategory(topic?: string): "Heritage" | "Cuisine" | "Crafts" | "Nature" | "Folklore" {
  if (!topic) return "Heritage";
  const tLower = topic.toLowerCase();
  if (tLower.includes('cuis') || tLower.includes('thực') || tLower.includes('food') || tLower.includes('ẩm')) return "Cuisine";
  if (tLower.includes('craft') || tLower.includes('nghề') || tLower.includes('gốm') || tLower.includes('lụa')) return "Crafts";
  if (tLower.includes('nature') || tLower.includes('nhiên') || tLower.includes('cảnh') || tLower.includes('động') || tLower.includes('rừng') || tLower.includes('núi')) return "Nature";
  if (tLower.includes('folk') || tLower.includes('hội') || tLower.includes('tín ngưỡng') || tLower.includes('thần thoại')) return "Folklore";
  return "Heritage";
}

const CATEGORY_VI_MAP: Record<string, string> = {
  Heritage: 'Lịch Sử & Di Sản',
  Cuisine: 'Ẩm Thực & Cà Phê',
  Crafts: 'Nghệ Thuật & Làng Nghề',
  Nature: 'Danh Thắng Thiên Nhiên',
  Folklore: 'Lễ Hội & Tín Ngưỡng',
};

const TOPIC_GRADIENTS: Record<string, string> = {
  Heritage: 'from-[#1b3d33] via-[#244e43] to-[#386554]',
  Cuisine: 'from-[#803d23] via-[#9b583b] to-[#b87550]',
  Crafts: 'from-[#8e6e36] via-[#b59258] to-[#c6a970]',
  Nature: 'from-[#2e5950] via-[#47776c] to-[#639183]',
  Folklore: 'from-[#65332d] via-[#7e4943] to-[#a36350]',
};

function mapToLevelType(level?: string): LevelType {
  if (!level) return 'Level 2';
  const l = level.trim();
  if (l === 'Level 1' || l === 'Level 2' || l === 'Level 3') return l;
  if (l === 'A1' || l === 'A2') return 'Level 1';
  if (l === 'C1' || l === 'C2') return 'Level 3';
  return 'Level 2';
}

function mapPostToLesson(post: ReadingPostItem): Lesson {
  const category = mapTopicToCategory(post.topic);
  const categoryVi = CATEGORY_VI_MAP[category] || 'Lịch Sử & Di Sản';
  const cefrLevel = mapToLevelType(post.level);
  const vocabCount = post.vocabularies?.length || (post as unknown as { vocabCount?: number }).vocabCount || 0;
  const readTime = post.readTime || '5 phút đọc';
  const summary = post.summary || post.contentVi || post.titleVi || '';
  const gradient = TOPIC_GRADIENTS[category] || 'from-[#1b3d33] via-[#244e43] to-[#386554]';

  return {
    id: post.id,
    title: post.titleEn || post.titleVi || 'Bài học văn hóa',
    vietnameseTitle: post.titleVi || post.titleEn || 'Bài học văn hóa',
    category,
    categoryVi,
    cefrLevel,
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelDetails: {
      'Level 1': { readTime, vocabCount },
      'Level 2': { readTime, vocabCount },
      'Level 3': { readTime, vocabCount },
    },
    readTime,
    vocabCount,
    summary,
    imageUrl: post.imageUrl,
    gradient,
    iconSymbol: 'BookOpen',
    isFromDatabase: true,
    dateAdded: post.createdAt || new Date().toISOString(),
    dbVocabularies: post.vocabularies || [],
    provinceId: post.provinceId,
  };
}

export default function DictionaryPage() {
  const { t, i18n } = useTranslation('flashcards');
  const isVi = i18n.language.toLowerCase().startsWith('vi');
  const navigate = useAppNavigate();
  const libraryRef = useRef<HTMLElement>(null);
  const savedDecksRef = useRef<HTMLDivElement>(null);
  const [sortOrder, setSortOrder] = useState("default");

  // API Integration state
  const [apiLessons, setApiLessons] = useState<Lesson[]>([]);
  const [isApiConnected, setIsApiConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [vocabVersion, setVocabVersion] = useState<number>(0);

  // Inspector Modal state
  const [inspectLesson, setInspectLesson] = useState<Lesson | null>(null);

  // Fetch articles from API with fallback to LESSONS_DATA
  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    try {
      const posts = await readerApiService.getAllPosts();
      if (posts && Array.isArray(posts) && posts.length > 0) {
        const mapped = posts.map(mapPostToLesson);
        setApiLessons(mapped);
        setIsApiConnected(true);
      } else {
        setApiLessons([]);
        setIsApiConnected(false);
      }
    } catch (err) {
      console.warn('[DictionaryPage] Không thể kết nối API bài viết, kích hoạt chế độ dự phòng mock data:', err);
      setApiLessons([]);
      setIsApiConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  useEffect(() => {
    const handleUpdate = () => setVocabVersion((v) => v + 1);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('vie_vocab_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('vie_vocab_updated', handleUpdate);
    };
  }, []);

  // Determine active lessons (API or fallback mock data)
  const activeLessons = useMemo(() => {
    return isApiConnected && apiLessons.length > 0 ? apiLessons : LESSONS_DATA;
  }, [isApiConnected, apiLessons]);

  const savedArticles = useMemo(
    () => listSavedArticles().filter(({ count }) => count > 0),
    [vocabVersion]
  );
  const savedWordCount = useMemo(
    () => savedArticles.reduce((count, entry) => count + entry.count, 0),
    [savedArticles]
  );
  const isMyVocab = selectedCategory === "MyVocab";

  const categoryOptions = useMemo(() => [
    { label: `${t('categories.all', 'All')} (${activeLessons.length})`, value: "All" },
    {
      value: "MyVocab",
      label: `${t('categories.MyVocab', 'Từ vựng của tôi')}${savedWordCount > 0 ? ` (${savedWordCount})` : ''}`,
    },
    ...Object.entries(VOCABULARY_CATEGORY_LABELS).map(([value]) => {
      const count = activeLessons.filter((l) => l.category === value).length;
      return {
        value,
        label: count > 0 ? `${t(`categories.${value}`, value)} (${count})` : t(`categories.${value}`, value),
      };
    }),
  ], [t, savedWordCount, activeLessons]);

  // Filtered Lessons (Catalog)
  const filteredLessons = useMemo(() => {
    if (isMyVocab) return [];
    const lessons = activeLessons.filter((lesson) => {
      const matchCat =
        selectedCategory === "All" || lesson.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.vietnameseTitle.toLowerCase().includes(q) ||
        lesson.summary.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
    if (sortOrder === "name") lessons.sort((a, b) => a.title.localeCompare(b.title, "en"));
    if (sortOrder === "newest") lessons.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    return lessons;
  }, [isMyVocab, selectedCategory, searchQuery, sortOrder, activeLessons]);

  // Filtered Saved Articles (My Vocabulary)
  const filteredSavedArticles = useMemo(() => {
    if (!isMyVocab) return [];
    const q = searchQuery.toLowerCase().trim();
    const list = savedArticles.filter(({ article }) => {
      if (!q) return true;
      const titleEn = (article.titleEn || '').toLowerCase();
      const titleVi = (article.titleVi || '').toLowerCase();
      return titleEn.includes(q) || titleVi.includes(q);
    });
    if (sortOrder === "name") {
      list.sort((a, b) => {
        const titleA = isVi ? a.article.titleVi : (a.article.titleEn || a.article.titleVi);
        const titleB = isVi ? b.article.titleVi : (b.article.titleEn || b.article.titleVi);
        return titleA.localeCompare(titleB, isVi ? "vi" : "en");
      });
    }
    return list;
  }, [isMyVocab, searchQuery, savedArticles, sortOrder, isVi]);

  const totalCount = isMyVocab ? filteredSavedArticles.length : filteredLessons.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / VOCABULARY_PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedLessons = useMemo(() => {
    if (isMyVocab) return [];
    const startIndex = (safeCurrentPage - 1) * VOCABULARY_PAGE_SIZE;
    return filteredLessons.slice(startIndex, startIndex + VOCABULARY_PAGE_SIZE);
  }, [isMyVocab, filteredLessons, safeCurrentPage]);

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
            onGoToRecent={() => handleGoToStudy(activeLessons[0]?.id || "imperial-hue")}
            onExploreMore={() => {
              setSelectedCategory("All");
              setCurrentPage(1);
              libraryRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
            }}
            onReviewSaved={() => {
              setSelectedCategory("MyVocab");
              setCurrentPage(1);
              libraryRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
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
                {isApiConnected ? (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300"
                    title={t('dictionary.api_connected_desc', 'Dữ liệu trực tiếp từ cơ sở dữ liệu')}
                  >
                    <Wifi size={12} className="text-emerald-600" />
                    <span>Database</span>
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100/80 text-amber-800 border border-amber-300"
                    title={t('dictionary.offline_fallback_desc', 'Đang sử dụng dữ liệu di sản mẫu dự phòng')}
                  >
                    <WifiOff size={12} className="text-amber-600" />
                    <span>Fallback</span>
                  </span>
                )}
              </div>
              <h2 id="vocab-library-title">
                {isMyVocab
                  ? t('categories.MyVocab', 'Từ vựng của tôi')
                  : t('dictionary.catalog_title', 'Vocabulary decks')}{' '}
                <span>{isMyVocab ? savedWordCount : activeLessons.length}</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {!isApiConnected && !isLoading && (
                <button
                  type="button"
                  onClick={() => fetchLessons()}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-line bg-surface hover:bg-surface-muted text-ink-soft inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  title={t('dictionary.reconnect_api', 'Thử kết nối lại API')}
                >
                  <RefreshCw size={13} />
                  <span>{t('dictionary.retry_sync', 'Đồng bộ lại')}</span>
                </button>
              )}
              <label className="vocab-sort">
                <span>{t('dictionary.sort_label', 'Sort by:')}</span>
                <select aria-label={t('dictionary.sort_label', 'Sort vocabulary decks')} value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}>
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
              ? (searchQuery
                  ? t('dictionary.decks_found', { count: filteredSavedArticles.length, query: searchQuery, defaultValue: `${filteredSavedArticles.length} decks found for “${searchQuery}”` })
                  : t('saved_decks.words_count', { count: savedWordCount, defaultValue: `${savedWordCount} saved words` }))
              : (searchQuery
                  ? t('dictionary.decks_found', { count: filteredLessons.length, query: searchQuery, defaultValue: `${filteredLessons.length} decks found for “${searchQuery}”` })
                  : t('dictionary.decks_to_explore', { count: filteredLessons.length, defaultValue: `${filteredLessons.length} decks to explore` }))}
          </p>

          {/* Content Area with 5-State Handling */}
          {isLoading ? (
            <div className="vocab-library-grid" aria-label={t('dictionary.loading_decks', 'Đang tải dữ liệu bài học...')} role="status">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="vocab-deck animate-pulse border border-line rounded-3xl overflow-hidden bg-surface">
                  <div className="h-44 bg-surface-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-surface-muted rounded w-1/3" />
                    <div className="h-6 bg-surface-muted rounded w-3/4" />
                    <div className="h-4 bg-surface-muted rounded w-full" />
                    <div className="h-4 bg-surface-muted rounded w-2/3" />
                    <div className="pt-2 flex justify-between gap-3">
                      <div className="h-9 bg-surface-muted rounded-full w-1/2" />
                      <div className="h-9 bg-surface-muted rounded-full w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : isMyVocab ? (
            savedArticles.length === 0 ? (
              <div className="vocab-empty" role="status">
                <BookmarkCheck size={36} aria-hidden="true" />
                <h3>{t('saved_decks.empty_title', 'Chưa có từ vựng nào được lưu')}</h3>
                <p>{t('saved_decks.empty_desc', 'Hãy lưu các từ vựng mới khi đọc bài để tạo sổ từ và ôn tập flashcard cá nhân.')}</p>
                <button
                  type="button"
                  className="vocab-button vocab-button-gold mt-2 inline-flex items-center gap-2"
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
                  const title = isVi ? article.titleVi : (article.titleEn || article.titleVi);
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

          {/* Pagination Controls */}
          <DictionaryPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalDecks={totalCount}
            itemsPerPage={VOCABULARY_PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        </section>
      </div>

      {/* DICTIONARY INSPECTOR MODAL */}
      <DictionaryInspectorModal
        lesson={inspectLesson}
        onClose={() => setInspectLesson(null)}
        onPlayAudio={playAudio}
        onGoToStudy={handleGoToStudy}
      />

    </FlashcardSidebarLayout>
  );
}
