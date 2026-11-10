import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Bell,
  Send,
  Calendar,
  Smartphone,
  Globe,
  Trash2,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  X,
  Copy,
  Clock,
  Shield,
  Image as ImageIcon,
  Link2,
} from 'lucide-react';
import { marketingNotificationService } from '../services/marketingNotificationService';
import { growthEngineService } from '../services/growthEngineService';
import type {
  MarketingNotificationItem,
  MarketingNotificationChannel,
  MarketingNotificationType,
  MarketingTargetSegment,
  MarketingNotificationStatus,
  CreateNotificationPayload,
  NotificationStatsSummary,
  DeepLinkDestinationType,
  FrequencyCappingConfig,
} from '../types/marketing.contract';
import { AdminDialog } from './AdminDialog';

const CHANNEL_LABELS: Record<MarketingNotificationChannel, string> = {
  IN_APP: 'In-App',
  WEB_PUSH: 'Web Push',
  MOBILE_PUSH: 'Mobile Push',
};

const TYPE_LABELS: Record<MarketingNotificationType, string> = {
  NEW_CONTENT: 'Nội dung mới',
  EVENT: 'Sự kiện',
  PROMOTION: 'Khuyến mãi',
  SYSTEM: 'Hệ thống',
  RETENTION: 'Nhắc nhở giữ chân',
};

const SEGMENT_LABELS: Record<MarketingTargetSegment, string> = {
  ALL_USERS: 'Tất cả người dùng (Toàn hệ thống)',
  ACTIVE_LEARNERS: 'Học viên tích cực (Streak >= 3)',
  INACTIVE_7_DAYS: 'Chưa học 7 ngày qua (Nguy cơ nghỉ)',
  PREMIUM_STUDENTS: 'Học viên Di sản (Starter / Pro / Trọn đời)',
};

const DEEP_LINK_OPTIONS: { type: DeepLinkDestinationType; label: string; defaultUrl: string }[] = [
  { type: 'READING_POST', label: 'Mở Thư viện Bài đọc Di sản', defaultUrl: '/reading' },
  { type: 'AI_VOICE_COMPANION', label: 'Mở Phòng luyện nói AI Companion', defaultUrl: '/playground' },
  { type: 'HERITAGE_MAP', label: 'Mở Bản đồ Khám phá Di sản', defaultUrl: '/discovery' },
  { type: 'FLASHCARDS_STEP3', label: 'Mở Ôn tập Từ vựng (Bước 3)', defaultUrl: '/flashcards' },
  { type: 'SUBSCRIPTION_PLANS', label: 'Mở Trang Gói học & Nâng cấp', defaultUrl: '/subscription' },
  { type: 'CUSTOM_URL', label: 'Đường dẫn tùy chỉnh', defaultUrl: '' },
];

const STATUS_CONFIG: Record<
  MarketingNotificationStatus,
  { label: string; badgeClass: string }
> = {
  SENT: {
    label: 'Đã gửi',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
  },
  SCHEDULED: {
    label: 'Đã lên lịch',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
  },
  SENDING: {
    label: 'Đang gửi',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
  },
  DRAFT: {
    label: 'Bản nháp',
    badgeClass: 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
  },
  CANCELLED: {
    label: 'Đã hủy',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  },
};

export const MarketingNotificationHub: React.FC = () => {
  const [notifications, setNotifications] = useState<MarketingNotificationItem[]>([]);
  const [stats, setStats] = useState<NotificationStatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterChannel, setFilterChannel] = useState<MarketingNotificationChannel | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<MarketingNotificationStatus | 'ALL'>('ALL');

  // Form toggle & Preview
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [previewDevice, setPreviewDevice] = useState<'WEB' | 'MOBILE'>('WEB');

  // Form state
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [notifType, setNotifType] = useState<MarketingNotificationType>('NEW_CONTENT');
  const [selectedChannels, setSelectedChannels] = useState<MarketingNotificationChannel[]>([
    'IN_APP',
    'WEB_PUSH',
  ]);
  const [targetSegment, setTargetSegment] = useState<MarketingTargetSegment>('ALL_USERS');
  const [destinationType, setDestinationType] = useState<DeepLinkDestinationType>('READING_POST');
  const [actionUrl, setActionUrl] = useState<string>('/reading');
  const [actionText, setActionText] = useState<string>('Khám phá ngay');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<string>('');

  // Frequency capping settings
  const [freqConfig, setFreqConfig] = useState<FrequencyCappingConfig>({
    quietHoursEnabled: true,
    quietStartHour: 22,
    quietEndHour: 7,
    maxDailyNotificationsPerUser: 2,
  });
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [list, statsData, config] = await Promise.all([
        marketingNotificationService.getNotifications({
          searchQuery,
          channel: filterChannel,
          status: filterStatus,
        }),
        marketingNotificationService.getStatsSummary(),
        growthEngineService.getFrequencyCappingConfig(),
      ]);
      setNotifications(list);
      setStats(statsData);
      setFreqConfig(config);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi tải dữ liệu';
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filterChannel, filterStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleChannel = (ch: MarketingNotificationChannel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length === 1) return;
      setSelectedChannels(selectedChannels.filter((c) => c !== ch));
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleDestinationChange = (dtype: DeepLinkDestinationType) => {
    setDestinationType(dtype);
    const opt = DEEP_LINK_OPTIONS.find((o) => o.type === dtype);
    if (opt && opt.defaultUrl) {
      setActionUrl(opt.defaultUrl);
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setBody('');
    setNotifType('NEW_CONTENT');
    setSelectedChannels(['IN_APP', 'WEB_PUSH']);
    setTargetSegment('ALL_USERS');
    setDestinationType('READING_POST');
    setActionUrl('/reading');
    setActionText('Khám phá ngay');
    setImageUrl('');
    setIsScheduled(false);
    setScheduledDate('');
    setFormError(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) {
      setFormError('Vui lòng nhập tiêu đề thông báo.');
      return;
    }
    if (!body.trim()) {
      setFormError('Vui lòng nhập nội dung thông báo.');
      return;
    }
    if (selectedChannels.length === 0) {
      setFormError('Vui lòng chọn ít nhất một kênh phát tán.');
      return;
    }
    if (isScheduled && !scheduledDate) {
      setFormError('Vui lòng chọn thời gian phát hành.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateNotificationPayload = {
        title,
        body,
        type: notifType,
        channels: selectedChannels,
        targetSegment,
        actionUrl: actionUrl.trim(),
        actionText: actionText.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        destinationType,
        isScheduled,
        scheduledAt: isScheduled ? scheduledDate : undefined,
      };

      const newItem = await marketingNotificationService.createNotification(payload);
      setNotifications([newItem, ...notifications]);
      handleResetForm();
      setIsFormOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi tạo thông báo';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = (item: MarketingNotificationItem) => {
    setTitle(`${item.title} (Bản sao)`);
    setBody(item.body);
    setNotifType(item.type);
    setSelectedChannels(item.channels);
    setTargetSegment(item.targetSegment);
    setActionUrl(item.actionUrl);
    setActionText(item.actionText || 'Khám phá ngay');
    setImageUrl(item.imageUrl || '');
    setIsScheduled(false);
    setIsFormOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await marketingNotificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch {
      // Ignored
    }
  };

  const handleSendNow = async (id: string) => {
    try {
      const updated = await marketingNotificationService.sendImmediately(id);
      if (updated) {
        setNotifications(notifications.map((n) => (n.id === id ? updated : n)));
      }
    } catch {
      // Ignored
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await growthEngineService.updateFrequencyCappingConfig(freqConfig);
    setIsConfigModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề & Cấu hình Chống làm phiền ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-heritage-green" aria-hidden="true" />
            <span>Quản lý Thông báo Đa kênh (In-App, Web Push, Mobile Push)</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Soạn thảo, xem trước và phát hành thông báo đẩy theo phân khúc học viên với cơ chế chống làm phiền.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>Cơ chế Chống làm phiền</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-heritage-green text-white text-xs font-bold hover:bg-heritage-green/90 transition-colors shadow-xs"
          >
            {isFormOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isFormOpen ? 'Đóng trình soạn' : 'Tạo thông báo mới'}</span>
          </button>
        </div>
      </div>

      {/* Dải thông số thống kê */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span className="text-[11px] text-stone-400 block">Đã phát hành</span>
            <span className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {stats.totalSentNotifications}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span className="text-[11px] text-stone-400 block">Đã nhận (Delivered)</span>
            <span className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {stats.totalDelivered.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span className="text-[11px] text-stone-400 block">Lượt nhấp (CTR)</span>
            <span className="text-xl font-serif font-bold text-heritage-green">
              {stats.averageClickThroughRate}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <span className="text-[11px] text-stone-400 block">Đang lên lịch</span>
            <span className="text-xl font-serif font-bold text-amber-600">
              {stats.activeScheduledCount}
            </span>
          </div>
        </div>
      )}

      {/* ── Trình soạn thảo & Xem trước Thông báo ────────────────────────── */}
      {isFormOpen && (
        <section className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cột Trái: Form thông báo (7 cột) */}
            <form onSubmit={handleSubmitForm} className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Loại thông báo *
                  </label>
                  <select
                    value={notifType}
                    onChange={(e) => setNotifType(e.target.value as MarketingNotificationType)}
                    className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                  >
                    {Object.entries(TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Phân khúc Đối tượng Nhận *
                  </label>
                  <select
                    value={targetSegment}
                    onChange={(e) => setTargetSegment(e.target.value as MarketingTargetSegment)}
                    className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                  >
                    {Object.entries(SEGMENT_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Kênh phát tán */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                  Kênh Phát tán (Chọn ít nhất 1) *
                </label>
                <div className="flex gap-2">
                  {(['IN_APP', 'WEB_PUSH', 'MOBILE_PUSH'] as MarketingNotificationChannel[]).map((ch) => {
                    const isChecked = selectedChannels.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleToggleChannel(ch)}
                        className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                          isChecked
                            ? 'bg-heritage-green text-white border-heritage-green'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {ch === 'IN_APP' ? <Bell className="w-3.5 h-3.5" /> : ch === 'WEB_PUSH' ? <Globe className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                        <span>{CHANNEL_LABELS[ch]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tiêu đề & Nội dung */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Tiêu đề Thông báo *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Đã đến giờ ôn lại 5 từ vựng ẩm thực Huế!"
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Nội dung Thông báo *
                </label>
                <textarea
                  rows={3}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Nội dung hiển thị trên banner hoặc pop-up in-app..."
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 p-3 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                />
              </div>

              {/* Deep Link thông minh */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Đích đến (Deep Link) *
                  </label>
                  <select
                    value={destinationType}
                    onChange={(e) => handleDestinationChange(e.target.value as DeepLinkDestinationType)}
                    className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                  >
                    {DEEP_LINK_OPTIONS.map((opt) => (
                      <option key={opt.type} value={opt.type}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Đường dẫn cụ thể
                  </label>
                  <input
                    type="text"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green font-mono"
                  />
                </div>
              </div>

              {/* Hình ảnh Rich Media (Tùy chọn) */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Hình ảnh Rich Media (URL ảnh minh họa món ăn/huy hiệu)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green font-mono"
                />
              </div>

              {/* Hẹn giờ phát hành */}
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="rounded text-heritage-green focus:ring-heritage-green"
                  />
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                    Hẹn giờ phát hành cố định
                  </span>
                </label>
                {isScheduled && (
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-1.5 text-stone-900 dark:text-stone-100"
                  />
                )}
              </div>

              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Xóa trắng
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-heritage-green text-white text-xs font-bold hover:bg-heritage-green/90 transition-colors shadow-xs"
                >
                  {isSubmitting ? 'Đang gửi...' : isScheduled ? 'Lên lịch thông báo' : 'Phát thông báo ngay'}
                </button>
              </div>
            </form>

            {/* Cột Phải: Xem trước Đa thiết bị (5 cột) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-bold">Xem trước Giao diện</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('WEB')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      previewDevice === 'WEB' ? 'bg-heritage-green text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                    }`}
                  >
                    Web In-App
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('MOBILE')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      previewDevice === 'MOBILE' ? 'bg-heritage-green text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                    }`}
                  >
                    Mobile Push
                  </button>
                </div>
              </div>

              {/* Preview Box */}
              {previewDevice === 'WEB' ? (
                <div className="p-4 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span className="font-serif font-bold text-heritage-green">VieCultures In-App</span>
                    <span>Vừa xong</span>
                  </div>
                  {imageUrl && (
                    <div className="h-28 rounded-lg overflow-hidden bg-stone-100">
                      <img src={imageUrl} alt="Rich media" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                    {title || 'Tiêu đề thông báo mẫu'}
                  </h4>
                  <p className="text-stone-600 dark:text-stone-400 text-xs leading-relaxed">
                    {body || 'Nội dung thông báo sẽ hiển thị tại đây...'}
                  </p>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 rounded bg-heritage-green text-white text-[11px] font-bold">
                      {actionText}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="max-w-[260px] mx-auto bg-stone-900 rounded-3xl p-3 border-4 border-stone-700 text-white space-y-2">
                  <div className="w-16 h-2.5 bg-black rounded-full mx-auto" />
                  <div className="bg-stone-800/90 rounded-xl p-2.5 border border-stone-700 space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-stone-400">
                      <span className="font-semibold text-stone-200">VIECULTURES</span>
                      <span>Vừa xong</span>
                    </div>
                    {imageUrl && (
                      <div className="h-20 rounded overflow-hidden bg-stone-700">
                        <img src={imageUrl} alt="Mobile thumb" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-[11px] font-bold text-stone-100 line-clamp-1">
                      {title || 'Tiêu đề mobile push'}
                    </p>
                    <p className="text-[10px] text-stone-300 line-clamp-2">
                      {body || 'Nội dung thông báo trên màn hình khóa điện thoại...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Bảng Danh sách Thông báo Đa kênh ──────────────────────────────── */}
      <section className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-stone-400">Đang tải danh sách thông báo...</div>
        ) : fetchError ? (
          <div className="p-6 text-center space-y-2">
            <p className="text-xs text-rose-600">{fetchError}</p>
            <button
              type="button"
              onClick={loadData}
              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-xs rounded font-medium"
            >
              Thử lại
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-xs text-stone-500">Chưa có thông báo nào trong hệ thống.</p>
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="text-xs font-semibold text-heritage-green hover:underline"
            >
              Soạn thông báo đầu tiên
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
              <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-[11px] font-bold text-stone-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Tiêu đề & Nội dung</th>
                  <th className="py-2.5 px-2">Kênh</th>
                  <th className="py-2.5 px-2">Đối tượng</th>
                  <th className="py-2.5 px-2">Trạng thái</th>
                  <th className="py-2.5 px-2 text-right">Lượt phát</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {notifications.map((item) => {
                  const statusConf = STATUS_CONFIG[item.status] || STATUS_CONFIG.DRAFT;
                  return (
                    <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate">{item.body}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex gap-1 flex-wrap">
                          {item.channels.map((ch) => (
                            <span
                              key={ch}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                            >
                              {ch === 'IN_APP' ? 'In-App' : ch === 'WEB_PUSH' ? 'Web' : 'Mobile'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-[11px] text-stone-600 dark:text-stone-400">
                        {SEGMENT_LABELS[item.targetSegment]}
                      </td>
                      <td className="py-2.5 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConf.badgeClass}`}>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono">
                        {item.metrics.deliveredCount.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status !== 'SENT' && (
                            <button
                              type="button"
                              onClick={() => handleSendNow(item.id)}
                              className="px-2 py-1 rounded bg-heritage-green/10 text-heritage-green hover:bg-heritage-green/20 text-[11px] font-semibold"
                            >
                              Gửi ngay
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(item)}
                            title="Nhân bản mẫu thông báo này"
                            className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            title="Xóa thông báo"
                            className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Modal Cấu hình Chống làm phiền ─────────────────────────────────── */}
      {isConfigModalOpen && (
        <AdminDialog
          title="Cấu hình Chống làm phiền & Giờ yên tĩnh"
          onClose={() => setIsConfigModalOpen(false)}
        >
          <form onSubmit={handleSaveConfig} className="p-6 space-y-4 max-w-md">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
              Cơ chế tự động chặn dội thông báo (push bombardment) để duy trì tỷ lệ bật nhận thông báo cao nhất từ học viên.
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freqConfig.quietHoursEnabled}
                  onChange={(e) => setFreqConfig({ ...freqConfig, quietHoursEnabled: e.target.checked })}
                  className="rounded text-heritage-green focus:ring-heritage-green"
                />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Bật Khung giờ yên tĩnh (Quiet Hours)
                </span>
              </label>
              <p className="text-[11px] text-stone-500">
                Không gửi bất kỳ thông báo đẩy nào trong khung giờ nghỉ ngơi của học viên.
              </p>
            </div>

            {freqConfig.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Bắt đầu (Giờ tối)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={23}
                    value={freqConfig.quietStartHour}
                    onChange={(e) => setFreqConfig({ ...freqConfig, quietStartHour: Number(e.target.value) })}
                    className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-1.5"
                  />
                  <span className="text-[10px] text-stone-400">Mặc định: 22h00</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Kết thúc (Giờ sáng)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={10}
                    value={freqConfig.quietEndHour}
                    onChange={(e) => setFreqConfig({ ...freqConfig, quietEndHour: Number(e.target.value) })}
                    className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-1.5"
                  />
                  <span className="text-[10px] text-stone-400">Mặc định: 07h00</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Giới hạn tối đa thông báo/ngày cho mỗi học viên
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={freqConfig.maxDailyNotificationsPerUser}
                onChange={(e) => setFreqConfig({ ...freqConfig, maxDailyNotificationsPerUser: Number(e.target.value) })}
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-1.5"
              />
              <span className="text-[10px] text-stone-400">Khuyên dùng: 2 thông báo/ngày để tránh hủy đăng ký</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-700">
              <button
                type="button"
                onClick={() => setIsConfigModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-heritage-green text-white text-xs font-bold hover:bg-heritage-green/90 transition-colors"
              >
                Lưu cấu hình
              </button>
            </div>
          </form>
        </AdminDialog>
      )}
    </div>
  );
};
