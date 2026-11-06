import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppNavigate } from '@/routes/useAppNavigate';
import {
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Headphones,
  BookOpen,
  Compass,
  Download,
} from 'lucide-react';
import { getIsProUser } from '@/utils/auth-storage';
import { PATHS } from '@/routes/paths';
import { subscriptionService } from '../services/subscriptionService';
import type { SubscriptionPlanItem } from '@/features/admin/types/adminSubscriptionTypes';

export const PricingPage: React.FC = () => {
  const { t, i18n } = useTranslation('subscription');
  const navigate = useAppNavigate();
  const isVi = i18n.language.startsWith('vi');

  const [isPro, setLocalIsPro] = useState<boolean>(getIsProUser());
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await subscriptionService.getActivePlans();
      const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
      setPlans(sorted);
    } catch (err: unknown) {
      console.error('[PricingPage] Lỗi khi tải danh sách gói cước:', err);
      setErrorMessage(
        isVi
          ? 'Không thể tải bảng giá từ máy chủ. Vui lòng thử lại.'
          : 'Unable to load subscription plans. Please retry.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isVi]);

  useEffect(() => {
    setLocalIsPro(getIsProUser());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const handleSubChange = () => setLocalIsPro(getIsProUser());
    window.addEventListener('subscription:change', handleSubChange);
    window.addEventListener('auth:change', handleSubChange);
    fetchPlans();

    return () => {
      window.removeEventListener('subscription:change', handleSubChange);
      window.removeEventListener('auth:change', handleSubChange);
    };
  }, [fetchPlans]);

  const handleSelectPlan = (planTarget?: string) => {
    if (!planTarget) {
      navigate(PATHS.discovery);
      return;
    }
    navigate(`${PATHS.checkout}?plan=${encodeURIComponent(planTarget)}`);
  };

  return (
    <div className="w-full text-ink-soft dark:text-warm-ivory font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Top Back Action */}
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-heritage-green dark:text-antique-gold hover:underline cursor-pointer focus-ring"
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

        {/* State 1: Loading State */}
        {isLoading && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pt-4"
            aria-busy="true"
            aria-label="Đang tải danh sách gói cước"
          >
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-3xl border border-stone-200 dark:border-white/10 p-6 sm:p-7 space-y-5 bg-white/50 dark:bg-[#141C1A]"
              >
                <div className="h-5 w-24 rounded-full bg-stone-300 dark:bg-stone-700" />
                <div className="h-8 w-3/4 rounded-lg bg-stone-300 dark:bg-stone-700" />
                <div className="h-10 w-full rounded bg-stone-200 dark:bg-stone-800" />
                <div className="h-12 w-1/2 rounded bg-stone-300 dark:bg-stone-700 my-4" />
                <div className="space-y-3 pt-3">
                  <div className="h-4 w-full rounded bg-stone-200 dark:bg-stone-800" />
                  <div className="h-4 w-5/6 rounded bg-stone-200 dark:bg-stone-800" />
                  <div className="h-4 w-4/6 rounded bg-stone-200 dark:bg-stone-800" />
                </div>
                <div className="h-12 w-full rounded-2xl bg-stone-300 dark:bg-stone-700 mt-6" />
              </div>
            ))}
          </div>
        )}

        {/* State 2: Error State */}
        {!isLoading && errorMessage && (
          <div
            role="alert"
            className="max-w-xl mx-auto p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={fetchPlans}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer shadow-sm ring-2 focus-visible:ring-accent"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>{isVi ? 'Thử lại' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* State 3: Empty State */}
        {!isLoading && !errorMessage && plans.length === 0 && (
          <div className="max-w-md mx-auto p-8 rounded-3xl border border-stone-200 dark:border-white/10 text-center space-y-4 bg-white dark:bg-[#141C1A]">
            <Sparkles className="w-8 h-8 text-antique-gold mx-auto" aria-hidden="true" />
            <p className="text-sm text-stone-600 dark:text-stone-300">
              {isVi
                ? 'Hiện tại các gói cước đang được cập nhật. Vui lòng quay lại sau.'
                : 'Subscription plans are currently being updated.'}
            </p>
            <button
              type="button"
              onClick={() => navigate(PATHS.discovery)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer"
            >
              <span>{isVi ? 'Khám phá bài học miễn phí' : 'Explore Free Lessons'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* State 4 & 5: Live Database Plan Cards Grid */}
        {!isLoading && !errorMessage && plans.length > 0 && (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              plans.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
            } gap-6 max-w-7xl mx-auto items-stretch pt-4`}
          >
            {plans.map((plan) => {
              const effectivePrice = subscriptionService.calculateEffectivePrice(
                plan.priceVnd,
                plan.discountPercent
              );
              const hasDiscount = plan.discountPercent > 0;
              const isPopular = Boolean(plan.isPopularBadge);
              const isFree = effectivePrice === 0 || plan.code.toUpperCase() === 'FREE';

              const title = isVi ? plan.nameVi : plan.nameEn || plan.nameVi;
              const perks = (isVi ? plan.perksVi : plan.perksEn) || plan.perksVi || [];
              const cycleLabel = subscriptionService.getBillingCycleLabel(plan.billingCycle, isVi);

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl border p-6 sm:p-7 flex flex-col justify-between shadow-md transition-all duration-200 hover:shadow-xl relative ${
                    isPopular
                      ? 'border-2 border-antique-gold bg-gradient-to-b from-[#FFFDF5] via-[#FCF4DC] to-[#F6E7BE] dark:from-[#262013] dark:via-[#1E190E] dark:to-[#171309] text-stone-900 dark:text-warm-ivory ring-2 ring-antique-gold/60 transform lg:-translate-y-2'
                      : 'border-stone-300 dark:border-white/10 bg-white dark:bg-[#17231E]'
                  }`}
                >
                  {/* Subtle metallic shine reflection for popular card */}
                  {isPopular && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 rounded-3xl overflow-hidden bg-gradient-to-tr from-white/0 via-white/50 to-white/0 pointer-events-none opacity-80 dark:opacity-10"
                    />
                  )}

                  {/* Best Value Highlight Badge floating above popular card */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#9E2A2B] via-[#B83234] to-[#9E2A2B] text-white border border-antique-bright text-[11px] font-extrabold uppercase tracking-wider shadow-md whitespace-nowrap z-20">
                      <span>{isVi ? 'Phổ biến nhất' : 'Best Value'}</span>
                    </div>
                  )}

                  <div className="space-y-5 relative z-1">
                    {/* Card Header */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 min-h-[1.5rem]">
                        {isPopular ? (
                          <div className="h-5" />
                        ) : (
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {plan.code}
                          </span>
                        )}
                        <span className="text-[11px] font-semibold text-text-muted">
                          {cycleLabel}
                        </span>
                      </div>

                      <h3
                        className={`font-serif text-2xl font-bold ${
                          isPopular
                            ? 'text-heritage-green dark:text-antique-bright'
                            : 'text-heritage-green dark:text-warm-ivory'
                        }`}
                      >
                        <span>{title}</span>
                      </h3>

                      <p
                        className={`text-xs min-h-[2.5rem] leading-relaxed ${
                          isPopular
                            ? 'text-stone-700 dark:text-stone-300 font-medium'
                            : 'opacity-80'
                        }`}
                      >
                        {plan.descriptionVi || plan.nameEn}
                      </p>
                    </div>

                    {/* Price Section */}
                    <div className="py-3 border-y border-line/60 dark:border-white/10">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span
                          className={`font-serif text-3xl sm:text-4xl font-extrabold ${
                            isPopular
                              ? 'text-[#9E2A2B] dark:text-antique-bright'
                              : 'text-[#9E2A2B] dark:text-antique-gold'
                          }`}
                        >
                          {isFree
                            ? isVi
                              ? '0 đ'
                              : 'Free'
                            : subscriptionService.formatVnd(effectivePrice)}
                        </span>
                        {hasDiscount && (
                          <span
                            className={`text-xs line-through ${
                              isPopular
                                ? 'text-stone-500 dark:text-stone-400'
                                : 'opacity-60'
                            }`}
                          >
                            {subscriptionService.formatVnd(plan.priceVnd)}
                          </span>
                        )}
                        {hasDiscount && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9E2A2B] text-white shadow-xs">
                            {isVi ? `Tiết kiệm ${plan.discountPercent}%` : `Save ${plan.discountPercent}%`}
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-xs block mt-1 ${
                          isPopular
                            ? 'text-stone-700 dark:text-stone-300 font-medium'
                            : 'opacity-75'
                        }`}
                      >
                        {cycleLabel}
                      </span>
                    </div>

                    {/* Resource Entitlements Highlights */}
                    {plan.entitlements && (
                      <div className="space-y-1.5 py-2 px-3 rounded-2xl bg-black/5 dark:bg-white/5 text-[11px] text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Headphones className="w-3.5 h-3.5 text-antique-gold shrink-0" aria-hidden="true" />
                          <span>
                            Audio AI:{' '}
                            <strong className="text-heritage-green dark:text-warm-ivory">
                              {plan.entitlements.maxAiAudioMinutesPerMonth >= 999
                                ? isVi ? 'Không giới hạn' : 'Unlimited'
                                : `${plan.entitlements.maxAiAudioMinutesPerMonth} ${isVi ? 'phút/tháng' : 'mins/mo'}`}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-antique-gold shrink-0" aria-hidden="true" />
                          <span>
                            {isVi ? 'Khung năng lực' : 'CEFR Level'}:{' '}
                            <strong className="text-heritage-green dark:text-warm-ivory">
                              {plan.entitlements.maxCefrLevelAccess}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5 text-antique-gold shrink-0" aria-hidden="true" />
                          <span>
                            {isVi ? 'Tải ngoại tuyến' : 'Offline Download'}:{' '}
                            <strong className="text-heritage-green dark:text-warm-ivory">
                              {plan.entitlements.offlineDownloadsAllowed
                                ? isVi ? 'Cho phép' : 'Yes'
                                : isVi ? 'Không' : 'No'}
                            </strong>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Feature Checklist */}
                    <ul className="space-y-3 text-xs">
                      {perks.map((feature, idx) => {
                        const isNegative =
                          feature.startsWith('Không có') || feature.startsWith('No ');

                        return (
                          <li key={idx} className="flex items-start gap-2.5 leading-snug">
                            {isNegative ? (
                              <X
                                className="w-4 h-4 text-rose-500/80 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                            ) : (
                              <Check
                                className={`w-4 h-4 shrink-0 mt-0.5 ${
                                  isPopular
                                    ? 'text-emerald-700 dark:text-antique-bright'
                                    : 'text-heritage-green dark:text-antique-gold'
                                }`}
                                aria-hidden="true"
                              />
                            )}
                            <span
                              className={
                                isNegative
                                  ? 'opacity-60'
                                  : isPopular
                                  ? 'text-stone-800 dark:text-warm-ivory font-medium'
                                  : 'opacity-90'
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* CTA Action Button */}
                  <div className="pt-6 mt-4 border-t border-line/50 dark:border-white/10 relative z-1">
                    {isFree ? (
                      <button
                        type="button"
                        onClick={() => handleSelectPlan()}
                        className="w-full min-h-[44px] py-3 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-serif font-bold text-xs sm:text-sm cursor-pointer hover:bg-stone-300 transition-colors text-center ring-2 focus-visible:ring-accent"
                      >
                        {!isPro
                          ? isVi
                            ? 'Bắt đầu miễn phí'
                            : 'Start Free'
                          : t('pricing.downgrade_btn')}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectPlan(plan.code.toLowerCase())}
                        className={`w-full min-h-[44px] py-3.5 rounded-2xl font-serif font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ring-2 focus-visible:ring-accent ${
                          isPopular
                            ? 'bg-gradient-to-r from-[#9E2A2B] to-[#7F1D1D] hover:from-[#852223] hover:to-[#6B1818] text-white border border-antique-bright/40 font-bold shadow-lg hover:shadow-xl'
                            : 'bg-heritage-green text-white hover:bg-heritage-dark'
                        }`}
                      >
                        <span>{isVi ? 'Đăng ký ngay' : 'Subscribe Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
            onClick={() => handleSelectPlan('starter')}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-sm ring-2 focus-visible:ring-accent"
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
