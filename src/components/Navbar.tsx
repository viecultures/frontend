import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BookOpen, Compass, Home, User, MapPin, Layers, Users, BookMarked, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { BrandLogo } from './BrandLogo';
import { ProfileDropdown } from './ProfileDropdown';

import { PATHS } from '@/routes/paths';
import type { AppUser } from '@/utils/auth-storage';

interface NavbarProps {
  activeView?: string;
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onNavigateToSection: (sectionId: string) => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

// ─── Nav link class helpers ────────────────────────────────────────────────────
const NAV_LINK_BASE =
  'min-h-11 transition-colors py-2 px-3 rounded-lg flex items-center gap-2 cursor-pointer focus-ring-dark';

const navLinkClass = (isActive: boolean) =>
  `${NAV_LINK_BASE} ${isActive
    ? 'bg-white/10 text-warm-ivory font-semibold'
    : 'text-warm-ivory/85 hover:text-warm-ivory hover:bg-white/10'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const hoverScale = 1;
  const tapScale = shouldReduceMotion ? 1 : 0.97;

  const scrollToAnchor = (anchorId: string) => {
    const el = document.getElementById(anchorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigateToSection(PATHS.landing);
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
          <motion.button
            type="button"
            aria-label="VieCultures home"
            whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
            whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
            className="cursor-pointer focus-ring-dark rounded-xl"
            onClick={() => onNavigateToSection(isLoggedIn ? PATHS.home : PATHS.landing)}
          >
            <BrandLogo size="md" theme="dark" />
          </motion.button>

          {/* ── Center Nav Links (desktop only) ─────────────────────────── */}
          <nav
            id="main-navigation"
            className={`${isMenuOpen ? 'flex' : 'hidden'} absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-white/10 bg-heritage-dark p-4 flex-col gap-1 text-xs font-medium text-warm-ivory/90 xl:static xl:flex xl:flex-row xl:items-center xl:overflow-visible xl:border-0 xl:bg-transparent xl:p-0`}
            aria-label="Main navigation"
            onClick={() => setIsMenuOpen(false)}
          >
            {isLoggedIn ? (
              /* LOGGED IN: Functional App Pages */
              <>
                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection(PATHS.home)}
                  className={navLinkClass(activeView === 'home')}
                  aria-current={activeView === 'home' ? 'page' : undefined}
                >
                  <Home className="w-4 h-4 text-antique-gold" />
                  <span>Study room</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection(PATHS.discovery)}
                  className={navLinkClass(activeView === 'discovery')}
                  aria-current={activeView === 'discovery' ? 'page' : undefined}
                >
                  <Compass className="w-4 h-4 text-antique-gold" />
                  <span>Discover</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection(PATHS.reader)}
                  className={navLinkClass(activeView === 'reader' || activeView === 'bilingual-reader')}
                  aria-current={activeView === 'reader' || activeView === 'bilingual-reader' ? 'page' : undefined}
                >
                  <BookOpen className="w-4 h-4 text-antique-gold" />
                  <span>Read</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection(PATHS.dictionary)}
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
                  <span>Vocabulary</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection(PATHS.community)}
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
                  <span>Community</span>
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
                  <span>Cultural map</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => scrollToAnchor('topics')}
                  className={`${NAV_LINK_BASE} text-warm-ivory/90 hover:text-antique-gold hover:bg-heritage-green/50`}
                >
                  <Layers className="w-4 h-4 text-antique-gold" />
                  <span>Culture topics</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => scrollToAnchor('interactive-demo')}
                  className={`${NAV_LINK_BASE} text-warm-ivory/90 hover:text-antique-gold hover:bg-heritage-green/50`}
                >
                  <BookOpen className="w-4 h-4 text-antique-gold" />
                  <span>Try reading</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={() => onNavigateToSection(PATHS.discovery)}
                  className={navLinkClass(activeView === 'discovery')}
                  aria-current={activeView === 'discovery' ? 'page' : undefined}
                >
                  <Compass className="w-4 h-4 text-antique-gold" />
                  <span>Discover</span>
                </motion.button>

              </>
            )}
          </nav>

          {/* ── Right Actions ────────────────────────────────────────────── */}
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="xl:hidden text-warm-ivory enabled:hover:bg-white/10 enabled:hover:text-warm-ivory focus-ring-dark"
              aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isMenuOpen}
              aria-controls="main-navigation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>

            {isLoggedIn ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: hoverScale }}
                  whileTap={{ scale: tapScale }}
                  onClick={handleProfileClick}
                  className="relative flex items-center justify-center w-11 h-11 rounded-full bg-heritage-green border border-warm-ivory/30 cursor-pointer group focus-ring-dark overflow-hidden p-0.5"
                  title="Account menu"
                  aria-label="Account menu"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="menu"
                >
                  {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                    <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-xs font-bold text-antique-gold">
                      {user?.avatar || 'NL'}
                    </span>
                  )}
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
                onClick={() => onNavigateToSection(PATHS.login)}
                className={`min-h-11 min-w-11 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus-ring-dark ${activeView === 'login'
                  ? 'bg-antique-gold text-heritage-dark ring-2 ring-antique-gold'
                  : 'bg-heritage-green text-warm-ivory hover:bg-heritage-dark border border-antique-gold/40'
                  }`}
                aria-label="Sign in to VieCultures"
              >
                <User className="w-4 h-4 text-antique-gold" />
                <span className="hidden sm:inline">Sign in</span>
              </motion.button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
