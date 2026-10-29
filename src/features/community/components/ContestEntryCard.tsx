import { User, Heart, MessageSquare, Trophy, Coins, Camera, Landmark } from "lucide-react";
import { communityLabel } from "../community-copy";
import type { ContestEntry } from "../types";

interface ContestEntryCardProps {
  entry: ContestEntry;
  onVote: (id: string) => void;
}

export function ContestEntryCard({ entry, onVote }: ContestEntryCardProps) {
  return (
    <article className="community-entry-card relative p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E2D5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3.5 hover:border-[#1D5046]/30 transition-all">
      {/* Rank Tag if available */}
      {entry.rankTag && (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${entry.rankClass || "bg-amber-100/60 text-amber-900 border-amber-300"}`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>{communityLabel(entry.rankTag)}</span>
        </span>
      )}

      {/* Author Info */}
      <div className="community-author-bar flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1D5046]/10 text-[#1D5046] font-bold text-xs flex items-center justify-center border border-[#1D5046]/20 shrink-0">
            {entry.avatarText || <User className="w-5 h-5 text-antique-gold" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-sm text-heritage-green">
                {communityLabel(entry.authorName)}
              </h4>
              {entry.authorBadge && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#6E7B75] border border-[#E8E2D5]">
                  {communityLabel(entry.authorBadge)}
                </span>
              )}
            </div>
            <span className="text-xs text-[#6E7B75]">
              {communityLabel(entry.authorSub)}
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold text-[#1D5046] bg-[#E8D7AE]/30 px-2.5 py-1 rounded-full border border-[#E8D7AE]/50 flex items-center gap-1 shrink-0">
          <Coins className="w-3.5 h-3.5 text-antique-gold" />
          <span>+{entry.rewardCoins} coins</span>
        </span>
      </div>

      {/* Entry Title & Excerpt */}
      <div className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-[#1D5046] leading-snug">
          "{entry.title}"
        </h3>
        <p className="community-post-body text-sm text-[#314F49] leading-relaxed">{entry.excerpt}</p>
      </div>

      {/* Used Vocab Chips */}
      {entry.usedVocab && entry.usedVocab.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
            <Trophy className="w-3 h-3 text-antique-gold" />
            <span>Vocabulary in use:</span>
          </span>
          {entry.usedVocab.map((word) => (
            <span
              key={word}
              className="px-2.5 py-1 rounded-lg bg-[#FAF7F0] text-[#1D5046] border border-[#E8E2D5] text-xs font-medium"
            >
              {word}
            </span>
          ))}
        </div>
      )}

      {/* Attached Photo Banner */}
      <div
        className="community-photo h-36 sm:h-40 w-full rounded-xl bg-[#1D5046] p-4 text-white flex flex-col justify-between overflow-hidden"
        aria-label={communityLabel(entry.imageCaption)}
      >
        <div className="text-xs font-semibold text-antique-gold uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" />
          <span>Heritage photo challenge</span>
        </div>
        <div className="text-center my-auto">
          <Landmark className="w-6 h-6 text-[#E8D7AE] mx-auto mb-2" />
          <span className="font-serif text-sm font-bold text-warm-ivory block">
            {communityLabel(entry.imageCaption)}
          </span>
        </div>
      </div>

      {/* Footer Vote Action */}
      <div className="community-entry-actions pt-3 border-t border-[#E8E2D5] flex items-center justify-between gap-2">
        <button
          onClick={() => onVote(entry.id)}
          aria-pressed={entry.userVoted}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer focus-ring ${
            entry.userVoted
              ? "bg-[#1D5046] text-white border-[#1D5046]"
              : "bg-[#FAF7F0] text-[#1D5046] border-[#E8E2D5] hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${entry.userVoted ? "fill-white" : "text-heritage-green"}`} />
          <span>{entry.userVoted ? "Voted" : "Vote for entry"}</span>
          <strong>({entry.votesCount})</strong>
        </button>

        <div className="text-xs font-semibold text-text-secondary flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />
            <span>{entry.commentsCount} comments</span>
          </span>
        </div>
      </div>
    </article>
  );
}
