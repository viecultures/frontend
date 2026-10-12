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
  // which at 16khz is about 8 times a second
  buffer = new Int16Array(2048);

  // current write index
  bufferWriteIndex = 0;

  constructor() {
    super();
    this.hasAudio = false;
  }

  /**
   * @param inputs Float32Array[][] [input#][channel#][sample#] so to access first inputs 1st channel inputs[0][0]
   * @param outputs Float32Array[][]
   */
  process(inputs) {
    if (inputs && inputs[0] && inputs[0].length > 0) {
      const channel0 = inputs[0][0];
      if (channel0 && channel0.length > 0) {
        this.processChunk(channel0);
      }
    }
    return true;
  }

  sendAndClearBuffer(){
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
    const l = float32Array.length;
    
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      const int16Value = s < 0 ? Math.floor(s * 0x8000) : Math.min(0x7fff, Math.floor(s * 0x7fff));
      this.buffer[this.bufferWriteIndex++] = int16Value;
      if(this.bufferWriteIndex >= this.buffer.length) {
        this.sendAndClearBuffer();
      }
    }
  }
}
`;

export default AudioRecordingWorklet;
