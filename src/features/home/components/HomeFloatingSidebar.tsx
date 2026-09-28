import React from 'react';
import { Search, Bot, MessageSquare, Settings } from 'lucide-react';

interface HomeFloatingSidebarProps {
  onNavigate: (view: string) => void;
}

export const HomeFloatingSidebar: React.FC<HomeFloatingSidebarProps> = ({
  onNavigate,
}) => {
  return (
    <aside
      className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 bg-heritage-forest/90 border border-white/20 p-2 rounded-2xl backdrop-blur-xl shadow-2xl"
      aria-label="Thanh công cụ nhanh"
    >
      <button
        type="button"
        onClick={() => onNavigate('discovery')}
        className="p-3 rounded-xl hover:bg-antique-bright text-white/80 hover:text-heritage-forest hover:scale-105 transition-all relative group cursor-pointer"
        title="Search catalog"
        aria-label="Tìm kiếm bài đọc"
      >
        <Search className="w-5 h-5" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Tìm kiếm bài đọc
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('community-1')}
        className="p-3 rounded-xl hover:bg-antique-bright text-white/80 hover:text-heritage-forest hover:scale-105 transition-all relative group cursor-pointer"
        title="AI Companion"
        aria-label="Trợ lý AI Companion"
      >
        <Bot className="w-5 h-5 text-emerald-400 group-hover:text-heritage-forest transition-colors" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Trợ lý AI Companion
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('community-1')}
        className="p-3 rounded-xl hover:bg-antique-bright text-white/80 hover:text-heritage-forest hover:scale-105 transition-all relative group cursor-pointer"
        title="Community Discussion"
        aria-label="Cộng đồng thảo luận"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Cộng đồng Thảo luận
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate('login')}
        className="p-3 rounded-xl hover:bg-antique-bright text-white/80 hover:text-heritage-forest hover:scale-105 transition-all relative group cursor-pointer"
        title="Settings & Tools"
        aria-label="Cài đặt & Tài khoản"
      >
        <Settings className="w-5 h-5" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Cài đặt &amp; Tài khoản
        </span>
      </button>
    </aside>
  );
};

export default HomeFloatingSidebar;
