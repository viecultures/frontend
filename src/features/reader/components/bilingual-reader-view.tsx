import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "@/components/Link";

import { CheckCircle2, ArrowRight, Layers, Headphones, PenTool, ChevronRight, RefreshCw, Sparkles } from "lucide-react";
import { READER_QUIZ_QUESTIONS, VOCAB_DATABASE } from "@/data/readerData";

import { InPlaceDictionaryPopup } from "./InPlaceDictionaryPopup";
import { ReaderDictationSection } from "./ReaderDictationSection";
import { ReaderQuickFlashcards } from "./ReaderQuickFlashcards";
import { LessonCompletionFlowModal } from "./LessonCompletionFlowModal";
import type { ReaderArticleData } from "../services/readerApiService";
import { useReaderDictionary } from "../hooks/useReaderDictionary";
import { ReaderArticleContent } from './ReaderArticleContent';
import { paths } from '@/routes/paths';

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
}) => {
  // ── Proportional Scroll Sync Refs & State ─────────────────────────────────
  const leftSheetRef = useRef<HTMLDivElement>(null);
  const rightSheetRef = useRef<HTMLDivElement>(null);
  const activeScrollerRef = useRef<"left" | "right" | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isScrollSyncEnabled, setIsScrollSyncEnabled] = useState<boolean>(true);
  const [isMocSonModalOpen, setIsMocSonModalOpen] = useState<boolean>(false);
  // ── Dynamic Reading Quiz State ──────────────────────────────────────────
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<number, string>>({});
  const [dynamicSubmitted, setDynamicSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setDynamicAnswers({});
    setDynamicSubmitted(false);
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
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ── Scroll Sync Toolbar Indicator ─────────────────────────────────── */}
      <div className="flex items-center justify-between px-2 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScrollSyncEnabled(!isScrollSyncEnabled)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${isScrollSyncEnabled
              ? isDark
                ? "bg-[#D9B76A]/20 border-[#D9B76A] text-[#D9B76A] font-bold shadow-xs"
                : "bg-[#1E4B43]/10 border-[#1E4B43]/30 text-[#1E4B43] font-bold shadow-xs"
              : isDark
                ? "bg-white/5 border-transparent text-[#BFE3EA]/60 hover:text-[#FBF7EE]"
                : "bg-black/5 border-transparent text-[#1E4B43]/60 hover:text-[#1E4B43]"
              }`}
            title="Toggle synchronized scrolling between the original and translation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScrollSyncEnabled ? "text-[#D9B76A]" : ""}`} />
            <span>Scroll sync: {isScrollSyncEnabled ? "On" : "Off"}</span>
          </button>
        </div>

        <span className={`text-[11px] font-medium hidden sm:flex items-center gap-1.5 ${isDark ? "text-[#BFE3EA]" : "text-[#1E4B43]/80"
          }`}>
          <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
          <span>Select a word or phrase to look it up and save its context.</span>
        </span>
      </div>

      {/* ── BILINGUAL MODE: Dual Paper Sheets (Side-by-Side Instant Comparison) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

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
        >
          <>
            <p>
              Tết Nguyên Đán, often called simply Tết, is described as the most important and{" "}
              <button
                onClick={(e) => handleVocabClick("sacred", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'sacred' tại chỗ"
              >
                sacred
              </button>{" "}
              holiday in Vietnamese culture. It marks the{" "}
              <button
                onClick={(e) => handleVocabClick("passage", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'passage from one year to the next' tại chỗ"
              >
                passage from the old year to the new one
              </button>
              , but its meaning goes further. According to the article, Tết stands for{" "}
              <button
                onClick={(e) => handleVocabClick("family-reunion", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'family reunion' tại chỗ"
              >
                family reunion
              </button>
              , respect for ancestors, and hope for a better future.
            </p>

            <p>
              The article traces Tết back to the ancient{" "}
              <button
                onClick={(e) => handleVocabClick("agricultural-civilization", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'agricultural civilization' tại chỗ"
              >
                agricultural civilization
              </button>{" "}
              of East Asia, where the cycle of the seasons played a central role in daily life. Tết takes place when winter{" "}
              <button
                onClick={(e) => handleVocabClick("give-way-to", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'give way to' tại chỗ"
              >
                gives way to
              </button>{" "}
              spring and plants begin to grow again, which{" "}
              <button
                onClick={(e) => handleVocabClick("symbolize", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'symbolize' tại chỗ"
              >
                symbolizes
              </button>{" "}
              a new beginning. A{" "}
              <button
                onClick={(e) => handleVocabClick("folk-legend", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'folk legend' tại chỗ"
              >
                folk legend
              </button>{" "}
              also says that the festival is a time for descendants to remember their ancestors and pray for a good harvest. Over time, Tết{" "}
              <button
                onClick={(e) => handleVocabClick("absorb-influences", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'absorb influences' tại chỗ"
              >
                absorbed influences
              </button>{" "}
              from Chinese culture during the period of Chinese rule, yet it kept its own identity.
            </p>

            <p>
              Traditional customs follow three stages. Before Tết, people clean their houses, prepare a{" "}
              <button
                onClick={(e) => handleVocabClick("five-fruit-tray", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'five-fruit tray' tại chỗ"
              >
                five-fruit tray
              </button>
              , and wrap bánh chưng or bánh tét together. During the holiday, families hold{" "}
              <button
                onClick={(e) => handleVocabClick("ancestor-worship", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'ancestor worship' tại chỗ"
              >
                ancestor worship
              </button>{" "}
              ceremonies, exchange New Year wishes, give{" "}
              <button
                onClick={(e) => handleVocabClick("li-xi", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'lì xì' tại chỗ"
              >
                lì xì
              </button>{" "}
              to children, and visit pagodas. Afterwards, people take part in spring festivals to wish for good luck. Although the way Vietnamese people celebrate has changed, the article argues that the{" "}
              <button
                onClick={(e) => handleVocabClick("core-values", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'core values' tại chỗ"
              >
                core values
              </button>{" "}
              of togetherness, gratitude, and hope remain the soul of the holiday.
            </p>

            <p>
              Food carries cultural and spiritual meaning as well. Bánh chưng and bánh tét, which the article calls symbols of earth and sky, express gratitude to ancestors. Bánh chưng is usually made in the North, whereas bánh tét is more common in the Centre and the South.{" "}
              <button
                onClick={(e) => handleVocabClick("dua-hanh", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'dưa hành' tại chỗ"
              >
                Dưa hành
              </button>{" "}
              balances rich, protein-heavy dishes, and thịt kho tàu with duck eggs represents fullness and{" "}
              <button
                onClick={(e) => handleVocabClick("prosperity", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'prosperity' tại chỗ"
              >
                prosperity
              </button>
              . Mứt Tết, made from coconut, ginger, or kumquat, stands for sweetness and a good start.
            </p>

            <p>
              Finally, the{" "}
              <button
                onClick={(e) => handleVocabClick("atmosphere", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'atmosphere' tại chỗ"
              >
                atmosphere
              </button>{" "}
              of Tết{" "}
              <button
                onClick={(e) => handleVocabClick("differ-from-region-to-region", e)}
                className={vocabBtnClass}
                title="Nhấp để tra từ 'differ from region to region' tại chỗ"
              >
                differs from region to region
              </button>
              . In the North, it is linked to peach blossoms, bánh chưng, and solemn customs, with a busy Tết market and a nostalgic mood. The Central region celebrates in a simpler but equally warm way, with yellow mai flowers, red couplets, and dishes such as nem chua và tré. In the South, Tết feels lively and open, with mai flowers, red watermelons, flower markets, and folk games.
            </p>
          </>
        </ReaderArticleContent>

        {/* ── RIGHT PAPER SHEET (TIẾNG VIỆT TRANSLATION) ────────────────────── */}
        <ReaderArticleContent
          language="vi" themeMode={themeMode} fontSize={fontSize} articleData={articleData}
          vocabClassName={vocabBtnClass} onVocabClick={handleVocabClick}
          scrollable scrollRef={rightSheetRef}
          onMouseEnter={() => { activeScrollerRef.current = 'right'; }}
          onTouchStart={() => { activeScrollerRef.current = 'right'; }}
          onWheel={() => { activeScrollerRef.current = 'right'; }}
          onScroll={() => handleScroll('right')}
          onMouseUp={handleTextSelection} onDoubleClick={handleTextSelection}
        >
          <>
            <p>
              Tết Nguyên Đán, thường được gọi đơn giản là Tết, được mô tả là ngày lễ quan trọng và thiêng liêng nhất trong văn hóa Việt Nam. Tết đánh dấu sự chuyển giao từ năm cũ sang năm mới, nhưng ý nghĩa của nó còn sâu xa hơn thế. Theo bài viết, Tết tượng trưng cho sự đoàn viên gia đình, lòng kính trọng tổ tiên và hy vọng về một tương lai tốt đẹp hơn.
            </p>

            <p>
              Bài viết truy nguồn gốc của Tết về nền văn minh nông nghiệp lâu đời của người Á Đông, nơi vòng quay của các mùa đóng vai trò trung tâm trong đời sống hằng ngày. Tết diễn ra khi mùa đông nhường chỗ cho mùa xuân và cây cối bắt đầu sinh trưởng trở lại, điều này tượng trưng cho một khởi đầu mới. Một truyền thuyết dân gian cũng kể rằng Tết là dịp để con cháu tưởng nhớ tổ tiên và cầu mong mùa màng bội thu. Theo thời gian, Tết tiếp nhận những ảnh hưởng từ văn hóa Trung Hoa trong thời kỳ Bắc thuộc, nhưng vẫn giữ được bản sắc riêng.
            </p>

            <p>
              Các phong tục truyền thống diễn ra theo ba giai đoạn. Trước Tết, mọi người dọn dẹp nhà cửa, bày mâm ngũ quả và cùng nhau gói bánh chưng hoặc bánh tét. Trong Tết, các gia đình cúng gia tiên, chúc Tết, lì xì cho trẻ em và đi chùa. Sau Tết, mọi người tham gia các lễ hội xuân để cầu may mắn. Dù cách người Việt đón Tết đã thay đổi, bài viết cho rằng những giá trị cốt lõi như sự sum họp, lòng biết ơn và hy vọng vẫn là linh hồn của ngày lễ.
            </p>

            <p>
              Ẩm thực cũng mang ý nghĩa văn hóa và tâm linh. Bánh chưng và bánh tét, mà bài viết gọi là biểu tượng của đất và trời, thể hiện lòng biết ơn tổ tiên. Bánh chưng thường được làm ở miền Bắc, trong khi bánh tét phổ biến hơn ở miền Trung và miền Nam. Dưa hành giúp cân bằng các món nhiều đạm, còn thịt kho tàu với trứng vịt thể hiện sự tròn đầy và sung túc. Mứt Tết, làm từ dừa, gừng hoặc quất, biểu trưng cho sự ngọt ngào và một khởi đầu tốt đẹp.
            </p>

            <p>
              Cuối cùng, không khí Tết khác nhau giữa các vùng miền. Ở miền Bắc, Tết gắn với hoa đào, bánh chưng và những phong tục trang trọng, với phiên chợ Tết nhộn nhịp và không khí hoài niệm. Miền Trung đón Tết giản dị hơn nhưng không kém phần ấm cúng, với hoa mai vàng, câu đối đỏ và các món như nem chua, tré. Ở miền Nam, Tết sôi động và phóng khoáng, với hoa mai, dưa hấu đỏ, chợ hoa và các trò chơi dân gian.
            </p>
          </>
        </ReaderArticleContent>

      </div>

      {/* ── Unified Bottom Card: Reading Check Quiz + Practice Next Steps ───── */}
      <div
        data-practice-theme={themeMode}
        className={`reader-practice-surface reader-practice-card rounded-3xl p-8 sm:p-12 transition-colors duration-300 grid grid-cols-1 lg:grid-cols-12 gap-10 ${bottomCardBgClass}`}
      >
        {/* Left 7 Cols: Quiz Section */}
        <div className="reader-practice-questions lg:col-span-7 pr-0 lg:pr-8 lg:border-r border-[rgba(217,183,106,0.2)]">
          {articleData?.questions && articleData.questions.length > 0 ? (
            <>
              <div className="mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                  Reading check ({articleData.questions.length} questions)
                </span>
                <h2
                  className={`font-serif text-2xl font-bold mt-1 ${
                    themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
                  }`}
                >
                  Check your understanding
                </h2>
              </div>

              <div className="space-y-6">
                {articleData.questions.map((q, idx) => {
                  const currentVal = dynamicAnswers[idx] || '';
                  const isCorrect = dynamicSubmitted && currentVal === q.correctKey;
                  const isIncorrect = dynamicSubmitted && currentVal !== '' && currentVal !== q.correctKey;
                  return (
                    <div
                      key={q.id || idx}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isDark ? 'bg-[#18211E]/80 border-[#D9B76A]/20' : 'bg-[#F6EEDC]/40 border-[rgba(30,75,67,0.12)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3
                          className={`text-sm sm:text-base font-bold ${
                            isDark ? "text-[#FBF7EE]" : "text-[#1E4B43]"
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
                                ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                                : isDark
                                ? "bg-[#141C1A] border-[#D9B76A]/15 text-[#E8DFCB] hover:bg-[#1E2925]"
                                : "bg-white/80 border-[rgba(30,75,67,0.1)] hover:bg-[#F6EEDC]/70"
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
                              className="mt-1 accent-[#D9B76A]"
                            />
                            <span className="text-xs sm:text-sm">
                              <strong className="text-[#D9B76A] mr-1">{opt.key}.</strong> {opt.text}
                            </span>
                          </label>
                        ))}
                      </div>

                      {dynamicSubmitted && q.explanation && (
                        <p className="mt-3 text-xs italic text-[#D9B76A] dark:text-[#E8DFCB]/90 bg-[#1E4B43]/10 dark:bg-black/20 p-3 rounded-xl border border-antique-gold/20">
                          💡 <strong>Cultural context:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit Quiz Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setDynamicSubmitted(true)}
                  className="px-6 py-3 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] shadow-sm transition-all border border-[#D9B76A] cursor-pointer"
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
          ) : !articleData ? (
            <>
              <div className="mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                  Reading check
                </span>
                <h2
                  className={`font-serif text-2xl font-bold mt-1 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
                    }`}
                >
                  Check your understanding
                </h2>
              </div>

              {/* Quiz Q1 */}
              <div className="mb-8">
                <h3
                  className={`text-sm sm:text-base font-bold mb-3 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
                    }`}
                >
                  {READER_QUIZ_QUESTIONS[0]?.question}
                </h3>

                <div className="space-y-2.5">
                  {READER_QUIZ_QUESTIONS[0]?.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${q1Answer === opt.value
                        ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                        : themeMode === "dark"
                          ? "bg-[#18211E] border-[#D9B76A]/20 text-[#E8DFCB] hover:bg-[#1E2925]"
                          : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.12)] hover:bg-[#F6EEDC]"
                        }`}
                    >
                      <input
                        type="radio"
                        name="q1"
                        value={opt.value}
                        checked={q1Answer === opt.value}
                        onChange={() => setQ1Answer(opt.value)}
                        className="mt-1 accent-[#D9B76A]"
                      />
                      <span className="text-xs sm:text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quiz Q2 */}
              <div className="mb-8">
                <h3
                  className={`text-sm sm:text-base font-bold mb-3 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
                    }`}
                >
                  {READER_QUIZ_QUESTIONS[1]?.question}
                </h3>

                <div className="space-y-2.5">
                  {READER_QUIZ_QUESTIONS[1]?.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${q2Answer === opt.value
                        ? "bg-[#1E4B43]/20 border-[#D9B76A] text-[#FBF7EE] font-semibold"
                        : themeMode === "dark"
                          ? "bg-[#18211E] border-[#D9B76A]/20 text-[#E8DFCB] hover:bg-[#1E2925]"
                          : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.12)] hover:bg-[#F6EEDC]"
                        }`}
                    >
                      <input
                        type="radio"
                        name="q2"
                        value={opt.value}
                        checked={q2Answer === opt.value}
                        onChange={() => setQ2Answer(opt.value)}
                        className="mt-1 accent-[#D9B76A]"
                      />
                      <span className="text-xs sm:text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Quiz Action */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuizSubmitted(true)}
                  className="px-6 py-3 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] shadow-sm transition-all border border-[#D9B76A] cursor-pointer"
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
          ) : (
            <div className="py-8 px-6 text-center rounded-2xl bg-white/40 dark:bg-white/5 border border-dashed border-[rgba(217,183,106,0.3)]">
              <p role="status" className="text-xs sm:text-sm text-text-muted">
                No reading questions are available for this article yet. You can still practice dictation or review vocabulary.
              </p>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Practice Next Steps */}
        <div className="reader-practice-actions lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                Next steps
              </span>
              <h3
                className={`font-serif text-xl font-bold mt-1 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
                  }`}
              >
                Practice what you read
              </h3>
              <p className="text-xs opacity-80 mt-1 leading-relaxed">
                Choose an activity to review the vocabulary and structures from this article.
              </p>
            </div>

            <div className="space-y-3 mt-6">

              {/* Scroll to Stacked Dictation */}
              <button
                type="button"
                onClick={() => {
                  document.getElementById("reader-dictation")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer group ${themeMode === "dark"
                  ? "bg-[#18211E] text-[#FBF7EE] border-[#D9B76A]/20 hover:bg-[#232F2B]"
                  : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-[#D9B76A]" />
                  <span>Practice dictation</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Scroll to Stacked Flashcards */}
              <button
                type="button"
                onClick={() => {
                  document.getElementById("reader-flashcards")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer group ${themeMode === "dark"
                  ? "bg-[#18211E] text-[#FBF7EE] border-[#D9B76A]/20 hover:bg-[#232F2B]"
                  : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D9B76A]" />
                  <span>Quick flashcards</span>
                </span>
                <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Full Flashcard Study Room Link */}
              <Link
                href={paths.flashcardStudy({ deck: articleData?.id || 'tet-holiday', level: selectedLevel })}
                className="reader-practice-primary flex items-center justify-between px-5 py-3.5 rounded-2xl bg-[#1E4B43] text-[#FBF7EE] text-xs font-bold shadow-sm hover:bg-[#163D37] border border-[#D9B76A]/50 transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D9B76A]" />
                  Review flashcards ({articleData ? articleData.vocabularies.length : Object.keys(VOCAB_DATABASE).length} words)

                </span>
                <ArrowRight className="w-4 h-4 text-[#D9B76A] group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Community Reflection Link */}
              <Link
                href="/community"
                className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-xs font-bold border transition-all group ${themeMode === "dark"
                  ? "bg-[#18211E] text-[#FBF7EE] border-[#D9B76A]/20 hover:bg-[#232F2B]"
                  : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#D9B76A]" />
                  Write a reflection
                </span>
                <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── STACKED SECTION 1: NGHE CHÉP CHÍNH TẢ (DICTATION) ──────── */}
      <div id="reader-dictation" className="scroll-mt-20">
        <ReaderDictationSection themeMode={themeMode} />
      </div>

      {/* ── STACKED SECTION 2: ÔN THẺ NHỚ NHANH (ACTIVE RECALL) ─────── */}
      <div id="reader-flashcards" className="scroll-mt-20">
        <ReaderQuickFlashcards
          themeMode={themeMode}
          onOpenMocSonModal={() => setIsMocSonModalOpen(true)}
          deckId={articleData?.id || 'tet-holiday'}
          selectedLevel={selectedLevel}
        />
      </div>

      {/* ── MODAL CHUỖI THÀNH TỰU & TRẢI NGHIỆM PRO ─────────────────────────── */}
      <LessonCompletionFlowModal
        isOpen={isMocSonModalOpen}
        onClose={() => setIsMocSonModalOpen(false)}
        articleId={articleData?.id || 'tet-holiday'}
        articleTitle={articleData?.titleVi || "Tết Cổ Truyền: Đổi Mới, Nhớ Về Cội Nguồn & Phong Vị Ba Miền"}
      />


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

