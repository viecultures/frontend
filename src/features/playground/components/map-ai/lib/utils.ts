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

type GetAudioContextOptions = AudioContextOptions & {
  id?: string;
};

const map: Map<string, AudioContext> = new Map();

/** Create synchronously so output can be unlocked in the initiating user gesture. */
export function createAudioContext(options?: AudioContextOptions): AudioContext {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  return new AudioCtx(options);
}

/** Do not silently swallow autoplay failures or wait indefinitely for permission. */
export async function resumeAudioOutput(context: AudioContext, timeoutMs = 5000): Promise<void> {
  if (context.state === 'closed') throw new Error('Audio output đã đóng. Hãy thử kết nối lại.');
  if (context.state === 'running') return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      context.resume(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('Không thể mở âm thanh. Bấm Thử lại để cho phép phát âm thanh.')), timeoutMs);
      }),
    ]);
    // resume() changes state asynchronously; re-read instead of relying on narrowing.
    if ((context.state as AudioContextState) !== 'running') throw new Error('Âm thanh chưa sẵn sàng. Hãy thử lại.');
  } finally { clearTimeout(timer); }
}

export const audioContext = async (
  options?: GetAudioContextOptions
): Promise<AudioContext> => {
  if (options?.id && map.has(options.id)) {
    const existing = map.get(options.id);
    if (existing && existing.state !== 'closed') {
      if (existing.state === 'suspended') {
        await existing.resume().catch(() => {});
      }
      return existing;
    }
  }

  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx(options);
  if (ctx.state === 'suspended') {
    await ctx.resume().catch(() => {});
  }

  if (options?.id) {
    map.set(options.id, ctx);
  }
  return ctx;
};

export function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
