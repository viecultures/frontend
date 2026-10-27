import React, { useState } from "react";
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  MoreHorizontal,
  BookOpen,
  Award,
  Send,
  CornerDownRight,
  UserPlus,
  UserCheck,
  Flag,
  Copy,
  ExternalLink,
} from "lucide-react";
import type { CommunityPost, HighlightVocabItem, CommunityComment } from "../types";

interface CommunityPostCardProps {
  post: CommunityPost;
  onToggleHeart: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  onOpenDetail?: (post: CommunityPost) => void;
  onShare?: (post: CommunityPost) => void;
  onSelectVocab?: (vocab: HighlightVocabItem) => void;
  onOpenLightbox?: (imageUrl: string, caption?: string, title?: string) => void;
  onToggleFollow?: (authorName: string) => void;
  onAddComment?: (postId: string, text: string, replyToCommentId?: string) => void;
  onReport?: (postId: string) => void;
}

export function CommunityPostCard({
  post,
  onToggleHeart,
  onToggleBookmark,
  onOpenDetail,
  onShare,
  onSelectVocab,
  onOpenLightbox,
  onToggleFollow,
  onAddComment,
  onReport,
}: CommunityPostCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState<string>("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<string>("");
  const [showOptionsMenu, setShowOptionsMenu] = useState<boolean>(false);

  const isLongContent = post.contentEn && post.contentEn.length > 240;

  const handleVocabClick = (item: HighlightVocabItem | string) => {
    if (typeof item === "string") {
      onSelectVocab?.({
        word: item,
        meaning: "Cultural heritage term",
        partOfSpeech: "Noun / Term",
        exampleSentence: `Learned from cultural reading on ${post.lessonTag}`,
      });
    } else {
      onSelectVocab?.(item);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment?.(post.id, commentInput.trim());
    setCommentInput("");
  };

  const handleSendReply = (parentCommentId: string) => {
    if (!replyInput.trim()) return;
    onAddComment?.(post.id, replyInput.trim(), parentCommentId);
    setReplyInput("");
    setReplyingToId(null);
  };

  return (
    <article className="community-post-card p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E2D5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#1D5046]/30 transition-all space-y-3.5 relative">
      {/* 1. Author Bar & Context */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with ambassador ring */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#1D5046]/10 text-[#1D5046] font-bold text-xs flex items-center justify-center border border-[#1D5046]/20">
              {post.avatarText}
            </div>
            {post.isAmbassador && (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#E8D7AE] text-[#1D5046] flex items-center justify-center border border-white shadow-2xs"
                title="Cultural Ambassador"
              >
                <Award className="w-2.5 h-2.5 fill-current" />
              </span>
            )}
          </div>

          {/* Author Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-[#1D5046] truncate">
                {post.authorName}
              </span>
              {post.authorRole && (
                <span className="text-[11px] font-medium text-[#6E7B75] bg-[#FAF7F0] px-2 py-0.5 rounded-full border border-[#E8E2D5]">
                  {post.authorRole}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6E7B75] mt-0.5">
              <span>{post.timeAgo}</span>
              <span>·</span>
              <span className="text-[#314F49] font-medium hover:underline cursor-pointer">
                in {post.lessonTag}
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls: Follow & More Menu */}
        <div className="flex items-center gap-1.5 shrink-0 relative">
          {onToggleFollow && post.authorName !== "Học Viên VieCultures" && (
            <button
              type="button"
              onClick={() => onToggleFollow(post.authorName)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-ring ${
                post.authorFollowing
                  ? "bg-[#FAF7F0] text-[#6E7B75] hover:text-[#1D5046] border border-[#E8E2D5]"
                  : "bg-[#1D5046]/10 text-[#1D5046] hover:bg-[#1D5046]/20 border border-[#1D5046]/20"
              }`}
            >
              {post.authorFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Follow</span>
                </>
              )}
            </button>
          )}

          {/* More Options Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-1.5 rounded-lg text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0] transition-colors cursor-pointer focus-ring"
              aria-label="More options for this post"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showOptionsMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowOptionsMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white border border-[#E8E2D5] shadow-lg py-1 z-40 text-xs text-[#314F49]">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOptionsMenu(false);
                      onOpenDetail?.(post);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#FAF7F0] flex items-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#6E7B75]" />
                    <span>Open full reflection</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOptionsMenu(false);
                      onShare?.(post);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#FAF7F0] flex items-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#6E7B75]" />
                    <span>Copy reflection link</span>
                  </button>
                  {onToggleBookmark && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionsMenu(false);
                        onToggleBookmark(post.id);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-[#FAF7F0] flex items-center gap-2 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#6E7B75]" />
                      <span>{post.userBookmarked ? "Remove from saved" : "Save reflection"}</span>
                    </button>
                  )}
                  {onReport && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionsMenu(false);
                        onReport(post.id);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer border-t border-[#E8E2D5]/60"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>Report reflection</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Title & Expressive Body */}
      <div className="space-y-1.5">
        {post.title && (
          <h3 className="font-serif text-base sm:text-[17px] font-bold text-[#1D5046] leading-snug">
            <button
              type="button"
              className="hover:underline transition-colors cursor-pointer text-left w-full"
              onClick={() => onOpenDetail?.(post)}
            >
              {post.title}
            </button>
          </h3>
        )}

        <p
          className={`community-post-body text-xs sm:text-sm text-[#314F49] leading-relaxed ${
            !isExpanded && isLongContent ? "line-clamp-3 sm:line-clamp-4" : ""
          }`}
        >
          {post.contentEn}
        </p>

        {isLongContent && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-[#1D5046] hover:underline cursor-pointer focus-ring pt-0.5 inline-block"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* 3. Interactive Vocabulary Tags */}
      {post.highlightWords && post.highlightWords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-semibold text-[#6E7B75] flex items-center gap-1 mr-1">
            <BookOpen className="w-3 h-3 text-[#1D5046]" />
            <span>Vocabulary:</span>
          </span>
          {post.highlightWords.map((item, idx) => {
            const wordText = typeof item === "string" ? item : item.word;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleVocabClick(item)}
                className="px-2.5 py-0.5 rounded-lg bg-[#FAF7F0] text-[#1D5046] border border-[#E8E2D5] text-[11px] font-medium hover:border-[#1D5046]/40 hover:bg-white transition-all cursor-pointer focus-ring"
                title="Click to view definition & pronunciation"
              >
                {wordText}
              </button>
            );
          })}
        </div>
      )}

      {/* 4. High-Quality Authentic Cultural Photograph (16:9, desktop ~260-300px) */}
      {post.imageUrl && (
        <div className="w-full rounded-xl overflow-hidden border border-[#E8E2D5] bg-white group">
          <div
            className="w-full h-56 sm:h-72 lg:h-[285px] relative cursor-pointer overflow-hidden"
            onClick={() => onOpenLightbox?.(post.imageUrl!, post.imageCaption, post.title)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenLightbox?.(post.imageUrl!, post.imageCaption, post.title);
              }
            }}
            aria-label={`View photo: ${post.imageCaption || "Cultural reflection photo"}`}
          >
            <img
              src={post.imageUrl}
              alt={post.imageCaption || "Cultural reflection photography"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                Click to expand photo
              </span>
            </div>
          </div>

          {post.imageCaption && (
            <div className="px-3.5 py-2 text-xs text-[#6E7B75] bg-white border-t border-[#E8E2D5] flex items-center justify-between">
              <span className="truncate">{post.imageCaption}</span>
              <span className="text-[11px] text-[#1D5046] font-medium shrink-0 ml-2">
                Cultural Archive
              </span>
            </div>
          )}
        </div>
      )}

      {/* 5. Social Interaction Bar */}
      <div className="pt-2.5 border-t border-[#E8E2D5]/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {/* Like Action */}
          <button
            type="button"
            onClick={() => onToggleHeart(post.id)}
            aria-label={`${post.userLiked ? "Unlike" : "Like"} reflection`}
            aria-pressed={post.userLiked}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors focus-ring cursor-pointer ${
              post.userLiked
                ? "text-red-600 bg-red-50"
                : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                post.userLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span>{post.heartsCount}</span>
          </button>

          {/* Comment Action */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors focus-ring cursor-pointer ${
              showComments
                ? "text-[#1D5046] bg-[#1D5046]/10"
                : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
            }`}
            aria-label={`View and post comments`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments?.length || post.commentsCount || 0}</span>
          </button>
        </div>

        {/* Right Actions: Bookmark & Share */}
        <div className="flex items-center gap-1">
          {onToggleBookmark && (
            <button
              type="button"
              onClick={() => onToggleBookmark(post.id)}
              className={`p-2 rounded-xl transition-colors focus-ring cursor-pointer ${
                post.userBookmarked
                  ? "text-[#1D5046] bg-[#E8D7AE]/30"
                  : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
              }`}
              title={post.userBookmarked ? "Saved in this preview" : "Save in this preview"}
              aria-label={post.userBookmarked ? "Saved in this preview" : "Save in this preview"}
            >
              <Bookmark className={`w-4 h-4 ${post.userBookmarked ? "fill-current" : ""}`} />
            </button>
          )}

          {onShare && (
            <button
              type="button"
              onClick={() => onShare(post)}
              className="p-2 rounded-xl text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0] transition-colors focus-ring cursor-pointer"
              title="Copy community page link"
              aria-label="Copy community page link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 6. Threaded Inline Comments Section */}
      {showComments && (
        <div className="pt-3 border-t border-[#E8E2D5] space-y-3 animate-in fade-in duration-200">
          {/* Quick Comment Form */}
          <form onSubmit={handleSendComment} className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-[#1D5046]/10 text-[#1D5046] font-bold text-[10px] flex items-center justify-center shrink-0">
              HV
            </div>
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write a comment or share your thought..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs text-[#314F49] placeholder:text-[#6E7B75]/70 focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="px-3 py-2 rounded-xl bg-[#1D5046] text-white text-xs font-semibold hover:bg-[#153D35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3 text-[#E8D7AE]" />
              <span className="hidden sm:inline">Comment</span>
            </button>
          </form>

          {/* List of Comments */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {post.comments.map((comment) => (
                <div key={comment.id} className="space-y-1.5">
                  <div className="p-3 rounded-xl bg-[#FAF7F0]/80 border border-[#E8E2D5] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#1D5046] text-white font-bold text-[10px] flex items-center justify-center">
                          {comment.avatarText}
                        </span>
                        <span className="font-bold text-[#1D5046]">
                          {comment.authorName}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#6E7B75]">
                        {comment.timeAgo}
                      </span>
                    </div>
                    <p className="text-xs text-[#314F49] pl-7 leading-relaxed">
                      {comment.text}
                    </p>

                    {/* Reply Action */}
                    <div className="pl-7 pt-1 flex items-center gap-3 text-[11px] text-[#6E7B75]">
                      <button
                        type="button"
                        onClick={() =>
                          setReplyingToId(
                            replyingToId === comment.id ? null : comment.id
                          )
                        }
                        className="hover:text-[#1D5046] font-medium cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  {/* Inline Reply Form */}
                  {replyingToId === comment.id && (
                    <div className="pl-6 flex gap-2 items-center">
                      <CornerDownRight className="w-3.5 h-3.5 text-[#6E7B75] shrink-0" />
                      <input
                        type="text"
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder={`Reply to ${comment.authorName}...`}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#E8E2D5] text-xs text-[#314F49] focus:outline-none focus:ring-1 focus:ring-[#1D5046]"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(comment.id)}
                        disabled={!replyInput.trim()}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1D5046] text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {/* Nested Replies if any */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 space-y-1.5">
                      {comment.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className="p-2.5 rounded-xl bg-white border border-[#E8E2D5] space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#1D5046]">
                              {rep.authorName}
                            </span>
                            <span className="text-[10px] text-[#6E7B75]">
                              {rep.timeAgo}
                            </span>
                          </div>
                          <p className="text-xs text-[#314F49] leading-relaxed">
                            {rep.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#6E7B75] italic py-1 text-center">
              No comments yet. Be the first to share your perspective!
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export default CommunityPostCard;
