import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import bannerVideo from '@/assets/banner.webm';

interface LandingHeroBannerProps {
  onScrollToExplore?: () => void;
}

export const LandingHeroBanner: React.FC<LandingHeroBannerProps> = ({
  onScrollToExplore,
}) => {
  const handleScrollClick = () => {
    if (onScrollToExplore) {
      onScrollToExplore();
    } else {
      const el = document.getElementById('lo-trinh-hoc');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background Video Layer with Rich Heritage Overlays */}
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

      {/* Hero Typography & Content */}
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

      {/* Scroll to Explore Indicator */}
      <div
        onClick={handleScrollClick}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer text-white/80 hover:text-white transition-colors"
      >
        <span className="text-[11px] font-semibold tracking-wider text-antique-bright/90 uppercase font-sans">
          Cuộn xuống để khám phá
        </span>
        <div className="w-7 h-7 rounded-full bg-white/10 border border-antique-rich/40 flex items-center justify-center backdrop-blur-md animate-bounce">
          <ChevronDown className="w-3.5 h-3.5 text-antique-bright" />
        </div>
      </div>
    </section>
  );
};

export default LandingHeroBanner;
