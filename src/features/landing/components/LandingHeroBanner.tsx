import React, { useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from 'motion/react';
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
  const { t } = useTranslation('landing');
  const appNavigate = useAppNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const reducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(!reducedMotion);

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
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;
      const command = isPlaying ? 'pauseVideo' : 'playVideo';
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('[LandingHeroBanner] Video toggle error:', error);
    }
  };

  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero-stage landing-hero-stage-fullscreen">
        {/* Fullscreen Cinematic YouTube Background Video */}
        <div className="landing-hero-bg-video-wrapper">
          <iframe
            ref={iframeRef}
            className="landing-hero-bg-video landing-hero-youtube-iframe"
            src={`https://www.youtube-nocookie.com/embed/IlYJvv8ixM4?autoplay=1&mute=1&controls=0&loop=1&playlist=IlYJvv8ixM4&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`}
            title={t('hero.video_label', { defaultValue: 'Atmospheric cultural video of Vietnamese heritage' })}
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
        </div>

        {/* Interaction shield: Chặn toàn bộ hover, click, controls từ YouTube */}
        <div className="landing-hero-interaction-shield" aria-hidden="true" />

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
              {t('hero.title_part1', { defaultValue: 'Engrave words, ' })}
              <span className="landing-hero-accent">
                {t('hero.title_accent', { defaultValue: 'Preserve cultures.' })}
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
          aria-label={isPlaying ? t('hero.video_pause', { defaultValue: 'Pause video' }) : t('hero.video_play', { defaultValue: 'Play video' })}
          title={isPlaying ? t('hero.video_pause', { defaultValue: 'Pause video' }) : t('hero.video_play', { defaultValue: 'Play video' })}
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
