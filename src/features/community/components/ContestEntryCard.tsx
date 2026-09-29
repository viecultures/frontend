import { User, Heart, MessageSquare, Trophy, Coins, Camera, Landmark, Sparkles } from "lucide-react";
import type { ContestEntry } from "../types";

interface ContestEntryCardProps {
  entry: ContestEntry;
  onVote: (id: string) => void;
  onOpenDetail?: (entry: ContestEntry) => void;
}

export function ContestEntryCard({ entry, onVote, onOpenDetail }: ContestEntryCardProps) {
  return (
    <article className="relative p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-md space-y-4 hover:shadow-lg transition-all">
      {/* Rank Tag if available */}
      {entry.rankTag && (
        <span
          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${entry.rankClass || "bg-amber-100/60 text-amber-900 border-amber-300"}`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>{entry.rankTag}</span>
        </span>
      )}

      {/* Author Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-heritage-green text-antique-gold font-bold text-sm flex items-center justify-center border border-antique-gold/40 shadow-sm">
            {entry.avatarText || <User className="w-5 h-5 text-antique-gold" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-heritage-green">
                {entry.authorName}
              </h4>
              {entry.authorBadge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {entry.authorBadge}
                </span>
              )}
            </div>
            <span className="text-xs text-text-secondary font-medium">
              {entry.authorSub}
            </span>
          </div>
        </div>

        <span className="text-xs font-semibold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 text-antique-gold" />
          <span>+{entry.rewardCoins} Xu</span>
        </span>
      </div>

      {/* Entry Title & Excerpt */}
      <div className="space-y-2">
        <h3 
          onClick={() => onOpenDetail?.(entry)}
          className="font-serif text-xl font-bold text-heritage-green leading-snug hover:text-antique-rich transition-colors cursor-pointer"
        >
          "{entry.title}"
        </h3>
        <p className="text-sm text-text-body leading-relaxed">{entry.excerpt}</p>
      </div>

      {/* Used Vocab Chips */}
      {entry.usedVocab && entry.usedVocab.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-antique-gold" />
            <span>Từ vựng ứng dụng:</span>
          </span>
          {entry.usedVocab.map((word) => (
            <span
              key={word}
              className="px-2 py-0.5 rounded bg-antique-gold/10 text-heritage-green border border-antique-gold/30 text-[11px] font-semibold"
            >
              {word}
            </span>
          ))}
        </div>
      )}

      {/* Attached Photo Banner */}
      <div
        onClick={() => onOpenDetail?.(entry)}
        className="h-52 w-full rounded-2xl bg-gradient-to-br from-heritage-green via-[#2A665B] to-heritage-dark p-6 text-white flex flex-col justify-between overflow-hidden shadow-inner border border-antique-gold/30 cursor-pointer group"
        role="button"
        tabIndex={0}
        aria-label={entry.imageCaption}
      >
        <div className="text-xs font-semibold text-antique-gold uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5" />
          <span>Thử Thách Ảnh Di Sản</span>
        </div>
        <div className="text-center my-auto">
          <Landmark className="w-8 h-8 text-antique-gold mx-auto mb-2 opacity-80 group-hover:scale-110 transition-transform" />
          <span className="font-serif text-sm font-bold text-warm-ivory block">
            {entry.imageCaption}
          </span>
        </div>
      </div>

      {/* Footer Vote Action */}
      <div className="pt-4 border-t border-line flex items-center justify-between">
        <button
          onClick={() => onVote(entry.id)}
          aria-pressed={entry.userVoted}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer focus-ring ${
            entry.userVoted
              ? "bg-red-600 text-white border-red-600 shadow-sm"
              : "bg-surface text-heritage-green border-heritage-green/20 hover:bg-red-50 hover:border-red-300"
          }`}
        >
          <Heart className={`w-4 h-4 ${entry.userVoted ? "fill-white" : "text-heritage-green"}`} />
          <span>{entry.userVoted ? "Đã bình chọn" : "Bình chọn bài viết"}</span>
          <strong>({entry.votesCount})</strong>
        </button>

        <div className="text-xs font-semibold text-text-secondary flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />
            <span>{entry.commentsCount} Bình luận</span>
          </span>
        </div>
      </div>
    </article>
  );
}
