/**
 * SVGMapController – Replaces MapController for the Vietnam SVG map.
 *
 * Instead of issuing 3D camera commands (flyCameraTo, Marker3DInteractiveElement),
 * this controller updates the Zustand map store. The VietnamSVGMapPanel component
 * then reactively reflects those changes on the SVG.
 */

import { type MapMarker, type SVGCameraTarget, useMapStore } from './map-state';
import { VIETNAM_34_PROVINCES, type ProvinceMapItem } from '@/data/vietnamMapData';
import { geoToSvg, svgToGeo } from '@/utils/vietnamMapUtils';

// ─────────────────────────────────────────────
// Centroid lookup
// ─────────────────────────────────────────────
export function latLngToSvgCoords(lat: number, lng: number): { x: number; y: number } {
  return geoToSvg(lat, lng);
}

export function svgCoordsToLatLng(x: number, y: number): { lat: number; lng: number } {
  return svgToGeo(x, y);
}

export function findProvinceById(id: string): ProvinceMapItem | undefined {
  return VIETNAM_34_PROVINCES.find(p => p.id === id);
}

const PROVINCE_ALIASES: Record<string, string> = {
  'saigon': 'ho-chi-minh',
  'sai gon': 'ho-chi-minh',
  'tphcm': 'ho-chi-minh',
  'tp hcm': 'ho-chi-minh',
  'tp.hcm': 'ho-chi-minh',
  'hcmc': 'ho-chi-minh',
  'hcm': 'ho-chi-minh',
  'sai-gon': 'ho-chi-minh',
  'ho chi minh city': 'ho-chi-minh',
  'thanh pho ho chi minh': 'ho-chi-minh',
  'ha noi': 'ha-noi',
  'hanoi': 'ha-noi',
  'thu do ha noi': 'ha-noi',
  'da nang': 'da-nang',
  'danang': 'da-nang',
  'hue': 'thua-thien-hue',
  'thua thien hue': 'thua-thien-hue',
  'can tho': 'can-tho',
  'cantho': 'can-tho',
  'hai phong': 'hai-phong',
  'haiphong': 'hai-phong',
  'vinh ha long': 'quang-ninh',
  'ha long': 'quang-ninh',
  'quan ho': 'bac-ninh',
  'bac ninh': 'bac-ninh',
  'nha trang': 'khanh-hoa',
  'da lat': 'lam-dong',
  'dalat': 'lam-dong',
};

export function findProvinceByName(name: string): ProvinceMapItem | undefined {
  const norm = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();

  if (!norm) return undefined;
  const byId = findProvinceById(norm);
  if (byId) return byId;

  const aliasId = PROVINCE_ALIASES[norm];
  if (aliasId) {
    const province = findProvinceById(aliasId);
    if (province) return province;
  }

  const matches = VIETNAM_34_PROVINCES.filter(p => {
    const pNorm = p.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .trim();
    return pNorm === norm || pNorm.includes(norm) || norm.includes(pNorm);
  });
  // Ambiguous partial names must not silently select the first province.
  return matches.length === 1 ? matches[0] : undefined;
}

// ─────────────────────────────────────────────
// Controller Class (singleton API compatible with AI tools)
// ─────────────────────────────────────────────

export class SVGMapController {
  private static instance: SVGMapController;

  private constructor() {}

  public static getInstance(): SVGMapController {
    if (!SVGMapController.instance) {
      SVGMapController.instance = new SVGMapController();
    }
    return SVGMapController.instance;
  }

  /**
   * Set or update markers on the map.
   * AI tools supply lat/lng markers; they will be projected to provinces.
   */
  public setMarkers(
    markers: Array<{
      position: { lat: number; lng: number; altitude?: number };
      label?: string;
      showLabel?: boolean;
      placeId?: string;
    }>
  ) {
    const formatted: MapMarker[] = markers.map(m => ({
      position: {
        lat: m.position.lat,
        lng: m.position.lng,
        altitude: m.position.altitude ?? 0,
      },
      label: m.label ?? '',
      showLabel: m.showLabel ?? true,
      placeId: m.placeId,
    }));
    useMapStore.getState().setMarkers(formatted);
  }

  /**
   * Add a single marker.
   */
  public addMarker(marker: {
    position: { lat: number; lng: number; altitude?: number };
    label?: string;
    showLabel?: boolean;
    placeId?: string;
  }) {
    const current = useMapStore.getState().markers;
    const formatted: MapMarker = {
      position: {
        lat: marker.position.lat,
        lng: marker.position.lng,
        altitude: marker.position.altitude ?? 0,
      },
      label: marker.label ?? '',
      showLabel: marker.showLabel ?? true,
      placeId: marker.placeId,
    };
    useMapStore.getState().setMarkers([...current, formatted]);
  }

  /**
   * Clear all markers.
   */
  public clearMarkers() {
    useMapStore.getState().clearMarkers();
  }

  /**
   * Focus / fly to a target (province, region, or lat/lng).
   */
  public flyTo(target: SVGCameraTarget) {
    const store = useMapStore.getState();
    if (target.provinceId) store.selectProvince(target.provinceId, { source: 'ai' });
    else if (target.region) store.focusRegion(target.region, 'ai');
    else store.setCameraTarget(target);
  }

  /**
   * Draw a route polyline between waypoints.
   */
  public setRoute(waypoints: Array<{ lat: number; lng: number }>) {
    useMapStore.getState().setRoutePolyline(waypoints);
  }

  /**
   * Clear the route polyline.
   */
  public clearRoute() {
    useMapStore.getState().setRoutePolyline(null);
  }
}

export const svgMapController = SVGMapController.getInstance();
