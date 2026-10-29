import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { ContestEntry } from "../types";
import {
  ContestHeroBanner,
  ContestEntryEditor,
  ContestEntryCard,
  GamificationShopCard,
  GamificationMilestonesCard,
} from "../components";
import { CommunityHeader } from "../components/CommunityHeader";
import { communityLabel } from "../community-copy";
import { TrendingUp, Clock, Plus, Check } from "lucide-react";

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
  const { t } = useTranslation("community");
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
              ? "Vote added in this preview only."
              : "Vote removed from this preview."
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
        `This preview reward costs ${cost} coins. Your preview balance is ${userCoins} coins.`
      );
      return;
    }
    setUserCoins((prev) => prev - cost);
    showToast(`"${communityLabel(itemName)}" redeemed in this preview for ${cost} coins.`);
  };

  // Submit Contest Entry
  const handleSubmitEntry = () => {
    if (!entryTitle.trim() || !entryText.trim()) {
      alert("Enter a title and your challenge entry.");
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
    showToast("Entry added to this preview. Your preview balance increased by 100 coins.");
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
    <main className="community-ui min-h-screen bg-[#FAF7F0] text-[#314F49] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div role="status" className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#1D5046] text-white shadow-lg border border-[#153D35] flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-3 duration-300 max-w-[90vw]">
          <Check className="w-4 h-4 text-[#E8D7AE] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="mb-5 rounded-xl border border-[#E8E2D5] bg-white px-4 py-3 text-sm text-[#314F49]">
          {t("community.composer.preview_notice")}
        </p>
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
            window.scrollTo({ top: 100, behavior: "smooth" });
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Cols: Submissions Showcase */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl bg-white border border-[#E8E2D5] shadow-[0_2px_8px_rgba(0,0,0,0.03)] p-3 space-y-2.5">
              <h2 className="font-serif text-lg font-bold text-[#1D5046]">
                <span>Weekly challenge entries ({filteredEntries.length})</span>
              </h2>

              <div className="community-contest-filters flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-semibold" aria-label="Sort challenge entries">
                <button
                  onClick={() => setFilterMode("top")}
                  aria-pressed={filterMode === "top"}
                  className={`px-3 py-1.5 rounded-xl transition-colors focus-ring cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    filterMode === "top"
                      ? "bg-[#1D5046] text-white shadow-2xs"
                      : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t("community.contest.filter_top")}</span>
                </button>
                <button
                  onClick={() => setFilterMode("new")}
                  aria-pressed={filterMode === "new"}
                  className={`px-3 py-1.5 rounded-xl transition-colors focus-ring cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    filterMode === "new"
                      ? "bg-[#1D5046] text-white shadow-2xs"
                      : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t("community.contest.filter_new")}</span>
                </button>
                <button
                  onClick={() => setFilterMode("mine")}
                  aria-pressed={filterMode === "mine"}
                  className={`px-3 py-1.5 rounded-xl transition-colors focus-ring cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    filterMode === "mine"
                      ? "bg-[#1D5046] text-white shadow-2xs"
                      : "text-[#6E7B75] hover:text-[#1D5046] hover:bg-[#FAF7F0]"
                  }`}
                >
                  <span>{t("community.contest.filter_mine")}</span>
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
              <div className="p-8 text-center rounded-2xl bg-white border border-[#E8E2D5] space-y-2.5">
                <h3 className="font-serif text-base font-bold text-heritage-green">
                  You have no entries this week
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Choose “Submit an entry” to share your perspective and receive +100 cultural coins.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(true);
                    window.scrollTo({ top: 100, behavior: "smooth" });
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#1D5046] hover:bg-[#153D35] transition-colors focus-ring"
                >
                  Submit an entry
                </button>
              </div>
            )}
          </div>

          {/* Right 4 Cols: Gamification Shop & Milestones */}
          <aside className="lg:col-span-4 space-y-4">
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
          window.scrollTo({ top: 100, behavior: "smooth" });
        }}
        className="community-fab fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#1D5046] text-white shadow-lg hover:bg-[#153D35] transition-colors flex items-center justify-center border border-[#153D35] z-40 focus-ring cursor-pointer"
        title="Submit an entry"
        aria-label="Open contest editor"
      >
        <Plus className="w-5 h-5 text-[#E8D7AE]" />
      </button>
    </main>
  );
}
