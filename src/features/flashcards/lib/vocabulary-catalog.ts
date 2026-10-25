import type { Lesson } from '@/data/discoveryData';

export const VOCABULARY_PAGE_SIZE = 6;

export const VOCABULARY_CATEGORY_LABELS: Record<Lesson['category'], string> = {
  Heritage: 'History & heritage',
  Cuisine: 'Food & coffee',
  Crafts: 'Arts & crafts',
  Nature: 'Nature & landscapes',
  Folklore: 'Festivals & traditions',
};
