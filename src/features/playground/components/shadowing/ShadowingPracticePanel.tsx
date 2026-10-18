import { useEffect, useState } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Pencil, Trash2, ChevronLeft, ChevronRight, Check, Volume2 } from 'lucide-react';
import type { Dispatch, RefObject } from 'react';
import { useSentenceRecorder } from '../../hooks/useSentenceRecorder';
import { useShadowingReplay } from '../../hooks/useShadowingReplay';
import type { SessionAction } from '../../hooks/useShadowingSession';
import { formatTime, totalTakeBytes, validTakeCount } from '../../lib/shadowing-lesson';
import type { ShadowingLesson, ShadowingPlayer, ShadowingTakes, ReplayScope } from '../../types/shadowing';
import { ShadowingTakeAudio } from './ShadowingTakeAudio';

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

  return <section className="sh-panel" aria-label="Luyện shadowing">
    <div className="sh-row sh-between"><div><h3>Lồng tiếng từng câu</h3><p>{count}/{lesson.sentences.length} câu · {lesson.parts.filter(p => validTakeCount(takes, p.sentenceIds) === p.sentenceIds.length).length}/{lesson.parts.length} phần hoàn tất · {(totalTakeBytes(takes) / 1024 / 1024).toFixed(1)} MiB / 32 MiB</p></div>
      <button className="sh-btn" disabled={recorder.busy} onClick={() => { replay.stop(); onStopSample(); onEdit(); }}><Pencil size={15} /> Biên tập</button></div>
    <nav className="sh-part-list" aria-label="Các phần luyện">{lesson.parts.map((item, index) => <button key={item.id} className={`sh-part ${item.id === part.id ? 'sh-selected' : ''}`} disabled={recorder.busy} aria-current={item.id === part.id ? 'step' : undefined} onClick={() => changePart(item.id)}><span>Phần {index + 1} · {formatTime(item.start)}–{formatTime(item.end)}</span><strong>{item.title}</strong><span>{validTakeCount(takes, item.sentenceIds)}/{item.sentenceIds.length} câu</span></button>)}</nav>
    <div className="sh-row sh-between"><h3>{part.title}</h3><span>{partCount}/{sentences.length} câu đã thu</span></div>
    <div className="sh-sentence-list" aria-label="Câu trong phần">{sentences.map((item, index) => <button key={item.id} disabled={recorder.busy} className={`sh-sentence ${item.id === sentence.id ? 'sh-selected' : ''}`} onClick={() => { replay.stop(); onStopSample(); setSentenceId(item.id); }}><span>{index + 1}. {item.text}</span><small>{takes[item.id]?.validity === 'valid' ? 'Đã thu' : takes[item.id] ? 'Cần kiểm tra / thu lại' : 'Chưa thu'} · {formatTime(item.start)}</small></button>)}</div>
    <article className="sh-target"><small>Câu {sentenceIndex + 1}/{sentences.length} · {formatTime(sentence.start)}–{formatTime(sentence.start + sentence.duration)}</small><p>{sentence.text}</p></article>
    <div className="sh-row sh-wrap">
      <button className="sh-btn" disabled={!ready || recorder.busy} onClick={sample}><Volume2 size={16} /> Nghe mẫu</button>
      {recorder.phase === 'recording' ? <button className="sh-btn sh-recording" onClick={recorder.stop}><Square size={16} /> Dừng thu · {recorder.elapsed.toFixed(1)}s</button>
        : <button className="sh-btn sh-primary" disabled={!ready || recorder.busy} onClick={record}><Mic size={16} /> {take ? 'Thu lại câu này' : 'Thu câu này'}</button>}
      {recorder.busy && recorder.phase !== 'recording' && <><span role="status">{recorder.phase === 'requesting' ? 'Đang mở microphone…' : recorder.phase === 'arming' ? 'Chờ video vào đúng mốc…' : 'Đang hoàn tất bản thu…'}</span><button className="sh-btn" onClick={recorder.cancel}>Hủy</button></>}
    </div>
    <p>Thu ở 1x với video tắt tiếng làm cue hình. Dùng tai nghe khi nghe mẫu. Bản thu chỉ giữ trong phiên; tải lại trang/rời trang sẽ mất.</p>
    {recorder.error && <p className="sh-error" role="alert">{recorder.error}</p>}
    {take && !recorder.busy && !replay.scope && <div className="sh-take"><ShadowingTakeAudio take={take} active={active} stopToken={previewEpoch} onPlay={() => { replay.stop(); onStopSample(); playerRef.current?.pauseVideo(); }} />
      {take.validity === 'needs-rerecord' && <p role="status">Timing đã đổi. Cần thu lại câu này trước khi nghe toàn bài.</p>}
      {take.validity === 'needs-review' && <div className="sh-row sh-wrap"><p>Nội dung đã sửa. Nghe kiểm tra bản thu.</p><button className="sh-btn" onClick={() => dispatch({ type: 'confirm', sentenceId: sentence.id })}><Check size={14} /> Bản thu vẫn khớp</button></div>}
      <button className="sh-btn" onClick={() => dispatch({ type: 'delete', sentenceId: sentence.id })}><Trash2 size={14} /> Xóa bản thu câu này</button></div>}
    <div className="sh-row sh-between"><button className="sh-btn" disabled={recorder.busy || sentenceIndex === 0} onClick={() => { onStopSample(); replay.stop(); setSentenceId(sentences[sentenceIndex - 1].id); }}><ChevronLeft size={14} /> Câu trước</button>
      <button className="sh-btn" disabled={recorder.busy || sentenceIndex === sentences.length - 1} onClick={() => { onStopSample(); replay.stop(); setSentenceId(sentences[sentenceIndex + 1].id); }}>Câu tiếp <ChevronRight size={14} /></button></div>
    <div className="sh-replay"><h3>Nghe lại với giọng của bạn</h3>
      <div className="sh-row sh-wrap"><button className="sh-btn" disabled={!ready || recorder.busy || !partCount} onClick={() => play({ kind: 'part', partId: part.id })}><Play size={15} /> Nghe lại phần này</button><button className="sh-btn sh-primary" disabled={!ready || recorder.busy || !count} onClick={() => play({ kind: 'video' })}><Play size={15} /> Phát lại toàn video</button></div>
      <p>Câu chưa có bản thu hợp lệ chỉ phát tiếng gốc nhỏ. Phần này còn {sentences.length - partCount} câu; toàn video còn {lesson.sentences.length - count} câu.</p>
      <div className="sh-volume-grid"><label>Tiếng video gốc: {replay.sourceVolume}%<input type="range" min="0" max="100" value={replay.sourceVolume} onChange={event => replay.setSourceVolume(Number(event.target.value))} /></label><label>Giọng của bạn: {replay.voiceVolume}%<input type="range" min="0" max="100" value={replay.voiceVolume} onChange={event => replay.setVoiceVolume(Number(event.target.value))} /></label></div>
      {replay.scope && <div className="sh-notice"><p role="status">{replay.status} · {replay.scope.kind === 'video' ? `Toàn video · ${playingPart?.title ?? ''}` : lesson.parts.find(p => p.id === (replay.scope?.kind === 'part' ? replay.scope.partId : ''))?.title}</p><div className="sh-row"><button className="sh-btn" onClick={replay.togglePause}><Pause size={14} /> Dừng / tiếp tục</button><button className="sh-btn" onClick={() => { if (replay.scope) play(replay.scope); }}><RotateCcw size={14} /> Từ đầu</button><button className="sh-btn" onClick={replay.stop}>Về luyện câu</button></div></div>}
      {replay.error && <p role="alert" className="sh-error">{replay.error}</p>}
    </div>
    <div className="sh-row sh-between"><button className="sh-btn" disabled={recorder.busy || partIndex === 0} onClick={() => changePart(lesson.parts[partIndex - 1].id)}><ChevronLeft size={14} /> Phần trước</button><button className="sh-btn" disabled={recorder.busy || partIndex === lesson.parts.length - 1} onClick={() => changePart(lesson.parts[partIndex + 1].id)}>Phần tiếp theo <ChevronRight size={14} /></button></div>
  </section>;
}
