import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { MapControlsProps } from './types';

export const MapControls: React.FC<MapControlsProps> = ({
  zoomScale,
  activeRegion,
  selectedProvinceId,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  className = '',
}) => {
  const canReset = zoomScale > 1 || activeRegion !== 'all' || selectedProvinceId !== null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`vc-map-controls absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1.5 border p-1.5 rounded-2xl ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomIn();
        }}
        className="vc-map-control p-2 rounded-xl transition-colors cursor-pointer"
        title="Zoom in (+)"
        aria-label="Zoom in on map"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomOut();
        }}
        className="vc-map-control p-2 rounded-xl transition-colors cursor-pointer"
        title="Zoom out (-)"
        aria-label="Zoom out on map"
      >
        <ZoomOut className="w-4 h-4" />
      </button>

      {canReset && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onResetZoom();
          }}
          className="vc-map-control vc-map-control--reset p-2 rounded-xl transition-colors cursor-pointer animate-in fade-in zoom-in duration-200"
          title="Reset map to all places"
          aria-label="Reset map"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default MapControls;
