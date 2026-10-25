/**
 * System Constants for Reader Domain (SSOT compliance with system_constants.md)
 */

export interface AudioSpeedOption {
  value: number;
  label: string;
  key: 'SPEED_NORMAL' | 'SPEED_SLOW' | 'SPEED_VERY_SLOW';
  description: string;
}

/**
 * The 3 invariant audio playback speeds strictly mandated by system_constants.md:
 * - 1.0x: SPEED_NORMAL (Tốc độ chuẩn tự nhiên)
 * - 0.8x: SPEED_SLOW (Tốc độ chậm vừa phải)
 * - 0.5x: SPEED_VERY_SLOW (Tốc độ rất chậm)
 */
export const AUDIO_SPEEDS: readonly AudioSpeedOption[] = [
  {
    value: 1.0,
    label: '1x',
    key: 'SPEED_NORMAL',
    description: 'Tốc độ chuẩn tự nhiên, luyện phản xạ giao tiếp',
  },
  {
    value: 0.8,
    label: '0.8x',
    key: 'SPEED_SLOW',
    description: 'Tốc độ chậm vừa phải, nhận diện nối âm',
  },
  {
    value: 0.5,
    label: '0.5x',
    key: 'SPEED_VERY_SLOW',
    description: 'Tốc độ rất chậm, nghe tách bạch âm tiết',
  },
] as const;

export type AudioSpeedValue = (typeof AUDIO_SPEEDS)[number]['value'];

/**
 * Format seconds to MM:SS string
 */
export function formatAudioTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Calculate active paragraph index based on audio currentTime and paragraph timestamp metadata
 */
export function getActiveParagraphIndex(
  currentTime: number,
  duration: number,
  paragraphs?: Array<{
    orderIndex?: number;
    audioTimestampStart?: number;
    audioTimestampEnd?: number;
  }>
): number {
  if (!paragraphs || paragraphs.length === 0) return -1;

  // 1. Check if timestamps are explicitly provided
  const hasTimestamps = paragraphs.some(
    (p) => p.audioTimestampStart !== undefined && p.audioTimestampStart !== null
  );

  if (hasTimestamps) {
    const found = paragraphs.findIndex((p, idx) => {
      const start = p.audioTimestampStart ?? 0;
      const end =
        p.audioTimestampEnd ??
        paragraphs[idx + 1]?.audioTimestampStart ??
        (duration > 0 ? duration : 99999);
      return currentTime >= start && currentTime < end;
    });

    if (found !== -1) return found;
    // Edge case: exactly at or beyond the last end
    if (currentTime >= (paragraphs[paragraphs.length - 1].audioTimestampStart ?? 0)) {
      return paragraphs.length - 1;
    }
  }

  // 2. Proportional fallback when duration is available
  if (duration > 0) {
    const ratio = Math.min(0.999, Math.max(0, currentTime / duration));
    return Math.floor(ratio * paragraphs.length);
  }

  return 0;
}
