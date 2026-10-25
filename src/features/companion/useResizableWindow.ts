import { useCallback, useEffect, useRef, useState } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

export interface ResizableWindowOptions {
  storageKey: string;
  defaultSize: WindowSize;
  minSize: WindowSize;
  /** Max width as a fraction of viewport width. */
  maxWidthRatio: number;
  /** Max height as a fraction of viewport height. */
  maxHeightRatio: number;
  /** Pixels reserved below the window (anchor offset), subtracted from available height. */
  bottomOffset: number;
}

export interface ResizableWindowResult {
  size: WindowSize;
  isResizing: boolean;
  /** Attach to the top-left grip. Window is anchored bottom-right, so dragging up/left grows it. */
  onResizeHandlePointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  resetSize: () => void;
}

const TOP_MARGIN = 16;

const readStoredSize = (key: string): WindowSize | null => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<WindowSize>;
    if (typeof parsed.width === 'number' && typeof parsed.height === 'number') {
      return { width: parsed.width, height: parsed.height };
    }
    return null;
  } catch (err) {
    console.error('[useResizableWindow] Failed to read stored size:', err);
    return null;
  }
};

const writeStoredSize = (key: string, size: WindowSize): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(size));
  } catch (err) {
    console.error('[useResizableWindow] Failed to persist size:', err);
  }
};

export const useResizableWindow = (options: ResizableWindowOptions): ResizableWindowResult => {
  const { storageKey, defaultSize, minSize, maxWidthRatio, maxHeightRatio, bottomOffset } = options;

  const clamp = useCallback(
    (s: WindowSize): WindowSize => {
      const maxW = Math.max(minSize.width, window.innerWidth * maxWidthRatio);
      const maxH = Math.max(
        minSize.height,
        Math.min(window.innerHeight * maxHeightRatio, window.innerHeight - bottomOffset - TOP_MARGIN)
      );
      return {
        width: Math.round(Math.min(Math.max(s.width, minSize.width), maxW)),
        height: Math.round(Math.min(Math.max(s.height, minSize.height), maxH)),
      };
    },
    [minSize.width, minSize.height, maxWidthRatio, maxHeightRatio, bottomOffset]
  );

  const [size, setSize] = useState<WindowSize>(() => clamp(readStoredSize(storageKey) ?? defaultSize));
  const [isResizing, setIsResizing] = useState(false);
  const sizeRef = useRef(size);
  sizeRef.current = size;

  useEffect(() => {
    const handleViewportResize = () => setSize((prev) => clamp(prev));
    window.addEventListener('resize', handleViewportResize);
    return () => window.removeEventListener('resize', handleViewportResize);
  }, [clamp]);

  const onResizeHandlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const handle = e.currentTarget;
      const startX = e.clientX;
      const startY = e.clientY;
      const start = sizeRef.current;

      try {
        handle.setPointerCapture(e.pointerId);
      } catch (err) {
        console.error('[useResizableWindow] Pointer capture failed:', err);
      }
      setIsResizing(true);
      const prevUserSelect = document.body.style.userSelect;
      document.body.style.userSelect = 'none';

      const handleMove = (ev: PointerEvent) => {
        setSize(
          clamp({
            width: start.width + (startX - ev.clientX),
            height: start.height + (startY - ev.clientY),
          })
        );
      };

      const handleUp = () => {
        handle.removeEventListener('pointermove', handleMove);
        handle.removeEventListener('pointerup', handleUp);
        handle.removeEventListener('pointercancel', handleUp);
        document.body.style.userSelect = prevUserSelect;
        setIsResizing(false);
        writeStoredSize(storageKey, sizeRef.current);
      };

      handle.addEventListener('pointermove', handleMove);
      handle.addEventListener('pointerup', handleUp);
      handle.addEventListener('pointercancel', handleUp);
    },
    [clamp, storageKey]
  );

  const resetSize = useCallback(() => {
    const next = clamp(defaultSize);
    setSize(next);
    writeStoredSize(storageKey, next);
  }, [clamp, defaultSize, storageKey]);

  return { size, isResizing, onResizeHandlePointerDown, resetSize };
};
