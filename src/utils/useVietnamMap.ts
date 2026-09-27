import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  getProvinceById,
  clampZoom,
  VIETNAM_REGION_VIEWBOXES,
  type ProvinceMapItem,
} from './vietnamMapUtils';

export type RegionKey = 'all' | 'north' | 'central' | 'south';

export interface UseVietnamMapOptions {
  defaultSelectedId?: string | null;
  defaultRegion?: RegionKey;
  onSelectProvince?: (province: ProvinceMapItem | null) => void;
  onSelectRegion?: (region: RegionKey) => void;
  minScale?: number;
  maxScale?: number;
}

export function useVietnamMap(options: UseVietnamMapOptions = {}) {
  const {
    defaultSelectedId = null,
    defaultRegion = 'all',
    onSelectProvince,
    onSelectRegion,
    minScale = 1.0,
    maxScale = 2.5,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedRef = useRef<boolean>(false);

  const [activeRegion, setActiveRegionState] = useState<RegionKey>(defaultRegion);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(defaultSelectedId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Zoom & Pan State
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Sync internal state when defaultSelectedId prop changes
  useEffect(() => {
    if (defaultSelectedId !== undefined) {
      setSelectedProvinceId(defaultSelectedId);
      if (defaultSelectedId) {
        const prov = getProvinceById(defaultSelectedId);
        if (prov?.region) {
          setActiveRegionState(prov.region);
          setZoomScale(1);
          setPanPosition({ x: 0, y: 0 });
        }
      }
    }
  }, [defaultSelectedId]);

  const selectedProvince = getProvinceById(selectedProvinceId);
  const hoveredProvince = getProvinceById(hoveredId);

  const currentViewBox =
    (VIETNAM_REGION_VIEWBOXES as Record<string, { viewBox: string }>)[activeRegion]?.viewBox ||
    '0 0 520 1100';

  const setActiveRegion = useCallback(
    (region: RegionKey) => {
      setActiveRegionState(region);
      setZoomScale(1);
      setPanPosition({ x: 0, y: 0 });
      onSelectRegion?.(region);
    },
    [onSelectRegion]
  );

  const selectProvince = useCallback(
    (province: ProvinceMapItem | string | null, force = false) => {
      // Ignore click if the user was dragging/panning the map
      if (!force && hasDraggedRef.current) return;

      let provItem: ProvinceMapItem | undefined;
      let provId: string | null = null;

      if (typeof province === 'string') {
        provItem = getProvinceById(province);
        provId = provItem ? provItem.id : null;
      } else if (province) {
        provItem = province;
        provId = province.id;
      }

      if (!provId || !provItem) {
        setSelectedProvinceId(null);
        onSelectProvince?.(null);
        return;
      }

      // 🗺️ Auto region switch & zoom when clicking any province
      setSelectedProvinceId(provId);
      onSelectProvince?.(provItem);

      if (provItem.region) {
        setActiveRegionState(provItem.region);
        setZoomScale(1);
        setPanPosition({ x: 0, y: 0 });
        onSelectRegion?.(provItem.region);
      }
    },
    [onSelectProvince, onSelectRegion]
  );

  const resetToAll = useCallback(
    (force = false) => {
      // Ignore click if the user was dragging/panning the map
      if (!force && hasDraggedRef.current) return;

      setActiveRegionState('all');
      setSelectedProvinceId(null);
      setZoomScale(1);
      setPanPosition({ x: 0, y: 0 });
      onSelectProvince?.(null);
      onSelectRegion?.('all');
    },
    [onSelectProvince, onSelectRegion]
  );

  const zoomIn = useCallback(() => {
    setZoomScale((prev) => clampZoom(prev * 1.25, minScale, maxScale));
  }, [minScale, maxScale]);

  const zoomOut = useCallback(() => {
    setZoomScale((prev) => {
      const next = clampZoom(prev / 1.25, minScale, maxScale);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  }, [minScale, maxScale]);

  const resetZoom = useCallback(() => {
    resetToAll(true);
  }, [resetToAll]);

  // Intercept scroll wheel with non-passive listener to prevent outer page scroll
  useEffect(() => {
    const elem = containerRef.current;
    if (!elem) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.deltaY < 0) {
        setZoomScale((prev) => clampZoom(prev * 1.1, minScale, maxScale));
      } else {
        setZoomScale((prev) => {
          const next = clampZoom(prev / 1.1, minScale, maxScale);
          if (next === 1) setPanPosition({ x: 0, y: 0 });
          return next;
        });
      }
    };

    elem.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      elem.removeEventListener('wheel', handleWheel);
    };
  }, [minScale, maxScale]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
      hasDraggedRef.current = false;
      if (zoomScale > 1) {
        setIsDragging(true);
        setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
      }
    },
    [zoomScale, panPosition]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const dx = e.clientX - mouseDownPosRef.current.x;
      const dy = e.clientY - mouseDownPosRef.current.y;
      if (Math.hypot(dx, dy) > 5) {
        hasDraggedRef.current = true;
      }
      if (isDragging && zoomScale > 1) {
        setPanPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, zoomScale, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const transformStyle: React.CSSProperties = {
    transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomScale})`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 200ms ease-out',
  };

  return {
    containerRef,
    activeRegion,
    setActiveRegion,
    currentViewBox,
    selectedProvinceId,
    selectedProvince,
    hoveredId,
    hoveredProvince,
    setHoveredId,
    selectProvince,
    resetToAll,
    zoomScale,
    panPosition,
    isDragging,
    zoomIn,
    zoomOut,
    resetZoom,
    transformStyle,
    containerProps: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
}

export default useVietnamMap;
