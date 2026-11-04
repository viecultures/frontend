import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Compass,
  Layers,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  Volume2,
  VolumeX,
  HelpCircle,
  Bookmark,
  Edit3,
  Plus,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Headphones,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Tag,
  Hash,
} from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import type { LearningJourneyItem, ReadingPostItem, CefrLevel } from '../types/adminTypes';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import { adminRegionLabel } from '../admin-presentation';

export interface JourneyCanvasModalProps {
  isOpen: boolean;
  journey: LearningJourneyItem | null;
  posts?: ReadingPostItem[]; // Danh sách các bài post thuộc journey này
  isLoadingPosts?: boolean;
  onClose: () => void;
  onSelectPost?: (post: ReadingPostItem) => void;
  onViewVocab?: (post: ReadingPostItem) => void;
  onEditJourney?: (journey: LearningJourneyItem) => void;
  onAddChapter?: (journey: LearningJourneyItem) => void;
}

const THEME_LABELS: Record<string, { en: string; vi: string }> = {
  cuisine: { en: 'Cuisine', vi: 'Ẩm thực & Phong vị' },
  places: { en: 'Heritage Places', vi: 'Danh lam & Di sản' },
  crafts: { en: 'Traditional Crafts', vi: 'Làng nghề truyền thống' },
  festivals: { en: 'Festivals & Folklore', vi: 'Lễ hội & Dân gian' },
  history: { en: 'History & Culture', vi: 'Lịch sử văn hóa' },
};

export const JourneyCanvasModal: React.FC<JourneyCanvasModalProps> = ({
  isOpen,
  journey,
  posts = [],
  isLoadingPosts = false,
  onClose,
  onSelectPost,
  onViewVocab,
  onEditJourney,
  onAddChapter,
}) => {
  const [zoom, setZoom] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'needs-audio' | 'needs-quiz' | 'ready'>('all');

  // Mouse pan/drag navigation state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; scrollLeft: number; scrollTop: number }>({
    x: 0,
    y: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag when clicking background or canvas surface, not interactive buttons/links
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }

    if (scrollContainerRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        scrollLeft: scrollContainerRef.current.scrollLeft,
        scrollTop: scrollContainerRef.current.scrollTop,
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    scrollContainerRef.current.scrollLeft = dragStart.scrollLeft - dx;
    scrollContainerRef.current.scrollTop = dragStart.scrollTop - dy;
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(1.5, Number((prev + 0.1).toFixed(1))));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.6, Number((prev - 0.1).toFixed(1))));
  const handleResetZoom = () => setZoom(1.0);
  const handleToggleFullscreen = () => setIsFullscreen((prev) => !prev);

  // Lookups & Labels
  const provinceName = useMemo(() => {
    if (!journey?.provinceId) return 'Toàn quốc';
    const found = VIETNAM_34_PROVINCES.find((p) => p.id === journey.provinceId);
    return found ? found.name : journey.provinceId;
  }, [journey?.provinceId]);

  const themeDisplay = useMemo(() => {
    if (!journey?.theme) return { en: 'General', vi: 'Tổng quan' };
    return THEME_LABELS[journey.theme] || { en: journey.theme, vi: journey.theme };
  }, [journey?.theme]);

  // Sorted and Filtered Posts
  const sortedPosts = useMemo(() => {
    const list = [...posts];
    list.sort((a, b) => {
      const orderA = a.chapterOrder ?? 999;
      const orderB = b.chapterOrder ?? 999;
      return orderA - orderB;
    });
    return list;
  }, [posts]);

  // Health and Readiness Metrics Calculation
  const metrics = useMemo(() => {
    const totalChapters = sortedPosts.length;
    let totalVocab = 0;
    let audioCount = 0;
    let quizCount = 0;

    sortedPosts.forEach((post) => {
      totalVocab += post.vocabularies?.length || 0;
      const hasAudio = Boolean(
        post.shadowingAudioUrl ||
        (post.audioTracks && post.audioTracks !== '[]') ||
        post.paragraphs?.some((p) => p.audioTimestampStart !== undefined)
      );
      if (hasAudio) audioCount += 1;

      const hasQuiz = Boolean(post.questions && post.questions.length > 0);
      if (hasQuiz) quizCount += 1;
    });

    const audioPercent = totalChapters > 0 ? Math.round((audioCount / totalChapters) * 100) : 0;
    const quizPercent = totalChapters > 0 ? Math.round((quizCount / totalChapters) * 100) : 0;

    return {
      totalChapters,
      totalVocab,
      audioCount,
      audioPercent,
      quizCount,
      quizPercent,
      isFullyReady: totalChapters > 0 && audioPercent === 100 && quizPercent === 100,
    };
  }, [sortedPosts]);

  // Filtered posts for inspection
  const displayedPosts = useMemo(() => {
    if (activeFilter === 'needs-audio') {
      return sortedPosts.filter((post) => {
        const hasAudio = Boolean(
          post.shadowingAudioUrl ||
          (post.audioTracks && post.audioTracks !== '[]') ||
          post.paragraphs?.some((p) => p.audioTimestampStart !== undefined)
        );
        return !hasAudio;
      });
    }
    if (activeFilter === 'needs-quiz') {
      return sortedPosts.filter((post) => !post.questions || post.questions.length === 0);
    }
    if (activeFilter === 'ready') {
      return sortedPosts.filter((post) => {
        const hasAudio = Boolean(
          post.shadowingAudioUrl ||
          (post.audioTracks && post.audioTracks !== '[]') ||
          post.paragraphs?.some((p) => p.audioTimestampStart !== undefined)
        );
        const hasQuiz = Boolean(post.questions && post.questions.length > 0);
        return hasAudio && hasQuiz;
      });
    }
    return sortedPosts;
  }, [sortedPosts, activeFilter]);

  if (!isOpen) return null;

  // Status Badge Helper
  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
            <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Xuất bản</span>
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40">
            <Clock aria-hidden="true" className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Hẹn giờ</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-300/40">
            <AlertCircle aria-hidden="true" className="w-3.5 h-3.5 text-stone-500" />
            <span>Bản nháp</span>
          </span>
        );
    }
  };

  // CEFR Color Badge Helper
  const getCefrBadgeClass = (level?: CefrLevel | string) => {
    switch (level) {
      case 'A1':
      case 'A2':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300/40';
      case 'B1':
      case 'B2':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300/40';
      case 'C1':
      case 'C2':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300/40';
      default:
        return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-300/40';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="journey-canvas-dialog relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-heritage-forest/80 backdrop-blur-md transition-opacity duration-300" />

      <div className="fixed inset-0 overflow-hidden flex items-center justify-center p-0 md:p-3">
        <DialogPanel
          className={`relative flex flex-col bg-rice-paper dark:bg-heritage-dark border border-antique-gold/40 shadow-2xl overflow-hidden transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 w-screen h-screen rounded-none z-50'
              : 'w-[98vw] max-w-[1720px] h-[95vh] rounded-3xl'
          }`}
        >
          <DialogTitle className="sr-only">
            Bảng vẽ toàn cảnh hành trình {journey?.titleEn || 'Hành trình học tập'}
          </DialogTitle>

          {/* ══════════════════════════════════════════════════════════════════════════
              HEADER BAR: Title, Bilingual details, Readiness metrics, Controls
              ══════════════════════════════════════════════════════════════════════════ */}
          <header className="p-4 sm:p-5 bg-heritage-green text-warm-ivory border-b border-antique-gold/30 shrink-0 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 select-none shadow-md">
            {/* Left: Journey Title & Metadata */}
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-antique-gold/20 text-antique-bright border border-antique-gold/40 flex items-center gap-1">
                  <Compass aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                  <span>Bảng vẽ trực quan Storyboard</span>
                </span>
                {journey && renderStatusBadge(journey.status)}
                {journey?.provinceId && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-warm-ivory/80">
                    <MapPin aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                    <span>{provinceName}</span>
                    <span className="text-antique-gold/50">•</span>
                    <span className="capitalize">{adminRegionLabel(journey.region)}</span>
                  </span>
                )}
                {journey?.theme && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-warm-ivory border border-white/20">
                    <Tag aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                    <span>{themeDisplay.vi}</span>
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 min-w-0">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-antique-bright truncate">
                  {journey?.titleEn || 'Chưa có tiêu đề tiếng Anh'}
                </h2>
                {journey?.titleVi && (
                  <span className="hidden sm:inline text-xs text-warm-ivory/70 italic truncate">
                    ({journey.titleVi})
                  </span>
                )}
              </div>
            </div>

            {/* Center: Health & Readiness Metrics Bar */}
            <div className="flex items-center flex-wrap gap-2 sm:gap-4 bg-heritage-dark/80 px-3.5 py-2 rounded-2xl border border-antique-gold/30">
              {/* Total Chapters */}
              <div className="flex items-center gap-2 pr-3 border-r border-antique-gold/20">
                <div className="w-7 h-7 rounded-lg bg-antique-gold/20 flex items-center justify-center text-antique-bright">
                  <Layers aria-hidden="true" className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-warm-ivory/60 leading-none">Chương bài</div>
                  <div className="font-mono text-sm font-bold text-antique-bright leading-tight">
                    {metrics.totalChapters} <span className="text-[10px] font-normal text-warm-ivory/70">bài</span>
                  </div>
                </div>
              </div>

              {/* Total Vocab */}
              <div className="flex items-center gap-2 pr-3 border-r border-antique-gold/20">
                <div className="w-7 h-7 rounded-lg bg-antique-gold/20 flex items-center justify-center text-antique-bright">
                  <Bookmark aria-hidden="true" className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-warm-ivory/60 leading-none">Từ vựng</div>
                  <div className="font-mono text-sm font-bold text-antique-bright leading-tight">
                    {metrics.totalVocab} <span className="text-[10px] font-normal text-warm-ivory/70">từ</span>
                  </div>
                </div>
              </div>

              {/* Audio Coverage */}
              <div className="flex items-center gap-2 pr-3 border-r border-antique-gold/20">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    metrics.audioPercent >= 80
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : metrics.audioPercent > 0
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  <Volume2 aria-hidden="true" className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-warm-ivory/60 leading-none">Audio phát âm</div>
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="font-mono text-sm font-bold text-antique-bright">
                      {metrics.audioPercent}%
                    </span>
                    <span className="text-[10px] text-warm-ivory/60">
                      ({metrics.audioCount}/{metrics.totalChapters})
                    </span>
                  </div>
                </div>
              </div>

              {/* Quiz Coverage */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    metrics.quizPercent >= 80
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : metrics.quizPercent > 0
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  <HelpCircle aria-hidden="true" className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-warm-ivory/60 leading-none">Bài tập Quiz</div>
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="font-mono text-sm font-bold text-antique-bright">
                      {metrics.quizPercent}%
                    </span>
                    <span className="text-[10px] text-warm-ivory/60">
                      ({metrics.quizCount}/{metrics.totalChapters})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Controls (Zoom, Fullscreen, Close) */}
            <div className="flex items-center gap-1.5 shrink-0 justify-end">
              {/* Zoom Controls */}
              <div className="flex items-center bg-heritage-dark/80 rounded-xl border border-antique-gold/30 p-1 text-warm-ivory">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.6}
                  aria-label="Thu nhỏ bản vẽ"
                  className="p-1.5 rounded-lg hover:bg-antique-gold/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-antique-bright cursor-pointer"
                  title="Thu nhỏ (-)"
                >
                  <ZoomOut aria-hidden="true" className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleResetZoom}
                  aria-label="Đặt lại kích thước 100%"
                  className="px-2 py-0.5 text-xs font-mono font-bold text-antique-bright hover:bg-antique-gold/20 rounded transition-colors cursor-pointer"
                  title="Đặt lại 100%"
                >
                  {Math.round(zoom * 100)}%
                </button>

                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 1.5}
                  aria-label="Phóng to bản vẽ"
                  className="p-1.5 rounded-lg hover:bg-antique-gold/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-antique-bright cursor-pointer"
                  title="Phóng to (+)"
                >
                  <ZoomIn aria-hidden="true" className="w-4 h-4" />
                </button>

                <div className="h-4 w-px bg-antique-gold/30 mx-1" />

                <button
                  type="button"
                  onClick={handleResetZoom}
                  aria-label="Reset góc nhìn"
                  className="p-1.5 rounded-lg hover:bg-antique-gold/20 transition-colors text-antique-bright cursor-pointer"
                  title="Về kích thước chuẩn (100%)"
                >
                  <RotateCcw aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={handleToggleFullscreen}
                aria-label={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
                className="p-2 rounded-xl bg-heritage-dark/80 border border-antique-gold/30 text-antique-bright hover:bg-antique-gold/20 transition-colors cursor-pointer"
                title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
              >
                {isFullscreen ? (
                  <Minimize2 aria-hidden="true" className="w-4 h-4" />
                ) : (
                  <Maximize2 aria-hidden="true" className="w-4 h-4" />
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng bảng vẽ"
                className="p-2 rounded-xl bg-white/10 border border-white/20 text-warm-ivory hover:bg-red-500/20 hover:text-red-200 hover:border-red-400/40 transition-colors cursor-pointer ml-1"
                title="Đóng (Esc)"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* ══════════════════════════════════════════════════════════════════════════
              SUB-TOOLBAR: Filter Pills & Interactive Hints
              ══════════════════════════════════════════════════════════════════════════ */}
          <section className="px-5 py-2.5 bg-rice-paper/80 dark:bg-heritage-forest/60 border-b border-antique-gold/20 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-secondary text-[11px] uppercase tracking-wider">Lọc hiển thị:</span>
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm'
                    : 'bg-warm-ivory/60 dark:bg-white/5 text-text-secondary hover:bg-antique-gold/15'
                }`}
              >
                Tất cả ({sortedPosts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('needs-audio')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'needs-audio'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-warm-ivory/60 dark:bg-white/5 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/40'
                }`}
              >
                <VolumeX aria-hidden="true" className="w-3 h-3" />
                <span>Cần audio ({sortedPosts.length - metrics.audioCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('needs-quiz')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'needs-quiz'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-warm-ivory/60 dark:bg-white/5 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40'
                }`}
              >
                <HelpCircle aria-hidden="true" className="w-3 h-3" />
                <span>Cần quiz ({sortedPosts.length - metrics.quizCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('ready')}
                className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  activeFilter === 'ready'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-warm-ivory/60 dark:bg-white/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/40'
                }`}
              >
                <CheckCircle2 aria-hidden="true" className="w-3 h-3" />
                <span>Hoàn thiện 100%</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-text-muted text-[11px]">
              <span className="hidden md:inline italic">
                Mẹo: Bạn có thể nhấn giữ chuột và kéo để di chuyển vùng làm việc, hoặc lăn chuột ngang.
              </span>
              {journey && onAddChapter && (
                <button
                  type="button"
                  onClick={() => onAddChapter(journey)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/40 hover:bg-antique-gold/30 font-semibold transition-colors cursor-pointer"
                >
                  <Plus aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Thêm bài vào lộ trình</span>
                </button>
              )}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════════════
              CANVAS WORKSPACE AREA (Dot Grid background + Horizontal Storyboard)
              ══════════════════════════════════════════════════════════════════════════ */}
          <main
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex-1 overflow-auto relative cursor-grab active:cursor-grabbing p-6 sm:p-10 select-none ${
              isDragging ? 'select-none' : ''
            }`}
            style={{
              backgroundImage: 'radial-gradient(#d9b76a40 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Scaled Flow Surface */}
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              }}
              className="min-w-max pb-20 flex items-start gap-0"
            >
              {/* ───────────────────────────────────────────────────────────────────
                  NODE 1: ROOT JOURNEY HUB (Lộ trình Trung tâm)
                  ─────────────────────────────────────────────────────────────────── */}
              {journey ? (
                <article
                  className="w-84 sm:w-92 shrink-0 rounded-3xl border-2 border-antique-gold/70 bg-warm-ivory dark:bg-heritage-forest shadow-2xl overflow-hidden flex flex-col group transition-all duration-300"
                  aria-label="Thẻ trung tâm hành trình"
                >
                  {/* Hub Header Banner */}
                  <div className="p-4 bg-gradient-to-r from-heritage-green to-heritage-dark text-warm-ivory border-b border-antique-gold/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-antique-gold/20 border border-antique-gold/40 flex items-center justify-center text-antique-bright">
                        <Compass aria-hidden="true" className="w-4 h-4 animate-spin-slow" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-antique-bright uppercase tracking-wider block">
                          TRUNG TÂM HÀNH TRÌNH
                        </span>
                        <span className="text-xs font-mono text-warm-ivory/70">
                          #{journey.id}
                        </span>
                      </div>
                    </div>
                    {renderStatusBadge(journey.status)}
                  </div>

                  {/* Hub Cover Image */}
                  <div className="relative aspect-video w-full bg-stone-200 dark:bg-stone-800 overflow-hidden border-b border-antique-gold/20">
                    {journey.imageUrl ? (
                      <img
                        src={journey.imageUrl}
                        alt={journey.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-antique-gold/10 text-antique-gold p-4 text-center">
                        <Compass aria-hidden="true" className="w-10 h-10 mb-2 opacity-50" />
                        <span className="text-xs font-medium">Chưa có ảnh bìa lộ trình</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center justify-between text-xs">
                      <span className="font-semibold drop-shadow">{provinceName}</span>
                      <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] border border-white/20">
                        {metrics.totalChapters} Chương
                      </span>
                    </div>
                  </div>

                  {/* Hub Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-heading font-bold text-base sm:text-lg text-heritage-green dark:text-antique-bright leading-snug">
                        {journey.titleEn}
                      </h3>
                      {journey.titleVi && (
                        <p className="text-xs text-text-secondary italic">
                          {journey.titleVi}
                        </p>
                      )}
                      <p className="text-xs text-text-muted line-clamp-3 leading-relaxed pt-1">
                        {journey.description || 'Chưa có thông tin mô tả chi tiết cho hành trình học tập này.'}
                      </p>
                    </div>

                    {/* Metadata Badges */}
                    <div className="pt-3 border-t border-antique-gold/20 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted flex items-center gap-1.5">
                          <MapPin aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                          <span>Địa bàn:</span>
                        </span>
                        <span className="font-semibold text-text-primary">{provinceName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted flex items-center gap-1.5">
                          <Tag aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                          <span>Chủ đề:</span>
                        </span>
                        <span className="font-semibold text-text-primary capitalize">{themeDisplay.vi}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-muted flex items-center gap-1.5">
                          <Calendar aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                          <span>Ngày tạo:</span>
                        </span>
                        <span className="font-mono text-[11px] text-text-primary">
                          {journey.createdAt ? new Date(journey.createdAt).toLocaleDateString('vi-VN') : 'Mới tạo'}
                        </span>
                      </div>
                    </div>

                    {/* Hub Action Button */}
                    <div className="pt-2">
                      {onEditJourney && (
                        <button
                          type="button"
                          onClick={() => onEditJourney(journey)}
                          className="w-full py-2.5 px-4 rounded-xl bg-antique-gold text-heritage-dark font-bold text-xs hover:bg-antique-bright active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                          <Edit3 aria-hidden="true" className="w-4 h-4" />
                          <span>Sửa thông tin lộ trình</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ) : (
                /* Error state fallback */
                <div className="p-8 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-300 text-red-800 dark:text-red-200">
                  <AlertCircle aria-hidden="true" className="w-8 h-8 mb-2" />
                  <p className="font-bold">Không tìm thấy thông tin lộ trình</p>
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────────────
                  CONNECTING CONNECTOR LINE (From Hub to Chapter 1)
                  ─────────────────────────────────────────────────────────────────── */}
              <div className="w-16 sm:w-20 self-center flex items-center justify-center shrink-0 relative px-2">
                <div className="w-full h-0.5 bg-antique-gold/50 relative flex items-center justify-center">
                  <div className="absolute w-3 h-3 rounded-full bg-antique-gold border-2 border-warm-ivory dark:border-heritage-forest shadow-sm" />
                  <ChevronRight aria-hidden="true" className="w-4 h-4 text-antique-gold ml-3" />
                </div>
              </div>

              {/* ───────────────────────────────────────────────────────────────────
                  STATE: LOADING (Skeleton Nodes)
                  ─────────────────────────────────────────────────────────────────── */}
              {isLoadingPosts && (
                <div className="flex items-start gap-8">
                  {[1, 2, 3].map((n) => (
                    <React.Fragment key={n}>
                      <div className="w-84 sm:w-96 shrink-0 rounded-3xl border border-antique-gold/20 bg-warm-ivory/60 dark:bg-heritage-forest/60 p-5 space-y-4 animate-pulse">
                        <div className="h-6 w-1/3 bg-antique-gold/20 rounded-full" />
                        <div className="aspect-video w-full bg-antique-gold/15 rounded-2xl" />
                        <div className="space-y-2">
                          <div className="h-5 w-4/5 bg-antique-gold/20 rounded" />
                          <div className="h-4 w-3/5 bg-antique-gold/15 rounded" />
                        </div>
                        <div className="h-20 bg-antique-gold/10 rounded-2xl" />
                        <div className="h-10 bg-antique-gold/20 rounded-xl" />
                      </div>
                      {n < 3 && (
                        <div className="w-12 self-center flex items-center justify-center shrink-0">
                          <div className="w-full h-0.5 bg-antique-gold/20" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────────────
                  STATE: EMPTY (Chưa có bài post nào trong journey)
                  ─────────────────────────────────────────────────────────────────── */}
              {!isLoadingPosts && sortedPosts.length === 0 && (
                <article
                  className="w-96 shrink-0 rounded-3xl border-2 border-dashed border-antique-gold/60 bg-warm-ivory/70 dark:bg-heritage-forest/40 p-8 flex flex-col items-center justify-center text-center space-y-4"
                  aria-label="Hành trình chưa có chương bài"
                >
                  <div className="w-16 h-16 rounded-full bg-antique-gold/20 border border-antique-gold/40 flex items-center justify-center text-antique-gold">
                    <Layers aria-hidden="true" className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright">
                      Chưa có chương bài học nào
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed max-w-xs">
                      Hành trình này hiện chưa có bài đọc hay chặng học nào. Hãy bắt đầu tạo chương đầu tiên để học viên khám phá văn hóa.
                    </p>
                  </div>
                  {journey && onAddChapter && (
                    <button
                      type="button"
                      onClick={() => onAddChapter(journey)}
                      className="px-5 py-2.5 rounded-xl bg-antique-gold text-heritage-dark font-bold text-xs hover:bg-antique-bright active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Plus aria-hidden="true" className="w-4 h-4" />
                      <span>Thêm chương đầu tiên</span>
                    </button>
                  )}
                </article>
              )}

              {/* ───────────────────────────────────────────────────────────────────
                  STATE: SUCCESS / DISPLAY CHAPTER NODES
                  ─────────────────────────────────────────────────────────────────── */}
              {!isLoadingPosts && displayedPosts.length > 0 && (
                <div className="flex items-start">
                  {displayedPosts.map((post, index) => {
                    const chapterNum = post.chapterOrder ?? (index + 1);
                    const hasAudio = Boolean(
                      post.shadowingAudioUrl ||
                      (post.audioTracks && post.audioTracks !== '[]') ||
                      post.paragraphs?.some((p) => p.audioTimestampStart !== undefined)
                    );
                    const hasQuiz = Boolean(post.questions && post.questions.length > 0);
                    const vocabCount = post.vocabularies?.length || 0;
                    const previewVocabs = post.vocabularies?.slice(0, 4) || [];
                    const remainingVocabs = vocabCount > 4 ? vocabCount - 4 : 0;

                    return (
                      <React.Fragment key={post.id}>
                        {/* Chapter Card Node */}
                        <article
                          className="w-88 sm:w-96 shrink-0 rounded-3xl border border-antique-gold/30 bg-warm-ivory dark:bg-heritage-forest/90 shadow-xl hover:shadow-2xl hover:border-antique-gold/70 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group select-none"
                          aria-label={`Chương ${chapterNum}: ${post.titleEn}`}
                        >
                          {/* Card Top Banner: Chapter Badge & CEFR & ReadTime */}
                          <div className="p-4 bg-rice-paper/90 dark:bg-heritage-dark border-b border-antique-gold/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-heritage-green text-antique-bright shadow-sm flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-antique-gold animate-pulse" />
                                <span>Chương {chapterNum}</span>
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCefrBadgeClass(
                                  post.level
                                )}`}
                              >
                                {post.level || 'B1'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[11px] font-medium text-text-muted">
                              <Clock aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                              <span>{post.readTime || '3 min'}</span>
                            </div>
                          </div>

                          {/* Card Image Thumbnail */}
                          <div className="relative aspect-video w-full bg-stone-200 dark:bg-stone-800 overflow-hidden border-b border-antique-gold/20">
                            {post.imageUrl ? (
                              <img
                                src={post.imageUrl}
                                alt={post.titleEn}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-antique-gold/10 text-antique-gold p-4 text-center">
                                <BookOpen aria-hidden="true" className="w-8 h-8 mb-1 opacity-50" />
                                <span className="text-[11px]">Chưa có ảnh bìa bài đọc</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-2 left-3 right-3 text-white flex items-center justify-between text-[11px]">
                              <span className="font-mono opacity-80">#{post.id.slice(0, 10)}</span>
                              <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] border border-white/20">
                                {post.wordCount || 300} từ
                              </span>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            {/* Title & Summary */}
                            <div className="space-y-1.5">
                              <h4 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright line-clamp-2 leading-snug">
                                {post.titleEn}
                              </h4>
                              {post.titleVi && (
                                <p className="text-xs text-text-secondary italic line-clamp-1">
                                  {post.titleVi}
                                </p>
                              )}
                              {post.summary && (
                                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed pt-1">
                                  {post.summary}
                                </p>
                              )}
                            </div>

                            {/* Readiness Checklist Box */}
                            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-antique-gold/20 space-y-2 text-xs">
                              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                Kiểm tra độ sẵn sàng bài học:
                              </div>

                              {/* Audio readiness */}
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-text-secondary">
                                  <Headphones aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                                  <span>Audio Shadowing</span>
                                </span>
                                {hasAudio ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />
                                    <span>Đã có audio</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
                                    <VolumeX aria-hidden="true" className="w-3.5 h-3.5" />
                                    <span>Chưa có</span>
                                  </span>
                                )}
                              </div>

                              {/* Quiz readiness */}
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-text-secondary">
                                  <HelpCircle aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                                  <span>Trắc nghiệm Quiz</span>
                                </span>
                                {hasQuiz ? (
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle2 aria-hidden="true" className="w-3.5 h-3.5" />
                                    <span>{post.questions?.length || 0} câu hỏi</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400">
                                    <AlertTriangle aria-hidden="true" className="w-3.5 h-3.5" />
                                    <span>Chưa có</span>
                                  </span>
                                )}
                              </div>

                              {/* Vocab readiness */}
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-text-secondary">
                                  <Bookmark aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                                  <span>Từ vựng trọng tâm</span>
                                </span>
                                <span className="font-semibold text-text-primary">
                                  {vocabCount} từ vựng
                                </span>
                              </div>
                            </div>

                            {/* Core Vocabularies Chips Preview */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] text-text-muted">
                                <span>Xem nhanh từ vựng:</span>
                                {vocabCount > 0 && onViewVocab && (
                                  <button
                                    type="button"
                                    onClick={() => onViewVocab(post)}
                                    className="text-antique-gold hover:text-antique-bright font-medium transition-colors cursor-pointer"
                                  >
                                    Chi tiết ({vocabCount})
                                  </button>
                                )}
                              </div>

                              {previewVocabs.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {previewVocabs.map((vocab, vIdx) => (
                                    <button
                                      key={vocab.id || vIdx}
                                      type="button"
                                      onClick={() => onViewVocab?.(post)}
                                      className="px-2 py-1 rounded-lg text-xs font-medium bg-antique-gold/15 text-heritage-green dark:text-antique-bright border border-antique-gold/30 hover:bg-antique-gold/30 hover:border-antique-gold transition-colors cursor-pointer text-left truncate max-w-[140px]"
                                      title={`${vocab.word}: ${vocab.viMeaning}`}
                                    >
                                      <span className="font-semibold">{vocab.word}</span>
                                    </button>
                                  ))}
                                  {remainingVocabs > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => onViewVocab?.(post)}
                                      className="px-2 py-1 rounded-lg text-xs font-bold bg-white/60 dark:bg-white/10 text-text-secondary border border-antique-gold/30 hover:bg-antique-gold/20 transition-colors cursor-pointer"
                                    >
                                      +{remainingVocabs} từ
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <p className="text-[11px] text-text-muted italic py-1">
                                  Chưa gắn từ vựng trọng tâm nào cho bài này.
                                </p>
                              )}
                            </div>

                            {/* Action Buttons Toolbar */}
                            <div className="pt-3 border-t border-antique-gold/20 grid grid-cols-2 gap-2">
                              {onViewVocab && (
                                <button
                                  type="button"
                                  onClick={() => onViewVocab(post)}
                                  className="py-2 px-3 rounded-xl bg-warm-ivory/80 dark:bg-white/5 border border-antique-gold/40 text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright hover:bg-antique-gold/15 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                  title="Xem ngân hàng từ vựng của bài đọc này"
                                >
                                  <BookOpen aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                                  <span>Từ vựng</span>
                                </button>
                              )}

                              {onSelectPost && (
                                <button
                                  type="button"
                                  onClick={() => onSelectPost(post)}
                                  className="py-2 px-3 rounded-xl bg-heritage-green text-warm-ivory hover:bg-heritage-dark text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                                  title="Mở trình soạn thảo bài đọc"
                                >
                                  <Edit3 aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                                  <span>Sửa bài</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </article>

                        {/* Visual Connector to next chapter */}
                        {index < displayedPosts.length - 1 && (
                          <div className="w-12 sm:w-16 self-center flex items-center justify-center shrink-0 relative px-1">
                            <div className="w-full h-0.5 bg-antique-gold/50 relative flex items-center justify-center">
                              <div className="absolute w-2.5 h-2.5 rounded-full bg-antique-gold/80 border border-warm-ivory dark:border-heritage-forest shadow-sm" />
                              <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold ml-2" />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* ───────────────────────────────────────────────────────────────────
                  NODE CUỐI: THẺ THÊM CHƯƠNG MỚI (+ Thêm bài vào lộ trình)
                  ─────────────────────────────────────────────────────────────────── */}
              {journey && onAddChapter && (
                <>
                  {displayedPosts.length > 0 && (
                    <div className="w-12 sm:w-16 self-center flex items-center justify-center shrink-0 relative px-1">
                      <div className="w-full h-0.5 bg-dashed border-t-2 border-dashed border-antique-gold/50 relative flex items-center justify-center">
                        <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                      </div>
                    </div>
                  )}

                  <article
                    className="w-72 sm:w-80 shrink-0 rounded-3xl border-2 border-dashed border-antique-gold/40 hover:border-antique-gold bg-antique-gold/5 dark:bg-white/5 hover:bg-antique-gold/15 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer group min-h-[460px] select-none"
                    onClick={() => onAddChapter(journey)}
                    aria-label="Thêm chương mới vào hành trình"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-antique-gold/20 border border-antique-gold/40 flex items-center justify-center text-antique-gold group-hover:scale-110 group-hover:bg-antique-gold group-hover:text-heritage-dark transition-all duration-300 shadow-md mb-4">
                      <Plus aria-hidden="true" className="w-8 h-8" />
                    </div>

                    <h4 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright group-hover:text-antique-gold transition-colors">
                      Thêm chương mới
                    </h4>

                    <p className="text-xs text-text-muted mt-2 max-w-xs leading-relaxed">
                      Gắn một bài đọc văn hóa có sẵn hoặc tạo bài học mới cho chặng số {sortedPosts.length + 1} của hành trình này.
                    </p>

                    <div className="mt-6">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-antique-gold text-heritage-dark font-bold text-xs group-hover:bg-antique-bright shadow-sm transition-all">
                        <Plus aria-hidden="true" className="w-4 h-4" />
                        <span>Tạo chương {sortedPosts.length + 1}</span>
                      </span>
                    </div>
                  </article>
                </>
              )}
            </div>
          </main>

          {/* ══════════════════════════════════════════════════════════════════════════
              FOOTER: Status Bar & Fast Navigation
              ══════════════════════════════════════════════════════════════════════════ */}
          <footer className="px-6 py-3 bg-rice-paper/95 dark:bg-heritage-dark border-t border-antique-gold/20 flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted shrink-0 select-none">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-text-secondary">
                Tổng thể lộ trình:
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{metrics.totalChapters} Chương học</span>
              </span>
              <span className="text-antique-gold/40">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{metrics.totalVocab} Từ vựng</span>
              </span>
              <span className="text-antique-gold/40">•</span>
              <span className="inline-flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    metrics.isFullyReady ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span>
                  {metrics.isFullyReady
                    ? 'Sẵn sàng phát hành 100%'
                    : 'Đang biên tập & hoàn thiện'}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-warm-ivory/80 dark:bg-white/5 border border-antique-gold/30 text-text-primary hover:bg-antique-gold/20 font-semibold transition-colors cursor-pointer"
              >
                Đóng bảng vẽ
              </button>
            </div>
          </footer>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
