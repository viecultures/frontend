/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { encodeWav } from './wav-encoder';

export interface TwoPassVadCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: (wavBlob: Blob) => void;
  onVolumeChange?: (volume: number) => void;
  onError?: (error: Error) => void;
}

export interface TwoPassVadConfig {
  silenceThresholdMs?: number; // Duration of silence to trigger end of utterance (default: 800ms)
  speechThresholdMultiplier?: number; // Multiplier above adaptive noise floor (default: 2.2)
  minSpeechDurationMs?: number; // Minimum speech duration to prevent noise bursts (default: 350ms)
  maxSpeechDurationMs?: number; // Max speech cutoff safeguard (default: 20000ms)
  targetSampleRate?: number; // Desired sample rate for AudioContext (default: 16000)
}

/**
 * TwoPassVoiceDetector
 * Real-time Voice Activity Detector (VAD) using the Web Audio API with:
 * - Dynamic adaptive noise floor tracking
 * - Pre-roll audio buffer to prevent cutting initial consonants
 * - Silence duration detection (800ms)
 * - Automatic 16-bit PCM WAV encoding upon speech completion
 */
export class TwoPassVoiceDetector {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private silentGainNode: GainNode | null = null;

  private isRunning = false;
  private isSpeaking = false;
  private speechStartTime = 0;
  private lastVoiceDetectedTime = 0;

  // Dynamic noise floor tracking
  private noiseFloor = 0.012;
  private readonly minNoiseFloor = 0.005;
  private readonly maxNoiseFloor = 0.12;

  // Audio chunk collection
  private recordedChunks: Float32Array[] = [];
  private preRollBuffer: Float32Array[] = [];
  private readonly preRollMaxChunks = 4; // ~180-250ms ring buffer

  private readonly silenceThresholdMs: number;
  private readonly speechThresholdMultiplier: number;
  private readonly minSpeechDurationMs: number;
  private readonly maxSpeechDurationMs: number;
  private readonly targetSampleRate: number;

  private callbacks: TwoPassVadCallbacks;

  constructor(callbacks: TwoPassVadCallbacks = {}, config: TwoPassVadConfig = {}) {
    this.callbacks = callbacks;
    this.silenceThresholdMs = config.silenceThresholdMs ?? 800;
    this.speechThresholdMultiplier = config.speechThresholdMultiplier ?? 2.2;
    this.minSpeechDurationMs = config.minSpeechDurationMs ?? 350;
    this.maxSpeechDurationMs = config.maxSpeechDurationMs ?? 20000;
    this.targetSampleRate = config.targetSampleRate ?? 16000;
  }

  /**
   * Update callbacks dynamically
   */
  public setCallbacks(callbacks: Partial<TwoPassVadCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Start microphone capture and VAD listening
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Web Audio API or MediaDevices is not supported in this browser.');
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioContextConstructor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      this.audioContext = new AudioContextConstructor({
        sampleRate: this.targetSampleRate,
      });

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 512;
      this.analyserNode.smoothingTimeConstant = 0.2;

      // 2048 sample frames (~128ms at 16kHz)
      this.processorNode = this.audioContext.createScriptProcessor(2048, 1, 1);

      // Silent gain to prevent microphone audio loopback into speakers
      this.silentGainNode = this.audioContext.createGain();
      this.silentGainNode.gain.value = 0;

      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.processorNode);
      this.processorNode.connect(this.silentGainNode);
      this.silentGainNode.connect(this.audioContext.destination);

      this.processorNode.onaudioprocess = this.handleAudioProcess.bind(this);

      this.isRunning = true;
      this.isSpeaking = false;
      this.recordedChunks = [];
      this.preRollBuffer = [];
      this.noiseFloor = 0.012;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.callbacks.onError?.(err);
      this.stop();
      throw err;
    }
  }

  /**
   * Handle real-time audio frame processing
   */
  private handleAudioProcess(event: AudioProcessingEvent): void {
    if (!this.isRunning) return;

    const inputData = event.inputBuffer.getChannelData(0);
    const frameLength = inputData.length;

    // 1. Calculate Root-Mean-Square (RMS) volume
    let sumSquares = 0;
    for (let i = 0; i < frameLength; i++) {
      sumSquares += inputData[i] * inputData[i];
    }
    const rms = Math.sqrt(sumSquares / frameLength);

    // 2. Compute normalized visualizer volume (0.0 to 1.0)
    const normalizedVolume = Math.min(1, Math.max(0, rms * 5.5));
    this.callbacks.onVolumeChange?.(normalizedVolume);

    // 3. Dynamic noise floor tracking when not actively speaking
    if (!this.isSpeaking) {
      this.noiseFloor = this.noiseFloor * 0.96 + rms * 0.04;
      if (this.noiseFloor < this.minNoiseFloor) this.noiseFloor = this.minNoiseFloor;
      if (this.noiseFloor > this.maxNoiseFloor) this.noiseFloor = this.maxNoiseFloor;
    }

    // 4. Calculate adaptive speech threshold
    const speechThreshold = Math.max(0.018, this.noiseFloor * this.speechThresholdMultiplier + 0.012);
    const hasVoice = rms > speechThreshold;
    const now = Date.now();

    // 5. State machine: Silence vs Speech
    if (hasVoice) {
      if (!this.isSpeaking) {
        // Speech onset
        this.isSpeaking = true;
        this.speechStartTime = now;
        this.lastVoiceDetectedTime = now;
        this.recordedChunks = [...this.preRollBuffer];
        this.callbacks.onSpeechStart?.();
      } else {
        this.lastVoiceDetectedTime = now;
      }
      this.recordedChunks.push(new Float32Array(inputData));
    } else {
      if (this.isSpeaking) {
        // Currently in speech, but current frame is quiet
        this.recordedChunks.push(new Float32Array(inputData));

        const silenceDuration = now - this.lastVoiceDetectedTime;
        const totalDuration = now - this.speechStartTime;

        // Check if silence exceeded threshold or max length reached
        if (silenceDuration >= this.silenceThresholdMs || totalDuration >= this.maxSpeechDurationMs) {
          this.finalizeSpeech(totalDuration);
        }
      } else {
        // Not speaking: maintain small pre-roll ring buffer
        this.preRollBuffer.push(new Float32Array(inputData));
        if (this.preRollBuffer.length > this.preRollMaxChunks) {
          this.preRollBuffer.shift();
        }
      }
    }
  }

  /**
   * Finalize the recorded utterance and emit onSpeechEnd with WAV Blob
   */
  private finalizeSpeech(totalDurationMs: number): void {
    this.isSpeaking = false;
    const chunks = this.recordedChunks;
    this.recordedChunks = [];
    this.preRollBuffer = [];

    if (totalDurationMs < this.minSpeechDurationMs || chunks.length === 0) {
      // Noise burst or click - ignore
      return;
    }

    try {
      const mergedSamples = this.mergeChunks(chunks);
      const actualSampleRate = this.audioContext?.sampleRate ?? this.targetSampleRate;
      const wavBlob = encodeWav(mergedSamples, actualSampleRate);
      this.callbacks.onSpeechEnd?.(wavBlob);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.callbacks.onError?.(err);
    }
  }

  /**
   * Merge Float32Array chunks into a single Float32Array
   */
  private mergeChunks(chunks: Float32Array[]): Float32Array {
    let totalLength = 0;
    for (let i = 0; i < chunks.length; i++) {
      totalLength += chunks[i].length;
    }

    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (let i = 0; i < chunks.length; i++) {
      merged.set(chunks[i], offset);
      offset += chunks[i].length;
    }
    return merged;
  }

  /**
   * Stop listening and pause audio processing.
   * If forceEmitSpeech is true, any recorded audio buffer is processed and emitted immediately.
   */
  public stop(forceEmitSpeech = false): void {
    this.isRunning = false;

    if ((this.isSpeaking || forceEmitSpeech) && this.recordedChunks.length > 0) {
      const duration = Date.now() - (this.speechStartTime || Date.now());
      this.finalizeSpeech(Math.max(duration, this.minSpeechDurationMs));
    }

    this.isSpeaking = false;
    this.recordedChunks = [];
    this.preRollBuffer = [];

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      this.mediaStream = null;
    }

    if (this.processorNode) {
      this.processorNode.onaudioprocess = null;
      try {
        this.processorNode.disconnect();
      } catch {
        // ignore
      }
      this.processorNode = null;
    }

    if (this.analyserNode) {
      try {
        this.analyserNode.disconnect();
      } catch {
        // ignore
      }
      this.analyserNode = null;
    }

    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
    }

    if (this.silentGainNode) {
      try {
        this.silentGainNode.disconnect();
      } catch {
        // ignore
      }
      this.silentGainNode = null;
    }

    this.callbacks.onVolumeChange?.(0);
  }

  /**
   * Completely dispose of all audio contexts and hardware streams
   */
  public dispose(): void {
    this.stop();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      void this.audioContext.close();
      this.audioContext = null;
    }
  }

  /**
   * Get current detector status
   */
  public getStatus(): { isRunning: boolean; isSpeaking: boolean; noiseFloor: number } {
    return {
      isRunning: this.isRunning,
      isSpeaking: this.isSpeaking,
      noiseFloor: this.noiseFloor,
    };
  }
}
