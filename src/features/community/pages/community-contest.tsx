import { useState } from "react";
import type { ContestEntry } from "../types";
import {
  ContestHeroBanner,
  ContestEntryEditor,
  ContestEntryCard,
  GamificationShopCard,
  GamificationMilestonesCard,
} from "../components";

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
      alert(
        `⚠️ Bạn cần ${cost} Xu 💎 để đổi quà này (Ví hiện có: ${userCoins} Xu). Hãy viết bài tham gia thử thách để tích lũy thêm!`
      );
      return;
    }
    setUserCoins((prev) => prev - cost);
    alert(
      `🎉 Chúc mừng! Bạn đã đổi thành công "${itemName}" với ${cost} Xu 💎! Tính năng đã được mở khóa cho tài khoản của bạn.`
    );
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
    <main className="min-h-screen bg-warm-ivory text-text-body relative selection:bg-sky-mist selection:text-heritage-green">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Weekly Themed Challenge Spotlight Banner */}
        <ContestHeroBanner
          onOpenForm={() => {
            setIsFormOpen(true);
            window.scrollTo({ top: 400, behavior: "smooth" });
          }}
        />

        {/* Submit Entry Form (Toggleable) */}
        <ContestEntryEditor
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          entryTitle={entryTitle}
          onChangeTitle={setEntryTitle}
          entryText={entryText}
          onChangeText={setEntryText}
          selectedVocab={selectedVocab}
          onToggleVocab={(word, checked) =>
            setSelectedVocab((prev) => ({ ...prev, [word]: checked }))
          }
          onSubmit={handleSubmitEntry}
        />

        {/* Layout: Main Feed (8/12) + Shop/Milestones Sidebar (4/12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left 8 Cols: Submissions Showcase */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-heritage-green">
                Bài Viết Nổi Bật Theo Chủ Đề Tuần Này
              </h2>

              <div className="flex items-center gap-1 bg-rice-paper p-1 rounded-xl border border-heritage-green/12 text-xs font-bold">
                <button className="px-3 py-1.5 rounded-lg bg-heritage-green text-warm-ivory focus-ring cursor-pointer">
                  🔥 Yêu thích nhất
                </button>
                <button className="px-3 py-1.5 rounded-lg text-heritage-green hover:bg-mist-cloud focus-ring cursor-pointer">
                  ⭐ Mới đăng
                </button>
              </div>
            </div>

            {entries.map((entry) => (
              <ContestEntryCard
                key={entry.id}
                entry={entry}
                onVote={handleVote}
              />
            ))}
          </div>

          {/* Right 4 Cols: Gamification Shop & Milestones */}
          <aside className="lg:col-span-4 space-y-6">
            <GamificationShopCard
              userCoins={userCoins}
              onRedeem={handleRedeem}
            />
            <GamificationMilestonesCard />
          </aside>
        </div>
      </div>

      {/* Floating Action Button (+ Write Contest Entry) */}
      <button
        onClick={() => {
          setIsFormOpen(true);
          window.scrollTo({ top: 380, behavior: "smooth" });
        }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-heritage-green text-warm-ivory font-bold text-xl shadow-xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-antique-gold z-40 cursor-pointer"
        title="Viết bài dự thi chủ đề tuần"
      >
        ✍️
      </button>
    </main>
  );
}
