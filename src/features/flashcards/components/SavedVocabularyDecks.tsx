import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { useTranslation } from 'react-i18next';
import { listSavedArticles } from '@/services/learning/learningStorage';
import { paths } from '@/routes/paths';

export function SavedVocabularyDecks() {
  const { t, i18n } = useTranslation('flashcards');
  const isVi = i18n.language === 'vi';
  const articles = listSavedArticles();
  if (!articles.length) return null;

  return <section className="p-5 rounded-2xl bg-surface border border-line space-y-3" aria-label={t('saved_decks.title', 'Your vocabulary notebook')}>
    <h2 className="font-serif text-xl text-heritage-green font-bold">{t('saved_decks.title', 'Your vocabulary notebook')}</h2>
    <p className="text-xs">{t('saved_decks.subtitle', 'Words saved from reading articles · Stored in this browser')}</p>
    {articles.map(({ article, level, count }) => {
      const title = isVi ? article.titleVi : (article.titleEn || article.titleVi);
      return (
        <Link key={article.id + level} className="block border-t border-line py-3 text-heritage-green" to={paths.flashcardStudy({ deck: article.id, level, saved: true })}>
          {title} · {level} · {t('saved_decks.words_count', { count, defaultValue: `${count} saved words` })} →
        </Link>
      );
    })}
  </section>;
}
