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
    <div className="w-full max-w-2xl mx-auto min-h-[420px] p-8 sm:p-10 rounded-3xl bg-surface border-2 border-line shadow-lg flex flex-col justify-between space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2.5 my-auto">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rice-paper text-heritage-green font-bold text-xs border border-antique-gold/40">
          Trắc Nghiệm Nhanh
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
            "bg-surface text-heritage-green border-2 border-line hover:border-antique-gold hover:bg-rice-paper/50";
          let badgeStyle = "bg-rice-paper text-heritage-green border-line";

          if (mcSelected !== null) {
            if (isCorrect) {
              cardStyle =
                "bg-emerald-50 text-emerald-900 border-2 border-emerald-500 shadow-md";
              badgeStyle = "bg-emerald-600 text-white border-emerald-600";
            } else if (isSelected && !isCorrect) {
              cardStyle =
                "bg-rose-50 text-rose-900 border-2 border-rose-400 shadow-md";
              badgeStyle = "bg-rose-600 text-white border-rose-600";
            }
          }

          return (
            <button
              key={opt}
              onClick={() => onSelectOption(idx)}
              className={`p-4 sm:p-5 rounded-2xl text-left text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-3.5 focus-ring ${cardStyle}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 border ${badgeStyle}`}
              >
                {mcSelected !== null && isCorrect ? (
                  <Check className="w-4 h-4" />
                ) : mcSelected !== null && isSelected && !isCorrect ? (
                  <X className="w-4 h-4" />
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
        <div className="text-center pt-2">
          <button
            onClick={onNextQuestion}
            className="px-8 py-3.5 rounded-full text-xs font-bold text-warm-ivory bg-gradient-to-r from-heritage-green to-teal-800 hover:from-heritage-dark hover:to-teal-900 cursor-pointer inline-flex items-center gap-2 shadow-lg border border-antique-gold/40 transition-all focus-ring hover:scale-105"
          >
            <span>Câu tiếp theo</span>
            <ChevronRight className="w-4 h-4 text-antique-gold" />
          </button>
        </div>
      )}
    </div>
  );
}
