import Link from "@/components/Link";
import { ArrowLeft, Columns, BookOpen, Moon, Sun, Layers } from "lucide-react";

interface ReaderToolbarProps {
  fontSize: number;
  onChangeFontSize: (updater: (prev: number) => number) => void;
  readingMode: "bilingual" | "extensive";
  onChangeReadingMode: (mode: "bilingual" | "extensive") => void;
  onOpenVocabList: () => void;
  vocabCount: number;
  themeMode: "paper" | "dark";
  onChangeThemeMode: (theme: "paper" | "dark") => void;
  selectedLevel?: "Level 1" | "Level 2" | "Level 3";
  onChangeLevel?: (lvl: "Level 1" | "Level 2" | "Level 3") => void;
}

export function ReaderToolbar({
  fontSize,
  onChangeFontSize,
  readingMode,
  onChangeReadingMode,
  onOpenVocabList,
  vocabCount,
  themeMode,
  onChangeThemeMode,
  selectedLevel = "Level 2",
  onChangeLevel,
}: ReaderToolbarProps) {
  return (
    <section className="bg-[#1E4B43] text-[#FBF7EE] border-b border-[#D9B76A]/30 py-3 px-6 sm:px-8 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Back Link & Breadcrumbs */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <Link
            href="/discovery"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FBF7EE] hover:text-[#D9B76A] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-[#D9B76A] group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif italic text-sm">Reading</span>
          </Link>
        </div>

        {/* Right Controls: Reading Mode Toggle, Font Size, Vocab Drawer, Theme Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-semibold">

          {/* Level Selector: Level 1 • Level 2 • Level 3 */}
          {onChangeLevel && (
            <div className="flex items-center bg-[#163D37] p-1 rounded-xl border border-[#D9B76A]/40 text-xs font-bold">
              {(['Level 1', 'Level 2', 'Level 3'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChangeLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-emerald-600 text-white shadow-xs font-bold ring-1 ring-antique-gold/60'
                      : 'text-[#BFE3EA] hover:text-[#FBF7EE]'
                  }`}
                  title={`Chuyển sang ${lvl}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}

          {/* Cỡ chữ (Icon A⁻ / A⁺) */}
          <div className="flex items-center bg-[#163D37] p-1 rounded-xl border border-[#D9B76A]/40">
            <button
              onClick={() => onChangeFontSize((prev) => Math.max(14, prev - 1))}
              className="px-2 py-1 rounded-lg hover:bg-[#1E4B43] text-[#BFE3EA] hover:text-[#FBF7EE] font-extrabold text-xs transition-colors cursor-pointer"
              title="Giảm cỡ chữ"
            >
              A⁻
            </button>
            <span className="font-mono text-xs font-bold text-[#D9B76A] px-1.5">
              {fontSize}px
            </span>
            <button
              onClick={() => onChangeFontSize((prev) => Math.min(24, prev + 1))}
              className="px-2 py-1 rounded-lg hover:bg-[#1E4B43] text-[#BFE3EA] hover:text-[#FBF7EE] font-extrabold text-xs transition-colors cursor-pointer"
              title="Tăng cỡ chữ"
            >
              A⁺
            </button>
          </div>

          {/* Toggle Chế độ Đọc: Song Ngữ vs Extensive Reading */}
          <div className="flex items-center bg-[#163D37] p-1 rounded-xl border border-[#D9B76A]/40 text-xs font-bold">
            <button
              onClick={() => onChangeReadingMode("bilingual")}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                readingMode === "bilingual"
                  ? "bg-[#D9B76A] text-[#1E4B43] shadow-xs"
                  : "text-[#BFE3EA] hover:text-[#FBF7EE]"
              }`}
              title="Chế độ Song Ngữ (Anh - Việt)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Song ngữ</span>
            </button>
            <button
              onClick={() => onChangeReadingMode("extensive")}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                readingMode === "extensive"
                  ? "bg-[#D9B76A] text-[#1E4B43] shadow-xs"
                  : "text-[#BFE3EA] hover:text-[#FBF7EE]"
              }`}
              title="Chế độ Đọc Mở Rộng Tiếng Anh (Extensive Reading)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Extensive</span>
            </button>
          </div>

          {/* Từ vựng bài đọc Button */}
          <button
            onClick={onOpenVocabList}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D9B76A] text-[#1E4B43] font-bold shadow-sm hover:bg-[#c9a657] transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{vocabCount} từ vựng</span>
          </button>

          {/* Theme Toggle */}
          <div className="flex items-center bg-[#163D37] p-1 rounded-xl border border-[#D9B76A]/40">
            <button
              onClick={() => onChangeThemeMode("dark")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                themeMode === "dark"
                  ? "bg-[#18211E] text-[#D9B76A]"
                  : "text-[#BFE3EA]"
              }`}
              title="Tối"
            >
              <Moon className="w-3 h-3 inline mr-1" />
              Tối
            </button>
            <button
              onClick={() => onChangeThemeMode("paper")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                themeMode === "paper"
                  ? "bg-[#FBF7EE] text-[#1E4B43]"
                  : "text-[#BFE3EA]"
              }`}
              title="Sáng"
            >
              <Sun className="w-3 h-3 inline mr-1" />
              Sáng
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
