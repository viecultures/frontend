import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Megaphone,
  Send,
  Mail,
  CheckCircle2,
  Target,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  Plus,
  BookOpen,
  Compass,
  RefreshCw,
} from 'lucide-react';
import { postAdminService } from '../services/postAdminService';
import { journeyAdminService } from '../services/journeyAdminService';
import { adminMailService } from '../services/adminMailService';
import type { ReadingPostItem, LearningJourneyItem } from '../types/adminTypes';
import { getStoredUser } from '@/utils/auth-storage';

export interface UtmCampaignItem {
  id: string;
  name: string;
  channel: 'Facebook' | 'TikTok' | 'Google' | 'Email' | 'Zalo';
  targetType: 'POST' | 'JOURNEY';
  targetId: string;
  targetTitle: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  fullUrl: string;
  createdAt: string;
}

const STORAGE_KEY = 'viecultures_marketing_campaigns';

const CHANNEL_DEFAULTS: Record<
  UtmCampaignItem['channel'],
  { source: string; medium: string }
> = {
  Facebook: { source: 'facebook', medium: 'social' },
  TikTok: { source: 'tiktok', medium: 'social_video' },
  Google: { source: 'google', medium: 'cpc' },
  Email: { source: 'newsletter', medium: 'email' },
  Zalo: { source: 'zalo', medium: 'chat' },
};

type MarketingTabKey = 'utm' | 'broadcast';

export const MarketingManagementView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active sub-tab synced with query string ?tab=...
  const activeTab: MarketingTabKey = useMemo(() => {
    const raw = searchParams.get('tab');
    if (raw === 'broadcast' || raw === 'utm') {
      return raw;
    }
    return 'utm';
  }, [searchParams]);

  const handleSelectTab = (tab: MarketingTabKey) => {
    setSearchParams({ tab });
  };

  // Campaign Links stored in localStorage
  const [campaigns, setCampaigns] = useState<UtmCampaignItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Content Selection state
  const [posts, setPosts] = useState<ReadingPostItem[]>([]);
  const [journeys, setJourneys] = useState<LearningJourneyItem[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // UTM Builder Form State
  const [targetType, setTargetType] = useState<'POST' | 'JOURNEY'>('POST');
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
  const [channel, setChannel] = useState<UtmCampaignItem['channel']>('Facebook');
  const [campaignName, setCampaignName] = useState<string>('');
  const [campaignContent, setCampaignContent] = useState<string>('');
  const [customBasePath, setCustomBasePath] = useState<string>('');

  // Newsletter & Notification Form State
  const [toEmail, setToEmail] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [newsletterSubject, setNewsletterSubject] = useState<string>('');
  const [newsletterHeadline, setNewsletterHeadline] = useState<string>('');
  const [newsletterContent, setNewsletterContent] = useState<string>('');
  const [actionUrl, setActionUrl] = useState<string>('');
  const [actionText, setActionText] = useState<string>('Xem Chi Tiết');

  // Async States
  const [isSendingMail, setIsSendingMail] = useState<boolean>(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState<boolean>(false);
  const [smtpStatus, setSmtpStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [feedbackToast, setFeedbackToast] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [copiedPreview, setCopiedPreview] = useState<boolean>(false);

  // Load campaigns from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCampaigns(parsed);
        }
      }
    } catch (err) {
      console.error('Lỗi khi đọc danh sách chiến dịch từ localStorage:', err);
    }
  }, []);

  // Save campaigns to localStorage
  const saveCampaignsToStorage = (updated: UtmCampaignItem[]) => {
    setCampaigns(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Lỗi khi lưu danh sách chiến dịch vào localStorage:', err);
    }
  };

  // Load real posts and journeys for selection
  const loadContentData = useCallback(async () => {
    setIsLoadingContent(true);
    try {
      const [fetchedPosts, fetchedJourneys] = await Promise.all([
        postAdminService.getPosts().catch(() => []),
        journeyAdminService.getJourneys().catch(() => []),
      ]);
      setPosts(fetchedPosts);
      setJourneys(fetchedJourneys);

      if (fetchedPosts.length > 0 && !selectedTargetId) {
        setSelectedTargetId(fetchedPosts[0].id);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài viết và hành trình:', err);
    } finally {
      setIsLoadingContent(false);
    }
  }, [selectedTargetId]);

  useEffect(() => {
    loadContentData();
  }, [loadContentData]);

  // Set default email to logged-in admin if available
  useEffect(() => {
    const user = getStoredUser();
    if (user?.email && !toEmail) {
      setToEmail(user.email);
    }
  }, [toEmail]);

  // Generate URL in real time
  const generatedUtmUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://viecultures.com';
    let path = '';

    if (customBasePath.trim()) {
      path = customBasePath.trim().startsWith('/') ? customBasePath.trim() : `/${customBasePath.trim()}`;
    } else if (targetType === 'POST') {
      const found = posts.find((p) => p.id === selectedTargetId);
      path = found ? `/reading/${found.id}` : '/reading';
    } else {
      const found = journeys.find((j) => j.id === selectedTargetId);
      path = found ? `/journeys/${found.id}` : '/journeys';
    }

    const { source, medium } = CHANNEL_DEFAULTS[channel];
    const safeCampaign = campaignName.trim().toLowerCase().replace(/\s+/g, '-');
    const safeContent = campaignContent.trim().toLowerCase().replace(/\s+/g, '-');

    const params = new URLSearchParams();
    params.set('utm_source', source);
    params.set('utm_medium', medium);
    if (safeCampaign) params.set('utm_campaign', safeCampaign);
    if (safeContent) params.set('utm_content', safeContent);

    return `${origin}${path}?${params.toString()}`;
  }, [targetType, selectedTargetId, channel, campaignName, campaignContent, customBasePath, posts, journeys]);

  // Handle Save Campaign Link
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) {
      setFeedbackToast({
        type: 'error',
        text: 'Vui lòng nhập tên chiến dịch (utm_campaign).',
      });
      return;
    }

    let targetTitle = 'Trang chương trình';
    if (targetType === 'POST') {
      const found = posts.find((p) => p.id === selectedTargetId);
      if (found) targetTitle = found.titleEn || found.titleVi || 'Bài đọc văn hóa';
    } else {
      const found = journeys.find((j) => j.id === selectedTargetId);
      if (found) targetTitle = found.titleEn || found.titleVi || 'Hành trình học';
    }

    const { source, medium } = CHANNEL_DEFAULTS[channel];
    const newCampaign: UtmCampaignItem = {
      id: `utm-${Date.now()}`,
      name: campaignName.trim(),
      channel,
      targetType,
      targetId: selectedTargetId,
      targetTitle,
      utmSource: source,
      utmMedium: medium,
      utmCampaign: campaignName.trim().toLowerCase().replace(/\s+/g, '-'),
      utmContent: campaignContent.trim() || undefined,
      fullUrl: generatedUtmUrl,
      createdAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    };

    saveCampaignsToStorage([newCampaign, ...campaigns]);
    setCampaignName('');
    setCampaignContent('');

    // Copy to clipboard
    navigator.clipboard.writeText(generatedUtmUrl);
    setFeedbackToast({
      type: 'success',
      text: 'Đã tạo và lưu liên kết chiến dịch thành công! Liên kết đã được sao chép vào bộ nhớ tạm.',
    });
  };

  // Copy single link
  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setFeedbackToast({
      type: 'success',
      text: 'Đã sao chép liên kết chiến dịch vào bộ nhớ tạm!',
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Delete saved campaign
  const handleDeleteCampaign = (id: string) => {
    const updated = campaigns.filter((c) => c.id !== id);
    saveCampaignsToStorage(updated);
    setFeedbackToast({
      type: 'success',
      text: 'Đã xóa liên kết chiến dịch khỏi danh sách.',
    });
  };

  // Handle Send Notification Email
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !newsletterSubject.trim() || !newsletterContent.trim()) {
      setFeedbackToast({
        type: 'error',
        text: 'Vui lòng nhập địa chỉ email người nhận, tiêu đề và nội dung bản tin.',
      });
      return;
    }

    setIsSendingMail(true);
    setFeedbackToast(null);

    try {
      const res = await adminMailService.sendNotification({
        toEmail: toEmail.trim(),
        recipientName: recipientName.trim() || undefined,
        subject: newsletterSubject.trim(),
        headline: newsletterHeadline.trim() || newsletterSubject.trim(),
        messageContent: `<p>${newsletterContent.trim().replace(/\n/g, '<br/>')}</p>`,
        actionUrl: actionUrl.trim() || undefined,
        actionText: actionText.trim() || 'Xem Chi Tiết',
      });

      setFeedbackToast({
        type: 'success',
        text: res.message || 'Đã gửi bản tin thông báo thành công!',
      });
      setNewsletterSubject('');
      setNewsletterHeadline('');
      setNewsletterContent('');
      setActionUrl('');
    } catch (err: unknown) {
      console.error('Lỗi khi gửi email thông báo:', err);
      const msg = err instanceof Error ? err.message : 'Không thể gửi email thông báo';
      setFeedbackToast({
        type: 'error',
        text: msg,
      });
    } finally {
      setIsSendingMail(false);
    }
  };

  // Handle Test Connection Gmail SMTP
  const handleTestSmtpConnection = async () => {
    if (!toEmail.trim()) {
      setFeedbackToast({
        type: 'error',
        text: 'Vui lòng nhập địa chỉ email nhận thử nghiệm trước khi kiểm tra SMTP.',
      });
      return;
    }

    setIsTestingSmtp(true);
    setSmtpStatus('TESTING');
    setFeedbackToast(null);

    try {
      const res = await adminMailService.testConnection(toEmail.trim());
      setSmtpStatus('SUCCESS');
      setFeedbackToast({
        type: 'success',
        text: res.message || `Đã gửi email kiểm tra tới ${toEmail}. Gmail SMTP kết nối thành công!`,
      });
    } catch (err: unknown) {
      console.error('Lỗi khi kiểm tra Gmail SMTP:', err);
      setSmtpStatus('ERROR');
      const msg = err instanceof Error ? err.message : 'Kiểm tra kết nối Gmail SMTP thất bại';
      setFeedbackToast({
        type: 'error',
        text: msg,
      });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {feedbackToast && (
        <div
          role="status"
          className={`p-4 rounded-2xl text-xs flex items-center justify-between border ${
            feedbackToast.type === 'success'
              ? 'bg-emerald-100 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-100 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackToast.type === 'success' ? (
              <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle aria-hidden="true" className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            )}
            <span>{feedbackToast.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="font-bold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Liên kết chiến dịch đã tạo</span>
            <Megaphone aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          </div>
          <div className="text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
            {campaigns.length}
          </div>
          <p className="text-[11px] text-text-secondary">Lưu trữ an toàn trên trình duyệt</p>
        </div>

        <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Nội dung sẵn sàng qua API</span>
            <BookOpen aria-hidden="true" className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
            {posts.length + journeys.length}
          </div>
          <p className="text-[11px] text-text-secondary">
            {posts.length} bài đọc &bull; {journeys.length} hành trình
          </p>
        </div>
      </div>

      {/* ── Sub-Tab Switcher Navigation ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-xs">
        {[
          { key: 'utm', label: '1. Tạo link UTM (Nội bộ)', icon: Target },
          { key: 'broadcast', label: '2. Email & Bản tin di sản', icon: Mail },
        ].map((tabItem) => {
          const isActive = activeTab === tabItem.key;
          const TabIcon = tabItem.icon;
          return (
            <button
              key={tabItem.key}
              type="button"
              onClick={() => handleSelectTab(tabItem.key as MarketingTabKey)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-heritage-green text-warm-ivory shadow-sm border border-antique-gold/50'
                  : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright hover:bg-antique-gold/15'
              }`}
            >
              <TabIcon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-antique-gold' : 'text-text-muted'
                }`}
                aria-hidden="true"
              />
              <span>{tabItem.label}</span>
              {isActive && (
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-antique-gold rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: Quick UTM Campaign Builder ───────────────────────────── */}
      {activeTab === 'utm' && (
        <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-antique-gold/20 pb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                <Target aria-hidden="true" className="w-5 h-5 text-antique-gold" />
                <span>Công cụ Tạo Liên Kết Chiến Dịch (Quick UTM Builder)</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Gắn thẻ UTM trực tiếp vào bài đọc hoặc hành trình để đo lường chuyển đổi học viên đăng ký hoàn toàn miễn phí.
              </p>
            </div>

            <button
              type="button"
              onClick={loadContentData}
              disabled={isLoadingContent}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-antique-gold/30 hover:bg-antique-gold/15 text-xs font-semibold text-text-secondary transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingContent ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>Cập nhật danh mục</span>
            </button>
          </div>

          <form onSubmit={handleSaveCampaign} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Target Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Loại nội dung đích
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetType('POST');
                      if (posts.length > 0) setSelectedTargetId(posts[0].id);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      targetType === 'POST'
                        ? 'bg-heritage-green text-warm-ivory border-heritage-green shadow-sm'
                        : 'bg-warm-ivory dark:bg-heritage-dark/80 border-antique-gold/30 text-text-secondary'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Bài đọc ({posts.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetType('JOURNEY');
                      if (journeys.length > 0) setSelectedTargetId(journeys[0].id);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      targetType === 'JOURNEY'
                        ? 'bg-heritage-green text-warm-ivory border-heritage-green shadow-sm'
                        : 'bg-warm-ivory dark:bg-heritage-dark/80 border-antique-gold/30 text-text-secondary'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Hành trình ({journeys.length})</span>
                  </button>
                </div>
              </div>

              {/* Target Item Selection */}
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="targetItemSelect" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Chọn bài viết hoặc hành trình từ cơ sở dữ liệu
                </label>
                {targetType === 'POST' ? (
                  <select
                    id="targetItemSelect"
                    aria-label="Chọn bài viết từ cơ sở dữ liệu"
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                  >
                    {posts.length === 0 ? (
                      <option value="">Chưa có bài viết nào từ API</option>
                    ) : (
                      posts.map((p) => (
                        <option key={p.id} value={p.id}>
                          [{p.level || 'B1'}] {p.titleEn} ({p.titleVi})
                        </option>
                      ))
                    )}
                  </select>
                ) : (
                  <select
                    id="targetItemSelect"
                    aria-label="Chọn hành trình từ cơ sở dữ liệu"
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                  >
                    {journeys.length === 0 ? (
                      <option value="">Chưa có hành trình nào từ API</option>
                    ) : (
                      journeys.map((j) => (
                        <option key={j.id} value={j.id}>
                          [{j.region || 'Toàn quốc'}] {j.titleEn} ({j.titleVi})
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Channel Selection */}
              <div className="space-y-1.5">
                <label htmlFor="campaignChannelSelect" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Kênh phân phối
                </label>
                <select
                  id="campaignChannelSelect"
                  aria-label="Kênh phân phối"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as UtmCampaignItem['channel'])}
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  <option value="Facebook">Facebook (utm_source=facebook, medium=social)</option>
                  <option value="TikTok">TikTok (utm_source=tiktok, medium=social_video)</option>
                  <option value="Google">Google Search/Ads (utm_source=google, medium=cpc)</option>
                  <option value="Email">Email Marketing (utm_source=newsletter, medium=email)</option>
                  <option value="Zalo">Zalo OA/Chat (utm_source=zalo, medium=chat)</option>
                </select>
              </div>

              {/* Campaign Name (utm_campaign) */}
              <div className="space-y-1.5">
                <label htmlFor="utmCampaignNameInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Tên chiến dịch (utm_campaign) *
                </label>
                <input
                  id="utmCampaignNameInput"
                  type="text"
                  required
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="ví dụ: di-san-mien-trung-2026"
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
              </div>

              {/* Campaign Content (utm_content) */}
              <div className="space-y-1.5">
                <label htmlFor="utmCampaignContentInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Nội dung / Bài đăng (utm_content)
                </label>
                <input
                  id="utmCampaignContentInput"
                  type="text"
                  value={campaignContent}
                  onChange={(e) => setCampaignContent(e.target.value)}
                  placeholder="ví dụ: carousel-post-1, hero-banner"
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
              </div>
            </div>

            {/* Generated URL Box */}
            <div className="p-4 rounded-2xl bg-heritage-forest/10 dark:bg-white/5 border border-antique-gold/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-heritage-green dark:text-antique-bright">
                <span className="flex items-center gap-1.5">
                  <Target aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Xem trước liên kết chiến dịch (Live UTM Preview):</span>
                </span>
                <span className="text-[11px] font-mono text-text-muted">Độ dài: {generatedUtmUrl.length} ký tự</span>
              </div>

              {/* Parameter Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-heritage-green/10 dark:bg-white/10 text-heritage-green dark:text-antique-bright text-[11px] font-mono font-bold border border-antique-gold/30">
                  utm_source: <span className="text-antique-gold">{CHANNEL_DEFAULTS[channel].source}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-heritage-green/10 dark:bg-white/10 text-heritage-green dark:text-antique-bright text-[11px] font-mono font-bold border border-antique-gold/30">
                  utm_medium: <span className="text-antique-gold">{CHANNEL_DEFAULTS[channel].medium}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-antique-gold/20 text-heritage-green dark:text-antique-bright text-[11px] font-mono font-bold border border-antique-gold/30">
                  utm_campaign: <span className="font-semibold">{campaignName.trim().toLowerCase().replace(/\s+/g, '-') || '(chưa nhập)'}</span>
                </span>
                {campaignContent.trim() && (
                  <span className="px-2 py-0.5 rounded-md bg-antique-gold/15 text-heritage-green dark:text-antique-bright text-[11px] font-mono font-bold border border-antique-gold/30">
                    utm_content: <span>{campaignContent.trim().toLowerCase().replace(/\s+/g, '-')}</span>
                  </span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-rice-paper dark:bg-heritage-dark font-mono text-xs text-heritage-green dark:text-antique-bright border border-antique-gold/30 break-all select-all leading-relaxed shadow-inner">
                {generatedUtmUrl}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-heritage-green text-warm-ivory hover:bg-heritage-dark text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4 text-antique-gold" aria-hidden="true" />
                  <span>Tạo và Lưu Liên Kết Chiến Dịch</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUtmUrl);
                    setCopiedPreview(true);
                    setFeedbackToast({
                      type: 'success',
                      text: 'Đã sao chép liên kết chiến dịch UTM vào bộ nhớ tạm!',
                    });
                    setTimeout(() => setCopiedPreview(false), 2500);
                  }}
                  className="py-2.5 px-4 rounded-xl bg-antique-gold/20 hover:bg-antique-gold/30 border border-antique-gold/40 text-heritage-green dark:text-antique-bright text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-[1.01] active:scale-[0.98]"
                >
                  {copiedPreview ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                      <span>Đã chép liên kết</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-antique-gold" aria-hidden="true" />
                      <span>Sao chép URL 1-Click</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Saved Campaigns List */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Danh sách liên kết chiến dịch đã tạo ({campaigns.length})
              </h4>
              {campaigns.length > 0 && (
                <button
                  type="button"
                  onClick={() => saveCampaignsToStorage([])}
                  className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Xóa toàn bộ
                </button>
              )}
            </div>

            {campaigns.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-antique-gold/30 space-y-1">
                <Target className="w-8 h-8 text-antique-gold/40 mx-auto" aria-hidden="true" />
                <p className="text-xs font-bold text-text-secondary">Chưa có liên kết chiến dịch nào được lưu</p>
                <p className="text-[11px] text-text-muted">
                  Điền thông tin ở biểu mẫu trên để tự động tạo liên kết UTM cho chiến dịch Marketing.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-3.5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/25 hover:border-antique-gold/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/30">
                          {camp.channel}
                        </span>
                        <span className="font-bold text-heritage-green dark:text-warm-ivory">
                          {camp.name}
                        </span>
                        <span className="text-[11px] text-text-muted font-mono">
                          ({camp.targetType === 'POST' ? 'Bài đọc' : 'Hành trình'}: {camp.targetTitle})
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-text-secondary truncate max-w-xl">
                        {camp.fullUrl}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyLink(camp.fullUrl, camp.id)}
                        className="px-3 py-1.5 rounded-lg bg-antique-gold/15 hover:bg-antique-gold/25 text-heritage-green dark:text-antique-bright text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Chép liên kết"
                      >
                        {copiedId === camp.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                            <span>Đã chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Chép liên kết</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 transition-colors cursor-pointer"
                        title="Xóa liên kết"
                        aria-label="Xóa liên kết"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: Email & Bản tin di sản ───────────────────────────────── */}
      {activeTab === 'broadcast' && (
        <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-antique-gold/20 pb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                <Mail aria-hidden="true" className="w-5 h-5 text-antique-gold" />
                <span>Gửi Thông Báo & Bản Tin Văn Hóa (Email Notification Engine)</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Phát hành email định kỳ với template Warm Heritage tích hợp qua hệ thống Gmail SMTP của máy chủ backend.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              {/* SMTP Status Visual Badge */}
              {smtpStatus === 'IDLE' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-warm-ivory dark:bg-white/5 border border-antique-gold/30 text-xs font-semibold text-text-muted">
                  <Radio className="w-3.5 h-3.5 text-antique-gold" aria-hidden="true" />
                  <span>Sẵn sàng kiểm tra SMTP</span>
                </span>
              )}
              {smtpStatus === 'TESTING' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" aria-hidden="true" />
                  <span>Đang kết nối Gmail SMTP...</span>
                </span>
              )}
              {smtpStatus === 'SUCCESS' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Gmail SMTP: Đã xác thực</span>
                </span>
              )}
              {smtpStatus === 'ERROR' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 text-xs font-bold text-rose-800 dark:text-rose-300">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" aria-hidden="true" />
                  <span>Kết nối SMTP thất bại</span>
                </span>
              )}

              <button
                type="button"
                onClick={handleTestSmtpConnection}
                disabled={isTestingSmtp}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-antique-gold/15 hover:bg-antique-gold/25 border border-antique-gold/40 text-heritage-green dark:text-antique-bright text-xs font-bold transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingSmtp ? 'animate-spin text-rose-500' : 'text-antique-gold'}`} aria-hidden="true" />
                <span>{isTestingSmtp ? 'Đang kiểm tra...' : 'Kiểm tra kết nối Gmail SMTP'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recipient Email */}
              <div className="space-y-1.5">
                <label htmlFor="recipientEmailInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Địa chỉ Email người nhận *
                </label>
                <input
                  id="recipientEmailInput"
                  type="email"
                  required
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="ví dụ: hocvien@viecultures.com hoặc admin@viecultures.com"
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
              </div>

              {/* Recipient Name */}
              <div className="space-y-1.5">
                <label htmlFor="recipientNameInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Tên người nhận
                </label>
                <input
                  id="recipientNameInput"
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="ví dụ: Bạn Nguyễn Văn A"
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="newsletterSubjectInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Tiêu đề thư (Subject) *
                </label>
                <input
                  id="newsletterSubjectInput"
                  type="text"
                  required
                  value={newsletterSubject}
                  onChange={(e) => setNewsletterSubject(e.target.value)}
                  placeholder="ví dụ: VieCultures - Khám phá bí ẩn ẩm thực cung đình Huế tuần này"
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
              </div>

              {/* Headline */}
              <div className="space-y-1.5">
                <label htmlFor="newsletterHeadlineInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Tiêu đề lớn Warm Heritage (Headline)
                </label>
                <input
                  id="newsletterHeadlineInput"
                  type="text"
                  value={newsletterHeadline}
                  onChange={(e) => setNewsletterHeadline(e.target.value)}
                  placeholder="ví dụ: Tinh Hoa Ẩm Thực Cung Đình Huế"
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-1.5">
              <label htmlFor="newsletterContentInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Nội dung thông báo / Bản tin *
              </label>
              <textarea
                id="newsletterContentInput"
                rows={4}
                required
                value={newsletterContent}
                onChange={(e) => setNewsletterContent(e.target.value)}
                placeholder="Nhập nội dung thông điệp gửi tới học viên. Hệ thống sẽ tự động lồng ghép vào khung template Warm Heritage trang nhã..."
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Action URL */}
              <div className="space-y-1.5">
                <label htmlFor="newsletterActionUrlInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Đường dẫn hành động (Action URL)
                </label>
                <input
                  id="newsletterActionUrlInput"
                  type="url"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="ví dụ: https://viecultures.com/reading/post-101"
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
              </div>

              {/* Action Text */}
              <div className="space-y-1.5">
                <label htmlFor="newsletterActionTextInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                  Nhãn nút bấm hành động (Action Text)
                </label>
                <input
                  id="newsletterActionTextInput"
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  placeholder="ví dụ: Khám Phá Ngay, Luyện Đọc Ngay"
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSendingMail}
              className="w-full py-3 px-4 rounded-xl bg-heritage-green text-warm-ivory hover:bg-heritage-dark text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isSendingMail ? 'animate-pulse' : ''}`} aria-hidden="true" />
              <span>{isSendingMail ? 'Đang phát hành email qua Gmail SMTP...' : 'Phát Hành Thông Báo Email'}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default MarketingManagementView;
