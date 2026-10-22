import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, RotateCw, Volume2, VolumeX } from 'lucide-react';
import { DECK_WORDS } from '@/data/flashcardsData';
import { speakEnglish } from '@/utils/speechUtils';
import { paths } from '@/routes/paths';

const DEMO_CARDS = DECK_WORDS['imperial-hue'].cards;
type RecallRating = 'again' | 'good';

interface InteractiveFlashcardDemoSectionProps {
  onNavigate?: (view: string) => void;
}

export const InteractiveFlashcardDemoSection: React.FC<InteractiveFlashcardDemoSectionProps> = ({ onNavigate }) => {
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
    if (!isFlipped) return;
    stopAudio();
    const nextRatings = { ...ratings, [currentCard.id]: rating };
    setRatings(nextRatings);
    setFeedback(currentCard.word + ': ' + (rating === 'good' ? 'remembered.' : 'review again.'));
    setIsFlipped(false);
    if (Object.keys(nextRatings).length < DEMO_CARDS.length) {
      const nextIndex = DEMO_CARDS.findIndex((card) => !nextRatings[card.id]);
      setActiveCardIndex(nextIndex);
    }
  };

  const restart = () => {
    changeCard(0);
    setRatings({});
  };

  const openDeck = () => {
    const view = paths.flashcardStudy({ deck: 'imperial-hue' });
    onNavigate?.(view);
  };

  return (
    <section id="flashcard-demo" className="landing-flashcards landing-section" aria-labelledby="landing-flashcards-title">
      <div className="landing-container landing-flashcard-grid">
        <div className="landing-flashcard-copy">
          <span className="landing-eyebrow">04 / TRY A QUICK REVIEW</span>
          <h2 id="landing-flashcards-title">Words you’ve met.<br /><em>Remember a little more.</em></h2>
          <p>New words are easier to remember in a story. Try a few cards from the Hue lesson, then choose what you want to review.</p>
          <ol className="landing-recall-steps">
            <li><span>01</span> Recall the word’s meaning</li>
            <li><span>02</span> Flip the card to check</li>
            <li><span>03</span> Choose “Remembered” or “Review again”</li>
          </ol>
          <button type="button" className="landing-button landing-button-primary" onClick={openDeck}>Open the Hue deck<ArrowUpRight size={17} aria-hidden="true" /></button>
        </div>

        <div className="landing-demo">
          <div className="landing-demo-header"><span>HUE / WORDS IN CONTEXT</span><span>{DEMO_CARDS.length} sample cards</span></div>
          <div className="landing-demo-progress" role="progressbar" aria-label="Cards reviewed in this preview" aria-valuenow={reviewedCount} aria-valuemin={0} aria-valuemax={DEMO_CARDS.length}><span style={{ width: (reviewedCount / DEMO_CARDS.length) * 100 + '%' }} /></div>

          {isComplete ? (
            <div className="landing-demo-summary" role="status">
              <span className="landing-demo-complete-icon"><CheckCircle2 size={28} aria-hidden="true" /></span>
              <h3>You reviewed {DEMO_CARDS.length} cards.</h3>
              <p>{rememberedCount} remembered · {DEMO_CARDS.length - rememberedCount} to review again</p>
              <span>A short review gives familiar words another chance to stick.</span>
              <button type="button" className="landing-text-link" onClick={restart}>Try again<RotateCcw size={16} aria-hidden="true" /></button>
            </div>
          ) : (
            <>
              <div className="landing-demo-navigation">
                <button type="button" onClick={() => changeCard(activeCardIndex - 1)} disabled={activeCardIndex === 0} aria-label="Previous card"><ChevronLeft size={18} /></button>
                <span>Card {activeCardIndex + 1} / {DEMO_CARDS.length}</span>
                <button type="button" onClick={() => changeCard(activeCardIndex + 1)} disabled={activeCardIndex === DEMO_CARDS.length - 1} aria-label="Next card"><ChevronRight size={18} /></button>
              </div>
              <div className="landing-demo-card">
                <button type="button" className="landing-demo-audio" onClick={playAudio} disabled={!canSpeak} aria-label={isPlayingAudio ? 'Stop pronunciation' : 'Hear pronunciation of ' + currentCard.word}>
                  {isPlayingAudio ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button type="button" className={'landing-demo-flip' + (isFlipped ? ' is-flipped' : '')} onClick={() => setIsFlipped(!isFlipped)} aria-pressed={isFlipped} aria-label={isFlipped ? 'See the English word again' : 'Flip the card to see its Vietnamese meaning'}>
                  <span className="landing-demo-flip-inner">
                    <span className="landing-demo-face landing-demo-front" aria-hidden={isFlipped}>
                      <span className="landing-demo-word">{currentCard.word}</span>
                      <span className="landing-demo-ipa">{currentCard.ipa} · {currentCard.pos}</span>
                      <span className="landing-demo-example">{currentCard.contextEn}</span>
                      <span className="landing-demo-flip-hint"><RotateCw size={14} aria-hidden="true" /> Flip to see the meaning</span>
                    </span>
                    <span className="landing-demo-face landing-demo-back" aria-hidden={!isFlipped}>
                      <span className="landing-demo-answer-label">VIETNAMESE MEANING</span>
                      <span className="landing-demo-meaning">{currentCard.viMeaning}</span>
                      <span className="landing-demo-definition">{currentCard.viDefinition}</span>
                      <span className="landing-demo-flip-hint"><RotateCw size={14} aria-hidden="true" /> Flip to see the English word</span>
                    </span>
                  </span>
                </button>
              </div>
              <div className="landing-demo-ratings">
                <button type="button" onClick={() => rateCard('again')} disabled={!isFlipped}><RotateCcw size={16} aria-hidden="true" />Review again</button>
                <button type="button" onClick={() => rateCard('good')} disabled={!isFlipped}><Check size={16} aria-hidden="true" />Remembered</button>
              </div>
              <p className="landing-demo-feedback" role="status">{feedback || (isFlipped ? 'How well do you remember this word?' : 'Try to recall the meaning before you flip.')}</p>
            </>
          )}
          <p className="landing-demo-note">This preview does not save your progress. Open the deck to keep learning.</p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveFlashcardDemoSection;
