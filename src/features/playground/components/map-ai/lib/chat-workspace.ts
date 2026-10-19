import { create } from 'zustand';

type ChatPanel = { type: 'map' } | { type: 'article'; articleId: string } | { type: 'reader' } | null;

interface ChatWorkspaceState {
  panel: ChatPanel;
  openMap: () => void;
  openArticle: (articleId: string) => void;
  openReaderReference: () => void;
  closePanel: () => void;
}

/** Presentation state belongs only to AI Map Chat; immersive keeps its own UI. */
export const useChatWorkspace = create<ChatWorkspaceState>(set => ({
  panel: null,
  openMap: () => set({ panel: { type: 'map' } }),
  openArticle: articleId => set({ panel: { type: 'article', articleId } }),
  openReaderReference: () => set({ panel: { type: 'reader' } }),
  closePanel: () => set({ panel: null }),
}));
