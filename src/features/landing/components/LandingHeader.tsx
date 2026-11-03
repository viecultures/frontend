import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowRight, LogIn, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/BrandLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { PATHS } from '@/routes/paths';
import { getStoredUser, getStoredToken, type AppUser } from '@/utils/auth-storage';

interface LandingHeaderProps {
  onScrollToSegment: (elementId: string) => void;
  activeSegment?: string;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onScrollToSegment,
  activeSegment = 'hero',
}) => {
  const { t } = useTranslation(['landing', 'common']);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<AppUser | null>(() => getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser() || !!getStoredToken());
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const currentUser = getStoredUser();
        const token = getStoredToken();
        setUser(currentUser);
        setIsLoggedIn(!!currentUser || !!token);
      } catch (error) {
        console.error('[LandingHeader] Failed to read auth state:', error);
      }
    };

    window.addEventListener('auth:change', handleAuthChange);
    return () => window.removeEventListener('auth:change', handleAuthChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('navigation.discover', { defaultValue: 'Bài đọc' }), segment: 'featured-articles' },
    { name: t('navigation.how_it_works', { defaultValue: 'Phương pháp' }), segment: 'methodology' },
    { name: t('navigation.heritage_map', { defaultValue: 'Bản đồ di sản' }), segment: 'ban-do-di-san' },
    { name: t('navigation.plans', { defaultValue: 'Gói học' }), segment: 'plans' },
    { name: t('navigation.contact', { defaultValue: 'Liên hệ' }), segment: 'contact' },
  ];

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMobileMenuOpen]);

  const scroll = (segment: string) => {
    try {
      setIsMobileMenuOpen(false);
      onScrollToSegment(segment);
    } catch (error) {
      console.error('[LandingHeader] Scroll error:', error);
    }
  };

  return (
    <header
      className={`landing-header transition-all duration-300 ${
        isScrolled ? 'landing-header-scrolled shadow-sm' : ''
      }`}
    >
      <div className="landing-container landing-header-inner">
        <button
          type="button"
          onClick={() => scroll('hero')}
          className="landing-brand focus-ring"
          aria-label="VieCultures — back to top"
        >
          <BrandLogo size="md" theme="light" />
        </button>

        <nav className="landing-desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              key={link.segment}
              type="button"
              onClick={() => scroll(link.segment)}
              className="focus-ring"
              aria-current={activeSegment === link.segment ? 'location' : undefined}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="landing-header-actions">
          <LanguageSwitcher />

          {isLoggedIn ? (
            <Link
              to={PATHS.home}
              className="landing-login focus-ring"
              title={t('navigation.study_room', { defaultValue: 'Phòng học' })}
            >
              <User size={16} aria-hidden="true" className="landing-login-icon" />
              <span>{user?.name?.trim().split(' ')[0] || t('navigation.study_room', { defaultValue: 'Phòng học' })}</span>
            </Link>
          ) : (
            <Link
              to={PATHS.login}
              className="landing-login focus-ring"
              title={t('navigation.sign_in', { defaultValue: 'Đăng nhập' })}
            >
              <LogIn size={16} aria-hidden="true" className="landing-login-icon" />
              <span>{t('navigation.sign_in', { defaultValue: 'Đăng nhập' })}</span>
            </Link>
          )}

          <Link
            to={PATHS.discovery}
            className="landing-button landing-button-primary landing-header-cta focus-ring"
          >
            {t('navigation.explore_stories', { defaultValue: 'Khám phá bài đọc' })}{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className="landing-menu-toggle focus-ring"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
          >
            {isMobileMenuOpen ? (
              <X size={24} aria-hidden="true" />
            ) : (
              <Menu size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          id="landing-mobile-menu"
          className="landing-mobile-nav landing-container"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <button
              key={link.segment}
              type="button"
              onClick={() => scroll(link.segment)}
              aria-current={activeSegment === link.segment ? 'location' : undefined}
            >
              {link.name}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ))}

          {isLoggedIn ? (
            <Link
              to={PATHS.home}
              className="landing-mobile-login focus-ring"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="landing-mobile-login-label">
                <User size={16} aria-hidden="true" />
                <span>{user?.name || t('navigation.study_room', { defaultValue: 'Phòng học' })}</span>
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ) : (
            <Link
              to={PATHS.login}
              className="landing-mobile-login focus-ring"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="landing-mobile-login-label">
                <LogIn size={16} aria-hidden="true" />
                <span>{t('navigation.sign_in', { defaultValue: 'Đăng nhập' })}</span>
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}

          <Link
            to={PATHS.discovery}
            className="landing-button landing-button-primary mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('navigation.explore_stories', { defaultValue: 'Khám phá bài đọc' })}{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </nav>
      )}
    </header>
  );
};

export default LandingHeader;
