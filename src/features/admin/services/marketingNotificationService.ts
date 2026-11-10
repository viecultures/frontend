import type {
  MarketingNotificationItem,
  CreateNotificationPayload,
  NotificationFilterParams,
  NotificationStatsSummary,
} from '../types/marketing.contract';

const NOTIFICATIONS_STORAGE_KEY = 'viecultures_marketing_notifications';

const loadFromStorage = (): MarketingNotificationItem[] => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: MarketingNotificationItem[]): void => {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Lỗi lưu trữ thông báo:', error);
  }
};

export const marketingNotificationService = {
  /**
   * Lấy danh sách thông báo theo bộ lọc thực tế
   */
  async getNotifications(params?: NotificationFilterParams): Promise<MarketingNotificationItem[]> {
    const list = loadFromStorage();
    if (!params) return list;

    return list.filter((item) => {
      if (params.channel && params.channel !== 'ALL' && !item.channels.includes(params.channel)) {
        return false;
      }
      if (params.type && params.type !== 'ALL' && item.type !== params.type) {
        return false;
      }
      if (params.status && params.status !== 'ALL' && item.status !== params.status) {
        return false;
      }
      if (params.searchQuery && params.searchQuery.trim().length > 0) {
        const query = params.searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesBody = item.body.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBody) return false;
      }
      return true;
    });
  },

  /**
   * Tính toán thống kê KPI dựa trên dữ liệu thực tế
   */
  async getStatsSummary(): Promise<NotificationStatsSummary> {
    const list = loadFromStorage();
    const sentList = list.filter((item) => item.status === 'SENT');

    const totalDelivered = sentList.reduce((sum, item) => sum + (item.metrics?.deliveredCount || 0), 0);
    const totalClicks = sentList.reduce((sum, item) => sum + (item.metrics?.clickedCount || 0), 0);
    const averageClickThroughRate =
      totalDelivered > 0 ? Number(((totalClicks / totalDelivered) * 100).toFixed(1)) : 0;
    const activeScheduledCount = list.filter((item) => item.status === 'SCHEDULED').length;

    return {
      totalSentNotifications: sentList.length,
      totalDelivered,
      totalClicks,
      averageClickThroughRate,
      activeScheduledCount,
    };
  },

  /**
   * Tạo mới một thông báo
   */
  async createNotification(payload: CreateNotificationPayload): Promise<MarketingNotificationItem> {
    const list = loadFromStorage();
    const nowIso = new Date().toISOString();
    const isScheduled = payload.isScheduled && Boolean(payload.scheduledAt);

    const newItem: MarketingNotificationItem = {
      id: `notif-${Date.now()}`,
      title: payload.title.trim(),
      body: payload.body.trim(),
      type: payload.type,
      channels: payload.channels,
      targetSegment: payload.targetSegment,
      actionUrl: payload.actionUrl.trim(),
      actionText: payload.actionText?.trim() || undefined,
      imageUrl: payload.imageUrl?.trim() || undefined,
      status: isScheduled ? 'SCHEDULED' : 'SENT',
      scheduledAt: isScheduled ? payload.scheduledAt : undefined,
      sentAt: isScheduled ? undefined : nowIso,
      createdAt: nowIso,
      updatedAt: nowIso,
      metrics: {
        targetCount: 0,
        deliveredCount: isScheduled ? 0 : 0,
        clickedCount: 0,
      },
    };

    const updated = [newItem, ...list];
    saveToStorage(updated);
    return newItem;
  },

  /**
   * Xóa thông báo
   */
  async deleteNotification(id: string): Promise<boolean> {
    const list = loadFromStorage();
    const filtered = list.filter((item) => item.id !== id);
    saveToStorage(filtered);
    return true;
  },

  /**
   * Phát hành ngay thông báo
   */
  async sendImmediately(id: string): Promise<MarketingNotificationItem | null> {
    const list = loadFromStorage();
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const current = list[index];
    const nowIso = new Date().toISOString();
    const updatedItem: MarketingNotificationItem = {
      ...current,
      status: 'SENT',
      sentAt: nowIso,
      updatedAt: nowIso,
    };

    list[index] = updatedItem;
    saveToStorage(list);
    return updatedItem;
  },
};
