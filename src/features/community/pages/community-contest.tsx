import { useState, useMemo } from "react";
import type { ContestEntry } from "../types";
import {
  ContestHeroBanner,
  ContestEntryEditor,
  ContestEntryCard,
  GamificationShopCard,
  GamificationMilestonesCard,
} from "../components";
import { CommunityHeader } from "../components/CommunityHeader";
import { Trophy, Coins, Sparkles, TrendingUp, Clock, Plus, Check, Heart } from "lucide-react";

const INITIAL_CONTEST_ENTRIES: ContestEntry[] = [
  {
    id: "entry-1",
    rankTag: "TOP 1 CHỦ ĐỀ • +500 XU",
    rankClass: "bg-amber-100 text-amber-900 border-amber-300",
    authorName: "Trần Thanh Thảo",
    authorBadge: "Sứ Giả Cố Đô",
    authorSub: "Thành viên tích cực • Huế, Việt Nam",
    avatarText: "TT",
    title: "Ngọ Môn Gate: Architectural Masterpiece of Imperial Hue",
    excerpt:
      "Walking through Ngọ Môn Gate, I felt the magnificent architectural harmony calculated by royal builders. The gate stands as a symbol of intangible pride passed down through centuries...",
    usedVocab: ["architectural", "intangible", "geomancy"],
    votesCount: 142,
    commentsCount: 28,
    rewardCoins: 100,
    imageCaption: "Ngọ Môn Gate Sunrise • Imperial Citadel Hue",
  },
  {
    id: "entry-2",
    rankTag: "TOP 2 CHỦ ĐỀ • +300 XU",
    rankClass: "bg-slate-100 text-slate-800 border-slate-300",
    authorName: "Kenji Sato",
    authorBadge: "Học viên Quốc tế",
    authorSub: "Người học quốc tế • Tokyo, Japan",
    avatarText: "KS",
    title: "Discovering Ancient Craftsmen of Old Citadel",
    excerpt:
      "Ancient artisans promulgated traditional wood carving and ceramic mosaic techniques. They preserved a living fortress of Vietnamese art heritage through enduring perseverance...",
    usedVocab: ["promulgated", "fortress", "architectural"],
    votesCount: 98,
    commentsCount: 14,
    rewardCoins: 100,
    imageCaption: "Wood Carving & Mosaic Detail • Hue Citadel",
  },
  {
    id: "entry-3",
    rankTag: "TOP 3 CHỦ ĐỀ • +200 XU",
    rankClass: "bg-orange-100 text-orange-900 border-orange-300",
    authorName: "Phạm Minh Đức",
    authorBadge: "Thành viên tích cực",
    authorSub: "Học viên B2 • Hà Nội, Việt Nam",
    avatarText: "MĐ",
    title: "The Silent Geometry of Perfume River Tombs",
    excerpt:
      "The mausoleums along the Perfume River embody profound philosophical principles. The juxtaposition between stone grandeur and natural pine forests creates a serene contemplative atmosphere...",
    usedVocab: ["intangible", "geomancy", "fortress"],
    votesCount: 67,
    commentsCount: 9,
    rewardCoins: 100,
    imageCaption: "Tự Đức Tomb Water Pavilion • Hue",
  },
];

export default function CommunityContestPage() {
  const [userCoins, setUserCoins] = useState<number>(450);
  const [entries, setEntries] = useState<ContestEntry[]>(INITIAL_CONTEST_ENTRIES);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [entryTitle, setEntryTitle] = useState<string>("");
  const [entryText, setEntryText] = useState<string>("");
  const [filterMode, setFilterMode] = useState<"top" | "new" | "mine">("top");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedVocab, setSelectedVocab] = useState<Record<string, boolean>>({
    architectural: true,
    intangible: true,
    fortress: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Vote Button Toggle
  const handleVote = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          const voted = entry.userVoted;
          const updated = {
            ...entry,
            userVoted: !voted,
            votesCount: voted ? entry.votesCount - 1 : entry.votesCount + 1,
          };
          showToast(
            !voted
              ? "Đã bình chọn bài viết! Bạn nhận được +10 XP tương tác."
              : "Đã hủy bình chọn."
          );
          return updated;
        }
        return entry;
      })
    );
  };

  // Redeem Gamification Shop Item
  const handleRedeem = (itemName: string, cost: number) => {
    if (userCoins < cost) {
      showToast(
        `Bạn cần ${cost} Xu để đổi quà này (Ví hiện có: ${userCoins} Xu). Hãy nộp bài thử thách để tích lũy thêm!`
      );
      return;
    }
    setUserCoins((prev) => prev - cost);
    showToast(`Chúc mừng! Bạn đã đổi thành công "${itemName}" với ${cost} Xu!`);
  };

  // Submit Contest Entry
  const handleSubmitEntry = () => {
    if (!entryTitle.trim() || !entryText.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung bài dự thi của bạn!");
      return;
    }

    const appliedVocabs = Object.keys(selectedVocab).filter((k) => selectedVocab[k]);

    const newEntry: ContestEntry = {
      id: `entry-${Date.now()}`,
      authorName: "Học Viên VieCultures",
      authorBadge: "Sứ Giả Mới",
      authorSub: "Vừa tham gia thử thách tuần",
      avatarText: "HV",
      title: entryTitle,
      excerpt: entryText,
      usedVocab: appliedVocabs,
      votesCount: 1,
      commentsCount: 0,
      rewardCoins: 100,
      userVoted: true,
      imageCaption: "Ảnh bài dự thi đính kèm • Cố Đô Huế",
    };

    setEntries([newEntry, ...entries]);
    setUserCoins((prev) => prev + 100);
    setEntryTitle("");
    setEntryText("");
    setIsFormOpen(false);
    showToast("Chúc mừng! Bạn đã gửi bài thành công và nhận ngay +100 Xu Văn Hóa!");
  };

  // Filtered Entries
  const filteredEntries = useMemo(() => {
    if (filterMode === "mine") {
      return entries.filter((e) => e.authorName === "Học Viên VieCultures");
    }
    if (filterMode === "new") {
      return [...entries].reverse();
    }
    // "top"
    return [...entries].sort((a, b) => b.votesCount - a.votesCount);
  }, [entries, filterMode]);

  return (
    <main className="min-h-screen bg-surface text-text-body relative selection:bg-sky-mist selection:text-heritage-green">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-heritage-green text-warm-ivory shadow-xl border border-antique-gold/40 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-antique-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        {/* Header Switcher */}
        <CommunityHeader
          isEditorOpen={isFormOpen}
          onToggleEditor={() => setIsFormOpen((prev) => !prev)}
          activeTab="contest"
        />

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <h2 className="font-serif text-2xl font-bold text-heritage-green flex items-center gap-2">
                <Trophy className="w-5 h-5 text-antique-gold" />
                <span>Bài Viết Nổi Bật Theo Chủ Đề Tuần ({filteredEntries.length})</span>
              </h2>

              <div className="flex items-center gap-1 bg-rice-paper p-1 rounded-xl border border-line text-xs font-bold">
                <button
                  onClick={() => setFilterMode("top")}
                  className={`px-3 py-1.5 rounded-lg transition-all focus-ring cursor-pointer flex items-center gap-1.5 ${
                    filterMode === "top"
                      ? "bg-heritage-green text-warm-ivory shadow-sm"
                      : "text-heritage-green hover:bg-mist-cloud"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Bình chọn nhiều nhất</span>
                </button>
                <button
                  onClick={() => setFilterMode("new")}
                  className={`px-3 py-1.5 rounded-lg transition-all focus-ring cursor-pointer flex items-center gap-1.5 ${
                    filterMode === "new"
                      ? "bg-heritage-green text-warm-ivory shadow-sm"
                      : "text-heritage-green hover:bg-mist-cloud"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mới nhất</span>
                </button>
                <button
                  onClick={() => setFilterMode("mine")}
                  className={`px-3 py-1.5 rounded-lg transition-all focus-ring cursor-pointer flex items-center gap-1.5 ${
                    filterMode === "mine"
                      ? "bg-heritage-green text-warm-ivory shadow-sm"
                      : "text-heritage-green hover:bg-mist-cloud"
                  }`}
                >
                  <span>Bài của tôi</span>
                </button>
              </div>
            </div>

            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <ContestEntryCard
                  key={entry.id}
                  entry={entry}
                  onVote={handleVote}
                />
              ))
            ) : (
              <div className="p-12 text-center rounded-3xl bg-surface border border-line space-y-3">
                <Trophy className="w-8 h-8 text-text-secondary/40 mx-auto" />
                <h3 className="font-serif text-base font-bold text-heritage-green">
                  Bạn chưa có bài dự thi nào trong tuần này
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Hãy bấm nút "Viết Bài Dự Thi" phía trên để chia sẻ cảm nhận và nhận ngay +100 Xu Văn Hóa!
                </p>
              </div>
            )}
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

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setIsFormOpen(true);
          window.scrollTo({ top: 350, behavior: "smooth" });
        }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-heritage-green text-warm-ivory font-bold shadow-xl hover:scale-110 transition-transform flex items-center justify-center border-2 border-antique-gold z-40 focus-ring cursor-pointer"
        title="Gửi bài dự thi"
        aria-label="Mở form gửi bài dự thi"
      >
        <Plus className="w-6 h-6 text-antique-gold" />
      </button>
    </main>
  );
}
