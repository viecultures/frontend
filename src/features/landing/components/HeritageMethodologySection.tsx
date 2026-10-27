import React from 'react';
import { ArrowRight, Book, Compass, Layers, ChatDots } from 'react-bootstrap-icons';
import { PATHS, paths } from '@/routes/paths';

interface StepItem {
  number: string;
  step: string;
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ size?: number | string; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  view: string | null;
  optional?: boolean;
}

const STEPS: StepItem[] = [
  {
    number: '01',
    step: 'Step 1',
    title: 'Choose a Story',
    description: 'Select an authentic cultural story — from culinary arts to imperial history.',
    action: 'Explore stories',
    icon: Compass,
    view: PATHS.discovery,
  },
  {
    number: '02',
    step: 'Step 2',
    title: 'Read & Listen',
    description: 'Read parallel bilingual sentences synchronized with native audio at your own pace.',
    action: 'Read the Hue story',
    icon: Book,
    view: paths.reader({ story: 'imperial-hue' }),
  },
  {
    number: '03',
    step: 'Step 3',
    title: 'Review Lexicon',
    description: 'Master contextual story vocabulary using smart spaced-repetition flashcards.',
    action: 'Try interactive review',
    icon: Layers,
    view: null,
  },
  {
    number: '04',
    step: 'Step 4',
    title: 'Reflect & Speak',
    description: 'Practice speaking with the AI cultural guide or journal reflections safely.',
    action: 'Try AI companion',
    icon: ChatDots,
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
            <h2 id="landing-journey-title">From a single story to natural fluency</h2>
          </div>
        </div>
        <p className="landing-section-description">
          A continuous four-stage methodology designed for contextual retention without mindless rote memorization.
        </p>

        {/* 4 Steps Grid */}
        <ol className="landing-journey-grid mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0">
          {STEPS.map(({ number, step, title, description, action, icon: Icon, view, optional }) => (
            <li
              key={title}
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
                        Optional
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
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HeritageMethodologySection;
