import { createContext, useEffect, useState } from 'react';
import type { VocabItem } from '@/data/readerData';
import { articleKey, readSavedVocabulary, saveVocabulary } from '@/features/learning/lib/learningStorage';

export interface SavedVocabularyState {
  words: VocabItem[];
  toggle: (word: VocabItem) => void;
  canSave: boolean;
}
export const SavedVocabularyContext = createContext<SavedVocabularyState | null>(null);

export function useSavedVocabulary(id: string, level: string): SavedVocabularyState {
  const key = articleKey(id, level);
  const [record, setRecord] = useState(() => ({ key, words: readSavedVocabulary(id, level) }));
  const [canSave, setCanSave] = useState(true);
  useEffect(() => { setRecord({ key, words: readSavedVocabulary(id, level) }); }, [key]);
  const words = record.key === key ? record.words : readSavedVocabulary(id, level);
  const toggle = (word: VocabItem) => {
    if (word.isProfane || !word.word.trim() || !word.viMeaning.trim() || word.pos.includes('Đang tra')) return;
    const saved = readSavedVocabulary(id, level);
    const exists = saved.some(item => item.id === word.id || item.word.toLowerCase() === word.word.toLowerCase());
    const next = exists ? saved.filter(item => item.id !== word.id && item.word.toLowerCase() !== word.word.toLowerCase()) : [...saved, word];
    const persisted = saveVocabulary(id, level, next);
    setCanSave(persisted);
    if (persisted) setRecord({ key, words: next });
  };
  return { words, toggle, canSave };
}
