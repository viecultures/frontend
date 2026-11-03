import { useTranslation } from 'react-i18next';
import { useState, useMemo, useRef } from "react";
import { ArrowUpRight, BookOpen, BookmarkCheck, SearchX } from "lucide-react";
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { listSavedArticles } from '@/services/learning/learningStorage';
import { LESSONS_DATA, type Lesson } from "@/data/discoveryData";
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

export default function DictionaryPage() {
  const { t, i18n } = useTranslation('flashcards');
  const isVi = i18n.language.toLowerCase().startsWith('vi');
  const navigate = useAppNavigate();
  const libraryRef = useRef<HTMLElement>(null);
  const savedDecksRef = useRef<HTMLDivElement>(null);
  const [sortOrder, setSortOrder] = useState("default");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Inspector Modal state
  const [inspectLesson, setInspectLesson] = useState<Lesson | null>(null);

  const savedArticles = useMemo(() => listSavedArticles().filter(({ count }) => count > 0), []);
  const savedWordCount = useMemo(() => savedArticles.reduce((count, entry) => count + entry.count, 0), [savedArticles]);
  const isMyVocab = selectedCategory === "MyVocab";

  const categoryOptions = useMemo(() => [
    { label: `${t('categories.all', 'All')} (${LESSONS_DATA.length})`, value: "All" },
    {
      value: "MyVocab",
      label: `${t('categories.MyVocab', 'Từ vựng của tôi')}${savedWordCount > 0 ? ` (${savedWordCount})` : ''}`,
    },
    ...Object.entries(VOCABULARY_CATEGORY_LABELS).map(([value]) => ({
      value,
      label: t(`categories.${value}`, value),
    })),
  ], [t, savedWordCount]);

  // Filtered Lessons (Catalog)
  const filteredLessons = useMemo(() => {
    if (isMyVocab) return [];
    const lessons = LESSONS_DATA.filter((lesson) => {
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
  }, [isMyVocab, selectedCategory, searchQuery, sortOrder]);

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
            onGoToRecent={() => handleGoToStudy("imperial-hue")}
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
              <p className="vocab-eyebrow">{t('dictionary.catalog_eyebrow', 'LEARN LANGUAGE THROUGH HERITAGE')}</p>
              <h2 id="vocab-library-title">
                {isMyVocab
                  ? t('categories.MyVocab', 'Từ vựng của tôi')
                  : t('dictionary.catalog_title', 'Vocabulary decks')}{' '}
                <span>{isMyVocab ? savedWordCount : LESSONS_DATA.length}</span>
              </h2>
            </div>
            <label className="vocab-sort">
              <span>{t('dictionary.sort_label', 'Sort by:')}</span>
              <select aria-label={t('dictionary.sort_label', 'Sort vocabulary decks')} value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}>
                <option value="default">{t('dictionary.sort_recommended', 'Recommended')}</option>
                <option value="newest">{t('dictionary.sort_newest', 'Newest')}</option>
                <option value="name">{t('dictionary.sort_name', 'Name A–Z')}</option>
              </select>
            </label>
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

          {/* Content Area */}
          {isMyVocab ? (
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
                <SearchX size={32} aria-hidden="true" />
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
