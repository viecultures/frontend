import React from 'react';
import { Search, Bot, MessageSquare, Settings, Sparkles } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { PATHS } from '@/routes/paths';

interface HomeFloatingSidebarProps {
  onNavigate: (view: string) => void;
}

export const HomeFloatingSidebar: React.FC<HomeFloatingSidebarProps> = ({
  onNavigate,
}) => {
  const { openSettings } = useSettings();

  return (
    <aside
      className="home-tools-sidebar hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-2 bg-surface-feature border border-surface-feature-strong p-2 rounded-2xl backdrop-blur-xl shadow-2xl"
      aria-label="Quick tools"
    >
      <button
        type="button"
        onClick={() => onNavigate(PATHS.discovery)}
        className="p-3 rounded-xl hover:bg-surface-feature-strong text-on-feature hover:text-action hover:scale-105 transition-all relative group cursor-pointer focus-ring"
        title="Find a story"
        aria-label="Find a story"
      >
        <Search className="w-5 h-5" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-heritage-forest/95 text-warm-ivory text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-white/10">
          Find a story
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate(PATHS.playground)}
        className="p-3 rounded-xl hover:bg-surface-feature-strong text-on-feature hover:text-action hover:scale-105 transition-all relative group cursor-pointer focus-ring"
        title="AI Playground"
        aria-label="AI Playground"
      >
        <Sparkles className="w-5 h-5 text-action group-hover:text-action transition-colors" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-heritage-forest/95 text-warm-ivory text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-white/10">
          AI Playground
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate(PATHS.community)}
        className="p-3 rounded-xl hover:bg-surface-feature-strong text-on-feature hover:text-action hover:scale-105 transition-all relative group cursor-pointer focus-ring"
        title="AI companion"
        aria-label="AI companion"
      >
        <Bot className="w-5 h-5 text-action group-hover:text-action transition-colors" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-heritage-forest/95 text-warm-ivory text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-white/10">
          AI companion
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate(PATHS.community)}
        className="p-3 rounded-xl hover:bg-surface-feature-strong text-on-feature hover:text-action hover:scale-105 transition-all relative group cursor-pointer focus-ring"
        title="Community discussion"
        aria-label="Community discussion"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-heritage-forest/95 text-warm-ivory text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-white/10">
          Community discussion
        </span>
      </button>

      <button
        type="button"
        onClick={openSettings}
        className="p-3 rounded-xl hover:bg-surface-feature-strong text-on-feature hover:text-action hover:scale-105 transition-all relative group cursor-pointer focus-ring"
        title="Room settings (colours & background)"
        aria-label="Room settings"
      >
        <Settings className="w-5 h-5" />
        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-heritage-forest/95 text-warm-ivory text-xs font-semibold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg border border-white/10">
          Room settings
        </span>
      </button>
    </aside>
  );
};

export default HomeFloatingSidebar;
