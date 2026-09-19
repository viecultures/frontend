import React, { useState } from 'react';
import { BookOpen, Sparkles, FileText, Compass, Layout, MessageSquare, Trophy, Layers, Home, User } from 'lucide-react';
import logoImg from '../assets/logo/logo.jpg';

interface NavbarProps {
  activeView?: string;
  onOpenDocs: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'home',
  onOpenDocs,
  onNavigateToSection,
}) => {
  const [isReaderDropdownOpen, setIsReaderDropdownOpen] = useState(false);
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0D1C18]/90 border-b border-white/15 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo & Editorial Identity */}
          <div
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => onNavigateToSection('landing')}
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
              </div>
              <p className="text-xs text-white/65 font-normal tracking-wide">
                Học Tiếng Anh Qua Nghệ Thuật &amp; Di Sản
              </p>
            </div>
          </div>

          {/* Center Main Nav matching Wireframe Specification */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-white/85">
            {/* 0. Landing */}
            <button
              onClick={() => onNavigateToSection('landing')}
              className={`transition-colors py-2 px-3 rounded-lg flex items-center gap-1.5 ${activeView === 'landing' ? 'text-[#FCE5B5] bg-white/10 font-bold border-b-2 border-[#FCE5B5]' : 'hover:text-[#FCE5B5]'
                }`}
            >
              <span>Landing</span>
            </button>

            {/* 1. Home Dashboard */}
            <button
              onClick={() => onNavigateToSection('home')}
              className={`transition-colors py-2 px-3 rounded-lg flex items-center gap-1.5 ${activeView === 'home' ? 'text-[#FCE5B5] bg-white/10 font-bold border-b-2 border-[#FCE5B5]' : 'hover:text-[#FCE5B5]'
                }`}
            >
              <Home className="w-4 h-4 text-[#F5D280]" />
              <span>Home</span>
            </button>

            {/* 2. Discovery */}
            <button
              onClick={() => onNavigateToSection('discovery')}
              className={`transition-colors py-2 px-3 rounded-lg flex items-center gap-1.5 ${activeView === 'discovery' ? 'text-[#FCE5B5] bg-white/10 font-bold border-b-2 border-[#FCE5B5]' : 'hover:text-[#FCE5B5]'
                }`}
            >
              <Compass className="w-4 h-4 text-[#F5D280]" />
              <span>Discovery</span>
            </button>

            {/* 3. Reader Dropdown (Matching Wireframe Reader ▾) */}
            <div
              className="relative"
              onMouseEnter={() => setIsReaderDropdownOpen(true)}
              onMouseLeave={() => setIsReaderDropdownOpen(false)}
            >
              <button
                onClick={() => onNavigateToSection('bilingual-reader')}
                className={`transition-colors py-2 px-3 rounded-lg flex items-center gap-1.5 ${activeView === 'bilingual-reader' ? 'text-[#FCE5B5] bg-white/10 font-bold border-b-2 border-[#FCE5B5]' : 'hover:text-[#FCE5B5]'
                  }`}
              >
                <BookOpen className="w-4 h-4 text-[#F5D280]" />
                <span>Reader ▾</span>
              </button>

              {/* Reader Dropdown Menu */}
              {isReaderDropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="bg-[#122A22] border border-white/20 rounded-xl shadow-2xl p-2 backdrop-blur-xl space-y-1">
                    <button
                      onClick={() => {
                        onNavigateToSection('demo-reader');
                        setIsReaderDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-white/90 hover:bg-white/15 hover:text-[#FCE5B5] transition-colors flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-[#F5D280]" />
                      <span>Layout 1: Modal Song Ngữ</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateToSection('bilingual-reader');
                        setIsReaderDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-white/90 hover:bg-white/15 hover:text-[#FCE5B5] transition-colors flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>Layout 2: Classic Stacked View</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Flashcards */}
            <button
              onClick={() => onNavigateToSection('flashcard-study')}
              className={`transition-colors py-2 px-3 rounded-lg flex items-center gap-1.5 ${activeView === 'flashcard-study' ? 'text-[#FCE5B5] bg-white/10 font-bold border-b-2 border-[#FCE5B5]' : 'hover:text-[#FCE5B5]'
                }`}
            >
              <Sparkles className="w-4 h-4 text-[#F5D280]" />
              <span>Flashcards</span>
            </button>

            {/* 5. Community Dropdown (Matching Wireframe Community ▾) */}
            <div
              className="relative"
              onMouseEnter={() => setIsCommunityDropdownOpen(true)}
              onMouseLeave={() => setIsCommunityDropdownOpen(false)}
            >
              <button
                onClick={() => onNavigateToSection('community-1')}
                className={`transition-colors py-2 px-3 rounded-lg flex items-center gap-1.5 ${activeView === 'community-1' || activeView === 'community-2'
                  ? 'text-[#FCE5B5] bg-white/10 font-bold border-b-2 border-[#FCE5B5]'
                  : 'hover:text-[#FCE5B5]'
                  }`}
              >
                <span>Community ▾</span>
              </button>

              {/* Community Dropdown Menu */}
              {isCommunityDropdownOpen && (
                <div className="absolute top-full left-0 w-72 pt-2 z-50">
                  <div className="bg-[#122A22] border border-white/20 rounded-xl shadow-2xl p-2 backdrop-blur-xl space-y-1">
                    <button
                      onClick={() => {
                        onNavigateToSection('community-1');
                        setIsCommunityDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-white/90 hover:bg-white/15 hover:text-[#FCE5B5] transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Community 1: Member Reflections</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateToSection('community-2');
                        setIsCommunityDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-white/90 hover:bg-white/15 hover:text-[#FCE5B5] transition-colors flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4 text-[#F5D280]" />
                      <span>Community 2: Cultural Contest Hub</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToSection('login')}
              className={`btn-pill-primary text-xs px-3.5 py-2 flex items-center gap-1.5 ${
                activeView === 'login' ? 'ring-2 ring-[#FCE5B5]' : ''
              }`}
            >
              <User className="w-4 h-4 text-[#18221E]" />
              <span>Login</span>
            </button>
            <a
              href="./layout/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-glass text-xs px-3.5 py-2 flex items-center gap-1.5"
              title="Xem Wireframe Layout Prototype HTML/CSS"
            >
              <Layout className="w-4 h-4 text-[#F5D280]" />
              <span className="hidden sm:inline">Wireframe</span>
            </a>
            <button
              onClick={onOpenDocs}
              className="btn-pill-glass text-xs px-3.5 py-2"
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
