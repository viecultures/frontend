import React, { useState, useEffect } from 'react';
import {
  Layers,
  RotateCw,
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Award,
} from 'lucide-react';
import { READER_DEFAULT_FLASHCARDS, type QuickFlashcardItem } from '../data/learningLoopData';
import { paths } from '@/routes/paths';

interface ReaderQuickFlashcardsProps {
  themeMode?: 'paper' | 'dark';
  cards?: QuickFlashcardItem[];
  onOpenMocSonModal: () => void;
  deckId?: string;
  selectedLevel?: string;
}

export const ReaderQuickFlashcards: React.FC<ReaderQuickFlashcardsProps> = ({
  themeMode = 'paper',
  cards = READER_DEFAULT_FLASHCARDS,
  onOpenMocSonModal,
  deckId = 'tet-holiday',
  selectedLevel = 'Level 2',
}) => {
  const isDark = themeMode === 'dark';
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [rememberedIds, setRememberedIds] = useState<Set<string>>(new Set());
  const [reviewLaterIds, setReviewLaterIds] = useState<Set<string>>(new Set());

  const currentCard = cards[currentIndex] || cards[0];

  const playAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(word);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const markRemembered = () => {
    if (!currentCard) return;
    setRememberedIds((prev) => new Set(prev).add(currentCard.id));
    setReviewLaterIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const markReviewLater = () => {
    if (!currentCard) return;
    setReviewLaterIds((prev) => new Set(prev).add(currentCard.id));
    setRememberedIds((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  // Keyboard shortcut listener for active recall (Space = Flip, 1 = Review, 2 = Remembered)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === '1') {
        e.preventDefault();
        markReviewLater();
      } else if (e.key === '2') {
        e.preventDefault();
        markRemembered();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentCard, cards.length]);

  const totalReviewed = new Set([...rememberedIds, ...reviewLaterIds]).size;
  const isAllReviewed = totalReviewed >= Math.min(cards.length, 3);

  const containerBgClass = isDark
    ? 'bg-[#1E2925] text-warm-ivory border-antique-gold/30 shadow-xl'
    : 'bg-warm-ivory text-ink-soft border-heritage-green/12 shadow-xl';

  return (
    <div data-practice-theme={themeMode} className={`reader-practice-surface reader-practice-card reader-study-component reader-flashcards-component rounded-3xl p-6 sm:p-10 transition-colors duration-300 border space-y-6 ${containerBgClass}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-antique-gold/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
              Quick flashcards
            </span>
          </div>
          <h2 className={`font-sans text-2xl font-bold ${isDark ? 'text-warm-ivory' : 'text-heritage-green'}`}>
            Flip, recall and review
          </h2>
          <p className="text-xs sm:text-sm opacity-80 mt-1 leading-relaxed">
            Flip each card to check its meaning, then choose whether to review it again or mark it as remembered.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="reader-quick-stats flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Remembered: {rememberedIds.size}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Review: {reviewLaterIds.size}</span>
          </div>
        </div>
      </div>

      {/* Main Flashcard Interactive Area */}
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Flashcard Box with Flip Action */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsFlipped(!isFlipped)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsFlipped(!isFlipped);
            }
          }}
          className={`reader-quick-card relative min-h-[260px] sm:min-h-[290px] rounded-3xl p-6 sm:p-8 cursor-pointer transition-all duration-300 transform hover:scale-[1.01] border-2 shadow-lg flex flex-col justify-between ${
            isDark
              ? 'bg-[#141C1A] border-antique-gold/50 hover:border-antique-gold'
              : 'bg-rice-paper border-antique-gold/70 hover:border-antique-gold'
          }`}
        >
          {/* Card Top Indicator */}
          <div className="flex items-center justify-between text-xs font-bold opacity-75">
            <span className="flex items-center gap-1 text-antique-gold">
              <Layers className="w-3.5 h-3.5" />
              Card {currentIndex + 1} / {cards.length}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-stone-500">
              <RotateCw className="w-3 h-3" />
              {isFlipped ? 'Back · Meaning' : 'Front · Click to flip'}
            </span>
          </div>

          {/* Card Content: Front vs Back */}
          {!isFlipped ? (
            <div className="text-center py-6 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <h3 className="font-sans text-3xl sm:text-4xl font-extrabold text-heritage-green dark:text-antique-gold">
                  {currentCard.word}
                </h3>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(currentCard.word);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  title="Play pronunciation"
                >
                  <Volume2 className="w-5 h-5 text-antique-gold" />
                </button>
              </div>
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-mono bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {currentCard.pos}
              </span>
              <p className="text-xs sm:text-sm italic opacity-85 max-w-md mx-auto pt-2">
                "{currentCard.contextSentence}"
              </p>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3 animate-in fade-in duration-200">
              <div className="text-sm font-mono text-antique-gold font-bold">
                {currentCard.ipa}
              </div>
              <h4 className="font-sans text-xl sm:text-2xl font-bold text-heritage-green dark:text-white">
                {currentCard.viMeaning}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 flex items-start justify-center gap-1.5 text-left">
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Cultural context:</strong> {currentCard.culturalFact}</span>
              </p>
            </div>
          )}

          {/* Card Footer Helper */}
          <div className="text-center text-[11px] opacity-60">
            Space to flip · Arrow keys to change cards
          </div>
        </div>

        {/* Binary Evaluation Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={markReviewLater}
            aria-pressed={reviewLaterIds.has(currentCard.id)}
            className={`reader-quick-review flex items-center justify-center gap-2 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              reviewLaterIds.has(currentCard.id)
                ? 'bg-rose-500 text-white border-rose-600 shadow-md'
                : 'border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/20'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Review again</span>
          </button>

          <button
            type="button"
            onClick={markRemembered}
            aria-pressed={rememberedIds.has(currentCard.id)}
            className={`reader-quick-remember flex items-center justify-center gap-2 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              rememberedIds.has(currentCard.id)
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                : 'border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Remembered</span>
          </button>
        </div>

        {/* Navigation & Full Deck Link */}
        <div className="flex items-center justify-between text-xs pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-xl border border-antique-gold/30 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              title="Previous card"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-xl border border-antique-gold/30 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              title="Next card"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <a
            href={paths.flashcardStudy({ deck: deckId, level: selectedLevel })}
            className="reader-quick-deck-link inline-flex items-center gap-1.5 text-xs font-bold text-heritage-green dark:text-antique-gold hover:underline"
          >
            <span>Open full flashcard deck</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ── MILESTONE BANNER: ĐÓNG MỘC SON ─────────────────────────────────── */}
      <div className="mt-8 pt-6 border-t border-antique-gold/30">
        <div className="reader-quick-milestone rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#9E2A2B]/15 via-heritage-green/10 to-antique-gold/20 border-2 border-antique-gold flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9E2A2B] text-white">
                Lesson milestone
              </span>
              <span className="text-xs text-stone-500 font-sans">
                Keep your study streak going
              </span>
            </div>
            <h3 className="font-sans text-xl sm:text-2xl font-bold text-[#9E2A2B] dark:text-warm-ivory">
              You’ve completed this lesson!
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 max-w-xl">
              Add your <strong>heritage stamp</strong> to celebrate this lesson and continue your study streak.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenMocSonModal}
            className="w-full md:w-auto px-8 py-4 rounded-full bg-[#9E2A2B] hover:bg-[#852223] text-white font-sans font-bold text-sm sm:text-base shadow-[0_4px_25px_rgba(158,42,43,0.45)] border-2 border-antique-gold transition-all transform hover:scale-105 flex items-center justify-center gap-3 cursor-pointer shrink-0"
          >
            <Award className="w-5 h-5 text-antique-gold" />
            <span>Stamp and finish lesson</span>
            <BookOpen className="w-4 h-4 text-antique-gold" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReaderQuickFlashcards;
