import React from 'react';
import { Sparkles, BookOpen, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import lotusBannerVideo from '../assets/Lotus_leaves_swaying_in_breeze_20260916204003.webm';

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
      {/* Background Video with subtle overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-75 contrast-110 transition-transform duration-1000"
        >
          <source src={lotusBannerVideo} type="video/webm" />
          Trình duyệt của bạn không hỗ trợ video tag.
        </video>

        {/* Multi-layer Gradient Overlays for High Contrast & Cultural Aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/75 to-[#0b0f19]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-transparent to-[#0b0f19]/90" />
        
        {/* Subtle grid pattern for modern EdTech feeling */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center flex flex-col items-center">
        
        {/* Cultural Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-emerald border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-8 shadow-xl shadow-emerald-950/40">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>🪷 Nền Tảng EdTech Tiên Phong • Học Tiếng Anh Qua Bản Sắc Văn Hóa Việt</span>
        </div>

        {/* Main Headline */}
        <h1 className="max-w-4xl font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.15] mb-6 drop-shadow-sm">
          Trở Thành{' '}
          <span className="bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
            "Sứ Giả Văn Hóa"
          </span>{' '}
          Với Tiếng Anh Học Thuật
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal mb-10 text-balance">
          Học ngôn ngữ tự nhiên trong ngữ cảnh di sản Việt Nam kết hợp <strong className="text-emerald-300 font-medium">Luyện nghe Shadowing AI</strong>,{' '}
          <strong className="text-amber-300 font-medium">Flashcards Spaced Repetition</strong> và <strong className="text-teal-300 font-medium">Cảm nghĩ không phán xét</strong>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16 w-full max-w-lg">
          <button
            onClick={onStartReading}
            className="flex-1 min-w-[200px] px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
          >
            <BookOpen className="w-5 h-5 text-slate-950" />
            <span>Trải nghiệm bài đọc mẫu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onStartFlashcard}
            className="flex-1 min-w-[190px] px-6 py-4 rounded-2xl glass-panel hover:bg-slate-800/80 text-amber-300 hover:text-amber-200 font-bold text-base border border-amber-500/40 hover:border-amber-400 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Ôn Flashcards 3D</span>
          </button>
        </div>

        {/* Value Props & Metrics Glass Bar */}
        <div className="w-full max-w-5xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl backdrop-blur-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
            {/* Metric 1 */}
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-2xl sm:text-3xl mb-1">
                <span>100%</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Ngữ cảnh là số 1</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Từ vựng luôn gắn câu gốc</span>
            </div>

            {/* Metric 2 */}
            <div className="flex flex-col items-center justify-center p-2 text-center pt-6 md:pt-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-2xl sm:text-3xl mb-1">
                <Volume2 className="w-6 h-6 text-amber-400" />
                <span>AI Shadowing</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Âm thanh chuẩn bản xứ</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Luyện phát âm từng câu</span>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col items-center justify-center p-2 text-center pt-6 md:pt-2">
              <div className="flex items-center gap-1.5 text-teal-400 font-bold text-2xl sm:text-3xl mb-1">
                <span>4 Bands</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Chuẩn CEFR A2 - C1</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Đa dạng cấp độ bài đọc</span>
            </div>

            {/* Metric 4 */}
            <div className="flex flex-col items-center justify-center p-2 text-center pt-6 md:pt-2">
              <div className="flex items-center gap-1.5 text-pink-400 font-bold text-2xl sm:text-3xl mb-1">
                <ShieldCheck className="w-6 h-6 text-pink-400" />
                <span>No Judgment</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Viết tự do an toàn</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Không chấm điểm, không soi lỗi</span>
            </div>

          </div>
        </div>

      </div>

      {/* Decorative Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0b0f19] to-transparent pointer-events-none" />
    </section>
  );
};
