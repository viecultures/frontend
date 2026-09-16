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
    <section id="hero" className="relative w-full py-12 lg:py-16 overflow-hidden bg-[#FAF6EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Left Headline & Right Video Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-16">
          
          {/* Left Column: Heading & Cultural Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Stamp Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-[#F8E9CF] border-2 border-[#12332B] shadow-[2px_2px_0px_#12332B] text-xs font-bold text-[#12332B]">
              <span className="text-sm">🪷</span>
              <span>PHONG CÁCH HỘI HỌA DÂN GIAN ĐÔNG HỒ & MỸ THUẬT TRUYỀN THỐNG</span>
            </div>

            {/* Hero Title with Folk Woodcut Typography */}
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-[#12332B] leading-[1.12] tracking-tight">
              Thưởng Lãm <span className="text-[#1A7368] underline decoration-[#E58396] decoration-4 underline-offset-8">Văn Hóa</span> &amp; Tiếp Thu Tiếng Anh Qua{' '}
              <span className="text-[#EAA22E] bg-[#12332B] px-3 py-1 rounded-[3px] text-white shadow-[3px_3px_0px_#1A7368] inline-block mt-2 sm:mt-0">
                Hồn Cốt Việt
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#4A635D] leading-relaxed font-normal max-w-2xl">
              Nền giấy điệp tự nhiên, nét khắc than tre đanh gọn và mảng màu khoáng thô thuần khiết. 
              Học tiếng Anh học thuật tự nhiên qua Cố đô Huế, Tranh Đông Hồ, Bánh mì Sài Gòn với 
              <strong className="text-[#1A7368] font-semibold"> Luyện Shadowing AI</strong> và 
              <strong className="text-[#925E06] font-semibold"> Flashcard Spaced Repetition</strong>.
            </p>

            {/* Action Woodcut Stamp Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartReading}
                className="dongho-btn dongho-btn-primary px-7 py-4 text-sm sm:text-base font-bold shadow-[4px_4px_0px_#12332B]"
              >
                <BookOpen className="w-5 h-5 text-[#FAF6EE]" />
                <span>Trải Nghiệm Bài Đọc Mẫu</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onStartFlashcard}
                className="dongho-btn dongho-btn-accent px-6 py-4 text-sm sm:text-base font-bold shadow-[4px_4px_0px_#12332B]"
              >
                <Sparkles className="w-5 h-5 text-[#12332B]" />
                <span>Luyện Flashcards 3D</span>
              </button>
            </div>

          </div>

          {/* Right Column: Woodblock Video Frame (Using banner.webm) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[4px] border-2 border-[#12332B] shadow-[8px_8px_0px_#12332B] overflow-hidden bg-[#FAF6EE] group">
              
              {/* Video Asset */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                >
                  <source src={bannerVideo} type="video/webm" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
                
                {/* Subtle warm rice paper overlay filter */}
                <div className="absolute inset-0 bg-[#FAF6EE]/15 pointer-events-none mix-blend-multiply" />
              </div>

              {/* Bottom Stamp Caption Bar */}
              <div className="p-4 bg-[#F8E9CF] border-t-2 border-[#12332B] flex items-center justify-between text-xs font-bold text-[#12332B]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1A7368] inline-block animate-pulse" />
                  <span>Cảnh sắc Sen &amp; Hồ Gươm (Mộc Bản Động)</span>
                </div>
                <span className="dongho-tag bg-[#E58396] text-[#12332B] text-[10px]">
                  Tự Nhiên 100%
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* 4 Flat Natural Pigments Metrics Bar (Đông Hồ Aesthetic) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Box 1: Primary - Sắc Tà Áo Dài */}
          <div className="p-5 rounded-[4px] bg-[#FAF6EE] border-2 border-[#12332B] shadow-[4px_4px_0px_#12332B] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A7368]">Nguyên Tắc #1</span>
              <span className="dongho-tag bg-[#1A7368] text-white text-[10px]">100% Gốc</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-[#12332B] mb-1">
                Ngữ Cảnh Là Số 1
              </h3>
              <p className="text-xs text-[#4A635D] leading-relaxed">
                Từ vựng học thuật luôn gắn kèm câu văn bản xứ trong bài đọc di sản.
              </p>
            </div>
          </div>

          {/* Box 2: Accent - Sắc Vàng Hoa Hòe */}
          <div className="p-5 rounded-[4px] bg-[#FAF6EE] border-2 border-[#12332B] shadow-[4px_4px_0px_#12332B] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#925E06]">Âm Thanh AI</span>
              <span className="dongho-tag bg-[#EAA22E] text-[#12332B] text-[10px]">Shadowing</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-[#12332B] mb-1">
                Luyện Nghe Từng Câu
              </h3>
              <p className="text-xs text-[#4A635D] leading-relaxed">
                Phát âm chuẩn bản xứ theo từng câu, chỉnh tốc độ 0.75x, 1.0x, 1.25x.
              </p>
            </div>
          </div>

          {/* Box 3: Heritage Green - Sắc Di Sản */}
          <div className="p-5 rounded-[4px] bg-[#FAF6EE] border-2 border-[#12332B] shadow-[4px_4px_0px_#12332B] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#15503C]">Chuẩn CEFR</span>
              <span className="dongho-tag bg-[#2A816F] text-white text-[10px]">A2 - C1</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-[#12332B] mb-1">
                Đa Dạng Trình Độ
              </h3>
              <p className="text-xs text-[#4A635D] leading-relaxed">
                Một chủ đề được biên soạn ở nhiều cấp độ, phù hợp mọi người học.
              </p>
            </div>
          </div>

          {/* Box 4: Secondary - Sắc Sen Hồng */}
          <div className="p-5 rounded-[4px] bg-[#FAF6EE] border-2 border-[#12332B] shadow-[4px_4px_0px_#12332B] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9C27B0]">Tự Do Viết</span>
              <span className="dongho-tag bg-[#E58396] text-[#12332B] text-[10px]">No-Judgment</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-2xl text-[#12332B] mb-1">
                Không Gian An Toàn
              </h3>
              <p className="text-xs text-[#4A635D] leading-relaxed">
                Tuyệt đối không chấm điểm hay soi lỗi ngữ pháp để bạn tự tin chia sẻ.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
