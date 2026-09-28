import { X, Send } from "lucide-react";

interface CommunityPostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLesson: string;
  onChangeLesson: (lesson: string) => void;
  reflectionText: string;
  onChangeReflectionText: (text: string) => void;
  onPublish: () => void;
}

export function CommunityPostEditor({
  isOpen,
  onClose,
  selectedLesson,
  onChangeLesson,
  reflectionText,
  onChangeReflectionText,
  onPublish,
}: CommunityPostEditorProps) {
  if (!isOpen) return null;

  return (
    <div
      id="reflection-editor"
      className="mb-10 p-8 rounded-3xl bg-rice-paper border-2 border-antique-gold/60 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <div>
          <h2 className="font-serif text-xl font-bold text-heritage-green">
            Viết Bài Cảm Nhận Văn Hóa Của Bạn
          </h2>
          <span className="text-xs text-text-secondary">
            Ứng dụng từ vựng bài đọc để viết bài nhận xét ngắn tự nhiên.
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-mist-cloud text-heritage-green transition-colors focus-ring cursor-pointer"
          aria-label="Đóng trình soạn bài"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Lesson Selector */}
      <div>
        <label
          htmlFor="lesson-select"
          className="block text-xs font-bold text-heritage-green uppercase mb-2"
        >
          Bài học liên quan:
        </label>
        <select
          id="lesson-select"
          value={selectedLesson}
          onChange={(e) => onChangeLesson(e.target.value)}
          className="w-full md:w-72 px-4 py-2.5 rounded-xl bg-surface border border-heritage-green/15 text-xs font-bold text-heritage-green focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
        >
          <option value="Imperial Hue">Imperial Hue Architecture</option>
          <option value="Saigon Bánh Mì">Saigon Bánh Mì History</option>
          <option value="Hội An Lanterns">Hội An Lantern Festival</option>
          <option value="Bát Tràng Pottery">Bát Tràng Pottery Arts</option>
          <option value="Egg Coffee">Vietnamese Egg Coffee</option>
        </select>
      </div>

      {/* Textarea */}
      <textarea
        value={reflectionText}
        onChange={(e) => onChangeReflectionText(e.target.value)}
        placeholder="Chia sẻ kỷ niệm hoặc suy nghĩ của bạn bằng tiếng Anh..."
        className="w-full h-36 p-4 rounded-2xl bg-surface border border-heritage-green/15 text-sm text-heritage-green focus:outline-none focus:ring-2 focus:ring-antique-gold/40 leading-relaxed"
        aria-label="Nội dung bài cảm nhận"
      />

      {/* Editor Actions */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-text-secondary italic">
          💡 Viết tự do theo suy nghĩ của bạn • Khuyến khích chèn từ vựng bài đọc
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-surface border border-line hover:bg-mist-cloud transition-colors focus-ring cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onPublish}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 inline-flex items-center gap-1.5 transition-all focus-ring cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-antique-gold" />
            <span>Đăng Bài Cảm Nhận</span>
          </button>
        </div>
      </div>
    </div>
  );
}
