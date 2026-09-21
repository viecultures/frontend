import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  RotateCw,
  CheckCircle2,
  Send,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileText,
  CheckCircle,
  Flame
} from 'lucide-react';
import bannerVideo from '../assets/banner.webm';
import picHue from '../assets/pictures/1789477888834_3466390194730922005_g2285579428170464438_97fb29714b65f3e4f91196487a1510be.jpg';
import picDongHo from '../assets/pictures/1789477897671_3466390194730922005_g2285579428170464438_208c3b16036482dde07954a98eba6f37.jpg';
import picAoDai from '../assets/pictures/1789477908863_3466390194730922005_g2285579428170464438_43e95faf8835448ecde377e2b7447d69.jpg';

interface LandingPage2Props {
  onNavigate: (view: string) => void;
  onOpenDocs: () => void;
}

const COVERFLOW_ARTICLES = [
  {
    id: 'hue-citadel',
    title: 'Imperial Hue Citadel Gates',
    subtitle: 'Explore 19th-century court architecture and geomancy design.',
    category: 'Heritage',
    level: 'B1',
    image: picHue,
    readTime: '5 mins'
  },
  {
    id: 'saigon-banh-mi',
    title: 'The Story of Saigon Banh Mi',
    subtitle: 'From French baguette to global street food culinary icon.',
    category: 'Cuisine',
    level: 'B1',
    image: picDongHo,
    readTime: '4 mins'
  },
  {
    id: 'hoi-an-lanterns',
    title: 'Hoi An Lantern Festival',
    subtitle: 'Full moon rituals and ancient silk craftsmanship along the river.',
    category: 'Heritage',
    level: 'B1',
    image: picAoDai,
    readTime: '6 mins'
  },
  {
    id: 'bat-trang-ceramics',
    title: 'Bat Trang Ceramic Heritage',
    subtitle: '700 years of traditional pottery craftsmanship in Hanoi.',
    category: 'Crafts',
    level: 'B2',
    image: picHue,
    readTime: '5 mins'
  },
  {
    id: 'mu-cang-chai',
    title: 'Mu Cang Chai Rice Terraces',
    subtitle: 'Highland harvest season and traditional agricultural wisdom.',
    category: 'Nature',
    level: 'B1',
    image: picDongHo,
    readTime: '4 mins'
  }
];

export const LandingPage2: React.FC<LandingPage2Props> = ({ onNavigate, onOpenDocs }) => {
  // 3D Coverflow State
  const [coverflowIndex, setCoverflowIndex] = useState(2);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Interactive Demo Reader Tooltip State
  const [activeTooltipWord, setActiveTooltipWord] = useState<string | null>('architectural');

  // Interactive Flashcard State
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);
  const [flashcardScore, setFlashcardScore] = useState(18);
  const [flashcardToast, setFlashcardToast] = useState<string | null>(null);

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Auto advance Coverflow every 3 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCoverflowIndex((prev) => (prev + 1) % COVERFLOW_ARTICLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleFlashcardRating = (type: 'again' | 'mastered') => {
    if (type === 'again') {
      setFlashcardToast('🔴 Đã đánh dấu Cần Ôn Lại! Thẻ sẽ lặp lại sớm hơn.');
    } else {
      setFlashcardScore((prev) => Math.min(25, prev + 1));
      setFlashcardToast('🟢 Đã đánh dấu Đã Nhớ! Tiến độ bài học +1');
    }
    setTimeout(() => setFlashcardToast(null), 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0D1C18] text-[#FFFDF8] font-sans selection:bg-[#FCE5B5] selection:text-[#122A22]">

      {/* 1. HERO BANNER SECTION (Full Screen Video Background Reuse) */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-white/10">
        
        {/* Full-screen Video Background with Dark Atmospheric Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-[0.65] contrast-[1.1] scale-105"
          >
            <source src={bannerVideo} type="video/webm" />
            Trình duyệt của bạn không hỗ trợ video HTML5.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C18] via-[#0D1C18]/50 to-[#0D1C18]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D1C18]/40 to-[#0D1C18]/90" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#F5D280]/40 text-[#FCE5B5] text-xs font-semibold tracking-wider uppercase mb-6 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-[#F5D280]" />
            <span>Nền Tảng EdTech Tiên Phong Văn Hóa Việt • Specification Layout</span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-tight mb-6 drop-shadow-2xl">
            Nâng Tầm Tiếng Anh — <br className="hidden sm:inline" />
            <span className="text-[#FCE5B5] italic font-normal">Trở Thành Sứ Giả Văn Hóa Việt</span>
          </h1>

          <p className="max-w-3xl text-base sm:text-lg text-white/90 leading-relaxed font-normal mb-10 text-balance drop-shadow-md">
            Khám phá 500+ bài đọc song ngữ chuẩn học thuật (A2 - C1) về lịch sử, di sản, ẩm thực và đời sống Việt Nam. Kết hợp Audio AI Shadowing và Flashcard lặp ngắt quãng.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('discovery')}
              className="btn-pill-primary px-8 py-4 text-base font-bold flex items-center gap-2 shadow-2xl hover:scale-105 transition-transform"
            >
              <span>Bắt Đầu Học Miễn Phí</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href="#interactive-demo"
              className="btn-pill-glass px-8 py-4 text-base font-semibold flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-[#F5D280]" />
              <span>Trải Nghiệm Bài Đọc</span>
            </a>

            <button
              onClick={onOpenDocs}
              className="btn-pill-glass px-6 py-4 text-sm font-semibold flex items-center gap-2 text-white/80 hover:text-white"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Xem Đọc Đặc Tả Design.md</span>
            </button>
          </div>
        </div>
      </section>


      {/* 2. TOP FEATURED ARTICLES SECTION (3D Coverflow Slider with Auto-Advance Every 3 Seconds) */}
      <section id="featured-articles" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0A1613]">
        <div className="max-w-7xl mx-auto text-center">
          
          <span className="text-xs font-bold tracking-widest text-[#F5D280] uppercase">Curated Weekly Selection</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
            Top Featured Articles (3D Coverflow Slider)
          </h2>
          <p className="text-sm text-white/70 max-w-xl mx-auto mb-12">
            Tự động chuyển bài mỗi 3 giây. Nhấp vào bất kỳ thẻ bài đọc nào để đưa lên vị trí trung tâm.
          </p>

          {/* 3D Coverflow Container */}
          <div
            className="relative h-[420px] sm:h-[460px] max-w-5xl mx-auto flex items-center justify-center overflow-hidden"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {COVERFLOW_ARTICLES.map((article, index) => {
              // Calculate offset relative to active index
              const total = COVERFLOW_ARTICLES.length;
              const diff = (index - coverflowIndex + total) % total;

              let zIndex = 10;
              let scale = 0.7;
              let opacity = 0.4;
              let translateX = '0%';
              let rotateY = '0deg';

              if (diff === 0) {
                // Active Center Card
                zIndex = 30;
                scale = 1;
                opacity = 1;
                translateX = '0%';
              } else if (diff === 1) {
                // Next Right Card
                zIndex = 20;
                scale = 0.85;
                opacity = 0.75;
                translateX = '65%';
                rotateY = '-15deg';
              } else if (diff === 2) {
                // Far Next Right Card
                zIndex = 10;
                scale = 0.7;
                opacity = 0.4;
                translateX = '120%';
                rotateY = '-30deg';
              } else if (diff === total - 1) {
                // Prev Left Card
                zIndex = 20;
                scale = 0.85;
                opacity = 0.75;
                translateX = '-65%';
                rotateY = '15deg';
              } else {
                // Far Prev Left Card
                zIndex = 10;
                scale = 0.7;
                opacity = 0.4;
                translateX = '-120%';
                rotateY = '30deg';
              }

              return (
                <div
                  key={article.id}
                  onClick={() => {
                    if (diff === 0) {
                      onNavigate('bilingual-reader');
                    } else {
                      setCoverflowIndex(index);
                    }
                  }}
                  style={{
                    transform: `translateX(${translateX}) scale(${scale}) rotateY(${rotateY})`,
                    zIndex,
                    opacity,
                  }}
                  className={`absolute w-[300px] sm:w-[360px] bg-[#122A22] border border-white/20 rounded-2xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-out select-none group hover:border-[#F5D280]/60`}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#122A22] via-transparent to-black/30" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0D1C18]/80 text-[#FCE5B5] border border-white/20 backdrop-blur-md">
                        {article.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                        Band {article.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 text-left space-y-2">
                    <h3 className="font-heading font-bold text-lg text-white group-hover:text-[#FCE5B5] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-white/75 line-clamp-2 leading-relaxed">
                      {article.subtitle}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-xs text-[#F5D280] font-semibold">
                      <span>{article.readTime}</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Đọc Ngay →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coverflow Dots & Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setCoverflowIndex((prev) => (prev - 1 + COVERFLOW_ARTICLES.length) % COVERFLOW_ARTICLES.length)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {COVERFLOW_ARTICLES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCoverflowIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${i === coverflowIndex ? 'w-8 bg-[#F5D280]' : 'w-2.5 bg-white/30 hover:bg-white/50'}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCoverflowIndex((prev) => (prev + 1) % COVERFLOW_ARTICLES.length)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>


      {/* 3. TOPICS SECTION (The 4 Core Pillars) */}
      <section id="topics" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-[#F5D280] uppercase">Content Curriculum</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
              The 4 Core Topics (Pillars)
            </h2>
            <p className="text-sm text-white/70">
              Lộ trình bài đọc được thiết kế khoa học nhằm mở rộng vốn từ vựng thuộc các miền di sản văn hóa trọng điểm.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-[#122A22] border border-white/15 rounded-2xl p-6 hover:border-[#F5D280]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#F5D280] mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white/50 tracking-wider uppercase">Pillar 01</span>
                <h3 className="font-heading font-bold text-xl text-white mt-1 mb-2 group-hover:text-[#FCE5B5]">
                  History &amp; Heritage
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Lịch sử triều đại, các di sản thế giới UNESCO, thành quách cổ kính và những cột mốc độc lập dân tộc.
                </p>
              </div>
              <button
                onClick={() => onNavigate('discovery')}
                className="mt-6 text-xs font-bold text-[#F5D280] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Khám phá 120+ bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#122A22] border border-white/15 rounded-2xl p-6 hover:border-[#F5D280]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white/50 tracking-wider uppercase">Pillar 02</span>
                <h3 className="font-heading font-bold text-xl text-white mt-1 mb-2 group-hover:text-[#FCE5B5]">
                  Cuisine &amp; Coffee
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Ẩm thực 3 miền, câu chuyện Bánh mì Sài Gòn, Cà phê trứng Hà Nội và từ vựng ẩm thực chuẩn quốc tế.
                </p>
              </div>
              <button
                onClick={() => onNavigate('discovery')}
                className="mt-6 text-xs font-bold text-[#F5D280] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Khám phá 95+ bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#122A22] border border-white/15 rounded-2xl p-6 hover:border-[#F5D280]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white/50 tracking-wider uppercase">Pillar 03</span>
                <h3 className="font-heading font-bold text-xl text-white mt-1 mb-2 group-hover:text-[#FCE5B5]">
                  Arts &amp; Craft Villages
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Làng dệt lụa Vạn Phúc, gốm Bát Tràng, tranh Đông Hồ, múa rối nước và âm nhạc dân gian truyền thống.
                </p>
              </div>
              <button
                onClick={() => onNavigate('discovery')}
                className="mt-6 text-xs font-bold text-[#F5D280] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Khám phá 140+ bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pillar 4 */}
            <div className="bg-[#122A22] border border-white/15 rounded-2xl p-6 hover:border-[#F5D280]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-white/50 tracking-wider uppercase">Pillar 04</span>
                <h3 className="font-heading font-bold text-xl text-white mt-1 mb-2 group-hover:text-[#FCE5B5]">
                  Festivals &amp; Beliefs
                </h3>
                <p className="text-xs text-white/75 leading-relaxed">
                  Phong tục Tết Nguyên Đán, Đêm hội Trung Thu, tín ngưỡng thờ Mẫu và các lễ hội đình làng đặc sắc.
                </p>
              </div>
              <button
                onClick={() => onNavigate('discovery')}
                className="mt-6 text-xs font-bold text-[#F5D280] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                <span>Khám phá 110+ bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* 4. INTERACTIVE READER DEMO SECTION (Value-Add Feature Preview) */}
      <section id="interactive-demo" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0A1613]">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Description & CTAs */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#F5D280] uppercase">Interactive Demo 01</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                Trải Nghiệm Reader Overlay Trực Tiếp
              </h2>
              <p className="text-sm text-white/80 leading-relaxed font-normal">
                Nhấp vào bất kỳ từ vựng gạch chân nào trong đoạn văn mẫu để xem phiên âm IPA chuẩn, nghĩa Tiếng Việt, nghe phát âm AI và xem câu ví dụ thực tế.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-white/90">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Tra từ tức thì không ngắt quãng trải nghiệm đọc song ngữ</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-white/90">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Lưu từ vựng trực tiếp vào bộ Flashcard Spaced Repetition</span>
                </div>
                <div className="flex items-start gap-3 text-xs text-white/90">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Tự động chuyển đổi chế độ xem Song ngữ / Tiếng Anh duy nhất</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('bilingual-reader')}
                  className="btn-pill-primary px-6 py-3.5 text-sm font-bold flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Mở Trình Đọc Song Ngữ Đầy Đủ</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Interactive Tooltip Demo Component */}
            <div className="lg:col-span-7">
              <div className="bg-[#122A22] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-white/60 ml-2">ReaderPreview.tsx</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FCE5B5] text-[#122A22]">
                    BILINGUAL MODE
                  </span>
                </div>

                {/* Article Preview Card with Clickable Highlight Words */}
                <div className="space-y-6 text-left">
                  <h3 className="font-heading font-bold text-2xl text-[#FCE5B5]">
                    Imperial Hue Citadel Architecture
                  </h3>

                  <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/10 space-y-3">
                    <p className="text-sm leading-relaxed text-white/90 font-serif">
                      "The Imperial Citadel represents an extraordinary{' '}
                      <span
                        onClick={() => setActiveTooltipWord('architectural')}
                        className={`cursor-pointer px-1.5 py-0.5 rounded font-bold underline decoration-amber-400 decoration-2 transition-colors ${activeTooltipWord === 'architectural' ? 'bg-amber-400/30 text-[#FCE5B5]' : 'hover:bg-white/10 text-amber-300'}`}
                      >
                        architectural
                      </span>{' '}
                      accomplishment. Originating from Bac Ninh, traditional craftsmen embodied the{' '}
                      <span
                        onClick={() => setActiveTooltipWord('quintessence')}
                        className={`cursor-pointer px-1.5 py-0.5 rounded font-bold underline decoration-emerald-400 decoration-2 transition-colors ${activeTooltipWord === 'quintessence' ? 'bg-emerald-400/30 text-emerald-200' : 'hover:bg-white/10 text-emerald-300'}`}
                      >
                        quintessence
                      </span>{' '}
                      of Vietnamese aesthetics with{' '}
                      <span
                        onClick={() => setActiveTooltipWord('shimmering')}
                        className={`cursor-pointer px-1.5 py-0.5 rounded font-bold underline decoration-sky-400 decoration-2 transition-colors ${activeTooltipWord === 'shimmering' ? 'bg-sky-400/30 text-sky-200' : 'hover:bg-white/10 text-sky-300'}`}
                      >
                        shimmering
                      </span>{' '}
                      natural pigments."
                    </p>
                    <p className="text-xs leading-relaxed text-white/60 italic font-sans border-t border-white/10 pt-2">
                      "Hoàng thành Huế là một thành tựu kiến trúc kiệt xuất. Nghệ nhân dân gian đã hiện thân cho tinh hoa mỹ thuật Việt Nam với màu khoáng tự nhiên lấp lánh."
                    </p>
                  </div>

                  {/* Active Popup Tooltip Display Box */}
                  {activeTooltipWord && (
                    <div className="p-4 rounded-xl bg-[#18362C] border border-[#F5D280]/50 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-bold text-xl text-[#FCE5B5]">
                              {activeTooltipWord === 'architectural' && 'architectural'}
                              {activeTooltipWord === 'quintessence' && 'quintessence'}
                              {activeTooltipWord === 'shimmering' && 'shimmering'}
                            </h4>
                            <span className="text-xs text-white/60 italic">
                              {activeTooltipWord === 'architectural' && '/ˌɑːrkɪˈtektʃərəl/ • adj'}
                              {activeTooltipWord === 'quintessence' && '/kwɪnˈtesns/ • noun'}
                              {activeTooltipWord === 'shimmering' && '/ˈʃɪmərɪŋ/ • adj'}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-emerald-400 mt-1">
                            {activeTooltipWord === 'architectural' && 'Thuộc về kiến trúc, liên quan đến thiết kế công trình'}
                            {activeTooltipWord === 'quintessence' && 'Tinh hoa, phần tinh túy nhất của văn hóa / nghệ thuật'}
                            {activeTooltipWord === 'shimmering' && 'Lấp lánh, óng ánh sắc màu tự nhiên'}
                          </p>
                        </div>
                        <button
                          onClick={() => alert(`🔊 Đang phát âm từ vựng: ${activeTooltipWord}`)}
                          className="p-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors"
                          title="Nghe phát âm AI"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
                        <span>💡 Đã lưu tự động vào Flashcard Deck</span>
                        <span className="text-[#F5D280] font-semibold">Band B2 / C1</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 5. INTERACTIVE DEMO 02: FLASHCARD & SPACED REPETITION PREVIEW */}
      <section id="flashcard-demo" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Side: Interactive Flip Flashcard Box */}
            <div className="lg:col-span-6">
              <div className="bg-[#122A22] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                
                {/* SRS Progress Header */}
                <div className="flex items-center justify-between text-xs font-bold text-white/70 mb-3">
                  <span className="flex items-center gap-1.5 text-[#F5D280]">
                    <Sparkles className="w-4 h-4" />
                    LIVE DEMO: SPACED REPETITION CARD
                  </span>
                  <span className="text-emerald-400 font-mono">
                    {flashcardScore} / 25 Words ({Math.round((flashcardScore / 25) * 100)}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-6">
                  <div
                    style={{ width: `${(flashcardScore / 25) * 100}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-500"
                  />
                </div>

                {/* Interactive Card */}
                <div
                  onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                  className="bg-[#0D1C18] border border-[#F5D280]/40 rounded-2xl p-8 min-h-[220px] flex flex-col items-center justify-center text-center cursor-pointer select-none hover:border-[#F5D280] transition-all shadow-inner relative group"
                >
                  {!isFlashcardFlipped ? (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <h3 className="font-heading font-bold text-3xl text-white group-hover:text-[#FCE5B5] transition-colors">
                        architectural
                      </h3>
                      <p className="text-xs font-mono text-emerald-400">
                        /ˌɑːrkɪˈtektʃərəl/ • adjective
                      </p>
                      <p className="text-xs text-white/80 italic max-w-sm leading-relaxed">
                        "The Imperial Citadel represents an extraordinary <u className="decoration-amber-400 decoration-2">architectural</u> accomplishment."
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <h3 className="font-heading font-bold text-3xl text-emerald-400">
                        Thuộc về kiến trúc
                      </h3>
                      <p className="text-xs text-white/90 font-medium max-w-sm leading-relaxed">
                        Định nghĩa: Liên quan đến nghệ thuật thiết kế và xây dựng công trình di sản văn hóa.
                      </p>
                    </div>
                  )}

                  <span className="mt-6 text-[11px] text-white/50 flex items-center gap-1">
                    <RotateCw className="w-3 h-3 text-[#F5D280]" />
                    <span>Bấm vào thẻ để lật xem mặt Tiếng Việt / Tiếng Anh</span>
                  </span>
                </div>

                {/* Toast Message */}
                {flashcardToast && (
                  <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center animate-in fade-in duration-200">
                    {flashcardToast}
                  </div>
                )}

                {/* Rating Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={() => handleFlashcardRating('again')}
                    className="py-3 px-4 rounded-xl border border-rose-500/50 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>🔴 Cần Ôn Lại</span>
                  </button>
                  <button
                    onClick={() => handleFlashcardRating('mastered')}
                    className="py-3 px-4 rounded-xl border border-emerald-500/50 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>🟢 Đã Nhớ</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Right Side: Description */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#F5D280] uppercase">Interactive Demo 02</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                Smart Flashcard &amp; Spaced Repetition
              </h2>
              <p className="text-sm text-white/80 leading-relaxed font-normal">
                Hệ thống ghi nhớ từ vựng thông minh ứng dụng thuật toán lặp lại ngắt quãng (Spaced Repetition System). Hỗ trợ 5 chế độ tập luyện: Lật thẻ, Trắc nghiệm, Gõ từ, Nối từ và Luyện nghe phát âm.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-white/90">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Lật thẻ ghi nhớ</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Trắc nghiệm ngữ cảnh</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Gõ chính tả chuẩn IPA</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Shadowing phát âm</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('flashcard-study')}
                  className="btn-pill-primary px-6 py-3.5 text-sm font-bold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Trải Nghiệm Flashcards Đầy Đủ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 6. TRUSTED COMMUNITY & AMBASSADORS SECTION */}
      <section id="trusted-community" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0A1613]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-[#F5D280] uppercase">Social Proof &amp; Community</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">
              Trusted By Cultural Ambassadors
            </h2>
            <p className="text-sm text-white/70">
              Đồng hành cùng hàng ngàn người học chia sẻ văn hóa Việt Nam ra thế giới bằng Tiếng Anh chuẩn học thuật.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl bg-[#122A22] border border-white/15 mb-14 text-center">
            <div>
              <h3 className="font-heading font-bold text-4xl sm:text-5xl text-[#FCE5B5]">500+</h3>
              <p className="text-xs font-semibold text-white/70 mt-1">Bilingual Cultural Articles</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-4xl sm:text-5xl text-[#FCE5B5]">12,500+</h3>
              <p className="text-xs font-semibold text-white/70 mt-1">Active Ambassadors</p>
            </div>
            <div>
              <h3 className="font-heading font-bold text-4xl sm:text-5xl text-[#FCE5B5]">150,000+</h3>
              <p className="text-xs font-semibold text-white/70 mt-1">Flashcard Repetitions</p>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feedback 1 */}
            <div className="p-6 rounded-2xl bg-[#122A22] border border-white/15 flex flex-col justify-between space-y-4">
              <p className="text-xs leading-relaxed text-white/85 italic">
                "Reading about Saigon's coffee history in academic B2 English gave me the exact vocabulary I needed to explain Vietnamese culture to my international colleagues!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-xs">
                  LT
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Lê Thu Trang</h4>
                  <p className="text-[11px] text-white/60">English Teacher &amp; Tour Guide</p>
                </div>
              </div>
            </div>

            {/* Feedback 2 */}
            <div className="p-6 rounded-2xl bg-[#122A22] border border-white/15 flex flex-col justify-between space-y-4">
              <p className="text-xs leading-relaxed text-white/85 italic">
                "The Safe Reflections section is brilliant. Writing without fear of grammar correction or red pen grading helped me build confidence writing in English."
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 text-xs">
                  QB
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Nguyễn Quốc Bảo</h4>
                  <p className="text-[11px] text-white/60">University Student</p>
                </div>
              </div>
            </div>

            {/* Feedback 3 */}
            <div className="p-6 rounded-2xl bg-[#122A22] border border-white/15 flex flex-col justify-between space-y-4">
              <p className="text-xs leading-relaxed text-white/85 italic">
                "As an expat living in Hanoi, this app helps me understand Vietnamese heritage while helping my local friends practice natural English pronunciation!"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center font-bold text-sky-300 text-xs">
                  MH
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Mark Henderson</h4>
                  <p className="text-[11px] text-white/60">Expat &amp; Language Enthusiast</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 7. CONTACT FORM SECTION */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-3xl mx-auto bg-[#122A22] border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl text-left">
          
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#F5D280] uppercase">Get In Touch</span>
            <h2 className="font-heading text-3xl font-bold text-white mt-1">
              Contact Team &amp; Inquiries
            </h2>
            <p className="text-xs text-white/70 mt-2">
              Liên hệ hợp tác chương trình EdTech hoặc đóng góp nội dung văn hóa di sản.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2 animate-in fade-in duration-300">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-emerald-300">
                Gửi Tin Nhắn Thành Công!
              </h3>
              <p className="text-xs text-white/80">
                Cảm ơn bạn đã liên hệ. Đội ngũ VieCultures sẽ phản hồi qua email trong vòng 24h.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-white/80 uppercase mb-2">Họ &amp; Tên</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Nhập họ và tên..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#F5D280]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 uppercase mb-2">Email Liên Hệ</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#F5D280]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/80 uppercase mb-2">Nội Dung Tin Nhắn</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Nhập câu hỏi hoặc đề xuất hợp tác..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/20 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#F5D280]"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-pill-primary py-4 text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
              >
                <Send className="w-4 h-4" />
                <span>Gửi Tin Nhắn / Send Message</span>
              </button>
            </form>
          )}

        </div>
      </section>


      {/* 8. FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#091512] text-xs text-white/60 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="font-heading font-bold text-lg text-white">VieCultures</span>
            <p className="mt-1">Nền tảng EdTech Học Tiếng Anh Qua Nghệ Thuật &amp; Di Sản Việt Nam.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button onClick={() => onNavigate('landing')} className="hover:text-[#FCE5B5]">Landing 1</button>
            <button onClick={() => onNavigate('landing-2')} className="hover:text-[#FCE5B5]">Landing 2</button>
            <button onClick={() => onNavigate('discovery')} className="hover:text-[#FCE5B5]">Discovery</button>
            <button onClick={() => onNavigate('bilingual-reader')} className="hover:text-[#FCE5B5]">Reader</button>
            <button onClick={() => onNavigate('flashcard-study')} className="hover:text-[#FCE5B5]">Flashcards</button>
          </div>
          <p>&copy; 2026 VieCultures. Landing Page Layout Specification.</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage2;
