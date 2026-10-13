import type { LiveServerToolCall, LiveServerToolCallCancellation, LiveConnectConfig } from '@google/genai';
import type { ProficiencyLevel } from '@/data/lessonAgentCatalog';
import type { GenAILiveClient } from './genai-live-client';
import type { AudioState, ConversationAudioPort } from './conversation-audio';
import { buildResumeHistory } from './conversation-history';
import { useLogStore } from './conversation-state';
import { PROFICIENCY_LEVELS } from './prompt-scaffolder';
import type { CulturalTutorMode } from './state';

export type ActiveView = 'chat' | 'immersive' | null;
export type ActionResult = { status: 'ok' | 'busy' | 'inactive' | 'cancelled' | 'error'; message?: string };
export type MessageSource = 'composer' | 'suggestion' | 'map';
export type InputMode = 'voice' | 'text';
export interface SessionSnapshot extends AudioState {
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'ending' | 'error';
  activeView: ActiveView;
  connectionError: string | null;
  pendingPrompt: string;
  isSending: boolean;
  isRestoringContext: boolean;
  isAwaitingResponse: boolean;
}
export interface SessionDependencies {
  client: Pick<GenAILiveClient, 'on' | 'off' | 'connect' | 'disconnect' | 'prefill' | 'send' | 'sendToolResponse' | 'endAudioInput' | 'sendRealtimeInput'>;
  audio: ConversationAudioPort;
  configuration: () => { config: LiveConnectConfig; systemPrompt: string; model: string };
  toolPolicy: () => { allowMapTools: boolean; tutorMode: CulturalTutorMode };
  dispatchTool: (name: string, args: unknown, context: { allowMapTools: boolean; tutorMode: CulturalTutorMode; isCurrent: () => boolean }) => Promise<string | object>;
  setLevel: (level: ProficiencyLevel) => void;
  setMuted: (muted: boolean) => void;
  clearMarkers: () => void;
}
interface Request { input: InputMode; text?: string; source?: MessageSource }

/** Testable owner of one connection. UI only subscribes and invokes actions. */
export class SessionController {
  private state: SessionSnapshot = {
    connectionStatus: 'idle', activeView: null, connectionError: null, pendingPrompt: '',
    isSending: false, isRestoringContext: false, isAwaitingResponse: false,
    recording: false, isPlaying: false, inputVolume: 0, volume: 0,
  };
  private listeners = new Set<() => void>();
  private generation = 0;
  private toolEpoch = 0;
  private cancelledTools = new Set<string>();
  private activeToolBatches = 0;
  private pendingRequest: Request | null = null;
  private summaryComplete = false;
  private summaryStarted = false;
  private responseInFlight = false;
  private summaryPending = false;
  private summaryTimer: ReturnType<typeof setInterval> | null = null;
  private attached = false;
  private sessionPolicy: ReturnType<SessionDependencies['toolPolicy']> | null = null;

  constructor(private readonly deps: SessionDependencies) {}
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private patch(update: Partial<SessionSnapshot>) {
    this.state = { ...this.state, ...update };
    this.listeners.forEach(listener => listener());
  }
  updateAudio = (update: Partial<AudioState>) => this.patch(update);

  setActiveView(view: ActiveView) {
    if (view === this.state.activeView) return;
    this.stopConversation('view-change');
    this.patch({ activeView: view });
  }

  attach() {
    if (this.attached) return;
    this.attached = true;
    const client = this.deps.client;
    client.on('inputTranscription', this.onInput);
    client.on('outputTranscription', this.onOutput);
    client.on('audio', this.onAudio);
    client.on('turncomplete', this.onTurnComplete);
    client.on('interrupted', this.onInterrupted);
    client.on('toolcall', this.onToolCall);
    client.on('toolcallcancellation', this.onToolCancellation);
    client.on('error', this.onError);
    client.on('close', this.onClose);
  }

  dispose() {
    this.stopConversation('unmount');
    const client = this.deps.client;
    client.off('inputTranscription', this.onInput);
    client.off('outputTranscription', this.onOutput);
    client.off('audio', this.onAudio);
    client.off('turncomplete', this.onTurnComplete);
    client.off('interrupted', this.onInterrupted);
    client.off('toolcall', this.onToolCall);
    client.off('toolcallcancellation', this.onToolCancellation);
    client.off('error', this.onError);
    client.off('close', this.onClose);
    this.attached = false;
  }

  private acceptsEvents() {
    return this.state.activeView !== null && ['connected', 'ending'].includes(this.state.connectionStatus);
  }
  private onInput = (text: string, finished: boolean) => {
    if (!this.acceptsEvents() || this.state.connectionStatus === 'ending') return;
    useLogStore.getState().appendTranscription('user', text, finished);
    // A final ASR packet may trail the model's turnComplete. It is transcript
    // bookkeeping, not evidence of another pending model response.
    if (text.trim() && !finished) {
      this.responseInFlight = true;
      this.patch({ isAwaitingResponse: true });
    }
  };
  private onOutput = (text: string, finished: boolean) => {
    if (!this.acceptsEvents()) return;
    useLogStore.getState().appendTranscription('agent', text, finished);
    if (text && !this.summaryPending) this.summaryStarted = true;
    this.patch({ isAwaitingResponse: false });
  };
  private onAudio = (data: ArrayBuffer) => {
    if (!this.acceptsEvents()) return;
    if (!this.summaryPending) this.summaryStarted = true;
    this.responseInFlight = true;
    this.deps.audio.addAudio(data);
    this.patch({ isAwaitingResponse: false });
  };
  private onTurnComplete = () => {
    if (!this.acceptsEvents()) return;
    this.responseInFlight = false;
    useLogStore.getState().finalizeTurns();
    this.deps.audio.completePlayback();
    if (this.state.connectionStatus === 'ending' && this.summaryStarted) this.summaryComplete = true;
    this.patch({ isAwaitingResponse: false });
    if (this.summaryPending) this.sendSummary();
  };
  private onInterrupted = () => {
    if (!this.acceptsEvents()) return;
    this.toolEpoch++;
    this.activeToolBatches = 0;
    this.deps.audio.stopPlayback();
    useLogStore.getState().finalizeTurns(true);
    useLogStore.getState().setIsAwaitingFunctionResponse(false);
    this.patch({ isAwaitingResponse: false });
  };
  private onError = (error: ErrorEvent) => {
    if (this.state.connectionStatus === 'idle') return;
    this.fail(error.message || 'Không thể kết nối. Hãy thử lại.');
  };
  private onClose = (_event: CloseEvent) => {
    if (this.state.connectionStatus !== 'idle') this.fail('Kết nối đã đóng. Bạn có thể tiếp tục từ lịch sử.');
  };
  private onToolCancellation = (event: LiveServerToolCallCancellation) => {
    event.ids?.forEach(id => this.cancelledTools.add(id));
  };
  private onToolCall = async (event: LiveServerToolCall) => {
    if (!this.acceptsEvents()) return;
    const generation = this.generation;
    const epoch = this.toolEpoch;
    const batchCurrent = () => generation === this.generation && epoch === this.toolEpoch && this.acceptsEvents();
    const log = useLogStore.getState();
    this.activeToolBatches++;
    try {
      for (const call of event.functionCalls ?? []) {
        const isCurrent = () => batchCurrent() && !(call.id && this.cancelledTools.has(call.id));
        if (!isCurrent()) continue;
        const name = call.name ?? '';
        log.setIsAwaitingFunctionResponse(true, name);
        let response: { result?: string | object; error?: string };
        try {
          const result = await this.deps.dispatchTool(name, call.args, { ...(this.sessionPolicy ?? this.deps.toolPolicy()), isCurrent });
          response = { result };
        } catch (error) {
          response = { error: error instanceof Error ? error.message : String(error) };
        }
        if (isCurrent()) this.deps.client.sendToolResponse({ functionResponses: [{ id: call.id, name, response }] });
      }
    } catch (error) {
      if (batchCurrent()) this.fail(error instanceof Error ? error.message : 'Không thể gửi kết quả tool.');
    } finally {
      if (batchCurrent()) log.setIsAwaitingFunctionResponse(--this.activeToolBatches > 0);
    }
  };

  private fail(message: string) {
    const pending = this.pendingRequest;
    this.stopConversation('error');
    this.pendingRequest = pending;
    this.patch({ connectionStatus: 'error', connectionError: message, pendingPrompt: pending?.source ? pending.text ?? '' : '' });
  }

  stopConversation = (_reason = 'user') => {
    this.generation++;
    this.toolEpoch++;
    this.activeToolBatches = 0;
    this.cancelledTools.clear();
    if (this.summaryTimer) clearInterval(this.summaryTimer);
    this.summaryTimer = null;
    this.pendingRequest = null;
    this.summaryPending = false;
    this.responseInFlight = false;
    this.sessionPolicy = null;
    this.patch({ connectionStatus: 'idle', isSending: false, isRestoringContext: false,
      isAwaitingResponse: false, pendingPrompt: '', connectionError: null });
    this.deps.client.disconnect();
    this.deps.audio.dispose();
    this.deps.setMuted(true);
    useLogStore.getState().finalizeTurns(true);
    useLogStore.getState().setIsAwaitingFunctionResponse(false);
  };

  resetConversation = () => {
    this.stopConversation('reset');
    useLogStore.getState().clearTurns();
    this.deps.clearMarkers();
  };

  private async run(request: Request): Promise<ActionResult> {
    if (!this.state.activeView) return { status: 'inactive' };
    if (this.state.isSending || this.state.connectionStatus === 'ending') return { status: 'busy' };
    const generation = this.generation;
    const current = () => generation === this.generation;
    const history = buildResumeHistory(useLogStore.getState().turns);
    const reconnect = this.state.connectionStatus !== 'connected';
    this.pendingRequest = request;
    this.patch({ isSending: true, connectionError: null,
      pendingPrompt: request.source ? request.text ?? '' : '',
      ...(reconnect ? { connectionStatus: 'connecting', isRestoringContext: history.length > 0 } : {}) });
    try {
      // Executes inside the initiating UI gesture, before any network await.
      const unlocked = this.deps.audio.unlock();
      await unlocked;
      if (!current()) return { status: 'cancelled' };
      if (reconnect) {
        const configuration = this.deps.configuration();
        this.sessionPolicy = { ...this.deps.toolPolicy() };
        const ready = await this.deps.client.connect(configuration.config);
        if (!current()) return { status: 'cancelled' };
        if (!ready) throw new Error('Kết nối chưa sẵn sàng. Hãy thử lại.');
        if (history.length) this.deps.client.prefill(history);
        useLogStore.getState().recordConnection({ ...configuration, connectionId: crypto.randomUUID() });
        this.patch({ connectionStatus: 'connected', isRestoringContext: false });
      }
      const text = request.text ?? (history.length
        ? 'Continue our conversation naturally using the restored context. Do not greet again or answer old questions again. Ask one brief follow-up.'
        : 'Start a friendly conversation about Vietnam. Ask me what I would like to talk about.');
      if (request.text || reconnect) {
        this.onInterrupted();
        this.patch({ isAwaitingResponse: true });
        this.responseInFlight = true;
        useLogStore.getState().beginAgentTurn();
        this.deps.client.send({ text });
        if (request.source) useLogStore.getState().addTurn({ role: 'user', text, isFinal: true, source: request.source });
      }
      this.pendingRequest = null;
      this.patch({ pendingPrompt: '' });
      if (request.input === 'voice') {
        const mic = await this.setMicrophoneEnabled(true);
        if (mic.status !== 'ok') return mic;
      }
      return { status: 'ok' };
    } catch (error) {
      if (!current()) return { status: this.state.connectionStatus === 'error' ? 'error' : 'cancelled', message: this.state.connectionError ?? undefined };
      const message = error instanceof Error ? error.message : 'Không thể gửi yêu cầu.';
      this.fail(message);
      return { status: 'error', message };
    } finally {
      if (current()) this.patch({ isSending: false, isRestoringContext: false });
    }
  }

  startConversation = ({ input, openingText }: { input: InputMode; openingText?: string }) => this.run({ input, text: openingText });
  resumeConversation = ({ input, message }: { input: InputMode; message?: string }) => this.run({ input, text: message, ...(message ? { source: 'composer' as const } : {}) });
  sendMessage = ({ text, source }: { text: string; source: MessageSource }): Promise<ActionResult> => {
    if (!text.trim()) return Promise.resolve({ status: 'error', message: 'Vui lòng nhập nội dung.' });
    return this.run({ input: 'text', text, source });
  };
  sendControlInstruction = (text: string) => this.run({ input: 'text', text });
  retry = () => this.run(this.pendingRequest ?? { input: 'text' });

  changeLevel = async (level: ProficiencyLevel): Promise<ActionResult> => {
    if (!this.state.activeView) return { status: 'inactive' };
    if (this.state.isSending || this.state.connectionStatus === 'ending') return { status: 'busy' };
    if (this.state.connectionStatus === 'connected') {
      const result = await this.sendControlInstruction(PROFICIENCY_LEVELS[level].switchPrompt);
      if (result.status !== 'ok') return result;
    }
    this.deps.setLevel(level);
    return { status: 'ok' };
  };

  setMicrophoneEnabled = async (enabled: boolean): Promise<ActionResult> => {
    if (!enabled) {
      this.deps.audio.stopMicrophone(); this.deps.setMuted(true);
      this.deps.client.endAudioInput();
      return { status: 'ok' };
    }
    if (!this.state.activeView || this.state.connectionStatus !== 'connected') return { status: 'inactive' };
    const generation = this.generation;
    this.deps.setMuted(false);
    try {
      await this.deps.audio.startMicrophone(this.deps.client);
      return { status: generation === this.generation ? 'ok' : 'cancelled' };
    } catch (error) {
      if (generation !== this.generation) return { status: 'cancelled' };
      const message = error instanceof Error ? error.message : 'Không thể mở microphone.';
      this.deps.setMuted(true);
      this.patch({ connectionError: message });
      return { status: 'error', message };
    }
  };

  endConversation = async (): Promise<ActionResult> => {
    if (!this.state.activeView) return { status: 'inactive' };
    if (this.state.isSending || this.state.connectionStatus === 'ending') return { status: 'busy' };
    if (this.state.connectionStatus !== 'connected') return { status: 'inactive' };
    const generation = this.generation;
    try {
      this.patch({ connectionStatus: 'ending' });
      await this.setMicrophoneEnabled(false);
      if (generation !== this.generation) return { status: 'cancelled' };
      this.summaryComplete = false;
      this.summaryStarted = false;
      this.summaryPending = true;
      this.patch({ connectionStatus: 'ending', isAwaitingResponse: true });
      // Wait for the existing server turn boundary. Its tail cannot be mistaken
      // for the requested summary (Live events do not carry response IDs).
      if (!this.responseInFlight) this.sendSummary();
      if (generation !== this.generation) return { status: 'error', message: this.state.connectionError ?? undefined };
      const started = Date.now();
      this.summaryTimer = setInterval(() => {
        if ((this.summaryComplete && !this.deps.audio.playing) || Date.now() - started >= 60000) this.stopConversation('end');
      }, 250);
      return { status: 'ok' };
    } catch (error) {
      if (generation !== this.generation) return { status: 'cancelled' };
      const message = error instanceof Error ? error.message : 'Không thể tổng kết.';
      this.fail(message);
      return { status: 'error', message };
    }
  };

  private sendSummary() {
    if (!this.summaryPending || this.state.connectionStatus !== 'ending') return;
    this.summaryPending = false;
    this.summaryStarted = false;
    this.summaryComplete = false;
    this.deps.audio.stopPlayback();
    this.responseInFlight = true;
    this.patch({ isAwaitingResponse: true });
    try {
      useLogStore.getState().beginAgentTurn();
      this.deps.client.send({ text: 'End our conversation now. Briefly summarize topics and useful vocabulary. Include corrections only if the correction setting is end-of-session. Do not ask another question.' });
    } catch (error) {
      this.fail(error instanceof Error ? error.message : 'Không thể tổng kết.');
    }
  }
}
