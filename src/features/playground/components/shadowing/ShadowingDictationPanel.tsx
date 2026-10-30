import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Eye, Lightbulb, Play, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { dictationApiService, generateHintScaffold } from '../../services/dictationService';
import type { DictationCheckResult } from '../../services/dictationService';
import type { ShadowingLesson } from '../../types/shadowing';
import { formatTime } from '../../lib/shadowing-lesson';

interface Props { lesson: ShadowingLesson; ready: boolean; onSample(start: number, end: number): void; onStop(): void }
export function ShadowingDictationPanel({ lesson, ready, onSample, onStop }: Props) {
  const { t } = useTranslation('playground');
  const [index, setIndex] = useState(0), [text, setText] = useState(''), [hint, setHint] = useState(false), [answer, setAnswer] = useState(false);
  const [result, setResult] = useState<DictationCheckResult | null>(null), [checking, setChecking] = useState(false), [query, setQuery] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const generation = useRef(0);
  const sentence = lesson.sentences[index] ?? lesson.sentences[0];
  useEffect(() => { ++generation.current; setText(''); setHint(false); setAnswer(false); setResult(null); setChecking(false); return () => { ++generation.current; }; }, [sentence.id]);
  const check = async () => {
    const current = ++generation.current; setChecking(true);
    const result = await dictationApiService.evaluateDictation(sentence.id, text, sentence.text);
    if (generation.current === current) { setResult(result); setChecking(false); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(lesson.sentences.map(s => `[${formatTime(s.start)}] ${s.text}`).join('\n')); setCopyStatus(t('playground.shadowing.dictation.copied_success')); }
    catch { setCopyStatus(t('playground.shadowing.dictation.copy_failed')); }
  };
  const move = (next: number) => { onStop(); setIndex(next); };
  const feedback = !result ? '' : result.accuracy >= 98 ? t('playground.shadowing.dictation.fb_perfect')
    : result.accuracy >= 80 ? t('playground.shadowing.dictation.fb_high')
    : result.accuracy >= 50 ? t('playground.shadowing.dictation.fb_medium') : t('playground.shadowing.dictation.fb_low');
  return <section className="sh-panel sh-learning-panel" aria-label={t('playground.shadowing.screen.aria_dictation_practice')}>
    <header className="sh-learning-heading"><span className="sh-eyebrow">{t('playground.shadowing.dictation.eyebrow')}</span><h3>{t('playground.shadowing.dictation.title')}</h3><p>{t('playground.shadowing.dictation.desc')}</p></header>
    <div className="sh-step-caption"><span>{t('playground.shadowing.dictation.sentence_step', { current: index + 1, total: lesson.sentences.length })}</span><span className="sh-time">{formatTime(sentence.start)}–{formatTime(sentence.start + sentence.duration)}</span></div>
    <div className="sh-dictation-prompt"><button className="sh-btn" disabled={!ready} onClick={() => onSample(sentence.start, sentence.start + sentence.duration)}><Play size={16} /> {t('playground.shadowing.dictation.listen_btn')}</button><p>{t('playground.shadowing.dictation.listen_hint')}</p></div>
    <label className="sh-eyebrow" htmlFor="dictation-answer">{t('playground.shadowing.dictation.your_answer')}</label>
    <textarea id="dictation-answer" className="sh-input sh-answer-input" rows={5} aria-label={t('playground.shadowing.dictation.answer_aria')} value={text} onChange={event => setText(event.target.value)} placeholder={t('playground.shadowing.dictation.answer_placeholder')} />
    <div className="sh-row sh-between sh-dictation-actions"><div className="sh-row"><button className="sh-btn sh-quiet" aria-pressed={hint} onClick={() => setHint(value => !value)}><Lightbulb size={14} /> {t('playground.shadowing.dictation.hint_btn')}</button><button className="sh-btn sh-quiet" aria-pressed={answer} onClick={() => setAnswer(value => !value)}><Eye size={14} /> {t('playground.shadowing.dictation.answer_btn')}</button></div><button className="sh-btn sh-primary" disabled={!text.trim() || checking} onClick={check}><Check size={14} /> {checking ? t('playground.shadowing.dictation.checking_btn') : t('playground.shadowing.dictation.check_btn')}</button></div>
    {hint && <div className="sh-notice" role="status"><span className="sh-eyebrow">{t('playground.shadowing.dictation.word_hint')}</span><p>{generateHintScaffold(sentence.text)}</p></div>}
    {answer && <div className="sh-notice"><span className="sh-eyebrow">{t('playground.shadowing.dictation.original_sentence')}</span><p>{sentence.text}</p></div>}
    {result && <div className="sh-notice sh-dictation-result" role="status"><h3>{t('playground.shadowing.dictation.word_match', { accuracy: result.accuracy })}</h3><p>{feedback}</p><p className="sh-diff">{result.diff.map((token, i) => <span key={i} className={`sh-diff-${token.status}`} title={token.status === 'correct' ? 'Matched' : `${token.status}${token.expected ? `: ${token.expected}` : ''}`}>{token.status === 'missing' ? `[Missing: ${token.expected ?? token.word}]` : token.word}{' '}</span>)}</p></div>}
    <div className="sh-row sh-between sh-sentence-navigation"><button aria-label={t('playground.shadowing.dictation.prev_btn')} className="sh-btn sh-quiet" disabled={index === 0} onClick={() => move(index - 1)}><ChevronLeft size={14} /> {t('playground.shadowing.dictation.prev_btn')}</button><button aria-label={t('playground.shadowing.dictation.next_btn')} className="sh-btn sh-quiet" disabled={index === lesson.sentences.length - 1} onClick={() => move(index + 1)}>{t('playground.shadowing.dictation.next_btn')} <ChevronRight size={14} /></button></div>
    <details className="sh-disclosure"><summary>{t('playground.shadowing.dictation.browse_transcript')} <span>{t('playground.shadowing.dictation.sentences_count', { count: lesson.sentences.length })}</span></summary><div className="sh-transcript-tools"><input className="sh-input" placeholder={t('playground.shadowing.dictation.search_placeholder')} aria-label={t('playground.shadowing.dictation.search_aria')} value={query} onChange={event => setQuery(event.target.value)} />
      <div className="sh-sentence-list">{lesson.sentences.map((item, itemIndex) => item.text.toLowerCase().includes(query.toLowerCase()) && <button key={item.id} className={`sh-sentence ${item.id === sentence.id ? 'sh-selected' : ''}`} aria-current={item.id === sentence.id ? 'step' : undefined} onClick={() => move(itemIndex)}><span>{t('playground.shadowing.dictation.sentence_step', { current: itemIndex + 1, total: lesson.sentences.length })} · {formatTime(item.start)}</span><small>{answer ? item.text : t('playground.shadowing.dictation.unrevealed_sentence')}</small></button>)}</div>
      {!lesson.sentences.some(item => item.text.toLowerCase().includes(query.toLowerCase())) && <p role="status">{t('playground.shadowing.dictation.no_matching')}</p>}
      <button className="sh-btn sh-quiet" onClick={copy}><Copy size={14} /> {t('playground.shadowing.dictation.copy_btn')}</button>{copyStatus && <p role="status">{copyStatus}</p>}
    </div></details>
  </section>;
}
