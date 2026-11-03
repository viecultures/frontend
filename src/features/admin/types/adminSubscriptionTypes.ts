export type SubscriptionTierCode = 'FREE' | 'STARTER' | 'PRO' | 'LIFETIME';

export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'ONE_TIME';

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PlanFeatureEntitlements {
  maxAiAudioMinutesPerMonth: number;
  maxCefrLevelAccess: 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  unlimitedJourneys: boolean;
  offlineDownloadsAllowed: boolean;
  highlightBadge: boolean;
}

export interface SubscriptionPlanItem {
  id: string;
  code: SubscriptionTierCode;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  priceVnd: number;
  discountPercent: number;
  billingCycle: BillingCycle;
  isActive: boolean;
  isPopularBadge: boolean;
  sortOrder: number;
  entitlements: PlanFeatureEntitlements;
  perksVi: string[];
  perksEn: string[];
}

export interface SubscriptionMetricsStats {
  totalRevenueVnd: number;
  pendingCount: number;
  activeSubscribers: number;
  approvalRatePercent: number;
  tierDistribution: Record<SubscriptionTierCode, number>;
}

export interface SubscriptionTransactionItem {
  id: string;
  transactionCode: string;
  userEmail: string;
  userName: string;
  planCode: SubscriptionTierCode;
  planName: string;
  amountVnd: number;
  transferContent: string;
  status: PaymentStatus;
  note?: string;
  createdAt: string;
  approvedAt?: string;
}

export type SubscriptionSubTab = 'overview' | 'config';
