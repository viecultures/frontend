import { create } from 'zustand';
import type { VocabItem } from '@/data/readerData';

export interface CompanionArticleContext {
  articleId?: string;
  articleTitle?: string;
  articleSummary?: string;
  level?: string;
  vocabulary?: VocabItem[];
  readerUrl?: string;
  onOpenVocabulary?: () => void;
}

interface CompanionArticleState {
  context: CompanionArticleContext | null;
  setArticleContext: (context: CompanionArticleContext) => void;
  clearArticleContext: () => void;
}

export const useCompanionArticleContext = create<CompanionArticleState>((set) => ({
  context: null,
  setArticleContext: (context: CompanionArticleContext) => set({ context }),
  clearArticleContext: () => set({ context: null }),
}));
