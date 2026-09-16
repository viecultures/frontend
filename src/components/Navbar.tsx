import React from 'react';
import { BookOpen, Sparkles, FileText, Compass, Award } from 'lucide-react';
import type { CEFRLevel } from '../types';
import logoImg from '../assets/logo/logo.jpg';

interface NavbarProps {
  selectedLevel: CEFRLevel | 'all';
  onSelectLevel: (level: CEFRLevel | 'all') => void;
  onOpenDocs: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLevel,
  onSelectLevel,
  onOpenDocs,
  onNavigateToSection,
}) => {
  const levels: (CEFRLevel | 'all')[] = ['all', 'A2', 'B1', 'B2', 'C1'];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6EE]/95 border-b-2 border-[#12332B] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Identity */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigateToSection('hero')}
          >
            <div className="relative w-12 h-12 rounded-[3px] border-2 border-[#12332B] shadow-[3px_3px_0px_#12332B] overflow-hidden bg-white shrink-0 group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[4px_4px_0px_#12332B] transition-all">
              <img 
                src={logoImg} 
                alt="VieCultures Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-2xl tracking-tight text-[#12332B]">
                  VieCultures
                </span>
                <span className="dongho-tag bg-[#E58396] text-[#12332B]">
                  Mỹ Thuật Đông Hồ
                </span>
              </div>
              <p className="text-xs text-[#4A635D] font-medium tracking-wide">
                Cổng Trải Nghiệm & Học Tiếng Anh Văn Hóa Việt
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-semibold text-[#12332B]">
            <button
              onClick={() => onNavigateToSection('discovery')}
              className="px-3.5 py-2 rounded-[3px] hover:bg-[#F8E9CF] border border-transparent hover:border-[#12332B] transition-all flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-[#1A7368]" />
              <span>Khám phá</span>
            </button>
            <button
              onClick={() => onNavigateToSection('demo-reader')}
              className="px-3.5 py-2 rounded-[3px] hover:bg-[#F8E9CF] border border-transparent hover:border-[#12332B] transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-[#1A7368]" />
              <span>Bài đọc song ngữ</span>
            </button>
            <button
              onClick={() => onNavigateToSection('demo-flashcards')}
              className="px-3.5 py-2 rounded-[3px] hover:bg-[#F8E9CF] border border-transparent hover:border-[#12332B] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#EAA22E]" />
              <span>Flashcard Mộc Bản</span>
            </button>
            <button
              onClick={() => onNavigateToSection('community')}
              className="px-3.5 py-2 rounded-[3px] hover:bg-[#F8E9CF] border border-transparent hover:border-[#12332B] transition-all flex items-center gap-1.5"
            >
              <span className="text-sm">💬</span>
              <span>Cảm nghĩ cộng đồng</span>
            </button>
          </nav>

          {/* Right Action: Level Switcher & Docs */}
          <div className="flex items-center gap-3">
            {/* Band Level Selector */}
            <div className="hidden lg:flex items-center bg-[#F8E9CF] p-1 rounded-[3px] border-2 border-[#12332B] text-xs">
              <span className="px-2 font-bold text-[#12332B] flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#EAA22E]" /> Trình độ:
              </span>
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onSelectLevel(lvl)}
                  className={`px-2.5 py-1 rounded-[2px] font-bold text-xs transition-all ${
                    selectedLevel === lvl
                      ? 'bg-[#1A7368] text-[#FAF6EE] shadow-[1px_1px_0px_#12332B]'
                      : 'text-[#12332B] hover:bg-[#FAF6EE]'
                  }`}
                >
                  {lvl === 'all' ? 'Tất cả' : lvl}
                </button>
              ))}
            </div>

            {/* View Specs / Docs */}
            <button
              onClick={onOpenDocs}
              className="dongho-btn dongho-btn-paper text-xs px-3.5 py-2"
              title="Xem đặc tả tài liệu dự án"
            >
              <FileText className="w-4 h-4 text-[#1A7368]" />
              <span className="hidden sm:inline">Tài liệu Design.md</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
