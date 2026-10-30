import { useTranslation } from 'react-i18next';
import '../flashcard-study.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import {
  Volume2,
  BookOpen,
  ArrowLeft,
  AlertCircle,
  Shuffle,
  VolumeX,
  RotateCw,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Award,
} from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import type { RewardCelebrationPayload } from '@/types';
import {
  type Flashcard,
} from '@/data/flashcardsData';
import {
  readSavedVocabulary,
  getAllSavedVocabularies,
  readReviewSession,
  saveReviewSession,
} from '@/services/learning/learningStorage';
import FlashcardSidebarLayout from '../components/flashcard-sidebar-layout';
import {
  FlashcardProgressBar,
  FlashcardFlipView,
} from '../components';
import { cardsFromVocabulary, loadStudyDeck, type StudyDeck } from '../services/studyDeck';
import { persistVocabProgress } from '../services/vocabProgressService';
import {
  calculateNextSRS,
  getSRSState,
  saveSRSState,
  type AnkiRating,
  type CardSRSState,
} from '../services/srsEngine';
import { PATHS, paths } from '@/routes/paths';
import { MocSonSealModal, StreakBadge } from '@/features/gamification';

/**
 * FlashcardsPage: Full Anki Spaced-Repetition Experience for Vietnamese Cultural Heritage.
 * Features:
 * - 4-Level Anki Evaluation (Again, Hard, Good, Easy) with SM-2 calculated intervals
 * - In-session active recall queue cycling (Again re-queues until graduated)
 * - Anki status counter pill bar: [New] [Learning] [Graduated]
 * - Interactive Sample Cultural Decks Shelf with 1-click switching
 * - 100% SVG iconography, zero raw emojis
 */
export const FlashcardsPage: React.FC = () => {
  const { t } = useTranslation('flashcards');
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get('deck') || 'imperial-hue';
  const level = searchParams.get('level') || 'Level 1';
  const savedOnly = searchParams.get('saved') === 'true';

  const { earnReward } = useGamification();
  const [deck, setDeck] = useState<StudyDeck | null>(null);
  const [isLoadingDeck, setIsLoadingDeck] = useState<boolean>(true);
  const [reward, setReward] = useState<RewardCelebrationPayload | null>(null);

  // Deck & Card states
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [ratings, setRatings] = useState<Record<string, AnkiRating>>({});
  const [forgotCounts, setForgotCounts] = useState<Record<string, number>>({});
  const [cardSRSMap, setCardSRSMap] = useState<Record<string, CardSRSState>>({});
  const [cognitiveFatigueAlert, setCognitiveFatigueAlert] = useState<string | null>(null);
  const [isSealModalOpen, setIsSealModalOpen] = useState<boolean>(false);

  // View settings
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isAutoAudio, setIsAutoAudio] = useState<boolean>(false);
  const [accentVoice] = useState<'en-US' | 'en-GB'>('en-US');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  // Persistent storage key
  const sessionStorageKey = useMemo(() => {
    return `anki_${deckId}_${level}${savedOnly ? '_saved' : ''}`;
  }, [deckId, level, savedOnly]);

  // Load Deck & Cards
  useEffect(() => {
    let active = true;
    setIsLoadingDeck(true);

    async function loadData() {
      try {
        if (savedOnly) {
          const savedWords = readSavedVocabulary(deckId, level);
          const effectiveWords =
            savedWords.length > 0 ? savedWords : getAllSavedVocabularies();
          const loadedCards = cardsFromVocabulary(effectiveWords);
          if (active) {
            setCards(loadedCards);
            setQueue(loadedCards.map((c) => c.id));
          }
        }

        const loadedDeck = await loadStudyDeck(deckId, level);
        if (active && loadedDeck) {
          setDeck(loadedDeck);
          if (!savedOnly) {
            setCards(loadedDeck.cards);
            setQueue(loadedDeck.cards.map((c) => c.id));
          }
        }
      } catch (e) {
        console.error('[FlashcardsPage] Failed to load study deck:', e);
      } finally {
        if (active) setIsLoadingDeck(false);
      }
    }

    void loadData();
    return () => {
      active = false;
    };
  }, [deckId, level, savedOnly]);

  // Load SRS state for all cards
  useEffect(() => {
    if (!cards.length) return;
    const initialSRS: Record<string, CardSRSState> = {};
    for (const card of cards) {
      const existing = getSRSState(card.id) || getSRSState(card.word);
      if (existing) {
        initialSRS[card.id] = existing;
      }
    }
    setCardSRSMap(initialSRS);
  }, [cards]);

  // Restore saved session
  useEffect(() => {
    if (!cards.length) return;
    const cached = readReviewSession(sessionStorageKey) as {
      queue?: string[];
      ratings?: Record<string, AnkiRating>;
      forgotCounts?: Record<string, number>;
      currentIndex?: number;
    } | null;

    if (cached && Array.isArray(cached.queue) && cached.queue.length > 0) {
      setQueue(cached.queue);
      setRatings(cached.ratings || {});
      setForgotCounts(cached.forgotCounts || {});
      setCurrentQueueIndex(
        Number.isInteger(cached.currentIndex) && (cached.currentIndex ?? 0) < cached.queue.length
          ? (cached.currentIndex ?? 0)
          : 0
      );
    }
  }, [sessionStorageKey, cards.length]);

  // Auto-save session state
  useEffect(() => {
    if (!cards.length) return;
    saveReviewSession(sessionStorageKey, {
      queue,
      ratings,
      forgotCounts,
      currentIndex: currentQueueIndex,
      updatedAt: Date.now(),
    });
  }, [sessionStorageKey, queue, ratings, forgotCounts, currentQueueIndex, cards.length]);

  const currentCardId = queue[currentQueueIndex];
  const currentCard = useMemo(() => {
    return cards.find((c) => c.id === currentCardId) || null;
  }, [cards, currentCardId]);

  const isComplete = queue.length === 0 && cards.length > 0;

  // Pronunciation
  const playAudio = useCallback(
    (wordToSpeak?: string) => {
      const text = wordToSpeak || currentCard?.word;
      if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = accentVoice;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    },
    [currentCard?.word, accentVoice]
  );

  // Auto-play audio when flipped to the back
  useEffect(() => {
    if (isFlipped && isAutoAudio && currentCard?.word) {
      playAudio(currentCard.word);
    }
  }, [isFlipped, isAutoAudio, currentCard?.word, playAudio]);

  // Completion reward triggers
  const handleSessionComplete = useCallback(async () => {
    if (reward || !deck) return;
    try {
      const earned = await earnReward('FLASHCARD_DECK_COMPLETED', {
        cardCount: cards.length,
        rewardKey: deck.article.topicGroup || deck.article.id,
      });
      setReward(earned);
    } catch {
      // Ignore reward errors
    }
  }, [earnReward, deck, cards.length, reward]);

  useEffect(() => {
    if (isComplete) {
      void handleSessionComplete();
      setIsSealModalOpen(true);
    }
  }, [isComplete, handleSessionComplete]);

  // Anki 4-Level Evaluation Handler
  const handleRate = async (rating: AnkiRating) => {
    if (!currentCard) return;
    const cardId = currentCard.id;
    const currentSRS = cardSRSMap[cardId] || getSRSState(cardId);

    // 1. Calculate next SRS parameters via SM-2
    const { nextState, repeatInSession } = calculateNextSRS(
      currentSRS,
      cardId,
      currentCard.word,
      rating
    );

    // Save SRS state to engine & local state
    saveSRSState(nextState);
    setCardSRSMap((prev) => ({ ...prev, [cardId]: nextState }));
    setRatings((prev) => ({ ...prev, [cardId]: rating }));
    setIsFlipped(false);

    // 2. Persist to API & learningStorage
    void persistVocabProgress({
      vocabId: cardId,
      word: currentCard.word,
      status: rating === 'easy' ? 'mastered' : 'learning',
      reviewCount: nextState.reps + nextState.lapses,
      contextSentence: currentCard.contextEn,
    });

    // 3. Queue Management
    if (rating === 'again') {
      const nextForgot = (forgotCounts[cardId] || 0) + 1;
      setForgotCounts((prev) => ({ ...prev, [cardId]: nextForgot }));

      if (nextForgot >= 3) {
        setCognitiveFatigueAlert(
          t('study.fatigue_word_hint', {
            word: currentCard.word,
            defaultValue: `Từ "${currentCard.word}" có vẻ khó, hãy đọc lại câu ngữ cảnh trong bài đọc!`,
          })
        );
        // Graduate to prevent endless cognitive fatigue
        setQueue((prevQueue) => prevQueue.filter((_, idx) => idx !== currentQueueIndex));
        return;
      }

      // Re-insert into session queue (3 cards later or at the end)
      setQueue((prevQueue) => {
        const item = prevQueue[currentQueueIndex];
        const remaining = prevQueue.filter((_, idx) => idx !== currentQueueIndex);
        if (remaining.length === 0) return [item];
        const insertIndex = Math.min(remaining.length, 3);
        const next = [...remaining];
        next.splice(insertIndex, 0, item);
        return next;
      });
    } else {
      // Hard, Good, Easy: Graduate card from active queue for this session
      setCognitiveFatigueAlert(null);
      setQueue((prevQueue) => prevQueue.filter((_, idx) => idx !== currentQueueIndex));
    }
  };

  const handleRestart = () => {
    setIsFlipped(false);
    setRatings({});
    setForgotCounts({});
    setCognitiveFatigueAlert(null);
    setReward(null);
    setQueue(cards.map((c) => c.id));
    setCurrentQueueIndex(0);
  };

  const handleToggleShuffle = () => {
    setIsShuffled((prev) => !prev);
    setQueue((prevQueue) => {
      const copy = [...prevQueue];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  };

  // Keyboard navigation: Anki standard
  // Front: Space -> Flip
  // Back: Space -> Good (3); 1 -> Again; 2 -> Hard; 3 -> Good; 4 -> Easy
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        isComplete ||
        !cards.length ||
        (e.target instanceof HTMLElement &&
          e.target.closest('input, textarea, select, button, [contenteditable="true"]'))
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isFlipped) {
          setIsFlipped(true);
        } else {
          void handleRate('good');
        }
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          void handleRate('again');
        } else if (e.key === '2') {
          e.preventDefault();
          void handleRate('hard');
        } else if (e.key === '3') {
          e.preventDefault();
          void handleRate('good');
        } else if (e.key === '4') {
          e.preventDefault();
          void handleRate('easy');
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isComplete, cards.length, isFlipped, currentCard]);

  // Loading state
  if (isLoadingDeck) {
    return (
      <FlashcardSidebarLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-antique-gold/30 border-t-antique-gold rounded-full animate-spin" />
          <p className="text-sm font-medium text-ink-soft">
            {t('study.loading', 'Đang tải dữ liệu thẻ từ vựng Anki Spaced Repetition...')}
          </p>
        </div>
      </FlashcardSidebarLayout>
    );
  }

  // Empty state
  if (!cards.length) {
    return (
      <FlashcardSidebarLayout>
        <div className="vocab-study-page p-8 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-antique-gold/15 flex items-center justify-center text-antique-gold">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-heritage-green dark:text-warm-ivory">
            {t('study.no_cards_title', 'Chưa có từ vựng cần ôn tập')}
          </h1>
          <p className="text-sm text-ink-soft">
            {savedOnly
              ? t(
                  'study.no_cards_desc',
                  'Hãy dùng tính năng 1-Click Save khi đọc bài để tự động lưu vào sổ tay cá nhân.'
                )
              : t('study.no_cards_desc', 'Hãy chọn một trong các bộ thẻ học mẫu bên dưới để bắt đầu luyện tập.')}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={paths.reader({ postId: deckId, level })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory font-medium hover:bg-heritage-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('study.read_article', 'Quay lại bài đọc')}</span>
            </Link>
            <Link
              to={PATHS.dictionary}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-antique-gold text-heritage-dark font-bold hover:bg-antique-bright transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('study.browse_library', 'Browse vocabulary library')}</span>
            </Link>
          </div>
        </div>
      </FlashcardSidebarLayout>
    );
  }

  // Anki stats calculation
  const totalCards = cards.length;
  const reviewedCount = totalCards - queue.length;
  const againCount = Object.values(ratings).filter((r) => r === 'again').length;
  const hardCount = Object.values(ratings).filter((r) => r === 'hard').length;
  const goodCount = Object.values(ratings).filter((r) => r === 'good').length;
  const easyCount = Object.values(ratings).filter((r) => r === 'easy').length;
  const masteredCount = goodCount + easyCount;

  return (
    <FlashcardSidebarLayout>
      <div className="vocab-study-page vocab-spaced-review-page w-full max-w-4xl mx-auto py-6 px-4">
        {/* Navigation & Header */}
        <div>
          <div className="vocab-review-navigation">
            <div className="vocab-review-links">
              <Link
                to={paths.reader({ postId: deckId, level })}
                className="vocab-review-back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('study.read_article', 'Read article')}</span>
              </Link>
              <Link
                to={PATHS.dictionary}
                className="vocab-review-library"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('study.browse_library', 'Vocabulary library')}</span>
              </Link>
            </div>
            <div className="vocab-review-options">
              <button
                type="button"
                onClick={handleToggleShuffle}
                aria-pressed={isShuffled}
                className={`vocab-review-option border transition-colors ${
                  isShuffled
                    ? 'bg-antique-gold/20 text-antique-gold border-antique-gold'
                    : 'bg-surface-raised border-antique-gold/20 text-ink-soft hover:text-ink'
                }`}
                title={t('header.shuffle', 'Xáo trộn thứ tự thẻ')}
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{t('header.shuffle', 'Trộn thẻ')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAutoAudio((v) => !v)}
                aria-pressed={isAutoAudio}
                className={`vocab-review-option border transition-colors ${
                  isAutoAudio
                    ? 'bg-[#059669]/15 text-[#059669] border-[#059669]/30'
                    : 'bg-surface-raised border-antique-gold/20 text-ink-soft hover:text-ink'
                }`}
                title={t('header.auto_audio', 'Tự động phát âm khi lật thẻ')}
              >
                {isAutoAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{t('header.auto_audio', 'Tự phát âm')}</span>
              </button>
            </div>
          </div>

          {/* Session title; progress below carries the completion count. */}
          <div className="vocab-review-heading">
            <div className="vocab-review-title">
              <p className="text-[11px] font-bold uppercase tracking-wider text-antique-gold">
                {savedOnly
                  ? t('study.progress_saved_personal', 'Sổ tay cá nhân')
                  : t('study.progress_saved_deck', 'Bộ thẻ văn hóa')}
              </p>
              <h1 className="text-heritage-green dark:text-warm-ivory">
                {deck?.lesson.title || t('study.progress_title_default', 'Ôn tập từ vựng văn hóa')}
              </h1>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <FlashcardProgressBar
          currentIndex={reviewedCount}
          reviewedCount={reviewedCount}
          totalCards={cards.length}
          isComplete={isComplete}
        />

        {/* Cognitive Fatigue Notice (EC-04.1) */}
        {cognitiveFatigueAlert && (
          <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-start gap-2.5 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">
                {t('study.fatigue_title', 'Nhắc nhở nhận thức (Spaced Repetition):')}
              </p>
              <p className="mt-0.5 opacity-90">{cognitiveFatigueAlert}</p>
            </div>
          </div>
        )}

        {/* Study Player or Session Summary */}
        <div className="vocab-study-player flex justify-center py-2">
          {isComplete ? (
            <div className="w-full max-w-lg p-6 rounded-2xl bg-surface-raised border border-antique-gold/30 shadow-xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#059669]/15 flex items-center justify-center text-[#059669]">
                <BookOpen className="w-8 h-8 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-heritage-green dark:text-warm-ivory">
                  {t('study.complete_title', 'Xuất sắc! Đã hoàn thành phiên ôn tập!')}
                </h2>
                <p className="text-sm text-ink-soft">
                  {t('study.complete_desc', {
                    mastered: masteredCount,
                    total: cards.length,
                    defaultValue: `Bạn đã nắm vững ${masteredCount} / ${cards.length} từ vựng văn hóa theo thuật toán Anki SM-2.`,
                  })}
                </p>
              </div>

              {/* Anki Ratings Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                  <p className="text-[10px] uppercase font-bold opacity-80">Quên</p>
                  <p className="text-lg font-bold font-mono mt-0.5">{againCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                  <p className="text-[10px] uppercase font-bold opacity-80">Khó</p>
                  <p className="text-lg font-bold font-mono mt-0.5">{hardCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <p className="text-[10px] uppercase font-bold opacity-80">Tốt</p>
                  <p className="text-lg font-bold font-mono mt-0.5">{goodCount}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
                  <p className="text-[10px] uppercase font-bold opacity-80">Dễ</p>
                  <p className="text-lg font-bold font-mono mt-0.5">{easyCount}</p>
                </div>
              </div>

              {reward && (
                <div className="p-4 rounded-xl bg-antique-gold/15 border border-antique-gold/30 text-antique-gold font-bold flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>
                    {t('study.complete_xp_bonus', {
                      xp: reward.xpEarned || 20,
                      defaultValue: `+${reward.xpEarned || 20} XP Cột mốc Flashcard!`,
                    })}
                  </span>
                </div>
              )}

              {/* Daily Streak Habit Loop */}
              <div className="w-full max-w-md mx-auto">
                <StreakBadge variant="banner" interactive={true} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSealModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#9E2A2B] hover:bg-[#852223] text-white font-bold text-xs shadow-md border border-antique-gold transition-transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-antique-gold" />
                  <span>{t('study.seal_btn', 'Dập Mộc Son Hoàn Thành')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-antique-gold/40 text-antique-gold font-semibold hover:bg-antique-gold/10 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{t('study.btn_restart', 'Ôn lại từ đầu')}</span>
                </button>
                <Link
                  to={paths.reader({ postId: deckId, level })}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#059669] text-white font-semibold hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t('study.btn_continue_reading', 'Tiếp tục đọc bài')}</span>
                </Link>
              </div>
            </div>
          ) : (
            currentCard && (
              <FlashcardFlipView
                card={currentCard}
                isFlipped={isFlipped}
                onToggleFlip={() => setIsFlipped((f) => !f)}
                currentIndex={reviewedCount}
                totalCards={cards.length}
                cardSRS={cardSRSMap[currentCard.id]}
                onPlayAudio={playAudio}
                onRate={handleRate}
              />
            )
          )}
        </div>

        {/* Ceremonial Red Seal (Mộc Son Đỏ) Activation Modal */}
        <MocSonSealModal
          isOpen={isSealModalOpen}
          onClose={() => setIsSealModalOpen(false)}
          articleId={deckId}
          articleTitle={deck?.lesson.title || t('study.progress_title_default', 'Ôn tập từ vựng văn hóa')}
          wordsLearnedCount={masteredCount}
          source="flashcard"
        />

      </div>
    </FlashcardSidebarLayout>
  );
};

export default FlashcardsPage;
