import { useReducer } from 'react';
import { reconcileTakes, sentenceSignature, totalTakeBytes, MAX_SESSION_BYTES } from '../lib/shadowing-lesson';
import type { ShadowingLesson, ShadowingTake, ShadowingTakes } from '../types/shadowing';

export interface SessionState { lesson: ShadowingLesson | null; takes: ShadowingTakes }
export type SessionAction =
  | { type: 'apply'; lesson: ShadowingLesson }
  | { type: 'take'; take: ShadowingTake }
  | { type: 'delete'; sentenceId: string }
  | { type: 'confirm'; sentenceId: string };

export function shadowingSessionReducer(state: SessionState, action: SessionAction): SessionState {
  if (action.type === 'apply') return { lesson: action.lesson, takes: reconcileTakes(state.lesson, action.lesson, state.takes) };
  const sentenceId = action.type === 'take' ? action.take.sentenceId : action.sentenceId;
  const sentence = state.lesson?.sentences.find(s => s.id === sentenceId);
  if (!sentence) return state;
  const takes = { ...state.takes };
  if (action.type === 'delete') delete takes[sentenceId];
  if (action.type === 'confirm') {
    const take = takes[sentenceId];
    if (take?.validity === 'needs-review') takes[sentenceId] = { ...take, signature: sentenceSignature(sentence), validity: 'valid' };
  }
  if (action.type === 'take') {
    if (action.take.signature !== sentenceSignature(sentence)) return state;
    takes[sentenceId] = action.take;
    if (totalTakeBytes(takes) > MAX_SESSION_BYTES) return state;
  }
  return { ...state, takes };
}

export function useShadowingSession() {
  const [state, dispatch] = useReducer(shadowingSessionReducer, { lesson: null, takes: {} });
  return { ...state, dispatch };
}
