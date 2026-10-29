import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Clock, ArrowRight, Headphones } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS, paths } from '@/routes/paths';

export interface StoryArticleConfig {
  id: string;
  itemKey: 'hoi_an' | 'imperial_hue' | 'saigon_banh_mi' | 'bat_trang' | 'mu_cang_chai' | 'dong_ho';
  image: string;
  readTime: string;
}

const ARTICLES_CONFIG: StoryArticleConfig[] = [
  {
    id: 'hoi-an-lanterns',
    itemKey: 'hoi_an',
    image: '/images/landing/hoi-an-lanterns.jpg',
    readTime: '6 min',
  },
  {
    id: 'imperial-hue',
    itemKey: 'imperial_hue',
    image: '/images/landing/hue-citadel.jpg',
    readTime: '8 min',
  },
  {
    id: 'saigon-banh-mi',
    itemKey: 'saigon_banh_mi',
    image: '/images/landing/banh-mi.jpg',
    readTime: '5 min',
  },
  {
    id: 'bat-trang-pottery',
    itemKey: 'bat_trang',
    image: '/images/landing/bat-trang.jpg',
    readTime: '7 min',
  },
  {
    id: 'mu-cang-chai',
    itemKey: 'mu_cang_chai',
    image: '/images/landing/mu-cang-chai.jpg',
    readTime: '6 min',
  },
  {
    id: 'dong-ho-paintings',
    itemKey: 'dong_ho',
    image: '/images/landing/dong-ho.jpg',
    readTime: '8 min',
  },
];

interface CoverflowArticlesSectionProps {
  onNavigate?: (view: string) => void;
}

export const CoverflowArticlesSection: React.FC<CoverflowArticlesSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation('landing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const reducedMotion = useReducedMotion();
  const totalCards = ARTICLES_CONFIG.length;

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
            <h2 id="landing-articles-title">{t('articles.title')}</h2>
          </div>
          <button
            type="button"
            className="landing-text-link focus-ring"
            onClick={() => navigate(PATHS.discovery)}
          >
            {t('articles.all_stories')} <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="landing-section-description">
          {t('articles.subtitle')}
        </p>

        {/* 3D Coverflow Stage with Automatic Slide (Controls completely removed) */}
        <div
          className="landing-coverflow mt-8"
          role="region"
          aria-label={t('articles.aria_region')}
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
            {ARTICLES_CONFIG.map((article, index) => {
              const category = t(`articles.items.${article.itemKey}.category`);
              const title = t(`articles.items.${article.itemKey}.title`);
              const englishTitle = t(`articles.items.${article.itemKey}.englishTitle`);
              const description = t(`articles.items.${article.itemKey}.description`);

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
                    aria-label={isActive ? t('articles.read_aria', { title: englishTitle }) : t('articles.select_aria', { title: englishTitle })}
                  >
                    {/* Story Cover Image */}
                    <div className="landing-article-image">
                      <img
                        src={article.image}
                        alt={`${englishTitle} - Vietnamese culture`}
                        loading="lazy"
                        width={800}
                        height={540}
                      />
                      <span className="landing-article-audio">
                        <Headphones size={13} className="text-antique-gold" aria-hidden="true" />
                        <span>{t('articles.read_listen')}</span>
                      </span>
                      <span className="landing-article-arrow group-hover:scale-110 transition-transform">
                        <ArrowRight size={20} aria-hidden="true" />
                      </span>
                    </div>

                    {/* Story Content Body */}
                    <div className="landing-article-body">
                      <span className="landing-article-category">{category}</span>
                      <h3 className="line-clamp-2">{englishTitle}</h3>
                      <span className="landing-article-english">{t('articles.vietnamese_prefix', { title })}</span>
                      <p className="line-clamp-3">{description}</p>
                      <div className="landing-article-meta">
                        <span>
                          <Clock size={13} aria-hidden="true" /> {article.readTime} {t('articles.read_suffix')}
                        </span>
                        <span className="font-semibold text-action group-hover:translate-x-0.5 transition-transform">
                          {t('articles.bilingual_tag')} <ArrowRight size={13} aria-hidden="true" />
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
