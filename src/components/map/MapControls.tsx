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
      className={`absolute bottom-4 right-4 z-20 flex flex-col items-center gap-1.5 bg-heritage-forest/90 border border-antique-gold/40 p-1.5 rounded-2xl shadow-xl backdrop-blur-md ${className}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomIn();
        }}
        className="p-2 rounded-xl text-warm-ivory hover:bg-white/10 hover:text-antique-rich transition-colors cursor-pointer focus-ring-dark"
        title="Phóng to (+)"
        aria-label="Phóng to bản đồ"
      >
        <ZoomIn className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomOut();
        }}
        className="p-2 rounded-xl text-warm-ivory hover:bg-white/10 hover:text-antique-rich transition-colors cursor-pointer focus-ring-dark"
        title="Thu nhỏ (-)"
        aria-label="Thu nhỏ bản đồ"
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
          className="p-2 rounded-xl text-antique-rich hover:bg-white/10 transition-colors cursor-pointer focus-ring-dark animate-in fade-in zoom-in duration-200"
          title="Đặt lại toàn bộ bản đồ (Toàn Quốc)"
          aria-label="Đặt lại toàn bộ bản đồ"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default MapControls;
