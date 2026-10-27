import type React from 'react';
import type { ProvinceMapItem, IslandItem } from '@/data/vietnamMapData';
import type { LandmarkArticle } from '@/data/landmarksData';
import type { ProvinceCulturalSpecialty } from '@/utils/vietnamMapUtils';
import type { RegionKey } from '@/utils/useVietnamMap';

export type { RegionKey, ProvinceMapItem, IslandItem, LandmarkArticle, ProvinceCulturalSpecialty };
export type LandmarkPoiItem = LandmarkArticle;

export interface RegionTabItem {
  key: RegionKey;
  label: string;
  count: string;
  badgeClass?: string;
  activeClass?: string;
}

export interface VietnamMapProps {
  /** undefined is uncontrolled; null or a string is controlled. */
  selectedProvinceId?: string | null;
  defaultSelectedProvinceId?: string | null;
  selectedLandmarkId?: string | null;
  defaultSelectedLandmarkId?: string | null;
  defaultRegion?: RegionKey;
  /** Callback triggered when a province is clicked / selected */
  onSelectProvince?: (province: ProvinceMapItem | null) => void;
  /** Controlled active region ('all' | 'north' | 'central' | 'south') */
  activeRegion?: RegionKey;
  /** Explicit region-tab/reset event; automatic selection focus does not emit it. */
  onSelectRegion?: (region: RegionKey) => void;
  /** Complete landmark selection; replaces onSelectProvince for that click. */
  onSelectLandmark?: (landmark: LandmarkPoiItem, province: ProvinceMapItem) => void;
  /** Custom wrapper CSS class */
  className?: string;
  /** Show floating Zoom In / Zoom Out / Reset controls */
  showControls?: boolean;
  /** Show top region selection tabs bar (All / North / Central / South) */
  showRegionTabs?: boolean;
  /** Show interactive POI landmark pins with radar pulsation */
  showPoiPins?: boolean;
  /** Show sovereignty sea layer (Hoàng Sa & Trường Sa, Biển Đông) */
  showSeaLayer?: boolean;
  /** Show province text labels */
  showLabels?: boolean;
  /** Show one selectable silhouette per region in the national overview. */
  overviewByRegion?: boolean;
  /** Regions that can be opened from the national overview. Defaults to all. */
  selectableRegions?: readonly Exclude<RegionKey, 'all'>[];
  /** Render map place labels without Vietnamese diacritics for English interfaces. */
  labelLanguage?: 'vi' | 'en';
  /** Show floating cultural tooltip on hover (defaults to false) */
  showTooltip?: boolean;
  /** Optional projected AI markers. No runtime store is required. */
  markers?: readonly VietnamMapMarker[];
  onSelectMarker?: (marker: VietnamMapMarker) => void;
  customViewBox?: string;
  /** Optional custom children to overlay on the map */
  children?: React.ReactNode;
}

export interface VietnamMapMarker {
  position: { lat: number; lng: number; altitude?: number };
  label: string;
  showLabel: boolean;
  placeId?: string;
}

export interface MapAiMarkersLayerProps {
  markers: readonly VietnamMapMarker[];
  onSelectMarker?: (marker: VietnamMapMarker) => void;
}

export interface MapRegionTabsProps {
  activeRegion: RegionKey;
  onSelectRegion: (region: RegionKey) => void;
  tabs?: RegionTabItem[];
  className?: string;
}

export interface MapTooltipProps {
  province: ProvinceMapItem | null;
  specialty?: ProvinceCulturalSpecialty;
  className?: string;
}

export interface MapControlsProps {
  zoomScale: number;
  activeRegion: RegionKey;
  selectedProvinceId: string | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  className?: string;
}

export interface MapProvincesLayerProps {
  provinces: ProvinceMapItem[];
  selectedProvinceId: string | null;
  hoveredProvinceId: string | null;
  activeRegion: RegionKey;
  onSelectProvince: (province: ProvinceMapItem) => void;
  onHoverProvince: (provinceId: string | null) => void;
  overviewByRegion?: boolean;
  selectableRegions?: readonly Exclude<RegionKey, 'all'>[];
  onSelectRegion?: (region: Exclude<RegionKey, 'all'>) => void;
}

export interface MapSeaLayerProps {
  islands: IslandItem[];
  className?: string;
  labelLanguage?: 'vi' | 'en';
}

export interface MapLabelsLayerProps {
  provinces: ProvinceMapItem[];
  selectedProvinceId: string | null;
  hoveredProvinceId: string | null;
  activeRegion: RegionKey;
  zoomScale?: number;
  labelLanguage?: 'vi' | 'en';
}

export interface MapPoiLayerProps {
  landmarks: LandmarkPoiItem[];
  provinces: ProvinceMapItem[];
  selectedProvinceId: string | null;
  selectedLandmarkId?: string | null;
  hoveredProvinceId?: string | null;
  activeRegion: RegionKey;
  onSelectLandmarkProvince: (province: ProvinceMapItem) => void | boolean;
  onHoverLandmarkProvince?: (provinceId: string | null) => void;
  onSelectLandmark?: (landmark: LandmarkPoiItem, province: ProvinceMapItem) => void;
}
