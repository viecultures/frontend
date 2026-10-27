import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { PATHS } from '@/routes/paths';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser() || !!getStoredToken());
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!getStoredUser() || !!getStoredToken());
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
    { name: 'Discover', segment: 'featured-articles' },
    { name: 'Topics', segment: 'topics' },
    { name: 'Heritage Map', segment: 'ban-do-di-san' },
    { name: 'How It Works', segment: 'methodology' },
    { name: 'Contact', segment: 'contact' },
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
    setIsMobileMenuOpen(false);
    onNavigate?.(view);
  };

  const scroll = (segment: string) => {
    setIsMobileMenuOpen(false);
    onScrollToSegment(segment);
  };

  return (
    <header className={`landing-header transition-all duration-300 ${isScrolled ? 'landing-header-scrolled shadow-sm' : ''}`}>
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

          {isLoggedIn ? (
            <button
              type="button"
              className="landing-login focus-ring"
              onClick={() => navigate(PATHS.home)}
            >
              Study Room
            </button>
          ) : (
            <button
              type="button"
              className="landing-login focus-ring"
              onClick={() => navigate(PATHS.login)}
            >
              Sign In
            </button>
          )}

          <button
            type="button"
            className="landing-button landing-button-primary landing-header-cta focus-ring"
            onClick={() => navigate(PATHS.discovery)}
          >
            Start Learning <ArrowRight size={16} aria-hidden="true" />
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
            {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
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
            <button type="button" onClick={() => navigate(PATHS.home)}>
              Study Room
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" onClick={() => navigate(PATHS.login)}>
              Sign In
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="landing-button landing-button-primary mt-2"
            onClick={() => navigate(PATHS.discovery)}
          >
            Start Learning <ArrowRight size={16} aria-hidden="true" />
          </button>
        </nav>
      )}
    </header>
  );
};

export default LandingHeader;
