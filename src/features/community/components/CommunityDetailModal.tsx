import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import {
  X,
  Heart,
  Bookmark,
  Share2,
  MessageSquare,
  Send,
  BookOpen,
  Check,
  CornerDownRight,
} from "lucide-react";
import type { CommunityPost, HighlightVocabItem } from "../types";

interface CommunityDetailModalProps {
  post: CommunityPost | null;
  onClose: () => void;
  onToggleHeart: (id: string) => void;
  onToggleBookmark?: (id: string) => void;
  onAddComment: (postId: string, text: string, replyToCommentId?: string) => void;
  onSelectVocab?: (vocab: HighlightVocabItem) => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({
  post,
  onClose,
  onToggleHeart,
  onToggleBookmark,
  onAddComment,
  onSelectVocab,
}) => {
  const { t } = useTranslation("community");
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  if (!post) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText("");
  };

  const handleSendReply = (parentCommentId: string) => {
    if (!replyText.trim()) return;
    onAddComment(post.id, replyText.trim(), parentCommentId);
    setReplyText("");
    setReplyingToId(null);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  return (
    <Dialog
      open={!!post}
      onClose={onClose}
      className="community-ui fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1A3B32]/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <DialogPanel className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl border border-[#E8E2D5] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Author Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2D5] bg-[#FAF7F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1D5046]/10 text-[#1D5046] font-bold text-xs flex items-center justify-center border border-[#1D5046]/20">
              {post.avatarText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#1D5046]">
                  {post.authorName}
                </h3>
                {post.authorRole && (
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white text-[#1D5046] border border-[#E8E2D5]">
                    {post.authorRole}
                  </span>
                )}
              </div>
              <span className="text-xs text-[#6E7B75]">
                {post.timeAgo} • {t("community.post.in_tag", { topic: post.lessonTag })}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#6E7B75] hover:text-[#1D5046] transition-colors cursor-pointer focus-ring"
            aria-label={t("community.detail_modal.close_aria")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Title & Body */}
          <div className="space-y-3">
            <DialogTitle
              as="h2"
              className="font-serif text-xl sm:text-2xl font-bold text-[#1D5046] leading-snug"
            >
              {post.title || t("community.detail_modal.default_title", { topic: post.lessonTag })}
            </DialogTitle>
            <p className="text-sm text-[#314F49] leading-relaxed whitespace-pre-line font-sans">
              {post.contentEn}
            </p>
          </div>

          {/* Interactive Highlight Vocab */}
          {post.highlightWords && post.highlightWords.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-2">
              <span className="text-xs font-bold text-[#1D5046] uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#1D5046]" />
                <span>{t("community.detail_modal.practiced_vocab_title")}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {post.highlightWords.map((item, idx) => {
                  const wordText = typeof item === "string" ? item : item.word;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleVocabClick(item)}
                      className="px-2.5 py-1 rounded-lg bg-white text-[#1D5046] border border-[#E8E2D5] text-xs font-medium hover:border-[#1D5046]/40 transition-all cursor-pointer"
                      title={t("community.detail_modal.click_view_definition")}
                    >
                      {wordText}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cultural Photograph */}
          {post.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-[#E8E2D5] bg-white">
              <img
                src={post.imageUrl}
                alt={post.imageCaption || t("community.post.cultural_photo_fallback")}
                className="w-full max-h-80 object-cover"
              />
              {post.imageCaption && (
                <div className="p-3 text-xs text-[#6E7B75] bg-[#FAF7F0] border-t border-[#E8E2D5]">
                  {post.imageCaption}
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D5] text-xs font-semibold">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleHeart(post.id)}
                aria-pressed={!!post.userLiked}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all focus-ring cursor-pointer ${
                  post.userLiked
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-[#FAF7F0] text-[#1D5046] hover:bg-white border border-[#E8E2D5]"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    post.userLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{t("community.detail_modal.likes_count", { count: post.heartsCount })}</span>
              </button>

              {onToggleBookmark && (
                <button
                  type="button"
                  onClick={() => onToggleBookmark(post.id)}
                  aria-pressed={!!post.userBookmarked}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all focus-ring cursor-pointer ${
                    post.userBookmarked
                      ? "bg-[#E8D7AE]/30 text-[#1D5046] border border-[#E8D7AE]/60"
                      : "bg-[#FAF7F0] text-[#1D5046] hover:bg-white border border-[#E8E2D5]"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      post.userBookmarked ? "fill-current" : ""
                    }`}
                  />
                  <span>{post.userBookmarked ? t("community.detail_modal.saved") : t("community.detail_modal.save_post")}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0] transition-all focus-ring cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>{copied ? t("community.detail_modal.link_copied") : t("community.detail_modal.share")}</span>
            </button>
          </div>

          {/* Comments Section */}
          <div className="space-y-3.5 pt-3 border-t border-[#E8E2D5]">
            <h4 className="font-serif text-base font-bold text-[#1D5046] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-antique-gold" />
              <span>{t("community.detail_modal.discussion_title", { count: post.comments?.length || post.commentsCount || 0 })}</span>
            </h4>

            {/* List of Comments */}
            <div className="space-y-2.5">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((cmt) => (
                  <div key={cmt.id} className="space-y-1.5">
                    <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#1D5046] text-white text-[10px] font-bold flex items-center justify-center">
                            {cmt.avatarText}
                          </span>
                          <span className="font-bold text-[#1D5046]">
                            {cmt.authorName}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6E7B75]">
                          {cmt.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-[#314F49] pl-8 leading-relaxed">
                        {cmt.text}
                      </p>
                      <div className="pl-8 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            setReplyingToId(
                              replyingToId === cmt.id ? null : cmt.id
                            )
                          }
                          className="text-[11px] font-semibold text-[#1D5046] hover:underline cursor-pointer"
                        >
                          {t("community.detail_modal.reply")}
                        </button>
                      </div>
                    </div>

                    {/* Inline Reply Form */}
                    {replyingToId === cmt.id && (
                      <div className="pl-6 flex gap-2 items-center">
                        <CornerDownRight className="w-3.5 h-3.5 text-[#6E7B75] shrink-0" />
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={t("community.detail_modal.reply_placeholder", { name: cmt.authorName })}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#E8E2D5] text-xs text-[#314F49] focus:outline-none focus:ring-1 focus:ring-[#1D5046]"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(cmt.id)}
                          disabled={!replyText.trim()}
                          className="px-3 py-1.5 rounded-lg bg-[#1D5046] text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                        >
                          {t("community.detail_modal.send")}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-[#FAF7F0] text-center text-xs text-[#6E7B75]">
                  {t("community.detail_modal.no_comments")}
                </div>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSendComment} className="flex gap-2 pt-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                aria-label={t("community.detail_modal.write_comment_aria")}
                placeholder={t("community.detail_modal.comment_placeholder")}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs text-[#314F49] placeholder:text-[#6E7B75]/70 focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#1D5046] text-white font-semibold text-xs hover:bg-[#153D35] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer focus-ring"
              >
                <Send className="w-3.5 h-3.5 text-[#E8D7AE]" />
                <span>{t("community.detail_modal.send")}</span>
              </button>
            </form>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default CommunityDetailModal;
