import { create } from 'zustand';
import { VIETNAM_34_PROVINCES, type ProvinceMapItem } from '@/data/vietnamMapData';
import { VIETNAM_LANDMARKS, type LandmarkArticle } from '@/data/landmarksData';
import { svgToGeo } from '@/utils/vietnamMapUtils';
import type { RegionKey } from '@/utils/useVietnamMap';

export type MapActionSource = 'user' | 'ai' | 'lesson' | 'system';

export interface SVGCameraTarget {
  provinceId?: string;
  region?: RegionKey;
  lat?: number;
  lng?: number;
}

export interface MapMarker {
  position: { lat: number; lng: number; altitude: number };
  label: string;
  showLabel: boolean;
  placeId?: string;
}

export interface MapSelectionOptions {
  source?: MapActionSource;
  /** Omit to clear markers left by an earlier selection. */
  markers?: MapMarker[];
}

type SelectionInput = MapActionSource | MapSelectionOptions;
const selectionOptions = (input: SelectionInput): MapSelectionOptions =>
  typeof input === 'string' ? { source: input } : input;

export interface MapState {
  markers: MapMarker[];
  cameraTarget: SVGCameraTarget | null;
  routePolyline: Array<{ lat: number; lng: number }> | null;
  highlightedPlaceId: string | null;
  selectedProvinceId: string | null;
  selectedLandmarkId: string | null;
  source: MapActionSource | null;
  selectProvince: (province: ProvinceMapItem | string | null, sourceOrOptions?: SelectionInput) => void;
  selectLandmark: (landmark: LandmarkArticle | string, sourceOrOptions?: SelectionInput) => void;
  selectRegion: (region: RegionKey, source?: MapActionSource) => void;
  clearSelection: (source?: MapActionSource) => void;
  focusRegion: (region: RegionKey, source?: MapActionSource) => void;
  resetMap: (source?: MapActionSource) => void;
  // Compatibility for consumers migrating from state.ts.
  setMarkers: (markers: MapMarker[]) => void;
  clearMarkers: () => void;
  setCameraTarget: (target: SVGCameraTarget | null) => void;
  setRoutePolyline: (polyline: Array<{ lat: number; lng: number }> | null) => void;
  setHighlightedPlaceId: (id: string | null) => void;
}

const clearedSelection = () => ({
  markers: [] as MapMarker[],
  routePolyline: null,
  highlightedPlaceId: null,
  selectedProvinceId: null,
  selectedLandmarkId: null,
});

export const useMapStore = create<MapState>((set, get) => ({
  ...clearedSelection(),
  cameraTarget: null,
  source: null,
  selectProvince: (input, sourceOrOptions = 'user') => {
    const options = selectionOptions(sourceOrOptions);
    if (input === null) {
      set({ ...clearedSelection(), cameraTarget: { region: get().cameraTarget?.region ?? 'all' }, source: options.source ?? 'user' });
      return;
    }
    const province = VIETNAM_34_PROVINCES.find(p => p.id === (typeof input === 'string' ? input : input.id));
    if (!province) return;
    const geo = svgToGeo(province.cx, province.cy);
    set({
      ...clearedSelection(),
      cameraTarget: { provinceId: province.id, region: province.region, ...geo },
      highlightedPlaceId: province.id,
      selectedProvinceId: province.id,
      markers: options.markers ?? [],
      source: options.source ?? 'user',
    });
  },
  selectLandmark: (input, sourceOrOptions = 'user') => {
    const options = selectionOptions(sourceOrOptions);
    const landmark = VIETNAM_LANDMARKS.find(l => l.id === (typeof input === 'string' ? input : input.id));
    const province = landmark && VIETNAM_34_PROVINCES.find(p => p.id === landmark.provinceId);
    if (!landmark || !province) return;
    const geo = landmark.coordinates ?? svgToGeo(province.cx, province.cy);
    set({
      ...clearedSelection(),
      cameraTarget: { provinceId: province.id, region: province.region, ...geo },
      highlightedPlaceId: province.id,
      selectedProvinceId: province.id,
      selectedLandmarkId: landmark.id,
      markers: options.markers ?? [],
      source: options.source ?? 'user',
    });
  },
  focusRegion: (region, source = 'user') => set({
    ...clearedSelection(), cameraTarget: { region }, source,
  }),
  selectRegion: (region, source = 'user') => get().focusRegion(region, source),
  clearSelection: (source = 'user') => get().selectProvince(null, source),
  resetMap: (source = 'user') => set({
    ...clearedSelection(), cameraTarget: { region: 'all' }, source,
  }),
  setMarkers: markers => set({ markers }),
  clearMarkers: () => set({ markers: [] }),
  setCameraTarget: target => {
    if (!target) { get().resetMap(); return; }
    if (target.provinceId) { get().selectProvince(target.provinceId); return; }
    if (target.region) { get().focusRegion(target.region); return; }
    set({ ...clearedSelection(), cameraTarget: target, source: 'system' });
  },
  setRoutePolyline: routePolyline => set({ routePolyline }),
  setHighlightedPlaceId: id => get().selectProvince(id),
}));
