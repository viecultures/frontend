/**
 * Map AI Diagnostic Logger & Debug Store
 * Provides real-time event tracing, error diagnosis, and simulation triggers.
 *
 * Condition: Only enabled in development mode or when VITE_MAP_AI_DEBUG=true.
 */

import { create } from 'zustand';

export type LogLevel = 'info' | 'warn' | 'error' | 'success';
export type LogCategory = 'ws' | 'audio' | 'asr' | 'tool' | 'map' | 'system';

export interface DebugLogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  message: string;
  data?: any;
}

/**
 * Checks whether diagnostic debug features should be enabled.
 */
export const isMapAiDebugEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  const env = (import.meta as any).env || {};
  return (
    env.VITE_MAP_AI_DEBUG === 'true' ||
    env.DEV === true ||
    env.MODE === 'development'
  );
};

interface MapAiDebugState {
  logs: DebugLogEntry[];
  maxLogs: number;
  isDrawerOpen: boolean;
  activeTab: 'health' | 'logs' | 'simulator';
  selectedCategory: 'all' | LogCategory;
  searchQuery: string;
  errorCount: number;
  dockPosition: 'bottom' | 'left';

  // Actions
  addLog: (entry: Omit<DebugLogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  setActiveTab: (tab: 'health' | 'logs' | 'simulator') => void;
  setSelectedCategory: (category: 'all' | LogCategory) => void;
  setSearchQuery: (query: string) => void;
  setDockPosition: (pos: 'bottom' | 'left') => void;
}

let logCounter = 0;

export const useMapAiDebugStore = create<MapAiDebugState>((set, get) => ({
  logs: [],
  maxLogs: 300,
  isDrawerOpen: false,
  activeTab: 'health',
  selectedCategory: 'all',
  searchQuery: '',
  errorCount: 0,
  dockPosition: 'bottom',

  addLog: entry => {
    // Only accumulate logs if in debug mode to avoid production memory overhead
    if (!isMapAiDebugEnabled()) return;

    logCounter += 1;
    const newEntry: DebugLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${logCounter}`,
      timestamp: new Date(),
    };

    set(state => {
      const isErr = entry.level === 'error';
      const newLogs = [newEntry, ...state.logs].slice(0, state.maxLogs);
      return {
        logs: newLogs,
        errorCount: isErr ? state.errorCount + 1 : state.errorCount,
      };
    });
  },

  clearLogs: () => set({ logs: [], errorCount: 0 }),
  toggleDrawer: () => set(state => ({ isDrawerOpen: !state.isDrawerOpen })),
  setDrawerOpen: open => set({ isDrawerOpen: open }),
  setActiveTab: tab => set({ activeTab: tab }),
  setSelectedCategory: selectedCategory => set({ selectedCategory }),
  setSearchQuery: searchQuery => set({ searchQuery }),
  setDockPosition: dockPosition => set({ dockPosition }),
}));

/**
 * Convenient logger helper functions
 */
export const debugLog = {
  ws: (message: string, data?: any, level: LogLevel = 'info') => {
    useMapAiDebugStore.getState().addLog({
      category: 'ws',
      level,
      message,
      data,
    });
  },

  audio: (message: string, data?: any, level: LogLevel = 'info') => {
    useMapAiDebugStore.getState().addLog({
      category: 'audio',
      level,
      message,
      data,
    });
  },

  asr: (speaker: 'user' | 'agent', text: string, data?: any, level: LogLevel = 'info') => {
    useMapAiDebugStore.getState().addLog({
      category: 'asr',
      level,
      message: `[ASR ${speaker === 'user' ? 'Người nói' : 'AI Guide'}] "${text}"`,
      data,
    });
  },

  tool: (
    toolName: string,
    status: 'calling' | 'success' | 'error',
    args?: any,
    resultOrError?: any,
  ) => {
    const level: LogLevel =
      status === 'error' ? 'error' : status === 'success' ? 'success' : 'info';
    useMapAiDebugStore.getState().addLog({
      category: 'tool',
      level,
      message: `Tool [${toolName}] -> ${status.toUpperCase()}`,
      data: {
        toolName,
        status,
        arguments: args,
        resultOrError,
      },
    });
  },

  map: (action: string, data?: any, level: LogLevel = 'info') => {
    useMapAiDebugStore.getState().addLog({
      category: 'map',
      level,
      message: `Map Action: ${action}`,
      data,
    });
  },

  error: (source: string, error: any) => {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack }
        : typeof error === 'object'
          ? error
          : { message: String(error) };

    useMapAiDebugStore.getState().addLog({
      category: 'system',
      level: 'error',
      message: `Error in [${source}]: ${errorDetails?.message || 'Unknown error'}`,
      data: errorDetails,
    });
  },

  info: (message: string, data?: any) => {
    useMapAiDebugStore.getState().addLog({
      category: 'system',
      level: 'info',
      message,
      data,
    });
  },
};
