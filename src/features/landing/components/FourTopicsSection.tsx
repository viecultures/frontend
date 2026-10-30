import React from 'react';
import { ArrowRight } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';

interface TopicItemConfig {
  key: 'history' | 'food' | 'crafts' | 'festivals';
  image: string;
  alt: string;
}

const TOPICS_CONFIG: TopicItemConfig[] = [
  {
    key: 'history',
    image: '/images/landing/hue-citadel.webp',
    alt: 'Imperial Citadel of Hue reflecting ancient Vietnamese architectural heritage',
  },
  {
    key: 'food',
    image: '/images/landing/banh-mi.webp',
    alt: 'Traditional Vietnamese culinary specialty representing rich gastronomic culture',
  },
  {
    key: 'crafts',
    image: '/images/landing/bat-trang.webp',
    alt: 'Artisan hand-crafting pottery in the historic Bat Trang ceramic village',
  },
  {
    key: 'festivals',
    image: '/images/landing/hoi-an-lanterns.webp',
    alt: 'Lantern festival illuminating the historic riverside in Hoi An ancient town',
  },
];

interface FourTopicsSectionProps {
  onNavigate?: (view: string) => void;
}

export const FourTopicsSection: React.FC<FourTopicsSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation('landing');

  const explore = () => {
    onNavigate?.(PATHS.discovery);
  };

  return (
    <section
      id="topics"
      className="landing-topics landing-section"
      aria-labelledby="landing-topics-title"
    >
      <div className="landing-container">
        {/* Section Heading */}
        <div className="landing-section-heading">
          <div>
            <h2 id="landing-topics-title">{t('topics.title')}</h2>
          </div>
          <p className="landing-topics-intro">
            {t('topics.intro')}
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="landing-topic-grid mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOPICS_CONFIG.map(({ key, image, alt }) => {
            const title = t(`topics.items.${key}.title`);
            const vietnameseTitle = t(`topics.items.${key}.vietnameseTitle`);
            const kicker = t(`topics.items.${key}.kicker`);
            const description = t(`topics.items.${key}.description`);

            return (
              <button
                key={key}
                type="button"
                className="landing-topic-card group text-left bg-surface rounded-2xl border border-line p-3 hover:border-antique-gold/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-ring cursor-pointer flex flex-col h-full"
                onClick={explore}
                aria-label={t('topics.explore_aria', { title })}
              >
                {/* Image Container with Consistent Aspect Ratio */}
                <div className="landing-topic-image relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-surface-feature">
                  <img
                    src={image}
                    alt={alt}
                    loading="lazy"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Text Body */}
                <div className="landing-topic-body pt-4 px-1 pb-2 flex-1 flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-ink mb-1">
                    {kicker}
                  </span>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-xl font-bold text-ink leading-snug group-hover:text-action transition-colors">
                      {title}
                    </h3>
                    <ArrowRight size={18} className="text-ink-soft shrink-0 group-hover:text-action group-hover:translate-x-1 transition-all mt-1" aria-hidden="true" />
                  </div>
                  <p className="text-xs text-ink-soft italic font-serif mt-0.5 mb-2">
                    {vietnameseTitle}
                  </p>
                  <p className="text-xs sm:text-sm text-ink-soft leading-relaxed mt-auto pt-2 border-t border-line/60">
                    {description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FourTopicsSection;
