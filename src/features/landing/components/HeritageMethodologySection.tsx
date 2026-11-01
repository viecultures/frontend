import React from 'react';
import { ArrowRight, Book, Compass, Layers, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS, paths } from '@/routes/paths';

interface StepItemConfig {
  key: 'step1' | 'step2' | 'step3' | 'step4';
  icon: React.ComponentType<{ size?: number | string; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  view: string | null;
  optional?: boolean;
}

const STEPS_CONFIG: StepItemConfig[] = [
  {
    key: 'step1',
    icon: Compass,
    view: PATHS.discovery,
  },
  {
    key: 'step2',
    icon: Book,
    view: paths.reader({ story: 'imperial-hue' }),
  },
  {
    key: 'step3',
    icon: Layers,
    view: null,
  },
  {
    key: 'step4',
    icon: MessageSquare,
    view: PATHS.playground,
    optional: true,
  },
];

interface HeritageMethodologySectionProps {
  onNavigate?: (view: string) => void;
  onPreviewFlashcards?: () => void;
}

export const HeritageMethodologySection: React.FC<HeritageMethodologySectionProps> = ({
  onNavigate,
  onPreviewFlashcards,
}) => {
  const { t } = useTranslation('landing');

  const chooseStep = (view: string | null) => {
    if (view === null) {
      if (onPreviewFlashcards) {
        onPreviewFlashcards();
      } else {
        document.getElementById('flashcard-demo')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
      }
      return;
    }
    onNavigate?.(view);
  };

  return (
    <section
      id="methodology"
      className="landing-journey landing-section"
      aria-labelledby="landing-journey-title"
    >
      <div className="landing-container">
        {/* Section Heading */}
        <div className="landing-section-heading">
          <div>
            <h2 id="landing-journey-title">{t('methodology.title')}</h2>
          </div>
        </div>
        <p className="landing-section-description">
          {t('methodology.subtitle')}
        </p>

        {/* 4 Steps Grid */}
        <ol className="landing-journey-grid mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0">
          {STEPS_CONFIG.map(({ key, icon: Icon, view, optional }) => {
            const number = t(`methodology.steps.${key}.number`);
            const step = t(`methodology.steps.${key}.step`);
            const title = t(`methodology.steps.${key}.title`);
            const description = t(`methodology.steps.${key}.description`);
            const action = t(`methodology.steps.${key}.action`);

            return (
              <li
                key={key}
                className="landing-journey-step bg-surface rounded-2xl border border-line p-6 flex flex-col justify-between hover:border-antique-gold/60 transition-all duration-300 shadow-xs h-full"
              >
                <div>
                  <div className="landing-journey-step-top flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-feature text-accent-ink border border-line">
                        {number}
                      </span>
                      <span className="landing-journey-step-badge text-xs font-semibold text-ink-soft">
                        {step}
                      </span>
                      {optional && (
                        <span className="landing-journey-optional text-[11px] font-sans font-medium px-2 py-0.5 rounded bg-surface-feature border border-line text-ink-soft">
                          {t('methodology.optional')}
                        </span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-surface-feature text-action border border-line flex items-center justify-center">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="landing-journey-step-copy">
                    <h3 className="font-serif text-xl font-bold text-ink leading-snug mb-2 min-h-[1.75rem]">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-line/60">
                  <button
                    type="button"
                    className="landing-text-link focus-ring inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-action hover:text-accent-ink transition-colors cursor-pointer"
                    onClick={() => chooseStep(view)}
                  >
                    <span>{action}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default HeritageMethodologySection;
