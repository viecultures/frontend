import React, { useState } from 'react';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

interface LandingHeaderProps {
  onNavigate?: (view: string) => void;
  onScrollToSegment: (elementId: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onNavigate,
  onScrollToSegment,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {/* Desktop Navigation (Concise Vietnamese, Removed Home) */}
        <nav
          className="hidden md:flex items-center gap-7 lg:gap-8 text-xs sm:text-sm font-bold tracking-wide text-text-main"
          aria-label="Điều hướng Landing Page"
        >
          <button
            type="button"
            onClick={handleLogoClick}
            className="text-heritage-green hover:text-mountain-teal transition-colors cursor-pointer py-1 border-b-2 border-heritage-green"
          >
            Trang Chủ
          </button>
          <button
            type="button"
            onClick={() => handleScrollClick('featured-articles')}
            className="hover:text-mountain-teal text-text-muted transition-colors cursor-pointer py-1"
          >
            Bài Viết
          </button>
          <button
            type="button"
            onClick={() => handleScrollClick('topics')}
            className="hover:text-mountain-teal text-text-muted transition-colors cursor-pointer py-1"
          >
            Chủ Đề
          </button>
          <button
            type="button"
            onClick={() => handleScrollClick('trusted-community')}
            className="hover:text-mountain-teal text-text-muted transition-colors cursor-pointer py-1"
          >
            Đại Sứ
          </button>
          <button
            type="button"
            onClick={() => handleScrollClick('contact')}
            className="hover:text-mountain-teal text-text-muted transition-colors cursor-pointer py-1"
          >
            Liên Hệ
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3.5">
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
            className="px-5 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer focus-ring"
          >
            Bắt Đầu Học Miễn Phí
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
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
        <div className="md:hidden bg-surface border-b border-line px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 text-sm font-bold text-text-main">
            <button
              type="button"
              onClick={handleLogoClick}
              className="text-left text-heritage-green py-2 border-b border-line/40"
            >
              Trang Chủ
            </button>
            <button
              type="button"
              onClick={() => handleScrollClick('featured-articles')}
              className="text-left text-text-muted hover:text-heritage-green py-2 border-b border-line/40"
            >
              Bài Viết
            </button>
            <button
              type="button"
              onClick={() => handleScrollClick('topics')}
              className="text-left text-text-muted hover:text-heritage-green py-2 border-b border-line/40"
            >
              Chủ Đề
            </button>
            <button
              type="button"
              onClick={() => handleScrollClick('trusted-community')}
              className="text-left text-text-muted hover:text-heritage-green py-2 border-b border-line/40"
            >
              Đại Sứ
            </button>
            <button
              type="button"
              onClick={() => handleScrollClick('contact')}
              className="text-left text-text-muted hover:text-heritage-green py-2"
            >
              Liên Hệ
            </button>
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
