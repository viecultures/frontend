import { create } from 'zustand';

interface ImagePreviewState {
  previews: Record<string, string>;
  addPreview: (turnId: string, url: string) => void;
  clearPreviews: () => void;
}

const MAX_PREVIEWS = 10;

export const useImagePreviewStore = create<ImagePreviewState>((set, get) => ({
  previews: {},
  addPreview: (turnId, url) => set(state => {
    const previews = { ...state.previews };
    if (previews[turnId]) URL.revokeObjectURL(previews[turnId]);
    previews[turnId] = url;
    const ids = Object.keys(previews);
    if (ids.length > MAX_PREVIEWS) {
      const oldest = ids[0];
      URL.revokeObjectURL(previews[oldest]);
      delete previews[oldest];
    }
    return { previews };
  }),
  clearPreviews: () => {
    Object.values(get().previews).forEach(url => URL.revokeObjectURL(url));
    set({ previews: {} });
  },
}));
