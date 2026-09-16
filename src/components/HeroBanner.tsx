import React from 'react';
import { Sparkles, BookOpen, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import bannerVideo from '../assets/banner.webm';

interface HeroBannerProps {
  onStartReading: () => void;
  onStartFlashcard: () => void;
  onOpenSpecs: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartReading,
  onStartFlashcard,
}) => {
  return (
    <section id="hero" className="relative w-full min-h-[96vh] flex items-center justify-center overflow-hidden">
      
      {/* 1. Full-screen Video Background with Cinematic Atmospheric Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-[0.78] contrast-[1.08] transition-transform duration-1000"
        >
          <source src={bannerVideo} type="video/webm" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>

        {/* Multi-layer atmospheric gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1C18] via-[#0D1C18]/45 to-[#0D1C18]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0D1C18]/30 to-[#0D1C18]/80" />
      </div>

      {/* 2. Unboxed Center Hero Content (Modern Heritage Editorial Style) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center flex flex-col items-center">
        
        {/* Soft Glass Pill Tag */}
        <div className="glass-pill mb-6 animate-fade-in shadow-lg">
          <span className="glass-pill-dot" />
          <span>HỌC TIẾNG ANH QUA VĂN HÓA &amp; NGHỆ THUẬT VIỆT</span>
        </div>

        {/* Main Editorial Headline */}
        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.12] tracking-tight mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          Thưởng Lãm Văn Hóa &amp;{' '}
          <span className="text-[#F5D280] italic font-normal">
            Bản Sắc Việt
          </span>
        </h1>

        {/* Editorial Subtitle */}
        <p className="font-heading italic text-xl sm:text-2xl md:text-3xl text-[#F7E5C3] mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] font-normal">
          “Tự hào bản sắc – Tiếp thu tự nhiên – Tự do chia sẻ”
        </p>

        {/* Lead Description */}
        <p className="max-w-2xl text-base sm:text-lg text-white/90 leading-relaxed font-normal mb-10 text-balance drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
          Khám phá tiếng Anh học thuật qua Cố đô Huế, Tranh Đông Hồ, Bánh mì Sài Gòn và tà Áo dài truyền thống với{' '}
          <strong className="text-[#FCE5B5] font-semibold">Luyện nghe Shadowing AI</strong>,{' '}
          <strong className="text-[#F5D280] font-semibold">Flashcard Spaced Repetition</strong> và{' '}
          <strong className="text-emerald-300 font-semibold">Không gian Cảm nghĩ an toàn</strong>.
        </p>

        {/* Dual Button Group (Pill Shape from Design.md) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 w-full max-w-lg">
          <button
            onClick={onStartReading}
            className="btn-pill-primary flex-1 min-w-[220px]"
          >
            <BookOpen className="w-4 h-4 text-[#18221E]" />
            <span>Bắt Đầu Học Ngay</span>
            <ArrowRight className="w-4 h-4 text-[#18221E]" />
          </button>

          <button
            onClick={onStartFlashcard}
            className="btn-pill-glass flex-1 min-w-[200px]"
          >
            <Sparkles className="w-4 h-4 text-[#F5D280]" />
            <span>Khám Phá Flashcards</span>
          </button>
        </div>

        {/* 3. Atmospheric Glassmorphism Value Props Bar (ĐÃ BỎ TRÌNH ĐỘ TRÊN BANNER) */}
        <div className="w-full max-w-4xl glass-card p-5 sm:p-7 backdrop-blur-xl border border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
            
            {/* Value Prop 1 */}
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <div className="flex items-center gap-2 text-[#FCE5B5] mb-1">
                <span className="text-xl">🪷</span>
                <span className="font-heading font-bold text-xl sm:text-2xl text-white">Ngữ Cảnh Là Số 1</span>
              </div>
              <span className="text-xs text-white/80 font-normal">
                100% từ vựng gắn liền câu văn gốc trong bài đọc
              </span>
            </div>

            {/* Value Prop 2 */}
            <div className="flex flex-col items-center justify-center p-2 text-center pt-4 sm:pt-2">
              <div className="flex items-center gap-2 text-[#F5D280] mb-1">
                <Volume2 className="w-5 h-5 text-[#F5D280]" />
                <span className="font-heading font-bold text-xl sm:text-2xl text-white">AI Shadowing</span>
              </div>
              <span className="text-xs text-white/80 font-normal">
                Phát âm chuẩn bản xứ theo từng câu bài học
              </span>
            </div>

            {/* Value Prop 3 */}
            <div className="flex flex-col items-center justify-center p-2 text-center pt-4 sm:pt-2">
              <div className="flex items-center gap-2 text-emerald-300 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span className="font-heading font-bold text-xl sm:text-2xl text-white">No-Judgment Zone</span>
              </div>
              <span className="text-xs text-white/80 font-normal">
                Viết cảm nghĩ tự do, không chấm điểm áp lực
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Subtle bottom transition to page base */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0D1C18] to-transparent pointer-events-none" />
    </section>
  );
};
