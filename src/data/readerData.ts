// Vocabulary Item Schema
export interface VocabItem {
  id: string;
  word: string;
  pos: string;
  ipa: string;
  audioUrl?: string;
  viMeaning: string;
  enDefinition?: string;
  contextSentence: string;
  isProfane?: boolean;
}

import { ALL_SERIES_ARTICLES } from "./series/seriesRegistry";

export const VOCAB_DATABASE: Record<string, VocabItem> = Object.fromEntries(
  ALL_SERIES_ARTICLES.flatMap(article => article.vocabularies.map(item => [item.word.toLowerCase(), item])),
);

// Helper function to extract the full sentence containing the target word or phrase
export function extractSentenceContext(fullParagraphText: string, targetPhrase: string): string {
  if (!fullParagraphText || !targetPhrase) return targetPhrase;
  
  const normalizedFull = fullParagraphText.replace(/\s+/g, ' ').trim();
  const normalizedTarget = targetPhrase.replace(/\s+/g, ' ').trim();
  
  // Split by sentence terminators (. ! ?)
  const rawSentences = normalizedFull.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [normalizedFull];
  
  for (const s of rawSentences) {
    const trimmedSentence = s.trim();
    if (trimmedSentence.toLowerCase().includes(normalizedTarget.toLowerCase())) {
      return trimmedSentence;
    }
  }

  // Fallback for inflected verbs and phrases (e.g. "pass down" -> "passed down", "be seasoned" -> "seasoned")
  const stopwords = new Set(['be', 'to', 'a', 'an', 'the', 'of', 'in', 'on', 'with', 'and', 'or', 'for', 'at']);
  const keywords = normalizedTarget.toLowerCase().split(/\s+/).filter(w => !stopwords.has(w));
  if (keywords.length > 0) {
    for (const s of rawSentences) {
      const lower = s.toLowerCase();
      if (keywords.every(kw => lower.includes(kw.length > 4 ? kw.slice(0, 4) : kw))) {
        return s.trim();
      }
    }
  }

  // Fallback to punctuation indices
  const idx = normalizedFull.toLowerCase().indexOf(normalizedTarget.toLowerCase());
  if (idx !== -1) {
    let start = 0;
    for (let i = idx - 1; i >= 0; i--) {
      if (['.', '!', '?'].includes(normalizedFull[i])) {
        start = i + 1;
        break;
      }
    }
    let end = normalizedFull.length;
    for (let i = idx + normalizedTarget.length; i < normalizedFull.length; i++) {
      if (['.', '!', '?'].includes(normalizedFull[i])) {
        end = i + 1;
        break;
      }
    }
    return normalizedFull.substring(start, end).trim();
  }

  return rawSentences[0]?.trim() || targetPhrase;
}

// Helper function to look up any word or highlighted phrase
export function lookupWord(rawQuery: string, sentenceContext?: string): VocabItem {
  const clean = rawQuery.trim().toLowerCase();
  
  // 1. Direct key match
  if (VOCAB_DATABASE[clean]) {
    const item = VOCAB_DATABASE[clean];
    return sentenceContext ? { ...item, contextSentence: sentenceContext } : item;
  }

  // 2. Search by word string match
  for (const item of Object.values(VOCAB_DATABASE)) {
    if (item.word.toLowerCase() === clean || item.word.toLowerCase().includes(clean) || clean.includes(item.word.toLowerCase())) {
      return sentenceContext ? { ...item, contextSentence: sentenceContext } : item;
    }
  }

  // 3. Fallback dynamic dictionary entry
  const wordsCount = clean.split(/\s+/).length;
  const isPhrase = wordsCount > 1;
  return {
    id: clean.replace(/\s+/g, '-'),
    word: rawQuery.trim(),
    pos: isPhrase ? "phrase / idiom" : "word",
    ipa: `/${clean}/`,
    viMeaning: `Nghĩa trong ngữ cảnh: "${rawQuery.trim()}" trong văn bản văn hóa.`,
    enDefinition: `Contextual reading vocabulary: ${rawQuery.trim()}.`,
    contextSentence: sentenceContext || `Context: "${rawQuery.trim()}" in Vietnamese cultural text.`,
  };
}

export interface QuizOption {
  value: string;
  label: string;
}

export interface ReaderQuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctValue: string;
}

export const READER_QUIZ_QUESTIONS: ReaderQuizQuestion[] = [];

export interface RecommendedArticle {
  id: string;
  imageUrl: string;
  category: string;
  level: string;
  title: string;
  description: string;
  readTime: string;
  vocabCount: number;
  link: string;
}

export const RECOMMENDED_ARTICLES: RecommendedArticle[] = [
  { id: 'pho-hanoi-history', imageUrl: '/images/series/pho-hanoi.webp', category: 'Cuisine', level: 'Level 2', title: 'Phở Hà Nội', description: 'Khám phá câu chuyện về phở Hà Nội.', readTime: '3 min read', vocabCount: 10, link: '/reader' },
  { id: 'bun-cha-grilling-secrets', imageUrl: '/images/series/bun-cha.webp', category: 'Cuisine', level: 'Level 2', title: 'Bún Chả Hà Nội', description: 'Khám phá câu chuyện về bún chả Hà Nội.', readTime: '3 min read', vocabCount: 10, link: '/reader' },
  { id: 'cha-ca-legend-history', imageUrl: '/images/series/cha-ca-la-vong.webp', category: 'Cuisine', level: 'Level 2', title: 'Chả Cá Lã Vọng', description: 'Khám phá câu chuyện về chả cá Lã Vọng.', readTime: '3 min read', vocabCount: 10, link: '/reader' },
];
