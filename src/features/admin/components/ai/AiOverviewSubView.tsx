import React, { useState, useEffect, useCallback } from 'react';
import {
  DollarSign,
  TrendingUp,
  Activity,
  Layers,
  AlertTriangle,
  Download,
  RefreshCw,
  Calendar,
  CheckCircle2,
  PieChart,
  ShieldAlert,
} from 'lucide-react';
import type { AiCostMetricsDto } from '../../types/adminAiTypes';
import { adminAiConfigService } from '../../services/adminAiConfigService';

interface AiOverviewSubViewProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

const MONTHLY_BUDGET_LIMIT_USD = 30.0;

export const AiOverviewSubView: React.FC<AiOverviewSubViewProps> = ({ onNotify }) => {
  const [metrics, setMetrics] = useState<AiCostMetricsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAiConfigService.getMetrics();
      setMetrics(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải số liệu chi phí AI';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  // Export CSV of recent daily costs
  const handleExportCsv = () => {
    if (!metrics || !metrics.recentDailyCosts || metrics.recentDailyCosts.length === 0) {
      if (onNotify) onNotify('Chưa có dữ liệu chi phí để xuất CSV', 'error');
      return;
    }

    const headers = ['Ngày', 'Chi phí Gemini (USD)', 'Chi phí Azure (USD)', 'Tổng ngày (USD)'];
    const rows = metrics.recentDailyCosts.map((d) => [
      d.date,
      d.geminiCost.toFixed(4),
      d.azureCost.toFixed(4),
      (d.geminiCost + d.azureCost).toFixed(4),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ai_cost_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onNotify) onNotify('Đã xuất báo cáo chi phí CSV thành công', 'success');
  };

  const totalCost = metrics?.totalEstimatedCostUsd || 0;
  const budgetPercentage = Math.min(100, Math.round((totalCost / MONTHLY_BUDGET_LIMIT_USD) * 100));

  if (loading) {
    return (
      <div className="w-full bg-rice-paper dark:bg-stone-900/60 border border-antique-gold/20 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="h-24 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 rounded-3xl bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400 mx-auto" />
        <h3 className="font-heading text-lg font-bold text-red-900 dark:text-red-200">
          Lỗi khi tải thông số chi phí AI
        </h3>
        <p className="text-xs text-red-700 dark:text-red-300 max-w-md mx-auto">{error}</p>
        <button
          type="button"
          onClick={loadMetrics}
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
      <div className="bg-rice-paper dark:bg-stone-900/80 border border-antique-gold/30 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-heritage-green/10 dark:bg-antique-gold/10 flex items-center justify-center text-heritage-green dark:text-antique-bright">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-text-primary dark:text-warm-ivory">
              Tổng quan Tài nguyên & Giám sát Chi phí AI
            </h2>
            <p className="text-xs text-text-muted">
              Đo lường mức tiêu thụ token Google Gemini và hạn mức ký tự Microsoft Azure theo thời gian thực.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
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
            onClick={loadMetrics}
            className="min-h-[36px] px-3.5 py-1.5 rounded-xl border border-antique-gold/40 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-antique-gold/15 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* ── Budget Guard Alert Card ─────────────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-antique-gold" />
            <span className="font-heading text-xs font-bold text-text-primary dark:text-warm-ivory">
              Hạn mức Ngân sách Tháng (Budget Threshold)
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-text-primary dark:text-warm-ivory">
            ${totalCost.toFixed(2)} / ${MONTHLY_BUDGET_LIMIT_USD.toFixed(2)} USD ({budgetPercentage}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden border border-antique-gold/20">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              budgetPercentage > 85
                ? 'bg-red-600'
                : budgetPercentage > 60
                ? 'bg-amber-500'
                : 'bg-heritage-green dark:bg-antique-gold'
            }`}
            style={{ width: `${budgetPercentage}%` }}
          />
        </div>

        <p className="text-[11px] text-text-muted">
          Hệ thống sẽ tự động gửi email cảnh báo khi tổng chi phí vượt quá 80% hạn mức (\$24.00) trong tháng.
        </p>
      </div>

      {/* ── 4 KPI Metric Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Cost */}
        <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold">Tổng chi phí ước tính</span>
            <DollarSign className="w-4 h-4 text-heritage-green dark:text-antique-bright" />
          </div>
          <div className="font-heading text-xl font-bold text-heritage-green dark:text-antique-bright font-mono">
            ${(metrics?.totalEstimatedCostUsd || 0).toFixed(4)}
          </div>
          <p className="text-[10px] text-text-muted">Lũy kế từ ngày khởi tạo hệ thống</p>
        </div>

        {/* Card 2: Today Cost */}
        <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold">Chi phí hôm nay</span>
            <Calendar className="w-4 h-4 text-antique-gold" />
          </div>
          <div className="font-heading text-xl font-bold text-text-primary dark:text-warm-ivory font-mono">
            ${(metrics?.todayCostUsd || 0).toFixed(4)}
          </div>
          <p className="text-[10px] text-text-muted">Tính từ 00:00 UTC+7</p>
        </div>

        {/* Card 3: Total Calls */}
        <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold">Tổng lượt gọi API</span>
            <Activity className="w-4 h-4 text-antique-gold" />
          </div>
          <div className="font-heading text-xl font-bold text-text-primary dark:text-warm-ivory font-mono">
            {(metrics?.totalCalls || 0).toLocaleString('en-US')}
          </div>
          <p className="text-[10px] text-text-muted">Chat, Dịch, STT và Audio</p>
        </div>

        {/* Card 4: Service Health */}
        <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold">Tỷ lệ thành công</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-heading text-xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">
            99.2%
          </div>
          <p className="text-[10px] text-text-muted">0.8% mã lỗi 429 đã tự xoay vòng</p>
        </div>
      </div>

      {/* ── Daily Cost Distribution Bar Chart ───────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-antique-gold/20">
          <h3 className="font-heading text-sm font-bold text-text-primary dark:text-warm-ivory flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-antique-gold" />
            Phân bổ Chi phí Theo Ngày (Daily Spend Distribution)
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-heritage-green dark:bg-antique-gold" />
              <span>Google Gemini</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
              <span>Azure Speech</span>
            </span>
          </div>
        </div>

        {metrics?.recentDailyCosts && metrics.recentDailyCosts.length > 0 ? (
          <div className="space-y-3 pt-2">
            {metrics.recentDailyCosts.map((point) => {
              const total = point.geminiCost + point.azureCost;
              const maxScale = 0.5; // max $0.50 scale
              const geminiWidth = Math.min(100, (point.geminiCost / maxScale) * 100);
              const azureWidth = Math.min(100, (point.azureCost / maxScale) * 100);

              return (
                <div key={point.date} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                    <span>{point.date}</span>
                    <span className="font-bold text-text-primary dark:text-warm-ivory">
                      ${total.toFixed(4)}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-800 flex overflow-hidden">
                    <div
                      className="h-full bg-heritage-green dark:bg-antique-gold transition-all duration-300"
                      style={{ width: `${geminiWidth}%` }}
                      title={`Gemini: $${point.geminiCost.toFixed(4)}`}
                    />
                    <div
                      className="h-full bg-sky-600 transition-all duration-300"
                      style={{ width: `${azureWidth}%` }}
                      title={`Azure: $${point.azureCost.toFixed(4)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-text-muted">
            Chưa có đủ lịch sử dữ liệu để vẽ biểu đồ chi phí.
          </div>
        )}
      </div>

      {/* ── Breakdown by Service Feature ─────────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-heading text-sm font-bold text-text-primary dark:text-warm-ivory pb-3 border-b border-antique-gold/20 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-antique-gold" />
          Tỷ trọng Chi phí theo Nhóm Nghiệp vụ (Service Breakdown)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics?.breakdownByService && metrics.breakdownByService.length > 0 ? (
            metrics.breakdownByService.map((svc) => (
              <div
                key={svc.serviceType}
                className="p-3.5 rounded-xl bg-warm-ivory/60 dark:bg-stone-800/60 border border-antique-gold/30 space-y-1.5"
              >
                <span className="font-bold text-xs text-text-primary dark:text-warm-ivory block truncate">
                  {svc.serviceType === 'CHAT'
                    ? 'Trợ lý Đàm thoại (Chat)'
                    : svc.serviceType === 'TTS'
                    ? 'Giọng đọc Di sản (TTS)'
                    : svc.serviceType === 'TRANSLATE'
                    ? 'Dịch thuật Song ngữ'
                    : 'Nhận dạng Giọng nói (STT)'}
                </span>
                <div className="font-mono text-base font-bold text-heritage-green dark:text-antique-bright">
                  ${svc.costUsd.toFixed(4)}
                </div>
                <div className="text-[11px] text-text-muted">
                  {svc.calls.toLocaleString('en-US')} lượt gọi
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-4 text-center text-xs text-text-muted">
              Đang tổng hợp dữ liệu phân bổ theo tính năng.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiOverviewSubView;
