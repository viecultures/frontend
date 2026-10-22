import { X, Bookmark, BookmarkCheck } from "lucide-react";
import type { VocabItem } from "@/data/readerData";

interface ReaderVocabDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVocab: VocabItem | null;
  onSelectVocab: (vocab: VocabItem) => void;
  vocabList: VocabItem[];
  bookmarkedWords: Record<string, boolean>;
  onToggleBookmarkWord: (wordId: string) => void;
  articleTitle?: string;
}

export function ReaderVocabDrawer({
  isOpen,
  onClose,
  selectedVocab,
  onSelectVocab,
  vocabList,
  bookmarkedWords,
  onToggleBookmarkWord,
  articleTitle = 'Tết: Renewal, Remembrance and Regional Flavours',
}: ReaderVocabDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* Drawer Body Panel */}
      <div className="relative w-full max-w-md bg-warm-ivory h-full shadow-2xl border-l border-antique-gold/40 p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-heritage-green/12 mb-6">
            <div>
              <h3 className="font-sans text-lg font-bold text-heritage-green">
                Article vocabulary
              </h3>
              <span className="text-xs text-[#6E7E79]">
                {articleTitle}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-rice-paper text-heritage-green transition-colors cursor-pointer"
              aria-label="Close vocabulary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Inspected Vocab Card */}
          {selectedVocab && (
            <div className="p-5 rounded-2xl bg-rice-paper border border-antique-gold/40 mb-6 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-sans text-xl font-bold text-heritage-green">
                  {selectedVocab.word}
                </h4>
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-heritage-green/10 text-heritage-green">
                  {selectedVocab.pos}
                </span>
              </div>
              <p className="text-xs font-mono text-[#6E7E79] italic mb-3">
                {selectedVocab.ipa}
              </p>
              <p className="text-sm font-bold text-heritage-green mb-3 leading-snug">
                {selectedVocab.viMeaning}
              </p>
              <div className="p-3 rounded-xl bg-warm-ivory border border-heritage-green/8 text-xs text-ink-soft italic">
                "{selectedVocab.contextSentence}"
              </div>

              <div className="mt-4 pt-3 border-t border-heritage-green/10 flex items-center justify-between">
                <button
                  onClick={() => onToggleBookmarkWord(selectedVocab.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-heritage-green hover:text-antique-gold cursor-pointer"
                >
                  {bookmarkedWords[selectedVocab.id] ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 fill-heritage-green" />
                      <span>Saved to vocabulary</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Save word</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* List of All Vocabulary in Article */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E7E79] mb-2">
              All article vocabulary ({vocabList.length})
            </h4>
            {vocabList.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectVocab(item)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedVocab?.id === item.id
                    ? "bg-heritage-green text-warm-ivory border-antique-gold"
                    : "bg-warm-ivory text-ink-soft border-heritage-green/10 hover:bg-rice-paper"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans font-bold text-sm">{item.word}</span>
                  <span className="text-[10px] opacity-80 uppercase font-mono">
                    {item.pos}
                  </span>
                </div>
                <p className="text-xs mt-1 line-clamp-1 opacity-90">{item.viMeaning}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
