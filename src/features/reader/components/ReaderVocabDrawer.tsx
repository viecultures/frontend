import { X, Bookmark, BookmarkCheck, ArrowRight } from "lucide-react";
import Link from "@/components/Link";
import type { VocabItem } from "@/data/readerData";

interface ReaderVocabDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVocab: VocabItem | null;
  onSelectVocab: (vocab: VocabItem) => void;
  vocabList: VocabItem[];
  bookmarkedWords: Record<string, boolean>;
  onToggleBookmarkWord: (wordId: string) => void;
}

export function ReaderVocabDrawer({
  isOpen,
  onClose,
  selectedVocab,
  onSelectVocab,
  vocabList,
  bookmarkedWords,
  onToggleBookmarkWord,
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
      <div className="relative w-full max-w-md bg-[#FBF7EE] h-full shadow-2xl border-l border-[#D9B76A]/40 p-6 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300">
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(30,75,67,0.12)] mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1E4B43]">
                Từ Vựng Bài Đọc
              </h3>
              <span className="text-xs text-[#6E7E79]">
                "Tết: Renewal, Remembrance and Regional Flavours"
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F6EEDC] text-[#1E4B43] transition-colors cursor-pointer"
              aria-label="Đóng bảng từ vựng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Inspected Vocab Card */}
          {selectedVocab && (
            <div className="p-5 rounded-2xl bg-[#F6EEDC] border border-[#D9B76A]/40 mb-6 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-serif text-xl font-bold text-[#1E4B43]">
                  {selectedVocab.word}
                </h4>
                <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-[#1E4B43]/10 text-[#1E4B43]">
                  {selectedVocab.pos}
                </span>
              </div>
              <p className="text-xs font-mono text-[#6E7E79] italic mb-3">
                {selectedVocab.ipa}
              </p>
              <p className="text-sm font-bold text-[#1E4B43] mb-3 leading-snug">
                {selectedVocab.viMeaning}
              </p>
              <div className="p-3 rounded-xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.08)] text-xs text-[#3F5550] italic">
                "{selectedVocab.contextSentence}"
              </div>

              <div className="mt-4 pt-3 border-t border-[rgba(30,75,67,0.10)] flex items-center justify-between">
                <button
                  onClick={() => onToggleBookmarkWord(selectedVocab.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E4B43] hover:text-[#D9B76A] cursor-pointer"
                >
                  {bookmarkedWords[selectedVocab.id] ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 fill-[#1E4B43]" />
                      <span>Đã lưu vào bộ sưu tập</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Lưu từ vựng này</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* List of All Vocabulary in Article */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6E7E79] mb-2">
              Tất cả từ vựng trong bài ({vocabList.length})
            </h4>
            {vocabList.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectVocab(item)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedVocab?.id === item.id
                    ? "bg-[#1E4B43] text-[#FBF7EE] border-[#D9B76A]"
                    : "bg-[#FBF7EE] text-[#3F5550] border-[rgba(30,75,67,0.10)] hover:bg-[#F6EEDC]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm">{item.word}</span>
                  <span className="text-[10px] opacity-80 uppercase font-mono">
                    {item.pos}
                  </span>
                </div>
                <p className="text-xs mt-1 line-clamp-1 opacity-90">{item.viMeaning}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="pt-4 border-t border-[rgba(30,75,67,0.12)] space-y-2 mt-6">
          <Link
            href="/discovery#flashcards"
            className="w-full py-3 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] flex items-center justify-center gap-2 shadow-sm border border-[#D9B76A]/50 transition-all"
          >
            <span>Ôn Tập Flashcards từ vựng</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D9B76A]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
