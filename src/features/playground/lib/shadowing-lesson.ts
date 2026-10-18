import type { YtbTranscriptData } from '../services/dictationService';
import type { ShadowingLesson, ShadowingSentence, ShadowingTakes, TranscriptDraft, PlaybackRange, ReplayScope } from '../types/shadowing';

export const MAX_SESSION_BYTES = 32 * 1024 * 1024;
export const MAX_TAKE_BYTES = 4 * 1024 * 1024;
export const MAX_TAKE_SECONDS = 60;

export const sentenceSignature = (sentence: ShadowingSentence) => JSON.stringify([sentence.text, sentence.start, sentence.duration]);
export const totalTakeBytes = (takes: ShadowingTakes) => Object.values(takes).reduce((sum, take) => sum + take.blob.size, 0);
export const validTakeCount = (takes: ShadowingTakes, ids: string[]) => ids.filter(id => takes[id]?.validity === 'valid').length;

export function extractYouTubeId(input: string): string | null {
  if (/^[\w-]{11}$/.test(input.trim())) return input.trim();
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, '');
    const id = host === 'youtu.be' ? url.pathname.slice(1) :
      ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)
        ? url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1] : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}

export function draftFromTranscript(data: YtbTranscriptData, previous: ShadowingLesson | null): TranscriptDraft {
  if (!Array.isArray(data.snippets) || !data.snippets.length) throw new Error('BE chưa trả về câu transcript nào.');
  return {
    videoId: data.videoId, title: data.title,
    rows: data.snippets.map((snippet, index) => {
      const match = previous?.videoId === data.videoId ? previous.sentences.find(s => s.start === snippet.start && s.duration === snippet.duration && s.text === snippet.text) : undefined;
      return { id: match?.id ?? crypto.randomUUID(), text: snippet.text, start: String(snippet.start),
        end: String(Math.round((snippet.start + snippet.duration) * 1000) / 1000), partStart: index === 0, partTitle: index === 0 ? 'Phần 1' : '' };
    }),
  };
}

export function draftFromLesson(lesson: ShadowingLesson): TranscriptDraft {
  return { videoId: lesson.videoId, title: lesson.title, rows: lesson.sentences.map(sentence => {
    const part = lesson.parts.find(p => p.sentenceIds[0] === sentence.id);
    return { id: sentence.id, text: sentence.text, start: String(sentence.start), end: String(Math.round((sentence.start + sentence.duration) * 1000) / 1000), partStart: !!part, partTitle: part?.title ?? '' };
  }) };
}

export function validateDraft(draft: TranscriptDraft, duration: number): string[] {
  const errors: string[] = [];
  if (!extractYouTubeId(draft.videoId)) errors.push('Video ID không hợp lệ.');
  if (!(duration > 0) || !Number.isFinite(duration)) errors.push('Chờ video tải để kiểm tra thời lượng.');
  if (!draft.rows.length || draft.rows.length > 300) errors.push('Bài cần từ 1 đến 300 câu.');
  const ids = new Set<string>();
  draft.rows.forEach((row, index) => {
    const start = Number(row.start), end = Number(row.end);
    const prefix = `Câu ${index + 1}: `;
    if (!row.id || ids.has(row.id)) errors.push(prefix + 'ID bị trùng hoặc thiếu.');
    ids.add(row.id);
    if (!row.text.trim()) errors.push(prefix + 'chưa có nội dung.');
    if (!row.start.trim() || !row.end.trim() || !Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) errors.push(prefix + 'cần 0 ≤ đầu < cuối.');
    if (end > duration + 0.05) errors.push(prefix + 'vượt thời lượng video.');
    if (end - start > MAX_TAKE_SECONDS) errors.push(prefix + 'dài hơn 60 giây; hãy chia câu.');
    if (index > 0 && start < Number(draft.rows[index - 1].end) - 0.001) errors.push(prefix + 'chồng thời gian câu trước.');
    if ((index === 0 || row.partStart) && !row.partTitle.trim()) errors.push(prefix + 'hãy đặt tên phần.');
  });
  return errors;
}

export function applyDraft(draft: TranscriptDraft, duration: number): ShadowingLesson {
  const errors = validateDraft(draft, duration);
  if (errors.length) throw new Error(errors.join('\n'));
  const sentences = draft.rows.map(row => ({ id: row.id, text: row.text.trim(), start: Number(row.start), duration: Number(row.end) - Number(row.start) }));
  const starts = draft.rows.flatMap((row, index) => index === 0 || row.partStart ? [index] : []);
  const parts = starts.map((index, partIndex) => {
    const next = starts[partIndex + 1] ?? sentences.length;
    return { id: `part-${sentences[index].id}`, title: draft.rows[index].partTitle.trim(),
      start: index === 0 ? 0 : sentences[index].start, end: next < sentences.length ? sentences[next].start : duration,
      sentenceIds: sentences.slice(index, next).map(s => s.id) };
  });
  return { videoId: draft.videoId, title: draft.title, duration, sentences, parts };
}

export function reconcileTakes(previous: ShadowingLesson | null, next: ShadowingLesson, takes: ShadowingTakes): ShadowingTakes {
  if (!previous || previous.videoId !== next.videoId) return {};
  const result: ShadowingTakes = {};
  for (const sentence of next.sentences) {
    const take = takes[sentence.id];
    if (!take) continue;
    const old = previous.sentences.find(s => s.id === sentence.id);
    const timingChanged = !old || old.start !== sentence.start || Math.abs(old.duration - sentence.duration) > 0.001;
    const validity = timingChanged || take.validity === 'needs-rerecord' ? 'needs-rerecord'
      : take.signature === sentenceSignature(sentence) ? 'valid' : 'needs-review';
    result[sentence.id] = { ...take, validity };
  }
  return result;
}

export function replayRange(lesson: ShadowingLesson, scope: ReplayScope): PlaybackRange {
  if (scope.kind === 'video') return { start: 0, end: lesson.duration };
  const part = lesson.parts.find(p => p.id === scope.partId);
  if (!part) throw new Error('Không tìm thấy phần cần nghe lại.');
  return { start: part.start, end: part.end };
}

export function takeAtTime(lesson: ShadowingLesson, takes: ShadowingTakes, range: PlaybackRange, time: number) {
  if (time < range.start || time >= range.end) return null;
  const sentence = lesson.sentences.find(s => s.start >= range.start && s.start < range.end && time >= s.start && time < Math.min(s.start + s.duration, range.end));
  const take = sentence && takes[sentence.id];
  if (!sentence || !take || take.validity !== 'valid') return null;
  const offset = time - take.timelineStart;
  return offset >= 0 && offset < take.duration ? { take, offset } : null;
}

export function formatTime(seconds: number) {
  const value = Math.max(0, seconds || 0);
  return `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toFixed(1).padStart(4, '0')}`;
}
