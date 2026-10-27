import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Clock, ArrowRight, Headphones } from 'lucide-react';
import { PATHS, paths } from '@/routes/paths';

export interface StoryArticle {
  id: string;
  category: string;
  title: string;
  englishTitle: string;
  image: string;
  readTime: string;
  description: string;
}

const ARTICLES: StoryArticle[] = [
  {
    id: 'hoi-an-lanterns',
    category: 'Festivals & Daily Life',
    title: 'Một đêm đèn lồng Hội An',
    englishTitle: 'Hoi An Full-Moon Lantern Festival',
    image: '/images/landing/hoi-an-lanterns.jpg',
    readTime: '6 min',
    description: 'Follow the lanterns along the Hoài River and discover the old town’s story and the people who keep its traditions alive.',
  },
  {
    id: 'imperial-hue',
    category: 'History & Heritage',
    title: 'Huế, những dấu xưa còn lại',
    englishTitle: 'Imperial Hue Citadel & Court Architecture',
    image: '/images/landing/hue-citadel.jpg',
    readTime: '8 min',
    description: 'Explore tiled roofs, citadel gates, and the cultural stories of Vietnam’s former imperial capital.',
  },
  {
    id: 'saigon-banh-mi',
    category: 'Vietnamese Cuisine',
    title: 'Câu chuyện trong ổ bánh mì',
    englishTitle: 'The Story of Saigon Banh Mi',
    image: '/images/landing/banh-mi.jpg',
    readTime: '5 min',
    description: 'A familiar street food opens onto a story of cultures meeting and shaping something new.',
  },
  {
    id: 'bat-trang-pottery',
    category: 'Arts & Craft Villages',
    title: 'Đất, lửa và gốm Bát Tràng',
    englishTitle: 'Bat Trang Ceramic Heritage',
    image: '/images/landing/bat-trang.jpg',
    readTime: '7 min',
    description: 'Meet the hands of Bát Tràng’s potters and discover how a craft village passes its memory through every glaze.',
  },
  {
    id: 'mu-cang-chai',
    category: 'Nature & People',
    title: 'Mùa vàng trên những triền núi',
    englishTitle: 'Mu Cang Chai Golden Rice Terraces',
    image: '/images/landing/mu-cang-chai.jpg',
    readTime: '6 min',
    description: 'Read about rice terraces and a way of life shaped by the land and seasons of the Northwest.',
  },
  {
    id: 'dong-ho-paintings',
    category: 'Arts & Craft Villages',
    title: 'Sắc màu trong tranh Đông Hồ',
    englishTitle: 'Dong Ho Folk Woodcut Paintings',
    image: '/images/landing/dong-ho.jpg',
    readTime: '8 min',
    description: 'From dó paper to natural pigments, each print offers a glimpse into Vietnamese life.',
  },
];

interface CoverflowArticlesSectionProps {
  onNavigate?: (view: string) => void;
}

export const CoverflowArticlesSection: React.FC<CoverflowArticlesSectionProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const reducedMotion = useReducedMotion();
  const totalCards = ARTICLES.length;

  // Continuous auto-sliding rotation (every 3.5 seconds)
  useEffect(() => {
    if (isHovered || hasFocus || reducedMotion) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [isHovered, hasFocus, reducedMotion, totalCards]);

  const step = (direction: number) => {
    setCurrentIndex((prev) => (prev + direction + totalCards) % totalCards);
  };

  const navigate = (view: string) => {
    onNavigate?.(view);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
  };

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      step(1);
    } else if (diff < -45) {
      step(-1);
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <section
      id="featured-articles"
      className="landing-articles landing-section"
      aria-labelledby="landing-articles-title"
    >
      <div className="landing-container">
        {/* Section Heading */}
        <div className="landing-section-heading">
          <div>
            <h2 id="landing-articles-title">Stories worth exploring</h2>
          </div>
          <button
            type="button"
            className="landing-text-link focus-ring"
            onClick={() => navigate(PATHS.discovery)}
          >
            All stories <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="landing-section-description">
          A living archive of Vietnamese heritage. Read in two languages, follow native audio, and build fluency naturally.
        </p>

        {/* 3D Coverflow Stage with Automatic Slide (Controls completely removed) */}
        <div
          className="landing-coverflow mt-8"
          role="region"
          aria-label="Bilingual heritage stories"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setHasFocus(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHasFocus(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="landing-coverflow-stage">
            {ARTICLES.map((article, index) => {
              let offset = (index - currentIndex + totalCards) % totalCards;
              if (offset > totalCards / 2) offset -= totalCards;
              const distance = Math.abs(offset);
              const isActive = offset === 0;
              const isHidden = distance > 2;

              const style = {
                transform: `translateX(${offset * (distance === 1 ? 68 : 59)}%) scale(${
                  isActive ? 1 : distance === 1 ? 0.85 : 0.7
                }) rotateY(${offset === 0 ? 0 : offset > 0 ? -25 : 25}deg)`,
                zIndex: 30 - distance * 10,
                opacity: isHidden ? 0 : isActive ? 1 : distance === 1 ? 0.88 : 0.45,
                filter: isActive ? 'none' : `brightness(${distance === 1 ? 0.94 : 0.82})`,
                pointerEvents: isHidden ? ('none' as const) : ('auto' as const),
              };

              return (
                <article
                  key={article.id}
                  className={`landing-article-card landing-coverflow-card shadow-xl ${
                    isActive ? 'is-active ring-1 ring-antique-gold/40' : ''
                  }`}
                  style={style}
                  aria-hidden={isHidden}
                  inert={isHidden}
                >
                  <button
                    type="button"
                    className="landing-article-open focus-ring cursor-pointer group"
                    onClick={() => {
                      if (isActive) {
                        navigate(paths.reader({ story: article.id }));
                      } else {
                        setCurrentIndex(index);
                      }
                    }}
                    aria-label={isActive ? `Read story: ${article.englishTitle}` : `Select story: ${article.englishTitle}`}
                  >
                    {/* Story Cover Image */}
                    <div className="landing-article-image">
                      <img
                        src={article.image}
                        alt={`${article.englishTitle} - Vietnamese culture`}
                        loading="lazy"
                        width={800}
                        height={540}
                      />
                      <span className="landing-article-audio">
                        <Headphones size={13} className="text-antique-gold" aria-hidden="true" />
                        <span>Read &amp; listen</span>
                      </span>
                      <span className="landing-article-arrow group-hover:scale-110 transition-transform">
                        <ArrowRight size={20} aria-hidden="true" />
                      </span>
                    </div>

                    {/* Story Content Body */}
                    <div className="landing-article-body">
                      <span className="landing-article-category">{article.category}</span>
                      <h3 className="line-clamp-2">{article.englishTitle}</h3>
                      <span className="landing-article-english">Tiếng Việt: {article.title}</span>
                      <p className="line-clamp-3">{article.description}</p>
                      <div className="landing-article-meta">
                        <span>
                          <Clock size={13} aria-hidden="true" /> {article.readTime} read
                        </span>
                        <span className="font-semibold text-action group-hover:translate-x-0.5 transition-transform">
                          English · Vietnamese <ArrowRight size={13} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverflowArticlesSection;
