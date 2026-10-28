import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { PATHS } from '@/routes/paths';

interface LandingPlansSectionProps {
  onNavigate?: (view: string) => void;
}

const plans = [
  {
    name: 'Free',
    price: '0 VND',
    period: 'Forever free',
    description: 'Begin your journey through Vietnamese stories.',
    features: ['Bilingual reading and listening', 'Save up to 30 words', '3 AI chat turns per day'],
    action: 'Explore for free',
    path: PATHS.discovery,
    featured: false,
  },
  {
    name: 'Pro',
    price: '39,000 VND',
    period: 'per month',
    description: 'Go deeper with more room to read, listen, and practice.',
    features: ['Unlimited AI chat turns', 'Unlimited saved vocabulary', 'More listening speeds and learning tools'],
    action: 'View Pro details',
    path: PATHS.pricing,
    featured: true,
  },
] as const;

export const LandingPlansSection: React.FC<LandingPlansSectionProps> = ({ onNavigate }) => (
  <section id="plans" className="landing-section bg-surface px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="landing-plans-title">
    <div className="landing-container">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">Learning plans</p>
        <h2 id="landing-plans-title" className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">Choose how you learn</h2>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">Start with stories for free. Explore the full plan details whenever you are ready.</p>
      </div>
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
        {plans.map(plan => (
          <article key={plan.name} className={`flex flex-col rounded-3xl border p-6 shadow-sm sm:p-8 ${plan.featured ? 'border-action bg-surface-muted' : 'border-line bg-surface-raised'}`}>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-2xl font-bold text-ink">{plan.name}</h3>
              {plan.featured && <span className="rounded-full bg-action px-3 py-1 text-xs font-semibold text-on-action">More ways to learn</span>}
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
      <p className="mt-6 text-center text-sm text-ink-soft">See the complete comparison on the <button type="button" onClick={() => onNavigate?.(PATHS.pricing)} className="font-semibold text-action underline underline-offset-4 focus-ring">pricing page</button>.</p>
    </div>
  </section>
);

export default LandingPlansSection;
