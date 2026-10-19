import { BookMarked, PlusCircle, Sparkles } from 'lucide-react';
import { PATHS } from '@/routes/paths';

interface VocabularyMobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onAddWord: () => void;
}

export function VocabularyMobileNav({ currentPath, onNavigate, onAddWord }: VocabularyMobileNavProps) {
  return (
    <nav className="vocab-mobile-nav lg:hidden" aria-label="Vocabulary navigation">
      <button onClick={() => onNavigate(PATHS.dictionary)} aria-current={currentPath === PATHS.dictionary ? 'page' : undefined}><BookMarked size={16} />Library</button>
      <button onClick={onAddWord}><PlusCircle size={16} />Add word</button>
      <button onClick={() => onNavigate(PATHS.flashcardStudy)} aria-current={currentPath === PATHS.flashcardStudy ? 'page' : undefined}><Sparkles size={16} />Review</button>
    </nav>
  );
}
