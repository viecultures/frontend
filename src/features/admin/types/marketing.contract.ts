/**
 * Data Contract: Phân hệ Tiếp thị & Tăng trưởng (Growth & Retention Engine)
 * Single Source of Truth cho 5 phân hệ chuyên biệt:
 * 1. Tổng quan & Phễu chuyển đổi (Overview & Conversion Funnel)
 * 2. Chiến dịch Email & Bản tin di sản (Heritage Newsletter)
 * 3. Luồng Tự động hóa theo hành vi (Behavioral Marketing Automation)
 * 4. Quản lý Thông báo Đa kênh (Multi-Channel Notifications)
 * 5. Trình tạo Link UTM & Mã QR Chiến dịch (UTM & QR Generator)
 */

// ==========================================
// 1. CHUNG & KÊNH PHÂN PHỐI (COMMON & CHANNELS)
// ==========================================

export type MarketingNotificationChannel = 'IN_APP' | 'WEB_PUSH' | 'MOBILE_PUSH';

export type MarketingDeliveryChannel = 'EMAIL' | MarketingNotificationChannel;

export type HeritageRegion = 'NORTH' | 'CENTRAL' | 'SOUTH' | 'NATIONWIDE';

export type SubscriptionTier = 'FREE' | 'STARTER' | 'PRO' | 'LIFETIME';

// ==========================================
// 2. TAB 1: TỔNG QUAN & PHỄU CHUYỂN ĐỔI (OVERVIEW & FUNNEL)
// ==========================================

export interface MarketingKpiSummary {
  utmClicks: number;
  utmClicksChangePercent: number;
  newSignups: number;
  newSignupsChangePercent: number;
  activationRate: number; // Tỷ lệ học bài đọc đầu tiên (%)
  activationRateChangePercent: number;
  retentionD7Rate: number; // Tỷ lệ giữ chân sau 7 ngày (%)
  retentionD7ChangePercent: number;
}

export interface FunnelStageItem {
  stage: string;
  count: number;
  conversionRate: number; // Tỷ lệ % so với bước trước đó
  dropoffRate: number;
  description: string;
}

export interface TopHeritageContentItem {
  id: string;
  title: string;
  slug: string;
  region: HeritageRegion;
  regionLabel: string;
  category: string;
  clicks: number;
  signups: number;
  conversions: number;
  revenueVnd: number;
}

export interface MarketingOverviewData {
  kpis: MarketingKpiSummary;
  funnelStages: FunnelStageItem[];
  topHeritageContent: TopHeritageContentItem[];
}

// ==========================================
// 3. TAB 2: CHIẾN DỊCH EMAIL & BẢN TIN DI SẢN (NEWSLETTER)
// ==========================================

export type AudienceSegmentKey =
  | 'ALL_USERS'
  | 'FREE_TIER'
  | 'ACTIVE_LEARNERS'
  | 'INACTIVE_3_DAYS'
  | 'INACTIVE_7_DAYS'
  | 'INACTIVE_30_DAYS'
  | 'INTEREST_NORTH'
  | 'INTEREST_CENTRAL'
  | 'INTEREST_SOUTH'
  | 'CEFR_A1_B1'
  | 'PREMIUM_STUDENTS';

export interface AudienceSegmentOption {
  key: AudienceSegmentKey;
  label: string;
  estimatedCount: number;
  description: string;
}

export interface MergeTagOption {
  tag: string;
  description: string;
  sampleValue: string;
}

export type NewsletterStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED';

export interface HeritageNewsletterItem {
  id: string;
  subject: string;
  headline: string;
  content: string;
  targetSegment: AudienceSegmentKey;
  targetSegmentLabel: string;
  estimatedRecipients: number;
  featuredPostId?: string;
  featuredPostTitle?: string;
  featuredPostSlug?: string;
  featuredPostCover?: string;
  actionUrl: string;
  actionText: string;
  status: NewsletterStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  metrics: {
    sentCount: number;
    openRate: number; // %
    clickThroughRate: number; // %
    unsubscribeCount: number;
  };
}

export interface CreateNewsletterPayload {
  subject: string;
  headline: string;
  content: string;
  targetSegment: AudienceSegmentKey;
  featuredPostId?: string;
  featuredPostTitle?: string;
  featuredPostSlug?: string;
  featuredPostCover?: string;
  actionUrl: string;
  actionText: string;
  isScheduled: boolean;
  scheduledAt?: string;
}

// ==========================================
// 4. TAB 3: TỰ ĐỘNG HÓA THEO HÀNH VI (AUTOMATION & TRIGGERS)
// ==========================================

export type AutomationTriggerKey =
  | 'ONBOARDING_INCOMPLETE_24H'
  | 'STREAK_SAVER_20H'
  | 'SPACED_REPETITION_DUE'
  | 'WINBACK_3D'
  | 'WINBACK_7D'
  | 'WINBACK_14D'
  | 'PAYWALL_AUDIO_LIMIT_REACHED'
  | 'PAYWALL_LOCKED_REGION_CLICKED';

export interface AutomationWorkflowItem {
  id: string;
  title: string;
  triggerKey: AutomationTriggerKey;
  triggerDescription: string;
  targetGoal: string; // Mục tiêu tăng trưởng: Activation / DAU / Retention / Paywall Conversion
  channels: MarketingDeliveryChannel[];
  isActive: boolean;
  frequencyCappingHours: number; // Không gửi lặp lại trong X giờ
  templateSubject?: string;
  templateHeadline: string;
  templateBody: string;
  actionDeepLink: string;
  actionText: string;
  stats: {
    triggeredCount: number;
    convertedCount: number;
    conversionRate: number; // %
  };
  lastTriggeredAt?: string;
}

export interface AutomationExecutionLog {
  id: string;
  workflowId: string;
  workflowTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  channel: MarketingDeliveryChannel;
  status: 'DELIVERED' | 'FAILED' | 'CONVERTED';
  executedAt: string;
}

// ==========================================
// 5. TAB 4: QUẢN LÝ THÔNG BÁO ĐA KÊNH (NOTIFICATIONS HUB)
// ==========================================

export type MarketingNotificationType =
  | 'NEW_CONTENT'
  | 'EVENT'
  | 'PROMOTION'
  | 'SYSTEM'
  | 'RETENTION';

export type MarketingTargetSegment =
  | 'ALL_USERS'
  | 'ACTIVE_LEARNERS'
  | 'INACTIVE_7_DAYS'
  | 'PREMIUM_STUDENTS';

export type MarketingNotificationStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'SENDING'
  | 'SENT'
  | 'CANCELLED';

export type DeepLinkDestinationType =
  | 'READING_POST'
  | 'AI_VOICE_COMPANION'
  | 'HERITAGE_MAP'
  | 'FLASHCARDS_STEP3'
  | 'SUBSCRIPTION_PLANS'
  | 'CUSTOM_URL';

export interface DeepLinkDestinationOption {
  type: DeepLinkDestinationType;
  label: string;
  defaultUrl: string;
}

export interface FrequencyCappingConfig {
  quietHoursEnabled: boolean;
  quietStartHour: number; // e.g. 22 (22:00)
  quietEndHour: number; // e.g. 7 (07:00)
  maxDailyNotificationsPerUser: number;
}

export interface MarketingNotificationItem {
  id: string;
  title: string;
  body: string;
  type: MarketingNotificationType;
  channels: MarketingNotificationChannel[];
  targetSegment: MarketingTargetSegment;
  actionUrl: string;
  actionText?: string;
  imageUrl?: string;
  destinationType?: DeepLinkDestinationType;
  status: MarketingNotificationStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  metrics: {
    targetCount: number;
    deliveredCount: number;
    clickedCount: number;
  };
}

export interface CreateNotificationPayload {
  title: string;
  body: string;
  type: MarketingNotificationType;
  channels: MarketingNotificationChannel[];
  targetSegment: MarketingTargetSegment;
  actionUrl: string;
  actionText?: string;
  imageUrl?: string;
  destinationType?: DeepLinkDestinationType;
  isScheduled: boolean;
  scheduledAt?: string;
}

export interface NotificationFilterParams {
  channel?: MarketingNotificationChannel | 'ALL';
  type?: MarketingNotificationType | 'ALL';
  status?: MarketingNotificationStatus | 'ALL';
  searchQuery?: string;
}

export interface NotificationStatsSummary {
  totalSentNotifications: number;
  totalDelivered: number;
  totalClicks: number;
  averageClickThroughRate: number;
  activeScheduledCount: number;
}

// ==========================================
// 6. TAB 5: TRÌNH TẠO LINK UTM & MÃ QR (CAMPAIGN UTM & QR)
// ==========================================

export type UtmChannel = 'Facebook' | 'TikTok' | 'Google' | 'Email' | 'Zalo' | 'Direct';

export interface EnhancedUtmCampaignItem {
  id: string;
  name: string;
  channel: UtmChannel;
  targetType: 'POST' | 'JOURNEY' | 'CUSTOM';
  targetId: string;
  targetTitle: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  fullUrl: string;
  shortUrl: string;
  qrDataUrl?: string;
  createdAt: string;
  metrics: {
    clicks: number;
    leads: number;
    conversions: number;
    conversionRate: number;
    revenueVnd: number;
  };
}

export interface CreateUtmCampaignPayload {
  name: string;
  channel: UtmChannel;
  targetType: 'POST' | 'JOURNEY' | 'CUSTOM';
  targetId: string;
  targetTitle: string;
  targetPath: string;
  utmContent?: string;
}
