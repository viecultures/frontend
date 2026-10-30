import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Headphones, Mic, PenLine, Pause, Pencil, Play, ChevronUp, ChevronDown } from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useReaderDictionary } from '@/features/reader/hooks/useReaderDictionary';
import { InPlaceDictionaryPopup } from '@/features/reader/components/InPlaceDictionaryPopup';
import { useYouTubePlayer } from '../../hooks/useYouTubePlayer';
import { useTranscriptSource } from '../../hooks/useTranscriptSource';
import type { TranscriptMode } from '../../hooks/useTranscriptSource';
import { useShadowingSession } from '../../hooks/useShadowingSession';
import { useSamplePlayback } from '../../hooks/useSamplePlayback';
import { applyDraft, validateDraft, draftFromLesson, draftFromTranscript, formatTime } from '../../lib/shadowing-lesson';
import { ShadowingTranscriptEditor } from '../shadowing/ShadowingTranscriptEditor';
import { ShadowingPracticePanel } from '../shadowing/ShadowingPracticePanel';
import { ShadowingDictationPanel } from '../shadowing/ShadowingDictationPanel';
import type { ShadowingLesson, TranscriptDraft } from '../../types/shadowing';
import { PracticeHeader } from '../shadowing/PracticeHeader';
import { PracticeSourceForm } from '../shadowing/PracticeSourceForm';
import { PracticeSettings } from '../shadowing/PracticeSettings';
import '../shadowing/shadowing.css';
import '../shadowing/practice-workspace.css';

interface Props { isActive?: boolean }

export function VideoDictationShadowingScreen({ isActive = true }: Props) {
  const { t } = useTranslation('playground');
  const [url, setUrl] = useState(''), [lang, setLang] = useState('en');
  const [mode, setMode] = useState<TranscriptMode>('SHADOWING'), [clean, setClean] = useState(true);
  const [tab, setTab] = useState<'shadowing' | 'dictation'>('shadowing');
  const [draft, setDraft] = useState<TranscriptDraft | null>(null);
  const [editingDraft, setEditingDraft] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false), [sourceOpen, setSourceOpen] = useState(false);
  const [videoCollapsed, setVideoCollapsed] = useState(false);
  const [theme, setTheme] = useState<'paper' | 'dark'>(() => document.documentElement.classList.contains('dark') ? 'dark' : 'paper');
  const [busy, setBusy] = useState(false), [rate, setRate] = useState(1), [loop, setLoop] = useState(false), [autoPause, setAutoPause] = useState(true);
  const [uiError, setUiError] = useState<string | null>(null);
  const session = useShadowingSession();
  const lessonRef = useRef(session.lesson); lessonRef.current = session.lesson;
  const source = useTranscriptSource();
  const candidateGeneration = useRef(0);
  const videoId = draft?.videoId ?? session.lesson?.videoId ?? '';
  const player = useYouTubePlayer(videoId);
  const sample = useSamplePlayback(player.playerRef, isActive && !busy && !source.loading && !player.error, rate, loop, draft ? true : autoPause);
  const { popupState, closeDictionary, handleTextSelection } = useReaderDictionary();

  const fetchTranscript = useCallback(async (input: string, language: string, segmentation: TranscriptMode, cleanTags: boolean) => {
    const generation = ++candidateGeneration.current;
    setUiError(null);
    const data = await source.load(input, language, segmentation, cleanTags);
    if (generation !== candidateGeneration.current || !data) return;
    try { setDraft(draftFromTranscript(data, lessonRef.current)); setEditingDraft(false); setSourceOpen(false); setVideoCollapsed(false); }
    catch (error) { setUiError(error instanceof Error ? error.message : 'Unable to read this transcript.'); }
  }, [source.load]);

  useEffect(() => () => { ++candidateGeneration.current; }, []);

  useEffect(() => {
    const hidden = () => { if (document.hidden) sample.stop(); };
    document.addEventListener('visibilitychange', hidden);
    return () => document.removeEventListener('visibilitychange', hidden);
  }, [sample.stop]);

  const apply = (lesson: ShadowingLesson) => { sample.stop(); session.dispatch({ type: 'apply', lesson }); setDraft(null); setEditingDraft(false); };
  const cancelDraft = () => { sample.stop(); setDraft(null); setEditingDraft(false); };
  const edit = () => { sample.stop(); if (session.lesson) { setDraft(draftFromLesson(session.lesson)); setEditingDraft(true); } };
  const switchTab = (next: 'shadowing' | 'dictation') => { sample.stop(); setTab(next); };

  const draftErrors = draft ? validateDraft(draft, player.duration) : [];
  const removedTakes = draft ? Object.keys(session.takes).filter(id => !draft.rows.some(row => row.id === id)).length : 0;
  const sourceError = uiError ? t('playground.shadowing.screen.transcript_prepare_error')
    : source.error;
  const sourceForm = <PracticeSourceForm url={url} language={lang} mode={mode} clean={clean}
    loading={source.loading} disabled={busy || !!draft} onUrl={setUrl} onLanguage={setLang} onMode={setMode} onClean={setClean}
    onSubmit={() => { sample.stop(); void fetchTranscript(url, lang, mode, clean); }} />;

  return <div className="sh-hub sh-practice-workspace" data-theme={theme} onMouseUp={handleTextSelection} onDoubleClick={handleTextSelection}>
    <PracticeHeader title={draft?.title || session.lesson?.title || t('playground.shadowing.screen.default_title')} tab={tab}
      disabled={busy || source.loading || !!draft} onTab={switchTab} onSettings={() => setSettingsOpen(true)} />
    {sourceError && <p role="alert" className="sh-error">{sourceError}{session.lesson && t('playground.shadowing.screen.lesson_safe_note')}</p>}
    {!videoId && <div className="sh-start-screen"><div className="sh-start-card">
      <div className="sh-start-icon"><Headphones size={24} /></div>
      <span className="sh-eyebrow">{t('playground.shadowing.screen.hero_eyebrow')}</span>
      <h1>{t('playground.shadowing.screen.hero_title')}</h1>
      <p>{t('playground.shadowing.screen.hero_desc')}</p>
      {sourceForm}
      <div className="sh-start-methods"><div><PenLine size={18} aria-hidden="true" /><h2>{t('playground.shadowing.screen.dictation_title')}</h2><p>{t('playground.shadowing.screen.dictation_desc')}</p></div><div><Mic size={18} aria-hidden="true" /><h2>{t('playground.shadowing.screen.shadowing_title')}</h2><p>{t('playground.shadowing.screen.shadowing_desc')}</p></div></div>
      <p className="sh-session-note">{t('playground.shadowing.screen.hero_session_note')}</p>
    </div></div>}
    <div className="sh-workspace" hidden={!videoId}>
      <aside className="sh-video-column" aria-label={t('playground.shadowing.screen.video_aria')}>
        <div className="sh-row sh-between"><span className="sh-eyebrow">{t('playground.shadowing.screen.your_video')}</span><span className="sh-time">{formatTime(player.time)} / {formatTime(player.duration)}</span></div>
        <button type="button" className="sh-btn sh-video-toggle" aria-expanded={!videoCollapsed} onClick={() => { if (!videoCollapsed) { sample.stop(); player.playerRef.current?.pauseVideo(); } setVideoCollapsed(value => !value); }} disabled={busy}>{videoCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}{videoCollapsed ? t('playground.shadowing.screen.show_video') : t('playground.shadowing.screen.collapse_video')}</button>
        <div className="sh-video relative" hidden={videoCollapsed}><div ref={player.containerRef} /></div>
        {player.error && <div className="sh-error" role="alert"><p>{player.error}</p><button className="sh-btn" disabled={busy} onClick={player.retry}>{t('playground.shadowing.screen.reload_player')}</button></div>}
        <div className="sh-row sh-between"><button className="sh-btn" disabled={!player.ready || busy} onClick={() => { sample.stop(); player.playerRef.current?.pauseVideo(); }}><Pause size={15} /> {t('playground.shadowing.screen.pause_sample')}</button><button className="sh-btn" disabled={busy || !!draft} onClick={() => setSettingsOpen(true)} aria-label={t('playground.shadowing.screen.adjust_speed_aria')}>{rate}x</button></div>
        <div className="sh-session-guide"><span className="sh-eyebrow">{t('playground.shadowing.screen.practice_flow_title')}</span><h3>{tab === 'shadowing' ? t('playground.shadowing.screen.flow_shadowing_sub') : t('playground.shadowing.screen.flow_dictation_sub')}</h3><ol><li><span>01</span><div>{t('playground.shadowing.screen.step_01_title')}<p>{t('playground.shadowing.screen.step_01_desc')}</p></div></li><li><span>02</span><div>{tab === 'shadowing' ? t('playground.shadowing.screen.step_02_shadowing_title') : t('playground.shadowing.screen.step_02_dictation_title')}<p>{tab === 'shadowing' ? t('playground.shadowing.screen.step_02_shadowing_desc') : t('playground.shadowing.screen.step_02_dictation_desc')}</p></div></li><li><span>03</span><div>{tab === 'shadowing' ? t('playground.shadowing.screen.step_03_shadowing_title') : t('playground.shadowing.screen.step_03_dictation_title')}<p>{tab === 'shadowing' ? t('playground.shadowing.screen.step_03_shadowing_desc') : t('playground.shadowing.screen.step_03_dictation_desc')}</p></div></li></ol></div>
        <details className="sh-practice-help"><summary>{t('playground.shadowing.screen.how_to_practice')}</summary><p>{t('playground.shadowing.screen.practice_help_p1')}</p><p>{t('playground.shadowing.screen.practice_help_p2')}</p></details>
      </aside>
      <main className="sh-content" id="practice-panel" role="tabpanel" aria-label={draft ? t('playground.shadowing.screen.aria_transcript_prep') : tab === 'shadowing' ? t('playground.shadowing.screen.aria_shadowing_practice') : t('playground.shadowing.screen.aria_dictation_practice')}>
        {draft ? editingDraft ? <ShadowingTranscriptEditor key={draft.videoId} draft={draft} onChange={setDraft} duration={player.duration} ready={player.ready && !player.error && !source.loading} takes={session.takes} onApply={apply} onCancel={cancelDraft} onPreview={sample.play} getTime={() => player.playerRef.current?.getCurrentTime() ?? 0} />
          : <section className="sh-ready-card"><span className="sh-eyebrow">{t('playground.shadowing.screen.transcript_ready')}</span><h3>{t('playground.shadowing.screen.ready_card_title')}</h3><p>{t('playground.shadowing.screen.ready_card_info', { sentences: draft.rows.length, parts: draft.rows.filter((row, index) => index === 0 || row.partStart).length })}</p><p>{t('playground.shadowing.screen.ready_card_desc')}</p>
            {!player.ready && !player.error && <p role="status">{t('playground.shadowing.screen.waiting_player')}</p>}
            {player.ready && draftErrors.length > 0 && <p className="sh-notice" role="status">{t('playground.shadowing.screen.review_timing_notice')}</p>}
            {removedTakes > 0 && <p className="sh-notice" role="status">{t('playground.shadowing.screen.review_takes_notice')}</p>}
            <div className="sh-row sh-wrap"><button className="sh-btn sh-primary" disabled={!player.ready || !!player.error || !!draftErrors.length || removedTakes > 0} onClick={() => apply(applyDraft(draft, player.duration))}><Play size={15} /> {t('playground.shadowing.screen.start_practice_btn')}</button><button className="sh-btn" onClick={() => setEditingDraft(true)}><Pencil size={14} /> {t('playground.shadowing.screen.edit_transcript_btn')}</button><button className="sh-btn" onClick={cancelDraft}>{t('playground.shadowing.screen.cancel_btn')}</button></div>
          </section>
          : session.lesson ? tab === 'shadowing' ? <ShadowingPracticePanel lesson={session.lesson} takes={session.takes} dispatch={session.dispatch} playerRef={player.playerRef} playerTime={player.time} ready={player.ready} active={isActive && !source.loading && !player.error} onBusy={setBusy} onEdit={edit} onSample={sample.play} onStopSample={sample.stop} />
            : <ShadowingDictationPanel key={session.lesson.videoId} lesson={session.lesson} ready={player.ready} onSample={sample.play} onStop={sample.stop} /> : null}
      </main>
    </div>
    <PracticeSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} theme={theme} onTheme={setTheme}
      rate={rate} onRate={next => { sample.stop(); setRate(next); player.playerRef.current?.setPlaybackRate(next); }}
      loop={loop} onLoop={setLoop} autoPause={autoPause} onAutoPause={setAutoPause}
      hasLesson={!!session.lesson} disabled={busy || source.loading || !!draft}
      onSource={() => { sample.stop(); if (!videoId) document.getElementById("practice-video-url")?.focus(); else setSourceOpen(true); }} onEdit={edit}
      onReload={() => { if (session.lesson) { sample.stop(); void fetchTranscript(session.lesson.videoId, lang, mode, clean); } }} />
    <Dialog open={sourceOpen} onClose={() => { if (!source.loading) setSourceOpen(false); }} className="sh-dialog">
      <DialogBackdrop className="sh-dialog-backdrop" /><div className="sh-source-dialog-position"><DialogPanel className="sh-overlay-theme sh-source-dialog" data-theme={theme}>
        <DialogTitle>{t('playground.shadowing.screen.open_video_dialog_title')}</DialogTitle><p>{t('playground.shadowing.screen.open_video_dialog_desc')}</p>
        {sourceForm}
        {sourceError && <p role="alert" className="sh-error">{sourceError}</p>}
        <button className="sh-btn" disabled={source.loading} onClick={() => setSourceOpen(false)}>{t('playground.shadowing.screen.cancel_btn')}</button>
      </DialogPanel></div>
    </Dialog>
    <InPlaceDictionaryPopup {...popupState} onClose={closeDictionary} themeMode={theme === 'paper' ? 'paper' : 'dark'} />
  </div>;
}
