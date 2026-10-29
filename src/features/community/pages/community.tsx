import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { CommunityPost, HighlightVocabItem } from "../types";
import {
  CommunityHeader,
  CommunityPostEditor,
  CommunityPostCard,
  CommunitySidebar,
  CommunityDetailModal,
  VocabDefinitionModal,
  ImageLightboxModal,
} from "../components";
import {
  Search,
  Plus,
  Check,
  X,
  PenLine,
  BookOpen,
  ImageIcon,
  Compass,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";

type FeedFilter = "for-you" | "following" | "latest" | "trending";

const TOPIC_FILTERS = [
  { id: "all", label: "All reflections" },
  { id: "Imperial Hue", label: "Imperial Hue" },
  { id: "Saigon Bánh Mì", label: "Saigon Food" },
  { id: "Hội An Lanterns", label: "Hoi An" },
  { id: "Vietnamese Traditions", label: "Vietnamese Traditions" },
];

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorName: "Minh Anh",
    authorRole: "Cultural Ambassador",
    avatarText: "MA",
    isAmbassador: true,
    authorFollowing: true,
    timeAgo: "2 hours ago",
    lessonTag: "Imperial Hue",
    topicCategory: "architecture",
    topicSlug: "imperial-hue",
    feedType: "for-you",
    title: "Ngọ Môn Gate & the royal geometry of the Citadel",
    contentEn:
      "Visiting the Ngọ Môn Gate last summer made me appreciate the architectural wisdom of royal builders. Standing in front of the five-entrance gate, I noticed how the central passage was reserved exclusively for the emperor. Expressing this in English helped me connect with intangible heritage in a whole new way.",
    highlightWords: [
      {
        word: "architectural",
        ipa: "/ˌɑː.kɪˈtek.tʃər.əl/",
        meaning: "thuộc kiến trúc",
        partOfSpeech: "Adjective",
        synonyms: ["structural", "design-related", "constructional"],
        exampleSentence: "Hue is world-renowned for its harmonious architectural heritage.",
      },
      {
        word: "intangible",
        ipa: "/ɪnˈtæn.dʒə.bəl/",
        meaning: "phi vật thể",
        partOfSpeech: "Adjective",
        synonyms: ["non-material", "spiritual", "abstract"],
        exampleSentence: "Court music along Perfume River is a recognized intangible cultural masterpiece.",
      },
    ],
    heartsCount: 38,
    commentsCount: 3,
    imageUrl: "/images/landing/hue-citadel.jpg",
    imageCaption: "Ngọ Môn Gate at sunrise, Imperial Hue Citadel",
    comments: [
      {
        id: "c-1",
        authorName: "Kenji Sato",
        avatarText: "KS",
        timeAgo: "1 hour ago",
        text: "The symmetry of the Hue Citadel architecture is truly breathtaking!",
      },
      {
        id: "c-2",
        authorName: "Lê Thu Hà",
        avatarText: "TH",
        timeAgo: "30 mins ago",
        text: "Your English expression is so vivid and evocative, Minh Anh!",
      },
    ],
  },
  {
    id: "post-2",
    authorName: "Daniel Krauss",
    authorRole: "Global Learner",
    avatarText: "DK",
    isAmbassador: false,
    authorFollowing: true,
    timeAgo: "5 hours ago",
    lessonTag: "Saigon Bánh Mì",
    topicCategory: "cuisine",
    topicSlug: "saigon-food",
    feedType: "for-you",
    title: "How French baguettes evolved into Saigon street identity",
    contentEn:
      "I loved learning how bánh mì evolved from 19th-century French culinary imports into an unmistakably Vietnamese street food staple. Incorporating pâté, cilantro, and pickled daikon completely transformed the bread. Practicing vocabulary through food history makes words stick so much faster.",
    highlightWords: [
      {
        word: "culinary",
        ipa: "/ˈkʌl.ɪ.nər.i/",
        meaning: "thuộc ẩm thực",
        partOfSpeech: "Adjective",
        synonyms: ["gastronomic", "cooking-related", "food-related"],
        exampleSentence: "Saigon is one of the world's most vibrant culinary capitals.",
      },
      {
        word: "evolved",
        ipa: "/ɪˈvɒlvd/",
        meaning: "tiến hóa, phát triển",
        partOfSpeech: "Verb (Past)",
        synonyms: ["developed", "transformed", "adapted"],
        exampleSentence: "Vietnamese street snacks evolved through rich cross-cultural exchanges.",
      },
    ],
    heartsCount: 29,
    commentsCount: 2,
    imageUrl: "/images/landing/banh-mi.jpg",
    imageCaption: "Crispy freshly baked baguettes at a street cart in Saigon",
    comments: [
      {
        id: "c-3",
        authorName: "Phạm Hải Đăng",
        avatarText: "HĐ",
        timeAgo: "3 hours ago",
        text: "Next time you must try bánh mì xíu mại in Da Lat too!",
      },
    ],
  },
  {
    id: "post-3",
    authorName: "Lê Thu Hà",
    authorRole: "Cultural Ambassador",
    avatarText: "TH",
    isAmbassador: true,
    authorFollowing: false,
    timeAgo: "Yesterday",
    lessonTag: "Hội An Lanterns",
    topicCategory: "festivals",
    topicSlug: "hoi-an",
    feedType: "trending",
    title: "Silk lanterns illuminating the Thu Bồn River at night",
    contentEn:
      "Attending the full-moon lantern festival along the Thu Bồn River was unforgettable. The vibrant silk craftsmanship reflecting across the water brought the heritage reading lessons to life. I tried explaining the bamboo frame construction to a foreign friend and it was such rewarding speaking practice.",
    highlightWords: [
      {
        word: "craftsmanship",
        ipa: "/ˈkrɑːfts.mən.ʃɪp/",
        meaning: "tay nghề thủ công",
        partOfSpeech: "Noun",
        synonyms: ["artistry", "workmanship", "skill"],
        exampleSentence: "Generations of Hoi An artisans preserved their delicate silk lantern craftsmanship.",
      },
      {
        word: "vibrant",
        ipa: "/ˈvaɪ.brənt/",
        meaning: "rực rỡ, sống động",
        partOfSpeech: "Adjective",
        synonyms: ["lively", "vivid", "colorful"],
        exampleSentence: "The old town was filled with vibrant festive lanterns reflecting on the river.",
      },
    ],
    heartsCount: 45,
    commentsCount: 4,
    imageUrl: "/images/landing/hoi-an-lanterns.jpg",
    imageCaption: "Traditional silk lanterns glowing along the riverside in Hoi An",
    comments: [
      {
        id: "c-4",
        authorName: "Minh Anh",
        avatarText: "MA",
        timeAgo: "18 hours ago",
        text: "Hội An at night feels like stepping right into a fairy tale.",
      },
    ],
  },
  {
    id: "post-4",
    authorName: "Trần Thanh Thảo",
    authorRole: "Cultural Ambassador",
    avatarText: "TT",
    isAmbassador: true,
    authorFollowing: true,
    timeAgo: "2 days ago",
    lessonTag: "Vietnamese Traditions",
    topicCategory: "crafts",
    topicSlug: "vietnamese-traditions",
    feedType: "latest",
    title: "Đông Hồ woodblock prints: Preserving folk stories on Dó paper",
    contentEn:
      "Visiting the Đông Hồ craft village in Bắc Ninh showed me how folk philosophy was promulgated through natural scallop-shell paper and vegetable dyes. Every print tells an enduring story of agrarian resilience, optimism, and family prosperity. Writing about this helped me master cultural collocations.",
    highlightWords: [
      {
        word: "promulgated",
        ipa: "/ˈprɒm.əl.ɡeɪ.tɪd/",
        meaning: "truyền bá, lan tỏa",
        partOfSpeech: "Verb",
        synonyms: ["disseminated", "broadcast", "spread"],
        exampleSentence: "Folk sayings and woodblock prints promulgated agrarian virtues across centuries.",
      },
      {
        word: "resilience",
        ipa: "/rɪˈzɪl.jəns/",
        meaning: "sự kiên cường, bền bỉ",
        partOfSpeech: "Noun",
        synonyms: ["perseverance", "fortitude", "endurance"],
        exampleSentence: "Traditional Vietnamese folk art portrays the cheerful resilience of village life.",
      },
    ],
    heartsCount: 32,
    commentsCount: 3,
    imageUrl: "/images/landing/dong-ho.jpg",
    imageCaption: "Đông Hồ traditional folk woodblock prints on scallop-shell Dó paper",
    comments: [
      {
        id: "c-5",
        authorName: "Daniel Krauss",
        avatarText: "DK",
        timeAgo: "1 day ago",
        text: "The natural colors made from tree bark and gardenia are so fascinating!",
      },
    ],
  },
  {
    id: "post-5",
    authorName: "Kenji Sato",
    authorRole: "Global Learner",
    avatarText: "KS",
    isAmbassador: false,
    authorFollowing: false,
    timeAgo: "3 days ago",
    lessonTag: "Vietnamese Traditions",
    topicCategory: "crafts",
    topicSlug: "vietnamese-traditions",
    feedType: "latest",
    title: "Glazing techniques of 700-year-old river pottery in Bát Tràng",
    contentEn:
      "Watching the master potters spin clay along the Red River was mesmerizing. They explained how crackle glaze was perfected during the Lê Dynasty. Practicing architectural and craft vocabulary with locals made my Vietnam travels ten times more meaningful.",
    highlightWords: [
      {
        word: "artisans",
        ipa: "/ˈɑː.tɪ.zænz/",
        meaning: "nghệ nhân",
        partOfSpeech: "Noun (Plural)",
        synonyms: ["craftsmen", "masters", "sculptors"],
        exampleSentence: "Skillful artisans in Bát Tràng have passed down ceramic recipes for seven centuries.",
      },
    ],
    heartsCount: 22,
    commentsCount: 1,
    imageUrl: "/images/landing/bat-trang.jpg",
    imageCaption: "Handcrafted ceramics drying in the courtyards of Bát Tràng",
    comments: [
      {
        id: "c-6",
        authorName: "Lê Thu Hà",
        avatarText: "TH",
        timeAgo: "2 days ago",
        text: "Bát Tràng ceramics have such timeless warmth and tactile beauty.",
      },
    ],
  },
];

export default function CommunityPage() {
  const { t } = useTranslation('community');
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>("");
  const [reflectionText, setReflectionText] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("Imperial Hue");
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("for-you");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalPost, setActiveModalPost] = useState<CommunityPost | null>(null);
  const [activeVocab, setActiveVocab] = useState<HighlightVocabItem | null>(null);
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    imageUrl?: string;
    caption?: string;
    title?: string;
  }>({ isOpen: false });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Like
  const handleToggleHeart = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const isLiked = post.userLiked;
          const updated = {
            ...post,
            userLiked: !isLiked,
            heartsCount: isLiked ? post.heartsCount - 1 : post.heartsCount + 1,
          };
          if (activeModalPost?.id === id) {
            setActiveModalPost(updated);
          }
          return updated;
        }
        return post;
      })
    );
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const isBookmarked = post.userBookmarked;
          const updated = {
            ...post,
            userBookmarked: !isBookmarked,
          };
          if (activeModalPost?.id === id) {
            setActiveModalPost(updated);
          }
          showToast(
            !isBookmarked
              ? "Saved in this preview until you leave the page."
              : "Removed from this preview's saved list."
          );
          return updated;
        }
        return post;
      })
    );
  };

  // Toggle Author Follow
  const handleToggleFollow = (authorName: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.authorName === authorName) {
          const newStatus = !post.authorFollowing;
          showToast(
            newStatus
              ? `Following ${authorName} in this preview only.`
              : `Stopped following ${authorName} in this preview.`
          );
          return {
            ...post,
            authorFollowing: newStatus,
          };
        }
        return post;
      })
    );
  };

  // Add Comment or Threaded Reply
  const handleAddComment = (
    postId: string,
    text: string,
    replyToCommentId?: string
  ) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: "You",
      avatarText: "HV",
      timeAgo: "Just now",
      text,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          let updatedComments = [...(post.comments || [])];
          if (replyToCommentId) {
            updatedComments = updatedComments.map((cmt) => {
              if (cmt.id === replyToCommentId) {
                return {
                  ...cmt,
                  replies: [...(cmt.replies || []), newComment],
                };
              }
              return cmt;
            });
          } else {
            updatedComments.push(newComment);
          }

          const updated = {
            ...post,
            comments: updatedComments,
            commentsCount: updatedComments.length,
          };
          if (activeModalPost?.id === postId) {
            setActiveModalPost(updated);
          }
          return updated;
        }
        return post;
      })
    );
    showToast(t("community.toasts.comment_added"));
  };

  // Publish New Reflection
  const handlePublish = (data: {
    title: string;
    content: string;
    lesson: string;
    imageUrl?: string;
    imageCaption?: string;
    vocabList: HighlightVocabItem[];
  }) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: "Học Viên VieCultures",
      authorRole: "Cultural Ambassador",
      avatarText: "HV",
      isAmbassador: true,
      authorFollowing: true,
      timeAgo: "Just now",
      lessonTag: data.lesson,
      topicCategory: "general",
      title: data.title || `Reflections on ${data.lesson}`,
      contentEn: data.content,
      highlightWords: data.vocabList,
      heartsCount: 1,
      commentsCount: 0,
      userLiked: true,
      imageUrl: data.imageUrl,
      imageCaption: data.imageCaption,
      comments: [],
      feedType: "for-you",
    };

    setPosts([newPost, ...posts]);
    setPostTitle("");
    setReflectionText("");
    setIsEditorOpen(false);
    showToast(t("community.toasts.reflection_published"));
  };

  // Report post
  const handleReportPost = (postId: string) => {
    showToast(t("community.toasts.report_unavailable"));
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Topic filter
      if (selectedTopic !== "all") {
        if (selectedTopic === "Vietnamese Traditions") {
          if (
            post.lessonTag !== "Vietnamese Traditions" &&
            post.topicCategory !== "crafts"
          ) {
            return false;
          }
        } else if (post.lessonTag !== selectedTopic) {
          return false;
        }
      }

      // 2. Feed stream filter
      if (feedFilter === "following" && !post.authorFollowing) {
        return false;
      }
      if (feedFilter === "trending" && post.heartsCount < 25) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title?.toLowerCase().includes(q);
        const matchContent = post.contentEn.toLowerCase().includes(q);
        const matchAuthor = post.authorName.toLowerCase().includes(q);
        const matchTag = post.lessonTag.toLowerCase().includes(q);
        return matchTitle || matchContent || matchAuthor || matchTag;
      }

      return true;
    });
  }, [posts, selectedTopic, feedFilter, searchQuery]);

  return (
    <main className="community-ui min-h-screen bg-[#FAF7F0] text-[#314F49] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#1D5046] text-white shadow-lg border border-[#153D35] flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-3 duration-300 max-w-[90vw] whitespace-nowrap"
        >
          <Check className="w-4 h-4 text-[#E8D7AE] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container: 1280px Max Width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="mb-5 rounded-xl border border-[#E8E2D5] bg-white px-4 py-3 text-sm text-[#314F49]">
          {t("community.composer.preview_notice")}
        </p>
        {/* 1. Page Header with Compact Hierarchy */}
        <CommunityHeader
          isEditorOpen={isEditorOpen}
          onToggleEditor={() => setIsEditorOpen((prev) => !prev)}
          activeTab="reflections"
        />

        {/* 2. Full Reflection Studio / Editor (Toggleable) */}
        <CommunityPostEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          selectedLesson={selectedLesson}
          onChangeLesson={setSelectedLesson}
          postTitle={postTitle}
          onChangePostTitle={setPostTitle}
          reflectionText={reflectionText}
          onChangeReflectionText={setReflectionText}
          onPublish={handlePublish}
        />

        {/* 3. Responsive Two-Column Layout (Desktop 68% feed / 32% sidebar, 24px gap) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* MAIN SOCIAL LEARNING FEED (~68% on Desktop: 8 cols)       */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-4">
            {/* 3.1 Quick Social Composer Box */}
            <div
              onClick={() => {
                setIsEditorOpen(true);
                window.scrollTo({ top: 100, behavior: "smooth" });
              }}
              className="p-4 rounded-2xl bg-white border border-[#E8E2D5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#1D5046]/40 transition-all cursor-pointer group space-y-3"
              role="button"
              tabIndex={0}
              aria-label="Open reflection composer"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsEditorOpen(true);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-[#1D5046]/10 text-[#1D5046] font-bold text-xs flex items-center justify-center border border-[#1D5046]/20 shrink-0"
                  aria-hidden="true"
                >
                  HV
                </div>
                <div className="flex-1 bg-[#FAF7F0] group-hover:bg-[#FAF7F0]/80 border border-[#E8E2D5] rounded-xl px-4 py-2.5 text-xs text-[#6E7B75] transition-colors">
                  <span>{t("community.composer.placeholder")}</span>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D5]/60 text-xs">
                <div className="flex items-center gap-3 text-[#6E7B75]">
                  <span className="flex items-center gap-1.5 hover:text-[#1D5046] transition-colors">
                    <ImageIcon className="w-3.5 h-3.5 text-[#1D5046]" />
                    <span className="hidden sm:inline">{t("community.composer.add_photo")}</span>
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-[#1D5046] transition-colors">
                    <BookOpen className="w-3.5 h-3.5 text-[#1D5046]" />
                    <span className="hidden sm:inline">{t("community.composer.tag_vocab")}</span>
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-[#1D5046] transition-colors">
                    <PenLine className="w-3.5 h-3.5 text-antique-gold" />
                    <span className="hidden sm:inline">{t("community.composer.writing_assist")}</span>
                  </span>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#1D5046] hover:bg-[#153D35] transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t("community.composer.publish")}</span>
                </button>
              </div>
            </div>

            {/* 3.2 Feed Stream Filters & Search Bar */}
            <div className="p-3 rounded-2xl bg-white border border-[#E8E2D5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-2.5">
              {/* Row A: Feed Stream View Modes (For You, Following, Latest, Trending) */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setFeedFilter("for-you")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      feedFilter === "for-you"
                        ? "bg-[#1D5046] text-white shadow-2xs"
                        : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{t("community.filters.for_you")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedFilter("following")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      feedFilter === "following"
                        ? "bg-[#1D5046] text-white shadow-2xs"
                        : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{t("community.filters.following")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedFilter("latest")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      feedFilter === "latest"
                        ? "bg-[#1D5046] text-white shadow-2xs"
                        : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t("community.filters.latest")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedFilter("trending")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      feedFilter === "trending"
                        ? "bg-[#1D5046] text-white shadow-2xs"
                        : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-antique-gold" />
                    <span>{t("community.filters.trending")}</span>
                  </button>
                </div>

                {/* Compact Search Bar */}
                <div className="relative w-40 sm:w-52 shrink-0">
                  <Search className="w-3.5 h-3.5 text-[#6E7B75] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label={t("community.filters.search_aria")}
                    placeholder={t("community.filters.search_placeholder")}
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs text-[#314F49] placeholder:text-[#6E7B75]/70 focus:outline-none focus:ring-1 focus:ring-[#1D5046] focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6E7B75] hover:text-[#1D5046] text-xs cursor-pointer"
                      aria-label={t("community.filters.clear_search")}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Row B: Cultural Topic Filter Chips */}
              <div
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-[#E8E2D5]/60"
                role="group"
                aria-label={t("community.filters.filter_topic_aria")}
              >
                {TOPIC_FILTERS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedTopic(cat.id)}
                    aria-pressed={selectedTopic === cat.id}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                      selectedTopic === cat.id
                        ? "bg-[#1D5046]/10 text-[#1D5046] font-bold border border-[#1D5046]/30"
                        : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0] border border-transparent"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3.3 Main Post Stream */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    onToggleHeart={handleToggleHeart}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenDetail={(p) => setActiveModalPost(p)}
                    onShare={() => {
                      if (!navigator.clipboard) {
                        showToast(t("community.toasts.clipboard_unavailable"));
                        return;
                      }
                      void navigator.clipboard.writeText(window.location.href)
                        .then(() => showToast(t("community.toasts.link_copied")))
                        .catch(() => showToast(t("community.toasts.copy_failed")));
                    }}
                    onSelectVocab={(v) => setActiveVocab(v)}
                    onOpenLightbox={(imgUrl, caption, title) =>
                      setLightboxData({
                        isOpen: true,
                        imageUrl: imgUrl,
                        caption,
                        title,
                      })
                    }
                    onToggleFollow={handleToggleFollow}
                    onAddComment={handleAddComment}
                    onReport={handleReportPost}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-white border border-[#E8E2D5] space-y-2.5">
                <h3 className="font-serif text-base font-bold text-[#1D5046]">
                  {t("community.post.no_posts_found")}
                </h3>
                <p className="text-xs text-[#6E7B75] max-w-sm mx-auto">
                  {t("community.post.no_posts_desc")}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopic("all");
                    setFeedFilter("for-you");
                    setSearchQuery("");
                  }}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1D5046] hover:bg-[#153D35] transition-colors"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* SUPPORTIVE SIDEBAR (~32% on Desktop: 4 cols)              */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 mt-2 lg:mt-0">
            <CommunitySidebar
              onSelectTopicTag={(tag) => setSelectedTopic(tag)}
              selectedTag={selectedTopic}
            />
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {activeModalPost && (
        <CommunityDetailModal
          post={activeModalPost}
          onClose={() => setActiveModalPost(null)}
          onToggleHeart={handleToggleHeart}
          onToggleBookmark={handleToggleBookmark}
          onAddComment={handleAddComment}
          onSelectVocab={(v) => setActiveVocab(v)}
        />
      )}

      {/* Vocabulary Definition Modal */}
      {activeVocab && (
        <VocabDefinitionModal
          vocab={activeVocab}
          onClose={() => setActiveVocab(null)}
          onSaveVocab={(v) => {
            showToast(`"${v.word}" marked in this preview only.`);
          }}
        />
      )}

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData({ isOpen: false })}
        imageUrl={lightboxData.imageUrl}
        caption={lightboxData.caption}
        title={lightboxData.title}
      />

      {/* Floating Action Button (Mobile / Quick access) */}
      <button
        type="button"
        onClick={() => {
          setIsEditorOpen(true);
          window.scrollTo({ top: 100, behavior: "smooth" });
        }}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#1D5046] text-white shadow-lg hover:bg-[#153D35] transition-all flex items-center justify-center border border-[#153D35] z-40 focus-ring cursor-pointer"
        title="Write a reflection"
        aria-label="Open reflection composer"
      >
        <Plus className="w-5 h-5 text-[#E8D7AE]" />
      </button>
    </main>
  );
}
