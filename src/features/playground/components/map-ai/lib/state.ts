/**
 * Global State for Cultural Speaking & Listening AI Tutor
 */

import { create } from 'zustand';
import { culturalSpeakingTools } from './tools/cultural-speaking-tools';
import {
  SYSTEM_INSTRUCTIONS,
  DEFAULT_LIVE_API_MODEL,
  DEFAULT_VOICE,
} from './constants';
import type { FunctionResponseScheduling } from '@google/genai';

import type { ProficiencyLevel } from '@/data/lessonAgentCatalog';

function readPreference<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try { const value = localStorage.getItem(`map_ai_${key}`); return allowed.includes(value as T) ? value as T : fallback; }
  catch { return fallback; }
}

function savePreference(key: string, value: string) {
  try { localStorage.setItem(`map_ai_${key}`, value); } catch { /* Preferences remain usable in memory. */ }
}

export interface SVGCameraTarget {
  provinceId?: string;
  region?: 'north' | 'central' | 'south' | 'all';
  lat?: number;
  lng?: number;
}

export type ConversationMode = 'discussion' | 'comprehension' | 'shadowing' | 'interview';
export type CulturalTutorMode = 'guided-lesson' | 'free-conversation' | 'open-conversation';
export type CorrectionMode = 'off' | 'after-turn' | 'end-of-session';
export type MapContextMode = 'off' | 'on-demand' | 'always';
export type VoiceInteractionMode = 'natural' | 'push-to-talk';
export const AI_PLAYBACK_RATES = [0.85, 1, 1.15] as const;
export type AiPlaybackRate = typeof AI_PLAYBACK_RATES[number];

function readPlaybackRate(): AiPlaybackRate {
  try {
    const saved = Number(localStorage.getItem('map_ai_playback_rate'));
    return AI_PLAYBACK_RATES.find(rate => rate === saved) ?? 1;
  } catch { return 1; }
}

/**
 * Settings Store
 */
export const useSettings = create<{
  systemPrompt: string;
  model: string;
  voice: string;
  activeLessonId: string;
  proficiencyLevel: ProficiencyLevel;
  conversationMode: ConversationMode;
  tutorMode: CulturalTutorMode;
  correctionMode: CorrectionMode;
  mapContextMode: MapContextMode;
  voiceInteractionMode: VoiceInteractionMode;
  aiPlaybackRate: AiPlaybackRate;
  customGeminiApiKey: string;
  theme: 'dark' | 'light';
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setVoice: (voice: string) => void;
  setActiveLessonId: (lessonId: string) => void;
  setProficiencyLevel: (level: ProficiencyLevel) => void;
  setConversationMode: (mode: ConversationMode) => void;
  setTutorMode: (mode: CulturalTutorMode) => void;
  setCorrectionMode: (mode: CorrectionMode) => void;
  setMapContextMode: (mode: MapContextMode) => void;
  setVoiceInteractionMode: (mode: VoiceInteractionMode) => void;
  setAiPlaybackRate: (rate: AiPlaybackRate) => void;
  setCustomGeminiApiKey: (key: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}>(set => ({
  systemPrompt: SYSTEM_INSTRUCTIONS,
  model: DEFAULT_LIVE_API_MODEL,
  voice: readPreference('voice', ['Aoede', 'Charon', 'Fenrir', 'Kore', 'Puck', 'Zephyr', 'Leda', 'Orus'], DEFAULT_VOICE),
  activeLessonId: 'pho-hanoi-history',
  proficiencyLevel: readPreference('level', ['Level 1', 'Level 2', 'Level 3'] as const, 'Level 2'),
  conversationMode: 'discussion',
  tutorMode: 'free-conversation',
  correctionMode: readPreference('correction', ['off', 'after-turn', 'end-of-session'] as const, 'off'),
  mapContextMode: 'on-demand',
  voiceInteractionMode: readPreference('voice_interaction', ['natural', 'push-to-talk'] as const, 'natural'),
  aiPlaybackRate: readPlaybackRate(),
  customGeminiApiKey:
    typeof window !== 'undefined'
      ? localStorage.getItem('custom_gemini_api_key') || ''
      : '',
  theme:
    typeof window !== 'undefined'
      ? (localStorage.getItem('theme') === 'dark' ? 'dark' : 'light')
      : 'light',
  setSystemPrompt: prompt => set({ systemPrompt: prompt }),
  setModel: model => set({ model }),
  setVoice: voice => { savePreference('voice', voice); set({ voice }); },
  setActiveLessonId: activeLessonId => set({ activeLessonId }),
  setProficiencyLevel: proficiencyLevel => { savePreference('level', proficiencyLevel); set({ proficiencyLevel }); },
  setConversationMode: conversationMode => set({ conversationMode }),
  setTutorMode: tutorMode => set({ tutorMode }),
  setCorrectionMode: correctionMode => { savePreference('correction', correctionMode); set({ correctionMode }); },
  setMapContextMode: mapContextMode => set({ mapContextMode }),
  setVoiceInteractionMode: voiceInteractionMode => { savePreference('voice_interaction', voiceInteractionMode); set({ voiceInteractionMode }); },
  setAiPlaybackRate: aiPlaybackRate => { savePreference('playback_rate', String(aiPlaybackRate)); set({ aiPlaybackRate }); },
  setCustomGeminiApiKey: customGeminiApiKey => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('custom_gemini_api_key', customGeminiApiKey);
    }
    set({ customGeminiApiKey });
  },
  setTheme: theme => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    set({ theme });
  },
}));

/**
 * UI State
 */
export const useUI = create<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  showSystemMessages: boolean;
  toggleShowSystemMessages: () => void;
  muted: boolean;
  setMuted: (muted: boolean) => void;
  speakerMuted: boolean;
  setSpeakerMuted: (muted: boolean) => void;
}>(set => ({
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  showSystemMessages: true,
  toggleShowSystemMessages: () =>
    set(state => ({ showSystemMessages: !state.showSystemMessages })),
  muted: true,
  setMuted: muted => set({ muted }),
  speakerMuted: false,
  setSpeakerMuted: speakerMuted => set({ speakerMuted }),
}));

/**
 * Function Call definition
 */
export interface FunctionCall {
  name: string;
  description?: string;
  parameters?: any;
  isEnabled: boolean;
  scheduling?: FunctionResponseScheduling;
}

/**
 * Tools Store
 */
export const useTools = create<{
  tools: FunctionCall[];
}>(() => ({
  tools: culturalSpeakingTools,
}));

export { useLogStore } from './conversation-state';
export type { ConversationTurn, SessionMetadata } from './conversation-state';
export { useMapStore } from './map-state';
export type { MapMarker } from './map-state';
