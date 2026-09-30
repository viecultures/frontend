import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowRight, Headphones, BookOpen, Sparkles, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface CoverflowArticle {
  id: string;
  category: string;
  level: string;
  title: string;
  vietnameseTitle: string;
  description: string;
  imageUrl: string;
  readTime: string;
  vocabCount: number;
}

const COVERFLOW_ARTICLES: CoverflowArticle[] = [
  {
    id: 'imperial-hue',
    category: 'Heritage',
    level: 'Level B1',
    title: 'Imperial Hue Citadel Gates',
    vietnameseTitle: 'Kiến Trúc Cung Đình Huế',
    description: 'Explore 19th-century court architecture, ancient gates, and geomancy design.',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    readTime: '8 phút',
    vocabCount: 12,
  },
  {
    id: 'saigon-banh-mi',
    category: 'Cuisine',
    level: 'Level B1',
    title: 'The Story of Saigon Banh Mi',
    vietnameseTitle: 'Hành Trình Bánh Mì Sài Gòn',
    description: 'From French baguette to global culinary icon and street food pride.',
    imageUrl: 'https://images.unsplash.com/photo-1626804475297-41608e074eb1?auto=format&fit=crop&w=800&q=80',
    readTime: '5 phút',
    vocabCount: 8,
  },
  {
    id: 'hoi-an-lanterns',
    category: 'Heritage',
    level: 'Level B1',
    title: 'Hoi An Lantern Festival',
    vietnameseTitle: 'Lễ Hội Đèn Lồng Hội An',
    description: 'Full moon rituals and ancient silk craftsmanship along the Hoai river.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
    readTime: '6 phút',
    vocabCount: 10,
  },
  {
    id: 'bat-trang-pottery',
    category: 'Crafts',
    level: 'Level B2',
    title: 'Bat Trang Ceramic Heritage',
    vietnameseTitle: 'Gốm Sứ Bát Tràng',
    description: '700 years of traditional pottery craftsmanship and clay artistry in Hanoi.',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    readTime: '7 phút',
    vocabCount: 14,
  },
  {
    id: 'mu-cang-chai',
    category: 'Nature',
    level: 'Level B1',
    title: 'Mu Cang Chai Rice Terraces',
    vietnameseTitle: 'Ruộng Bậc Thang Mù Cang Chải',
    description: 'Highland harvest season, golden mountains, and agricultural wisdom.',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    readTime: '6 phút',
    vocabCount: 9,
  },
];

interface CoverflowArticlesSectionProps {
  onNavigate?: (view: string) => void;
}

export const CoverflowArticlesSection: React.FC<CoverflowArticlesSectionProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(2); // Start at active card (index 2: Hoi An)
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const totalCards = COVERFLOW_ARTICLES.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAutoPlay || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards);
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlay, isHovered, totalCards]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handleCardClick = (idx: number) => {
    if (idx === currentIndex) {
      if (onNavigate) {
        onNavigate('bilingual-reader');
      } else {
        window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'bilingual-reader' }));
      }
    } else {
      setCurrentIndex(idx);
    }
  };

  const getCardStyle = (idx: number) => {
    const diff = (idx - currentIndex + totalCards) % totalCards;

    if (diff === 0) {
      // Active center
      return {
        transform: 'translateX(0%) scale(1) rotateY(0deg)',
        zIndex: 30,
        opacity: 1,
        filter: 'none',
      };
    } else if (diff === 1 || diff === -(totalCards - 1)) {
      // Next
      return {
        transform: 'translateX(68%) scale(0.85) rotateY(-25deg)',
        zIndex: 20,
        opacity: 0.85,
        filter: 'brightness(0.9)',
      };
    } else if (diff === 2 || diff === -(totalCards - 2)) {
      // Far Next
      return {
        transform: 'translateX(118%) scale(0.7) rotateY(-40deg)',
        zIndex: 10,
        opacity: 0.45,
        filter: 'brightness(0.75)',
      };
    } else if (diff === totalCards - 1 || diff === -1) {
      // Prev
      return {
        transform: 'translateX(-68%) scale(0.85) rotateY(25deg)',
        zIndex: 20,
        opacity: 0.85,
        filter: 'brightness(0.9)',
      };
    } else {
      // Far Prev
      return {
        transform: 'translateX(-118%) scale(0.7) rotateY(40deg)',
        zIndex: 10,
        opacity: 0.45,
        filter: 'brightness(0.75)',
      };
    }
  };

  return (
    <section
      id="featured-articles"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-b border-line overflow-hidden vn-pattern-bg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto text-center space-y-4 relative">
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
          <span className="uppercase tracking-widest text-[11px] font-extrabold">
            Curated Weekly Selection
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
          Top Featured Articles <span className="italic text-antique-gold font-serif">(3D Coverflow)</span>
        </h2>

        <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto font-normal">
          Auto-advancing every 3 seconds. Click any card to bring it to focus.
        </p>

        {/* 3D Coverflow Carousel Container */}
        <div className="relative max-w-5xl mx-auto h-[460px] sm:h-[500px] flex items-center justify-center my-8 [perspective:1200px]">
          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-40 p-3 rounded-full bg-white/90 hover:bg-white text-heritage-forest shadow-xl border border-line hover:border-antique-gold transition-all cursor-pointer focus-ring"
            aria-label="Bài trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 p-3 rounded-full bg-white/90 hover:bg-white text-heritage-forest shadow-xl border border-line hover:border-antique-gold transition-all cursor-pointer focus-ring"
            aria-label="Bài kế tiếp"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            {COVERFLOW_ARTICLES.map((article, idx) => {
              const isActive = idx === currentIndex;
              const style = getCardStyle(idx);

              return (
                <div
                  key={article.id}
                  onClick={() => handleCardClick(idx)}
                  style={style}
                  className={`absolute w-[300px] sm:w-[420px] h-[400px] sm:h-[440px] bg-white rounded-2xl border-2 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl overflow-hidden cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-heritage-green ring-4 ring-antique-gold/20'
                      : 'border-border-dark'
                  }`}
                >
                  {/* Article Image Header */}
                  <div className="relative h-[220px] sm:h-[250px] w-full bg-heritage-dark overflow-hidden shrink-0">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                    {/* Category & Level Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/95 text-heritage-forest shadow-md backdrop-blur-md">
                        {article.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-heritage-green text-warm-ivory shadow-md">
                        {article.level}
                      </span>
                    </div>

                    {/* Bottom Metadata in Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-warm-ivory font-medium">
                      <span className="flex items-center gap-1.5 text-antique-bright">
                        <Headphones className="w-3.5 h-3.5" />
                        <span>AI Shadowing</span>
                      </span>
                      <span className="flex items-center gap-1 text-warm-ivory/80">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Article Card Body */}
                  <div className="p-5 text-left flex-1 flex flex-col justify-between bg-white">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-mountain-teal block">
                        {article.category} • {article.level} • {article.vocabCount} Collocations
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-text-main leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-muted line-clamp-2 leading-relaxed font-normal">
                        {article.description}
                      </p>
                    </div>

                    {/* Card Action Link */}
                    {isActive && (
                      <div className="pt-2.5 border-t border-line flex items-center justify-between text-xs font-bold text-heritage-green">
                        <span className="text-antique-gold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Đang chọn bài đọc</span>
                        </span>
                        <span className="flex items-center gap-1 text-heritage-green hover:text-mountain-teal">
                          <span>Đọc Song Ngữ</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coverflow Navigation Controls (Dots & Auto-Play Toggle) */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-2.5">
            {COVERFLOW_ARTICLES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 transition-all duration-300 rounded-full cursor-pointer focus-ring ${
                  idx === currentIndex
                    ? 'w-8 bg-heritage-green'
                    : 'w-2.5 bg-line hover:bg-text-muted'
                }`}
                aria-label={`Chuyển đến bài viết ${idx + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="p-1.5 rounded-lg border border-line text-text-muted hover:text-heritage-green hover:bg-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title={isAutoPlay ? 'Tạm dừng tự động chạy' : 'Tiếp tục tự động chạy'}
          >
            {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoverflowArticlesSection;
