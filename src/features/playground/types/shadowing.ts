export interface ShadowingSentence {
  id: string;
  text: string;
  start: number;
  duration: number;
}

export interface ShadowingPart {
  id: string;
  title: string;
  start: number;
  end: number;
  sentenceIds: string[];
}

export interface ShadowingLesson {
  videoId: string;
  title: string;
  duration: number;
  sentences: ShadowingSentence[];
  parts: ShadowingPart[];
}

export interface TranscriptDraftRow {
  id: string;
  text: string;
  start: string;
  end: string;
  partStart: boolean;
  partTitle: string;
}

export interface TranscriptDraft {
  videoId: string;
  title: string;
  rows: TranscriptDraftRow[];
}

export interface ShadowingTake {
  sentenceId: string;
  blob: Blob;
  mimeType: string;
  duration: number;
  timelineStart: number;
  signature: string;
  validity: 'valid' | 'needs-review' | 'needs-rerecord';
}

export type ShadowingTakes = Record<string, ShadowingTake>;
export type ReplayScope = { kind: 'part'; partId: string } | { kind: 'video' };
export interface PlaybackRange { start: number; end: number }

export interface ShadowingPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  getPlaybackRate(): number;
  getVolume(): number;
  isMuted(): boolean;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  pauseVideo(): void;
  setPlaybackRate(rate: number): void;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
}
