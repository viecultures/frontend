import React from 'react';
import {
  Globe,
  ChevronDown
} from 'lucide-react';
import bannerVideo from '@/assets/banner.webm';
import { ThemeProvider } from '@/context/ThemeContext';
import { OverviewSection } from '../components/OverviewSection';
import { VietnamHeritageMapSection } from '../components/VietnamHeritageMapSection';
import { CulturalNuanceExplorer } from '../components/CulturalNuanceExplorer';
import { EditorialStoriesSection } from '../components/EditorialStoriesSection';
import { LearningMethodSection } from '../components/LearningMethodSection';
import { RoadmapHeritageSection } from '../components/RoadmapHeritageSection';

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

  return (
    <ThemeProvider>
      <div className="w-full min-h-screen bg-[#FBF7EE] dark:bg-[#102B26] text-[#1E4B43] dark:text-[#FBF7EE] font-sans antialiased selection:bg-[#E8DFCB] dark:selection:bg-[#1C4B43] selection:text-[#1E4B43] dark:selection:text-[#FBF7EE] transition-colors duration-300">
        {/* Dedicated Landing Page Navigation Bar */}
        <header className="sticky top-0 z-50 w-full bg-[#163D37]/95 border-b border-[#D9B76A]/25 backdrop-blur-xl transition-all shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand Logo & Heritage Title */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-9 h-9 rounded-full border border-[#D9B76A]/50 bg-[#1E4B43] flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform">
                🪷
              </div>
              <span className="font-heading font-bold text-xl sm:text-2xl text-[#FBF7EE] tracking-tight">
                VieCultures
              </span>
            </div>

            {/* Segment Jump Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-[#FBF7EE]/90">
              <button
                type="button"
                onClick={() => scrollToSegment('triet-ly')}
                className="hover:text-[#D9B76A] transition-colors cursor-pointer"
              >
                Triết lý Giáo dục
              </button>
              <button
                type="button"
                onClick={() => scrollToSegment('ban-do-di-san')}
                className="hover:text-[#D9B76A] transition-colors cursor-pointer"
              >
                Bản đồ Di sản
              </button>
              <button
                type="button"
                onClick={() => scrollToSegment('giai-ma-ngu-canh')}
                className="hover:text-[#D9B76A] transition-colors cursor-pointer"
              >
                Giải mã Ngữ cảnh
              </button>
              <button
                type="button"
                onClick={() => scrollToSegment('tap-chi-di-san')}
                className="hover:text-[#D9B76A] transition-colors cursor-pointer"
              >
                Tạp chí Văn hoá
              </button>
              <button
                type="button"
                onClick={() => scrollToSegment('lo-trinh-hoc')}
                className="hover:text-[#D9B76A] transition-colors cursor-pointer"
              >
                Lộ trình Học
              </button>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSegment('ban-do-di-san')}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-[#1E4B43] hover:bg-[#12302A] text-[#FBF7EE] border border-[#D9B76A]/40 font-semibold text-xs transition-all shadow-xs cursor-pointer"
              >
                Trải nghiệm ngay
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('login');
                  } else {
                    const event = new CustomEvent('app-navigate', { detail: '/login' });
                    window.dispatchEvent(event);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#D9B76A] hover:bg-[#c6a355] text-[#102B26] font-bold text-xs transition-all shadow-sm cursor-pointer"
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C18] via-[#0D1C18]/50 to-[#0D1C18]/70" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D1C18]/40 to-[#0D1C18]/90" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#F5D280]/40 text-[#FCE5B5] text-[11px] font-semibold tracking-wider uppercase mb-4 shadow-xl">
                <Globe className="w-3.5 h-3.5 text-[#F5D280]" />
                <span>VIECULTURES • HỌC TIẾNG ANH QUA VĂN HÓA VIỆT NAM</span>
              </div>

              <h1 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-4 drop-shadow-2xl">
                Khám Phá Di Sản Việt Nam — <br className="hidden sm:inline" />
                <span className="text-[#FCE5B5] italic font-normal">Qua Ngôn Ngữ &amp; Văn Hóa</span>
              </h1>

              <p className="max-w-2xl text-sm sm:text-base text-white/90 leading-relaxed font-normal mb-6 drop-shadow-md">
                Trải nghiệm hành trình du ngoạn văn hóa di sản 3 miền Bắc - Trung - Nam với bản đồ tương tác, các bài đọc song ngữ độc quyền và phương pháp AI Shadowing.
              </p>
            </div>

            {/* Scroll to Explore Text Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 pointer-events-none text-white/80">
              <span className="text-[11px] font-semibold tracking-wider text-[#FCE5B5]/90 uppercase font-sans">
                Cuộn xuống để khám phá
              </span>
              <div className="w-7 h-7 rounded-full bg-white/10 border border-[#F5D280]/40 flex items-center justify-center backdrop-blur-md animate-bounce">
                <ChevronDown className="w-3.5 h-3.5 text-[#FCE5B5]" />
              </div>
            </div>
          </section>
          <OverviewSection />
          <VietnamHeritageMapSection />
          <CulturalNuanceExplorer />
          <EditorialStoriesSection />
          <LearningMethodSection />
          <RoadmapHeritageSection />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
