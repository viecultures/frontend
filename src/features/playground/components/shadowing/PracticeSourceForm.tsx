import type { TranscriptMode } from '../../hooks/useTranscriptSource';
import { ArrowRight, LoaderCircle } from 'lucide-react';

interface Props {
  url: string; language: string; mode: TranscriptMode; clean: boolean;
  loading: boolean; disabled?: boolean;
  onUrl(value: string): void; onLanguage(value: string): void;
  onMode(value: TranscriptMode): void; onClean(value: boolean): void; onSubmit(): void;
}
export function PracticeSourceForm({ url, language, mode, clean, loading, disabled, onUrl, onLanguage, onMode, onClean, onSubmit }: Props) {
  return <form className="sh-source-form" onSubmit={event => { event.preventDefault(); if (!loading && !disabled && url.trim()) onSubmit(); }}>
    <label htmlFor="practice-video-url">YouTube video</label>
    <div className="sh-source-input-row"><input id="practice-video-url" className="sh-input" aria-label="YouTube video URL" placeholder="Paste a YouTube link or video ID" value={url} disabled={loading || disabled} onChange={event => onUrl(event.target.value)} autoComplete="off" />
      <button className="sh-btn sh-primary" type="submit" disabled={loading || disabled || !url.trim()}>{loading ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} />}{loading ? 'Opening video…' : 'Open video'}</button></div>
    <details className="sh-source-options"><summary>Source settings</summary><div className="sh-settings-fields">
      <label>Transcript language<select className="sh-input" aria-label="Transcript language" value={language} disabled={loading || disabled} onChange={event => onLanguage(event.target.value)}><option value="en">English</option><option value="vi">Vietnamese</option><option value="ja">Japanese</option><option value="ko">Korean</option></select></label>
      <label>Sentence grouping<select className="sh-input" aria-label="Sentence grouping" value={mode} disabled={loading || disabled} onChange={event => onMode(event.target.value as TranscriptMode)}>{[['SHADOWING','Short practice segments'],['SENTENCE','Full sentences'],['COMMA','Pause at commas'],['RAW','Original captions']].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="sh-row"><input type="checkbox" checked={clean} disabled={loading || disabled} onChange={event => onClean(event.target.checked)} /> Remove music and sound labels</label>
    </div></details>
  </form>;
}
