import React from 'react';
import { BookOpen, Sparkles, FileText, Compass, Award } from 'lucide-react';
import type { CEFRLevel } from '../types';

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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigateToSection('hero')}
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-[2px] shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-xl">🪷</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl tracking-tight bg-gradient-to-r from-amber-200 via-emerald-200 to-teal-300 bg-clip-text text-transparent">
                  VN Culture Reader
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  EdTech MVP
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Học Tiếng Anh Qua Bản Sắc Việt</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-sm font-medium text-slate-300">
            <button
              onClick={() => onNavigateToSection('discovery')}
              className="px-3.5 py-2 rounded-xl hover:text-amber-300 hover:bg-slate-800/60 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Khám phá</span>
            </button>
            <button
              onClick={() => onNavigateToSection('demo-reader')}
              className="px-3.5 py-2 rounded-xl hover:text-amber-300 hover:bg-slate-800/60 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Bài đọc song ngữ</span>
            </button>
            <button
              onClick={() => onNavigateToSection('demo-flashcards')}
              className="px-3.5 py-2 rounded-xl hover:text-amber-300 hover:bg-slate-800/60 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Flashcards 3D</span>
            </button>
            <button
              onClick={() => onNavigateToSection('community')}
              className="px-3.5 py-2 rounded-xl hover:text-amber-300 hover:bg-slate-800/60 transition-all flex items-center gap-2"
            >
              <span className="text-sm">💬</span>
              <span>Cộng đồng UGC</span>
            </button>
          </nav>

          {/* Right Action: Level Switcher & Docs */}
          <div className="flex items-center gap-3">
            {/* Band Level Selector */}
            <div className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Band:
              </span>
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onSelectLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  {lvl === 'all' ? 'Tất cả' : lvl}
                </button>
              ))}
            </div>

            {/* View Specs / Docs */}
            <button
              onClick={onOpenDocs}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-2 transition-all hover:border-amber-400/50"
              title="Xem đặc tả tài liệu dự án"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Tài liệu dự án</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
