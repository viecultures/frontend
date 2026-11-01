import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import type { CommunityPost, HighlightVocabItem } from "../types";

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
  const { t } = useTranslation("community");
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
    <article className="community-post-card p-5 sm:p-6 rounded-2xl bg-white border border-line shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-heritage-green/30 transition-all space-y-3.5 relative">
      {/* 1. Author Bar & Context */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with ambassador ring */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-heritage-green/10 text-heritage-green font-bold text-xs flex items-center justify-center border border-heritage-green/20">
              {post.avatarText}
            </div>
            {post.isAmbassador && (
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-antique-gold text-heritage-green flex items-center justify-center border border-white shadow-2xs"
                title={t("community.post.ambassador_badge_title")}
              >
                <Award className="w-2.5 h-2.5 fill-current" />
              </span>
            )}
          </div>

          {/* Author Details */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-heritage-green truncate">
                {post.authorName}
              </span>
              {post.authorRole && (
                <span className="text-[11px] font-medium text-text-muted bg-surface-muted px-2 py-0.5 rounded-full border border-line">
                  {post.authorRole}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
              <span>{post.timeAgo}</span>
              <span>·</span>
              <span className="text-text-body font-medium hover:underline cursor-pointer">
                {t("community.post.in_tag", { topic: post.lessonTag })}
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
                  ? "bg-surface-muted text-text-muted hover:text-heritage-green border border-line"
                  : "bg-heritage-green/10 text-heritage-green hover:bg-heritage-green/20 border border-heritage-green/20"
              }`}
            >
              {post.authorFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("community.post.following")}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("community.post.follow")}</span>
                </>
              )}
            </button>
          )}

          {/* More Options Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-1.5 rounded-lg text-text-muted hover:text-heritage-green hover:bg-surface-muted transition-colors cursor-pointer focus-ring"
              aria-label={t("community.post.more_options_aria")}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showOptionsMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowOptionsMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white border border-line shadow-lg py-1 z-40 text-xs text-text-body">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOptionsMenu(false);
                      onOpenDetail?.(post);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-surface-muted flex items-center gap-2 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
                    <span>{t("community.post.open_full")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOptionsMenu(false);
                      onShare?.(post);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-surface-muted flex items-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-text-muted" />
                    <span>{t("community.post.copy_post_link")}</span>
                  </button>
                  {onToggleBookmark && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionsMenu(false);
                        onToggleBookmark(post.id);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-surface-muted flex items-center gap-2 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-text-muted" />
                      <span>{post.userBookmarked ? t("community.post.remove_saved") : t("community.post.save_reflection")}</span>
                    </button>
                  )}
                  {onReport && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionsMenu(false);
                        onReport(post.id);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer border-t border-line/60"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{t("community.post.report_reflection")}</span>
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
          <h3 className="font-serif text-base sm:text-[17px] font-bold text-heritage-green leading-snug">
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
          className={`community-post-body text-xs sm:text-sm text-text-body leading-relaxed ${
            !isExpanded && isLongContent ? "line-clamp-3 sm:line-clamp-4" : ""
          }`}
        >
          {post.contentEn}
        </p>

        {isLongContent && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-heritage-green hover:underline cursor-pointer focus-ring pt-0.5 inline-block"
          >
            {isExpanded ? t("community.post.read_less") : t("community.post.read_more")}
          </button>
        )}
      </div>

      {/* 3. Interactive Vocabulary Tags */}
      {post.highlightWords && post.highlightWords.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-semibold text-text-muted flex items-center gap-1 mr-1">
            <BookOpen className="w-3 h-3 text-heritage-green" />
            <span>{t("community.post.vocab_label")}</span>
          </span>
          {post.highlightWords.map((item, idx) => {
            const wordText = typeof item === "string" ? item : item.word;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleVocabClick(item)}
                className="px-2.5 py-0.5 rounded-lg bg-surface-muted text-heritage-green border border-line text-[11px] font-medium hover:border-heritage-green/40 hover:bg-white transition-all cursor-pointer focus-ring"
                title={t("community.post.click_vocab_title")}
              >
                {wordText}
              </button>
            );
          })}
        </div>
      )}

      {/* 4. High-Quality Authentic Cultural Photograph */}
      {post.imageUrl && (
        <div className="w-full rounded-xl overflow-hidden border border-line bg-white group">
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
            aria-label={t("community.post.view_photo_aria", { caption: post.imageCaption || t("community.post.cultural_photo_fallback") })}
          >
            <img
              src={post.imageUrl}
              alt={post.imageCaption || t("community.post.cultural_photo_alt")}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                {t("community.post.click_expand_photo")}
              </span>
            </div>
          </div>

          {post.imageCaption && (
            <div className="px-3.5 py-2 text-xs text-text-muted bg-white border-t border-line flex items-center justify-between">
              <span className="truncate">{post.imageCaption}</span>
              <span className="text-[11px] text-heritage-green font-medium shrink-0 ml-2">
                {t("community.post.cultural_archive")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 5. Social Interaction Bar */}
      <div className="pt-2.5 border-t border-line/70 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {/* Like Action */}
          <button
            type="button"
            onClick={() => onToggleHeart(post.id)}
            aria-label={`${post.userLiked ? t("community.post.unlike_aria") : t("community.post.like_aria")} ${t("community.post.reflection_word")}`}
            aria-pressed={post.userLiked}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors focus-ring cursor-pointer ${
              post.userLiked
                ? "text-red-600 bg-red-50"
                : "text-text-muted hover:text-heritage-green hover:bg-surface-muted"
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
                ? "text-heritage-green bg-heritage-green/10"
                : "text-text-muted hover:text-heritage-green hover:bg-surface-muted"
            }`}
            aria-label={t("community.post.view_comments_aria")}
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
                  ? "text-heritage-green bg-antique-gold/30"
                  : "text-text-muted hover:text-heritage-green hover:bg-surface-muted"
              }`}
              title={post.userBookmarked ? t("community.post.saved_in_preview") : t("community.post.save_in_preview")}
              aria-label={post.userBookmarked ? t("community.post.saved_in_preview") : t("community.post.save_in_preview")}
            >
              <Bookmark className={`w-4 h-4 ${post.userBookmarked ? "fill-current" : ""}`} />
            </button>
          )}

          {onShare && (
            <button
              type="button"
              onClick={() => onShare(post)}
              className="p-2 rounded-xl text-text-muted hover:text-heritage-green hover:bg-surface-muted transition-colors focus-ring cursor-pointer"
              title={t("community.post.copy_page_link_aria")}
              aria-label={t("community.post.copy_page_link_aria")}
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 6. Threaded Inline Comments Section */}
      {showComments && (
        <div className="pt-3 border-t border-line space-y-3 animate-in fade-in duration-200">
          {/* Quick Comment Form */}
          <form onSubmit={handleSendComment} className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-heritage-green/10 text-heritage-green font-bold text-[10px] flex items-center justify-center shrink-0">
              HV
            </div>
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={t("community.post.comment_input_placeholder")}
              className="flex-1 px-3.5 py-2 rounded-xl bg-surface-muted border border-line text-xs text-text-body placeholder:text-text-muted/70 focus:outline-none focus:ring-1 focus:ring-heritage-green focus:bg-white"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="px-3 py-2 rounded-xl bg-heritage-green text-white text-xs font-semibold hover:bg-heritage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3 h-3 text-antique-gold" />
              <span className="hidden sm:inline">{t("community.post.comment_submit_btn")}</span>
            </button>
          </form>

          {/* List of Comments */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {post.comments.map((comment) => (
                <div key={comment.id} className="space-y-1.5">
                  <div className="p-3 rounded-xl bg-surface-muted/80 border border-line space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-heritage-green text-white font-bold text-[10px] flex items-center justify-center">
                          {comment.avatarText}
                        </span>
                        <span className="font-bold text-heritage-green">
                          {comment.authorName}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-muted">
                        {comment.timeAgo}
                      </span>
                    </div>
                    <p className="text-xs text-text-body pl-7 leading-relaxed">
                      {comment.text}
                    </p>

                    {/* Reply Action */}
                    <div className="pl-7 pt-1 flex items-center gap-3 text-[11px] text-text-muted">
                      <button
                        type="button"
                        onClick={() =>
                          setReplyingToId(
                            replyingToId === comment.id ? null : comment.id
                          )
                        }
                        className="hover:text-heritage-green font-medium cursor-pointer"
                      >
                        {t("community.post.reply_btn")}
                      </button>
                    </div>
                  </div>

                  {/* Inline Reply Form */}
                  {replyingToId === comment.id && (
                    <div className="pl-6 flex gap-2 items-center">
                      <CornerDownRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <input
                        type="text"
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder={t("community.post.reply_input_placeholder", { name: comment.authorName })}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-line text-xs text-text-body focus:outline-none focus:ring-1 focus:ring-heritage-green"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(comment.id)}
                        disabled={!replyInput.trim()}
                        className="px-2.5 py-1.5 rounded-lg bg-heritage-green text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                      >
                        {t("community.post.send_btn")}
                      </button>
                    </div>
                  )}

                  {/* Nested Replies if any */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 space-y-1.5">
                      {comment.replies.map((rep) => (
                        <div
                          key={rep.id}
                          className="p-2.5 rounded-xl bg-white border border-line space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-heritage-green">
                              {rep.authorName}
                            </span>
                            <span className="text-[10px] text-text-muted">
                              {rep.timeAgo}
                            </span>
                          </div>
                          <p className="text-xs text-text-body leading-relaxed">
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
            <p className="text-xs text-text-muted italic py-1 text-center">
              {t("community.post.no_comments_yet")}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export default CommunityPostCard;
