import { useMemo } from 'react';
import { ArrowUpRight, BookOpen, BookmarkCheck } from 'lucide-react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { useTranslation } from 'react-i18next';
import { listSavedArticles, getAllSavedVocabularies } from '@/services/learning/learningStorage';
import { getAllSRSStates, type CardSRSState } from '@/features/flashcards/services/srsEngine';
import { paths } from '@/routes/paths';

export function SavedVocabularyDecks() {
  const { t, i18n } = useTranslation(['flashcards', 'home']);
  const isVi = i18n.language.toLowerCase().startsWith('vi');
  const articles = listSavedArticles().filter(({ count }) => count > 0);

  // Compute live vocabulary groups across saved words & SRS state
  const { total, again, hard, good, easy, unreviewed } = useMemo(() => {
    const savedVocab = getAllSavedVocabularies();
    const srsStates = getAllSRSStates();

    let againCount = 0;
    let hardCount = 0;
    let goodCount = 0;
    let easyCount = 0;
    let unreviewedCount = 0;

    const wordMap = new Map<string, { id?: string; word: string; srs?: CardSRSState }>();

    savedVocab.forEach((item) => {
      const key = item.word.toLowerCase();
      if (!wordMap.has(key)) {
        wordMap.set(key, { id: item.id, word: item.word });
      }
    });

    Object.values(srsStates).forEach((record) => {
      const key = record.word.toLowerCase();
      if (wordMap.has(key)) {
        wordMap.get(key)!.srs = record;
      } else {
        wordMap.set(key, { id: record.vocabId, word: record.word, srs: record });
      }
    });

    wordMap.forEach(({ id, word, srs }) => {
      const srsRecord = srs || (id ? srsStates[id] : undefined) || srsStates[word.toLowerCase()];
      if (srsRecord && srsRecord.lastRating) {
        switch (srsRecord.lastRating) {
          case 'again':
            againCount++;
            break;
          case 'hard':
            hardCount++;
            break;
          case 'good':
            goodCount++;
            break;
          case 'easy':
            easyCount++;
            break;
          default:
            unreviewedCount++;
            break;
        }
      } else {
        unreviewedCount++;
      }
    });

    return {
      total: wordMap.size,
      again: againCount,
      hard: hardCount,
      good: goodCount,
      easy: easyCount,
      unreviewed: unreviewedCount,
    };
  }, []);

  if (!articles.length && total === 0) return null;

  const totalWords = articles.reduce((sum, { count }) => sum + count, 0);
  const denominator = total > 0 ? total : 1;
  const againPct = (again / denominator) * 100;
  const hardPct = (hard / denominator) * 100;
  const goodPct = (good / denominator) * 100;
  const easyPct = (easy / denominator) * 100;
  const unreviewedPct = (unreviewed / denominator) * 100;

  return (
    <section className="vocab-notebook" aria-labelledby="vocab-notebook-title">
      <div className="vocab-notebook-heading">
        <div className="vocab-notebook-heading-icon" aria-hidden="true"><BookmarkCheck size={22} /></div>
        <div className="vocab-notebook-heading-copy">
          <p className="vocab-eyebrow">{t('saved_decks.eyebrow', 'YOUR COLLECTION')}</p>
          <h2 id="vocab-notebook-title">{t('saved_decks.title', 'Words saved from reading')}</h2>
          <p>{t('saved_decks.subtitle', 'Your personal review list · Stored in this browser')}</p>
        </div>
        <span className="vocab-notebook-total">
          {t('saved_decks.words_count', { count: totalWords, defaultValue: `${totalWords} saved words` })}
        </span>
      </div>

      {/* Vocabulary Mastery Breakdown (Transferred from Home) */}
      <div
        className="vocab-notebook-mastery"
        aria-label={`Trí nhớ: ${again} Quên mất, ${hard} Khó nhớ, ${good} Nhớ rồi, ${easy} Thuộc làu${unreviewed > 0 ? `, ${unreviewed} Chưa ôn` : ''}`}
      >
        <div className="vocab-notebook-mastery-stats">
          <div className="vocab-notebook-stat">
            <span className="vocab-notebook-dot dot-again" aria-hidden="true" />
            <span>{t('home:vocabulary_card.rating_again', 'Quên mất')}</span>
            <b>{again}</b>
          </div>
          <div className="vocab-notebook-stat">
            <span className="vocab-notebook-dot dot-hard" aria-hidden="true" />
            <span>{t('home:vocabulary_card.rating_hard', 'Khó nhớ')}</span>
            <b>{hard}</b>
          </div>
          <div className="vocab-notebook-stat">
            <span className="vocab-notebook-dot dot-good" aria-hidden="true" />
            <span>{t('home:vocabulary_card.rating_good', 'Nhớ rồi')}</span>
            <b>{good}</b>
          </div>
          <div className="vocab-notebook-stat">
            <span className="vocab-notebook-dot dot-easy" aria-hidden="true" />
            <span>{t('home:vocabulary_card.rating_easy', 'Thuộc làu')}</span>
            <b>{easy}</b>
          </div>
          {unreviewed > 0 && (
            <div className="vocab-notebook-stat opacity-70">
              <span className="vocab-notebook-dot dot-unreviewed" aria-hidden="true" />
              <span>{t('home:vocabulary_card.unreviewed_label', 'Chưa ôn')}</span>
              <b>{unreviewed}</b>
            </div>
          )}
        </div>

        <div
          className="vocab-notebook-distribution"
          role="img"
          aria-label={`Distribution: ${againPct.toFixed(0)}% Quên mất, ${hardPct.toFixed(0)}% Khó nhớ, ${goodPct.toFixed(0)}% Nhớ rồi, ${easyPct.toFixed(0)}% Thuộc làu`}
        >
          {total > 0 ? (
            <>
              <span style={{ width: `${againPct}%` }} className="vocab-bar-again" />
              <span style={{ width: `${hardPct}%` }} className="vocab-bar-hard" />
              <span style={{ width: `${goodPct}%` }} className="vocab-bar-good" />
              <span style={{ width: `${easyPct}%` }} className="vocab-bar-easy" />
              {unreviewed > 0 && (
                <span style={{ width: `${unreviewedPct}%` }} className="vocab-bar-unreviewed" />
              )}
            </>
          ) : (
            <span style={{ width: '100%' }} className="vocab-bar-empty" />
          )}
        </div>
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
