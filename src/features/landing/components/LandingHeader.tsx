import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { PATHS } from '@/routes/paths';
import { getStoredUser, getStoredToken } from '@/utils/auth-storage';

interface LandingHeaderProps {
  onNavigate?: (view: string) => void;
  onScrollToSegment: (elementId: string) => void;
  activeSegment?: string;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onNavigate, onScrollToSegment, activeSegment = 'hero' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser() || !!getStoredToken());
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!getStoredUser() || !!getStoredToken());
    };
    window.addEventListener('auth:change', handleAuthChange);
    return () => window.removeEventListener('auth:change', handleAuthChange);
  }, []);
  const navLinks = [
    { name: 'Discover', segment: 'featured-articles' },
    { name: 'Topics', segment: 'topics' },
    { name: 'How it works', segment: 'methodology' },
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
    <header className="landing-header">
      <div className="landing-container landing-header-inner">
        <button type="button" onClick={() => scroll('hero')} className="landing-brand" aria-label="VieCultures — back to top">
          <BrandLogo size="md" theme="light" />
        </button>
        <nav className="landing-desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <button key={link.segment} type="button" onClick={() => scroll(link.segment)} aria-current={activeSegment === link.segment ? 'location' : undefined}>
              {link.name}
            </button>
          ))}
        </nav>
        <div className="landing-header-actions">
          <button type="button" className="landing-playground" onClick={() => navigate(PATHS.playground)} aria-label="Try the AI companion" title="Try the AI companion"><Sparkles size={18} aria-hidden="true" /></button>
          {isLoggedIn ? (
            <button type="button" className="landing-login" onClick={() => navigate(PATHS.home)}>
              Go to study room
            </button>
          ) : (
            <button type="button" className="landing-login" onClick={() => navigate(PATHS.login)}>
              Sign in
            </button>
          )}
          <button type="button" className="landing-button landing-button-primary landing-header-cta" onClick={() => navigate(PATHS.discovery)}>
            Start learning <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          <button ref={menuButtonRef} type="button" className="landing-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-expanded={isMobileMenuOpen} aria-controls="landing-mobile-menu" aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <nav id="landing-mobile-menu" className="landing-mobile-nav landing-container" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <button key={link.segment} type="button" onClick={() => scroll(link.segment)} aria-current={activeSegment === link.segment ? 'location' : undefined}>{link.name}<ArrowUpRight size={16} /></button>
          ))}
          <button type="button" onClick={() => navigate(PATHS.playground)}><span className="flex items-center gap-2"><Sparkles size={16} /> Try the AI companion</span><ArrowUpRight size={16} /></button>
          {isLoggedIn ? (
            <button type="button" onClick={() => navigate(PATHS.home)}>Go to study room<ArrowUpRight size={16} /></button>
          ) : (
            <button type="button" onClick={() => navigate(PATHS.login)}>Sign in<ArrowUpRight size={16} /></button>
          )}
          <button type="button" className="landing-button landing-button-primary" onClick={() => navigate(PATHS.discovery)}>Start learning for free<ArrowUpRight size={16} /></button>
        </nav>
      )}
    </header>
  );
};

export default LandingHeader;
