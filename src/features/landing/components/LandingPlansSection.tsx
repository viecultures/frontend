import React, { useMemo } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';

interface LandingPlansSectionProps {
  onNavigate?: (view: string) => void;
}

export interface LandingPlanItem {
  id: 'free' | 'monthly' | 'quarterly' | 'yearly' | 'student_monthly' | 'student_yearly';
  badge: string;
  name: string;
  period: string;
  price: string;
  originalPrice?: string;
  discountBadge?: string;
  description: string;
  cta: string;
  features: string[];
  isPopular?: boolean;
  isStudent?: boolean;
  isFree?: boolean;
  targetCheckoutPlan?: string;
  badgeStyle?: string;
  cardBorder?: string;
  buttonStyle?: string;
}

export const LandingPlansSection: React.FC<LandingPlansSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation('subscription');
  const { t: tLanding } = useTranslation('landing');

  const plans: LandingPlanItem[] = useMemo(() => [
    // Top Row: 3 Gói phổ thông linh hoạt
    {
      id: 'free',
      badge: t('pricing.plans.free.badge'),
      name: t('pricing.plans.free.name'),
      period: t('pricing.plans.free.period'),
      price: t('pricing.plans.free.price'),
      description: t('pricing.plans.free.description'),
      cta: t('pricing.plans.free.cta'),
      features: ((t('pricing.plans.free.features', { returnObjects: true }) as unknown) as string[]) || [],
      isFree: true,
      badgeStyle: 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300',
      cardBorder: 'border-stone-300 dark:border-white/10 bg-rice-paper dark:bg-[#141C1A]',
      buttonStyle: 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300',
    },
    {
      id: 'monthly',
      badge: t('pricing.plans.monthly.badge'),
      name: t('pricing.plans.monthly.name'),
      period: t('pricing.plans.monthly.period'),
      price: t('pricing.plans.monthly.price'),
      originalPrice: t('pricing.plans.monthly.original_price'),
      discountBadge: t('pricing.plans.monthly.discount_badge'),
      description: t('pricing.plans.monthly.description'),
      cta: t('pricing.plans.monthly.cta'),
      features: ((t('pricing.plans.monthly.features', { returnObjects: true }) as unknown) as string[]) || [],
      targetCheckoutPlan: 'monthly',
      badgeStyle: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30',
      cardBorder: 'border-heritage-green/50 dark:border-antique-gold/30 bg-white dark:bg-[#17231E]',
      buttonStyle: 'bg-heritage-green text-white hover:bg-heritage-dark',
    },
    {
      id: 'quarterly',
      badge: t('pricing.plans.quarterly.badge'),
      name: t('pricing.plans.quarterly.name'),
      period: t('pricing.plans.quarterly.period'),
      price: t('pricing.plans.quarterly.price'),
      originalPrice: t('pricing.plans.quarterly.original_price'),
      discountBadge: t('pricing.plans.quarterly.discount_badge'),
      description: t('pricing.plans.quarterly.description'),
      cta: t('pricing.plans.quarterly.cta'),
      features: ((t('pricing.plans.quarterly.features', { returnObjects: true }) as unknown) as string[]) || [],
      targetCheckoutPlan: 'quarterly',
      badgeStyle: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30',
      cardBorder: 'border-antique-gold/60 dark:border-antique-gold/40 bg-white dark:bg-[#17231E]',
      buttonStyle: 'bg-heritage-forest text-warm-ivory border border-antique-gold hover:bg-heritage-dark',
    },
    // Bottom Row: 3 Gói dài hạn & sinh viên
    {
      id: 'yearly',
      badge: t('pricing.plans.yearly.badge'),
      name: t('pricing.plans.yearly.name'),
      period: t('pricing.plans.yearly.period'),
      price: t('pricing.plans.yearly.price'),
      originalPrice: t('pricing.plans.yearly.original_price'),
      discountBadge: t('pricing.plans.yearly.discount_badge'),
      description: t('pricing.plans.yearly.description'),
      cta: t('pricing.plans.yearly.cta'),
      features: ((t('pricing.plans.yearly.features', { returnObjects: true }) as unknown) as string[]) || [],
      isPopular: true,
      targetCheckoutPlan: 'yearly',
      badgeStyle: 'bg-amber-500/20 text-[#7C5E10] dark:text-antique-bright border border-antique-gold/40 font-bold',
      cardBorder: 'border-2 border-antique-gold bg-gradient-to-b from-[#FFFDF5] via-[#FCF4DC] to-[#F6E7BE] dark:from-[#262013] dark:via-[#1E190E] dark:to-[#171309] text-stone-900 dark:text-warm-ivory shadow-xl shadow-amber-900/10 ring-2 ring-antique-gold/60 relative transform lg:-translate-y-2',
      buttonStyle: 'bg-gradient-to-r from-[#9E2A2B] to-[#7F1D1D] hover:from-[#852223] hover:to-[#6B1818] text-white border border-antique-bright/40 font-bold shadow-md',
    },
    {
      id: 'student_monthly',
      badge: t('pricing.plans.student_monthly.badge'),
      name: t('pricing.plans.student_monthly.name'),
      period: t('pricing.plans.student_monthly.period'),
      price: t('pricing.plans.student_monthly.price'),
      originalPrice: t('pricing.plans.student_monthly.original_price'),
      discountBadge: t('pricing.plans.student_monthly.discount_badge'),
      description: t('pricing.plans.student_monthly.description'),
      cta: t('pricing.plans.student_monthly.cta'),
      features: ((t('pricing.plans.student_monthly.features', { returnObjects: true }) as unknown) as string[]) || [],
      isStudent: true,
      targetCheckoutPlan: 'student',
      badgeStyle: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30',
      cardBorder: 'border-blue-400/50 dark:border-blue-800/60 bg-white dark:bg-[#152026]',
      buttonStyle: 'bg-blue-700 text-white hover:bg-blue-800',
    },
    {
      id: 'student_yearly',
      badge: t('pricing.plans.student_yearly.badge'),
      name: t('pricing.plans.student_yearly.name'),
      period: t('pricing.plans.student_yearly.period'),
      price: t('pricing.plans.student_yearly.price'),
      originalPrice: t('pricing.plans.student_yearly.original_price'),
      discountBadge: t('pricing.plans.student_yearly.discount_badge'),
      description: t('pricing.plans.student_yearly.description'),
      cta: t('pricing.plans.student_yearly.cta'),
      features: ((t('pricing.plans.student_yearly.features', { returnObjects: true }) as unknown) as string[]) || [],
      isStudent: true,
      targetCheckoutPlan: 'student_yearly',
      badgeStyle: 'bg-blue-600 text-white font-bold',
      cardBorder: 'border-blue-500/70 dark:border-blue-700/80 bg-white dark:bg-[#152026]',
      buttonStyle: 'bg-blue-800 text-white hover:bg-blue-900',
    },
  ], [t]);

  const handleAction = (plan: LandingPlanItem) => {
    if (plan.isFree) {
      onNavigate?.(PATHS.discovery);
      return;
    }
    onNavigate?.(`${PATHS.checkout}?plan=${plan.targetCheckoutPlan}`);
  };

  return (
    <section id="plans" className="landing-section bg-surface px-4 py-16 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="landing-plans-title">
      <div className="landing-container">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">{tLanding('plans_section.badge')}</p>
          <h2 id="landing-plans-title" className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">{tLanding('plans_section.title')}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{tLanding('plans_section.subtitle')}</p>
        </div>

        {/* 6-Card Grid: 3 cards top, 3 cards bottom */}
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4 items-stretch">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`flex flex-col justify-between rounded-3xl border p-6 sm:p-7 shadow-sm transition-all hover:shadow-lg relative ${
                plan.cardBorder
              }`}
            >
              {/* Subtle metallic shine reflection for the best value / light gold card */}
              {plan.isPopular && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-tr from-white/0 via-white/50 to-white/0 pointer-events-none opacity-80 dark:opacity-10"
                />
              )}

              {/* Best Value Highlight Badge floating above card */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#9E2A2B] via-[#B83234] to-[#9E2A2B] text-white border border-antique-bright text-[11px] font-extrabold uppercase tracking-wider shadow-md whitespace-nowrap z-20">
                  <span>{plan.badge}</span>
                </div>
              )}

              <div className="space-y-5 relative z-1">
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 min-h-[1.5rem]">
                    {plan.isPopular ? (
                      <div className="h-5" />
                    ) : (
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${plan.badgeStyle}`}>
                        {plan.badge}
                      </span>
                    )}
                    {plan.isStudent && (
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-300">
                        <span>.edu.vn</span>
                      </span>
                    )}
                  </div>

                  <h3 className={`font-serif text-2xl font-bold ${
                    plan.isPopular
                      ? 'text-heritage-green dark:text-antique-bright'
                      : 'text-heritage-green dark:text-warm-ivory'
                  }`}>
                    <span>{plan.name}</span>
                  </h3>

                  <p className={`text-xs min-h-[2.5rem] leading-relaxed ${
                    plan.isPopular ? 'text-stone-700 dark:text-stone-300 font-medium' : 'opacity-80'
                  }`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price Section */}
                <div className="py-3 border-y border-line/60 dark:border-white/10">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <strong className={`font-serif text-3xl sm:text-4xl font-extrabold ${
                      plan.isPopular ? 'text-[#9E2A2B] dark:text-antique-bright' : 'text-[#9E2A2B] dark:text-antique-gold'
                    }`}>
                      {plan.price}
                    </strong>
                    {plan.originalPrice && (
                      <span className={`text-xs line-through ${
                        plan.isPopular ? 'text-stone-500 dark:text-stone-400' : 'opacity-60'
                      }`}>
                        {plan.originalPrice}
                      </span>
                    )}
                    {plan.discountBadge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9E2A2B] text-white shadow-xs">
                        {plan.discountBadge}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs block mt-1 ${
                    plan.isPopular ? 'text-stone-700 dark:text-stone-300 font-medium' : 'opacity-75'
                  }`}>
                    {plan.period}
                  </span>
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-3 text-xs">
                  {plan.features.map((feature, idx) => {
                    const isNegative = feature.startsWith('Không có') || feature.startsWith('No ');

                    return (
                      <li key={idx} className="flex items-start gap-2.5 leading-snug">
                        {isNegative ? (
                          <X className="w-4 h-4 text-rose-500/80 shrink-0 mt-0.5" aria-hidden="true" />
                        ) : (
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${
                            plan.isPopular ? 'text-emerald-700 dark:text-antique-bright' : 'text-heritage-green dark:text-antique-gold'
                          }`} aria-hidden="true" />
                        )}
                        <span className={
                          isNegative
                            ? 'opacity-60'
                            : plan.isPopular
                            ? 'text-stone-800 dark:text-warm-ivory font-medium'
                            : 'opacity-90'
                        }>
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-4 border-t border-line/50 dark:border-white/10 relative z-1">
                <button
                  type="button"
                  onClick={() => handleAction(plan)}
                  className={`w-full min-h-[44px] py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    plan.buttonStyle || 'bg-heritage-green text-white hover:bg-heritage-dark'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
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
