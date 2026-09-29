import { MessageSquare, Plus, Trophy, Sparkles, PenTool } from "lucide-react";
import Link from "@/components/Link";

interface CommunityHeaderProps {
  isEditorOpen: boolean;
  onToggleEditor: () => void;
  activeTab?: 'reflections' | 'contest';
}

export function CommunityHeader({
  isEditorOpen,
  onToggleEditor,
  activeTab = 'reflections',
}: CommunityHeaderProps) {
  const isContest = activeTab === 'contest';

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-line">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rice-paper text-xs font-bold text-heritage-green border border-antique-gold/50">
            {isContest ? <Trophy className="w-3.5 h-3.5 text-antique-rich" /> : <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />}
            <span>{isContest ? "Đấu Trường Sáng Tác Di Sản" : "Không Gian Sứ Giả Văn Hóa"}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold border border-emerald-500/20">
            <Sparkles className="w-3 h-3 text-antique-gold" />
            <span>{isContest ? "Giải Thưởng Xu & Huy Hiệu" : "Thực Hành Tự Do Không Áp Lực"}</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-green tracking-tight">
          {isContest ? "Weekly Heritage Essay Challenge" : "Cultural Ambassador Reflections"}
        </h1>
        <p className="text-sm text-text-body mt-2 max-w-2xl leading-relaxed">
          {isContest
            ? "Thử thách viết bài luận ngắn (100–300 từ) bằng tiếng Anh theo chủ đề tuần, vận dụng từ vựng di sản để tích lũy Xu và mở khóa đặc quyền."
            : "Không gian tự do chia sẻ cảm nhận bằng tiếng Anh dựa trên từ vựng di sản vừa học. Không áp lực ngữ pháp đỏ, khuyến khích diễn đạt tự nhiên."}
        </p>

        {/* Community Views Switcher */}
        <div className="flex items-center gap-2 mt-4">
          <Link
            href="/community"
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
              !isContest
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'bg-rice-paper text-heritage-green hover:bg-mist-cloud border border-line'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />
            <span>Cảm Nhận Thành Viên (Reflections)</span>
          </Link>

          <Link
            href="/community-2"
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
              isContest
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'bg-rice-paper text-heritage-green hover:bg-mist-cloud border border-line'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-antique-gold" />
            <span>Thử Thách Theo Chủ Đề (Weekly Contest)</span>
          </Link>
        </div>
      </div>

      <button
        onClick={onToggleEditor}
        aria-expanded={isEditorOpen}
        aria-controls="reflection-editor"
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 transition-all focus-ring cursor-pointer self-start md:self-auto shrink-0"
      >
        {isContest ? <PenTool className="w-4 h-4 text-antique-gold" /> : <Plus className="w-4 h-4 text-antique-gold" />}
        <span>{isEditorOpen ? "Đóng Khung Soạn" : isContest ? "Nộp Bài Dự Thi (+100 Xu)" : "Viết Bài Cảm Nhận"}</span>
      </button>
    </div>
  );
}
