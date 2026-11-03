import React, { useState, useMemo } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  BookOpen,
  Layers,
  Volume2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Edit3,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';
import type {
  CefrLevel,
  ParagraphPairDto,
  VocabItemDto,
  QuizQuestionDto,
  QuizOptionDto,
  AudioTrackDto,
} from '../types/adminTypes';
import { adminTopicLabel, adminRegionLabel } from '../admin-presentation';

export type CanvasViewportMode = 'desktop' | 'tablet' | 'mobile';
export type CanvasBilingualMode = 'side-by-side' | 'interleaved' | 'en' | 'vi';
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
  onFocusParagraphInForm,
  onUpdateParagraph,
}) => {
  const [viewport, setViewport] = useState<CanvasViewportMode>('desktop');
  const [displayMode, setDisplayMode] = useState<CanvasDisplayMode>('reader');
  const [bilingualMode, setBilingualMode] = useState<CanvasBilingualMode>('side-by-side');

  // Inline editing state on canvas
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftEn, setDraftEn] = useState<string>('');
  const [draftVi, setDraftVi] = useState<string>('');

  // Interactive Quiz state on canvas
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // Active vocabulary popover word
  const [activeVocabWord, setActiveVocabWord] = useState<VocabItemDto | null>(null);

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

  const saveInlineEdit = (index: number) => {
    if (onUpdateParagraph) {
      onUpdateParagraph(index, draftEn, draftVi);
    }
    setEditingIndex(null);
  };

  // Build lookup dictionary for highlighting vocabulary in English text
  const vocabMap = useMemo(() => {
    const map = new Map<string, VocabItemDto>();
    vocabularies.forEach((v) => {
      if (v.word?.trim()) {
        map.set(v.word.trim().toLowerCase(), v);
      }
    });
    return map;
  }, [vocabularies]);

  // Render text with interactive highlighted vocabulary words
  const renderInteractiveEnglishText = (text: string) => {
    if (!text) return <span className="text-text-muted italic">Đoạn văn tiếng Anh trống...</span>;
    if (vocabMap.size === 0) return <span>{text}</span>;

    const words = text.split(/(\s+|[.,!?;:()"])/);
    return (
      <span>
        {words.map((chunk, idx) => {
          const clean = chunk.trim().toLowerCase().replace(/^[.,!?;:()"]+|[.,!?;:()"]+$/g, '');
          const matchedVocab = clean ? vocabMap.get(clean) : undefined;

          if (matchedVocab) {
            return (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveVocabWord(matchedVocab);
                }}
                className="inline-block px-1 py-0.5 rounded bg-antique-gold/25 text-heritage-green dark:text-antique-bright font-semibold underline decoration-antique-gold/60 cursor-pointer hover:bg-antique-gold/40 transition-colors"
                title={`${matchedVocab.word} (${matchedVocab.level || 'B1'}): ${matchedVocab.viMeaning || ''}`}
              >
                {chunk}
              </span>
            );
          }
          return <span key={idx}>{chunk}</span>;
        })}
      </span>
    );
  };

  const viewportWidthClass = {
    desktop: 'w-full max-w-3xl',
    tablet: 'w-full max-w-[620px]',
    mobile: 'w-full max-w-[375px]',
  }[viewport];

  return (
    <div className="flex flex-col h-full min-h-0 bg-stone-100 dark:bg-stone-900 border-l border-antique-gold/30">
      {/* ── Canvas Control Toolbar ────────────────────────────────────────── */}
      <div className="px-4 py-2.5 bg-warm-ivory dark:bg-heritage-dark border-b border-antique-gold/30 flex flex-wrap items-center justify-between gap-2.5 shrink-0 shadow-xs">
        {/* Left: Viewport Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/70 dark:bg-white/10 p-1 rounded-xl border border-antique-gold/30">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-muted hover:text-heritage-green'
            }`}
            title="Xem theo khổ máy tính (Desktop)"
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
            title="Xem theo máy tính bảng (Tablet 620px)"
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
            title="Xem theo điện thoại (Mobile 375px)"
          >
            <Smartphone aria-hidden="true" className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Middle: Display Mode (Reader vs Card) */}
        <div className="flex items-center gap-1 bg-white/70 dark:bg-white/10 p-1 rounded-xl border border-antique-gold/30">
          <button
            type="button"
            onClick={() => setDisplayMode('reader')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              displayMode === 'reader'
                ? 'bg-heritage-green text-warm-ivory shadow-xs'
                : 'text-text-muted hover:text-heritage-green'
            }`}
          >
            <BookOpen aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
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
          >
            <Layers aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
            <span>Thẻ khám phá</span>
          </button>
        </div>

        {/* Right: Bilingual Presentation Switcher (in Reader Mode) */}
        {displayMode === 'reader' && (
          <div className="flex items-center gap-1 bg-white/70 dark:bg-white/10 p-1 rounded-xl border border-antique-gold/30 text-[11px]">
            <button
              type="button"
              onClick={() => setBilingualMode('side-by-side')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                bilingualMode === 'side-by-side'
                  ? 'bg-antique-gold text-heritage-dark shadow-xs'
                  : 'text-text-muted'
              }`}
              title="Song ngữ song song 2 cột"
            >
              Song song
            </button>
            <button
              type="button"
              onClick={() => setBilingualMode('interleaved')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                bilingualMode === 'interleaved'
                  ? 'bg-antique-gold text-heritage-dark shadow-xs'
                  : 'text-text-muted'
              }`}
              title="Xen kẽ dòng EN rồi VI"
            >
              Xen kẽ
            </button>
            <button
              type="button"
              onClick={() => setBilingualMode('en')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                bilingualMode === 'en'
                  ? 'bg-antique-gold text-heritage-dark shadow-xs'
                  : 'text-text-muted'
              }`}
              title="Chỉ tiếng Anh"
            >
              Chỉ EN
            </button>
            <button
              type="button"
              onClick={() => setBilingualMode('vi')}
              className={`px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer ${
                bilingualMode === 'vi'
                  ? 'bg-antique-gold text-heritage-dark shadow-xs'
                  : 'text-text-muted'
              }`}
              title="Chỉ tiếng Việt"
            >
              Chỉ VI
            </button>
          </div>
        )}
      </div>

      {/* ── Active Vocab Floating Toast / Popup ─────────────────────────── */}
      {activeVocabWord && (
        <div className="mx-4 mt-3 p-3 rounded-2xl bg-antique-gold text-heritage-dark shadow-lg flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-sm tracking-wide">
                {activeVocabWord.word}
              </span>
              {activeVocabWord.ipa && (
                <span className="text-xs font-mono opacity-80">/{activeVocabWord.ipa}/</span>
              )}
              {activeVocabWord.level && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-heritage-green text-warm-ivory">
                  {activeVocabWord.level}
                </span>
              )}
            </div>
            <div className="text-xs font-semibold">
              {activeVocabWord.viMeaning || 'Chưa có nghĩa tiếng Việt.'}
            </div>
            {(activeVocabWord.usageNote || activeVocabWord.contextSentence) && (
              <div className="text-[11px] opacity-90 italic">
                {activeVocabWord.usageNote || activeVocabWord.contextSentence}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setActiveVocabWord(null)}
            className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Đóng popup từ vựng"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Canvas Live Viewport Workspace ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start">
        <div
          className={`${viewportWidthClass} transition-all duration-300 bg-rice-paper dark:bg-heritage-dark rounded-3xl border border-antique-gold/40 shadow-xl overflow-hidden min-h-[500px] flex flex-col`}
        >
          {/* ════ CHẾ ĐỘ 1: THẺ DISCOVERY CARD ════ */}
          {displayMode === 'card' ? (
            <div className="p-6 space-y-4">
              <div className="text-center pb-2 border-b border-antique-gold/20 text-xs font-bold text-text-muted uppercase tracking-wider">
                Góc nhìn người dùng tại trang Khám phá (/discovery)
              </div>
              <article className="max-w-md mx-auto rounded-3xl overflow-hidden bg-warm-ivory dark:bg-white/5 border border-antique-gold/30 shadow-md">
                <div className="aspect-video w-full relative bg-stone-200 overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-2">
                      <BookOpen aria-hidden="true" className="w-8 h-8 text-antique-gold" />
                      <span className="text-xs">{adminTopicLabel(topic)}</span>
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
                    <span className="text-text-muted">{adminRegionLabel(region)}</span>
                  </div>
                  <h3 className="font-heading font-bold text-base text-heritage-green dark:text-warm-ivory line-clamp-2">
                    {titleEn || 'Tiêu đề tiếng Anh chưa nhập'}
                  </h3>
                  <p className="text-xs text-text-muted italic line-clamp-1">
                    {titleVi || 'Tiêu đề tiếng Việt chưa nhập'}
                  </p>
                  <p className="text-xs text-text-body dark:text-warm-ivory/80 line-clamp-3 leading-relaxed">
                    {summary || paragraphs[0]?.enText?.slice(0, 140) || 'Chưa có mô tả tóm tắt.'}
                  </p>
                  <div className="pt-3 border-t border-antique-gold/20 flex items-center justify-between text-xs text-text-muted">
                    <span>{readTime || '3 phút đọc'}</span>
                    <span>{paragraphs.length} đoạn văn</span>
                  </div>
                </div>
              </article>
            </div>
          ) : (
            /* ════ CHẾ ĐỘ 2: TRẢI NGHIỆM ĐỌC CHI TIẾT (READER CANVAS) ════ */
            <div className="p-5 sm:p-7 space-y-6 flex-1">
              {/* Cover Banner */}
              <div className="relative aspect-21/9 w-full rounded-2xl overflow-hidden border border-antique-gold/30 bg-stone-200">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-warm-ivory dark:bg-white/5">
                    <BookOpen aria-hidden="true" className="w-10 h-10 text-antique-gold" />
                    <span className="text-xs mt-1">Chưa có ảnh bìa</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 sm:p-5">
                  <div className="text-warm-ivory space-y-1.5 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-antique-gold text-heritage-dark shadow-xs">
                        {adminTopicLabel(topic)} · {adminRegionLabel(region)}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 backdrop-blur-xs text-warm-ivory border border-white/30">
                        CEFR {level}
                      </span>
                      {journeyTitleEn && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-heritage-green text-warm-ivory border border-antique-gold/40">
                          Chặng {chapterOrder || 1}: {journeyTitleEn}
                        </span>
                      )}
                    </div>
                    <h1 className="text-base sm:text-xl font-heading font-bold text-white tracking-wide">
                      {titleEn || 'Tiêu đề bài viết (EN)'}
                    </h1>
                    {titleVi && (
                      <p className="text-xs sm:text-sm text-warm-ivory/80 italic font-serif">
                        {titleVi}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Audio Shadowing Player Bar */}
              {(shadowingAudioUrl || voiceTracks.length > 0) && (
                <div className="p-3.5 rounded-2xl bg-antique-gold/15 border border-antique-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-heritage-green text-warm-ivory flex items-center justify-center shrink-0">
                      <Volume2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-heritage-green dark:text-antique-bright truncate">
                        Audio Shadowing ({voiceTracks.length > 0 ? `${voiceTracks.length} giọng đọc` : 'Bản chuẩn'})
                      </div>
                      <div className="text-[10px] text-text-muted truncate">
                        {shadowingAudioUrl || voiceTracks[0]?.normalUrl || voiceTracks[0]?.slowUrl}
                      </div>
                    </div>
                  </div>
                  {shadowingAudioUrl && (
                    <audio controls src={shadowingAudioUrl} className="h-8 max-w-full sm:max-w-[200px]" />
                  )}
                </div>
              )}

              {/* Summary Lead */}
              {summary && (
                <div className="p-4 rounded-2xl bg-warm-ivory dark:bg-white/5 border border-antique-gold/20 text-xs text-text-body dark:text-warm-ivory italic leading-relaxed">
                  <span className="font-bold text-heritage-green dark:text-antique-gold not-italic">Tóm tắt: </span>
                  {summary}
                </div>
              )}

              {/* Paragraphs Bilingual Content */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-antique-gold/20 pb-2">
                  <h2 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2">
                    <BookOpen aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Nội dung bài học song ngữ ({paragraphs.length} đoạn)</span>
                  </h2>
                  <span className="text-[11px] text-text-muted font-medium">
                    {readTime || '3 phút đọc'}
                  </span>
                </div>

                {paragraphs.length === 0 ? (
                  <div className="py-12 text-center rounded-2xl border-2 border-dashed border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 space-y-2">
                    <Sparkles aria-hidden="true" className="w-8 h-8 text-antique-gold mx-auto" />
                    <p className="text-xs font-bold text-text-body dark:text-warm-ivory">
                      Chưa có đoạn văn nào được thêm.
                    </p>
                    <p className="text-[11px] text-text-muted">
                      Nhập đoạn văn song ngữ ở cột bên trái để thấy bài viết hiển thị trực tiếp tại đây.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paragraphs.map((p, idx) => {
                      const isEditingThis = editingIndex === idx;

                      return (
                        <div
                          key={idx}
                          className="group relative p-4 rounded-2xl bg-warm-ivory/80 dark:bg-white/5 border border-antique-gold/20 hover:border-antique-gold/60 transition-all space-y-2.5"
                        >
                          {/* Paragraph Header with Quick Action Bar */}
                          <div className="flex items-center justify-between text-[11px] text-text-muted border-b border-antique-gold/10 pb-1.5">
                            <span className="font-bold text-heritage-green dark:text-antique-gold">
                              Đoạn {idx + 1}
                            </span>
                            <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                              {onFocusParagraphInForm && (
                                <button
                                  type="button"
                                  onClick={() => onFocusParagraphInForm(idx)}
                                  className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 border border-antique-gold/30 hover:border-antique-gold text-[10px] font-bold text-text-body dark:text-warm-ivory flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Chuyển sang tab chỉnh sửa chi tiết ở cột trái"
                                >
                                  <ExternalLink aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                                  <span>Trỏ vào Form</span>
                                </button>
                              )}
                              {onUpdateParagraph && !isEditingThis && (
                                <button
                                  type="button"
                                  onClick={() => startInlineEdit(idx, p)}
                                  className="px-2 py-0.5 rounded-md bg-antique-gold/20 hover:bg-antique-gold/40 border border-antique-gold/40 text-[10px] font-bold text-heritage-dark dark:text-antique-bright flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Chỉnh sửa trực tiếp ngay trên Canvas"
                                >
                                  <Edit3 aria-hidden="true" className="w-3 h-3" />
                                  <span>Sửa nhanh</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Paragraph Content (View mode vs Inline Edit mode) */}
                          {isEditingThis ? (
                            <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                              <div>
                                <label className="block text-[10px] font-bold text-heritage-green dark:text-warm-ivory uppercase">
                                  Tiếng Anh (EN)
                                </label>
                                <textarea
                                  rows={3}
                                  value={draftEn}
                                  onChange={(e) => setDraftEn(e.target.value)}
                                  className="w-full p-2.5 rounded-xl border border-antique-gold/40 bg-white dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-heritage-green dark:text-warm-ivory uppercase">
                                  Tiếng Việt (VI)
                                </label>
                                <textarea
                                  rows={3}
                                  value={draftVi}
                                  onChange={(e) => setDraftVi(e.target.value)}
                                  className="w-full p-2.5 rounded-xl border border-antique-gold/40 bg-white dark:bg-stone-800 text-xs text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                                />
                              </div>
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={cancelInlineEdit}
                                  className="px-3 py-1 rounded-lg text-xs font-bold text-text-muted hover:bg-black/10 transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <X aria-hidden="true" className="w-3.5 h-3.5" />
                                  <span>Hủy</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveInlineEdit(idx)}
                                  className="px-3 py-1 rounded-lg bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                                >
                                  <Check aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                                  <span>Lưu vào bài</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Regular Display Layout based on bilingualMode */
                            <div className="space-y-2">
                              {bilingualMode === 'side-by-side' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="text-sm font-serif leading-relaxed text-text-body dark:text-warm-ivory">
                                    {renderInteractiveEnglishText(p.enText)}
                                  </div>
                                  <div className="text-xs font-sans leading-relaxed text-text-secondary dark:text-warm-ivory/80 italic md:border-l md:border-antique-gold/20 md:pl-3">
                                    {p.viText || <span className="text-text-muted">Chưa có bản dịch...</span>}
                                  </div>
                                </div>
                              ) : bilingualMode === 'interleaved' ? (
                                <div className="space-y-1.5">
                                  <div className="text-sm font-serif leading-relaxed text-text-body dark:text-warm-ivory">
                                    {renderInteractiveEnglishText(p.enText)}
                                  </div>
                                  <div className="text-xs font-sans leading-relaxed text-text-secondary dark:text-warm-ivory/80 italic border-t border-antique-gold/15 pt-1.5">
                                    {p.viText || <span className="text-text-muted">Chưa có bản dịch...</span>}
                                  </div>
                                </div>
                              ) : bilingualMode === 'en' ? (
                                <div className="text-sm font-serif leading-relaxed text-text-body dark:text-warm-ivory">
                                  {renderInteractiveEnglishText(p.enText)}
                                </div>
                              ) : (
                                <div className="text-xs font-sans leading-relaxed text-text-body dark:text-warm-ivory italic">
                                  {p.viText || <span className="text-text-muted">Chưa có bản dịch...</span>}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Key Vocabularies Section */}
              {vocabularies.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-antique-gold/30">
                  <h2 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2">
                    <Sparkles aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Từ vựng trọng tâm ({vocabularies.length} từ)</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {vocabularies.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-warm-ivory dark:bg-white/5 border border-antique-gold/20 space-y-1 hover:border-antique-gold/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-xs text-heritage-green dark:text-warm-ivory">
                            {v.word}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright">
                            {v.level || 'B1'}
                          </span>
                        </div>
                        {v.ipa && (
                          <div className="text-[10px] text-text-muted font-mono">
                            /{v.ipa}/
                          </div>
                        )}
                        <div className="text-xs text-text-secondary font-medium">
                          {v.viMeaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Comprehension Quiz Section */}
              {questions.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-antique-gold/30">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright flex items-center gap-2">
                      <HelpCircle aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                      <span>Thử nghiệm câu hỏi ôn tập ({questions.length} câu)</span>
                    </h2>
                    <span className="text-[10px] text-text-muted italic">
                      Click chọn để test tính đúng/sai
                    </span>
                  </div>

                  <div className="space-y-4">
                    {questions.map((q, qIdx) => {
                      const selectedOptIdx = quizAnswers[qIdx];
                      return (
                        <div
                          key={qIdx}
                          className="p-4 rounded-2xl bg-warm-ivory dark:bg-white/5 border border-antique-gold/20 space-y-3"
                        >
                          <div className="text-xs font-bold text-text-body dark:text-warm-ivory flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-heritage-green text-warm-ivory flex items-center justify-center text-[10px] shrink-0 font-heading">
                              {qIdx + 1}
                            </span>
                            <span>{q.question}</span>
                          </div>

                          <div className="space-y-1.5 pl-7">
                            {(Array.isArray(q.options) ? (q.options as QuizOptionDto[]) : []).map((opt: QuizOptionDto, oIdx: number) => {
                              const optKey = opt.key || String.fromCharCode(65 + oIdx);
                              const isSelected = selectedOptIdx === oIdx;
                              const isCorrect = q.correctKey === optKey;

                              let btnStyle =
                                'bg-white/60 dark:bg-stone-800/60 border-antique-gold/20 text-text-body dark:text-warm-ivory hover:border-antique-gold';
                              if (isSelected) {
                                if (isCorrect) {
                                  btnStyle =
                                    'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                                } else {
                                  btnStyle =
                                    'bg-rose-100 dark:bg-rose-900/40 border-rose-500 text-rose-900 dark:text-rose-200';
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() =>
                                    setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                                  }
                                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                >
                                  <span>
                                    <span className="font-bold mr-2">
                                      {optKey}.
                                    </span>
                                    {opt.text}
                                  </span>
                                  {isSelected &&
                                    (isCorrect ? (
                                      <CheckCircle2
                                        aria-hidden="true"
                                        className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0"
                                      />
                                    ) : (
                                      <XCircle
                                        aria-hidden="true"
                                        className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0"
                                      />
                                    ))}
                                </button>
                              );
                            })}
                          </div>

                          {selectedOptIdx !== undefined && q.explanation && (
                            <div className="ml-7 p-2.5 rounded-xl bg-antique-gold/15 border border-antique-gold/30 text-[11px] text-text-secondary leading-relaxed flex items-start gap-1.5">
                              <Info aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold shrink-0 mt-0.5" />
                              <span>{q.explanation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
