import type { RegionTabItem, RegionKey } from './types';

/**
 * Region Tabs Configuration with design tokens
 */
export const DEFAULT_REGION_TABS: RegionTabItem[] = [
  {
    key: 'all',
    label: 'All',
    count: '34 places',
  },
  {
    key: 'north',
    label: 'North',
    count: '15 places',
  },
  {
    key: 'central',
    label: 'Central',
    count: '11 places',
  },
  {
    key: 'south',
    label: 'South',
    count: '8 places',
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
    fill: 'var(--color-map-north)',
    hover: 'var(--color-antique-gold)',
    selected: 'var(--color-antique-rich)',
    stroke: 'var(--color-warm-ivory)',
  },
  north: {
    fill: 'var(--color-map-north)',
    hover: 'color-mix(in srgb, var(--color-map-north) 82%, var(--color-warm-ivory))',
    selected: 'var(--color-antique-rich)',
    stroke: 'var(--color-warm-ivory)',
  },
  central: {
    fill: 'var(--color-map-central)',
    hover: 'color-mix(in srgb, var(--color-map-central) 82%, var(--color-warm-ivory))',
    selected: 'var(--color-antique-rich)',
    stroke: 'var(--color-warm-ivory)',
  },
  south: {
    fill: 'var(--color-map-south)',
    hover: 'color-mix(in srgb, var(--color-map-south) 82%, var(--color-warm-ivory))',
    selected: 'var(--color-antique-rich)',
    stroke: 'var(--color-warm-ivory)',
  },
  default: {
    fill: 'var(--color-map-north)',
    hover: 'var(--color-antique-gold)',
    selected: 'var(--color-antique-rich)',
    stroke: 'var(--color-warm-ivory)',
  },
};
