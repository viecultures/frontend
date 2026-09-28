import { Heart } from "lucide-react";
import type { CommunityPost } from "../types";

interface CommunityPostCardProps {
  post: CommunityPost;
  onToggleHeart: (id: string) => void;
}

export function CommunityPostCard({
  post,
  onToggleHeart,
}: CommunityPostCardProps) {
  return (
    <article className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-[0_4px_20px_-4px_rgba(30,75,67,0.06)] hover:shadow-md transition-all space-y-5">
      {/* Author Info Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full bg-heritage-green text-antique-gold font-bold text-sm flex items-center justify-center border border-antique-gold"
            aria-hidden="true"
          >
            {post.avatarText}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-heritage-green">
                {post.authorName}
              </h4>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-antique-gold/20 text-heritage-green border border-antique-gold/40">
                {post.authorRole}
              </span>
            </div>
            <span className="text-xs text-text-secondary font-medium">
              {post.timeAgo}
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-heritage-green bg-rice-paper px-3 py-1 rounded-md border border-heritage-green/10">
          {post.lessonTag}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm sm:text-base text-text-body leading-relaxed">
        {post.contentEn}
      </p>

      {/* Attached Photo Banner */}
      <div
        className={`relative h-56 sm:h-64 w-full rounded-2xl bg-gradient-to-br ${
          post.imageBgGradient || "from-[#1E4B43] to-[#2A665B]"
        } p-6 text-white flex flex-col justify-between overflow-hidden shadow-inner border border-antique-gold/30`}
        role="img"
        aria-label={post.imageCaption}
      >
        <div
          className="absolute inset-2 border border-antique-gold/30 rounded-xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="text-xs font-semibold text-antique-gold uppercase tracking-wider">
          Member Photo Attachment
        </div>
        <div className="text-center my-auto">
          <span className="text-4xl block mb-1" aria-hidden="true">
            📸🏛️
          </span>
          <span className="font-serif text-sm font-bold text-warm-ivory">
            {post.imageCaption}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
        <button
          onClick={() => onToggleHeart(post.id)}
          aria-label={`${
            post.userLiked ? "Bỏ thích" : "Thích"
          } bài viết của ${post.authorName}`}
          aria-pressed={post.userLiked}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all focus-ring cursor-pointer ${
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

        <button className="text-text-secondary hover:text-heritage-green font-semibold focus-ring rounded cursor-pointer">
          Báo cáo bài viết
        </button>
      </div>
    </article>
  );
}
