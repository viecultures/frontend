import type { Lesson } from '@/data/discoveryData';
import type { Flashcard } from '@/data/flashcardsData';
import { VOCAB_DATABASE, type VocabItem } from '@/data/readerData';
import { readerApiService, readerLevelFor, type ReaderArticleData } from '@/features/reader/services/readerApiService';
import { cacheArticle, getCachedArticle } from '@/services/learning/learningStorage';

export interface StudyDeck {
  article: ReaderArticleData;
  lesson: Lesson;
  cards: Flashcard[];
}

export function cardsFromVocabulary(vocabulary: VocabItem[]): Flashcard[] {
  const words = vocabulary.filter((word, index) => word.word.trim() && word.viMeaning.trim() && vocabulary.findIndex(other => other.id === word.id) === index);
  const meanings = [...new Set([...words, ...Object.values(VOCAB_DATABASE)].map(word => word.viMeaning))];
  return words.map((word, index) => {
    const options = meanings.filter(meaning => meaning !== word.viMeaning).slice(0, 3);
    const correctIndex = index % (options.length + 1);
    options.splice(correctIndex, 0, word.viMeaning);
    return { id: word.id, word: word.word, pos: word.pos, ipa: word.ipa, contextEn: word.contextSentence,
      viMeaning: word.viMeaning, viDefinition: word.enDefinition || word.viMeaning, options, correctIndex };
  });
}

export function studyDeckFromArticle(article: ReaderArticleData, level: string): StudyDeck {
  const safeLevel = readerLevelFor(article.level || level);
  const detail = { readTime: article.readTime || '', vocabCount: article.vocabularies.length };
  return { article, cards: cardsFromVocabulary(article.vocabularies), lesson: {
    id: article.id, title: article.titleEn, vietnameseTitle: article.titleVi,
    category: 'Heritage', categoryVi: article.topic, cefrLevel: safeLevel,
    availableLevels: [safeLevel], levelDetails: { 'Level 1': detail, 'Level 2': detail, 'Level 3': detail },
    ...detail, summary: article.summary || '', gradient: '', iconSymbol: 'BookOpen', imageUrl: article.imageUrl, dateAdded: '',
  } };
}

export async function loadStudyDeck(id: string, level: string): Promise<StudyDeck | null> {
  // A Reader snapshot carries the exact vocabulary and selected level into the next step.
  const cached = getCachedArticle(id, level);
  if (cached) return studyDeckFromArticle(cached, level);
  const post = await readerApiService.getPostById(id);
  const article = post ? readerApiService.mapPostToReaderData(post) : readerApiService.getLocalArticle(id, level);
  if (!article) return null;
  cacheArticle(article, readerLevelFor(article.level || level));
  return studyDeckFromArticle(article, level);
}
