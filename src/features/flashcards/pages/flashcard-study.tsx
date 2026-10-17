import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useGamification } from '@/context/GamificationContext';
import type { RewardCelebrationPayload } from '@/types';
import { articleKey, readSavedVocabulary } from '@/services/learning/learningStorage';
import FlashcardSidebarLayout from '../components/flashcard-sidebar-layout';
import { FlashcardStudyHeader, FlashcardProgressBar, FlashcardModeTabs, FlashcardFlipView, FlashcardMultipleChoiceView, FlashcardSpellingView } from '../components';
import { FlashcardSessionSummary } from '../components/FlashcardSessionSummary';
import { cardsFromVocabulary, loadStudyDeck, type StudyDeck } from '../services/studyDeck';
import { useReviewSession } from '../hooks/useReviewSession';
import { PATHS, paths } from '@/routes/paths';

interface FlashcardStudyPlayerProps { deck: StudyDeck; level: string; savedOnly: boolean; }

function FlashcardStudyPlayer({ deck, level, savedOnly }: FlashcardStudyPlayerProps) {
  const { earnReward, stats } = useGamification();
  const [reward, setReward] = useState<RewardCelebrationPayload | null>(null);
  const [cards] = useState(() => {
    return savedOnly ? cardsFromVocabulary(readSavedVocabulary(deck.article.id, level)) : deck.cards;
  });
  const onComplete = useCallback(() => {
    if (!savedOnly) void earnReward('FLASHCARD_DECK_COMPLETED', {
      cardCount: cards.length, rewardKey: deck.article.topicGroup || deck.article.id,
    }).then(result => setReward(previous => previous?.xpEarned ? previous : result));
  }, [earnReward, savedOnly, cards.length, deck.article.topicGroup, deck.article.id]);
  const { session, update, answer, restart, canSave } = useReviewSession(cards, articleKey(deck.article.id, level) + (savedOnly ? ':saved' : ''), onComplete);
  const currentCard = cards.find(card => card.id === session.order[session.currentIndex]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mcSelected, setMcSelected] = useState<number | null>(null);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingFeedback, setSpellingFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isAutoAudio, setIsAutoAudio] = useState(false);
  const [accentVoice, setAccentVoice] = useState<'en-US' | 'en-GB'>('en-US');
  const isShuffled = session.order.some((id, index) => id !== cards[index]?.id);

  const clearAnswer = () => { setIsFlipped(false); setMcSelected(null); setSpellingInput(''); setSpellingFeedback(null); };
  const rate = (mastered: boolean) => {
    if (!currentCard) return;
    answer(currentCard.id, mastered ? 'mastered' : 'review');
    clearAnswer();
  };
  const playAudio = (word = currentCard?.word) => {
    if (!word || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = accentVoice;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };
  useEffect(() => {
    if (isAutoAudio && !session.complete) playAudio();
    return () => window.speechSynthesis?.cancel();
  }, [currentCard?.id, isAutoAudio, session.complete, accentVoice]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (session.mode !== 'flip' || session.complete || !cards.length ||
        (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, [role="button"], [contenteditable="true"]'))) return;
      if (event.code === 'Space') { event.preventDefault(); setIsFlipped(value => !value); }
      if (event.key === '1' || event.key === '2') { event.preventDefault(); rate(event.key === '2'); }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); clearAnswer();
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        update(value => ({ ...value, currentIndex: (value.currentIndex + direction + cards.length) % cards.length }));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [session, currentCard, cards.length]);

  if (!cards.length) return <div role="status" className="p-8 text-center"><h1>Chưa có từ vựng để ôn</h1><p>{savedOnly ? 'Hãy lưu từ trong bài đọc trước.' : 'Bài này chưa có bộ từ được biên tập.'}</p><Link to={paths.reader({ postId: deck.article.id, level })}>Trở về bài đọc</Link></div>;

  return <div className="vocab-study-page w-full">
    <div>
    <FlashcardStudyHeader activeLesson={deck.lesson} isShuffled={isShuffled} onToggleShuffle={() => {
      if (session.complete) return;
      clearAnswer();
      update(value => {
        const order = cards.map(card => card.id);
        if (!isShuffled) for (let index = order.length - 1; index > 0; index--) {
          const other = Math.floor(Math.random() * (index + 1));
          [order[index], order[other]] = [order[other], order[index]];
        }
        return { ...value, order, currentIndex: Math.max(0, order.indexOf(currentCard?.id || '')) };
      });
    }} isAutoAudio={isAutoAudio} onToggleAutoAudio={setIsAutoAudio} accentVoice={accentVoice} onChangeVoice={setAccentVoice} />
    <p className="text-xs text-text-secondary">{level} · Tiến độ lưu trên trình duyệt này{savedOnly ? ' · Ôn từ đã lưu, không cấp thêm thưởng hoàn thành bài' : ''}</p>
    {!canSave && <p role="alert">Trình duyệt chưa lưu được tiến độ. Hãy kiểm tra dung lượng hoặc quyền lưu trữ.</p>}
    </div>
    <FlashcardProgressBar currentIndex={session.currentIndex} reviewedCount={Object.keys(session.ratings).length} totalCards={cards.length} isComplete={session.complete} />
    <FlashcardModeTabs playerMode={session.mode} onChangeMode={mode => { clearAnswer(); update(value => ({ ...value, mode })); }} />
    <div className="vocab-study-player">
      {session.complete ? <FlashcardSessionSummary deck={deck} session={session} level={level} reward={reward} totalXP={stats.xp} totalCoins={stats.coins} savedOnly={savedOnly} onRestart={() => { clearAnswer(); setReward(null); restart(); }} /> : currentCard && <>
        {session.mode === 'flip' && <FlashcardFlipView card={currentCard} isFlipped={isFlipped} onToggleFlip={() => setIsFlipped(value => !value)} currentIndex={session.currentIndex} totalCards={cards.length} onPlayAudio={playAudio} onReviewLater={() => rate(false)} onMastered={() => rate(true)} />}
        {session.mode === 'mc' && <FlashcardMultipleChoiceView card={currentCard} mcSelected={mcSelected} onSelectOption={index => { if (mcSelected === null) setMcSelected(index); }} onNextQuestion={() => { if (mcSelected !== null) rate(mcSelected === currentCard.correctIndex); }} />}
        {session.mode === 'spelling' && <FlashcardSpellingView card={currentCard} spellingInput={spellingInput} onChangeInput={setSpellingInput} spellingFeedback={spellingFeedback} onCheckSpelling={() => {
          if (!spellingInput.trim() || spellingFeedback) return;
          setSpellingFeedback(spellingInput.trim().toLocaleLowerCase() === currentCard.word.trim().toLocaleLowerCase() ? 'correct' : 'incorrect');
        }} onNext={() => { if (spellingFeedback) rate(spellingFeedback === 'correct'); }} />}
      </>}
    </div>
    <p className="vocab-study-tip">Một ít mỗi ngày, nhớ lâu hơn. Hãy đọc to từ vựng trước khi xem đáp án.</p>
  </div>;
}

export default function FlashcardStudyPage() {
  const [params] = useSearchParams();
  const id = params.get('deck') || params.get('postId') || params.get('story') || params.get('article') || 'imperial-hue';
  const level = params.get('level') || 'Level 2';
  const savedOnly = params.get('saved') === '1';
  const key = articleKey(id, level);
  const [result, setResult] = useState<{ key: string; deck: StudyDeck | null } | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setResult(null);
    loadStudyDeck(id, level).then(deck => { if (active) setResult({ key, deck }); }).catch(() => { if (active) setResult({ key, deck: null }); });
    return () => { active = false; };
  }, [key, attempt]);
  return <FlashcardSidebarLayout>
    {!result || result.key !== key ? <p role="status">Đang tải bộ từ của bài đọc…</p> : result.deck ?
      <FlashcardStudyPlayer key={key + savedOnly} deck={result.deck} level={result.deck.lesson.cefrLevel} savedOnly={savedOnly} /> :
      <div role="alert" className="p-8 text-center"><h1>Chưa tải được bộ từ của bài này</h1><p>Kiểm tra kết nối hoặc chọn lại bài đọc.</p><button onClick={() => setAttempt(value => value + 1)}>Thử lại</button> <Link to={PATHS.discovery}>Chọn bài đọc</Link></div>}
  </FlashcardSidebarLayout>;
}
