import { ChevronRight, Check, X } from "lucide-react";
import type { Flashcard } from "@/data/flashcardsData";

interface FlashcardMultipleChoiceViewProps {
  card: Flashcard;
  mcSelected: number | null;
  onSelectOption: (index: number) => void;
  onNextQuestion: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export function FlashcardMultipleChoiceView({
  card,
  mcSelected,
  onSelectOption,
  onNextQuestion,
}: FlashcardMultipleChoiceViewProps) {
  return (
    <div className="vocab-quiz-view w-full max-w-2xl mx-auto p-5 sm:p-6 rounded-3xl bg-surface border border-line flex flex-col justify-between gap-4 animate-in fade-in duration-300">
      <div className="text-center space-y-2.5 my-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rice-paper text-heritage-green font-bold text-xs border border-antique-gold/40">
          Choose the meaning
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-heritage-green">
          {card.word}
        </h3>
        <p className="text-xs sm:text-sm italic text-text-body max-w-md mx-auto bg-rice-paper/60 p-3 rounded-xl border border-heritage-green/10">
          "{card.contextEn}"
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {card.options?.map((opt, idx) => {
          const isSelected = mcSelected === idx;
          const isCorrect = idx === card.correctIndex;
          const label = OPTION_LABELS[idx] || `${idx + 1}`;

          let cardStyle =
            "vocab-answer";
          let badgeStyle = "vocab-answer-marker";

          if (mcSelected !== null) {
            if (isCorrect) {
              cardStyle =
                "vocab-answer is-correct";
              badgeStyle = "vocab-answer-marker";
            } else if (isSelected && !isCorrect) {
              cardStyle =
                "vocab-answer is-incorrect";
              badgeStyle = "vocab-answer-marker";
            }
          }

          return (
            <button
              key={opt}
              onClick={() => onSelectOption(idx)}
              disabled={mcSelected !== null}
              className={`p-4 sm:p-5 rounded-2xl text-left text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-3.5 focus-ring ${cardStyle}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 border ${badgeStyle}`}
              >
                {mcSelected !== null && isCorrect ? (
                  <><Check className="w-4 h-4" /><span className="sr-only">Correct answer: </span></>
                ) : mcSelected !== null && isSelected && !isCorrect ? (
                  <><X className="w-4 h-4" /><span className="sr-only">Incorrect answer: </span></>
                ) : (
                  label
                )}
              </div>
              <span className="flex-1 leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>

      {mcSelected !== null && (
        <div className="text-center pt-2" role="status">
          <p className={mcSelected === card.correctIndex ? "vocab-feedback-correct" : "vocab-feedback-incorrect"}>{mcSelected === card.correctIndex ? "Correct!" : "Not quite. The correct answer is highlighted."}</p>
          <button
            onClick={onNextQuestion}
            className="vocab-study-primary"
          >
            <span>Next card</span>
            <ChevronRight className="w-4 h-4 text-antique-gold" />
          </button>
        </div>
      )}
    </div>
  );
}
