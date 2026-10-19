import { SearchX } from 'lucide-react';
import type { Lesson } from '@/data/discoveryData';
import { VocabularyDeckCard } from './VocabularyDeckCard';

interface DictionaryLibraryGridProps {
  lessons: Lesson[];
  onGoToStudy: (lessonId: string) => void;
  onInspectLesson: (lesson: Lesson) => void;
}

export function DictionaryLibraryGrid({ lessons, onGoToStudy, onInspectLesson }: DictionaryLibraryGridProps) {
  if (!lessons.length) return (
    <div className="vocab-empty" role="status"><SearchX size={32} /><h3>No matching decks</h3><p>Try another search or select All topics.</p></div>
  );
  return (
    <div className="vocab-library-grid">
      {lessons.map(lesson => <VocabularyDeckCard key={lesson.id} lesson={lesson} onGoToStudy={onGoToStudy} onInspectLesson={onInspectLesson} />)}
    </div>
  );
}
