import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowRight, BookMarked } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { listSavedArticles, articleKey, readReviewSession, readSavedVocabulary } from '@/services/learning/learningStorage';
import { cardsFromVocabulary } from '@/features/flashcards/services/studyDeck';
import { restoreReviewSession } from '@/features/flashcards/lib/reviewSession';
import { PATHS, paths } from '@/routes/paths';

export function HomeReviewCard() {
  const { t, i18n } = useTranslation('home');
  const decks = listSavedArticles().filter(item => item.count > 0).map(item => {
    const cards = cardsFromVocabulary(readSavedVocabulary(item.article.id, item.level));
    const session = restoreReviewSession(readReviewSession(articleKey(item.article.id, item.level) + ':saved'), cards);
    return { ...item, remaining: cards.filter(card => session.ratings[card.id] !== 'mastered').length };
  });
  const selected = decks.find(deck => deck.remaining > 0) || decks[0];
  const count = decks.reduce((total, deck) => total + deck.count, 0);

  const selectedTitle = selected
    ? (i18n.language === 'vi' ? selected.article.titleVi : selected.article.titleEn)
    : '';

  return <section className="home-room-review home-room-panel" aria-labelledby="home-review-title">
    <div className="home-room-section-heading">
      <p className="home-room-eyebrow">{t('review_card.eyebrow', 'WORDS IN CONTEXT')}</p>
      <BookMarked size={20} aria-hidden="true" />
    </div>
    <h2 id="home-review-title">
      {count ? (
        <>
          <span className="home-room-word-count">{count}</span>{' '}
          {count === 1 ? t('review_card.saved_words', 'saved word') : t('review_card.saved_words_count', { count, defaultValue: `${count} saved words` })}
        </>
      ) : (
        t('review_card.empty_title', 'Make new words your own.')
      )}
    </h2>
    <p>
      {selected ? (
        <>
          {t('review_card.revisit_desc', 'Revisit words from')} <strong>{selectedTitle}</strong>.
        </>
      ) : (
        t('review_card.empty_desc', 'Save a word while reading. Your vocabulary practice starts here.')
      )}
    </p>
    <Link className="home-room-primary" to={selected ? paths.flashcardStudy({ deck: selected.article.id, level: selected.level, saved: true }) : PATHS.dictionary}>
      {selected ? t('review_card.btn_review', 'Review saved words') : t('review_card.btn_explore', 'Explore vocabulary')}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
    <p className="home-room-footnote">{t('review_card.saved_in_browser', 'Saved in this browser')}</p>
  </section>;
}
