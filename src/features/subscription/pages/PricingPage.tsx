import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNavigate } from '@/routes/useAppNavigate';
import {
  Check,
  X,
  Crown,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Volume2,
  Bot,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { getIsProUser } from '@/utils/auth-storage';
import { PATHS } from '@/routes/paths';

export const PricingPage: React.FC = () => {
  const { t } = useTranslation('subscription');
  const navigate = useAppNavigate();

  const [isPro, setLocalIsPro] = useState<boolean>(getIsProUser());
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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

  const handleSelectPro = () => {
    navigate(PATHS.checkout);
  };

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
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-heritage-green/10 dark:bg-antique-gold/10 border border-antique-gold/40 text-heritage-green dark:text-antique-gold text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>{t('pricing.badge')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-heritage-green dark:text-warm-ivory tracking-tight">
            {t('pricing.title')}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
            {t('pricing.subtitle')}
          </p>

          {/* Billing Toggle (Tháng / Năm) */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="bg-heritage-green/10 dark:bg-white/10 p-1 rounded-2xl inline-flex items-center border border-antique-gold/30 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-heritage-green text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green'
                }`}
              >
                {t('pricing.billing_cycle.monthly')}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-heritage-green text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-heritage-green'
                }`}
              >
                <span>{t('pricing.billing_cycle.yearly')}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#9E2A2B] text-white font-mono">
                  {t('pricing.billing_cycle.discount_badge')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 2 Option Comparison Cards: Bản Thường vs Bản Pro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* OPTION 1: Bản Thường (Miễn Phí) */}
          <div className="bg-rice-paper dark:bg-[#141C1A] border-2 border-stone-300 dark:border-white/10 rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-md transition-all">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {t('pricing.free_plan.badge')}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-green dark:text-white">
                  {t('pricing.free_plan.name')}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400">
                  {t('pricing.free_plan.description')}
                </p>
              </div>

              <div className="py-2 border-y border-stone-300/60 dark:border-white/10">
                <div className="font-serif text-4xl font-extrabold text-heritage-green dark:text-antique-gold">
                  {t('pricing.free_plan.price')}
                </div>
                <span className="text-xs text-stone-500">{t('pricing.free_plan.period')}</span>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.free_plan.features.ai_chat')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.free_plan.features.vocabulary_save')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.free_plan.features.sample_articles')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t('pricing.free_plan.features.audio_speed')}</span>
                </li>
                <li className="flex items-center gap-3 opacity-60">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{t('pricing.free_plan.features.no_mascot_feedback')}</span>
                </li>
                <li className="flex items-center gap-3 opacity-60">
                  <X className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{t('pricing.free_plan.features.has_ads')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                disabled
                className="w-full py-3.5 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-500 font-serif font-bold text-xs sm:text-sm cursor-not-allowed text-center"
              >
                {!isPro ? t('pricing.free_plan.current_plan') : t('pricing.free_plan.basic_plan')}
              </button>
            </div>
          </div>

          {/* OPTION 2: Bản Hội Viên Pro (39.000đ/tháng) */}
          <div className="relative bg-heritage-forest text-warm-ivory border-4 border-antique-gold rounded-3xl p-6 sm:p-10 flex flex-col justify-between shadow-2xl transition-all transform hover:scale-[1.01]">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#9E2A2B] text-white border border-antique-gold text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
              <span>{t('pricing.pro_plan.best_value')}</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
                  {t('pricing.pro_plan.badge')}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  <span>{t('pricing.pro_plan.name')}</span>
                  <Crown className="w-6 h-6 text-antique-gold fill-current" />
                </h3>
                <p className="text-xs text-stone-300">
                  {t('pricing.pro_plan.description')}
                </p>
              </div>

              <div className="py-2 border-y border-white/10">
                <div className="font-serif text-4xl font-extrabold text-antique-gold">
                  {billingCycle === 'monthly' ? t('pricing.pro_plan.monthly_price') : t('pricing.pro_plan.yearly_price')}
                </div>
                <span className="text-xs text-white/70">
                  {billingCycle === 'monthly' ? t('pricing.pro_plan.monthly_period') : t('pricing.pro_plan.yearly_period')}
                </span>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3.5 text-xs sm:text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span>{t('pricing.pro_plan.features.ai_companion')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span>{t('pricing.pro_plan.features.mascot_feedback')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span>{t('pricing.pro_plan.features.all_provinces')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span>{t('pricing.pro_plan.features.audio_speeds')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span>{t('pricing.pro_plan.features.unlimited_vocab')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-antique-gold shrink-0 mt-0.5" />
                  <span>{t('pricing.pro_plan.features.no_ads')}</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 space-y-2">
              {isPro ? (
                <div className="w-full py-4 rounded-2xl bg-heritage-green border border-antique-gold text-antique-gold font-serif font-bold text-center text-sm shadow-md flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t('pricing.pro_plan.already_pro')}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSelectPro}
                  className="w-full py-4 rounded-2xl bg-[#9E2A2B] hover:bg-[#852223] text-white font-serif font-bold text-sm sm:text-base shadow-xl border border-antique-gold transition-all transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 text-antique-gold" />
                  <span>{t('pricing.pro_plan.upgrade_cta')}</span>
                  <ArrowRight className="w-4 h-4 text-antique-gold" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Feature Comparison Table (matching system_constants.md) */}
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
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.ai_chat.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">{t('pricing.comparison_table.rows.ai_chat.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.ai_chat.pro')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.mascot.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-400">{t('pricing.comparison_table.rows.mascot.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.mascot.pro')}
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
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.content.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">{t('pricing.comparison_table.rows.content.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.content.pro')}
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
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.cloud_sync.label')}</td>
                  <td className="py-3.5 px-6 text-center text-stone-600 dark:text-stone-300">{t('pricing.comparison_table.rows.cloud_sync.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.cloud_sync.pro')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium">{t('pricing.comparison_table.rows.ads.label')}</td>
                  <td className="py-3.5 px-6 text-center text-rose-500">{t('pricing.comparison_table.rows.ads.free')}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-amber-500/5">
                    {t('pricing.comparison_table.rows.ads.pro')}
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
