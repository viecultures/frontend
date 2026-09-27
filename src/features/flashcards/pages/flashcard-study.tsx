import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  Target,
  PenTool,
  ArrowLeft,
  ChevronRight,
  Shuffle,
  Mic,
  Headphones,
  FileText,
  Lock,
} from "lucide-react";
import { LESSONS_DATA, type Lesson, getCefrBadgeStyle } from "@/data/discoveryData";
import { type Flashcard, getDeckCards } from "@/data/flashcardsData";
import FlashcardSidebarLayout from "../components/flashcard-sidebar-layout";

export default function FlashcardStudyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Selected deck id from query param or default
  const deckParam = searchParams.get("deck") || "imperial-hue";

  const activeLesson = useMemo(() => {
    return LESSONS_DATA.find((l) => l.id === deckParam) || LESSONS_DATA[0];
  }, [deckParam]);

  const defaultCards = useMemo(() => {
    return getDeckCards(activeLesson);
  }, [activeLesson]);

  // Deck shuffle and voice states
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [activeCards, setActiveCards] = useState<Flashcard[]>(defaultCards);
  const [isAutoAudio, setIsAutoAudio] = useState<boolean>(false);
  const [accentVoice, setAccentVoice] = useState<"en-US" | "en-GB">("en-US");

  // Player mode state
  const [playerMode, setPlayerMode] = useState<"flip" | "mc" | "spelling">("flip");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [mcSelected, setMcSelected] = useState<number | null>(null);
  const [spellingInput, setSpellingInput] = useState<string>("");
  const [spellingFeedback, setSpellingFeedback] = useState<"correct" | "incorrect" | null>(null);

  const currentCard = activeCards[currentIndex] || activeCards[0];

  useEffect(() => {
    setActiveCards(defaultCards);
    setIsShuffled(false);
  }, [defaultCards]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentIndex(0);
    setIsFlipped(false);
    setMcSelected(null);
    setSpellingInput("");
    setSpellingFeedback(null);
  }, [deckParam]);

  const toggleShuffle = () => {
    if (isShuffled) {
      setActiveCards(defaultCards);
      setIsShuffled(false);
    } else {
      const shuffled = [...defaultCards].sort(() => Math.random() - 0.5);
      setActiveCards(shuffled);
      setIsShuffled(true);
    }
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard shortcuts listener (Space = Flip, 1 = Review, 2 = Mastered, Left/Right = Nav)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "1" || e.code === "Digit1" || e.code === "Numpad1") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % activeCards.length);
      } else if (e.key === "2" || e.code === "Digit2" || e.code === "Numpad2") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % activeCards.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + activeCards.length) % activeCards.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % activeCards.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCards.length]);

  const playAudio = (wordText?: string) => {
    const word = wordText || currentCard.word;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = accentVoice;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  // Auto-play audio on card change if enabled
  useEffect(() => {
    if (isAutoAudio && currentCard) {
      playAudio(currentCard.word);
    }
  }, [currentIndex, isAutoAudio]);

  return (
    <FlashcardSidebarLayout>
      <div className="w-full space-y-5">
        {/* Active Deck Header Banner matching Reference Screenshot 1 */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[rgba(30,75,67,0.12)] w-full">
          {/* Left Title Section */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#6E7E79]">
                ĐANG HỌC • BỘ THẺ
              </span>
              <h1 className="font-serif text-lg sm:text-xl font-bold text-[#1E4B43] truncate flex items-center gap-2">
                <span className="truncate">{activeLesson.title}</span>
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#059669]/20 font-sans shadow-2xs shrink-0 whitespace-nowrap">
                  {activeLesson.categoryVi}
                </span>
              </h1>
            </div>
          </div>

          {/* Right Action Controls Toolbar */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            {/* 1. Trộn thẻ */}
            <button
              onClick={toggleShuffle}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer shadow-2xs ${isShuffled
                ? "bg-[#1E4B43] text-[#FBF7EE] border-[#1E4B43]"
                : "bg-white text-[#1E4B43] border-[rgba(30,75,67,0.2)] hover:bg-[#F6EEDC]"
                }`}
            >
              <Shuffle className="w-3.5 h-3.5 text-[#059669]" />
              <span>{isShuffled ? "Đã trộn" : "Trộn thẻ"}</span>
            </button>

            {/* 2. Tự động phát âm toggle */}
            <label className="px-3.5 py-1.5 rounded-full bg-white border border-[rgba(30,75,67,0.2)] text-xs font-semibold text-[#1E4B43] flex items-center gap-2 cursor-pointer shadow-2xs hover:bg-[#F6EEDC] transition-all select-none">
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Tự động phát âm</span>
              </div>
              <input
                type="checkbox"
                checked={isAutoAudio}
                onChange={(e) => setIsAutoAudio(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors ${isAutoAudio ? "bg-[#059669]" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`bg-white w-3 h-3 rounded-full shadow-xs transform transition-transform ${isAutoAudio ? "translate-x-3" : "translate-x-0"
                    }`}
                />
              </div>
            </label>

            {/* 3. Giọng đọc (US / UK Dropdown) */}
            <div className="relative inline-flex items-center">
              <Mic className="w-3.5 h-3.5 absolute left-3 text-[#059669] pointer-events-none" />
              <select
                value={accentVoice}
                onChange={(e) => setAccentVoice(e.target.value as "en-US" | "en-GB")}
                className="pl-8 pr-7 py-1.5 rounded-full bg-white border border-[rgba(30,75,67,0.2)] text-xs font-semibold text-[#1E4B43] shadow-2xs focus:outline-none cursor-pointer appearance-none hover:bg-[#F6EEDC] transition-all"
              >
                <option value="en-US">Giọng Anh (US)</option>
                <option value="en-GB">Giọng Anh (UK)</option>
              </select>
              <ChevronRight className="w-3 h-3 rotate-90 absolute right-2.5 text-[#1E4B43] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Simple Progress Bar matching reference image 2 */}
        <div className="flex items-center gap-3 text-xs font-bold text-[#1E4B43]">
          <span className="shrink-0 font-serif text-sm">
            Thẻ <span className="font-extrabold text-[#1E4B43]">{currentIndex + 1}</span>{" "}
            <span className="text-[#6E7E79]/70 font-normal">/ {activeCards.length}</span>
          </span>
          <div className="flex-1 bg-[#F6EEDC] h-3 rounded-full relative flex items-center border border-[#D9B76A]/30 overflow-hidden">
            <div
              className="bg-[#D9B76A] h-full rounded-full transition-all duration-300 relative flex items-center justify-end"
              style={{ width: `${Math.max(2, ((currentIndex + 1) / activeCards.length) * 100)}%` }}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-[#D9B76A] border-2 border-white shadow-xs absolute -right-1.5 shrink-0" />
            </div>
          </div>
          <span className="shrink-0 text-[#92400E] font-bold text-xs">
            {Math.round(((currentIndex + 1) / activeCards.length) * 100)}%
          </span>
        </div>

        {/* Player Mode Navigation Bar matching Reference Screenshot 1 */}
        <div className="p-1.5 bg-white border border-[rgba(30,75,67,0.15)] rounded-2xl shadow-xs flex items-center justify-center gap-1 sm:gap-2 max-w-lg mx-auto w-full">
          <button
            onClick={() => setPlayerMode("flip")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${playerMode === "flip"
              ? "bg-[#1E4B43] text-white shadow-xs"
              : "text-[#1E4B43] hover:bg-[#F6EEDC]/60"
              }`}
          >
            <Layers className={`w-4 h-4 ${playerMode === "flip" ? "text-[#D9B76A]" : "text-[#1E4B43]"}`} />
            <span>Lật Thẻ 3D</span>
          </button>

          <button
            onClick={() => setPlayerMode("mc")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${playerMode === "mc"
              ? "bg-[#1E4B43] text-white shadow-xs"
              : "text-[#1E4B43] hover:bg-[#F6EEDC]/60"
              }`}
          >
            <Target className={`w-4 h-4 ${playerMode === "mc" ? "text-[#D9B76A]" : "text-[#1E4B43]"}`} />
            <span>Trắc Nghiệm</span>
          </button>

          <button
            onClick={() => setPlayerMode("spelling")}
            className={`flex-1 py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${playerMode === "spelling"
              ? "bg-[#1E4B43] text-white shadow-xs"
              : "text-[#1E4B43] hover:bg-[#F6EEDC]/60"
              }`}
          >
            <PenTool className={`w-4 h-4 ${playerMode === "spelling" ? "text-[#D9B76A]" : "text-[#1E4B43]"}`} />
            <span>Gõ Từ</span>
          </button>
        </div>

        {/* MODE 1: FLIP CARD */}
        {playerMode === "flip" && (
          <div className="space-y-4 animate-in fade-in duration-200 w-full">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-[380px] p-8 sm:p-10 rounded-3xl bg-white border border-[rgba(30,75,67,0.15)] shadow-sm flex flex-col justify-between text-center cursor-pointer transition-all hover:border-[#1E4B43] select-none"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#6E7E79]">
                <span className="text-[#059669]">
                  {isFlipped ? "Mặt Sau (Nghĩa Tiếng Việt)" : "Mặt Trước (Tiếng Anh)"}
                </span>
                <span>Thẻ {currentIndex + 1} / {activeCards.length}</span>
              </div>

              {!isFlipped ? (
                <div className="my-auto space-y-3">
                  <div className="flex items-center justify-center gap-3">
                    <h3 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#1E4B43]">
                      {currentCard.word}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(currentCard.word);
                      }}
                      className="p-2.5 rounded-full bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5] transition-colors"
                      title="Phát âm"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-[#6E7E79]">{currentCard.ipa} • {currentCard.pos}</p>
                  <p className="text-xs sm:text-sm italic text-[#3F5550] max-w-lg mx-auto bg-[#F6EEDC]/60 p-4 rounded-2xl border border-[rgba(30,75,67,0.08)]">
                    "{currentCard.contextEn}"
                  </p>
                </div>
              ) : (
                <div className="my-auto space-y-3">
                  <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#059669]">
                    {currentCard.viMeaning}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#1E4B43] max-w-md mx-auto bg-[#ECFDF5] p-4 rounded-2xl border border-[#059669]/20">
                    {currentCard.viDefinition}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#6E7E79]">
                <span>Nhấp vào thẻ hoặc ấn</span>
                <kbd className="px-2 py-0.5 rounded-md bg-[#F6EEDC] text-[#1E4B43] text-[10px] font-mono border border-[rgba(30,75,67,0.2)] shadow-2xs">Space</kbd>
                <span>để lật mặt</span>
              </div>
            </div>

            {/* Bottom action buttons matching Screenshot 1 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => (prev + 1) % activeCards.length);
                }}
                className="py-3.5 rounded-2xl bg-white border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50 flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Cần ôn lại</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">1</span>
              </button>

              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => (prev + 1) % activeCards.length);
                }}
                className="py-3.5 rounded-2xl bg-white border border-[#059669] text-[#059669] font-bold text-xs hover:bg-[#ECFDF5] flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Đã thuộc từ này</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">2</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: MULTIPLE CHOICE */}
        {playerMode === "mc" && (
          <div className="w-full min-h-[380px] p-8 sm:p-10 rounded-3xl bg-white border border-[rgba(30,75,67,0.15)] shadow-sm flex flex-col justify-between space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2 my-auto">
              <span className="text-xs font-bold text-[#6E7E79]">Nghĩa của từ sau là gì?</span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E4B43]">{currentCard.word}</h3>
              <p className="text-xs sm:text-sm italic text-[#3F5550]">"{currentCard.contextEn}"</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {currentCard.options?.map((opt, idx) => (
                <button
                  key={opt}
                  onClick={() => setMcSelected(idx)}
                  className={`p-5 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all cursor-pointer ${mcSelected === idx
                    ? idx === currentCard.correctIndex
                      ? "bg-[#ECFDF5] text-[#059669] border-[#059669] shadow-xs"
                      : "bg-rose-50 text-rose-700 border-rose-400 shadow-xs"
                    : "bg-[#F6EEDC]/50 text-[#1E4B43] border-[rgba(30,75,67,0.1)] hover:bg-[#F6EEDC] hover:border-[#1E4B43]/30"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {mcSelected !== null && (
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setMcSelected(null);
                    setCurrentIndex((prev) => (prev + 1) % activeCards.length);
                  }}
                  className="px-8 py-3 rounded-full text-xs font-bold text-white bg-[#1E4B43] hover:bg-[#163D37] cursor-pointer inline-flex items-center gap-1.5 shadow-md"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4 text-[#D9B76A]" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: SPELLING */}
        {playerMode === "spelling" && (
          <div className="w-full min-h-[380px] p-8 sm:p-10 rounded-3xl bg-white border border-[rgba(30,75,67,0.15)] shadow-sm flex flex-col justify-between text-center space-y-6 animate-in fade-in duration-200">
            <div className="my-auto space-y-2">
              <span className="text-xs font-bold text-[#6E7E79]">Gõ từ tiếng Anh tương ứng:</span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#059669] mt-1">"{currentCard.viMeaning}"</h3>
            </div>

            <div className="w-full max-w-xl mx-auto space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={spellingInput}
                  onChange={(e) => setSpellingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (spellingInput.trim().toLowerCase() === currentCard.word.toLowerCase()) {
                        setSpellingFeedback("correct");
                      } else {
                        setSpellingFeedback("incorrect");
                      }
                    }
                  }}
                  placeholder="Gõ từ tại đây và ấn Enter..."
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#F6EEDC]/60 border-2 border-[rgba(30,75,67,0.2)] text-sm text-[#1E4B43] font-bold focus:outline-none focus:border-[#1E4B43]"
                />
                <button
                  onClick={() => {
                    if (spellingInput.trim().toLowerCase() === currentCard.word.toLowerCase()) {
                      setSpellingFeedback("correct");
                    } else {
                      setSpellingFeedback("incorrect");
                    }
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-[#1E4B43] hover:bg-[#163D37] text-white text-xs font-bold cursor-pointer shrink-0 shadow-sm"
                >
                  Kiểm tra
                </button>
              </div>

              {spellingFeedback === "correct" && (
                <div className="p-3.5 rounded-2xl bg-[#ECFDF5] text-[#059669] text-xs font-bold border border-[#059669]/30">
                  ✓ Chính xác! "{currentCard.word}"
                </div>
              )}
              {spellingFeedback === "incorrect" && (
                <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                  ✕ Chưa đúng. Đáp án là: "{currentCard.word}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: Practice Modes Grid matching Reference Screenshot 2 */}
        <div className="pt-6 space-y-4 border-t border-[rgba(30,75,67,0.12)]">
          {/* Practice Modes Section Header */}
          <div className="space-y-3.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#6E7E79] block">
              CHẾ ĐỘ LUYỆN TẬP
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {/* 1. Quiz - Orange */}
              <div
                onClick={() => {
                  setPlayerMode("mc");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`p-4 rounded-2xl text-white space-y-3 shadow-md cursor-pointer transition-transform hover:scale-[1.02] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#E67E22] to-[#D35400] ${playerMode === "mc" ? "ring-4 ring-amber-300" : ""
                  }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/95 text-[#D35400] flex items-center justify-center shadow-xs">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">Quiz</h4>
                  <p className="text-[10px] text-amber-100 font-medium">Trắc nghiệm nhanh</p>
                </div>
              </div>

              {/* 2. Listening - Emerald Green */}
              <div
                onClick={() => {
                  setPlayerMode("spelling");
                  playAudio();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="p-4 rounded-2xl text-white space-y-3 shadow-md cursor-pointer transition-transform hover:scale-[1.02] flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-[#27AE60] to-[#1E4B43]"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/95 text-[#1E4B43] flex items-center justify-center shadow-xs">
                    <Headphones className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">Listening</h4>
                  <p className="text-[10px] text-emerald-100 font-medium">Nghe và gõ lại</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FlashcardSidebarLayout>
  );
}
