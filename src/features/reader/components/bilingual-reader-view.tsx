import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import Link from "@/components/Link";

import { CheckCircle2, Headphones, PenTool, ChevronLeft, ChevronRight, RefreshCw, Sparkles, BookOpen, Award } from "lucide-react";
import { READER_QUIZ_QUESTIONS } from "@/data/readerData";
import { paths } from "@/routes/paths";

import { InPlaceDictionaryPopup } from "./InPlaceDictionaryPopup";
import type { ReaderArticleData } from "../services/readerApiService";
import { useReaderDictionary } from "../hooks/useReaderDictionary";
import { ReaderArticleContent } from './ReaderArticleContent';
import { BilingualParagraphPairList } from './BilingualParagraphPairList';
import { ReaderLotus } from './ReaderLotus';
import type { PracticeMode } from '../lib/readerPractice';
import { useReadingBookmark } from '../hooks/useReadingBookmark';

interface BilingualReaderViewProps {
  themeMode: "paper" | "dark";
  fontSize: number;
  vocabBtnClass: string;
  bottomCardBgClass: string;
  openVocab: (key: string) => void;
  q1Answer: string;
  setQ1Answer: (val: string) => void;
  q2Answer: string;
  setQ2Answer: (val: string) => void;
  quizSubmitted: boolean;
  setQuizSubmitted: (val: boolean) => void;
  selectedLevel?: "Level 1" | "Level 2" | "Level 3";
  onChangeLevel?: (lvl: "Level 1" | "Level 2" | "Level 3") => void;
  articleData?: ReaderArticleData | null;
  onStartPractice: (mode?: PracticeMode) => void;
  activeParagraphIndex?: number;
  onPlayParagraphAudio?: (index: number, timestamp: number) => void;
  onOpenSealModal?: () => void;
}

export const BilingualReaderView: React.FC<BilingualReaderViewProps> = ({
  themeMode,
  fontSize,
  vocabBtnClass,
  bottomCardBgClass,
  q1Answer,
  setQ1Answer,
  q2Answer,
  setQ2Answer,
  quizSubmitted,
  setQuizSubmitted,
  selectedLevel = "Level 2",
  onChangeLevel,
  articleData,
  onStartPractice,
  activeParagraphIndex = 0,
  onPlayParagraphAudio,
  onOpenSealModal,
}) => {
  const [layoutMode, setLayoutMode] = useState<'paired' | 'sheets'>('paired');
  // ── Proportional Scroll Sync Refs & State ─────────────────────────────────
  const leftSheetRef = useRef<HTMLDivElement>(null);
  const rightSheetRef = useRef<HTMLDivElement>(null);
  const sheetsRef = useRef<HTMLDivElement>(null);
  useReadingBookmark(articleData, selectedLevel, leftSheetRef, rightSheetRef);
  // Keep both illustrations aligned while translated headings reflow independently.
  useLayoutEffect(() => {
    const intros = [leftSheetRef.current, rightSheetRef.current]
      .map(sheet => sheet?.querySelector('.reader-article-intro-content'))
      .filter((intro): intro is Element => Boolean(intro));
    const alignHeaders = () => {
      const height = Math.max(0, ...intros.map(intro => intro.getBoundingClientRect().height));
      sheetsRef.current?.style.setProperty('--reader-intro-height', `${height}px`);
    };
    const observer = new ResizeObserver(alignHeaders);
    intros.forEach(intro => observer.observe(intro));
    alignHeaders();
    return () => observer.disconnect();
  }, [articleData?.id]);
  const activeScrollerRef = useRef<"left" | "right" | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState<boolean>(true);
  // ── Dynamic Reading Quiz State ──────────────────────────────────────────
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<number, string>>({});
  const [dynamicSubmitted, setDynamicSubmitted] = useState<boolean>(false);
  const [visibleQuestionIndex, setVisibleQuestionIndex] = useState(0);

  useEffect(() => {
    setDynamicAnswers({});
    setDynamicSubmitted(false);
    setVisibleQuestionIndex(0);
  }, [articleData?.id]);
  // ── Shared In-Place Realtime Dictionary Hook ───────────────────────────────
  const { popupState, closeDictionary, handleTextSelection, handleVocabClick } = useReaderDictionary(articleData?.vocabMap);

  // Handle Proportional Scroll Sync
  const handleScroll = useCallback((source: "left" | "right") => {
    if (!isScrollSyncEnabled) return;

    // If another pane is actively driving the scroll, ignore echo scroll events
    if (activeScrollerRef.current && activeScrollerRef.current !== source) {
      return;
    }

    const sourceEl = source === "left" ? leftSheetRef.current : rightSheetRef.current;
    const targetEl = source === "left" ? rightSheetRef.current : leftSheetRef.current;

    if (!sourceEl || !targetEl) return;

    const sourceMaxScroll = sourceEl.scrollHeight - sourceEl.clientHeight;
    const targetMaxScroll = targetEl.scrollHeight - targetEl.clientHeight;

    if (sourceMaxScroll <= 0 || targetMaxScroll <= 0) return;

    // Lock the active source driver
    activeScrollerRef.current = source;

    const scrollRatio = sourceEl.scrollTop / sourceMaxScroll;
    targetEl.scrollTop = scrollRatio * targetMaxScroll;

    // Reset lock once scrolling settles
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      activeScrollerRef.current = null;
    }, 120);
  }, [isScrollSyncEnabled]);

  // Cleanup sync timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Recalculate sync when font size reflows
  useEffect(() => {
    if (leftSheetRef.current && rightSheetRef.current && isScrollSyncEnabled) {
      handleScroll("left");
    }
  }, [fontSize, isScrollSyncEnabled, handleScroll]);

  const isDark = themeMode === "dark";

  return (
    <div className="reader-bilingual-view space-y-8 animate-in fade-in duration-300">

      {/* ── Scroll & Layout View Toolbar Indicator ───────────────────────── */}
      <div className="reader-scroll-tools flex items-center justify-between px-2 text-xs font-semibold gap-3" role="group" aria-label="Reading controls and tips">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layout Mode Switcher */}
          <div className="inline-flex items-center p-0.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setLayoutMode('paired')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                layoutMode === 'paired'
                  ? 'bg-antique-gold text-[#123047] font-bold shadow-xs'
                  : 'text-mist-cloud hover:text-warm-ivory'
              }`}
              title="Bố cục đối xứng đoạn 1:1 (chuẩn Reader)"
              aria-pressed={layoutMode === 'paired'}
            >
              Đối xứng 1:1
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('sheets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                layoutMode === 'sheets'
                  ? 'bg-antique-gold text-[#123047] font-bold shadow-xs'
                  : 'text-mist-cloud hover:text-warm-ivory'
              }`}
              title="Bố cục hai trang sách đối soát"
              aria-pressed={layoutMode === 'sheets'}
            >
              Hai trang sách
            </button>
          </div>

          {layoutMode === 'sheets' && (
            <button
              type="button"
              aria-pressed={isScrollSyncEnabled}
              onClick={() => setIsScrollSyncEnabled(!isScrollSyncEnabled)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${isScrollSyncEnabled
                ? isDark
                  ? "bg-antique-gold/20 border-antique-gold text-antique-gold font-bold shadow-xs"
                  : "bg-heritage-green/10 border-heritage-green/30 text-heritage-green font-bold shadow-xs"
                : isDark
                  ? "bg-white/5 border-transparent text-sky-mist/60 hover:text-warm-ivory"
                  : "bg-black/5 border-transparent text-heritage-green/60 hover:text-heritage-green"
                }`}
              title="Toggle synchronized scrolling between the original and translation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScrollSyncEnabled ? "text-antique-gold" : ""}`} />
              <span>Scroll sync: {isScrollSyncEnabled ? "On" : "Off"}</span>
            </button>
          )}
        </div>

        <p role="note" className={`reader-lookup-tip text-[11px] font-medium flex items-center gap-1.5 ${isDark ? "text-sky-mist" : "text-heritage-green/80"
          }`}>
          <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
          <span>Bôi đen từ hoặc chọn từ vựng để tra nghĩa & lưu ngữ cảnh.</span>
        </p>
      </div>

      {/* ── BILINGUAL VIEW DISPLAY ─────────────────────────────────────────── */}
      {layoutMode === 'paired' && articleData?.paragraphs && articleData.paragraphs.length > 0 ? (
        <div className="space-y-6">
          {/* Article Presentation Header Card */}
          <div
            className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
              isDark
                ? 'bg-[#18211E]/90 text-warm-ivory border-antique-gold/20'
                : 'bg-[#FAF7EF]/95 text-[#123047] border-[#D6D8CC]'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-antique-gold">
                  {articleData.topic || 'Customs & Festivals'} • {articleData.level || selectedLevel}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  {articleData.titleEn}
                </h1>
                <p className="font-sans text-base sm:text-lg italic text-mist-cloud/90">
                  {articleData.titleVi}
                </p>
                {articleData.summary && (
                  <p className="text-xs sm:text-sm text-mist-cloud pt-1 leading-relaxed border-t border-black/5 dark:border-white/5">
                    {articleData.summary}
                  </p>
                )}
              </div>

              {articleData.imageUrl && (
                <div className="md:col-span-4 rounded-xl overflow-hidden aspect-[16/10] border border-black/10 dark:border-white/10 shadow-sm">
                  <img
                    src={articleData.imageUrl}
                    alt={articleData.titleEn}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 1:1 Bilingual Paragraph Pairs */}
          <BilingualParagraphPairList
            articleData={articleData}
            activeParagraphIndex={activeParagraphIndex}
            fontSize={fontSize}
            themeMode={themeMode}
            vocabBtnClass={vocabBtnClass}
            onVocabClick={handleVocabClick}
            onPlayParagraphAudio={onPlayParagraphAudio}
            onMouseUpText={handleTextSelection}
            onDoubleClickText={handleTextSelection}
          />
        </div>
      ) : (
        /* ── BILINGUAL MODE: Dual Paper Sheets (Side-by-Side Instant Comparison) ── */
        <div ref={sheetsRef} className="reader-bilingual-sheets">
          {/* ── LEFT PAPER SHEET (ENGLISH ORIGINAL) ─────────────────────────── */}
          <ReaderArticleContent
            language="en" themeMode={themeMode} fontSize={fontSize} articleData={articleData}
            wordCount={articleData?.wordCount || (selectedLevel === 'Level 1' ? 220 : selectedLevel === 'Level 2' ? 370 : 520)}
            vocabClassName={vocabBtnClass} onVocabClick={handleVocabClick}
            scrollable scrollRef={leftSheetRef}
            onMouseEnter={() => { activeScrollerRef.current = 'left'; }}
            onTouchStart={() => { activeScrollerRef.current = 'left'; }}
            onWheel={() => { activeScrollerRef.current = 'left'; }}
            onScroll={() => handleScroll('left')}
            onMouseUp={handleTextSelection} onDoubleClick={handleTextSelection}
          />

          {/* ── RIGHT PAPER SHEET (TIẾNG VIỆT TRANSLATION) ────────────────────── */}
          <div className="reader-book-spine" aria-hidden="true"><ReaderLotus /><span className="reader-spine-line" /><span>Same<br />stories<br />brighter<br />tomorrows</span><span className="reader-spine-line" /></div>
          <ReaderArticleContent
            language="vi" themeMode={themeMode} fontSize={fontSize} articleData={articleData}
            vocabClassName={vocabBtnClass} onVocabClick={handleVocabClick}
            scrollable scrollRef={rightSheetRef}
            onMouseEnter={() => { activeScrollerRef.current = 'right'; }}
            onTouchStart={() => { activeScrollerRef.current = 'right'; }}
            onWheel={() => { activeScrollerRef.current = 'right'; }}
            onScroll={() => handleScroll('right')}
            onMouseUp={handleTextSelection} onDoubleClick={handleTextSelection}
          />
        </div>
      )}

      {/* ── Unified Bottom Card: Reading Check Quiz + Practice Next Steps ───── */}
      <div
        data-practice-theme={themeMode}
        className={`reader-practice-surface reader-practice-card rounded-3xl p-8 sm:p-12 transition-colors duration-300 grid grid-cols-1 lg:grid-cols-12 gap-10 ${bottomCardBgClass}`}
      >
        {/* Left 7 Cols: Quiz Section */}
        <div className="reader-practice-questions lg:col-span-7 pr-0 lg:pr-8 lg:border-r border-antique-gold/20">
          {articleData?.questions && articleData.questions.length > 0 ? (
            <>
              <div className="mb-6 pb-4 border-b border-antique-gold/20">
                <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
                  Reading check ({articleData.questions.length} questions)
                </span>
                <h2
                  className={`font-sans text-2xl font-bold mt-1 ${
                    themeMode === "dark" ? "text-warm-ivory" : "text-heritage-green"
                  }`}
                >
                  Check your understanding
                </h2>
              </div>

              <div className="space-y-6">
                {(() => {
                  const idx = visibleQuestionIndex;
                  const q = articleData.questions[idx];
                  if (!q) return null;
                  const currentVal = dynamicAnswers[idx] || '';
                  const isCorrect = dynamicSubmitted && currentVal === q.correctKey;
                  const isIncorrect = dynamicSubmitted && currentVal !== '' && currentVal !== q.correctKey;
                  return (
                    <div
                      key={q.id || idx}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isDark ? 'bg-[#18211E]/80 border-antique-gold/20' : 'bg-rice-paper/40 border-heritage-green/12'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3
                          className={`text-sm sm:text-base font-bold ${
                            isDark ? "text-warm-ivory" : "text-heritage-green"
                          }`}
                        >
                          {idx + 1}. {q.question}
                        </h3>
                        {dynamicSubmitted && (
                          isCorrect ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 px-2.5 py-0.5 rounded-full shrink-0 border border-emerald-500/30">
                              Correct ✓
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-rose-700 bg-rose-100 dark:bg-rose-950/70 dark:text-rose-300 px-2.5 py-0.5 rounded-full shrink-0 border border-rose-500/30">
                              Incorrect ✗
                            </span>
                          )
                        )}
                      </div>

                      <div className="space-y-2.5">
                        {q.options.map((opt) => (
                          <label
                            key={opt.key}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              currentVal === opt.key
                                ? "bg-heritage-green/20 border-antique-gold text-warm-ivory font-semibold"
                                : isDark
                                ? "bg-[#141C1A] border-antique-gold/15 text-mist-cloud hover:bg-[#1E2925]"
                                : "bg-white/80 border-heritage-green/10 hover:bg-rice-paper/70"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`dynamic-q-${idx}`}
                              value={opt.key}
                              checked={currentVal === opt.key}
                              onChange={() => {
                                setDynamicAnswers((prev) => ({ ...prev, [idx]: opt.key }));
                                if (dynamicSubmitted) setDynamicSubmitted(false);
                              }}
                              className="mt-1 accent-antique-gold"
                            />
                            <span className="text-xs sm:text-sm">
                              <strong className="text-antique-gold mr-1">{opt.key}.</strong> {opt.text}
                            </span>
                          </label>
                        ))}
                      </div>

                      {dynamicSubmitted && q.explanation && (
                        <p className="mt-3 text-xs italic text-antique-gold dark:text-mist-cloud/90 bg-heritage-green/10 dark:bg-black/20 p-3 rounded-xl border border-antique-gold/20">
                          💡 <strong>Cultural context:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2" aria-label="Question navigation">
                <button type="button" disabled={visibleQuestionIndex === 0} onClick={() => setVisibleQuestionIndex((index) => Math.max(0, index - 1))} className="inline-flex items-center gap-1 rounded-full border px-4 py-2 text-xs font-semibold disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-xs font-medium opacity-75">Question {visibleQuestionIndex + 1} of {articleData.questions.length}</span>
                <button type="button" disabled={visibleQuestionIndex >= (articleData.questions?.length ?? 0) - 1} onClick={() => setVisibleQuestionIndex((index) => Math.min((articleData.questions?.length ?? 1) - 1, index + 1))} className="inline-flex items-center gap-1 rounded-full border px-4 py-2 text-xs font-semibold disabled:opacity-40">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Submit Quiz Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setDynamicSubmitted(true)}
                  className="px-6 py-3 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm transition-all border border-antique-gold cursor-pointer"
                >
                  Check answers
                </button>
                {dynamicSubmitted && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-bold border border-[#059669]/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {(() => {
                        const correctCount = articleData.questions.filter(
                          (q, idx) => dynamicAnswers[idx] === q.correctKey
                        ).length;
                        return correctCount === articleData.questions.length
                          ? `Great work! ${correctCount}/${articleData.questions.length} correct.`
                          : `${correctCount}/${articleData.questions.length} correct.`;
                      })()}
                    </span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 pb-4 border-b border-antique-gold/20">
                <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
                  Reading check ({READER_QUIZ_QUESTIONS.length} questions)
                </span>
                <h2
                  className={`font-sans text-2xl font-bold mt-1 ${themeMode === "dark" ? "text-warm-ivory" : "text-heritage-green"
                    }`}
                >
                  Check your understanding
                </h2>
              </div>

              {/* Show one question at a time to keep the reader compact. */}
              {(() => {
                const question = READER_QUIZ_QUESTIONS[visibleQuestionIndex];
                const answer = visibleQuestionIndex === 0 ? q1Answer : q2Answer;
                const setAnswer = visibleQuestionIndex === 0 ? setQ1Answer : setQ2Answer;
                if (!question) return null;
                return <div className="mb-6">
                  <h3 className={`text-sm sm:text-base font-bold mb-3 ${themeMode === "dark" ? "text-warm-ivory" : "text-heritage-green"}`}>
                    {question.question}
                  </h3>
                  <div className="space-y-2.5">
                    {question.options.map((opt) => (
                      <label key={opt.value} className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${answer === opt.value
                        ? "bg-heritage-green/20 border-antique-gold text-warm-ivory font-semibold"
                        : themeMode === "dark"
                          ? "bg-[#18211E] border-antique-gold/20 text-mist-cloud hover:bg-[#1E2925]"
                          : "bg-rice-paper/60 border-heritage-green/12 hover:bg-rice-paper"
                      }`}>
                        <input type="radio" name={question.id} value={opt.value} checked={answer === opt.value} onChange={() => setAnswer(opt.value)} className="mt-1 accent-antique-gold" />
                        <span className="text-xs sm:text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>;
              })()}

              <div className="flex items-center justify-between gap-3 mb-6" aria-label="Question navigation">
                <button type="button" disabled={visibleQuestionIndex === 0} onClick={() => setVisibleQuestionIndex((index) => Math.max(0, index - 1))} className="inline-flex items-center gap-1 rounded-full border px-4 py-2 text-xs font-semibold disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-xs font-medium opacity-75">Question {visibleQuestionIndex + 1} of {READER_QUIZ_QUESTIONS.length}</span>
                <button type="button" disabled={visibleQuestionIndex >= READER_QUIZ_QUESTIONS.length - 1} onClick={() => setVisibleQuestionIndex((index) => Math.min(READER_QUIZ_QUESTIONS.length - 1, index + 1))} className="inline-flex items-center gap-1 rounded-full border px-4 py-2 text-xs font-semibold disabled:opacity-40">
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              {/* Submit Quiz Action */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="px-6 py-3 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm transition-all border border-antique-gold cursor-pointer"
                >
                  Check answers
                </button>
                {quizSubmitted && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECFDF5] text-[#047857] text-xs font-bold border border-[#059669]/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {q1Answer === READER_QUIZ_QUESTIONS[0]?.correctValue &&
                        q2Answer === READER_QUIZ_QUESTIONS[1]?.correctValue
                        ? "Great work! 2/2 correct."
                        : "Reading check completed."}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right 5 Cols: Practice Next Steps */}
        <div className="reader-practice-actions lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
                Next steps
              </span>
              <h3
                className={`font-sans text-xl font-bold mt-1 ${themeMode === "dark" ? "text-warm-ivory" : "text-heritage-green"
                  }`}
              >
                Practice what you read
              </h3>
              <p className="text-xs opacity-80 mt-1 leading-relaxed">
                Choose an activity to review the vocabulary and structures from this article.
              </p>
            </div>

            <div className="space-y-3 mt-6">
              {/* Ceremonial Mộc Son Đỏ & Daily Streak Activation */}
              {onOpenSealModal && (
                <button
                  type="button"
                  onClick={onOpenSealModal}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold bg-[#9E2A2B] hover:bg-[#852223] text-white border border-antique-gold shadow-md transition-all cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-antique-gold group-hover:rotate-12 transition-transform" />
                    <span>Đóng Mộc Son Đỏ & Kích hoạt Streak</span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <Link
                href={paths.flashcardStudy({ deck: articleData?.id, level: selectedLevel })}
                className="reader-practice-primary flex w-full items-center justify-between px-5 py-3.5 rounded-2xl"
              >
                <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Study vocabulary flashcards</span>
                <ChevronRight className="w-4 h-4 opacity-80" />
              </Link>

              {/* Open Dictation with this article. */}
              <button
                type="button"
                onClick={() => onStartPractice('dictation')}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer group ${themeMode === "dark"
                  ? "bg-[#18211E] text-warm-ivory border-antique-gold/20 hover:bg-[#232F2B]"
                  : "bg-rice-paper text-heritage-green border-heritage-green/12 hover:bg-mist-cloud"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-antique-gold" />
                  <span>Practice dictation</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Community Reflection Link */}
              <Link
                href="/community"
                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all group ${themeMode === "dark"
                  ? "bg-[#18211E] text-warm-ivory border-antique-gold/20 hover:bg-[#232F2B]"
                  : "bg-rice-paper text-heritage-green border-heritage-green/12 hover:bg-mist-cloud"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-antique-gold" />
                  Write a reflection
                </span>
                <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── In-Place Dictionary Popup ──────────────────────────────────────── */}
      <InPlaceDictionaryPopup
        isOpen={popupState.isOpen}
        vocab={popupState.vocab}
        position={popupState.position}
        onClose={closeDictionary}
        themeMode={themeMode}
      />

    </div>
  );
};

export default BilingualReaderView;

