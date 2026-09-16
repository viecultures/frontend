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
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Modals & Selected Lessons
  const [activeReaderLesson, setActiveReaderLesson] = useState<Lesson | null>(null);
  const [activeFlashcardLesson, setActiveFlashcardLesson] = useState<Lesson | null>(null);
  const [activeReflectionsLesson, setActiveReflectionsLesson] = useState<Lesson | null>(null);
  const [isReflectionsOpen, setIsReflectionsOpen] = useState<boolean>(false);
  const [isSpecsDrawerOpen, setIsSpecsDrawerOpen] = useState<boolean>(false);

  // Filter logic
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

  const featuredLesson = MOCK_LESSONS[0]; // Hue Imperial City

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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        onOpenDocs={() => setIsSpecsDrawerOpen(true)}
        onNavigateToSection={handleNavigate}
      />

      {/* 2. Hero Section with Lotus Video Banner */}
      <HeroBanner
        onStartReading={() => setActiveReaderLesson(featuredLesson)}
        onStartFlashcard={() => setActiveFlashcardLesson(featuredLesson)}
        onOpenSpecs={() => setIsSpecsDrawerOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full">
        
        {/* 3. Featured Spotlight Lesson (Hero Recommendation) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-16 relative z-20">
          <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-amber-500/40 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left text spotlight */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    BÀI ĐỌC NỔI BẬT TRONG TUẦN
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Band B2
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {featuredLesson.titleEn}
                </h2>

                <p className="text-sm sm:text-base text-amber-200/90 font-medium">
                  {featuredLesson.titleVi}
                </p>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {featuredLesson.summary} Khám phá kiến trúc hoàng thành, thuật phong thủy (geomancy) và các cung điện nguy nga qua bài đọc song ngữ kèm AI Shadowing.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveReaderLesson(featuredLesson)}
                    className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-400/30 flex items-center gap-2 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Đọc song ngữ & Luyện Shadowing</span>
                  </button>

                  <button
                    onClick={() => setActiveFlashcardLesson(featuredLesson)}
                    className="px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ôn 5 Flashcards</span>
                  </button>
                </div>
              </div>

              {/* Right Visual Image */}
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl">
                <img
                  src={featuredLesson.imageUrl}
                  alt={featuredLesson.titleEn}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                  <span className="bg-slate-950/80 px-3 py-1 rounded-xl backdrop-blur-md border border-slate-800">
                    🏛️ Di tích Cố đô Huế
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-xl backdrop-blur-md border border-emerald-500/30 font-semibold">
                    100% Thuần Việt
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Multi-dimensional Discovery Feed */}
        <section id="discovery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <span>Khám phá kho tàng bài đọc</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Danh Sách Bài Học Song Ngữ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Chọn chủ đề yêu thích hoặc lọc theo trình độ CEFR mong muốn để bắt đầu hành trình học tiếng Anh văn hóa.
            </p>
          </div>

          {/* Interactive Filter Bar */}
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
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
              <span className="text-4xl mb-3 block">🔍</span>
              <h3 className="font-serif text-lg font-bold text-slate-200 mb-1">
                Không tìm thấy bài đọc phù hợp
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Hãy thử đổi từ khóa tìm kiếm hoặc chọn "Tất cả chủ đề" / "Tất cả trình độ".
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 text-amber-300 text-xs font-bold hover:bg-slate-700 transition-all"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}

        </section>

        {/* 5. Cultural Pillars / EdTech Philosophy */}
        <CulturalPillars />

        {/* 6. Live Community UGC Section Teaser */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-teal-500/30 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-xs font-bold text-teal-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>KHÔNG GIAN HỌC TẬP KHÔNG PHÁN XÉT</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Tự Do Viết Cảm Nghĩ & Chia Sẻ Góc Nhìn Văn Hóa
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Ở VN Culture Reader, bạn không bị chấm điểm hay soi lỗi ngữ pháp. Hãy dùng các từ vựng học thuật vừa học để nói lên niềm tự hào văn hóa quê hương theo cách riêng của bạn.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={() => setIsReflectionsOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/30 flex items-center gap-2 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Xem & Đăng Cảm Nghĩ Cộng Đồng</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sample Mini Feed Card Preview */}
              <div className="w-full max-w-md bg-slate-950/80 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">Mai Linh (Hà Nội)</div>
                    <div className="text-[10px] text-slate-400">Về bài đọc: The Imperial City of Hue</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "Reading about Hue Citadel gave me immense pride! I can now use academic terms like 'geomancy' and 'monumental' to share our history..."
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="text-amber-400">✨ 3 từ vựng học thuật</span>
                  <span className="flex items-center gap-1 text-pink-400">
                    <Heart className="w-3 h-3 fill-pink-400" /> 24 lượt thả tim
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

      {/* MODAL 4: Project Specs & Architecture Inspector */}
      <ProjectSpecsDrawer
        isOpen={isSpecsDrawerOpen}
        onClose={() => setIsSpecsDrawerOpen(false)}
      />

    </div>
  );
}

export default App;
