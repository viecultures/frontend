import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Users,
  Compass,
  Award,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { growthEngineService } from '../../services/growthEngineService';
import type { MarketingOverviewData } from '../../types/marketing.contract';

export const MarketingOverviewTab: React.FC = () => {
  const [data, setData] = useState<MarketingOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await growthEngineService.getOverviewData();
      setData(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu tổng quan tiếp thị';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  // ── State 1: Loading Skeleton ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Đang tải dữ liệu tổng quan tiếp thị">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700" />
          ))}
        </div>
        <div className="h-72 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700" />
        <div className="h-64 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700" />
      </div>
    );
  }

  // ── State 2: Error Container with Retry ────────────────────────────────────
  if (errorMessage || !data) {
    return (
      <div className="p-8 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">Không thể tải dữ liệu phễu tăng trưởng</h3>
          <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">{errorMessage || 'Đã có sự cố xảy ra'}</p>
        </div>
        <button
          type="button"
          onClick={loadOverview}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-heritage-green text-white text-xs font-semibold hover:bg-heritage-green/90 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Thử lại ngay</span>
        </button>
      </div>
    );
  }

  const { kpis, funnelStages, topHeritageContent } = data;

  // Tính tỷ lệ chuyển đổi phễu tổng thể thực tế
  const totalFunnelCvr =
    funnelStages[0].count > 0
      ? ((funnelStages[funnelStages.length - 1].count / funnelStages[0].count) * 100).toFixed(2)
      : null;

  return (
    <div className="space-y-6">
      {/* ── Tiêu đề & Nút làm mới ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
            Tổng quan Tăng trưởng & Phễu Chuyển đổi
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Đo lường hành trình học viên theo thời gian thực từ cơ sở dữ liệu hệ thống VieCultures.
          </p>
        </div>
        <button
          type="button"
          onClick={loadOverview}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Làm mới số liệu</span>
        </button>
      </div>

      {/* ── Dải 4 Thẻ KPI Cốt lõi (Dữ liệu thực từ Database) ──────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Lượt nhấp UTM */}
        <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Lượt nhấp UTM Chiến dịch</span>
            <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              <TrendingUp className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {kpis.utmClicks.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            {kpis.utmClicks > 0 ? 'Tổng hợp từ các chiến dịch đã lưu' : 'Chưa có lượt nhấp ghi nhận'}
          </p>
        </div>

        {/* KPI 2: Tổng học viên đăng ký */}
        <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Tổng Học viên Đăng ký</span>
            <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-heritage-green">
              <Users className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {kpis.newSignups.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">Tài khoản thực tế trong cơ sở dữ liệu</p>
        </div>

        {/* KPI 3: Tỷ lệ kích hoạt học bài */}
        <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Tỷ lệ Kích hoạt Bài đọc (Activation)</span>
            <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400">
              <Compass className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {kpis.activationRate}%
            </span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">Dựa trên tỷ lệ học viên có lượt đọc bài</p>
        </div>

        {/* KPI 4: Tỷ lệ hoạt động trong tuần */}
        <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Học viên Hoạt động Tuần (Retention)</span>
            <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-purple-600 dark:text-purple-400">
              <Award className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {kpis.retentionD7Rate}%
            </span>
          </div>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">Tỷ lệ học viên hoạt động trong 7 ngày qua</p>
        </div>
      </div>

      {/* ── Trực quan hóa Phễu Chuyển đổi Thực tế (Real Funnel) ────────────── */}
      <section className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-heritage-green" aria-hidden="true" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Phễu Chuyển đổi Vòng đời Học viên (Dữ liệu Thực tế)
            </h3>
          </div>
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
            {totalFunnelCvr !== null
              ? `Chuyển đổi phễu tổng thể: ${totalFunnelCvr}%`
              : 'Đang theo dõi bước chuyển đổi'}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {funnelStages.map((stage, idx) => {
            const maxCount = Math.max(1, ...funnelStages.map((s) => s.count));
            const widthPercentage = stage.count > 0 ? Math.max(8, Math.min(100, (stage.count / maxCount) * 100)) : 2;
            return (
              <div key={idx} className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div className="font-semibold text-stone-800 dark:text-stone-200">
                    {stage.stage}
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
                    <span className="font-mono font-bold">{stage.count.toLocaleString()} học viên</span>
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-heritage-green/10 text-heritage-green border border-heritage-green/20">
                      {stage.conversionRate}%
                    </span>
                  </div>
                </div>

                {/* Thanh đo trực quan */}
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-heritage-green transition-all duration-300"
                    style={{ width: `${widthPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={stage.count}
                    aria-valuemin={0}
                    aria-valuemax={maxCount}
                  />
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {stage.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bảng Nội dung Di sản Thực tế Dẫn đầu Tăng trưởng ───────────────── */}
      <section className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Bài đọc Di sản Thống kê từ Hệ thống
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Dữ liệu bài đọc thực tế xếp hạng theo tổng lượt đọc (Total Reads) trong cơ sở dữ liệu.
          </p>
        </div>

        {topHeritageContent.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 dark:text-stone-400 border border-dashed border-stone-200 dark:border-stone-800 rounded-lg">
            Chưa có bài đọc nào được ghi nhận trong cơ sở dữ liệu.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-stone-200 dark:border-stone-700">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-700 bg-stone-100/75 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                  <th className="py-2.5 px-3">Tựa đề Bài đọc Di sản</th>
                  <th className="py-2.5 px-3">Vùng miền</th>
                  <th className="py-2.5 px-3">Chủ đề</th>
                  <th className="py-2.5 px-3 text-right">Tổng Lượt đọc (Reads)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700/60 text-stone-800 dark:text-stone-200">
                {topHeritageContent.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="py-2.5 px-3 font-medium">
                      <div className="flex items-center gap-1.5">
                        <span>{item.title}</span>
                        <a
                          href={`/reading/${item.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-stone-400 hover:text-heritage-green inline-flex items-center"
                          aria-label={`Mở bài đọc ${item.title}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          item.region === 'NORTH'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                            : item.region === 'CENTRAL'
                            ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                        }`}
                      >
                        {item.regionLabel}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 dark:text-stone-400">{item.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900 dark:text-stone-100">
                      {item.clicks.toLocaleString()}
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
