import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookMarked,
  PlusCircle,
  Sparkles,
  Menu,
  X,
  Plus,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface FlashcardSidebarLayoutProps {
  children: React.ReactNode;
}

export const FlashcardSidebarLayout: React.FC<FlashcardSidebarLayoutProps> = ({
  children,
}) => {
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
    <div className="min-h-screen bg-warm-ivory text-text-body flex flex-col lg:flex-row font-sans selection:bg-sky-mist selection:text-heritage-green">
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-heritage-dark text-warm-ivory px-4 py-3 flex items-center justify-between border-b border-antique-gold/30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-heritage-green border border-antique-gold flex items-center justify-center shadow-xs">
            <BookOpen className="w-4 h-4 text-antique-gold" />
          </div>
          <span className="font-serif font-bold text-lg text-warm-ivory">
            Vie<span className="text-antique-gold">Cultures Vocab</span>
          </span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-heritage-green text-warm-ivory border border-antique-gold/40 cursor-pointer focus-ring"
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* LEFT NAVIGATION SIDEBAR */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-surface border-r border-line p-5 flex flex-col justify-between transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Top Brand Identity */}
          <div
            onClick={() => handleNav("/home")}
            className="flex items-center gap-3 pb-4 border-b border-line cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-heritage-green border-2 border-antique-gold flex items-center justify-center text-warm-ivory shadow-md shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-antique-gold" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-heritage-green group-hover:text-heritage-dark transition-colors">
                VieCultures
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-antique-gold block">
                Kho Từ Vựng &amp; SRS
              </span>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="space-y-1.5" aria-label="Điều hướng Flashcards">
            {/* TAB 1: THƯ VIỆN */}
            <button
              onClick={() => handleNav("/dictionary")}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer focus-ring ${
                currentPath === "/dictionary" || currentPath === "/flashcard-library"
                  ? "bg-rice-paper text-heritage-green border border-antique-gold/50 shadow-xs"
                  : "text-text-body hover:bg-rice-paper/60 hover:text-heritage-green"
              }`}
            >
              <BookMarked className="w-5 h-5 text-antique-gold" />
              <span>Thư viện từ vựng</span>
            </button>

            {/* TAB 2: THÊM TỪ */}
            <button
              onClick={handleOpenAddWord}
              className="w-full px-4 py-3 rounded-2xl text-xs font-bold text-heritage-green hover:bg-rice-paper/60 flex items-center gap-3 transition-all cursor-pointer focus-ring"
            >
              <PlusCircle className="w-5 h-5 text-antique-gold" />
              <span>Thêm từ mới</span>
            </button>

            {/* TAB 3: ÔN TẬP SRS */}
            <button
              onClick={() => handleNav("/flashcard-study")}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer focus-ring ${
                currentPath === "/flashcard-study" && !location.search.includes("mode=match")
                  ? "bg-rice-paper text-heritage-green border border-antique-gold/50 shadow-xs"
                  : "text-text-body hover:bg-rice-paper/60 hover:text-heritage-green"
              }`}
            >
              <Sparkles className="w-5 h-5 text-antique-gold" />
              <span>Ôn tập SRS</span>
            </button>
          </nav>
        </div>

        {/* Bottom Community Promotion Box */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-heritage-green to-heritage-dark text-warm-ivory space-y-2 border border-antique-gold/40 shadow-md">
          <div className="flex items-center gap-1.5 text-xs font-bold text-antique-gold">
            <Sparkles className="w-4 h-4" />
            <span>Cộng đồng Học tập</span>
          </div>
          <p className="text-[11px] text-sky-mist leading-relaxed">
            Hơn 200+ bộ thẻ di sản được đóng góp bởi các Đại Sứ Văn Hóa.
          </p>
          <button
            onClick={() => handleNav("/community")}
            className="w-full py-2 rounded-xl bg-antique-gold hover:bg-antique-bright text-heritage-dark font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1 focus-ring"
          >
            <span>Tham gia ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 w-full">
        {children}
      </main>

      {/* THÊM TỪ MỚI MODAL */}
      {isAddWordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 border border-line animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rice-paper text-heritage-green flex items-center justify-center font-bold border border-antique-gold/40">
                  <Plus className="w-4 h-4 text-heritage-green" />
                </div>
                <h3 className="font-serif text-lg font-bold text-heritage-green">
                  Thêm Từ Vựng Cá Nhân
                </h3>
              </div>
              <button
                onClick={() => setIsAddWordModalOpen(false)}
                className="p-1 rounded-full hover:bg-rice-paper text-text-secondary hover:text-heritage-green cursor-pointer focus-ring"
                aria-label="Đóng form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-text-secondary">
              <div>
                <label className="block mb-1 text-heritage-green">
                  Từ tiếng Anh (English Word):
                </label>
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Vd: Heritage, Citadel, Baguette..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-rice-paper/60 border border-heritage-green/20 text-xs text-heritage-green font-bold focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-antique-gold/40"
                />
              </div>

              <div>
                <label className="block mb-1 text-heritage-green">
                  Nghĩa tiếng Việt (Vietnamese Meaning):
                </label>
                <input
                  type="text"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Vd: Di sản văn hóa..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-rice-paper/60 border border-heritage-green/20 text-xs text-heritage-green font-bold focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-antique-gold/40"
                />
              </div>

              <div>
                <label className="block mb-1 text-heritage-green">
                  Câu ngữ cảnh ví dụ (Context Sentence):
                </label>
                <textarea
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="Vd: The Hue Citadel is a UNESCO heritage site..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl bg-rice-paper/60 border border-heritage-green/20 text-xs text-heritage-green font-bold focus:outline-none focus:border-heritage-green focus:ring-2 focus:ring-antique-gold/40 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-line flex justify-end gap-2">
              <button
                onClick={() => setIsAddWordModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-heritage-green hover:bg-rice-paper cursor-pointer focus-ring"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveWord}
                className="px-5 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory text-xs font-bold cursor-pointer shadow-xs border border-antique-gold/40 focus-ring"
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
