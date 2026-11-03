import { useReducer, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  tokenizeSentence,
  normalizeInputChar,
  resolveInputChar,
  type TokenizedSentence,
} from '../lib/dictationTokenizer';

export type RevealSource = 'typed' | 'hinted' | 'auto';
export type DictationStatus =
  | 'not-started'
  | 'in-progress'
  | 'completed-self'
  | 'completed-hinted'
  | 'answer-revealed';

export interface DictationState {
  sentenceId: string;
  cursorIndex: number;
  openedMap: Record<number, RevealSource>;
  correctAttempts: number;
  incorrectAttempts: number;
  hintedCount: number;
  status: DictationStatus;
  errorSequence: number;
}

type Action =
  | { type: 'TYPE'; char: string }
  | { type: 'BACKSPACE' }
  | { type: 'HINT_ONE' }
  | { type: 'REVEAL_ALL' }
  | { type: 'RESET' }
  | { type: 'RESTORE_STATE'; state: DictationState }
  | { type: 'SET_SENTENCE'; sentenceId: string; text: string; restored?: DictationState | null };

function findNextTypeableIndex(startIndex: number, tokenized: TokenizedSentence): number {
  for (let i = startIndex; i < tokenized.tokens.length; i++) {
    if (tokenized.tokens[i].isTypeable) {
      return i;
    }
  }
  return tokenized.tokens.length;
}

function initializeState(
  sentenceId: string,
  tokenized: TokenizedSentence,
  restored?: DictationState | null
): DictationState {
  if (restored && restored.sentenceId === sentenceId) {
    return restored;
  }

  const initialOpened: Record<number, RevealSource> = {};
  const firstTypeable = findNextTypeableIndex(0, tokenized);

  // Auto-open any leading non-typeables (e.g. leading quotes, dashes)
  for (let i = 0; i < firstTypeable; i++) {
    initialOpened[i] = 'auto';
  }

  const isAlreadyFinished = firstTypeable >= tokenized.tokens.length;

  return {
    sentenceId,
    cursorIndex: firstTypeable,
    openedMap: initialOpened,
    correctAttempts: 0,
    incorrectAttempts: 0,
    hintedCount: 0,
    status: isAlreadyFinished ? 'completed-self' : 'not-started',
    errorSequence: 0,
  };
}

function dictationReducer(
  state: DictationState,
  action: Action,
  tokenized: TokenizedSentence
): DictationState {
  switch (action.type) {
    case 'RESTORE_STATE': {
      return action.state;
    }

    case 'SET_SENTENCE': {
      return initializeState(action.sentenceId, tokenized, action.restored);
    }

    case 'RESET': {
      return initializeState(state.sentenceId, tokenized, null);
    }

    case 'TYPE': {
      // Completed or revealed -> no further typing
      if (
        state.status === 'completed-self' ||
        state.status === 'completed-hinted' ||
        state.status === 'answer-revealed' ||
        state.cursorIndex >= tokenized.tokens.length
      ) {
        return state;
      }

      // Space is a safe no-op
      if (action.char === ' ') {
        return state;
      }

      const currentToken = tokenized.tokens[state.cursorIndex];
      if (!currentToken || !currentToken.isTypeable) {
        return state;
      }

      const resolvedChar = resolveInputChar(action.char, currentToken.normalizedChar);
      const inputNormalized = normalizeInputChar(resolvedChar);
      if (!inputNormalized) {
        return state;
      }

      // Check match
      if (inputNormalized === currentToken.normalizedChar) {
        const nextOpened = { ...state.openedMap, [state.cursorIndex]: 'typed' as RevealSource };
        const nextTypeable = findNextTypeableIndex(state.cursorIndex + 1, tokenized);

        // Auto-open intermediate non-typeables (punctuation / space)
        for (let i = state.cursorIndex + 1; i < nextTypeable; i++) {
          nextOpened[i] = 'auto';
        }

        const isCompleted = nextTypeable >= tokenized.tokens.length;
        if (isCompleted) {
          // Open any remaining trailing tokens
          for (let i = nextTypeable; i < tokenized.tokens.length; i++) {
            nextOpened[i] = 'auto';
          }
        }

        const nextStatus: DictationStatus = isCompleted
          ? state.hintedCount > 0
            ? 'completed-hinted'
            : 'completed-self'
          : 'in-progress';

        return {
          ...state,
          cursorIndex: nextTypeable,
          openedMap: nextOpened,
          correctAttempts: state.correctAttempts + 1,
          status: nextStatus,
        };
      } else {
        // Mismatch
        return {
          ...state,
          status: state.status === 'not-started' ? 'in-progress' : state.status,
          incorrectAttempts: state.incorrectAttempts + 1,
          errorSequence: state.errorSequence + 1,
        };
      }
    }

    case 'BACKSPACE': {
      if (state.status === 'answer-revealed') {
        return state;
      }

      // Find the most recently opened typeable token prior to cursorIndex
      let targetIndex = -1;
      for (let i = state.cursorIndex - 1; i >= 0; i--) {
        if (tokenized.tokens[i].isTypeable && state.openedMap[i]) {
          targetIndex = i;
          break;
        }
      }

      // If at the end and completed, allow deleting the last typeable token
      const isCompleted = state.status === 'completed-self' || state.status === 'completed-hinted';
      if (targetIndex === -1 && isCompleted && tokenized.typeableIndices.length > 0) {
        targetIndex = tokenized.typeableIndices[tokenized.typeableIndices.length - 1];
      }

      if (targetIndex === -1) {
        return state;
      }

      const nextOpened = { ...state.openedMap };
      delete nextOpened[targetIndex];
      for (let i = targetIndex + 1; i <= state.cursorIndex; i++) {
        delete nextOpened[i];
      }

      return {
        ...state,
        cursorIndex: targetIndex,
        openedMap: nextOpened,
        status: 'in-progress',
      };
    }

    case 'HINT_ONE': {
      if (
        state.status === 'completed-self' ||
        state.status === 'completed-hinted' ||
        state.status === 'answer-revealed' ||
        state.cursorIndex >= tokenized.tokens.length
      ) {
        return state;
      }

      const nextOpened = { ...state.openedMap, [state.cursorIndex]: 'hinted' as RevealSource };
      const nextTypeable = findNextTypeableIndex(state.cursorIndex + 1, tokenized);

      for (let i = state.cursorIndex + 1; i < nextTypeable; i++) {
        nextOpened[i] = 'auto';
      }

      const isCompleted = nextTypeable >= tokenized.tokens.length;
      if (isCompleted) {
        for (let i = nextTypeable; i < tokenized.tokens.length; i++) {
          nextOpened[i] = 'auto';
        }
      }

      const nextHintedCount = state.hintedCount + 1;
      const nextStatus: DictationStatus = isCompleted ? 'completed-hinted' : 'in-progress';

      return {
        ...state,
        cursorIndex: nextTypeable,
        openedMap: nextOpened,
        hintedCount: nextHintedCount,
        status: nextStatus,
      };
    }

    case 'REVEAL_ALL': {
      return {
        ...state,
        status: 'answer-revealed',
      };
    }

    default:
      return state;
  }
}

export function useLetterRevealDictation(
  sentenceId: string,
  sentenceText: string,
  initialRestored?: DictationState | null,
  onStateChange?: (state: DictationState) => void
) {
  const tokenized = useMemo(() => tokenizeSentence(sentenceText), [sentenceText]);
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;

  const [state, dispatch] = useReducer(
    (s: DictationState, a: Action) => dictationReducer(s, a, tokenized),
    tokenized,
    (tok) => initializeState(sentenceId, tok, initialRestored)
  );

  // Sync when sentenceId or sentenceText changes
  useEffect(() => {
    dispatch({ type: 'SET_SENTENCE', sentenceId, text: sentenceText, restored: initialRestored });
  }, [sentenceId, sentenceText, initialRestored]);

  // Notify parent on state updates
  useEffect(() => {
    if (onStateChangeRef.current) {
      onStateChangeRef.current(state);
    }
  }, [state]);

  // Derived metrics
  const isCompleted =
    state.status === 'completed-self' ||
    state.status === 'completed-hinted' ||
    state.status === 'answer-revealed';

  // Only count letters actually typed or hinted by the learner (do NOT artificially bump to 100% when answer is revealed)
  const openedTypeableCount = useMemo(() => {
    return tokenized.typeableIndices.filter((idx) => {
      const src = state.openedMap[idx];
      return src === 'typed' || src === 'hinted';
    }).length;
  }, [state.openedMap, tokenized.typeableIndices]);

  const progressPercent = useMemo(() => {
    if (tokenized.totalTypeableCount === 0) return 100;
    return Math.min(100, Math.round((openedTypeableCount / tokenized.totalTypeableCount) * 100));
  }, [openedTypeableCount, tokenized.totalTypeableCount]);

  const totalAttempts = state.correctAttempts + state.incorrectAttempts;
  const accuracyPercent = useMemo(() => {
    if (totalAttempts === 0) return null;
    return Math.round((state.correctAttempts / totalAttempts) * 100);
  }, [state.correctAttempts, totalAttempts]);

  const handleType = useCallback((char: string) => dispatch({ type: 'TYPE', char }), []);
  const handleBackspace = useCallback(() => dispatch({ type: 'BACKSPACE' }), []);
  const handleHintOne = useCallback(() => dispatch({ type: 'HINT_ONE' }), []);
  const handleRevealAll = useCallback(() => dispatch({ type: 'REVEAL_ALL' }), []);
  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    state,
    tokenized,
    isCompleted,
    openedTypeableCount,
    totalTypeableCount: tokenized.totalTypeableCount,
    progressPercent,
    accuracyPercent,
    handleType,
    handleBackspace,
    handleHintOne,
    handleRevealAll,
    handleReset,
  };
}
