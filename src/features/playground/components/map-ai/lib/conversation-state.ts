import { create } from 'zustand';
import type { GenerateContentResponse, LiveServerToolCall } from '@google/genai';

export type ConversationRole = 'user' | 'agent';
export type ConversationTurnSource =
  | 'composer'
  | 'suggestion'
  | 'map'
  | 'text'
  | 'transcription'
  | 'tool'
  | 'system'
  | 'control'
  | 'resume';

export interface ConversationTurn {
  id: string;
  source: ConversationTurnSource;
  timestamp: Date;
  role: ConversationRole | 'system';
  text: string;
  /** Server turn completion, distinct from transcription segment completion. */
  isFinal: boolean;
  transcriptionFinished?: boolean;
  interrupted?: boolean;
  sessionId?: string;
  connectionId?: string;
  toolUseRequest?: LiveServerToolCall;
  actualToolCalls?: { name: string; args: any }[];
  toolResponse?: GenerateContentResponse | string | object;
}

/** Legacy callers can omit all generated metadata. */
export type ConversationTurnInput = Omit<
  ConversationTurn, 'id' | 'source' | 'timestamp'
> & Partial<Pick<ConversationTurn, 'id' | 'source' | 'timestamp'>>;

export interface SessionConfig {
  systemPrompt: string;
  model: string;
}

export interface ConnectionConfig extends SessionConfig {
  connectionId?: string;
}

export interface ConnectionMetadata extends SessionConfig {
  connectionId: string;
  connectedAt: Date;
}

export interface SessionMetadata extends SessionConfig {
  sessionId: string;
  startedAt: Date;
  connectionId: string | null;
  connections: ConnectionMetadata[];
}

export interface ConversationState {
  turns: ConversationTurn[];
  activeUserTurnId: string | null;
  activeAgentTurnId: string | null;
  /** Completed output can still receive transcription until the next response boundary. */
  completedAgentTurnId: string | null;
  agentTurnComplete: boolean;
  isAwaitingFunctionResponse: boolean;
  awaitingToolType: string | null;
  sessionMetadata: SessionMetadata | null;
  initSession: (config: SessionConfig) => void;
  recordConnection: (config: ConnectionConfig) => void;
  addTurn: (turn: ConversationTurnInput) => void;
  updateLastTurn: (update: Partial<ConversationTurn>) => void;
  mergeIntoLastAgentTurn: (
    update: Partial<Omit<ConversationTurn, 'timestamp' | 'role'>>,
  ) => void;
  appendTranscription: (role: ConversationRole, text: string, finished: boolean) => void;
  /** Call immediately before requesting a new response, including hidden controls/summary. */
  beginAgentTurn: () => void;
  finalizeTurns: (interrupted?: boolean) => void;
  clearTurns: () => void;
  setIsAwaitingFunctionResponse: (isAwaiting: boolean, toolName?: string) => void;
}

let fallbackId = 0;
function newId(): string {
  return globalThis.crypto?.randomUUID?.()
    ?? `conversation-${Date.now().toString(36)}-${++fallbackId}`;
}

function newSession(config: SessionConfig): SessionMetadata {
  return {
    sessionId: newId(),
    startedAt: new Date(),
    systemPrompt: config.systemPrompt,
    model: config.model,
    connectionId: null,
    connections: [],
  };
}

export function isConversationSource(source: ConversationTurnSource): boolean {
  return source === 'composer' || source === 'suggestion' || source === 'map'
    || source === 'text' || source === 'transcription';
}

function inferSource(turn: ConversationTurnInput): ConversationTurnSource {
  if (turn.source) return turn.source;
  if (turn.role === 'system') return 'system';
  if (!turn.text.trim() && (
    turn.toolUseRequest || turn.actualToolCalls?.length || turn.toolResponse !== undefined
  )) return 'tool';
  return turn.role === 'user' ? 'composer' : 'text';
}

function makeTurn(input: ConversationTurnInput, state: ConversationState): ConversationTurn {
  return {
    ...input,
    id: input.id && !state.turns.some(turn => turn.id === input.id) ? input.id : newId(),
    source: inferSource(input),
    timestamp: input.timestamp ?? new Date(),
    sessionId: state.sessionMetadata?.sessionId,
    connectionId: state.sessionMetadata?.connectionId ?? undefined,
  };
}

function activeKey(role: ConversationRole): 'activeUserTurnId' | 'activeAgentTurnId' {
  return role === 'user' ? 'activeUserTurnId' : 'activeAgentTurnId';
}

function activeIndex(state: ConversationState, role: ConversationRole): number {
  const id = state[activeKey(role)];
  return id === null ? -1 : state.turns.findIndex(turn => turn.id === id && turn.role === role);
}

function canBeActive(turn: ConversationTurn): boolean {
  return turn.role !== 'system'
    && (isConversationSource(turn.source) || (turn.role === 'agent' && turn.source === 'tool'));
}

/** Preserve the historical merge API's word spacing; transcription deltas stay verbatim. */
function mergeText(previous: string, next: string): string {
  const needsSpace = previous && next && !/\s$/u.test(previous) && !/^[\s.,!?]/u.test(next);
  return previous + (needsSpace ? ' ' : '') + next;
}

// Session setup is explicit: this module must never import settings or state.ts.
export const useLogStore = create<ConversationState>((set) => ({
  turns: [],
  activeUserTurnId: null,
  activeAgentTurnId: null,
  completedAgentTurnId: null,
  agentTurnComplete: false,
  isAwaitingFunctionResponse: false,
  awaitingToolType: null,
  sessionMetadata: null,

  initSession: config => set(state => state.sessionMetadata
    ? state
    : { sessionMetadata: newSession(config) }),

  recordConnection: config => set(state => {
    const session = state.sessionMetadata ?? newSession(config);
    const connection: ConnectionMetadata = {
      connectionId: config.connectionId ?? newId(),
      connectedAt: new Date(),
      systemPrompt: config.systemPrompt,
      model: config.model,
    };
    return {
      completedAgentTurnId: null,
      agentTurnComplete: false,
      sessionMetadata: {
        ...session,
        connectionId: connection.connectionId,
        connections: [...session.connections, connection],
      },
    };
  }),

  beginAgentTurn: () => set(state => {
    const index = activeIndex(state, 'agent');
    if (index === -1 && !state.agentTurnComplete && state.completedAgentTurnId === null) return state;
    let turns = state.turns;
    if (index !== -1 && !turns[index].isFinal) {
      turns = [...turns];
      turns[index] = { ...turns[index], isFinal: true };
    }
    return { turns, activeAgentTurnId: null, completedAgentTurnId: null, agentTurnComplete: false };
  }),

  addTurn: input => set(state => {
    const turn = makeTurn(input, state);
    if (!canBeActive(turn)) return { turns: [...state.turns, turn] };
    const role = turn.role as ConversationRole;
    const index = activeIndex(state, role);
    const turns = [...state.turns];
    if (index !== -1 && !turns[index].isFinal) turns[index] = { ...turns[index], isFinal: true };
    turns.push(turn);
    return {
      turns,
      [activeKey(role)]: turn.isFinal ? null : turn.id,
      completedAgentTurnId: null,
      agentTurnComplete: false,
    };
  }),

  updateLastTurn: update => set(state => {
    const previous = state.turns[state.turns.length - 1];
    if (!previous) return state;
    const turn = { ...previous, ...update, id: previous.id };
    const turns = [...state.turns];
    turns[turns.length - 1] = turn;
    const active: Partial<ConversationState> = {};
    for (const role of ['user', 'agent'] as const) {
      const key = activeKey(role);
      if (state[key] === turn.id && (turn.isFinal || turn.role !== role || !canBeActive(turn))) {
        active[key] = null;
      }
    }
    if (!turn.isFinal && canBeActive(turn)) active[activeKey(turn.role as ConversationRole)] = turn.id;
    return { turns, ...active };
  }),

  mergeIntoLastAgentTurn: update => set(state => {
    const index = activeIndex(state, 'agent');
    if (index === -1) {
      const hasData = !!(update.text || update.toolUseRequest
        || update.actualToolCalls?.length || update.toolResponse !== undefined);
      if (!hasData) return state;
      const turn = makeTurn({ role: 'agent', text: '', isFinal: false, ...update }, state);
      return {
        turns: [...state.turns, turn],
        activeAgentTurnId: !turn.isFinal && canBeActive(turn) ? turn.id : null,
        completedAgentTurnId: null,
        agentTurnComplete: false,
      };
    }
    const previous = state.turns[index];
    const turn: ConversationTurn = {
      ...previous,
      ...update,
      id: previous.id,
      source: update.source ?? (previous.source === 'tool' && update.text?.trim() ? 'text' : previous.source),
      text: mergeText(previous.text, update.text ?? ''),
      isFinal: update.isFinal ?? previous.isFinal,
      actualToolCalls: previous.actualToolCalls || update.actualToolCalls
        ? [...(previous.actualToolCalls ?? []), ...(update.actualToolCalls ?? [])]
        : undefined,
      toolResponse: update.toolResponse ?? previous.toolResponse,
    };
    const turns = [...state.turns];
    turns[index] = turn;
    return { turns, activeAgentTurnId: !turn.isFinal && canBeActive(turn) ? turn.id : null };
  }),

  appendTranscription: (role, text, finished) => set(state => {
    let index = activeIndex(state, role);
    const lateOutput = role === 'agent' && index === -1 && state.agentTurnComplete;
    if (lateOutput && state.completedAgentTurnId !== null) {
      index = state.turns.findIndex(turn => turn.id === state.completedAgentTurnId
        && turn.role === 'agent' && canBeActive(turn));
    }
    // Empty completion events can finish an existing transcript, but create no rows.
    if (index === -1 && !text.trim()) return state;
    if (index !== -1 && !text && !finished) return state;
    const turns = [...state.turns];
    const previous = index === -1 ? undefined : turns[index];
    const isFinal = lateOutput || (role === 'user' && finished);
    const turn = previous ? {
      ...previous,
      text: previous.text + text,
      source: 'transcription' as const,
      transcriptionFinished: finished,
      isFinal,
    } : makeTurn({
      role, text, isFinal, source: 'transcription', transcriptionFinished: finished,
    }, state);
    if (index === -1) turns.push(turn);
    else turns[index] = turn;

    // Output starts a response even when a system card is the last visible row.
    const userIndex = role === 'agent' && !lateOutput ? activeIndex(state, 'user') : -1;
    if (userIndex !== -1 && !turns[userIndex].isFinal) {
      turns[userIndex] = { ...turns[userIndex], isFinal: true };
    }
    return {
      turns,
      ...(role === 'agent' && !lateOutput ? { activeUserTurnId: null } : {}),
      ...(lateOutput ? { completedAgentTurnId: turn.id } : {}),
      ...(role === 'user' && index === -1
        ? { completedAgentTurnId: null, agentTurnComplete: false }
        : {}),
      [activeKey(role)]: isFinal ? null : turn.id,
    };
  }),

  finalizeTurns: (interrupted = false) => set(state => {
    // Completion does not imply transcription has arrived yet. Keep its target
    // even after `finished`, which can describe one transcription segment.
    // A new local request/user turn, interruption, or connection resets it.
    const completedAgentTurnId = interrupted ? null : state.activeAgentTurnId ?? state.completedAgentTurnId;
    const agentTurnComplete = !interrupted;
    let changed = false;
    const turns = state.turns.map(turn => {
      if (turn.isFinal || !canBeActive(turn)) return turn;
      changed = true;
      return { ...turn, isFinal: true, ...(interrupted ? { interrupted: true } : {}) };
    });
    if (!changed && !state.activeUserTurnId && !state.activeAgentTurnId
      && !state.isAwaitingFunctionResponse && state.awaitingToolType === null
      && completedAgentTurnId === state.completedAgentTurnId
      && agentTurnComplete === state.agentTurnComplete) return state;
    return {
      turns: changed ? turns : state.turns,
      activeUserTurnId: null,
      activeAgentTurnId: null,
      completedAgentTurnId,
      agentTurnComplete,
      isAwaitingFunctionResponse: false,
      awaitingToolType: null,
    };
  }),

  clearTurns: () => set({
    turns: [],
    sessionMetadata: null,
    activeUserTurnId: null,
    activeAgentTurnId: null,
    completedAgentTurnId: null,
    agentTurnComplete: false,
    isAwaitingFunctionResponse: false,
    awaitingToolType: null,
  }),

  setIsAwaitingFunctionResponse: (isAwaiting, toolName) => set({
    isAwaitingFunctionResponse: isAwaiting,
    awaitingToolType: isAwaiting ? toolName || null : null,
  }),
}));
