import { useCallback, useEffect, useRef, useState } from 'react';
import { Headphones, RefreshCw, Pause, Pencil } from 'lucide-react';
import { useReaderDictionary } from '@/features/reader/hooks/useReaderDictionary';
import { InPlaceDictionaryPopup } from '@/features/reader/components/InPlaceDictionaryPopup';
import { useYouTubePlayer } from '../../hooks/useYouTubePlayer';
import { useTranscriptSource } from '../../hooks/useTranscriptSource';
import type { TranscriptMode } from '../../hooks/useTranscriptSource';
import { useShadowingSession } from '../../hooks/useShadowingSession';
import { useSamplePlayback } from '../../hooks/useSamplePlayback';
import { draftFromLesson, draftFromTranscript, formatTime } from '../../lib/shadowing-lesson';
import { ShadowingTranscriptEditor } from '../shadowing/ShadowingTranscriptEditor';
import { ShadowingPracticePanel } from '../shadowing/ShadowingPracticePanel';
import { ShadowingDictationPanel } from '../shadowing/ShadowingDictationPanel';
import type { ShadowingLesson, TranscriptDraft } from '../../types/shadowing';
import '../shadowing/shadowing.css';

interface Props { isActive?: boolean }

export function VideoDictationShadowingScreen({ isActive = true }: Props) {
  const [url, setUrl] = useState(''), [lang, setLang] = useState('en');
  const [mode, setMode] = useState<TranscriptMode>('SHADOWING'), [clean, setClean] = useState(true);
  const [tab, setTab] = useState<'shadowing' | 'dictation'>('shadowing');
  const [draft, setDraft] = useState<TranscriptDraft | null>(null);
  const [busy, setBusy] = useState(false), [rate, setRate] = useState(1), [loop, setLoop] = useState(false), [autoPause, setAutoPause] = useState(true);
  const [uiError, setUiError] = useState<string | null>(null);
  const session = useShadowingSession();
  const lessonRef = useRef(session.lesson); lessonRef.current = session.lesson;
  const source = useTranscriptSource();
  const candidateGeneration = useRef(0);
  const videoId = draft?.videoId ?? session.lesson?.videoId ?? '';
  const player = useYouTubePlayer(videoId);
  const sample = useSamplePlayback(player.playerRef, isActive && !busy && !source.loading, rate, loop, draft ? true : autoPause);
  const { popupState, closeDictionary, handleTextSelection } = useReaderDictionary();

  const fetchTranscript = useCallback(async (input: string, language: string, segmentation: TranscriptMode, cleanTags: boolean) => {
    const generation = ++candidateGeneration.current;
    setUiError(null);
    const data = await source.load(input, language, segmentation, cleanTags);
    if (generation !== candidateGeneration.current || !data) return;
    try { setDraft(draftFromTranscript(data, lessonRef.current)); }
    catch (error) { setUiError(error instanceof Error ? error.message : 'Không đọc được transcript.'); }
  }, [source.load]);

  useEffect(() => () => { ++candidateGeneration.current; }, []);

  useEffect(() => {
    const hidden = () => { if (document.hidden) sample.stop(); };
    document.addEventListener('visibilitychange', hidden);
    return () => document.removeEventListener('visibilitychange', hidden);
  }, [sample.stop]);

  const apply = (lesson: ShadowingLesson) => { sample.stop(); session.dispatch({ type: 'apply', lesson }); setDraft(null); };
  const cancelDraft = () => { sample.stop(); setDraft(null); };
  const edit = () => { sample.stop(); if (session.lesson) setDraft(draftFromLesson(session.lesson)); };
  const switchTab = (next: 'shadowing' | 'dictation') => { sample.stop(); setTab(next); };

  return <div className="sh-hub" onMouseUp={handleTextSelection} onDoubleClick={handleTextSelection}>
    <header className="sh-row sh-between sh-wrap"><div className="sh-row"><Headphones size={26} /><div><h2>Video Dictation & Shadowing</h2><p>Một video · từng phần nội dung · giọng của bạn</p></div></div><span className="sh-notice">Bản thu giữ trong RAM của phiên</span></header>
    <form className="sh-toolbar" onSubmit={event => { event.preventDefault(); if (draft || busy || source.loading) return; sample.stop(); void fetchTranscript(url, lang, mode, clean); }}>
      <input className="sh-input" aria-label="Link video YouTube" placeholder="Link YouTube hoặc video ID" value={url} disabled={busy || source.loading} onChange={event => setUrl(event.target.value)} />
      <select className="sh-input" aria-label="Ngôn ngữ transcript" disabled={busy || source.loading} value={lang} onChange={event => setLang(event.target.value)}><option value="en">English</option><option value="vi">Tiếng Việt</option><option value="ja">日本語</option><option value="ko">한국어</option></select>
      <select className="sh-input" aria-label="Cách chia câu BE" disabled={busy || source.loading} value={mode} onChange={event => setMode(event.target.value as TranscriptMode)}>{['SHADOWING', 'SENTENCE', 'COMMA', 'RAW'].map(value => <option key={value}>{value}</option>)}</select>
      <label className="sh-row"><input type="checkbox" checked={clean} disabled={busy || source.loading} onChange={event => setClean(event.target.checked)} /> Lọc nhãn nhạc</label>
      <button className="sh-btn sh-primary" type="submit" disabled={busy || source.loading || !!draft || !url.trim()}><RefreshCw size={15} className={source.loading ? 'animate-spin' : ''} />{source.loading ? 'Đang lấy transcript…' : 'Lấy transcript từ BE'}</button>
    </form>
    {draft && <p>Áp dụng hoặc hủy bản nháp trước khi lấy lại transcript từ BE.</p>}
    {(source.error || uiError) && <p role="alert" className="sh-error">{uiError || source.error} {session.lesson ? 'Bài đang luyện và bản thu vẫn được giữ.' : ''}</p>}
    <div className="sh-workspace">
      <aside className="sh-video-column">
        <div className="sh-row sh-between"><h3>{draft?.title || session.lesson?.title || 'Video YouTube'}</h3><span>{formatTime(player.time)} / {formatTime(player.duration)}</span></div>
        <div className="sh-video relative"><div ref={player.containerRef} />{!videoId && <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-[#f6d888]">Dán link YouTube và lấy transcript để bắt đầu.</div>}</div>
        {player.error && <div className="sh-error" role="alert"><p>{player.error}</p><button className="sh-btn" disabled={busy} onClick={player.retry}>Tải lại player</button></div>}
        <div className="sh-row sh-wrap"><button className="sh-btn" disabled={!player.ready || busy} onClick={() => { sample.stop(); player.playerRef.current?.pauseVideo(); }}><Pause size={15} /> Dừng nghe mẫu</button><label>Tốc độ nghe <select className="sh-input" aria-label="Tốc độ nghe mẫu" disabled={!player.ready || busy} value={rate} onChange={event => { const next = Number(event.target.value); setRate(next); player.playerRef.current?.setPlaybackRate(next); }}>{[0.75, 1, 1.25].map(value => <option key={value} value={value}>{value}x</option>)}</select></label></div>
        <div className="sh-row sh-wrap"><label className="sh-row"><input type="checkbox" checked={loop} disabled={busy} onChange={event => setLoop(event.target.checked)} /> Lặp câu nghe mẫu</label><label className="sh-row"><input type="checkbox" checked={autoPause} disabled={busy || !!draft} onChange={event => setAutoPause(event.target.checked)} /> Tự dừng hết câu</label></div>
        <div className="sh-notice"><strong>Cách luyện</strong><p>Chỉnh lời và timing từ BE, chia video khoảng 3 phút thành các phần theo ý. Thu từng câu, nghe lại từng phần rồi phát lại cả video với giọng mình.</p><p>Chuyển phần vẫn giữ các bản thu. Reload hoặc rời trang sẽ mất phiên.</p></div>
      </aside>
      <main className="sh-content">
        <div className="sh-tabs mb-4" role="tablist" aria-label="Chế độ luyện"><button className="sh-btn" role="tab" aria-selected={tab === 'shadowing'} disabled={busy || !!draft} onClick={() => switchTab('shadowing')}>Shadowing</button><button className="sh-btn" role="tab" aria-selected={tab === 'dictation'} disabled={busy || !!draft} onClick={() => switchTab('dictation')}>Dictation</button></div>
        {draft ? <ShadowingTranscriptEditor key={draft.videoId} draft={draft} onChange={setDraft} duration={player.duration} ready={player.ready && !source.loading} takes={session.takes} onApply={apply} onCancel={cancelDraft} onPreview={sample.play} getTime={() => player.playerRef.current?.getCurrentTime() ?? 0} />
          : session.lesson ? tab === 'shadowing' ? <ShadowingPracticePanel lesson={session.lesson} takes={session.takes} dispatch={session.dispatch} playerRef={player.playerRef} playerTime={player.time} ready={player.ready} active={isActive && !source.loading} onBusy={setBusy} onEdit={edit} onSample={sample.play} onStopSample={sample.stop} />
            : <><button className="sh-btn mb-3" onClick={edit}><Pencil size={14} /> Sửa transcript và chia phần</button><ShadowingDictationPanel key={session.lesson.videoId} lesson={session.lesson} ready={player.ready} onSample={sample.play} onStop={sample.stop} /></>
          : <div className="sh-panel"><h3>{source.loading ? 'Đang lấy transcript từ BE…' : 'Bắt đầu với transcript của video'}</h3><p>Nhập link và lấy transcript. Bạn có thể chỉnh lời, đầu/cuối câu và đánh dấu các phần trước khi thu.</p></div>}
      </main>
    </div>
    <InPlaceDictionaryPopup {...popupState} onClose={closeDictionary} />
  </div>;
}
