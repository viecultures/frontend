import { useTranslation } from 'react-i18next';
import { useState, useMemo, useRef } from "react";
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
  const { t } = useTranslation('flashcards');
  const navigate = useAppNavigate();
  const libraryRef = useRef<HTMLElement>(null);
  const savedDecksRef = useRef<HTMLDivElement>(null);
  const [sortOrder, setSortOrder] = useState("default");

  const categoryOptions = useMemo(() => [
    { label: `${t('categories.all', 'All')} (${LESSONS_DATA.length})`, value: "All" },
    ...Object.entries(VOCABULARY_CATEGORY_LABELS).map(([value]) => ({
      value,
      label: t(`categories.${value}`, value),
    })),
  ], [t]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Inspector Modal state
  const [inspectLesson, setInspectLesson] = useState<Lesson | null>(null);
  const savedWordCount = listSavedArticles().reduce((count, entry) => count + entry.count, 0);

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
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
  }, [selectedCategory, searchQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / VOCABULARY_PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedLessons = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * VOCABULARY_PAGE_SIZE;
    return filteredLessons.slice(startIndex, startIndex + VOCABULARY_PAGE_SIZE);
  }, [filteredLessons, safeCurrentPage]);

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
            onReviewSaved={() => savedDecksRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })}
            savedWordCount={savedWordCount}
          />
        </div>

        {savedWordCount > 0 && <div ref={savedDecksRef} className="vocab-saved-decks"><SavedVocabularyDecks /></div>}

        {/* Cultural vocabulary catalog */}
        <section ref={libraryRef} className="vocab-library-section" aria-labelledby="vocab-library-title">
          <div className="vocab-library-heading">
            <div>
              <p className="vocab-eyebrow">{t('dictionary.catalog_eyebrow', 'LEARN LANGUAGE THROUGH HERITAGE')}</p>
              <h2 id="vocab-library-title">{t('dictionary.catalog_title', 'Vocabulary decks')} <span>{LESSONS_DATA.length}</span></h2>
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
            {searchQuery
              ? t('dictionary.decks_found', { count: filteredLessons.length, query: searchQuery, defaultValue: `${filteredLessons.length} decks found for “${searchQuery}”` })
              : t('dictionary.decks_to_explore', { count: filteredLessons.length, defaultValue: `${filteredLessons.length} decks to explore` })}
          </p>

          {/* Library Cards Grid */}
          <DictionaryLibraryGrid
            lessons={paginatedLessons}
            onGoToStudy={handleGoToStudy}
            onInspectLesson={setInspectLesson}
          />

          {/* Pagination Controls */}
          <DictionaryPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalDecks={filteredLessons.length}
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
