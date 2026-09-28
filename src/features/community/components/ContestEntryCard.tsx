import { User, Heart } from "lucide-react";
import type { ContestEntry } from "../types";

interface ContestEntryCardProps {
  entry: ContestEntry;
  onVote: (id: string) => void;
}

export function ContestEntryCard({ entry, onVote }: ContestEntryCardProps) {
  return (
    <article className="relative p-6 sm:p-8 rounded-3xl bg-warm-ivory border border-heritage-green/12 shadow-md space-y-4">
      {/* Rank Tag if available */}
      {entry.rankTag && (
        <span
          className={`absolute top-6 right-6 px-3.5 py-1 rounded-full text-xs font-bold border ${entry.rankClass}`}
        >
          {entry.rankTag}
        </span>
      )}

      {/* Author Info */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-heritage-green text-antique-gold font-bold text-sm flex items-center justify-center border border-antique-gold">
          <User className="w-5 h-5 text-antique-gold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-heritage-green">
              {entry.authorName}
            </h4>
            {entry.authorBadge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                {entry.authorBadge}
              </span>
            )}
          </div>
          <span className="text-xs text-text-secondary font-medium">
            {entry.authorSub}
          </span>
        </div>
      </div>

      {/* Entry Title & Excerpt */}
      <h3 className="font-serif text-xl font-bold text-heritage-green leading-snug">
        "{entry.title}"
      </h3>
      <p className="text-sm text-text-body leading-relaxed">{entry.excerpt}</p>

      {/* Image Placeholder */}
      <div
        className="h-52 w-full rounded-2xl bg-gradient-to-br from-heritage-green via-[#2A665B] to-antique-gold p-6 text-white flex flex-col justify-between overflow-hidden shadow-inner border border-antique-gold/30"
        role="img"
        aria-label={entry.imageCaption}
      >
        <div className="text-xs font-semibold text-antique-gold uppercase">
          Photo Entry
        </div>
        <div className="text-center my-auto">
          <span className="text-3xl block mb-1">📸🏛️</span>
          <span className="font-serif text-sm font-bold text-warm-ivory">
            {entry.imageCaption}
          </span>
        </div>
      </div>

      {/* Footer Vote Action */}
      <div className="pt-4 border-t border-heritage-green/10 flex items-center justify-between">
        <button
          onClick={() => onVote(entry.id)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer focus-ring ${
            entry.userVoted
              ? "bg-[#DC2626] text-white border-[#DC2626] shadow-sm"
              : "bg-warm-ivory text-heritage-green border-heritage-green/20 hover:bg-[#FEF2F2] hover:border-[#DC2626]"
          }`}
        >
          <Heart className={`w-4 h-4 ${entry.userVoted ? "fill-white" : ""}`} />
          <span>{entry.userVoted ? "❤️ Đã thích bài" : "❤️ Thả tim thích bài"}</span>
          <strong>({entry.votesCount})</strong>
        </button>

        <div className="text-xs font-semibold text-text-secondary flex items-center gap-4">
          <span>💬 {entry.commentsCount} Bình luận</span>
          <span className="text-[#059669]">🎁 +100 Xu tích lũy</span>
        </div>
      </div>
    </article>
  );
}
