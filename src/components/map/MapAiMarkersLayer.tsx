import { geoToSvg } from '@/utils/vietnamMapUtils';
import type { MapAiMarkersLayerProps } from './types';

/** SVG children share the map's projection, viewBox, zoom, and pan. */
export function MapAiMarkersLayer({ markers, onSelectMarker }: MapAiMarkersLayerProps) {
  return (
    <g id="layer-ai-markers">
      {markers.map((marker, index) => {
        const { lat, lng } = marker.position;
        if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
        const { x, y } = geoToSvg(lat, lng);
        const select = () => onSelectMarker?.(marker);
        return (
          <g
            key={`${marker.placeId ?? 'marker'}-${index}`}
            transform={`translate(${x}, ${y})`}
            role={onSelectMarker ? 'button' : undefined}
            tabIndex={onSelectMarker ? 0 : undefined}
            aria-label={marker.label}
            className={onSelectMarker ? 'cursor-pointer' : undefined}
            onClick={event => { event.stopPropagation(); select(); }}
            onKeyDown={event => {
              if (onSelectMarker && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                event.stopPropagation();
                select();
              }
            }}
          >
            <title>{marker.label}</title>
            <circle r="12" fill="transparent" />
            <circle r="6" fill="#F5D280" stroke="#122A22" strokeWidth="2" />
            {marker.showLabel && (
              <text y="-12" textAnchor="middle" fontSize="9" fontWeight="700" fill="#F5D280" stroke="#122A22" strokeWidth="3" paintOrder="stroke" pointerEvents="none">
                {marker.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
