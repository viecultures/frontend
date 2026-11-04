import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  BookOpen,
  Layers,
  Sparkles,
  Sun,
  Moon,
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
}) => {
  // ── 1. Viewport & Display State ───────────────────────────────────────────
  const [viewport, setViewport] = useState<CanvasViewportMode>('desktop');
  const [displayMode, setDisplayMode] = useState<CanvasDisplayMode>('reader');
  const [fontSize, setFontSize] = useState<number>(17);
  const [themeMode, setThemeMode] = useState<'paper' | 'dark'>('paper');

  // ── 2. Interactive Quiz Local State ───────────────────────────────────────
  const [q1Answer, setQ1Answer] = useState<string>('');
  const [q2Answer, setQ2Answer] = useState<string>('');
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // ── 3. Audio Playback State & Handlers ────────────────────────────────────
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

  // ── 6. Viewport Width Classes ─────────────────────────────────────────────
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

          {/* Cụm phải: Font & Theme Controls */}
          <div className="flex items-center gap-2">
            {/* Điều khiển cỡ chữ & giao diện */}
            {displayMode === 'reader' && (
              <div className="flex items-center gap-1 bg-white/70 dark:bg-white/10 p-1 rounded-xl border border-antique-gold/30">
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
                data-canvas-viewport={viewport}
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
      </div>
    </SavedVocabularyContext.Provider>
  );
};
