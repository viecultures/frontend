import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
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
  AlertTriangle,
  FileText,
  ExternalLink,
  ArrowUpDown,
} from 'lucide-react';
import {
  adminGoogleService,
  type GoogleSearchConsoleData,
  type SearchConsoleRange,
  type GoogleSearchConsoleQuery,
  type GoogleSearchConsolePage,
} from '../../services/adminGoogleService';


type SortField = 'name' | 'clicks' | 'impressions' | 'ctr' | 'position';
type SortDirection = 'asc' | 'desc';

export const GoogleSearchConsoleView: React.FC = () => {
  const [range, setRange] = useState<SearchConsoleRange>('28d');
  const [data, setData] = useState<GoogleSearchConsoleData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'queries' | 'pages'>('queries');
  const [chartMetric, setChartMetric] = useState<'clicks' | 'impressions'>('clicks');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Search & Sorting state for Queries and Pages
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('clicks');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const fetchData = useCallback(async (selectedRange: SearchConsoleRange) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await adminGoogleService.getSearchConsole(selectedRange);
      setData(res);
    } catch (err) {
      console.error('[GoogleSearchConsoleView] Lỗi tải dữ liệu GSC:', err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể kết nối đến máy chủ quản trị để lấy số liệu Google Search Console.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filtered & sorted queries
  const filteredQueries = useMemo(() => {
    if (!data || !data.topQueries) return [];
    const term = searchFilter.trim().toLowerCase();
    let result = data.topQueries.filter((q) =>
      term ? q.query.toLowerCase().includes(term) : true
    );

    result = [...result].sort((a: GoogleSearchConsoleQuery, b: GoogleSearchConsoleQuery) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.query.localeCompare(b.query, 'vi');
          break;
        case 'clicks':
          comparison = a.clicks - b.clicks;
          break;
        case 'impressions':
          comparison = a.impressions - b.impressions;
          break;
        case 'ctr':
          comparison = a.ctr - b.ctr;
          break;
        case 'position':
          comparison = a.position - b.position;
          break;
        default:
          comparison = a.clicks - b.clicks;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data, searchFilter, sortField, sortDirection]);

  // Filtered & sorted pages
  const filteredPages = useMemo(() => {
    if (!data || !data.topPages) return [];
    const term = searchFilter.trim().toLowerCase();
    let result = data.topPages.filter((p) =>
      term ? p.page.toLowerCase().includes(term) : true
    );

    result = [...result].sort((a: GoogleSearchConsolePage, b: GoogleSearchConsolePage) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.page.localeCompare(b.page);
          break;
        case 'clicks':
          comparison = a.clicks - b.clicks;
          break;
        case 'impressions':
          comparison = a.impressions - b.impressions;
          break;
        case 'ctr':
          comparison = a.ctr - b.ctr;
          break;
        case 'position':
          comparison = a.position - b.position;
          break;
        default:
          comparison = a.clicks - b.clicks;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [data, searchFilter, sortField, sortDirection]);

  // Timeline points & chart metrics
  const chartPoints = useMemo(() => {
    if (!data || !data.timeline) return [];
    return data.timeline;
  }, [data]);

  const chartStats = useMemo(() => {
    if (chartPoints.length === 0) {
      return { peak: 0, avg: 0, total: 0, hasData: false };
    }
    const values = chartPoints.map((p) => p[chartMetric]);
    const total = values.reduce((acc, curr) => acc + curr, 0);
    const peak = Math.max(...values, 0);
    const avg = values.length > 0 ? Math.round((total / values.length) * 10) / 10 : 0;
    const hasData = total > 0;
    return { peak, avg, total, hasData };
  }, [chartPoints, chartMetric]);

  const maxVal = useMemo(() => {
    if (chartPoints.length === 0) return 10;
    const peak = chartStats.peak;
    return peak > 0 ? Math.ceil(peak * 1.15) : 10;
  }, [chartPoints, chartStats.peak]);

  const chartCoordinates = useMemo(() => {
    if (chartPoints.length === 0) return [];
    const width = 800;
    const height = 220;
    const paddingX = 30;
    const paddingTop = 25;
    const paddingBottom = 35;
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
    const baseline = 220 - 35;
    return `${svgPathData} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
  }, [chartCoordinates, svgPathData]);

  // Devices calculation
  const totalDeviceClicks = useMemo(() => {
    if (!data || !data.devices || data.devices.length === 0) return 0;
    return data.devices.reduce((acc, curr) => acc + curr.clicks, 0);
  }, [data]);

  const isLive = Boolean(data?.liveData);

  return (
    <div className="space-y-6">
      {/* ── Toolbar: Status & Date Range Controls ───────────────────────── */}
      <div className="p-4 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Live vs Waiting Status */}
          {isLive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700">
              <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Dữ liệu thực tế từ Google Search Console</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-semibold border border-amber-300 dark:border-amber-700">
              <AlertTriangle aria-hidden="true" className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Chưa kết nối live data Google (Chế độ chờ cấu hình)</span>
            </span>
          )}

          {/* Date range if available */}
          {data?.startDate && data?.endDate && (
            <span className="text-text-muted hidden md:inline">
              ({data.startDate} đến {data.endDate})
            </span>
          )}
        </div>

        {/* Range Selector & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="p-1 rounded-xl bg-rice-paper dark:bg-heritage-dark/80 border border-antique-gold/30 flex items-center gap-1">
            {(['7d', '28d', '90d'] as SearchConsoleRange[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  range === r
                    ? 'bg-heritage-green text-warm-ivory shadow-xs'
                    : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright'
                }`}
              >
                {r === '7d' ? '7 ngày qua' : r === '28d' ? '28 ngày qua' : '90 ngày qua'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchData(range)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-antique-gold hover:bg-antique-bright text-heritage-dark text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Làm mới chỉ số Google Search Console"
          >
            <RefreshCw aria-hidden="true" className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* ── 5-State: Loading Skeleton ───────────────────────────────────── */}
      {isLoading && (
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
      {!isLoading && errorMsg && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle aria-hidden="true" className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Không thể tải dữ liệu Google Search Console</h4>
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

      {/* ── Main Content: 4 KPI Cards + Chart + Queries/Pages + Devices ── */}
      {!isLoading && data && !errorMsg && (
        <>
          {/* 4 KPI Cards (Bỏ toàn bộ % hardcode giả mạo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Clicks */}
            <button
              type="button"
              onClick={() => setChartMetric('clicks')}
              className={`p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border text-left transition-all cursor-pointer relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-antique-gold ${
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
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.clicks.toLocaleString('vi-VN')}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1.5 flex items-center justify-between">
                <span>Lượt click vào bài viết từ Google</span>
                {chartMetric === 'clicks' && (
                  <span className="text-[10px] font-bold text-heritage-green dark:text-antique-bright bg-antique-gold/20 px-1.5 py-0.5 rounded">
                    Đang xem biểu đồ
                  </span>
                )}
              </p>
            </button>

            {/* Total Impressions */}
            <button
              type="button"
              onClick={() => setChartMetric('impressions')}
              className={`p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border text-left transition-all cursor-pointer relative overflow-hidden group focus-visible:ring-2 focus-visible:ring-antique-gold ${
                chartMetric === 'impressions'
                  ? 'border-heritage-green ring-2 ring-heritage-green/20 dark:border-antique-gold'
                  : 'border-antique-gold/30 hover:border-antique-gold/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Tổng lượt hiển thị (Impressions)
                </span>
                <div className="w-8 h-8 rounded-xl bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                  <Eye aria-hidden="true" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.impressions.toLocaleString('vi-VN')}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1.5 flex items-center justify-between">
                <span>Số lần xuất hiện trên tìm kiếm</span>
                {chartMetric === 'impressions' && (
                  <span className="text-[10px] font-bold text-heritage-green dark:text-antique-bright bg-antique-gold/20 px-1.5 py-0.5 rounded">
                    Đang xem biểu đồ
                  </span>
                )}
              </p>
            </button>

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
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.ctr}%
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">
                Tỷ lệ nhấp chuột vào kết quả hiển thị
              </p>
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
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.position > 0 ? `#${data.summary.position}` : '---'}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1.5">
                Thứ hạng trung bình trên trang kết quả
              </p>
            </div>
          </div>

          {/* SEO Performance Trend Chart */}
          <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <TrendingUp aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>
                    Xu hướng {chartMetric === 'clicks' ? 'Lượt nhấp chuột (Clicks)' : 'Lượt hiển thị (Impressions)'}
                  </span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Biến động chỉ số tìm kiếm tự nhiên trong {range === '7d' ? '7 ngày qua' : range === '28d' ? '28 ngày qua' : '90 ngày qua'}
                </p>
              </div>

              {/* Metric switcher tabs & stats */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/30 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setChartMetric('clicks')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      chartMetric === 'clicks'
                        ? 'bg-heritage-green text-warm-ivory shadow-xs'
                        : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright'
                    }`}
                  >
                    Lượt nhấp
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetric('impressions')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      chartMetric === 'impressions'
                        ? 'bg-heritage-green text-warm-ivory shadow-xs'
                        : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright'
                    }`}
                  >
                    Lượt hiển thị
                  </button>
                </div>

                <div className="hidden lg:flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-xl bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/30">
                  <span className="text-text-muted">Đỉnh điểm:</span>
                  <span className="font-bold text-heritage-green dark:text-antique-bright">
                    {chartStats.peak.toLocaleString('vi-VN')}
                  </span>
                  <span className="text-text-muted ml-2">TB/ngày:</span>
                  <span className="font-bold text-heritage-green dark:text-antique-bright">
                    {chartStats.avg.toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Chart Container */}
            <div className="w-full overflow-hidden bg-warm-ivory dark:bg-heritage-dark/90 rounded-2xl border border-antique-gold/25 p-4 relative">
              {chartStats.hasData ? (
                <>
                  <svg viewBox="0 0 800 220" className="w-full h-52 sm:h-60 select-none">
                    <defs>
                      <linearGradient id="gscTrendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-heritage-green)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--color-heritage-green)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area under curve */}
                    {svgAreaPathData && <path d={svgAreaPathData} fill="url(#gscTrendGradient)" />}

                    {/* Main line */}
                    {svgPathData && (
                      <path
                        d={svgPathData}
                        fill="none"
                        stroke="var(--color-heritage-green)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Data points (Selective rendering to avoid 90-circle clutter) */}
                    {chartCoordinates.map((coord, idx) => {
                      const isHovered = hoveredPointIndex === idx;
                      const isHighlight =
                        idx === 0 ||
                        idx === chartCoordinates.length - 1 ||
                        coord.val === chartStats.peak;

                      return (
                        <g key={idx}>
                          {(isHovered || (isHighlight && chartCoordinates.length <= 30)) && (
                            <circle
                              cx={coord.x}
                              cy={coord.y}
                              r={isHovered ? 5.5 : 3.5}
                              fill="var(--color-antique-gold)"
                              stroke="var(--color-heritage-green)"
                              strokeWidth="1.5"
                              className="transition-all duration-150"
                            />
                          )}
                          {/* Hover target zone */}
                          <circle
                            cx={coord.x}
                            cy={coord.y}
                            r={12}
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
                      className="absolute pointer-events-none px-3 py-1.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-mono shadow-md border border-antique-gold/40 transition-all -translate-x-1/2 -translate-y-full"
                      style={{
                        left: `${(chartCoordinates[hoveredPointIndex].x / 800) * 100}%`,
                        top: `${(chartCoordinates[hoveredPointIndex].y / 220) * 100 - 6}%`,
                      }}
                    >
                      <div className="font-bold">
                        {chartCoordinates[hoveredPointIndex].point.date}:{' '}
                        <span className="text-antique-bright">
                          {chartCoordinates[hoveredPointIndex].val.toLocaleString('vi-VN')}{' '}
                          {chartMetric === 'clicks' ? 'lượt nhấp' : 'lượt hiển thị'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* X-axis start & end dates */}
                  <div className="flex items-center justify-between text-[11px] text-text-muted mt-2 px-4">
                    <span>{chartPoints[0]?.date}</span>
                    <span className="font-semibold text-text-secondary">
                      Phạm vi {range === '7d' ? '7 ngày' : range === '28d' ? '28 ngày' : '3 tháng'}
                    </span>
                    <span>{chartPoints[chartPoints.length - 1]?.date}</span>
                  </div>
                </>
              ) : (
                /* 5-State: Empty Chart State */
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-antique-gold/15 text-heritage-green dark:text-antique-gold flex items-center justify-center">
                    <TrendingUp aria-hidden="true" className="w-6 h-6" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright">
                    Chưa có dữ liệu biến động {chartMetric === 'clicks' ? 'lượt nhấp' : 'lượt hiển thị'}
                  </h4>
                  <p className="text-xs text-text-muted max-w-md">
                    Google Search Console chưa ghi nhận số liệu trong khoảng thời gian này hoặc luồng dữ liệu đang chờ xác thực.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Tabs: Top Queries vs Top Pages + Devices Breakdown ────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Queries & Pages Section (Span 2 cols) */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-antique-gold/20 pb-3">
                {/* Tab Switcher */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('queries');
                      setSearchFilter('');
                    }}
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
                    onClick={() => {
                      setActiveTab('pages');
                      setSearchFilter('');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'pages'
                        ? 'bg-heritage-green text-warm-ivory shadow-xs'
                        : 'text-text-secondary hover:text-heritage-green hover:bg-antique-gold/15'
                    }`}
                  >
                    <FileText aria-hidden="true" className="w-3.5 h-3.5" />
                    <span>Top trang đích (Pages)</span>
                  </button>
                </div>

                {/* Search Filter Input */}
                <div className="relative w-full sm:w-56">
                  <Search aria-hidden="true" className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={activeTab === 'queries' ? 'Tìm từ khóa...' : 'Tìm trang...'}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-rice-paper dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs text-text-primary placeholder:text-text-muted focus:outline-hidden focus:ring-1 focus:ring-antique-gold"
                  />
                </div>
              </div>

              {/* Queries Table */}
              {activeTab === 'queries' && (
                <div className="overflow-x-auto">
                  {filteredQueries.length > 0 ? (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-antique-gold/20 text-text-muted">
                          <th
                            onClick={() => handleSort('name')}
                            className="py-2.5 px-3 font-semibold cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center gap-1">
                              <span>Cụm từ tìm kiếm</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('clicks')}
                            className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span>Lượt nhấp</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('impressions')}
                            className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span>Hiển thị</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('ctr')}
                            className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span>CTR</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('position')}
                            className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span>Vị trí</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-antique-gold/15">
                        {filteredQueries.map((item, idx) => (
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
                  ) : (
                    /* 5-State: Empty Queries State */
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-antique-gold/15 text-heritage-green dark:text-antique-gold flex items-center justify-center">
                        <Search aria-hidden="true" className="w-5 h-5" />
                      </div>
                      <h4 className="font-heading font-bold text-xs text-heritage-green dark:text-antique-bright">
                        {searchFilter ? 'Không tìm thấy từ khóa phù hợp' : 'Chưa có từ khóa tìm kiếm'}
                      </h4>
                      <p className="text-[11px] text-text-muted max-w-sm">
                        {searchFilter
                          ? 'Vui lòng kiểm tra lại cụm từ cần tìm hoặc xóa bộ lọc.'
                          : 'Google chưa ghi nhận truy vấn tìm kiếm nào trong khoảng thời gian này hoặc tài khoản đang chờ đồng bộ.'}
                      </p>
                      {searchFilter && (
                        <button
                          type="button"
                          onClick={() => setSearchFilter('')}
                          className="px-3 py-1 rounded-lg bg-antique-gold/20 text-heritage-green text-[11px] font-semibold hover:bg-antique-gold/30 cursor-pointer"
                        >
                          Xóa bộ lọc tìm kiếm
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pages Table */}
              {activeTab === 'pages' && (
                <div className="overflow-x-auto">
                  {filteredPages.length > 0 ? (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-antique-gold/20 text-text-muted">
                          <th
                            onClick={() => handleSort('name')}
                            className="py-2.5 px-3 font-semibold cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center gap-1">
                              <span>Trang đích</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('clicks')}
                            className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span>Lượt nhấp</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('impressions')}
                            className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span>Hiển thị</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('ctr')}
                            className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span>CTR</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                          <th
                            onClick={() => handleSort('position')}
                            className="py-2.5 px-3 font-semibold text-right cursor-pointer hover:text-heritage-green select-none"
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span>Vị trí</span>
                              <ArrowUpDown aria-hidden="true" className="w-3 h-3" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-antique-gold/15">
                        {filteredPages.map((item, idx) => (
                          <tr key={idx} className="hover:bg-antique-gold/10 transition-colors">
                            <td className="py-3 px-3 font-mono text-[11px] text-heritage-green dark:text-antique-bright truncate max-w-xs" title={item.page}>
                              <div className="flex items-center gap-1.5">
                                <span className="truncate">{item.page}</span>
                                {item.page.startsWith('http') && (
                                  <a
                                    href={item.page}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-antique-gold hover:text-antique-bright shrink-0"
                                    title="Mở liên kết"
                                  >
                                    <ExternalLink aria-hidden="true" className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
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
                  ) : (
                    /* 5-State: Empty Pages State */
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-antique-gold/15 text-heritage-green dark:text-antique-gold flex items-center justify-center">
                        <FileText aria-hidden="true" className="w-5 h-5" />
                      </div>
                      <h4 className="font-heading font-bold text-xs text-heritage-green dark:text-antique-bright">
                        {searchFilter ? 'Không tìm thấy trang phù hợp' : 'Chưa có trang đích ghi nhận'}
                      </h4>
                      <p className="text-[11px] text-text-muted max-w-sm">
                        {searchFilter
                          ? 'Vui lòng kiểm tra lại đường dẫn cần tìm.'
                          : 'Google chưa ghi nhận trang đích nào có lượt hiển thị trong phạm vi ngày này.'}
                      </p>
                      {searchFilter && (
                        <button
                          type="button"
                          onClick={() => setSearchFilter('')}
                          className="px-3 py-1 rounded-lg bg-antique-gold/20 text-heritage-green text-[11px] font-semibold hover:bg-antique-gold/30 cursor-pointer"
                        >
                          Xóa bộ lọc tìm kiếm
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Devices Breakdown Card (1 col) */}
            <div className="p-6 rounded-3xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-xs space-y-4">
              <div className="border-b border-antique-gold/20 pb-3">
                <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <Smartphone aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Phân bổ theo thiết bị</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Tỷ lệ lượt nhấp trên các thiết bị</p>
              </div>

              {data.devices && data.devices.length > 0 && totalDeviceClicks > 0 ? (
                <div className="space-y-4">
                  {data.devices.map((deviceItem, idx) => {
                    const percent = Math.round((deviceItem.clicks / totalDeviceClicks) * 100);
                    const devType = deviceItem.device.toUpperCase();
                    const isMobile = devType === 'MOBILE';
                    const isDesktop = devType === 'DESKTOP';
                    const Icon = isMobile ? Smartphone : isDesktop ? Monitor : Tablet;
                    const label = isMobile
                      ? 'Điện thoại di động'
                      : isDesktop
                      ? 'Máy tính để bàn'
                      : 'Máy tính bảng';

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
                        <div className="w-full h-1.5 rounded-full bg-mist-cloud/40 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-heritage-green dark:bg-antique-gold rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* 5-State: Empty Devices State */
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-antique-gold/15 text-heritage-green dark:text-antique-gold flex items-center justify-center">
                    <Monitor aria-hidden="true" className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-xs text-heritage-green dark:text-antique-bright">
                    Chưa có số liệu thiết bị
                  </h4>
                  <p className="text-[11px] text-text-muted max-w-xs">
                    Số liệu phân bổ theo thiết bị sẽ hiển thị tự động khi có lượt nhấp chuột được ghi nhận.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleSearchConsoleView;
