import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { LessonCard } from './components/LessonCard';
import { ReaderModal } from './components/ReaderModal';
import { FlashcardModal } from './components/FlashcardModal';
import { ReflectionsModal } from './components/ReflectionsModal';
import { CulturalPillars } from './components/CulturalPillars';
import { ProjectSpecsDrawer } from './components/ProjectSpecsDrawer';
import { Footer } from './components/Footer';

import { MOCK_LESSONS } from './data/mockData';
import type { Lesson, Category, CEFRLevel } from './types';
import { Sparkles, BookOpen, MessageSquare, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeReaderLesson, setActiveReaderLesson] = useState<Lesson | null>(null);
  const [activeFlashcardLesson, setActiveFlashcardLesson] = useState<Lesson | null>(null);
  const [activeReflectionsLesson, setActiveReflectionsLesson] = useState<Lesson | null>(null);
  const [isReflectionsOpen, setIsReflectionsOpen] = useState<boolean>(false);
  const [isSpecsDrawerOpen, setIsSpecsDrawerOpen] = useState<boolean>(false);

  const filteredLessons = useMemo(() => {
    return MOCK_LESSONS.filter((lesson) => {
      const matchCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
      const matchLevel = selectedLevel === 'all' || lesson.level === selectedLevel;
      const matchSearch =
        searchQuery === '' ||
        lesson.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.summary.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchLevel && matchSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  const featuredLesson = MOCK_LESSONS[0]; // Dong Ho Folk Woodcut Paintings

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'discovery') {
      const el = document.getElementById('discovery');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'demo-reader') {
      setActiveReaderLesson(featuredLesson);
    } else if (sectionId === 'demo-flashcards') {
      setActiveFlashcardLesson(featuredLesson);
    } else if (sectionId === 'community') {
      setIsReflectionsOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#12332B] flex flex-col selection:bg-[#EAA22E] selection:text-[#12332B]">
      
      {/* 1. Navigation Bar */}
      <Navbar
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        onOpenDocs={() => setIsSpecsDrawerOpen(true)}
        onNavigateToSection={handleNavigate}
      />

      {/* 2. Hero Section with banner.webm and Dong Ho Aesthetics */}
      <HeroBanner
        onStartReading={() => setActiveReaderLesson(featuredLesson)}
        onStartFlashcard={() => setActiveFlashcardLesson(featuredLesson)}
        onOpenSpecs={() => setIsSpecsDrawerOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full">
        
        {/* 3. Featured Spotlight Card (Tranh Đông Hồ / Di Sản Tiêu Biểu) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16 relative z-20">
          <div className="bg-[#F8E9CF] rounded-[4px] p-6 sm:p-8 border-2 border-[#12332B] shadow-[6px_6px_0px_#12332B] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left text spotlight */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="dongho-tag bg-[#EAA22E] text-[#12332B]">
                    <Sparkles className="w-3.5 h-3.5" />
                    BÀI ĐỌC TIÊU BIỂU TRONG TUẦN
                  </span>
                  <span className="dongho-tag bg-[#1A7368] text-white">
                    Band B2
                  </span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12332B] leading-tight">
                  {featuredLesson.titleEn}
                </h2>

                <p className="text-sm sm:text-base text-[#1A7368] font-bold">
                  {featuredLesson.titleVi}
                </p>

                <p className="text-xs sm:text-sm text-[#4A635D] leading-relaxed max-w-xl">
                  {featuredLesson.summary} Tìm hiểu nét khắc than tre, màu khoáng tự nhiên từ hoa hòe, tro lá tre và vỏ điệp lấp lánh qua bài đọc song ngữ kèm AI Shadowing.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveReaderLesson(featuredLesson)}
                    className="dongho-btn dongho-btn-primary px-6 py-3 text-xs sm:text-sm font-bold shadow-[3px_3px_0px_#12332B]"
                  >
                    <BookOpen className="w-4 h-4 text-white" />
                    <span>Đọc Song Ngữ &amp; Shadowing</span>
                  </button>

                  <button
                    onClick={() => setActiveFlashcardLesson(featuredLesson)}
                    className="dongho-btn dongho-btn-accent px-5 py-3 text-xs sm:text-sm font-bold shadow-[3px_3px_0px_#12332B]"
                  >
                    <Sparkles className="w-4 h-4 text-[#12332B]" />
                    <span>Ôn 4 Flashcards Mộc Bản</span>
                  </button>
                </div>
              </div>

              {/* Right Visual Frame */}
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-[4px] overflow-hidden border-2 border-[#12332B] shadow-[5px_5px_0px_#12332B] bg-[#FFFDF9]">
                <img
                  src={featuredLesson.imageUrl}
                  alt={featuredLesson.titleEn}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12332B]/85 via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-[#FAF6EE] font-bold">
                  <span className="bg-[#FAF6EE] text-[#12332B] px-2.5 py-1 rounded-[2px] border border-[#12332B]">
                    🎨 Làng Tranh Đông Hồ (Bắc Ninh)
                  </span>
                  <span className="bg-[#E58396] text-[#12332B] px-2.5 py-1 rounded-[2px] border border-[#12332B]">
                    Giấy Điệp &amp; Mộc Bản
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Multi-dimensional Discovery Section */}
        <section id="discovery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A7368] uppercase tracking-wider mb-2">
                <span>❖ Khám phá kho tàng bài đọc văn hóa</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#12332B] tracking-tight">
                Danh Sách Bài Học Song Ngữ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4A635D] max-w-md">
              Chọn chủ đề yêu thích hoặc lọc theo trình độ CEFR mong muốn để bắt đầu hành trình học tiếng Anh mộc bản dân gian.
            </p>
          </div>

          {/* Filter Bar */}
          <FilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalLessons={filteredLessons.length}
          />

          {/* Lessons Grid in Woodblock Style */}
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onOpenReader={setActiveReaderLesson}
                  onOpenFlashcards={setActiveFlashcardLesson}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#F8E9CF] rounded-[4px] border-2 border-[#12332B] shadow-[4px_4px_0px_#12332B]">
              <span className="text-4xl mb-3 block">🔍</span>
              <h3 className="font-heading text-2xl font-bold text-[#12332B] mb-1">
                Không tìm thấy bài đọc phù hợp
              </h3>
              <p className="text-xs text-[#4A635D] mb-4">
                Hãy thử đổi từ khóa tìm kiếm hoặc chọn "Tất cả chủ đề" / "Tất cả trình độ".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSearchQuery('');
                }}
                className="dongho-btn dongho-btn-primary px-4 py-2 text-xs font-bold"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}

        </section>

        {/* 5. Dong Ho Philosophy & Cultural Pillars */}
        <CulturalPillars />

        {/* 6. Community Reflections Safe Zone Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-[#F8E9CF] rounded-[4px] p-8 sm:p-12 border-2 border-[#12332B] shadow-[6px_6px_0px_#12332B]">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-[#E58396] border-2 border-[#12332B] text-xs font-bold text-[#12332B]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>MÔI TRƯỜNG CẢM NGHĨ KHÔNG PHÁN XÉT (NO-JUDGMENT)</span>
                </div>

                <h3 className="font-heading text-3xl sm:text-4xl font-bold text-[#12332B]">
                  Tự Do Viết Cảm Nghĩ &amp; Tôn Vinh Bản Sắc Dân Tộc
                </h3>

                <p className="text-xs sm:text-sm text-[#4A635D] leading-relaxed">
                  Ở VieCultures, bạn hoàn toàn tự do viết mà không sợ bị chấm điểm hay soi lỗi ngữ pháp. Hãy dùng các từ vựng học thuật vừa học để nói lên góc nhìn văn hóa quê hương theo cách của bạn.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={() => setIsReflectionsOpen(true)}
                    className="dongho-btn dongho-btn-primary px-6 py-3.5 text-xs sm:text-sm font-bold shadow-[3px_3px_0px_#12332B]"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>Xem &amp; Đăng Cảm Nghĩ Cộng Đồng</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sample Mini Feed Card Preview */}
              <div className="w-full max-w-md bg-[#FFFDF9] p-5 rounded-[4px] border-2 border-[#12332B] shadow-[4px_4px_0px_#12332B] space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="User avatar"
                    className="w-9 h-9 rounded-full object-cover border-2 border-[#12332B]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#12332B]">Mai Linh (Hà Nội)</div>
                    <div className="text-[11px] text-[#4A635D]">Về bài đọc: Dong Ho Folk Woodcut Paintings</div>
                  </div>
                </div>

                <p className="text-xs text-[#12332B] italic leading-relaxed">
                  "Learning about Dong Ho folk woodcut aesthetics in English feels so rewarding! The words 'quintessence' and 'pigments' helped me describe our cultural heritage to foreign friends..."
                </p>

                <div className="flex items-center justify-between text-xs text-[#4A635D] pt-2 border-t border-[#12332B]/15">
                  <span className="dongho-tag bg-[#EAA22E] text-[#12332B] text-[10px]">
                    ❖ 3 từ vựng học thuật
                  </span>
                  <span className="flex items-center gap-1 text-[#12332B] font-bold">
                    <Heart className="w-3.5 h-3.5 text-[#E58396] fill-[#E58396]" /> 32 lượt thả tim
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 7. Footer */}
      <Footer />

      {/* MODAL 1: Paragraph Pairing Bilingual Reader */}
      {activeReaderLesson && (
        <ReaderModal
          lesson={activeReaderLesson}
          onClose={() => setActiveReaderLesson(null)}
          onOpenFlashcards={(l) => {
            setActiveReaderLesson(null);
            setActiveFlashcardLesson(l);
          }}
          onOpenReflections={(l) => {
            setActiveReaderLesson(null);
            setActiveReflectionsLesson(l);
            setIsReflectionsOpen(true);
          }}
        />
      )}

      {/* MODAL 2: 3D Flashcards with Spaced Repetition */}
      {activeFlashcardLesson && (
        <FlashcardModal
          lesson={activeFlashcardLesson}
          onClose={() => setActiveFlashcardLesson(null)}
          onOpenReflections={(l) => {
            setActiveFlashcardLesson(null);
            setActiveReflectionsLesson(l);
            setIsReflectionsOpen(true);
          }}
        />
      )}

      {/* MODAL 3: Reflections UGC Community */}
      {isReflectionsOpen && (
        <ReflectionsModal
          lesson={activeReflectionsLesson || undefined}
          onClose={() => {
            setIsReflectionsOpen(false);
            setActiveReflectionsLesson(null);
          }}
        />
      )}

      {/* MODAL 4: Project Specs & Design.md Inspector */}
      <ProjectSpecsDrawer
        isOpen={isSpecsDrawerOpen}
        onClose={() => setIsSpecsDrawerOpen(false)}
      />

    </div>
  );
}

export default App;
