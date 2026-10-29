import { useState, useMemo, useRef } from "react";
import { useAppNavigate } from '@/routes/useAppNavigate';
import { LESSONS_DATA, type Lesson } from "@/data/discoveryData";
import FlashcardSidebarLayout from "../components/flashcard-sidebar-layout";
import {
  DictionaryDailyHero,
  DictionaryQuickActionCards,
  DictionaryCategoryFilter,
  DictionaryLibraryGrid,
  DictionaryPagination,
  DictionaryInspectorModal,
  CreateDeckModal,
} from "../components";
import { paths } from '@/routes/paths';
import { VOCABULARY_CATEGORY_LABELS, VOCABULARY_PAGE_SIZE } from '../lib/vocabulary-catalog';
import '../dictionary-components.css';

const CATEGORY_OPTIONS = [
  { label: `All (${LESSONS_DATA.length})`, value: "All" },
  ...Object.entries(VOCABULARY_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
];

export default function DictionaryPage() {
  const navigate = useAppNavigate();
  const libraryRef = useRef<HTMLElement>(null);
  const [sortOrder, setSortOrder] = useState("default");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Inspector Modal state
  const [inspectLesson, setInspectLesson] = useState<Lesson | null>(null);
  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState<boolean>(false);
  const [customDeckName, setCustomDeckName] = useState<string>("");

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

  const handleCreateDeck = () => {
    if (customDeckName.trim()) {
      alert(`Created "${customDeckName}" in your personal library!`);
      setIsCreateDeckOpen(false);
      setCustomDeckName("");
    }
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
            onOpenCreateDeck={() => setIsCreateDeckOpen(true)}
          />
        </div>

        {/* Cultural vocabulary catalog */}
        <section ref={libraryRef} className="vocab-library-section" aria-labelledby="vocab-library-title">
          <div className="vocab-library-heading">
            <div><p className="vocab-eyebrow">LEARN LANGUAGE THROUGH HERITAGE</p><h2 id="vocab-library-title">Vocabulary decks <span>{LESSONS_DATA.length}</span></h2></div>
            <label className="vocab-sort"><span>Sort by:</span><select aria-label="Sort vocabulary decks" value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}><option value="default">Recommended</option><option value="newest">Newest</option><option value="name">Name A–Z</option></select></label>
          </div>

          {/* Category Filter Pills */}
          <DictionaryCategoryFilter
            categories={CATEGORY_OPTIONS}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
          />

          <p className="vocab-results" role="status">{searchQuery ? `${filteredLessons.length} decks found for “${searchQuery}”` : `${filteredLessons.length} decks to explore`}</p>

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

      {/* CREATE DECK MODAL */}
      <CreateDeckModal
        isOpen={isCreateDeckOpen}
        onClose={() => setIsCreateDeckOpen(false)}
        customDeckName={customDeckName}
        onChangeDeckName={setCustomDeckName}
        onCreateDeck={handleCreateDeck}
      />
    </FlashcardSidebarLayout>
  );
}
