import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Headphones,
  BookOpen,
} from 'lucide-react';
import type {
  SubscriptionPlanItem,
  SubscriptionTierCode,
  BillingCycle,
  PlanFeatureEntitlements,
} from '../../types/adminSubscriptionTypes';

interface SubscriptionPlanModalProps {
  isOpen: boolean;
  plan: SubscriptionPlanItem | null;
  onClose: () => void;
  onSave: (savedPlan: SubscriptionPlanItem) => Promise<void> | void;
}

const DEFAULT_ENTITLEMENTS: PlanFeatureEntitlements = {
  maxAiAudioMinutesPerMonth: 60,
  maxCefrLevelAccess: 'B1',
  unlimitedJourneys: false,
  offlineDownloadsAllowed: false,
  highlightBadge: false,
};

const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  MONTHLY: 'Hàng tháng',
  QUARTERLY: 'Hàng quý (3 tháng)',
  ANNUAL: 'Hàng năm (12 tháng)',
  ONE_TIME: 'Thanh toán 1 lần (Trọn đời)',
};

const CEFR_LEVELS: Array<'A2' | 'B1' | 'B2' | 'C1' | 'C2'> = ['A2', 'B1', 'B2', 'C1', 'C2'];

export const SubscriptionPlanModal: React.FC<SubscriptionPlanModalProps> = ({
  isOpen,
  plan,
  onClose,
  onSave,
}) => {
  const [code, setCode] = useState<SubscriptionTierCode>('STARTER');
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionVi, setDescriptionVi] = useState('');
  const [priceVnd, setPriceVnd] = useState<number>(99000);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isPopularBadge, setIsPopularBadge] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<number>(1);

  // Entitlements
  const [maxAiAudioMinutes, setMaxAiAudioMinutes] = useState<number>(60);
  const [maxCefrLevel, setMaxCefrLevel] = useState<'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('B1');
  const [unlimitedJourneys, setUnlimitedJourneys] = useState<boolean>(false);
  const [offlineDownloadsAllowed, setOfflineDownloadsAllowed] = useState<boolean>(false);
  const [highlightBadge, setHighlightBadge] = useState<boolean>(false);

  // Perks
  const [perksVi, setPerksVi] = useState<string[]>([]);
  const [newPerkInput, setNewPerkInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (plan) {
      setCode(plan.code);
      setNameVi(plan.nameVi);
      setNameEn(plan.nameEn);
      setDescriptionVi(plan.descriptionVi);
      setPriceVnd(plan.priceVnd);
      setDiscountPercent(plan.discountPercent);
      setBillingCycle(plan.billingCycle);
      setIsActive(plan.isActive);
      setIsPopularBadge(plan.isPopularBadge);
      setSortOrder(plan.sortOrder);

      setMaxAiAudioMinutes(plan.entitlements.maxAiAudioMinutesPerMonth);
      setMaxCefrLevel(plan.entitlements.maxCefrLevelAccess);
      setUnlimitedJourneys(plan.entitlements.unlimitedJourneys);
      setOfflineDownloadsAllowed(plan.entitlements.offlineDownloadsAllowed);
      setHighlightBadge(plan.entitlements.highlightBadge);

      setPerksVi([...plan.perksVi]);
    } else {
      setCode('STARTER');
      setNameVi('');
      setNameEn('');
      setDescriptionVi('');
      setPriceVnd(99000);
      setDiscountPercent(0);
      setBillingCycle('MONTHLY');
      setIsActive(true);
      setIsPopularBadge(false);
      setSortOrder(1);

      setMaxAiAudioMinutes(DEFAULT_ENTITLEMENTS.maxAiAudioMinutesPerMonth);
      setMaxCefrLevel(DEFAULT_ENTITLEMENTS.maxCefrLevelAccess);
      setUnlimitedJourneys(DEFAULT_ENTITLEMENTS.unlimitedJourneys);
      setOfflineDownloadsAllowed(DEFAULT_ENTITLEMENTS.offlineDownloadsAllowed);
      setHighlightBadge(DEFAULT_ENTITLEMENTS.highlightBadge);

      setPerksVi([]);
    }
    setNewPerkInput('');
    setErrorMessage(null);
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const handleAddPerk = () => {
    const trimmed = newPerkInput.trim();
    if (!trimmed) return;
    if (perksVi.includes(trimmed)) {
      setErrorMessage('Quyền lợi này đã tồn tại trong danh sách');
      return;
    }
    setPerksVi((prev) => [...prev, trimmed]);
    setNewPerkInput('');
    setErrorMessage(null);
  };

  const handleRemovePerk = (index: number) => {
    setPerksVi((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nameVi.trim()) {
      setErrorMessage('Vui lòng nhập tên gói cước tiếng Việt');
      return;
    }

    if (priceVnd < 0) {
      setErrorMessage('Giá gói cước không được là số âm');
      return;
    }

    if (discountPercent < 0 || discountPercent > 100) {
      setErrorMessage('Phần trăm giảm giá phải từ 0% đến 100%');
      return;
    }

    const payload: SubscriptionPlanItem = {
      id: plan ? plan.id : `plan-${code.toLowerCase()}-${Date.now()}`,
      code,
      nameVi: nameVi.trim(),
      nameEn: nameEn.trim() || nameVi.trim(),
      descriptionVi: descriptionVi.trim(),
      priceVnd: Number(priceVnd),
      discountPercent: Number(discountPercent),
      billingCycle,
      isActive,
      isPopularBadge,
      sortOrder: Number(sortOrder),
      entitlements: {
        maxAiAudioMinutesPerMonth: Number(maxAiAudioMinutes),
        maxCefrLevelAccess: maxCefrLevel,
        unlimitedJourneys,
        offlineDownloadsAllowed,
        highlightBadge,
      },
      perksVi,
      perksEn: plan ? plan.perksEn : [],
    };

    setIsSubmitting(true);
    try {
      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      console.error('[SubscriptionPlanModal] Lỗi khi lưu gói cước:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu thông tin gói cước'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectivePrice = Math.round(priceVnd * (1 - discountPercent / 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/40 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl my-auto animate-fadeIn">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-antique-gold/20 flex items-center justify-between bg-rice-paper/80 dark:bg-heritage-forest/80 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-heritage-green/10 dark:bg-antique-gold/10 text-heritage-green dark:text-antique-bright">
              <CreditCard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="plan-modal-title"
                className="font-heading font-bold text-lg text-heritage-green dark:text-antique-bright"
              >
                {plan ? 'Chỉnh sửa gói cước' : 'Thêm gói cước mới'}
              </h2>
              <p className="text-xs text-text-muted">
                {plan
                  ? `Cập nhật cấu hình định giá và hạn ngạch cho mã [${plan.code}]`
                  : 'Thiết lập gói hội viên di sản mới cho học viên'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-heritage-green dark:hover:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2 pb-1 border-b border-antique-gold/20">
              <Sparkles className="w-4 h-4 text-antique-gold" aria-hidden="true" />
              <span>Thông tin định danh gói</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Mã phân hạng (Tier Code) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={code}
                  onChange={(e) => setCode(e.target.value as SubscriptionTierCode)}
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                >
                  <option value="FREE">FREE - Miễn phí cơ bản</option>
                  <option value="STARTER">STARTER - Di sản Khởi hành</option>
                  <option value="PRO">PRO - Di sản Toàn diện</option>
                  <option value="LIFETIME">LIFETIME - Học giả Trọn đời</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Thứ tự hiển thị
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Tên gói Tiếng Việt <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Di sản Toàn diện"
                  value={nameVi}
                  onChange={(e) => setNameVi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Tên gói Tiếng Anh
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Heritage Pro"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Mô tả ngắn gọn
              </label>
              <textarea
                rows={2}
                placeholder="Mô tả mục tiêu và đối tượng hướng đến của gói cước..."
                value={descriptionVi}
                onChange={(e) => setDescriptionVi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50 resize-none"
              />
            </div>
          </div>

          {/* Section 2: Định giá & Chu kỳ */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2 pb-1 border-b border-antique-gold/20">
              <CreditCard className="w-4 h-4 text-antique-gold" aria-hidden="true" />
              <span>Định giá & Chu kỳ thanh toán</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Giá niêm yết (VND) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={priceVnd}
                  onChange={(e) => setPriceVnd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Giá thực thu
                </label>
                <div className="w-full px-3 py-2 rounded-xl border border-antique-gold/20 bg-warm-ivory/60 dark:bg-heritage-forest/30 text-heritage-green dark:text-antique-bright text-xs font-bold flex items-center">
                  {effectivePrice.toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Chu kỳ thanh toán
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
              >
                {(Object.keys(BILLING_CYCLE_LABELS) as BillingCycle[]).map((cycle) => (
                  <option key={cycle} value={cycle}>
                    {BILLING_CYCLE_LABELS[cycle]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-heritage-green dark:text-warm-ivory">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-antique-gold/50 text-heritage-green focus:ring-antique-gold"
                />
                <span>Kích hoạt gói công khai (cho phép người dùng đăng ký)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-heritage-green dark:text-warm-ivory">
                <input
                  type="checkbox"
                  checked={isPopularBadge}
                  onChange={(e) => setIsPopularBadge(e.target.checked)}
                  className="w-4 h-4 rounded border-antique-gold/50 text-heritage-green focus:ring-antique-gold"
                />
                <span className="text-amber-700 dark:text-antique-gold font-semibold">
                  Gắn nhãn nổi bật &quot;Phổ biến nhất&quot;
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Hạn ngạch tài nguyên (Entitlements) */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2 pb-1 border-b border-antique-gold/20">
              <ShieldCheck className="w-4 h-4 text-antique-gold" aria-hidden="true" />
              <span>Hạn ngạch tính năng & Tài nguyên học tập</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-antique-gold" aria-hidden="true" />
                  <span>Phút Audio AI mỗi tháng</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={maxAiAudioMinutes}
                  onChange={(e) => setMaxAiAudioMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                />
                <span className="text-[10px] text-text-muted mt-1 block">
                  Nhập 9999 để coi như không giới hạn phút nghe.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-antique-gold" aria-hidden="true" />
                  <span>Cấp độ CEFR tối đa</span>
                </label>
                <select
                  value={maxCefrLevel}
                  onChange={(e) =>
                    setMaxCefrLevel(e.target.value as 'A2' | 'B1' | 'B2' | 'C1' | 'C2')
                  }
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50 font-semibold"
                >
                  {CEFR_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Cấp độ {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={unlimitedJourneys}
                  onChange={(e) => setUnlimitedJourneys(e.target.checked)}
                  className="w-4 h-4 rounded border-antique-gold/50 text-heritage-green focus:ring-antique-gold"
                />
                <span>Mở khóa không giới hạn hành trình học đồng thời</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={offlineDownloadsAllowed}
                  onChange={(e) => setOfflineDownloadsAllowed(e.target.checked)}
                  className="w-4 h-4 rounded border-antique-gold/50 text-heritage-green focus:ring-antique-gold"
                />
                <span>Cho phép tải học liệu và bài học về máy để dùng ngoại tuyến</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={highlightBadge}
                  onChange={(e) => setHighlightBadge(e.target.checked)}
                  className="w-4 h-4 rounded border-antique-gold/50 text-heritage-green focus:ring-antique-gold"
                />
                <span>Huy hiệu thành viên Di sản nổi bật trong diễn đàn cộng đồng</span>
              </label>
            </div>
          </div>

          {/* Section 4: Danh sách quyền lợi (Perks) */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center justify-between pb-1 border-b border-antique-gold/20">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-antique-gold" aria-hidden="true" />
                <span>Quyền lợi hiển thị trên thẻ giá</span>
              </span>
              <span className="text-xs font-normal text-text-muted">
                {perksVi.length} quyền lợi
              </span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Thêm quyền lợi mới (ví dụ: '300 phút nghe AI audio')..."
                value={newPerkInput}
                onChange={(e) => setNewPerkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPerk();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
              />
              <button
                type="button"
                onClick={handleAddPerk}
                className="px-3.5 py-2 rounded-xl bg-heritage-green text-warm-ivory hover:bg-heritage-dark text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Thêm</span>
              </button>
            </div>

            {perksVi.length > 0 ? (
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {perksVi.map((perk, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-rice-paper/60 dark:bg-heritage-forest/40 border border-antique-gold/20 text-xs text-heritage-green dark:text-warm-ivory"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">{perk}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePerk(index)}
                      className="p-1 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                      aria-label={`Xóa quyền lợi ${perk}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-muted italic py-1">
                Chưa có quyền lợi nào được thêm. Hãy nhập ở trên để thêm điểm nổi bật cho gói cước.
              </p>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-antique-gold/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-antique-gold/30 text-xs font-semibold text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-antique-gold text-heritage-dark hover:bg-antique-bright text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>{isSubmitting ? 'Đang lưu...' : plan ? 'Lưu thay đổi' : 'Tạo gói mới'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
