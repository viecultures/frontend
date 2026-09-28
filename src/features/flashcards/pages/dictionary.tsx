import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LESSONS_DATA, type Lesson } from "@/data/discoveryData";
import FlashcardSidebarLayout from "../components/flashcard-sidebar-layout";
import {
  DictionaryDailyHero,
  DictionaryQuickActionCards,
  DictionaryCategoryFilter,
  DictionaryLibraryGrid,
  DictionaryInspectorModal,
  CreateDeckModal,
} from "../components";

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

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Inspector Modal state
  const [inspectLesson, setInspectLesson] = useState<Lesson | null>(null);
  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState<boolean>(false);
  const [customDeckName, setCustomDeckName] = useState<string>("");

  // Filtered Lessons
  const filteredLessons = useMemo(() => {
    return LESSONS_DATA.filter((lesson) => {
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
  }, [selectedCategory, searchQuery]);

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
    navigate(`/flashcard-study?deck=${lessonId}`);
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
      <div className="w-full space-y-8">
        {/* SECTION 1: HỌC TẬP MỖI NGÀY — Hôm nay học gì? Header & Inline Search Bar */}
        <div className="space-y-4">
          <DictionaryDailyHero
            searchQuery={searchQuery}
            onChangeSearch={setSearchQuery}
          />

          {/* 3 Top Action Cards */}
          <DictionaryQuickActionCards
            onGoToRecent={() => handleGoToStudy("imperial-hue")}
            onExploreMore={() => {
              setSelectedCategory("All");
              window.scrollTo({ top: 400, behavior: "smooth" });
            }}
            onOpenCreateDeck={() => setIsCreateDeckOpen(true)}
          />
        </div>

        {/* SECTION 2: TỦ SÁCH CÁ NHÂN — Thư viện của bạn */}
        <div className="space-y-4 pt-4 border-t border-[rgba(30,75,67,0.12)]">
          <div className="space-y-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#059669]">
              — TỦ SÁCH CÁ NHÂN
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#1E4B43]">
              Thư viện của bạn
            </h2>
          </div>

          {/* Category Filter Pills */}
          <DictionaryCategoryFilter
            categories={CATEGORY_OPTIONS}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Library Cards Grid */}
          <DictionaryLibraryGrid
            lessons={filteredLessons}
            onGoToStudy={handleGoToStudy}
            onInspectLesson={setInspectLesson}
          />
        </div>
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
