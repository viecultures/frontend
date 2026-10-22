export interface GeminiVoice {
  id: "puck" | "charon" | "kore" | "aoede" | "fenrir";
  name: string;
  geminiVoice: string;
  gender: "Male" | "Female";
  accent: "US" | "UK";
  flag: string;
  toneDesc: string;
  description: string;
  fullAudioUrl: string;
  sentenceAudioUrl: string;
}

export const GEMINI_VOICES: GeminiVoice[] = [
  {
    id: "puck",
    name: "Puck",
    geminiVoice: "Puck",
    gender: "Male",
    accent: "US",
    flag: "🇺🇸",
    toneDesc: "Warm & composed (default)",
    description: "An American male voice with a natural tone and clear pacing for shadowing and listening practice.",
    fullAudioUrl: "/audio/puck/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/puck/sentence_1.wav",
  },
  {
    id: "charon",
    name: "Charon",
    geminiVoice: "Charon",
    gender: "Male",
    accent: "UK",
    flag: "🇬🇧",
    toneDesc: "Academic & calm",
    description: "A deep, calm male voice for literary narration and history lessons.",
    fullAudioUrl: "/audio/charon/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/charon/sentence_1.wav",
  },
  {
    id: "kore",
    name: "Kore",
    geminiVoice: "Kore",
    gender: "Female",
    accent: "US",
    flag: "🇺🇸",
    toneDesc: "Gentle & expressive",
    description: "A clear, natural American female voice with expressive delivery.",
    fullAudioUrl: "/audio/kore/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/kore/sentence_1.wav",
  },
  {
    id: "aoede",
    name: "Aoede",
    geminiVoice: "Aoede",
    gender: "Female",
    accent: "UK",
    flag: "🇬🇧",
    toneDesc: "Elegant & refined",
    description: "A British female voice with an elegant, expressive storytelling style.",
    fullAudioUrl: "/audio/aoede/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/aoede/sentence_1.wav",
  },
  {
    id: "fenrir",
    name: "Fenrir",
    geminiVoice: "Fenrir",
    gender: "Male",
    accent: "US",
    flag: "🇺🇸",
    toneDesc: "Clear & confident",
    description: "An American male voice with strong projection and clear, confident pronunciation.",
    fullAudioUrl: "/audio/fenrir/tet_renewal_full.wav",
    sentenceAudioUrl: "/audio/fenrir/sentence_1.wav",
  },
];
