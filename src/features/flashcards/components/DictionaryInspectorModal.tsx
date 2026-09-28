import { X, Volume2, ArrowRight } from "lucide-react";
import type { Lesson } from "@/data/discoveryData";
import { getDeckData } from "@/data/flashcardsData";

interface DictionaryInspectorModalProps {
  lesson: Lesson | null;
  onClose: () => void;
  onPlayAudio: (word: string) => void;
  onGoToStudy: (lessonId: string) => void;
}

export function DictionaryInspectorModal({
  lesson,
  onClose,
  onPlayAudio,
  onGoToStudy,
}: DictionaryInspectorModalProps) {
  if (!lesson) return null;

  const deckData = getDeckData(lesson);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase bg-[#ECFDF5] text-[#059669] px-2.5 py-0.5 rounded-full">
              {lesson.categoryVi}
            </span>
            <h3 className="font-serif text-xl font-bold text-[#1E4B43] mt-1">
              Từ điển bộ từ: {lesson.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {deckData.cards.map((card, idx) => (
            <div
              key={card.id}
              className="p-4 rounded-2xl bg-[#F6EEDC]/50 border border-[rgba(30,75,67,0.1)] flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1E4B43]">
                    {idx + 1}. {card.word}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    {card.ipa}
                  </span>
                  <span className="text-[10px] font-bold bg-[#1E4B43]/10 text-[#1E4B43] px-2 py-0.5 rounded">
                    {card.pos}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#059669]">
                  Nghĩa: {card.viMeaning}
                </div>
                <div className="text-xs text-[#3F5550]">
                  Định nghĩa: {card.viDefinition}
                </div>
                <div className="text-xs italic text-[#6E7E79]">
                  "{card.contextEn}"
                </div>
              </div>

              <button
                onClick={() => onPlayAudio(card.word)}
                className="p-2.5 rounded-full bg-[#1E4B43] text-white hover:bg-[#163D37] cursor-pointer shrink-0 shadow-xs"
                title="Phát âm"
              >
                <Volume2 className="w-4 h-4 text-[#D9B76A]" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            onClick={() => {
              const lid = lesson.id;
              onClose();
              onGoToStudy(lid);
            }}
            className="px-6 py-2.5 rounded-full bg-[#1E4B43] text-white text-xs font-bold hover:bg-[#163D37] cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Mở Ôn Tập Flashcard</span>
            <ArrowRight className="w-4 h-4 text-[#D9B76A]" />
          </button>
        </div>
      </div>
    </div>
  );
}
