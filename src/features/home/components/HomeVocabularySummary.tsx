import { useMemo } from 'react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS, paths } from '@/routes/paths';
import { getAllSavedVocabularies, listSavedArticles } from '@/services/learning/learningStorage';
import { getAllSRSStates } from '@/features/flashcards/services/srsEngine';

export function HomeVocabularySummary() {
  const { t } = useTranslation('home');

  // Compute live data from real application storage
  const { total, mastered, familiar, learning, dueToday, estimatedMinutes, reviewUrl } = useMemo(() => {
    const savedVocab = getAllSavedVocabularies();
    const srsStates = getAllSRSStates();
    const decks = listSavedArticles().filter(item => item.count > 0);

    const now = Date.now();
    let masteredCount = 0;
    let familiarCount = 0;
    let learningCount = 0;
    let dueCount = 0;

    // Track processed word keys to avoid double-counting
    const processedWords = new Set<string>();

    // 1. Process SRS tracked records
    Object.values(srsStates).forEach((record) => {
      processedWords.add(record.word.toLowerCase());
      if (record.status === 'mastered') {
        masteredCount++;
      } else if (record.status === 'review') {
        familiarCount++;
      } else {
        // 'learning' or 'new'
        learningCount++;
      }

      // Check if due
      if (new Date(record.dueDate).getTime() <= now) {
        dueCount++;
      }
    });

    // 2. Count any saved vocabulary words that haven't entered SRS state yet (as 'learning' + due)
    savedVocab.forEach((item) => {
      const normalized = item.word.toLowerCase();
      if (!processedWords.has(normalized)) {
        processedWords.add(normalized);
        learningCount++;
        dueCount++;
      }
    });

    const totalWords = masteredCount + familiarCount + learningCount;
    const estMin = Math.max(1, Math.ceil(dueCount * 0.5));

    const selectedDeck = decks[0];
    const targetReviewUrl = selectedDeck
      ? paths.flashcardStudy({ deck: selectedDeck.article.id, level: selectedDeck.level, saved: true })
      : PATHS.flashcardStudy;

    return {
      total: totalWords,
      mastered: masteredCount,
      familiar: familiarCount,
      learning: learningCount,
      dueToday: dueCount,
      estimatedMinutes: estMin,
      reviewUrl: targetReviewUrl,
    };
  }, []);

  // Proportional percentages for the segmented bar (guarding against divide by 0)
  const masteredPct = total > 0 ? (mastered / total) * 100 : 0;
  const familiarPct = total > 0 ? (familiar / total) * 100 : 0;
  const learningPct = total > 0 ? (learning / total) * 100 : 0;

  return (
    <section className="home-vocab-card" aria-label={t('vocabulary_card.eyebrow', 'YOUR VOCABULARY')}>
      {/* Top row: Eyebrow + count and Notebook link */}
      <div className="home-vocab-top">
        <div>
          <span className="home-eyebrow">
            {t('vocabulary_card.eyebrow', 'YOUR VOCABULARY')}
          </span>
          <h2 className="home-vocab-title">
            <b>{total}</b> <span>{t('vocabulary_card.words_collected', 'words collected')}</span>
          </h2>
        </div>
        <Link className="home-notebook-link" to={PATHS.dictionary}>
          <span>{t('vocabulary_card.btn_open_notebook', 'Open notebook')}</span>
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {/* Middle row: 3 memory levels */}
      <div
        className="home-vocab-breakdown"
        aria-label={`${mastered} ${t('vocabulary_card.mastered')}, ${familiar} ${t('vocabulary_card.familiar')}, ${learning} ${t('vocabulary_card.learning')}`}
      >
        <div className="home-vocab-stat">
          <span className="home-vocab-dot home-dot-mastered" aria-hidden="true" />
          <span>{t('vocabulary_card.mastered', 'Mastered')}</span>
          <b>{mastered}</b>
        </div>
        <div className="home-vocab-stat">
          <span className="home-vocab-dot home-dot-familiar" aria-hidden="true" />
          <span>{t('vocabulary_card.familiar', 'Familiar')}</span>
          <b>{familiar}</b>
        </div>
        <div className="home-vocab-stat">
          <span className="home-vocab-dot home-dot-learning" aria-hidden="true" />
          <span>{t('vocabulary_card.learning', 'Learning')}</span>
          <b>{learning}</b>
        </div>
      </div>

      {/* Segmented distribution bar */}
      <div
        className="home-vocab-distribution"
        role="img"
        aria-label={`Distribution: ${masteredPct.toFixed(0)}% mastered, ${familiarPct.toFixed(0)}% familiar, ${learningPct.toFixed(0)}% learning`}
      >
        {total > 0 ? (
          <>
            <span style={{ width: `${masteredPct}%` }} className="home-bar-mastered" />
            <span style={{ width: `${familiarPct}%` }} className="home-bar-familiar" />
            <span style={{ width: `${learningPct}%` }} className="home-bar-learning" />
          </>
        ) : (
          <span style={{ width: '100%' }} className="home-bar-empty" />
        )}
      </div>

      {/* Bottom row: Due count + Review CTA */}
      <div className="home-vocab-due-row">
        <div className="home-vocab-due-info">
          {dueToday > 0 ? (
            <>
              <b className="home-vocab-due-text">
                <span className="home-vocab-due-dot" aria-hidden="true" />
                <span>
                  {dueToday === 1
                    ? t('vocabulary_card.due_today_count_one', '1 word due today')
                    : t('vocabulary_card.due_today_count', { count: dueToday, defaultValue: `${dueToday} words due today` })}
                </span>
              </b>
              <span className="home-due-estimate">
                {estimatedMinutes === 1
                  ? t('vocabulary_card.about_minute', 'About 1 minute')
                  : t('vocabulary_card.about_minutes', { count: estimatedMinutes, defaultValue: `About ${estimatedMinutes} minutes` })}
              </span>
            </>
          ) : (
            <b className="home-vocab-due-text">
              <span className="home-vocab-due-dot home-due-dot-clear" aria-hidden="true" />
              <span>{t('vocabulary_card.all_caught_up', 'All caught up for today')}</span>
            </b>
          )}
        </div>

        <Link className="home-primary-btn home-vocab-review-btn" to={reviewUrl}>
          <span>{t('vocabulary_card.btn_review_now', 'Review now')}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

// Backward-compatibility export
export const HomeVocabularyCard = HomeVocabularySummary;
