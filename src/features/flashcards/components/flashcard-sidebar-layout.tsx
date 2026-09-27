import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookMarked,
  PlusCircle,
  Sparkles,
  Gamepad2,
  User,
  Menu,
  X,
  Plus,
  Volume2,
} from "lucide-react";

interface FlashcardSidebarLayoutProps {
  children: React.ReactNode;
}

export const FlashcardSidebarLayout: React.FC<FlashcardSidebarLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Quick Add Word Modal State
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>("");
  const [newMeaning, setNewMeaning] = useState<string>("");
  const [newContext, setNewContext] = useState<string>("");

  const currentPath = location.pathname;

  const handleNav = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleOpenAddWord = () => {
    setIsMobileMenuOpen(false);
    setIsAddWordModalOpen(true);
  };

  const handleSaveWord = () => {
    if (!newWord.trim() || !newMeaning.trim()) {
      alert("Vui lòng nhập từ tiếng Anh và nghĩa tiếng Việt!");
      return;
    }
    alert(`Đã thêm từ "${newWord}" (${newMeaning}) vào Thư viện từ vựng cá nhân!`);
    setNewWord("");
    setNewMeaning("");
    setNewContext("");
    setIsAddWordModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-[#3F5550] flex flex-col lg:flex-row font-sans selection:bg-[#BFE3EA]">
      {/* Mobile Top Header (Visible on mobile/tablet screens) */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#163D37] text-[#FBF7EE] px-4 py-3 flex items-center justify-between border-b border-[#D9B76A]/30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1E4B43] border border-[#D9B76A] flex items-center justify-center font-serif text-lg">
            🪷
          </div>
          <span className="font-serif font-bold text-lg text-[#FBF7EE]">
            Vie<span className="text-[#D9B76A]">Cultures Vocab</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-[#1E4B43] text-[#FBF7EE] border border-[#D9B76A]/40"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LEFT NAVIGATION SIDEBAR (HeyWord Style Left Sidebar) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-[#FBF7EE] border-r-2 border-[rgba(30,75,67,0.12)] p-5 flex flex-col justify-between transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0 bg-[#FBF7EE]" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="space-y-6">
          {/* Top Brand Identity */}
          <div
            onClick={() => handleNav("/home")}
            className="flex items-center gap-3 pb-4 border-b border-[rgba(30,75,67,0.12)] cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#1E4B43] border-2 border-[#D9B76A] flex items-center justify-center text-[#FBF7EE] text-xl font-serif shadow-md shrink-0 group-hover:scale-105 transition-transform">
              🪷
            </div>
            <div>
              <h2 className="font-serif font-extrabold text-base text-[#1E4B43] group-hover:text-[#059669] transition-colors">VieCultures</h2>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669]">
                Kho Từ Vựng &amp; SRS
              </span>
            </div>
          </div>

          {/* Sidebar Menu Items (HeyWord Order & Style) */}
          <nav className="space-y-1.5">
            {/* TAB 1: THƯ VIỆN (Library / Dictionary) */}
            <button
              onClick={() => handleNav("/dictionary")}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-3 transition-all cursor-pointer ${currentPath === "/dictionary" || currentPath === "/flashcard-library"
                ? "bg-[#ECFDF5] text-[#059669] border border-[#059669]/40 shadow-xs"
                : "text-[#3F5550] hover:bg-[#F6EEDC] hover:text-[#1E4B43]"
                }`}
            >
              <BookMarked className="w-5 h-5 text-[#059669]" />
              <span>Thư viện từ vựng</span>
            </button>

            {/* TAB 2: THÊM TỪ (Add Word / Custom Vocabulary) */}
            <button
              onClick={handleOpenAddWord}
              className="w-full px-4 py-3 rounded-2xl text-xs font-extrabold text-[#1E4B43] hover:bg-[#F6EEDC] flex items-center gap-3 transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-[#D9B76A]" />
              <span>Thêm từ mới</span>
            </button>

            {/* TAB 3: ÔN TẬP SRS (Flashcards Study Player) */}
            <button
              onClick={() => handleNav("/flashcard-study")}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-3 transition-all cursor-pointer ${currentPath === "/flashcard-study" && !location.search.includes("mode=match")
                ? "bg-[#ECFDF5] text-[#059669] border border-[#059669]/40 shadow-xs"
                : "text-[#3F5550] hover:bg-[#F6EEDC] hover:text-[#1E4B43]"
                }`}
            >
              <Sparkles className="w-5 h-5 text-[#D9B76A]" />
              <span>Ôn tập SRS</span>
            </button>
          </nav>
        </div>

        {/* Bottom Community / Extension Promotion Box */}
        <div className="p-4 rounded-3xl bg-[#1E4B43] text-[#FBF7EE] space-y-2 border border-[#D9B76A]/40 shadow-md">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D9B76A]">
            <Sparkles className="w-4 h-4" />
            <span>Cộng đồng Học tập</span>
          </div>
          <p className="text-[11px] text-[#BFE3EA] leading-relaxed">
            Hơn 200+ bộ thẻ di sản được đóng góp bởi các Đại Sứ Văn Hóa.
          </p>
          <button
            onClick={() => handleNav("/community")}
            className="w-full py-2 rounded-xl bg-[#D9B76A] hover:bg-[#C59B48] text-[#1E4B43] font-extrabold text-xs transition-colors cursor-pointer"
          >
            Tham gia ngay →
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 w-full">
        {children}
      </div>

      {/* THÊM TỪ MỚI MODAL (ADD WORD MODAL) */}
      {isAddWordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#1E4B43]">Thêm Từ Vựng Cá Nhân</h3>
              </div>
              <button
                onClick={() => setIsAddWordModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-[#6E7E79]">
              <div>
                <label className="block mb-1">Từ tiếng Anh (English Word):</label>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Vd: Heritage, Citadel, Baguette..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F6EEDC]/60 border border-[rgba(30,75,67,0.2)] text-xs text-[#1E4B43] font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Nghĩa tiếng Việt (Vietnamese Meaning):</label>
                <input
                  type="text"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Vd: Di sản văn hóa..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F6EEDC]/60 border border-[rgba(30,75,67,0.2)] text-xs text-[#1E4B43] font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Câu ngữ cảnh ví dụ (Context Sentence):</label>
                <textarea
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="Vd: The Hue Citadel is a UNESCO heritage site..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F6EEDC]/60 border border-[rgba(30,75,67,0.2)] text-xs text-[#1E4B43] font-bold focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsAddWordModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6E7E79] hover:bg-gray-100 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveWord}
                className="px-5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Lưu vào thư viện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardSidebarLayout;
