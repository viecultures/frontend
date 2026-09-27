import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Folder,
  ChevronRight,
  ChevronDown,
  Plus,
  Calendar,
  X,
  Volume2,
  BookMarked,
  ArrowRight,
  Sparkles,
  Compass,
} from "lucide-react";
import Link from "@/components/Link";
import { LESSONS_DATA, type Lesson } from "@/data/discoveryData";
import { getDeckData } from "@/data/flashcardsData";
import FlashcardSidebarLayout from "../components/flashcard-sidebar-layout";

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
      const matchCat = selectedCategory === "All" || lesson.category === selectedCategory;
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

  return (
    <FlashcardSidebarLayout>
      <div className="w-full space-y-8">

        {/* SECTION 1: HỌC TẬP MỖI NGÀY — Hôm nay học gì? Header & Inline Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Title */}
            <div className="space-y-0.5 shrink-0">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#059669]">
                — HỌC TẬP MỖI NGÀY
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1E4B43]">
                Hôm nay học gì?
              </h1>
            </div>

            {/* Inline Search Bar & Date Badge */}
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#1E4B43]/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm từ vựng hoặc thư mục bài đọc..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white border-2 border-[rgba(30,75,67,0.18)] shadow-xs text-xs text-[#1E4B43] font-bold focus:outline-none focus:border-[#1E4B43] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6E7E79] hover:text-[#1E4B43]"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="text-xs font-bold text-[#6E7E79] bg-white px-3.5 py-2.5 rounded-full border border-[rgba(30,75,67,0.12)] flex items-center gap-1.5 shadow-xs shrink-0">
                <Calendar className="w-3.5 h-3.5 text-[#D9B76A]" />
                <span>Hôm nay, {new Date().toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })}</span>
              </div>
            </div>
          </div>

          {/* 3 Top Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            {/* Card 1: Gần đây */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[rgba(30,75,67,0.12)] shadow-sm space-y-4 flex flex-col justify-between hover:border-[#059669]/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold border border-[#059669]/20 shadow-xs">
                  <Sparkles className="w-5 h-5 text-[#059669]" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700">
                  Gần đây
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E4B43]">
                  Imperial Hue Architecture
                </h3>
                <p className="text-xs text-[#6E7E79] font-medium mt-1">
                  12 từ mới chưa học xong
                </p>
              </div>

              <button
                onClick={() => handleGoToStudy("imperial-hue")}
                className="w-full py-2.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer"
              >
                Học mới →
              </button>
            </div>

            {/* Card 2: Khám phá thêm bộ */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[rgba(30,75,67,0.12)] shadow-sm space-y-4 flex flex-col justify-between hover:border-[#D9B76A] transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] text-[#92400E] flex items-center justify-center font-bold border border-amber-300/40 shadow-xs">
                <Compass className="w-5 h-5 text-amber-700" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E4B43]">
                  Khám phá thêm bộ
                </h3>
                <p className="text-xs text-[#6E7E79] font-medium mt-1 leading-relaxed">
                  Lưu thêm bài đọc văn hóa Việt vào kệ từ điển cá nhân
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory("All");
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#F6EEDC] text-[#1E4B43] border border-[#1E4B43] text-xs font-extrabold transition-all shadow-xs cursor-pointer"
              >
                Xem danh sách các bộ
              </button>
            </div>

            {/* Card 3: Tạo bộ từ mới */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[rgba(30,75,67,0.12)] shadow-sm space-y-4 flex flex-col justify-between hover:border-[#1E4B43] transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#1E4B43] text-[#FBF7EE] flex items-center justify-center font-bold shadow-xs">
                <Plus className="w-5 h-5 text-[#D9B76A]" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E4B43]">
                  Tạo bộ từ mới
                </h3>
                <p className="text-xs text-[#6E7E79] font-medium mt-1 leading-relaxed">
                  Tự nhập từ vựng cá nhân hoặc tạo danh sách riêng
                </p>
              </div>

              <button
                onClick={() => setIsCreateDeckOpen(true)}
                className="w-full py-2.5 rounded-2xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] text-xs font-extrabold transition-all border border-[#059669]/30 shadow-xs cursor-pointer"
              >
                Tạo bộ
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: TỦ SÁCH CÁ NHÂN — Thư viện của bạn (HeyWord Personal Library) */}
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap text-xs font-bold">
              {[
                { label: `Tất cả (${LESSONS_DATA.length})`, value: "All" },
                { label: "Lịch sử & Di sản", value: "Heritage" },
                { label: "Ẩm thực & Cà phê", value: "Cuisine" },
                { label: "Nghệ thuật & Làng nghề", value: "Crafts" },
                { label: "Danh thắng Thiên nhiên", value: "Nature" },
                { label: "Lễ hội & Tín ngưỡng", value: "Folklore" },
              ].map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-full transition-all duration-200 cursor-pointer ${isActive
                        ? "bg-[#1E4B43] text-[#FBF7EE] shadow-xs font-black"
                        : "bg-white text-[#3F5550] hover:bg-[#F6EEDC] border border-[rgba(30,75,67,0.15)]"
                      }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#6E7E79] bg-white px-3 py-1.5 rounded-full border border-[rgba(30,75,67,0.15)]">
              <span>Lọc:</span>
              <span className="text-[#1E4B43] font-extrabold">Tất cả</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#1E4B43]" />
            </div>
          </div>

          {/* Library Cards Grid - Compact Folder Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredLessons.map((lesson) => {
              return (
                <div
                  key={lesson.id}
                  className="group rounded-2xl bg-white border border-[rgba(30,75,67,0.15)] p-4 shadow-2xs hover:shadow-md hover:border-[#059669]/60 transition-all duration-200 flex flex-col justify-between space-y-3.5"
                >
                  {/* Top Header: Folder Icon & Category Tag */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center border border-[#059669]/20 shadow-2xs shrink-0">
                        <Folder className="w-4 h-4" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-[#1E4B43]/10 text-[#1E4B43]">
                        {lesson.categoryVi}
                      </span>
                    </div>

                    {/* Deck Titles */}
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#1E4B43] group-hover:text-[#059669] transition-colors leading-snug line-clamp-1">
                        {lesson.title}
                      </h3>
                      <p className="text-[11px] text-[#6E7E79] italic font-medium truncate mt-0.5">
                        {lesson.vietnameseTitle}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Dual Buttons (HỌC TỪ MỚI | ÔN TẬP) */}
                  <div className="pt-3 border-t border-[rgba(30,75,67,0.08)] space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleGoToStudy(lesson.id)}
                        className="py-1.5 px-2 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#059669]/30 text-[#059669] font-extrabold flex flex-col items-center justify-center transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="text-xs font-black">{lesson.vocabCount}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider">HỌC TỪ MỚI</span>
                      </button>

                      <button
                        onClick={() => handleGoToStudy(lesson.id)}
                        className="py-1.5 px-2 rounded-xl bg-[#FEF3C7] hover:bg-[#FDE68A] border border-[#D9B76A]/40 text-[#92400E] font-extrabold flex flex-col items-center justify-center transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="text-xs font-black">0</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider">ÔN TẬP</span>
                      </button>
                    </div>

                    <button
                      onClick={() => setInspectLesson(lesson)}
                      className="w-full text-center text-[11px] font-bold text-[#1E4B43] hover:text-[#059669] flex items-center justify-center gap-1 transition-colors cursor-pointer py-0.5"
                    >
                      <span>Xem từ điển bộ từ</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* DICTIONARY INSPECTOR MODAL */}
      {inspectLesson && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase bg-[#ECFDF5] text-[#059669] px-2.5 py-0.5 rounded-full">
                  {inspectLesson.categoryVi}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#1E4B43] mt-1">
                  Từ điển bộ từ: {inspectLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectLesson(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {getDeckData(inspectLesson).cards.map((card, idx) => (
                <div
                  key={card.id}
                  className="p-4 rounded-2xl bg-[#F6EEDC]/50 border border-[rgba(30,75,67,0.1)] flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1E4B43]">{idx + 1}. {card.word}</span>
                      <span className="text-xs font-mono text-gray-500">{card.ipa}</span>
                      <span className="text-[10px] font-bold bg-[#1E4B43]/10 text-[#1E4B43] px-2 py-0.5 rounded">
                        {card.pos}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-[#059669]">
                      Nghĩa: {card.viMeaning}
                    </div>
                    <div className="text-xs text-[#3F5550]">
                      Định nghĩa: {card.viDefinition}
                    </div>
                    <div className="text-xs italic text-[#6E7E79]">
                      "{card.contextEn}"
                    </div>
                  </div>

                  <button
                    onClick={() => playAudio(card.word)}
                    className="p-2.5 rounded-full bg-[#1E4B43] text-white hover:bg-[#163D37] cursor-pointer shrink-0 shadow-xs"
                    title="Phát âm"
                  >
                    <Volume2 className="w-4 h-4 text-[#D9B76A]" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  const lid = inspectLesson.id;
                  setInspectLesson(null);
                  handleGoToStudy(lid);
                }}
                className="px-6 py-2.5 rounded-full bg-[#1E4B43] text-white text-xs font-bold hover:bg-[#163D37] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>Mở Ôn Tập Flashcard</span>
                <ArrowRight className="w-4 h-4 text-[#D9B76A]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE DECK MODAL */}
      {isCreateDeckOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-[#1E4B43]">Tạo Bộ Từ Vựng Mới</h3>
              <button onClick={() => setIsCreateDeckOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-[#6E7E79]">Tên bộ từ vựng cá nhân:</label>
              <input
                type="text"
                value={customDeckName}
                onChange={(e) => setCustomDeckName(e.target.value)}
                placeholder="Ví dụ: Từ vựng Ôn thi IELTS 7.0..."
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F6EEDC]/60 border border-[rgba(30,75,67,0.2)] text-xs text-[#1E4B43] font-bold focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsCreateDeckOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E7E79] hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (customDeckName.trim()) {
                    alert(`Đã khởi tạo bộ từ "${customDeckName}" vào tủ sách cá nhân!`);
                    setIsCreateDeckOpen(false);
                    setCustomDeckName("");
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#059669] text-white text-xs font-bold hover:bg-[#047857]"
              >
                Tạo mới
              </button>
            </div>
          </div>
        </div>
      )}
    </FlashcardSidebarLayout>
  );
}
