export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Nữ' | 'Nam';
  tone: string;
  description: string;
  pitch: number;
  rate: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  focusedProvinceId?: string;
  suggestedItinerary?: string[];
  culturalTags?: string[];
}

export interface MapAiResponse {
  text: string;
  focusedProvinceId?: string;
  suggestedItinerary?: string[];
  culturalTags?: string[];
}

export interface ProvinceCultureData {
  id: string;
  name: string;
  slug: string;
  region: 'north' | 'central' | 'south';
  regionName: string;
  capital: string;
  area: string;
  population: string;
  heritageType?: string;
  unescoTitle?: string;
  landmarks: string[];
  specialties: string[];
  itinerary: string[];
  englishVocab: { word: string; ipa: string; meaning: string }[];
  summary: string;
  travelTips: string;
}

export interface MapAiSettingsState {
  selectedVoice: string;
  speechRate: number;
  speechPitch: number;
  selectedModel: string;
  customApiKey: string;
  selectedPersona: string;
  autoSyncMap: boolean;
}

import type { LessonAgentVocab, ProficiencyLevel } from '@/data/lessonAgentCatalog';

export type AiMapLessonStep = 'explore' | 'listen' | 'speak' | 'quiz' | 'complete';

export interface AiMapQuizQuestion {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface AiMapQuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
}

export interface AiMapArticleRecommendation {
  id: string;
  title: string;
  url: string;
}

export interface AiMapLessonPayload {
  lessonId: string;
  title: string;
  vietnameseTitle: string;
  provinceId: string;
  provinceName: string;
  level: ProficiencyLevel;
  durationMinutes: number;
  summaryEn: string;
  summaryVi: string;
  vocabulary: LessonAgentVocab[];
  listeningPrompts: string[];
  speakingPrompts: string[];
  comprehensionQuestions: AiMapQuizQuestion[];
  relatedArticleIds: string[];
}

export interface AiMapLessonState {
  lessonId: string;
  provinceId: string;
  level: ProficiencyLevel;
  currentStep: AiMapLessonStep;
  completedSteps: AiMapLessonStep[];
  startedAt: string;
  completedAt?: string;
  quizScore?: AiMapQuizResult;
  encounteredVocabulary: string[];
  rewardGranted: boolean;
}
