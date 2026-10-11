export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface ParagraphPairDto {
  id?: string;
  orderIndex: number;
  enText: string;
  viText: string;
  audioTimestampStart?: number;
  audioTimestampEnd?: number;
}

export interface VocabItemDto {
  id?: string;
  word: string;
  ipa?: string;
  pos?: string;
  viMeaning: string;
  contextSentence?: string;
  audioUrl?: string;
  level?: CefrLevel;
  usageNote?: string;
}

export interface ReadingPostPayload {
  id?: string;
  topicGroup?: string;
  titleEn: string;
  titleVi: string;
  topic: string;
  region?: string;
  imageUrl?: string;
  wordCount?: number;
  summary?: string;
  contentEn?: string;
  contentVi?: string;
  shadowingAudioUrl?: string;
  level: CefrLevel;
  readTime?: string;
  featured?: boolean;
  paragraphs?: ParagraphPairDto[];
  vocabularies?: VocabItemDto[];
}

export interface ReadingPostItem extends ReadingPostPayload {
  id: string;
  totalReads?: number;
  likesCount?: number;
  createdAt?: string;
}

export interface AdminStats {
  totalPosts: number;
  totalReads: number;
  byLevel: Record<string, number>;
  byRegion: Record<string, number>;
}
