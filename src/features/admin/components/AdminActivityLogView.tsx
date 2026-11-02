import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  FileText,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  adminActivityLogService,
  type ActivityLogItemDto,
  type ActivityStatsSummaryDto,
} from '../services/adminActivityLogService';

export const AdminActivityLogView: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItemDto[]>([]);
  const [stats, setStats] = useState<ActivityStatsSummaryDto | null>(null);
  const [selectedLog, setSelectedLog] = useState<ActivityLogItemDto | null>(null);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedEventType, setSelectedEventType] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  // Status State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Fetch Logs
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await adminActivityLogService.getLogs({
        search: searchQuery.trim() || undefined,
        eventCategory: selectedCategory || undefined,
        eventType: selectedEventType || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page,
        size: pageSize,
        sortBy: 'createdAt',
        direction: 'DESC',
      });

      setLogs(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (err: unknown) {
      console.error('Loi khi tai nhat ky hanh vi:', err);
      const message = err instanceof Error ? err.message : 'Khong the ket noi may chu';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedEventType, fromDate, toDate, page, pageSize]);

  // Fetch Stats Summary
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await adminActivityLogService.getStatsSummary();
      setStats(statsData);
    } catch (err) {
      console.error('Loi khi tai thong ke nhat ky:', err);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchLogs();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedEventType('');
    setFromDate('');
    setToDate('');
    setPage(0);
  };

  const handleCopyJson = (payloadStr?: string | null) => {
    if (!payloadStr) return;
    try {
      let formatted = payloadStr;
      try {
        const parsed = JSON.parse(payloadStr);
        formatted = JSON.stringify(parsed, null, 2);
      } catch {
        // payload is plain string
      }
      navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Loi sao chep JSON:', err);
    }
  };

  const parseJsonSafe = (payloadStr?: string | null): unknown => {
    if (!payloadStr) return null;
    try {
      return JSON.parse(payloadStr);
    } catch {
      return payloadStr;
    }
  };

  const getCategoryBadgeClass = (category?: string) => {
    switch (category?.toUpperCase()) {
      case 'READER':
        return 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'VOCABULARY':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'DISCOVERY':
        return 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-300';
      case 'AUTH':
        return 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300 border-stone-300';
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Summary Counters ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
            <span>Tong su kien ghi nhan</span>
            <Activity className="size-4 text-antique-gold" aria-hidden="true" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
            {stats ? stats.totalLogs.toLocaleString() : totalElements.toLocaleString()}
          </div>
          <p className="text-[11px] text-text-secondary">Tat ca nhat ky trong CSDL</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
            <span>Su kien doc bai</span>
            <FileText className="size-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
            {stats?.categoryCounts?.READER ? stats.categoryCounts.READER.toLocaleString() : 0}
          </div>
          <p className="text-[11px] text-text-secondary">Luot doc va tuong tac bai</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
            <span>Tra cuu tu vung</span>
            <Layers className="size-4 text-amber-600" aria-hidden="true" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-amber-700 dark:text-amber-400">
            {stats?.categoryCounts?.VOCABULARY ? stats.categoryCounts.VOCABULARY.toLocaleString() : 0}
          </div>
          <p className="text-[11px] text-text-secondary">Luu tu vung vao so tay</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-text-muted text-xs font-semibold">
            <span>Kham pha van hoa</span>
            <Filter className="size-4 text-purple-600" aria-hidden="true" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-bold text-purple-700 dark:text-purple-400">
            {stats?.categoryCounts?.DISCOVERY ? stats.categoryCounts.DISCOVERY.toLocaleString() : 0}
          </div>
          <p className="text-[11px] text-text-secondary">Ban do va dia diem</p>
        </div>
      </div>

      {/* ── Filters Section ─────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80" role="search">
            <Search
              aria-hidden="true"
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tim theo email, URL, IP hoac noi dung..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
            />
          </form>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Category Select */}
            <select
              aria-label="Loc theo nhom su kien"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
            >
              <option value="">Tat ca nhom su kien</option>
              <option value="READER">READER (Doc bai)</option>
              <option value="VOCABULARY">VOCABULARY (Tu vung)</option>
              <option value="DISCOVERY">DISCOVERY (Kham pha)</option>
              <option value="AUTH">AUTH (Xac thuc)</option>
              <option value="SYSTEM">SYSTEM (He thong)</option>
            </select>

            {/* Event Type Select */}
            <select
              aria-label="Loc theo loai su kien"
              value={selectedEventType}
              onChange={(e) => {
                setSelectedEventType(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
            >
              <option value="">Moi loai hanh dong</option>
              <option value="ARTICLE_READ">ARTICLE_READ</option>
              <option value="ARTICLE_VIEW">ARTICLE_VIEW</option>
              <option value="VOCAB_LOOKUP">VOCAB_LOOKUP</option>
              <option value="VOCAB_SAVE">VOCAB_SAVE</option>
              <option value="PAGE_VIEW">PAGE_VIEW</option>
              <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
              <option value="LOGIN_FAILURE">LOGIN_FAILURE</option>
            </select>

            {/* Page Size */}
            <select
              aria-label="So luong dong moi trang"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(0);
              }}
              className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
            >
              <option value={10}>10 dong/trang</option>
              <option value={20}>20 dong/trang</option>
              <option value={50}>50 dong/trang</option>
            </select>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || selectedEventType || fromDate || toDate) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-3 py-2 rounded-xl bg-white/40 dark:bg-white/10 hover:bg-white/60 text-xs font-bold text-text-muted cursor-pointer transition-colors"
              >
                Xoa bo loc
              </button>
            )}

            {/* Refresh */}
            <button
              type="button"
              onClick={() => {
                fetchLogs();
                fetchStats();
              }}
              disabled={isLoading}
              className="p-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory cursor-pointer transition-colors disabled:opacity-50"
              title="Lam moi du lieu"
              aria-label="Lam moi du lieu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Date Range Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-antique-gold/20 text-xs">
          <span className="font-semibold text-text-secondary flex items-center gap-1">
            <Calendar className="size-3.5 text-antique-gold" aria-hidden="true" />
            <span>Khoang thoi gian:</span>
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="fromDateInput" className="text-text-muted text-[11px]">Tu ngay:</label>
            <input
              id="fromDateInput"
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(0);
              }}
              className="px-2.5 py-1 rounded-lg bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="toDateInput" className="text-text-muted text-[11px]">Den ngay:</label>
            <input
              id="toDateInput"
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(0);
              }}
              className="px-2.5 py-1 rounded-lg bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-body dark:text-warm-ivory focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            aria-label="Dong thong bao loi"
            onClick={() => setErrorMsg(null)}
            className="cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* ── Main Layout: Table & Inspector ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table Column */}
        <div
          className={`overflow-hidden rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm ${
            selectedLog ? 'lg:col-span-7' : 'lg:col-span-12'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-heritage-green/10 dark:bg-white/5 border-b border-antique-gold/20 text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Thoi gian</th>
                  <th className="py-3.5 px-4">Loai su kien</th>
                  <th className="py-3.5 px-4">Nhom</th>
                  <th className="py-3.5 px-4">Nguoi dung / Email</th>
                  <th className="py-3.5 px-4">Duong dan URL</th>
                  <th className="py-3.5 px-4">Dia chi IP</th>
                  <th className="py-3.5 px-4 text-right">Chi tiet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-antique-gold/15">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="inline-block animate-spin w-7 h-7 border-3 border-antique-gold border-t-transparent rounded-full mb-2" />
                      <p className="text-xs text-text-muted">Dang tai nhat ky he thong...</p>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center space-y-2">
                      <Activity className="w-10 h-10 text-antique-gold/40 mx-auto" aria-hidden="true" />
                      <p className="text-sm font-bold text-text-body dark:text-warm-ivory">
                        Chua co ban ghi nhat ky nao
                      </p>
                      <p className="text-xs text-text-muted max-w-sm mx-auto">
                        He thong chua ghi nhan du lieu phu hop voi bo loc hien tai hoac chua co thao tac tu nguoi dung.
                      </p>
                    </td>
                  </tr>
                ) : (
                  logs.map((item) => {
                    const isSelected = selectedLog?.id === item.id;
                    const actorDisplay = item.userEmail || item.userId || item.anonymousSessionId || 'Khach an danh';

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedLog(item)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-antique-gold/15 dark:bg-white/10'
                            : 'hover:bg-warm-ivory/60 dark:hover:bg-white/5'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono text-[11px] text-text-secondary whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-[11px] text-heritage-green dark:text-antique-bright whitespace-nowrap">
                          {item.eventType}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadgeClass(
                              item.eventCategory
                            )}`}
                          >
                            {item.eventCategory}
                          </span>
                        </td>
                        <td
                          className="py-3.5 px-4 font-medium text-text-body dark:text-warm-ivory max-w-[140px] truncate"
                          title={actorDisplay}
                        >
                          {actorDisplay}
                        </td>
                        <td
                          className="py-3.5 px-4 font-mono text-text-secondary max-w-[180px] truncate"
                          title={item.path || '—'}
                        >
                          {item.path || '—'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-text-muted whitespace-nowrap">
                          {item.ipAddress || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(item);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-heritage-green/10 hover:bg-heritage-green text-heritage-dark hover:text-warm-ivory dark:text-warm-ivory text-[10px] font-bold transition-all cursor-pointer"
                          >
                            {isSelected ? 'Dang xem' : 'Xem JSON'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-antique-gold/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
            <div>
              Hien thi{' '}
              <span className="font-bold text-heritage-green dark:text-antique-bright">
                {logs.length > 0 ? page * pageSize + 1 : 0}
              </span>{' '}
              -{' '}
              <span className="font-bold text-heritage-green dark:text-antique-bright">
                {Math.min((page + 1) * pageSize, totalElements)}
              </span>{' '}
              tren tong so{' '}
              <span className="font-bold text-heritage-green dark:text-antique-bright">
                {totalElements}
              </span>{' '}
              ban ghi
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 0 || isLoading}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="p-1.5 rounded-lg border border-antique-gold/30 hover:bg-antique-gold/15 transition-colors disabled:opacity-40 cursor-pointer"
                aria-label="Trang truoc"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </button>
              <span className="px-3 py-1 font-semibold text-xs">
                {page + 1} / {Math.max(1, totalPages)}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1 || isLoading}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-antique-gold/30 hover:bg-antique-gold/15 transition-colors disabled:opacity-40 cursor-pointer"
                aria-label="Trang tiep"
              >
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* JSON Inspector Panel Column */}
        <AnimatePresence>
          {selectedLog && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/80 border border-antique-gold/40 p-5 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-antique-gold/25 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-antique-gold">
                    Chi tiet nhat ky hoat dong
                  </div>
                  <h4 className="font-heading font-bold text-sm text-text-body dark:text-warm-ivory">
                    {selectedLog.eventType}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyJson(selectedLog.payload)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-antique-gold/20 hover:bg-antique-gold text-heritage-dark text-[11px] font-bold transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                        <span>Da sao chep</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Sao chep JSON</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedLog(null)}
                    className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/40 hover:bg-rose-200 text-rose-800 dark:text-rose-300 text-[11px] font-bold transition-all cursor-pointer"
                    aria-label="Dong khung chi tiet"
                  >
                    Dong
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-antique-gold/15">
                  <span className="text-text-muted">Ma dinh danh:</span>
                  <span className="font-mono font-semibold">{selectedLog.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-antique-gold/15">
                  <span className="text-text-muted">Thoi gian:</span>
                  <span className="font-mono">{formatDate(selectedLog.createdAt)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-antique-gold/15">
                  <span className="text-text-muted">Nhom su kien:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadgeClass(
                      selectedLog.eventCategory
                    )}`}
                  >
                    {selectedLog.eventCategory}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-antique-gold/15">
                  <span className="text-text-muted">Email nguoi dung:</span>
                  <span className="font-semibold text-heritage-green dark:text-antique-bright truncate max-w-[200px]">
                    {selectedLog.userEmail || selectedLog.userId || 'Khach vang lai'}
                  </span>
                </div>
                {selectedLog.path && (
                  <div className="flex justify-between py-1 border-b border-antique-gold/15">
                    <span className="text-text-muted">Duong dan URL:</span>
                    <span className="font-mono text-heritage-green dark:text-antique-bright truncate max-w-[200px]">
                      {selectedLog.path}
                    </span>
                  </div>
                )}
                {selectedLog.ipAddress && (
                  <div className="flex justify-between py-1 border-b border-antique-gold/15">
                    <span className="text-text-muted">Dia chi IP:</span>
                    <span className="font-mono">{selectedLog.ipAddress}</span>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div className="flex flex-col gap-1 py-1 border-b border-antique-gold/15">
                    <span className="text-text-muted">User Agent:</span>
                    <span className="font-mono text-[10px] text-text-secondary truncate">
                      {selectedLog.userAgent}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                  Du lieu trong tai (Payload)
                </div>
                <pre className="p-3.5 rounded-2xl bg-heritage-forest text-warm-ivory font-mono text-[11px] leading-relaxed overflow-x-auto max-h-72 border border-antique-gold/30">
                  {selectedLog.payload
                    ? JSON.stringify(parseJsonSafe(selectedLog.payload), null, 2)
                    : '// Khong co du lieu payload'}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminActivityLogView;
