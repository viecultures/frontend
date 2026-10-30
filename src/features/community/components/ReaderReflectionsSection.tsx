import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Heart,
  BookOpen,
  ShieldCheck,
  Flag,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import type { UserReflectionItem } from "../types";
import {
  checkPassiveModeration,
  detectUsedVocab,
  validateReflectionText,
  MIN_REFLECTION_LENGTH,
} from "../lib/reflectionsModeration";
import { getStoredUser } from "@/utils/auth-storage";

export interface ReaderReflectionsSectionProps {
  postId: string;
  postTitle?: string;
  vocabularies?: Array<{
    id: string;
    word: string;
    ipa?: string;
    vietnameseMeaning?: string;
  }>;
  themeMode?: "paper" | "dark";
}

const STORAGE_PREFIX = "vie_reader_reflections_";
const LIKES_KEY = "vie_user_liked_reflections";
const REPORTS_KEY = "vie_user_reported_reflections";

function getSeedReflections(postId: string, postTitle?: string): UserReflectionItem[] {
  if (postId.includes("tet") || postTitle?.toLowerCase().includes("tet")) {
    return [
      {
        id: "seed-tet-1",
        postId,
        authorName: "Minh Thư",
        authorRole: "VieCultures learner",
        avatarText: "MT",
        content:
          "Wrapping Bánh Chưng with my family every New Year eve is our most cherished ancestor ritual. My English is still developing, but reading this gave me so much pride in our Vietnamese heritage!",
        usedWords: ["ancestor", "cherished", "ritual"],
        usedVocabIds: [],
        reactionsCount: 14,
        status: "published",
        createdAt: "2026-10-24T10:00:00Z",
        timeAgo: "1 day ago",
      },
      {
        id: "seed-tet-2",
        postId,
        authorName: "Kenji Tanaka",
        authorRole: "International learner",
        avatarText: "KT",
        content:
          "In Japan we also have Osechi-ryori for New Year. Seeing the profound reunion spirit of Vietnamese Tet feels both exotic and deeply relatable. Mâm ngũ quả is beautiful!",
        usedWords: ["reunion", "profound"],
        usedVocabIds: [],
        reactionsCount: 9,
        status: "published",
        createdAt: "2026-10-25T08:30:00Z",
        timeAgo: "4 hours ago",
      },
    ];
  }

  return [
    {
      id: "seed-default-1",
      postId,
      authorName: "Bảo Ngọc",
      authorRole: "VieCultures learner",
      avatarText: "BN",
      content:
        "I was always hesitant to write long English paragraphs because of grammar anxieties. Reading this inspired me to describe our folk culture in my own words without fear of making mistakes!",
      usedWords: ["cherished", "heritage"],
      usedVocabIds: [],
      reactionsCount: 18,
      status: "published",
      createdAt: "2026-10-25T09:00:00Z",
      timeAgo: "3 hours ago",
    },
    {
      id: "seed-default-2",
      postId,
      authorName: "Alex Rivera",
      authorRole: "Heritage enthusiast",
      avatarText: "AR",
      content:
        "The cultural depth behind this reading is fascinating. Love how the bilingual mode helped me learn vocabulary directly in its cultural context.",
      usedWords: ["cultural", "context"],
      usedVocabIds: [],
      reactionsCount: 7,
      status: "published",
      createdAt: "2026-10-25T11:20:00Z",
      timeAgo: "1 hour ago",
    },
  ];
}

export function ReaderReflectionsSection({
  postId,
  postTitle,
  vocabularies = [],
  themeMode = "paper",
}: ReaderReflectionsSectionProps) {
  const { t } = useTranslation("community");
  const isDark = themeMode === "dark";
  const currentUser = getStoredUser();

  const [reflections, setReflections] = useState<UserReflectionItem[]>([]);
  const [reflectionText, setReflectionText] = useState("");
  const [authorNameInput, setAuthorNameInput] = useState(currentUser?.name || "");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState<{
    type: "success" | "pending" | "info";
    text: string;
  } | null>(null);
  const [lastInsertedWord, setLastInsertedWord] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load reflections from localStorage or seeds
  useEffect(() => {
    try {
      const storageKey = `${STORAGE_PREFIX}${postId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setReflections(JSON.parse(saved));
      } else {
        const seeds = getSeedReflections(postId, postTitle);
        setReflections(seeds);
        localStorage.setItem(storageKey, JSON.stringify(seeds));
      }

      // Load user likes
      const savedLikes = localStorage.getItem(LIKES_KEY);
      if (savedLikes) {
        setLikedIds(new Set(JSON.parse(savedLikes)));
      }

      // Load user reports
      const savedReports = localStorage.getItem(REPORTS_KEY);
      if (savedReports) {
        setReportedIds(new Set(JSON.parse(savedReports)));
      }
    } catch {
      // Graceful fallback
      setReflections(getSeedReflections(postId, postTitle));
    }
  }, [postId, postTitle]);

  // Synchronize author name if user logs in
  useEffect(() => {
    if (currentUser?.name && !authorNameInput) {
      setAuthorNameInput(currentUser.name);
    }
  }, [currentUser?.name, authorNameInput]);

  // Validation
  const validation = validateReflectionText(reflectionText);
  const detectedVocab = detectUsedVocab(
    reflectionText,
    vocabularies.map((v) => ({ id: v.id, word: v.word }))
  );

  // Insert word from Quick Vocab Toolbar
  const handleInsertWord = (word: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setReflectionText((prev) => (prev ? `${prev} ${word} ` : `${word} `));
      setLastInsertedWord(word);
      return;
    }

    const start = textarea.selectionStart ?? reflectionText.length;
    const end = textarea.selectionEnd ?? reflectionText.length;
    const before = reflectionText.substring(0, start);
    const after = reflectionText.substring(end);
    const spaceBefore = before.length > 0 && !before.endsWith(" ") ? " " : "";
    const spaceAfter = after.length > 0 && !after.startsWith(" ") ? " " : " ";
    const newText = `${before}${spaceBefore}${word}${spaceAfter}${after}`;

    setReflectionText(newText);
    setLastInsertedWord(word);

    // Re-focus and position cursor right after inserted word
    setTimeout(() => {
      textarea.focus();
      const newCursor = start + spaceBefore.length + word.length + spaceAfter.length;
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);

    setTimeout(() => setLastInsertedWord(null), 2500);
  };

  // Submit Reflection
  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;

    // 1. Passive Moderation Check (EC-03.1)
    const moderation = checkPassiveModeration(reflectionText);

    const displayName = authorNameInput.trim() || currentUser?.name || "VieCultures learner";
    const initials = displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("") || "VC";

    const newReflection: UserReflectionItem = {
      id: `ref-${Date.now()}`,
      postId,
      userId: currentUser?.email,
      authorName: displayName,
      authorRole: currentUser?.role === "ADMIN" ? "Moderator" : "Community Learner",
      avatarText: initials,
      content: reflectionText.trim(),
      usedWords: detectedVocab.matchedWords,
      usedVocabIds: detectedVocab.matchedVocabIds,
      reactionsCount: 0,
      status: moderation.status,
      createdAt: new Date().toISOString(),
      timeAgo: "Just now",
    };

    // Optimistic UI Update: Prepend immediately to state & localStorage
    const updated = [newReflection, ...reflections];
    setReflections(updated);

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${postId}`, JSON.stringify(updated));
    } catch (err) {
      console.warn("[ReaderReflectionsSection] LocalStorage write error:", err);
    }

    // Dispatch gamification event (05_domain_gamification contract)
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("community:reflection-posted", {
          detail: {
            reflectionId: newReflection.id,
            postId,
            status: moderation.status,
            usedVocabCount: detectedVocab.matchedWords.length,
          },
        })
      );
    }

    // Set feedback banner
    if (moderation.status === "pending_review") {
      setNotice({
        type: "pending",
        text: t("community.reader_reflections.notice_pending"),
      });
    } else {
      setNotice({
        type: "success",
        text: t("community.reader_reflections.notice_success"),
      });
    }

    setReflectionText("");
  };

  // Toggle Heart Reaction (Positive Reinforcement Only - No Dislike per policy)
  const handleToggleHeart = (reflectionId: string) => {
    const isLiked = likedIds.has(reflectionId);
    const updatedLikes = new Set(likedIds);

    if (isLiked) {
      updatedLikes.delete(reflectionId);
    } else {
      updatedLikes.add(reflectionId);
    }

    setLikedIds(updatedLikes);
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(updatedLikes)));
    } catch {
      // ignore
    }

    // Update reflections count optimistically
    setReflections((prev) =>
      prev.map((ref) => {
        if (ref.id === reflectionId) {
          return {
            ...ref,
            reactionsCount: Math.max(0, ref.reactionsCount + (isLiked ? -1 : 1)),
          };
        }
        return ref;
      })
    );
  };

  // Report Inappropriate Reflection (EC-03.1 Community Safety)
  const handleReport = (reflectionId: string) => {
    if (reportedIds.has(reflectionId)) return;

    const updated = new Set(reportedIds);
    updated.add(reflectionId);
    setReportedIds(updated);

    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(Array.from(updated)));
    } catch {
      // ignore
    }

    setNotice({
      type: "info",
      text: t("community.reader_reflections.notice_reported"),
    });
  };

  return (
    <section
      aria-label={t("community.reader_reflections.section_aria")}
      className={`reader-reflections-section my-10 p-6 sm:p-8 rounded-3xl border transition-all ${
        isDark
          ? "bg-[#16211C] border-antique-gold/25 text-warm-ivory shadow-lg"
          : "bg-surface border-antique-gold/30 text-heritage-green shadow-sm"
      }`}
    >
      {/* 1. Non-Judgmental English Policy Banner */}
      <div
        className={`policy-banner mb-8 p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center gap-4 transition-all ${
          isDark
            ? "bg-[#1E2E27] border-antique-gold/40 text-warm-ivory"
            : "bg-rice-paper border-antique-gold/40 text-heritage-green"
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-antique-gold/20 flex items-center justify-center shrink-0 border border-antique-gold/40 text-[#1D5046]">
          <ShieldCheck className="w-6 h-6 text-antique-gold" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-antique-gold/20 text-antique-gold border border-antique-gold/30">
              {t("community.reader_reflections.policy_title")}
            </span>
            <span className="text-xs font-semibold opacity-75">
              {t("community.reader_reflections.policy_subtitle")}
            </span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed opacity-90">
            {t("community.reader_reflections.policy_desc")}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-antique-gold px-3 py-1.5 rounded-xl bg-antique-gold/10 border border-antique-gold/20">
          <ShieldCheck className="w-4 h-4 text-antique-gold" />
          <span>{t("community.reader_reflections.policy_badge")}</span>
        </div>
      </div>

      {/* 2. Quick Vocab Toolbar */}
      {vocabularies && vocabularies.length > 0 && (
        <div className="quick-vocab-toolbar mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-antique-gold">
              <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
              <span>{t("community.reader_reflections.quick_vocab_title")}</span>
            </label>
            <span className="text-[11px] opacity-70">
              {t("community.reader_reflections.quick_vocab_desc")}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {vocabularies.map((vocab) => {
              const isUsed = detectedVocab.matchedWords.includes(vocab.word);
              return (
                <button
                  key={vocab.id || vocab.word}
                  type="button"
                  onClick={() => handleInsertWord(vocab.word)}
                  title={vocab.vietnameseMeaning ? `${vocab.word}: ${vocab.vietnameseMeaning}` : vocab.word}
                  className={`group shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                    isUsed
                      ? "bg-antique-gold/25 border-antique-gold text-antique-gold font-bold shadow-sm"
                      : isDark
                      ? "bg-[#1E2E27] border-line/50 text-warm-ivory hover:border-antique-gold"
                      : "bg-surface border-line hover:border-antique-gold text-heritage-green hover:bg-rice-paper"
                  }`}
                >
                  <Plus className="w-3 h-3 text-antique-gold group-hover:rotate-90 transition-transform" />
                  <span className="font-semibold">{vocab.word}</span>
                  {vocab.vietnameseMeaning && (
                    <span className="text-[10px] opacity-65 font-normal max-w-[120px] truncate">
                      ({vocab.vietnameseMeaning})
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {lastInsertedWord && (
            <div className="text-[11px] text-antique-gold flex items-center gap-1 mt-1 animate-in fade-in">
              <CheckCircle2 className="w-3 h-3" />
              <span>{t("community.reader_reflections.inserted_word", { word: lastInsertedWord })}</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Reflection Composer */}
      <form onSubmit={handleSubmitReflection} className="reflection-composer mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-antique-gold" />
              <span>{t("community.reader_reflections.share_title")}</span>
            </h3>
            <p className="text-xs opacity-75 mt-0.5">
              {t("community.reader_reflections.share_desc", { story: postTitle || t("community.reader_reflections.this_story_fallback") })}
            </p>
          </div>

          {/* Author Name Input */}
          <div className="flex items-center gap-2">
            <label htmlFor="reflection-author" className="text-xs font-semibold opacity-70 shrink-0">
              {t("community.reader_reflections.your_name_label")}
            </label>
            <input
              id="reflection-author"
              type="text"
              value={authorNameInput}
              onChange={(e) => setAuthorNameInput(e.target.value)}
              placeholder={t("community.reader_reflections.author_placeholder")}
              className={`text-xs px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-antique-gold/40 ${
                isDark
                  ? "bg-[#1E2E27] border-line/60 text-warm-ivory placeholder:text-warm-ivory/40"
                  : "bg-rice-paper border-line text-heritage-green placeholder:text-text-secondary/50"
              }`}
            />
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-1.5">
          <textarea
            ref={textareaRef}
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder={t("community.reader_reflections.textarea_placeholder")}
            rows={4}
            className={`w-full p-4 rounded-2xl border text-sm leading-relaxed transition-all focus:outline-none focus:ring-2 focus:ring-antique-gold/50 ${
              isDark
                ? "bg-[#141C18] border-line/60 text-warm-ivory placeholder:text-warm-ivory/40 focus:border-antique-gold"
                : "bg-surface border-heritage-green/20 text-heritage-green placeholder:text-text-secondary/50 focus:border-antique-gold"
            }`}
          />

          {/* Character Counter & Lemmatized Vocab Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs px-1">
            <div className="flex items-center gap-2 flex-wrap">
              {detectedVocab.matchedWords.length > 0 ? (
                <span className="text-antique-gold font-bold inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t("community.reader_reflections.heritage_words_used", { count: detectedVocab.matchedWords.length })}</span>
                  <span className="font-semibold underline">
                    {detectedVocab.matchedWords.join(", ")}
                  </span>
                </span>
              ) : (
                <span className="text-[11px] opacity-65 italic">
                  {t("community.reader_reflections.vocab_tip")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`font-semibold ${
                  validation.isValid
                    ? "text-emerald-500"
                    : "text-amber-500 dark:text-amber-400"
                }`}
              >
                {t("community.reader_reflections.char_count", { chars: validation.length, min: MIN_REFLECTION_LENGTH })}
              </span>

              <button
                type="submit"
                disabled={!validation.isValid}
                className={`px-5 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm ${
                  validation.isValid
                    ? "bg-heritage-green text-warm-ivory hover:bg-heritage-dark border border-antique-gold/60 cursor-pointer shadow-md hover:scale-[1.02]"
                    : "opacity-45 bg-line text-text-secondary cursor-not-allowed border border-transparent"
                }`}
              >
                <Send className="w-3.5 h-3.5 text-antique-gold" />
                <span>{t("community.reader_reflections.publish_btn")}</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Feedback / Moderation Notice Banner */}
      {notice && (
        <div
          role="status"
          className={`mb-6 p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in ${
            notice.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
              : notice.type === "pending"
              ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300"
              : "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-300"
          }`}
        >
          {notice.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
          {notice.type === "pending" && <Clock className="w-4 h-4 shrink-0 mt-0.5" />}
          {notice.type === "info" && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          <div className="flex-1">{notice.text}</div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4. UGC Reflections Feed */}
      <div className="reflections-feed space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-base sm:text-lg font-bold">
              {t("community.reader_reflections.community_voices", { count: reflections.length })}
            </h4>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-antique-gold/15 text-antique-gold font-bold">
              UGC Feed
            </span>
          </div>
          <span className="text-xs opacity-65 hidden sm:inline">
            {t("community.reader_reflections.celebrating_sub")}
          </span>
        </div>

        {reflections.length === 0 ? (
          <div className="text-center py-10 opacity-70 text-sm">
            {t("community.reader_reflections.no_reflections")}
          </div>
        ) : (
          <div className="space-y-4">
            {reflections.map((ref) => {
              const isLiked = likedIds.has(ref.id);
              const isReported = reportedIds.has(ref.id);
              const isPending = ref.status === "pending_review";

              return (
                <article
                  key={ref.id}
                  className={`reflection-card p-5 rounded-2xl border transition-all ${
                    isPending
                      ? "border-amber-400/50 bg-amber-500/5"
                      : isDark
                      ? "bg-[#1E2E27] border-line/60 hover:border-antique-gold/40"
                      : "bg-rice-paper/80 border-line hover:border-antique-gold/40 shadow-xs"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-heritage-green text-antique-gold font-bold text-xs flex items-center justify-center border border-antique-gold/30">
                        {ref.avatarText}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-heritage-green dark:text-warm-ivory">
                            {ref.authorName}
                          </span>
                          {ref.authorRole && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-antique-gold/15 text-antique-gold border border-antique-gold/30">
                              {ref.authorRole}
                            </span>
                          )}
                          {isPending && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{t("community.reader_reflections.pending_tag")}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] opacity-65">{ref.timeAgo || "Recently"}</span>
                      </div>
                    </div>

                    {/* Report Button */}
                    <button
                      type="button"
                      onClick={() => handleReport(ref.id)}
                      disabled={isReported}
                      className={`text-[11px] inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        isReported
                          ? "opacity-50 text-amber-500 border-amber-500/30"
                          : "opacity-60 hover:opacity-100 border-transparent hover:border-line text-text-secondary"
                      }`}
                      title={t("community.reader_reflections.report_aria")}
                    >
                      <Flag className="w-3 h-3" />
                      <span>{isReported ? t("community.reader_reflections.reported") : t("community.reader_reflections.report")}</span>
                    </button>
                  </div>

                  {/* Card Content */}
                  <p className="text-sm leading-relaxed whitespace-pre-line mb-3">
                    {ref.content}
                  </p>

                  {/* Used Heritage Words Pills if any */}
                  {ref.usedWords && ref.usedWords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-65 flex items-center gap-1">
                        <BookOpen className="w-2.5 h-2.5 text-antique-gold" />
                        <span>{t("community.reader_reflections.vocab_applied")}</span>
                      </span>
                      {ref.usedWords.map((word) => (
                        <span
                          key={word}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-antique-gold/20 text-antique-gold border border-antique-gold/30"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Footer: Positive Support Reactions Only (No Dislike) */}
                  <div className="flex items-center justify-between pt-2 border-t border-line/60 text-xs">
                    <span className="text-[11px] opacity-60 italic">
                      {t("community.reader_reflections.space_label")}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleHeart(ref.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        isLiked
                          ? "bg-rose-500/15 border-rose-500/40 text-rose-500 font-bold"
                          : "border-line opacity-75 hover:opacity-100 hover:border-rose-400/50 hover:text-rose-500"
                      }`}
                      aria-label={t("community.reader_reflections.encourage_aria")}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform ${
                          isLiked ? "fill-rose-500 text-rose-500 scale-110" : ""
                        }`}
                      />
                      <span>{ref.reactionsCount}</span>
                      <span className="text-[10px] hidden sm:inline">{t("community.reader_reflections.support_label")}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default ReaderReflectionsSection;
