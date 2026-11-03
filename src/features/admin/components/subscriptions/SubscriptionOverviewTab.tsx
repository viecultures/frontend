import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Clock,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Filter,
  AlertTriangle,
  Check,
  X,
  User,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import type {
  SubscriptionTransactionItem,
  SubscriptionMetricsStats,
  PaymentStatus,
} from '../../types/adminSubscriptionTypes';
import { adminSubscriptionService } from '../../services/adminSubscriptionService';

const STATUS_FILTER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Đã từ chối' },
];

export const SubscriptionOverviewTab: React.FC = () => {
  // Metrics & Transactions state
  const [metrics, setMetrics] = useState<SubscriptionMetricsStats | null>(null);
  const [transactions, setTransactions] = useState<SubscriptionTransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals for Approve / Reject
  const [approvingTx, setApprovingTx] = useState<SubscriptionTransactionItem | null>(null);
  const [approveNote, setApproveNote] = useState<string>('');
  const [isApprovingSubmitting, setIsApprovingSubmitting] = useState<boolean>(false);

  const [rejectingTx, setRejectingTx] = useState<SubscriptionTransactionItem | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [isRejectingSubmitting, setIsRejectingSubmitting] = useState<boolean>(false);

  // Fetch metrics & transactions
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [metricsData, txData] = await Promise.all([
        adminSubscriptionService.getMetrics(),
        adminSubscriptionService.getTransactions(statusFilter, searchQuery),
      ]);
      setMetrics(metricsData);
      setTransactions(txData);
    } catch (err: unknown) {
      console.error('[SubscriptionOverviewTab] Lỗi khi tải dữ liệu giao dịch:', err);
      setErrorMsg('Không thể tải dữ liệu đăng ký và giao dịch. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Approve
  const handleOpenApproveModal = (tx: SubscriptionTransactionItem) => {
    setApprovingTx(tx);
    setApproveNote('Đã kiểm tra đối soát sao kê ngân hàng thành công.');
  };

  const handleConfirmApprove = async () => {
    if (!approvingTx) return;
    setIsApprovingSubmitting(true);
    try {
      await adminSubscriptionService.approveTransaction(approvingTx.id, approveNote.trim());
      setSuccessToast(`Đã kích hoạt thành công đơn hàng [${approvingTx.transactionCode}] cho ${approvingTx.userName}.`);
      setApprovingTx(null);
      await fetchData();
    } catch (err: unknown) {
      console.error('[SubscriptionOverviewTab] Lỗi khi phê duyệt giao dịch:', err);
      setErrorMsg('Có lỗi xảy ra khi phê duyệt đơn hàng');
    } finally {
      setIsApprovingSubmitting(false);
    }
  };

  // Handle Reject
  const handleOpenRejectModal = (tx: SubscriptionTransactionItem) => {
    setRejectingTx(tx);
    setRejectReason('');
    setRejectError(null);
  };

  const handleConfirmReject = async () => {
    if (!rejectingTx) return;
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setRejectError('Vui lòng nhập lý do từ chối đơn hàng');
      return;
    }

    setIsRejectingSubmitting(true);
    setRejectError(null);
    try {
      await adminSubscriptionService.rejectTransaction(rejectingTx.id, trimmed);
      setSuccessToast(`Đã từ chối đơn hàng [${rejectingTx.transactionCode}]. Lý do: ${trimmed}`);
      setRejectingTx(null);
      await fetchData();
    } catch (err: unknown) {
      console.error('[SubscriptionOverviewTab] Lỗi khi từ chối giao dịch:', err);
      setRejectError('Có lỗi xảy ra khi từ chối giao dịch');
    } finally {
      setIsRejectingSubmitting(false);
    }
  };

  // Format Helpers
  const formatVnd = (val: number) => {
    return val.toLocaleString('vi-VN') + ' đ';
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const renderStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-antique-bright border border-amber-300 dark:border-amber-700">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-antique-gold shrink-0" aria-hidden="true" />
            <span>Chờ duyệt</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Đã duyệt</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
            <span>Đã từ chối</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Doanh thu thực thu */}
        <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span className="font-medium">Doanh thu thực thu</span>
            <CreditCard className="w-4 h-4 text-antique-gold" aria-hidden="true" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
            {metrics ? formatVnd(metrics.totalRevenueVnd) : '—'}
          </div>
          <p className="text-[11px] text-text-secondary">
            Tổng giá trị đối soát thành công từ các đơn đăng ký
          </p>
        </div>

        {/* Metric 2: Đơn chờ duyệt */}
        <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span className="font-medium">Chờ duyệt kích hoạt</span>
            <Clock className="w-4 h-4 text-amber-500" aria-hidden="true" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-heading font-bold text-amber-700 dark:text-antique-gold">
              {metrics ? metrics.pendingCount : '—'}
            </span>
            {metrics && metrics.pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-antique-gold text-heritage-dark shadow-sm">
                Cần xử lý
              </span>
            )}
          </div>
          <p className="text-[11px] text-text-secondary">
            Chuyển khoản cần đối chiếu sao kê tài khoản ngân hàng
          </p>
        </div>

        {/* Metric 3: Thuê bao kích hoạt */}
        <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span className="font-medium">Thuê bao kích hoạt</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
            {metrics ? metrics.activeSubscribers.toLocaleString('vi-VN') : '—'}
          </div>
          <p className="text-[11px] text-text-secondary">
            Bao gồm hội viên trả phí và tài khoản miễn phí hoạt động
          </p>
        </div>

        {/* Metric 4: Tỷ lệ phê duyệt */}
        <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs">
            <span className="font-medium">Tỷ lệ phê duyệt</span>
            <TrendingUp className="w-4 h-4 text-antique-gold" aria-hidden="true" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
            {metrics ? `${metrics.approvalRatePercent}%` : '—'}
          </div>
          <p className="text-[11px] text-text-secondary">
            Tỷ lệ đơn hợp lệ trên tổng số giao dịch đã xử lý
          </p>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {successToast && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              placeholder="Tìm theo email, tên học viên, mã đơn hoặc nội dung CK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-antique-gold shrink-0 hidden sm:block" aria-hidden="true" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-antique-gold/30 bg-warm-ivory dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs font-medium focus:outline-none focus:ring-2 focus:ring-antique-gold/50 cursor-pointer"
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Refresh button */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={fetchData}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl border border-antique-gold/30 hover:bg-black/5 dark:hover:bg-white/5 text-heritage-green dark:text-warm-ivory text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-antique-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright">
              Lịch sử giao dịch & Đơn đăng ký hội viên
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-heritage-green/10 dark:bg-antique-gold/20 text-heritage-green dark:text-antique-bright">
              {transactions.length} đơn
            </span>
          </div>
          <span className="text-xs text-text-muted">
            Xếp theo thời gian tạo mới nhất
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-antique-gold/20 bg-warm-ivory/80 dark:bg-heritage-forest/80 text-text-secondary uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3.5 px-4">Mã đơn & Nội dung CK</th>
                <th className="py-3.5 px-4">Học viên</th>
                <th className="py-3.5 px-4">Gói đăng ký</th>
                <th className="py-3.5 px-4 text-right">Số tiền</th>
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4 text-center">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-antique-gold/15">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-antique-gold mb-2" aria-hidden="true" />
                    <span>Đang tải danh sách giao dịch...</span>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted space-y-1">
                    <CreditCard className="w-8 h-8 mx-auto text-antique-gold/50 mb-2" aria-hidden="true" />
                    <p className="font-semibold text-heritage-green dark:text-warm-ivory">
                      {searchQuery.trim() || statusFilter !== 'ALL'
                        ? 'Không tìm thấy giao dịch nào phù hợp'
                        : 'Chưa có giao dịch chuyển khoản nào'}
                    </p>
                    <p className="text-[11px]">
                      {searchQuery.trim() || statusFilter !== 'ALL'
                        ? 'Hãy thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc trạng thái khác.'
                        : 'Dữ liệu giao dịch sẽ tự động hiển thị tại đây khi có học viên thực hiện chuyển khoản.'}
                    </p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Mã đơn & Nội dung CK */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-mono font-bold text-heritage-green dark:text-antique-bright">
                        {tx.transactionCode}
                      </div>
                      <div className="text-[11px] text-text-muted mt-0.5 max-w-xs truncate" title={tx.transferContent}>
                        ND: {tx.transferContent}
                      </div>
                      {tx.note && (
                        <div className="text-[11px] text-amber-800 dark:text-antique-gold/80 italic mt-0.5">
                          Ghi chú: {tx.note}
                        </div>
                      )}
                    </td>

                    {/* Học viên */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-heritage-green dark:text-warm-ivory">
                        {tx.userName}
                      </div>
                      <div className="text-[11px] text-text-muted">{tx.userEmail}</div>
                    </td>

                    {/* Gói đăng ký */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-semibold text-heritage-green dark:text-antique-bright">
                        {tx.planName}
                      </span>
                      <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-heritage-green/10 dark:bg-antique-gold/15 text-heritage-green dark:text-antique-gold">
                        {tx.planCode}
                      </span>
                    </td>

                    {/* Số tiền */}
                    <td className="py-3.5 px-4 align-top text-right font-mono font-bold text-heritage-green dark:text-antique-bright">
                      {formatVnd(tx.amountVnd)}
                    </td>

                    {/* Ngày tạo */}
                    <td className="py-3.5 px-4 align-top text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-text-muted shrink-0" aria-hidden="true" />
                        <span>{formatDateTime(tx.createdAt)}</span>
                      </div>
                      {tx.approvedAt && (
                        <div className="text-[10px] text-text-muted mt-0.5">
                          Duyệt lúc: {formatDateTime(tx.approvedAt)}
                        </div>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4 align-top text-center">
                      {renderStatusBadge(tx.status)}
                    </td>

                    {/* Thao tác */}
                    <td className="py-3.5 px-4 align-top text-right">
                      {tx.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenApproveModal(tx)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                            title="Xác nhận duyệt kích hoạt"
                          >
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Duyệt</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenRejectModal(tx)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                            title="Từ chối đơn hàng"
                          >
                            <X className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Từ chối</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-text-muted italic">Đã hoàn tất</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Duyệt đơn */}
      {approvingTx && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="approve-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/40 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-antique-gold/20 flex items-center justify-between bg-rice-paper/80 dark:bg-heritage-forest/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3
                  id="approve-modal-title"
                  className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright"
                >
                  Xác nhận duyệt kích hoạt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApprovingTx(null)}
                className="p-1 rounded-lg text-text-muted hover:text-heritage-green dark:hover:text-warm-ivory"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-rice-paper/60 dark:bg-heritage-forest/40 border border-antique-gold/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">Mã đơn:</span>
                  <span className="font-mono font-bold text-heritage-green dark:text-antique-bright">
                    {approvingTx.transactionCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Học viên:</span>
                  <span className="font-semibold text-heritage-green dark:text-warm-ivory">
                    {approvingTx.userName} ({approvingTx.userEmail})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Gói đăng ký:</span>
                  <span className="font-semibold text-heritage-green dark:text-antique-bright">
                    {approvingTx.planName}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-antique-gold/20">
                  <span className="text-text-muted font-bold">Số tiền thanh toán:</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                    {formatVnd(approvingTx.amountVnd)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Ghi chú duyệt đơn (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ghi chú đối soát hoặc tham chiếu ngân hàng..."
                  value={approveNote}
                  onChange={(e) => setApproveNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovingTx(null)}
                  disabled={isApprovingSubmitting}
                  className="px-4 py-2 rounded-xl border border-antique-gold/30 text-xs font-semibold text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApprove}
                  disabled={isApprovingSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>{isApprovingSubmitting ? 'Đang kích hoạt...' : 'Kích hoạt ngay'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Từ chối đơn */}
      {rejectingTx && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/40 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-4 border-b border-antique-gold/20 flex items-center justify-between bg-rice-paper/80 dark:bg-heritage-forest/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400">
                  <XCircle className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3
                  id="reject-modal-title"
                  className="font-heading font-bold text-base text-rose-700 dark:text-rose-400"
                >
                  Từ chối đơn chuyển khoản
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectingTx(null)}
                className="p-1 rounded-lg text-text-muted hover:text-heritage-green dark:hover:text-warm-ivory"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-rice-paper/60 dark:bg-heritage-forest/40 border border-antique-gold/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">Mã đơn:</span>
                  <span className="font-mono font-bold text-heritage-green dark:text-antique-bright">
                    {rejectingTx.transactionCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Học viên:</span>
                  <span className="font-semibold text-heritage-green dark:text-warm-ivory">
                    {rejectingTx.userName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Số tiền:</span>
                  <span className="font-mono font-bold text-heritage-green dark:text-warm-ivory">
                    {formatVnd(rejectingTx.amountVnd)}
                  </span>
                </div>
              </div>

              {rejectError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                  <span>{rejectError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Lý do từ chối <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Nhập lý do từ chối (ví dụ: Sai nội dung chuyển khoản, Số tiền không khớp, Chưa nhận được tiền trong tài khoản)..."
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    if (rejectError) setRejectError(null);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-forest/60 text-heritage-green dark:text-warm-ivory text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingTx(null)}
                  disabled={isRejectingSubmitting}
                  className="px-4 py-2 rounded-xl border border-antique-gold/30 text-xs font-semibold text-text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={isRejectingSubmitting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  <span>{isRejectingSubmitting ? 'Đang xử lý...' : 'Xác nhận từ chối'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
