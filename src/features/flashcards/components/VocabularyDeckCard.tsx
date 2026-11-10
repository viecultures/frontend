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
  const { t, i18n } = useTranslation('flashcards');
  const isVi = i18n.language === 'vi';
  const displayTitle = isVi
    ? (lesson.vietnameseTitle || lesson.title)
    : (lesson.title || lesson.vietnameseTitle);
  const displaySummary = isVi
    ? (lesson.summaryVi || lesson.summary)
    : (lesson.summary || lesson.summaryVi);
  const handlePreview = () => onInspectLesson(lesson);
  const handleStudy = () => onGoToStudy(lesson.id);

  const cardCount =
    lesson.dbVocabularies && lesson.dbVocabularies.length > 0
      ? lesson.dbVocabularies.length
      : typeof lesson.vocabCount === 'number' && lesson.vocabCount > 0
        ? lesson.vocabCount
        : resolveDeckCards(lesson.id).length;

  return (
    <article className="vocab-deck">
      <button
        className={`vocab-deck-cover bg-gradient-to-br ${lesson.gradient}`}
        onClick={handlePreview}
        aria-label={t('deck_card.preview_aria', { title: displayTitle, defaultValue: `Preview ${displayTitle}` })}
      >
        <DeckCoverIllustration category={lesson.category} className="vocab-deck-art" />
        <span className="vocab-deck-category">{t(`categories.${lesson.category}`, lesson.categoryVi || lesson.category)}</span>
        <span className="vocab-deck-level">{lesson.cefrLevel}</span>
      </button>
      <div className="vocab-deck-body">
        <p className="vocab-deck-meta">
          <Layers size={14} />
          {t('deck_card.vocab_cards_count', { count: cardCount, defaultValue: `${cardCount} vocabulary cards` })}
          <span>{t('deck_card.lang_pair', 'EN / VI')}</span>
        </p>
        <h3><button onClick={handlePreview}>{displayTitle}</button></h3>
        <p className="vocab-deck-subtitle">{displaySummary}</p>
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
