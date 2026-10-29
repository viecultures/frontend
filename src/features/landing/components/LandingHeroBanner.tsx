import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'motion/react';
import bannerVideo from '@/assets/hero-banner-v3.mp4';
import { PATHS } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';

interface LandingHeroBannerProps {
  onNavigate?: (view: string) => void;
  onScrollToDemo?: () => void;
}

export const LandingHeroBanner: React.FC<LandingHeroBannerProps> = ({
  onNavigate,
  onScrollToDemo: _onScrollToDemo,
}) => {
  const { t } = useTranslation(['landing', 'common']);
  const appNavigate = useAppNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNavigate = (path: string) => {
    try {
      if (onNavigate) {
        onNavigate(path);
      } else {
        appNavigate(path);
      }
    } catch (error) {
      console.error('[LandingHeroBanner] Navigation error:', error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
    } else {
      video.play().catch((error: unknown) => {
        console.error('[LandingHeroBanner] Autoplay prevented or failed:', error);
        setIsPlaying(false);
      });
    }
  }, [reducedMotion]);

  const scrollToStories = () => {
    try {
      const target = document.getElementById('featured-articles');
      if (target) {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      } else {
        handleNavigate(PATHS.discovery);
      }
    } catch (error) {
      console.error('[LandingHeroBanner] scrollToStories failed:', error);
    }
  };

  const toggleVideoPlayback = () => {
    try {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        video.play().catch((error: unknown) => {
          console.error('[LandingHeroBanner] Play action failed:', error);
          setIsPlaying(false);
        });
      } else {
        video.pause();
      }
    } catch (error) {
      console.error('[LandingHeroBanner] Video toggle error:', error);
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
            {t('hero.tag') ? (
              <div className="landing-hero-eyebrow">
                <span className="landing-hero-eyebrow-dot" aria-hidden="true" />
                <span>{t('hero.tag')}</span>
              </div>
            ) : null}

            <h1 id="landing-title" className="landing-hero-headline">
              {t('hero.title_part1', { defaultValue: 'Learn English, ' })}
              <span className="landing-hero-accent">
                {t('hero.title_accent', { defaultValue: 'Live Culture' })}
              </span>
            </h1>

            <p className="landing-hero-subtitle">
              {t('hero.subtitle', {
                defaultValue:
                  'Discover Vietnam through authentic stories, bilingual reading, and immersive listening',
              })}
            </p>

            <div className="landing-hero-actions">
              <button
                type="button"
                className="landing-button landing-button-primary focus-ring"
                onClick={() => handleNavigate(PATHS.discovery)}
              >
                {t('hero.cta_start', { defaultValue: 'Start Learning' })}{' '}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="landing-button landing-button-secondary focus-ring"
                onClick={scrollToStories}
              >
                {t('hero.cta_explore', { defaultValue: 'Explore Stories' })}{' '}
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Control Toggle */}
        <button
          type="button"
          className="landing-video-toggle focus-ring"
          onClick={toggleVideoPlayback}
          aria-label={isPlaying ? 'Pause hero video' : 'Play hero video'}
          title={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause size={16} aria-hidden="true" />
          ) : (
            <Play size={16} aria-hidden="true" />
          )}
        </button>
      </div>
    </section>
  );
};

export default LandingHeroBanner;
