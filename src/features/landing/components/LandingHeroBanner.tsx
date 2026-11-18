import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Pause, Play } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { cuisineStories, featuredCuisineStory, firstCuisineChapterPath } from '../lib/cuisineStories';

const EASE_CURVE = [0.22, 1, 0.36, 1] as const;
const VIDEO_ID = 'IlYJvv8ixM4';
const VIDEO_ORIGIN = 'https://www.youtube-nocookie.com';

export const LandingHeroBanner: React.FC = () => {
  const { t } = useTranslation('landing');
  const reducedMotion = useReducedMotion();
  const canAnimate = !reducedMotion;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideoPlayback = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: isPlaying ? 'pauseVideo' : 'playVideo', args: [] }),
      VIDEO_ORIGIN,
    );
    setIsPlaying((playing) => !playing);
  };

  return (
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero-stage-fullscreen">
        {featuredCuisineStory && (
          <img
            className="landing-hero-bg-image"
            src={featuredCuisineStory.imageUrl}
            alt=""
            width={1024}
            height={576}
            fetchPriority="high"
          />
        )}
        {canAnimate && (
          <div className="landing-hero-bg-video-wrapper" aria-hidden="true">
            <iframe
              ref={iframeRef}
              className="landing-hero-youtube-iframe"
              src={`${VIDEO_ORIGIN}/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${VIDEO_ID}&playsinline=1&rel=0&enablejsapi=1`}
              title={t('hero.video_label')}
              allow="autoplay; encrypted-media"
              tabIndex={-1}
            />
          </div>
        )}
        <div className="landing-hero-interaction-shield" aria-hidden="true" />
        <div className="landing-hero-cinematic-scrim" aria-hidden="true" />

        <div className="landing-container landing-hero-layout-unobstructed">
          <div className="landing-hero-copy">
            <motion.p
              className="landing-hero-eyebrow"
              initial={canAnimate ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_CURVE }}
            >
              <span className="landing-hero-eyebrow-dot" aria-hidden="true" />
              {t('hero.eyebrow')}
            </motion.p>
            <motion.h1
              id="landing-title"
              className="landing-hero-headline"
              initial={canAnimate ? { opacity: 0, y: 36 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12, ease: EASE_CURVE }}
            >
              {t('hero.title_part1')} <span className="landing-hero-accent">{t('hero.title_accent')}</span>
            </motion.h1>
            <motion.p
              className="landing-hero-subtitle"
              initial={canAnimate ? { opacity: 0, y: 24 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.25, ease: EASE_CURVE }}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              className="landing-hero-actions"
              initial={canAnimate ? { opacity: 0, y: 22 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.38, ease: EASE_CURVE }}
            >
              <Link className="landing-button landing-button-primary focus-ring" to={firstCuisineChapterPath}>
                {t('hero.cta_start')} <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a className="landing-button landing-button-secondary focus-ring" href="#featured-articles">
                {t('hero.cta_explore')} <ArrowDown size={17} aria-hidden="true" />
              </a>
            </motion.div>
            <motion.div
              className="landing-hero-footnote"
              initial={canAnimate ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <span>{t('hero.footnote_series', { count: cuisineStories.length })}</span>
              <span>{t('hero.footnote_bilingual')}</span>
            </motion.div>
          </div>
        </div>

        {canAnimate && (
          <button
            type="button"
            className="landing-video-toggle focus-ring"
            onClick={toggleVideoPlayback}
            aria-label={t(isPlaying ? 'hero.video_pause' : 'hero.video_play')}
            title={t(isPlaying ? 'hero.video_pause' : 'hero.video_play')}
          >
            {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
        )}
      </div>
    </section>
  );
};

export default LandingHeroBanner;
