import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Flashcard } from "@/data/flashcardsData";

interface FlashcardSpellingViewProps {
  card: Flashcard;
  spellingInput: string;
  onChangeInput: (value: string) => void;
  spellingFeedback: "correct" | "incorrect" | null;
  onCheckSpelling: () => void;
  onNext: () => void;
}

export function FlashcardSpellingView({
  card,
  spellingInput,
  onChangeInput,
  spellingFeedback,
  onCheckSpelling,
  onNext,
}: FlashcardSpellingViewProps) {
  const { t } = useTranslation('flashcards');

  return (
    <div className="vocab-spelling-view w-full max-w-2xl mx-auto p-5 sm:p-6 rounded-3xl bg-surface border border-line flex flex-col justify-between text-center gap-5 animate-in fade-in duration-200">
      <div className="my-auto space-y-2">
        <span className="text-xs font-bold text-[#6E7E79]">
          {t('spelling.badge', 'Type the matching English word')}
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#059669] mt-1">
          "{card.viMeaning}"
        </h3>
      </div>

      <div className="w-full max-w-xl mx-auto space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            aria-label={t('spelling.input_aria', 'English word')}
            value={spellingInput}
            readOnly={spellingFeedback !== null}
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (spellingFeedback) onNext(); else onCheckSpelling();
              }
            }}
            placeholder={t('spelling.input_placeholder', 'Type the word and press Enter…')}
            className="w-full px-5 py-3.5 rounded-2xl bg-rice-paper/60 border-2 border-heritage-green/20 text-sm text-heritage-green font-bold focus:outline-none focus:border-heritage-green"
          />
          <button
            onClick={spellingFeedback ? onNext : onCheckSpelling}
            disabled={!spellingInput.trim()}
            className="vocab-study-primary"
          >
            {spellingFeedback ? t('spelling.btn_next', 'Next card') : t('spelling.btn_check', 'Check answer')}
          </button>
        </div>

        {spellingFeedback === "correct" && (
          <div role="status" className="vocab-feedback vocab-feedback-correct">
            <Check className="w-4 h-4 shrink-0" />
            <span>{t('spelling.correct', { word: card.word, defaultValue: `Correct! "${card.word}"` })}</span>
          </div>
        )}
        {spellingFeedback === "incorrect" && (
          <div role="status" className="vocab-feedback vocab-feedback-incorrect">
            <X className="w-4 h-4 shrink-0" />
            <span>{t('spelling.incorrect', { word: card.word, defaultValue: `Not quite. The answer is: "${card.word}"` })}</span>
          </div>
        )}
      </div>
    </div>
  );
}
