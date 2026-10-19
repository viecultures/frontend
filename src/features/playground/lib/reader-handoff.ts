import { create } from 'zustand';
import type { VocabItem } from '@/data/readerData';

export interface ReaderWorkspaceContext {
  articleId: string;
  title: string;
  level: string;
  summary?: string;
  vocabulary: Pick<VocabItem, 'word' | 'viMeaning' | 'contextSentence'>[];
  readerUrl: string;
}
interface ReaderHandoffState {
  context: ReaderWorkspaceContext | null;
  draft: string;
  draftRevision: number;
  enterFromReader: (context: ReaderWorkspaceContext, draft: string) => void;
  restoreReference: (context: ReaderWorkspaceContext) => void;
  dismissReference: () => void;
  consumeDraft: (revision: number) => void;
}

function boundedReference(context: ReaderWorkspaceContext): ReaderWorkspaceContext {
  return { ...context, summary: context.summary?.slice(0, 3000),
    vocabulary: context.vocabulary.slice(0, 12).map(item => ({
      word: item.word.slice(0, 100), viMeaning: item.viMeaning.slice(0, 300), contextSentence: item.contextSentence?.slice(0, 500) || '',
    })),
  };
}

/** UI-only handoff. Conversation history and Live session state stay separate. */
export const useReaderHandoff = create<ReaderHandoffState>(set => ({
  context: null, draft: '', draftRevision: 0,
  enterFromReader: (context, draft) => set(state => ({
    context: boundedReference(context),
    draft: draft.slice(0, 2000), draftRevision: state.draftRevision + 1,
  })),
  restoreReference: context => set({ context: boundedReference(context) }),
  dismissReference: () => set({ context: null }),
  consumeDraft: revision => set(state => state.draftRevision === revision ? { draft: '' } : state),
}));
