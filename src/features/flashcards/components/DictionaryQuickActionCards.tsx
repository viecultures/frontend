import { ArrowRight, BookOpen, Compass, BookmarkCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Lesson } from "@/data/discoveryData";
import { DeckCoverIllustration } from "./DeckCoverIllustration";

interface DictionaryQuickActionCardsProps {
  onGoToRecent: () => void;
  onExploreMore: () => void;
  onReviewSaved: () => void;
  savedWordCount: number;
  featuredLesson?: Lesson | null;
  totalDecksCount?: number;
}

export function DictionaryQuickActionCards({
  onGoToRecent,
  onExploreMore,
  onReviewSaved,
  savedWordCount,
  featuredLesson,
  totalDecksCount = 0,
}: DictionaryQuickActionCardsProps) {
  const { t, i18n } = useTranslation('flashcards');
  const isVi = (i18n.language || '').startsWith('vi');

  const displayTitle = featuredLesson
    ? (isVi ? featuredLesson.vietnameseTitle : featuredLesson.title)
    : t('dictionary.featured_title_emphasis', 'a taste of Hanoi pho.');

  const displayDesc = featuredLesson
    ? (isVi ? (featuredLesson.summaryVi || featuredLesson.summary) : featuredLesson.summary)
    : t('dictionary.featured_desc', 'Explore Hanoi pho, one flashcard at a time.');

  const cardCount = featuredLesson?.vocabCount || (featuredLesson?.dbVocabularies?.length ?? 10);
  const featuredCategory = featuredLesson?.category || 'Cuisine';

  return (
    <section className="vocab-actions" aria-label={t('dictionary.quick_actions_aria', 'Start learning vocabulary')}>
      <article className="vocab-featured">
        <DeckCoverIllustration category={featuredCategory} className="vocab-featured-image" />
        <div className="vocab-featured-content">
          <span className="vocab-featured-label">
            <BookOpen size={14} />
            {t('dictionary.todays_pick', 'TODAY’S PICK')}
          </span>
          <h2>
            {t('dictionary.featured_title_prefix', 'A little English,')}<br />
            {displayTitle}
          </h2>
          <p className="line-clamp-2">{displayDesc}</p>
          <div className="vocab-featured-footer">
            <button className="vocab-button vocab-button-gold" onClick={onGoToRecent}>
              {t('dictionary.start_learning', 'Start learning')}
              <ArrowRight size={16} />
            </button>
            <span>
              <BookOpen size={15} />
              {t('deck_card.vocab_cards_count', { count: cardCount, defaultValue: `${cardCount} vocabulary cards` })}
            </span>
          </div>
        </div>
      </article>
      <div className="vocab-secondary-actions">
        <button className="vocab-action-tile" onClick={onExploreMore}>
          <span className="vocab-tile-icon"><Compass size={22} /></span>
          <span className="vocab-tile-copy">
            <strong>{t('dictionary.explore_decks', 'Explore the decks')}</strong>
            <span>{t('dictionary.explore_decks_subtitle', { count: totalDecksCount, defaultValue: `${totalDecksCount} cuisine decks` })}</span>
          </span>
          <ArrowRight size={18} />
        </button>
        {savedWordCount > 0 && <button className="vocab-action-tile vocab-action-create" onClick={onReviewSaved}>
          <span className="vocab-tile-icon"><BookmarkCheck size={23} /></span>
          <span className="vocab-tile-copy">
            <strong>{t('dictionary.review_saved', 'Review saved words')}</strong>
            <span>{t('dictionary.review_saved_count', { count: savedWordCount, defaultValue: `${savedWordCount} words ready to review` })}</span>
          </span>
          <ArrowRight size={18} />
        </button>}
      </div>
    </section>
  );
}
