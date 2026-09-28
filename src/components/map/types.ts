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
  badgeClass: string;
  activeClass: string;
}

export interface VietnamMapProps {
  /** Currently selected province ID (e.g. 'ha-noi', 'hue', 'ho-chi-minh') */
  selectedProvinceId?: string | null;
  /** Callback triggered when a province is clicked / selected */
  onSelectProvince?: (province: ProvinceMapItem | null) => void;
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
  /** Optional custom children to overlay on the map */
  children?: React.ReactNode;
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
}

export interface MapSeaLayerProps {
  islands: IslandItem[];
  className?: string;
}

export interface MapLabelsLayerProps {
  provinces: ProvinceMapItem[];
  selectedProvinceId: string | null;
  hoveredProvinceId: string | null;
  activeRegion: RegionKey;
}

export interface MapPoiLayerProps {
  landmarks: LandmarkPoiItem[];
  provinces: ProvinceMapItem[];
  selectedProvinceId: string | null;
  activeRegion: RegionKey;
  onSelectLandmarkProvince: (province: ProvinceMapItem) => void;
}
