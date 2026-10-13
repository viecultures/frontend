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

const AudioRecordingWorklet = `
class AudioProcessingWorklet extends AudioWorkletProcessor {

  // send and clear buffer every 2048 samples, 
  // which at 16khz is about 8 times a second (128ms)
  buffer = new Int16Array(2048);
  bufferWriteIndex = 0;
  targetSampleRate = 16000;
  ratio = 1;
  fractionalOffset = 0;

  constructor() {
    super();
    // sampleRate is globally available in AudioWorkletGlobalScope representing AudioContext sample rate
    const currentRate = typeof sampleRate !== 'undefined' && sampleRate > 0 ? sampleRate : 16000;
    this.ratio = currentRate / this.targetSampleRate;

    this.port.onmessage = (event) => {
      if (event.data?.type === 'config') {
        const rate = event.data.sampleRate || currentRate;
        const target = event.data.targetSampleRate || 16000;
        this.targetSampleRate = target;
        this.ratio = rate / target;
      }
    };
  }

  process(inputs) {
    if (inputs && inputs[0] && inputs[0].length > 0) {
      const channel0 = inputs[0][0];
      if (channel0 && channel0.length > 0) {
        this.processChunk(channel0);
      }
    }
    return true;
  }

  sendAndClearBuffer() {
    if (this.bufferWriteIndex === 0) return;
    this.port.postMessage({
      event: "chunk",
      data: {
        int16arrayBuffer: this.buffer.slice(0, this.bufferWriteIndex).buffer,
      },
    });
    this.bufferWriteIndex = 0;
  }

  processChunk(float32Array) {
    const inputLen = float32Array.length;
    if (inputLen === 0) return;

    // Fast path: if input rate matches 16kHz
    if (Math.abs(this.ratio - 1.0) < 0.01) {
      for (let i = 0; i < inputLen; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        const int16Value = s < 0 ? Math.floor(s * 0x8000) : Math.min(0x7fff, Math.floor(s * 0x7fff));
        this.buffer[this.bufferWriteIndex++] = int16Value;
        if (this.bufferWriteIndex >= this.buffer.length) {
          this.sendAndClearBuffer();
        }
      }
      return;
    }

    // High quality linear interpolation resampling (e.g. 48kHz -> 16kHz, 44.1kHz -> 16kHz)
    let offset = this.fractionalOffset;
    while (offset < inputLen) {
      const idx = Math.floor(offset);
      const frac = offset - idx;
      const s0 = float32Array[idx];
      const s1 = idx + 1 < inputLen ? float32Array[idx + 1] : s0;
      const s = s0 + frac * (s1 - s0);

      const clamped = Math.max(-1, Math.min(1, s));
      const int16Value = clamped < 0 ? Math.floor(clamped * 0x8000) : Math.min(0x7fff, Math.floor(clamped * 0x7fff));

      this.buffer[this.bufferWriteIndex++] = int16Value;
      if (this.bufferWriteIndex >= this.buffer.length) {
        this.sendAndClearBuffer();
      }

      offset += this.ratio;
    }
    this.fractionalOffset = offset - inputLen;
  }
}
`;

export default AudioRecordingWorklet;
