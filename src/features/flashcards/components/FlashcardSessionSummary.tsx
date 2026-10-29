import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  CheckCircle2,
  RotateCcw,
  Compass,
  Home,
  Zap,
  Coins,
  Volume2,
  BookOpen,
  ChevronDown,
  Trophy,
} from 'lucide-react';
import { useAppNavigate } from '@/routes/useAppNavigate';
import type { StudyDeck } from '../services/studyDeck';
import type { ReviewSession } from '../lib/reviewSession';
import type { RewardCelebrationPayload } from '@/types';
import { PATHS, paths } from '@/routes/paths';

interface FlashcardSessionSummaryProps {
  deck: StudyDeck;
  session: ReviewSession;
  level: string;
  onRestart: () => void;
  reward: RewardCelebrationPayload | null;
  totalXP: number;
  totalCoins: number;
  savedOnly: boolean;
}

export function FlashcardSessionSummary({
  deck, session, level, onRestart, reward, totalXP, totalCoins, savedOnly, }: FlashcardSessionSummaryProps) {
  const { t } = useTranslation('flashcards');
  
  const navigate = useAppNavigate();
  const [isWordListOpen, setIsWordListOpen] = useState(false);

  const mastered = Object.values(session.ratings).filter(rating => rating === 'mastered').length;
  const review = Object.values(session.ratings).filter(rating => rating === 'review').length;
  const totalCards = Math.max(session.order.length, 1);
  const accuracyPercent = Math.round((mastered / totalCards) * 100);

  const cardsReviewed = session.order
    .map(id => deck.cards.find(card => card.id === id))
    .filter((card): card is NonNullable<typeof card> => Boolean(card));

  const rewardMessages: Record<string, string> = {
    'Bạn đã nhận thưởng hoàn thành bộ từ của bài này.': 'Completion reward already recorded.',
    'Chưa lưu được thưởng. Kiểm tra quyền hoặc dung lượng lưu trữ, rồi mở lại tổng kết.':
      'Your reward could not be saved. Check browser storage permissions or space, then reopen the summary.',
  };

  const playAudio = (word: string) => {
    if (!word || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section
      className="vocab-session-summary max-w-2xl max-h-full overflow-y-auto mx-auto rounded-3xl bg-surface border border-line p-6 sm:p-8 shadow-sm space-y-6 text-center"
      aria-label={t('summary.aria_label', 'Review summary')}
    >
      {/* 1. Mascot & Header */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative inline-flex items-center justify-center">
          <div className="relative w-16 h-16 rounded-full border border-antique-gold/60 p-1 bg-surface-raised shadow-xs overflow-hidden">
            <img
              src="/brand/viecultures-mascot-logo.png"
              alt={t('summary.mascot_alt', 'VieCultures mascot')}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-action text-on-action p-1 rounded-full shadow-xs">
            <Zap className="w-3.5 h-3.5 text-antique-gold" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent-ink text-xs font-medium">
            <Trophy className="w-3.5 h-3.5 text-accent-ink" />
            <span>{t('summary.session_completed', 'Review complete')}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink tracking-tight pt-1">
            {deck.lesson.vietnameseTitle}
          </h2>
          <p className="text-sm text-ink-soft">
            {deck.lesson.title}
          </p>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
        <div className="p-4 rounded-2xl bg-success-soft text-success border border-success/20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-success/15 text-success flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-success">
            {t('summary.remembered_stat', 'Remembered')}
          </span>
          <strong className="text-2xl font-bold font-sans my-0.5 text-ink">
            {mastered} <span className="text-sm font-normal text-ink-faint">/ {session.order.length}</span>
          </strong>
          <span className="text-xs text-ink-faint">
            {t('summary.accuracy_stat', { percent: accuracyPercent, defaultValue: `(${accuracyPercent}% accuracy)` })}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-warning-soft text-warning border border-warning/20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-warning/15 text-warning flex items-center justify-center mb-1.5">
            <RotateCcw className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-warning">
            {t('summary.review_stat', 'Review again')}
          </span>
          <strong className="text-2xl font-bold font-sans my-0.5 text-ink">
            {review} <span className="text-sm font-normal text-ink-faint">{t('summary.words_to_review', 'words')}</span>
          </strong>
          <span className="text-xs text-ink-faint">
            {review === 0 ? t('summary.all_remembered', 'All words remembered') : t('summary.needs_practice', 'Needs more practice')}
          </span>
        </div>
      </div>

      {/* 3. Feedback message */}
      <p className="text-sm text-ink font-normal">
        {review
          ? t('summary.feedback_review', { count: review, defaultValue: `${review} words could use more practice. Review this deck again.` })
          : t('summary.feedback_all_mastered', 'You marked every word as remembered in this review.')}
      </p>

      {/* 4. Gamification Rewards Box */}
      <div className="p-4 rounded-2xl bg-surface-muted/60 border border-line space-y-2.5">
        <div role="status" className="flex flex-wrap items-center justify-center gap-2.5">
          {savedOnly ? (
            <span className="text-xs text-ink-soft">
              {t('summary.saved_words_no_extra_reward', 'Saved words reviews do not earn an additional completion reward.')}
            </span>
          ) : reward ? (
            reward.xpEarned > 0 ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised border border-line text-xs font-semibold text-ink shadow-xs">
                  <Zap className="w-4 h-4 text-warning" />
                  <span>+{reward.xpEarned} XP</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-raised border border-line text-xs font-semibold text-ink shadow-xs">
                  <Coins className="w-4 h-4 text-antique-gold" />
                  <span>{t('summary.coins_earned', { count: reward.coinsEarned, defaultValue: `+${reward.coinsEarned} coins` })}</span>
                </div>
              </>
            ) : (
              <span className="text-xs text-ink-soft">
                {rewardMessages[reward.subtitle] || reward.subtitle}
              </span>
            )
          ) : (
            <span className="text-xs text-ink-soft">{t('summary.saving_reward', 'Saving your reward…')}</span>
          )}
        </div>

        <p className="text-xs text-ink-faint">
          {t('summary.browser_saved_notice', 'Results are saved in this browser. Each story earns a deck completion reward once.')}
        </p>

        <div className="pt-2 border-t border-line/60 flex items-center justify-center gap-4 text-xs font-normal text-ink-soft">
          <span>
            {t('summary.total_xp', { count: totalXP, defaultValue: `Total XP: ${totalXP}` })}
          </span>
          <span className="w-1 h-1 rounded-full bg-ink-faint/40" />
          <span>
            {t('summary.total_coins', { count: totalCoins, defaultValue: `Total coins: ${totalCoins}` })}
          </span>
        </div>
      </div>

      {/* 5. Quick Word Breakdown (Interactive Accordion) */}
      {cardsReviewed.length > 0 && (
        <div className="border border-line rounded-2xl overflow-hidden bg-surface-raised text-left">
          <button
            type="button"
            onClick={() => setIsWordListOpen(prev => !prev)}
            className="w-full px-4 py-3 min-h-[44px] flex items-center justify-between text-ink-soft hover:bg-surface-muted/50 transition-colors cursor-pointer"
            aria-expanded={isWordListOpen}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <BookOpen className="w-4 h-4 text-accent-ink" />
              <span>{t('summary.word_list_title', { count: cardsReviewed.length, defaultValue: `Review words from this deck (${cardsReviewed.length})` })}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-ink-faint">
              <span>{isWordListOpen ? t('summary.hide_list', 'Hide list') : t('summary.show_list', 'Show list')}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isWordListOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>
          {isWordListOpen && (
            <div className="p-3 border-t border-line space-y-2 max-h-56 overflow-y-auto divide-y divide-line/60">
              {cardsReviewed.map(card => {
                const isMastered = session.ratings[card.id] === 'mastered';
                return (
                  <div key={card.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-ink text-sm">{card.word}</span>
                        {card.pos && <span className="text-xs text-ink-faint italic">({card.pos})</span>}
                        {card.ipa && (
                          <span className="text-xs text-ink-faint font-mono">{card.ipa}</span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                            isMastered
                              ? 'bg-success-soft text-success'
                              : 'bg-warning-soft text-warning'
                          }`}
                        >
                          {isMastered ? t('summary.mastered_badge', 'Remembered') : t('summary.review_badge', 'Review again')}
                        </span>
                      </div>
                      <p className="text-xs text-ink-soft truncate mt-0.5">{card.viMeaning}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => playAudio(card.word)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-muted text-ink-soft hover:text-ink transition-colors shrink-0 cursor-pointer"
                      title={t('flip_view.pronounce_word', { word: card.word, defaultValue: `Pronounce ${card.word}` })}
                      aria-label={t('flip_view.pronounce_word', { word: card.word, defaultValue: `Pronounce ${card.word}` })}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Navigation Actions (CTAs) */}
      <div className="vocab-session-actions flex flex-wrap justify-center gap-3 pt-2">
        <button
          type="button"
          className="vocab-study-primary"
          onClick={() =>
            navigate(paths.aiWorkspace({ story: deck.article.id, topic: deck.lesson.title, level }))
          }
        >
          <Compass className="w-4 h-4" />
          <span>{t('summary.practice_with_ai', 'Practise with AI')}</span>
        </button>
        <button
          type="button"
          className="vocab-study-secondary"
          onClick={onRestart}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('summary.btn_study_again', 'Review deck again')}</span>
        </button>
        <button
          type="button"
          className="vocab-study-secondary"
          onClick={() => navigate(PATHS.home)}
        >
          <Home className="w-4 h-4" />
          <span>{t('summary.btn_back_home', 'Back to home')}</span>
        </button>
      </div>
    </section>
  );
}
