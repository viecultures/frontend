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
  highlightCollocation: string;
}

const COVERFLOW_ARTICLES: CoverflowArticle[] = [
  {
    id: 'imperial-hue',
    category: 'Di sản UNESCO',
    level: 'Level 2',
    title: 'Imperial Hue Citadel & Court Architecture',
    vietnameseTitle: 'Kiến Trúc Cung Đình & Phong Thủy Triều Nguyễn',
    description: 'Explore 19th-century royal bastions, sacred geomancy design, and dynastic resilience along the Perfume River.',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    readTime: '8 phút',
    vocabCount: 16,
    highlightCollocation: 'geomantic alignment, dynastic bastions',
  },
  {
    id: 'saigon-banh-mi',
    category: 'Ẩm thực & Phong vị',
    level: 'Level 2',
    title: 'The Story of Saigon Banh Mi',
    vietnameseTitle: 'Hành Trình Bánh Mì Sài Gòn & Di Sản Ẩm Thực',
    description: 'From colonial French baguette to global culinary icon: the crispy crust, aromatic pâté, and Vietnamese herb harmony.',
    imageUrl: 'https://images.unsplash.com/photo-1626804475297-41608e074eb1?auto=format&fit=crop&w=800&q=80',
    readTime: '5 phút',
    vocabCount: 12,
    highlightCollocation: 'culinary syncretism, aromatic herbs',
  },
  {
    id: 'hoi-an-lanterns',
    category: 'Di sản UNESCO',
    level: 'Level 2',
    title: 'Hoi An Full-Moon Lantern Festival',
    vietnameseTitle: 'Lễ Hội Đèn Lồng & Đêm Rằm Sông Hoài',
    description: 'Ancient merchant port traditions, ancestral silk weaving, and vibrant lantern processions reflecting on peaceful waters.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80',
    readTime: '6 phút',
    vocabCount: 14,
    highlightCollocation: 'ancestral craftsmanship, silk lanterns',
  },
  {
    id: 'bat-trang-pottery',
    category: 'Nghệ thuật Làng nghề',
    level: 'Level 2',
    title: 'Bat Trang 700-Year Ceramic Heritage',
    vietnameseTitle: 'Gốm Sứ Bát Tràng & Tinh Hoa Men Rạn Cổ',
    description: 'Seven centuries of master pottery kilns, distinctive crackle glaze techniques, and artisanal clay mastery along the Red River.',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    readTime: '7 phút',
    vocabCount: 18,
    highlightCollocation: 'artisanal lineage, crackle glaze',
  },
  {
    id: 'mu-cang-chai',
    category: 'Phong cảnh & Lễ hội',
    level: 'Level 2',
    title: 'Mu Cang Chai Golden Rice Terraces',
    vietnameseTitle: 'Ruộng Bậc Thang Mù Cang Chải Vàng Óng',
    description: 'Highland ethnic H’Mong agricultural ingenuity, cascading golden slopes, and seasonal harvest rituals in the Northwest.',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    readTime: '6 phút',
    vocabCount: 12,
    highlightCollocation: 'indigenous agriculture, cascading terraces',
  },
  {
    id: 'dong-ho-paintings',
    category: 'Nghệ thuật Làng nghề',
    level: 'Level 2',
    title: 'Dong Ho Folk Woodcut Paintings',
    vietnameseTitle: 'Tranh Khắc Gỗ Đông Hồ & Giấy Điệp Dân Gian',
    description: 'Folk woodcut printing on scallop-shell coated Do paper, conveying profound wishes of prosperity, harmony, and filial piety.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    readTime: '8 phút',
    vocabCount: 15,
    highlightCollocation: 'scallop-shell paper, woodcut printing',
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
      className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-surface border-t border-b border-line overflow-hidden vn-pattern-bg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto text-center space-y-5 relative">
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
          <span className="uppercase tracking-widest text-[11px] font-extrabold">
            BÀI VIẾT DI SẢN CHỌN LỌC
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
          Kho Bài Đọc Song Ngữ Tiêu Biểu
        </h2>

        <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-normal leading-relaxed">
          Khám phá các trích đoạn di sản và ẩm thực đặc sắc được biên soạn đối chiếu song ngữ chuẩn học thuật quốc tế.
        </p>

        {/* 3D Coverflow Carousel Container with Generous Height & Stage Glow */}
        <div className="relative max-w-5xl mx-auto h-[500px] sm:h-[550px] lg:h-[580px] flex items-center justify-center my-8 sm:my-10 [perspective:1200px]">
          {/* Subtle Atmospheric Stage Spotlight */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-antique-gold/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Previous Arrow Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1 sm:left-4 lg:left-6 z-40 p-3 sm:p-3.5 rounded-full bg-white/95 hover:bg-white text-heritage-forest shadow-xl border border-line hover:border-antique-gold transition-all cursor-pointer focus-ring"
            aria-label="Bài trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Arrow Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1 sm:right-4 lg:right-6 z-40 p-3 sm:p-3.5 rounded-full bg-white/95 hover:bg-white text-heritage-forest shadow-xl border border-line hover:border-antique-gold transition-all cursor-pointer focus-ring"
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
                  className={`absolute w-[300px] sm:w-[400px] lg:w-[430px] h-[450px] sm:h-[490px] lg:h-[520px] bg-white rounded-3xl border-2 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl overflow-hidden cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'border-heritage-green ring-4 ring-antique-gold/20'
                      : 'border-border-dark'
                  }`}
                >
                  {/* Article Image Header */}
                  <div className="relative h-[190px] sm:h-[220px] w-full bg-heritage-dark overflow-hidden shrink-0">
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

                  {/* Article Card Body with Generous Padding */}
                  <div className="p-5 sm:p-6 text-left flex-1 flex flex-col justify-between bg-white">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-mountain-teal block">
                        {article.category} • {article.level} • {article.vocabCount} Cụm từ vựng
                      </span>
                      <div>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-text-main leading-snug">
                          {article.vietnameseTitle}
                        </h3>
                        <p className="text-xs font-serif italic text-heritage-green line-clamp-1 mt-0.5">
                          {article.title}
                        </p>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed font-normal">
                        {article.description}
                      </p>
                      <div className="pt-1">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-rice-paper text-[10px] font-mono text-mountain-teal border border-line">
                          ✦ {article.highlightCollocation}
                        </span>
                      </div>
                    </div>

                    {/* Card Action Link */}
                    {isActive && (
                      <div className="pt-3.5 border-t border-line flex items-center justify-between text-xs font-bold text-heritage-green mt-2">
                        <span className="text-antique-gold flex items-center gap-1.5">
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
