/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GoogleGenAI } from '@google/genai';
import type {
  LiveCallbacks,
  LiveClientToolResponse,
  LiveConnectConfig,
  LiveServerContent,
  LiveServerMessage,
  LiveServerToolCall,
  LiveServerToolCallCancellation,
  Part,
  Session,
  Blob,
  Content,
} from '@google/genai';
import EventEmitter from 'eventemitter3';
import { DEFAULT_LIVE_API_MODEL } from './constants';
import { base64ToArrayBuffer } from './utils';
import { debugLog } from './debug-logger';
import { useMapAiDebugStore } from './debug-logger';
import { makeLiveUsageSample } from './live-cost';

/**
 * Represents a single log entry in the system.
 * Used for tracking and displaying system events, messages, and errors.
 */
export interface StreamingLog {
  count?: number;
  data?: unknown;
  date: Date;
  message: string | object;
  type: string;
}

/**
 * Event types that can be emitted by the MultimodalLiveClient.
 * Each event corresponds to a specific message from GenAI or client state change.
 */
export interface LiveClientEventTypes {
  audio: (data: ArrayBuffer) => void;
  close: (event: CloseEvent) => void;
  content: (data: LiveServerContent) => void;
  error: (e: ErrorEvent) => void;
  interrupted: () => void;
  log: (log: StreamingLog) => void;
  open: () => void;
  setupcomplete: () => void;
  toolcall: (toolCall: LiveServerToolCall) => void;
  toolcallcancellation: (
    toolcallCancellation: LiveServerToolCallCancellation
  ) => void;
  turncomplete: () => void;
  generationcomplete: () => void;
  inputTranscription: (text: string, isFinal: boolean) => void;
  outputTranscription: (text: string, isFinal: boolean) => void;
}

export class GenAILiveClient {
  public readonly model: string = DEFAULT_LIVE_API_MODEL;
  private emitter = new EventEmitter<LiveClientEventTypes>();

  public on = this.emitter.on.bind(this.emitter);
  public off = this.emitter.off.bind(this.emitter);

  protected client: GoogleGenAI;
  protected session?: Session;
  private cancelSetup?: () => void;
  private generation = 0;
  private usageConnectionId = '';
  private usageContext: { view: 'chat' | 'immersive' | null; tutorMode: string; voiceInteractionMode: string } = {
    view: null, tutorMode: '', voiceInteractionMode: '',
  };

  public setUsageContext(context: typeof this.usageContext) { this.usageContext = context; }

  private _status: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  public get status() {
    return this._status;
  }

  public setApiKey(apiKey: string) {
    this.client = new GoogleGenAI({
      apiKey: apiKey,
    });
  }

  constructor(apiKey: string, model?: string) {
    if (model) this.model = model;

    this.client = new GoogleGenAI({
      apiKey: apiKey,
    });
  }

  public async connect(config: LiveConnectConfig): Promise<boolean> {
    if (this._status === 'connected' || this._status === 'connecting') {
      return false;
    }

    this._status = 'connecting';
    this.usageConnectionId = globalThis.crypto?.randomUUID?.() ?? String(Date.now());
    const generation = ++this.generation;
    const current = () => generation === this.generation;
    let setupTimer: ReturnType<typeof setTimeout>;
    const setupReady = new Promise<void>((resolve, reject) => {
      const ready = () => { clearTimeout(setupTimer); this.off('setupcomplete', ready); this.cancelSetup = undefined; resolve(); };
      this.on('setupcomplete', ready);
      this.cancelSetup = () => { clearTimeout(setupTimer); this.off('setupcomplete', ready); reject(new Error('Không thể khởi tạo phiên. Hãy thử lại.')); };
      setupTimer = setTimeout(() => this.cancelSetup?.(), 15000);
    });
    // Attach immediately so an early close cannot create an unhandled rejection.
    void setupReady.catch(() => {});
    const callbacks: LiveCallbacks = {
      onopen: () => { if (current()) this.onOpen(); },
      onmessage: message => { if (current()) this.onMessage(message); },
      onerror: event => { if (current()) { this.cancelSetup?.(); this.onError(event); } },
      onclose: event => { if (current()) this.onClose(event); },
    };

    try {
      const pendingSession = this.client.live.connect({
        model: this.model,
        config: {
          ...config,
        },
        callbacks,
      }).then(session => {
        if (!current()) { session.close(); throw new Error('Phiên đã được hủy.'); }
        return session;
      });
      // A setup timeout/cancellation must also release callers while the SDK's
      // connection promise is still pending. A late session closes itself above.
      const session = await Promise.race([
        pendingSession,
        setupReady.then(() => new Promise<never>(() => {})),
      ]);
      if (!current()) { session.close(); return false; }
      this.session = session;
      await setupReady;
    } catch (e: any) {
      if (!current()) return false;
      this.generation += 1;
      this.cancelSetup?.();
      this.cancelSetup = undefined;
      this.session?.close();
      console.error('Error connecting to GenAI Live:', e);
      this._status = 'disconnected';
      this.session = undefined;
      const errorEvent = new ErrorEvent('error', {
        error: e,
        message: e?.message || 'Failed to connect.',
      });
      this.onError(errorEvent);
      return false;
    }

    if (!current()) return false;
    this._status = 'connected';
    return true;
  }

  public disconnect() {
    this.generation += 1;
    this.cancelSetup?.();
    this.cancelSetup = undefined;
    this.session?.close();
    this.session = undefined;
    this._status = 'disconnected';

    this.log('client.close', `Disconnected`);
    return true;
  }

  public interrupt() {
    this.emitter.emit('interrupted');
    this.log('client.interrupt', 'Client-side interruption');
  }

  /** Restore role-preserving context without requesting a response. */
  public prefill(turns: Content[]) {
    if (this._status !== 'connected' || !this.session) throw new Error('Phiên chưa sẵn sàng.');
    if (turns.length) this.session.sendClientContent({ turns, turnComplete: false });
  }

  public endAudioInput() {
    if (this._status === 'connected' && this.session) this.session.sendRealtimeInput({ audioStreamEnd: true });
  }

  public startActivity() {
    if (this._status !== 'connected' || !this.session) throw new Error('Phiên chưa sẵn sàng.');
    this.session.sendRealtimeInput({ activityStart: {} });
  }

  public endActivity() {
    if (this._status === 'connected' && this.session) this.session.sendRealtimeInput({ activityEnd: {} });
  }

  public send(parts: Part | Part[], turnComplete: boolean = true) {
    if (this._status !== 'connected' || !this.session) {
      throw new Error('Phiên chưa sẵn sàng. Câu hỏi chưa được gửi.');
    }
    const partsArray = Array.isArray(parts) ? parts : [parts];
    this.session.sendClientContent({
      turns: [{ role: 'user', parts: partsArray }],
      turnComplete,
    });
    this.log(`client.send`, partsArray.map(part => part.inlineData
      ? { mimeType: part.inlineData.mimeType, encodedLength: part.inlineData.data?.length ?? 0 }
      : part));
  }

  public sendRealtimeText(text: string) {
    if (this._status !== 'connected' || !this.session) {
      this.emitter.emit('error', new ErrorEvent('Client is not connected'));
      console.error(`sendRealtimeText: Client is not connected, for message: ${text}`);
      return;
    }
    this.session.sendRealtimeInput({ text });
    this.log(`client.send`, text);
  }

  public sendRealtimeInput(chunks: Array<Blob>) {
    if (this._status !== 'connected' || !this.session) {
      this.emitter.emit('error', new ErrorEvent('Client is not connected'));
      return;
    }
    
    chunks.forEach(chunk => {
      if (chunk.mimeType?.includes('audio')) {
        this.session!.sendRealtimeInput({ audio: chunk });
      } else if (chunk.mimeType?.includes('image')) {
        this.session!.sendRealtimeInput({ video: chunk });
      }
    });

    let hasAudio = false;
    let hasVideo = false;
    for (let i = 0; i < chunks.length; i++) {
      const ch = chunks[i];
      if (ch.mimeType?.includes('audio')) hasAudio = true;
      if (ch.mimeType?.includes('image')) hasVideo = true;
      if (hasAudio && hasVideo) break;
    }
    let message = 'unknown';
    if (hasAudio && hasVideo) message = 'audio + video';
    else if (hasAudio) message = 'audio';
    else if (hasVideo) message = 'video';
    this.log(`client.realtimeInput`, message);
  }

  public sendToolResponse(toolResponse: LiveClientToolResponse) {
    if (this._status !== 'connected' || !this.session) {
      this.emitter.emit('error', new ErrorEvent('Client is not connected'));
      return;
    }
    if (
      toolResponse.functionResponses &&
      toolResponse.functionResponses.length
    ) {
      this.session.sendToolResponse({
        functionResponses: toolResponse.functionResponses,
      });
    }

    this.log(`client.toolResponse`, { toolResponse });
  }

  protected onMessage(message: LiveServerMessage) {
    if (message.usageMetadata) {
      const usage = message.usageMetadata;
      const sample = makeLiveUsageSample(usage, {
        connectionId: this.usageConnectionId,
        model: this.model,
        ...this.usageContext,
      });
      useMapAiDebugStore.getState().recordUsage(sample);
      debugLog.info('Gemini Live token usage', {
        connectionId: sample.connectionId,
        estimatedUsd: sample.estimatedUsd,
        totalTokenCount: sample.totalTokenCount,
      });
    }
    if (message.setupComplete) {
      this.emitter.emit('setupcomplete');
      return;
    }
    if (message.toolCall) {
      this.log('server.toolCall', message);
      this.emitter.emit('toolcall', message.toolCall);
      return;
    }
    if (message.toolCallCancellation) {
      this.log('receive.toolCallCancellation', message);
      this.emitter.emit('toolcallcancellation', message.toolCallCancellation);
      return;
    }

    if (message.serverContent) {
      const { serverContent } = message;
      if (serverContent.interrupted) {
        this.log('receive.serverContent', 'interrupted');
        this.emitter.emit('interrupted');
        return;
      }

      if (serverContent.inputTranscription) {
        const text = serverContent.inputTranscription.text || '';
        const isFinal =
          serverContent.inputTranscription.finished ??
          (serverContent.inputTranscription as any).isFinal ??
          false;
        this.emitter.emit('inputTranscription', text, isFinal);
        this.log('server.inputTranscription', text);
        debugLog.asr('user', text, {
          rawTranscription: serverContent.inputTranscription,
          isFinal,
        });
      }

      if (serverContent.outputTranscription) {
        const text = serverContent.outputTranscription.text || '';
        const isFinal =
          serverContent.outputTranscription.finished ??
          (serverContent.outputTranscription as any).isFinal ??
          false;
        this.emitter.emit('outputTranscription', text, isFinal);
        this.log('server.outputTranscription', text);
        debugLog.asr('agent', text, {
          rawTranscription: serverContent.outputTranscription,
          isFinal,
        });
      }

      if (serverContent.modelTurn) {
        let parts: Part[] = serverContent.modelTurn.parts || [];

        const audioParts = parts.filter(p =>
          p.inlineData?.mimeType?.startsWith('audio/pcm'),
        );
        const base64s = audioParts.map(p => p.inlineData?.data);
        const otherParts = parts.filter(part => !audioParts.includes(part));

        base64s.forEach(b64 => {
          if (b64) {
            const data = base64ToArrayBuffer(b64);
            this.emitter.emit('audio', data as ArrayBuffer);
            this.log(`server.audio`, `buffer (${data.byteLength})`);
          }
        });

        if (otherParts.length > 0) {
          const content: LiveServerContent = { modelTurn: { parts: otherParts } };
          this.emitter.emit('content', content);
          this.log(`server.content`, message);
        }
      }

      if (serverContent.turnComplete) {
        this.log('server.send', 'turnComplete');
        this.emitter.emit('turncomplete');
      }

      if ((serverContent as any).generationComplete) {
        this.log('server.send', 'generationComplete');
        this.emitter.emit('generationcomplete');
      }
    }
  }

  protected onError(e: ErrorEvent) {
    this._status = 'disconnected';
    console.error('error:', e);

    const message = `Could not connect to GenAI Live: ${e.message}`;
    this.log(`server.${e.type}`, message);
    this.emitter.emit('error', e);
  }

  protected onOpen() {
    this.emitter.emit('open');
  }

  protected onClose(e: CloseEvent) {
    this.cancelSetup?.();
    this._status = 'disconnected';
    let reason = e.reason || '';
    if (reason.toLowerCase().includes('error')) {
      const prelude = 'ERROR]';
      const preludeIndex = reason.indexOf(prelude);
      if (preludeIndex > 0) {
        reason = reason.slice(preludeIndex + prelude.length + 1, Infinity);
      }
    }

    this.log(
      `server.${e.type}`,
      `disconnected ${reason ? `with reason: ${reason}` : ``}`
    );
    this.emitter.emit('close', e);
  }

  protected log(type: string, message: string | object) {
    this.emitter.emit('log', {
      type,
      message,
      date: new Date(),
    });
  }
}
