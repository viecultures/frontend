import { readLearningValue, writeLearningValue } from './learningStorage';

export type FirstRegion = 'north' | 'central' | 'south';

const STORAGE_KEY = 'journey:first-region';

export function readFirstRegionChoice(): FirstRegion | null {
  const value = readLearningValue<string>(STORAGE_KEY);
  return value === 'north' || value === 'central' || value === 'south' ? value : null;
}

export function saveFirstRegionChoice(region: FirstRegion | null): void {
  writeLearningValue(STORAGE_KEY, region);
}
