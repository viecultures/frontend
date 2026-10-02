import React from 'react';
import { ArrowRight, BookOpen, ChevronDown, Sparkles } from 'lucide-react';
import bannerVideo from '@/assets/banner.webm';

interface LandingHeroBannerProps {
  onNavigate?: (view: string) => void;
  onScrollToDemo?: () => void;
}

export const LandingHeroBanner: React.FC<LandingHeroBannerProps> = ({
  onNavigate,
  onScrollToDemo,
}) => {
  const handleStartLearning = () => {
    if (onNavigate) {
      onNavigate('discovery');
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'discovery' }));
    }
  };

  const handleScrollToInteractiveDemo = () => {
    if (onScrollToDemo) {
      onScrollToDemo();
    } else {
      const el = document.getElementById('interactive-demo');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[540px] lg:min-h-[calc(100vh-5rem)] lg:max-h-[760px] flex items-center justify-start overflow-hidden bg-heritage-dark text-warm-ivory">
      {/* Background Video Layer with Atmospheric Dark Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover block filter brightness-[0.50] contrast-[1.15] scale-105"
        >
          <source src={bannerVideo} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-heritage-dark via-heritage-dark/85 to-transparent sm:w-4/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-dark/80 via-transparent to-heritage-dark/40" />
      </div>

      {/* Decorative Radial Lighting */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-antique-gold/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Hero Typography Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 flex flex-col items-start justify-center">
        <div className="max-w-2xl lg:max-w-3xl space-y-5 sm:space-y-6">
          {/* Sub-kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-antique-gold/40 text-antique-bright text-[11px] sm:text-xs font-bold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
            <span>NỀN TẢNG EDTECH TIÊN PHONG VĂN HÓA VIỆT</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-warm-ivory leading-[1.15] tracking-tight drop-shadow-2xl">
            Nâng Tầm Tiếng Anh — <br />
            <span className="text-antique-gold italic font-serif">Trở Thành Sứ Giả Văn Hóa Việt</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-warm-ivory/85 leading-relaxed max-w-2xl font-normal drop-shadow-md">
            Khám phá 500+ bài đọc song ngữ chuẩn học thuật (A2 - C1) về lịch sử, di sản, ẩm thực và đời sống Việt Nam. Kết hợp Audio AI Shadowing và Flashcard lặp ngắt quãng.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleStartLearning}
              className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-antique-bright via-antique-rich to-antique-gold text-heritage-forest font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl hover:brightness-105 active:scale-[0.98] flex items-center gap-2 cursor-pointer focus-ring-dark"
            >
              <span>Bắt Đầu Học Miễn Phí</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleScrollToInteractiveDemo}
              className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-black/30 hover:bg-black/45 text-warm-ivory border border-white/30 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer focus-ring-dark"
            >
              <BookOpen className="w-4 h-4 text-antique-gold" />
              <span>Trải Nghiệm Bài Đọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById('featured-articles');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1.5 cursor-pointer text-warm-ivory/70 hover:text-warm-ivory transition-colors group"
        aria-label="Cuộn xuống xem bài đọc tiêu biểu"
      >
        <span className="text-[10px] font-bold tracking-widest text-antique-gold uppercase font-sans">
          Khám phá thêm
        </span>
        <div className="w-7 h-7 rounded-full bg-white/10 border border-warm-ivory/20 flex items-center justify-center backdrop-blur-md group-hover:border-antique-gold transition-colors animate-bounce">
          <ChevronDown className="w-3.5 h-3.5 text-antique-gold" />
        </div>
      </button>
    </section>
  );
};

export default LandingHeroBanner;
