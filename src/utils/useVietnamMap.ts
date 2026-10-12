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
  activeRegion?: RegionKey;
  onSelectProvince?: (province: ProvinceMapItem | null) => void;
  onSelectRegion?: (region: RegionKey) => void;
  minScale?: number;
  maxScale?: number;
}

export function useVietnamMap(options: UseVietnamMapOptions = {}) {
  const {
    defaultSelectedId = null,
    defaultRegion = 'all',
    activeRegion: controlledRegion,
    onSelectProvince,
    onSelectRegion,
    minScale = 1.0,
    maxScale = 2.5,
  } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedRef = useRef<boolean>(false);

  const [activeRegion, setActiveRegionState] = useState<RegionKey>(
    controlledRegion || defaultRegion
  );
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(defaultSelectedId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Zoom & Pan State
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch tracking refs
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchDistStartRef = useRef<number | null>(null);
  const touchScaleStartRef = useRef<number>(1);

  const currentViewBox =
    (VIETNAM_REGION_VIEWBOXES as Record<string, { viewBox: string }>)[activeRegion]?.viewBox ||
    '0 0 520 1100';

  // Calculate strict pan bounds based on actual rendered SVG dimensions inside container
  const calculatePanBounds = useCallback((scale: number) => {
    const container = containerRef.current;
    if (!container || scale <= 1) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 700;

    // Parse viewBox to determine actual rendered SVG aspect ratio
    const vbParts = currentViewBox.split(' ').map(Number);
    const vbWidth = vbParts[2] || 520;
    const vbHeight = vbParts[3] || 1100;
    const vbAspect = vbWidth / vbHeight;
    const containerAspect = width / height;

    // Calculate actual unscaled dimensions of the SVG (preserveAspectRatio xMidYMid meet)
    let renderedSvgW = width;
    let renderedSvgH = height;

    if (containerAspect > vbAspect) {
      // Container is wider than SVG: height fills container, width is letterboxed
      renderedSvgW = height * vbAspect;
    } else {
      // Container is taller than SVG: width fills container, height is letterboxed
      renderedSvgH = width / vbAspect;
    }

    const scaledW = renderedSvgW * scale;
    const scaledH = renderedSvgH * scale;

    // Strict boundary: Only allow panning if scaled dimension exceeds container viewport
    // Content edges will align with container edges at limits, completely preventing empty voids
    const maxDeltaX = Math.max(0, (scaledW - width) / 2);
    const maxDeltaY = Math.max(0, (scaledH - height) / 2);

    return {
      minX: -maxDeltaX,
      maxX: maxDeltaX,
      minY: -maxDeltaY,
      maxY: maxDeltaY,
    };
  }, [currentViewBox]);

  const clampPanPosition = useCallback(
    (x: number, y: number, scale: number) => {
      if (scale <= 1) return { x: 0, y: 0 };
      const bounds = calculatePanBounds(scale);
      return {
        x: Math.min(Math.max(x, bounds.minX), bounds.maxX),
        y: Math.min(Math.max(y, bounds.minY), bounds.maxY),
      };
    },
    [calculatePanBounds]
  );

  // Sync internal state when defaultSelectedId prop changes
  useEffect(() => {
    if (defaultSelectedId !== undefined) {
      setSelectedProvinceId(defaultSelectedId);
      if (defaultSelectedId) {
        const prov = getProvinceById(defaultSelectedId);
        if (prov?.region && prov.region !== activeRegion) {
          setActiveRegionState(prov.region);
          setZoomScale(1);
          setPanPosition({ x: 0, y: 0 });
        }
      }
    }
  }, [defaultSelectedId, activeRegion]);

  // Sync internal state when controlled activeRegion changes
  useEffect(() => {
    if (controlledRegion !== undefined && controlledRegion !== activeRegion) {
      setActiveRegionState(controlledRegion);
      setZoomScale(1);
      setPanPosition({ x: 0, y: 0 });
    }
  }, [controlledRegion, activeRegion]);

  const selectedProvince = getProvinceById(selectedProvinceId);
  const hoveredProvince = getProvinceById(hoveredId);

  const setActiveRegion = useCallback(
    (region: RegionKey) => {
      setActiveRegionState(region);
      setZoomScale(1);
      setPanPosition({ x: 0, y: 0 });
      onSelectRegion?.(region);
    },
    [onSelectRegion]
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

      // Update selected province
      setSelectedProvinceId(provId);
      onSelectProvince?.(provItem);

      // Only switch region if the selected province is in a different region
      if (provItem.region && provItem.region !== activeRegion) {
        setActiveRegionState(provItem.region);
        setZoomScale(1);
        setPanPosition({ x: 0, y: 0 });
        onSelectRegion?.(provItem.region);
      }
    },
    [activeRegion, onSelectProvince, onSelectRegion]
  );

  const zoomIn = useCallback(() => {
    setZoomScale((prev) => {
      const next = clampZoom(prev * 1.25, minScale, maxScale);
      setPanPosition((cur) => clampPanPosition(cur.x, cur.y, next));
      return next;
    });
  }, [minScale, maxScale, clampPanPosition]);

  const zoomOut = useCallback(() => {
    setZoomScale((prev) => {
      const next = clampZoom(prev / 1.25, minScale, maxScale);
      if (next <= 1) {
        setPanPosition({ x: 0, y: 0 });
        return 1;
      }
      setPanPosition((cur) => clampPanPosition(cur.x, cur.y, next));
      return next;
    });
  }, [minScale, maxScale, clampPanPosition]);

  const resetZoom = useCallback(() => {
    resetToAll(true);
  }, [resetToAll]);

  // Intercept scroll wheel with Zoom-to-cursor math and pan clamping
  useEffect(() => {
    const elem = containerRef.current;
    if (!elem) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - (rect.left + rect.width / 2);
      const mouseY = e.clientY - (rect.top + rect.height / 2);

      setZoomScale((prevScale) => {
        const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
        const nextScale = clampZoom(prevScale * zoomFactor, minScale, maxScale);

        if (nextScale === prevScale) return prevScale;

        if (nextScale <= 1) {
          setPanPosition({ x: 0, y: 0 });
          return 1;
        }

        // Calculate smooth zoom towards mouse cursor position
        setPanPosition((prevPan) => {
          const ratio = nextScale / prevScale;
          const targetX = prevPan.x * ratio + mouseX * (1 - ratio);
          const targetY = prevPan.y * ratio + mouseY * (1 - ratio);
          return clampPanPosition(targetX, targetY, nextScale);
        });

        return nextScale;
      });
    };

    elem.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      elem.removeEventListener('wheel', handleWheel);
    };
  }, [minScale, maxScale, clampPanPosition]);

  // Mouse pan handlers with clamping
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
        const rawX = e.clientX - dragStart.x;
        const rawY = e.clientY - dragStart.y;
        setPanPosition(clampPanPosition(rawX, rawY, zoomScale));
      }
    },
    [isDragging, zoomScale, dragStart, clampPanPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch pan & pinch-to-zoom handlers for mobile/tablet
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      hasDraggedRef.current = false;
      if (e.touches.length === 1) {
        const t = e.touches[0];
        touchStartRef.current = { x: t.clientX, y: t.clientY };
        mouseDownPosRef.current = { x: t.clientX, y: t.clientY };
        if (zoomScale > 1) {
          setIsDragging(true);
          setDragStart({ x: t.clientX - panPosition.x, y: t.clientY - panPosition.y });
        }
      } else if (e.touches.length === 2) {
        setIsDragging(false);
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        touchDistStartRef.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        touchScaleStartRef.current = zoomScale;
      }
    },
    [zoomScale, panPosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const dx = t.clientX - (touchStartRef.current?.x || t.clientX);
        const dy = t.clientY - (touchStartRef.current?.y || t.clientY);
        if (Math.hypot(dx, dy) > 5) {
          hasDraggedRef.current = true;
        }
        if (zoomScale > 1) {
          const rawX = t.clientX - dragStart.x;
          const rawY = t.clientY - dragStart.y;
          setPanPosition(clampPanPosition(rawX, rawY, zoomScale));
        }
      } else if (e.touches.length === 2 && touchDistStartRef.current) {
        hasDraggedRef.current = true;
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const newDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        const factor = newDist / touchDistStartRef.current;
        const newScale = clampZoom(touchScaleStartRef.current * factor, minScale, maxScale);

        setZoomScale(newScale);
        if (newScale <= 1) {
          setPanPosition({ x: 0, y: 0 });
        } else {
          setPanPosition((prev) => clampPanPosition(prev.x, prev.y, newScale));
        }
      }
    },
    [zoomScale, dragStart, clampPanPosition, minScale, maxScale]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    touchStartRef.current = null;
    touchDistStartRef.current = null;
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
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  };
}

export default useVietnamMap;
