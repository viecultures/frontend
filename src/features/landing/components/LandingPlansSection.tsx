import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Check, X, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';
import { LandingConversionSection } from './LandingConversionSection';
import { subscriptionService } from '@/features/subscription/services/subscriptionService';
import type { SubscriptionPlanItem } from '@/features/admin/types/adminSubscriptionTypes';

interface LandingPlansSectionProps {
  onNavigate?: (view: string) => void;
}

export const LandingPlansSection: React.FC<LandingPlansSectionProps> = ({ onNavigate }) => {
  const { i18n } = useTranslation('subscription');
  const { t: tLanding } = useTranslation('landing');
  const isVi = i18n.language.startsWith('vi');

  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await subscriptionService.getActivePlans();
      // Sắp xếp theo thứ tự hiển thị sortOrder
      const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
      setPlans(sorted);
    } catch (err: unknown) {
      console.error('[LandingPlansSection] Lỗi khi tải danh sách gói cước:', err);
      setErrorMessage(
        isVi
          ? 'Không thể tải bảng giá từ máy chủ. Vui lòng thử lại.'
          : 'Unable to load pricing plans from server. Please retry.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isVi]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handlePlanClick = (plan: SubscriptionPlanItem) => {
    const isFree = plan.priceVnd === 0 || plan.code.toUpperCase() === 'FREE';
    if (isFree) {
      onNavigate?.(PATHS.discovery);
    } else {
      // Điều hướng đến trang thanh toán với mã gói cước hoặc trang pricing
      onNavigate?.(`${PATHS.checkout}?plan=${encodeURIComponent(plan.code.toLowerCase())}`);
    }
  };

  return (
    <section
      id="plans"
      className="landing-section landing-pricing bg-surface px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      aria-labelledby="landing-plans-title"
    >
      <div className="landing-container">
        {/* Tiêu đề & Giới thiệu Section */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-ink">
            {tLanding('plans_section.badge')}
          </p>
          <h2
            id="landing-plans-title"
            className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl"
          >
            {tLanding('plans_section.title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            {tLanding('plans_section.subtitle')}
          </p>
        </div>

        <LandingConversionSection />

        {/* State 1: Loading Skeleton */}
        {isLoading && (
          <div
            className="landing-pricing-cards grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-busy="true"
            aria-label="Đang tải danh sách gói cước"
          >
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="landing-pricing-card animate-pulse space-y-4 rounded-2xl border border-line p-6 bg-surface"
              >
                <div className="h-6 w-24 rounded-full bg-line/60" />
                <div className="h-8 w-3/4 rounded-lg bg-line/70" />
                <div className="h-12 w-full rounded-lg bg-line/40" />
                <div className="h-10 w-1/2 rounded-lg bg-line/60 my-4" />
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-full rounded bg-line/40" />
                  <div className="h-4 w-5/6 rounded bg-line/40" />
                  <div className="h-4 w-4/6 rounded bg-line/40" />
                </div>
                <div className="h-12 w-full rounded-xl bg-line/60 mt-6" />
              </div>
            ))}
          </div>
        )}

        {/* State 2: Error State */}
        {!isLoading && errorMessage && (
          <div
            role="alert"
            className="mx-auto max-w-xl my-8 p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-rose-700 dark:text-rose-300 font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={fetchPlans}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer shadow-sm ring-2 focus-visible:ring-accent"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isVi ? 'Tải lại dữ liệu' : 'Retry'}</span>
            </button>
          </div>
        )}

        {/* State 3: Empty State */}
        {!isLoading && !errorMessage && plans.length === 0 && (
          <div className="mx-auto max-w-md my-8 p-8 rounded-2xl border border-line bg-surface text-center space-y-4">
            <Sparkles className="w-8 h-8 text-antique-gold mx-auto" aria-hidden="true" />
            <p className="text-sm text-ink-soft">
              {isVi
                ? 'Hiện tại hệ thống đang cập nhật các gói cước mới. Vui lòng quay lại sau.'
                : 'Subscription plans are currently being updated. Please check back later.'}
            </p>
            <button
              type="button"
              onClick={() => onNavigate?.(PATHS.discovery)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer ring-2 focus-visible:ring-accent"
            >
              <span>{isVi ? 'Khám phá bài học miễn phí' : 'Explore Free Lessons'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/* State 4 & 5: Default & Interactive State */}
        {!isLoading && !errorMessage && plans.length > 0 && (
          <div
            className={`landing-pricing-cards grid gap-6 ${
              plans.length === 4
                ? 'md:grid-cols-2 lg:grid-cols-4'
                : plans.length === 3
                ? 'md:grid-cols-3'
                : 'md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {plans.map((plan) => {
              const effectivePrice = subscriptionService.calculateEffectivePrice(
                plan.priceVnd,
                plan.discountPercent
              );
              const hasDiscount = plan.discountPercent > 0;
              const isFeatured = Boolean(plan.isPopularBadge);
              const isFree = effectivePrice === 0 || plan.code.toUpperCase() === 'FREE';

              const title = isVi ? plan.nameVi : plan.nameEn || plan.nameVi;
              const perks = (isVi ? plan.perksVi : plan.perksEn) || plan.perksVi || [];
              const cycleLabel = subscriptionService.getBillingCycleLabel(plan.billingCycle, isVi);

              return (
                <article
                  key={plan.id}
                  className={`landing-pricing-card ${isFeatured ? 'is-featured' : ''} transition-all duration-150 hover:-translate-y-1 hover:shadow-xl`}
                >
                  {isFeatured && (
                    <span className="landing-pricing-featured-ribbon">
                      {isVi ? 'Phổ biến nhất' : 'Most Popular'}
                    </span>
                  )}

                  <div>
                    {!isFeatured && (
                      <span className="landing-pricing-card-badge">
                        {hasDiscount
                          ? `${isVi ? 'Giảm' : 'Save'} ${plan.discountPercent}%`
                          : plan.code}
                      </span>
                    )}

                    <h3>{title}</h3>

                    <p className="landing-pricing-card-description">
                      {plan.descriptionVi || plan.nameEn}
                    </p>

                    <div className="landing-pricing-card-price">
                      <span className="font-serif text-3xl font-extrabold text-heritage-forest dark:text-antique-bright">
                        {isFree ? (isVi ? 'Miễn phí' : 'Free') : subscriptionService.formatVnd(effectivePrice)}
                      </span>

                      {hasDiscount && (
                        <span className="landing-pricing-original-price">
                          {subscriptionService.formatVnd(plan.priceVnd)}
                        </span>
                      )}

                      <small className="block w-full text-xs text-ink-soft">
                        {cycleLabel}
                      </small>
                    </div>

                    <ul>
                      {perks.map((feature, index) => {
                        const isNegative =
                          feature.startsWith('Không có') || feature.startsWith('No ');
                        return (
                          <li key={index} className={isNegative ? 'is-unavailable' : ''}>
                            {isNegative ? (
                              <X size={17} aria-hidden="true" />
                            ) : (
                              <Check size={17} aria-hidden="true" />
                            )}
                            <span>{feature}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className="landing-pricing-card-button focus-ring cursor-pointer ring-2 focus-visible:ring-accent"
                    onClick={() => handlePlanClick(plan)}
                  >
                    <span>
                      {isFree
                        ? tLanding('plans_section.explore_free')
                        : isVi
                        ? 'Đăng ký gói ngay'
                        : tLanding('plans_section.view_plan')}
                    </span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default LandingPlansSection;
