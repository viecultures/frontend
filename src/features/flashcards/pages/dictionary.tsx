import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LESSONS_DATA, type Lesson } from "@/data/discoveryData";
import FlashcardSidebarLayout from "../components/flashcard-sidebar-layout";
import { SavedVocabularyDecks } from '../components/SavedVocabularyDecks';
import {
  DictionaryDailyHero,
  DictionaryQuickActionCards,
  DictionaryCategoryFilter,
  DictionaryLibraryGrid,
  DictionaryInspectorModal,
  CreateDeckModal,
} from "../components";
import { paths } from '@/routes/paths';

const CATEGORY_OPTIONS = [
  { label: `Tất cả (${LESSONS_DATA.length})`, value: "All" },
  { label: "Lịch sử & Di sản", value: "Heritage" },
  { label: "Ẩm thực & Cà phê", value: "Cuisine" },
  { label: "Nghệ thuật & Làng nghề", value: "Crafts" },
  { label: "Danh thắng Thiên nhiên", value: "Nature" },
  { label: "Lễ hội & Tín ngưỡng", value: "Folklore" },
];

export default function DictionaryPage() {
  const navigate = useNavigate();
  const libraryRef = useRef<HTMLElement>(null);
  const [sortOrder, setSortOrder] = useState("default");

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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
    if (sortOrder === "name") lessons.sort((a, b) => a.vietnameseTitle.localeCompare(b.vietnameseTitle, "vi"));
    if (sortOrder === "newest") lessons.sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
    return lessons;
  }, [selectedCategory, searchQuery, sortOrder]);

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
      alert(`Đã khởi tạo bộ từ "${customDeckName}" vào tủ sách cá nhân!`);
      setIsCreateDeckOpen(false);
      setCustomDeckName("");
    }
  };

  return (
    <FlashcardSidebarLayout>
      <div className="vocab-library-page">
        <SavedVocabularyDecks />
        {/* Daily recommendation and quick actions */}
        <div className="space-y-4">
          <DictionaryDailyHero
            searchQuery={searchQuery}
            onChangeSearch={setSearchQuery}
          />

          <DictionaryQuickActionCards
            onGoToRecent={() => handleGoToStudy("imperial-hue")}
            onExploreMore={() => {
              setSelectedCategory("All");
              libraryRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
            }}
            onOpenCreateDeck={() => setIsCreateDeckOpen(true)}
          />
        </div>

        {/* Cultural vocabulary catalog */}
        <section ref={libraryRef} className="vocab-library-section" aria-labelledby="vocab-library-title">
          <div className="vocab-library-heading">
            <div><p className="vocab-eyebrow">HỌC NGÔN NGỮ QUA DI SẢN</p><h2 id="vocab-library-title">Thư viện bộ từ <span>{LESSONS_DATA.length}</span></h2></div>
            <label className="vocab-sort"><span>Sắp xếp:</span><select aria-label="Sắp xếp bộ từ" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}><option value="default">Đề xuất</option><option value="newest">Mới nhất</option><option value="name">Tên A – Z</option></select></label>
          </div>

          {/* Category Filter Pills */}
          <DictionaryCategoryFilter
            categories={CATEGORY_OPTIONS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <p className="vocab-results" role="status">{searchQuery ? `Tìm thấy ${filteredLessons.length} bộ từ cho “${searchQuery}”` : `${filteredLessons.length} bộ từ để bạn khám phá`}</p>

          {/* Library Cards Grid */}
          <DictionaryLibraryGrid
            lessons={filteredLessons}
            onGoToStudy={handleGoToStudy}
            onInspectLesson={setInspectLesson}
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
