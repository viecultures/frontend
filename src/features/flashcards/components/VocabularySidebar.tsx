import { ArrowRight, BookMarked, PlusCircle, Sparkles } from 'lucide-react';
import { PATHS } from '@/routes/paths';

interface VocabularySidebarProps {
  currentPath: string;
  search: string;
  onNavigate: (path: string) => void;
  onAddWord: () => void;
}

export function VocabularySidebar({ currentPath, search, onNavigate, onAddWord }: VocabularySidebarProps) {
  const isLibrary = currentPath === PATHS.dictionary || currentPath === '/flashcard-library';
  const isStudy = currentPath === PATHS.flashcardStudy;
  const itemClass = 'w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer focus-ring';
  const activeClass = 'bg-rice-paper text-heritage-green border border-antique-gold/50 shadow-xs';
  const inactiveClass = 'text-text-body hover:bg-rice-paper/60 hover:text-heritage-green';

  return (
    <aside className="vocab-sidebar hidden lg:flex sticky top-20 left-0 z-40 h-[calc(100vh-5rem)] w-56 shrink-0 bg-surface border-r border-line p-4 flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        <div className="vocab-sidebar-heading"><BookMarked size={18} /><span>STUDY SPACE</span></div>
        <nav className="space-y-1.5" aria-label="Flashcard navigation">
          <button onClick={() => onNavigate(PATHS.dictionary)} aria-current={isLibrary ? 'page' : undefined} className={`${itemClass} ${isLibrary ? activeClass : inactiveClass}`}>
            <BookMarked className="w-5 h-5 text-antique-gold" /><span>Vocabulary library</span>
          </button>
          <button onClick={onAddWord} className={`${itemClass} text-heritage-green hover:bg-rice-paper/60`}>
            <PlusCircle className="w-5 h-5 text-antique-gold" /><span>Add a word</span>
          </button>
          <button onClick={() => onNavigate(PATHS.flashcardStudy)} aria-current={isStudy ? 'page' : undefined} className={`${itemClass} ${isStudy && !search.includes('mode=match') ? activeClass : inactiveClass}`}>
            <Sparkles className="w-5 h-5 text-antique-gold" /><span>Spaced review</span>
          </button>
        </nav>
      </div>
      <div className="p-4 rounded-3xl bg-gradient-to-br from-heritage-green to-heritage-dark text-warm-ivory space-y-2 border border-antique-gold/40 shadow-md">
        <div className="flex items-center gap-1.5 text-xs font-bold text-antique-gold"><Sparkles className="w-4 h-4" /><span>Learning community</span></div>
        <p className="text-[11px] text-sky-mist leading-relaxed">Share new words and explore Vietnamese culture through stories.</p>
        <button onClick={() => onNavigate(PATHS.community)} className="w-full py-2 rounded-xl bg-antique-gold hover:bg-antique-bright text-heritage-dark font-bold text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1 focus-ring">
          <span>Join the community</span><ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
