import type { Flashcard } from "@/data/flashcardsData";

interface FlashcardSpellingViewProps {
  card: Flashcard;
  spellingInput: string;
  onChangeInput: (value: string) => void;
  spellingFeedback: "correct" | "incorrect" | null;
  onCheckSpelling: () => void;
}

export function FlashcardSpellingView({
  card,
  spellingInput,
  onChangeInput,
  spellingFeedback,
  onCheckSpelling,
}: FlashcardSpellingViewProps) {
  return (
    <div className="w-full min-h-[380px] p-8 sm:p-10 rounded-3xl bg-white border border-[rgba(30,75,67,0.15)] shadow-sm flex flex-col justify-between text-center space-y-6 animate-in fade-in duration-200">
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
            value={spellingInput}
            onChange={(e) => onChangeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCheckSpelling();
              }
            }}
            placeholder="Gõ từ tại đây và ấn Enter..."
            className="w-full px-5 py-3.5 rounded-2xl bg-[#F6EEDC]/60 border-2 border-[rgba(30,75,67,0.2)] text-sm text-[#1E4B43] font-bold focus:outline-none focus:border-[#1E4B43]"
          />
          <button
            onClick={onCheckSpelling}
            className="px-6 py-3.5 rounded-2xl bg-[#1E4B43] hover:bg-[#163D37] text-white text-xs font-bold cursor-pointer shrink-0 shadow-sm"
          >
            Kiểm tra
          </button>
        </div>

        {spellingFeedback === "correct" && (
          <div className="p-3.5 rounded-2xl bg-[#ECFDF5] text-[#059669] text-xs font-bold border border-[#059669]/30">
            ✓ Chính xác! "{card.word}"
          </div>
        )}
        {spellingFeedback === "incorrect" && (
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
            ✕ Chưa đúng. Đáp án là: "{card.word}"
          </div>
        )}
      </div>
    </div>
  );
}
