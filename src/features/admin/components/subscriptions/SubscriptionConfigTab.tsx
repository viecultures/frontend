import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  RefreshCw,
  Edit,
  Check,
  X,
  CreditCard,
  Sparkles,
  Headphones,
  BookOpen,
  Download,
  Compass,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { SubscriptionPlanItem, BillingCycle } from '../../types/adminSubscriptionTypes';
import { adminSubscriptionService } from '../../services/adminSubscriptionService';
import { SubscriptionPlanModal } from './SubscriptionPlanModal';

const BILLING_CYCLE_DISPLAY: Record<BillingCycle, string> = {
  MONTHLY: 'Hàng tháng',
  QUARTERLY: '3 tháng',
  ANNUAL: 'Hàng năm',
  ONE_TIME: 'Trọn đời',
};

export const SubscriptionConfigTab: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanItem | null>(null);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await adminSubscriptionService.getPlans();
      setPlans(data);
    } catch (err: unknown) {
      console.error('[SubscriptionConfigTab] Lỗi khi tải danh sách gói cước:', err);
      setErrorMsg('Không thể tải danh sách gói cước. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleOpenCreate = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: SubscriptionPlanItem) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSavePlan = async (savedPlan: SubscriptionPlanItem) => {
    try {
      await adminSubscriptionService.savePlan(savedPlan);
      setSuccessToast(
        selectedPlan
          ? `Đã cập nhật cấu hình gói [${savedPlan.nameVi}] thành công.`
          : `Đã tạo mới gói cước [${savedPlan.nameVi}] thành công.`
      );
      await loadPlans();
    } catch (err: unknown) {
      console.error('[SubscriptionConfigTab] Lỗi khi lưu gói cước:', err);
      throw err;
    }
  };

  const handleToggleStatus = async (plan: SubscriptionPlanItem) => {
    try {
      const updated = await adminSubscriptionService.togglePlanStatus(plan.id);
      setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSuccessToast(
        `Đã ${updated.isActive ? 'kích hoạt' : 'tạm dừng'} gói cước [${updated.nameVi}].`
      );
    } catch (err: unknown) {
      console.error('[SubscriptionConfigTab] Lỗi khi bật/tắt trạng thái gói cước:', err);
      setErrorMsg('Không thể cập nhật trạng thái gói cước');
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-lg text-heritage-green dark:text-antique-bright">
              Cấu hình các Gói đăng ký hội viên
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-heritage-green/10 dark:bg-antique-gold/20 text-heritage-green dark:text-antique-bright">
              {plans.length} gói
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Thiết lập biểu phí, thời hạn chu kỳ, quyền lợi và hạn ngạch AI audio cho các cấp độ thành viên.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadPlans}
            disabled={isLoading}
            className="p-2 rounded-xl border border-antique-gold/30 text-heritage-green dark:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            title="Làm mới danh sách"
            aria-label="Làm mới danh sách gói cước"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-antique-gold text-heritage-dark hover:bg-antique-bright text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Thêm gói cước mới</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {successToast && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Plan Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-rice-paper/60 dark:bg-heritage-dark/40 border border-antique-gold/20 animate-pulse space-y-4"
            >
              <div className="h-6 bg-antique-gold/20 rounded w-1/2" />
              <div className="h-10 bg-antique-gold/20 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-antique-gold/10 rounded w-full" />
                <div className="h-4 bg-antique-gold/10 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-rice-paper/40 dark:bg-heritage-dark/30 border border-dashed border-antique-gold/30 space-y-3">
          <CreditCard className="w-10 h-10 text-antique-gold mx-auto" aria-hidden="true" />
          <p className="text-sm font-heading font-semibold text-heritage-green dark:text-warm-ivory">
            Chưa có gói cước nào được thiết lập
          </p>
          <p className="text-xs text-text-muted">
            Bấm vào &quot;Thêm gói cước mới&quot; để tạo bảng giá đầu tiên cho học viên.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const effectivePrice = Math.round(plan.priceVnd * (1 - plan.discountPercent / 100));
            const hasDiscount = plan.discountPercent > 0;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                  plan.isPopularBadge
                    ? 'bg-gradient-to-b from-rice-paper via-warm-ivory to-rice-paper dark:from-heritage-dark dark:via-heritage-forest dark:to-heritage-dark border-antique-gold shadow-antique-gold/10'
                    : 'bg-rice-paper dark:bg-heritage-dark/60 border-antique-gold/30'
                } ${!plan.isActive ? 'opacity-70 grayscale-[30%]' : ''}`}
              >
                {/* Popular Badge */}
                {plan.isPopularBadge && (
                  <div className="bg-antique-gold text-heritage-dark text-[11px] font-extrabold uppercase tracking-wider py-1 text-center flex items-center justify-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Phổ biến nhất</span>
                  </div>
                )}

                <div className="p-6 space-y-5 flex-1 flex flex-col">
                  {/* Header: Name & Code */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono tracking-wider bg-heritage-green/10 dark:bg-antique-gold/15 text-heritage-green dark:text-antique-bright">
                        {plan.code}
                      </span>
                      <span className="text-[11px] font-medium text-text-muted">
                        {BILLING_CYCLE_DISPLAY[plan.billingCycle]}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-heritage-green dark:text-antique-bright">
                      {plan.nameVi}
                    </h3>
                    <p className="text-xs text-text-muted italic">{plan.nameEn}</p>
                    <p className="text-xs text-text-secondary line-clamp-2 pt-1">
                      {plan.descriptionVi}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="p-4 rounded-2xl bg-warm-ivory/80 dark:bg-heritage-forest/60 border border-antique-gold/20 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                        {effectivePrice === 0 ? '0 đ' : `${effectivePrice.toLocaleString('vi-VN')} đ`}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-text-muted line-through">
                          {plan.priceVnd.toLocaleString('vi-VN')} đ
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <div className="inline-block px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                        Tiết kiệm {plan.discountPercent}%
                      </div>
                    )}
                  </div>

                  {/* Resource Entitlements */}
                  <div className="space-y-2 pt-1 border-t border-antique-gold/20 text-xs">
                    <div className="text-[11px] font-bold text-heritage-green dark:text-antique-gold uppercase tracking-wider">
                      Hạn ngạch tài nguyên:
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary">
                      <Headphones className="w-3.5 h-3.5 text-antique-gold shrink-0" aria-hidden="true" />
                      <span>
                        Audio AI:{' '}
                        <strong className="text-heritage-green dark:text-warm-ivory">
                          {plan.entitlements.maxAiAudioMinutesPerMonth >= 9999
                            ? 'Không giới hạn'
                            : `${plan.entitlements.maxAiAudioMinutesPerMonth} phút/tháng`}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary">
                      <BookOpen className="w-3.5 h-3.5 text-antique-gold shrink-0" aria-hidden="true" />
                      <span>
                        Khung năng lực:{' '}
                        <strong className="text-heritage-green dark:text-warm-ivory">
                          Tối đa {plan.entitlements.maxCefrLevelAccess}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary">
                      <Compass className="w-3.5 h-3.5 text-antique-gold shrink-0" aria-hidden="true" />
                      <span>
                        Hành trình:{' '}
                        <strong className="text-heritage-green dark:text-warm-ivory">
                          {plan.entitlements.unlimitedJourneys ? 'Không giới hạn' : 'Giới hạn'}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary">
                      <Download className="w-3.5 h-3.5 text-antique-gold shrink-0" aria-hidden="true" />
                      <span>
                        Tải ngoại tuyến:{' '}
                        <strong className="text-heritage-green dark:text-warm-ivory">
                          {plan.entitlements.offlineDownloadsAllowed ? 'Cho phép' : 'Không'}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Perks List */}
                  <div className="space-y-2 pt-2 border-t border-antique-gold/20 flex-1">
                    <div className="text-[11px] font-bold text-heritage-green dark:text-antique-gold uppercase tracking-wider">
                      Quyền lợi nổi bật:
                    </div>
                    <ul className="space-y-1.5 text-xs text-text-secondary">
                      {plan.perksVi.map((perk, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="leading-tight">{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Controls: Toggle & Edit */}
                <div className="p-4 bg-rice-paper/90 dark:bg-heritage-forest/90 border-t border-antique-gold/20 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(plan)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-heritage-green dark:hover:text-warm-ivory transition-colors cursor-pointer"
                    title={plan.isActive ? 'Tạm ngưng gói này' : 'Kích hoạt mở bán gói này'}
                  >
                    {plan.isActive ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span className="text-emerald-700 dark:text-emerald-300">Đang bán</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-text-muted" aria-hidden="true" />
                        <span className="text-text-muted">Tạm ngưng</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(plan)}
                    className="px-3 py-1.5 rounded-xl border border-antique-gold/40 hover:bg-antique-gold/10 text-heritage-green dark:text-antique-bright text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Chỉnh sửa</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Form Modal */}
      <SubscriptionPlanModal
        isOpen={isModalOpen}
        plan={selectedPlan}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
      />
    </div>
  );
};
