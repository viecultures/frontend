import { BookMarked, PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';

interface VocabularyMobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onAddWord: () => void;
}

export function VocabularyMobileNav({ currentPath, onNavigate, onAddWord }: VocabularyMobileNavProps) {
  const { t } = useTranslation('flashcards');

  return (
    <nav className="vocab-mobile-nav lg:hidden" aria-label={t('mobile_nav.aria_nav', 'Vocabulary navigation')}>
      <button onClick={() => onNavigate(PATHS.dictionary)} aria-current={currentPath === PATHS.dictionary ? 'page' : undefined}>
        <BookMarked size={16} />
        {t('mobile_nav.library', 'Library')}
      </button>
      <button onClick={onAddWord}>
        <PlusCircle size={16} />
        {t('mobile_nav.add_word', 'Add word')}
      </button>
      <button onClick={() => onNavigate(PATHS.flashcardStudy)} aria-current={currentPath === PATHS.flashcardStudy ? 'page' : undefined}>
        <BookMarked size={16} />
        {t('mobile_nav.review', 'Review')}
      </button>
    </nav>
  );
}
