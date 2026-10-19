import { Volume2, CheckCircle2, RotateCw } from 'lucide-react';
import type { Flashcard } from '@/data/flashcardsData';

interface FlashcardFlipViewProps {
  card: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  currentIndex: number;
  totalCards: number;
  onPlayAudio: (word?: string) => void;
  onReviewLater: () => void;
  onMastered: () => void;
}

export function FlashcardFlipView({ card, isFlipped, onToggleFlip, currentIndex, totalCards, onPlayAudio, onReviewLater, onMastered }: FlashcardFlipViewProps) {
  return (
    <div className="vocab-flip-view">
      <div className="vocab-flip-card">
        <div className={`vocab-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
          <div aria-hidden={isFlipped} className="vocab-card-front vocab-card-face">
            <button className="vocab-card-flip-trigger" tabIndex={isFlipped ? -1 : 0} onClick={onToggleFlip} aria-label={`English: ${card.word}. Flip to see the meaning.`} />
            <div className="vocab-face-meta"><span>English</span><span>Card {currentIndex + 1} / {totalCards}</span></div>
            <div className="vocab-face-content">
              <div className="vocab-word-row">
                <h3 className="vocab-study-word">{card.word}</h3>
                <button tabIndex={isFlipped ? -1 : 0} onClick={() => onPlayAudio(card.word)} className="vocab-audio-button" title="Play pronunciation" aria-label={`Pronounce ${card.word}`}><Volume2 size={20} /></button>
              </div>
              <p className="vocab-phonetics">{card.ipa} <span>· {card.pos}</span></p>
              <p className="vocab-context">“{card.contextEn}”</p>
            </div>
            <p className="vocab-flip-hint"><RotateCw size={14} /><span>Tap to reveal the meaning</span><kbd>Space</kbd></p>
          </div>
          <div aria-hidden={!isFlipped} className="vocab-card-back vocab-card-face">
            <button className="vocab-card-flip-trigger" tabIndex={!isFlipped ? -1 : 0} onClick={onToggleFlip} aria-label={`Meaning: ${card.viMeaning}. Flip to see the English word.`} />
            <div className="vocab-face-meta"><span>Meaning</span><span>Card {currentIndex + 1} / {totalCards}</span></div>
            <div className="vocab-face-content">
              <p className="vocab-phonetics">{card.word} ({card.pos}) · {card.ipa}</p>
              <h3 className="vocab-study-meaning">{card.viMeaning}</h3>
              <p className="vocab-context">{card.viDefinition}</p>
            </div>
            <p className="vocab-flip-hint"><RotateCw size={14} /><span>Tap to return to English</span><kbd>Space</kbd></p>
          </div>
        </div>
      </div>
      <div className="vocab-review-actions">
        <button onClick={onReviewLater} className="vocab-study-secondary"><RotateCw size={18} /><span>Review again</span><kbd>1</kbd></button>
        <button onClick={onMastered} className="vocab-study-primary"><CheckCircle2 size={18} /><span>Remembered</span><kbd>2</kbd></button>
      </div>
    </div>
  );
}
