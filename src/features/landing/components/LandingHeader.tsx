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
    { name: 'Khám phá', segment: 'featured-articles' },
    { name: 'Chủ đề', segment: 'topics' },
    { name: 'Cách học', segment: 'methodology' },
    { name: 'Liên hệ', segment: 'contact' },
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
        <button type="button" onClick={() => scroll('hero')} className="landing-brand" aria-label="VieCultures — về đầu trang">
          <BrandLogo size="md" theme="light" />
        </button>
        <nav className="landing-desktop-nav" aria-label="Điều hướng chính">
          {navLinks.map((link) => (
            <button key={link.segment} type="button" onClick={() => scroll(link.segment)} aria-current={activeSegment === link.segment ? 'location' : undefined}>
              {link.name}
            </button>
          ))}
        </nav>
        <div className="landing-header-actions">
          <button type="button" className="landing-playground" onClick={() => navigate(PATHS.playground)} aria-label="Mở AI Playground" title="AI Playground"><Sparkles size={18} aria-hidden="true" /></button>
          {isLoggedIn ? (
            <button type="button" className="landing-login" onClick={() => navigate(PATHS.home)}>
              Vào phòng học
            </button>
          ) : (
            <button type="button" className="landing-login" onClick={() => navigate(PATHS.login)}>
              Đăng nhập
            </button>
          )}
          <button type="button" className="landing-button landing-button-primary landing-header-cta" onClick={() => navigate(PATHS.discovery)}>
            Bắt đầu học <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          <button ref={menuButtonRef} type="button" className="landing-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-expanded={isMobileMenuOpen} aria-controls="landing-mobile-menu" aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <nav id="landing-mobile-menu" className="landing-mobile-nav landing-container" aria-label="Điều hướng trên điện thoại">
          {navLinks.map((link) => (
            <button key={link.segment} type="button" onClick={() => scroll(link.segment)} aria-current={activeSegment === link.segment ? 'location' : undefined}>{link.name}<ArrowUpRight size={16} /></button>
          ))}
          <button type="button" onClick={() => navigate(PATHS.playground)}><span className="flex items-center gap-2"><Sparkles size={16} /> AI Playground</span><ArrowUpRight size={16} /></button>
          {isLoggedIn ? (
            <button type="button" onClick={() => navigate(PATHS.home)}>Vào phòng học<ArrowUpRight size={16} /></button>
          ) : (
            <button type="button" onClick={() => navigate(PATHS.login)}>Đăng nhập<ArrowUpRight size={16} /></button>
          )}
          <button type="button" className="landing-button landing-button-primary" onClick={() => navigate(PATHS.discovery)}>Bắt đầu học miễn phí<ArrowUpRight size={16} /></button>
        </nav>
      )}
    </header>
  );
};

export default LandingHeader;
