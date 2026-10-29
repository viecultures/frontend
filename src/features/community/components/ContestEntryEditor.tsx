import { X, Send, Coins, Gift, BookOpen, Landmark, CheckCircle2 } from "lucide-react";

interface ContestEntryEditorProps {
  isOpen: boolean;
  onClose: () => void;
  entryTitle: string;
  onChangeTitle: (title: string) => void;
  entryText: string;
  onChangeText: (text: string) => void;
  selectedVocab: Record<string, boolean>;
  onToggleVocab: (word: string, checked: boolean) => void;
  onSubmit: () => void;
}

const AVAILABLE_VOCAB = ["architectural", "intangible", "promulgated", "fortress", "geomancy"];

export function ContestEntryEditor({
  isOpen,
  onClose,
  entryTitle,
  onChangeTitle,
  entryText,
  onChangeText,
  selectedVocab,
  onToggleVocab,
  onSubmit,
}: ContestEntryEditorProps) {
  if (!isOpen) return null;

  const wordCount = entryText.trim() ? entryText.trim().split(/\s+/).length : 0;
  const appliedCount = Object.values(selectedVocab).filter(Boolean).length;

  return (
    <div id="contest-editor" className="community-editor mb-6 p-5 sm:p-7 rounded-2xl bg-white border border-[#E8E2D5] shadow-lg space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E2D5]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-antique-gold" />
            <span>Complete an entry to receive +100 cultural coins</span>
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1D5046] mt-0.5">
            Submit your weekly challenge entry
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-mist-cloud text-heritage-green transition-colors cursor-pointer focus-ring"
          aria-label="Close contest editor"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-heritage-green uppercase mb-1.5 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-antique-gold" />
            <span>Writing perspective</span>
          </label>
          <select aria-label="Writing perspective" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs font-medium text-[#1D5046] focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white">
            <option>Architecture & heritage</option>
            <option>Travel photo story</option>
            <option>History & customs</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-heritage-green uppercase mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span>Entry title</span>
          </label>
          <input
            aria-label="Entry title"
            type="text"
            value={entryTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="Enter a title for your challenge entry…"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs text-[#314F49] focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white"
          />
        </div>
      </div>

      {/* Vocab Checklist */}
      <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span>Select the vocabulary used in your entry (use 3+ words to earn coins):</span>
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Selected: {appliedCount}/3 words
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-heritage-green pt-1">
          {AVAILABLE_VOCAB.map((word) => (
            <label key={word} className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!selectedVocab[word]}
                onChange={(e) => onToggleVocab(word, e.target.checked)}
                className="accent-heritage-green w-4 h-4 rounded"
              />
              <span className={selectedVocab[word] ? "text-emerald-800 font-bold" : "text-text-body"}>
                {word}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-1.5">
        <textarea
          aria-label="Contest entry text"
          value={entryText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Share your perspective or story in English (100–300 words)…"
          className="w-full h-40 p-4 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-sm text-[#314F49] placeholder:text-[#6E7B75]/60 focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white leading-relaxed font-sans"
        />
        <div className="flex items-center justify-between text-xs text-text-secondary px-1">
          <span>Express yourself naturally, inspired by the heritage stories you read.</span>
          <span className="font-semibold">{wordCount} words</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-heritage-green/10">
        <span className="text-xs text-text-secondary italic hidden sm:inline">
          No grammar pressure · Share your love of culture
        </span>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1D5046] bg-[#FAF7F0] border border-[#E8E2D5] hover:bg-white cursor-pointer focus-ring"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1D5046] hover:bg-[#153D35] border border-[#1D5046] inline-flex items-center gap-2 focus-ring cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-antique-gold" />
            <span>Submit entry (+100 coins)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
