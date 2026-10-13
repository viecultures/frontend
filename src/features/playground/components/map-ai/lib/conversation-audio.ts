import { AudioRecorder } from './audio-recorder';
import { AudioStreamer } from './audio-streamer';
import { createAudioContext, resumeAudioOutput } from './utils';
import VolMeterWorklet from './worklets/vol-meter';
import type { GenAILiveClient } from './genai-live-client';

export interface AudioState {
  recording: boolean;
  isPlaying: boolean;
  inputVolume: number;
  volume: number;
}

export interface ConversationAudioPort {
  unlock(): Promise<void>;
  startMicrophone(client: Pick<GenAILiveClient, 'sendRealtimeInput'>): Promise<void>;
  stopMicrophone(): void;
  addAudio(data: ArrayBuffer): void;
  stopPlayback(): void;
  completePlayback(): void;
  setMuted(muted: boolean): void;
  dispose(): void;
  readonly playing: boolean;
}

/** Owned by the session runtime, never by a view. */
export class ConversationAudio implements ConversationAudioPort {
  private streamer: AudioStreamer | null = null;
  private recorder: AudioRecorder | null = null;
  private microphoneAttempt = 0;
  private muted = false;
  private detachRecorder: (() => void) | null = null;

  constructor(private readonly update: (state: Partial<AudioState>) => void) {}

  unlock(): Promise<void> {
    if (!this.streamer || this.streamer.context.state === 'closed') {
      const streamer = new AudioStreamer(createAudioContext());
      this.streamer = streamer;
      streamer.setGain(this.muted ? 0 : 1);
      streamer.onComplete = () => {
        if (this.streamer === streamer && !streamer.playing) this.update({ isPlaying: false, volume: 0 });
      };
      // Metering is optional and must not delay the gesture-bound resume call.
      void streamer.addWorklet('vumeter-out', VolMeterWorklet, (event: { data: { volume: number } }) => {
        if (this.streamer === streamer) this.update({ volume: event.data.volume });
      }).catch(() => {});
    }
    return resumeAudioOutput(this.streamer.context);
  }

  async startMicrophone(client: Pick<GenAILiveClient, 'sendRealtimeInput'>) {
    if (this.recorder) return;
    const attempt = ++this.microphoneAttempt;
    const recorder = new AudioRecorder();
    this.recorder = recorder;
    const onData = (data: string) => {
      if (attempt === this.microphoneAttempt) client.sendRealtimeInput([{ mimeType: 'audio/pcm;rate=16000', data }]);
    };
    const onVolume = (inputVolume: number) => {
      if (attempt === this.microphoneAttempt) this.update({ inputVolume });
    };
    recorder.on('data', onData);
    recorder.on('volume', onVolume);
    this.detachRecorder = () => { recorder.off('data', onData); recorder.off('volume', onVolume); };
    try {
      await recorder.start();
      if (attempt !== this.microphoneAttempt) { recorder.stop(); return; }
      this.update({ recording: true });
    } catch (error) {
      if (attempt === this.microphoneAttempt) this.stopMicrophone();
      else recorder.stop();
      throw error;
    }
  }

  stopMicrophone() {
    this.microphoneAttempt++;
    this.detachRecorder?.();
    this.detachRecorder = null;
    this.recorder?.stop();
    this.recorder = null;
    this.update({ recording: false, inputVolume: 0 });
  }

  addAudio(data: ArrayBuffer) {
    if (!this.streamer) return;
    this.streamer.addPCM16(new Uint8Array(data));
    this.update({ isPlaying: true });
  }

  stopPlayback() {
    this.streamer?.stop();
    this.update({ isPlaying: false, volume: 0 });
  }

  completePlayback() { this.streamer?.complete(); }
  get playing() { return this.streamer?.playing ?? false; }
  setMuted(muted: boolean) { this.muted = muted; this.streamer?.setGain(muted ? 0 : 1); }

  dispose() {
    this.stopMicrophone();
    const streamer = this.streamer;
    this.streamer = null;
    streamer?.stop();
    if (streamer && streamer.context.state !== 'closed') void streamer.context.close().catch(() => {});
    this.update({ isPlaying: false, volume: 0 });
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
  }
}
