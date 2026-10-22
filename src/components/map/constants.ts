import type { RegionTabItem, RegionKey } from './types';

/**
 * Region Tabs Configuration with design tokens
 */
export const DEFAULT_REGION_TABS: RegionTabItem[] = [
  {
    key: 'all',
    label: 'All',
    count: '34 places',
    badgeClass: 'bg-white/10 text-antique-bright',
    activeClass: 'bg-antique-gold text-heritage-forest shadow-md scale-102 font-extrabold',
  },
  {
    key: 'north',
    label: 'North',
    count: '15 places',
    badgeClass: 'bg-[#7A2E33]/40 text-lotus-pink',
    activeClass: 'bg-[#7A2E33] text-warm-ivory shadow-md scale-102 font-bold border border-lotus-pink/40',
  },
  {
    key: 'central',
    label: 'Central',
    count: '11 places',
    badgeClass: 'bg-[#8F681B]/40 text-antique-bright',
    activeClass: 'bg-[#8F681B] text-warm-ivory shadow-md scale-102 font-bold border border-antique-gold/40',
  },
  {
    key: 'south',
    label: 'South',
    count: '8 places',
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
    fill: 'var(--color-heritage-green)', // heritage-green
    hover: 'var(--color-antique-gold)', // antique-gold
    selected: 'var(--color-antique-rich)', // antique-rich
    stroke: 'var(--color-antique-gold)', // antique-gold
  },
  north: {
    fill: '#7A2E33', // Deep Heritage Terracotta / Lotus-tint
    hover: '#9C3D44',
    selected: 'var(--color-antique-rich)', // antique-rich
    stroke: 'var(--color-lotus-pink)', // lotus-pink
  },
  central: {
    fill: '#8F681B', // Deep Antique Gold / Ochre
    hover: '#B88726',
    selected: 'var(--color-antique-rich)', // antique-rich
    stroke: 'var(--color-antique-bright)', // antique-bright
  },
  south: {
    fill: '#184D43', // Deep Heritage Forest Teal
    hover: '#276F61',
    selected: 'var(--color-antique-rich)', // antique-rich
    stroke: 'var(--color-sky-mist)', // sky-mist
  },
  default: {
    fill: 'var(--color-heritage-green)',
    hover: 'var(--color-antique-gold)',
    selected: 'var(--color-antique-rich)',
    stroke: 'var(--color-antique-gold)',
  },
};
