import { useMemo } from 'react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ArrowRight, ArrowUpRight, BookMarked, Check, Compass } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS, paths } from '@/routes/paths';
import { getAllSavedVocabularies, listSavedArticles } from '@/services/learning/learningStorage';
import { getAllSRSStates, type CardSRSState } from '@/features/flashcards/services/srsEngine';

export function HomeVocabularySummary() {
  const { t } = useTranslation('home');

  // Compute live data from real application storage
  const {
    totalSaved,
    dueToday,
    estimatedMinutes,
    againCount,
    hardCount,
    goodCount,
    easyCount,
    unreviewedCount,
    reviewUrl,
  } = useMemo(() => {
    const savedVocab = getAllSavedVocabularies();
    const srsStates = getAllSRSStates();
    const decks = listSavedArticles().filter((item) => item.count > 0);

    const now = Date.now();
    let dueCount = 0;

    let again = 0;
    let hard = 0;
    let good = 0;
    let easy = 0;
    let unreviewed = 0;

    // Track all unique saved words across storage
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

      // 1. Spaced Repetition Due calculation (independent of tier, includes 'easy' if due)
      if (srsRecord) {
        if (new Date(srsRecord.dueDate).getTime() <= now) {
          dueCount++;
        }
      } else {
        // Unreviewed saved words are queued for study
        dueCount++;
      }

      // 2. Classify by latest rating (đánh giá gần nhất của mỗi từ)
      if (srsRecord && srsRecord.lastRating) {
        switch (srsRecord.lastRating) {
          case 'again':
            again++;
            break;
          case 'hard':
            hard++;
            break;
          case 'good':
            good++;
            break;
          case 'easy':
            easy++;
            break;
          default:
            unreviewed++;
            break;
        }
      } else {
        // Words not yet evaluated are kept separate (never falsely assigned to 'again')
        unreviewed++;
      }
    });

    const total = wordMap.size;
    const estMin = Math.max(1, Math.ceil(dueCount * 0.5));

    const selectedDeck = decks[0];
    const targetReviewUrl = selectedDeck
      ? paths.flashcardStudy({ deck: selectedDeck.article.id, level: selectedDeck.level, saved: true })
      : PATHS.flashcardStudy;

    return {
      totalSaved: total,
      dueToday: dueCount,
      estimatedMinutes: estMin,
      againCount: again,
      hardCount: hard,
      goodCount: good,
      easyCount: easy,
      unreviewedCount: unreviewed,
      reviewUrl: targetReviewUrl,
    };
  }, []);

  // Proportional percentages for the 4-segment distribution bar
  const totalEvaluated = againCount + hardCount + goodCount + easyCount;
  const denominator = totalSaved > 0 ? totalSaved : 1;
  const againPct = (againCount / denominator) * 100;
  const hardPct = (hardCount / denominator) * 100;
  const goodPct = (goodCount / denominator) * 100;
  const easyPct = (easyCount / denominator) * 100;
  const unreviewedPct = (unreviewedCount / denominator) * 100;

  return (
    <section className="home-vocab-card" aria-label={t('vocabulary_card.title', 'Góc từ vựng')}>
      {/* Top row: Title + Total count and Notebook link */}
      <div className="home-vocab-top">
        <div>
          <h2 className="home-vocab-title">
            <BookMarked size={21} aria-hidden="true" /> <span>{t('quick.vocab_title')}</span>
          </h2>
        </div>
        <Link className="home-notebook-link" to={PATHS.dictionary}>
          <span>{t('vocabulary_card.btn_open_notebook', 'Mở sổ từ')}</span>
          <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>

      {/* Middle row: 4 SRS tiers (1 row on desktop, 2x2 grid on mobile) */}
      <div
        className="home-srs-groups"
        role="group"
        aria-label={`Thống kê trí nhớ: ${againCount} Quên mất, ${hardCount} Khó nhớ, ${goodCount} Nhớ rồi, ${easyCount} Thuộc làu`}
      >
        <div className="home-srs-group home-srs-again" title={t('vocabulary_card.rating_again_desc', 'Chưa nhớ ra, cần xem lại.')}>
          <span className="home-srs-dot dot-again" aria-hidden="true" />
          <span className="home-srs-name">{t('vocabulary_card.rating_again', 'Quên mất')}</span>
          <b className="home-srs-count">{againCount}</b>
        </div>
        <div className="home-srs-group home-srs-hard" title={t('vocabulary_card.rating_hard_desc', 'Nhớ ra nhưng còn chật vật.')}>
          <span className="home-srs-dot dot-hard" aria-hidden="true" />
          <span className="home-srs-name">{t('vocabulary_card.rating_hard', 'Khó nhớ')}</span>
          <b className="home-srs-count">{hardCount}</b>
        </div>
        <div className="home-srs-group home-srs-good" title={t('vocabulary_card.rating_good_desc', 'Nhớ được mà không cần gợi ý.')}>
          <span className="home-srs-dot dot-good" aria-hidden="true" />
          <span className="home-srs-name">{t('vocabulary_card.rating_good', 'Nhớ rồi')}</span>
          <b className="home-srs-count">{goodCount}</b>
        </div>
        <div className="home-srs-group home-srs-easy" title={t('vocabulary_card.rating_easy_desc', 'Nhớ ngay, không cần nghĩ lâu.')}>
          <span className="home-srs-dot dot-easy" aria-hidden="true" />
          <span className="home-srs-name">{t('vocabulary_card.rating_easy', 'Thuộc làu')}</span>
          <b className="home-srs-count">{easyCount}</b>
        </div>
      </div>

      {/* Unreviewed words indicator (shown separately, not merged into 'again') */}
      {unreviewedCount > 0 && (
        <div className="home-srs-unreviewed-line">
          <span>{t('vocabulary_card.unreviewed_count', { count: unreviewedCount, defaultValue: `Chưa ôn: ${unreviewedCount}` })}</span>
        </div>
      )}

      {/* 4-Segment proportional distribution bar */}
      <div
        className="home-srs-distribution"
        role="img"
        aria-label={`Phân bổ trí nhớ: ${againCount} Quên mất, ${hardCount} Khó nhớ, ${goodCount} Nhớ rồi, ${easyCount} Thuộc làu${unreviewedCount > 0 ? `, ${unreviewedCount} Chưa ôn` : ''}`}
      >
        {totalSaved > 0 ? (
          <>
            <span style={{ width: `${againPct}%` }} className="home-srs-bar-again" />
            <span style={{ width: `${hardPct}%` }} className="home-srs-bar-hard" />
            <span style={{ width: `${goodPct}%` }} className="home-srs-bar-good" />
            <span style={{ width: `${easyPct}%` }} className="home-srs-bar-easy" />
            {unreviewedCount > 0 && (
              <span style={{ width: `${unreviewedPct}%` }} className="home-srs-bar-unreviewed" />
            )}
          </>
        ) : (
          <span style={{ width: '100%' }} className="home-srs-bar-empty" />
        )}
      </div>

      {/* Bottom action row: 3 explicit states */}
      <div className="home-srs-due-row">
        {totalSaved === 0 ? (
          <>
            <div className="home-srs-due-info">
              <span className="home-srs-due-text">
                <b>{t('vocabulary_card.no_words_yet', 'Chưa có từ nào trong sổ')}</b>
              </span>
              <span className="home-srs-due-hint">
                {t('vocabulary_card.no_words_hint', 'Lưu từ mới khi đọc để bắt đầu chu kỳ ôn tập.')}
              </span>
            </div>
            <Link className="home-primary-btn home-vocab-action-btn" to={PATHS.discovery}>
              <Compass size={14} aria-hidden="true" />
              <span>{t('vocabulary_card.btn_discover_stories', 'Khám phá bài đọc')}</span>
            </Link>
          </>
        ) : dueToday > 0 ? (
          <>
            <div className="home-srs-due-info">
              <span className="home-srs-due-text">
                <span className="home-srs-due-pulse" aria-hidden="true" />
                <b>
                  {dueToday === 1
                    ? t('vocabulary_card.due_count_one', '1 từ đến lịch ôn hôm nay')
                    : t('vocabulary_card.due_count_many', { count: dueToday, defaultValue: `${dueToday} từ đến lịch ôn hôm nay` })}
                </b>
              </span>
              <span className="home-srs-due-hint">
                {estimatedMinutes === 1
                  ? t('vocabulary_card.about_minute', 'Khoảng 1 phút')
                  : t('vocabulary_card.about_minutes', { count: estimatedMinutes, defaultValue: `Khoảng ${estimatedMinutes} phút` })}
              </span>
            </div>
            <Link className="home-primary-btn home-vocab-action-btn" to={reviewUrl}>
              <span>{t('vocabulary_card.btn_review_now', 'Ôn ngay')}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </>
        ) : (
          <>
            <div className="home-srs-due-info">
              <span className="home-srs-due-text home-srs-completed-text">
                <Check size={16} className="home-srs-check-icon" aria-hidden="true" />
                <b>{t('vocabulary_card.all_done_today', 'Hôm nay ôn xong rồi')}</b>
              </span>
              <span className="home-srs-due-hint">
                {t('vocabulary_card.all_done_hint', 'Tất cả từ vựng đã được củng cố theo chu kỳ Spaced Repetition.')}
              </span>
            </div>
            <Link className="home-primary-btn home-vocab-action-btn home-vocab-secondary-btn" to={PATHS.dictionary}>
              <BookMarked size={14} aria-hidden="true" />
              <span>{t('vocabulary_card.btn_view_notebook', 'Xem sổ từ')}</span>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}

// Backward-compatibility export
export const HomeVocabularyCard = HomeVocabularySummary;
