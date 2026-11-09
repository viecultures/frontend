/**
 * vietnamMapData.ts — Official 34 Vietnam Provinces Vector Map Dataset (2025/2026)
 * Upgraded to WGS84 Web Mercator 940 × 960 projection.
 */

import { VIETNAM_34_PROVINCES as PROVINCES_34 } from '@/data/vietnam3RegionsGameData';

export interface ProvinceMapItem {
  id: string;
  name: string;
  slug: string;
  region: 'north' | 'central' | 'south';
  regionName: string;
  mergeInfo: string;
  cx: number;
  cy: number;
  d: string;
  communeCount?: number;
}

export interface IslandItem {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  points: { cx: number; cy: number; r: number }[];
}

export const VIETNAM_MAP_DIMENSIONS = {
  width: 940,
  height: 960,
  viewBox: '0 0 940 960'
};

export const VIETNAM_REGION_VIEWBOXES = {
  all: {
    minX: 0,
    minY: 0,
    width: 940,
    height: 960,
    viewBox: '0 0 940 960'
  },
  north: {
    minX: 85,
    minY: 25,
    width: 380,
    height: 280,
    viewBox: '85 25 380 280'
  },
  central: {
    minX: 120,
    minY: 175,
    width: 460,
    height: 620,
    viewBox: '120 175 460 620'
  },
  south: {
    minX: 140,
    minY: 625,
    width: 320,
    height: 320,
    viewBox: '140 625 320 320'
  }
};

export const VIETNAM_ISLANDS: IslandItem[] = [
  {
    id: 'hoang-sa',
    name: 'Quần đảo Hoàng Sa',
    code: 'QĐ. HOÀNG SA (VIỆT NAM)',
    x: 626,
    y: 436,
    points: [
      {
            "cx": 638.9,
            "cy": 424.5,
            "r": 4.5
      },
      {
            "cx": 659.2,
            "cy": 433.3,
            "r": 4.5
      },
      {
            "cx": 635.6,
            "cy": 416.6,
            "r": 4.5
      },
      {
            "cx": 638.1,
            "cy": 417.4,
            "r": 4.5
      },
      {
            "cx": 638.9,
            "cy": 418.3,
            "r": 4.5
      },
      {
            "cx": 638.9,
            "cy": 419.2,
            "r": 4.5
      },
      {
            "cx": 638.9,
            "cy": 420.1,
            "r": 4.5
      },
      {
            "cx": 632.2,
            "cy": 417.4,
            "r": 4.5
      },
      {
            "cx": 654.1,
            "cy": 420.1,
            "r": 3.5
      },
      {
            "cx": 665.1,
            "cy": 465.9,
            "r": 3.5
      },
      {
            "cx": 602.2,
            "cy": 440.4,
            "r": 4.5
      },
      {
            "cx": 600.9,
            "cy": 442.1,
            "r": 4.5
      },
      {
            "cx": 607.3,
            "cy": 444.8,
            "r": 4.5
      },
      {
            "cx": 608.9,
            "cy": 444.2,
            "r": 4.5
      },
      {
            "cx": 581.5,
            "cy": 479.9,
            "r": 4.5
      },
      {
            "cx": 610.9,
            "cy": 436.8,
            "r": 3.5
      },
      {
            "cx": 600.9,
            "cy": 443.9,
            "r": 3.5
      },
      {
            "cx": 606.0,
            "cy": 456.2,
            "r": 3.5
      },
      {
            "cx": 622.9,
            "cy": 450.9,
            "r": 3.5
      },
      {
            "cx": 606.8,
            "cy": 425.3,
            "r": 3.5
      },
      {
            "cx": 655.0,
            "cy": 438.6,
            "r": 3.5
      }
]
  },
  {
    id: 'truong-sa',
    name: 'Quần đảo Trường Sa',
    code: 'QĐ. TRƯỜNG SA (VIỆT NAM)',
    x: 704,
    y: 803,
    points: [
      {
            "cx": 740.2,
            "cy": 707.1,
            "r": 4.5
      },
      {
            "cx": 741.1,
            "cy": 706.0,
            "r": 4.5
      },
      {
            "cx": 738.5,
            "cy": 709.1,
            "r": 3.5
      },
      {
            "cx": 742.0,
            "cy": 705.1,
            "r": 3.5
      },
      {
            "cx": 737.8,
            "cy": 726.6,
            "r": 4.5
      },
      {
            "cx": 727.6,
            "cy": 733.5,
            "r": 3.5
      },
      {
            "cx": 744.5,
            "cy": 746.4,
            "r": 4.5
      },
      {
            "cx": 749.6,
            "cy": 743.0,
            "r": 4.5
      },
      {
            "cx": 741.9,
            "cy": 771.4,
            "r": 4.5
      },
      {
            "cx": 747.7,
            "cy": 761.4,
            "r": 4.5
      },
      {
            "cx": 715.8,
            "cy": 777.3,
            "r": 3.5
      },
      {
            "cx": 758.9,
            "cy": 762.7,
            "r": 3.5
      },
      {
            "cx": 734.4,
            "cy": 769.6,
            "r": 3.5
      },
      {
            "cx": 753.0,
            "cy": 760.2,
            "r": 3.5
      },
      {
            "cx": 739.7,
            "cy": 786.6,
            "r": 4.5
      },
      {
            "cx": 750.3,
            "cy": 785.9,
            "r": 4.5
      },
      {
            "cx": 735.2,
            "cy": 792.7,
            "r": 3.5
      },
      {
            "cx": 742.0,
            "cy": 791.9,
            "r": 3.5
      },
      {
            "cx": 737.8,
            "cy": 795.3,
            "r": 3.5
      },
      {
            "cx": 756.4,
            "cy": 781.6,
            "r": 3.5
      },
      {
            "cx": 617.9,
            "cy": 850.4,
            "r": 4.5
      },
      {
            "cx": 639.8,
            "cy": 835.7,
            "r": 4.5
      },
      {
            "cx": 632.2,
            "cy": 839.8,
            "r": 3.5
      },
      {
            "cx": 652.5,
            "cy": 841.5,
            "r": 3.5
      },
      {
            "cx": 605.2,
            "cy": 849.2,
            "r": 3.5
      },
      {
            "cx": 708.2,
            "cy": 833.8,
            "r": 4.5
      },
      {
            "cx": 666.8,
            "cy": 839.0,
            "r": 3.5
      },
      {
            "cx": 687.9,
            "cy": 875.2,
            "r": 3.5
      },
      {
            "cx": 734.1,
            "cy": 889.0,
            "r": 4.5
      },
      {
            "cx": 756.4,
            "cy": 839.8,
            "r": 3.5
      },
      {
            "cx": 732.7,
            "cy": 845.8,
            "r": 3.5
      },
      {
            "cx": 723.4,
            "cy": 840.7,
            "r": 3.5
      },
      {
            "cx": 743.7,
            "cy": 759.3,
            "r": 3.5
      },
      {
            "cx": 801.1,
            "cy": 785.0,
            "r": 3.5
      },
      {
            "cx": 818.0,
            "cy": 794.5,
            "r": 3.5
      },
      {
            "cx": 838.3,
            "cy": 839.0,
            "r": 3.5
      },
      {
            "cx": 562.9,
            "cy": 890.2,
            "r": 3.5
      },
      {
            "cx": 551.1,
            "cy": 896.2,
            "r": 3.5
      },
      {
            "cx": 546.9,
            "cy": 876.6,
            "r": 3.5
      },
      {
            "cx": 520.7,
            "cy": 893.6,
            "r": 3.5
      },
      {
            "cx": 505.5,
            "cy": 909.0,
            "r": 3.5
      }
]
  }
];

export const VIETNAM_34_PROVINCES: ProvinceMapItem[] = PROVINCES_34;
