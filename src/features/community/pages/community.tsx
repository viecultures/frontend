import { useState } from "react";
import Link from "@/components/Link";
import {
  MessageSquare,
  Plus,
  Heart,
  Send,
  X,
  ShieldCheck,
  Award,
} from "lucide-react";

interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  avatarText: string;
  timeAgo: string;
  lessonTag: string;
  contentEn: string;
  highlightWords: string[];
  heartsCount: number;
  userLiked?: boolean;
  imageCaption?: string;
  imageBgGradient?: string;
}

const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorName: "Minh Anh",
    authorRole: "Cultural Ambassador",
    avatarText: "MA",
    timeAgo: "2 giờ trước",
    lessonTag: "Lesson: Imperial Hue",
    contentEn:
      "Visiting the Ngọ Môn Gate last summer made me appreciate the architectural wisdom of my ancestors. Standing in front of the gate, I felt deeply connected to the intangible heritage passed down through generations.",
    highlightWords: ["architectural", "intangible"],
    heartsCount: 24,
    imageCaption: "Ngọ Môn Gate Sunrise • Imperial Citadel Hue",
    // gradient data strings — giữ nguyên hex vì đây là value CSS gradient, không phải class
    imageBgGradient: "from-[#1E4B43] via-[#2A665B] to-[#D9B76A]",
  },
  {
    id: "post-2",
    authorName: "Daniel Krauss",
    authorRole: "International Learner",
    avatarText: "DK",
    timeAgo: "5 giờ trước",
    lessonTag: "Lesson: Saigon Bánh Mì",
    contentEn:
      "I loved learning how the bánh mì baguettes evolved from French influence into a uniquely Vietnamese street food staple. Exploring culinary history through bilingual stories makes vocabulary stick so much faster!",
    highlightWords: ["culinary", "evolved"],
    heartsCount: 18,
    imageCaption: "Traditional Street Bánh Mì Stall • Saigon",
    imageBgGradient: "from-[#C59B48] via-[#A87E2D] to-[#78571B]",
  },
  {
    id: "post-3",
    authorName: "Lê Thu Hà",
    authorRole: "Cultural Ambassador",
    avatarText: "TH",
    timeAgo: "1 ngày trước",
    lessonTag: "Lesson: Hội An Lanterns",
    contentEn:
      "Attending the full moon lantern festival on the Thu Bồn River was unforgettable. The vibrant silk craftsmanship reflecting on the river waters brought our heritage reading lessons to life.",
    highlightWords: ["vibrant", "craftsmanship"],
    heartsCount: 31,
    imageCaption: "Thu Bồn River Full Moon Lanterns • Hội An",
    imageBgGradient: "from-[#E8B7B2] via-[#D69690] to-[#B86E67]",
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [reflectionText, setReflectionText] = useState<string>("");
  const [selectedLesson, setSelectedLesson] = useState<string>("Imperial Hue");

  // Toggle Heart Like
  const handleToggleHeart = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const isLiked = post.userLiked;
          return {
            ...post,
            userLiked: !isLiked,
            heartsCount: isLiked ? post.heartsCount - 1 : post.heartsCount + 1,
          };
        }
        return post;
      })
    );
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
      lessonTag: `Lesson: ${selectedLesson}`,
      contentEn: reflectionText,
      highlightWords: [],
      heartsCount: 1,
      userLiked: true,
      imageCaption: `Ảnh đính kèm • ${selectedLesson}`,
      imageBgGradient: "from-[#1E4B43] via-[#336F64] to-[#143630]",
    };

    setPosts([newPost, ...posts]);
    setReflectionText("");
    setIsEditorOpen(false);
    alert("🎉 Bài viết cảm nhận của bạn đã được xuất bản thành công!");
  };

  return (
    <main className="min-h-screen bg-surface text-text-body relative">

      {/* ── Main Container ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">

        {/* Page Title & Action Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-line">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rice-paper text-xs font-bold text-heritage-green border border-antique-gold/50 mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />
              <span>Community 1: Member Reflections</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-heritage-green tracking-tight">
              Cultural Ambassador Reflections
            </h1>
            <p className="text-sm text-text-body mt-2 max-w-2xl leading-relaxed">
              Không gian tự do chia sẻ cảm nhận bằng tiếng Anh dựa trên từ vựng vừa học. Không chấm điểm, không áp lực ngữ pháp đỏ.
            </p>
          </div>

          <button
            onClick={() => setIsEditorOpen((prev) => !prev)}
            aria-expanded={isEditorOpen}
            aria-controls="reflection-editor"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 transition-all focus-ring"
          >
            <Plus className="w-4 h-4 text-antique-gold" />
            <span>Viết Bài Cảm Nhận (Write Reflection)</span>
          </button>
        </div>

        {/* ── Reflection Editor (Toggleable) ─────────────────────────────── */}
        {isEditorOpen && (
          <div
            id="reflection-editor"
            className="mb-10 p-8 rounded-3xl bg-rice-paper border-2 border-antique-gold/60 shadow-xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div>
                <h2 className="font-serif text-xl font-bold text-heritage-green">
                  Viết Bài Cảm Nhận Văn Hóa Của Bạn
                </h2>
                <span className="text-xs text-text-secondary">
                  Ứng dụng từ vựng bài đọc để viết bài nhận xét ngắn tự nhiên.
                </span>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1.5 rounded-full hover:bg-mist-cloud text-heritage-green transition-colors focus-ring"
                aria-label="Đóng trình soạn bài"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lesson Selector */}
            <div>
              <label htmlFor="lesson-select" className="block text-xs font-bold text-heritage-green uppercase mb-2">
                Bài học liên quan:
              </label>
              <select
                id="lesson-select"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="w-full md:w-72 px-4 py-2.5 rounded-xl bg-surface border border-heritage-green/15 text-xs font-bold text-heritage-green focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
              >
                <option value="Imperial Hue">Imperial Hue Architecture</option>
                <option value="Saigon Bánh Mì">Saigon Bánh Mì History</option>
                <option value="Hội An Lanterns">Hội An Lantern Festival</option>
                <option value="Bát Tràng Pottery">Bát Tràng Pottery Arts</option>
                <option value="Egg Coffee">Vietnamese Egg Coffee</option>
              </select>
            </div>

            {/* Textarea */}
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Chia sẻ kỷ niệm hoặc suy nghĩ của bạn bằng tiếng Anh..."
              className="w-full h-36 p-4 rounded-2xl bg-surface border border-heritage-green/15 text-sm text-heritage-green focus:outline-none focus:ring-2 focus:ring-antique-gold/40 leading-relaxed"
              aria-label="Nội dung bài cảm nhận"
            />

            {/* Editor Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-text-secondary italic">
                💡 Viết tự do theo suy nghĩ của bạn • Khuyến khích chèn từ vựng bài đọc
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-surface border border-line hover:bg-mist-cloud transition-colors focus-ring"
                >
                  Hủy
                </button>
                <button
                  onClick={handlePublish}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm border border-antique-gold/60 inline-flex items-center gap-1.5 transition-all focus-ring"
                >
                  <Send className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Đăng Bài Cảm Nhận</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Layout: Feed (8/12) + Sidebar (4/12) ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-serif text-xl font-bold text-heritage-green mb-4">
              Bài Viết Cảm Nhận Mới Nhất Từ Cộng Đồng
            </h2>

            {posts.map((post) => (
              <article
                key={post.id}
                className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-[0_4px_20px_-4px_rgba(30,75,67,0.06)] hover:shadow-md transition-all space-y-5"
              >
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
                  <div className="absolute inset-2 border border-antique-gold/30 rounded-xl pointer-events-none" aria-hidden="true" />
                  <div className="text-xs font-semibold text-antique-gold uppercase tracking-wider">
                    Member Photo Attachment
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-4xl block mb-1" aria-hidden="true">📸🏛️</span>
                    <span className="font-serif text-sm font-bold text-warm-ivory">
                      {post.imageCaption}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleHeart(post.id)}
                    aria-label={`${post.userLiked ? "Bỏ thích" : "Thích"} bài viết của ${post.authorName}`}
                    aria-pressed={post.userLiked}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all focus-ring ${
                      post.userLiked
                        ? "bg-red-50 text-red-600 border border-red-200 shadow-sm"
                        : "bg-rice-paper text-heritage-green hover:bg-mist-cloud"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${post.userLiked ? "fill-red-500 text-red-500" : ""}`}
                    />
                    <span>{post.heartsCount} Thả tim</span>
                  </button>

                  <button className="text-text-secondary hover:text-heritage-green font-semibold focus-ring rounded">
                    Báo cáo bài viết
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">

            {/* Guidelines Card */}
            <div className="p-6 rounded-3xl bg-rice-paper border border-line space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-heritage-green" aria-hidden="true" />
                <h3 className="font-serif text-base font-bold text-heritage-green">
                  Quy Tắc Cộng Đồng VieCultures
                </h3>
              </div>
              <ul className="text-xs text-text-body space-y-2.5 list-disc list-inside leading-relaxed">
                <li>Tự do diễn đạt suy nghĩ bằng tiếng Anh mà không sợ lỗi ngữ pháp.</li>
                <li>Tôn trọng sự đa dạng văn hóa và góc nhìn cá nhân của các học viên khác.</li>
                <li>Khuyến khích thực hành sử dụng các từ vựng mới học vào ngữ cảnh bài viết.</li>
              </ul>
            </div>

            {/* Contest Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-heritage-green via-[#2A665B] to-heritage-dark text-warm-ivory border border-antique-gold/40 space-y-4 shadow-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-antique-gold text-heritage-dark text-[11px] font-bold uppercase">
                <Award className="w-3.5 h-3.5" aria-hidden="true" />
                Community 2
              </div>
              <h3 className="font-serif text-lg font-bold text-warm-ivory leading-snug">
                Thử Thách Viết Theo Chủ Đề Tuần & Tích Xu 💎
              </h3>
              <p className="text-xs text-sky-mist leading-relaxed">
                Tham gia viết bài theo chủ đề tuần để tích lũy Xu Văn Hóa 💎 và đổi các phần thưởng độc quyền trong Cửa Hàng!
              </p>
              <Link
                href="/community-2"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-heritage-dark bg-warm-ivory hover:bg-rice-paper border border-antique-gold shadow-sm transition-all w-full focus-ring"
              >
                <span>Xem Thử Thách Tuần (Contest Hub)</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ── Floating Action Button ──────────────────────────────────────── */}
      <button
        onClick={() => {
          setIsEditorOpen(true);
          window.scrollTo({ top: 120, behavior: "smooth" });
        }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-heritage-green text-warm-ivory font-bold text-2xl shadow-xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-antique-gold z-40 focus-ring"
        title="Viết bài cảm nhận"
        aria-label="Mở trình soạn bài cảm nhận"
      >
        +
      </button>

    </main>
  );
}
