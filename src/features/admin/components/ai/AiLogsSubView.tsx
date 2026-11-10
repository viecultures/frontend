import React, { useState, useEffect, useCallback } from 'react';
import {
  History,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { AiUsageLogDto, AiUsageLogPageResponse, AiProvider } from '../../types/adminAiTypes';
import { adminAiConfigService } from '../../services/adminAiConfigService';

interface AiLogsSubViewProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

export const AiLogsSubView: React.FC<AiLogsSubViewProps> = ({ onNotify }) => {
  const [logs, setLogs] = useState<AiUsageLogDto[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  const [providerFilter, setProviderFilter] = useState<'ALL' | AiProvider>('ALL');
  const [featureFilter, setFeatureFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: AiUsageLogPageResponse = await adminAiConfigService.getLogs(page, pageSize);
      setLogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải nhật ký sử dụng AI';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Client-side filtering when provider/feature is selected
  const filteredLogs = logs.filter((log) => {
    if (providerFilter !== 'ALL' && log.provider !== providerFilter) return false;
    if (featureFilter !== 'ALL' && log.featureCode !== featureFilter) return false;
    return true;
  });

  // Export CSV
  const handleExportCsv = () => {
    if (filteredLogs.length === 0) {
      if (onNotify) onNotify('Không có dòng nhật ký nào để xuất', 'error');
      return;
    }

    const headers = [
      'ID',
      'Thời điểm',
      'Nhà cung cấp',
      'Nghiệp vụ',
      'Mô hình',
      'Prompt Tokens',
      'Completion Tokens',
      'Ký tự',
      'Chi phí (USD)',
      'Độ trễ (ms)',
      'HTTP Status',
    ];

    const rows = filteredLogs.map((l) => [
      l.id,
      l.createdAt,
      l.provider,
      l.featureCode,
      l.modelName,
      l.promptTokens,
      l.completionTokens,
      l.characterCount,
      l.estimatedCostUsd.toFixed(6),
      l.latencyMs,
      l.httpStatus,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ai_audit_logs_page_${page + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onNotify) onNotify('Đã xuất file CSV nhật ký kiểm toán AI', 'success');
  };

  if (loading && logs.length === 0) {
    return (
      <div className="w-full bg-rice-paper dark:bg-stone-900/60 border border-antique-gold/20 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-xl animate-pulse" />
        <div className="h-80 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 rounded-3xl bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400 mx-auto" />
        <h3 className="font-heading text-lg font-bold text-red-900 dark:text-red-200">
          Không thể tải nhật ký AI
        </h3>
        <p className="text-xs text-red-700 dark:text-red-300 max-w-md mx-auto">{error}</p>
        <button
          type="button"
          onClick={loadLogs}
          className="px-5 py-2.5 rounded-xl bg-red-700 text-white font-medium text-xs hover:bg-red-800 transition-colors shadow-sm cursor-pointer"
        >
          Thử tải lại
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* ── Top Header Toolbar ──────────────────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/80 border border-antique-gold/30 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-heritage-green/10 dark:bg-antique-gold/10 flex items-center justify-center text-heritage-green dark:text-antique-bright">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-text-primary dark:text-warm-ivory">
              Nhật ký Kiểm toán & Giám sát AI (AI Telemetry Logs)
            </h2>
            <p className="text-xs text-text-muted">
              Truy vết chi tiết từng lượt gọi API, số token vào/ra, độ trễ và mã phản hồi HTTP.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            type="button"
            onClick={handleExportCsv}
            className="min-h-[36px] px-3.5 py-1.5 rounded-xl border border-antique-gold/40 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-antique-gold/15 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>

          <button
            type="button"
            onClick={loadLogs}
            className="min-h-[36px] px-3.5 py-1.5 rounded-xl border border-antique-gold/40 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-antique-gold/15 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-3.5 shadow-sm flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-text-muted font-bold">
          <Filter className="w-3.5 h-3.5 text-antique-gold" />
          <span>Bộ lọc nhanh:</span>
        </div>

        {/* Provider filter */}
        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value as 'ALL' | AiProvider)}
          className="px-3 py-1.5 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs text-text-primary dark:text-warm-ivory font-semibold focus:outline-none focus:ring-2 focus:ring-antique-gold"
        >
          <option value="ALL">Mọi nhà cung cấp (Gemini & Azure)</option>
          <option value="GEMINI">Google Gemini</option>
          <option value="AZURE">Microsoft Azure</option>
        </select>

        {/* Feature filter */}
        <select
          value={featureFilter}
          onChange={(e) => setFeatureFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs text-text-primary dark:text-warm-ivory font-semibold focus:outline-none focus:ring-2 focus:ring-antique-gold"
        >
          <option value="ALL">Mọi tính năng</option>
          <option value="COMPANION_CHAT">Trợ lý Đàm thoại (Chat)</option>
          <option value="COMPANION_TRANSLATE">Dịch thuật Song ngữ</option>
          <option value="STT">Nhận dạng Giọng nói (STT)</option>
          <option value="TTS">Giọng đọc Di sản (TTS)</option>
        </select>

        <span className="text-[11px] text-text-muted ml-auto font-mono">
          Hiển thị <strong>{filteredLogs.length}</strong> / <strong>{totalElements}</strong> lượt gọi
        </span>
      </div>

      {/* ── Logs Data Table ─────────────────────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-muted space-y-2">
            <History className="w-8 h-8 mx-auto opacity-30 text-antique-gold" />
            <p className="font-medium">Không tìm thấy bản ghi nhật ký nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-antique-gold/20 text-text-muted font-bold">
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Nghiệp vụ</th>
                  <th className="py-2.5 px-3">Mô hình</th>
                  <th className="py-2.5 px-3 text-right">Tokens Vào</th>
                  <th className="py-2.5 px-3 text-right">Tokens Ra</th>
                  <th className="py-2.5 px-3 text-right">Chi phí ước tính</th>
                  <th className="py-2.5 px-3 text-right">Độ trễ</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-antique-gold/15">
                {filteredLogs.map((item) => {
                  const isSuccess = item.httpStatus >= 200 && item.httpStatus < 300;

                  return (
                    <tr key={item.id} className="hover:bg-warm-ivory/60 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted whitespace-nowrap">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '--'}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-text-primary dark:text-warm-ivory">
                        {item.featureCode}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-heritage-green dark:text-antique-bright">
                        {item.modelName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-text-secondary">
                        {item.promptTokens > 0 ? item.promptTokens.toLocaleString('en-US') : '--'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-text-secondary">
                        {item.completionTokens > 0 ? item.completionTokens.toLocaleString('en-US') : '--'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right font-bold text-text-primary dark:text-warm-ivory">
                        ${item.estimatedCostUsd.toFixed(5)}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-right text-text-muted">
                        {item.latencyMs} ms
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {isSuccess ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {item.httpStatus}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-300/40 inline-flex items-center gap-1">
                            <XCircle className="w-2.5 h-2.5" />
                            {item.httpStatus}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Controls ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-3 border-t border-antique-gold/20 text-xs">
          <span className="text-text-muted">
            Trang <strong>{page + 1}</strong> / <strong>{Math.max(1, totalPages)}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              className="p-1.5 rounded-lg border border-antique-gold/40 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((prev) => prev + 1)}
              className="p-1.5 rounded-lg border border-antique-gold/40 text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiLogsSubView;
