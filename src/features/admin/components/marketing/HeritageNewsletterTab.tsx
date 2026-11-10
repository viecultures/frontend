import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Mail,
  Send,
  Calendar,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Eye,
  Clock,
  Layers,
  Copy,
} from 'lucide-react';
import { growthEngineService, MERGE_TAGS } from '../../services/growthEngineService';
import { postAdminService } from '../../services/postAdminService';
import type {
  HeritageNewsletterItem,
  AudienceSegmentKey,
  AudienceSegmentOption,
} from '../../types/marketing.contract';
import type { ReadingPostItem } from '../../types/adminTypes';
import { getStoredUser } from '@/utils/auth-storage';

export const HeritageNewsletterTab: React.FC = () => {
  // Data states
  const [newsletters, setNewsletters] = useState<HeritageNewsletterItem[]>([]);
  const [posts, setPosts] = useState<ReadingPostItem[]>([]);
  const [segments, setSegments] = useState<AudienceSegmentOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [targetSegment, setTargetSegment] = useState<AudienceSegmentKey>('ALL_USERS');
  const [subject, setSubject] = useState<string>('');
  const [headline, setHeadline] = useState<string>('Khám phá tinh hoa di sản Việt');
  const [content, setContent] = useState<string>(
    'Chào {{ten_hoc_vien}},\n\nTuần này VieCultures mang đến cho bạn câu chuyện đặc sắc về văn hóa ẩm thực truyền thống. Hãy cùng dành 5 phút luyện nghe Audio Shadowing và mở rộng vốn từ vựng nhé!'
  );
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [actionUrl, setActionUrl] = useState<string>('https://viecultures.app/reading');
  const [actionText, setActionText] = useState<string>('Đọc câu chuyện & Luyện nghe');
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduledAt, setScheduledAt] = useState<string>('');

  // Test email state
  const [testEmail, setTestEmail] = useState<string>('');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitFeedback, setSubmitFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load initial data (Stable dependency to prevent waterfall re-renders)
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [nlList, postsList, segmentList] = await Promise.all([
        growthEngineService.getNewsletters(),
        postAdminService.getPosts().catch(() => [] as ReadingPostItem[]),
        growthEngineService.getAudienceSegments(),
      ]);
      setNewsletters(nlList);
      setPosts(postsList);
      setSegments(segmentList);
      if (segmentList.length > 0) {
        setTargetSegment((prev) => (segmentList.some((s) => s.key === prev) ? prev : segmentList[0].key));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi tải danh sách bản tin';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Pre-fill user test email
  useEffect(() => {
    const user = getStoredUser();
    if (user?.email && !testEmail) {
      setTestEmail(user.email);
    }
  }, [testEmail]);

  // Selected audience segment metadata
  const currentSegment = useMemo(() => {
    return (
      segments.find((s) => s.key === targetSegment) || {
        key: 'ALL_USERS' as AudienceSegmentKey,
        label: 'Tất cả học viên',
        estimatedCount: 0,
        description: 'Toàn bộ tài khoản học viên trong cơ sở dữ liệu.',
      }
    );
  }, [segments, targetSegment]);

  // Handle Pick Heritage Post
  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
    const found = posts.find((p) => p.id === postId);
    if (found) {
      setSubject(`Bản tin Di sản: ${found.titleVi || found.titleEn}`);
      setHeadline(found.titleVi || found.titleEn);
      const postSlug = found.id;
      setActionUrl(`https://viecultures.app/reading/${postSlug}?utm_source=newsletter&utm_medium=email&utm_campaign=di-san-hang-tuan`);
    }
  };

  const selectedPost = useMemo(() => {
    return posts.find((p) => p.id === selectedPostId);
  }, [posts, selectedPostId]);

  // Handle Insert Merge Tag
  const handleInsertTag = (tag: string) => {
    setContent((prev) => `${prev} ${tag}`);
  };

  // Handle Send Test Email
  const handleSendTest = async () => {
    if (!testEmail.trim()) {
      setTestResult({ success: false, message: 'Vui lòng nhập địa chỉ email nhận bản tin thử nghiệm' });
      return;
    }
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const res = await growthEngineService.sendTestEmail({
        toEmail: testEmail.trim(),
        subject: subject.trim() || 'Bản tin Di sản VieCultures',
        headline: headline.trim(),
        content: content.trim(),
        actionUrl: actionUrl.trim(),
        actionText: actionText.trim(),
      });
      setTestResult({
        success: true,
        message: res.message || `Đã gửi bản tin xem trước tới ${testEmail}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi gửi email thử nghiệm';
      setTestResult({ success: false, message: msg });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Handle Publish / Schedule Newsletter
  const handleSubmitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setSubmitFeedback({ type: 'error', message: 'Vui lòng nhập tiêu đề bản tin' });
      return;
    }

    setIsSubmitting(true);
    setSubmitFeedback(null);
    try {
      const created = await growthEngineService.createNewsletter({
        subject: subject.trim(),
        headline: headline.trim(),
        content: content.trim(),
        targetSegment,
        featuredPostId: selectedPost?.id,
        featuredPostTitle: selectedPost?.titleVi || selectedPost?.titleEn,
        featuredPostSlug: selectedPost?.id,
        featuredPostCover: selectedPost?.imageUrl,
        actionUrl: actionUrl.trim(),
        actionText: actionText.trim(),
        isScheduled,
        scheduledAt: isScheduled ? scheduledAt : undefined,
      });

      setNewsletters((prev) => [created, ...prev]);
      setSubmitFeedback({
        type: 'success',
        message: isScheduled
          ? `Đã lên lịch phát hành bản tin cho ${currentSegment.estimatedCount.toLocaleString()} học viên!`
          : `Đã phát hành thành công bản tin tới ${currentSegment.estimatedCount.toLocaleString()} học viên!`,
      });

      // Reset form
      setSubject('');
      setSelectedPostId('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi phát hành bản tin';
      setSubmitFeedback({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true">
        <div className="h-64 rounded-xl bg-stone-100 dark:bg-stone-800" />
        <div className="h-64 rounded-xl bg-stone-100 dark:bg-stone-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
            Chiến dịch Email & Bản tin Di sản Hàng tuần
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Gửi bản tin văn hóa theo phân khúc học viên, hỗ trợ biến cá nhân hóa và tự động gắn link bài đọc di sản.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Làm mới</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Khung Biên soạn Bản tin & Xem trước Trực tiếp ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột Trái: Trình soạn thảo bản tin (7 Cột) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-5">
          <form onSubmit={handleSubmitNewsletter} className="space-y-4">
            {/* Phân khúc đối tượng nhận */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-heritage-green" aria-hidden="true" />
                  <span>Phân khúc Học viên Nhận tin *</span>
                </label>
                <span className="text-[11px] font-bold text-heritage-green bg-heritage-green/10 border border-heritage-green/20 px-2 py-0.5 rounded-full">
                  Ước tính: {currentSegment.estimatedCount.toLocaleString()} học viên
                </span>
              </div>

              <select
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value as AudienceSegmentKey)}
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              >
                {segments.map((seg) => (
                  <option key={seg.key} value={seg.key}>
                    {seg.label} ({seg.estimatedCount.toLocaleString()} học viên)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                {currentSegment.description}
              </p>
            </div>

            {/* Trình chọn nội dung di sản có sẵn */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" aria-hidden="true" />
                  <span>Nội dung Di sản Đính kèm (Tự động điền dữ liệu)</span>
                </label>
                <span className="text-[11px] text-stone-400">Tùy chọn</span>
              </div>
              <select
                value={selectedPostId}
                onChange={(e) => handleSelectPost(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              >
                <option value="">-- Chọn một bài đọc có sẵn trong thư viện di sản --</option>
                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.titleVi || post.titleEn} ({post.region || 'Toàn quốc'})
                  </option>
                ))}
              </select>
            </div>

            {/* Tiêu đề Email */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Tiêu đề Email (Subject) *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ví dụ: Bản tin Di sản #25: Bí quyết gian bếp Thăng Long"
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              />
            </div>

            {/* Tiêu đề phụ (Headline) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Tiêu đề Phụ trong Thư (Headline)
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ví dụ: Hương vị xưa trong nhịp sống nay"
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              />
            </div>

            {/* Thanh công cụ Chèn biến cá nhân hóa (Merge Tags) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <span>Chèn biến cá nhân hóa (1-Click)</span>
                </label>
                <span className="text-[11px] text-stone-400">Bấm để thêm vào nội dung</span>
              </div>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                {MERGE_TAGS.map((tag) => (
                  <button
                    key={tag.tag}
                    type="button"
                    onClick={() => handleInsertTag(tag.tag)}
                    title={`${tag.description} (Ví dụ: ${tag.sampleValue})`}
                    className="px-2 py-1 rounded bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] font-mono text-stone-700 dark:text-stone-300 hover:text-heritage-green hover:border-heritage-green/50 transition-colors"
                  >
                    {tag.tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Nội dung thư */}
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Nội dung thư (Message Body) *
              </label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 p-3 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green font-mono"
              />
            </div>

            {/* Nút Kêu gọi Hành động (CTA Button) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Chữ trên nút CTA
                </label>
                <input
                  type="text"
                  value={actionText}
                  onChange={(e) => setActionText(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Đường dẫn Đích (Gắn sẵn UTM)
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green font-mono"
                />
              </div>
            </div>

            {/* Lựa chọn Hẹn giờ phát hành */}
            <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="rounded text-heritage-green focus:ring-heritage-green"
                />
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Lên lịch gửi cố định (Scheduling)
                </span>
              </label>

              {isScheduled && (
                <div className="pt-1">
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    Hệ thống sẽ tự động gửi vào đúng thời điểm đã chọn.
                  </p>
                </div>
              )}
            </div>

            {/* Thông báo kết quả gửi */}
            {submitFeedback && (
              <div
                className={`p-3 rounded-lg text-xs border ${
                  submitFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                }`}
              >
                {submitFeedback.message}
              </div>
            )}

            {/* Nút Submit */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-heritage-green text-white text-xs font-bold hover:bg-heritage-green/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    <span>Đang xử lý...</span>
                  </>
                ) : isScheduled ? (
                  <>
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Lên lịch phát hành</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Phát hành bản tin ngay</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Cột Phải: Xem trước Email Di sản & Gửi thử nghiệm (5 Cột) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hộp Gửi Thử Nghiệm (Send Test Email) */}
          <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
              <Mail className="w-3.5 h-3.5 text-heritage-green" aria-hidden="true" />
              <span>Gửi bản tin thử nghiệm (Test Email)</span>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="email-nhan-test@example.com"
                className="flex-1 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-heritage-green"
              />
              <button
                type="button"
                onClick={handleSendTest}
                disabled={isSendingTest}
                className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isSendingTest ? 'Đang gửi...' : 'Gửi thử'}
              </button>
            </div>
            {testResult && (
              <p
                className={`text-[11px] ${
                  testResult.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {testResult.message}
              </p>
            )}
          </div>

          {/* Bản Xem trước Trực quan Warm Heritage */}
          <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Bản xem trước Email Học viên</span>
              </span>
              <span className="text-[11px] font-mono">HTML Template</span>
            </div>

            {/* Email Container Mock */}
            <div className="rounded-lg bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 space-y-3 shadow-xs font-sans text-xs">
              {/* Header thương hiệu */}
              <div className="border-b border-stone-100 dark:border-stone-800 pb-2 flex items-center justify-between">
                <span className="font-serif font-bold text-heritage-green tracking-wide">VIECULTURES</span>
                <span className="text-[10px] text-stone-400">Bản tin Di sản</span>
              </div>

              {/* Tiêu đề & Headline */}
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {headline || 'Khám phá tinh hoa di sản Việt'}
                </h4>
                <p className="text-[11px] text-stone-400 italic">
                  Chủ đề: {subject || 'Bản tin văn hóa tuần'}
                </p>
              </div>

              {/* Ảnh bìa bài đọc (nếu có) */}
              {selectedPost?.imageUrl && (
                <div className="rounded overflow-hidden h-32 bg-stone-100">
                  <img
                    src={selectedPost.imageUrl}
                    alt={selectedPost.titleVi}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Nội dung tin nhắn xem trước */}
              <div className="text-stone-700 dark:text-stone-300 whitespace-pre-line text-xs leading-relaxed">
                {content
                  .replace(/{{ten_hoc_vien}}/g, '[Tên học viên]')
                  .replace(/{{so_ngay_streak}}/g, '[Số ngày streak]')
                  .replace(/{{bai_doc_dang_do}}/g, '[Bài đọc gần nhất]')
                  .replace(/{{so_phut_audio_con_lai}}/g, '[Số phút audio]')
                  .replace(/{{vung_mien_yeu_thich}}/g, '[Vùng miền]')}
              </div>

              {/* Nút Call To Action */}
              <div className="pt-2 text-center">
                <a
                  href={actionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-4 py-2 rounded-lg bg-heritage-green text-white font-bold text-xs shadow-xs"
                >
                  {actionText || 'Khám phá ngay'}
                </a>
              </div>

              {/* Footer */}
              <div className="border-t border-stone-100 dark:border-stone-800 pt-3 text-center text-[10px] text-stone-400">
                Bạn nhận được email này vì đã đăng ký tài khoản trên VieCultures.app.
                <br />
                <span className="underline cursor-pointer">Hủy đăng ký nhận bản tin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bảng Lịch sử Bản tin đã Phát hành ─────────────────────────────── */}
      <section className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Lịch sử Bản tin & Hiệu quả Tương tác
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Thống kê số lượng người nhận, tỷ lệ mở (Open Rate), tỷ lệ nhấp (CTR) và số lượt hủy đăng ký.
          </p>
        </div>

        {newsletters.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 dark:text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-lg">
            Chưa có bản tin nào được phát hành. Hãy biên soạn bản tin đầu tiên ở trên!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-700">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-100/75 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                  <th className="py-2.5 px-3">Tên Bản tin & Tiêu đề</th>
                  <th className="py-2.5 px-3">Phân khúc Nhận</th>
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3 text-right">Đã gửi (Sent)</th>
                  <th className="py-2.5 px-3 text-right">Tỷ lệ Mở (Open)</th>
                  <th className="py-2.5 px-3 text-right">Tỷ lệ Nhấp (CTR)</th>
                  <th className="py-2.5 px-3 text-right">Hủy đăng ký</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700/60 text-stone-800 dark:text-stone-200">
                {newsletters.map((nl) => (
                  <tr key={nl.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-medium">
                      <div>{nl.subject}</div>
                      <div className="text-[11px] text-stone-400 truncate max-w-xs">{nl.headline}</div>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 dark:text-stone-400">
                      {nl.targetSegmentLabel}
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 dark:text-stone-400 whitespace-nowrap">
                      {nl.sentAt
                        ? new Date(nl.sentAt).toLocaleDateString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                          })
                        : nl.scheduledAt
                        ? `Lên lịch: ${new Date(nl.scheduledAt).toLocaleDateString('vi-VN')}`
                        : 'Bản nháp'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold">
                      {nl.metrics.sentCount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {nl.metrics.openRate}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-heritage-green font-bold">
                      {nl.metrics.clickThroughRate}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-stone-400">
                      {nl.metrics.unsubscribeCount}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          nl.status === 'SENT'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : nl.status === 'SCHEDULED'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-stone-100 text-stone-600 border-stone-200 dark:bg-stone-800 dark:text-stone-400'
                        }`}
                      >
                        {nl.status === 'SENT' ? 'Đã gửi' : nl.status === 'SCHEDULED' ? 'Đã hẹn giờ' : 'Bản nháp'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
