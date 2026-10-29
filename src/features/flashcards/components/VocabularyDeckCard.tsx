import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Lesson } from '@/data/discoveryData';
import { resolveDeckCards } from '@/data/flashcardsData';
import { DeckCoverIllustration } from './DeckCoverIllustration';

interface VocabularyDeckCardProps {
  lesson: Lesson;
  onGoToStudy: (lessonId: string) => void;
  onInspectLesson: (lesson: Lesson) => void;
}

export function VocabularyDeckCard({ lesson, onGoToStudy, onInspectLesson }: VocabularyDeckCardProps) {
  const { t } = useTranslation('flashcards');
  const handlePreview = () => onInspectLesson(lesson);
  const handleStudy = () => onGoToStudy(lesson.id);

  return (
    <article className="vocab-deck">
      <button
        className={`vocab-deck-cover bg-gradient-to-br ${lesson.gradient}`}
        onClick={handlePreview}
        aria-label={t('deck_card.preview_aria', { title: lesson.title, defaultValue: `Preview ${lesson.title}` })}
      >
        <DeckCoverIllustration category={lesson.category} className="vocab-deck-art" />
        <span className="vocab-deck-category">{t(`categories.${lesson.category}`, lesson.category)}</span>
        <span className="vocab-deck-level">{lesson.cefrLevel}</span>
      </button>
      <div className="vocab-deck-body">
        <p className="vocab-deck-meta">
          <Layers size={14} />
          {t('deck_card.vocab_cards_count', { count: resolveDeckCards(lesson.id).length, defaultValue: `${resolveDeckCards(lesson.id).length} vocabulary cards` })}
          <span>{t('deck_card.lang_pair', 'EN / VI')}</span>
        </p>
        <h3><button onClick={handlePreview}>{lesson.title}</button></h3>
        <p className="vocab-deck-subtitle">{lesson.summary}</p>
        <div className="vocab-deck-footer">
          <button className="vocab-deck-preview" onClick={handlePreview}>
            <BookOpen size={15} />
            {t('deck_card.btn_preview', 'Preview words')}
          </button>
          <button className="vocab-deck-study" onClick={handleStudy}>
            {t('deck_card.btn_study', 'Study now')}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
