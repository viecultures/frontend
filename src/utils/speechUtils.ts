/**
 * speechUtils.ts — Web Speech API Helper with robust fallbacks, queue clearing & voice priority.
 */

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}

/**
 * Get preferred English voice (en-US -> en-GB -> any English -> default voice)
 */
export function getPreferredVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Try exact en-US
  const enUs = voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US');
  if (enUs) return enUs;

  // 2. Try exact en-GB
  const enGb = voices.find((v) => v.lang === 'en-GB' || v.lang === 'en_GB');
  if (enGb) return enGb;

  // 3. Try any English voice
  const anyEn = voices.find((v) => v.lang.startsWith('en'));
  if (anyEn) return anyEn;

  // 4. Default voice
  return voices[0] || null;
}

/**
 * Speak text with safe queue cancellation & callback status handlers
 */
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis API is not supported in this browser.');
    if (onError) onError('SpeechSynthesis API not supported');
    return;
  }

  try {
    // Clear any pending audio speech queue to prevent stuck playback
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92; // Natural speaking rate for language learners
    utterance.pitch = 1.0;

    const preferredVoice = getPreferredVoice();
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (onEnd) onEnd();
      if (onError) onError(e);
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('SpeechSynthesis exception caught:', err);
    if (onEnd) onEnd();
    if (onError) onError(err);
  }
}
