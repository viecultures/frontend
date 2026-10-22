import { X, Volume2, ArrowRight } from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { Lesson } from "@/data/discoveryData";
import { VOCABULARY_CATEGORY_LABELS } from "../lib/vocabulary-catalog";
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
    <Dialog open={!!lesson} onClose={onClose} className="dictionary-dialog fixed inset-0 z-[60] bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <DialogPanel className="dictionary-dialog-panel w-full max-w-2xl bg-surface rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85dvh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase bg-[#ECFDF5] text-[#059669] px-2.5 py-0.5 rounded-full">
              {VOCABULARY_CATEGORY_LABELS[lesson.category]}
            </span>
            <DialogTitle className="font-serif text-xl font-bold text-ink mt-1">
              Vocabulary preview: {lesson.title}
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            aria-label="Close vocabulary preview"
            className="p-2.5 rounded-full hover:bg-surface-muted text-ink-soft cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {deckData.cards.map((card, idx) => (
            <div
              key={card.id}
              className="p-4 rounded-2xl bg-surface-muted border border-line flex items-start justify-between gap-4"
            >
              <div className="dictionary-preview-copy space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="dictionary-preview-word font-bold text-sm text-ink">
                    {idx + 1}. {card.word}
                  </span>
                  <span className="text-xs font-mono text-ink-faint">
                    {card.ipa}
                  </span>
                  <span className="text-[10px] font-bold bg-surface-sunken text-ink px-2 py-0.5 rounded">
                    {card.pos}
                  </span>
                </div>
                <div className="text-xs font-bold text-ink">
                  Meaning: {card.viMeaning}
                </div>
                <div className="text-xs text-ink-soft">
                  Definition: {card.viDefinition}
                </div>
                <div className="text-xs italic text-ink-faint">
                  "{card.contextEn}"
                </div>
              </div>

              <button
                onClick={() => onPlayAudio(card.word)}
                className="p-2.5 rounded-full bg-heritage-green text-white hover:bg-heritage-dark cursor-pointer shrink-0 shadow-xs"
                title="Play pronunciation"
                aria-label={`Pronounce ${card.word}`}
              >
                <Volume2 className="w-4 h-4 text-antique-gold" />
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
            className="px-6 py-2.5 rounded-full bg-heritage-green text-white text-xs font-bold hover:bg-heritage-dark cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Study these cards</span>
            <ArrowRight className="w-4 h-4 text-antique-gold" />
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
}
