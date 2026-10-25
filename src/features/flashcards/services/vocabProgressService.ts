import { API_BASE_URL } from '@/config/apiConfig';
import { readLearningValue, writeLearningValue } from '@/services/learning/learningStorage';

export interface VocabProgressPayload {
  userId?: string;
  vocabId: string;
  word: string;
  status: 'learning' | 'mastered';
  reviewCount: number;
  contextSentence?: string;
  lastReviewedAt?: string;
}

const STORAGE_KEY = 'vocab_progress_records';

/**
 * Persists vocabulary learning progress to backend API with graceful offline localStorage fallback.
 */
export async function persistVocabProgress(payload: VocabProgressPayload): Promise<boolean> {
  const normalized: VocabProgressPayload = {
    ...payload,
    lastReviewedAt: payload.lastReviewedAt || new Date().toISOString(),
  };

  // 1. Always persist to localStorage for instant offline access
  try {
    const existing = readLearningValue<Record<string, VocabProgressPayload>>(STORAGE_KEY) || {};
    existing[normalized.vocabId || normalized.word.toLowerCase()] = normalized;
    writeLearningValue(STORAGE_KEY, existing);
  } catch (e) {
    console.warn('[vocabProgressService] Could not persist to localStorage:', e);
  }

  // 2. Persist to Backend API if endpoint is reachable
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const url = `${API_BASE_URL || ''}/api/vocabularies/progress`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    // Graceful offline fallback: local storage succeeded
    return true;
  }
}

/**
 * Reads user vocabulary progress, merging backend records with local storage cache.
 */
export async function fetchVocabProgress(userId?: string): Promise<Record<string, VocabProgressPayload>> {
  const localRecords = readLearningValue<Record<string, VocabProgressPayload>>(STORAGE_KEY) || {};

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const url = `${API_BASE_URL || ''}/api/vocabularies/progress${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`;

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const remoteData: VocabProgressPayload[] = await res.json();
      if (Array.isArray(remoteData)) {
        const merged = { ...localRecords };
        for (const item of remoteData) {
          const key = item.vocabId || item.word.toLowerCase();
          merged[key] = { ...merged[key], ...item };
        }
        return merged;
      }
    }
  } catch {
    // Offline mode: use local records
  }

  return localRecords;
}
