import React, { useState } from "react";
import Link from "@/components/Link";
import { Info, Layers, Headphones, PenTool, ArrowRight, ChevronRight } from "lucide-react";
import { EXTENSIVE_QUESTIONS } from "@/data/readerData";

interface ExtensiveReaderViewProps {
  themeMode: "olive" | "paper" | "dark";
  fontFamily: "serif" | "sans";
  fontSize: number;
  paperSheetBgClass: string;
  paperTitleColor: string;
  paperSubtitleColor: string;
  paperBodyTextColor: string;
  vocabBtnClass: string;
  bottomCardBgClass: string;
  openVocab: (key: string) => void;
}

export const ExtensiveReaderView: React.FC<ExtensiveReaderViewProps> = ({
  themeMode,
  fontFamily,
  fontSize,
  paperSheetBgClass,
  paperTitleColor,
  paperSubtitleColor,
  paperBodyTextColor,
  vocabBtnClass,
  bottomCardBgClass,
  openVocab,
}) => {
  const [isHighlightEnabled, setIsHighlightEnabled] = useState<boolean>(true);
  const [activePart, setActivePart] = useState<"part5" | "part6">("part6");
  const [extensiveAnswers, setExtensiveAnswers] = useState<Record<string, string>>({});
  const [focusedQuestionId, setFocusedQuestionId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Sub-toolbar: Highlight Toggle & Part 1 / Part 2 Tags */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1E2925]/80 border border-[#D9B76A]/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHighlightEnabled(!isHighlightEnabled)}
            className="flex items-center gap-2 text-xs font-bold text-[#FBF7EE] cursor-pointer group select-none"
          >
            <div
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${isHighlightEnabled ? "bg-[#2563EB]" : "bg-white/20"
                }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${isHighlightEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </div>
            <span className="flex items-center gap-1">
              Highlight nội dung
              <span title="Bật/tắt đánh dấu từ vựng và câu hỏi trong bài đọc">
                <Info className="w-3.5 h-3.5 text-[#BFE3EA] hover:text-white cursor-pointer" />
              </span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActivePart("part5")}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${activePart === "part5"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "bg-[#E2E8F0] text-[#475569] hover:bg-[#CBD5E1]"
              }`}
          >
            Part 1
          </button>
          <button
            onClick={() => setActivePart("part6")}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${activePart === "part6"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "bg-[#E2E8F0] text-[#475569] hover:bg-[#CBD5E1]"
              }`}
          >
            Part 2
          </button>
        </div>
      </div>

      {/* Extensive Reading Grid: Passage (7 cols / 70%) + Side-by-Side Questions (3 cols / 30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
        {/* Left 7 Cols (70% Area): Extended Article Reading Passage */}
        <div className={`lg:col-span-7 p-8 sm:p-10 rounded-3xl transition-colors duration-300 ${paperSheetBgClass}`}>
          <div>
            {/* Header Tag */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
              <span className="text-xs font-bold bg-[#2563EB] text-white px-2.5 py-0.5 rounded">
                EN
              </span>
            </div>

            {/* English Title & Subtitle */}
            <h1
              className={`${fontFamily === "serif" ? "font-serif" : "font-sans"
                } text-2xl sm:text-3xl font-bold ${paperTitleColor} leading-snug mb-3`}
            >
              How to be disgustingly educated
            </h1>
            <p className={`font-serif italic text-sm sm:text-base ${paperSubtitleColor} mb-6`}>
              A chaotic guide to becoming the most interesting person in the room
            </p>

            {/* Artwork Banner Canvas */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-br from-[#1E4B43] via-[#2A665B] to-[#D9B76A] p-6 text-white flex flex-col justify-between overflow-hidden mb-8 shadow-inner border border-[#D9B76A]/40">
              <div className="absolute inset-2 border border-[#D9B76A]/40 rounded-xl pointer-events-none" />
              <div className="flex items-center justify-between text-xs font-semibold text-[#D9B76A] uppercase tracking-wider">
                <span>Cultural Essay</span>
                <span>Level B1-B2 • Extensive Mode</span>
              </div>
              <div className="text-center my-auto">
                <span className="text-5xl block mb-2">📚✨</span>
                <span className="font-serif text-lg font-bold text-[#FBF7EE]">
                  The Intellectual Journey
                </span>
              </div>
              <div className="text-right text-[11px] text-[#BFE3EA]">
                Artwork Illustration • VieCultures Edition
              </div>
            </div>

            {/* Paragraphs with Vocab Highlights */}
            <div
              className={`space-y-4 leading-relaxed ${paperBodyTextColor} ${fontFamily === "serif" ? "font-serif" : "font-sans"
                }`}
              style={{ fontSize: `${fontSize}px` }}
            >
              <p>
                Hello my <em>love</em>,
              </p>

              <p>
                There’s a kind of person who’s so{" "}
                <button
                  onClick={() => openVocab("well-read")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  well-read
                </button>
                , so{" "}
                <button
                  onClick={() => openVocab("frighteningly-articulate")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  frighteningly articulate
                </button>
                , so mentally juicy that you want to both date them and punch them in the throat.
              </p>

              <p>You know the type.</p>

              <p>They quote Baldwin mid-conversation.</p>

              <p>
                They listen to podcasts at 1.5x speed while{" "}
                <button
                  onClick={() => openVocab("annotating-a-book")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  annotating a book
                </button>
                .
              </p>

              <p>
                They drop phrases like{" "}
                <button
                  onClick={() => openVocab("epistemic-frameworks")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  “epistemic frameworks”
                </button>{" "}
                and somehow make it work.
              </p>

              <p>
                This is your guide to becoming that person. Not for clout. Not for Instagram aesthetics. But for the{" "}
                <button
                  onClick={() => openVocab("indecent-pleasure")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  sheer, indecent pleasure
                </button>{" "}
                of being disgustingly educated.
              </p>
            </div>
          </div>
        </div>

        {/* Right 3 Cols (30% Area): Side-by-Side Practice Questions Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#1E4B43]/30 border border-[#D9B76A]/30 mb-2">
            <h3 className="font-heading font-bold text-xs text-[#FBF7EE] flex items-center justify-between">
              <span>Câu Hỏi Luyện Tập</span>
            </h3>
          </div>

          {EXTENSIVE_QUESTIONS.map((q) => {
            const selected = extensiveAnswers[q.id];
            const isFocused = focusedQuestionId === q.id;

            return (
              <div
                key={q.id}
                id={`question-${q.id}`}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${isFocused
                  ? "bg-[#1E4B43] border-[#D9B76A] shadow-xl ring-2 ring-[#D9B76A]/50"
                  : themeMode === "dark"
                    ? "bg-[#1E2925] border-[#D9B76A]/20"
                    : "bg-[#FBF7EE] border-[rgba(30,75,67,0.12)] shadow-sm"
                  }`}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-mono font-extrabold text-[11px] shadow-sm">
                    {q.num}
                  </span>
                  <span className="text-[11px] font-bold text-[#D9B76A] truncate">
                    Câu hỏi [Q{q.num}]
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

      {/* Extensive Mode: Horizontal 3-Column Next Learning Steps Only */}
      <div className={`rounded-3xl p-6 sm:p-8 transition-colors duration-300 ${bottomCardBgClass}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[rgba(217,183,106,0.2)]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
              Next Learning Steps
            </span>
            <h3 className={`font-serif text-xl sm:text-2xl font-bold mt-0.5 ${themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"}`}>
              Chế Độ Ôn Luyện Tiếp Theo
            </h3>
          </div>
          <p className="text-xs opacity-80 max-w-md">
            Lựa chọn phương thức thực hành tiếp theo để ghi nhớ từ vựng và cấu trúc ngữ pháp vừa học.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/flashcard-study"
            className="flex items-center justify-between px-5 py-4 rounded-2xl bg-[#1E4B43] text-[#FBF7EE] text-xs font-bold shadow-sm hover:bg-[#163D37] border border-[#D9B76A]/50 transition-all group"
          >
            <span className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#D9B76A]" />
              Ôn Tập Flashcards (5 từ bài đọc)
            </span>
            <ArrowRight className="w-4 h-4 text-[#D9B76A] group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => alert("Tính năng Dictation (Luyện chép chính tả) đang được phát triển, sẽ sớm ra mắt!")}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-bold border transition-all ${themeMode === "dark"
              ? "bg-[#18211E] text-[#FBF7EE] border-[#D9B76A]/20 hover:bg-[#232F2B]"
              : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
              }`}
          >
            <span className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 text-[#D9B76A]" />
              Luyện Chép Chính Tả (Dictation)
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
              Viết Bài Cảm Nghĩ (Reflection)
            </span>
            <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
