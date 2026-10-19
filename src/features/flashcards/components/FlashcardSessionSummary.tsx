import { Award, CheckCircle2, XCircle, RotateCcw, Compass, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export function FlashcardSessionSummary({ deck, session, level, onRestart, reward, totalXP, totalCoins, savedOnly }: FlashcardSessionSummaryProps) {
  const navigate = useNavigate();
  const mastered = Object.values(session.ratings).filter(rating => rating === 'mastered').length;
  const review = Object.values(session.ratings).filter(rating => rating === 'review').length;
  const rewardMessages: Record<string, string> = {
    'Bạn đã nhận thưởng hoàn thành bộ từ của bài này.': 'Completion reward already recorded.',
    'Chưa lưu được thưởng. Kiểm tra quyền hoặc dung lượng lưu trữ, rồi mở lại tổng kết.': 'Your reward could not be saved. Check browser storage permissions or space, then reopen the summary.',
  };
  return (
    <section className="vocab-session-summary max-w-2xl max-h-full overflow-y-auto mx-auto rounded-3xl bg-surface border-2 border-line p-6 shadow-xl space-y-4 text-center" aria-label="Review summary">
      <Award className="w-12 h-12 text-antique-gold mx-auto" />
      <div><p>Review complete</p><h2 className="font-serif text-2xl font-bold text-heritage-green">{deck.lesson.vietnameseTitle}</h2><p>{deck.lesson.title}</p></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900"><CheckCircle2 className="mx-auto" /><p>Remembered</p><strong>{mastered} / {session.order.length}</strong></div>
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-900"><XCircle className="mx-auto" /><p>Review again</p><strong>{review}</strong></div>
      </div>
      <p>{review ? `${review} words could use more practice. Review this deck again.` : 'You marked every word as remembered in this review.'}</p>
      <p className="text-xs text-text-secondary">Results are saved in this browser. Each story earns a deck completion reward once.</p>
      <p role="status">{savedOnly ? 'Saved words reviews do not earn an additional completion reward.' : reward ? reward.xpEarned > 0 ? `+${reward.xpEarned} XP · +${reward.coinsEarned} coins` : rewardMessages[reward.subtitle] || reward.subtitle : 'Saving your reward…'}</p>
      <p className="text-xs">Total XP: <span data-testid="total-xp">{totalXP}</span> · Total coins: <span data-testid="total-coins">{totalCoins}</span></p>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="px-5 py-3 rounded-full bg-heritage-green text-warm-ivory" onClick={() => navigate(paths.aiWorkspace({ story: deck.article.id, topic: deck.lesson.title, level }))}><Compass className="inline w-4 h-4 mr-2" />Practise with AI</button>
        <button className="px-5 py-3 rounded-full border border-line" onClick={onRestart}><RotateCcw className="inline w-4 h-4 mr-2" />Review this deck again</button>
        <button className="px-5 py-3 rounded-full border border-line" onClick={() => navigate(PATHS.home)}><Home className="inline w-4 h-4 mr-2" />Back to study room</button>
      </div>
    </section>
  );
}
