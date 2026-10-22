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
        const maxLabelLength = 24;
        const displayLabel = marker.label && marker.label.length > maxLabelLength
          ? marker.label.slice(0, maxLabelLength).trim() + '…'
          : (marker.label || '');
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
            <circle r="5" fill="var(--color-antique-rich)" stroke="var(--color-heritage-forest)" strokeWidth="2" />
            {marker.showLabel && Boolean(displayLabel) && (
              <text y="-11" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--color-antique-rich)" stroke="var(--color-heritage-forest)" strokeWidth="2.5" paintOrder="stroke" pointerEvents="none">
                {displayLabel}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
