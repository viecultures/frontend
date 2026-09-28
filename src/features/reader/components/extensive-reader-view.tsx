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
              Highlight từ vựng trọng tâm
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
            Phần 1: Nguồn gốc & Phong tục
          </button>
          <button
            onClick={() => setActivePart("part6")}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${activePart === "part6"
              ? "bg-[#2563EB] text-white shadow-sm"
              : "bg-[#E2E8F0] text-[#475569] hover:bg-[#CBD5E1]"
              }`}
          >
            Phần 2: Ẩm thực & Ba miền
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
                EN • EXTENSIVE
              </span>
              <span className="text-xs font-semibold text-[#D9B76A]">
                ~370 words • B2–C1
              </span>
            </div>

            {/* English Title & Subtitle */}
            <h1
              className={`${fontFamily === "serif" ? "font-serif" : "font-sans"
                } text-2xl sm:text-3xl font-bold ${paperTitleColor} leading-snug mb-3`}
            >
              Tết: Renewal, Remembrance and Regional Flavours
            </h1>
            <p className={`font-serif italic text-sm sm:text-base ${paperSubtitleColor} mb-6`}>
              A cultural exploration of renewal, ancestral gratitude, and rich regional culinary traditions
            </p>

            {/* Traditional Vietnamese Tết Artwork Banner */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-8 shadow-md border border-[#D9B76A]/40 group">
              <img
                src="https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80"
                alt="Tết Nguyên Đán Traditional Holiday"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
              <div className="absolute inset-2 border border-[#D9B76A]/30 rounded-xl pointer-events-none" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-bold text-[#D9B76A] uppercase tracking-wider">
                <span className="bg-[#1E4B43]/80 backdrop-blur-xs px-2.5 py-1 rounded-md border border-[#D9B76A]/40 text-[#FBF7EE]">
                  Cultural Essay
                </span>
                <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md text-[#D9B76A]">
                  Level B2–C1 • Extensive Mode
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
                <div>
                  <span className="text-xs text-[#D9B76A] font-semibold uppercase tracking-wider block mb-0.5">
                    Vietnamese Lunar New Year
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FBF7EE] drop-shadow-md">
                    Tết Nguyên Đán Heritage
                  </h3>
                </div>
                <div className="text-[11px] text-[#BFE3EA] font-sans opacity-90 text-left sm:text-right">
                  VieCultures Cultural Reader
                </div>
              </div>
            </div>

            {/* Paragraphs with Vocab Highlights */}
            <div
              className={`space-y-4 leading-relaxed ${paperBodyTextColor} ${fontFamily === "serif" ? "font-serif" : "font-sans"
                }`}
              style={{ fontSize: `${fontSize}px` }}
            >
              <p>
                Tết Nguyên Đán, often called simply Tết, is described as the most important and{" "}
                <button
                  onClick={() => openVocab("sacred")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  sacred
                </button>{" "}
                holiday in Vietnamese culture. It marks the{" "}
                <button
                  onClick={() => openVocab("passage")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  passage from the old year to the new one
                </button>
                , but its meaning goes further. According to the article, Tết stands for{" "}
                <button
                  onClick={() => openVocab("family-reunion")}
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
                  onClick={() => openVocab("agricultural-civilization")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  agricultural civilization
                </button>{" "}
                of East Asia, where the cycle of the seasons played a central role in daily life. Tết takes place when winter{" "}
                <button
                  onClick={() => openVocab("give-way-to")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  gives way to
                </button>{" "}
                spring and plants begin to grow again, which{" "}
                <button
                  onClick={() => openVocab("symbolize")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  symbolizes
                </button>{" "}
                a new beginning. A{" "}
                <button
                  onClick={() => openVocab("folk-legend")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  folk legend
                </button>{" "}
                also says that the festival is a time for descendants to remember their ancestors and pray for a good harvest. Over time, Tết{" "}
                <button
                  onClick={() => openVocab("absorb-influences")}
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
                  onClick={() => openVocab("five-fruit-tray")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  five-fruit tray
                </button>
                , and wrap bánh chưng or bánh tét together. During the holiday, families hold{" "}
                <button
                  onClick={() => openVocab("ancestor-worship")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  ancestor worship
                </button>{" "}
                ceremonies, exchange New Year wishes, give{" "}
                <button
                  onClick={() => openVocab("li-xi")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  lì xì
                </button>{" "}
                to children, and visit pagodas. Afterwards, people take part in spring festivals to wish for good luck. Although the way Vietnamese people celebrate has changed, the article argues that the{" "}
                <button
                  onClick={() => openVocab("core-values")}
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
                  onClick={() => openVocab("dua-hanh")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  Dưa hành
                </button>{" "}
                balances rich, protein-heavy dishes, and thịt kho tàu with duck eggs represents fullness and{" "}
                <button
                  onClick={() => openVocab("prosperity")}
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
                  onClick={() => openVocab("atmosphere")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  atmosphere
                </button>{" "}
                of Tết{" "}
                <button
                  onClick={() => openVocab("differ-from-region-to-region")}
                  className={isHighlightEnabled ? vocabBtnClass : ""}
                  title="Nhấp để xem từ vựng"
                >
                  differs from region to region
                </button>
                . In the North, it is linked to peach blossoms, bánh chưng, and solemn customs, with a busy Tết market and a nostalgic mood. The Central region celebrates in a simpler but equally warm way, with yellow mai flowers, red couplets, and dishes such as nem chua and tré. In the South, Tết feels lively and open, with mai flowers, red watermelons, flower markets, and folk games.
              </p>
            </div>
          </div>
        </div>

        {/* Right 3 Cols (30% Area): Side-by-Side Practice Questions Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#1E4B43]/30 border border-[#D9B76A]/30 mb-2">
            <h3 className="font-heading font-bold text-xs text-[#FBF7EE] flex items-center justify-between">
              <span>Câu Hỏi Luyện Tập Đọc Hiểu</span>
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
              Ôn Tập Flashcards (16 từ bài đọc)
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
