import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Headphones, Pause, Play } from 'lucide-react';
import { ReaderArticleContent } from '../ReaderArticleContent';
import { InPlaceDictionaryPopup } from '../InPlaceDictionaryPopup';
import { useReaderDictionary } from '../../hooks/useReaderDictionary';
import { usePracticeAudio } from '../../hooks/usePracticeAudio';
import { usePracticeRecorder } from '../../hooks/usePracticeRecorder';
import { buildPracticeSegments, type DictationAnswer, type PracticeMode } from '../../lib/readerPractice';
import type { ReaderArticleData } from '../../services/readerApiService';
import { PracticeQuestions, type QuestionAnswer } from './PracticeQuestions';
import { PracticeDictation } from './PracticeDictation';
import { PracticeShadowing } from './PracticeShadowing';
import './reader-practice.css';

interface ReaderPracticeViewProps {
  articleData: ReaderArticleData;
  fontSize: number;
  vocabBtnClass: string;
  themeMode: 'paper' | 'dark';
  mode: PracticeMode;
  onChangeMode: (mode: PracticeMode) => void;
  onBackToReading: () => void;
  fullAudioUrl?: string;
}

const modes: { id: PracticeMode; label: string }[] = [
  { id: 'questions', label: 'Questions' }, { id: 'dictation', label: 'Dictation' }, { id: 'shadowing', label: 'Shadowing' },
];

export function ReaderPracticeView({ articleData, fontSize, vocabBtnClass, themeMode, mode, onChangeMode, onBackToReading, fullAudioUrl }: ReaderPracticeViewProps) {
  const segments = useMemo(() => buildPracticeSegments(articleData), [articleData]);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [dictations, setDictations] = useState<Record<string, DictationAnswer>>({});
  const sample = usePracticeAudio(articleData.shadowingAudioUrl, mode !== 'questions');
  const recorder = usePracticeRecorder(mode === 'shadowing');
  const { popupState, closeDictionary, handleTextSelection, handleVocabClick } = useReaderDictionary(articleData.vocabMap);
  const segment = segments[segmentIndex];
  const answer = segment ? dictations[segment.id] || { text: '' } : { text: '' };
  const tabs = useRef<HTMLDivElement>(null);
  const fullPlayer = useRef<HTMLAudioElement>(null);
  const revealed = Boolean(answer.revealed || answer.result);
  const matched = Object.values(dictations).filter(item => item.result?.correct).length;

  useEffect(() => { sample.stop(); }, [mode, segmentIndex, sample.stop]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [mode]);
  useEffect(() => {
    const player = fullPlayer.current;
    return () => { player?.pause(); };
  }, [mode]);

  function listenToSegment() {
    document.querySelectorAll<HTMLAudioElement>('.rp-recording audio').forEach(player => player.pause());
    if (segment) sample.play(segment);
  }

  function handleTabKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = modes.findIndex(item => item.id === mode);
    const next = event.key === 'ArrowRight' ? (index + 1) % modes.length : event.key === 'ArrowLeft' ? (index + modes.length - 1) % modes.length : event.key === 'Home' ? 0 : event.key === 'End' ? modes.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault();
    onChangeMode(modes[next].id);
    tabs.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return <div className="rp-workspace" data-practice-theme={themeMode}>
    <header className="rp-heading">
      <div><p className="rp-eyebrow">From reading to practice</p><h1>Listening & Speaking</h1><p>One story. Three ways to make it your own.</p></div>
    </header>
    <div ref={tabs} className="rp-tabs" role="tablist" aria-label="Practice modes" onKeyDown={handleTabKey}>
      {modes.map(item => <button key={item.id} type="button" role="tab" id={`practice-tab-${item.id}`} aria-controls={`practice-panel-${mode}`} aria-selected={mode === item.id} tabIndex={mode === item.id ? 0 : -1} onClick={() => onChangeMode(item.id)}>{item.label}</button>)}
    </div>
    <div className="rp-grid" role="tabpanel" id={`practice-panel-${mode}`} aria-labelledby={`practice-tab-${mode}`}>
      <div className="rp-source">
        {mode === 'questions' ? <>
          {fullAudioUrl && <div className="rp-article-audio"><label htmlFor="practice-article-audio">Listen to the article</label><audio ref={fullPlayer} id="practice-article-audio" aria-label="Article recording" controls src={fullAudioUrl} preload="metadata" /></div>}
          <ReaderArticleContent language="en" themeMode={themeMode} fontSize={fontSize} articleData={articleData} vocabClassName={vocabBtnClass} onVocabClick={handleVocabClick} onMouseUp={handleTextSelection} onDoubleClick={handleTextSelection} />
        </> : <section className="reader-language-sheet rp-transcript" data-reader-theme={themeMode} aria-label={mode === 'dictation' ? 'Listening passage' : 'Shadowing transcript'}>
          <p className="rp-eyebrow">{mode === 'dictation' ? 'Listen closely' : 'Follow the transcript'}</p>
          <h2 className="reader-article-title">{articleData.titleEn}</h2>
          {segment ? <>
            <div className="rp-between rp-passage-heading"><span>Passage {segmentIndex + 1} of {segments.length}</span><span>{articleData.shadowingAudioUrl && segment.audioRange ? 'Article recording' : 'Browser voice'}</span></div>
            <div className="rp-sample-controls">
              <button type="button" className="rp-primary" disabled={recorder.busy} onClick={() => sample.playing ? sample.stop() : listenToSegment()}>{sample.playing ? <Pause size={17} /> : <Play size={17} />}{sample.playing ? 'Stop sample' : 'Play sample'}</button>
              <label>Speed<select aria-label="Sample speed" value={sample.speed} disabled={recorder.busy} onChange={event => { sample.stop(); sample.setSpeed(Number(event.target.value)); }}><option value={0.75}>0.75×</option><option value={1}>1×</option><option value={1.25}>1.25×</option></select></label>
              <button type="button" aria-pressed={sample.repeat} disabled={recorder.busy} onClick={() => sample.setRepeat(!sample.repeat)}>Repeat {sample.repeat ? 'on' : 'off'}</button>
            </div>
            {sample.error && <p role="alert" className="rp-error">{sample.error}</p>}
            {mode === 'dictation'
              ? revealed ? <blockquote className="rp-revealed" style={{ fontSize }}>{segment.text}</blockquote> : <div className="rp-listening-stage"><Headphones size={42} strokeWidth={1} /><h3>Let your ears lead</h3><p>Play this passage and write what you hear.<br />Its words will appear after you check or reveal the answer.</p></div>
              : <div className="rp-segments" aria-label="Article passages">{segments.map((item, index) => <button key={item.id} type="button" className="rp-segment" style={{ fontSize }} disabled={recorder.busy} aria-current={segmentIndex === index ? 'step' : undefined} onClick={() => setSegmentIndex(index)}><span>{index + 1}</span><span>{item.text}</span>{recorder.takes[item.id] && <span className="rp-take-mark">Recorded</span>}</button>)}</div>}
          </> : <p>No English transcript is available for this article yet.</p>}
        </section>}
      </div>
      <div className="rp-sidebar">
        {mode === 'questions'
          ? <PracticeQuestions questions={articleData.questions || []} index={questionIndex} onChangeIndex={setQuestionIndex} answers={answers} onAnswer={(id, value) => setAnswers(previous => ({ ...previous, [id]: value }))} onTryDictation={() => onChangeMode('dictation')} />
          : segment ? <>
            {mode === 'dictation'
              ? <PracticeDictation segment={segment} answer={answer} onAnswer={value => setDictations(previous => ({ ...previous, [segment.id]: value }))} onListen={listenToSegment} completed={matched} total={segments.length} />
              : <PracticeShadowing segment={segment} recorder={recorder} onListen={listenToSegment} onStopSample={sample.stop} total={segments.length} />}
            <div className="rp-navigation rp-passage-navigation">
              <button type="button" disabled={recorder.busy || segmentIndex === 0} onClick={() => setSegmentIndex(index => index - 1)}><ChevronLeft size={15} /> Previous passage</button>
              <button type="button" disabled={recorder.busy || segmentIndex >= segments.length - 1} onClick={() => setSegmentIndex(index => index + 1)}>Next passage <ChevronRight size={15} /></button>
            </div>
          </> : <section className="rp-activity"><BookOpen size={28} /><h2>A transcript is needed</h2><p>Choose another article to practise dictation or shadowing.</p><button type="button" onClick={onBackToReading}>Back to reading</button></section>}
      </div>
    </div>
    <InPlaceDictionaryPopup isOpen={popupState.isOpen} vocab={popupState.vocab} position={popupState.position} onClose={closeDictionary} themeMode={themeMode} />
  </div>;
}
