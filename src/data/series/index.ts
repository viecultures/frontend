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

export const HA_LONG_JOURNEY: JourneySeries = {
  id: 'ha-long-bay',
  title: 'Ha Long Bay: Jewel of the Gulf',
  titleVi: 'Vịnh Hạ Long: Di sản vịnh biển ngọc',
  theme: 'places',
  provinceId: 'quang-ninh',
  region: 'north',
  description: 'Explore emerald waters and thousands of limestone karsts sculpted over millions of years.',
  imageUrl: '/images/calendar/heritage-halong.webp',
  chapters: [
    {
      id: 'ha-long-bay-chap-1',
      title: 'Legend of the Descending Dragon',
      titleVi: 'Huyền thoại Rồng hạ thế bên vịnh ngọc',
      summary: 'Ancient myths of guardian dragons defending the sacred shoreline of Vietnam.',
      summaryVi: 'Truyền thuyết rồng mẹ và đàn rồng con hạ phàm tạo tác nên kỳ quan vịnh ngọc.',
      order: 1,
      readTime: '4 min read',
    },
    {
      id: 'ha-long-bay-chap-2',
      title: 'Inside the Grottoes: Sung Sot and Ti Top',
      titleVi: 'Kỳ vĩ hang Sửng Sốt và Đảo Ti Tốp',
      summary: 'Centuries of limestone formation and panoramic sunset vistas across the bay.',
      summaryVi: 'Thạch nhũ ngàn năm trong lòng núi đá và toàn cảnh vịnh ngọc từ đỉnh cao.',
      order: 2,
      readTime: '5 min read',
    },
  ],
};

export const LAO_CAI_JOURNEY: JourneySeries = {
  id: 'lao-cai-sa-pa',
  title: 'Sa Pa: Terraced Fields and Highland Mist',
  titleVi: 'Sa Pa: Ruộng bậc thang và sương mờ Tây Bắc',
  theme: 'places',
  provinceId: 'lao-cai',
  region: 'north',
  description: 'Discover emerald terraces sculpted by ethnic farmers and misty peaks of Fansipan.',
  imageUrl: '/images/calendar/heritage-mucangchai.webp',
  chapters: [
    {
      id: 'lao-cai-sa-pa-chap-1',
      title: 'Muong Hoa Valley at Dawn',
      titleVi: 'Sương sớm thung lũng Mường Hoa',
      summary: 'The living heritage of H’Mông and Dao communities carving hillsides into ribbons of green.',
      summaryVi: 'Dải lụa ruộng bậc thang và nét sinh hoạt mộc mạc của đồng bào H’Mông, Dao.',
      order: 1,
      readTime: '4 min read',
    },
    {
      id: 'lao-cai-sa-pa-chap-2',
      title: 'Reaching the Roof of Indochina',
      titleVi: 'Chinh phục Nóc nhà Đông Dương Fansipan',
      summary: 'Trekking through cloud oceans to reach the soaring summit of Mount Fansipan.',
      summaryVi: 'Hành trình chạm đỉnh Fansipan 3.143m giữa biển mây bồng bềnh đại ngàn Hoàng Liên Sơn.',
      order: 2,
      readTime: '5 min read',
    },
  ],
};

export const JOURNEY_SERIES: JourneySeries[] = [
  ...ALL_SERIES_METADATA.map(toJourneySeries),
  HA_LONG_JOURNEY,
  LAO_CAI_JOURNEY,
];
