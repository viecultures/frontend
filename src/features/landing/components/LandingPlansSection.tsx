import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';

interface LandingPlansSectionProps {
  onNavigate?: (view: string) => void;
}

export const LandingPlansSection: React.FC<LandingPlansSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation('landing');

  const plans = [
    {
      key: 'free' as const,
      name: t('plans_section.free.name'),
      price: t('plans_section.free.price'),
      period: t('plans_section.free.period'),
      description: t('plans_section.free.description'),
      features: (t('plans_section.free.features', { returnObjects: true }) as string[]) || [],
      action: t('plans_section.free.action'),
      path: PATHS.discovery,
      featured: false,
    },
    {
      key: 'pro' as const,
      name: t('plans_section.pro.name'),
      price: t('plans_section.pro.price'),
      period: t('plans_section.pro.period'),
      description: t('plans_section.pro.description'),
      features: (t('plans_section.pro.features', { returnObjects: true }) as string[]) || [],
      action: t('plans_section.pro.action'),
      path: PATHS.pricing,
      featured: true,
    },
  ];

  return (
    <section id="plans" className="landing-section bg-surface px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="landing-plans-title">
      <div className="landing-container">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">{t('plans_section.badge')}</p>
          <h2 id="landing-plans-title" className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">{t('plans_section.title')}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{t('plans_section.subtitle')}</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          {plans.map(plan => (
            <article key={plan.key} className={`flex flex-col rounded-3xl border p-6 shadow-sm sm:p-8 ${plan.featured ? 'border-action bg-surface-muted' : 'border-line bg-surface-raised'}`}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold text-ink">{plan.name}</h3>
                {plan.featured && <span className="rounded-full bg-action px-3 py-1 text-xs font-semibold text-on-action">{t('plans_section.badge_featured')}</span>}
              </div>
              <p className="mt-3 min-h-12 text-sm leading-relaxed text-ink-soft">{plan.description}</p>
              <div className="mt-5 border-b border-line pb-5">
                <strong className="font-serif text-3xl text-ink">{plan.price}</strong>
                <span className="ml-2 text-sm text-ink-soft">{plan.period}</span>
              </div>
              <ul className="my-6 flex-1 space-y-3">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink-soft">
                    <Check size={18} className="mt-0.5 shrink-0 text-action" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => onNavigate?.(plan.path)} className={`landing-button focus-ring w-full ${plan.featured ? 'landing-button-primary' : 'border-line bg-surface text-ink hover:bg-surface-muted'}`}>
                {plan.action}<ArrowRight size={17} aria-hidden="true" />
              </button>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-ink-soft">
          {t('plans_section.comparison_note')}{' '}
          <button type="button" onClick={() => onNavigate?.(PATHS.pricing)} className="font-semibold text-action underline underline-offset-4 focus-ring">
            {t('plans_section.pricing_link')}
          </button>
          .
        </p>
      </div>
    </section>
  );
};

export default LandingPlansSection;
