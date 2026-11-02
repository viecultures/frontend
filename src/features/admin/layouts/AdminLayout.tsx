import React, { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminTopbar } from '../components/AdminTopbar';
import { AdminSidebar } from '../components/AdminSidebar';
import { X } from 'lucide-react';
import '../admin-ui.css';

export interface AdminLayoutProps {
  children?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
        {/* Desktop Sidebar (Persistent 260px left) */}
        <aside
          aria-label="Thanh điều hướng quản trị chính"
          className="hidden lg:block w-[260px] shrink-0 sticky top-14 h-[calc(100vh-56px)] border-r border-[#E5DEC9] dark:border-antique-gold/20 bg-warm-ivory dark:bg-[#0f2420] overflow-y-auto"
        >
          <AdminSidebar />
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
