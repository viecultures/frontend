import React from 'react';

interface LandingHeaderProps {
  onNavigate?: (view: string) => void;
  onScrollToSegment: (elementId: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  onNavigate,
  onScrollToSegment,
}) => {
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-heritage-dark/95 border-b border-antique-gold/25 backdrop-blur-xl transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group focus-ring-dark rounded-xl"
          onClick={handleLogoClick}
          role="button"
          tabIndex={0}
          aria-label="Về đầu trang VieCultures"
        >
          <div className="w-10 h-10 rounded-full border border-antique-gold/50 bg-heritage-green flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
            🪷
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-2xl text-warm-ivory tracking-tight group-hover:text-antique-gold transition-colors">
              Vie<span className="text-antique-gold">Cultures</span>
            </span>
          </div>
        </div>

        {/* Quick Jump Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-warm-ivory/90"
          aria-label="Điều hướng Landing Page"
        >
          <button
            type="button"
            onClick={() => onScrollToSegment('ban-do-di-san')}
            className="hover:text-antique-gold transition-colors cursor-pointer focus-ring-dark"
          >
            Bản Đồ Di Sản
          </button>
          <button
            type="button"
            onClick={() => onScrollToSegment('lo-trinh-hoc')}
            className="hover:text-antique-gold transition-colors cursor-pointer focus-ring-dark"
          >
            Phương Pháp Học
          </button>
          <button
            type="button"
            onClick={() => onScrollToSegment('tap-chi-di-san')}
            className="hover:text-antique-gold transition-colors cursor-pointer focus-ring-dark"
          >
            Tạp Chí Văn Hóa
          </button>
          <button
            type="button"
            onClick={() => onScrollToSegment('cam-nhan-hoc-vien')}
            className="hover:text-antique-gold transition-colors cursor-pointer focus-ring-dark"
          >
            Cộng Đồng
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavClick('discovery')}
            className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory border border-antique-gold/40 font-bold text-xs transition-all shadow-xs cursor-pointer focus-ring-dark"
          >
            Khám Phá Bài Học
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('login')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-antique-bright to-antique-gold text-heritage-forest font-bold text-xs hover:brightness-105 transition-all shadow-sm cursor-pointer focus-ring-dark"
          >
            Đăng Nhập
          </button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
