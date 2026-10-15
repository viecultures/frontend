import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Headphones, Bookmark, RotateCcw, Pause, Play, Check } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import bannerVideo from '@/assets/hero-banner-v3.mp4';

interface LandingHeroBannerProps {
  onNavigate?: (view: string) => void;
  onScrollToDemo?: () => void;
}

export const LandingHeroBanner: React.FC<LandingHeroBannerProps> = ({ onNavigate, onScrollToDemo }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) video.pause();
    else video.play().catch(() => setIsPlaying(false));
  }, [reducedMotion]);

  const startLearning = () => {
    if (onNavigate) onNavigate('discovery');
    else window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'discovery' }));
  };

  const previewFlashcard = () => {
    if (onScrollToDemo) onScrollToDemo();
    else document.getElementById('flashcard-demo')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero-stage">
        <video className="landing-hero-video" ref={videoRef} loop muted playsInline preload="metadata" poster="/images/landing/hoi-an-lanterns.jpg" onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} aria-hidden="true" tabIndex={-1}>
          <source src={bannerVideo} type="video/mp4" />
        </video>
        <div className="landing-hero-scrim" aria-hidden="true" />
        <div className="landing-container landing-hero-content">
          <div className="landing-hero-copy">
            <span className="landing-eyebrow"><span className="landing-eyebrow-line" /> TIẾNG ANH QUA VĂN HÓA VIỆT</span>
            <h1 id="landing-title">Một ngôn ngữ mới.<br />Một Việt Nam<br /><em>gần gũi hơn.</em></h1>
            <p>Khám phá văn hóa Việt qua bài đọc song ngữ. Đọc để hiểu, nghe để cảm, ôn để nhớ.</p>
            <div className="landing-hero-actions">
              <button type="button" className="landing-button landing-button-primary" onClick={startLearning}>Khám phá bài đọc <ArrowUpRight size={18} aria-hidden="true" /></button>
              <button type="button" className="landing-text-link" onClick={previewFlashcard}>Thử flashcard <ArrowRight size={17} aria-hidden="true" /></button>
            </div>
            <div className="landing-hero-notes">
              <span><Check size={15} aria-hidden="true" /> Miễn phí · Học theo nhịp của bạn</span>
            </div>
          </div>
        </div>
        <button type="button" className="landing-video-toggle" onClick={() => {
          const video = videoRef.current;
          if (!video) return;
          if (video.paused) video.play().catch(() => setIsPlaying(false));
          else video.pause();
        }} aria-label={isPlaying ? 'Tạm dừng video' : 'Phát video'}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
      <div className="landing-container landing-learning-strip" aria-label="Hành trình học">
        {[
          { icon: BookOpen, title: 'Đọc song ngữ' },
          { icon: Headphones, title: 'Nghe & khám phá' },
          { icon: Bookmark, title: 'Lưu từ yêu thích' },
          { icon: RotateCcw, title: 'Ôn tập mỗi ngày' },
        ].map(({ icon: Icon, title }, index) => (
          <div key={title} className="landing-learning-step"><Icon size={21} strokeWidth={1.5} aria-hidden="true" /><strong>{title}</strong><span className="landing-step-number">0{index + 1}</span></div>
        ))}
      </div>
    </section>
  );
};

export default LandingHeroBanner;
