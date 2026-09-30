import React from 'react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const handleNav = (view: string) => {
    window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-heritage-dark text-warm-ivory border-t border-antique-gold/30 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" theme="dark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            <p className="text-xs sm:text-sm text-warm-ivory/80 leading-relaxed max-w-sm font-normal">
              Nền tảng EdTech học tiếng Anh qua ngữ cảnh văn hóa Việt Nam. Nâng tầm vốn từ &amp; trở thành sứ giả văn hóa.
            </p>
          </div>

          {/* Col 1: Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-antique-gold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-warm-ivory/80 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('discovery')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  Discovery Feed
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('bilingual-reader')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  Bilingual Reader
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('dictionary')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  Flashcards
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('community')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  Community
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Topics */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-antique-gold">
              Topics
            </h4>
            <ul className="space-y-2 text-xs text-warm-ivory/80 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('topics')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  History &amp; Heritage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('topics')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  Cuisine &amp; Coffee
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('topics')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  Arts &amp; Craft Villages
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('topics')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  Festivals &amp; Beliefs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Legal */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-antique-gold">
              Contact &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-warm-ivory/80 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleScrollTo('contact')}
                  className="hover:text-antique-bright transition-colors cursor-pointer"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <span className="hover:text-antique-bright transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-antique-bright transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-antique-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-ivory/60 font-medium">
          <p>&copy; 2026 VieCultures • VN Culture Reader. All rights reserved.</p>
          <p>Nâng Tầm Tiếng Anh — Trở Thành Sứ Giả Văn Hóa Việt</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
