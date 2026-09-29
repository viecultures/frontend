import { X, Send, Coins, Gift, Sparkles, Landmark, BookOpen, CheckCircle2 } from "lucide-react";

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
    <div className="mb-10 p-6 sm:p-10 rounded-3xl bg-rice-paper border-2 border-antique-gold/60 shadow-xl space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-heritage-green/12">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-antique-gold" />
            <span>Hoàn thành bài viết nhận ngay +100 Xu Văn Hóa</span>
          </span>
          <h2 className="font-serif text-2xl font-bold text-heritage-green mt-0.5">
            Gửi Bài Viết Thử Thách Chủ Đề Tuần
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-mist-cloud text-heritage-green transition-colors cursor-pointer focus-ring"
          aria-label="Đóng form gửi bài"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-heritage-green uppercase mb-1.5 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-antique-gold" />
            <span>Góc nhìn bài viết:</span>
          </label>
          <select className="w-full px-4 py-2.5 rounded-xl bg-surface border border-heritage-green/15 text-xs font-bold text-heritage-green focus:outline-none focus:ring-2 focus:ring-antique-gold/40">
            <option>Cảm Nhận Kiến Trúc & Di Sản (Architecture & Heritage)</option>
            <option>Kỷ Niệm Chuyến Đi & Ảnh Đẹp (Travel Photo Story)</option>
            <option>Lịch Sử & Lễ Hội Cố Đô (History & Customs)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-heritage-green uppercase mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span>Tiêu đề bài viết:</span>
          </label>
          <input
            type="text"
            value={entryTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="Nhập tiêu đề cho bài dự thi của bạn..."
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-heritage-green/15 text-xs font-bold text-heritage-green focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
          />
        </div>
      </div>

      {/* Vocab Checklist */}
      <div className="p-4 rounded-2xl bg-surface border border-heritage-green/10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
            <span>Đánh dấu từ vựng đưa vào bài (Ứng dụng 3+ từ để nhận Xu):</span>
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Đã tích hợp: {appliedCount}/3 từ
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
          value={entryText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Chia sẻ góc nhìn hoặc câu chuyện của bạn bằng tiếng Anh (100 - 300 từ)..."
          className="w-full h-40 p-4 rounded-2xl bg-surface border border-heritage-green/15 text-sm text-heritage-green placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-antique-gold/40 leading-relaxed font-sans"
        />
        <div className="flex items-center justify-between text-xs text-text-secondary px-1">
          <span>Khuyến khích diễn đạt tự nhiên theo phong cách bài đọc di sản.</span>
          <span className="font-semibold">{wordCount} từ</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-heritage-green/10">
        <span className="text-xs text-text-secondary italic hidden sm:inline">
          Không áp lực ngữ pháp • Tự tin truyền tải tình yêu văn hóa
        </span>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-surface border border-line hover:bg-mist-cloud cursor-pointer focus-ring"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 inline-flex items-center gap-2 focus-ring cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-antique-gold" />
            <span>Nộp Bài Dự Thi (+100 Xu)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
