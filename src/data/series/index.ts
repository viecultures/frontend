export * from './types';
export * from './seriesRegistry';

export type JourneyChapter = {
  id: string;
  title: string;
  titleVi?: string;
  summary: string;
  summaryVi?: string;
  order: number;
  readTime: string;
  preferredLevel?: 'Level 1' | 'Level 2' | 'Level 3';
};

export type JourneySeries = {
  id: string;
  title: string;
  titleVi?: string;
  theme: 'cuisine' | 'places';
  provinceId: string;
  region?: string;
  description: string;
  descriptionVi?: string;
  imageUrl: string;
  status?: string;
  scheduledPublishAt?: string;
  chapters: JourneyChapter[];
};
