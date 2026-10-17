import React, { useState } from "react";
import "../vocabulary.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookMarked,
  PlusCircle,
  Sparkles,
  X,
  Plus,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { PATHS } from '@/routes/paths';

interface FlashcardSidebarLayoutProps {
  children: React.ReactNode;
}

export const FlashcardSidebarLayout: React.FC<FlashcardSidebarLayoutProps> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Quick Add Word Modal State
  const [isAddWordModalOpen, setIsAddWordModalOpen] = useState<boolean>(false);
  const [newWord, setNewWord] = useState<string>("");
  const [newMeaning, setNewMeaning] = useState<string>("");
  const [newContext, setNewContext] = useState<string>("");

  const currentPath = location.pathname;

  const handleNav = (path: string) => {
    navigate(path);
  };

  const handleOpenAddWord = () => {
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
    <div className={`vocab-shell ${currentPath === PATHS.flashcardStudy ? "vocab-study-shell" : ""} text-text-body flex flex-col lg:flex-row font-sans selection:bg-sky-mist selection:text-heritage-green`}>
      <nav className="vocab-mobile-nav lg:hidden" aria-label="Điều hướng từ vựng trên điện thoại">
        <button onClick={() => handleNav(PATHS.dictionary)} aria-current={currentPath === PATHS.dictionary ? "page" : undefined}><BookMarked size={16} />Thư viện</button>
        <button onClick={handleOpenAddWord}><PlusCircle size={16} />Thêm từ</button>
        <button onClick={() => handleNav(PATHS.flashcardStudy)} aria-current={currentPath === PATHS.flashcardStudy ? "page" : undefined}><Sparkles size={16} />Ôn tập</button>
      </nav>

      {/* LEFT NAVIGATION SIDEBAR */}
      <aside
        className="vocab-sidebar hidden lg:flex sticky top-20 left-0 z-40 h-[calc(100vh-5rem)] w-56 shrink-0 bg-surface border-r border-line p-4 flex-col justify-between overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Sidebar Menu Items */}
          <div className="vocab-sidebar-heading"><BookMarked size={18} /><span>GÓC HỌC TẬP</span></div>
          <nav className="space-y-1.5" aria-label="Điều hướng Flashcards">
            {/* TAB 1: THƯ VIỆN */}
            <button
              onClick={() => handleNav(PATHS.dictionary)}
              aria-current={currentPath === PATHS.dictionary ? "page" : undefined}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer focus-ring ${
                currentPath === PATHS.dictionary || currentPath === "/flashcard-library"
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
              onClick={() => handleNav(PATHS.flashcardStudy)}
              aria-current={currentPath === PATHS.flashcardStudy ? "page" : undefined}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer focus-ring ${
                currentPath === PATHS.flashcardStudy && !location.search.includes("mode=match")
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
            Cùng chia sẻ từ mới và khám phá văn hóa Việt qua mỗi câu chuyện.
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
      <main className="vocab-main flex-1 min-w-0 w-full">
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
