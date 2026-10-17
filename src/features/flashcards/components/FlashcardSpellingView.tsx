import { Check, X } from "lucide-react";
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
  return (
    <div className="vocab-spelling-view w-full max-w-2xl mx-auto p-5 sm:p-6 rounded-3xl bg-surface border border-line flex flex-col justify-between text-center gap-5 animate-in fade-in duration-200">
      <div className="my-auto space-y-2">
        <span className="text-xs font-bold text-[#6E7E79]">
          Gõ từ tiếng Anh tương ứng:
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#059669] mt-1">
          "{card.viMeaning}"
        </h3>
      </div>

      <div className="w-full max-w-xl mx-auto space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            aria-label="Nhập từ tiếng Anh"
            value={spellingInput}
            readOnly={spellingFeedback !== null}
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (spellingFeedback) onNext(); else onCheckSpelling();
              }
            }}
            placeholder="Gõ từ tại đây và ấn Enter..."
            className="w-full px-5 py-3.5 rounded-2xl bg-[#F6EEDC]/60 border-2 border-[rgba(30,75,67,0.2)] text-sm text-[#1E4B43] font-bold focus:outline-none focus:border-[#1E4B43]"
          />
          <button
            onClick={spellingFeedback ? onNext : onCheckSpelling}
            disabled={!spellingInput.trim()}
            className="px-6 py-3.5 rounded-2xl bg-[#1E4B43] hover:bg-[#163D37] text-white text-xs font-bold cursor-pointer shrink-0 shadow-sm"
          >
            {spellingFeedback ? 'Tiếp tục' : 'Kiểm tra'}
          </button>
        </div>

        {spellingFeedback === "correct" && (
          <div className="p-3.5 rounded-2xl bg-[#ECFDF5] text-[#059669] text-xs font-bold border border-[#059669]/30 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Chính xác! "{card.word}"</span>
          </div>
        )}
        {spellingFeedback === "incorrect" && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 flex items-center justify-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            <span>Chưa đúng. Đáp án là: "{card.word}"</span>
          </div>
        )}
      </div>
    </div>
  );
}
