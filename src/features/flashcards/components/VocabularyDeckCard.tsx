import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import type { Lesson } from '@/data/discoveryData';
import { resolveDeckCards } from '@/data/flashcardsData';
import { VOCABULARY_CATEGORY_LABELS } from '../lib/vocabulary-catalog';
import { DeckCoverIllustration } from './DeckCoverIllustration';

interface VocabularyDeckCardProps {
  lesson: Lesson;
  onGoToStudy: (lessonId: string) => void;
  onInspectLesson: (lesson: Lesson) => void;
}

export function VocabularyDeckCard({ lesson, onGoToStudy, onInspectLesson }: VocabularyDeckCardProps) {
  const handlePreview = () => onInspectLesson(lesson);
  const handleStudy = () => onGoToStudy(lesson.id);

  return (
    <article className="vocab-deck">
      <button className={`vocab-deck-cover bg-gradient-to-br ${lesson.gradient}`} onClick={handlePreview} aria-label={`Preview ${lesson.title}`}>
        <DeckCoverIllustration category={lesson.category} className="vocab-deck-art" />
        <span className="vocab-deck-category">{VOCABULARY_CATEGORY_LABELS[lesson.category]}</span>
        <span className="vocab-deck-level">{lesson.cefrLevel}</span>
      </button>
      <div className="vocab-deck-body">
        <p className="vocab-deck-meta"><Layers size={14} />{resolveDeckCards(lesson.id).length} vocabulary cards<span>EN / VI</span></p>
        <h3><button onClick={handlePreview}>{lesson.title}</button></h3>
        <p className="vocab-deck-subtitle">{lesson.summary}</p>
        <div className="vocab-deck-footer">
          <button className="vocab-deck-preview" onClick={handlePreview}><BookOpen size={15} />Preview words</button>
          <button className="vocab-deck-study" onClick={handleStudy}>Study now<ArrowRight size={15} /></button>
        </div>
      </div>
    </article>
  );
}
