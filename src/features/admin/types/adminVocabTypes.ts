export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface AdminVocabItem {
  id: string;
  word: string;
  pos: string;
  ipa: string;
  viMeaning: string;
  enDefinition: string;
  contextSentence?: string;
  audioUrl?: string;
  level: string;
  searchCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VocabFilterParams {
  search?: string;
  level?: string;
  page?: number;
  size?: number;
}

export interface VocabFormData {
  word: string;
  pos: string;
  ipa: string;
  viMeaning: string;
  enDefinition: string;
  contextSentence?: string;
  audioUrl?: string;
  level: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}
