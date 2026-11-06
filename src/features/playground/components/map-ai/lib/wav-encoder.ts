/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Encodes single-channel (mono) Float32Array PCM samples into a 16-bit PCM WAV Blob
 * with a standard 44-byte RIFF header.
 *
 * @param samples - Float32Array with audio samples normalized in range [-1.0, 1.0]
 * @param sampleRate - Target sample rate in Hz (e.g., 16000, 44100, 48000)
 * @returns Blob formatted as 'audio/wav'
 */
export function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const bytesPerSample = 2; // 16-bit PCM = 2 bytes
  const channels = 1; // Mono
  const blockAlign = channels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataByteLength = samples.length * bytesPerSample;
  const totalLength = 44 + dataByteLength;

  const buffer = new ArrayBuffer(totalLength);
  const view = new DataView(buffer);

  const writeString = (offset: number, text: string): void => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  /* RIFF chunk descriptor */
  writeString(0, 'RIFF');
  // ChunkSize = 36 + SubChunk2Size = totalLength - 8
  view.setUint32(4, 36 + dataByteLength, true);
  writeString(8, 'WAVE');

  /* 'fmt ' sub-chunk */
  writeString(12, 'fmt ');
  // Subchunk1Size = 16 for PCM
  view.setUint32(16, 16, true);
  // AudioFormat = 1 (Linear PCM)
  view.setUint16(20, 1, true);
  // NumChannels = 1
  view.setUint16(22, channels, true);
  // SampleRate
  view.setUint32(24, sampleRate, true);
  // ByteRate = SampleRate * NumChannels * BitsPerSample/8
  view.setUint32(28, byteRate, true);
  // BlockAlign = NumChannels * BitsPerSample/8
  view.setUint16(32, blockAlign, true);
  // BitsPerSample = 16
  view.setUint16(34, 16, true);

  /* 'data' sub-chunk */
  writeString(36, 'data');
  // Subchunk2Size = NumSamples * NumChannels * BitsPerSample/8
  view.setUint32(40, dataByteLength, true);

  // Write 16-bit PCM audio samples with clamping to avoid overflow
  let writeOffset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(writeOffset, Math.round(intSample), true);
    writeOffset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}
