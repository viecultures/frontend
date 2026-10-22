import type { ReaderArticleData } from '../services/readerApiService';

export type PracticeMode = 'questions' | 'dictation' | 'shadowing';
export interface PracticeSegment {
  id: string;
  text: string;
  paragraphIndex: number;
  audioRange?: { start: number; end: number };
}
export interface DictationAnswer {
  text: string;
  revealed?: boolean;
  result?: { correct: boolean; accuracy: number };
}

export function practiceModeFrom(value: string | null): PracticeMode {
  return value === 'dictation' || value === 'shadowing' ? value : 'questions';
}

export function buildPracticeSegments(article: ReaderArticleData): PracticeSegment[] {
  const splitter = new Intl.Segmenter('en', { granularity: 'sentence' });
  return article.paragraphs.flatMap((paragraph, paragraphIndex) => {
    const text = paragraph.enText.trim();
    if (!text) return [];
    const start = paragraph.audioTimestampStart, end = paragraph.audioTimestampEnd;
    // Timestamps belong to whole paragraphs. Do not invent sentence-level alignment.
    const audioRange = Number.isFinite(start) && Number.isFinite(end) && start! >= 0 && end! > start!
      ? { start: start!, end: end! } : undefined;
    const parts: string[] = [];
    if (audioRange) parts.push(text);
    else {
      let pending = '';
      for (const part of splitter.segment(text)) {
        pending = [pending, part.segment.trim()].filter(Boolean).join(' ');
        // ICU treats honorifics as boundaries; a title is not a useful standalone passage.
        if (/\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St)\.$/i.test(pending)) continue;
        if (pending) parts.push(pending);
        pending = '';
      }
      if (pending) parts.push(pending);
    }
    return parts.map((part, index) => ({ id: `${paragraphIndex}-${index}`, text: part, paragraphIndex, audioRange }));
  });
}

function words(text: string): string[] {
  return text.normalize('NFC').toLowerCase().replace(/['’]/g, '').match(/[\p{L}\p{M}\p{N}]+/gu) || [];
}

/** Word edit distance tolerates case and punctuation, but counts missing/extra words. */
export function checkDictation(expected: string, answer: string) {
  const target = words(expected), actual = words(answer);
  if (!target.length) return { correct: false, accuracy: 0 };
  let previous = Array.from({ length: actual.length + 1 }, (_, index) => index);
  for (let i = 1; i <= target.length; i++) {
    const row = [i];
    for (let j = 1; j <= actual.length; j++) {
      row[j] = Math.min(row[j - 1] + 1, previous[j] + 1, previous[j - 1] + (target[i - 1] === actual[j - 1] ? 0 : 1));
    }
    previous = row;
  }
  const errors = previous[actual.length];
  return { correct: target.length > 0 && errors === 0, accuracy: Math.max(0, Math.round(100 * (1 - errors / Math.max(target.length, actual.length, 1)))) };
}
