import React from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { HERO_ASSETS } from '../assets';

interface HeroBannerProps {
  onStartReading: () => void;
  onStartFlashcard: () => void;
  onOpenSpecs: () => void;
  onScrollToExplore: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartReading,
  onStartFlashcard,
  onScrollToExplore,
}) => {
  return (
    <section id="hero" className="relative w-full bg-[#FBF7EE] border-b border-[#E8DFCB] overflow-hidden">
      
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFE3EA]/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#F6EEDC] rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* CỘT TRÁI: Hero Content (from design.md) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className="glass-pill shadow-sm">
              <span className="glass-pill-dot" />
              <span>NỀN TẢNG HỌC TIẾNG ANH QUA DI SẢN VIỆT</span>
            </div>

            {/* Brand Title (H1) */}
            <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-[#1E4B43] leading-[1.08] tracking-tight">
              VieCultures
            </h1>

            {/* Tagline */}
            <p className="font-heading text-2xl sm:text-3xl text-[#2C2523] font-semibold tracking-tight">
              Gom từng từ nhỏ, hiểu một Việt Nam lớn.
            </p>

            {/* Sub-tagline */}
            <p className="text-base sm:text-lg text-[#6B635B] font-normal leading-relaxed max-w-xl">
              Học tiếng Anh qua văn hóa Việt Nam – Tiếp thu từ vựng học thuật tự nhiên qua nếp sống, truyền thuyết, ẩm thực và danh lam cổ tích ba miền.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScrollToExplore}
                className="btn-pill-primary px-8 py-3.5 text-sm font-semibold flex items-center gap-2 shadow-md"
              >
                <span>Bắt đầu khám phá</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onStartReading}
                className="btn-pill-glass px-6 py-3.5 text-sm font-semibold flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#1E4B43]" />
                <span>Đọc thử song ngữ</span>
              </button>
            </div>

            {/* Widget Discover (Khám phá nhanh sổ từ vựng) */}
            <div 
              onClick={onStartFlashcard}
              className="inline-flex items-center gap-3.5 px-4 py-3 bg-[#FDFBF7] border border-[#E8DFCB] rounded-[14px] shadow-[0_4px_16px_rgba(30,75,67,0.06)] hover:border-[#D9B76A] hover:shadow-md transition-all cursor-pointer group"
              title="Mở bộ Flashcard từ vựng văn hóa"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F6EEDC] border border-[#E8DFCB] flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                <span>📖</span>
              </div>
              <div className="text-left">
                <span className="block text-[11px] uppercase tracking-wider text-[#6B635B] font-semibold">
                  Discover
                </span>
                <strong className="block text-sm text-[#1E4B43] font-bold">
                  Khám phá sổ từ vựng &rarr;
                </strong>
              </div>
            </div>

          </div>

          {/* CỘT PHẢI: Hero Visual & Trích Dẫn Thi Pháp (from design.md) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Trích Dẫn Nghệ Thuật (Decorative Quote) */}
            <div className="w-full text-center lg:text-right mb-[-12px] z-20 pr-4">
              <span className="font-decorative text-2xl sm:text-3xl text-[#D9B76A] font-bold drop-shadow-sm select-none">
                “Small words, wonderful worlds”
              </span>
            </div>

            {/* Khung Tranh Minh Họa Chính (Hero Visual Frame) */}
            <div className="w-full max-w-md aspect-[4/3] rounded-[20px] overflow-hidden border-2 border-[#E8DFCB] bg-[#FDFBF7] shadow-xl relative group">
              <img
                src={HERO_ASSETS.illustration}
                alt="Minh họa người phụ nữ Việt Nam và hoa sen"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Bottom Visual Gradient Overlay & Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E4B43]/85 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
                  <span>Di sản &amp; Văn hóa Việt</span>
                </div>
                <span className="bg-black/35 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/20 text-[11px]">
                  Tà Áo Dài &amp; Sen Hồng
                </span>
              </div>
            </div>

            {/* Ghi chú thông tin về asset */}
            <div className="mt-3 text-center">
              <span className="text-[11px] text-[#6B635B] italic">
                Cảm hứng nghệ thuật: Phụ nữ Việt Nam, tà áo dài &amp; quốc hoa sen
              </span>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
