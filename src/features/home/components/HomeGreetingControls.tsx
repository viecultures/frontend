import React from 'react';
import { Compass, BookOpen, BookMarked, Users } from 'lucide-react';
import { PATHS } from '@/routes/paths';

interface HomeGreetingControlsProps {
  userName?: string;
  onNavigate: (view: string) => void;
}

export const HomeGreetingControls: React.FC<HomeGreetingControlsProps> = ({
  userName = 'Learner',
  onNavigate,
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* User Greeting Header */}
      <div>
        <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-warm-ivory tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          Welcome, {userName}
        </h1>
        <p className="text-xs sm:text-sm text-warm-ivory/90 mt-1 font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] max-w-xl leading-relaxed">
          Welcome back to your culture study room. Ready to explore something new today?
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
        {[
          { label: 'Discover stories', icon: Compass, path: PATHS.discovery },
          { label: 'Bilingual reading', icon: BookOpen, path: PATHS.reader },
          { label: 'Vocabulary cards', icon: BookMarked, path: PATHS.dictionary },
          { label: 'Community', icon: Users, path: PATHS.community },
        ].map(({ label, icon: Icon, path }) => (
          <button key={path} type="button" className="home-study-shortcut" onClick={() => onNavigate(path)}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeGreetingControls;

