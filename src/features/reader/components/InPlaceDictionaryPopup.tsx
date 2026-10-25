import React from 'react';
import type { VocabItem } from '@/data/readerData';
import { WordTooltip } from './WordTooltip';

export interface InPlaceDictionaryPopupProps {
  isOpen: boolean;
  vocab: VocabItem | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  themeMode?: 'paper' | 'dark';
}

/**
 * InPlaceDictionaryPopup: Thin wrapper delegating to WordTooltip to provide
 * contextual 1-click vocabulary lookup and persistent saving across reader views.
 */
export const InPlaceDictionaryPopup: React.FC<InPlaceDictionaryPopupProps> = (props) => {
  return <WordTooltip {...props} />;
};

export default InPlaceDictionaryPopup;
