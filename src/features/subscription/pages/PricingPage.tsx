import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNavigate } from '@/routes/useAppNavigate';
import {
  Check,
  X,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { getIsProUser } from '@/utils/auth-storage';
import { PATHS } from '@/routes/paths';

export interface PlanItem {
  id: 'free' | 'monthly' | 'quarterly' | 'yearly' | 'student_monthly' | 'student_yearly';
  badge: string;
  name: string;
  period: string;
  price: string;
  originalPrice: string;
  discountBadge: string;
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

export const PricingPage: React.FC = () => {
  const { t } = useTranslation('subscription');
  const navigate = useAppNavigate();
  const [isPro, setLocalIsPro] = useState<boolean>(getIsProUser());

  useEffect(() => {
    setLocalIsPro(getIsProUser());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const handleSubChange = () => setLocalIsPro(getIsProUser());
    window.addEventListener('subscription:change', handleSubChange);
    window.addEventListener('auth:change', handleSubChange);
    return () => {
      window.removeEventListener('subscription:change', handleSubChange);
      window.removeEventListener('auth:change', handleSubChange);
    };
  }, []);

  const handleSelectPlan = (planTarget?: string) => {
    if (!planTarget) {
      navigate(PATHS.discovery);
      return;
    }
    navigate(`${PATHS.checkout}?plan=${planTarget}`);
  };

  const plans: PlanItem[] = useMemo(() => [
    // Top Row: 3 Gói phổ thông linh hoạt
    {
      id: 'free',
      badge: t('pricing.plans.free.badge'),
      name: t('pricing.plans.free.name'),
      period: t('pricing.plans.free.period'),
      price: t('pricing.plans.free.price'),
      originalPrice: '',
      discountBadge: '',
      description: t('pricing.plans.free.description'),
      cta: t('pricing.plans.free.cta'),
      features: ((t('pricing.plans.free.features', { returnObjects: true }) as unknown) as string[]) || [],
      isFree: true,
      badgeStyle: 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300',
      cardBorder: 'border-stone-300 dark:border-white/10 bg-rice-paper dark:bg-[#141C1A]',
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
      buttonStyle: 'bg-gradient-to-r from-[#9E2A2B] to-[#7F1D1D] hover:from-[#852223] hover:to-[#6B1818] text-white border border-antique-bright/40 font-bold shadow-lg hover:shadow-xl',
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

  return (
    <div className="w-full text-ink-soft dark:text-warm-ivory font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Top Back Action */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-heritage-green dark:text-antique-gold hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('pricing.back_to_previous')}</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-heritage-green/10 dark:bg-antique-gold/10 border border-antique-gold/40 text-heritage-green dark:text-antique-gold text-xs font-bold uppercase tracking-wider">
            <span>{t('pricing.badge')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-heritage-green dark:text-warm-ivory tracking-tight">
            {t('pricing.title')}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
          <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-antique-gold/15 text-antique-gold text-xs font-semibold">
            <span>{t('pricing.grid_subtitle')}</span>
          </div>
        </div>

        {/* 6-Card Grid: 3 cards top, 3 cards bottom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch pt-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 sm:p-7 flex flex-col justify-between shadow-md transition-all hover:shadow-lg relative ${
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
                {/* Card Header */}
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
                    <span className={`font-serif text-3xl sm:text-4xl font-extrabold ${
                      plan.isPopular ? 'text-[#9E2A2B] dark:text-antique-bright' : 'text-[#9E2A2B] dark:text-antique-gold'
                    }`}>
                      {plan.price}
                    </span>
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

              {/* CTA Action Button */}
              <div className="pt-6 mt-4 border-t border-line/50 dark:border-white/10 relative z-1">
                {plan.isFree ? (
                  <button
                    type="button"
                    disabled={!isPro}
                    onClick={() => handleSelectPlan()}
                    className="w-full min-h-[44px] py-3 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-serif font-bold text-xs sm:text-sm cursor-pointer hover:bg-stone-300 transition-colors text-center"
                  >
                    {!isPro ? plan.cta : t('pricing.downgrade_btn')}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.targetCheckoutPlan)}
                    className={`w-full min-h-[44px] py-3.5 rounded-2xl font-serif font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      plan.buttonStyle || 'bg-heritage-green text-white hover:bg-heritage-dark'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Student Special Notice */}
        <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-blue-500/10 border border-blue-400/30 flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm">
          <div className="flex-1 space-y-0.5 text-center sm:text-left">
            <p className="font-bold text-heritage-green dark:text-warm-ivory">
              {t('pricing.student_banner.title')}
            </p>
            <p className="text-stone-600 dark:text-stone-300">
              {t('pricing.student_banner.desc')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSelectPlan('student')}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-sm"
          >
            {t('pricing.student_banner.cta')}
          </button>
        </div>

        {/* Detailed Feature Comparison Table */}
        <section className="pt-8 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-green dark:text-warm-ivory">
              {t('pricing.comparison_table.title')}
            </h3>
            <p className="text-xs text-stone-500">
              {t('pricing.comparison_table.subtitle')}
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-antique-gold/30 bg-white dark:bg-[#141C1A] shadow-md">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="bg-heritage-green text-white border-b border-antique-gold/30">
                  <th className="py-4 px-6 font-serif">{t('pricing.comparison_table.feature_col')}</th>
                  <th className="py-4 px-6 font-serif text-center">{t('pricing.comparison_table.free_col')}</th>
                  <th className="py-4 px-6 font-serif text-center bg-heritage-dark text-antique-gold">
                    {t('pricing.comparison_table.pro_col')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-white/10">
                <tr>
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.reading.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">{t('pricing.comparison_table.rows.reading.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.reading.pro')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.audio.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">{t('pricing.comparison_table.rows.audio.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.audio.pro')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.vocab.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">{t('pricing.comparison_table.rows.vocab.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.vocab.pro')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.ai_chat.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">{t('pricing.comparison_table.rows.ai_chat.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.ai_chat.pro')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.games_review.label')}</td>
                  <td className="py-3.5 px-6 text-center text-rose-500">{t('pricing.comparison_table.rows.games_review.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.games_review.pro')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.analytics.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">{t('pricing.comparison_table.rows.analytics.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.analytics.pro')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.pricing_cycles.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">{t('pricing.comparison_table.rows.pricing_cycles.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.pricing_cycles.pro')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;
