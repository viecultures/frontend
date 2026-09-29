import React, { useState } from "react";
import { X, Heart, Bookmark, Share2, MessageSquare, Send, BookOpen, User, Check } from "lucide-react";
import type { CommunityPost } from "../types";

interface CommunityDetailModalProps {
  post: CommunityPost | null;
  onClose: () => void;
  onToggleHeart: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({
  post,
  onClose,
  onToggleHeart,
  onToggleBookmark,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText("");
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-heritage-dark/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-post-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface rounded-3xl border border-line shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-rice-paper/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-heritage-green text-antique-gold font-bold text-sm flex items-center justify-center border border-antique-gold/40">
              {post.avatarText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-heritage-green">
                  {post.authorName}
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-antique-gold/15 text-heritage-green border border-antique-gold/30">
                  {post.authorRole}
                </span>
              </div>
              <span className="text-xs text-text-secondary">
                {post.timeAgo} • {post.lessonTag}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-mist-cloud text-text-secondary hover:text-heritage-green transition-colors cursor-pointer focus-ring"
            aria-label="Đóng chi tiết bài viết"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Post Content */}
          <div className="space-y-4">
            <h2 id="modal-post-title" className="font-serif text-2xl font-bold text-heritage-green leading-snug">
              {post.title || `Góc nhìn cảm nhận về ${post.lessonTag}`}
            </h2>
            <p className="text-base text-text-body leading-relaxed whitespace-pre-line font-serif sm:font-sans">
              {post.contentEn}
            </p>
          </div>

          {/* Photo Showcase */}
          <div
            className={`relative h-64 sm:h-72 w-full rounded-2xl bg-gradient-to-br ${
              post.imageBgGradient || "from-heritage-green to-heritage-dark"
            } p-6 text-white flex flex-col justify-between overflow-hidden shadow-md border border-antique-gold/30`}
          >
            <div className="text-xs font-semibold text-antique-gold uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Cultural Perspective Photo</span>
            </div>
            <div className="text-center my-auto">
              <span className="font-serif text-lg font-bold text-warm-ivory block max-w-md mx-auto">
                {post.imageCaption || "Di sản văn hóa Việt Nam"}
              </span>
              <span className="text-xs text-antique-gold/90 mt-1 block">
                {post.lessonTag}
              </span>
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-line text-xs font-semibold">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleHeart(post.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all focus-ring cursor-pointer ${
                  post.userLiked
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-rice-paper text-heritage-green hover:bg-mist-cloud"
                }`}
              >
                <Heart className={`w-4 h-4 ${post.userLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span>{post.heartsCount} Yêu thích</span>
              </button>

              <button
                onClick={() => onToggleBookmark(post.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all focus-ring cursor-pointer ${
                  post.userBookmarked
                    ? "bg-antique-gold/20 text-heritage-green border border-antique-gold/50"
                    : "bg-rice-paper text-heritage-green hover:bg-mist-cloud"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${post.userBookmarked ? "fill-current" : ""}`} />
                <span>{post.userBookmarked ? "Đã lưu" : "Lưu bài"}</span>
              </button>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-text-secondary hover:text-heritage-green hover:bg-rice-paper transition-all focus-ring cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? "Đã sao chép link" : "Chia sẻ"}</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-4 border-t border-line">
            <h4 className="font-serif text-base font-bold text-heritage-green flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-antique-gold" />
              <span>Bình luận thảo luận ({post.comments?.length || post.commentsCount || 0})</span>
            </h4>

            {/* Existing Comments */}
            <div className="space-y-3">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((cmt) => (
                  <div key={cmt.id} className="p-3.5 rounded-2xl bg-rice-paper/60 border border-line space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-heritage-green text-warm-ivory text-[10px] font-bold flex items-center justify-center">
                          {cmt.avatarText}
                        </span>
                        <span className="text-xs font-bold text-heritage-green">{cmt.authorName}</span>
                      </div>
                      <span className="text-[10px] text-text-secondary">{cmt.timeAgo}</span>
                    </div>
                    <p className="text-xs text-text-body pl-8 leading-relaxed">{cmt.text}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-rice-paper/30 text-center text-xs text-text-secondary">
                  Chưa có bình luận nào. Hãy là người đầu tiên trao đổi góc nhìn!
                </div>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSendComment} className="flex gap-2 pt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết phản hồi hoặc chia sẻ thêm góc nhìn của bạn..."
                className="flex-1 px-4 py-2.5 rounded-full bg-surface border border-line text-xs text-heritage-green placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-5 py-2.5 rounded-full bg-heritage-green text-warm-ivory font-bold text-xs hover:bg-heritage-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 focus-ring cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-antique-gold" />
                <span>Gửi</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
