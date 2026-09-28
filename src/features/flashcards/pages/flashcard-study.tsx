import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { LESSONS_DATA } from "@/data/discoveryData";
import { type Flashcard, getDeckCards } from "@/data/flashcardsData";
import FlashcardSidebarLayout from "../components/flashcard-sidebar-layout";
import {
  FlashcardStudyHeader,
  FlashcardProgressBar,
  FlashcardModeTabs,
  type PlayerMode,
  FlashcardFlipView,
  FlashcardMultipleChoiceView,
  FlashcardSpellingView,
  FlashcardPracticeModesGrid,
} from "../components";

export default function FlashcardStudyPage() {
  const [searchParams] = useSearchParams();

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
  const [playerMode, setPlayerMode] = useState<PlayerMode>("flip");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [mcSelected, setMcSelected] = useState<number | null>(null);
  const [spellingInput, setSpellingInput] = useState<string>("");
  const [spellingFeedback, setSpellingFeedback] = useState<
    "correct" | "incorrect" | null
  >(null);

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
  }, [activeCards.length]);

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
    if (isAutoAudio && currentCard) {
      playAudio(currentCard.word);
    }
  }, [currentIndex, isAutoAudio]);

  const handleCheckSpelling = () => {
    if (!currentCard) return;
    if (spellingInput.trim().toLowerCase() === currentCard.word.toLowerCase()) {
      setSpellingFeedback("correct");
    } else {
      setSpellingFeedback("incorrect");
    }
  };

  return (
    <FlashcardSidebarLayout>
      <div className="w-full space-y-5">
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
          currentIndex={currentIndex}
          totalCards={activeCards.length}
        />

        {/* Player Mode Navigation Bar */}
        <FlashcardModeTabs
          playerMode={playerMode}
          onChangeMode={setPlayerMode}
        />

        {/* MODE 1: FLIP CARD */}
        {playerMode === "flip" && currentCard && (
          <FlashcardFlipView
            card={currentCard}
            isFlipped={isFlipped}
            onToggleFlip={() => setIsFlipped(!isFlipped)}
            currentIndex={currentIndex}
            totalCards={activeCards.length}
            onPlayAudio={playAudio}
            onReviewLater={() => {
              setIsFlipped(false);
              setCurrentIndex((prev) => (prev + 1) % activeCards.length);
            }}
            onMastered={() => {
              setIsFlipped(false);
              setCurrentIndex((prev) => (prev + 1) % activeCards.length);
            }}
          />
        )}

        {/* MODE 2: MULTIPLE CHOICE */}
        {playerMode === "mc" && currentCard && (
          <FlashcardMultipleChoiceView
            card={currentCard}
            mcSelected={mcSelected}
            onSelectOption={setMcSelected}
            onNextQuestion={() => {
              setMcSelected(null);
              setCurrentIndex((prev) => (prev + 1) % activeCards.length);
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

        {/* BOTTOM SECTION: Practice Modes Grid */}
        <FlashcardPracticeModesGrid
          playerMode={playerMode}
          onSelectQuiz={() => {
            setPlayerMode("mc");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onSelectListening={() => {
            setPlayerMode("spelling");
            playAudio();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </FlashcardSidebarLayout>
  );
}
