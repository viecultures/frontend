/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getApiBaseUrl } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';

export interface SttCorrectionDetail {
  original: string;
  replacement?: string;
  type: string;
  explanation?: string;
}

export interface TwoPassSttData {
  rawText: string;
  cleanedText: string;
  corrections?: SttCorrectionDetail[];
  confidence: number;
  totalLatencyMs: number;
  pass1LatencyMs: number;
  pass2LatencyMs: number;
}

export interface TwoPassSttResponse {
  success: boolean;
  data?: TwoPassSttData;
  message?: string;
  errorCode?: string;
}

export interface TranscribeOptions {
  language?: string; // 'vi' | 'en' | 'auto'
  promptContext?: string; // Cultural or map context for Gemini Pass 2
  signal?: AbortSignal;
  smartCleanup?: boolean; // When true: AI conversational mode; when false: raw pronunciation training mode
}

/**
 * Client service for Smart Two-Pass Speech-to-Text
 * Sends recorded audio WAV blob to backend:
 * - Pass 1: High-speed acoustic STT (raw transcription)
 * - Pass 2: Gemini contextual refinement (filler removal, punctuation & dialect alignment)
 */
export async function transcribeTwoPass(
  audioBlob: Blob,
  options: TranscribeOptions = {}
): Promise<TwoPassSttResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/v1/voice/transcribe-two-pass`;

  const formData = new FormData();
  formData.append('file', audioBlob, 'audio_speech.wav');
  formData.append('smartCleanup', String(options.smartCleanup ?? true));

  if (options.language) {
    formData.append('language', options.language);
  }
  if (options.promptContext) {
    formData.append('promptContext', options.promptContext);
  }

  const headers: Record<string, string> = {};
  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: formData,
      signal: options.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: { message?: string; errorCode?: string } = {};
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // text is not json
      }

      return {
        success: false,
        message: errorJson.message || `Server responded with status ${response.status}`,
        errorCode: errorJson.errorCode || `HTTP_${response.status}`,
      };
    }

    const json = (await response.json()) as TwoPassSttResponse;
    return json;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        message: 'Speech transcription was aborted.',
        errorCode: 'ABORTED',
      };
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: errorMessage || 'Network connection failed while uploading audio.',
      errorCode: 'NETWORK_ERROR',
    };
  }
}

/**
 * Transcribe audio with smart cleanup option
 * @param file Audio Blob (WAV format)
 * @param smartCleanup When true: filter out fillers & false starts; when false: keep 100% raw phonetics
 * @param options Additional transcribe options
 */
export async function transcribeAudio(
  file: Blob,
  smartCleanup: boolean = true,
  options: TranscribeOptions = {}
): Promise<TwoPassSttResponse> {
  return transcribeTwoPass(file, { ...options, smartCleanup });
}

export const twoPassSttService = {
  transcribeTwoPass,
  transcribeAudio,
};

export default twoPassSttService;
