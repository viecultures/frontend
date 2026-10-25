export interface CompanionChatMessage {
  role: 'user' | 'assistant';
  content: string;
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
}

export interface CompanionChatResponse {
  reply: string;
  suggestedPrompts: string[];
  referencedLessons: ReferencedLesson[];
  remainingDailyTurns: number;
}
