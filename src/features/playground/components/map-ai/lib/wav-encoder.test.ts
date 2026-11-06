/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'node:assert/strict';
import { test } from 'node:test';
import { encodeWav } from './wav-encoder';

test('encodeWav outputs valid RIFF 44-byte header and 16-bit PCM byte length', async () => {
  const sampleRate = 16000;
  const numSamples = 160; // 10ms at 16kHz
  const samples = new Float32Array(numSamples);

  // Fill with a sine-like pattern
  for (let i = 0; i < numSamples; i++) {
    samples[i] = Math.sin((i / numSamples) * Math.PI * 2);
  }

  const blob = encodeWav(samples, sampleRate);
  assert.equal(blob.type, 'audio/wav');

  // Total byte size: 44 header bytes + 160 samples * 2 bytes = 364 bytes
  assert.equal(blob.size, 44 + numSamples * 2);

  const arrayBuffer = await blob.arrayBuffer();
  const view = new DataView(arrayBuffer);

  // Check 'RIFF'
  const riffStr = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3)
  );
  assert.equal(riffStr, 'RIFF');

  // Check ChunkSize (total size - 8)
  assert.equal(view.getUint32(4, true), 36 + numSamples * 2);

  // Check 'WAVE'
  const waveStr = String.fromCharCode(
    view.getUint8(8),
    view.getUint8(9),
    view.getUint8(10),
    view.getUint8(11)
  );
  assert.equal(waveStr, 'WAVE');

  // Check 'fmt '
  const fmtStr = String.fromCharCode(
    view.getUint8(12),
    view.getUint8(13),
    view.getUint8(14),
    view.getUint8(15)
  );
  assert.equal(fmtStr, 'fmt ');

  // Subchunk1Size = 16
  assert.equal(view.getUint32(16, true), 16);
  // AudioFormat = 1 (PCM)
  assert.equal(view.getUint16(20, true), 1);
  // NumChannels = 1 (Mono)
  assert.equal(view.getUint16(22, true), 1);
  // SampleRate
  assert.equal(view.getUint32(24, true), sampleRate);
  // ByteRate = sampleRate * 2
  assert.equal(view.getUint32(28, true), sampleRate * 2);
  // BlockAlign = 2
  assert.equal(view.getUint16(32, true), 2);
  // BitsPerSample = 16
  assert.equal(view.getUint16(34, true), 16);

  // Check 'data'
  const dataStr = String.fromCharCode(
    view.getUint8(36),
    view.getUint8(37),
    view.getUint8(38),
    view.getUint8(39)
  );
  assert.equal(dataStr, 'data');

  // Subchunk2Size = numSamples * 2
  assert.equal(view.getUint32(40, true), numSamples * 2);
});

test('encodeWav clamps out-of-range sample values without overflow', async () => {
  const sampleRate = 16000;
  const samples = new Float32Array([1.5, -2.0, 0.0]);
  const blob = encodeWav(samples, sampleRate);
  const arrayBuffer = await blob.arrayBuffer();
  const view = new DataView(arrayBuffer);

  // Offset 44: sample 0 (clamped to 1.0 -> 32767)
  const val0 = view.getInt16(44, true);
  assert.equal(val0, 32767);

  // Offset 46: sample 1 (clamped to -1.0 -> -32768)
  const val1 = view.getInt16(46, true);
  assert.equal(val1, -32768);

  // Offset 48: sample 2 (0.0 -> 0)
  const val2 = view.getInt16(48, true);
  assert.equal(val2, 0);
});
