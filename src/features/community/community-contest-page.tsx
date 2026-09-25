import { useState } from "react";
import {
  Trophy,
  Award,
  Send,
  Heart,
  ShoppingBag,
  X,
  User,
} from "lucide-react";

interface ContestEntry {
  id: string;
  rankTag?: string;
  rankClass?: string;
  authorName: string;
  authorBadge?: string;
  authorSub: string;
  title: string;
  excerpt: string;
  votesCount: number;
  commentsCount: number;
  rewardCoins: number;
  userVoted?: boolean;
  imageCaption?: string;
}

const INITIAL_CONTEST_ENTRIES: ContestEntry[] = [
  {
    id: "entry-1",
    rankTag: "🏆 TOP 1 CHỦ ĐỀ • 💎 +500 XU",
    rankClass: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    authorName: "Trần Thanh Thảo",
    authorBadge: "🎖️ Sứ Giả Cố Đô",
    authorSub: "Thành viên tích cực • Huế, Việt Nam",
    title: "Ngọ Môn Gate: Architectural Masterpiece of Imperial Hue",
    excerpt:
      "Walking through Ngọ Môn Gate, I felt the magnificent architectural harmony calculated by royal builders. The gate stands as a symbol of intangible pride passed down to generations...",
    votesCount: 142,
    commentsCount: 28,
    rewardCoins: 100,
    imageCaption: "600X300 - User Photo: Ngọ Môn Gate Sunrise",
  },
  {
    id: "entry-2",
    rankTag: "🥈 TOP 2 CHỦ ĐỀ • 💎 +300 XU",
    rankClass: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]",
    authorName: "Kenji Sato",
    authorSub: "Người học quốc tế • Tokyo, Japan",
    title: "Discovering Ancient Craftsmen of Old Citadel",
    excerpt:
      "Ancient artisans promulgated traditional wood carving skills. They preserved a living fortress of Vietnamese art heritage...",
    votesCount: 98,
    commentsCount: 14,
    rewardCoins: 100,
    imageCaption: "Wood Carving Detail • Hue Citadel",
  },
];

export default function Community2Page() {
  const [userCoins, setUserCoins] = useState<number>(450);
  const [entries, setEntries] = useState<ContestEntry[]>(INITIAL_CONTEST_ENTRIES);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [entryTitle, setEntryTitle] = useState<string>("");
  const [entryText, setEntryText] = useState<string>("");
  const [selectedVocab, setSelectedVocab] = useState<Record<string, boolean>>({
    architectural: true,
    intangible: true,
    fortress: true,
  });

  // Vote Button Toggle
  const handleVote = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          const voted = entry.userVoted;
          return {
            ...entry,
            userVoted: !voted,
            votesCount: voted ? entry.votesCount - 1 : entry.votesCount + 1,
          };
        }
        return entry;
      })
    );
  };

  // Redeem Gamification Shop Item
  const handleRedeem = (itemName: string, cost: number) => {
    if (userCoins < cost) {
      alert(`⚠️ Bạn cần ${cost} Xu 💎 để đổi quà này (Ví hiện có: ${userCoins} Xu). Hãy viết bài tham gia thử thách để tích lũy thêm!`);
      return;
    }
    setUserCoins((prev) => prev - cost);
    alert(`🎉 Chúc mừng! Bạn đã đổi thành công "${itemName}" với ${cost} Xu 💎! Tính năng đã được mở khóa cho tài khoản của bạn.`);
  };

  // Submit Contest Entry
  const handleSubmitEntry = () => {
    if (!entryTitle.trim() || !entryText.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung bài dự thi của bạn!");
      return;
    }

    const newEntry: ContestEntry = {
      id: `entry-${Date.now()}`,
      authorName: "Học Viên VieCultures",
      authorBadge: "🎖️ Thành viên tham gia",
      authorSub: "Vừa tham gia thử thách",
      title: entryTitle,
      excerpt: entryText,
      votesCount: 1,
      commentsCount: 0,
      rewardCoins: 100,
      userVoted: true,
      imageCaption: "Ảnh bài dự thi đính kèm",
    };

    setEntries([newEntry, ...entries]);
    setUserCoins((prev) => prev + 100);
    setEntryTitle("");
    setEntryText("");
    setIsFormOpen(false);
    alert("🎉 Chúc mừng! Bạn đã gửi bài thành công và nhận ngay +100 Xu Văn Hóa 💎!");
  };

  return (
    <main className="min-h-screen bg-[#FBF7EE] text-[#3F5550] relative selection:bg-[#BFE3EA] selection:text-[#1E4B43]">

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Weekly Themed Challenge Spotlight Banner */}
        <section className="mb-10 rounded-3xl bg-gradient-to-br from-[#16221F] via-[#1E4B43] to-[#143630] text-[#FBF7EE] p-8 sm:p-12 border-2 border-[#D9B76A]/60 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Particle Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9B76A]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9B76A] text-[#1E4B43] text-xs font-bold uppercase tracking-wider shadow-sm">
              <Trophy className="w-3.5 h-3.5 fill-current" />
              Thử Thách Viết Theo Chủ Đề • Tuần 14/2026
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[#FBF7EE]">
              Chủ Đề Tuần Này: "Kiến Trúc & Di Sản Cố Đô Huế"
              <span className="block text-lg sm:text-xl font-normal text-[#BFE3EA] mt-1 font-sans">
                (Imperial Hue Architecture & Heritage Challenge)
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#F6EEDC]/90 leading-relaxed max-w-3xl">
              Viết bài viết ngắn (100 – 300 từ) bằng tiếng Anh chia sẻ góc nhìn hoặc kỷ niệm của bạn về di sản Huế, ứng dụng ít nhất 3 từ vựng vừa học để tích lũy <strong className="text-[#D9B76A]">Xu Văn Hóa 💎</strong> và mở khóa tính năng độc quyền!
            </p>

            {/* Prize Pool & Timer Box */}
            <div className="p-5 rounded-2xl bg-[#FBF7EE]/10 border border-[#D9B76A]/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 my-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
                  🎁 Phần thưởng Gamification tuần này:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-[#FBF7EE]/20 border border-white/20">
                    💎 +100 Xu cho bài tham gia
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#D9B76A]/30 border border-[#D9B76A]/50 text-[#FBF7EE]">
                    💎 +500 Xu cho Top 3
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#E8B7B2]/30 border border-[#E8B7B2]/40 text-[#FBF7EE]">
                    🎖️ Huy hiệu "Sứ Giả Cố Đô"
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-[#BFE3EA] block">
                  ⏱️ Thời gian chủ đề:
                </span>
                <span className="text-sm font-bold text-[#FBF7EE]">
                  Còn 04 ngày để gửi bài & tích xu
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  setIsFormOpen(true);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="px-7 py-3.5 rounded-full text-xs font-bold text-[#1E4B43] bg-[#D9B76A] hover:bg-[#c9a657] shadow-lg transition-all border border-[#FBF7EE]/40 flex items-center gap-2"
              >
                <span>✍️ + Viết Bài Tham Gia (Nhận ngay +100 Xu 💎)</span>
              </button>

              <a
                href="#gamification-shop"
                className="px-6 py-3.5 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#FBF7EE]/10 hover:bg-[#FBF7EE]/20 border border-white/30 transition-all flex items-center gap-2"
              >
                <span>🛍️ Đổi Xu Mở Khóa Chức Năng</span>
              </a>
            </div>
          </div>
        </section>

        {/* Submit Entry Form (Toggleable) */}
        {isFormOpen && (
          <div className="mb-10 p-8 sm:p-10 rounded-3xl bg-[#F6EEDC] border-2 border-[#D9B76A]/60 shadow-xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(30,75,67,0.12)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                  🎁 Hoàn thành bài viết nhận ngay +100 Xu 💎
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#1E4B43] mt-0.5">
                  Gửi Bài Viết Theo Chủ Đề Tuần Này
                </h2>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#E8DFCB] text-[#1E4B43] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1E4B43] uppercase mb-1.5">
                  Góc nhìn bài viết:
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.15)] text-xs font-bold text-[#1E4B43] focus:outline-none">
                  <option>🏛️ Cảm Nhận Kiến Trúc & Di Sản (Architecture & Heritage)</option>
                  <option>📸 Kỷ Niệm Chuyến Đi & Ảnh Đẹp (Travel Photo Story)</option>
                  <option>🏮 Lịch Sử & Lễ Hội Cố Đô (History & Customs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E4B43] uppercase mb-1.5">
                  Tiêu đề bài viết:
                </label>
                <input
                  type="text"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  placeholder="Nhập tiêu đề cho bài viết của bạn..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.15)] text-xs font-bold text-[#1E4B43] focus:outline-none"
                />
              </div>
            </div>

            {/* Vocab Checklist */}
            <div className="p-4 rounded-2xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.10)] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6E7E79] block">
                Đánh dấu các từ vựng bạn đưa vào bài (Ứng dụng 3+ từ để nhận thưởng Xu):
              </span>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-[#1E4B43]">
                {["architectural", "intangible", "promulgated", "fortress", "geomancy"].map(
                  (word) => (
                    <label key={word} className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selectedVocab[word]}
                        onChange={(e) =>
                          setSelectedVocab({
                            ...selectedVocab,
                            [word]: e.target.checked,
                          })
                        }
                        className="accent-[#1E4B43] w-4 h-4 rounded"
                      />
                      <span>{word}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
              placeholder="Chia sẻ suy nghĩ hoặc câu chuyện của bạn bằng tiếng Anh..."
              className="w-full h-36 p-4 rounded-2xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.15)] text-sm text-[#1E4B43] focus:outline-none focus:ring-2 focus:ring-[#1E4B43]/20 leading-relaxed"
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#6E7E79] italic">
                🌟 Không áp lực ngữ pháp • Khuyến khích thực hành từ vựng tự nhiên
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[#1E4B43] bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] hover:bg-[#E8DFCB]"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitEntry}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-[#FBF7EE] bg-[#1E4B43] hover:bg-[#163D37] shadow-sm border border-[#D9B76A]/60 inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#D9B76A]" />
                  <span>🚀 Đăng Bài (+100 Xu 💎)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Layout: Main Feed (2/3) + Gamification Shop & Rewards Sidebar (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 8 Cols: Submissions Showcase */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-[#1E4B43]">
                Bài Viết Nổi Bật Theo Chủ Đề Tuần Này
              </h2>

              <div className="flex items-center gap-1 bg-[#F6EEDC] p-1 rounded-xl border border-[rgba(30,75,67,0.12)] text-xs font-bold">
                <button className="px-3 py-1.5 rounded-lg bg-[#1E4B43] text-[#FBF7EE]">
                  🔥 Yêu thích nhất
                </button>
                <button className="px-3 py-1.5 rounded-lg text-[#1E4B43] hover:bg-[#E8DFCB]">
                  ⭐ Mới đăng
                </button>
              </div>
            </div>

            {entries.map((entry) => (
              <article
                key={entry.id}
                className="relative p-6 sm:p-8 rounded-3xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] shadow-md space-y-4"
              >
                {/* Rank Tag if available */}
                {entry.rankTag && (
                  <span
                    className={`absolute top-6 right-6 px-3.5 py-1 rounded-full text-xs font-bold border ${entry.rankClass}`}
                  >
                    {entry.rankTag}
                  </span>
                )}

                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#1E4B43] text-[#D9B76A] font-bold text-sm flex items-center justify-center border border-[#D9B76A]">
                    <User className="w-5 h-5 text-[#D9B76A]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#1E4B43]">
                        {entry.authorName}
                      </h4>
                      {entry.authorBadge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                          {entry.authorBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#6E7E79] font-medium">
                      {entry.authorSub}
                    </span>
                  </div>
                </div>

                {/* Entry Title & Excerpt */}
                <h3 className="font-serif text-xl font-bold text-[#1E4B43] leading-snug">
                  "{entry.title}"
                </h3>
                <p className="text-sm text-[#3F5550] leading-relaxed">
                  {entry.excerpt}
                </p>

                {/* Image Placeholder */}
                <div className="h-52 w-full rounded-2xl bg-gradient-to-br from-[#1E4B43] via-[#2A665B] to-[#D9B76A] p-6 text-white flex flex-col justify-between overflow-hidden shadow-inner border border-[#D9B76A]/30">
                  <div className="text-xs font-semibold text-[#D9B76A] uppercase">
                    Photo Entry
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-3xl block mb-1">📸🏛️</span>
                    <span className="font-serif text-sm font-bold text-[#FBF7EE]">
                      {entry.imageCaption}
                    </span>
                  </div>
                </div>

                {/* Footer Vote Action */}
                <div className="pt-4 border-t border-[rgba(30,75,67,0.10)] flex items-center justify-between">
                  <button
                    onClick={() => handleVote(entry.id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold border transition-all ${
                      entry.userVoted
                        ? "bg-[#DC2626] text-white border-[#DC2626] shadow-sm"
                        : "bg-[#FBF7EE] text-[#1E4B43] border-[rgba(30,75,67,0.2)] hover:bg-[#FEF2F2] hover:border-[#DC2626]"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${entry.userVoted ? "fill-white" : ""}`} />
                    <span>{entry.userVoted ? "❤️ Đã thích bài" : "❤️ Thả tim thích bài"}</span>
                    <strong>({entry.votesCount})</strong>
                  </button>

                  <div className="text-xs font-semibold text-[#6E7E79] flex items-center gap-4">
                    <span>💬 {entry.commentsCount} Bình luận</span>
                    <span className="text-[#059669]">🎁 +100 Xu tích lũy</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right 4 Cols: Gamification Shop & Milestones */}
          <div className="lg:col-span-4 space-y-6">
            {/* Gamification Shop Card */}
            <div
              id="gamification-shop"
              className="p-6 rounded-3xl bg-[#F6EEDC] border border-[rgba(30,75,67,0.12)] space-y-5 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[rgba(30,75,67,0.10)]">
                <h3 className="font-serif text-base font-bold text-[#1E4B43] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#D9B76A]" />
                  Cửa Hàng Xu & Đổi Quà
                </h3>
                <span className="text-xs font-bold text-[#059669]">
                  Ví: 💎 {userCoins} Xu
                </span>
              </div>

              {/* Item 1 */}
              <div className="space-y-1.5 pb-3 border-b border-[rgba(30,75,67,0.10)]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1E4B43]">
                    🎧 Giọng Đọc AI Premium
                  </h4>
                  <button
                    onClick={() => handleRedeem("Giọng Đọc Premium", 300)}
                    className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#1E4B43] text-[#FBF7EE] hover:bg-[#163D37]"
                  >
                    💎 300 Xu
                  </button>
                </div>
                <p className="text-[11px] text-[#6E7E79]">
                  Mở khóa giọng đọc bản ngữ chuẩn Anh - Mỹ cho toàn bộ bài học.
                </p>
              </div>

              {/* Item 2 */}
              <div className="space-y-1.5 pb-3 border-b border-[rgba(30,75,67,0.10)]">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1E4B43]">
                    🎨 Giao Diện Paper Vintage Theme
                  </h4>
                  <button
                    onClick={() => handleRedeem("Giao Diện Paper Theme", 400)}
                    className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#1E4B43] text-[#FBF7EE] hover:bg-[#163D37]"
                  >
                    💎 400 Xu
                  </button>
                </div>
                <p className="text-[11px] text-[#6E7E79]">
                  Theme giấy da ngà hoài cổ sang trọng cho giao diện Reader.
                </p>
              </div>

              {/* Item 3 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1E4B43]">
                    🎖️ Huy Hiệu "Cây Bút Di Sản"
                  </h4>
                  <button
                    onClick={() => handleRedeem("Huy hiệu Cây Bút Di Sản", 200)}
                    className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#1E4B43] text-[#FBF7EE] hover:bg-[#163D37]"
                  >
                    💎 200 Xu
                  </button>
                </div>
                <p className="text-[11px] text-[#6E7E79]">
                  Huy hiệu đặc biệt hiển thị trên trang Profile và góc bình luận.
                </p>
              </div>
            </div>

            {/* Milestones Card */}
            <div className="p-6 rounded-3xl bg-[#FBF7EE] border border-[rgba(30,75,67,0.12)] space-y-4 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#1E4B43] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D9B76A]" />
                Nhiệm Vụ & Cột Mốc Tích Xu
              </h3>

              <ul className="text-xs space-y-3">
                <li className="flex items-center justify-between pb-2 border-b border-[rgba(30,75,67,0.10)]">
                  <span>✍️ Viết 1 bài theo chủ đề tuần</span>
                  <strong className="text-[#059669]">+100 Xu 💎</strong>
                </li>
                <li className="flex items-center justify-between pb-2 border-b border-[rgba(30,75,67,0.10)]">
                  <span>❤️ Bài viết đạt 10+ lượt thích</span>
                  <strong className="text-[#059669]">+150 Xu 💎</strong>
                </li>
                <li className="flex items-center justify-between">
                  <span>🔥 Tham gia 4 tuần liên tiếp</span>
                  <strong className="text-[#D97706]">+500 Xu & Badge 🎖️</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (+ Write Contest Entry) */}
      <button
        onClick={() => {
          setIsFormOpen(true);
          window.scrollTo({ top: 380, behavior: "smooth" });
        }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#1E4B43] text-[#FBF7EE] font-bold text-xl shadow-xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-[#D9B76A] z-40"
        title="Viết bài dự thi chủ đề tuần"
      >
        ✍️
      </button>
    </main>
  );
}
