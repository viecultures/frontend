import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Sparkles, Compass, Home, User, MapPin, Layers, Users, BookMarked, Crown } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ProfileDropdown } from './ProfileDropdown';

interface NavbarProps {
  activeView?: string;
  isLoggedIn?: boolean;
  user?: { name: string; email: string; avatar: string } | null;
  onNavigateToSection: (sectionId: string) => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

// ─── Nav link class helpers ────────────────────────────────────────────────────
const NAV_LINK_BASE =
  'transition-all py-2 px-3.5 rounded-xl flex items-center gap-1.5 cursor-pointer focus-ring-dark';

const navLinkClass = (isActive: boolean) =>
  `${NAV_LINK_BASE} ${isActive
    ? 'bg-heritage-green text-warm-ivory border border-antique-gold/50 shadow-sm font-bold'
    : 'text-warm-ivory/90 hover:text-antique-gold hover:bg-heritage-green/50'
  }`;

// ─── Component ─────────────────────────────────────────────────────────────────
export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'landing',
  isLoggedIn = false,
  user,
  onNavigateToSection,
  onLogout,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const hoverScale = shouldReduceMotion ? 1 : 1.03;
  const tapScale = shouldReduceMotion ? 1 : 0.97;

  const scrollToAnchor = (anchorId: string) => {
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigateToSection('landing');
      setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    // Navbar luôn dark theme (heritage-dark) bất kể page đang light/dark
    // Dùng bg token trực tiếp thay vì glass-nav (glass-nav mặc định light ivory)
    <header className="sticky top-0 z-50 w-full bg-heritage-dark/95 backdrop-blur-xl border-b border-antique-gold/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Brand Logo ──────────────────────────────────────────────── */}
          <motion.div
            whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            className="cursor-pointer focus-ring-dark rounded-xl"
            onClick={() => onNavigateToSection(isLoggedIn ? 'home' : 'landing')}
          >
            <BrandLogo size="md" theme="dark" />
          </motion.div>

          {/* ── Center Nav Links (desktop only) ─────────────────────────── */}
          <nav
            className="hidden lg:flex items-center gap-2 text-xs font-semibold tracking-wider text-warm-ivory/90"
            aria-label="Điều hướng chính"
          >
            {isLoggedIn ? (
              /* LOGGED IN: Functional App Pages */
              <>
                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection('home')}
                  className={navLinkClass(activeView === 'home')}
                  aria-current={activeView === 'home' ? 'page' : undefined}
                >
                  <Home className="w-4 h-4 text-antique-gold" />
                  <span>Phòng Học</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection('discovery')}
                  className={navLinkClass(activeView === 'discovery')}
                  aria-current={activeView === 'discovery' ? 'page' : undefined}
                >
                  <Compass className="w-4 h-4 text-antique-gold" />
                  <span>Khám Phá</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection('bilingual-reader')}
                  className={navLinkClass(activeView === 'bilingual-reader')}
                  aria-current={activeView === 'bilingual-reader' ? 'page' : undefined}
                >
                  <BookOpen className="w-4 h-4 text-antique-gold" />
                  <span>Đọc Song Ngữ</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection('dictionary')}
                  className={navLinkClass(
                    activeView === 'dictionary' || activeView === 'flashcard-study'
                  )}
                  aria-current={
                    activeView === 'dictionary' || activeView === 'flashcard-study'
                      ? 'page'
                      : undefined
                  }
                >
                  <BookMarked className="w-4 h-4 text-antique-gold" />
                  <span>Kho Từ Vựng</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection('community')}
                  className={navLinkClass(
                    activeView === 'community' || activeView === 'community-contest'
                  )}
                  aria-current={
                    activeView === 'community' || activeView === 'community-contest'
                      ? 'page'
                      : undefined
                  }
                >
                  <Users className="w-4 h-4 text-antique-gold" />
                  <span>Cộng Đồng</span>
                </motion.button>
              </>
            ) : (
              /* LOGGED OUT: Landing Page anchor navigation */
              <>
                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => scrollToAnchor('vietnam-map')}
                  className={`${NAV_LINK_BASE} text-warm-ivory/90 hover:text-antique-gold hover:bg-heritage-green/50`}
                >
                  <MapPin className="w-4 h-4 text-antique-gold" />
                  <span>Bản Đồ Di Sản</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => scrollToAnchor('topics')}
                  className={`${NAV_LINK_BASE} text-warm-ivory/90 hover:text-antique-gold hover:bg-heritage-green/50`}
                >
                  <Layers className="w-4 h-4 text-antique-gold" />
                  <span>Chủ Đề Văn Hóa</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => scrollToAnchor('interactive-demo')}
                  className={`${NAV_LINK_BASE} text-warm-ivory/90 hover:text-antique-gold hover:bg-heritage-green/50`}
                >
                  <BookOpen className="w-4 h-4 text-antique-gold" />
                  <span>Đọc Thử Song Ngữ</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection('discovery')}
                  className={navLinkClass(activeView === 'discovery')}
                  aria-current={activeView === 'discovery' ? 'page' : undefined}
                >
                  <Compass className="w-4 h-4 text-antique-gold" />
                  <span>Kho Bài Đọc</span>
                </motion.button>
              </>
            )}
          </nav>

          {/* ── Right Actions ────────────────────────────────────────────── */}
          <div className="flex items-center gap-2.5">

            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleProfileClick}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full bg-heritage-green border border-antique-gold/60 shadow-lg cursor-pointer group focus-ring-dark overflow-hidden p-0.5"
                  title="Mở Profile Menu"
                  aria-label="Mở menu hồ sơ cá nhân"
                  aria-expanded={isProfileOpen}
                >
                  {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                    <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-xs font-bold text-antique-gold">
                      {user?.avatar || 'NL'}
                    </span>
                  )}
                  <span className="absolute -top-0.5 -right-0.5 p-0.5 rounded-full bg-antique-gold text-heritage-dark shadow-xs" aria-hidden="true">
                    <Crown className="w-2.5 h-2.5 fill-current" />
                  </span>
                </motion.button>

                <ProfileDropdown
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  user={user}
                  onLogout={onLogout}
                  onNavigate={onNavigateToSection}
                />
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: hoverScale }}
                whileTap={{ scale: tapScale }}
                onClick={() => onNavigateToSection('login')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer focus-ring-dark ${activeView === 'login'
                  ? 'bg-antique-gold text-heritage-dark ring-2 ring-antique-gold'
                  : 'bg-heritage-green text-warm-ivory hover:bg-heritage-dark border border-antique-gold/40'
                  }`}
                aria-label="Đăng nhập vào VieCultures"
              >
                <User className="w-4 h-4 text-antique-gold" />
                <span>Đăng Nhập</span>
              </motion.button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
