import { useState } from "react";
import type { CommunityPost } from "../types";
import { CommunityHeader } from "../components/CommunityHeader";
import { CommunityPostEditor } from "../components/CommunityPostEditor";
import { CommunityPostCard } from "../components/CommunityPostCard";
import { CommunitySidebar } from "../components/CommunitySidebar";

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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Page Title & Action Row */}
        <CommunityHeader
          isEditorOpen={isEditorOpen}
          onToggleEditor={() => setIsEditorOpen((prev) => !prev)}
        />

        {/* Reflection Editor (Toggleable) */}
        <CommunityPostEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          selectedLesson={selectedLesson}
          onChangeLesson={setSelectedLesson}
          reflectionText={reflectionText}
          onChangeReflectionText={setReflectionText}
          onPublish={handlePublish}
        />

        {/* Layout: Feed (8/12) + Sidebar (4/12) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Feed Column */}
          <div className="md:col-span-8 space-y-6">
            <h2 className="font-serif text-xl font-bold text-heritage-green mb-4">
              Bài Viết Cảm Nhận Mới Nhất Từ Cộng Đồng
            </h2>

            {posts.map((post) => (
              <CommunityPostCard
                key={post.id}
                post={post}
                onToggleHeart={handleToggleHeart}
              />
            ))}
          </div>

          {/* Right Sidebar */}
          <CommunitySidebar />
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setIsEditorOpen(true);
          window.scrollTo({ top: 120, behavior: "smooth" });
        }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-heritage-green text-warm-ivory font-bold text-2xl shadow-xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-antique-gold z-40 focus-ring cursor-pointer"
        title="Viết bài cảm nhận"
        aria-label="Mở trình soạn bài cảm nhận"
      >
        +
      </button>
    </main>
  );
}
