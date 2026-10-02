import React, { useState } from 'react';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

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

  const navLinks = [
    { name: 'Trang Chủ', segment: 'hero' },
    { name: 'Bài Viết', segment: 'featured-articles' },
    { name: 'Chủ Đề', segment: 'topics' },
    { name: 'Chức năng', segment: 'ban-do-di-san' },
    { name: 'Liên Hệ', segment: 'contact' },
  ];

  const handleLogoClick = () => {
    onScrollToSegment('hero');
  };

  const handleNavClick = (view: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
    }
  };

  const handleScrollClick = (elementId: string) => {
    setIsMobileMenuOpen(false);
    onScrollToSegment(elementId);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/95 border-b border-line backdrop-blur-xl transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <BrandLogo
          size="md"
          theme="light"
          onClick={handleLogoClick}
          className="focus-ring rounded-xl cursor-pointer"
        />

        {/* Desktop Navigation with Minimalist Heritage-Green Underline */}
        <nav
          className="hidden lg:flex items-center gap-7 xl:gap-9 text-[13px] font-bold tracking-wide"
          aria-label="Điều hướng Landing Page"
        >
          {navLinks.map((link) => {
            const isActive = activeSegment === link.segment;
            return (
              <button
                key={link.segment}
                type="button"
                onClick={() => handleScrollClick(link.segment)}
                className={`relative py-1.5 px-0.5 transition-all duration-200 cursor-pointer font-bold select-none group bg-transparent border-0 outline-none ${
                  isActive
                    ? 'text-heritage-green font-extrabold'
                    : 'text-text-muted hover:text-heritage-green'
                }`}
              >
                <span>{link.name}</span>

                {/* Solid Heritage-Green Underline Accent */}
                <span
                  className={`absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-heritage-green transition-all duration-300 ease-out ${
                    isActive
                      ? 'w-full opacity-100'
                      : 'w-0 group-hover:w-full opacity-0 group-hover:opacity-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavClick('discovery')}
            className="p-2 text-text-muted hover:text-heritage-green hover:bg-mist-cloud/40 rounded-xl transition-colors cursor-pointer focus-ring"
            aria-label="Tìm kiếm bài học"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('login')}
            className="text-xs font-bold uppercase tracking-wider text-text-main hover:text-mountain-teal transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg focus-ring"
          >
            Đăng Nhập
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('discovery')}
            className="px-4 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer focus-ring shrink-0"
          >
            Bắt Đầu Học Miễn Phí
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => handleNavClick('discovery')}
            className="p-2 text-text-muted hover:text-heritage-green rounded-lg"
            aria-label="Tìm kiếm"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-text-main hover:bg-mist-cloud/40 rounded-lg"
            aria-label="Mở menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-line px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1.5 text-sm font-bold">
            {navLinks.map((link) => {
              const isActive = activeSegment === link.segment;
              return (
                <button
                  key={link.segment}
                  type="button"
                  onClick={() => handleScrollClick(link.segment)}
                  className={`text-left py-2 px-3 rounded-lg transition-colors border-b border-line/30 flex items-center justify-between ${
                    isActive
                      ? 'text-heritage-green bg-antique-gold/20 font-extrabold shadow-xs'
                      : 'text-text-muted hover:text-heritage-green hover:bg-mist-cloud/40'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-antique-gold" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-line flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleNavClick('login')}
              className="w-full py-2.5 rounded-xl border border-line text-xs font-bold uppercase tracking-wider text-text-main hover:bg-mist-cloud/40"
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('discovery')}
              className="w-full py-3 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Bắt Đầu Học Miễn Phí</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
