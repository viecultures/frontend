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
import type {
  GenerateContentResponse,
  FunctionResponseScheduling,
  LiveServerToolCall,
} from '@google/genai';

export interface SVGCameraTarget {
  provinceId?: string;
  region?: 'north' | 'central' | 'south' | 'all';
  lat?: number;
  lng?: number;
}

export type ConversationMode = 'discussion' | 'comprehension' | 'shadowing' | 'interview';

/**
 * Settings Store
 */
export const useSettings = create<{
  systemPrompt: string;
  model: string;
  voice: string;
  activeLessonId: string;
  conversationMode: ConversationMode;
  customGeminiApiKey: string;
  theme: 'dark' | 'light';
  setSystemPrompt: (prompt: string) => void;
  setModel: (model: string) => void;
  setVoice: (voice: string) => void;
  setActiveLessonId: (lessonId: string) => void;
  setConversationMode: (mode: ConversationMode) => void;
  setCustomGeminiApiKey: (key: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}>(set => ({
  systemPrompt: SYSTEM_INSTRUCTIONS,
  model: DEFAULT_LIVE_API_MODEL,
  voice: DEFAULT_VOICE,
  activeLessonId: 'pho-hanoi-history',
  conversationMode: 'discussion',
  customGeminiApiKey:
    typeof window !== 'undefined'
      ? localStorage.getItem('custom_gemini_api_key') || ''
      : '',
  theme:
    typeof window !== 'undefined'
      ? ((localStorage.getItem('theme') || 'dark') as 'dark' | 'light')
      : 'dark',
  setSystemPrompt: prompt => set({ systemPrompt: prompt }),
  setModel: model => set({ model }),
  setVoice: voice => set({ voice }),
  setActiveLessonId: activeLessonId => set({ activeLessonId }),
  setConversationMode: conversationMode => set({ conversationMode }),
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

/**
 * Conversation Turn & Logs
 */
export interface ConversationTurn {
  timestamp: Date;
  role: 'user' | 'agent' | 'system';
  text: string;
  isFinal: boolean;
  toolUseRequest?: LiveServerToolCall;
  actualToolCalls?: { name: string; args: any }[];
  toolResponse?: GenerateContentResponse | string | object;
}

export interface SessionMetadata {
  sessionId: string;
  startedAt: Date;
  systemPrompt: string;
  model: string;
}

export const useLogStore = create<{
  turns: ConversationTurn[];
  isAwaitingFunctionResponse: boolean;
  awaitingToolType: string | null;
  sessionMetadata: SessionMetadata | null;
  initSession: (config: { systemPrompt: string; model: string }) => void;
  addTurn: (turn: Omit<ConversationTurn, 'timestamp'>) => void;
  updateLastTurn: (update: Partial<ConversationTurn>) => void;
  mergeIntoLastAgentTurn: (
    update: Partial<Omit<ConversationTurn, 'timestamp' | 'role'>>,
  ) => void;
  clearTurns: () => void;
  setIsAwaitingFunctionResponse: (isAwaiting: boolean, toolName?: string) => void;
}>((set, get) => ({
  turns: [],
  isAwaitingFunctionResponse: false,
  awaitingToolType: null,
  sessionMetadata: null,
  initSession: ({ systemPrompt, model }) => {
    if (!get().sessionMetadata) {
      set({
        sessionMetadata: {
          sessionId: Math.random().toString(36).substring(7),
          startedAt: new Date(),
          systemPrompt,
          model,
        },
      });
    }
  },
  addTurn: turn => {
    const { sessionMetadata, initSession } = get();
    if (!sessionMetadata) {
      const config = useSettings.getState();
      initSession({ systemPrompt: config.systemPrompt, model: config.model });
    }
    set(state => ({
      turns: [...state.turns, { ...turn, timestamp: new Date() }],
    }));
  },
  updateLastTurn: update => {
    set(state => {
      if (state.turns.length === 0) return state;
      const newTurns = [...state.turns];
      newTurns[newTurns.length - 1] = {
        ...newTurns[newTurns.length - 1],
        ...update,
      };
      return { turns: newTurns };
    });
  },
  mergeIntoLastAgentTurn: update => {
    set(state => {
      const turns = state.turns;
      const lastAgentTurnIndex = turns.map(t => t.role).lastIndexOf('agent');

      if (lastAgentTurnIndex === -1 || turns[lastAgentTurnIndex].isFinal) {
        const hasData = !!(update.text || update.toolResponse || update.actualToolCalls?.length);
        if (!hasData) return state;

        const newTurn: ConversationTurn = {
          role: 'agent',
          timestamp: new Date(),
          isFinal: false,
          text: '',
          ...update,
        };
        return { turns: [...turns, newTurn] };
      }

      const lastAgentTurn = turns[lastAgentTurnIndex];
      const lastText = lastAgentTurn.text || '';
      const newText = update.text || '';
      const needsSpace =
        lastText &&
        newText &&
        !lastText.endsWith(' ') &&
        !newText.startsWith(' ') &&
        !newText.startsWith('.') &&
        !newText.startsWith(',') &&
        !newText.startsWith('!') &&
        !newText.startsWith('?');

      const mergedTurn: ConversationTurn = {
        ...lastAgentTurn,
        ...update,
        text: lastText + (needsSpace ? ' ' : '') + newText,
        isFinal: update.isFinal ?? lastAgentTurn.isFinal,
        actualToolCalls: (lastAgentTurn.actualToolCalls || update.actualToolCalls)
          ? [
              ...(lastAgentTurn.actualToolCalls || []),
              ...(update.actualToolCalls || []),
            ]
          : undefined,
        toolResponse: update.toolResponse || lastAgentTurn.toolResponse,
      };

      const newTurns = [...turns];
      newTurns[lastAgentTurnIndex] = mergedTurn;
      return { turns: newTurns };
    });
  },
  clearTurns: () =>
    set({
      turns: [],
      sessionMetadata: null,
      isAwaitingFunctionResponse: false,
      awaitingToolType: null,
    }),
  setIsAwaitingFunctionResponse: (isAwaiting, toolName) =>
    set({
      isAwaitingFunctionResponse: isAwaiting,
      awaitingToolType: toolName || null,
    }),
}));

/**
 * Map Markers & SVG Map Store
 */
export interface MapMarker {
  position: {
    lat: number;
    lng: number;
    altitude: number;
  };
  label: string;
  showLabel: boolean;
  placeId?: string;
}

export const useMapStore = create<{
  markers: MapMarker[];
  cameraTarget: SVGCameraTarget | null;
  routePolyline: Array<{ lat: number; lng: number }> | null;
  highlightedPlaceId: string | null;
  setMarkers: (markers: MapMarker[]) => void;
  clearMarkers: () => void;
  setCameraTarget: (target: SVGCameraTarget | null) => void;
  setRoutePolyline: (polyline: Array<{ lat: number; lng: number }> | null) => void;
  setHighlightedPlaceId: (id: string | null) => void;
}>(set => ({
  markers: [],
  cameraTarget: null,
  routePolyline: null,
  highlightedPlaceId: null,
  setMarkers: markers => set({ markers }),
  clearMarkers: () => set({ markers: [] }),
  setCameraTarget: target => set({ cameraTarget: target }),
  setRoutePolyline: routePolyline => set({ routePolyline }),
  setHighlightedPlaceId: highlightedPlaceId => set({ highlightedPlaceId }),
}));