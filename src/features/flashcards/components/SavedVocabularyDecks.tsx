import { ArrowUpRight, BookOpen, BookmarkCheck } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { useTranslation } from 'react-i18next';
import { listSavedArticles } from '@/services/learning/learningStorage';
import { paths } from '@/routes/paths';

export function SavedVocabularyDecks() {
  const { t, i18n } = useTranslation('flashcards');
  const isVi = i18n.language.toLowerCase().startsWith('vi');
  const articles = listSavedArticles().filter(({ count }) => count > 0);
  if (!articles.length) return null;

  const totalWords = articles.reduce((total, { count }) => total + count, 0);

  return (
    <section className="vocab-notebook" aria-labelledby="vocab-notebook-title">
      <div className="vocab-notebook-heading">
        <div className="vocab-notebook-heading-icon" aria-hidden="true"><BookmarkCheck size={22} /></div>
        <div className="vocab-notebook-heading-copy">
          <p className="vocab-eyebrow">{t('saved_decks.eyebrow', 'YOUR COLLECTION')}</p>
          <h2 id="vocab-notebook-title">{t('saved_decks.title', 'Words saved from reading')}</h2>
          <p>{t('saved_decks.subtitle', 'Your personal review list · Stored in this browser')}</p>
        </div>
        <span className="vocab-notebook-total">{t('saved_decks.words_count', { count: totalWords, defaultValue: `${totalWords} saved words` })}</span>
      </div>

      <div className="vocab-notebook-grid">
        {articles.map(({ article, level, count }) => {
          const title = isVi ? article.titleVi : (article.titleEn || article.titleVi);
          return (
            <Link key={`${article.id}:${level}`} className="vocab-notebook-card" to={paths.flashcardStudy({ deck: article.id, level, saved: true })}>
              <span className="vocab-notebook-card-main">
                <span className="vocab-notebook-cover" aria-hidden="true">
                  {article.imageUrl ? <img src={article.imageUrl} alt="" loading="lazy" /> : <BookOpen size={24} />}
                </span>
                <span className="vocab-notebook-card-copy">
                  <span className="vocab-notebook-level">{level}</span>
                  <strong>{title}</strong>
                  <span>{t('saved_decks.words_count', { count, defaultValue: `${count} saved words` })}</span>
                </span>
              </span>
              <span className="vocab-notebook-card-action">
                {t('saved_decks.review_action', 'Review saved words')}
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
