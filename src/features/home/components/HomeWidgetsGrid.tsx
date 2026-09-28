import React from 'react';
import { Sparkles, CheckSquare, Square } from 'lucide-react';

export interface TaskItem {
  id: string;
  label: string;
  completed: boolean;
}

interface HomeWidgetsGridProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const HomeWidgetsGrid: React.FC<HomeWidgetsGridProps> = ({
  tasks,
  onToggleTask,
  onNavigate,
}) => {
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
      {/* Widget 1: Post-It Checklist Card */}
      <div className="bg-[#FFFDF5] text-heritage-forest p-6 rounded-2xl border-2 border-amber-200/80 shadow-2xl relative rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300">
        {/* Tape Accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-200/60 rounded backdrop-blur-sm border border-amber-300/40 shadow-sm" />

        <div className="flex items-center justify-between mb-4 pt-1">
          <span className="font-heading text-xs font-black uppercase tracking-widest text-amber-900 border-b-2 border-amber-800 pb-0.5">
            VIỆC HÔM NAY
          </span>
          <span className="text-xs font-bold text-amber-800/80">
            {completedCount}/{tasks.length} Đã xong
          </span>
        </div>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              {task.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-amber-800/40 group-hover:text-amber-800 shrink-0 transition-colors" />
              )}
              <span
                className={`text-xs sm:text-sm font-semibold transition-all ${
                  task.completed
                    ? 'line-through text-gray-500'
                    : 'text-heritage-forest group-hover:text-amber-900'
                }`}
              >
                {task.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Mascot Sticker */}
        <div
          className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-heritage-forest border-2 border-antique-bright flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform overflow-hidden p-1.5"
          title="Mascot Companion VieCulture Turtle"
        >
          <span className="text-xl">🐢</span>
        </div>
      </div>

      {/* Widget 2: Study Recommendation Card */}
      <div className="bg-heritage-forest/90 border border-white/20 p-6 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Gợi ý hôm nay
            </span>
            <Sparkles className="w-4 h-4 text-antique-bright" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white mb-2">
            Tranh Dân Gian Đông Hồ &amp; Mộc Bản
          </h3>
          <p className="text-xs text-white/70 leading-relaxed font-normal">
            Khám phá 12 từ vựng chuyên ngành di sản nghệ thuật dân gian và thực hành AI Shadowing bài đọc 5 phút.
          </p>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('bilingual-reader')}
            className="flex-1 py-2 px-3 bg-antique-bright text-heritage-forest rounded-xl text-xs font-bold hover:brightness-105 transition-all text-center cursor-pointer shadow-sm"
          >
            Đọc ngay (5 phút)
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeWidgetsGrid;
