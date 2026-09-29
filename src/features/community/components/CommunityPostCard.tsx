import React from "react";
import { Heart, MessageSquare, Bookmark, Share2, Landmark, Sparkles, User } from "lucide-react";
import type { CommunityPost } from "../types";

interface CommunityPostCardProps {
  post: CommunityPost;
  onToggleHeart: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  onOpenDetail?: (post: CommunityPost) => void;
  onShare?: (post: CommunityPost) => void;
}

export function CommunityPostCard({
  post,
  onToggleHeart,
  onToggleBookmark,
  onOpenDetail,
  onShare,
}: CommunityPostCardProps) {
  return (
    <article className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-[0_4px_20px_-4px_rgba(30,75,67,0.06)] hover:shadow-md transition-all space-y-5">
      {/* Author Info Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full bg-heritage-green text-antique-gold font-bold text-sm flex items-center justify-center border border-antique-gold/40 shadow-sm"
            aria-hidden="true"
          >
            {post.avatarText}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-heritage-green">
                {post.authorName}
              </h4>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-antique-gold/15 text-heritage-green border border-antique-gold/30">
                {post.authorRole}
              </span>
            </div>
            <span className="text-xs text-text-secondary font-medium">
              {post.timeAgo}
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-heritage-green bg-rice-paper px-3 py-1 rounded-full border border-heritage-green/10 flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5 text-antique-gold" />
          <span>{post.lessonTag}</span>
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {post.title && (
          <h3 
            onClick={() => onOpenDetail?.(post)}
            className="font-serif text-lg font-bold text-heritage-green hover:text-antique-rich transition-colors cursor-pointer"
          >
            {post.title}
          </h3>
        )}
        <p className="text-sm sm:text-base text-text-body leading-relaxed font-normal">
          {post.contentEn}
        </p>
      </div>

      {/* Highlighted Vocabulary Pills if any */}
      {post.highlightWords && post.highlightWords.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-antique-gold" />
            <span>Từ vựng di sản:</span>
          </span>
          {post.highlightWords.map((item, idx) => {
            const wordText = typeof item === "string" ? item : item.word;
            return (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-md bg-antique-gold/10 text-heritage-green border border-antique-gold/30 text-xs font-semibold"
              >
                {wordText}
              </span>
            );
          })}
        </div>
      )}

      {/* Attached Photo Banner (Clickable to inspect) */}
      <div
        onClick={() => onOpenDetail?.(post)}
        className={`relative h-52 sm:h-60 w-full rounded-2xl bg-gradient-to-br ${
          post.imageBgGradient || "from-heritage-green via-[#2A665B] to-heritage-dark"
        } p-6 text-white flex flex-col justify-between overflow-hidden shadow-inner border border-antique-gold/30 cursor-pointer group`}
        role="button"
        tabIndex={0}
        aria-label={`Xem ảnh di sản: ${post.imageCaption}`}
      >
        <div
          className="absolute inset-2 border border-antique-gold/30 rounded-xl pointer-events-none group-hover:border-antique-gold/60 transition-colors"
          aria-hidden="true"
        />
        <div className="text-xs font-semibold text-antique-gold uppercase tracking-wider flex items-center gap-1.5 z-10">
          <Landmark className="w-3.5 h-3.5" />
          <span>Member Photo Attachment</span>
        </div>
        <div className="text-center my-auto z-10">
          <span className="font-serif text-base sm:text-lg font-bold text-warm-ivory group-hover:scale-105 transition-transform duration-200 block">
            {post.imageCaption || "Di sản văn hóa Việt Nam"}
          </span>
          <span className="text-xs text-antique-gold/90 mt-1 block">
            Nhấn để xem bài viết & thảo luận chi tiết
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleHeart(post.id)}
            aria-label={`${
              post.userLiked ? "Bỏ thích" : "Thích"
            } bài viết của ${post.authorName}`}
            aria-pressed={post.userLiked}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold transition-all focus-ring cursor-pointer ${
              post.userLiked
                ? "bg-red-50 text-red-600 border border-red-200 shadow-sm"
                : "bg-rice-paper text-heritage-green hover:bg-mist-cloud"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                post.userLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span>{post.heartsCount} Thả tim</span>
          </button>

          <button
            onClick={() => onOpenDetail?.(post)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold bg-rice-paper text-heritage-green hover:bg-mist-cloud transition-all focus-ring cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-antique-gold" />
            <span>{post.comments?.length || post.commentsCount || 0} Bình luận</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onToggleBookmark && (
            <button
              onClick={() => onToggleBookmark(post.id)}
              className={`p-2 rounded-full transition-colors focus-ring cursor-pointer ${
                post.userBookmarked
                  ? "bg-antique-gold/20 text-heritage-green"
                  : "hover:bg-rice-paper text-text-secondary hover:text-heritage-green"
              }`}
              title="Lưu bài viết"
              aria-label="Lưu bài viết"
            >
              <Bookmark className={`w-4 h-4 ${post.userBookmarked ? "fill-current text-heritage-green" : ""}`} />
            </button>
          )}

          {onShare && (
            <button
              onClick={() => onShare(post)}
              className="p-2 rounded-full hover:bg-rice-paper text-text-secondary hover:text-heritage-green transition-colors focus-ring cursor-pointer"
              title="Chia sẻ bài viết"
              aria-label="Chia sẻ bài viết"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
