import { X, Send, Sparkles, BookOpen, Tag } from "lucide-react";

interface CommunityPostEditorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLesson: string;
  onChangeLesson: (lesson: string) => void;
  postTitle?: string;
  onChangePostTitle?: (title: string) => void;
  reflectionText: string;
  onChangeReflectionText: (text: string) => void;
  onPublish: () => void;
}

const TOPIC_OPTIONS = [
  { value: "Imperial Hue", label: "Kiến trúc & Di sản Cố Đô Huế (Imperial Hue)" },
  { value: "Saigon Bánh Mì", label: "Ẩm thực Bánh Mì Sài Gòn (Saigon Bánh Mì)" },
  { value: "Hội An Lanterns", label: "Đêm Rằm & Phố Cổ Hội An (Hội An Lanterns)" },
  { value: "Bát Tràng Pottery", label: "Nghệ thuật Gốm Sứ Bát Tràng (Bát Tràng Pottery)" },
  { value: "Egg Coffee", label: "Văn hóa Cà Phê Trứng Hà Nội (Egg Coffee)" },
  { value: "Dong Ho Folk Art", label: "Tranh Dân Gian Đông Hồ (Dong Ho Art)" },
];

export function CommunityPostEditor({
  isOpen,
  onClose,
  selectedLesson,
  onChangeLesson,
  postTitle = "",
  onChangePostTitle,
  reflectionText,
  onChangeReflectionText,
  onPublish,
}: CommunityPostEditorProps) {
  if (!isOpen) return null;

  const wordCount = reflectionText.trim() ? reflectionText.trim().split(/\s+/).length : 0;

  return (
    <div
      id="reflection-editor"
      className="mb-10 p-6 sm:p-8 rounded-3xl bg-rice-paper border-2 border-antique-gold/60 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-antique-gold/20 text-heritage-green text-[11px] font-bold border border-antique-gold/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-antique-gold" />
              <span>Góc Nhìn Học Viên</span>
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-heritage-green">
            Viết Bài Cảm Nhận Văn Hóa Của Bạn
          </h2>
          <span className="text-xs text-text-secondary">
            Ứng dụng từ vựng bài đọc để viết bài chia sẻ tự nhiên. Không áp lực ngữ pháp đỏ.
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

      {/* Inputs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lesson Selector */}
        <div>
          <label
            htmlFor="lesson-select"
            className="block text-xs font-bold text-heritage-green uppercase mb-2 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span>Chủ đề / Bài học liên quan:</span>
          </label>
          <select
            id="lesson-select"
            value={selectedLesson}
            onChange={(e) => onChangeLesson(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-heritage-green/15 text-xs font-bold text-heritage-green focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
          >
            {TOPIC_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Title Input */}
        <div>
          <label
            htmlFor="title-input"
            className="block text-xs font-bold text-heritage-green uppercase mb-2 flex items-center gap-1.5"
          >
            <Tag className="w-3.5 h-3.5 text-antique-gold" />
            <span>Tiêu đề bài viết (Tùy chọn):</span>
          </label>
          <input
            id="title-input"
            type="text"
            value={postTitle}
            onChange={(e) => onChangePostTitle?.(e.target.value)}
            placeholder="Ví dụ: My unforgettable morning at Ngọ Môn Gate..."
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-heritage-green/15 text-xs font-medium text-heritage-green placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
          />
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-1.5">
        <textarea
          value={reflectionText}
          onChange={(e) => onChangeReflectionText(e.target.value)}
          placeholder="Chia sẻ kỷ niệm, cảm xúc hoặc suy nghĩ của bạn bằng tiếng Anh..."
          className="w-full h-40 p-4 rounded-2xl bg-surface border border-heritage-green/15 text-sm text-heritage-green placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-antique-gold/40 leading-relaxed font-sans"
          aria-label="Nội dung bài cảm nhận"
        />
        <div className="flex items-center justify-between text-xs text-text-secondary px-1">
          <span>Khuyến khích dùng ít nhất 2 từ vựng vừa học để tạo thói quen nhớ sâu.</span>
          <span className="font-semibold">{wordCount} từ</span>
        </div>
      </div>

      {/* Editor Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-line">
        <span className="text-xs text-text-secondary italic hidden sm:inline">
          Thực hành diễn đạt tự do • Lan tỏa vẻ đẹp văn hóa Việt
        </span>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-surface border border-line hover:bg-mist-cloud transition-colors focus-ring cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onPublish}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 inline-flex items-center gap-2 transition-all focus-ring cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-antique-gold" />
            <span>Đăng Bài Cảm Nhận</span>
          </button>
        </div>
      </div>
    </div>
  );
}
