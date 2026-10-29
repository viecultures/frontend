import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/BrandLogo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { PATHS } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { getStoredUser, getStoredToken } from '@/utils/auth-storage';

interface LandingHeaderProps {
  onNavigate?: (view: string) => void;
  onScrollToSegment: (elementId: string) => void;
  activeSegment?: string;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onNavigate,
  onScrollToSegment,
  activeSegment = 'hero',
}) => {
  const { t } = useTranslation(['landing', 'common']);
  const appNavigate = useAppNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser() || !!getStoredToken());
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        setIsLoggedIn(!!getStoredUser() || !!getStoredToken());
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
    { name: t('navigation.discover', { defaultValue: 'Discover' }), segment: 'featured-articles' },
    { name: t('navigation.topics', { defaultValue: 'Topics' }), segment: 'topics' },
    { name: t('navigation.heritage_map', { defaultValue: 'Heritage Map' }), segment: 'ban-do-di-san' },
    { name: t('navigation.how_it_works', { defaultValue: 'How It Works' }), segment: 'methodology' },
    { name: t('navigation.contact', { defaultValue: 'Contact' }), segment: 'contact' },
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

  const navigate = (view: string) => {
    try {
      setIsMobileMenuOpen(false);
      if (onNavigate) {
        onNavigate(view);
      } else {
        appNavigate(view);
      }
    } catch (error) {
      console.error('[LandingHeader] Navigation error:', error);
    }
  };

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
            <button
              type="button"
              className="landing-login focus-ring"
              onClick={() => navigate(PATHS.home)}
            >
              {t('navigation.study_room', { defaultValue: 'Study Room' })}
            </button>
          ) : (
            <button
              type="button"
              className="landing-login focus-ring"
              onClick={() => navigate(PATHS.login)}
            >
              {t('navigation.sign_in', { defaultValue: 'Sign In' })}
            </button>
          )}

          <button
            type="button"
            className="landing-button landing-button-primary landing-header-cta focus-ring"
            onClick={() => navigate(PATHS.discovery)}
          >
            {t('navigation.start_learning', { defaultValue: 'Start Learning' })}{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </button>

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
          <div className="flex items-center justify-between py-2 border-b border-line mb-1">
            <span className="text-xs font-medium text-ink-soft">
              {t('navigation.language', { defaultValue: 'Ngôn ngữ' })}
            </span>
            <LanguageSwitcher />
          </div>
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
            <button type="button" onClick={() => navigate(PATHS.home)}>
              {t('navigation.study_room', { defaultValue: 'Study Room' })}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" onClick={() => navigate(PATHS.login)}>
              {t('navigation.sign_in', { defaultValue: 'Sign In' })}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="landing-button landing-button-primary mt-2"
            onClick={() => navigate(PATHS.discovery)}
          >
            {t('navigation.start_learning', { defaultValue: 'Start Learning' })}{' '}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </nav>
      )}
    </header>
  );
};

export default LandingHeader;
