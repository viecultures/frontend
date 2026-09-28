import { MessageSquare, Plus } from "lucide-react";

interface CommunityHeaderProps {
  isEditorOpen: boolean;
  onToggleEditor: () => void;
}

export function CommunityHeader({
  isEditorOpen,
  onToggleEditor,
}: CommunityHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-line">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rice-paper text-xs font-bold text-heritage-green border border-antique-gold/50 mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />
          <span>Community 1: Member Reflections</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-green tracking-tight">
          Cultural Ambassador Reflections
        </h1>
        <p className="text-sm text-text-body mt-2 max-w-2xl leading-relaxed">
          Không gian tự do chia sẻ cảm nhận bằng tiếng Anh dựa trên từ vựng vừa học. Không chấm điểm, không áp lực ngữ pháp đỏ.
        </p>
      </div>

      <button
        onClick={onToggleEditor}
        aria-expanded={isEditorOpen}
        aria-controls="reflection-editor"
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 transition-all focus-ring cursor-pointer"
      >
        <Plus className="w-4 h-4 text-antique-gold" />
        <span>Viết Bài Cảm Nhận (Write Reflection)</span>
      </button>
    </div>
  );
}
