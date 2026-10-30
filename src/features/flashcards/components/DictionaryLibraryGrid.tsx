import { SearchX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Lesson } from '@/data/discoveryData';
import { VocabularyDeckCard } from './VocabularyDeckCard';

interface DictionaryLibraryGridProps {
  lessons: Lesson[];
  onGoToStudy: (lessonId: string) => void;
  onInspectLesson: (lesson: Lesson) => void;
}

export function DictionaryLibraryGrid({ lessons, onGoToStudy, onInspectLesson }: DictionaryLibraryGridProps) {
  const { t } = useTranslation('flashcards');

  if (!lessons.length) return (
    <div className="vocab-empty" role="status">
      <SearchX size={32} />
      <h3>{t('dictionary.no_matching_decks', 'No matching decks')}</h3>
      <p>{t('dictionary.no_matching_decks_desc', 'Try another search or select All topics.')}</p>
    </div>
  );
  return (
    <div className="vocab-library-grid">
      {lessons.map(lesson => <VocabularyDeckCard key={lesson.id} lesson={lesson} onGoToStudy={onGoToStudy} onInspectLesson={onInspectLesson} />)}
    </div>
  );
}
