import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DECK_WORDS } from '@/data/flashcardsData';
import { speakEnglish } from '@/utils/speechUtils';
import { paths } from '@/routes/paths';

const DEMO_CARDS = DECK_WORDS['imperial-hue'].cards;
type RecallRating = 'again' | 'good';

interface InteractiveFlashcardDemoSectionProps {
  onNavigate?: (view: string) => void;
}

export const InteractiveFlashcardDemoSection: React.FC<InteractiveFlashcardDemoSectionProps> = ({ onNavigate }) => {
  const { t } = useTranslation('landing');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ratings, setRatings] = useState<Record<string, RecallRating>>({});
  const [feedback, setFeedback] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const playbackIdRef = useRef(0);
  const playingRef = useRef(false);
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const currentCard = DEMO_CARDS[activeCardIndex];
  const reviewedCount = Object.keys(ratings).length;
  const rememberedCount = Object.values(ratings).filter((rating) => rating === 'good').length;
  const isComplete = reviewedCount === DEMO_CARDS.length;

  useEffect(() => () => {
    playbackIdRef.current += 1;
    if (playingRef.current && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const stopAudio = () => {
    playbackIdRef.current += 1;
    if (playingRef.current && canSpeak) window.speechSynthesis.cancel();
    playingRef.current = false;
    setIsPlayingAudio(false);
  };

  const changeCard = (index: number) => {
    stopAudio();
    setIsFlipped(false);
    setActiveCardIndex(index);
    setFeedback('');
  };

  const playAudio = () => {
    if (!canSpeak) return;
    if (isPlayingAudio) {
      stopAudio();
      return;
    }
    const playbackId = ++playbackIdRef.current;
    playingRef.current = true;
    setIsPlayingAudio(true);
    speakEnglish(currentCard.word, () => {
      if (playbackIdRef.current !== playbackId) return;
      playingRef.current = false;
      setIsPlayingAudio(false);
    });
  };

  const rateCard = (rating: RecallRating) => {
    const cardId = currentCard.id;
    const nextRatings = { ...ratings, [cardId]: rating };
    setRatings(nextRatings);
    setFeedback(rating === 'good' ? t('flashcard_demo.feedback_remembered') : t('flashcard_demo.feedback_review'));
    const nextUnreviewedIndex = DEMO_CARDS.findIndex((c, idx) => idx > activeCardIndex && !nextRatings[c.id]);
    const firstUnreviewedIndex = DEMO_CARDS.findIndex((c) => !nextRatings[c.id]);
    const targetIndex = nextUnreviewedIndex !== -1 ? nextUnreviewedIndex : firstUnreviewedIndex;
    if (targetIndex !== -1) {
      setTimeout(() => changeCard(targetIndex), 400);
    }
  };

  const restart = () => {
    setRatings({});
    setFeedback('');
    changeCard(0);
  };

  const openDeck = () => {
    const view = paths.flashcardStudy({ deck: 'imperial-hue' });
    onNavigate?.(view);
  };

  return (
    <section
      id="flashcard-demo"
      className="landing-flashcards landing-section"
      aria-labelledby="landing-flashcards-title"
    >
      <div className="landing-container landing-flashcard-grid">
        {/* Left Column: Description & Explanation */}
        <div className="landing-flashcard-copy space-y-5">
          <h2 id="landing-flashcards-title" className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight">
            {t('flashcard_demo.title')}
          </h2>

          <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
            {t('flashcard_demo.subtitle')}
          </p>

          <ul className="landing-recall-steps space-y-2.5 text-xs sm:text-sm text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-antique-gold mt-2 shrink-0" aria-hidden="true" />
              <span>{t('flashcard_demo.steps.step1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-antique-gold mt-2 shrink-0" aria-hidden="true" />
              <span>{t('flashcard_demo.steps.step2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-antique-gold mt-2 shrink-0" aria-hidden="true" />
              <span>{t('flashcard_demo.steps.step3')}</span>
            </li>
          </ul>

          <div className="pt-2">
            <button
              type="button"
              className="landing-button landing-button-primary focus-ring"
              onClick={openDeck}
            >
              <span>{t('flashcard_demo.open_deck')}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Flashcard Widget */}
        <div className="landing-demo bg-surface rounded-3xl border border-line p-6 sm:p-8 shadow-lg">
          <div className="landing-demo-header flex items-center justify-between text-xs sm:text-sm font-semibold text-ink-soft pb-2 border-b border-line">
            <span className="text-ink font-serif text-base">{t('flashcard_demo.deck_title')}</span>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-surface-feature text-ink-soft border border-line">
              {t('flashcard_demo.sample_cards', { count: DEMO_CARDS.length })}
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="landing-demo-progress my-3 h-2 bg-surface-feature rounded-full overflow-hidden"
            role="progressbar"
            aria-label={t('flashcard_demo.progress_aria')}
            aria-valuenow={reviewedCount}
            aria-valuemin={0}
            aria-valuemax={DEMO_CARDS.length}
          >
            <div
              className="h-full bg-action transition-all duration-300"
              style={{ width: `${(reviewedCount / DEMO_CARDS.length) * 100}%` }}
            />
          </div>

          {isComplete ? (
            <div className="landing-demo-summary flex flex-col items-center justify-center text-center py-10 space-y-4" role="status">
              <span className="landing-demo-complete-icon w-14 h-14 rounded-full bg-surface-feature text-action border border-line flex items-center justify-center">
                <CheckCircle2 size={32} aria-hidden="true" />
              </span>
              <h3 className="font-serif text-2xl font-bold text-ink">
                {t('flashcard_demo.complete_title', { count: DEMO_CARDS.length })}
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft">
                {t('flashcard_demo.complete_summary', {
                  remembered: rememberedCount,
                  review: DEMO_CARDS.length - rememberedCount,
                })}
              </p>
              <p className="text-xs text-ink-soft max-w-xs">
                {t('flashcard_demo.complete_note')}
              </p>
              <button
                type="button"
                className="landing-text-link focus-ring inline-flex items-center gap-1.5 font-semibold text-action"
                onClick={restart}
              >
                <span>{t('flashcard_demo.try_again')}</span>
                <RotateCcw size={15} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <>
              {/* Card Nav Header */}
              <div className="landing-demo-navigation flex items-center justify-between my-3">
                <button
                  type="button"
                  onClick={() => changeCard(activeCardIndex - 1)}
                  disabled={activeCardIndex === 0}
                  aria-label={t('flashcard_demo.previous_card')}
                  className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <span className="text-xs font-mono font-medium text-ink-soft">
                  {t('flashcard_demo.card_counter', {
                    current: activeCardIndex + 1,
                    total: DEMO_CARDS.length,
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => changeCard(activeCardIndex + 1)}
                  disabled={activeCardIndex === DEMO_CARDS.length - 1}
                  aria-label={t('flashcard_demo.next_card')}
                  className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:bg-surface-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-ring"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>

              {/* The Flippable Card */}
              <div className="landing-demo-card relative rounded-2xl bg-surface-feature border border-line overflow-hidden shadow-xs">
                {/* Audio Button */}
                <button
                  type="button"
                  className="landing-demo-audio absolute z-10 top-3 right-3 w-10 h-10 rounded-full border border-line bg-surface text-action hover:bg-surface-muted flex items-center justify-center shadow-xs focus-ring transition-colors"
                  onClick={playAudio}
                  disabled={!canSpeak}
                  aria-label={isPlayingAudio ? t('flashcard_demo.stop_audio') : t('flashcard_demo.play_audio', { word: currentCard.word })}
                >
                  {isPlayingAudio ? (
                    <VolumeX size={18} aria-hidden="true" />
                  ) : (
                    <Volume2 size={18} aria-hidden="true" />
                  )}
                </button>

                {/* Flip Container */}
                <button
                  type="button"
                  className={`landing-demo-flip w-full text-center p-6 sm:p-8 min-h-[260px] flex flex-col justify-center items-center cursor-pointer focus-ring bg-transparent border-0 ${
                    isFlipped ? 'is-flipped' : ''
                  }`}
                  onClick={() => setIsFlipped(!isFlipped)}
                  aria-pressed={isFlipped}
                  aria-label={isFlipped ? t('flashcard_demo.flip_aria_to_en') : t('flashcard_demo.flip_aria_to_vi')}
                >
                  <span className="landing-demo-flip-inner w-full">
                    {!isFlipped ? (
                      <span className="landing-demo-face landing-demo-front flex flex-col items-center justify-center gap-2">
                        <span className="landing-demo-word font-serif text-3xl sm:text-4xl font-bold text-heritage-forest leading-tight">
                          {currentCard.word}
                        </span>
                        <span className="landing-demo-ipa text-xs sm:text-sm font-mono text-ink-soft">
                          {currentCard.ipa} · <span className="italic">{currentCard.pos}</span>
                        </span>
                        <blockquote className="landing-demo-example m-0 text-xs sm:text-sm font-serif italic text-ink-soft mt-3 max-w-sm line-clamp-3">
                          &ldquo;{currentCard.contextEn}&rdquo;
                        </blockquote>
                        <span className="landing-demo-flip-hint inline-flex items-center gap-1.5 text-xs text-accent-ink mt-4 font-medium">
                          <RotateCw size={13} aria-hidden="true" />
                          <span>{t('flashcard_demo.flip_hint_en')}</span>
                        </span>
                      </span>
                    ) : (
                      <span className="landing-demo-face landing-demo-back flex flex-col items-center justify-center gap-2">
                        <span className="landing-demo-answer-label text-xs font-bold uppercase tracking-wider text-accent-ink">
                          {t('flashcard_demo.vietnamese_meaning')}
                        </span>
                        <span className="landing-demo-meaning font-serif text-2xl sm:text-3xl font-bold text-action leading-tight">
                          {currentCard.viMeaning}
                        </span>
                        <span className="landing-demo-definition text-xs sm:text-sm text-ink-soft max-w-sm mt-1 leading-relaxed">
                          {currentCard.viDefinition}
                        </span>
                        <span className="landing-demo-flip-hint inline-flex items-center gap-1.5 text-xs text-accent-ink mt-4 font-medium">
                          <RotateCw size={13} aria-hidden="true" />
                          <span>{t('flashcard_demo.flip_hint_vi')}</span>
                        </span>
                      </span>
                    )}
                  </span>
                </button>
              </div>

              {/* Rating Buttons */}
              <div className="landing-demo-ratings grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => rateCard('again')}
                  disabled={!isFlipped}
                  className="min-h-[44px] py-2.5 px-4 rounded-xl border border-line bg-surface hover:bg-surface-muted text-ink font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-ring shadow-xs"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  <span>{t('flashcard_demo.review_again')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => rateCard('good')}
                  disabled={!isFlipped}
                  className="min-h-[44px] py-2.5 px-4 rounded-xl bg-action hover:bg-action-hover text-surface font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-ring shadow-xs"
                >
                  <Check size={16} aria-hidden="true" />
                  <span>{t('flashcard_demo.remembered')}</span>
                </button>
              </div>

              {/* Feedback Line */}
              <p className="landing-demo-feedback text-center text-xs text-ink-soft min-h-[32px] flex items-center justify-center mt-2 font-medium" role="status">
                {feedback || (isFlipped ? t('flashcard_demo.feedback_prompt_flipped') : t('flashcard_demo.feedback_prompt_front'))}
              </p>
            </>
          )}

          <p className="landing-demo-note text-center text-[11px] text-ink-soft pt-3 border-t border-line mt-2">
            {t('flashcard_demo.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFlashcardDemoSection;
