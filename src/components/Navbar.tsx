import React, { useState } from 'react';
import { BookOpen, Sparkles, Compass, Home, User, MapPin, Layers } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

interface NavbarProps {
  activeView?: string;
  isLoggedIn?: boolean;
  user?: { name: string; email: string; avatar: string } | null;
  onNavigateToSection: (sectionId: string) => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'landing-3',
  isLoggedIn = false,
  user,
  onNavigateToSection,
  onLogout,
  onOpenProfile,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const scrollToAnchor = (anchorId: string) => {
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigateToSection('landing-3');
      setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    if (onOpenProfile) onOpenProfile();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#163D37]/95 border-b border-[#D9B76A]/25 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo & Editorial Identity */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigateToSection(isLoggedIn ? 'home' : 'landing-3')}
          >
            <div className="relative w-11 h-11 rounded-full border border-[#D9B76A]/50 overflow-hidden bg-[#1E4B43] shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center text-[#FBF7EE] font-serif font-bold text-xl">
              🪷
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-2xl tracking-tight text-[#FBF7EE] group-hover:text-[#D9B76A] transition-colors">
                  Vie<span className="text-[#D9B76A]">Cultures</span>
                </span>
              </div>
            </div>
          </div>

          {/* Center Main Nav Links */}
          <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold tracking-wider text-[#FBF7EE]/90">
            {isLoggedIn ? (
              /* LOGGED IN NAVBAR: Functional App Pages */
              <>
                {/* 1. Home Dashboard / Study Room */}
                <button
                  onClick={() => onNavigateToSection('home')}
                  className={`transition-all py-2 px-3.5 rounded-xl flex items-center gap-1.5 ${
                    activeView === 'home'
                      ? 'bg-[#1E4B43] text-[#FBF7EE] border border-[#D9B76A]/50 shadow-sm font-bold'
                      : 'hover:text-[#D9B76A] hover:bg-[#1E4B43]/50'
                  }`}
                >
                  <Home className="w-4 h-4 text-[#D9B76A]" />
                  <span>Phòng Học</span>
                </button>

                {/* 2. Discovery Catalog */}
                <button
                  onClick={() => onNavigateToSection('discovery')}
                  className={`transition-all py-2 px-3.5 rounded-xl flex items-center gap-1.5 ${
                    activeView === 'discovery'
                      ? 'bg-[#1E4B43] text-[#FBF7EE] border border-[#D9B76A]/50 shadow-sm font-bold'
                      : 'hover:text-[#D9B76A] hover:bg-[#1E4B43]/50'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#D9B76A]" />
                  <span>Khám Phá</span>
                </button>

                {/* 3. Dual Reader */}
                <button
                  onClick={() => onNavigateToSection('bilingual-reader')}
                  className={`transition-all py-2 px-3.5 rounded-xl flex items-center gap-1.5 ${
                    activeView === 'bilingual-reader'
                      ? 'bg-[#1E4B43] text-[#FBF7EE] border border-[#D9B76A]/50 shadow-sm font-bold'
                      : 'hover:text-[#D9B76A] hover:bg-[#1E4B43]/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#D9B76A]" />
                  <span>Đọc Song Ngữ</span>
                </button>

                {/* 4. SRS Flashcards */}
                <button
                  onClick={() => onNavigateToSection('flashcard-study')}
                  className={`transition-all py-2 px-3.5 rounded-xl flex items-center gap-1.5 ${
                    activeView === 'flashcard-study'
                      ? 'bg-[#1E4B43] text-[#FBF7EE] border border-[#D9B76A]/50 shadow-sm font-bold'
                      : 'hover:text-[#D9B76A] hover:bg-[#1E4B43]/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#D9B76A]" />
                  <span>Thẻ Học SRS</span>
                </button>
              </>
            ) : (
              /* LOGGED OUT (LANDING PAGE) NAVBAR: Landing Page Navigation */
              <>
                {/* 1. Bản Đồ Di Sản */}
                <button
                  onClick={() => scrollToAnchor('vietnam-map')}
                  className="transition-all py-2 px-3.5 rounded-xl flex items-center gap-1.5 hover:text-[#D9B76A] hover:bg-[#1E4B43]/50"
                >
                  <MapPin className="w-4 h-4 text-[#D9B76A]" />
                  <span>Bản Đồ Di Sản</span>
                </button>

                {/* 2. Chủ Đề Văn Hóa */}
                <button
                  onClick={() => scrollToAnchor('topics')}
                  className="transition-all py-2 px-3.5 rounded-xl flex items-center gap-1.5 hover:text-[#D9B76A] hover:bg-[#1E4B43]/50"
                >
                  <Layers className="w-4 h-4 text-[#D9B76A]" />
                  <span>Chủ Đề Văn Hóa</span>
                </button>

                {/* 3. Đọc Thử Song Ngữ */}
                <button
                  onClick={() => scrollToAnchor('interactive-demo')}
                  className="transition-all py-2 px-3.5 rounded-xl flex items-center gap-1.5 hover:text-[#D9B76A] hover:bg-[#1E4B43]/50"
                >
                  <BookOpen className="w-4 h-4 text-[#D9B76A]" />
                  <span>Đọc Thử Song Ngữ</span>
                </button>

                {/* 4. Kho Bài Đọc */}
                <button
                  onClick={() => onNavigateToSection('discovery')}
                  className={`transition-all py-2 px-3.5 rounded-xl flex items-center gap-1.5 ${
                    activeView === 'discovery'
                      ? 'bg-[#1E4B43] text-[#FBF7EE] border border-[#D9B76A]/50 shadow-sm font-bold'
                      : 'hover:text-[#D9B76A] hover:bg-[#1E4B43]/50'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#D9B76A]" />
                  <span>Kho Bài Đọc</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {isLoggedIn ? (
              /* Inline Profile Dropdown attached underneath avatar */
              <div className="relative">
                <button
                  onClick={handleProfileClick}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1E4B43] border border-[#D9B76A]/60 shadow-lg hover:scale-105 active:scale-95 transition-all group"
                  title="Mở Profile Menu"
                >
                  <span className="text-lg">{user?.avatar || '🐸'}</span>
                  <span className="absolute -top-1 -right-1 text-xs select-none">👑</span>
                </button>

                <ProfileDropdown
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  user={user}
                  onLogout={onLogout}
                  onNavigate={onNavigateToSection}
                />
              </div>
            ) : (
              <button
                onClick={() => onNavigateToSection('login')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeView === 'login'
                    ? 'bg-[#D9B76A] text-[#163D37] ring-2 ring-[#D9B76A]'
                    : 'bg-[#1E4B43] text-[#FBF7EE] hover:bg-[#163D37] border border-[#D9B76A]/40'
                }`}
              >
                <User className="w-4 h-4 text-[#D9B76A]" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
