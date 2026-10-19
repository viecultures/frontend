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
  { value: "Imperial Hue", label: "Imperial Hue architecture & heritage" },
  { value: "Saigon Bánh Mì", label: "Saigon bánh mì & food culture" },
  { value: "Hội An Lanterns", label: "Hoi An lanterns & full moon nights" },
  { value: "Bát Tràng Pottery", label: "Bát Tràng pottery & craftsmanship" },
  { value: "Egg Coffee", label: "Hanoi egg coffee culture" },
  { value: "Dong Ho Folk Art", label: "Đông Hồ folk art" },
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
      className="community-editor mb-10 p-6 sm:p-8 rounded-3xl bg-rice-paper border-2 border-antique-gold/60 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-antique-gold/20 text-heritage-green text-[11px] font-bold border border-antique-gold/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-antique-gold" />
              <span>Learner perspective</span>
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-heritage-green">
            Write your cultural reflection
          </h2>
          <span className="text-xs text-text-secondary">
            Use vocabulary from your reading to express your thoughts. No grammar pressure.
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-mist-cloud text-heritage-green transition-colors focus-ring cursor-pointer"
          aria-label="Close reflection editor"
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
            <span>Related topic or lesson</span>
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
            <span>Post title (optional)</span>
          </label>
          <input
            id="title-input"
            type="text"
            value={postTitle}
            onChange={(e) => onChangePostTitle?.(e.target.value)}
            placeholder="e.g. My unforgettable morning at Ngọ Môn Gate…"
            className="w-full px-4 py-2.5 rounded-xl bg-surface border border-heritage-green/15 text-xs font-medium text-heritage-green placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
          />
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-1.5">
        <textarea
          value={reflectionText}
          onChange={(e) => onChangeReflectionText(e.target.value)}
          placeholder="Share a memory, feeling or thought in English…"
          className="w-full h-40 p-4 rounded-2xl bg-surface border border-heritage-green/15 text-sm text-heritage-green placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-antique-gold/40 leading-relaxed font-sans"
          aria-label="Reflection text"
        />
        <div className="flex items-center justify-between text-xs text-text-secondary px-1">
          <span>Try using at least two words you have learned.</span>
          <span className="font-semibold">{wordCount} words</span>
        </div>
      </div>

      {/* Editor Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-line">
        <span className="text-xs text-text-secondary italic hidden sm:inline">
          Express yourself freely · Share Vietnamese culture
        </span>
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-surface border border-line hover:bg-mist-cloud transition-colors focus-ring cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onPublish}
            className="px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 inline-flex items-center gap-2 transition-all focus-ring cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-antique-gold" />
            <span>Publish reflection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
