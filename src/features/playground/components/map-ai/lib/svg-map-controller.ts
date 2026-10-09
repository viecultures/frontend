/**
 * SVGMapController – Replaces MapController for the Vietnam SVG map.
 *
 * Instead of issuing 3D camera commands (flyCameraTo, Marker3DInteractiveElement),
 * this controller updates the Zustand map store. The VietnamSVGMapPanel component
 * then reactively reflects those changes on the SVG.
 */

import { type MapMarker, type SVGCameraTarget, useMapStore } from './state';
import { VIETNAM_34_PROVINCES, type ProvinceMapItem } from '@/data/vietnamMapData';

// ─────────────────────────────────────────────
// Centroid lookup
// ─────────────────────────────────────────────
const SVG_VIEWBOX = { minX: 240, minY: 50, maxX: 730, maxY: 1150 };
const GEO_BOUNDS = { minLat: 8.3, maxLat: 23.4, minLng: 102.1, maxLng: 109.5 };

export function latLngToSvgCoords(lat: number, lng: number): { x: number; y: number } {
  const x =
    SVG_VIEWBOX.minX +
    ((lng - GEO_BOUNDS.minLng) / (GEO_BOUNDS.maxLng - GEO_BOUNDS.minLng)) *
      (SVG_VIEWBOX.maxX - SVG_VIEWBOX.minX);
  const y =
    SVG_VIEWBOX.minY +
    ((GEO_BOUNDS.maxLat - lat) / (GEO_BOUNDS.maxLat - GEO_BOUNDS.minLat)) *
      (SVG_VIEWBOX.maxY - SVG_VIEWBOX.minY);
  return { x, y };
}

export function svgCoordsToLatLng(x: number, y: number): { lat: number; lng: number } {
  const lng =
    GEO_BOUNDS.minLng +
    ((x - SVG_VIEWBOX.minX) / (SVG_VIEWBOX.maxX - SVG_VIEWBOX.minX)) *
      (GEO_BOUNDS.maxLng - GEO_BOUNDS.minLng);
  const lat =
    GEO_BOUNDS.maxLat -
    ((y - SVG_VIEWBOX.minY) / (SVG_VIEWBOX.maxY - SVG_VIEWBOX.minY)) *
      (GEO_BOUNDS.maxLat - GEO_BOUNDS.minLat);
  return { lat, lng };
}

export function findProvinceById(id: string): ProvinceMapItem | undefined {
  return VIETNAM_34_PROVINCES.find(p => p.id === id);
}

export function findProvinceByName(name: string): ProvinceMapItem | undefined {
  const norm = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  return VIETNAM_34_PROVINCES.find(p => {
    const pNorm = p.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
    return pNorm === norm || pNorm.includes(norm) || norm.includes(pNorm);
  });
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
    useMapStore.getState().setCameraTarget(target);
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
