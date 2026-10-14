import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { type Flashcard, resolveDeckCards, resolveLessonForDeck } from "@/data/flashcardsData";
import { useGamification } from "@/context/GamificationContext";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Compass,
  Home,
} from "lucide-react";
import FlashcardSidebarLayout from "../components/flashcard-sidebar-layout";
import {
  FlashcardStudyHeader,
  FlashcardProgressBar,
  FlashcardModeTabs,
  type PlayerMode,
  FlashcardFlipView,
  FlashcardMultipleChoiceView,
  FlashcardSpellingView,
} from "../components";

export default function FlashcardStudyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { earnReward } = useGamification();

  // Selected deck id from query param (supporting ?deck=, ?story=, ?article=)
  const deckParam =
    searchParams.get("deck") ||
    searchParams.get("story") ||
    searchParams.get("article") ||
    "imperial-hue";

  const activeLesson = useMemo(() => {
    return resolveLessonForDeck(deckParam);
  }, [deckParam]);

  const defaultCards = useMemo(() => {
    return resolveDeckCards(deckParam);
  }, [deckParam]);

  // Deck shuffle and voice states
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [activeCards, setActiveCards] = useState<Flashcard[]>(defaultCards);
  const [isAutoAudio, setIsAutoAudio] = useState<boolean>(false);
  const [accentVoice, setAccentVoice] = useState<"en-US" | "en-GB">("en-US");

  // Player mode state
  const [playerMode, setPlayerMode] = useState<PlayerMode>("flip");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [mcSelected, setMcSelected] = useState<number | null>(null);
  const [spellingInput, setSpellingInput] = useState<string>("");
  const [spellingFeedback, setSpellingFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);

  // Spaced Repetition Session Progress Tracking
  const [masteredCardIds, setMasteredCardIds] = useState<Set<string>>(new Set());
  const [reviewLaterCardIds, setReviewLaterCardIds] = useState<Set<string>>(new Set());
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);

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
    setMasteredCardIds(new Set());
    setReviewLaterCardIds(new Set());
    setIsSessionComplete(false);
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

  const completeSession = () => {
    setIsSessionComplete(true);
    earnReward("FLASHCARD_DECK_COMPLETED", { cardCount: activeCards.length });
  };

  const handleReviewLater = () => {
    if (!currentCard) return;
    setReviewLaterCardIds((prev) => new Set(prev).add(currentCard.id));
    setIsFlipped(false);
    if (currentIndex + 1 >= activeCards.length) {
      completeSession();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleMastered = () => {
    if (!currentCard) return;
    setMasteredCardIds((prev) => new Set(prev).add(currentCard.id));
    setIsFlipped(false);
    if (currentIndex + 1 >= activeCards.length) {
      completeSession();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestartSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredCardIds(new Set());
    setReviewLaterCardIds(new Set());
    setIsSessionComplete(false);
  };

  // Keyboard shortcuts listener (Space = Flip, 1 = Review, 2 = Mastered, Left/Right = Nav)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.target instanceof HTMLElement && (e.target.closest("input, textarea, select, button, [role='button'], [contenteditable='true']"))) ||
        playerMode !== "flip" ||
        isSessionComplete
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === "1" || e.code === "Digit1" || e.code === "Numpad1") {
        e.preventDefault();
        handleReviewLater();
      } else if (e.key === "2" || e.code === "Digit2" || e.code === "Numpad2") {
        e.preventDefault();
        handleMastered();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex(
          (prev) => (prev - 1 + activeCards.length) % activeCards.length
        );
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % activeCards.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCards.length, currentIndex, currentCard, isSessionComplete, playerMode]);

  const playAudio = (wordText?: string) => {
    const word = wordText || currentCard?.word;
    if (!word) return;
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
    if (isAutoAudio && currentCard && !isSessionComplete) {
      playAudio(currentCard.word);
    }
  }, [currentIndex, isAutoAudio, isSessionComplete]);

  const handleCheckSpelling = () => {
    if (!currentCard) return;
    if (spellingInput.trim().toLowerCase() === currentCard.word.toLowerCase()) {
      setSpellingFeedback("correct");
      setMasteredCardIds((prev) => new Set(prev).add(currentCard.id));
    } else {
      setSpellingFeedback("incorrect");
      setReviewLaterCardIds((prev) => new Set(prev).add(currentCard.id));
    }
  };

  return (
    <FlashcardSidebarLayout>
      <div className="vocab-study-page w-full">
        {/* Active Deck Header Banner */}
        <FlashcardStudyHeader
          activeLesson={activeLesson}
          isShuffled={isShuffled}
          onToggleShuffle={toggleShuffle}
          isAutoAudio={isAutoAudio}
          onToggleAutoAudio={setIsAutoAudio}
          accentVoice={accentVoice}
          onChangeVoice={setAccentVoice}
        />

        {/* Simple Progress Bar */}
        <FlashcardProgressBar
          currentIndex={isSessionComplete ? activeCards.length : currentIndex}
          totalCards={activeCards.length}
          isComplete={isSessionComplete}
        />

        {/* Player Mode Navigation Bar */}
        <FlashcardModeTabs
          playerMode={playerMode}
          onChangeMode={(mode) => {
            setPlayerMode(mode);
            setIsSessionComplete(false);
            setIsFlipped(false);
            setMcSelected(null);
            setSpellingInput("");
            setSpellingFeedback(null);
          }}
        />

        <div className="vocab-study-player">
        {/* SESSION COMPLETION SUMMARY VIEW */}
        {isSessionComplete ? (
          <div className="w-full max-w-2xl mx-auto rounded-3xl bg-surface border-2 border-line p-8 sm:p-10 shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-8 h-8 text-antique-gold" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                HOÀN THÀNH LƯỢT ÔN TẬP
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-green">
                {activeLesson.vietnameseTitle}
              </h2>
              <p className="text-xs text-text-body font-medium">
                {activeLesson.title}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã thuộc</span>
                </div>
                <span className="text-2xl font-mono font-black text-emerald-900">
                  {masteredCardIds.size} / {activeCards.length}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-800 mb-1">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Cần ôn lại</span>
                </div>
                <span className="text-2xl font-mono font-black text-rose-900">
                  {reviewLaterCardIds.size}
                </span>
              </div>
            </div>

            <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
              {reviewLaterCardIds.size === 0
                ? "Xuất sắc! Bạn đã ghi nhớ toàn bộ từ vựng mục tiêu của bài học này."
                : `Bạn đã hoàn thành ${activeCards.length} thẻ từ vựng. Các từ cần củng cố sẽ được đưa vào lịch ôn tập tiếp theo.`}
            </p>

            {/* Action Buttons: 1. Vận dụng AI Map, 2. Ôn lại bộ thẻ, 3. Về trang chủ */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  navigate(
                    `/playground?story=${encodeURIComponent(deckParam)}&topic=${encodeURIComponent(
                      activeLesson.title
                    )}`
                  );
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-heritage-green hover:bg-heritage-dark text-warm-ivory text-xs font-bold shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer focus-ring"
              >
                <Compass className="w-4 h-4 text-antique-gold" />
                <span>Vận dụng cùng AI Map</span>
              </button>

              <button
                type="button"
                onClick={handleRestartSession}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-surface border border-line hover:bg-mist-cloud text-text-body text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer focus-ring"
              >
                <RotateCcw className="w-3.5 h-3.5 text-text-secondary" />
                <span>Ôn lại bộ thẻ này</span>
              </button>

              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-surface border border-line hover:bg-mist-cloud text-text-body text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer focus-ring"
              >
                <Home className="w-3.5 h-3.5 text-text-secondary" />
                <span>Về Trang Chủ</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* MODE 1: FLIP CARD */}
            {playerMode === "flip" && currentCard && (
              <FlashcardFlipView
                card={currentCard}
                isFlipped={isFlipped}
                onToggleFlip={() => setIsFlipped(!isFlipped)}
                currentIndex={currentIndex}
                totalCards={activeCards.length}
                onPlayAudio={playAudio}
                onReviewLater={handleReviewLater}
                onMastered={handleMastered}
              />
            )}

            {/* MODE 2: MULTIPLE CHOICE */}
            {playerMode === "mc" && currentCard && (
              <FlashcardMultipleChoiceView
                card={currentCard}
                mcSelected={mcSelected}
                onSelectOption={setMcSelected}
                onNextQuestion={() => {
                  if (mcSelected === currentCard.correctIndex) {
                    setMasteredCardIds((prev) => new Set(prev).add(currentCard.id));
                  } else {
                    setReviewLaterCardIds((prev) => new Set(prev).add(currentCard.id));
                  }
                  setMcSelected(null);
                  if (currentIndex + 1 >= activeCards.length) {
                    completeSession();
                  } else {
                    setCurrentIndex((prev) => prev + 1);
                  }
                }}
              />
            )}

            {/* MODE 3: SPELLING */}
            {playerMode === "spelling" && currentCard && (
              <FlashcardSpellingView
                card={currentCard}
                spellingInput={spellingInput}
                onChangeInput={setSpellingInput}
                spellingFeedback={spellingFeedback}
                onCheckSpelling={handleCheckSpelling}
              />
            )}
          </>
        )}
        </div>

        {!isSessionComplete && <p className="vocab-study-tip">Một ít mỗi ngày, nhớ lâu hơn. Hãy đọc to từ vựng trước khi xem đáp án.</p>}
      </div>
    </FlashcardSidebarLayout>
  );
}
