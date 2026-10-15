import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Clock, ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight, Headphones, Pause, Play } from 'lucide-react';

const ARTICLES = [
  { id: 'hoi-an-lanterns', category: 'Lễ hội & đời sống', title: 'Một đêm đèn lồng Hội An', englishTitle: 'Hoi An Full-Moon Lantern Festival', image: '/images/landing/hoi-an-lanterns.jpg', readTime: '6 phút', description: 'Theo ánh đèn trên sông Hoài, tìm lại câu chuyện của phố cổ và những người giữ nghề.' },
  { id: 'imperial-hue', category: 'Lịch sử & di sản', title: 'Huế, những dấu xưa còn lại', englishTitle: 'Imperial Hue Citadel & Court Architecture', image: '/images/landing/hue-citadel.jpg', readTime: '8 phút', description: 'Đi qua những mái ngói, cổng thành và câu chuyện văn hóa của vùng đất cố đô.' },
  { id: 'saigon-banh-mi', category: 'Ẩm thực Việt', title: 'Câu chuyện trong ổ bánh mì', englishTitle: 'The Story of Saigon Banh Mi', image: '/images/landing/banh-mi.jpg', readTime: '5 phút', description: 'Một món ăn quen thuộc, một hành trình giao thoa thú vị giữa những nền văn hóa.' },
  { id: 'bat-trang-pottery', category: 'Nghệ thuật & làng nghề', title: 'Đất, lửa và gốm Bát Tràng', englishTitle: 'Bat Trang Ceramic Heritage', image: '/images/landing/bat-trang.jpg', readTime: '7 phút', description: 'Khám phá những bàn tay người thợ và cách một làng nghề trao truyền ký ức qua từng lớp men.' },
  { id: 'mu-cang-chai', category: 'Thiên nhiên & con người', title: 'Mùa vàng trên những triền núi', englishTitle: 'Mu Cang Chai Golden Rice Terraces', image: '/images/landing/mu-cang-chai.jpg', readTime: '6 phút', description: 'Đọc về ruộng bậc thang và nhịp sống gắn với đất trời của vùng cao Tây Bắc.' },
  { id: 'dong-ho-paintings', category: 'Nghệ thuật & làng nghề', title: 'Sắc màu trong tranh Đông Hồ', englishTitle: 'Dong Ho Folk Woodcut Paintings', image: '/images/landing/dong-ho.jpg', readTime: '8 phút', description: 'Từ giấy điệp đến màu sắc tự nhiên, mỗi bức tranh mở ra một lát cắt đời sống Việt.' },
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
    if (onNavigate) onNavigate(view);
    else window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
  };

  return (
    <section className="landing-articles landing-section" aria-labelledby="landing-articles-title">
      <div className="landing-container">
        <div className="landing-section-heading">
          <div>
            <span className="landing-eyebrow">01 / NHỮNG CÂU CHUYỆN ĐÁNG ĐỌC</span>
            <h2 id="landing-articles-title">Bắt đầu từ một điều <em>bạn thích.</em></h2>
          </div>
          <button type="button" className="landing-text-link" onClick={() => navigate('discovery')}>Tất cả bài đọc <ArrowUpRight size={18} aria-hidden="true" /></button>
        </div>
        <p className="landing-section-description">Một chút tò mò về Việt Nam. Một cách mới để học tiếng Anh mỗi ngày.</p>
        <div className="landing-coverflow" role="region" aria-roledescription="carousel" aria-label="Bài đọc song ngữ — slider 3D"
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
                if (isActive) navigate('/bilingual-reader?story=' + article.id);
                else setCurrentIndex(index);
              }} aria-label={(isActive ? 'Đọc bài: ' : 'Chọn bài: ') + article.title}>
                <div className="landing-article-image">
                  <img src={article.image} alt={article.title} loading="lazy" width={800} height={540} />
                  <span className="landing-article-audio"><Headphones size={14} aria-hidden="true" /> Đọc & nghe</span>
                  <span className="landing-article-arrow"><ArrowUpRight size={22} aria-hidden="true" /></span>
                </div>
                <div className="landing-article-body">
                  <span className="landing-article-category">{article.category}</span>
                  <h3>{article.title}</h3>
                  <span className="landing-article-english">{article.englishTitle}</span>
                  <p>{article.description}</p>
                  <div className="landing-article-meta"><span><Clock size={14} aria-hidden="true" /> {article.readTime} đọc</span><span>Song ngữ EN / VI <ArrowRight size={14} aria-hidden="true" /></span></div>
                </div>
              </button>
            </article>
          ); })}
          </div>
          <div className="landing-coverflow-controls">
            <button type="button" className="landing-coverflow-prev" onClick={() => step(-1)} aria-label="Bài trước"><ChevronLeft size={21} /></button>
            <div className="landing-coverflow-dots">
              {ARTICLES.map((article, index) => (
                <button key={article.id} type="button" onClick={() => setCurrentIndex(index)} aria-label={'Chuyển đến bài viết ' + (index + 1) + ': ' + article.title} aria-current={index === currentIndex ? 'true' : undefined}><span /></button>
              ))}
            </div>
            <button type="button" className="landing-coverflow-next" onClick={() => step(1)} aria-label="Bài kế tiếp"><ChevronRight size={21} /></button>
            <button type="button" className="landing-coverflow-autoplay" onClick={() => setIsAutoPlay(!isAutoPlay)} disabled={!!reducedMotion} aria-label={isAutoPlay && !reducedMotion ? 'Tạm dừng tự động chuyển bài' : 'Bật tự động chuyển bài'} title={reducedMotion ? 'Đã tắt chuyển tự động theo cài đặt giảm chuyển động' : undefined}>
              {isAutoPlay && !reducedMotion ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
          <p className="landing-coverflow-status" aria-live={isAutoPlay && !reducedMotion ? 'off' : 'polite'}>0{currentIndex + 1} / 0{totalCards} <span>{ARTICLES[currentIndex].title}</span></p>
        </div>
      </div>
    </section>
  );
};

export default CoverflowArticlesSection;
