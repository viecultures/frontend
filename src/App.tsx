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
    <div className="min-h-screen bg-[#0D1C18] text-white flex flex-col selection:bg-[#FCE5B5] selection:text-[#18221E]">
      
      {/* 1. Floating Glass Navbar */}
      <Navbar
        onOpenDocs={() => setIsSpecsDrawerOpen(true)}
        onNavigateToSection={handleNavigate}
      />

      {/* 2. Hero Section with Full-Screen Video Banner (Level removed from banner) */}
      <HeroBanner
        onStartReading={() => setActiveReaderLesson(featuredLesson)}
        onStartFlashcard={() => setActiveFlashcardLesson(featuredLesson)}
        onOpenSpecs={() => setIsSpecsDrawerOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full">
        
        {/* 3. Featured Spotlight Card (Modern Heritage Glassmorphism) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16 relative z-20">
          <div className="glass-card p-6 sm:p-10 border border-white/20 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left text spotlight */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FCE5B5] text-[#18221E] flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    BÀI ĐỌC TIÊU BIỂU TRONG TUẦN
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Band B2
                  </span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {featuredLesson.titleEn}
                </h2>

                <p className="text-sm sm:text-base text-[#F7E5C3] font-medium">
                  {featuredLesson.titleVi}
                </p>

                <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-xl font-normal">
                  {featuredLesson.summary} Tìm hiểu nét khắc mộc bản, màu khoáng tự nhiên từ hoa hòe, tro lá tre và vỏ điệp lấp lánh qua bài đọc song ngữ kèm AI Shadowing.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => setActiveReaderLesson(featuredLesson)}
                    className="btn-pill-primary px-6 py-3 text-xs sm:text-sm font-semibold"
                  >
                    <BookOpen className="w-4 h-4 text-[#18221E]" />
                    <span>Đọc Song Ngữ &amp; Shadowing</span>
                  </button>

                  <button
                    onClick={() => setActiveFlashcardLesson(featuredLesson)}
                    className="btn-pill-glass px-5 py-3 text-xs sm:text-sm font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-[#F5D280]" />
                    <span>Ôn 4 Flashcards 3D</span>
                  </button>
                </div>
              </div>

              {/* Right Visual Frame */}
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-[20px] overflow-hidden border border-white/20 shadow-2xl bg-black/40">
                <img
                  src={featuredLesson.imageUrl}
                  alt={featuredLesson.titleEn}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C18] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 font-medium">
                  <span className="bg-black/60 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                    🎨 Tranh Dân Gian Đông Hồ
                  </span>
                  <span className="bg-emerald-500/25 text-emerald-200 px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
                    Di Sản Mộc Bản
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
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F5D280] uppercase tracking-wider mb-2">
                <span>❖ Khám phá kho tàng bài đọc văn hóa</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Danh Sách Bài Học Song Ngữ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/70 max-w-md font-normal">
              Chọn chủ đề yêu thích hoặc lọc theo trình độ CEFR mong muốn để bắt đầu hành trình học tiếng Anh di sản.
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

          {/* Lessons Grid */}
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
            <div className="text-center py-16 glass-card border border-white/10">
              <span className="text-4xl mb-3 block">🔍</span>
              <h3 className="font-heading text-2xl font-bold text-white mb-1">
                Không tìm thấy bài đọc phù hợp
              </h3>
              <p className="text-xs text-white/60 mb-4 font-normal">
                Hãy thử đổi từ khóa tìm kiếm hoặc chọn "Tất cả chủ đề" / "Tất cả trình độ".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSearchQuery('');
                }}
                className="btn-pill-primary px-5 py-2 text-xs font-semibold"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}

        </section>

        {/* 5. Cultural Philosophy & Pillars */}
        <CulturalPillars />

        {/* 6. Community Reflections Safe Zone Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-card p-8 sm:p-12 border border-white/20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>MÔI TRƯỜNG CẢM NGHĨ KHÔNG PHÁN XÉT (NO-JUDGMENT)</span>
                </div>

                <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                  Tự Do Viết Cảm Nghĩ &amp; Tôn Vinh Bản Sắc Dân Tộc
                </h3>

                <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-normal">
                  Ở VieCultures, bạn hoàn toàn tự do viết mà không sợ bị chấm điểm hay soi lỗi ngữ pháp. Hãy dùng các từ vựng học thuật vừa học để nói lên góc nhìn văn hóa quê hương theo cách của bạn.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={() => setIsReflectionsOpen(true)}
                    className="btn-pill-primary px-6 py-3.5 text-xs sm:text-sm font-semibold shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4 text-[#18221E]" />
                    <span>Xem &amp; Đăng Cảm Nghĩ Cộng Đồng</span>
                    <ArrowRight className="w-4 h-4 text-[#18221E]" />
                  </button>
                </div>
              </div>

              {/* Sample Mini Feed Card Preview */}
              <div className="w-full max-w-md bg-black/40 p-5 rounded-[20px] border border-white/15 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="User avatar"
                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Mai Linh (Hà Nội)</div>
                    <div className="text-[11px] text-white/60">Về bài đọc: Dong Ho Folk Woodcut Paintings</div>
                  </div>
                </div>

                <p className="text-xs text-white/85 italic leading-relaxed font-normal">
                  "Learning about Dong Ho folk woodcut aesthetics in English feels so rewarding! The words 'quintessence' and 'pigments' helped me describe our cultural heritage to foreign friends..."
                </p>

                <div className="flex items-center justify-between text-xs text-white/60 pt-2 border-t border-white/10">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FCE5B5]/15 text-[#FCE5B5] text-[10px] font-medium border border-[#FCE5B5]/30">
                    ✨ 3 từ vựng học thuật
                  </span>
                  <span className="flex items-center gap-1 text-white/80 font-medium">
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
