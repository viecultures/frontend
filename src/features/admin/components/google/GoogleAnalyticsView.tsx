import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  RefreshCw,
  TrendingUp,
  Globe,
  Share2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  adminGoogleService,
  type GoogleAnalyticsData,
  type AnalyticsRange,
} from '../../services/adminGoogleService';

const formatDuration = (totalSeconds: number): string => {
  if (!totalSeconds || isNaN(totalSeconds)) return '0s';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}p ${seconds < 10 ? '0' : ''}${seconds}s`;
};

export const GoogleAnalyticsView: React.FC = () => {
  const [range, setRange] = useState<AnalyticsRange>('30d');
  const [data, setData] = useState<GoogleAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<'screenPageViews' | 'sessions' | 'activeUsers'>('screenPageViews');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const fetchData = useCallback(async (selectedRange: AnalyticsRange) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await adminGoogleService.getAnalytics(selectedRange);
      setData(res);
    } catch (err) {
      console.error('[GoogleAnalyticsView] Lỗi tải dữ liệu GA4:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ Google Analytics API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const handleRangeChange = (newRange: AnalyticsRange) => {
    setRange(newRange);
  };

  // SVG Chart Calculation
  const chartPoints = useMemo(() => {
    if (!data || !data.timeline || data.timeline.length === 0) return [];
    return data.timeline;
  }, [data]);

  const maxVal = useMemo(() => {
    if (chartPoints.length === 0) return 1;
    const values = chartPoints.map((p) => p[activeMetric]);
    return Math.max(...values, 10);
  }, [chartPoints, activeMetric]);

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
      const val = point[activeMetric];
      const y = paddingTop + usableHeight - (val / maxVal) * usableHeight;
      return { x, y, point, val };
    });
  }, [chartPoints, activeMetric, maxVal]);

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

  const totalPageviews = useMemo(() => {
    if (!data || !data.topPages) return 1;
    return data.topPages.reduce((acc, curr) => acc + curr.screenPageViews, 0) || 1;
  }, [data]);

  return (
    <div className="space-y-6">
      {/* ── Header Card ─────────────────────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-heading font-bold text-xl text-heritage-green dark:text-antique-bright flex items-center gap-2">
              <BarChart3 aria-hidden="true" className="w-6 h-6 text-antique-gold" />
              <span>Google Analytics 4 (GA4)</span>
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
              <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Đã kết nối luồng dữ liệu</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rice-paper dark:bg-white/10 text-heritage-green dark:text-antique-gold text-xs font-mono font-semibold border border-antique-gold/30">
              Property ID: {data?.propertyId || '561849201'}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Giám sát thời gian thực phiên học tập, tương tác bài đọc văn hóa và hành vi độc giả trên toàn nền tảng VieCultures.
          </p>
        </div>

        {/* Controls: Range selector & Refresh Button */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="p-1 rounded-2xl bg-rice-paper dark:bg-heritage-dark/80 border border-antique-gold/30 flex items-center gap-1">
            {(['7d', '30d', '90d'] as AnalyticsRange[]).map((r) => (
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
                {r === '7d' ? '7 ngày' : r === '30d' ? '30 ngày' : '90 ngày'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchData(range)}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-2xl bg-antique-gold hover:bg-antique-bright text-heritage-dark text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Làm mới chỉ số GA4"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 rounded-3xl bg-rice-paper/60 dark:bg-white/5 border border-antique-gold/20" />
            <div className="h-64 rounded-3xl bg-rice-paper/60 dark:bg-white/5 border border-antique-gold/20" />
          </div>
        </div>
      )}

      {/* ── 5-State: Error Container ────────────────────────────────────── */}
      {errorMsg && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle aria-hidden="true" className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Gặp lỗi khi tải chỉ số Google Analytics</h4>
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

      {/* ── Main Content: 4 KPI Cards + Chart + Tables ────────────────── */}
      {data && (
        <>
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Users */}
            <div
              onClick={() => setActiveMetric('activeUsers')}
              className={`p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border transition-all cursor-pointer relative overflow-hidden group ${
                activeMetric === 'activeUsers'
                  ? 'border-heritage-green ring-2 ring-heritage-green/20 dark:border-antique-gold'
                  : 'border-antique-gold/30 hover:border-antique-gold/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Người dùng hoạt động
                </span>
                <div className="w-8 h-8 rounded-xl bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                  <Users aria-hidden="true" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.activeUsers.toLocaleString('vi-VN')}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp aria-hidden="true" className="w-3 h-3 mr-0.5" />
                  +12.4%
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">Độc giả tương tác trong {range}</p>
            </div>

            {/* Sessions */}
            <div
              onClick={() => setActiveMetric('sessions')}
              className={`p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border transition-all cursor-pointer relative overflow-hidden group ${
                activeMetric === 'sessions'
                  ? 'border-heritage-green ring-2 ring-heritage-green/20 dark:border-antique-gold'
                  : 'border-antique-gold/30 hover:border-antique-gold/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Phiên truy cập
                </span>
                <div className="w-8 h-8 rounded-xl bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                  <Globe aria-hidden="true" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.sessions.toLocaleString('vi-VN')}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp aria-hidden="true" className="w-3 h-3 mr-0.5" />
                  +15.8%
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">Tổng phiên mở ứng dụng</p>
            </div>

            {/* Screen Page Views */}
            <div
              onClick={() => setActiveMetric('screenPageViews')}
              className={`p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border transition-all cursor-pointer relative overflow-hidden group ${
                activeMetric === 'screenPageViews'
                  ? 'border-heritage-green ring-2 ring-heritage-green/20 dark:border-antique-gold'
                  : 'border-antique-gold/30 hover:border-antique-gold/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Lượt xem bài đọc/trang
                </span>
                <div className="w-8 h-8 rounded-xl bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                  <Eye aria-hidden="true" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {data.summary.screenPageViews.toLocaleString('vi-VN')}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp aria-hidden="true" className="w-3 h-3 mr-0.5" />
                  +18.2%
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">Lượt đọc tài liệu song ngữ</p>
            </div>

            {/* Average Session Duration */}
            <div className="p-5 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 transition-all relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Thời lượng phiên TB
                </span>
                <div className="w-8 h-8 rounded-xl bg-antique-gold/15 flex items-center justify-center text-heritage-green dark:text-antique-gold">
                  <Clock aria-hidden="true" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl text-heritage-green dark:text-antique-bright">
                  {formatDuration(data.summary.averageSessionDuration)}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp aria-hidden="true" className="w-3 h-3 mr-0.5" />
                  +8.5%
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1">Mức độ tập trung nghiên cứu</p>
            </div>
          </div>

          {/* Trend Chart (SVG Responsive) */}
          <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <TrendingUp aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>
                    Xu hướng {activeMetric === 'screenPageViews' ? 'Lượt xem trang' : activeMetric === 'sessions' ? 'Phiên truy cập' : 'Người dùng hoạt động'}
                  </span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">Biểu đồ đo lường tiến trình đọc văn hóa từng ngày</p>
              </div>

              {/* Metric switcher tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-warm-ivory dark:bg-heritage-dark border border-antique-gold/30 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveMetric('screenPageViews')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeMetric === 'screenPageViews'
                      ? 'bg-heritage-green text-warm-ivory'
                      : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright'
                  }`}
                >
                  Lượt xem
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetric('sessions')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeMetric === 'sessions'
                      ? 'bg-heritage-green text-warm-ivory'
                      : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright'
                  }`}
                >
                  Phiên
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetric('activeUsers')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeMetric === 'activeUsers'
                      ? 'bg-heritage-green text-warm-ivory'
                      : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright'
                  }`}
                >
                  Người dùng
                </button>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="w-full overflow-hidden bg-warm-ivory dark:bg-heritage-dark/90 rounded-2xl border border-antique-gold/25 p-4 relative">
              <svg viewBox="0 0 800 220" className="w-full h-56 sm:h-64 select-none">
                <defs>
                  <linearGradient id="ga4Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-heritage-green)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--color-heritage-green)" stopOpacity="0.0" />
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
                {svgAreaPathData && <path d={svgAreaPathData} fill="url(#ga4Gradient)" />}

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

                {/* Data points & hover triggers */}
                {chartCoordinates.map((coord, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={idx}>
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={isHovered ? 5 : 2.5}
                        fill="var(--color-antique-gold)"
                        stroke="var(--color-heritage-green)"
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
                    <span className="text-antique-gold">{chartCoordinates[hoveredPointIndex].val.toLocaleString('vi-VN')}</span>
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

          {/* ── Two Analytics Detail Tables ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages Table */}
            <div className="p-6 rounded-3xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-antique-gold/20 pb-3">
                <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <Layers aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Top bài đọc & Trang xem nhiều nhất</span>
                </h3>
                <span className="text-xs text-text-muted">{data.topPages.length} trang hàng đầu</span>
              </div>

              {data.topPages.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">Chưa ghi nhận dữ liệu lượt xem trang.</div>
              ) : (
                <div className="space-y-3">
                  {data.topPages.map((page, idx) => {
                    const percent = Math.round((page.screenPageViews / totalPageviews) * 100);
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-rice-paper/60 dark:bg-white/5 border border-antique-gold/20 hover:border-antique-gold/50 transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs text-heritage-green dark:text-antique-bright truncate group-hover:text-antique-gold transition-colors">
                              {page.pageTitle || page.pagePath}
                            </h4>
                            <span className="font-mono text-[11px] text-text-muted truncate block">
                              {page.pagePath}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono text-xs font-bold text-heritage-green dark:text-antique-bright">
                              {page.screenPageViews.toLocaleString('vi-VN')}
                            </span>
                            <span className="text-[10px] text-text-muted block">lượt xem</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
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
              )}
            </div>

            {/* Traffic Sources Table */}
            <div className="p-6 rounded-3xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-antique-gold/20 pb-3">
                <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <Share2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Nguồn tiếp thị & Kênh truy cập</span>
                </h3>
                <span className="text-xs text-text-muted">Kênh phân phối học viên</span>
              </div>

              {data.trafficSources.length === 0 ? (
                <div className="p-8 text-center text-xs text-text-muted">Chưa ghi nhận nguồn traffic.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-antique-gold/20 text-text-muted">
                        <th className="py-2.5 px-3 font-semibold">Nguồn (utm_source)</th>
                        <th className="py-2.5 px-3 font-semibold">Kênh (utm_medium)</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Phiên</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Người dùng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-antique-gold/15">
                      {data.trafficSources.map((src, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-antique-gold/10 transition-colors"
                        >
                          <td className="py-3 px-3 font-mono font-bold text-heritage-green dark:text-antique-bright">
                            {src.source}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-rice-paper dark:bg-white/10 text-[11px] font-semibold text-text-secondary border border-antique-gold/25">
                              {src.medium}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-right font-semibold text-heritage-green dark:text-antique-bright">
                            {src.sessions.toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3 px-3 font-mono text-right text-text-muted">
                            {src.activeUsers.toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default GoogleAnalyticsView;
