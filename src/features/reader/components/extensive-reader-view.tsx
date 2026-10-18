import React, { useState } from "react";
import Link from "@/components/Link";
import { ArrowRight, ChevronRight, Headphones, Layers, PenTool } from "lucide-react";
import { EXTENSIVE_QUESTIONS, VOCAB_DATABASE } from "@/data/readerData";
import type { ReaderArticleData } from "../services/readerApiService";
import { InPlaceDictionaryPopup } from "./InPlaceDictionaryPopup";
import { useReaderDictionary } from "../hooks/useReaderDictionary";
import { ReaderArticleContent } from './ReaderArticleContent';
import { paths } from '@/routes/paths';

interface ExtensiveReaderViewProps {
  themeMode: "paper" | "dark";
  fontSize: number;
  vocabBtnClass: string;
  bottomCardBgClass: string;
  openVocab: (key: string) => void;
  selectedLevel?: "Level 1" | "Level 2" | "Level 3";
  onChangeLevel?: (lvl: "Level 1" | "Level 2" | "Level 3") => void;
  articleData?: ReaderArticleData | null;
}

export const ExtensiveReaderView: React.FC<ExtensiveReaderViewProps> = ({
  themeMode,
  fontSize,
  vocabBtnClass,
  bottomCardBgClass,
  openVocab,
  selectedLevel = "Level 2",
  onChangeLevel,
  articleData,
}) => {
  const [isHighlightEnabled, setIsHighlightEnabled] = useState<boolean>(true);
  const [activePart, setActivePart] = useState<"part5" | "part6">("part6");
  const [extensiveAnswers, setExtensiveAnswers] = useState<Record<string, string>>({});
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(null);

  const isDark = themeMode === "dark";
  const { popupState, closeDictionary, handleTextSelection, handleVocabClick } = useReaderDictionary(articleData?.vocabMap);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Extensive Reading Grid: Passage (7 cols / 70%) + Side-by-Side Questions (3 cols / 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        {/* Left 7 Cols (70% Area): Extended Article Reading Passage */}
        <ReaderArticleContent
          language="en" themeMode={themeMode} fontSize={fontSize} articleData={articleData}
          wordCount={articleData?.wordCount || (selectedLevel === 'Level 1' ? 220 : selectedLevel === 'Level 2' ? 370 : 520)}
          vocabClassName={vocabBtnClass} onVocabClick={handleVocabClick}
          onMouseUp={handleTextSelection} onDoubleClick={handleTextSelection}
          className="lg:col-span-7"
        >
          <>
            <p>
              Tết Nguyên Đán, often called simply Tết, is described as the most important and{" "}
              <button
                onClick={(e) => handleVocabClick("sacred", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                sacred
              </button>{" "}
              holiday in Vietnamese culture. It marks the{" "}
              <button
                onClick={(e) => handleVocabClick("passage", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                passage from the old year to the new one
              </button>
              , but its meaning goes further. According to the article, Tết stands for{" "}
              <button
                onClick={(e) => handleVocabClick("family-reunion", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                family reunion
              </button>
              , respect for ancestors, and hope for a better future.
            </p>

            <p>
              The article traces Tết back to the ancient{" "}
              <button
                onClick={(e) => handleVocabClick("agricultural-civilization", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                agricultural civilization
              </button>{" "}
              of East Asia, where the cycle of the seasons played a central role in daily life. Tết takes place when winter{" "}
              <button
                onClick={(e) => handleVocabClick("give-way-to", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                gives way to
              </button>{" "}
              spring and plants begin to grow again, which{" "}
              <button
                onClick={(e) => handleVocabClick("symbolize", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                symbolizes
              </button>{" "}
              a new beginning. A{" "}
              <button
                onClick={(e) => handleVocabClick("folk-legend", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                folk legend
              </button>{" "}
              also says that the festival is a time for descendants to remember their ancestors and pray for a good harvest. Over time, Tết{" "}
              <button
                onClick={(e) => handleVocabClick("absorb-influences", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                absorbed influences
              </button>{" "}
              from Chinese culture during the period of Chinese rule, yet it kept its own identity.
            </p>

            <p>
              Traditional customs follow three stages. Before Tết, people clean their houses, prepare a{" "}
              <button
                onClick={(e) => handleVocabClick("five-fruit-tray", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                five-fruit tray
              </button>
              , and wrap bánh chưng or bánh tét together. During the holiday, families hold{" "}
              <button
                onClick={(e) => handleVocabClick("ancestor-worship", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                ancestor worship
              </button>{" "}
              ceremonies, exchange New Year wishes, give{" "}
              <button
                onClick={(e) => handleVocabClick("li-xi", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                lì xì
              </button>{" "}
              to children, and visit pagodas. Afterwards, people take part in spring festivals to wish for good luck. Although the way Vietnamese people celebrate has changed, the article argues that the{" "}
              <button
                onClick={(e) => handleVocabClick("core-values", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                core values
              </button>{" "}
              of togetherness, gratitude, and hope remain the soul of the holiday.
            </p>

            <p>
              Food carries cultural and spiritual meaning as well. Bánh chưng and bánh tét, which the article calls symbols of earth and sky, express gratitude to ancestors. Bánh chưng is usually made in the North, whereas bánh tét is more common in the Centre and the South.{" "}
              <button
                onClick={(e) => handleVocabClick("dua-hanh", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                Dưa hành
              </button>{" "}
              balances rich, protein-heavy dishes, and thịt kho tàu with duck eggs represents fullness and{" "}
              <button
                onClick={(e) => handleVocabClick("prosperity", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                prosperity
              </button>
              . Mứt Tết, made from coconut, ginger, or kumquat, stands for sweetness and a good start.
            </p>

            <p>
              Finally, the{" "}
              <button
                onClick={(e) => handleVocabClick("atmosphere", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                atmosphere
              </button>{" "}
              of Tết{" "}
              <button
                onClick={(e) => handleVocabClick("differ-from-region-to-region", e)}
                className={isHighlightEnabled ? vocabBtnClass : ""}
                title="Nhấp để xem từ vựng"
              >
                differs from region to region
              </button>
              . In the North, it is linked to peach blossoms, bánh chưng, and solemn customs, with a busy Tết market and a nostalgic mood. The Central region celebrates in a simpler but equally warm way, with yellow mai flowers, red couplets, and dishes such as nem chua and tré. In the South, Tết feels lively and open, with mai flowers, red watermelons, flower markets, and folk games.
            </p>
          </>
        </ReaderArticleContent>

        {/* Right 3 Cols (30% Area): Side-by-Side Practice Questions Column */}
        <div data-practice-theme={themeMode}
          className="reader-practice-surface reader-practice-questions lg:col-span-3 space-y-4">
          <div className="reader-practice-question-heading p-3.5 rounded-2xl bg-[#1E4B43]/30 border border-[#D9B76A]/30 mb-2">
            <h3 className="font-heading font-bold text-xs text-[#FBF7EE] flex items-center justify-between">
              <span>Check your understanding</span>
            </h3>
          </div>

          {articleData && <p role="status">No reading questions are available for this article yet. You can still review vocabulary.</p>}
          {(articleData ? [] : EXTENSIVE_QUESTIONS).map((q) => {
            const selected = extensiveAnswers[q.id];
            const isFocused = focusedQuestionId === q.id;

            return (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className={`reader-question-card p-3.5 sm:p-4 rounded-2xl border transition-all ${isFocused
                  ? "bg-[#1E4B43] border-[#D9B76A] shadow-xl ring-2 ring-[#D9B76A]/50"
                  : themeMode === "dark"
                    ? "bg-[#1E2925] border-[#D9B76A]/20"
                    : "bg-[#FBF7EE] border-[rgba(30,75,67,0.12)] shadow-sm"
                  }`}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-extrabold text-[11px] shadow-xs ${isDark
                    ? "bg-[#D9B76A] text-[#141C1A]"
                    : "bg-heritage-green text-warm-ivory"
                    }`}>
                    {q.num}
                  </span>
                  <span className="text-[11px] font-bold text-[#D9B76A] truncate">
                    Question {q.num}
                  </span>
                </div>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isChosen = selected === opt.key;
                    const isCorrect = isChosen && opt.key === q.correctKey;
                    const isWrong = isChosen && opt.key !== q.correctKey;

                    return (
                      <label
                        key={opt.key}
                        onClick={() => {
                          setExtensiveAnswers((prev) => ({ ...prev, [q.id]: opt.key }));
                          setFocusedQuestionId(q.id);
                        }}
                        data-result={isCorrect ? "correct" : isWrong ? "incorrect" : undefined}
                        className={`flex items-start gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${isCorrect
                          ? "bg-[#ECFDF5] border-[#059669] text-[#047857]"
                          : isWrong
                            ? "bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]"
                            : isChosen
                              ? "bg-[#D9B76A]/20 border-[#D9B76A] text-[#FBF7EE]"
                              : themeMode === "dark"
                                ? "bg-[#18211E] border-white/5 hover:bg-[#232F2B] text-[#E8DFCB]"
                                : "bg-[#F6EEDC]/60 border-[rgba(30,75,67,0.1)] hover:bg-[#F6EEDC] text-[#2C3B37]"
                          }`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={opt.key}
                          checked={isChosen}
                          onChange={() => { }}
                          className="mt-0.5 accent-[#D9B76A]"
                        />
                        <span className="leading-snug">
                          <strong className="mr-1">{opt.key}.</strong> {opt.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Extensive Mode: Horizontal 3-Column Next steps Only */}
      <div data-practice-theme={themeMode} className={`reader-practice-surface reader-practice-card reader-practice-actions rounded-3xl p-6 sm:p-8 transition-colors duration-300 ${bottomCardBgClass}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
              Next steps
            </span>
            <h3 className={`font-serif text-xl sm:text-2xl font-bold mt-0.5 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
              Practice what you read
            </h3>
          </div>
          <p className="text-xs opacity-80 max-w-md">
            Choose an activity to review the vocabulary and structures from this article.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={paths.flashcardStudy({ deck: articleData?.id || 'tet-holiday', level: selectedLevel })}
            className="reader-practice-primary flex items-center justify-between px-5 py-4 rounded-2xl bg-[#1E4B43] text-[#FBF7EE] text-xs font-bold shadow-sm hover:bg-[#163D37] border border-[#D9B76A]/50 transition-all group"
          >
            <span className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#D9B76A]" />
              Review flashcards ({articleData ? articleData.vocabularies.length : Object.keys(VOCAB_DATABASE).length} words)
            </span>
            <ArrowRight className="w-4 h-4 text-[#D9B76A] group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => alert("Dictation is being developed and will be available soon.")}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-bold border transition-all ${themeMode === "dark"
              ? "bg-[#18211E] text-[#FBF7EE] border-[#D9B76A]/20 hover:bg-[#232F2B]"
              : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
              }`}
          >
            <span className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 text-[#D9B76A]" />
              Practice dictation
            </span>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>

          <Link
            href="/community"
            className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-bold border transition-all group ${themeMode === "dark"
              ? "bg-[#18211E] text-[#FBF7EE] border-[#D9B76A]/20 hover:bg-[#232F2B]"
              : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
              }`}
          >
            <span className="flex items-center gap-2.5">
              <PenTool className="w-4 h-4 text-[#D9B76A]" />
              Write a reflection
            </span>
            <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
          </Link>
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
