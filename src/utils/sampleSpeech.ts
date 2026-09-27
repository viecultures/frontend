/**
 * Browser-native Web Speech API helper for English pronunciation
 */

export function speakEnglish(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = text.trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  utterance.rate = 0.95; // Slightly measured, clear educational pace
  utterance.pitch = 1.0;

  // Try to find a high quality English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (v) => (v.lang.startsWith('en-') || v.lang === 'en') && !v.name.includes('Google')
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}
