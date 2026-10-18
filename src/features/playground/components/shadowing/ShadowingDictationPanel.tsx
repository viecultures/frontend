import { useEffect, useRef, useState } from 'react';
import { Check, Eye, Lightbulb, Play, Copy } from 'lucide-react';
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
    try { await navigator.clipboard.writeText(lesson.sentences.map(s => `[${formatTime(s.start)}] ${s.text}`).join('\n')); setCopyStatus('Đã sao chép'); }
    catch { setCopyStatus('Không sao chép được. Kiểm tra quyền clipboard.'); }
  };
  return <section className="sh-panel" aria-label="Chép chính tả">
    <div className="sh-row sh-between"><h3>Nghe và chép lại</h3><button className="sh-btn" onClick={copy}><Copy size={14} /> Sao chép transcript</button></div>{copyStatus && <p role="status">{copyStatus}</p>}
    <input className="sh-input" placeholder="Tìm trong transcript…" aria-label="Tìm câu dictation" value={query} onChange={event => setQuery(event.target.value)} />
    <div className="sh-sentence-list">{lesson.sentences.map((item, itemIndex) => item.text.toLowerCase().includes(query.toLowerCase()) && <button key={item.id} className={`sh-sentence ${item.id === sentence.id ? 'sh-selected' : ''}`} onClick={() => { onStop(); setIndex(itemIndex); }}><span>Câu {itemIndex + 1} · {formatTime(item.start)}</span><small>{answer ? item.text : 'Nghe và viết lại câu này'}</small></button>)}</div>
    <button className="sh-btn" disabled={!ready} onClick={() => onSample(sentence.start, sentence.start + sentence.duration)}><Play size={14} /> Nghe câu {index + 1}</button>
    <textarea className="sh-input" rows={4} aria-label="Bài chép chính tả" value={text} onChange={event => setText(event.target.value)} placeholder="Viết lại những gì bạn nghe được…" />
    <div className="sh-row sh-wrap"><button className="sh-btn" onClick={() => setHint(value => !value)}><Lightbulb size={14} /> Gợi ý</button><button className="sh-btn" onClick={() => setAnswer(value => !value)}><Eye size={14} /> Đáp án</button><button className="sh-btn sh-primary" disabled={!text.trim() || checking} onClick={check}><Check size={14} /> {checking ? 'Đang kiểm tra…' : 'Kiểm tra'}</button></div>
    {hint && <p>{generateHintScaffold(sentence.text)}</p>}{answer && <p>{sentence.text}</p>}
    {result && <div className="sh-notice"><strong>Độ khớp từ: {result.accuracy}%</strong><p>{result.feedback}</p><p>{result.diff.map((token, i) => <span key={i} className={token.status === 'correct' ? 'text-emerald-700' : 'text-red-600'}>{token.word}{' '}</span>)}</p></div>}
  </section>;
}
