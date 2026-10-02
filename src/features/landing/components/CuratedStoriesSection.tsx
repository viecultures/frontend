import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  Clock,
  Sparkles,
  ArrowRight,
  Headphones,
  Compass,
  Star
} from 'lucide-react';
import { LESSONS_DATA } from '@/data/discoveryData';

interface CuratedStoriesSectionProps {
  onNavigate?: (view: string) => void;
}

export const CuratedStoriesSection: React.FC<CuratedStoriesSectionProps> = ({ onNavigate }) => {
  const shouldReduceMotion = useReducedMotion();

  // Select 3 showcase articles
  const featuredStories = [
    LESSONS_DATA.find((l) => l.id === 'imperial-hue') || LESSONS_DATA[0],
    LESSONS_DATA.find((l) => l.id === 'trang-an') || LESSONS_DATA[1],
    LESSONS_DATA.find((l) => l.id === 'hoi-an-lanterns') || LESSONS_DATA[2],
  ];

  const handleNavigate = (view: string) => {
    if (onNavigate) onNavigate(view);
    else window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
  };

  return (
    <section className="py-24 px-4 sm:px-8 lg:px-12 bg-surface text-heritage-green relative overflow-hidden vn-pattern-bg">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">

        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
              <span className="uppercase tracking-wider text-[11px] font-extrabold">
                TẠP CHÍ VĂN HÓA SONG NGỮ
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-heritage-green tracking-tight">
              Bài Đọc Tiêu Điểm <span className="italic text-antique-gold font-serif">Mùa Này</span>
            </h2>

            <p className="text-sm sm:text-base text-text-body font-normal leading-relaxed mt-2 max-w-2xl">
              Được biên soạn chuẩn văn phong học thuật bởi các nhà nghiên cứu văn hóa và chuyên gia ngôn ngữ.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleNavigate('discovery')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold text-xs sm:text-sm border border-antique-gold/40 transition-all shadow-sm cursor-pointer focus-ring"
          >
            <Compass className="w-4 h-4 text-antique-gold" />
            <span>Khám Phá Tất Cả 23+ Bài Học</span>
          </button>
        </div>

        {/* ── Asymmetric Magazine Layout Grid (3 Cards) ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredStories.map((story, idx) => (
            <motion.article
              key={story.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group rounded-3xl bg-rice-paper border-2 border-antique-gold/30 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 focus-ring"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-heritage-dark">
                  {story.imageUrl && (
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-heritage-forest/90 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-heritage-dark/90 text-antique-bright border border-antique-gold/40 backdrop-blur-md">
                      {story.categoryVi}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-500/90 text-white shadow-xs">
                      {story.cefrLevel}
                    </span>
                  </div>

                  {/* Bottom Image Overlay Tag */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-warm-ivory font-medium">
                    <span className="flex items-center gap-1.5 text-antique-bright">
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Audio Shadowing</span>
                    </span>

                    <span className="flex items-center gap-1 text-white/80">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{story.readTime}</span>
                    </span>
                  </div>
                </div>

                {/* Article Body Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-heritage-green group-hover:text-antique-gold transition-colors leading-snug">
                    {story.title}
                  </h3>

                  <p className="font-serif italic text-xs sm:text-sm text-text-secondary">
                    {story.vietnameseTitle}
                  </p>

                  <p className="text-xs sm:text-sm text-text-body line-clamp-3 leading-relaxed">
                    {story.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 border-t border-line mt-2">
                <div className="pt-4 flex items-center justify-between text-xs font-bold">
                  <span className="text-mountain-teal flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
                    <span>{story.vocabCount} từ vựng học thuật</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleNavigate('bilingual-reader')}
                    className="inline-flex items-center gap-1.5 text-heritage-green group-hover:text-antique-gold transition-colors focus-ring"
                  >
                    <span>Đọc Song Ngữ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CuratedStoriesSection;
