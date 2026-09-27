import {
  VIETNAM_34_PROVINCES,
  VIETNAM_ISLANDS,
  VIETNAM_MAP_DIMENSIONS,
  VIETNAM_REGION_VIEWBOXES,
  type ProvinceMapItem,
} from '@/data/vietnamMapData';

/**
 * Get province item by ID (e.g., 'ha-noi', 'ho-chi-minh', 'hue')
 */
export function getProvinceById(id: string | null | undefined): ProvinceMapItem | undefined {
  if (!id) return undefined;
  return VIETNAM_34_PROVINCES.find((p) => p.id === id);
}

/**
 * Search provinces by name or merge info (accent-insensitive)
 */
export function searchProvincesByName(query: string): ProvinceMapItem[] {
  if (!query.trim()) return VIETNAM_34_PROVINCES;
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return VIETNAM_34_PROVINCES.filter((p) => {
    const normName = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normMerge = p.mergeInfo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normName.includes(q) || normMerge.includes(q);
  });
}

/**
 * Clamp zoom scale within bounds
 */
export function clampZoom(scale: number, min = 1.0, max = 2.5): number {
  return Math.min(max, Math.max(min, scale));
}

export { VIETNAM_34_PROVINCES, VIETNAM_ISLANDS, VIETNAM_MAP_DIMENSIONS, VIETNAM_REGION_VIEWBOXES, type ProvinceMapItem };
