import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ExploreSection } from './components/ExploreSection';
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
    } else if (sectionId === 'kham-pha') {
      const el = document.getElementById('kham-pha');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'tu-vung') {
      const el = document.getElementById('tu-vung');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else setActiveFlashcardLesson(featuredLesson);
    } else if (sectionId === 'so-tay') {
      setActiveFlashcardLesson(featuredLesson);
    } else if (sectionId === 'search') {
      const el = document.getElementById('tu-vung');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'account') {
      setIsReflectionsOpen(true);
    }
  };

  const handleSelectExploreCategory = (cat: Category) => {
    setSelectedCategory(cat);
    const el = document.getElementById('tu-vung');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-[#2C2523] flex flex-col selection:bg-[#D9B76A] selection:text-[#1E4B43]">
      
      {/* 1. Navigation Bar (Logo + Slogan + 3 Menu + Actions from design.md) */}
      <Navbar
        onOpenDocs={() => setIsSpecsDrawerOpen(true)}
        onNavigateToSection={handleNavigate}
      />

      {/* 2. Hero Section (VieCultures H1, Tagline, CTA, Widget Discover, Quote & Art) */}
      <HeroBanner
        onStartReading={() => setActiveReaderLesson(featuredLesson)}
        onStartFlashcard={() => setActiveFlashcardLesson(featuredLesson)}
        onOpenSpecs={() => setIsSpecsDrawerOpen(true)}
        onScrollToExplore={() => handleNavigate('kham-pha')}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full">
        
        {/* 3. Section: Bốn Miền Khám Phá (4 Topic Cards Grid from design.md) */}
        <ExploreSection onSelectCategory={handleSelectExploreCategory} />

        {/* 4. Featured Spotlight Card (Tranh Đông Hồ / Bài Đọc Tiêu Biểu) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
          <div className="heritage-card p-6 sm:p-10 border border-[#E8DFCB] bg-[#FDFBF7] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left text spotlight */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F6EEDC] text-[#1E4B43] border border-[#E8DFCB] flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
                    BÀI ĐỌC TIÊU BIỂU TRONG TUẦN
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D9B76A]/20 text-[#7A5610] border border-[#D9B76A]/50">
                    Band B2
                  </span>
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E4B43] leading-tight">
                  {featuredLesson.titleEn}
                </h2>

                <p className="text-sm sm:text-base text-[#8C6B28] font-semibold">
                  {featuredLesson.titleVi}
                </p>

                <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed max-w-xl font-normal">
                  {featuredLesson.summary} Tìm hiểu nét khắc mộc bản, màu khoáng tự nhiên từ hoa hòe, tro lá tre và vỏ điệp lấp lánh qua bài đọc song ngữ kèm AI Shadowing.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => setActiveReaderLesson(featuredLesson)}
                    className="btn-pill-primary px-6 py-3 text-xs sm:text-sm font-semibold"
                  >
                    <BookOpen className="w-4 h-4 text-white" />
                    <span>Đọc Song Ngữ &amp; Shadowing</span>
                  </button>

                  <button
                    onClick={() => setActiveFlashcardLesson(featuredLesson)}
                    className="btn-pill-glass px-5 py-3 text-xs sm:text-sm font-semibold"
                  >
                    <Sparkles className="w-4 h-4 text-[#1E4B43]" />
                    <span>Ôn 4 Flashcards 3D</span>
                  </button>
                </div>
              </div>

              {/* Right Visual Frame */}
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-[20px] overflow-hidden border border-[#D1D5DB] shadow-lg bg-[#E5E7EB] flex flex-col items-center justify-center">
                {featuredLesson.imageUrl ? (
                  <>
                    <img
                      src={featuredLesson.imageUrl}
                      alt={featuredLesson.titleEn}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E4B43]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white font-medium">
                      <span className="bg-black/50 px-3 py-1 rounded-full border border-white/20 backdrop-blur-xs">
                        🎨 Tranh Dân Gian Đông Hồ
                      </span>
                      <span className="bg-[#D9B76A]/90 text-[#1E4B43] px-3 py-1 rounded-full font-bold shadow-xs">
                        Di Sản Mộc Bản
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[#9CA3AF]">
                    <span className="text-3xl mb-2">🎨</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#E5E7EB] text-[#1F2937] mb-2">
                      Cần ảnh asset
                    </span>
                    <code className="text-sm font-mono font-semibold text-[#111827] mb-1">
                      assets/card-le-hoi.webp
                    </code>
                    <p className="text-xs text-[#4B5563] max-w-xs leading-relaxed">
                      {featuredLesson.titleVi}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* 5. Kho Tàng Bài Đọc & Bộ Lọc (#tu-vung) */}
        <section id="tu-vung" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D9B76A] uppercase tracking-wider mb-2">
                <span>❖ Khám phá kho tàng từ vựng &amp; bài đọc song ngữ</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1E4B43] tracking-tight">
                Danh Sách Bài Học Song Ngữ
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#6B635B] max-w-md font-normal">
              Chọn chuyên đề văn hóa hoặc lọc theo trình độ CEFR mong muốn để bắt đầu hành trình gom từng từ nhỏ, hiểu một Việt Nam lớn.
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
            <div className="text-center py-16 heritage-card border border-[#E8DFCB] bg-[#FDFBF7]">
              <span className="text-4xl mb-3 block">🔍</span>
              <h3 className="font-heading text-2xl font-bold text-[#1E4B43] mb-1">
                Không tìm thấy bài đọc phù hợp
              </h3>
              <p className="text-xs text-[#6B635B] mb-4 font-normal">
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

        {/* 6. Cultural Philosophy & Pillars */}
        <CulturalPillars />

        {/* 7. Community Reflections Safe Zone Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="heritage-card p-8 sm:p-12 border border-[#E8DFCB] bg-[#BFE3EA]/20 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F6EEDC] border border-[#E8DFCB] text-xs font-semibold text-[#1E4B43]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E4B43]" />
                  <span>MÔI TRƯỜNG CẢM NGHĨ KHÔNG PHÁN XÉT (NO-JUDGMENT)</span>
                </div>

                <h3 className="font-heading text-3xl sm:text-4xl font-bold text-[#1E4B43]">
                  Tự Do Viết Cảm Nghĩ &amp; Tôn Vinh Bản Sắc Dân Tộc
                </h3>

                <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed font-normal">
                  Ở VieCultures, bạn hoàn toàn tự do viết mà không sợ bị chấm điểm hay soi lỗi ngữ pháp. Hãy dùng các từ vựng học thuật vừa học để nói lên góc nhìn văn hóa quê hương theo cách của bạn.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    onClick={() => setIsReflectionsOpen(true)}
                    className="btn-pill-primary px-6 py-3.5 text-xs sm:text-sm font-semibold shadow-md"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>Xem &amp; Đăng Cảm Nghĩ Cộng Đồng</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Sample Mini Feed Card Preview */}
              <div className="w-full max-w-md bg-[#FDFBF7] p-5 rounded-[20px] border border-[#E8DFCB] shadow-md space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="User avatar"
                    className="w-9 h-9 rounded-full object-cover border border-[#E8DFCB]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#1E4B43]">Mai Linh (Hà Nội)</div>
                    <div className="text-[11px] text-[#6B635B]">Về bài đọc: Dong Ho Folk Woodcut Paintings</div>
                  </div>
                </div>

                <p className="text-xs text-[#2C2523] italic leading-relaxed font-normal">
                  "Learning about Dong Ho folk woodcut aesthetics in English feels so rewarding! The words 'quintessence' and 'pigments' helped me describe our cultural heritage to foreign friends..."
                </p>

                <div className="flex items-center justify-between text-xs text-[#6B635B] pt-2 border-t border-[#E8DFCB]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F6EEDC] text-[#1E4B43] text-[10px] font-semibold border border-[#E8DFCB]">
                    ✨ 3 từ vựng học thuật
                  </span>
                  <span className="flex items-center gap-1 text-[#2C2523] font-medium">
                    <Heart className="w-3.5 h-3.5 text-[#E8B7B2] fill-[#E8B7B2]" /> 32 lượt thả tim
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 8. Footer (Heritage Jade #1E4B43 background from design.md) */}
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
