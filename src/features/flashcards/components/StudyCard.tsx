import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Star, Volume2 } from 'lucide-react';
import type { Flashcard } from '@/data/flashcardsData';
import { VOCAB_DATABASE } from '@/data/readerData';
import { getRatingIntervals, type AnkiRating, type CardSRSState } from '../services/srsEngine';

export type StudyMode = 'flip' | 'choice' | 'type';

interface Props {
  card: Flashcard;
  cards: Flashcard[];
  mode: StudyMode;
  reverse: boolean;
  revealed: boolean;
  saved: boolean;
  cardSRS?: CardSRSState;
  onReveal: () => void;
  onHide: () => void;
  onRate: (rating: AnkiRating) => void;
  onAudio: () => void;
  onSave: () => void;
}

function BotanicalBorder() {
  return <svg className="study-botanical" viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <g className="study-bamboo" fill="none" stroke="currentColor" strokeWidth="4"><path d="M36 430 55 90M74 430 98 130M55 200l-42-44m42 77 76-60M73 309 9 262m73 11 87-60"/><path d="M55 195q-38-4-46-55 38 10 46 55M58 225q43-54 82-57-27 45-82 57M77 305q-45-3-70-58 47 11 70 58M83 274q48-52 91-54-27 46-91 54" fill="currentColor" stroke="none"/></g>
    <g className="study-rice" fill="none" stroke="currentColor" strokeWidth="3"><path d="M937 430q-14-166 34-291M937 302q-50-66-58-137M942 273q47-88 48-135"/><path d="M939 266q-36-11-43-58 33 15 43 58m12-44q39-49 45-70-3 45-45 70m-8 112q-45-26-49-69 38 25 49 69m13-135q-15-33-2-69 18 33 2 69" fill="currentColor" stroke="none"/></g>
    <g className="study-lotus" fill="currentColor"><path d="M488 423q-28-32 0-67 28 35 0 67m-4 0q-39-4-48-40 38 4 48 40m8 0q39-4 48-40-38 4-48 40"/></g>
  </svg>;
}

export function StudyCard({ card, cards, mode, reverse, revealed, saved, cardSRS, onReveal, onHide, onRate, onAudio, onSave }: Props) {
  const { i18n } = useTranslation('flashcards');
  const isVi = i18n.language.startsWith('vi');
  const [hint, setHint] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [checked, setChecked] = useState(false);
  const options = useMemo(() => {
    const pool = [...cards.map(item => item.word), ...Object.values(VOCAB_DATABASE).map(item => item.word)];
    const distractors = [...new Set(pool)].filter(word => word.toLowerCase() !== card.word.toLowerCase()).slice(0, 3);
    const insertAt = card.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % (distractors.length + 1);
    distractors.splice(insertAt, 0, card.word);
    return distractors;
  }, [card.id, card.word, cards]);
  const correctChoice = options.indexOf(card.word);
  useEffect(() => {
    if (mode !== 'choice' || selected !== null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('button, input, textarea, select')) return;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < options.length) { setSelected(index); onReveal(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, selected, options.length, onReveal]);
  const typeCorrect = typed.trim().toLocaleLowerCase() === card.word.trim().toLocaleLowerCase();
  const ratingIntervals = getRatingIntervals(cardSRS);
  const showAnswer = revealed || (mode === 'choice' && selected !== null) || (mode === 'type' && checked);
  const reveal = () => { onReveal(); setHint(false); };
  const clue = card.contextEn?.replace(new RegExp(card.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '_____');

  return <div className="study-card-stack" key={`${card.id}:${mode}:${reverse}`}>
    {mode === 'flip' ? <div className="study-flip-scene"><div className={`study-flip-rotor${showAnswer ? ' is-flipped' : ''}`}>
      <FlipFace card={card} reverse={reverse} back={false} hidden={showAnswer} saved={saved} isVi={isVi} onAudio={onAudio} onSave={onSave} onHint={() => setHint(value => !value)} onHide={onHide} />
      <FlipFace card={card} reverse={reverse} back hidden={!showAnswer} saved={saved} isVi={isVi} onAudio={onAudio} onSave={onSave} onHint={() => setHint(value => !value)} onHide={onHide} />
    </div></div> : <article className="study-main-card">
      <BotanicalBorder />
      <div className="study-card-top"><span>{mode === 'choice' ? (isVi ? 'CHỌN TỪ ĐÚNG' : 'CHOOSE THE WORD') : mode === 'type' ? (isVi ? 'NHỚ TỪ QUA NGỮ CẢNH' : 'RECALL FROM CONTEXT') : showAnswer ? (isVi ? 'Ý NGHĨA & CÁCH DÙNG' : 'MEANING & USE') : (isVi ? 'NHỚ LẠI TỪ VỰNG' : 'RECALL THE WORD')}</span><button type="button" className="study-save" onClick={onSave} aria-pressed={saved} aria-label={saved ? (isVi ? 'Bỏ lưu từ' : 'Remove saved word') : (isVi ? 'Lưu từ' : 'Save word')}><Star size={22} fill={saved ? 'currentColor' : 'none'} /></button></div>
      <div className="study-card-content">
        {mode === 'choice' ? <><p className="study-eyebrow">{isVi ? 'Từ nào có nghĩa là…' : 'Which word means…'}</p><h2 className="study-meaning">{card.viMeaning}</h2><div className="study-choice-grid">{options.map((option, index) => <button type="button" key={`${option}:${index}`} disabled={selected !== null} onClick={() => { setSelected(index); onReveal(); }} className={selected !== null && index === correctChoice ? 'is-correct' : selected === index ? 'is-wrong' : ''}><span>{index + 1}</span>{option}</button>)}</div>{selected !== null && <p role="status" className="study-answer-feedback">{selected === correctChoice ? (isVi ? 'Chính xác!' : 'Correct!') : (isVi ? `Đáp án: ${card.word}` : `Answer: ${card.word}`)}</p>}</> : <><h2 className="study-meaning">{card.viMeaning}</h2>{clue && <div className="study-example"><small>{isVi ? 'TRONG CÂU CHUYỆN' : 'IN THE STORY'}</small><p>{clue}</p></div>}<div className="study-type-row"><input aria-label={isVi ? 'Gõ từ tiếng Anh' : 'Type the English word'} value={typed} onChange={event => setTyped(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && typed.trim()) { setChecked(true); onReveal(); } }} readOnly={checked} placeholder={isVi ? 'Gõ từ tiếng Anh…' : 'Type the English word…'} autoComplete="off" spellCheck={false}/></div>{checked && <p role="status" className="study-answer-feedback">{typeCorrect ? (isVi ? 'Chính xác!' : 'Correct!') : (isVi ? `Đáp án: ${card.word}` : `Answer: ${card.word}`)}</p>}</>}
      </div>
      <div className="study-card-bottom"><button type="button" onClick={() => showAnswer ? (onHide(), setSelected(null), setChecked(false)) : setHint(value => !value)}><Lightbulb size={15}/>{showAnswer ? (isVi ? 'Xem mặt trước' : 'Show front') : (isVi ? 'Gợi ý từ câu chuyện' : 'Context hint')}</button><span>{mode === 'choice' ? '1–4' : 'Enter'}</span></div>
    </article>}
    {hint && !showAnswer && <p className="study-hint" role="status">{clue || (isVi ? `Loại từ: ${card.pos}` : `Part of speech: ${card.pos}`)}</p>}
    {mode === 'flip' && !showAnswer && <button className="study-primary" type="button" onClick={reveal}>{isVi ? 'Lật thẻ' : 'Flip card'} <kbd>Space</kbd></button>}
    {mode === 'type' && !showAnswer && <button className="study-primary" type="button" disabled={!typed.trim()} onClick={() => { setChecked(true); onReveal(); }}>{isVi ? 'Kiểm tra đáp án' : 'Check answer'} <kbd>Enter</kbd></button>}
    {showAnswer && <div className="study-ratings" role="group" aria-label={isVi ? 'Đánh giá trí nhớ' : 'Rate recall'}>{(['again','hard','good','easy'] as const).map((rating, index) => <button type="button" key={rating} onClick={() => onRate(rating)} className={`study-rating-${rating}`}><strong>{isVi ? ratingIntervals[rating].labelVi : ratingIntervals[rating].labelEn}</strong><small>{isVi ? ratingIntervals[rating].intervalTextVi : ratingIntervals[rating].intervalTextEn} · {index + 1}</small></button>)}</div>}
  </div>;
}

function FlipFace({ card, reverse, back, hidden, saved, isVi, onAudio, onSave, onHint, onHide }: {
  card: Flashcard; reverse: boolean; back: boolean; hidden: boolean; saved: boolean; isVi: boolean;
  onAudio: () => void; onSave: () => void; onHint: () => void; onHide: () => void;
}) {
  return <article className={`study-main-card study-flip-face ${back ? 'study-flip-back' : 'study-flip-front'}`} aria-hidden={hidden} inert={hidden}>
    <BotanicalBorder />
    <div className="study-card-top"><span>{back ? (isVi ? 'Ý NGHĨA & CÁCH DÙNG' : 'MEANING & USE') : (isVi ? 'NHỚ LẠI TỪ VỰNG' : 'RECALL THE WORD')}</span><button type="button" className="study-save" onClick={onSave} aria-pressed={saved} aria-label={saved ? (isVi ? 'Bỏ lưu từ' : 'Remove saved word') : (isVi ? 'Lưu từ' : 'Save word')}><Star size={22} fill={saved ? 'currentColor' : 'none'} /></button></div>
    <div className="study-card-content">
      {back ? <><h2 className="study-meaning">{reverse ? card.word : card.viMeaning}</h2><div className="study-pronounce"><span>{card.ipa} · {card.pos}</span><button type="button" onClick={onAudio} aria-label={isVi ? 'Phát âm' : 'Play pronunciation'}><Volume2 size={18}/></button></div><Example card={card} isVi={isVi}/></> : <><h2 className="study-term">{reverse ? card.viMeaning : card.word}</h2>{!reverse && <div className="study-pronounce"><span>{card.ipa} · {card.pos}</span><button type="button" onClick={onAudio} aria-label={isVi ? 'Phát âm' : 'Play pronunciation'}><Volume2 size={18}/></button></div>}</>}
    </div>
    <div className="study-card-bottom"><button type="button" onClick={back ? onHide : onHint}><Lightbulb size={15}/>{back ? (isVi ? 'Xem mặt trước' : 'Show front') : (isVi ? 'Gợi ý từ câu chuyện' : 'Context hint')}</button><span>Space</span></div>
  </article>;
}

function Example({ card, isVi }: { card: Flashcard; isVi: boolean }) {
  return <><div className="study-example"><small>{isVi ? 'TRONG CÂU CHUYỆN' : 'IN THE STORY'}</small><p>{card.contextEn || (isVi ? 'Chưa có câu ví dụ.' : 'No example available.')}</p></div>{card.viDefinition && card.viDefinition !== card.viMeaning && <p className="study-definition">{card.viDefinition}</p>}{card.contextEn && <p className="study-translation-note">{isVi ? 'Bài đọc chưa cung cấp bản dịch câu ví dụ.' : 'Example translation is not available from this article.'}</p>}</>;
}
