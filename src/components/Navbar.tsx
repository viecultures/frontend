import React from 'react';
import { BookOpen, Sparkles, FileText, Compass } from 'lucide-react';
import logoImg from '../assets/logo/logo.jpg';

interface NavbarProps {
  onOpenDocs: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDocs,
  onNavigateToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D1C18]/85 border-b border-white/10 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Editorial Identity */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigateToSection('hero')}
          >
            <div className="relative w-11 h-11 rounded-full border border-white/25 overflow-hidden bg-white shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <img 
                src={logoImg} 
                alt="VieCultures Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-2xl tracking-tight text-[#FFFDF8] group-hover:text-[#FCE5B5] transition-colors">
                  VieCultures
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-medium text-[#F7E5C3]">
                  EdTech Văn Hóa
                </span>
              </div>
              <p className="text-xs text-white/65 font-normal tracking-wide">
                Học Tiếng Anh Qua Nghệ Thuật &amp; Di Sản
              </p>
            </div>
          </div>

          {/* Center Editorial Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-white/85">
            <button
              onClick={() => onNavigateToSection('discovery')}
              className="hover:text-[#FCE5B5] transition-colors flex items-center gap-1.5 py-1"
            >
              <Compass className="w-4 h-4 text-[#F5D280]" />
              <span>Khám phá</span>
            </button>
            <button
              onClick={() => onNavigateToSection('demo-reader')}
              className="hover:text-[#FCE5B5] transition-colors flex items-center gap-1.5 py-1"
            >
              <BookOpen className="w-4 h-4 text-[#F5D280]" />
              <span>Bài đọc song ngữ</span>
            </button>
            <button
              onClick={() => onNavigateToSection('demo-flashcards')}
              className="hover:text-[#FCE5B5] transition-colors flex items-center gap-1.5 py-1"
            >
              <Sparkles className="w-4 h-4 text-[#F5D280]" />
              <span>Flashcard 3D</span>
            </button>
            <button
              onClick={() => onNavigateToSection('community')}
              className="hover:text-[#FCE5B5] transition-colors flex items-center gap-1.5 py-1"
            >
              <span>💬</span>
              <span>Cộng đồng cảm nghĩ</span>
            </button>
          </nav>

          {/* Right Action: Design.md Specs Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDocs}
              className="btn-pill-glass text-xs px-4 py-2"
              title="Xem đặc tả tài liệu thiết kế"
            >
              <FileText className="w-4 h-4 text-[#F5D280]" />
              <span>Design.md</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
