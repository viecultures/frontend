import { useState, useEffect } from "react";
import {
  Volume2,
  CheckCircle2,
  XCircle,
  Flame,
  Sparkles,
  ChevronRight,
  Layers,
  Target,
  PenTool,
  Puzzle,
  Headphones,
} from "lucide-react";

interface Flashcard {
  id: string;
  word: string;
  pos: string;
  ipa: string;
  contextEn: string;
  viMeaning: string;
  viDefinition: string;
  options: string[];
  correctIndex: number;
}

const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: "card-1",
    word: "architectural",
    pos: "adjective",
    ipa: "/ˌɑːrkɪˈtektʃərəl/",
    contextEn:
      "Situated along the tranquil Perfume River, the Imperial City of Hue represents an extraordinary architectural accomplishment of 19th-century Vietnam.",
    viMeaning: "Thuộc về kiến trúc",
    viDefinition:
      "Liên quan đến nghệ thuật thiết kế, xây dựng các công trình lâu đài, đền đài hoặc di tích văn hóa.",
    options: [
      "Thuộc về kiến trúc",
      "Thuộc về lịch sử triều đại",
      "Phong cảnh sông nước thanh bình",
      "Nghệ thuật chạm khắc gỗ",
    ],
    correctIndex: 0,
  },
  {
    id: "card-2",
    word: "citadel",
    pos: "noun",
    ipa: "/ˈsɪt.ə.del/",
    contextEn:
      "The ancient citadel is enclosed by massive stone walls and surrounded by a protective moat.",
    viMeaning: "Thành trì, kinh thành cổ",
    viDefinition:
      "Tòa thành kiên cố bảo vệ trung tâm quyền lực triều đình phong kiến.",
    options: [
      "Thành trì, kinh thành cổ",
      "Khu chợ sầm uất",
      "Con đường lát đá",
      "Làng nghề truyền thống",
    ],
    correctIndex: 0,
  },
  {
    id: "card-3",
    word: "craftsmanship",
    pos: "noun",
    ipa: "/ˈkræftsmən.ʃɪp/",
    contextEn:
      "Every carved wooden pillar and lacquered roof tile showcases the breathtaking craftsmanship of Nguyen Dynasty artisans.",
    viMeaning: "Tay nghề thủ công tinh xảo",
    viDefinition:
      "Kỹ năng và độ khéo léo bậc thầy trong sáng tạo nghệ thuật thủ công.",
    options: [
      "Kỹ thuật chế tạo máy móc",
      "Tay nghề thủ công tinh xảo",
      "Tranh vẽ dân gian",
      "Lễ hội âm nhạc",
    ],
    correctIndex: 1,
  },
  {
    id: "card-4",
    word: "imperial",
    pos: "adjective",
    ipa: "/ɪmˈpɪr.i.əl/",
    contextEn:
      "Hue served as the imperial capital of Vietnam for over a century under thirteen Nguyen emperors.",
    viMeaning: "Hoàng gia, thuộc triều đình",
    viDefinition: "Thuộc về hoàng đế, triều đại phong kiến hoặc cung đình.",
    options: [
      "Dân dã, bình dị",
      "Thương mại quốc tế",
      "Hoàng gia, thuộc triều đình",
      "Hiện đại, đô thị",
    ],
    correctIndex: 2,
  },
  {
    id: "card-5",
    word: "preservation",
    pos: "noun",
    ipa: "/ˌprez.ɚˈveɪ.ʃən/",
    contextEn:
      "International organization efforts focus on the meticulous preservation of UNESCO heritage sites.",
    viMeaning: "Sự bảo tồn di sản",
    viDefinition: "Hành động giữ gìn, bảo vệ di tích văn hóa không bị hư hại.",
    options: [
      "Sự phát triển đô thị",
      "Sự bảo tồn di sản",
      "Sự phá vỡ cấu trúc",
      "Sự mở rộng thương mại",
    ],
    correctIndex: 1,
  },
];

interface MatchItem {
  id: string;
  pairId: string;
  text: string;
  type: "en" | "vi";
  matched?: boolean;
}

export default function FlashcardsPage() {
  // Practice Mode State
  const [activeMode, setActiveMode] = useState<
    "flip" | "mc" | "spelling" | "match" | "audio"
  >("flip");

  // Current Card Index
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Review Ratings Counter
  const [rememberedCount, setRememberedCount] = useState<number>(12);
  const [reviewCount, setReviewCount] = useState<number>(7);
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

  // Multiple Choice Mode State
  const [mcSelected, setMcSelected] = useState<number | null>(null);
  const [_mcIsCorrect, setMcIsCorrect] = useState<boolean | null>(null);

  // Spelling Mode State
  const [spellingInput, setSpellingInput] = useState<string>("");
  const [spellingFeedback, setSpellingFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [_showSpellingHint, setShowSpellingHint] = useState<boolean>(false);

  // Speed Match Mode State
  const [matchCards, setMatchCards] = useState<MatchItem[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [matchTimer] = useState<number>(15);

  const currentCard = FLASHCARDS_DATA[currentIndex];

  // Initialize Speed Match Game Items
  useEffect(() => {
    const pairs: MatchItem[] = [
      { id: "1-en", pairId: "1", text: "architectural", type: "en" },
      { id: "1-vi", pairId: "1", text: "Thuộc về kiến trúc", type: "vi" },
      { id: "2-en", pairId: "2", text: "citadel", type: "en" },
      { id: "2-vi", pairId: "2", text: "Thành trì, kinh thành cổ", type: "vi" },
      { id: "3-en", pairId: "3", text: "craftsmanship", type: "en" },
      {
        id: "3-vi",
        pairId: "3",
        text: "Tay nghề thủ công tinh xảo",
        type: "vi",
      },
      { id: "4-en", pairId: "4", text: "imperial", type: "en" },
      { id: "4-vi", pairId: "4", text: "Hoàng gia, triều đình", type: "vi" },
    ];
    // Shuffle pairs
    setMatchCards([...pairs].sort(() => Math.random() - 0.5));
  }, []);

  // Keyboard controls for Flip Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMode !== "flip") return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        handleRateCard(true);
      } else if (e.code === "ArrowLeft") {
        handleRateCard(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeMode, currentIndex]);

  // Rate card logic
  const handleRateCard = (remembered: boolean) => {
    if (remembered) {
      setRememberedCount((prev) => prev + 1);
      setReviewFeedback("🟢 Đã đánh dấu 'Đã nhớ'!");
    } else {
      setReviewCount((prev) => prev + 1);
      setReviewFeedback("🔴 Đã đánh dấu 'Cần ôn lại'!");
    }
    setTimeout(() => {
      setReviewFeedback(null);
      setIsFlipped(false);
      setCurrentIndex((prev) => (prev + 1) % FLASHCARDS_DATA.length);
    }, 600);
  };

  // Play Audio Pronunciation via Web Speech API
  const playAudioPrompt = (wordText?: string) => {
    const targetWord = wordText || currentCard.word;
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(targetWord);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Check Multiple Choice Selection
  const handleSelectMC = (index: number) => {
    setMcSelected(index);
    const correct = index === currentCard.correctIndex;
    setMcIsCorrect(correct);
  };

  // Check Spelling Input
  const handleCheckSpelling = () => {
    const val = spellingInput.trim().toLowerCase();
    if (val === currentCard.word.toLowerCase()) {
      setSpellingFeedback("correct");
    } else {
      setSpellingFeedback("incorrect");
    }
  };

  // Speed Match Selection Logic
  const handleSelectMatchCard = (card: MatchItem) => {
    if (card.matched) return;

    if (!selectedMatch) {
      setSelectedMatch(card);
    } else if (selectedMatch.id === card.id) {
      setSelectedMatch(null);
    } else {
      // Check if pair matches
      if (selectedMatch.pairId === card.pairId) {
        setMatchCards((prev) =>
          prev.map((item) =>
            item.pairId === card.pairId ? { ...item, matched: true } : item
          )
        );
        setSelectedMatch(null);
      } else {
        // Incorrect pair animation reset
        setSelectedMatch(card);
        setTimeout(() => setSelectedMatch(null), 400);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#FBF7EE] text-[#3F5550] relative selection:bg-[#BFE3EA] selection:text-[#1E4B43]">

      {/* Header Banner */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Practice Mode Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-[#F6EEDC] border border-[rgba(30,75,67,0.12)] shadow-sm mb-8">
          <button
            onClick={() => setActiveMode("flip")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeMode === "flip"
                ? "bg-[#1E4B43] text-[#FBF7EE] shadow-sm border border-[#D9B76A]/60"
                : "text-[#1E4B43] hover:bg-[#E8DFCB]"
              }`}
          >
            <Layers className="w-4 h-4 text-[#D9B76A]" />
            <span>🃏 Lật Thẻ 3D</span>
          </button>

          <button
            onClick={() => setActiveMode("mc")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeMode === "mc"
                ? "bg-[#1E4B43] text-[#FBF7EE] shadow-sm border border-[#D9B76A]/60"
                : "text-[#1E4B43] hover:bg-[#E8DFCB]"
              }`}
          >
            <Target className="w-4 h-4 text-[#D9B76A]" />
            <span>🎯 Trắc Nghiệm</span>
          </button>

          <button
            onClick={() => setActiveMode("spelling")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeMode === "spelling"
                ? "bg-[#1E4B43] text-[#FBF7EE] shadow-sm border border-[#D9B76A]/60"
                : "text-[#1E4B43] hover:bg-[#E8DFCB]"
              }`}
          >
            <PenTool className="w-4 h-4 text-[#D9B76A]" />
            <span>✍️ Gõ Từ</span>
          </button>

          <button
            onClick={() => setActiveMode("match")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeMode === "match"
                ? "bg-[#1E4B43] text-[#FBF7EE] shadow-sm border border-[#D9B76A]/60"
                : "text-[#1E4B43] hover:bg-[#E8DFCB]"
              }`}
          >
            <Puzzle className="w-4 h-4 text-[#D9B76A]" />
            <span>🧩 Nối Từ</span>
          </button>

          <button
            onClick={() => setActiveMode("audio")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeMode === "audio"
                ? "bg-[#1E4B43] text-[#FBF7EE] shadow-sm border border-[#D9B76A]/60"
                : "text-[#1E4B43] hover:bg-[#E8DFCB]"
              }`}
          >
            <Headphones className="w-4 h-4 text-[#D9B76A]" />
            <span>🎧 Luyện Nghe</span>
          </button>
        </div>

        {/* MODE 1: CLASSIC 3D FLIP CARD */}
        {activeMode === "flip" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Main Flashcard Container */}
            <div
              onClick={() => setIsFlipped((prev) => !prev)}
              className="relative min-h-[380px] p-8 sm:p-12 rounded-3xl bg-[#FBF7EE] border-2 border-[#D9B76A]/60 shadow-[0_12px_35px_rgba(30,75,67,0.12)] flex flex-col justify-between text-center cursor-pointer transition-transform duration-300 hover:scale-[1.005] select-none"
            >
              {/* Top Card Info Bar */}
              <div className="flex items-center justify-between text-xs font-bold text-[#6E7E79] uppercase tracking-wider">
                <span className="text-[#1E4B43]">
                  {isFlipped ? "Mặt Sau (Tiếng Việt)" : "Mặt Trước (Tiếng Anh)"}
                </span>
                <span>
                  Thẻ #{currentIndex + 1} / {FLASHCARDS_DATA.length}
                </span>
              </div>

              {/* Front Content */}
              {!isFlipped ? (
                <div className="my-auto py-6">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E4B43]">
                      {currentCard.word}
                    </h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudioPrompt(currentCard.word);
                      }}
                      className="p-2 rounded-full bg-[#F6EEDC] text-[#1E4B43] hover:bg-[#E8DFCB] transition-colors"
                      title="Phát âm"
                    >
                      <Volume2 className="w-5 h-5 text-[#D9B76A]" />
                    </button>
                  </div>
                  <p className="text-xs font-mono text-[#6E7E79] mb-4">
                    {currentCard.ipa} • {currentCard.pos}
                  </p>
                  <p className="text-sm sm:text-base italic text-[#3F5550] max-w-lg mx-auto leading-relaxed bg-[#F6EEDC]/50 p-4 rounded-2xl border border-[rgba(30,75,67,0.08)]">
                    "{currentCard.contextEn}"
                  </p>
                </div>
              ) : (
                /* Back Content */
                <div className="my-auto py-6">
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#059669] mb-3">
                    {currentCard.viMeaning}
                  </h2>
                  <p className="text-sm font-semibold text-[#1E4B43] max-w-md mx-auto leading-relaxed bg-[#ECFDF5] p-4 rounded-2xl border border-[#059669]/20">
                    Định nghĩa: {currentCard.viDefinition}
                  </p>
                </div>
              )}

              {/* Bottom Prompt */}
              <div className="text-xs font-semibold text-[#6E7E79] flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
                <span>
                  Click vào thẻ hoặc bấm phím <kbd className="px-2 py-0.5 rounded bg-[#F6EEDC] border border-[rgba(30,75,67,0.2)] font-mono text-[11px]">Space</kbd> để lật thẻ
                </span>
              </div>
            </div>

            {/* Review Feedback Toast */}
            {reviewFeedback && (
              <div className="text-center text-sm font-bold text-[#1E4B43] animate-pulse">
                {reviewFeedback}
              </div>
            )}

            {/* Spaced Repetition Binary Rating Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRateCard(false)}
                className="py-4 px-6 rounded-2xl bg-[#FBF7EE] border-2 border-[#991B1B] text-[#991B1B] font-bold text-sm hover:bg-[#FEF2F2] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <XCircle className="w-5 h-5" />
                <span>🔴 Cần ôn lại (Needs Review)</span>
              </button>

              <button
                onClick={() => handleRateCard(true)}
                className="py-4 px-6 rounded-2xl bg-[#FBF7EE] border-2 border-[#059669] text-[#059669] font-bold text-sm hover:bg-[#ECFDF5] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>🟢 Đã nhớ (Remembered)</span>
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="text-center text-xs font-medium text-[#6E7E79]">
              Phím tắt: <kbd className="px-1.5 py-0.5 rounded bg-[#F6EEDC]">← Mũi tên trái</kbd> (Cần ôn) |{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-[#F6EEDC]">Space</kbd> (Lật) |{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-[#F6EEDC]">Mũi tên phải →</kbd> (Đã nhớ)
            </div>
          </div>
        )}

        {/* MODE 2: MULTIPLE CHOICE */}
        {activeMode === "mc" && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] shadow-lg space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold text-[#6E7E79] uppercase">
              <span>Chế độ: Trắc nghiệm</span>
              <span>
                Câu {currentIndex + 1} / {FLASHCARDS_DATA.length}
              </span>
            </div>

            <div className="text-center py-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E7E79]">
                Nghĩa của từ sau là gì?
              </span>
              <h2 className="font-serif text-4xl font-bold text-[#1E4B43] mt-2 mb-3">
                {currentCard.word}
              </h2>
              <p className="text-xs sm:text-sm text-[#3F5550] italic max-w-md mx-auto">
                "{currentCard.contextEn}"
              </p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentCard.options.map((opt, idx) => {
                const isSelected = mcSelected === idx;
                const isCorrect = idx === currentCard.correctIndex;
                let btnStyle =
                  "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]";

                if (mcSelected !== null) {
                  if (isSelected && isCorrect) {
                    btnStyle = "bg-[#ECFDF5] text-[#059669] border-[#059669] font-bold";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-[#FEF2F2] text-[#991B1B] border-[#991B1B] font-bold";
                  } else if (isCorrect) {
                    btnStyle = "bg-[#ECFDF5] text-[#059669] border-[#059669]";
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectMC(idx)}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 ${btnStyle}`}
                  >
                    <span className="w-7 h-7 rounded-full bg-[#1E4B43]/10 text-[#1E4B43] font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {mcSelected !== null && (
              <div className="pt-4 text-center">
                <button
                  onClick={() => {
                    setMcSelected(null);
                    setMcIsCorrect(null);
                    setCurrentIndex((prev) => (prev + 1) % FLASHCARDS_DATA.length);
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4 text-[#D9B76A]" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 3: SPELLING WRITE MODE */}
        {activeMode === "spelling" && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] shadow-lg space-y-6 text-center animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold text-[#6E7E79] uppercase">
              <span>Chế độ: Gõ chính tả</span>
              <span>
                Câu {currentIndex + 1} / {FLASHCARDS_DATA.length}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E7E79]">
                Điền từ tiếng Anh tương ứng:
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#059669] mt-2 mb-2">
                "{currentCard.viMeaning}"
              </h3>
              <p className="text-xs sm:text-sm text-[#3F5550] italic max-w-lg mx-auto">
                "Situated along the Perfume River, the Imperial City represents an extraordinary{" "}
                <strong className="underline text-[#1E4B43]">[ ? ]</strong> accomplishment."
              </p>
            </div>

            {/* Input Box */}
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={spellingInput}
                  onChange={(e) => setSpellingInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckSpelling()}
                  placeholder="Gõ từ tiếng Anh vào đây..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#F6EEDC] border border-[rgba(30,75,67,0.2)] text-sm text-[#1E4B43] font-bold focus:outline-none focus:ring-2 focus:ring-[#1E4B43]/30"
                />
                <button
                  onClick={handleCheckSpelling}
                  className="px-6 py-3 rounded-2xl bg-[#1E4B43] text-[#FBF7EE] text-xs font-bold hover:bg-[#163D37] shrink-0 border border-[#D9B76A]/50"
                >
                  Kiểm tra
                </button>
              </div>

              {/* Hint button */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => {
                    setShowSpellingHint(true);
                    setSpellingInput(currentCard.word);
                  }}
                  className="text-xs font-semibold text-[#1E4B43] hover:underline"
                >
                  💡 Xem gợi ý từ
                </button>
              </div>

              {/* Feedback Alert */}
              {spellingFeedback === "correct" && (
                <div className="p-3 rounded-xl bg-[#ECFDF5] text-[#059669] text-xs font-bold flex items-center justify-center gap-2 border border-[#059669]/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Chính xác! "{currentCard.word}" là đáp án đúng.</span>
                </div>
              )}
              {spellingFeedback === "incorrect" && (
                <div className="p-3 rounded-xl bg-[#FEF2F2] text-[#991B1B] text-xs font-bold flex items-center justify-center gap-2 border border-[#991B1B]/30">
                  <XCircle className="w-4 h-4" />
                  <span>Chưa chính xác. Hãy thử lại hoặc xem gợi ý!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 4: SPEED MATCH GAME */}
        {activeMode === "match" && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] shadow-lg space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1E4B43]">
                  🧩 Nối từ tiếng Anh với nghĩa tiếng Việt
                </h3>
                <p className="text-xs text-[#6E7E79]">
                  Nhấp chọn 2 thẻ tương ứng để ghép cặp thành công!
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-[#F6EEDC] text-xs font-bold text-[#1E4B43] border border-[#D9B76A]/40">
                ⏱️ Thời gian: {matchTimer}s
              </div>
            </div>

            {/* Match Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {matchCards.map((card) => {
                const isSelected = selectedMatch?.id === card.id;
                let style =
                  "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.15)] hover:bg-[#E8DFCB]";

                if (card.matched) {
                  style =
                    "bg-[#ECFDF5] text-[#059669] border-[#059669] opacity-40 cursor-default pointer-events-none";
                } else if (isSelected) {
                  style =
                    "bg-[#1E4B43] text-[#FBF7EE] border-[#D9B76A] shadow-md scale-105 font-bold";
                }

                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectMatchCard(card)}
                    className={`p-4 h-28 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center text-center transition-all ${style}`}
                  >
                    {card.text}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* MODE 5: AUDIO PRONUNCIATION */}
        {activeMode === "audio" && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] shadow-lg space-y-6 text-center animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold text-[#6E7E79] uppercase">
              <span>Chế độ: Luyện nghe phát âm</span>
              <span>
                Câu {currentIndex + 1} / {FLASHCARDS_DATA.length}
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E7E79] block mb-4">
                Bấm nút để nghe âm thanh phát âm mẫu:
              </span>

              <button
                onClick={() => playAudioPrompt(currentCard.word)}
                className="w-20 h-20 rounded-full bg-[#1E4B43] text-[#FBF7EE] flex items-center justify-center mx-auto shadow-lg hover:bg-[#163D37] hover:scale-105 transition-all border-2 border-[#D9B76A]"
              >
                <Volume2 className="w-8 h-8 text-[#D9B76A]" />
              </button>

              <p className="text-sm font-bold text-[#1E4B43] mt-4">
                Phát âm chuẩn IPA:{" "}
                <span className="font-mono text-[#D9B76A]">{currentCard.ipa}</span>
              </p>
            </div>

            {/* Answer Options */}
            <div className="max-w-md mx-auto space-y-2.5">
              {currentCard.options.map((opt, idx) => (
                <button
                  key={opt}
                  onClick={() => handleSelectMC(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${mcSelected === idx && idx === currentCard.correctIndex
                      ? "bg-[#ECFDF5] text-[#059669] border-[#059669]"
                      : "bg-[#F6EEDC] text-[#1E4B43] border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tracker Panel */}
        <section className="mt-10 p-8 rounded-3xl bg-[#F6EEDC] border border-[rgba(30,75,67,0.12)] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[rgba(30,75,67,0.10)]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1E4B43] bg-[#1E4B43]/10 px-3 py-1 rounded-full">
                🎯 Mục tiêu hôm nay: 18 / 25 từ
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#D9B76A]/20 text-xs font-bold text-[#1E4B43] border border-[#D9B76A]/40">
                <Flame className="w-3.5 h-3.5 text-[#D9B76A] fill-[#D9B76A]" />
                5 Ngày liên tiếp
              </span>
            </div>
            <span className="text-xs font-bold text-[#059669]">
              Còn lại 7 từ nữa để hoàn thành!
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-[#E8DFCB] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1E4B43] to-[#059669] rounded-full transition-all duration-500"
              style={{ width: "72%" }}
            />
          </div>

          {/* Detailed Status Breakdown Pills */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs font-bold">
            <div className="p-3 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#059669]/20">
              <span>🟢 Đã nhớ:</span> <strong className="text-sm ml-1">{rememberedCount} từ</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FEF3C7] text-[#D97706] border border-[#D97706]/20">
              <span>🟡 Đang luyện:</span> <strong className="text-sm ml-1">6 từ</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FEF2F2] text-[#991B1B] border border-[#991B1B]/20">
              <span>🔴 Cần ôn lại:</span> <strong className="text-sm ml-1">{reviewCount} từ</strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
