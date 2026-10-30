import { useTranslation } from "react-i18next";
import { X, Send, Coins, BookOpen, Landmark } from "lucide-react";

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
  const { t } = useTranslation("community");

  if (!isOpen) return null;

  const wordCount = entryText.trim() ? entryText.trim().split(/\s+/).length : 0;
  const appliedCount = Object.values(selectedVocab).filter(Boolean).length;

  return (
    <div id="contest-editor" className="community-editor mb-6 p-5 sm:p-7 rounded-2xl bg-white border border-[#E8E2D5] shadow-lg space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E2D5]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-antique-gold" />
            <span>{t("community.contest.editor_banner")}</span>
          </span>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1D5046] mt-0.5">
            {t("community.contest.editor_title")}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-mist-cloud text-heritage-green transition-colors cursor-pointer focus-ring"
          aria-label={t("community.contest.close_editor_aria")}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-heritage-green uppercase mb-1.5 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-antique-gold" />
            <span>{t("community.contest.perspective_label")}</span>
          </label>
          <select aria-label={t("community.contest.perspective_label")} className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs font-medium text-[#1D5046] focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white">
            <option>{t("community.contest.perspective_arch")}</option>
            <option>{t("community.contest.perspective_travel")}</option>
            <option>{t("community.contest.perspective_history")}</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-heritage-green uppercase mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span>{t("community.contest.entry_title_label")}</span>
          </label>
          <input
            aria-label={t("community.contest.entry_title_label")}
            type="text"
            value={entryTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder={t("community.contest.entry_title_placeholder")}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs text-[#314F49] focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white"
          />
        </div>
      </div>

      {/* Vocab Checklist */}
      <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span>{t("community.contest.vocab_select_label")}</span>
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
            {t("community.contest.vocab_selected_count", { count: appliedCount })}
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
          aria-label={t("community.contest.entry_text_aria")}
          value={entryText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={t("community.contest.entry_text_placeholder")}
          className="w-full h-40 p-4 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-sm text-[#314F49] placeholder:text-[#6E7B75]/60 focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white leading-relaxed font-sans"
        />
        <div className="flex items-center justify-between text-xs text-text-secondary px-1">
          <span>{t("community.contest.hint_natural")}</span>
          <span className="font-semibold">{t("community.editor.words_count", { count: wordCount })}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-heritage-green/10">
        <span className="text-xs text-text-secondary italic hidden sm:inline">
          {t("community.contest.hint_no_pressure")}
        </span>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1D5046] bg-[#FAF7F0] border border-[#E8E2D5] hover:bg-white cursor-pointer focus-ring"
          >
            {t("community.contest.cancel_btn")}
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1D5046] hover:bg-[#153D35] border border-[#1D5046] inline-flex items-center gap-2 focus-ring cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-antique-gold" />
            <span>{t("community.contest.submit_entry_btn")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContestEntryEditor;
