import { MessageSquare, Plus, Trophy, Sparkles, PenTool } from "lucide-react";
import Link from "@/components/Link";
import '../community-ui.css';
import { PATHS } from "@/routes/paths";

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
    <div className="community-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-line">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rice-paper text-xs font-bold text-heritage-green border border-antique-gold/50">
            {isContest ? <Trophy className="w-3.5 h-3.5 text-antique-rich" /> : <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />}
            <span>{isContest ? "Heritage writing challenge" : "Cultural community"}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold border border-emerald-500/20">
            <Sparkles className="w-3 h-3 text-antique-gold" />
            <span>{isContest ? "Coins & badges" : "Practice without pressure"}</span>
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-green tracking-tight">
          {isContest ? "Weekly Heritage Essay Challenge" : "Cultural Ambassador Reflections"}
        </h1>
        <p className="text-sm text-text-body mt-2 max-w-2xl leading-relaxed">
          {isContest
            ? "Write a short essay (100–300 words) in English on this week’s topic. Use heritage vocabulary to earn coins and unlock rewards."
            : "Share your thoughts in English using heritage vocabulary you have learned. Express yourself naturally, without grammar pressure."}
        </p>

        {/* Community Views Switcher */}
        <div className="community-view-tabs flex items-center gap-2 mt-4">
          <Link
            to={PATHS.community}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
              !isContest
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'bg-rice-paper text-heritage-green hover:bg-mist-cloud border border-line'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />
            <span>Reflections</span>
          </Link>

          <Link
            to={PATHS.communityContest}
            className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all ${
              isContest
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'bg-rice-paper text-heritage-green hover:bg-mist-cloud border border-line'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-antique-gold" />
            <span>Weekly contest</span>
          </Link>
        </div>
      </div>

      <button
        onClick={onToggleEditor}
        aria-expanded={isEditorOpen}
        aria-controls={isContest ? "contest-editor" : "reflection-editor"}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 transition-all focus-ring cursor-pointer self-start md:self-auto shrink-0"
      >
        {isContest ? <PenTool className="w-4 h-4 text-antique-gold" /> : <Plus className="w-4 h-4 text-antique-gold" />}
        <span>{isEditorOpen ? "Close editor" : isContest ? "Submit an entry (+100 coins)" : "Write a reflection"}</span>
      </button>
    </div>
  );
}
