import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('playground');
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

  return <section className="sh-panel sh-learning-panel" aria-label={t('playground.shadowing.screen.aria_shadowing_practice')}>
    <div className="sh-row sh-between sh-learning-heading"><div><span className="sh-eyebrow">{t('playground.shadowing.practice.eyebrow')}</span><h3>{t('playground.shadowing.practice.title')}</h3><p>{t('playground.shadowing.practice.progress_desc', { done: count, total: lesson.sentences.length, partsDone: lesson.parts.filter(p => validTakeCount(takes, p.sentenceIds) === p.sentenceIds.length).length, totalParts: lesson.parts.length })}</p></div>
      <button className="sh-btn sh-quiet" disabled={recorder.busy} onClick={() => { replay.stop(); onStopSample(); onEdit(); }}><Pencil size={15} /> {t('playground.shadowing.practice.edit_transcript_btn')}</button></div>
    <progress className="sh-progress" aria-label={t('playground.shadowing.practice.progress_aria')} value={count} max={lesson.sentences.length} />
    <details className="sh-disclosure"><summary>{t('playground.shadowing.practice.browse_parts')} <span>{t('playground.shadowing.practice.part_step', { current: partIndex + 1, total: lesson.parts.length })}</span></summary><nav className="sh-part-list" aria-label={t('playground.shadowing.practice.parts_nav_aria')}>{lesson.parts.map((item, index) => <button key={item.id} className={`sh-part ${item.id === part.id ? 'sh-selected' : ''}`} disabled={recorder.busy} aria-current={item.id === part.id ? 'step' : undefined} onClick={() => changePart(item.id)}><span>{t('playground.shadowing.practice.part_title_format', { number: index + 1 })} · {formatTime(item.start)}–{formatTime(item.end)}</span><strong>{partTitle(item.title)}</strong><span>{t('playground.shadowing.practice.sentences_recorded', { count: validTakeCount(takes, item.sentenceIds), total: item.sentenceIds.length })}</span></button>)}</nav><div className="sh-row sh-between sh-part-navigation"><button className="sh-btn sh-quiet" disabled={recorder.busy || partIndex === 0} onClick={() => changePart(lesson.parts[partIndex - 1].id)}><ChevronLeft size={14} /> {t('playground.shadowing.practice.prev_part')}</button><button className="sh-btn sh-quiet" disabled={recorder.busy || partIndex === lesson.parts.length - 1} onClick={() => changePart(lesson.parts[partIndex + 1].id)}>{t('playground.shadowing.practice.next_part')} <ChevronRight size={14} /></button></div></details>
    <div className="sh-row sh-between sh-section-heading"><h3>{partTitle(part.title)}</h3><span>{t('playground.shadowing.practice.part_recorded_count', { count: partCount, total: sentences.length })}</span></div>

    <article className="sh-target"><small>{t('playground.shadowing.practice.sentence_caption', { current: sentenceIndex + 1, total: sentences.length })} · {formatTime(sentence.start)}–{formatTime(sentence.start + sentence.duration)}</small><p>{sentence.text}</p></article>
    <div className="sh-row sh-wrap sh-main-actions">
      <button className="sh-btn" disabled={!ready || recorder.busy} onClick={sample}><Volume2 size={16} /> {t('playground.shadowing.practice.listen_btn')}</button>
      {recorder.phase === 'recording' ? <button className="sh-btn sh-recording" onClick={recorder.stop}><Square size={16} /> {t('playground.shadowing.practice.stop_recording_btn', { elapsed: recorder.elapsed.toFixed(1) })}</button>
        : <button className="sh-btn sh-primary" disabled={!ready || recorder.busy} onClick={record}><Mic size={16} /> {take ? t('playground.shadowing.practice.record_again_btn') : t('playground.shadowing.practice.record_sentence_btn')}</button>}
      {recorder.busy && recorder.phase !== 'recording' && <><span role="status">{recorder.phase === 'requesting' ? t('playground.shadowing.practice.opening_mic') : recorder.phase === 'arming' ? t('playground.shadowing.practice.preparing_cue') : t('playground.shadowing.practice.finishing_rec')}</span><button className="sh-btn" onClick={recorder.cancel}>{t('playground.shadowing.practice.cancel_rec')}</button></>}
    </div>
    <p className="sh-session-note">{t('playground.shadowing.practice.headphones_note')}</p>
    {recorder.error && <p className="sh-error" role="alert">{practiceMessage(recorder.error)}</p>}
    {take && !recorder.busy && !replay.scope && <div className="sh-take"><span className="sh-eyebrow">{t('playground.shadowing.practice.your_recording')}</span><ShadowingTakeAudio take={take} active={active} stopToken={previewEpoch} onPlay={() => { replay.stop(); onStopSample(); playerRef.current?.pauseVideo(); }} />
      {take.validity === 'needs-rerecord' && <p role="status">{t('playground.shadowing.practice.timing_changed')}</p>}
      {take.validity === 'needs-review' && <div className="sh-row sh-wrap"><p>{t('playground.shadowing.practice.words_changed')}</p><button className="sh-btn" onClick={() => dispatch({ type: 'confirm', sentenceId: sentence.id })}><Check size={14} /> {t('playground.shadowing.practice.keep_recording')}</button></div>}
      <button className="sh-btn sh-quiet" onClick={() => dispatch({ type: 'delete', sentenceId: sentence.id })}><Trash2 size={14} /> {t('playground.shadowing.practice.delete_recording')}</button></div>}
    <div className="sh-row sh-between sh-sentence-navigation"><button aria-label={t('playground.shadowing.practice.prev_sentence')} className="sh-btn sh-quiet" disabled={recorder.busy || sentenceIndex === 0} onClick={() => { onStopSample(); replay.stop(); setSentenceId(sentences[sentenceIndex - 1].id); }}><ChevronLeft size={14} /> {t('playground.shadowing.practice.prev_sentence')}</button>
      <button aria-label={t('playground.shadowing.practice.next_sentence')} className="sh-btn sh-quiet" disabled={recorder.busy || sentenceIndex === sentences.length - 1} onClick={() => { onStopSample(); replay.stop(); setSentenceId(sentences[sentenceIndex + 1].id); }}>{t('playground.shadowing.practice.next_sentence')} <ChevronRight size={14} /></button></div>
    <details className="sh-disclosure"><summary>{t('playground.shadowing.practice.browse_sentences')} <span>{t('playground.shadowing.practice.sentence_caption', { current: sentenceIndex + 1, total: sentences.length })}</span></summary><div className="sh-sentence-list" aria-label={t('playground.shadowing.practice.sentences_in_part_aria')}>{sentences.map((item, index) => <button key={item.id} disabled={recorder.busy} className={`sh-sentence ${item.id === sentence.id ? 'sh-selected' : ''}`} aria-current={item.id === sentence.id ? 'step' : undefined} onClick={() => { replay.stop(); onStopSample(); setSentenceId(item.id); }}><span>{index + 1}. {item.text}</span><small>{takes[item.id]?.validity === 'valid' ? t('playground.shadowing.practice.status_recorded') : takes[item.id] ? t('playground.shadowing.practice.status_needs_review') : t('playground.shadowing.practice.status_not_recorded')} · {formatTime(item.start)}</small></button>)}</div></details>
    <details className="sh-disclosure sh-replay-disclosure"><summary>{t('playground.shadowing.practice.review_your_voice')} <span>{t('playground.shadowing.practice.review_recorded_count', { count })}</span></summary><div className="sh-replay">
      <div className="sh-row sh-wrap"><button className="sh-btn" disabled={!ready || recorder.busy || !partCount} onClick={() => play({ kind: 'part', partId: part.id })}><Play size={15} /> {t('playground.shadowing.practice.replay_part_btn')}</button><button className="sh-btn" disabled={!ready || recorder.busy || !count} onClick={() => play({ kind: 'video' })}><Play size={15} /> {t('playground.shadowing.practice.replay_video_btn')}</button></div>
      <p>{t('playground.shadowing.practice.unrecorded_note', { partLeft: sentences.length - partCount, videoLeft: lesson.sentences.length - count })}</p>
      <div className="sh-volume-grid"><label>{t('playground.shadowing.practice.original_audio_label', { volume: replay.sourceVolume })}<input type="range" min="0" max="100" value={replay.sourceVolume} onChange={event => replay.setSourceVolume(Number(event.target.value))} /></label><label>{t('playground.shadowing.practice.your_voice_label', { volume: replay.voiceVolume })}<input type="range" min="0" max="100" value={replay.voiceVolume} onChange={event => replay.setVoiceVolume(Number(event.target.value))} /></label></div>
      {replay.scope && <div className="sh-notice"><p role="status">{practiceMessage(replay.status)} · {replay.scope.kind === 'video' ? t('playground.shadowing.practice.full_video_scope', { title: partTitle(playingPart?.title ?? '') }) : partTitle(lesson.parts.find(p => p.id === (replay.scope?.kind === 'part' ? replay.scope.partId : ''))?.title ?? '')}</p><div className="sh-row"><button className="sh-btn" onClick={replay.togglePause}><Pause size={14} /> {t('playground.shadowing.practice.pause_resume')}</button><button className="sh-btn" onClick={() => { if (replay.scope) play(replay.scope); }}><RotateCcw size={14} /> {t('playground.shadowing.practice.restart')}</button><button className="sh-btn" onClick={replay.stop}>{t('playground.shadowing.practice.back_to_practice')}</button></div></div>}
      {replay.error && <p role="alert" className="sh-error">{practiceMessage(replay.error)}</p>}
    <p className="sh-session-note">{t('playground.shadowing.practice.session_storage_note', { used: (totalTakeBytes(takes) / 1024 / 1024).toFixed(1) })}</p></div></details>

  </section>;
}
