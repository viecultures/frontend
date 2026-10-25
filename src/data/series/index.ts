export * from './types';
export * from './seriesRegistry';
export * from './mock/phoSeries';
export * from './mock/bunChaSeries';
export * from './mock/chaCaSeries';
export * from './mock/caKhoVuDaiSeries';
export * from './mock/comChaySeries';
export * from './mock/banhCaySeries';
export * from './mock/hueCitadelSeries';
export * from './mock/saigonBanhMiSeries';

// ── Backward-compatibility adapters for JourneySeries and Discovery ───
import type { SeriesChapterMeta, SeriesMetadata } from './types';
import { PHO_SERIES_METADATA } from './mock/phoSeries';
import { BUN_CHA_SERIES_METADATA } from './mock/bunChaSeries';
import { CHA_CA_SERIES_METADATA } from './mock/chaCaSeries';
import { CA_KHO_VU_DAI_SERIES_METADATA } from './mock/caKhoVuDaiSeries';
import { COM_CHAY_SERIES_METADATA } from './mock/comChaySeries';
import { BANH_CAY_SERIES_METADATA } from './mock/banhCaySeries';
import { ALL_SERIES_METADATA } from './seriesRegistry';

export type JourneyChapter = {
  id: string;
  title: string;
  titleVi?: string;
  summary: string;
  summaryVi?: string;
  order: number;
  readTime: string;
};

export type JourneySeries = {
  id: string;
  title: string;
  titleVi?: string;
  theme: 'cuisine' | 'places';
  provinceId: string;
  region?: string;
  description: string;
  imageUrl: string;
  chapters: JourneyChapter[];
};

function toJourneySeries(metadata: SeriesMetadata): JourneySeries {
  return {
    id: metadata.id,
    title: metadata.title,
    titleVi: metadata.titleVi,
    theme: metadata.theme === 'cuisine' ? 'cuisine' : 'places',
    provinceId: metadata.provinceId,
    region: metadata.region,
    description: metadata.description,
    imageUrl: metadata.imageUrl,
    chapters: metadata.chapters.map((chap: SeriesChapterMeta) => ({
      id: chap.id,
      title: chap.titleEn,
      titleVi: chap.titleVi,
      summary: chap.summary,
      summaryVi: chap.summaryVi,
      order: chap.order,
      readTime: chap.readTime,
    })),
  };
}

export const PHO_JOURNEY: JourneySeries = toJourneySeries(PHO_SERIES_METADATA);
export const BUN_CHA_JOURNEY: JourneySeries = toJourneySeries(BUN_CHA_SERIES_METADATA);
export const CHA_CA_JOURNEY: JourneySeries = toJourneySeries(CHA_CA_SERIES_METADATA);
export const CA_KHO_VU_DAI_JOURNEY: JourneySeries = toJourneySeries(CA_KHO_VU_DAI_SERIES_METADATA);
export const COM_CHAY_JOURNEY: JourneySeries = toJourneySeries(COM_CHAY_SERIES_METADATA);
export const BANH_CAY_JOURNEY: JourneySeries = toJourneySeries(BANH_CAY_SERIES_METADATA);
export const JOURNEY_SERIES: JourneySeries[] = ALL_SERIES_METADATA.map(toJourneySeries);
