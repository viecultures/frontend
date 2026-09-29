import type { RegionTabItem, RegionKey } from './types';

/**
 * Region Tabs Configuration with design tokens
 */
export const DEFAULT_REGION_TABS: RegionTabItem[] = [
  {
    key: 'all',
    label: 'Tất Cả',
    count: '34 Tỉnh',
    badgeClass: 'bg-white/10 text-antique-bright',
    activeClass: 'bg-antique-gold text-heritage-forest shadow-md scale-102 font-extrabold',
  },
  {
    key: 'north',
    label: 'Miền Bắc',
    count: '15 Tỉnh',
    badgeClass: 'bg-[#7A2E33]/40 text-lotus-pink',
    activeClass: 'bg-[#7A2E33] text-warm-ivory shadow-md scale-102 font-bold border border-lotus-pink/40',
  },
  {
    key: 'central',
    label: 'Miền Trung',
    count: '11 Tỉnh',
    badgeClass: 'bg-[#8F681B]/40 text-antique-bright',
    activeClass: 'bg-[#8F681B] text-warm-ivory shadow-md scale-102 font-bold border border-antique-gold/40',
  },
  {
    key: 'south',
    label: 'Miền Nam',
    count: '8 Tỉnh',
    badgeClass: 'bg-[#184D43]/40 text-sky-mist',
    activeClass: 'bg-[#184D43] text-warm-ivory shadow-md scale-102 font-bold border border-sky-mist/40',
  },
];

/**
 * Region color palette configuration (VieCultures System Design Tokens)
 */
export interface RegionPalette {
  fill: string;
  hover: string;
  selected: string;
  stroke: string;
}

export const REGION_PALETTES: Record<RegionKey | 'default', RegionPalette> = {
  all: {
    fill: '#1E4B43', // heritage-green
    hover: '#D9B76A', // antique-gold
    selected: '#F5D280', // antique-rich
    stroke: '#D9B76A', // antique-gold
  },
  north: {
    fill: '#7A2E33', // Deep Heritage Terracotta / Lotus-tint
    hover: '#9C3D44',
    selected: '#F5D280', // antique-rich
    stroke: '#E8B7B2', // lotus-pink
  },
  central: {
    fill: '#8F681B', // Deep Antique Gold / Ochre
    hover: '#B88726',
    selected: '#F5D280', // antique-rich
    stroke: '#FCE5B5', // antique-bright
  },
  south: {
    fill: '#184D43', // Deep Heritage Forest Teal
    hover: '#276F61',
    selected: '#F5D280', // antique-rich
    stroke: '#BFE3EA', // sky-mist
  },
  default: {
    fill: '#1E4B43',
    hover: '#D9B76A',
    selected: '#F5D280',
    stroke: '#D9B76A',
  },
};
