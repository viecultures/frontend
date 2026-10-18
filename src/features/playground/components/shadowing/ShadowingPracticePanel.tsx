import { useEffect, useState } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Pencil, Trash2, ChevronLeft, ChevronRight, Check, Volume2 } from 'lucide-react';
import type { Dispatch, RefObject } from 'react';
import { useSentenceRecorder } from '../../hooks/useSentenceRecorder';
import { useShadowingReplay } from '../../hooks/useShadowingReplay';
import type { SessionAction } from '../../hooks/useShadowingSession';
import { formatTime, totalTakeBytes, validTakeCount } from '../../lib/shadowing-lesson';
import type { ShadowingLesson, ShadowingPlayer, ShadowingTakes, ReplayScope } from '../../types/shadowing';
import { ShadowingTakeAudio } from './ShadowingTakeAudio';
import { practiceMessage } from './practice-copy';

const partTitle = (title: string) => title.replace(/^Phần (\d+)$/, 'Part $1');

interface Props {
  lesson: ShadowingLesson; takes: ShadowingTakes; playerRef: RefObject<ShadowingPlayer | null>;
  active: boolean; ready: boolean; playerTime: number; dispatch: Dispatch<SessionAction>;
  onEdit(): void; onBusy(busy: boolean): void; onSample(start: number, end: number): void; onStopSample(): void;
}

export function ShadowingPracticePanel({ lesson, takes, playerRef, active, ready, playerTime, dispatch, onEdit, onBusy, onSample, onStopSample }: Props) {
  const [partId, setPartId] = useState(lesson.parts[0].id);
  const [sentenceId, setSentenceId] = useState(lesson.sentences[0].id);
  const [previewEpoch, setPreviewEpoch] = useState(0);
  const replay = useShadowingReplay(playerRef, active);
  const recorder = useSentenceRecorder({ playerRef, active, onTake: take => dispatch({ type: 'take', take }) });
  const part = lesson.parts.find(p => p.id === partId) ?? lesson.parts[0];
  const sentences = lesson.sentences.filter(s => part.sentenceIds.includes(s.id));
  const sentence = sentences.find(s => s.id === sentenceId) ?? sentences[0];
  const take = takes[sentence.id];
  const partIndex = lesson.parts.indexOf(part), sentenceIndex = sentences.indexOf(sentence);
  const count = validTakeCount(takes, lesson.sentences.map(s => s.id));
  const partCount = validTakeCount(takes, part.sentenceIds);
  const playingPart = lesson.parts.find(p => playerTime >= p.start && playerTime < p.end);
  const changePart = (id: string) => { setPreviewEpoch(value => value + 1); replay.stop(); onStopSample(); setPartId(id); setSentenceId(lesson.parts.find(p => p.id === id)!.sentenceIds[0]); };
  const play = (scope: ReplayScope) => { onStopSample(); replay.start(lesson, takes, scope); };
  const sample = () => { setPreviewEpoch(value => value + 1); replay.stop(); onSample(sentence.start, sentence.start + sentence.duration); };
  const record = () => { replay.stop(); onStopSample(); recorder.start(sentence, takes); };
  useEffect(() => { onBusy(recorder.busy || !!replay.scope); return () => onBusy(false); }, [recorder.busy, replay.scope, onBusy]);
  useEffect(() => { const hidden = () => { if (document.hidden) recorder.cancel(); }; document.addEventListener('visibilitychange', hidden); return () => document.removeEventListener('visibilitychange', hidden); }, [recorder.cancel]);
  useEffect(() => { if (!active) onStopSample(); }, [active, onStopSample]);

  return <section className="sh-panel sh-learning-panel" aria-label="Shadowing practice">
    <div className="sh-row sh-between sh-learning-heading"><div><span className="sh-eyebrow">Listen · Record · Compare</span><h3>Make the sentence your own</h3><p>{count}/{lesson.sentences.length} sentences · {lesson.parts.filter(p => validTakeCount(takes, p.sentenceIds) === p.sentenceIds.length).length}/{lesson.parts.length} parts complete</p></div>
      <button className="sh-btn sh-quiet" disabled={recorder.busy} onClick={() => { replay.stop(); onStopSample(); onEdit(); }}><Pencil size={15} /> Edit transcript</button></div>
    <progress className="sh-progress" aria-label="Recorded sentences" value={count} max={lesson.sentences.length} />
    <details className="sh-disclosure"><summary>Browse parts <span>Part {partIndex + 1} of {lesson.parts.length}</span></summary><nav className="sh-part-list" aria-label="Practice parts">{lesson.parts.map((item, index) => <button key={item.id} className={`sh-part ${item.id === part.id ? 'sh-selected' : ''}`} disabled={recorder.busy} aria-current={item.id === part.id ? 'step' : undefined} onClick={() => changePart(item.id)}><span>Part {index + 1} · {formatTime(item.start)}–{formatTime(item.end)}</span><strong>{partTitle(item.title)}</strong><span>{validTakeCount(takes, item.sentenceIds)}/{item.sentenceIds.length} sentences</span></button>)}</nav><div className="sh-row sh-between sh-part-navigation"><button className="sh-btn sh-quiet" disabled={recorder.busy || partIndex === 0} onClick={() => changePart(lesson.parts[partIndex - 1].id)}><ChevronLeft size={14} /> Previous part</button><button className="sh-btn sh-quiet" disabled={recorder.busy || partIndex === lesson.parts.length - 1} onClick={() => changePart(lesson.parts[partIndex + 1].id)}>Next part <ChevronRight size={14} /></button></div></details>
    <div className="sh-row sh-between sh-section-heading"><h3>{partTitle(part.title)}</h3><span>{partCount}/{sentences.length} recorded</span></div>

    <article className="sh-target"><small>Sentence {sentenceIndex + 1}/{sentences.length} · {formatTime(sentence.start)}–{formatTime(sentence.start + sentence.duration)}</small><p>{sentence.text}</p></article>
    <div className="sh-row sh-wrap sh-main-actions">
      <button className="sh-btn" disabled={!ready || recorder.busy} onClick={sample}><Volume2 size={16} /> Listen</button>
      {recorder.phase === 'recording' ? <button className="sh-btn sh-recording" onClick={recorder.stop}><Square size={16} /> Stop recording · {recorder.elapsed.toFixed(1)}s</button>
        : <button className="sh-btn sh-primary" disabled={!ready || recorder.busy} onClick={record}><Mic size={16} /> {take ? 'Record again' : 'Record sentence'}</button>}
      {recorder.busy && recorder.phase !== 'recording' && <><span role="status">{recorder.phase === 'requesting' ? 'Opening microphone…' : recorder.phase === 'arming' ? 'Preparing video cue…' : 'Finishing recording…'}</span><button className="sh-btn" onClick={recorder.cancel}>Cancel</button></>}
    </div>
    <p className="sh-session-note">Record at 1x with a silent video cue. Use headphones for the sample. Recordings stay in this session.</p>
    {recorder.error && <p className="sh-error" role="alert">{practiceMessage(recorder.error)}</p>}
    {take && !recorder.busy && !replay.scope && <div className="sh-take"><span className="sh-eyebrow">Your recording</span><ShadowingTakeAudio take={take} active={active} stopToken={previewEpoch} onPlay={() => { replay.stop(); onStopSample(); playerRef.current?.pauseVideo(); }} />
      {take.validity === 'needs-rerecord' && <p role="status">Timing changed. Record this sentence again before replaying the lesson.</p>}
      {take.validity === 'needs-review' && <div className="sh-row sh-wrap"><p>The words changed. Listen to check your recording.</p><button className="sh-btn" onClick={() => dispatch({ type: 'confirm', sentenceId: sentence.id })}><Check size={14} /> Keep this recording</button></div>}
      <button className="sh-btn sh-quiet" onClick={() => dispatch({ type: 'delete', sentenceId: sentence.id })}><Trash2 size={14} /> Delete recording</button></div>}
    <div className="sh-row sh-between sh-sentence-navigation"><button aria-label="Previous sentence" className="sh-btn sh-quiet" disabled={recorder.busy || sentenceIndex === 0} onClick={() => { onStopSample(); replay.stop(); setSentenceId(sentences[sentenceIndex - 1].id); }}><ChevronLeft size={14} /> Previous</button>
      <button aria-label="Next sentence" className="sh-btn sh-quiet" disabled={recorder.busy || sentenceIndex === sentences.length - 1} onClick={() => { onStopSample(); replay.stop(); setSentenceId(sentences[sentenceIndex + 1].id); }}>Next <ChevronRight size={14} /></button></div>
    <details className="sh-disclosure"><summary>Browse sentences <span>{sentenceIndex + 1} of {sentences.length}</span></summary><div className="sh-sentence-list" aria-label="Sentences in this part">{sentences.map((item, index) => <button key={item.id} disabled={recorder.busy} className={`sh-sentence ${item.id === sentence.id ? 'sh-selected' : ''}`} aria-current={item.id === sentence.id ? 'step' : undefined} onClick={() => { replay.stop(); onStopSample(); setSentenceId(item.id); }}><span>{index + 1}. {item.text}</span><small>{takes[item.id]?.validity === 'valid' ? 'Recorded' : takes[item.id] ? 'Review needed' : 'Not recorded'} · {formatTime(item.start)}</small></button>)}</div></details>
    <details className="sh-disclosure sh-replay-disclosure"><summary>Review your voice <span>{count} recorded</span></summary><div className="sh-replay">
      <div className="sh-row sh-wrap"><button className="sh-btn" disabled={!ready || recorder.busy || !partCount} onClick={() => play({ kind: 'part', partId: part.id })}><Play size={15} /> Replay this part</button><button className="sh-btn" disabled={!ready || recorder.busy || !count} onClick={() => play({ kind: 'video' })}><Play size={15} /> Replay full video</button></div>
      <p>Unrecorded sentences use the original audio. {sentences.length - partCount} left in this part · {lesson.sentences.length - count} in the video.</p>
      <div className="sh-volume-grid"><label>Original audio: {replay.sourceVolume}%<input type="range" min="0" max="100" value={replay.sourceVolume} onChange={event => replay.setSourceVolume(Number(event.target.value))} /></label><label>Your voice: {replay.voiceVolume}%<input type="range" min="0" max="100" value={replay.voiceVolume} onChange={event => replay.setVoiceVolume(Number(event.target.value))} /></label></div>
      {replay.scope && <div className="sh-notice"><p role="status">{practiceMessage(replay.status)} · {replay.scope.kind === 'video' ? `Full video · ${partTitle(playingPart?.title ?? '')}` : partTitle(lesson.parts.find(p => p.id === (replay.scope?.kind === 'part' ? replay.scope.partId : ''))?.title ?? '')}</p><div className="sh-row"><button className="sh-btn" onClick={replay.togglePause}><Pause size={14} /> Pause / resume</button><button className="sh-btn" onClick={() => { if (replay.scope) play(replay.scope); }}><RotateCcw size={14} /> Restart</button><button className="sh-btn" onClick={replay.stop}>Back to practice</button></div></div>}
      {replay.error && <p role="alert" className="sh-error">{practiceMessage(replay.error)}</p>}
    <p className="sh-session-note">Session storage: {(totalTakeBytes(takes) / 1024 / 1024).toFixed(1)} / 32 MiB</p></div></details>

  </section>;
}
