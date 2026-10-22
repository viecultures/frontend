import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Clock, ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, Headphones, Pause, Play } from 'lucide-react';
import { PATHS, paths } from '@/routes/paths';

const ARTICLES = [
  { id: 'hoi-an-lanterns', category: 'Festivals & daily life', title: 'Một đêm đèn lồng Hội An', englishTitle: 'Hoi An Full-Moon Lantern Festival', image: '/images/landing/hoi-an-lanterns.jpg', readTime: '6 min', description: 'Follow the lanterns along the Hoài River and discover the old town’s story and the people who keep its traditions alive.' },
  { id: 'imperial-hue', category: 'History & heritage', title: 'Huế, những dấu xưa còn lại', englishTitle: 'Imperial Hue Citadel & Court Architecture', image: '/images/landing/hue-citadel.jpg', readTime: '8 min', description: 'Explore tiled roofs, citadel gates, and the cultural stories of Vietnam’s former imperial capital.' },
  { id: 'saigon-banh-mi', category: 'Vietnamese cuisine', title: 'Câu chuyện trong ổ bánh mì', englishTitle: 'The Story of Saigon Banh Mi', image: '/images/landing/banh-mi.jpg', readTime: '5 min', description: 'A familiar street food opens onto a story of cultures meeting and shaping something new.' },
  { id: 'bat-trang-pottery', category: 'Arts & craft villages', title: 'Đất, lửa và gốm Bát Tràng', englishTitle: 'Bat Trang Ceramic Heritage', image: '/images/landing/bat-trang.jpg', readTime: '7 min', description: 'Meet the hands of Bát Tràng’s potters and discover how a craft village passes its memory through every glaze.' },
  { id: 'mu-cang-chai', category: 'Nature & people', title: 'Mùa vàng trên những triền núi', englishTitle: 'Mu Cang Chai Golden Rice Terraces', image: '/images/landing/mu-cang-chai.jpg', readTime: '6 min', description: 'Read about rice terraces and a way of life shaped by the land and seasons of the Northwest.' },
  { id: 'dong-ho-paintings', category: 'Arts & craft villages', title: 'Sắc màu trong tranh Đông Hồ', englishTitle: 'Dong Ho Folk Woodcut Paintings', image: '/images/landing/dong-ho.jpg', readTime: '8 min', description: 'From dó paper to natural pigments, each print offers a glimpse into Vietnamese life.' },
];

interface CoverflowArticlesSectionProps {
  onNavigate?: (view: string) => void;
}

export const CoverflowArticlesSection: React.FC<CoverflowArticlesSectionProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const reducedMotion = useReducedMotion();
  const totalCards = ARTICLES.length;

  useEffect(() => {
    if (!isAutoPlay || isHovered || hasFocus || reducedMotion) return;
    const timer = window.setInterval(() => setCurrentIndex((index) => (index + 1) % totalCards), 3000);
    return () => window.clearInterval(timer);
  }, [isAutoPlay, isHovered, hasFocus, reducedMotion, totalCards]);

  const step = (direction: number) => setCurrentIndex((index) => (index + direction + totalCards) % totalCards);
  const navigate = (view: string) => {
    onNavigate?.(view);
  };

  return (
    <section className="landing-articles landing-section" aria-labelledby="landing-articles-title">
      <div className="landing-container">
        <div className="landing-section-heading">
          <div>
            <span className="landing-eyebrow">01 / STORIES WORTH EXPLORING</span>
            <h2 id="landing-articles-title">Start with something <em>you love.</em></h2>
          </div>
          <button type="button" className="landing-text-link" onClick={() => navigate(PATHS.discovery)}>All stories <ArrowUpRight size={18} aria-hidden="true" /></button>
        </div>
        <p className="landing-section-description">A little curiosity about Vietnam. A new way to learn English every day.</p>
        <div className="landing-coverflow" role="region" aria-label="Bilingual stories"
          onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setHasFocus(true)} onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocus(false);
          }}>
          <div className="landing-coverflow-stage">
          {ARTICLES.map((article, index) => {
            let offset = (index - currentIndex + totalCards) % totalCards;
            if (offset > totalCards / 2) offset -= totalCards;
            const distance = Math.abs(offset);
            const isActive = offset === 0;
            const isHidden = distance > 2;
            const style = {
              transform: 'translateX(' + (offset * (distance === 1 ? 68 : 59)) + '%) scale(' + (isActive ? 1 : distance === 1 ? .85 : .7) + ') rotateY(' + (offset === 0 ? 0 : offset > 0 ? -25 : 25) + 'deg)',
              zIndex: 30 - distance * 10,
              opacity: isHidden ? 0 : isActive ? 1 : distance === 1 ? .85 : .45,
              filter: isActive ? 'none' : 'brightness(' + (distance === 1 ? .93 : .8) + ')',
              pointerEvents: isHidden ? 'none' as const : 'auto' as const,
            };
            return (
            <article key={article.id} className={'landing-article-card landing-coverflow-card' + (isActive ? ' is-active' : '')} style={style} aria-hidden={isHidden} inert={isHidden}>
              <button type="button" className="landing-article-open" onClick={() => {
                if (isActive) navigate(paths.reader({ story: article.id }));
                else setCurrentIndex(index);
              }} aria-label={(isActive ? 'Read story: ' : 'Select story: ') + article.englishTitle}>
                <div className="landing-article-image">
                  <img src={article.image} alt={article.englishTitle} loading="lazy" width={800} height={540} />
                  <span className="landing-article-audio"><Headphones size={14} aria-hidden="true" /> Read & listen</span>
                  <span className="landing-article-arrow"><ArrowUpRight size={22} aria-hidden="true" /></span>
                </div>
                <div className="landing-article-body">
                  <span className="landing-article-category">{article.category}</span>
                  <h3>{article.englishTitle}</h3>
                  <span className="landing-article-english">Vietnamese: {article.title}</span>
                  <p>{article.description}</p>
                  <div className="landing-article-meta"><span><Clock size={14} aria-hidden="true" /> {article.readTime} read</span><span>English · Vietnamese <ArrowRight size={14} aria-hidden="true" /></span></div>
                </div>
              </button>
            </article>
          ); })}
          </div>
          <div className="landing-coverflow-controls">
            <button type="button" className="landing-coverflow-prev" onClick={() => step(-1)} aria-label="Previous story"><ChevronLeft size={21} /></button>
            <div className="landing-coverflow-dots">
              {ARTICLES.map((article, index) => (
                <button key={article.id} type="button" onClick={() => setCurrentIndex(index)} aria-label={'Go to story ' + (index + 1) + ': ' + article.englishTitle} aria-current={index === currentIndex ? 'true' : undefined}><span /></button>
              ))}
            </div>
            <button type="button" className="landing-coverflow-next" onClick={() => step(1)} aria-label="Next story"><ChevronRight size={21} /></button>
            <button type="button" className="landing-coverflow-autoplay" onClick={() => setIsAutoPlay(!isAutoPlay)} disabled={!!reducedMotion} aria-label={isAutoPlay && !reducedMotion ? 'Pause automatic story rotation' : 'Start automatic story rotation'} title={reducedMotion ? 'Automatic rotation is disabled by your reduced motion preference' : undefined}>
              {isAutoPlay && !reducedMotion ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
          <p className="landing-coverflow-status" aria-live={isAutoPlay && !reducedMotion ? 'off' : 'polite'}>0{currentIndex + 1} / 0{totalCards} <span>{ARTICLES[currentIndex].englishTitle}</span></p>
        </div>
      </div>
    </section>
  );
};

export default CoverflowArticlesSection;
