import React from 'react';
import {
  Globe,
  ChevronDown
} from 'lucide-react';
import bannerVideo from '@/assets/banner.webm';
import { ThemeProvider } from '@/context/ThemeContext';
import { VietnamHeritageMapSection } from '../components/VietnamHeritageMapSection';
import { LearningMethodSection } from '../components/LearningMethodSection';
import { RoadmapHeritageSection } from '../components/RoadmapHeritageSection';
import { HeritageMethodologySection } from '../components/HeritageMethodologySection';
import { CuratedStoriesSection } from '../components/CuratedStoriesSection';

interface LandingPageProps {
  onNavigate?: (view: string) => void;
  onOpenDocs?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const scrollToSegment = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
    }
  };

  return (
    <ThemeProvider>
      <div className="w-full min-h-screen bg-surface text-heritage-green font-sans antialiased selection:bg-sky-mist selection:text-heritage-green transition-colors duration-300">
        {/* ── Dedicated Landing Navigation Bar ─────────────────────────────── */}
        <header className="sticky top-0 z-50 w-full bg-heritage-dark/95 border-b border-antique-gold/25 backdrop-blur-xl transition-all shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

            {/* Brand Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group focus-ring-dark rounded-xl"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 rounded-full border border-antique-gold/50 bg-heritage-green flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
                🪷
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-2xl text-warm-ivory tracking-tight group-hover:text-antique-gold transition-colors">
                  Vie<span className="text-antique-gold">Cultures</span>
                </span>
              </div>
            </div>

            {/* Quick Jump Links (Desktop) */}
            <nav
              className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-warm-ivory/90"
              aria-label="Điều hướng Landing Page"
            >
              <button
                type="button"
                onClick={() => scrollToSegment('overview-section')}
                className="hover:text-antique-gold transition-colors cursor-pointer focus-ring-dark"
              >
                Bản Đồ Di Sản
              </button>
              <button
                type="button"
                onClick={() => scrollToSegment('lo-trinh-hoc')}
                className="hover:text-antique-gold transition-colors cursor-pointer focus-ring-dark"
              >
                Phương Pháp Học
              </button>
              <button
                type="button"
                onClick={() => scrollToSegment('tap-chi-di-san')}
                className="hover:text-antique-gold transition-colors cursor-pointer focus-ring-dark"
              >
                Tạp Chí Văn Hóa
              </button>
              <button
                type="button"
                onClick={() => scrollToSegment('cam-nhan-hoc-vien')}
                className="hover:text-antique-gold transition-colors cursor-pointer focus-ring-dark"
              >
                Cộng Đồng
              </button>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleNavigate('discovery')}
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory border border-antique-gold/40 font-bold text-xs transition-all shadow-xs cursor-pointer focus-ring-dark"
              >
                Khám Phá Bài Học
              </button>

              <button
                type="button"
                onClick={() => handleNavigate('login')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-antique-bright to-antique-gold text-heritage-forest font-bold text-xs hover:brightness-105 transition-all shadow-sm cursor-pointer focus-ring-dark"
              >
                Đăng Nhập
              </button>
            </div>

          </div>
        </header>

        <main className="w-full overflow-x-hidden">
          {/* HERO BANNER SECTION ONLY */}
          <section className="relative w-full min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover block filter brightness-[0.65] contrast-[1.1] scale-105"
              >
                <source src={bannerVideo} type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-heritage-forest via-heritage-forest/50 to-heritage-forest/70" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-heritage-forest/40 to-heritage-forest/90" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-antique-rich/40 text-antique-bright text-[11px] font-semibold tracking-wider uppercase mb-4 shadow-xl">
                <Globe className="w-3.5 h-3.5 text-antique-rich" />
                <span>VIECULTURES • HỌC TIẾNG ANH QUA VĂN HÓA VIỆT NAM</span>
              </div>

              <h1 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-4 drop-shadow-2xl">
                Khám Phá Di Sản Việt Nam — <br className="hidden sm:inline" />
                <span className="text-antique-bright italic font-normal">Qua Ngôn Ngữ &amp; Văn Hóa</span>
              </h1>

              <p className="max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed font-normal mb-6 drop-shadow-md">
                Trải nghiệm hành trình du ngoạn văn hóa di sản 3 miền Bắc - Trung - Nam với bản đồ tương tác, các bài đọc song ngữ độc quyền và phương pháp AI Shadowing.
              </p>
            </div>

            {/* Scroll to Explore Text Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none text-white/80">
              <span className="text-[11px] font-semibold tracking-wider text-antique-bright/90 uppercase font-sans">
                Cuộn xuống để khám phá
              </span>
              <div className="w-7 h-7 rounded-full bg-white/10 border border-antique-rich/40 flex items-center justify-center backdrop-blur-md animate-bounce">
                <ChevronDown className="w-3.5 h-3.5 text-antique-bright" />
              </div>
            </div>
          </section>
          <div id="lo-trinh-hoc">
            <HeritageMethodologySection onNavigate={handleNavigate} />
          </div>

          <VietnamHeritageMapSection />
          <CuratedStoriesSection onNavigate={handleNavigate} />
          <LearningMethodSection />
          <RoadmapHeritageSection />
        </main>
      </div>
    </ThemeProvider >
  );
};

export default LandingPage;
