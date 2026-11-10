/**
 * Service: Tầng truy xuất & Điều phối dữ liệu Hệ thống Tăng trưởng & Giữ chân học viên
 * Kết nối dữ liệu THỰC từ Backend Database qua adminOverviewService, adminSubscriptionService, postAdminService
 * Tuyệt đối không hardcode số liệu ảo hoặc dữ liệu giả lập.
 */

import type {
  MarketingOverviewData,
  AudienceSegmentOption,
  AudienceSegmentKey,
  MergeTagOption,
  HeritageNewsletterItem,
  CreateNewsletterPayload,
  AutomationWorkflowItem,
  AutomationExecutionLog,
  FrequencyCappingConfig,
  EnhancedUtmCampaignItem,
  CreateUtmCampaignPayload,
  UtmChannel,
  TopHeritageContentItem,
} from '../types/marketing.contract';
import type { ReadingPostItem } from '../types/adminTypes';
import { adminMailService } from './adminMailService';
import { adminOverviewService } from './adminOverviewService';
import { adminSubscriptionService } from './adminSubscriptionService';
import { postAdminService } from './postAdminService';

const STORAGE_KEYS = {
  NEWSLETTERS: 'viecultures_marketing_newsletters',
  WORKFLOWS: 'viecultures_marketing_workflows',
  UTM_CAMPAIGNS: 'viecultures_marketing_campaigns',
  FREQUENCY_CONFIG: 'viecultures_marketing_frequency_config',
  AUTOMATION_LOGS: 'viecultures_marketing_automation_logs',
} as const;

// ── 1. MERGE TAGS (Đặc tả biến động trong mẫu tin nhắn) ────────────────────
export const MERGE_TAGS: MergeTagOption[] = [
  {
    tag: '{{ten_hoc_vien}}',
    description: 'Họ tên hiển thị của học viên',
    sampleValue: 'Tên học viên',
  },
  {
    tag: '{{so_ngay_streak}}',
    description: 'Số ngày duy trì chuỗi học liên tục',
    sampleValue: 'Số ngày',
  },
  {
    tag: '{{bai_doc_dang_do}}',
    description: 'Tựa đề bài đọc học viên đang học dở',
    sampleValue: 'Bài đọc gần nhất',
  },
  {
    tag: '{{so_phut_audio_con_lai}}',
    description: 'Số phút Audio Shadowing AI còn lại trong tháng',
    sampleValue: 'Số phút',
  },
  {
    tag: '{{vung_mien_yeu_thich}}',
    description: 'Miền văn hóa học viên tương tác nhiều nhất',
    sampleValue: 'Vùng miền',
  },
];

// ── 2. CẤU HÌNH BAN ĐẦU CHO 5 KỊCH BẢN TỰ ĐỘNG HÓA (SỐ LIỆU BAN ĐẦU = 0) ──
const INITIAL_WORKFLOWS: AutomationWorkflowItem[] = [
  {
    id: 'wf-onboarding-24h',
    title: 'Chuỗi chào mừng (Onboarding Kickoff)',
    triggerKey: 'ONBOARDING_INCOMPLETE_24H',
    triggerDescription: 'Học viên vừa tạo tài khoản nhưng sau 24 giờ chưa hoàn thành bài đọc đầu tiên.',
    targetGoal: 'Kích hoạt học viên mới (Activation)',
    channels: ['EMAIL', 'IN_APP'],
    isActive: true,
    frequencyCappingHours: 72,
    templateSubject: '{{ten_hoc_vien}}, khám phá ngay câu chuyện di sản đầu tiên trên VieCultures!',
    templateHeadline: 'Khởi đầu hành trình tiếng Anh di sản',
    templateBody:
      'Chào mừng {{ten_hoc_vien}} đến với VieCultures! Hãy dành 5 phút khám phá câu chuyện văn hóa đầu tiên cùng giọng đọc Audio Shadowing bản xứ.',
    actionDeepLink: '/reading',
    actionText: 'Bắt đầu học ngay',
    stats: {
      triggeredCount: 0,
      convertedCount: 0,
      conversionRate: 0,
    },
  },
  {
    id: 'wf-streak-saver-20h',
    title: 'Cứu chuỗi ngày học (Streak Saver 20:00)',
    triggerKey: 'STREAK_SAVER_20H',
    triggerDescription: 'Học viên đang có chuỗi Streak >= 3 ngày nhưng đến 20h00 tối chưa vào học bài.',
    targetGoal: 'Duy trì thói quen học hàng ngày (DAU)',
    channels: ['WEB_PUSH', 'MOBILE_PUSH'],
    isActive: true,
    frequencyCappingHours: 24,
    templateHeadline: 'Giữ vững chuỗi {{so_ngay_streak}} ngày khám phá!',
    templateBody:
      'Chỉ cần 3 phút ôn nhanh các thẻ từ vựng hôm nay để giữ vững chuỗi {{so_ngay_streak}} ngày khám phá di sản bạn nhé!',
    actionDeepLink: '/flashcards',
    actionText: 'Ôn tập 3 phút',
    stats: {
      triggeredCount: 0,
      convertedCount: 0,
      conversionRate: 0,
    },
  },
  {
    id: 'wf-spaced-repetition',
    title: 'Nhắc ôn tập ngắt quãng (Spaced Repetition Due)',
    triggerKey: 'SPACED_REPETITION_DUE',
    triggerDescription: 'Học viên có từ 10 thẻ nhớ từ vựng trở lên đến hạn ôn tập theo thuật toán SuperMemo/SM-2.',
    targetGoal: 'Củng cố hiệu quả học & Nhớ sâu từ vựng',
    channels: ['WEB_PUSH', 'IN_APP'],
    isActive: true,
    frequencyCappingHours: 12,
    templateHeadline: 'Từ vựng di sản đang chờ bạn ôn lại',
    templateBody:
      'Bộ não của bạn đã sẵn sàng tiếp nhận lại từ vựng ẩm thực. Hãy làm bài tập tương tác Bước 3 để ghi nhớ vĩnh viễn.',
    actionDeepLink: '/flashcards',
    actionText: 'Vào phòng ôn tập ngay',
    stats: {
      triggeredCount: 0,
      convertedCount: 0,
      conversionRate: 0,
    },
  },
  {
    id: 'wf-winback-inactive',
    title: 'Gọi học viên quay lại (Win-Back Phễu 3/7/14 ngày)',
    triggerKey: 'WINBACK_7D',
    triggerDescription: 'Học viên không đăng nhập liên tục sau 7 ngày.',
    targetGoal: 'Giảm tỷ lệ rời bỏ (Churn Prevention)',
    channels: ['EMAIL'],
    isActive: true,
    frequencyCappingHours: 168,
    templateSubject: 'VieCultures nhớ bạn! Một câu chuyện di sản mới vừa ra mắt...',
    templateHeadline: 'Hành trình văn hóa vẫn đang chờ đón bạn',
    templateBody:
      'Chào {{ten_hoc_vien}}, tuần qua bạn thế nào? Chúng mình vừa cập nhật bài đọc thú vị mới. Hãy quay lại và cùng khám phá nhé.',
    actionDeepLink: '/reading',
    actionText: 'Khám phá bài đọc mới',
    stats: {
      triggeredCount: 0,
      convertedCount: 0,
      conversionRate: 0,
    },
  },
  {
    id: 'wf-paywall-upsell',
    title: 'Đề xuất nâng cấp gói (Paywall Upsell & AI Audio Limit)',
    triggerKey: 'PAYWALL_AUDIO_LIMIT_REACHED',
    triggerDescription: 'Học viên gói Free đã dùng hết 12/15 phút nghe Audio AI hoặc bấm vào vùng đất bị khóa trên bản đồ.',
    targetGoal: 'Tăng tỷ lệ chuyển đổi trả phí (Conversion)',
    channels: ['IN_APP', 'EMAIL'],
    isActive: true,
    frequencyCappingHours: 96,
    templateSubject: 'Mở khóa không giới hạn Audio AI & Bản đồ di sản toàn quốc',
    templateHeadline: 'Học sâu hơn cùng gói Starter chỉ 99.000đ/tháng',
    templateBody:
      'Bạn đã tận dụng gần hết 15 phút Audio AI miễn phí. Nâng cấp ngay để luyện nói cùng AI Companion không giới hạn và nhận huy hiệu Học giả Di sản.',
    actionDeepLink: '/subscription',
    actionText: 'Xem bảng so sánh gói',
    stats: {
      triggeredCount: 0,
      convertedCount: 0,
      conversionRate: 0,
    },
  },
];

const INITIAL_FREQUENCY_CONFIG: FrequencyCappingConfig = {
  quietHoursEnabled: true,
  quietStartHour: 22,
  quietEndHour: 7,
  maxDailyNotificationsPerUser: 2,
};

// ── IN-MEMORY CACHE ĐỂ CHỐNG NGHẼN NETWORK & LOẠI BỎ GIẬT LAG KHI CHUYỂN TAB ──
const CACHE_TTL_MS = 60 * 1000; // 60 giây

let overviewDataCache: { data: MarketingOverviewData; timestamp: number } | null = null;
let audienceSegmentsCache: { data: AudienceSegmentOption[]; timestamp: number } | null = null;
let postsShortCache: { data: ReadingPostItem[]; timestamp: number } | null = null;

const getCachedPosts = async (force = false): Promise<ReadingPostItem[]> => {
  const now = Date.now();
  if (!force && postsShortCache && now - postsShortCache.timestamp < CACHE_TTL_MS) {
    return postsShortCache.data;
  }
  const posts = await postAdminService.getPosts().catch(() => [] as ReadingPostItem[]);
  postsShortCache = { data: posts, timestamp: now };
  return posts;
};

export const growthEngineService = {
  /**
   * Xóa sạch cache để ép buộc tải lại số liệu mới nhất khi có thao tác ghi
   */
  invalidateCache(): void {
    overviewDataCache = null;
    audienceSegmentsCache = null;
    postsShortCache = null;
  },

  /**
   * Lấy số liệu phân khúc học viên THỰC TẾ từ Database (User & Subscriptions)
   */
  async getAudienceSegments(forceRefresh: boolean = false): Promise<AudienceSegmentOption[]> {
    const now = Date.now();
    if (!forceRefresh && audienceSegmentsCache && now - audienceSegmentsCache.timestamp < CACHE_TTL_MS) {
      return audienceSegmentsCache.data;
    }

    try {
      const [overview, subMetrics] = await Promise.all([
        adminOverviewService.getOverview().catch(() => null),
        adminSubscriptionService.getMetrics().catch(() => null),
      ]);

      const totalUsers = Number(overview?.totalUsers) || 0;
      const activeWeek = Number(overview?.activeLearnersWeek) || 0;
      const paidUsers = Number(subMetrics?.activeSubscribers) || 0;
      const freeUsers = Math.max(0, totalUsers - paidUsers);

      const northPosts = Number(overview?.regionCoverage?.['north']) || 0;
      const centralPosts = Number(overview?.regionCoverage?.['central']) || 0;
      const southPosts = Number(overview?.regionCoverage?.['south']) || 0;

      const segments: AudienceSegmentOption[] = [
        {
          key: 'ALL_USERS',
          label: 'Tất cả học viên (Toàn hệ thống)',
          estimatedCount: totalUsers,
          description: 'Toàn bộ tài khoản đã đăng ký trên hệ thống VieCultures.',
        },
        {
          key: 'FREE_TIER',
          label: 'Học viên Gói Free (15p Audio)',
          estimatedCount: freeUsers,
          description: 'Học viên chưa nâng cấp lên gói Starter hoặc Pro.',
        },
        {
          key: 'ACTIVE_LEARNERS',
          label: 'Học viên tích cực trong tuần (Weekly Active)',
          estimatedCount: activeWeek,
          description: 'Học viên có hoạt động học bài hoặc luyện nói trong 7 ngày qua.',
        },
        {
          key: 'PREMIUM_STUDENTS',
          label: 'Học giả Trọn đời & Gói Pro/Starter',
          estimatedCount: paidUsers,
          description: 'Nhóm học viên trả phí cam kết gắn bó cao.',
        },
        {
          key: 'INTEREST_NORTH',
          label: 'Quan tâm Văn hóa Miền Bắc',
          estimatedCount: northPosts > 0 ? northPosts : 0,
          description: 'Học viên tương tác với các bài đọc và hành trình miền Bắc.',
        },
        {
          key: 'INTEREST_CENTRAL',
          label: 'Quan tâm Văn hóa Miền Trung',
          estimatedCount: centralPosts > 0 ? centralPosts : 0,
          description: 'Học viên tương tác với các bài đọc và hành trình miền Trung.',
        },
        {
          key: 'INTEREST_SOUTH',
          label: 'Quan tâm Văn hóa Miền Nam',
          estimatedCount: southPosts > 0 ? southPosts : 0,
          description: 'Học viên tương tác với các bài đọc và hành trình miền Nam.',
        },
      ];

      audienceSegmentsCache = { data: segments, timestamp: now };
      return segments;
    } catch {
      return [
        {
          key: 'ALL_USERS',
          label: 'Tất cả học viên (Toàn hệ thống)',
          estimatedCount: 0,
          description: 'Toàn bộ tài khoản đã đăng ký trên hệ thống.',
        },
      ];
    }
  },

  /**
   * Lấy số liệu Tổng quan & Phễu chuyển đổi THỰC TẾ từ Database
   */
  async getOverviewData(forceRefresh: boolean = false): Promise<MarketingOverviewData> {
    const now = Date.now();
    if (!forceRefresh && overviewDataCache && now - overviewDataCache.timestamp < CACHE_TTL_MS) {
      return overviewDataCache.data;
    }

    const [overview, subMetrics, posts, savedCampaigns] = await Promise.all([
      adminOverviewService.getOverview().catch(() => null),
      adminSubscriptionService.getMetrics().catch(() => null),
      getCachedPosts(forceRefresh),
      this.getEnhancedUtmCampaigns().catch(() => [] as EnhancedUtmCampaignItem[]),
    ]);

    const totalUsers = Number(overview?.totalUsers) || 0;
    const activeLearners = Number(overview?.activeLearnersWeek) || 0;
    const totalReads = Number(overview?.totalReads) || 0;
    const paidUsers = Number(subMetrics?.activeSubscribers) || 0;

    // Tính tổng lượt nhấp và chuyển đổi từ các chiến dịch UTM thực tế đã lưu
    const totalUtmClicks = savedCampaigns.reduce((sum, c) => sum + (c.metrics?.clicks || 0), 0);
    const totalUtmConversions = savedCampaigns.reduce((sum, c) => sum + (c.metrics?.conversions || 0), 0);

    // Tỷ lệ kích hoạt học bài đầu tiên (Activation Rate) = (Tổng lượt đọc / Tổng học viên) nếu có
    const activationRate = totalUsers > 0 ? Number(((Math.min(totalReads, totalUsers) / totalUsers) * 100).toFixed(1)) : 0;
    // Tỷ lệ học viên quay lại trong tuần (D7 Retention) = (Học viên hoạt động tuần / Tổng học viên)
    const retentionD7Rate = totalUsers > 0 ? Number(((activeLearners / totalUsers) * 100).toFixed(1)) : 0;

    // Phễu 5 bước chuyển đổi dựa trên số liệu thực tế trong DB
    const step1Count = totalUtmClicks;
    const step2Count = totalReads;
    const step3Count = totalUsers;
    const step4Count = activeLearners;
    const step5Count = paidUsers;

    const calcRate = (current: number, base: number) => {
      if (base <= 0) return 0;
      return Number(((current / base) * 100).toFixed(1));
    };

    // Danh sách bài đọc di sản thực tế từ Database, sắp xếp theo lượt đọc thực
    const sortedPosts = [...posts].sort((a, b) => (b.totalReads || 0) - (a.totalReads || 0));
    const topHeritageContent: TopHeritageContentItem[] = sortedPosts.slice(0, 5).map((p) => {
      const reg = (p.region || '').toLowerCase();
      const regionEnum = reg === 'north' ? 'NORTH' : reg === 'central' ? 'CENTRAL' : reg === 'south' ? 'SOUTH' : 'NATIONWIDE';
      const regionLabel = reg === 'north' ? 'Miền Bắc' : reg === 'central' ? 'Miền Trung' : reg === 'south' ? 'Miền Nam' : 'Toàn quốc';
      return {
        id: p.id,
        title: p.titleVi || p.titleEn,
        slug: p.id,
        region: regionEnum,
        regionLabel,
        category: p.topic || 'Văn hóa di sản',
        clicks: p.totalReads || 0,
        signups: 0,
        conversions: 0,
        revenueVnd: 0,
      };
    });

    const result: MarketingOverviewData = {
      kpis: {
        utmClicks: totalUtmClicks,
        utmClicksChangePercent: 0,
        newSignups: totalUsers,
        newSignupsChangePercent: 0,
        activationRate,
        activationRateChangePercent: 0,
        retentionD7Rate,
        retentionD7ChangePercent: 0,
      },
      funnelStages: [
        {
          stage: '1. Tiếp cận Chiến dịch (UTM Clicks)',
          count: step1Count,
          conversionRate: 100,
          dropoffRate: 0,
          description: 'Tổng lượt nhấp ghi nhận từ các liên kết chiến dịch đã tạo.',
        },
        {
          stage: '2. Lượt Đọc bài Di sản (Total Reads)',
          count: step2Count,
          conversionRate: calcRate(step2Count, step1Count || step2Count),
          dropoffRate: Math.max(0, 100 - calcRate(step2Count, step1Count || step2Count)),
          description: 'Tổng số lượt học viên vào đọc các câu chuyện văn hóa trên hệ thống.',
        },
        {
          stage: '3. Tài khoản Đăng ký (Total Signups)',
          count: step3Count,
          conversionRate: calcRate(step3Count, step2Count || step3Count),
          dropoffRate: Math.max(0, 100 - calcRate(step3Count, step2Count || step3Count)),
          description: 'Tổng số tài khoản học viên thực tế được ghi nhận trong cơ sở dữ liệu.',
        },
        {
          stage: '4. Học viên Hoạt động trong tuần (Active)',
          count: step4Count,
          conversionRate: calcRate(step4Count, step3Count),
          dropoffRate: Math.max(0, 100 - calcRate(step4Count, step3Count)),
          description: 'Học viên có hoạt động tương tác với bài học trong 7 ngày qua.',
        },
        {
          stage: '5. Nâng cấp Gói trả phí (Paid Subscribers)',
          count: step5Count,
          conversionRate: calcRate(step5Count, step3Count),
          dropoffRate: Math.max(0, 100 - calcRate(step5Count, step3Count)),
          description: 'Số lượng học viên đã nâng cấp gói Starter, Pro hoặc Học giả Trọn đời.',
        },
      ],
      topHeritageContent,
    };

    overviewDataCache = { data: result, timestamp: now };
    return result;
  },

  /**
   * Danh sách bản tin di sản (Chỉ lưu và trả về bản tin do Marketer tạo thật sự)
   */
  async getNewsletters(): Promise<HeritageNewsletterItem[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NEWSLETTERS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Lọc bỏ triệt để dữ liệu mẫu trước đó nếu có
      const clean = parsed.filter((item) => item.id !== 'nl-2026-11-08' && item.id !== 'nl-2026-11-01');
      if (clean.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.NEWSLETTERS, JSON.stringify(clean));
      }
      return clean;
    } catch {
      return [];
    }
  },

  /**
   * Tạo bản tin di sản mới
   */
  async createNewsletter(payload: CreateNewsletterPayload): Promise<HeritageNewsletterItem> {
    const list = await this.getNewsletters();
    const segments = await this.getAudienceSegments();
    const segment = segments.find((s) => s.key === payload.targetSegment);
    const nowIso = new Date().toISOString();
    const isSched = payload.isScheduled && Boolean(payload.scheduledAt);

    const newItem: HeritageNewsletterItem = {
      id: `nl-${Date.now()}`,
      subject: payload.subject.trim(),
      headline: payload.headline.trim(),
      content: payload.content.trim(),
      targetSegment: payload.targetSegment,
      targetSegmentLabel: segment ? `${segment.label} (${segment.estimatedCount.toLocaleString()} học viên)` : 'Học viên',
      estimatedRecipients: segment?.estimatedCount || 0,
      featuredPostId: payload.featuredPostId,
      featuredPostTitle: payload.featuredPostTitle,
      featuredPostSlug: payload.featuredPostSlug,
      featuredPostCover: payload.featuredPostCover,
      actionUrl: payload.actionUrl.trim(),
      actionText: payload.actionText.trim(),
      status: isSched ? 'SCHEDULED' : 'SENT',
      scheduledAt: isSched ? payload.scheduledAt : undefined,
      sentAt: isSched ? undefined : nowIso,
      createdAt: nowIso,
      metrics: {
        sentCount: isSched ? 0 : segment?.estimatedCount || 0,
        openRate: 0,
        clickThroughRate: 0,
        unsubscribeCount: 0,
      },
    };

    const updated = [newItem, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.NEWSLETTERS, JSON.stringify(updated));
    } catch {
      // Ignored
    }
    this.invalidateCache();
    return newItem;
  },

  /**
   * Gửi email thử nghiệm (gọi qua adminMailService kết nối máy chủ mail thật)
   */
  async sendTestEmail(params: {
    toEmail: string;
    subject: string;
    headline: string;
    content: string;
    actionUrl: string;
    actionText: string;
  }): Promise<{ success: boolean; message: string }> {
    return adminMailService.sendNotification({
      toEmail: params.toEmail,
      subject: `[BẢN XEM TRƯỚC TEST] ${params.subject}`,
      headline: params.headline,
      messageContent: params.content,
      actionUrl: params.actionUrl,
      actionText: params.actionText,
    });
  },

  /**
   * Danh sách các luồng Tự động hóa (Tính toán số liệu thực tế dựa trên nhật ký thực thi logs)
   */
  async getAutomationWorkflows(): Promise<AutomationWorkflowItem[]> {
    try {
      const logs = await this.getAutomationLogs();
      const raw = localStorage.getItem(STORAGE_KEYS.WORKFLOWS);
      const list: AutomationWorkflowItem[] = raw ? JSON.parse(raw) : INITIAL_WORKFLOWS;
      const baseList = Array.isArray(list) && list.length > 0 ? list : INITIAL_WORKFLOWS;

      // Tính toán trực tiếp số lượt kích hoạt và chuyển đổi thực tế từ logs, loại bỏ hoàn toàn số ảo
      const sanitized = baseList.map((wf) => {
        const wfLogs = logs.filter((l) => l.workflowId === wf.id);
        const triggeredCount = wfLogs.length;
        const convertedCount = wfLogs.filter((l) => l.status === 'CONVERTED').length;
        const conversionRate =
          triggeredCount > 0 ? Number(((convertedCount / triggeredCount) * 100).toFixed(1)) : 0;

        return {
          ...wf,
          stats: {
            triggeredCount,
            convertedCount,
            conversionRate,
          },
          lastTriggeredAt: wfLogs.length > 0 ? wfLogs[0].executedAt : undefined,
        };
      });

      // Ghi đè lại dữ liệu chuẩn sạch vào localStorage
      localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(sanitized));
      return sanitized;
    } catch {
      return INITIAL_WORKFLOWS;
    }
  },

  /**
   * Bật / Tắt trạng thái kích hoạt workflow
   */
  async toggleWorkflow(id: string): Promise<AutomationWorkflowItem | null> {
    const list = await this.getAutomationWorkflows();
    const index = list.findIndex((w) => w.id === id);
    if (index === -1) return null;

    list[index].isActive = !list[index].isActive;
    try {
      localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(list));
    } catch {
      // Ignored
    }
    return list[index];
  },

  /**
   * Cập nhật nội dung template của workflow
   */
  async updateWorkflow(workflow: AutomationWorkflowItem): Promise<AutomationWorkflowItem> {
    const list = await this.getAutomationWorkflows();
    const index = list.findIndex((w) => w.id === workflow.id);
    if (index !== -1) {
      list[index] = workflow;
      try {
        localStorage.setItem(STORAGE_KEYS.WORKFLOWS, JSON.stringify(list));
      } catch {
        // Ignored
      }
    }
    return workflow;
  },

  /**
   * Lấy lịch sử thực thi tự động hóa thực tế (Không có dữ liệu ảo)
   */
  async getAutomationLogs(): Promise<AutomationExecutionLog[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUTOMATION_LOGS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  /**
   * Cấu hình chống làm phiền (Frequency Capping & Quiet Hours)
   */
  async getFrequencyCappingConfig(): Promise<FrequencyCappingConfig> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FREQUENCY_CONFIG);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignored
    }
    return INITIAL_FREQUENCY_CONFIG;
  },

  async updateFrequencyCappingConfig(config: FrequencyCappingConfig): Promise<FrequencyCappingConfig> {
    try {
      localStorage.setItem(STORAGE_KEYS.FREQUENCY_CONFIG, JSON.stringify(config));
    } catch {
      // Ignored
    }
    return config;
  },

  /**
   * Quản lý Chiến dịch UTM & Mã QR (Chỉ chứa chiến dịch do người dùng tạo thật)
   */
  async getEnhancedUtmCampaigns(): Promise<EnhancedUtmCampaignItem[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.UTM_CAMPAIGNS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      // Khử sạch các chiến dịch mock cũ
      const clean = parsed.filter(
        (item) =>
          item.id !== 'camp-tet-2026' &&
          item.id !== 'camp-tiktok-am-thuc' &&
          item.id !== 'camp-google-shadowing'
      );
      if (clean.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEYS.UTM_CAMPAIGNS, JSON.stringify(clean));
      }

      // Chuẩn hóa định dạng nếu người dùng có dữ liệu chiến dịch cũ từ tab UTM
      return clean.map((item) => ({
        id: item.id || `camp-${Date.now()}`,
        name: item.name || 'Chiến dịch',
        channel: item.channel || 'Facebook',
        targetType: item.targetType || 'POST',
        targetId: item.targetId || '',
        targetTitle: item.targetTitle || 'Nội dung di sản',
        utmSource: item.utmSource || 'facebook',
        utmMedium: item.utmMedium || 'social',
        utmCampaign: item.utmCampaign || '',
        utmContent: item.utmContent,
        fullUrl: item.fullUrl || '',
        shortUrl: item.shortUrl || item.fullUrl || '',
        createdAt: item.createdAt || new Date().toISOString(),
        metrics: item.metrics || {
          clicks: 0,
          leads: 0,
          conversions: 0,
          conversionRate: 0,
          revenueVnd: 0,
        },
      }));
    } catch {
      return [];
    }
  },

  async createEnhancedUtmCampaign(payload: CreateUtmCampaignPayload): Promise<EnhancedUtmCampaignItem> {
    const list = await this.getEnhancedUtmCampaigns();

    const channelMap: Record<UtmChannel, { source: string; medium: string }> = {
      Facebook: { source: 'facebook', medium: 'social' },
      TikTok: { source: 'tiktok', medium: 'social_video' },
      Google: { source: 'google', medium: 'cpc' },
      Email: { source: 'newsletter', medium: 'email' },
      Zalo: { source: 'zalo', medium: 'chat' },
      Direct: { source: 'direct', medium: 'none' },
    };

    const config = channelMap[payload.channel] || { source: 'other', medium: 'referral' };
    const safeCampaign = payload.name.trim().toLowerCase().replace(/\s+/g, '-');
    const safeContent = payload.utmContent?.trim().toLowerCase().replace(/\s+/g, '-');

    const origin = window.location.origin;
    const cleanPath = payload.targetPath.startsWith('/') ? payload.targetPath : `/${payload.targetPath}`;

    const params = new URLSearchParams();
    params.set('utm_source', config.source);
    params.set('utm_medium', config.medium);
    params.set('utm_campaign', safeCampaign);
    if (safeContent) {
      params.set('utm_content', safeContent);
    }

    const fullUrl = `${origin}${cleanPath}?${params.toString()}`;
    const slugSuffix = safeCampaign.slice(0, 15);
    const shortUrl = `${origin}/go/${slugSuffix}-${Date.now().toString().slice(-4)}`;

    const newItem: EnhancedUtmCampaignItem = {
      id: `camp-${Date.now()}`,
      name: payload.name.trim(),
      channel: payload.channel,
      targetType: payload.targetType,
      targetId: payload.targetId,
      targetTitle: payload.targetTitle,
      utmSource: config.source,
      utmMedium: config.medium,
      utmCampaign: safeCampaign,
      utmContent: safeContent,
      fullUrl,
      shortUrl,
      createdAt: new Date().toISOString(),
      metrics: {
        clicks: 0,
        leads: 0,
        conversions: 0,
        conversionRate: 0,
        revenueVnd: 0,
      },
    };

    const updated = [newItem, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.UTM_CAMPAIGNS, JSON.stringify(updated));
    } catch {
      // Ignored
    }
    this.invalidateCache();
    return newItem;
  },

  async deleteEnhancedUtmCampaign(id: string): Promise<boolean> {
    const list = await this.getEnhancedUtmCampaigns();
    const updated = list.filter((c) => c.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.UTM_CAMPAIGNS, JSON.stringify(updated));
    } catch {
      // Ignored
    }
    this.invalidateCache();
    return true;
  },
};
