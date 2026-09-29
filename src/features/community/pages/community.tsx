import { useState, useMemo } from "react";
import type { CommunityPost } from "../types";
import { CommunityHeader } from "../components/CommunityHeader";
import { CommunityPostEditor } from "../components/CommunityPostEditor";
import { CommunityPostCard } from "../components/CommunityPostCard";
import { CommunitySidebar } from "../components/CommunitySidebar";
import { CommunityDetailModal } from "../components/CommunityDetailModal";
import { Search, Filter, Sparkles, MessageSquare, Plus, Check } from "lucide-react";

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorName: "Minh Anh",
    authorRole: "Cultural Ambassador",
    avatarText: "MA",
    timeAgo: "2 giờ trước",
    lessonTag: "Imperial Hue",
    topicCategory: "architecture",
    title: "Ngọ Môn Gate & The Royal Geometry of Citadel",
    contentEn:
      "Visiting the Ngọ Môn Gate last summer made me appreciate the architectural wisdom of our ancestors. Standing in front of the gate, I felt deeply connected to the intangible heritage passed down through generations.",
    highlightWords: [
      { word: "architectural", ipa: "/ˌɑːkɪˈtek.tʃər.əl/", meaning: "thuộc kiến trúc" },
      { word: "intangible", ipa: "/ɪnˈtæn.dʒə.bəl/", meaning: "phi vật thể" },
    ],
    heartsCount: 24,
    commentsCount: 3,
    imageCaption: "Ngọ Môn Gate Sunrise • Imperial Citadel Hue",
    imageBgGradient: "from-emerald-900 via-teal-800 to-amber-700",
    comments: [
      {
        id: "c-1",
        authorName: "Kenji Sato",
        avatarText: "KS",
        timeAgo: "1 giờ trước",
        text: "The symmetry of the Hue Citadel architecture is truly breathtaking!",
      },
      {
        id: "c-2",
        authorName: "Lê Thu Hà",
        avatarText: "TH",
        timeAgo: "30 phút trước",
        text: "Your English expression is so vivid and evocative, Minh Anh!",
      },
    ],
  },
  {
    id: "post-2",
    authorName: "Daniel Krauss",
    authorRole: "International Learner",
    avatarText: "DK",
    timeAgo: "5 giờ trước",
    lessonTag: "Saigon Bánh Mì",
    topicCategory: "cuisine",
    title: "How French Baguettes Evolved into Saigon Street Identity",
    contentEn:
      "I loved learning how the bánh mì baguettes evolved from French culinary influence into a uniquely Vietnamese street food staple. Exploring culinary history through bilingual stories makes vocabulary stick so much faster!",
    highlightWords: [
      { word: "culinary", ipa: "/ˈkʌl.ɪ.nər.i/", meaning: "thuộc ẩm thực" },
      { word: "evolved", ipa: "/ɪˈvɒlvd/", meaning: "tiến hóa, phát triển" },
    ],
    heartsCount: 18,
    commentsCount: 2,
    imageCaption: "Traditional Street Bánh Mì Stall • Saigon",
    imageBgGradient: "from-amber-900 via-yellow-800 to-amber-700",
    comments: [
      {
        id: "c-3",
        authorName: "Phạm Hải Đăng",
        avatarText: "HĐ",
        timeAgo: "3 giờ trước",
        text: "Next time you must try bánh mì xíu mại in Da Lat too!",
      },
    ],
  },
  {
    id: "post-3",
    authorName: "Lê Thu Hà",
    authorRole: "Cultural Ambassador",
    avatarText: "TH",
    timeAgo: "1 ngày trước",
    lessonTag: "Hội An Lanterns",
    topicCategory: "festivals",
    title: "Silk Lanterns Illuminating the Thu Bồn River",
    contentEn:
      "Attending the full moon lantern festival on the Thu Bồn River was unforgettable. The vibrant silk craftsmanship reflecting on the river waters brought our heritage reading lessons to life.",
    highlightWords: [
      { word: "vibrant", ipa: "/ˈvaɪ.brənt/", meaning: "rực rỡ, sống động" },
      { word: "craftsmanship", ipa: "/ˈkrɑːfts.mən.ʃɪp/", meaning: "tay nghề thủ công" },
    ],
    heartsCount: 31,
    commentsCount: 4,
    imageCaption: "Thu Bồn River Full Moon Lanterns • Hội An",
    imageBgGradient: "from-rose-900 via-amber-800 to-orange-900",
    comments: [
      {
        id: "c-4",
        authorName: "Minh Anh",
        avatarText: "MA",
        timeAgo: "18 giờ trước",
        text: "Hội An at night feels like stepping right into a fairy tale.",
      },
    ],
  },
];

const CATEGORIES = [
  { id: "all", label: "Tất Cả Bài Viết" },
  { id: "Imperial Hue", label: "Cố Đô Huế" },
  { id: "Saigon Bánh Mì", label: "Ẩm Thực Sài Gòn" },
  { id: "Hội An Lanterns", label: "Phố Cổ Hội An" },
  { id: "my-posts", label: "Bài Của Tôi" },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>("");
  const [reflectionText, setReflectionText] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("Imperial Hue");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalPost, setActiveModalPost] = useState<CommunityPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Toggle Heart Like
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
              ? "Đã lưu bài viết vào danh sách yêu thích!"
              : "Đã gỡ bài viết khỏi danh sách lưu."
          );
          return updated;
        }
        return post;
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: "Bạn (Sứ Giả)",
      avatarText: "ME",
      timeAgo: "Vừa xong",
      text,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const updatedComments = [...(post.comments || []), newComment];
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
    showToast("Đã đăng bình luận thành công!");
  };

  // Publish New Reflection
  const handlePublish = () => {
    if (!reflectionText.trim()) {
      alert("Vui lòng nhập nội dung bài cảm nhận của bạn!");
      return;
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: "Học Viên VieCultures",
      authorRole: "Cultural Ambassador",
      avatarText: "HV",
      timeAgo: "Vừa xong",
      lessonTag: selectedLesson,
      topicCategory: "general",
      title: postTitle.trim() || `Cảm nhận về ${selectedLesson}`,
      contentEn: reflectionText.trim(),
      highlightWords: [],
      heartsCount: 1,
      commentsCount: 0,
      userLiked: true,
      imageCaption: `Ảnh di sản đính kèm • ${selectedLesson}`,
      imageBgGradient: "from-teal-900 via-emerald-800 to-amber-800",
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setPostTitle("");
    setReflectionText("");
    setIsEditorOpen(false);
    showToast("Bài viết cảm nhận của bạn đã được đăng thành công!");
  };

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      if (selectedCategory === "my-posts") {
        if (post.authorName !== "Học Viên VieCultures" && post.authorName !== "Bạn (Sứ Giả)") {
          return false;
        }
      } else if (selectedCategory !== "all" && post.lessonTag !== selectedCategory) {
        return false;
      }

      // Search query filter
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
  }, [posts, selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-surface text-text-body relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-heritage-green text-warm-ivory shadow-xl border border-antique-gold/40 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-antique-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Page Title & View Switcher */}
        <CommunityHeader
          isEditorOpen={isEditorOpen}
          onToggleEditor={() => setIsEditorOpen((prev) => !prev)}
          activeTab="reflections"
        />

        {/* Reflection Editor (Toggleable) */}
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

        {/* Filter Toolbar & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer focus-ring ${
                  selectedCategory === cat.id
                    ? "bg-heritage-green text-warm-ivory shadow-sm"
                    : "bg-rice-paper text-heritage-green hover:bg-mist-cloud border border-line"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo chủ đề, từ khóa, tác giả..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-surface border border-line text-xs text-heritage-green placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
            />
          </div>
        </div>

        {/* Layout: Feed (8/12) + Sidebar (4/12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-2">
              <h2 className="font-serif text-xl font-bold text-heritage-green flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-antique-gold" />
                <span>Bài Viết Cảm Nhận Từ Cộng Đồng ({filteredPosts.length})</span>
              </h2>
            </div>

            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onToggleHeart={handleToggleHeart}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenDetail={(p) => setActiveModalPost(p)}
                  onShare={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast("Đã sao chép liên kết bài viết!");
                  }}
                />
              ))
            ) : (
              <div className="p-12 text-center rounded-3xl bg-surface border border-line space-y-3">
                <MessageSquare className="w-8 h-8 text-text-secondary/40 mx-auto" />
                <h3 className="font-serif text-base font-bold text-heritage-green">
                  Chưa tìm thấy bài viết phù hợp
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Viết Bài Cảm Nhận" để trở thành người đầu tiên chia sẻ về chủ đề này!
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <CommunitySidebar
              onSelectTopicTag={(tag) => setSelectedCategory(tag)}
              selectedTag={selectedCategory}
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
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setIsEditorOpen(true);
          window.scrollTo({ top: 120, behavior: "smooth" });
        }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-antique-gold z-40 focus-ring cursor-pointer"
        title="Viết bài cảm nhận"
        aria-label="Mở trình soạn bài cảm nhận"
      >
        <Plus className="w-6 h-6 text-antique-gold" />
      </button>
    </main>
  );
}
