import React from 'react';
import { Volume2, CheckCircle2, RotateCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

/**
 * Helper to mask the target word in the context sentence for Active Recall on the front face.
 */
function maskContextSentence(sentence?: string, word?: string): string {
  if (!sentence || !word) return sentence || '';
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
  if (regex.test(sentence)) {
    return sentence.replace(regex, '______');
  }
  // Fallback if no exact word boundary match
  return sentence.replace(new RegExp(escaped, 'gi'), '______');
}

export function FlashcardFlipView({
  card,
  isFlipped,
  onToggleFlip,
  currentIndex,
  totalCards,
  onPlayAudio,
  onReviewLater,
  onMastered,
}: FlashcardFlipViewProps) {
  const { t } = useTranslation('flashcards');
  const maskedContext = maskContextSentence(card.contextEn, card.word);

  return (
    <div className="vocab-flip-view">
      <div className="vocab-flip-card">
        <div className={`vocab-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
          {/* Front Face: Word + Context sentence with blank for Active Recall */}
          <div aria-hidden={isFlipped} className="vocab-card-front vocab-card-face">
            <button
              className="vocab-card-flip-trigger"
              tabIndex={isFlipped ? -1 : 0}
              onClick={onToggleFlip}
              aria-label={t('flip_view.aria_front', { word: card.word, defaultValue: `English: ${card.word}. Flip to see the meaning.` })}
            />
            <div className="vocab-face-meta">
              <span>{t('flip_view.front_meta', 'English · Ngữ cảnh')}</span>
              <span>
                {t('flip_view.card_counter', { current: currentIndex + 1, total: totalCards, defaultValue: `Card ${currentIndex + 1} / ${totalCards}` })}
              </span>
            </div>
            <div className="vocab-face-content">
              <div className="vocab-word-row">
                <h3 className="vocab-study-word">{card.word}</h3>
                <button
                  type="button"
                  tabIndex={isFlipped ? -1 : 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAudio(card.word);
                  }}
                  className="vocab-audio-button"
                  title={t('flip_view.play_pronunciation', 'Play pronunciation')}
                  aria-label={t('flip_view.pronounce_word', { word: card.word, defaultValue: `Pronounce ${card.word}` })}
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <p className="vocab-phonetics">
                {card.ipa} <span>· {card.pos}</span>
              </p>
              {maskedContext && (
                <div className="vocab-context-box mt-3 text-sm italic opacity-90">
                  <p className="text-xs uppercase font-semibold text-antique-gold mb-1 not-italic tracking-wider">
                    {t('flip_view.context_label', 'Context Sentence (Điền từ vào chỗ trống):')}
                  </p>
                  <p className="vocab-context font-serif">“{maskedContext}”</p>
                </div>
              )}
            </div>
            <p className="vocab-flip-hint">
              <RotateCw size={14} />
              <span>{t('flip_view.tap_to_reveal', 'Tap to reveal definition')}</span>
              <kbd>{t('flip_view.key_space', 'Space')}</kbd>
            </p>
          </div>

          {/* Back Face: Definition + IPA + Example */}
          <div aria-hidden={!isFlipped} className="vocab-card-back vocab-card-face">
            <button
              className="vocab-card-flip-trigger"
              tabIndex={!isFlipped ? -1 : 0}
              onClick={onToggleFlip}
              aria-label={t('flip_view.aria_back', { meaning: card.viMeaning, defaultValue: `Meaning: ${card.viMeaning}. Flip to see the English word.` })}
            />
            <div className="vocab-face-meta">
              <span>{t('flip_view.back_meta', 'Giải nghĩa & Ngữ âm')}</span>
              <span>
                {t('flip_view.card_counter', { current: currentIndex + 1, total: totalCards, defaultValue: `Card ${currentIndex + 1} / ${totalCards}` })}
              </span>
            </div>
            <div className="vocab-face-content">
              <div className="flex items-center justify-center gap-2">
                <p className="vocab-phonetics text-sm">
                  {card.word} <span className="opacity-75">({card.pos})</span> ·{' '}
                  <span className="font-mono text-antique-bright">{card.ipa}</span>
                </p>
                <button
                  type="button"
                  tabIndex={!isFlipped ? -1 : 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAudio(card.word);
                  }}
                  className="p-1 rounded-full text-antique-bright hover:bg-white/10 transition-colors"
                  title={t('flip_view.play_pronunciation', 'Play pronunciation')}
                  aria-label={t('flip_view.pronounce_word', { word: card.word, defaultValue: `Pronounce ${card.word}` })}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <h3 className="vocab-study-meaning text-2xl font-bold mt-2">{card.viMeaning}</h3>
              {card.viDefinition && card.viDefinition !== card.viMeaning && (
                <p className="text-xs opacity-90 italic mt-1 max-w-prose">{card.viDefinition}</p>
              )}
              {card.contextEn && (
                <div className="vocab-context-box mt-4 text-xs bg-black/20 p-3 rounded-xl border border-white/10 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-antique-bright block mb-1">
                    {t('flip_view.original_context_label', 'Ví dụ ngữ cảnh gốc:')}
                  </span>
                  <p className="italic font-serif leading-relaxed text-warm-ivory">
                    “{card.contextEn}”
                  </p>
                </div>
              )}
            </div>
            <p className="vocab-flip-hint">
              <RotateCw size={14} />
              <span>{t('flip_view.tap_to_return', 'Tap to return to front')}</span>
              <kbd>{t('flip_view.key_space', 'Space')}</kbd>
            </p>
          </div>
        </div>
      </div>

      {/* Binary Self-Evaluation Buttons */}
      <div className="vocab-review-actions flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReviewLater}
          className="vocab-study-secondary flex-1 max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all"
          title="Review again (Key 1)"
        >
          <RotateCw size={18} />
          <span>{t('flip_view.btn_forgot', 'Cần ôn lại (Forgot)')}</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-red-500/20 rounded">1</kbd>
        </button>
        <button
          type="button"
          onClick={onMastered}
          className="vocab-study-primary flex-1 max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-[#059669] text-white hover:bg-[#047857] shadow-md transition-all"
          title="Remembered (Key 2)"
        >
          <CheckCircle2 size={18} />
          <span>{t('flip_view.btn_remembered', 'Đã nhớ (Remembered)')}</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-black/20 rounded">2</kbd>
        </button>
      </div>
    </div>
  );
}

export default FlashcardFlipView;
