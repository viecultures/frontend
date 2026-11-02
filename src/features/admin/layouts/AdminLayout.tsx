import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminTopbar } from '../components/AdminTopbar';
import { AdminSidebar } from '../components/AdminSidebar';
import { X } from 'lucide-react';
import '../admin-ui.css';

const COLLAPSED_SIDEBAR_WIDTH = 68;
const MIN_EXPANDED_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 480;
const DEFAULT_SIDEBAR_WIDTH = 260;
const SIDEBAR_STORAGE_KEY = 'viecultures_admin_sidebar_width';
const SIDEBAR_LAST_EXPANDED_KEY = 'viecultures_admin_sidebar_last_expanded';

export interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Desktop sidebar resizable width state (persisted to localStorage)
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_SIDEBAR_WIDTH;
    try {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed === COLLAPSED_SIDEBAR_WIDTH) {
          return COLLAPSED_SIDEBAR_WIDTH;
        }
        if (!isNaN(parsed) && parsed >= MIN_EXPANDED_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
          return parsed;
        }
      }
    } catch {
      // Ignored
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });

  const isCollapsed = sidebarWidth <= 100;
  const [isDragging, setIsDragging] = useState(false);
  const asideRef = useRef<HTMLElement | null>(null);

  // Toggle collapse/expand sidebar
  const toggleCollapse = useCallback(() => {
    setSidebarWidth((prev) => {
      let nextWidth: number;
      if (prev <= 100) {
        const savedLast = localStorage.getItem(SIDEBAR_LAST_EXPANDED_KEY);
        const parsedLast = savedLast ? parseInt(savedLast, 10) : NaN;
        nextWidth = (!isNaN(parsedLast) && parsedLast >= MIN_EXPANDED_SIDEBAR_WIDTH && parsedLast <= MAX_SIDEBAR_WIDTH)
          ? parsedLast
          : DEFAULT_SIDEBAR_WIDTH;
      } else {
        try {
          localStorage.setItem(SIDEBAR_LAST_EXPANDED_KEY, String(prev));
        } catch {
          // Ignored
        }
        nextWidth = COLLAPSED_SIDEBAR_WIDTH;
      }
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextWidth));
      } catch {
        // Ignored
      }
      return nextWidth;
    });
  }, []);

  // Drag to resize handler using Pointer Events
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startWidth = asideRef.current ? asideRef.current.getBoundingClientRect().width : sidebarWidth;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const rawWidth = startWidth + deltaX;

      let nextWidth: number;
      // Snap to collapsed icon-only if pulled below threshold (134px)
      if (rawWidth < 134) {
        nextWidth = COLLAPSED_SIDEBAR_WIDTH;
      } else {
        nextWidth = Math.min(
          MAX_SIDEBAR_WIDTH,
          Math.max(MIN_EXPANDED_SIDEBAR_WIDTH, Math.round(rawWidth))
        );
      }
      setSidebarWidth(nextWidth);
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      const deltaX = upEvent.clientX - startX;
      const rawWidth = startWidth + deltaX;

      let finalWidth: number;
      if (rawWidth < 134) {
        finalWidth = COLLAPSED_SIDEBAR_WIDTH;
      } else {
        finalWidth = Math.min(
          MAX_SIDEBAR_WIDTH,
          Math.max(MIN_EXPANDED_SIDEBAR_WIDTH, Math.round(rawWidth))
        );
        try {
          localStorage.setItem(SIDEBAR_LAST_EXPANDED_KEY, String(finalWidth));
        } catch {
          // Ignored
        }
      }

      setSidebarWidth(finalWidth);
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(finalWidth));
      } catch {
        // Ignored
      }
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [sidebarWidth]);

  // Double-click on resizer to toggle collapse/expand
  const handleResetWidth = useCallback(() => {
    toggleCollapse();
  }, [toggleCollapse]);

  // Keyboard accessibility for resizer (ArrowLeft, ArrowRight, Home, End, Enter)
  const handleResizerKeyDown = useCallback((e: React.KeyboardEvent) => {
    let nextWidth: number | null = null;
    if (e.key === 'ArrowLeft') {
      if (sidebarWidth <= MIN_EXPANDED_SIDEBAR_WIDTH) {
        nextWidth = COLLAPSED_SIDEBAR_WIDTH;
      } else {
        nextWidth = Math.max(MIN_EXPANDED_SIDEBAR_WIDTH, sidebarWidth - 16);
      }
    } else if (e.key === 'ArrowRight') {
      if (sidebarWidth <= 100) {
        nextWidth = MIN_EXPANDED_SIDEBAR_WIDTH;
      } else {
        nextWidth = Math.min(MAX_SIDEBAR_WIDTH, sidebarWidth + 16);
      }
    } else if (e.key === 'Home') {
      nextWidth = COLLAPSED_SIDEBAR_WIDTH;
    } else if (e.key === 'End') {
      nextWidth = MAX_SIDEBAR_WIDTH;
    } else if (e.key === 'Enter' || e.key === ' ') {
      toggleCollapse();
      return;
    }

    if (nextWidth !== null) {
      e.preventDefault();
      setSidebarWidth(nextWidth);
      if (nextWidth >= MIN_EXPANDED_SIDEBAR_WIDTH) {
        try {
          localStorage.setItem(SIDEBAR_LAST_EXPANDED_KEY, String(nextWidth));
        } catch {
          // Ignored
        }
      }
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextWidth));
      } catch {
        // Ignored
      }
    }
  }, [sidebarWidth, toggleCollapse]);

  // Clean up cursor and body styles if component unmounts mid-drag
  useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsMobileSidebarOpen((prev) => !prev);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // Keyboard accessibility: close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileSidebarOpen) {
        closeMobileSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen, closeMobileSidebar]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="admin-ui min-h-screen bg-warm-ivory dark:bg-heritage-forest text-text-body dark:text-warm-ivory flex flex-col font-sans selection:bg-antique-gold/30 selection:text-heritage-green">
      {/* ── 56px Sticky Topbar ────────────────────────────────────────────── */}
      <AdminTopbar onToggleSidebar={toggleSidebar} />

      {/* ── Body Container: Sidebar 260px + Main Canvas ────────────────────── */}
      <div className="flex-1 flex w-full relative">
        {/* Desktop Sidebar (Resizable with Drag Handle) */}
        <aside
          ref={asideRef}
          aria-label="Thanh điều hướng quản trị chính"
          style={{ width: `${sidebarWidth}px` }}
          className={`hidden lg:flex flex-col shrink-0 sticky top-14 h-[calc(100vh-56px)] border-r border-[#E5DEC9] dark:border-antique-gold/20 bg-warm-ivory dark:bg-[#0f2420] relative ${
            isDragging ? 'select-none' : 'transition-[width] duration-150 ease-out'
          }`}
        >
          {/* Scrollable Sidebar Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <AdminSidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
          </div>

          {/* Draggable Resizer Handle */}
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-valuenow={sidebarWidth}
            aria-valuemin={COLLAPSED_SIDEBAR_WIDTH}
            aria-valuemax={MAX_SIDEBAR_WIDTH}
            aria-label="Kéo để mở rộng hoặc thu gọn menu quản trị"
            title="Kéo sang hai bên để mở rộng/thu gọn (68px - 480px). Nhấp đúp để chuyển đổi giữa icon và đầy đủ."
            onPointerDown={handlePointerDown}
            onDoubleClick={handleResetWidth}
            onKeyDown={handleResizerKeyDown}
            className={`absolute top-0 -right-2 bottom-0 w-4 z-30 cursor-col-resize flex items-center justify-center group/resizer focus-visible:outline-none ${
              isDragging ? 'pointer-events-auto' : ''
            }`}
          >
            {/* Visual separator line */}
            <div
              className={`w-0.5 h-full transition-colors duration-150 ${
                isDragging
                  ? 'bg-antique-gold dark:bg-antique-bright'
                  : 'group-hover/resizer:bg-antique-gold/80 group-focus-visible/resizer:bg-antique-gold/90'
              }`}
            />

            {/* Tactile Pill Grip Indicator in the middle */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full border border-antique-gold/30 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 ${
                isDragging
                  ? 'bg-antique-gold text-heritage-green scale-y-115 shadow-sm'
                  : 'bg-[#EFE8D6] dark:bg-[#1a3832] group-hover/resizer:bg-antique-gold group-hover/resizer:scale-y-110 group-focus-visible/resizer:ring-2 group-focus-visible/resizer:ring-antique-gold'
              }`}
            >
              <span className="w-0.5 h-0.5 rounded-full bg-heritage-green/50 dark:bg-warm-ivory/60" />
              <span className="w-0.5 h-0.5 rounded-full bg-heritage-green/50 dark:bg-warm-ivory/60" />
              <span className="w-0.5 h-0.5 rounded-full bg-heritage-green/50 dark:bg-warm-ivory/60" />
            </div>
          </div>
        </aside>

        {/* Mobile / Tablet Responsive Drawer */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden flex"
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng quản trị"
          >
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-heritage-forest/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
              onClick={closeMobileSidebar}
              aria-hidden="true"
            />

            {/* Sidebar drawer panel */}
            <div className="relative w-[260px] max-w-[85vw] bg-warm-ivory dark:bg-[#0f2420] h-full shadow-2xl flex flex-col z-50 border-r border-[#E5DEC9] dark:border-antique-gold/20 transform transition-transform duration-300 ease-out">
              <div className="h-14 px-4 border-b border-[#E5DEC9] dark:border-antique-gold/20 flex items-center justify-between shrink-0 bg-rice-paper/50 dark:bg-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-heritage-green dark:text-antique-gold">
                  Menu Quản Trị
                </span>
                <button
                  type="button"
                  onClick={closeMobileSidebar}
                  aria-label="Đóng menu quản trị"
                  className="p-1.5 rounded-lg border border-[#E5DEC9] dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-text-muted hover:text-heritage-green dark:hover:text-warm-ivory cursor-pointer transition-colors"
                >
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <AdminSidebar onNavigate={closeMobileSidebar} />
              </div>
            </div>
          </div>
        )}

        {/* ── Main Canvas (Warm Heritage #FAF6EE / bg-warm-ivory) ────────────── */}
        <main
          className="flex-1 min-w-0 w-full min-h-[calc(100vh-56px)] bg-warm-ivory dark:bg-heritage-forest overflow-x-hidden overflow-y-auto transition-colors"
          tabIndex={-1}
        >
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
