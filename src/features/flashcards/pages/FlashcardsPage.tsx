import { useTranslation } from 'react-i18next';
import '../flashcard-study.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import {
  Volume2,
  CheckCircle2,
  RotateCw,
  BookOpen,
  ArrowLeft,
  AlertCircle,
  Shuffle,
  VolumeX,
} from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import type { RewardCelebrationPayload } from '@/types';
import type { Flashcard } from '@/data/flashcardsData';
import {
  articleKey,
  readSavedVocabulary,
  getAllSavedVocabularies,
  readReviewSession,
  saveReviewSession,
} from '@/services/learning/learningStorage';
import FlashcardSidebarLayout from '../components/flashcard-sidebar-layout';
import {
  FlashcardStudyHeader,
  FlashcardProgressBar,
  FlashcardFlipView,
} from '../components';
import { FlashcardSessionSummary } from '../components/FlashcardSessionSummary';
import { cardsFromVocabulary, loadStudyDeck, type StudyDeck } from '../services/studyDeck';
import { persistVocabProgress } from '../services/vocabProgressService';
import { paths } from '@/routes/paths';
import { MocSonSealModal, StreakBadge } from '@/features/gamification';
import { Award, Flame } from 'lucide-react';

/**
 * FlashcardsPage: Main 2-Sided Leitner Binary Flashcard Study Experience.
 * Implements Active Recall with masked context sentences, binary Remembered/Forgot evaluation,
 * Leitner queue re-insertion, EC-04.1 cognitive fatigue prevention, and offline progress sync.
 */
export const FlashcardsPage: React.FC = () => {
  const { t } = useTranslation('flashcards');
  const [searchParams] = useSearchParams();
  const deckId = searchParams.get('deck') || 'imperial-hue';
  const level = searchParams.get('level') || 'Level 1';
  const savedOnly = searchParams.get('saved') === 'true';

  const { earnReward, stats } = useGamification();
  const [deck, setDeck] = useState<StudyDeck | null>(null);
  const [isLoadingDeck, setIsLoadingDeck] = useState<boolean>(true);
  const [reward, setReward] = useState<RewardCelebrationPayload | null>(null);

  // Deck / cards loading
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [ratings, setRatings] = useState<Record<string, 'mastered' | 'review'>>({});
  const [forgotCounts, setForgotCounts] = useState<Record<string, number>>({});
  const [cognitiveFatigueAlert, setCognitiveFatigueAlert] = useState<string | null>(null);
  const [isSealModalOpen, setIsSealModalOpen] = useState<boolean>(false);

  // Card view state
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isAutoAudio, setIsAutoAudio] = useState<boolean>(false);
  const [accentVoice, setAccentVoice] = useState<'en-US' | 'en-GB'>('en-US');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  // Session key for persistent progress (EC-04.2)
  const sessionStorageKey = useMemo(() => {
    return `leitner_${deckId}_${level}${savedOnly ? '_saved' : ''}`;
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

  // Restore saved session (EC-04.2)
  useEffect(() => {
    if (!cards.length) return;
    const cached = readReviewSession(sessionStorageKey) as {
      queue?: string[];
      ratings?: Record<string, 'mastered' | 'review'>;
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

  // Auto-save session state on change
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

  // Auto-play audio when flipped to the back (per spaced_repetition.md)
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

  // Evaluation Actions
  const handleRemembered = async () => {
    if (!currentCard) return;
    const cardId = currentCard.id;

    // 1. Mark as mastered
    setRatings((prev) => ({ ...prev, [cardId]: 'mastered' }));
    setIsFlipped(false);
    setCognitiveFatigueAlert(null);

    // 2. Persist to API / localStorage
    void persistVocabProgress({
      vocabId: cardId,
      word: currentCard.word,
      status: 'mastered',
      reviewCount: (forgotCounts[cardId] || 0) + 1,
      contextSentence: currentCard.contextEn,
    });

    // 3. Remove current card from active queue
    setQueue((prevQueue) => {
      const nextQueue = prevQueue.filter((_, idx) => idx !== currentQueueIndex);
      return nextQueue;
    });
  };

  const handleForgot = async () => {
    if (!currentCard) return;
    const cardId = currentCard.id;
    const nextForgotCount = (forgotCounts[cardId] || 0) + 1;

    setForgotCounts((prev) => ({ ...prev, [cardId]: nextForgotCount }));
    setRatings((prev) => ({ ...prev, [cardId]: 'review' }));
    setIsFlipped(false);

    // 2. Persist to API / localStorage
    void persistVocabProgress({
      vocabId: cardId,
      word: currentCard.word,
      status: 'learning',
      reviewCount: nextForgotCount,
      contextSentence: currentCard.contextEn,
    });

    // 3. EC-04.1 Cognitive Fatigue Check: Max 3 repeats in 1 session
    if (nextForgotCount >= 3) {
      setCognitiveFatigueAlert(
        `Từ "${currentCard.word}" có vẻ khó với bạn, hãy đọc lại câu ngữ cảnh trong bài đọc!`
      );
      // Remove from active queue to prevent infinite fatigue
      setQueue((prevQueue) => prevQueue.filter((_, idx) => idx !== currentQueueIndex));
      return;
    }

    // 4. Leitner Queue re-insertion: Move to the end of the queue
    setQueue((prevQueue) => {
      const item = prevQueue[currentQueueIndex];
      const remaining = prevQueue.filter((_, idx) => idx !== currentQueueIndex);
      return [...remaining, item];
    });
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

  // Keyboard navigation
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
        setIsFlipped((f) => !f);
      } else if (e.key === '1') {
        e.preventDefault();
        void handleForgot();
      } else if (e.key === '2') {
        e.preventDefault();
        void handleRemembered();
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
            Đang tải dữ liệu thẻ từ vựng ngữ cảnh...
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
            Chưa có từ vựng cần ôn tập
          </h1>
          <p className="text-sm text-ink-soft">
            {savedOnly
              ? 'Hãy dùng tính năng 1-Click Save khi đọc bài để tự động đính kèm câu ngữ cảnh vào sổ tay cá nhân.'
              : 'Bài học này hiện chưa có bộ thẻ từ vựng hoặc chưa được đồng bộ.'}
          </p>
          <div className="pt-2">
            <Link
              to={paths.reader({ postId: deckId, level })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory font-medium hover:bg-heritage-dark transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại bài đọc</span>
            </Link>
          </div>
        </div>
      </FlashcardSidebarLayout>
    );
  }

  const reviewedCount = cards.length - queue.length;
  const masteredCount = Object.values(ratings).filter((r) => r === 'mastered').length;

  return (
    <FlashcardSidebarLayout>
      <div className="vocab-study-page w-full max-w-4xl mx-auto py-6 px-4 space-y-6">
        {/* Navigation & Header */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-2">
            <Link
              to={paths.reader({ postId: deckId, level })}
              className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-heritage-green transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại bài đọc</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleShuffle}
                className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  isShuffled
                    ? 'bg-antique-gold/20 text-antique-gold border-antique-gold'
                    : 'bg-surface-raised border-antique-gold/20 text-ink-soft hover:text-ink'
                }`}
                title="Xáo trộn thứ tự thẻ"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Trộn thẻ</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAutoAudio((v) => !v)}
                className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  isAutoAudio
                    ? 'bg-[#059669]/15 text-[#059669] border-[#059669]/30'
                    : 'bg-surface-raised border-antique-gold/20 text-ink-soft hover:text-ink'
                }`}
                title="Tự động phát âm khi lật thẻ"
              >
                {isAutoAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>Tự phát âm</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-antique-gold/20 pb-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-antique-gold">
                {savedOnly ? 'Sổ tay cá nhân' : 'Bộ thẻ theo bài đọc'}
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-heritage-green dark:text-warm-ivory">
                {deck?.lesson.title || 'Ôn tập từ vựng văn hóa'}
              </h1>
            </div>
            <div className="text-xs text-ink-soft flex items-center gap-3">
              <span>
                🟢 Đã nhớ: <strong className="text-[#059669]">{masteredCount}</strong>
              </span>
              <span>
                Còn lại trong hàng đợi: <strong>{queue.length}</strong>
              </span>
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
              <p className="font-semibold">Nhắc nhở nhận thức (Spaced Repetition):</p>
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
                  Xuất sắc! Đã hoàn thành phiên ôn tập!
                </h2>
                <p className="text-sm text-ink-soft">
                  Bạn đã nắm vững {masteredCount} / {cards.length} từ vựng ngữ cảnh. Dữ liệu đã được
                  lưu vào hệ thống Spaced Repetition.
                </p>
              </div>

              {reward && (
                <div className="p-4 rounded-xl bg-antique-gold/15 border border-antique-gold/30 text-antique-gold font-bold flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>+{reward.xpEarned || 20} XP Cột mốc Flashcard!</span>
                </div>
              )}

              {/* Daily Streak & Gamification Habit Loop */}
              <div className="w-full max-w-md mx-auto">
                <StreakBadge variant="banner" interactive={true} />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSealModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#9E2A2B] hover:bg-[#852223] text-white font-bold text-xs shadow-md border border-antique-gold transition-transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-antique-gold" />
                  <span>Dập Mộc Son Hoàn Thành</span>
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-antique-gold/40 text-antique-gold font-semibold hover:bg-antique-gold/10 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Ôn lại từ đầu</span>
                </button>
                <Link
                  to={paths.reader({ postId: deckId, level })}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#059669] text-white font-semibold hover:bg-[#047857] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Tiếp tục đọc bài</span>
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
                onPlayAudio={playAudio}
                onReviewLater={handleForgot}
                onMastered={handleRemembered}
              />
            )
          )}
        </div>

        {/* Ceremonial Red Seal (Mộc Son Đỏ) Activation Modal */}
        <MocSonSealModal
          isOpen={isSealModalOpen}
          onClose={() => setIsSealModalOpen(false)}
          articleId={deckId}
          articleTitle={deck?.lesson.title || 'Ôn tập từ vựng văn hóa'}
          wordsLearnedCount={masteredCount}
          source="flashcard"
        />
      </div>
    </FlashcardSidebarLayout>
  );
};

export default FlashcardsPage;
