import { X, Send } from "lucide-react";

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

  return (
    <div className="mb-10 p-8 sm:p-10 rounded-3xl bg-rice-paper border-2 border-antique-gold/60 shadow-xl space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-heritage-green/12">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            🎁 Hoàn thành bài viết nhận ngay +100 Xu 💎
          </span>
          <h2 className="font-serif text-2xl font-bold text-heritage-green mt-0.5">
            Gửi Bài Viết Theo Chủ Đề Tuần Này
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
          <label className="block text-xs font-bold text-heritage-green uppercase mb-1.5">
            Góc nhìn bài viết:
          </label>
          <select className="w-full px-4 py-2.5 rounded-xl bg-warm-ivory border border-heritage-green/15 text-xs font-bold text-heritage-green focus:outline-none focus-ring">
            <option>🏛️ Cảm Nhận Kiến Trúc & Di Sản (Architecture & Heritage)</option>
            <option>📸 Kỷ Niệm Chuyến Đi & Ảnh Đẹp (Travel Photo Story)</option>
            <option>🏮 Lịch Sử & Lễ Hội Cố Đô (History & Customs)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-heritage-green uppercase mb-1.5">
            Tiêu đề bài viết:
          </label>
          <input
            type="text"
            value={entryTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="Nhập tiêu đề cho bài viết của bạn..."
            className="w-full px-4 py-2.5 rounded-xl bg-warm-ivory border border-heritage-green/15 text-xs font-bold text-heritage-green focus:outline-none focus-ring"
          />
        </div>
      </div>

      {/* Vocab Checklist */}
      <div className="p-4 rounded-2xl bg-warm-ivory border border-heritage-green/10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
          Đánh dấu các từ vựng bạn đưa vào bài (Ứng dụng 3+ từ để nhận thưởng Xu):
        </span>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-heritage-green">
          {AVAILABLE_VOCAB.map((word) => (
            <label key={word} className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!selectedVocab[word]}
                onChange={(e) => onToggleVocab(word, e.target.checked)}
                className="accent-heritage-green w-4 h-4 rounded"
              />
              <span>{word}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={entryText}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder="Chia sẻ suy nghĩ hoặc câu chuyện của bạn bằng tiếng Anh..."
        className="w-full h-36 p-4 rounded-2xl bg-warm-ivory border border-heritage-green/15 text-sm text-heritage-green focus:outline-none focus:ring-2 focus:ring-heritage-green/20 leading-relaxed"
      />

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-text-secondary italic">
          🌟 Không áp lực ngữ pháp • Khuyến khích thực hành từ vựng tự nhiên
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-warm-ivory border border-heritage-green/12 hover:bg-mist-cloud cursor-pointer focus-ring"
          >
            Hủy
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 inline-flex items-center gap-1.5 focus-ring cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-antique-gold" />
            <span>🚀 Đăng Bài (+100 Xu 💎)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
