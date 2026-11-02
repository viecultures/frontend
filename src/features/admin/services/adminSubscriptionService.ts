import type {
  SubscriptionPlanItem,
  SubscriptionTransactionItem,
  SubscriptionMetricsStats,
  SubscriptionTierCode,
} from '../types/adminSubscriptionTypes';

const PLANS_STORAGE_KEY = 'vc_admin_subscription_plans';
const TRANSACTIONS_STORAGE_KEY = 'vc_admin_subscription_transactions';

const DEFAULT_PLANS: SubscriptionPlanItem[] = [
  {
    id: 'plan-free',
    code: 'FREE',
    nameVi: 'Miễn phí',
    nameEn: 'Free',
    descriptionVi: 'Trải nghiệm tìm hiểu văn hóa Việt Nam cơ bản với giới hạn tính năng.',
    priceVnd: 0,
    discountPercent: 0,
    billingCycle: 'MONTHLY',
    isActive: true,
    isPopularBadge: false,
    sortOrder: 1,
    entitlements: {
      maxAiAudioMinutesPerMonth: 15,
      maxCefrLevelAccess: 'A2',
      unlimitedJourneys: false,
      offlineDownloadsAllowed: false,
      highlightBadge: false,
    },
    perksVi: [
      '15 phút nghe AI audio mỗi tháng',
      'Truy cập bài đọc CEFR A2',
      '1 hành trình văn hóa đồng thời',
    ],
    perksEn: [
      '15 minutes AI audio/month',
      'CEFR A2 reading access',
      '1 active cultural journey',
    ],
  },
  {
    id: 'plan-starter',
    code: 'STARTER',
    nameVi: 'Di sản Khởi hành',
    nameEn: 'Heritage Starter',
    descriptionVi: 'Dành cho người mới bắt đầu hành trình khám phá văn hóa có bài bản.',
    priceVnd: 99000,
    discountPercent: 0,
    billingCycle: 'MONTHLY',
    isActive: true,
    isPopularBadge: false,
    sortOrder: 2,
    entitlements: {
      maxAiAudioMinutesPerMonth: 60,
      maxCefrLevelAccess: 'B1',
      unlimitedJourneys: false,
      offlineDownloadsAllowed: false,
      highlightBadge: false,
    },
    perksVi: [
      '60 phút nghe AI audio mỗi tháng',
      'Truy cập bài đọc CEFR A2 - B1',
      'Lưu từ vựng không giới hạn',
      'Hỗ trợ phát âm cơ bản',
    ],
    perksEn: [
      '60 minutes AI audio/month',
      'CEFR A2 - B1 reading access',
      'Unlimited vocabulary flashcards',
      'Basic pronunciation assist',
    ],
  },
  {
    id: 'plan-pro',
    code: 'PRO',
    nameVi: 'Di sản Toàn diện',
    nameEn: 'Heritage Pro',
    descriptionVi: 'Mở khóa toàn bộ kho tàng văn hóa, giọng đọc AI song ngữ và bài học chuyên sâu.',
    priceVnd: 199000,
    discountPercent: 15,
    billingCycle: 'MONTHLY',
    isActive: true,
    isPopularBadge: true,
    sortOrder: 3,
    entitlements: {
      maxAiAudioMinutesPerMonth: 300,
      maxCefrLevelAccess: 'C1',
      unlimitedJourneys: true,
      offlineDownloadsAllowed: true,
      highlightBadge: true,
    },
    perksVi: [
      '300 phút giọng đọc AI song ngữ cao cấp',
      'Mở khóa toàn bộ CEFR tới C1',
      'Không giới hạn hành trình học',
      'Tải tài liệu và phát âm ngoại tuyến',
      'Huy hiệu thành viên Di sản',
    ],
    perksEn: [
      '300 minutes premium bilingual AI audio',
      'Full CEFR access up to C1',
      'Unlimited learning journeys',
      'Offline reading and pronunciation packs',
      'Heritage Member badge',
    ],
  },
  {
    id: 'plan-lifetime',
    code: 'LIFETIME',
    nameVi: 'Học giả Trọn đời',
    nameEn: 'Heritage Scholar Lifetime',
    descriptionVi: 'Đầu tư một lần, sở hữu vĩnh viễn toàn bộ tính năng và quyền lợi VIP trọn đời.',
    priceVnd: 1490000,
    discountPercent: 25,
    billingCycle: 'ONE_TIME',
    isActive: true,
    isPopularBadge: false,
    sortOrder: 4,
    entitlements: {
      maxAiAudioMinutesPerMonth: 9999,
      maxCefrLevelAccess: 'C2',
      unlimitedJourneys: true,
      offlineDownloadsAllowed: true,
      highlightBadge: true,
    },
    perksVi: [
      'Quyền truy cập vĩnh viễn không giới hạn thời gian',
      'AI audio không giới hạn thời lượng',
      'Cấp độ cao nhất CEFR C2',
      'Tham gia cộng đồng học giả cố vấn',
      'Ưu tiên hỗ trợ 1:1',
    ],
    perksEn: [
      'Permanent lifetime access without renewal',
      'Unlimited AI audio narration',
      'Highest CEFR C2 access',
      'Direct invitation to Scholar Advisory Circle',
      'Priority 1-on-1 support',
    ],
  },
];

const DEFAULT_TRANSACTIONS: SubscriptionTransactionItem[] = [
  {
    id: 'tx-001',
    transactionCode: 'VC-TX-90214',
    userEmail: 'nguyen.anh@culture.vn',
    userName: 'Nguyen Tuan Anh',
    planCode: 'PRO',
    planName: 'Di sản Toàn diện',
    amountVnd: 199000,
    transferContent: 'VC90214 NGUYEN TUAN ANH',
    status: 'PENDING',
    createdAt: '2026-11-02T08:30:00.000Z',
  },
  {
    id: 'tx-002',
    transactionCode: 'VC-TX-90215',
    userEmail: 'le.hoa@heritage.edu.vn',
    userName: 'Le Thi Hoa',
    planCode: 'LIFETIME',
    planName: 'Học giả Trọn đời',
    amountVnd: 1490000,
    transferContent: 'VC90215 LE THI HOA LIFETIME',
    status: 'PENDING',
    createdAt: '2026-11-02T09:15:00.000Z',
  },
  {
    id: 'tx-003',
    transactionCode: 'VC-TX-90198',
    userEmail: 'tran.minh@hcmus.edu.vn',
    userName: 'Tran Quang Minh',
    planCode: 'PRO',
    planName: 'Di sản Toàn diện',
    amountVnd: 199000,
    transferContent: 'VC90198 TRAN QUANG MINH',
    status: 'APPROVED',
    note: 'Xác nhận chuyển khoản qua Techcombank',
    createdAt: '2026-11-01T14:20:00.000Z',
    approvedAt: '2026-11-01T14:45:00.000Z',
  },
  {
    id: 'tx-004',
    transactionCode: 'VC-TX-90180',
    userEmail: 'pham.thu@danang.gov.vn',
    userName: 'Pham Ngoc Thu',
    planCode: 'STARTER',
    planName: 'Di sản Khởi hành',
    amountVnd: 99000,
    transferContent: 'VC90180 PHAM NGOC THU',
    status: 'APPROVED',
    note: 'Khớp lệnh tự động qua cổng thanh toán VietQR',
    createdAt: '2026-10-31T10:05:00.000Z',
    approvedAt: '2026-10-31T10:10:00.000Z',
  },
  {
    id: 'tx-005',
    transactionCode: 'VC-TX-90172',
    userEmail: 'hoang.nam@gmail.com',
    userName: 'Hoang Van Nam',
    planCode: 'PRO',
    planName: 'Di sản Toàn diện',
    amountVnd: 199000,
    transferContent: 'VC90172 SAI SO TIEN',
    status: 'REJECTED',
    note: 'Số tiền chuyển khoản không khớp với giá gói cước (chỉ chuyển 100.000đ)',
    createdAt: '2026-10-30T16:40:00.000Z',
  },
  {
    id: 'tx-006',
    transactionCode: 'VC-TX-90165',
    userEmail: 'doan.linh@vietart.com',
    userName: 'Doan Khanh Linh',
    planCode: 'LIFETIME',
    planName: 'Học giả Trọn đời',
    amountVnd: 1490000,
    transferContent: 'VC90165 DOAN KHANH LINH',
    status: 'APPROVED',
    note: 'Kiểm tra giao dịch thành công tại quầy BIDV',
    createdAt: '2026-10-29T11:22:00.000Z',
    approvedAt: '2026-10-29T12:00:00.000Z',
  },
];

class AdminSubscriptionService {
  private plans: SubscriptionPlanItem[] = [];
  private transactions: SubscriptionTransactionItem[] = [];

  constructor() {
    this.initializeState();
  }

  private initializeState(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedPlans = window.localStorage.getItem(PLANS_STORAGE_KEY);
        if (storedPlans) {
          this.plans = JSON.parse(storedPlans);
        } else {
          this.plans = [...DEFAULT_PLANS];
          this.persistPlans();
        }

        const storedTransactions = window.localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
        if (storedTransactions) {
          this.transactions = JSON.parse(storedTransactions);
        } else {
          this.transactions = [...DEFAULT_TRANSACTIONS];
          this.persistTransactions();
        }
      } else {
        this.plans = [...DEFAULT_PLANS];
        this.transactions = [...DEFAULT_TRANSACTIONS];
      }
    } catch (error) {
      console.error('[AdminSubscriptionService] Failed to load data from localStorage:', error);
      this.plans = [...DEFAULT_PLANS];
      this.transactions = [...DEFAULT_TRANSACTIONS];
    }
  }

  private persistPlans(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(this.plans));
      }
    } catch (error) {
      console.error('[AdminSubscriptionService] Failed to save plans to localStorage:', error);
    }
  }

  private persistTransactions(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(this.transactions));
      }
    } catch (error) {
      console.error('[AdminSubscriptionService] Failed to save transactions to localStorage:', error);
    }
  }

  public async getMetrics(): Promise<SubscriptionMetricsStats> {
    try {
      const approvedTxs = this.transactions.filter((tx) => tx.status === 'APPROVED');
      const pendingTxs = this.transactions.filter((tx) => tx.status === 'PENDING');
      const rejectedTxs = this.transactions.filter((tx) => tx.status === 'REJECTED');

      const totalRevenueVnd = approvedTxs.reduce((sum, tx) => sum + tx.amountVnd, 0);
      const pendingCount = pendingTxs.length;

      // Unique active user emails
      const activeUserSet = new Set(approvedTxs.map((tx) => tx.userEmail));
      const activeSubscribers = activeUserSet.size;

      const totalProcessed = approvedTxs.length + rejectedTxs.length;
      const approvalRatePercent =
        totalProcessed > 0 ? Math.round((approvedTxs.length / totalProcessed) * 100) : 100;

      const tierDistribution: Record<SubscriptionTierCode, number> = {
        FREE: 142, // baseline active free members
        STARTER: 0,
        PRO: 0,
        LIFETIME: 0,
      };

      for (const tx of approvedTxs) {
        if (tierDistribution[tx.planCode] !== undefined) {
          tierDistribution[tx.planCode] += 1;
        }
      }

      return {
        totalRevenueVnd,
        pendingCount,
        activeSubscribers: activeSubscribers + tierDistribution.FREE,
        approvalRatePercent,
        tierDistribution,
      };
    } catch (error) {
      console.error('[AdminSubscriptionService] Error calculating metrics:', error);
      throw new Error('Failed to retrieve subscription metrics');
    }
  }

  public async getTransactions(
    statusFilter?: string,
    searchQuery?: string
  ): Promise<SubscriptionTransactionItem[]> {
    try {
      let filtered = [...this.transactions];

      if (statusFilter && statusFilter !== 'ALL') {
        filtered = filtered.filter((tx) => tx.status === statusFilter);
      }

      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (tx) =>
            tx.transactionCode.toLowerCase().includes(query) ||
            tx.userEmail.toLowerCase().includes(query) ||
            tx.userName.toLowerCase().includes(query) ||
            tx.transferContent.toLowerCase().includes(query) ||
            tx.planName.toLowerCase().includes(query)
        );
      }

      // Sort by creation time descending
      return filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('[AdminSubscriptionService] Error fetching transactions:', error);
      throw new Error('Failed to retrieve transactions');
    }
  }

  public async approveTransaction(
    id: string,
    note?: string
  ): Promise<SubscriptionTransactionItem> {
    try {
      const index = this.transactions.findIndex((tx) => tx.id === id);
      if (index === -1) {
        throw new Error(`Transaction with id ${id} not found`);
      }

      const existing = this.transactions[index];
      const updated: SubscriptionTransactionItem = {
        ...existing,
        status: 'APPROVED',
        note: note || existing.note || 'Duyệt thành công bởi Quản trị viên',
        approvedAt: new Date().toISOString(),
      };

      this.transactions[index] = updated;
      this.persistTransactions();
      return updated;
    } catch (error) {
      console.error(`[AdminSubscriptionService] Error approving transaction ${id}:`, error);
      throw error;
    }
  }

  public async rejectTransaction(
    id: string,
    reason: string
  ): Promise<SubscriptionTransactionItem> {
    try {
      const index = this.transactions.findIndex((tx) => tx.id === id);
      if (index === -1) {
        throw new Error(`Transaction with id ${id} not found`);
      }

      const existing = this.transactions[index];
      const updated: SubscriptionTransactionItem = {
        ...existing,
        status: 'REJECTED',
        note: reason,
      };

      this.transactions[index] = updated;
      this.persistTransactions();
      return updated;
    } catch (error) {
      console.error(`[AdminSubscriptionService] Error rejecting transaction ${id}:`, error);
      throw error;
    }
  }

  public async getPlans(): Promise<SubscriptionPlanItem[]> {
    try {
      return [...this.plans].sort((a, b) => a.sortOrder - b.sortOrder);
    } catch (error) {
      console.error('[AdminSubscriptionService] Error fetching plans:', error);
      throw new Error('Failed to retrieve plans');
    }
  }

  public async savePlan(plan: SubscriptionPlanItem): Promise<SubscriptionPlanItem> {
    try {
      const index = this.plans.findIndex((p) => p.id === plan.id);
      if (index >= 0) {
        this.plans[index] = { ...plan };
      } else {
        this.plans.push({ ...plan });
      }
      this.persistPlans();
      return plan;
    } catch (error) {
      console.error(`[AdminSubscriptionService] Error saving plan ${plan.id}:`, error);
      throw error;
    }
  }

  public async togglePlanStatus(id: string): Promise<SubscriptionPlanItem> {
    try {
      const index = this.plans.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error(`Plan with id ${id} not found`);
      }

      const plan = this.plans[index];
      const updated: SubscriptionPlanItem = {
        ...plan,
        isActive: !plan.isActive,
      };

      this.plans[index] = updated;
      this.persistPlans();
      return updated;
    } catch (error) {
      console.error(`[AdminSubscriptionService] Error toggling status for plan ${id}:`, error);
      throw error;
    }
  }
}

export const adminSubscriptionService = new AdminSubscriptionService();
