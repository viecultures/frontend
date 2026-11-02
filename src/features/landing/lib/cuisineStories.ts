import { getPublishedSeries } from '@/data/series';
import { PATHS, paths } from '@/routes/paths';

export const cuisineStories = getPublishedSeries().filter(
  (series) => series.theme === 'cuisine' && series.chapters.length > 0,
);

export const featuredCuisineStory = cuisineStories.find((series) => series.id === 'pho') ?? cuisineStories[0];

export const firstCuisineChapterPath = featuredCuisineStory
  ? paths.reader({ story: featuredCuisineStory.chapters[0].id })
  : PATHS.discovery;
