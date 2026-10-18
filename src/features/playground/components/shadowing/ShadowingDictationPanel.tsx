import { useEffect, useRef, useState } from 'react';
import { Check, Eye, Lightbulb, Play, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { dictationApiService, generateHintScaffold } from '../../services/dictationService';
import type { DictationCheckResult } from '../../services/dictationService';
import type { ShadowingLesson } from '../../types/shadowing';
import { formatTime } from '../../lib/shadowing-lesson';

interface Props { lesson: ShadowingLesson; ready: boolean; onSample(start: number, end: number): void; onStop(): void }
export function ShadowingDictationPanel({ lesson, ready, onSample, onStop }: Props) {
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
    try { await navigator.clipboard.writeText(lesson.sentences.map(s => `[${formatTime(s.start)}] ${s.text}`).join('\n')); setCopyStatus('Transcript copied'); }
    catch { setCopyStatus('Unable to copy. Check clipboard permission.'); }
  };
  const move = (next: number) => { onStop(); setIndex(next); };
  const feedback = !result ? '' : result.accuracy >= 98 ? 'Every word matched. Try the next sentence.'
    : result.accuracy >= 80 ? 'Most words matched. Listen again for the remaining details.'
    : result.accuracy >= 50 ? 'Try a hint or a slower listening speed.' : 'Listen again for linking sounds, articles and word endings.';
  return <section className="sh-panel sh-learning-panel" aria-label="Dictation practice">
    <header className="sh-learning-heading"><span className="sh-eyebrow">Listen · Write · Check</span><h3>Catch every word</h3><p>Focus on one sentence. Replay it as often as you need.</p></header>
    <div className="sh-step-caption"><span>Sentence {index + 1} of {lesson.sentences.length}</span><span className="sh-time">{formatTime(sentence.start)}–{formatTime(sentence.start + sentence.duration)}</span></div>
    <div className="sh-dictation-prompt"><button className="sh-btn" disabled={!ready} onClick={() => onSample(sentence.start, sentence.start + sentence.duration)}><Play size={16} /> Listen to sentence</button><p>Listen first, then type what you hear.</p></div>
    <label className="sh-eyebrow" htmlFor="dictation-answer">Your answer</label>
    <textarea id="dictation-answer" className="sh-input sh-answer-input" rows={5} aria-label="Your dictation" value={text} onChange={event => setText(event.target.value)} placeholder="Type what you hear…" />
    <div className="sh-row sh-between sh-dictation-actions"><div className="sh-row"><button className="sh-btn sh-quiet" aria-pressed={hint} onClick={() => setHint(value => !value)}><Lightbulb size={14} /> Hint</button><button className="sh-btn sh-quiet" aria-pressed={answer} onClick={() => setAnswer(value => !value)}><Eye size={14} /> Answer</button></div><button className="sh-btn sh-primary" disabled={!text.trim() || checking} onClick={check}><Check size={14} /> {checking ? 'Checking…' : 'Check answer'}</button></div>
    {hint && <div className="sh-notice" role="status"><span className="sh-eyebrow">Word hint</span><p>{generateHintScaffold(sentence.text)}</p></div>}
    {answer && <div className="sh-notice"><span className="sh-eyebrow">Original sentence</span><p>{sentence.text}</p></div>}
    {result && <div className="sh-notice sh-dictation-result" role="status"><h3>Word match: {result.accuracy}%</h3><p>{feedback}</p><p className="sh-diff">{result.diff.map((token, i) => <span key={i} className={`sh-diff-${token.status}`} title={token.status === 'correct' ? 'Matched' : `${token.status}${token.expected ? `: ${token.expected}` : ''}`}>{token.status === 'missing' ? `[Missing: ${token.expected ?? token.word}]` : token.word}{' '}</span>)}</p></div>}
    <div className="sh-row sh-between sh-sentence-navigation"><button aria-label="Previous sentence" className="sh-btn sh-quiet" disabled={index === 0} onClick={() => move(index - 1)}><ChevronLeft size={14} /> Previous</button><button aria-label="Next sentence" className="sh-btn sh-quiet" disabled={index === lesson.sentences.length - 1} onClick={() => move(index + 1)}>Next <ChevronRight size={14} /></button></div>
    <details className="sh-disclosure"><summary>Browse transcript <span>{lesson.sentences.length} sentences</span></summary><div className="sh-transcript-tools"><input className="sh-input" placeholder="Search transcript…" aria-label="Search dictation sentences" value={query} onChange={event => setQuery(event.target.value)} />
      <div className="sh-sentence-list">{lesson.sentences.map((item, itemIndex) => item.text.toLowerCase().includes(query.toLowerCase()) && <button key={item.id} className={`sh-sentence ${item.id === sentence.id ? 'sh-selected' : ''}`} aria-current={item.id === sentence.id ? 'step' : undefined} onClick={() => move(itemIndex)}><span>Sentence {itemIndex + 1} · {formatTime(item.start)}</span><small>{answer ? item.text : 'Listen and write this sentence'}</small></button>)}</div>
      {!lesson.sentences.some(item => item.text.toLowerCase().includes(query.toLowerCase())) && <p role="status">No matching sentences.</p>}
      <button className="sh-btn sh-quiet" onClick={copy}><Copy size={14} /> Copy transcript</button>{copyStatus && <p role="status">{copyStatus}</p>}
    </div></details>
  </section>;
}
