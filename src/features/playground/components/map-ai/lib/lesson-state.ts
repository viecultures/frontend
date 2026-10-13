import { create } from 'zustand';
import type { AiMapLessonPayload, AiMapLessonState, AiMapLessonStep, AiMapQuizResult } from '../types';

const STORAGE_KEY = 'viecultures_ai_map_lesson_v1';
const order: AiMapLessonStep[] = ['explore', 'listen', 'speak', 'quiz', 'complete'];

function save(session: AiMapLessonState | null, payload: AiMapLessonPayload | null) {
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify({ session, payload }));
}

function restore(): { session: AiMapLessonState | null; payload: AiMapLessonPayload | null } {
  try {
    const value = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return value ? JSON.parse(value) : { session: null, payload: null };
  } catch { return { session: null, payload: null }; }
}

const initial = restore();

interface LessonStore {
  session: AiMapLessonState | null;
  payload: AiMapLessonPayload | null;
  startLesson: (payload: AiMapLessonPayload) => void;
  completeStep: (step: AiMapLessonStep) => void;
  setQuizScore: (result: AiMapQuizResult) => void;
  markVocabulary: (words: string[]) => void;
  grantReward: () => void;
  resetLesson: () => void;
}

export const useAiMapLessonStore = create<LessonStore>((set, get) => ({
  session: initial.session,
  payload: initial.payload,
  startLesson: payload => {
    const existing = get().session;
    const session = existing?.lessonId === payload.lessonId && existing.level === payload.level
      ? existing
      : { lessonId: payload.lessonId, provinceId: payload.provinceId, level: payload.level, currentStep: 'explore' as const, completedSteps: [], startedAt: new Date().toISOString(), encounteredVocabulary: [], rewardGranted: false };
    save(session, payload);
    set({ session, payload });
  },
  completeStep: step => {
    const session = get().session;
    if (!session || step === 'complete') return;
    const index = order.indexOf(step);
    const required = order.slice(0, index);
    if (!required.every(item => session.completedSteps.includes(item))) return;
    const completedSteps = session.completedSteps.includes(step) ? session.completedSteps : [...session.completedSteps, step];
    const currentStep = order[index + 1] || 'complete';
    const next = { ...session, completedSteps, currentStep };
    save(next, get().payload); set({ session: next });
  },
  setQuizScore: result => {
    const session = get().session;
    if (!session || !result.passed) { if (session) { const next = { ...session, quizScore: result }; save(next, get().payload); set({ session: next }); } return; }
    const completedSteps: AiMapLessonStep[] = [...new Set([...session.completedSteps, 'quiz' as const])];
    const next: AiMapLessonState = { ...session, quizScore: result, completedSteps, currentStep: 'complete', completedAt: new Date().toISOString() };
    save(next, get().payload); set({ session: next });
  },
  markVocabulary: words => { const session = get().session; if (!session) return; const next = { ...session, encounteredVocabulary: [...new Set([...session.encounteredVocabulary, ...words])] }; save(next, get().payload); set({ session: next }); },
  grantReward: () => { const session = get().session; if (!session || session.rewardGranted) return; const next = { ...session, rewardGranted: true }; save(next, get().payload); set({ session: next }); },
  resetLesson: () => { save(null, null); set({ session: null, payload: null }); },
}));
