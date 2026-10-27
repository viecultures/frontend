import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import bannerVideo from '@/assets/hero-banner-v3.mp4';
import { PATHS } from '@/routes/paths';

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
    if (reducedMotion) {
      video.pause();
    } else {
      video.play().catch(() => setIsPlaying(false));
    }
  }, [reducedMotion]);

  const scrollToStories = () => {
    const target = document.getElementById('featured-articles');
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    } else {
      onNavigate?.(PATHS.discovery);
    }
  };

  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero-stage landing-hero-stage-fullscreen">
        {/* Fullscreen Cinematic Background Video */}
        <video
          className="landing-hero-bg-video"
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          aria-label="Atmospheric cultural video of Vietnamese heritage"
          tabIndex={-1}
        >
          <source src={bannerVideo} type="video/mp4" />
        </video>

        {/* Transparent & Asymmetric Cinematic Scrim: Kept clear on the right side */}
        <div className="landing-hero-cinematic-scrim" aria-hidden="true" />

        {/* Foreground Content Layout: Left only, leaving the video and woman in áo dài completely clear */}
        <div className="landing-container landing-hero-layout-unobstructed">
          <div className="landing-hero-copy">

            <h1 id="landing-title" className="landing-hero-headline">
              Learn English, <span className="landing-hero-accent">Live Culture</span>
            </h1>

            <p className="landing-hero-subtitle">
              Discover Vietnam through authentic stories, bilingual reading, and immersive listening
            </p>

            <div className="landing-hero-actions">
              <button
                type="button"
                className="landing-button landing-button-primary focus-ring"
                onClick={() => onNavigate?.(PATHS.discovery)}
              >
                Start Learning <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="landing-button landing-button-secondary focus-ring"
                onClick={scrollToStories}
              >
                Explore Stories <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Control Toggle */}
        <button
          type="button"
          className="landing-video-toggle focus-ring"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.paused) {
              video.play().catch(() => setIsPlaying(false));
            } else {
              video.pause();
            }
          }}
          aria-label={isPlaying ? 'Pause hero video' : 'Play hero video'}
          title={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
};

export default LandingHeroBanner;
