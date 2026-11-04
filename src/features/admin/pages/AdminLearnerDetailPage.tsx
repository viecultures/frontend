import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  ChevronRight,
  User,
  Mail,
  Shield,
  Award,
  Flame,
  BookOpen,
  Sparkles,
  Clock,
  CreditCard,
  Receipt,
  Calendar,
  Activity,
  Globe,
  Laptop,
  Lock,
  Unlock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import type {
  LearnerDetailItem,
  LearnerActivityLogItem,
  CefrLevel,
} from '../types/adminTypes';
import { adminUserService } from '../services/adminUserService';
import { getLocalizedPath } from '@/routes/paths';
import { getStoredUser, getStoredToken, parseJwt } from '@/utils/auth-storage';

export const AdminLearnerDetailPage: React.FC = () => {
  const { id, lang } = useParams<{ id: string; lang?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('admin');

  // Main state
  const [learner, setLearner] = useState<LearnerDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Active tab state: 'progress' | 'logs' | 'subscription'
  const [activeTab, setActiveTab] = useState<'progress' | 'logs' | 'subscription'>('progress');

  // Activity logs state
  const [logs, setLogs] = useState<LearnerActivityLogItem[]>([]);
  const [logsPage, setLogsPage] = useState<number>(0);
  const [logsTotalPages, setLogsTotalPages] = useState<number>(1);
  const [logsTotalElements, setLogsTotalElements] = useState<number>(0);
  const [isLogsLoading, setIsLogsLoading] = useState<boolean>(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  // Check current admin email to prevent locking self
  const currentAdminEmail = useMemo(() => {
    const stored = getStoredUser();
    if (stored?.email) return stored.email.toLowerCase();
    const token = getStoredToken();
    if (token) {
      const claims = parseJwt(token);
      if (claims?.sub) return String(claims.sub).toLowerCase();
    }
    return null;
  }, []);

  const isSelf = Boolean(
    currentAdminEmail &&
    learner?.email &&
    learner.email.toLowerCase() === currentAdminEmail
  );

  // Fetch learner details
  const fetchLearnerDetails = useCallback(async () => {
    if (!id) {
      setErrorMessage('Không tìm thấy mã định danh học viên.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await adminUserService.getLearnerDetails(id);
      setLearner(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tải thông tin chi tiết học viên';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLearnerDetails();
  }, [fetchLearnerDetails]);

  // Fetch activity logs
  const fetchActivityLogs = useCallback(
    async (pageIndex: number) => {
      if (!id) return;

      setIsLogsLoading(true);
      setLogsError(null);

      try {
        const res = await adminUserService.getLearnerActivityLogs(id, pageIndex, 15);
        setLogs(res.content || []);
        setLogsTotalPages(res.totalPages || 1);
        setLogsTotalElements(res.totalElements || 0);
        setLogsPage(res.number ?? pageIndex);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi khi tải nhật ký hoạt động';
        setLogsError(msg);
      } finally {
        setIsLogsLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchActivityLogs(logsPage);
    }
  }, [activeTab, logsPage, fetchActivityLogs]);

  // Handle account status toggle (Lock / Unlock)
  const handleToggleStatus = async () => {
    if (!learner) return;

    if (isSelf && learner.enabled) {
      setErrorMessage('Bạn không thể tự khóa tài khoản quản trị của chính mình.');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const nextStatus = !learner.enabled;
      const updated = await adminUserService.updateUserStatus(learner.id, nextStatus);
      setLearner((prev) => (prev ? { ...prev, enabled: updated.enabled } : null));

      const toastText = nextStatus
        ? 'Đã kích hoạt tài khoản thành công.'
        : 'Đã tạm khóa tài khoản thành công.';
      setStatusToast(toastText);
      setTimeout(() => setStatusToast(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái tài khoản.';
      setErrorMessage(msg);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Helper date formatter
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const formatDateOnly = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  // Helper currency formatter
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Helper CEFR badge style
  const getCefrBadgeClass = (level?: CefrLevel) => {
    switch (level) {
      case 'A1':
      case 'A2':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'B1':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'B2':
      case 'C1':
      case 'C2':
        return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300';
    }
  };

  // Helper Subscription badge
  const renderPlanBadge = (code?: string, name?: string) => {
    const normalized = (code || '').toUpperCase();
    let colorClass = 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300';

    if (normalized.includes('LIFETIME')) {
      colorClass = 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-300 ring-1 ring-amber-400/30';
    } else if (normalized.includes('PRO')) {
      colorClass = 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 ring-1 ring-emerald-400/30';
    } else if (normalized.includes('STARTER')) {
      colorClass = 'bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border-sky-300';
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${colorClass}`}
      >
        <Sparkles aria-hidden="true" className="w-3.5 h-3.5" />
        <span>{name || code || 'Gói Miễn Phí'}</span>
      </span>
    );
  };

  // Helper Transaction Status badge
  const renderTransactionStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'APPROVED' || s === 'SUCCESS' || s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
          <CheckCircle2 aria-hidden="true" className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Thành công</span>
        </span>
      );
    }
    if (s === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300">
          <Clock aria-hidden="true" className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>Chờ xử lý</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300">
        <AlertCircle aria-hidden="true" className="w-3 h-3 text-rose-600 dark:text-rose-400" />
        <span>Thất bại / Hủy</span>
      </span>
    );
  };

  // Loading skeleton state
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-5 w-64 bg-stone-200 dark:bg-stone-700 rounded-md" />

        {/* Header Card skeleton */}
        <div className="bg-rice-paper dark:bg-heritage-dark/60 rounded-3xl p-6 sm:p-8 border border-antique-gold/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-stone-200 dark:bg-stone-700 shrink-0" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-stone-200 dark:bg-stone-700 rounded-md" />
              <div className="h-4 w-60 bg-stone-200 dark:bg-stone-700 rounded-md" />
              <div className="flex gap-2 pt-1">
                <div className="h-5 w-16 bg-stone-200 dark:bg-stone-700 rounded-full" />
                <div className="h-5 w-24 bg-stone-200 dark:bg-stone-700 rounded-full" />
              </div>
            </div>
          </div>
          <div className="h-10 w-36 bg-stone-200 dark:bg-stone-700 rounded-xl" />
        </div>

        {/* Metric Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-28 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/20" />
          <div className="h-28 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/20" />
          <div className="h-28 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/20" />
        </div>

        {/* Content table skeleton */}
        <div className="h-64 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/20" />
      </div>
    );
  }

  // Error state
  if (errorMessage && !learner) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-secondary">
          <Link
            to={getLocalizedPath('/admin', lang)}
            className="hover:text-heritage-green dark:hover:text-antique-bright transition-colors"
          >
            Quản trị
          </Link>
          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-text-muted" />
          <Link
            to={getLocalizedPath('/admin/users', lang)}
            className="hover:text-heritage-green dark:hover:text-antique-bright transition-colors"
          >
            Quản lý người dùng
          </Link>
          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-body dark:text-warm-ivory font-semibold">
            Chi tiết học viên
          </span>
        </nav>

        <div className="p-8 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-red-300 dark:border-red-800 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 flex items-center justify-center mx-auto">
            <AlertCircle aria-hidden="true" className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="font-heading font-bold text-xl text-heritage-green dark:text-warm-ivory">
              Không thể tải dữ liệu học viên
            </h2>
            <p className="text-xs text-text-muted max-w-md mx-auto">{errorMessage}</p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={fetchLearnerDetails}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-forest text-warm-ivory text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw aria-hidden="true" className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(getLocalizedPath('/admin/users', lang))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-antique-gold/40 text-heritage-green dark:text-warm-ivory text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <ArrowLeft aria-hidden="true" className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!learner) return null;

  const completedLessons = learner.completedLessons || [];
  const transactions = learner.transactions || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ── Breadcrumb & Back Navigation ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-secondary flex-wrap">
          <Link
            to={getLocalizedPath('/admin', lang)}
            className="hover:text-heritage-green dark:hover:text-antique-bright transition-colors"
          >
            Quản trị
          </Link>
          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <Link
            to={getLocalizedPath('/admin/users', lang)}
            className="hover:text-heritage-green dark:hover:text-antique-bright transition-colors"
          >
            Quản lý người dùng
          </Link>
          <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span className="text-heritage-green dark:text-antique-bright font-bold">
            Theo dõi chi tiết học viên
          </span>
        </nav>

        <button
          type="button"
          onClick={() => navigate(getLocalizedPath('/admin/users', lang))}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-antique-gold/30 bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-xs font-bold text-heritage-green dark:text-warm-ivory transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </button>
      </div>

      {/* ── Alerts & Toasts ───────────────────────────────────────────── */}
      {statusToast && (
        <div role="status" className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{statusToast}</span>
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            aria-label="Đóng thông báo"
            onClick={() => setErrorMessage(null)}
            className="cursor-pointer"
          >
            <span className="text-sm font-bold">&times;</span>
          </button>
        </div>
      )}

      {/* ── Header Card ───────────────────────────────────────────────── */}
      <section
        aria-label="Thông tin tổng quan học viên"
        className="bg-rice-paper dark:bg-heritage-dark/60 rounded-3xl p-6 sm:p-8 border border-antique-gold/30 shadow-sm relative overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Left Avatar & Identity */}
          <div className="flex items-start sm:items-center gap-5">
            {learner.avatarUrl ? (
              <img
                src={learner.avatarUrl}
                alt={learner.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-antique-gold/50 shadow-md shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-heritage-green/10 dark:bg-white/10 text-heritage-green dark:text-antique-bright border-2 border-antique-gold/40 flex items-center justify-center font-heading font-bold text-2xl shrink-0 shadow-sm">
                {learner.name ? learner.name.slice(0, 2).toUpperCase() : 'VC'}
              </div>
            )}

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-heritage-green dark:text-warm-ivory">
                  {learner.name}
                </h1>
                {isSelf && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-antique-gold/25 text-heritage-green dark:text-antique-bright border border-antique-gold/40">
                    Tài khoản của bạn
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Mail aria-hidden="true" className="w-3.5 h-3.5" />
                  <span className="font-sans">{learner.email}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Globe aria-hidden="true" className="w-3.5 h-3.5" />
                  <span>{learner.authProvider || 'LOCAL'}</span>
                </span>
                {learner.createdAt && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar aria-hidden="true" className="w-3.5 h-3.5" />
                    <span>Tham gia: {formatDateOnly(learner.createdAt)}</span>
                  </span>
                )}
              </div>

              {/* Status and Level Badges */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {/* CEFR Level Badge */}
                {learner.englishLevel ? (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getCefrBadgeClass(
                      learner.englishLevel
                    )}`}
                  >
                    <Award aria-hidden="true" className="w-3 h-3" />
                    <span>Trình độ {learner.englishLevel}</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-text-muted italic">Chưa thiết lập CEFR</span>
                )}

                {/* Account Status Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    learner.enabled
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300'
                  }`}
                >
                  {learner.enabled ? (
                    <>
                      <Unlock aria-hidden="true" className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Đang hoạt động</span>
                    </>
                  ) : (
                    <>
                      <Lock aria-hidden="true" className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                      <span>Đã khóa tài khoản</span>
                    </>
                  )}
                </span>

                {/* Subscription Plan Badge */}
                {renderPlanBadge(learner.currentPlanCode, learner.currentPlanName)}
              </div>
            </div>
          </div>

          {/* Right Action: Lock / Unlock Button */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-antique-gold/20">
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isUpdatingStatus || (isSelf && learner.enabled)}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold ${
                isSelf && learner.enabled
                  ? 'opacity-60 cursor-not-allowed bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-300'
                  : learner.enabled
                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
              }`}
              title={
                isSelf && learner.enabled
                  ? 'Bạn không thể tự khóa tài khoản của mình'
                  : learner.enabled
                  ? 'Bấm để tạm khóa tài khoản học viên này'
                  : 'Bấm để mở khóa và cho phép học viên đăng nhập lại'
              }
            >
              {isUpdatingStatus ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : learner.enabled ? (
                <>
                  <Lock aria-hidden="true" className="w-4 h-4" />
                  <span>Khóa tài khoản</span>
                </>
              ) : (
                <>
                  <Unlock aria-hidden="true" className="w-4 h-4" />
                  <span>Kích hoạt tài khoản</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── 3 Navigation Tabs ─────────────────────────────────────────── */}
      <div className="border-b border-antique-gold/20 flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'progress'}
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold ${
            activeTab === 'progress'
              ? 'bg-heritage-green text-warm-ivory shadow-sm'
              : 'bg-rice-paper dark:bg-white/5 text-text-secondary hover:text-text-body border border-antique-gold/20'
          }`}
        >
          <BookOpen aria-hidden="true" className="w-4 h-4" />
          <span>Tiến độ học tập</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'logs'}
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold ${
            activeTab === 'logs'
              ? 'bg-heritage-green text-warm-ivory shadow-sm'
              : 'bg-rice-paper dark:bg-white/5 text-text-secondary hover:text-text-body border border-antique-gold/20'
          }`}
        >
          <Activity aria-hidden="true" className="w-4 h-4" />
          <span>Nhật ký duyệt trang</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'subscription'}
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold ${
            activeTab === 'subscription'
              ? 'bg-heritage-green text-warm-ivory shadow-sm'
              : 'bg-rice-paper dark:bg-white/5 text-text-secondary hover:text-text-body border border-antique-gold/20'
          }`}
        >
          <CreditCard aria-hidden="true" className="w-4 h-4" />
          <span>Gói cước &amp; Giao dịch</span>
        </button>
      </div>

      {/* ── Tab 1: Tiến độ học tập ────────────────────────────────────── */}
      {activeTab === 'progress' && (
        <section aria-label="Tiến độ học tập của học viên" className="space-y-6">
          {/* 3 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-text-muted text-xs font-medium">Chuỗi học tập</span>
                <div className="text-3xl font-heading font-bold text-amber-600 dark:text-amber-400">
                  {learner.streakDays ?? 0} ngày
                </div>
                <p className="text-[11px] text-text-secondary">
                  Hoạt động gần nhất: {formatDateOnly(learner.lastActiveDate)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Flame aria-hidden="true" className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-text-muted text-xs font-medium">Bài đọc hoàn thành</span>
                <div className="text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                  {learner.totalSealedLessons ?? completedLessons.length}
                </div>
                <p className="text-[11px] text-text-secondary">Đã hoàn thành và đóng dấu chứng nhận</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-antique-gold/15 border border-antique-gold/30 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                <BookOpen aria-hidden="true" className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-text-muted text-xs font-medium">Từ vựng đã tích lũy</span>
                <div className="text-3xl font-heading font-bold text-emerald-600 dark:text-emerald-400">
                  {learner.totalWordsLearned ?? 0}
                </div>
                <p className="text-[11px] text-text-secondary">
                  Đang học: {learner.learningVocabCount ?? 0} | Đã thuộc:{' '}
                  {learner.masteredVocabCount ?? 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sparkles aria-hidden="true" className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* List of Completed Lessons */}
          <div className="bg-rice-paper dark:bg-heritage-dark/60 rounded-3xl border border-antique-gold/30 shadow-md overflow-hidden">
            <div className="p-5 border-b border-antique-gold/20 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-lg text-heritage-green dark:text-warm-ivory">
                  Danh sách bài đọc đã hoàn thành
                </h2>
                <p className="text-xs text-text-muted">
                  Ghi nhận các bài đọc song ngữ đã được học viên đọc và đóng dấu chứng chỉ
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/30">
                {completedLessons.length} bài
              </span>
            </div>

            {completedLessons.length === 0 ? (
              <div className="py-16 text-center space-y-3 px-4">
                <BookOpen aria-hidden="true" className="w-12 h-12 text-antique-gold/40 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-heritage-green dark:text-warm-ivory">
                    Học viên chưa hoàn thành bài đọc nào
                  </h3>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    Tiến độ đọc và dấu chứng chỉ sẽ hiển thị tại đây khi học viên hoàn thành các bài học song ngữ.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="bg-warm-ivory/80 dark:bg-heritage-dark/80 border-b border-antique-gold/20 text-text-secondary uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">STT</th>
                      <th className="px-5 py-3.5">Tiêu đề bài đọc</th>
                      <th className="px-4 py-3.5 text-center">Số từ học được</th>
                      <th className="px-5 py-3.5 text-right">Thời điểm hoàn thành</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-antique-gold/15">
                    {completedLessons.map((lesson, idx) => (
                      <tr
                        key={lesson.readingPostId || idx}
                        className="hover:bg-warm-ivory/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-5 py-4 font-mono text-text-muted">{idx + 1}</td>
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <div className="font-heading font-bold text-sm text-heritage-green dark:text-warm-ivory">
                              {lesson.titleVi || lesson.titleEn}
                            </div>
                            {lesson.titleEn && lesson.titleEn !== lesson.titleVi && (
                              <div className="text-[11px] text-text-muted font-sans italic">
                                {lesson.titleEn}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                            +{lesson.wordsLearnedCount} từ
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap text-text-secondary">
                          <div className="inline-flex items-center gap-1.5 text-xs">
                            <Clock aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                            <span>{formatDateTime(lesson.sealedAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Tab 2: Nhật ký duyệt trang ─────────────────────────────────── */}
      {activeTab === 'logs' && (
        <section aria-label="Nhật ký hoạt động của học viên" className="space-y-4">
          <div className="bg-rice-paper dark:bg-heritage-dark/60 rounded-3xl border border-antique-gold/30 shadow-md overflow-hidden">
            <div className="p-5 border-b border-antique-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-heritage-green dark:text-warm-ivory">
                  Nhật ký duyệt trang &amp; Hoạt động
                </h2>
                <p className="text-xs text-text-muted">
                  Ghi nhận các sự kiện truy cập trang, tương tác tính năng của học viên
                </p>
              </div>

              <button
                type="button"
                onClick={() => fetchActivityLogs(logsPage)}
                disabled={isLogsLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-antique-gold/30 bg-white/60 dark:bg-white/5 hover:bg-white text-xs font-bold text-heritage-green dark:text-warm-ivory transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
              >
                <RefreshCw aria-hidden="true" className={`w-3.5 h-3.5 ${isLogsLoading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>

            {/* Content state */}
            {isLogsLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="inline-block animate-spin w-8 h-8 border-3 border-antique-gold border-t-transparent rounded-full" />
                <p className="text-xs text-text-muted">Đang tải nhật ký hoạt động...</p>
              </div>
            ) : logsError ? (
              <div className="py-16 text-center space-y-3 px-4">
                <AlertCircle aria-hidden="true" className="w-10 h-10 text-rose-500 mx-auto" />
                <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold">{logsError}</p>
                <button
                  type="button"
                  onClick={() => fetchActivityLogs(logsPage)}
                  className="px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold cursor-pointer"
                >
                  Thử lại
                </button>
              </div>
            ) : logs.length === 0 ? (
              <div className="py-16 text-center space-y-3 px-4">
                <Activity aria-hidden="true" className="w-12 h-12 text-antique-gold/40 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-heritage-green dark:text-warm-ivory">
                    Chưa có nhật ký hoạt động nào
                  </h3>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    Học viên chưa phát sinh hoạt động duyệt trang nào được ghi nhận trong khoảng thời gian này.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[768px]">
                  <thead className="bg-warm-ivory/80 dark:bg-heritage-dark/80 border-b border-antique-gold/20 text-text-secondary uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Hành động</th>
                      <th className="px-5 py-3.5">Đường dẫn trang (Path)</th>
                      <th className="px-4 py-3.5">Địa chỉ IP</th>
                      <th className="px-4 py-3.5">Thiết bị / Trình duyệt</th>
                      <th className="px-5 py-3.5 text-right">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-antique-gold/15">
                    {logs.map((logItem) => (
                      <tr
                        key={logItem.id}
                        className="hover:bg-warm-ivory/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-antique-gold/15 text-heritage-green dark:text-antique-bright border border-antique-gold/30">
                            <Activity aria-hidden="true" className="w-3 h-3" />
                            <span>{logItem.eventType}</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs max-w-xs truncate text-text-body dark:text-warm-ivory">
                          {logItem.path || '—'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-text-muted">
                          {logItem.ipAddress || '—'}
                        </td>
                        <td className="px-4 py-4 text-xs text-text-secondary max-w-xs truncate" title={logItem.userAgent}>
                          <div className="inline-flex items-center gap-1.5">
                            <Laptop aria-hidden="true" className="w-3.5 h-3.5 text-text-muted shrink-0" />
                            <span className="truncate">{logItem.userAgent || '—'}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap text-text-secondary">
                          <div className="inline-flex items-center gap-1 text-xs">
                            <Clock aria-hidden="true" className="w-3.5 h-3.5 text-text-muted" />
                            <span>{formatDateTime(logItem.createdAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="px-5 py-3.5 bg-warm-ivory/80 dark:bg-heritage-dark/80 border-t border-antique-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
              <div>
                Trang {logsPage + 1} / {logsTotalPages || 1} (Tổng số {logsTotalElements} bản ghi)
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLogsPage((p) => Math.max(0, p - 1))}
                  disabled={logsPage <= 0 || isLogsLoading}
                  className="px-3 py-1.5 rounded-xl border border-antique-gold/30 bg-white/60 dark:bg-white/10 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronLeft aria-hidden="true" className="w-4 h-4" />
                  <span>Trang trước</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLogsPage((p) => Math.min(logsTotalPages - 1, p + 1))}
                  disabled={logsPage >= logsTotalPages - 1 || isLogsLoading}
                  className="px-3 py-1.5 rounded-xl border border-antique-gold/30 bg-white/60 dark:bg-white/10 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Trang sau</span>
                  <ChevronRight aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Tab 3: Gói cước & Giao dịch ─────────────────────────────────── */}
      {activeTab === 'subscription' && (
        <section aria-label="Gói cước và lịch sử giao dịch" className="space-y-6">
          {/* Current Subscription Card */}
          <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Gói cước đang sử dụng
              </span>
              <div className="flex items-center gap-3">
                <h3 className="font-heading font-bold text-2xl text-heritage-green dark:text-warm-ivory">
                  {learner.currentPlanName || learner.currentPlanCode || 'Miễn phí (Free Tier)'}
                </h3>
                {renderPlanBadge(learner.currentPlanCode, learner.currentPlanName)}
              </div>
              <p className="text-xs text-text-secondary">
                Trạng thái: <span className="font-bold">{learner.subscriptionStatus || 'Hoạt động'}</span>
                {learner.subscriptionExpiry && (
                  <> &bull; Hạn dùng đến: <span className="font-bold">{formatDateOnly(learner.subscriptionExpiry)}</span></>
                )}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-antique-gold/20 text-heritage-green dark:text-antique-gold flex items-center justify-center shrink-0 border border-antique-gold/40">
              <CreditCard aria-hidden="true" className="w-7 h-7" />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-rice-paper dark:bg-heritage-dark/60 rounded-3xl border border-antique-gold/30 shadow-md overflow-hidden">
            <div className="p-5 border-b border-antique-gold/20 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-lg text-heritage-green dark:text-warm-ivory">
                  Lịch sử giao dịch &amp; Nạp tiền
                </h2>
                <p className="text-xs text-text-muted">
                  Danh sách đơn hàng và lịch sử thanh toán đăng ký gói cước học tập
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/30">
                {transactions.length} giao dịch
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="py-16 text-center space-y-3 px-4">
                <Receipt aria-hidden="true" className="w-12 h-12 text-antique-gold/40 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-heritage-green dark:text-warm-ivory">
                    Chưa có giao dịch gói cước nào
                  </h3>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    Học viên chưa phát sinh đơn hàng hoặc giao dịch thanh toán nâng cấp gói.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="bg-warm-ivory/80 dark:bg-heritage-dark/80 border-b border-antique-gold/20 text-text-secondary uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5">Mã giao dịch</th>
                      <th className="px-5 py-3.5">Gói cước</th>
                      <th className="px-4 py-3.5 text-right">Số tiền (VND)</th>
                      <th className="px-4 py-3.5 text-center">Trạng thái</th>
                      <th className="px-5 py-3.5 text-right">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-antique-gold/15">
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id || tx.transactionCode}
                        className="hover:bg-warm-ivory/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-5 py-4 font-mono text-xs font-bold text-heritage-green dark:text-antique-bright">
                          {tx.transactionCode || tx.id}
                        </td>
                        <td className="px-5 py-4 font-heading font-bold text-xs text-text-body dark:text-warm-ivory">
                          {tx.planName || tx.planCode}
                        </td>
                        <td className="px-4 py-4 text-right font-mono font-bold text-xs text-text-body dark:text-warm-ivory">
                          {formatCurrency(tx.amountVnd)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {renderTransactionStatusBadge(tx.status)}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap text-text-secondary">
                          <div className="inline-flex items-center gap-1.5 text-xs">
                            <Clock aria-hidden="true" className="w-3.5 h-3.5 text-text-muted" />
                            <span>{formatDateTime(tx.createdAt)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminLearnerDetailPage;
