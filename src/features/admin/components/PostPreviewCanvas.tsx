import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  BookOpen,
  Layers,
  Sparkles,
  Edit3,
  ExternalLink,
  X,
  Check,
  Type,
  Sun,
  Moon,
  ListOrdered,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import '@/features/reader/reader-design.css';
import '@/features/reader/reader-components.css';
import {
  AudioShadowingBar,
  BilingualReaderView,
} from '@/features/reader/components';
import {
  useSavedVocabulary,
  SavedVocabularyContext,
} from '@/features/reader/hooks/useSavedVocabulary';
import type {
  CefrLevel,
  ParagraphPairDto,
  VocabItemDto,
  QuizQuestionDto,
  AudioTrackDto,
} from '../types/adminTypes';
import { adminTopicLabel, adminRegionLabel } from '../admin-presentation';
import {
  adaptAdminPostToReaderData,
  mapCefrToReaderLevel,
} from '../utils/adminReaderAdapter';

export type CanvasViewportMode = 'desktop' | 'tablet' | 'mobile';
export type CanvasDisplayMode = 'reader' | 'card';
export type AdminPreviewMode = 'learner' | 'quick-edit';

export interface PostPreviewCanvasProps {
  titleEn: string;
  titleVi: string;
  topic: string;
  region: string;
  level: CefrLevel;
  readTime: string;
  imageUrl: string;
  shadowingAudioUrl: string;
  summary: string;
  journeyTitleEn?: string;
  chapterOrder?: number;
  paragraphs: ParagraphPairDto[];
  vocabularies: VocabItemDto[];
  questions: QuizQuestionDto[];
  voiceTracks: AudioTrackDto[];
  onFocusParagraphInForm?: (index: number) => void;
  onUpdateParagraph?: (index: number, enText: string, viText: string) => void;
}

export const PostPreviewCanvas: React.FC<PostPreviewCanvasProps> = ({
  titleEn,
  titleVi,
  topic,
  region,
  level,
  readTime,
  imageUrl,
  shadowingAudioUrl,
  summary,
  journeyTitleEn,
  chapterOrder,
  paragraphs,
  vocabularies,
  questions,
  voiceTracks,
  onFocusParagraphInForm,
  onUpdateParagraph,
}) => {
  // ── 1. Viewport & Display State ───────────────────────────────────────────
  const [viewport, setViewport] = useState<CanvasViewportMode>('desktop');
  const [displayMode, setDisplayMode] = useState<CanvasDisplayMode>('reader');
  const [adminMode, setAdminMode] = useState<AdminPreviewMode>('learner');
  const [fontSize, setFontSize] = useState<number>(17);
  const [themeMode, setThemeMode] = useState<'paper' | 'dark'>('paper');

  // ── 2. Quick Edit Admin State ─────────────────────────────────────────────
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftEn, setDraftEn] = useState<string>('');
  const [draftVi, setDraftVi] = useState<string>('');

  // ── 3. Interactive Quiz Local State ───────────────────────────────────────
  const [q1Answer, setQ1Answer] = useState<string>('');
  const [q2Answer, setQ2Answer] = useState<string>('');
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // ── 4. Audio Playback State & Handlers ────────────────────────────────────
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isRepeatLoop, setIsRepeatLoop] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Phân giải URL âm thanh khả dụng (từ bài viết hoặc voiceTracks)
  const currentAudioUrl = useMemo(() => {
    return (
      shadowingAudioUrl?.trim() ||
      voiceTracks?.[0]?.normalUrl?.trim() ||
      voiceTracks?.[0]?.slowUrl?.trim() ||
      ''
    );
  }, [shadowingAudioUrl, voiceTracks]);

  // Lắng nghe các sự kiện thẻ audio HTML5
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (isRepeatLoop) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        setIsPlaying(false);
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [isRepeatLoop, currentAudioUrl]);

  // Đồng bộ tốc độ phát âm thanh
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Đồng bộ trạng thái tắt tiếng
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Dừng phát khi đổi nguồn audio hoặc component unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, [currentAudioUrl]);

  const handleTogglePlay = () => {
    if (!audioRef.current || !currentAudioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn('Audio playback prevented:', err);
      });
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      audioRef.current.play().catch(() => {});
    }
  };

  // ── 5. Data Adaptation ────────────────────────────────────────────────────
  const readerLevel = useMemo(() => mapCefrToReaderLevel(level), [level]);

  const adaptedArticleData = useMemo(() => {
    return adaptAdminPostToReaderData({
      id: 'preview-draft',
      titleEn,
      titleVi,
      topic,
      region,
      level,
      readTime,
      imageUrl,
      shadowingAudioUrl: currentAudioUrl,
      summary,
      paragraphs,
      vocabularies,
      questions,
      voiceTracks,
    });
  }, [
    titleEn,
    titleVi,
    topic,
    region,
    level,
    readTime,
    imageUrl,
    currentAudioUrl,
    summary,
    paragraphs,
    vocabularies,
    questions,
    voiceTracks,
  ]);

  // Kho từ vựng đã lưu phục vụ InPlaceDictionaryPopup
  const savedVocabulary = useSavedVocabulary('preview-draft', readerLevel);

  // ── 6. Inline Edit Handlers ───────────────────────────────────────────────
  const startInlineEdit = (index: number, p: ParagraphPairDto) => {
    setEditingIndex(index);
    setDraftEn(p.enText || '');
    setDraftVi(p.viText || '');
  };

  const cancelInlineEdit = () => {
    setEditingIndex(null);
    setDraftEn('');
    setDraftVi('');
  };

  const saveInlineEdit = () => {
    if (editingIndex !== null && onUpdateParagraph) {
      onUpdateParagraph(editingIndex, draftEn, draftVi);
    }
    setEditingIndex(null);
  };

  // ── 7. Viewport Width Classes ─────────────────────────────────────────────
  const viewportWidthClass = {
    desktop: 'w-full max-w-[1380px]',
    tablet: 'w-full max-w-[768px]',
    mobile: 'w-full max-w-[390px]',
  }[viewport];

  return (
    <SavedVocabularyContext.Provider value={savedVocabulary}>
      <div className="flex flex-col h-full min-h-0 bg-stone-100 dark:bg-stone-900 border-l border-antique-gold/30">
        {/* Phần tử audio HTML5 ngầm */}
        <audio
          ref={audioRef}
          src={currentAudioUrl || undefined}
          preload="metadata"
        />

        {/* ── Canvas Control Toolbar ────────────────────────────────────────── */}
        <div className="px-4 py-2.5 bg-warm-ivory dark:bg-heritage-dark border-b border-antique-gold/30 flex flex-wrap items-center justify-between gap-2.5 shrink-0 shadow-xs z-30">
          {/* Cụm trái: Viewport Mode Switcher */}
          <div className="flex items-center gap-1 bg-white/70 dark:bg-white/10 p-1 rounded-xl border border-antique-gold/30">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewport === 'desktop'
                  ? 'bg-heritage-green text-warm-ivory shadow-xs'
                  : 'text-text-muted hover:text-heritage-green'
              }`}
              title="Khổ máy tính chuẩn Reader (1380px - Dual Paper)"
            >
              <Monitor aria-hidden="true" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewport === 'tablet'
                  ? 'bg-heritage-green text-warm-ivory shadow-xs'
                  : 'text-text-muted hover:text-heritage-green'
              }`}
              title="Khổ máy tính bảng (Tablet 768px)"
            >
              <Tablet aria-hidden="true" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewport === 'mobile'
                  ? 'bg-heritage-green text-warm-ivory shadow-xs'
                  : 'text-text-muted hover:text-heritage-green'
              }`}
              title="Khổ điện thoại (Mobile 390px)"
            >
              <Smartphone aria-hidden="true" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Cụm giữa: Chế độ hiển thị (Reader vs Thẻ Discovery) */}
          <div className="flex items-center gap-1 bg-white/70 dark:bg-white/10 p-1 rounded-xl border border-antique-gold/30">
            <button
              type="button"
              onClick={() => setDisplayMode('reader')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'reader'
                  ? 'bg-heritage-green text-warm-ivory shadow-xs'
                  : 'text-text-muted hover:text-heritage-green'
              }`}
              title="Xem giao diện đọc sách chuyên sâu y hệt Reader"
            >
              <BookOpen
                aria-hidden="true"
                className="w-3.5 h-3.5 text-antique-gold"
              />
              <span>Giao diện đọc</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('card')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                displayMode === 'card'
                  ? 'bg-heritage-green text-warm-ivory shadow-xs'
                  : 'text-text-muted hover:text-heritage-green'
              }`}
              title="Xem thẻ bài viết tại trang Khám phá"
            >
              <Layers
                aria-hidden="true"
                className="w-3.5 h-3.5 text-antique-gold"
              />
              <span>Thẻ khám phá</span>
            </button>
          </div>

          {/* Cụm phải: Admin Mode Toggle & Font/Theme Controls */}
          <div className="flex items-center gap-2">
            {/* Chế độ Admin Toggle: Học viên vs Biên tập nhanh */}
            {displayMode === 'reader' && (
              <div className="flex items-center gap-1 bg-white/70 dark:bg-white/10 p-1 rounded-xl border border-antique-gold/30 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAdminMode('learner')}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminMode === 'learner'
                      ? 'bg-heritage-green text-warm-ivory shadow-xs'
                      : 'text-text-muted hover:text-heritage-green'
                  }`}
                  title="Chế độ học viên: 100% giao diện thực tế của người học"
                >
                  <Eye aria-hidden="true" className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Trải nghiệm học viên</span>
                  <span className="md:hidden">Học viên</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminMode('quick-edit');
                    setIsInspectorOpen(true);
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminMode === 'quick-edit'
                      ? 'bg-antique-gold text-heritage-dark shadow-xs'
                      : 'text-text-muted hover:text-heritage-green'
                  }`}
                  title="Chế độ biên tập: Hiện thanh công cụ sửa nhanh đoạn văn và trỏ vào form"
                >
                  <Edit3 aria-hidden="true" className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Chế độ biên tập</span>
                  <span className="md:hidden">Sửa nhanh</span>
                </button>
              </div>
            )}

            {/* Điều khiển cỡ chữ & giao diện */}
            {displayMode === 'reader' && (
              <div className="hidden lg:flex items-center gap-1 bg-white/70 dark:bg-white/10 p-1 rounded-xl border border-antique-gold/30">
                <button
                  type="button"
                  onClick={() => setFontSize((f) => Math.max(14, f - 1))}
                  className="px-1.5 py-1 rounded text-xs font-bold text-text-muted hover:text-heritage-green cursor-pointer"
                  title="Giảm kích thước chữ"
                >
                  A-
                </button>
                <span className="text-[11px] font-bold text-text-muted px-1">
                  {fontSize}px
                </span>
                <button
                  type="button"
                  onClick={() => setFontSize((f) => Math.min(24, f + 1))}
                  className="px-1.5 py-1 rounded text-xs font-bold text-text-muted hover:text-heritage-green cursor-pointer"
                  title="Tăng kích thước chữ"
                >
                  A+
                </button>
                <div className="h-4 w-px bg-antique-gold/30 mx-0.5" />
                <button
                  type="button"
                  onClick={() =>
                    setThemeMode((t) => (t === 'paper' ? 'dark' : 'paper'))
                  }
                  className="p-1 rounded text-text-muted hover:text-heritage-green cursor-pointer"
                  title={
                    themeMode === 'paper'
                      ? 'Chuyển sang giao diện nền tối'
                      : 'Chuyển sang giao diện giấy cổ (Paper)'
                  }
                >
                  {themeMode === 'paper' ? (
                    <Moon aria-hidden="true" className="w-3.5 h-3.5" />
                  ) : (
                    <Sun
                      aria-hidden="true"
                      className="w-3.5 h-3.5 text-antique-gold"
                    />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Canvas Live Workspace ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 flex justify-center items-start">
          <div
            className={`${viewportWidthClass} transition-all duration-300 rounded-3xl border border-antique-gold/40 shadow-2xl overflow-hidden min-h-[550px] flex flex-col bg-white dark:bg-heritage-dark`}
          >
            {/* ════ CHẾ ĐỘ 1: THẺ DISCOVERY CARD ════ */}
            {displayMode === 'card' ? (
              <div className="p-6 space-y-4 bg-warm-ivory/60 dark:bg-stone-900/60">
                <div className="text-center pb-2 border-b border-antique-gold/20 text-xs font-bold text-text-muted uppercase tracking-wider">
                  Góc nhìn người dùng tại trang Khám phá (/discovery)
                </div>
                <article className="max-w-md mx-auto rounded-3xl overflow-hidden bg-warm-ivory dark:bg-white/5 border border-antique-gold/30 shadow-md">
                  <div className="aspect-video w-full relative bg-stone-200 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-2">
                        <BookOpen
                          aria-hidden="true"
                          className="w-8 h-8 text-antique-gold"
                        />
                        <span className="text-xs">
                          {adminTopicLabel(topic)}
                        </span>
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-warm-ivory backdrop-blur-xs">
                      {level}
                    </span>
                    {journeyTitleEn && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold text-heritage-dark shadow-sm">
                        Chặng {chapterOrder || 1}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-antique-gold font-bold">
                      <span>{adminTopicLabel(topic)}</span>
                      <span className="text-text-muted">
                        {adminRegionLabel(region)}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-heritage-green dark:text-warm-ivory line-clamp-2">
                      {titleEn || 'Tiêu đề tiếng Anh chưa nhập'}
                    </h3>
                    <p className="text-xs text-text-muted italic line-clamp-1">
                      {titleVi || 'Tiêu đề tiếng Việt chưa nhập'}
                    </p>
                    <p className="text-xs text-text-body dark:text-warm-ivory/80 line-clamp-3 leading-relaxed">
                      {summary ||
                        paragraphs[0]?.enText?.slice(0, 140) ||
                        'Chưa có mô tả tóm tắt.'}
                    </p>
                    <div className="pt-3 border-t border-antique-gold/20 flex items-center justify-between text-xs text-text-muted">
                      <span>{readTime || '3 phút đọc'}</span>
                      <span>{paragraphs.length} đoạn văn</span>
                    </div>
                  </div>
                </article>
              </div>
            ) : (
              /* ════ CHẾ ĐỘ 2: TRẢI NGHIỆM ĐỌC CHI TIẾT (READER DUAL-PAPER CANVAS) ════ */
              <div
                className="reader-desk w-full flex-1 flex flex-col items-center min-h-[600px]"
                data-desk-theme={themeMode}
              >
                <section className="reader-desk-canvas w-full">
                  <div className="reader-desk-content">
                    {/* Ghi chú lề sách phong cách Heritage cổ điển */}
                    <aside
                      className="reader-margin-note reader-margin-note-left"
                      aria-hidden="true"
                    >
                      Rooted
                      <br />
                      in
                      <br />
                      heritage
                    </aside>
                    <aside
                      className="reader-margin-note reader-margin-note-right"
                      aria-hidden="true"
                    >
                      Vietnamese
                      <br />
                      culture
                      <br />
                      a brighter
                      <br />
                      tomorrow
                    </aside>

                    {/* Khối nghe và luyện phát âm Audio Shadowing Bar */}
                    <section
                      id="reader-audio"
                      className="reader-audio-section"
                      aria-labelledby="reader-audio-title"
                    >
                      <h2
                        id="reader-audio-title"
                        className="mb-3 font-sans text-lg font-semibold text-ink dark:text-warm-ivory"
                      >
                        Nghe và luyện phát âm (Listen & Practice)
                      </h2>
                      {!currentAudioUrl ? (
                        <div className="p-4 rounded-xl border border-dashed border-antique-gold/40 bg-warm-ivory/60 dark:bg-white/5 text-xs text-text-muted flex items-center justify-between">
                          <span>
                            Chưa có file âm thanh cho bài viết này. Hãy thêm
                            liên kết audio hoặc tạo voice track ở cột bên trái để
                            nghe thực tế.
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright shrink-0">
                            Chưa có âm thanh
                          </span>
                        </div>
                      ) : (
                        <AudioShadowingBar
                          articleTitle={adaptedArticleData.titleEn}
                          isPlaying={isPlaying}
                          onTogglePlay={handleTogglePlay}
                          playbackSpeed={playbackSpeed}
                          onChangeSpeed={(speed: number) =>
                            setPlaybackSpeed(speed)
                          }
                          isRepeatLoop={isRepeatLoop}
                          onToggleRepeatLoop={() =>
                            setIsRepeatLoop(!isRepeatLoop)
                          }
                          themeMode={themeMode}
                          selectedLevel={readerLevel}
                          currentTime={currentTime}
                          duration={duration}
                          onSeek={handleSeek}
                          onRestart={handleRestart}
                          isMuted={isMuted}
                          onToggleMute={() => setIsMuted(!isMuted)}
                          selectedVoiceName={
                            voiceTracks[0]?.voiceName || 'Bản chuẩn'
                          }
                          audioScope="full"
                        />
                      )}
                    </section>

                    {/* Bố cục đọc song ngữ chuẩn BilingualReaderView */}
                    <BilingualReaderView
                      themeMode={themeMode}
                      fontSize={fontSize}
                      vocabBtnClass={
                        themeMode === 'dark'
                          ? 'ink-underline border-b-2 border-dashed border-antique-gold bg-antique-gold/30 font-semibold text-antique-gold hover:bg-antique-gold/45 px-1 rounded transition-colors cursor-pointer shadow-xs focus-ring-dark'
                          : 'ink-underline border-b-2 border-dashed border-antique-gold bg-antique-gold/15 font-semibold text-heritage-green px-1 rounded hover:bg-antique-gold/30 transition-colors cursor-pointer focus-ring'
                      }
                      bottomCardBgClass={
                        themeMode === 'dark'
                          ? 'bg-[#1E2925] text-warm-ivory border-antique-gold/30 shadow-xl'
                          : 'bg-warm-ivory text-ink-soft border-heritage-green/12 shadow-xl'
                      }
                      openVocab={() => {}}
                      q1Answer={q1Answer}
                      setQ1Answer={setQ1Answer}
                      q2Answer={q2Answer}
                      setQ2Answer={setQ2Answer}
                      quizSubmitted={quizSubmitted}
                      setQuizSubmitted={setQuizSubmitted}
                      selectedLevel={readerLevel}
                      onChangeLevel={undefined}
                      articleData={adaptedArticleData}
                      onStartPractice={() => {}}
                      onOpenSealModal={() => {}}
                    />
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>

        {/* ── Bảng điều khiển Biên tập viên (Quick Edit Inspector) ──────────── */}
        {adminMode === 'quick-edit' && displayMode === 'reader' && (
          <aside className="border-t border-antique-gold/30 bg-warm-ivory dark:bg-heritage-dark shadow-2xl z-20 shrink-0">
            <div className="px-4 py-2 flex items-center justify-between border-b border-antique-gold/20">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  aria-hidden="true"
                  className="w-4 h-4 text-antique-gold"
                />
                <span className="text-xs font-bold text-heritage-green dark:text-antique-bright">
                  Bảng công cụ Biên tập nhanh ({paragraphs.length} đoạn văn)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                className="text-xs font-bold text-antique-gold hover:underline cursor-pointer"
              >
                {isInspectorOpen ? 'Thu gọn' : 'Mở rộng'}
              </button>
            </div>

            {isInspectorOpen && (
              <div className="max-h-56 overflow-y-auto p-3 space-y-2">
                {paragraphs.length === 0 ? (
                  <div className="text-xs text-text-muted italic text-center py-3">
                    Chưa có đoạn văn nào trong bài viết.
                  </div>
                ) : (
                  paragraphs.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-antique-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-antique-gold/60 transition-colors"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-heritage-green text-warm-ivory text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-serif font-bold text-text-body dark:text-warm-ivory truncate">
                            {p.enText || '(Đoạn tiếng Anh trống)'}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted italic truncate pl-7">
                          {p.viText || '(Chưa có bản dịch tiếng Việt)'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        {onFocusParagraphInForm && (
                          <button
                            type="button"
                            onClick={() => onFocusParagraphInForm(idx)}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 text-[11px] font-bold text-text-body dark:text-warm-ivory flex items-center gap-1 cursor-pointer transition-colors"
                            title="Chuyển tới đoạn văn này ở biểu mẫu biên soạn"
                          >
                            <ExternalLink
                              aria-hidden="true"
                              className="w-3 h-3 text-antique-gold"
                            />
                            <span>Trỏ vào Form</span>
                          </button>
                        )}
                        {onUpdateParagraph && (
                          <button
                            type="button"
                            onClick={() => startInlineEdit(idx, p)}
                            className="px-2.5 py-1 rounded-lg bg-antique-gold/20 hover:bg-antique-gold/40 text-[11px] font-bold text-heritage-dark dark:text-antique-bright flex items-center gap-1 cursor-pointer transition-colors"
                            title="Sửa nhanh đoạn văn này ngay trên Canvas"
                          >
                            <Edit3 aria-hidden="true" className="w-3 h-3" />
                            <span>Sửa nhanh</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </aside>
        )}

        {/* ── Dialog Sửa Nhanh Đoạn Văn (Quick Edit Modal) ─────────────────── */}
        {editingIndex !== null && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl bg-warm-ivory dark:bg-stone-900 border border-antique-gold/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-5 py-3.5 bg-heritage-green text-warm-ivory flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3
                    aria-hidden="true"
                    className="w-4 h-4 text-antique-gold"
                  />
                  <h3 className="font-heading font-bold text-sm">
                    Sửa nhanh Đoạn {editingIndex + 1}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={cancelInlineEdit}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-warm-ivory"
                  aria-label="Đóng hộp thoại"
                >
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-heritage-green dark:text-antique-gold uppercase tracking-wider">
                    Tiếng Anh (Original EN)
                  </label>
                  <textarea
                    rows={4}
                    value={draftEn}
                    onChange={(e) => setDraftEn(e.target.value)}
                    className="w-full p-3 rounded-xl border border-antique-gold/40 bg-white dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold leading-relaxed"
                    placeholder="Nhập nội dung tiếng Anh..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-heritage-green dark:text-antique-gold uppercase tracking-wider">
                    Tiếng Việt (Translation VI)
                  </label>
                  <textarea
                    rows={4}
                    value={draftVi}
                    onChange={(e) => setDraftVi(e.target.value)}
                    className="w-full p-3 rounded-xl border border-antique-gold/40 bg-white dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold leading-relaxed"
                    placeholder="Nhập bản dịch tiếng Việt..."
                  />
                </div>
              </div>

              <div className="px-5 py-3 bg-stone-100 dark:bg-stone-800/60 border-t border-antique-gold/20 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={cancelInlineEdit}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-text-muted hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={saveInlineEdit}
                  className="px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Check
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-antique-gold"
                  />
                  <span>Lưu vào bài viết</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SavedVocabularyContext.Provider>
  );
};
