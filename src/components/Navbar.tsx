import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Menu, Settings, User, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ProfileDropdown } from './ProfileDropdown';
import { LanguageSwitcher } from './common/LanguageSwitcher';
import { PATHS, getLocalizedPath, resolveLanguage } from '@/routes/paths';
import i18n from '@/lib/i18n';
import type { AppUser } from '@/utils/auth-storage';

interface NavbarProps {
  activeView?: string;
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onNavigateToSection: (sectionId: string) => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
}

const navigation = [
  { label: 'Home', path: PATHS.home, active: ['home'] },
  { label: 'Learn', path: PATHS.discovery, active: ['discovery', 'reader'] },
  { label: 'Vocabulary', path: PATHS.dictionary, active: ['dictionary', 'flashcard-study'] },
  { label: 'Speak', path: PATHS.aiWorkspace, active: ['ai-workspace'] },
  { label: 'Community', path: PATHS.community, active: ['community', 'community-contest'] },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'landing',
  isLoggedIn = false,
  user,
  onNavigateToSection,
  onLogout,
  onOpenSettings,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { lang: paramLang } = useParams<{ lang?: string }>();
  const location = useLocation();

  const match = location.pathname.match(/^\/(vi|en)(\/|$)/);
  const currentLang = resolveLanguage(
    paramLang || (match ? match[1] : undefined) || i18n?.language
  );

  const handleNavigate = (path: string) => {
    try {
      setIsMenuOpen(false);
      onNavigateToSection(path);
    } catch (error) {
      console.error('[Navbar] Navigation error:', error);
    }
  };

  return (
    <header className="vc-navbar">
      <div className="vc-navbar-inner">
        <Link
          to={getLocalizedPath(PATHS.home, currentLang)}
          aria-label="VieCultures study room"
          className="vc-navbar-brand"
        >
          <BrandLogo size="md" theme="light" />
        </Link>
        <nav
          id="main-navigation"
          className={`vc-navbar-links${isMenuOpen ? ' is-open' : ''}`}
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={getLocalizedPath(item.path, currentLang)}
              onClick={() => setIsMenuOpen(false)}
              aria-current={item.active.includes(activeView) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="vc-navbar-actions">
          <LanguageSwitcher variant="compact" />
          {onOpenSettings && (
            <button
              type="button"
              className="vc-navbar-icon"
              onClick={onOpenSettings}
              aria-label="Room settings"
              title="Room settings"
            >
              <Settings size={19} />
            </button>
          )}
          {isLoggedIn ? (
            <div className="vc-navbar-profile">
              <button
                type="button"
                className="vc-navbar-avatar"
                onClick={() => setIsProfileOpen((value) => !value)}
                aria-label="Account menu"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
              >
                {user?.avatar && /^(https?:\/\/|\/)/.test(user.avatar) ? (
                  <img src={user.avatar} alt="" />
                ) : (
                  <span>
                    {user?.name?.trim().slice(0, 1).toUpperCase() || <User size={18} />}
                  </span>
                )}
              </button>
              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
                onLogout={onLogout}
                onNavigate={handleNavigate}
              />
            </div>
          ) : (
            <Link
              className="vc-navbar-signin"
              to={getLocalizedPath(PATHS.login, currentLang)}
            >
              Sign in
            </Link>
          )}
          <button
            type="button"
            className="vc-navbar-menu"
            aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
