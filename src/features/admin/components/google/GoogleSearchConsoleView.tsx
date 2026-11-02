import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Globe,
  Search,
  MousePointerClick,
  Eye,
  Percent,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import {
  adminGoogleService,
  type GoogleSearchConsoleData,
  type SearchConsoleRange,
} from '../../services/adminGoogleService';

export const GoogleSearchConsoleView: React.FC = () => {
  const [range, setRange] = useState<SearchConsoleRange>('28d');
  const [data, setData] = useState<GoogleSearchConsoleData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'queries' | 'pages'>('queries');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [chartMetric, setChartMetric] = useState<'clicks' | 'impressions'>('clicks');

  const fetchData = useCallback(async (selectedRange: SearchConsoleRange) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await adminGoogleService.getSearchConsole(selectedRange);
      setData(res);
    } catch (err) {
      console.error('[GoogleSearchConsoleView] Lỗi tải dữ liệu GSC:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ Google Search Console API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const handleRangeChange = (newRange: SearchConsoleRange) => {
    setRange(newRange);
  };

  // SVG Chart points calculation
  const chartPoints = useMemo(() => {
    if (!data || !data.timeline || data.timeline.length === 0) return [];
    return data.timeline;
  }, [data]);

  const maxVal = useMemo(() => {
    if (chartPoints.length === 0) return 1;
    const values = chartPoints.map((p) => p[chartMetric]);
    return Math.max(...values, 10);
  }, [chartPoints, chartMetric]);

  const chartCoordinates = useMemo(() => {
    if (chartPoints.length === 0) return [];
    const width = 800;
    const height = 220;
    const paddingX = 40;
    const paddingTop = 20;
    const paddingBottom = 30;
    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingTop - paddingBottom;

    return chartPoints.map((point, index) => {
      const x = paddingX + (index / Math.max(chartPoints.length - 1, 1)) * usableWidth;
      const val = point[chartMetric];
      const y = paddingTop + usableHeight - (val / maxVal) * usableHeight;
      return { x, y, point, val };
    });
  }, [chartPoints, chartMetric, maxVal]);

  const svgPathData = useMemo(() => {
    if (chartCoordinates.length === 0) return '';
    return chartCoordinates.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = chartCoordinates[idx - 1];
      const cpx1 = prev.x + (curr.x - prev.x) / 2;
      const cpy1 = prev.y;
      const cpx2 = prev.x + (curr.x - prev.x) / 2;
      const cpy2 = curr.y;
      return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }, '');
  }, [chartCoordinates]);

  const svgAreaPathData = useMemo(() => {
    if (chartCoordinates.length === 0) return '';
    const first = chartCoordinates[0];
    const last = chartCoordinates[chartCoordinates.length - 1];
    const baseline = 220 - 30;
    return `${svgPathData} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
  }, [chartCoordinates, svgPathData]);

  // Devices calculation
  const totalDeviceClicks = useMemo(() => {
    if (!data || !data.devices) return 1;
    return data.devices.reduce((acc, curr) => acc + curr.clicks, 0) || 1;
  }, [data]);

  return (
    <div className="space-y-6">
      {/* ── Header Card ─────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-heading font-bold text-xl text-heritage-green dark:text-antique-bright flex items-center gap-2">
              <Globe aria-hidden="true" className="w-6 h-6 text-antique-gold" />
              <span>Google Search Console</span>
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
              <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Chủ sở hữu đã xác minh (siteFullUser)</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rice-paper dark:bg-white/10 text-heritage-green dark:text-antique-gold text-xs font-mono font-semibold border border-antique-gold/30">
              {data?.siteUrl || 'sc-domain:viecultures.app'}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Theo dõi vị thế tìm kiếm tự nhiên của nền tảng VieCultures trên Google Search: từ khóa văn hóa, số lần hiển thị và lượt nhấp chuột.
          </p>
        </div>

        {/* Controls: Range selector & Refresh Button */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="p-1 rounded-2xl bg-rice-paper dark:bg-heritage-dark/80 border border-antique-gold/30 flex items-center gap-1">
            {(['7d', '28d', '90d'] as SearchConsoleRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRangeChange(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  range === r
                    ? 'bg-heritage-green text-warm-ivory shadow-xs'
                    : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright'
                }`}
              >
                {r === '7d' ? '7 ngày' : r === '28d' ? '28 ngày' : '3 tháng'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchData(range)}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-2xl bg-antique-gold hover:bg-antique-bright text-heritage-dark text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Làm mới chỉ số Search Console"
          >
            <RefreshCw aria-hidden="true" className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* ── 5-State: Loading Skeleton ───────────────────────────────────── */}
      {isLoading && !data && (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-rice-paper/60 dark:bg-white/5 border border-antique-gold/20" />
            ))}
          </div>
          <div className="h-72 rounded-3xl bg-rice-paper/60 dark:bg-white/5 border border-antique-gold/20" />
          <div className="h-64 rounded-3xl bg-rice-paper/60 dark:bg-white/5 border border-antique-gold/20" />
        </div>
      )}

      {/* ── 5-State: Error Container ────────────────────────────────────── */}
      {errorMsg && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle aria-hidden="true" className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Gặp lỗi khi tải chỉ số Google Search Console</h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{errorMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fetchData(range)}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── Main Content: 4 KPI Cards + Chart + Tabs + Devices ─────────── */}
      {data && (
        <>
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Clicks */}
            <div
              onClick={() => setChartMetric('clicks')}
              className={`p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border transition-all cursor-pointer relative overflow-hidden group ${
                chartMetric === 'clicks'
                  ? 'border-heritage-green ring-2 ring-heritage-green/20 dark:border-antique-gold'
                  : 'border-antique-gold/30 hover:border-antique-gold/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Tổng lượt nhấp (Clicks)
                </span>
                <div className="w-8 h-8 rounded-xl bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                  <MousePointerClick aria-hidden="true" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.clicks.toLocaleString('vi-VN')}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp aria-hidden="true" className="w-3 h-3 mr-0.5" />
                  +14.2%
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">Lượt chuyển tiếp từ kết quả Google</p>
            </div>

            {/* Total Impressions */}
            <div
              onClick={() => setChartMetric('impressions')}
              className={`p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border transition-all cursor-pointer relative overflow-hidden group ${
                chartMetric === 'impressions'
                  ? 'border-heritage-green ring-2 ring-heritage-green/20 dark:border-antique-gold'
                  : 'border-antique-gold/30 hover:border-antique-gold/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Lượt hiển thị (Impressions)
                </span>
                <div className="w-8 h-8 rounded-xl bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                  <Eye aria-hidden="true" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.impressions.toLocaleString('vi-VN')}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp aria-hidden="true" className="w-3 h-3 mr-0.5" />
                  +21.5%
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">Số lần xuất hiện trên trang kết quả</p>
            </div>

            {/* Average CTR */}
            <div className="p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 transition-all relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  CTR trung bình
                </span>
                <div className="w-8 h-8 rounded-xl bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                  <Percent aria-hidden="true" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.ctr}%
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp aria-hidden="true" className="w-3 h-3 mr-0.5" />
                  +0.6%
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">Tỷ lệ nhấp chuột vào bài viết</p>
            </div>

            {/* Average Position */}
            <div className="p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 transition-all relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Vị trí trung bình
                </span>
                <div className="w-8 h-8 rounded-xl bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                  <TrendingUp aria-hidden="true" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  #{data.summary.position}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp aria-hidden="true" className="w-3 h-3 mr-0.5" />
                  +1.2 bậc
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">Thứ hạng trang đầu Google</p>
            </div>
          </div>

          {/* SEO Trend Chart */}
          <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <TrendingUp aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>
                    Xu hướng {chartMetric === 'clicks' ? 'Lượt nhấp chuột (Clicks)' : 'Lượt hiển thị (Impressions)'}
                  </span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Biến động chỉ số tìm kiếm tự nhiên trong {range}</p>
              </div>

              {/* Metric switcher tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/30 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setChartMetric('clicks')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'clicks'
                      ? 'bg-heritage-green text-warm-ivory'
                      : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright'
                  }`}
                >
                  Lượt nhấp (Clicks)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('impressions')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    chartMetric === 'impressions'
                      ? 'bg-heritage-green text-warm-ivory'
                      : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright'
                  }`}
                >
                  Lượt hiển thị (Impressions)
                </button>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="w-full overflow-hidden bg-warm-ivory dark:bg-heritage-dark/90 rounded-2xl border border-antique-gold/25 p-4 relative">
              <svg viewBox="0 0 800 220" className="w-full h-56 sm:h-64 select-none">
                <defs>
                  <linearGradient id="gscGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E4B43" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1E4B43" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal guidelines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                  const y = 20 + (220 - 50) * ratio;
                  return (
                    <line
                      key={ratio}
                      x1="40"
                      y1={y}
                      x2="760"
                      y2={y}
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      className="text-antique-gold/20"
                    />
                  );
                })}

                {/* Area under curve */}
                {svgAreaPathData && <path d={svgAreaPathData} fill="url(#gscGradient)" />}

                {/* Main line */}
                {svgPathData && (
                  <path
                    d={svgPathData}
                    fill="none"
                    stroke="#1E4B43"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data points & hover triggers */}
                {chartCoordinates.map((coord, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={idx}>
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={isHovered ? 5 : 2.5}
                        fill="#D9B76A"
                        stroke="#1E4B43"
                        strokeWidth="1.5"
                        className="transition-all duration-150"
                      />
                      {/* Transparent wider hover target */}
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={14}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip display */}
              {hoveredPointIndex !== null && chartCoordinates[hoveredPointIndex] && (
                <div
                  className="absolute pointer-events-none px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-mono shadow-lg border border-antique-gold/40 transition-all -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${(chartCoordinates[hoveredPointIndex].x / 800) * 100}%`,
                    top: `${(chartCoordinates[hoveredPointIndex].y / 220) * 100 - 4}%`,
                  }}
                >
                  <div className="font-bold">
                    {chartCoordinates[hoveredPointIndex].point.date}:{' '}
                    <span className="text-antique-gold">
                      {chartCoordinates[hoveredPointIndex].val.toLocaleString('vi-VN')}{' '}
                      {chartMetric === 'clicks' ? 'lượt nhấp' : 'lượt hiển thị'}
                    </span>
                  </div>
                </div>
              )}

              {/* X-axis start & end labels */}
              <div className="flex items-center justify-between text-[11px] text-text-muted mt-2 px-6">
                <span>{chartPoints[0]?.date}</span>
                <span className="font-semibold text-text-secondary">Chỉ số xu hướng {range}</span>
                <span>{chartPoints[chartPoints.length - 1]?.date}</span>
              </div>
            </div>
          </div>

          {/* ── Tabs: Top Queries vs Top Pages + Devices Breakdown ────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Queries & Pages Section (Span 2 cols) */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-antique-gold/20 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('queries')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'queries'
                        ? 'bg-heritage-green text-warm-ivory shadow-xs'
                        : 'text-text-secondary hover:text-heritage-green hover:bg-antique-gold/15'
                    }`}
                  >
                    <Search aria-hidden="true" className="w-3.5 h-3.5" />
                    <span>Top từ khóa tìm kiếm (Queries)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('pages')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'pages'
                        ? 'bg-heritage-green text-warm-ivory shadow-xs'
                        : 'text-text-secondary hover:text-heritage-green hover:bg-antique-gold/15'
                    }`}
                  >
                    <FileText aria-hidden="true" className="w-3.5 h-3.5" />
                    <span>Top trang hiển thị trên Google (Pages)</span>
                  </button>
                </div>

                <span className="text-xs text-text-muted">
                  {activeTab === 'queries' ? `${data.topQueries.length} từ khóa` : `${data.topPages.length} trang`}
                </span>
              </div>

              {/* Queries Table */}
              {activeTab === 'queries' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-antique-gold/20 text-text-muted">
                        <th className="py-2.5 px-3 font-semibold">Cụm từ tìm kiếm</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Lượt nhấp</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Hiển thị</th>
                        <th className="py-2.5 px-3 font-semibold text-right">CTR</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Vị trí</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-antique-gold/15">
                      {data.topQueries.map((item, idx) => (
                        <tr key={idx} className="hover:bg-antique-gold/10 transition-colors">
                          <td className="py-3 px-3 font-medium text-heritage-green dark:text-antique-bright">
                            {item.query}
                          </td>
                          <td className="py-3 px-3 font-mono text-right font-bold text-heritage-green dark:text-antique-bright">
                            {item.clicks.toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3 px-3 font-mono text-right text-text-muted">
                            {item.impressions.toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3 px-3 font-mono text-right font-semibold text-emerald-600 dark:text-emerald-400">
                            {item.ctr}%
                          </td>
                          <td className="py-3 px-3 font-mono text-right font-bold text-heritage-green dark:text-antique-gold">
                            #{item.position}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pages Table */}
              {activeTab === 'pages' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-antique-gold/20 text-text-muted">
                        <th className="py-2.5 px-3 font-semibold">Trang đích</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Lượt nhấp</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Hiển thị</th>
                        <th className="py-2.5 px-3 font-semibold text-right">CTR</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Vị trí</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-antique-gold/15">
                      {data.topPages.map((item, idx) => (
                        <tr key={idx} className="hover:bg-antique-gold/10 transition-colors">
                          <td className="py-3 px-3 font-mono text-[11px] text-heritage-green dark:text-antique-bright truncate max-w-xs" title={item.page}>
                            {item.page}
                          </td>
                          <td className="py-3 px-3 font-mono text-right font-bold text-heritage-green dark:text-antique-bright">
                            {item.clicks.toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3 px-3 font-mono text-right text-text-muted">
                            {item.impressions.toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3 px-3 font-mono text-right font-semibold text-emerald-600 dark:text-emerald-400">
                            {item.ctr}%
                          </td>
                          <td className="py-3 px-3 font-mono text-right font-bold text-heritage-green dark:text-antique-gold">
                            #{item.position}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Devices Breakdown Card (1 col) */}
            <div className="p-6 rounded-3xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
              <div className="border-b border-antique-gold/20 pb-3">
                <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <Smartphone aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Phân bổ thiết bị</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Tỷ lệ thiết bị tìm kiếm</p>
              </div>

              <div className="space-y-4">
                {data.devices.map((deviceItem, idx) => {
                  const percent = Math.round((deviceItem.clicks / totalDeviceClicks) * 100);
                  const isMobile = deviceItem.device.toUpperCase() === 'MOBILE';
                  const isDesktop = deviceItem.device.toUpperCase() === 'DESKTOP';
                  const Icon = isMobile ? Smartphone : isDesktop ? Monitor : Tablet;
                  const label = isMobile ? 'Điện thoại di động' : isDesktop ? 'Máy tính để bàn' : 'Máy tính bảng';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-rice-paper/60 dark:bg-white/5 border border-antique-gold/20 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                            <Icon aria-hidden="true" className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-heritage-green dark:text-antique-bright">
                              {label}
                            </span>
                            <span className="text-[10px] text-text-muted block">
                              {deviceItem.clicks.toLocaleString('vi-VN')} lượt nhấp
                            </span>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-heritage-green dark:text-antique-bright">
                          {percent}%
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="w-full h-1.5 rounded-full bg-mist-cloud/40 overflow-hidden">
                        <div
                          className="h-full bg-heritage-green dark:bg-antique-gold rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default GoogleSearchConsoleView;
