import React from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';
import { LandingConversionSection } from './LandingConversionSection';

interface LandingPlansSectionProps {
  onNavigate?: (view: string) => void;
}

type PlanKey = 'free' | 'monthly' | 'yearly';

export const LandingPlansSection: React.FC<LandingPlansSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation('subscription');
  const { t: tLanding } = useTranslation('landing');

  const plans: { key: PlanKey; featured?: boolean }[] = [
    { key: 'free' },
    { key: 'monthly' },
    { key: 'yearly', featured: true },
  ];

  return (
    <section id="plans" className="landing-section landing-pricing bg-surface px-4 py-8 sm:px-6 sm:py-10 lg:px-8" aria-labelledby="landing-plans-title">
      <div className="landing-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">{tLanding('plans_section.badge')}</p>
          <h2 id="landing-plans-title" className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">{tLanding('plans_section.title')}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{tLanding('plans_section.subtitle')}</p>
        </div>

        <LandingConversionSection />

        <div className="landing-pricing-cards grid gap-6 lg:grid-cols-3">
          {plans.map(({ key, featured }) => {
            const features = t(`pricing.plans.${key}.features`, { returnObjects: true }) as string[];
            const originalPrice = key !== 'free' ? t(`pricing.plans.${key}.original_price`, { defaultValue: '' }) : '';
            return (
              <article key={key} className={`landing-pricing-card ${featured ? 'is-featured' : ''}`}>
                {featured && <span className="landing-pricing-featured-ribbon">{t(`pricing.plans.${key}.badge`)}</span>}
                <div>
                  {!featured && <span className="landing-pricing-card-badge">{t(`pricing.plans.${key}.badge`)}</span>}
                  <h3>{tLanding(`plans_section.cards.${key}`)}</h3>
                  <p className="landing-pricing-card-description">{t(`pricing.plans.${key}.description`)}</p>
                  <div className="landing-pricing-card-price">
                    <strong>{t(`pricing.plans.${key}.price`)}</strong>
                    {originalPrice && <span className="landing-pricing-original-price">{originalPrice}</span>}
                    <small>{tLanding('plans_section.free_during_test')}</small>
                  </div>
                  <ul>
                    {Array.isArray(features) && features.map((feature, index) => {
                      const isNegative = feature.startsWith('Không có') || feature.startsWith('No ');
                      return (
                        <li key={index} className={isNegative ? 'is-unavailable' : ''}>
                          {isNegative ? <X size={17} aria-hidden="true" /> : <Check size={17} aria-hidden="true" />}
                          <span>{feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <button
                  type="button"
                  className="landing-pricing-card-button focus-ring"
                  onClick={() => onNavigate?.(key === 'free' ? PATHS.discovery : PATHS.pricing)}
                >
                  {key === 'free' ? tLanding('plans_section.explore_free') : tLanding('plans_section.view_plan')}
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>

        {/* Footer comparison link */}
        <p className="mt-8 text-center text-sm text-ink-soft">
          {tLanding('plans_section.comparison_note')}{' '}
          <button
            type="button"
            onClick={() => onNavigate?.(PATHS.pricing)}
            className="font-semibold text-action underline underline-offset-4 focus-ring cursor-pointer"
          >
            {tLanding('plans_section.pricing_link')}
          </button>
          .
        </p>
      </div>
    </section>
  );
};

export default LandingPlansSection;
