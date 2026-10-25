export type CompanionLanguage = 'vi' | 'en' | 'bilingual';

export interface CompanionChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  translatedContent?: string;
  sourceLanguage?: 'vi' | 'en';
  timestamp?: number;
}

export interface ReferencedLesson {
  id: string;
  titleEn: string;
  titleVi: string;
  topic?: string;
  region?: string;
}

export interface CompanionChatRequest {
  lessonId?: string;
  message: string;
  history?: CompanionChatMessage[];
  language?: CompanionLanguage;
}

export interface CompanionChatResponse {
  reply: string;
  suggestedPrompts: string[];
  referencedLessons: ReferencedLesson[];
  remainingDailyTurns: number;
}

export interface CompanionTranslateRequest {
  text: string;
  sourceLang?: 'vi' | 'en';
  targetLang: 'vi' | 'en';
}

export interface CompanionTranslateResponse {
  translatedText: string;
}

export interface CompanionQuotaResponse {
  dailyLimit: number;
  remainingTurns: number;
  isPro: boolean;
}
