import React from 'react';
import { Search, Bot, MessageSquare, Settings } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface HomeFloatingSidebarProps {
  onNavigate: (view: string) => void;
}

export const HomeFloatingSidebar: React.FC<HomeFloatingSidebarProps> = ({
  onNavigate,
}) => {
  const { openSettings } = useSettings();

  return (
    <aside
      className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 bg-heritage-dark/85 border border-white/20 p-2 rounded-2xl backdrop-blur-xl shadow-2xl"
      aria-label="Thanh công cụ nhanh"
    >
      <button
        type="button"
        onClick={() => onNavigate('discovery')}
        className="p-3 rounded-xl hover:bg-antique-gold text-white/80 hover:text-heritage-dark hover:scale-105 transition-all relative group cursor-pointer focus-ring"
        title="Tìm kiếm bài đọc"
        aria-label="Tìm kiếm bài đọc"
      >
        <Search className="w-5 h-5" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-black/90 text-warm-ivory text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-white/10">
          Tìm kiếm bài đọc
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('community-1')}
        className="p-3 rounded-xl hover:bg-antique-gold text-white/80 hover:text-heritage-dark hover:scale-105 transition-all relative group cursor-pointer focus-ring"
        title="Trợ lý AI Companion"
        aria-label="Trợ lý AI Companion"
      >
        <Bot className="w-5 h-5 text-emerald-400 group-hover:text-heritage-dark transition-colors" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-black/90 text-warm-ivory text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-white/10">
          Trợ lý AI Companion
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('community-1')}
        className="p-3 rounded-xl hover:bg-antique-gold text-white/80 hover:text-heritage-dark hover:scale-105 transition-all relative group cursor-pointer focus-ring"
        title="Cộng đồng Thảo luận"
        aria-label="Cộng đồng thảo luận"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-black/90 text-warm-ivory text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-white/10">
          Cộng đồng Thảo luận
        </span>
      </button>

      <button
        type="button"
        onClick={openSettings}
        className="p-3 rounded-xl hover:bg-antique-gold text-white/80 hover:text-heritage-dark hover:scale-105 transition-all relative group cursor-pointer focus-ring"
        title="Cài đặt Trang chủ (Màu sắc & Hình nền)"
        aria-label="Cài đặt Trang chủ"
      >
        <Settings className="w-5 h-5" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-black/90 text-warm-ivory text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-white/10">
          Cài đặt Trang chủ
        </span>
      </button>
    </aside>
  );
};

export default HomeFloatingSidebar;
