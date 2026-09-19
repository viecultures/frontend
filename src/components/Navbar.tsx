import React from 'react';
import { Search, User, FileText } from 'lucide-react';
import { BRAND_ASSETS } from '../assets';

interface NavbarProps {
  onOpenDocs: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDocs,
  onNavigateToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF7EE]/95 border-b border-[#E8DFCB] backdrop-blur-md transition-all shadow-[0_2px_12px_rgba(30,75,67,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. Logo & Slogan (from design.md) */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigateToSection('hero')}
          >
            <div className="relative w-11 h-11 rounded-full border border-[#D9B76A]/40 overflow-hidden bg-white shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <img 
                src={BRAND_ASSETS.logo} 
                alt="VieCultures Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-2xl tracking-tight text-[#1E4B43] group-hover:text-[#3D6E70] transition-colors">
                  VieCultures
                </span>
              </div>
              <span className="text-xs text-[#6B635B] font-normal italic tracking-wide border-t border-[#E8DFCB] pt-0.5 mt-0.5">
                Khắc ghi nguồn cội, gìn giữ văn hóa
              </span>
            </div>
          </div>

          {/* 2. Navigation Links (Khám phá, Từ vựng, Sổ tay của tôi) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2C2523]">
            <a
              href="#kham-pha"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToSection('kham-pha');
              }}
              className="hover:text-[#1E4B43] transition-colors py-1 relative group"
            >
              <span>Khám phá</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1E4B43] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#tu-vung"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToSection('tu-vung');
              }}
              className="hover:text-[#1E4B43] transition-colors py-1 relative group"
            >
              <span>Từ vựng</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1E4B43] group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#so-tay"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToSection('so-tay');
              }}
              className="hover:text-[#1E4B43] transition-colors py-1 relative group"
            >
              <span>Sổ tay của tôi</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1E4B43] group-hover:w-full transition-all duration-300" />
            </a>
          </nav>

          {/* 3. Navigation Actions (Search, Account, Design.md Drawer) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateToSection('search')}
              className="w-10 h-10 rounded-full border border-[#E8DFCB] bg-[#F6EEDC] text-[#1E4B43] hover:bg-[#FDFBF7] hover:border-[#D9B76A] flex items-center justify-center transition-all shadow-sm"
              aria-label="Tìm kiếm"
              title="Tìm kiếm bài học & từ vựng"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateToSection('account')}
              className="w-10 h-10 rounded-full border border-[#E8DFCB] bg-[#F6EEDC] text-[#1E4B43] hover:bg-[#FDFBF7] hover:border-[#D9B76A] flex items-center justify-center transition-all shadow-sm"
              aria-label="Tài khoản"
              title="Tài khoản cá nhân"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDocs}
              className="btn-pill-glass text-xs px-3.5 py-2 flex items-center gap-1.5"
              title="Xem đặc tả tài liệu thiết kế (design.md)"
            >
              <FileText className="w-3.5 h-3.5 text-[#1E4B43]" />
              <span className="hidden sm:inline">Design.md</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
