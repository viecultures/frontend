import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Link from "@/components/Link";
import { ArrowLeft, Columns, BookOpen, Moon, Sun, Layers, LogIn, Crown, User } from "lucide-react";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { paths } from '@/routes/paths';
import type { AppUser } from '@/utils/auth-storage';

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
  onOpenVoiceCustomizer?: () => void;
  selectedVoiceName?: string;
  selectedVoiceFlag?: string;
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onLogout?: () => void;
  isPro?: boolean;
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
  onOpenVoiceCustomizer,
  selectedVoiceName,
  selectedVoiceFlag = "🇺🇸",
  isLoggedIn = false,
  user = null,
  onLogout,
  isPro = false,
}: ReaderToolbarProps) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

          {/* Giọng đọc Gemini Button */}
          {onOpenVoiceCustomizer && (
            <button
              onClick={onOpenVoiceCustomizer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#163D37] border border-[#D9B76A]/50 text-[#FBF7EE] hover:bg-[#1E4B43] font-bold transition-all cursor-pointer shadow-sm"
              title="Tùy chỉnh giọng đọc Google Gemini"
            >
              <span>{selectedVoiceFlag}</span>
              <span className="hidden sm:inline">Giọng: {selectedVoiceName || "Puck"}</span>
            </button>
          )}

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

          {/* User Account / Login Button */}
          {isLoggedIn ? (
            <div className="relative flex items-center gap-2 pl-1 border-l border-[#D9B76A]/40">
              <Link
                href="/pricing"
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  isPro
                    ? "bg-[#D9B76A] text-[#122A22] border-[#D9B76A]"
                    : "bg-[#163D37] text-[#D9B76A] border-[#D9B76A]/40 hover:bg-[#1E4B43]"
                }`}
                title="Gói hội viên"
              >
                <Crown className="w-3 h-3 fill-current" />
                <span>{isPro ? "Hội Viên Pro" : "Nâng Cấp Pro"}</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#163D37] border border-[#D9B76A] shadow-sm cursor-pointer group overflow-hidden"
                title="Mở hồ sơ cá nhân"
              >
                {user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("/")) ? (
                  <img src={user.avatar} alt={user?.name || "User"} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="text-[11px] font-bold text-[#D9B76A]">
                    {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : "NL")}
                  </span>
                )}
                {isPro && (
                  <span className="absolute -top-0.5 -right-0.5 p-0.5 rounded-full bg-[#D9B76A] text-[#122A22]" aria-hidden="true">
                    <Crown className="w-2 h-2 fill-current" />
                  </span>
                )}
              </button>

              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
                onLogout={onLogout}
                onNavigate={(to) => navigate(to)}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                const currentPath = window.location.pathname + window.location.search;
                navigate(paths.login({ redirect: currentPath }));
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#9E2A2B] hover:bg-[#852223] text-white font-bold text-xs shadow-sm border border-[#D9B76A]/60 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#D9B76A]" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
