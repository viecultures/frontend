import type { TranscriptMode } from '../../hooks/useTranscriptSource';
import { useTranslation } from 'react-i18next';
import { ArrowRight, LoaderCircle } from 'lucide-react';

interface Props {
  url: string; language: string; mode: TranscriptMode; clean: boolean;
  loading: boolean; disabled?: boolean;
  onUrl(value: string): void; onLanguage(value: string): void;
  onMode(value: TranscriptMode): void; onClean(value: boolean): void; onSubmit(): void;
}
export function PracticeSourceForm({ url, language, mode, clean, loading, disabled, onUrl, onLanguage, onMode, onClean, onSubmit }: Props) {
  const { t } = useTranslation('playground');
  return <form className="sh-source-form" onSubmit={event => { event.preventDefault(); if (!loading && !disabled && url.trim()) onSubmit(); }}>
    <label htmlFor="practice-video-url">{t('playground.shadowing.source_form.youtube_label')}</label>
    <div className="sh-source-input-row"><input id="practice-video-url" className="sh-input" aria-label={t('playground.shadowing.source_form.url_aria')} placeholder={t('playground.shadowing.source_form.url_placeholder')} value={url} disabled={loading || disabled} onChange={event => onUrl(event.target.value)} autoComplete="off" />
      <button className="sh-btn sh-primary" type="submit" disabled={loading || disabled || !url.trim()}>{loading ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} />}{loading ? t('playground.shadowing.source_form.opening_btn') : t('playground.shadowing.source_form.open_btn')}</button></div>
    <details className="sh-source-options"><summary>{t('playground.shadowing.source_form.source_settings')}</summary><div className="sh-settings-fields">
      <label>{t('playground.shadowing.source_form.lang_label')}<select className="sh-input" aria-label={t('playground.shadowing.source_form.lang_label')} value={language} disabled={loading || disabled} onChange={event => onLanguage(event.target.value)}><option value="en">{t('playground.shadowing.source_form.lang_en')}</option><option value="vi">{t('playground.shadowing.source_form.lang_vi')}</option><option value="ja">{t('playground.shadowing.source_form.lang_ja')}</option><option value="ko">{t('playground.shadowing.source_form.lang_ko')}</option></select></label>
      <label>{t('playground.shadowing.source_form.grouping_label')}<select className="sh-input" aria-label={t('playground.shadowing.source_form.grouping_label')} value={mode} disabled={loading || disabled} onChange={event => onMode(event.target.value as TranscriptMode)}>{[['SHADOWING',t('playground.shadowing.source_form.group_shadowing')],['SENTENCE',t('playground.shadowing.source_form.group_sentence')],['COMMA',t('playground.shadowing.source_form.group_comma')],['RAW',t('playground.shadowing.source_form.group_raw')]].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="sh-row"><input type="checkbox" checked={clean} disabled={loading || disabled} onChange={event => onClean(event.target.checked)} /> {t('playground.shadowing.source_form.clean_labels')}</label>
    </div></details>
  </form>;
}
