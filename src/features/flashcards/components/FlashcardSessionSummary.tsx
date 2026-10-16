import { Award, CheckCircle2, XCircle, RotateCcw, Compass, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { StudyDeck } from '../services/studyDeck';
import type { ReviewSession } from '../lib/reviewSession';
import type { RewardCelebrationPayload } from '@/types';

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
  return (
    <section className="max-w-2xl max-h-full overflow-y-auto mx-auto rounded-3xl bg-surface border-2 border-line p-6 shadow-xl space-y-4 text-center" aria-label="Tổng kết lượt ôn">
      <Award className="w-12 h-12 text-antique-gold mx-auto" />
      <div><p>HOÀN THÀNH LƯỢT ÔN TẬP</p><h2 className="font-serif text-2xl font-bold text-heritage-green">{deck.lesson.vietnameseTitle}</h2><p>{deck.lesson.title}</p></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900"><CheckCircle2 className="mx-auto" /><p>Đã thuộc</p><strong>{mastered} / {session.order.length}</strong></div>
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-900"><XCircle className="mx-auto" /><p>Cần ôn lại</p><strong>{review}</strong></div>
      </div>
      <p>{review ? `Bạn có ${review} từ cần củng cố. Hãy quay lại ôn bộ từ này.` : 'Bạn đã đánh giá nhớ tất cả các từ trong lượt ôn này.'}</p>
      <p className="text-xs text-text-secondary">Kết quả lưu trên trình duyệt này. Mỗi bài chỉ nhận thưởng hoàn thành bộ từ một lần.</p>
      <p role="status">{savedOnly ? 'Lượt ôn từ đã lưu không cấp thêm thưởng hoàn thành bài.' : reward ? reward.xpEarned > 0 ? `+${reward.xpEarned} XP · +${reward.coinsEarned} xu` : reward.subtitle : 'Đang ghi nhận thưởng…'}</p>
      <p className="text-xs">Tổng XP: <span data-testid="total-xp">{totalXP}</span> · Tổng xu: <span data-testid="total-coins">{totalCoins}</span></p>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="px-5 py-3 rounded-full bg-heritage-green text-warm-ivory" onClick={() => navigate(`/playground?story=${encodeURIComponent(deck.article.id)}&topic=${encodeURIComponent(deck.lesson.title)}&level=${encodeURIComponent(level)}`)}><Compass className="inline w-4 h-4 mr-2" />Khám phá cùng AI Map</button>
        <button className="px-5 py-3 rounded-full border border-line" onClick={onRestart}><RotateCcw className="inline w-4 h-4 mr-2" />Ôn lại bộ thẻ này</button>
        <button className="px-5 py-3 rounded-full border border-line" onClick={() => navigate('/home')}><Home className="inline w-4 h-4 mr-2" />Về Trang Chủ</button>
      </div>
    </section>
  );
}
