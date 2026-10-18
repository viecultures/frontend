import { MAX_TAKE_BYTES, MAX_TAKE_SECONDS } from './shadowing-lesson';

export type RecorderPhase = 'idle' | 'requesting' | 'arming' | 'recording' | 'stopping';
export interface CapturedAudio { blob: Blob; duration: number; timelineStart: number }
interface RecorderCallbacks { phase(phase: RecorderPhase): void; error(message: string): void }
interface RecorderEnvironment {
  getStream(): Promise<MediaStream>;
  createRecorder(stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder;
  supports(mime: string): boolean;
  now(): number;
}

const browserEnvironment: RecorderEnvironment = {
  getStream: () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('Trình duyệt cần HTTPS/localhost và hỗ trợ thu microphone.');
    return navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 }, video: false });
  },
  createRecorder: (stream, options) => new MediaRecorder(stream, options),
  supports: mime => MediaRecorder.isTypeSupported(mime), now: () => performance.now(),
};

export class SentenceRecorder {
  private generation = 0;
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private timer: ReturnType<typeof setTimeout> | undefined;
  private active = false;
  private stopping = false;
  private stoppedAt: number | null = null;

  constructor(private callbacks: RecorderCallbacks, private environment: RecorderEnvironment = browserEnvironment) {}

  async start(prepare: () => Promise<number>, commit: (audio: CapturedAudio) => void, budget: number) {
    if (this.active) return;
    this.active = true; this.stopping = false; this.stoppedAt = null;
    const generation = ++this.generation;
    const current = () => generation === this.generation;
    this.callbacks.phase('requesting');
    try {
      const stream = await this.environment.getStream();
      if (!current()) { stream.getTracks().forEach(track => track.stop()); return; }
      this.stream = stream;
      for (const track of stream.getTracks()) track.onended = () => { if (current()) this.fail('Microphone đã ngắt kết nối. Hãy thu lại câu này.'); };
      this.callbacks.phase('arming');
      const timelineStart = await prepare();
      if (!current()) return;
      const mimeType = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find(mime => this.environment.supports(mime));
      const options: MediaRecorderOptions = { audioBitsPerSecond: 128000, ...(mimeType ? { mimeType } : {}) };
      const recorder = this.environment.createRecorder(stream, options);
      this.recorder = recorder; this.chunks = [];
      let bytes = 0;
      const startedAt = this.environment.now();
      recorder.ondataavailable = event => {
        if (!current() || !event.data.size) return;
        bytes += event.data.size;
        if (bytes > Math.min(MAX_TAKE_BYTES, budget)) { this.fail('Đã đạt giới hạn bộ nhớ bản thu. Xóa bớt bản thu hoặc thu đoạn ngắn hơn.'); return; }
        this.chunks.push(event.data);
      };
      recorder.onerror = () => { if (current()) this.fail('Không ghi được audio. Bản thu trước vẫn được giữ.'); };
      recorder.onstop = () => {
        if (!current()) return;
        const blob = new Blob(this.chunks, { type: recorder.mimeType || this.chunks[0]?.type || 'application/octet-stream' });
        const duration = Math.max(0, ((this.stoppedAt ?? this.environment.now()) - startedAt) / 1000);
        this.release();
        this.callbacks.phase('idle');
        if (blob.size && duration >= 0.15) commit({ blob, duration, timelineStart });
        else this.callbacks.error('Bản thu quá ngắn hoặc trống. Hãy thử lại.');
      };
      recorder.start(250);
      this.callbacks.phase('recording');
      this.timer = setTimeout(() => this.stop(), MAX_TAKE_SECONDS * 1000);
    } catch (error) {
      if (current()) this.fail(error instanceof Error && error.name === 'NotAllowedError'
        ? 'Chưa được cấp quyền microphone. Hãy cho phép truy cập rồi thu lại; bản cũ vẫn còn.'
        : error instanceof Error ? error.message : 'Không mở được microphone. Kiểm tra quyền truy cập.');
    }
  }

  stop() {
    if (!this.recorder || this.recorder.state === 'inactive' || this.stopping) return;
    this.stoppedAt = this.environment.now();
    this.stopping = true; this.callbacks.phase('stopping'); clearTimeout(this.timer); this.recorder.stop();
  }

  cancel() { ++this.generation; this.release(); this.callbacks.phase('idle'); }
  private fail(message: string) { this.cancel(); this.callbacks.error(message); }
  private release() {
    clearTimeout(this.timer);
    if (this.recorder) {
      this.recorder.ondataavailable = null; this.recorder.onstop = null; this.recorder.onerror = null;
      if (this.recorder.state !== 'inactive') this.recorder.stop();
    }
    this.stream?.getTracks().forEach(track => { track.onended = null; track.stop(); });
    this.recorder = null; this.stream = null; this.chunks = []; this.active = false; this.stopping = false;
  }
}
