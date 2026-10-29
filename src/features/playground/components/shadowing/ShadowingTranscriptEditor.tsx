import { Download, Plus, Scissors, Combine, Trash2, Play, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { applyDraft, formatTime, validateDraft } from '../../lib/shadowing-lesson';
import type { ShadowingLesson, ShadowingTakes, TranscriptDraft, TranscriptDraftRow } from '../../types/shadowing';

interface Props {
  draft: TranscriptDraft;
  duration: number;
  ready: boolean;
  takes: ShadowingTakes;
  onChange(draft: TranscriptDraft): void;
  onApply(lesson: ShadowingLesson): void;
  onCancel(): void;
  onPreview(start: number, end: number): void;
  getTime(): number;
}

export function ShadowingTranscriptEditor({ draft, duration, ready, takes, onChange, onApply, onCancel, onPreview, getTime }: Props) {
  const { t } = useTranslation('playground');
  const [acknowledged, setAcknowledged] = useState(false);
  const errors = validateDraft(draft, duration);
  const removedTakes = Object.keys(takes).filter(id => !draft.rows.some(row => row.id === id)).length;
  const update = (index: number, patch: Partial<TranscriptDraftRow>) => {
    onChange({ ...draft, rows: draft.rows.map((row, i) => i === index ? { ...row, ...patch } : row) });
    setAcknowledged(false);
  };
  const remove = (index: number) => {
    const rows = draft.rows.filter((_, i) => i !== index);
    if (rows[0]) rows[0] = { ...rows[0], partStart: true, partTitle: rows[0].partTitle || t('playground.shadowing.editor.default_part_title', { number: 1 }) };
    onChange({ ...draft, rows }); setAcknowledged(false);
  };
  const split = (index: number) => {
    const row = draft.rows[index], words = row.text.trim().split(/\s+/), middle = Math.ceil(words.length / 2);
    if (words.length < 2) return;
    const time = ((Number(row.start) + Number(row.end)) / 2).toFixed(2);
    const first = { ...row, text: words.slice(0, middle).join(' '), end: time };
    const second = { ...row, id: crypto.randomUUID(), text: words.slice(middle).join(' '), start: time, partStart: false, partTitle: '' };
    onChange({ ...draft, rows: [...draft.rows.slice(0, index), first, second, ...draft.rows.slice(index + 1)] }); setAcknowledged(false);
  };
  const merge = (index: number) => {
    const row = draft.rows[index], next = draft.rows[index + 1];
    if (!next) return;
    onChange({ ...draft, rows: [...draft.rows.slice(0, index), { ...row, text: `${row.text} ${next.text}`, end: next.end }, ...draft.rows.slice(index + 2)] }); setAcknowledged(false);
  };
  const add = () => {
    const start = Number(draft.rows.at(-1)?.end ?? 0);
    onChange({ ...draft, rows: [...draft.rows, { id: crypto.randomUUID(), text: '', start: String(start), end: String(Math.min(duration, start + 3)), partStart: !draft.rows.length, partTitle: t('playground.shadowing.editor.default_new_part') }] });
  };
  const exportDraft = () => {
    const lesson = applyDraft(draft, duration);
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 2, ...lesson }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `shadowing-${draft.videoId}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <section className="sh-panel" aria-label={t('playground.shadowing.editor.aria_label')}>
    <div className="sh-row sh-between"><div><h3>{t('playground.shadowing.editor.title')}</h3><p>{t('playground.shadowing.editor.desc')}</p></div><button className="sh-icon" onClick={onCancel} aria-label={t('playground.shadowing.editor.close_aria')}><X size={18} /></button></div>
    <p>{t('playground.shadowing.editor.summary_info', { duration: formatTime(duration), sentences: draft.rows.length, parts: draft.rows.filter((row, index) => index === 0 || row.partStart).length })}</p>
    <p>{t('playground.shadowing.editor.guideline')}</p>
    <div className="sh-editor-list">
      {draft.rows.map((row, index) => <article key={row.id} className="sh-editor-row">
        <div className="sh-row sh-between"><strong>{t('playground.shadowing.editor.sentence_label', { number: index + 1 })}</strong><div className="sh-row">
          <button className="sh-icon" title={t('playground.shadowing.editor.split_title')} aria-label={t('playground.shadowing.editor.split_aria', { number: index + 1 })} onClick={() => split(index)}><Scissors size={15} /></button>
          <button className="sh-icon" title={t('playground.shadowing.editor.merge_title')} aria-label={t('playground.shadowing.editor.merge_aria', { number: index + 1 })} disabled={index === draft.rows.length - 1} onClick={() => merge(index)}><Combine size={15} /></button>
          <button className="sh-icon" aria-label={t('playground.shadowing.editor.delete_aria', { number: index + 1 })} onClick={() => remove(index)}><Trash2 size={15} /></button>
        </div></div>
        <textarea className="sh-input" rows={2} aria-label={t('playground.shadowing.editor.content_aria', { number: index + 1 })} value={row.text} onChange={event => update(index, { text: event.target.value })} />
        <div className="sh-timing-grid">
          <label>{t('playground.shadowing.editor.start_label')}<input className="sh-input" type="number" min="0" step="0.1" aria-label={t('playground.shadowing.editor.start_aria', { number: index + 1 })} value={row.start} onChange={event => update(index, { start: event.target.value })} /></label>
          <label>{t('playground.shadowing.editor.end_label')}<input className="sh-input" type="number" min="0" step="0.1" aria-label={t('playground.shadowing.editor.end_aria', { number: index + 1 })} value={row.end} onChange={event => update(index, { end: event.target.value })} /></label>
          <div className="sh-row sh-wrap"><button className="sh-btn" disabled={!ready} onClick={() => update(index, { start: getTime().toFixed(2) })}>{t('playground.shadowing.editor.get_start_btn')}</button><button className="sh-btn" disabled={!ready} onClick={() => update(index, { end: getTime().toFixed(2) })}>{t('playground.shadowing.editor.get_end_btn')}</button>
            <button className="sh-btn" disabled={!ready || !(Number(row.end) > Number(row.start))} onClick={() => onPreview(Number(row.start), Number(row.end))}><Play size={14} /> {t('playground.shadowing.editor.preview_sentence_btn')}</button></div>
        </div>
        <label className="sh-row"><input type="checkbox" checked={index === 0 || row.partStart} disabled={index === 0} aria-label={t('playground.shadowing.editor.new_part_checkbox')} onChange={event => update(index, { partStart: event.target.checked, partTitle: row.partTitle || t('playground.shadowing.editor.default_part_title', { number: index + 1 }) })} /> {t('playground.shadowing.editor.new_part_checkbox')}</label>
        {(index === 0 || row.partStart) && <input className="sh-input" aria-label={t('playground.shadowing.editor.new_part_title_aria', { number: index + 1 })} placeholder={t('playground.shadowing.editor.new_part_placeholder')} value={row.partTitle} onChange={event => update(index, { partTitle: event.target.value })} />}
      </article>)}
    </div>
    <button className="sh-btn" onClick={add}><Plus size={14} /> {t('playground.shadowing.editor.add_sentence_btn')}</button>
    {!!errors.length && <div role="status" className="sh-notice"><strong>{t('playground.shadowing.editor.fix_errors_title')}</strong><ul>{errors.slice(0, 6).map((error, index) => <li key={index}>{error}</li>)}</ul>{errors.length > 6 && <p>{t('playground.shadowing.editor.other_errors', { count: errors.length - 6 })}</p>}</div>}
    {removedTakes > 0 && <label className="sh-notice sh-row"><input type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} /> {t('playground.shadowing.editor.remove_takes_warning', { count: removedTakes })}</label>}
    <p>{t('playground.shadowing.editor.notes')}</p>
    <div className="sh-row sh-wrap"><button className="sh-btn sh-primary" disabled={!!errors.length || !ready || (removedTakes > 0 && !acknowledged)} onClick={() => onApply(applyDraft(draft, duration))}><Check size={15} /> {t('playground.shadowing.editor.apply_btn')}</button>
      <button className="sh-btn" disabled={!!errors.length} onClick={exportDraft}><Download size={15} /> {t('playground.shadowing.editor.export_json_btn')}</button><button className="sh-btn" onClick={onCancel}>{t('playground.shadowing.editor.cancel_btn')}</button></div>
  </section>;
}
