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
    badgeClass: 'bg-rose-950/40 text-rose-200',
    activeClass: 'bg-rose-700 text-warm-ivory shadow-rose-900/40 shadow-md scale-102',
  },
  {
    key: 'central',
    label: 'Miền Trung',
    count: '11 Tỉnh',
    badgeClass: 'bg-amber-950/40 text-amber-200',
    activeClass: 'bg-amber-600 text-warm-ivory shadow-amber-900/40 shadow-md scale-102',
  },
  {
    key: 'south',
    label: 'Miền Nam',
    count: '8 Tỉnh',
    badgeClass: 'bg-emerald-950/40 text-emerald-200',
    activeClass: 'bg-emerald-700 text-warm-ivory shadow-emerald-900/40 shadow-md scale-102',
  },
];

/**
 * Region color palette configuration (Heritage Dark & Gold palette)
 */
export interface RegionPalette {
  fill: string;
  hover: string;
  selected: string;
  stroke: string;
}

export const REGION_PALETTES: Record<RegionKey | 'default', RegionPalette> = {
  all: {
    fill: '#1E4B43',
    hover: '#D9B76A',
    selected: '#F5D280',
    stroke: '#FCE5B5',
  },
  north: {
    fill: '#881337', // Deep Ruby / Rose Burgundy
    hover: '#BE123C',
    selected: '#E11D48',
    stroke: '#FECDD3',
  },
  central: {
    fill: '#92400E', // Bronze Amber / Ochre Gold
    hover: '#B45309',
    selected: '#D97706',
    stroke: '#FDE68A',
  },
  south: {
    fill: '#065F46', // Deep Forest Emerald
    hover: '#047857',
    selected: '#059669',
    stroke: '#A7F3D0',
  },
  default: {
    fill: '#1E4B43',
    hover: '#D9B76A',
    selected: '#F5D280',
    stroke: '#FCE5B5',
  },
};
