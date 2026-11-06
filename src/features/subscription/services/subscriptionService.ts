import { API_BASE_URL } from '@/config/apiConfig';
import type { SubscriptionPlanItem } from '@/features/admin/types/adminSubscriptionTypes';

interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

export const FALLBACK_SUBSCRIPTION_PLANS: SubscriptionPlanItem[] = [
  {
    id: 'plan_fallback_free',
    code: 'FREE',
    nameVi: 'Miễn phí trải nghiệm',
    nameEn: 'Cultural Explorer (Free)',
    descriptionVi: 'Dành cho người mới bắt đầu tìm hiểu văn hóa Việt Nam qua các bài đọc cơ bản',
    priceVnd: 0,
    discountPercent: 0,
    billingCycle: 'MONTHLY',
    isActive: true,
    isPopularBadge: false,
    sortOrder: 1,
    entitlements: {
      maxAiAudioMinutesPerMonth: 15,
      maxCefrLevelAccess: 'B1',
      unlimitedJourneys: false,
      offlineDownloadsAllowed: false,
      highlightBadge: false,
    },
    perksVi: [
      'Truy cập bài đọc CEFR A1 - B1',
      '15 phút nghe Audio Shadowing AI/tháng',
      'Luyện tập từ vựng & Flashcards cơ bản',
    ],
    perksEn: [
      'Access CEFR A1 - B1 readings',
      '15 mins AI Audio Shadowing/month',
      'Basic Flashcards & Vocab practice',
    ],
  },
  {
    id: 'plan_fallback_starter',
    code: 'STARTER',
    nameVi: 'Di sản Khởi hành',
    nameEn: 'Heritage Starter',
    descriptionVi: 'Mở rộng vốn từ vựng học thuật và phản xạ tiếng Anh qua các chủ đề địa phương',
    priceVnd: 99000,
    discountPercent: 0,
    billingCycle: 'MONTHLY',
    isActive: true,
    isPopularBadge: false,
    sortOrder: 2,
    entitlements: {
      maxAiAudioMinutesPerMonth: 60,
      maxCefrLevelAccess: 'B2',
      unlimitedJourneys: true,
      offlineDownloadsAllowed: false,
      highlightBadge: false,
    },
    perksVi: [
      'Mở khóa bài đọc chuyên sâu tới CEFR B2',
      '60 phút nghe giọng đọc AI Azure & Gemini',
      'Truy cập toàn bộ bản đồ hành trình văn hóa',
      'Theo dõi streak và nhật ký phản tư chuyên sâu',
    ],
    perksEn: [
      'Unlock readings up to CEFR B2',
      '60 mins Azure & Gemini AI Voice',
      'Full access to Cultural Journeys',
      'Deep reflection logs & Streak tracking',
    ],
  },
  {
    id: 'plan_fallback_pro',
    code: 'PRO',
    nameVi: 'Di sản Toàn diện (Pro)',
    nameEn: 'Heritage Scholar (Pro)',
    descriptionVi: 'Lựa chọn phổ biến nhất dành cho người học chuyên sâu, du học sinh và giảng viên',
    priceVnd: 199000,
    discountPercent: 15,
    billingCycle: 'MONTHLY',
    isActive: true,
    isPopularBadge: true,
    sortOrder: 3,
    entitlements: {
      maxAiAudioMinutesPerMonth: 180,
      maxCefrLevelAccess: 'C2',
      unlimitedJourneys: true,
      offlineDownloadsAllowed: true,
      highlightBadge: true,
    },
    perksVi: [
      'Mở khóa toàn bộ bài đọc học thuật C1 - C2',
      '180 phút Audio AI giọng đọc tự nhiên',
      'Tải tài liệu song ngữ & flashcards ngoại tuyến',
      'AI Companion trò chuyện tương tác không giới hạn',
      'Huy hiệu Học giả Di sản trên hồ sơ cá nhân',
    ],
    perksEn: [
      'Unlock all academic C1 - C2 readings',
      '180 mins Natural AI Audio Voice',
      'Offline downloads for bilingual texts & flashcards',
      'Unlimited AI Companion conversations',
      'Heritage Scholar Badge on profile',
    ],
  },
  {
    id: 'plan_fallback_lifetime',
    code: 'LIFETIME',
    nameVi: 'Học giả Trọn đời',
    nameEn: 'Heritage Master (Lifetime)',
    descriptionVi: 'Đầu tư một lần, sở hữu vĩnh viễn toàn bộ kho tàng tri thức và tính năng tương lai',
    priceVnd: 1490000,
    discountPercent: 25,
    billingCycle: 'ONE_TIME',
    isActive: true,
    isPopularBadge: false,
    sortOrder: 4,
    entitlements: {
      maxAiAudioMinutesPerMonth: 999,
      maxCefrLevelAccess: 'C2',
      unlimitedJourneys: true,
      offlineDownloadsAllowed: true,
      highlightBadge: true,
    },
    perksVi: [
      'Sở hữu trọn đời không cần gia hạn',
      'Không giới hạn toàn bộ bài đọc và hành trình',
      'Hạn ngạch AI Audio cao cấp tối đa',
      'Ưu tiên quyền truy cập các tính năng AI mới sớm nhất',
      'Huy hiệu Tinh hoa Di sản vĩnh viễn',
    ],
    perksEn: [
      'Lifetime access with no renewal required',
      'Unlimited readings & cultural journeys',
      'Premium AI Audio quota',
      'Early priority access to new AI capabilities',
      'Lifetime Heritage Elite Badge',
    ],
  },
];

export const subscriptionService = {
  /**
   * Lấy danh sách các gói cước đang mở bán từ cơ sở dữ liệu
   */
  async getActivePlans(): Promise<SubscriptionPlanItem[]> {
    try {
      const url = `${API_BASE_URL}/api/v1/subscriptions/plans`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Không thể tải danh sách gói cước (HTTP ${res.status})`);
      }

      const json: ApiResponseEnvelope<SubscriptionPlanItem[]> = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
      return FALLBACK_SUBSCRIPTION_PLANS;
    } catch (error) {
      console.warn('[subscriptionService.getActivePlans] Không thể kết nối API gói cước, sử dụng fallback cấu hình:', error);
      return FALLBACK_SUBSCRIPTION_PLANS;
    }
  },

  /**
   * Tính giá thực tế sau khi áp dụng chiết khấu
   */
  calculateEffectivePrice(priceVnd: number, discountPercent: number = 0): number {
    if (!priceVnd || priceVnd <= 0) return 0;
    if (!discountPercent || discountPercent <= 0) return priceVnd;
    return Math.round(priceVnd * (1 - discountPercent / 100));
  },

  /**
   * Định dạng tiền VNĐ chuẩn giao diện
   */
  formatVnd(amount: number): string {
    if (!amount || amount <= 0) return '0 đ';
    return `${amount.toLocaleString('vi-VN')} đ`;
  },

  /**
   * Chu kỳ hiển thị theo ngôn ngữ
   */
  getBillingCycleLabel(cycle: string, isVi: boolean): string {
    const cycleUpper = (cycle || 'MONTHLY').toUpperCase();
    if (isVi) {
      switch (cycleUpper) {
        case 'QUARTERLY':
          return '/ 3 tháng';
        case 'ANNUAL':
          return '/ năm';
        case 'ONE_TIME':
          return 'trọn đời';
        case 'MONTHLY':
        default:
          return '/ tháng';
      }
    } else {
      switch (cycleUpper) {
        case 'QUARTERLY':
          return '/ 3 months';
        case 'ANNUAL':
          return '/ year';
        case 'ONE_TIME':
          return 'lifetime';
        case 'MONTHLY':
        default:
          return '/ month';
      }
    }
  },
};
