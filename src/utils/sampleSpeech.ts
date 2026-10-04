/**
 * sampleSpeech.ts — High-fidelity Audio & Speech helper for VieCultures.
 * Prioritizes:
 *  1. Studio Neural Edge-TTS pre-rendered audio files (.mp3)
 *  2. Natural online speech audio streams
 *  3. Browser Web Speech API fallback with Microsoft Natural / Google Neural voices (never robotic desktop voices)
 */

let activeAudio: HTMLAudioElement | null = null;

// Helper to get currently active/preferred voice ID (defaults to 'puck' Google Gemini)
export function getActiveVoiceId(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("vie_preferred_voice") || "puck";
  }
  return "puck";
}

// Map sentence text to sentence file index
const SENTENCE_INDEX_MAP: Record<string, number> = {
  "Hello my love,": 1,
  "There's a kind of person who's so well-read, so frighteningly articulate, so mentally juicy that you want to both date them and punch them in the throat.": 2,
  "There’s a kind of person who’s so well-read, so frighteningly articulate, so mentally juicy that you want to both date them and punch them in the throat.": 2,
  "You know the type.": 3,
  "They quote Baldwin mid-conversation.": 4,
  "They listen to podcasts at 1.5x speed while annotating a book.": 5,
  "They drop phrases like epistemic frameworks and somehow make it work.": 6,
  "They drop phrases like “epistemic frameworks” and somehow make it work.": 6,
  "This is your guide to becoming that person. Not for clout. Not for Instagram aesthetics. But for the sheer, indecent pleasure of being disgustingly educated.": 7,
};

// Static pre-generated audio map
const PRE_RENDERED_AUDIO_MAP: Record<string, string> = {
  // Hero section sample story (Google Gemini Neural voice)
  "Vietnam is not merely a war or a map coordinate; it is a four-thousand-year-old river of resilience, poetry, and shared bowls of fragrant broth under morning mist.":
    "/audio/hero_sample_story.wav",
};

/**
 * Stop any current speech playback (both HTML5 Audio and Web Speech)
 */
export function stopSpeaking() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch (e) {
      // ignore
    }
    activeAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Select the highest quality natural neural voice from the browser,
 * prioritizing Ryan / British English Natural voices.
 */
function getBestBrowserVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Prioritize Ryan / British English Natural voices (matching default Ryan voice en-GB)
  const ryanVoice = voices.find(
    (v) =>
      v.name.includes("Ryan") ||
      (v.lang.startsWith("en-GB") &&
        (v.name.includes("Natural") ||
          v.name.includes("Online") ||
          v.name.includes("Neural") ||
          v.name.includes("George") ||
          v.name.includes("Oliver")))
  );
  if (ryanVoice) return ryanVoice;

  // 2. Prioritize Microsoft Online / Natural / Neural voices (Studio quality in Edge & Chrome)
  const naturalVoice = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Natural") ||
        v.name.includes("Online") ||
        v.name.includes("Neural"))
  );
  if (naturalVoice) return naturalVoice;

  // 3. Prioritize Google US / UK English (smooth cloud voice in Chrome)
  const googleVoice = voices.find(
    (v) => v.name.includes("Google") && v.lang.startsWith("en")
  );
  if (googleVoice) return googleVoice;

  // 4. Apple Samantha / Daniel / Siri voice on Safari / iOS / macOS
  const appleVoice = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Daniel") || v.name.includes("Samantha") || v.name.includes("Siri") || v.name.includes("Alex"))
  );
  if (appleVoice) return appleVoice;

  // 5. Any en voice that is NOT the old Windows desktop robot (David / Mark)
  const nonRoboticEn = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      !v.name.includes("David") &&
      !v.name.includes("Mark") &&
      !v.name.includes("Desktop")
  );
  if (nonRoboticEn) return nonRoboticEn;

  // 6. Fallback to any English voice
  return voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
}

// Pre-load voices on browser load
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

/**
 * Main Speak function: Plays studio Edge-TTS mp3 if available,
 * or natural audio stream, or high-fidelity browser Neural voice.
 */
export function speakEnglish(text: string, onEnd?: () => void) {
  stopSpeaking();

  const cleanText = text.trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  // 1. Check if we have pre-rendered studio Edge-TTS audio file
  const activeVoice = getActiveVoiceId();
  let mappedUrl = PRE_RENDERED_AUDIO_MAP[cleanText];

  if (!mappedUrl && SENTENCE_INDEX_MAP[cleanText]) {
    const idx = SENTENCE_INDEX_MAP[cleanText];
    mappedUrl = `/audio/${activeVoice}/sentence_${idx}.wav`;
  } else if (!mappedUrl && cleanText === "How to be disgustingly educated") {
    mappedUrl = `/audio/${activeVoice}/disgustingly_educated_full.wav`;
  }

  if (mappedUrl) {
    const audio = new Audio(mappedUrl);
    activeAudio = audio;
    audio.onended = () => {
      activeAudio = null;
      if (onEnd) onEnd();
    };
    audio.onerror = () => {
      // Try mp3 fallback if wav failed
      if (mappedUrl.endsWith(".wav")) {
        const mp3Audio = new Audio(mappedUrl.replace(".wav", ".mp3"));
        activeAudio = mp3Audio;
        mp3Audio.onended = () => {
          activeAudio = null;
          if (onEnd) onEnd();
        };
        mp3Audio.onerror = () => {
          activeAudio = null;
          fallbackBrowserSpeech(cleanText, onEnd);
        };
        mp3Audio.play().catch(() => {
          fallbackBrowserSpeech(cleanText, onEnd);
        });
        return;
      }
      activeAudio = null;
      fallbackBrowserSpeech(cleanText, onEnd);
    };
    audio.play().catch(() => {
      fallbackBrowserSpeech(cleanText, onEnd);
    });
    return;
  }

  // 2. For short phrases / words (under 180 chars), use online Natural TTS Audio
  if (cleanText.length <= 180) {
    const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(
      cleanText
    )}`;
    const audio = new Audio(streamUrl);
    activeAudio = audio;
    audio.onended = () => {
      activeAudio = null;
      if (onEnd) onEnd();
    };
    audio.onerror = () => {
      activeAudio = null;
      fallbackBrowserSpeech(cleanText, onEnd);
    };
    audio.play().catch(() => {
      fallbackBrowserSpeech(cleanText, onEnd);
    });
    return;
  }

  // 3. Fallback to browser Web Speech API with Natural voice
  fallbackBrowserSpeech(cleanText, onEnd);
}

function fallbackBrowserSpeech(cleanText: string, onEnd?: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const bestVoice = getBestBrowserVoice();
  if (bestVoice) {
    utterance.voice = bestVoice;
    utterance.lang = bestVoice.lang || "en-GB";
  } else {
    utterance.lang = "en-GB";
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
