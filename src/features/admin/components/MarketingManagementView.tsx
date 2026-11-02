import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Megaphone,
  Send,
  Mail,
  Share2,
  CheckCircle2,
  Clock,
  Target,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Radio,
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

export const MarketingManagementView: React.FC = () => {
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
  const [actionText, setActionText] = useState<string>('Xem Chi Tiet');

  // Async States
  const [isSendingMail, setIsSendingMail] = useState<boolean>(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

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
      console.error('Loi khi doc danh sach chien dich tu localStorage:', err);
    }
  }, []);

  // Save campaigns to localStorage
  const saveCampaignsToStorage = (updated: UtmCampaignItem[]) => {
    setCampaigns(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Loi khi luu danh sach chien dich vao localStorage:', err);
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
      console.error('Loi khi tai danh sach bai viet va hanh trinh:', err);
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
        text: 'Vui long nhap ten chien dich (utm_campaign).',
      });
      return;
    }

    let targetTitle = 'Trang chuong trinh';
    if (targetType === 'POST') {
      const found = posts.find((p) => p.id === selectedTargetId);
      if (found) targetTitle = found.titleEn || found.titleVi || 'Bai doc van hoa';
    } else {
      const found = journeys.find((j) => j.id === selectedTargetId);
      if (found) targetTitle = found.titleEn || found.titleVi || 'Hanh trinh hoc';
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
      text: 'Da tao va luu link chien dich thanh cong! Link da duoc chep vao bo nho tam.',
    });
  };

  // Copy single link
  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setFeedbackToast({
      type: 'success',
      text: 'Da sao chep link chien dich vao bo nho tam!',
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Delete saved campaign
  const handleDeleteCampaign = (id: string) => {
    const updated = campaigns.filter((c) => c.id !== id);
    saveCampaignsToStorage(updated);
    setFeedbackToast({
      type: 'success',
      text: 'Da xoa link chien dich khoi danh sach.',
    });
  };

  // Handle Send Notification Email
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !newsletterSubject.trim() || !newsletterContent.trim()) {
      setFeedbackToast({
        type: 'error',
        text: 'Vui long nhap email nguoi nhan, tieu de va noi dung ban tin.',
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
        actionText: actionText.trim() || 'Xem Chi Tiet',
      });

      setFeedbackToast({
        type: 'success',
        text: res.message || 'Da gui ban tin thong bao thanh cong!',
      });
      setNewsletterSubject('');
      setNewsletterHeadline('');
      setNewsletterContent('');
      setActionUrl('');
    } catch (err: unknown) {
      console.error('Loi khi gui email thong bao:', err);
      const msg = err instanceof Error ? err.message : 'Khong the gui email thong bao';
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
        text: 'Vui long nhap dia chi email nhan thu nghiem truoc khi kiem tra SMTP.',
      });
      return;
    }

    setIsTestingSmtp(true);
    setFeedbackToast(null);

    try {
      const res = await adminMailService.testConnection(toEmail.trim());
      setFeedbackToast({
        type: 'success',
        text: res.message || `Da gui email kiem tra toi ${toEmail}. Gmail SMTP ket noi thanh cong!`,
      });
    } catch (err: unknown) {
      console.error('Loi khi kiem tra Gmail SMTP:', err);
      const msg = err instanceof Error ? err.message : 'Kiem tra ket noi Gmail SMTP that bai';
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
            Dong
          </button>
        </div>
      )}

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Link chien dich da tao</span>
            <Megaphone aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          </div>
          <div className="text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
            {campaigns.length}
          </div>
          <p className="text-[11px] text-text-secondary">Luu tru an toan tren trinh duyet</p>
        </div>

        <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Noi dung san sang qua API</span>
            <BookOpen aria-hidden="true" className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
            {posts.length + journeys.length}
          </div>
          <p className="text-[11px] text-text-secondary">
            {posts.length} bai doc &bull; {journeys.length} hanh trinh
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span>Kenh chien dich ho tro</span>
            <Share2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          </div>
          <div className="text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
            5 Kenh
          </div>
          <p className="text-[11px] text-text-secondary">Facebook, TikTok, Google, Email, Zalo</p>
        </div>
      </div>

      {/* ── Section 1: Quick UTM Campaign Builder ───────────────────────── */}
      <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-antique-gold/20 pb-4">
          <div>
            <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
              <Target aria-hidden="true" className="w-5 h-5 text-antique-gold" />
              <span>Cong cu Tao Link Chien Dich (Quick UTM Builder)</span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Gan the UTM truc tiep vao bai doc hoac hanh trinh de do luong hieu qua qua Google Analytics va kenh tiep thi.
            </p>
          </div>

          <button
            type="button"
            onClick={loadContentData}
            disabled={isLoadingContent}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-antique-gold/30 hover:bg-antique-gold/15 text-xs font-semibold text-text-secondary transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingContent ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Cap nhat danh muc</span>
          </button>
        </div>

        <form onSubmit={handleSaveCampaign} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Target Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Loai noi dung dich
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
                  <span>Bai doc ({posts.length})</span>
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
                  <span>Hanh trinh ({journeys.length})</span>
                </button>
              </div>
            </div>

            {/* Target Item Selection */}
            <div className="space-y-1.5 md:col-span-2">
              <label htmlFor="targetItemSelect" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Chon bai viet hoac hanh trinh tu CSDL
              </label>
              {targetType === 'POST' ? (
                <select
                  id="targetItemSelect"
                  aria-label="Chon bai viet tu co so du lieu"
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  {posts.length === 0 ? (
                    <option value="">Chua co bai viet nao tu API</option>
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
                  aria-label="Chon hanh trinh tu co so du lieu"
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  {journeys.length === 0 ? (
                    <option value="">Chua co hanh trinh nao tu API</option>
                  ) : (
                    journeys.map((j) => (
                      <option key={j.id} value={j.id}>
                        [{j.region || 'Toan Quoc'}] {j.titleEn} ({j.titleVi})
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
                Kenh chien dich
              </label>
              <select
                id="campaignChannelSelect"
                aria-label="Kenh chien dich"
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
                Ten chien dich (utm_campaign) *
              </label>
              <input
                id="utmCampaignNameInput"
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="vi-du: di-san-mien-trung-2026"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
              />
            </div>

            {/* Campaign Content (utm_content) */}
            <div className="space-y-1.5">
              <label htmlFor="utmCampaignContentInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Noi dung / Bai dang (utm_content)
              </label>
              <input
                id="utmCampaignContentInput"
                type="text"
                value={campaignContent}
                onChange={(e) => setCampaignContent(e.target.value)}
                placeholder="vi-du: carousel-post-1, hero-banner"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
              />
            </div>
          </div>

          {/* Generated URL Box */}
          <div className="p-4 rounded-2xl bg-heritage-forest/10 dark:bg-white/5 border border-antique-gold/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-heritage-green dark:text-antique-bright">
              <span>Link chien dich day du (Generated URL):</span>
              <span className="text-[11px] font-mono text-text-muted">Do dai: {generatedUtmUrl.length} ky tu</span>
            </div>
            <div className="p-3 rounded-xl bg-rice-paper dark:bg-heritage-dark font-mono text-xs text-heritage-green dark:text-antique-bright border border-antique-gold/20 break-all select-all">
              {generatedUtmUrl}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-heritage-green text-warm-ivory hover:bg-heritage-dark text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Tao va Luu Link Chien Dich</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedUtmUrl);
                  setFeedbackToast({
                    type: 'success',
                    text: 'Da chep link chien dich vao bo nho tam!',
                  });
                }}
                className="py-2 px-4 rounded-xl bg-antique-gold/20 hover:bg-antique-gold/30 border border-antique-gold/40 text-heritage-green dark:text-antique-bright text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Chep 1-Click</span>
              </button>
            </div>
          </div>
        </form>

        {/* Saved Campaigns List */}
        <div className="space-y-3 pt-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Danh sach link chien dich da tao ({campaigns.length})
            </h4>
            {campaigns.length > 0 && (
              <button
                type="button"
                onClick={() => saveCampaignsToStorage([])}
                className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
              >
                Xoa toan bo
              </button>
            )}
          </div>

          {campaigns.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-antique-gold/30 space-y-1">
              <Target className="w-8 h-8 text-antique-gold/40 mx-auto" aria-hidden="true" />
              <p className="text-xs font-bold text-text-secondary">Chua co link chien dich nao duoc luu</p>
              <p className="text-[11px] text-text-muted">
                Dien thong tin o bieu mau tren de tu dong tao link UTM cho chien dich marketing.
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
                        ({camp.targetType === 'POST' ? 'Bai doc' : 'Hanh trinh'}: {camp.targetTitle})
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
                      title="Chep link"
                    >
                      {copiedId === camp.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                          <span>Da chep</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Chep link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCampaign(camp.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-600 transition-colors cursor-pointer"
                      title="Xoa link"
                      aria-label="Xoa link"
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

      {/* ── Section 2: Automated Notification & Newsletter Composer ───── */}
      <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-antique-gold/20 pb-4">
          <div>
            <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
              <Mail aria-hidden="true" className="w-5 h-5 text-antique-gold" />
              <span>Gui Thong Bao & Ban Tin Van Hoa (Email Notification Engine)</span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Phat hanh email dinh ky voi template Warm Heritage tich hop qua he thong Gmail SMTP cua may chu backend.
            </p>
          </div>

          <button
            type="button"
            onClick={handleTestSmtpConnection}
            disabled={isTestingSmtp}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-antique-gold/15 hover:bg-antique-gold/25 border border-antique-gold/40 text-heritage-green dark:text-antique-bright text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <Radio className={`w-3.5 h-3.5 ${isTestingSmtp ? 'animate-pulse text-rose-500' : 'text-antique-gold'}`} aria-hidden="true" />
            <span>{isTestingSmtp ? 'Dang kiem tra SMTP...' : 'Kiem tra ket noi Gmail SMTP'}</span>
          </button>
        </div>

        <form onSubmit={handleSendNotification} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recipient Email */}
            <div className="space-y-1.5">
              <label htmlFor="recipientEmailInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Dia chi Email nguoi nhan *
              </label>
              <input
                id="recipientEmailInput"
                type="email"
                required
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="vi-du: hocvien@viecultures.com hoac admin@viecultures.com"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
              />
            </div>

            {/* Recipient Name */}
            <div className="space-y-1.5">
              <label htmlFor="recipientNameInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Ten nguoi nhan
              </label>
              <input
                id="recipientNameInput"
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="vi-du: Ban Nguyen Van A"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject */}
            <div className="space-y-1.5">
              <label htmlFor="newsletterSubjectInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Tieu de thu (Subject) *
              </label>
              <input
                id="newsletterSubjectInput"
                type="text"
                required
                value={newsletterSubject}
                onChange={(e) => setNewsletterSubject(e.target.value)}
                placeholder="vi-du: VieCultures - Kham pha bi an am thuc cung dinh Hue tuan nay"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
              />
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <label htmlFor="newsletterHeadlineInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Tieu de lon Warm Heritage (Headline)
              </label>
              <input
                id="newsletterHeadlineInput"
                type="text"
                value={newsletterHeadline}
                onChange={(e) => setNewsletterHeadline(e.target.value)}
                placeholder="vi-du: Tinh Hoa Am Thuc Cung Dinh Hue"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
              />
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-1.5">
            <label htmlFor="newsletterContentInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Noi dung thong bao / Ban tin *
            </label>
            <textarea
              id="newsletterContentInput"
              rows={4}
              required
              value={newsletterContent}
              onChange={(e) => setNewsletterContent(e.target.value)}
              placeholder="Nhap noi dung thong diep gui toi hoc vien. He thong se tu dong long ghep vao khung template Warm Heritage trang nha..."
              className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Action URL */}
            <div className="space-y-1.5">
              <label htmlFor="newsletterActionUrlInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Duong dan hanh dong (Action URL)
              </label>
              <input
                id="newsletterActionUrlInput"
                type="url"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="vi-du: https://viecultures.com/reading/post-101"
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
              />
            </div>

            {/* Action Text */}
            <div className="space-y-1.5">
              <label htmlFor="newsletterActionTextInput" className="text-xs font-bold text-text-body dark:text-warm-ivory">
                Nhan nut bam hanh dong (Action Text)
              </label>
              <input
                id="newsletterActionTextInput"
                type="text"
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="vi-du: Kham Pha Ngay, Luyen Doc Ngay"
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
            <span>{isSendingMail ? 'Dang phat hanh email qua Gmail SMTP...' : 'Phat Hanh Thong Bao Email'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default MarketingManagementView;
