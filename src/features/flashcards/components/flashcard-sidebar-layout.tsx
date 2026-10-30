import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { PATHS } from '@/routes/paths';
import { AddWordModal } from './AddWordModal';
import { VocabularyMobileNav } from './VocabularyMobileNav';
import { VocabularySidebar } from './VocabularySidebar';
import '../vocabulary.css';

interface FlashcardSidebarLayoutProps {
  children: ReactNode;
}

export function FlashcardSidebarLayout({ children }: FlashcardSidebarLayoutProps) {
  const location = useLocation();
  const navigate = useAppNavigate();
  const [isAddWordOpen, setIsAddWordOpen] = useState(false);
  const isStudy = location.pathname === PATHS.flashcardStudy;
  const handleOpenAddWord = () => setIsAddWordOpen(true);
  const handleCloseAddWord = () => setIsAddWordOpen(false);

  return (
    <div className={`vocab-shell ${isStudy ? 'vocab-study-shell' : ''} text-text-body flex flex-col lg:flex-row font-sans selection:bg-sky-mist selection:text-heritage-green`}>
      <VocabularyMobileNav currentPath={location.pathname} onNavigate={navigate} onAddWord={handleOpenAddWord} />
      <VocabularySidebar currentPath={location.pathname} search={location.search} onNavigate={navigate} onAddWord={handleOpenAddWord} />
      <main className="vocab-main flex-1 min-w-0 w-full">{children}</main>
      <AddWordModal isOpen={isAddWordOpen} onClose={handleCloseAddWord} studyStyle={isStudy} className={isStudy ? undefined : 'dictionary-dialog'} />
    </div>
  );
}

export default FlashcardSidebarLayout;
