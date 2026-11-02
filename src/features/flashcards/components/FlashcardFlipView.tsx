import React from 'react';
import { Volume2, RotateCcw, RotateCw, HelpCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Flashcard } from '@/data/flashcardsData';
import { getRatingIntervals, type AnkiRating, type CardSRSState } from '../services/srsEngine';

export interface FlashcardFlipViewProps {
  card: Flashcard;
  isFlipped: boolean;
  onToggleFlip: () => void;
  currentIndex: number;
  totalCards: number;
  cardSRS?: CardSRSState;
  onPlayAudio: (word?: string) => void;
  onRate?: (rating: AnkiRating) => void;
  // Backward compatibility
  onReviewLater?: () => void;
  onMastered?: () => void;
}

/**
 * Masks the target word in the context sentence for Active Recall on the front face.
 */
function maskContextSentence(sentence?: string, word?: string): string {
  if (!sentence || !word) return sentence || '';
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
  if (regex.test(sentence)) {
    return sentence.replace(regex, '______');
  }
  return sentence.replace(new RegExp(escaped, 'gi'), '______');
}

export function FlashcardFlipView({
  card,
  isFlipped,
  onToggleFlip,
  currentIndex,
  totalCards,
  cardSRS,
  onPlayAudio,
  onRate,
  onReviewLater,
  onMastered,
}: FlashcardFlipViewProps) {
  const { t, i18n } = useTranslation('flashcards');
  const isEn = (i18n.language || '').toLowerCase().startsWith('en');
  const maskedContext = maskContextSentence(card.contextEn, card.word);
  const ratingIntervals = getRatingIntervals(cardSRS);

  const handleRating = (rating: AnkiRating) => {
    if (onRate) {
      onRate(rating);
    } else if (rating === 'again' || rating === 'hard') {
      onReviewLater?.();
    } else {
      onMastered?.();
    }
  };

  return (
    <div className="vocab-flip-view w-full max-w-2xl mx-auto space-y-4">
      {/* 3D Flip Card */}
      <div className="vocab-flip-card">
        <div className={`vocab-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
          {/* Front Face: Active Recall (Cloze Word + Blank Context Sentence) */}
          <div aria-hidden={isFlipped} className="vocab-card-front vocab-card-face">
            <button
              type="button"
              className="vocab-card-flip-trigger"
              tabIndex={isFlipped ? -1 : 0}
              onClick={onToggleFlip}
              aria-label={t('flip_view.aria_front', {
                word: card.word,
                defaultValue: `English: ${card.word}. Flip to see the meaning.`,
              })}
            />
            <div className="vocab-face-meta">
              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen size={13} className="text-antique-gold" />
                {t('flip_view.front_meta', 'English · Active Recall')}
              </span>
              <span className="text-xs font-mono opacity-80">
                {t('flip_view.card_counter', {
                  current: currentIndex + 1,
                  total: totalCards,
                  defaultValue: `Card ${currentIndex + 1} / ${totalCards}`,
                })}
              </span>
            </div>

            <div className="vocab-face-content py-4">
              <div className="vocab-word-row">
                <h3 className="vocab-study-word font-bold tracking-tight text-heritage-green dark:text-warm-ivory">
                  {card.word}
                </h3>
                <button
                  type="button"
                  tabIndex={isFlipped ? -1 : 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAudio(card.word);
                  }}
                  className="vocab-audio-button"
                  title={t('flip_view.play_pronunciation', 'Phát âm')}
                  aria-label={t('flip_view.pronounce_word', {
                    word: card.word,
                    defaultValue: `Pronounce ${card.word}`,
                  })}
                >
                  <Volume2 size={20} />
                </button>
              </div>

              <p className="vocab-phonetics text-sm mt-1">
                <span className="font-mono text-antique-gold">{card.ipa}</span>{' '}
                <span className="opacity-75">· {card.pos}</span>
              </p>

              {maskedContext && (
                <div className="vocab-context-box mt-4 p-3.5 rounded-2xl bg-antique-gold/10 border border-antique-gold/25 text-left">
                  <p className="text-[10px] uppercase font-bold text-antique-gold tracking-wider mb-1">
                    {t('flip_view.context_label', 'Ngữ cảnh (Điền từ vào chỗ trống):')}
                  </p>
                  <p className="vocab-context font-serif text-sm italic text-ink dark:text-warm-ivory leading-relaxed">
                    “{maskedContext}”
                  </p>
                </div>
              )}
            </div>

            <div className="vocab-flip-hint flex items-center justify-center gap-2 pt-2 border-t border-antique-gold/15 text-xs text-ink-soft">
              <RotateCw size={13} />
              <span>{t('flip_view.tap_to_reveal', 'Nhấn Space hoặc chạm để hiện đáp án')}</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-black/10 dark:bg-white/10 rounded">
                {t('flip_view.key_space', 'Space')}
              </kbd>
            </div>
          </div>

          {/* Back Face: Full Definition + IPA + Original Example Sentence */}
          <div aria-hidden={!isFlipped} className="vocab-card-back vocab-card-face">
            <button
              type="button"
              className="vocab-card-flip-trigger"
              tabIndex={!isFlipped ? -1 : 0}
              onClick={onToggleFlip}
              aria-label={t('flip_view.aria_back', {
                meaning: card.viMeaning,
                defaultValue: `Meaning: ${card.viMeaning}. Flip to see the English word.`,
              })}
            />
            <div className="vocab-face-meta">
              <span className="font-medium text-antique-bright">
                {t('flip_view.back_meta', 'Giải nghĩa & Ngữ âm')}
              </span>
              <span className="text-xs font-mono opacity-80">
                {t('flip_view.card_counter', {
                  current: currentIndex + 1,
                  total: totalCards,
                  defaultValue: `Card ${currentIndex + 1} / ${totalCards}`,
                })}
              </span>
            </div>

            <div className="vocab-face-content py-4">
              <div className="flex items-center justify-center gap-2">
                <p className="vocab-phonetics text-sm text-warm-ivory">
                  <strong className="text-base text-antique-bright">{card.word}</strong>{' '}
                  <span className="opacity-75">({card.pos})</span> ·{' '}
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
                  title={t('flip_view.play_pronunciation', 'Phát âm')}
                  aria-label={t('flip_view.pronounce_word', {
                    word: card.word,
                    defaultValue: `Pronounce ${card.word}`,
                  })}
                >
                  <Volume2 size={18} />
                </button>
              </div>

              <h3 className="vocab-study-meaning text-2xl font-bold mt-2 text-antique-bright">
                {card.viMeaning}
              </h3>

              {card.viDefinition && card.viDefinition !== card.viMeaning && (
                <p className="text-xs text-warm-ivory/90 italic mt-1 max-w-prose mx-auto">
                  {card.viDefinition}
                </p>
              )}

              {card.contextEn && (
                <div className="vocab-context-box mt-4 text-xs bg-black/25 p-3 rounded-xl border border-white/15 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-antique-bright block mb-1">
                    {t('flip_view.original_context_label', 'Ngữ cảnh văn hóa gốc:')}
                  </span>
                  <p className="italic font-sans leading-relaxed text-warm-ivory">
                    “{card.contextEn}”
                  </p>
                </div>
              )}
            </div>

            <div className="vocab-flip-hint flex items-center justify-center gap-2 pt-2 border-t border-white/15 text-xs text-warm-ivory/80">
              <RotateCw size={13} />
              <span>{t('flip_view.tap_to_return', 'Chạm hoặc nhấn Space để lật lại mặt trước')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Front Face Action: Show Answer / Flip Trigger */}
      {!isFlipped && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={onToggleFlip}
            className="w-full sm:w-80 py-3 px-6 rounded-2xl bg-heritage-green hover:bg-heritage-forest text-warm-ivory font-bold text-sm shadow-md border border-antique-gold/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <RotateCw size={16} className="text-antique-gold" />
            <span>{t('flip_view.show_answer', 'Hiện đáp án')}</span>
            <kbd className="px-2 py-0.5 text-xs bg-black/25 border border-white/20 rounded text-antique-bright">
              Space
            </kbd>
          </button>
        </div>
      )}

      {/* Match the rating choices to the review session that owns this card. */}
      {isFlipped && (
        <div className="vocab-anki-ratings pt-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {onRate ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* 1. Again / Quên mất (Cam đất) */}
                <button
                  type="button"
                  onClick={() => handleRating('again')}
                  className="flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl border border-[#c85a32]/35 bg-[#c85a32]/10 text-[#c85a32] dark:text-[#e07a5f] hover:bg-[#c85a32]/20 focus-visible:ring-2 focus-visible:ring-[#c85a32] active:scale-[0.98] transition-all shadow-xs group"
                  title={isEn ? ratingIntervals.again.descriptionEn : ratingIntervals.again.descriptionVi}
                  aria-label={`${isEn ? ratingIntervals.again.labelEn : ratingIntervals.again.labelVi}: ${isEn ? ratingIntervals.again.descriptionEn : ratingIntervals.again.descriptionVi} (${isEn ? ratingIntervals.again.intervalTextEn : ratingIntervals.again.intervalTextVi})`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <RotateCcw size={14} aria-hidden="true" />
                    <span>{isEn ? ratingIntervals.again.labelEn : ratingIntervals.again.labelVi}</span>
                    <kbd className="px-1.5 py-0.2 bg-black/10 dark:bg-white/10 text-[10px] font-mono rounded opacity-60 font-normal">
                      1
                    </kbd>
                  </div>
                  <span className="text-[11px] font-medium tracking-tight opacity-90 mt-1">
                    {isEn ? ratingIntervals.again.intervalTextEn : ratingIntervals.again.intervalTextVi}
                  </span>
                </button>

                {/* 2. Hard / Khó nhớ (Vàng đất) */}
                <button
                  type="button"
                  onClick={() => handleRating('hard')}
                  className="flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl border border-[#b8860b]/35 bg-[#b8860b]/10 text-[#a06800] dark:text-[#e5b254] hover:bg-[#b8860b]/20 focus-visible:ring-2 focus-visible:ring-[#b8860b] active:scale-[0.98] transition-all shadow-xs group"
                  title={isEn ? ratingIntervals.hard.descriptionEn : ratingIntervals.hard.descriptionVi}
                  aria-label={`${isEn ? ratingIntervals.hard.labelEn : ratingIntervals.hard.labelVi}: ${isEn ? ratingIntervals.hard.descriptionEn : ratingIntervals.hard.descriptionVi} (${isEn ? ratingIntervals.hard.intervalTextEn : ratingIntervals.hard.intervalTextVi})`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <HelpCircle size={14} aria-hidden="true" />
                    <span>{isEn ? ratingIntervals.hard.labelEn : ratingIntervals.hard.labelVi}</span>
                    <kbd className="px-1.5 py-0.2 bg-black/10 dark:bg-white/10 text-[10px] font-mono rounded opacity-60 font-normal">
                      2
                    </kbd>
                  </div>
                  <span className="text-[11px] font-medium tracking-tight opacity-90 mt-1">
                    {isEn ? ratingIntervals.hard.intervalTextEn : ratingIntervals.hard.intervalTextVi}
                  </span>
                </button>

                {/* 3. Good / Nhớ rồi (Xanh dịu) */}
                <button
                  type="button"
                  onClick={() => handleRating('good')}
                  className="flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl bg-[#2d7d6f] hover:bg-[#256b5e] text-white font-bold active:scale-[0.98] transition-all shadow-md border border-[#2d7d6f]/70 focus-visible:ring-2 focus-visible:ring-[#2d7d6f] group"
                  title={isEn ? ratingIntervals.good.descriptionEn : ratingIntervals.good.descriptionVi}
                  aria-label={`${isEn ? ratingIntervals.good.labelEn : ratingIntervals.good.labelVi}: ${isEn ? ratingIntervals.good.descriptionEn : ratingIntervals.good.descriptionVi} (${isEn ? ratingIntervals.good.intervalTextEn : ratingIntervals.good.intervalTextVi})`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <CheckCircle2 size={14} aria-hidden="true" />
                    <span>{isEn ? ratingIntervals.good.labelEn : ratingIntervals.good.labelVi}</span>
                    <kbd className="px-1.5 py-0.2 bg-black/25 text-white/90 text-[10px] font-mono rounded opacity-70 font-normal">
                      3
                    </kbd>
                  </div>
                  <span className="text-[11px] font-medium tracking-tight text-emerald-100 mt-1">
                    {isEn ? ratingIntervals.good.intervalTextEn : ratingIntervals.good.intervalTextVi}
                  </span>
                </button>

                {/* 4. Easy / Thuộc làu (Xanh đậm) */}
                <button
                  type="button"
                  onClick={() => handleRating('easy')}
                  className="flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl bg-heritage-green hover:bg-heritage-forest text-white font-bold active:scale-[0.98] transition-all shadow-md border border-heritage-green/70 focus-visible:ring-2 focus-visible:ring-heritage-green group"
                  title={isEn ? ratingIntervals.easy.descriptionEn : ratingIntervals.easy.descriptionVi}
                  aria-label={`${isEn ? ratingIntervals.easy.labelEn : ratingIntervals.easy.labelVi}: ${isEn ? ratingIntervals.easy.descriptionEn : ratingIntervals.easy.descriptionVi} (${isEn ? ratingIntervals.easy.intervalTextEn : ratingIntervals.easy.intervalTextVi})`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Sparkles size={14} aria-hidden="true" />
                    <span>{isEn ? ratingIntervals.easy.labelEn : ratingIntervals.easy.labelVi}</span>
                    <kbd className="px-1.5 py-0.2 bg-black/25 text-white/90 text-[10px] font-mono rounded opacity-70 font-normal">
                      4
                    </kbd>
                  </div>
                  <span className="text-[11px] font-medium tracking-tight text-emerald-100 mt-1">
                    {isEn ? ratingIntervals.easy.intervalTextEn : ratingIntervals.easy.intervalTextVi}
                  </span>
                </button>
              </div>

              {/* Responsive Hotkey & Guidance Hint */}
              <p className="text-center text-xs text-ink-soft mt-3">
                {isEn
                  ? 'Hotkeys: 1 Again · 2 Hard · 3 Good · 4 Easy'
                  : 'Phím tắt: 1 Quên mất · 2 Khó nhớ · 3 Nhớ rồi · 4 Thuộc làu'}
              </p>
            </>
          ) : (
            <div className="vocab-review-actions">
              <button type="button" onClick={onReviewLater}>
                <RotateCcw size={18} aria-hidden="true" />
                <span>{t('flip_view.btn_forgot', 'Cần ôn lại')}</span>
                <kbd aria-hidden="true">1</kbd>
              </button>
              <button type="button" onClick={onMastered}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{t('flip_view.btn_remembered', 'Đã nhớ')}</span>
                <kbd aria-hidden="true">2</kbd>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FlashcardFlipView;
