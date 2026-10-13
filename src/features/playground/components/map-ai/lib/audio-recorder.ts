/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createAudioContext, resumeAudioOutput } from './utils';
import AudioRecordingWorklet from './worklets/audio-processing';
import VolMeterWorket from './worklets/vol-meter';

import { createWorketFromSrc } from './audioworklet-registry';
import EventEmitter from 'eventemitter3';
import { debugLog } from './debug-logger';

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export class AudioRecorder {
  private emitter = new EventEmitter();

  public on = this.emitter.on.bind(this.emitter);
  public off = this.emitter.off.bind(this.emitter);

  stream: MediaStream | undefined;
  audioContext: AudioContext | undefined;
  source: MediaStreamAudioSourceNode | undefined;
  recording: boolean = false;
  recordingWorklet: AudioWorkletNode | undefined;
  vuWorklet: AudioWorkletNode | undefined;

  private starting: Promise<void> | null = null;
  private generation = 0;

  constructor(public sampleRate = 16000) {}

  async start(): Promise<void> {
    // If already active, don't re-initialize
    if (this.recording) {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      return;
    }

    // If currently starting, wait for it to complete
    if (this.starting) {
      return this.starting;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Could not request user media');
    }

    const generation = this.generation;
    const current = () => generation === this.generation;
    this.starting = new Promise(async (resolve, reject) => {
      try {
        if (this.stream) {
          this.stream.getTracks().forEach(t => t.stop());
          this.stream = undefined;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        if (!current()) { stream.getTracks().forEach(track => track.stop()); resolve(); return; }
        this.stream = stream;
        this.audioContext = createAudioContext({ sampleRate: this.sampleRate });
        await resumeAudioOutput(this.audioContext);
        if (!current()) { resolve(); return; }

        this.source = this.audioContext.createMediaStreamSource(this.stream);

        const workletName = 'audio-recorder-worklet';
        const src = createWorketFromSrc(workletName, AudioRecordingWorklet);

        try {
          await this.audioContext.audioWorklet.addModule(src);
        } catch (e) {
          // Module already added on this AudioContext instance, ignore
        } finally {
          URL.revokeObjectURL(src);
        }
        if (!current()) { resolve(); return; }

        this.recordingWorklet = new AudioWorkletNode(
          this.audioContext,
          workletName
        );

        this.recordingWorklet.port.postMessage({
          type: 'config',
          sampleRate: this.audioContext.sampleRate,
          targetSampleRate: this.sampleRate,
        });

        this.recordingWorklet.port.onmessage = async (ev: MessageEvent) => {
          const arrayBuffer = ev.data?.data?.int16arrayBuffer;
          if (arrayBuffer) {
            const arrayBufferString = arrayBufferToBase64(arrayBuffer);
            this.emitter.emit('data', arrayBufferString);
          }
        };
        this.source.connect(this.recordingWorklet);

        // VU meter worklet
        const vuWorkletName = 'vu-meter';
        const vuSrc = createWorketFromSrc(vuWorkletName, VolMeterWorket);
        try {
          await this.audioContext.audioWorklet.addModule(vuSrc);
        } catch (e) {
          // Module already added, ignore
        } finally {
          URL.revokeObjectURL(vuSrc);
        }
        if (!current()) { resolve(); return; }

        this.vuWorklet = new AudioWorkletNode(this.audioContext, vuWorkletName);
        this.vuWorklet.port.onmessage = (ev: MessageEvent) => {
          this.emitter.emit('volume', ev.data.volume);
        };

        this.source.connect(this.vuWorklet);
        this.recording = true;
        const resampleRatio = (this.audioContext.sampleRate / this.sampleRate).toFixed(2);
        debugLog.audio('Khởi tạo Micro & AudioWorklet thành công', {
          hardwareSampleRate: this.audioContext.sampleRate,
          targetSampleRate: this.sampleRate,
          resampleRatio: `${resampleRatio}x`,
        });
        resolve();
      } catch (error) {
        if (!current()) { resolve(); return; }
        this.stop();
        this.recording = false;
        debugLog.error('AudioRecorder.start', error);
        this.emitter.emit('error', error);
        reject(error);
      } finally {
        this.starting = null;
      }
    });

    return this.starting;
  }

  stop() {
    this.generation++;
    this.recording = false;
    debugLog.audio('Dừng ghi âm Micro');
    const handleStop = () => {
      try {
        this.source?.disconnect();
      } catch (e) {}
      try {
        this.recordingWorklet?.disconnect();
      } catch (e) {}
      try {
        this.vuWorklet?.disconnect();
      } catch (e) {}

      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = undefined;
      }
      this.source = undefined;
      this.recordingWorklet = undefined;
      this.vuWorklet = undefined;
      this.recording = false;
      void this.audioContext?.close().catch(() => {});
      this.audioContext = undefined;
    };

    handleStop();
  }
}
