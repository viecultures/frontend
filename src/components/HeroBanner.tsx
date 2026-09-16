import React from 'react';
import { Sparkles, BookOpen, ArrowRight } from 'lucide-react';
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
    <section id="hero" className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* 1. Full-screen Ambient Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-90 contrast-105 transition-transform duration-1000"
        >
          <source src={bannerVideo} type="video/webm" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>

        {/* Multi-layer Gradient Overlays for High Contrast & Dong Ho Rice Paper Warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EE] via-[#FAF6EE]/70 to-[#FAF6EE]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#FAF6EE]/50 to-[#FAF6EE]/90" />
        
        {/* Subtle folk paper grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#12332b0a_1px,transparent_1px),linear-gradient(to_bottom,#12332b0a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>

      {/* 2. Main Center Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        {/* Cultural Folk Stamp Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[3px] bg-[#F8E9CF] border-2 border-[#12332B] shadow-[3px_3px_0px_#12332B] text-xs sm:text-sm font-bold text-[#12332B] mb-6">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A7368] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A7368]"></span>
          </span>
          <span>🪷 HỘI HỌA DÂN GIAN ĐÔNG HỒ &amp; MỸ THUẬT TRUYỀN THỐNG VIỆT NAM</span>
        </div>

        {/* Hero Title with Folk Woodcut Typography */}
        <h1 className="max-w-4xl font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#12332B] leading-[1.14] tracking-tight mb-6 drop-shadow-sm">
          Thưởng Lãm{' '}
          <span className="text-[#1A7368] underline decoration-[#E58396] decoration-4 underline-offset-8">
            Văn Hóa
          </span>{' '}
          &amp; Tiếp Thu Tiếng Anh Qua{' '}
          <span className="text-[#EAA22E] bg-[#12332B] px-3.5 py-1 rounded-[3px] text-white shadow-[4px_4px_0px_#1A7368] inline-block mt-2 sm:mt-0">
            Hồn Cốt Việt
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-[#351903] leading-relaxed font-medium mb-10 text-balance">
          Chất nền giấy điệp tự nhiên, nét khắc than tre đanh gọn và mảng màu khoáng thô thuần khiết. 
          Học ngôn ngữ tự nhiên qua di sản Việt kết hợp <strong className="text-[#1A7368]">Luyện Shadowing AI</strong> và <strong className="text-[#925E06]">Flashcard Spaced Repetition</strong>.
        </p>

        {/* Action Woodcut Stamp Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14 w-full max-w-lg">
          <button
            onClick={onStartReading}
            className="dongho-btn dongho-btn-primary flex-1 min-w-[210px] px-7 py-4 text-sm sm:text-base font-bold shadow-[4px_4px_0px_#12332B]"
          >
            <BookOpen className="w-5 h-5 text-[#FAF6EE]" />
            <span>Trải Nghiệm Bài Đọc Mẫu</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={onStartFlashcard}
            className="dongho-btn dongho-btn-accent flex-1 min-w-[190px] px-6 py-4 text-sm sm:text-base font-bold shadow-[4px_4px_0px_#12332B]"
          >
            <Sparkles className="w-5 h-5 text-[#12332B]" />
            <span>Luyện Flashcards 3D</span>
          </button>
        </div>

        {/* 4 Flat Natural Pigments Metrics Bar (Đông Hồ Aesthetic) */}
        <div className="w-full max-w-5xl bg-[#F8E9CF] rounded-[4px] p-6 sm:p-8 border-2 border-[#12332B] shadow-[6px_6px_0px_#12332B]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x-2 divide-[#12332B]/20">
            
            {/* Metric 1 */}
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <div className="text-[#1A7368] font-heading font-bold text-3xl sm:text-4xl mb-0.5">
                100% Gốc
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#12332B]">Ngữ Cảnh Là Số 1</span>
              <span className="text-[11px] text-[#4A635D] mt-0.5">Từ vựng luôn gắn câu gốc</span>
            </div>

            {/* Metric 2 */}
            <div className="flex flex-col items-center justify-center p-2 text-center pt-6 md:pt-2">
              <div className="text-[#925E06] font-heading font-bold text-3xl sm:text-4xl mb-0.5">
                AI Shadowing
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#12332B]">Phát Âm Chuẩn Bản Xứ</span>
              <span className="text-[11px] text-[#4A635D] mt-0.5">Luyện tai nghe từng câu</span>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col items-center justify-center p-2 text-center pt-6 md:pt-2">
              <div className="text-[#2A816F] font-heading font-bold text-3xl sm:text-4xl mb-0.5">
                4 Bands
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#12332B]">Chuẩn CEFR A2 - C1</span>
              <span className="text-[11px] text-[#4A635D] mt-0.5">Đa dạng cấp độ bài học</span>
            </div>

            {/* Metric 4 */}
            <div className="flex flex-col items-center justify-center p-2 text-center pt-6 md:pt-2">
              <div className="text-[#9C27B0] font-heading font-bold text-3xl sm:text-4xl mb-0.5">
                No Judgment
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#12332B]">Viết Tự Do An Toàn</span>
              <span className="text-[11px] text-[#4A635D] mt-0.5">Không chấm điểm, không soi lỗi</span>
            </div>

          </div>
        </div>

      </div>

      {/* Decorative Bottom Gradient Fade to Rice Paper */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FAF6EE] to-transparent pointer-events-none" />
    </section>
  );
};
