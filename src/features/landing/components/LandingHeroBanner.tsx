import React from 'react';
import { ArrowDown, ArrowRight, BookOpen, Mic2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { cuisineStories, featuredCuisineStory, firstCuisineChapterPath } from '../lib/cuisineStories';

const EASE_CURVE = [0.22, 1, 0.36, 1] as const;

export const LandingHeroBanner: React.FC = () => {
  const { t, i18n } = useTranslation('landing');
  const reducedMotion = useReducedMotion();
  const canAnimate = !reducedMotion;

  const storyName = featuredCuisineStory
    ? (i18n.language.startsWith('vi') ? featuredCuisineStory.titleVi : featuredCuisineStory.title)
    : t('hero.fallback_story');

  return (
    <section className="landing-intro-hero" aria-labelledby="landing-title">
      <div className="landing-container landing-intro-grid">
        <div className="landing-intro-copy">
          <motion.div
            initial={canAnimate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_CURVE }}
          >
            <p className="landing-intro-status">
              <span className="landing-intro-eyebrow-line" aria-hidden="true" />
              {t('hero.eyebrow')}
            </p>
          </motion.div>
          <motion.h1
            id="landing-title"
            className="landing-intro-title"
            initial={canAnimate ? { opacity: 0, y: 36 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: EASE_CURVE }}
          >
            {t('hero.title_part1')} <span>{t('hero.title_accent')}</span>
          </motion.h1>
          <motion.p
            className="landing-intro-subtitle"
            initial={canAnimate ? { opacity: 0, y: 24 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.25, ease: EASE_CURVE }}
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            className="landing-intro-actions"
            initial={canAnimate ? { opacity: 0, y: 22 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.38, ease: EASE_CURVE }}
          >
            <Link className="landing-button landing-button-primary focus-ring" to={firstCuisineChapterPath}>
              {t('hero.cta_start')} <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <a className="landing-intro-secondary focus-ring" href="#featured-articles">
              {t('hero.cta_explore')} <ArrowDown size={17} aria-hidden="true" />
            </a>
          </motion.div>
          <motion.div
            className="landing-intro-footnote"
            initial={canAnimate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <span>{t('hero.footnote_series', { count: cuisineStories.length })}</span>
            <span>{t('hero.footnote_bilingual')}</span>
          </motion.div>
        </div>

        <motion.div
          className="landing-intro-visual"
          initial={canAnimate ? { opacity: 0, y: 44, scale: 0.96 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, delay: 0.2, ease: EASE_CURVE }}
        >
          {featuredCuisineStory && (
            <img src={featuredCuisineStory.imageUrl} alt={t('hero.image_alt', { title: storyName })} width={1024} height={576} fetchPriority="high" />
          )}
          <div className="landing-intro-image-label">
            <BookOpen size={18} aria-hidden="true" />
            <span>{t('hero.image_label', { title: storyName })}</span>
          </div>
          <div className="landing-intro-room-chip"><Mic2 size={17} aria-hidden="true" />{t('hero.room_chip')}</div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingHeroBanner;
