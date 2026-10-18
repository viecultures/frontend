import { Download, Plus, Scissors, Combine, Trash2, Play, Check, X } from 'lucide-react';
import { useState } from 'react';
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
  const [acknowledged, setAcknowledged] = useState(false);
  const errors = validateDraft(draft, duration);
  const removedTakes = Object.keys(takes).filter(id => !draft.rows.some(row => row.id === id)).length;
  const update = (index: number, patch: Partial<TranscriptDraftRow>) => {
    onChange({ ...draft, rows: draft.rows.map((row, i) => i === index ? { ...row, ...patch } : row) });
    setAcknowledged(false);
  };
  const remove = (index: number) => {
    const rows = draft.rows.filter((_, i) => i !== index);
    if (rows[0]) rows[0] = { ...rows[0], partStart: true, partTitle: rows[0].partTitle || 'Phần 1' };
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
    onChange({ ...draft, rows: [...draft.rows, { id: crypto.randomUUID(), text: '', start: String(start), end: String(Math.min(duration, start + 3)), partStart: !draft.rows.length, partTitle: 'Phần mới' }] });
  };
  const exportDraft = () => {
    const lesson = applyDraft(draft, duration);
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 2, ...lesson }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `shadowing-${draft.videoId}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <section className="sh-panel" aria-label="Biên tập transcript">
    <div className="sh-row sh-between"><div><h3>Biên tập trước khi luyện</h3><p>Transcript BE là bản nháp. Nghe kiểm tra lời và mốc từng câu.</p></div><button className="sh-icon" onClick={onCancel} aria-label="Đóng biên tập"><X size={18} /></button></div>
    <p>Video {formatTime(duration)} · {draft.rows.length} câu · {draft.rows.filter((row, index) => index === 0 || row.partStart).length} phần</p>
    <p>Đánh dấu câu mở đầu phần mới theo nội dung. Không cần chia đều thời lượng. Mốc chia/gộp câu chỉ là gợi ý, cần nghe kiểm tra.</p>
    <div className="sh-editor-list">
      {draft.rows.map((row, index) => <article key={row.id} className="sh-editor-row">
        <div className="sh-row sh-between"><strong>Câu {index + 1}</strong><div className="sh-row">
          <button className="sh-icon" title="Chia câu làm hai; cần chỉnh lại timing" aria-label={`Chia câu ${index + 1}`} onClick={() => split(index)}><Scissors size={15} /></button>
          <button className="sh-icon" title="Gộp với câu sau" aria-label={`Gộp câu ${index + 1} với câu sau`} disabled={index === draft.rows.length - 1} onClick={() => merge(index)}><Combine size={15} /></button>
          <button className="sh-icon" aria-label={`Xóa câu ${index + 1}`} onClick={() => remove(index)}><Trash2 size={15} /></button>
        </div></div>
        <textarea className="sh-input" rows={2} aria-label={`Nội dung câu ${index + 1}`} value={row.text} onChange={event => update(index, { text: event.target.value })} />
        <div className="sh-timing-grid">
          <label>Đầu (giây)<input className="sh-input" type="number" min="0" step="0.1" aria-label={`Bắt đầu câu ${index + 1}`} value={row.start} onChange={event => update(index, { start: event.target.value })} /></label>
          <label>Cuối (giây)<input className="sh-input" type="number" min="0" step="0.1" aria-label={`Kết thúc câu ${index + 1}`} value={row.end} onChange={event => update(index, { end: event.target.value })} /></label>
          <div className="sh-row sh-wrap"><button className="sh-btn" disabled={!ready} onClick={() => update(index, { start: getTime().toFixed(2) })}>Lấy đầu</button><button className="sh-btn" disabled={!ready} onClick={() => update(index, { end: getTime().toFixed(2) })}>Lấy cuối</button>
            <button className="sh-btn" disabled={!ready || !(Number(row.end) > Number(row.start))} onClick={() => onPreview(Number(row.start), Number(row.end))}><Play size={14} /> Nghe câu</button></div>
        </div>
        <label className="sh-row"><input type="checkbox" checked={index === 0 || row.partStart} disabled={index === 0} aria-label={`Bắt đầu phần mới tại câu ${index + 1}`} onChange={event => update(index, { partStart: event.target.checked, partTitle: row.partTitle || `Phần ${index + 1}` })} /> Bắt đầu phần mới ở câu này</label>
        {(index === 0 || row.partStart) && <input className="sh-input" aria-label={`Tên phần tại câu ${index + 1}`} placeholder="Tên ý chính của phần" value={row.partTitle} onChange={event => update(index, { partTitle: event.target.value })} />}
      </article>)}
    </div>
    <button className="sh-btn" onClick={add}><Plus size={14} /> Thêm câu</button>
    {!!errors.length && <div role="status" className="sh-notice"><strong>Cần chỉnh trước khi áp dụng:</strong><ul>{errors.slice(0, 6).map((error, index) => <li key={index}>{error}</li>)}</ul>{errors.length > 6 && <p>Và {errors.length - 6} lỗi khác.</p>}</div>}
    {removedTakes > 0 && <label className="sh-notice sh-row"><input type="checkbox" checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} /> Áp dụng sẽ bỏ {removedTakes} bản thu của các câu đã xóa/gộp. Tôi đồng ý.</label>}
    <p>Câu đổi timing cần thu lại. Câu sửa chữ cần kiểm tra lại. Các câu không đổi giữ nguyên bản thu.</p>
    <div className="sh-row sh-wrap"><button className="sh-btn sh-primary" disabled={!!errors.length || !ready || (removedTakes > 0 && !acknowledged)} onClick={() => onApply(applyDraft(draft, duration))}><Check size={15} /> Áp dụng và luyện</button>
      <button className="sh-btn" disabled={!!errors.length} onClick={exportDraft}><Download size={15} /> Xuất transcript JSON</button><button className="sh-btn" onClick={onCancel}>Hủy thay đổi</button></div>
  </section>;
}
