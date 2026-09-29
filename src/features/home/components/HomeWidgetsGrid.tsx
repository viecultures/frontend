import React, { useState } from 'react';
import { Sparkles, CheckSquare, Square, Plus, BookOpen, BookMarked, ArrowRight } from 'lucide-react';

export interface TaskItem {
  id: string;
  label: string;
  completed: boolean;
}

interface HomeWidgetsGridProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask?: (label: string) => void;
  onNavigate: (view: string) => void;
}

export const HomeWidgetsGrid: React.FC<HomeWidgetsGridProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onNavigate,
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const completedCount = tasks.filter((t) => t.completed).length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !onAddTask) return;
    onAddTask(newTaskText.trim());
    setNewTaskText('');
  };

  return (
    <div className="pt-2 sm:pt-3 flex flex-wrap items-start gap-3.5">
      {/* 1. Main Compact "TODAY'S TASKS" Post-It Desk Note (Width: ~260px) */}
      <div className="w-[260px] bg-black/55 text-warm-ivory p-3.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl relative select-none">
        {/* 3 Colorful Decorative Washi Tapes pinned on top-right */}
        <div className="absolute -top-2 right-4 flex items-center gap-1">
          <div className="w-3.5 h-4 bg-rose-400/80 rounded-xs rotate-[-8deg] shadow-xs" />
          <div className="w-3.5 h-4 bg-amber-300/80 rounded-xs rotate-[4deg] shadow-xs" />
          <div className="w-3.5 h-4 bg-emerald-400/80 rounded-xs rotate-[-4deg] shadow-xs" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-mist">
            TODAY'S TASKS
          </span>
          <span className="text-[10px] font-mono font-bold text-antique-gold bg-white/10 px-1.5 py-0.5 rounded">
            {completedCount}/{tasks.length}
          </span>
        </div>

        {/* 4 Task Items (Compact & Clean) */}
        <ul className="h-[92px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
          {tasks.map((task) => (
            <li
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="flex items-center gap-2 cursor-pointer group text-[11px] font-medium leading-tight"
            >
              {task.completed ? (
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-3.5 h-3.5 text-white/50 group-hover:text-antique-gold shrink-0 transition-colors" />
              )}
              <span
                className={`transition-all line-clamp-1 ${
                  task.completed
                    ? 'line-through text-white/40'
                    : 'text-warm-ivory group-hover:text-antique-gold'
                }`}
                title={task.label}
              >
                {task.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Inline Quick Add Task Form */}
        <form onSubmit={handleCreateTask} className="flex items-center gap-1 pt-2 mt-1 border-t border-white/15">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Thêm task mới..."
            className="flex-1 px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-[10px] text-warm-ivory placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-antique-gold"
          />
          <button
            type="submit"
            disabled={!newTaskText.trim()}
            className="p-1 rounded-md bg-antique-gold text-heritage-dark disabled:opacity-40 hover:brightness-110 transition-all cursor-pointer"
            title="Thêm mục tiêu"
          >
            <Plus className="w-3 h-3" />
          </button>
        </form>

        {/* Small Mascot Emblem on bottom-right */}
        <div
          className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-heritage-dark border border-antique-gold/70 flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
          title="VieCultures Companion"
        >
          <Sparkles className="w-3 h-3 text-antique-gold" />
        </div>
      </div>

      {/* 2. Mini Pastel Sticky Note: ÔN TẬP TỪ VỰNG (Flashcard SRS) */}
      <div
        onClick={() => onNavigate('flashcard-study')}
        className="w-[135px] h-[105px] bg-[#FEF3C7] text-[#78350F] p-3 rounded-2xl shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-300 cursor-pointer flex flex-col justify-between border border-[#FDE68A] select-none group"
        title="Bấm để ôn tập từ vựng SRS hôm nay"
      >
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#92400E] block flex items-center gap-1">
            <BookMarked className="w-2.5 h-2.5" />
            <span>ÔN TẬP TỪ VỰNG</span>
          </span>
          <h4 className="font-serif text-xs font-bold text-[#78350F] leading-tight mt-0.5 group-hover:text-amber-950">
            12 Từ Cần Ôn
          </h4>
          <span className="text-[9px] text-[#92400E]/80 font-medium block">
            Thuần thục 85%
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-[#92400E] pt-1 border-t border-[#FDE68A]/80">
          <span>Ôn Ngay</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 3. Mini Pastel Sticky Note: BÀI VIẾT ĐỀ CỬ (Recommended Reading) */}
      <div
        onClick={() => onNavigate('bilingual-reader')}
        className="w-[140px] h-[105px] bg-[#E2F0D9] text-[#1E3F20] p-3 rounded-2xl shadow-xl rotate-[3deg] hover:rotate-0 transition-transform duration-300 cursor-pointer flex flex-col justify-between border border-[#C5E1B5] select-none group"
        title="Bấm để đọc bài di sản đề cử hôm nay"
      >
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#4A7C43] block flex items-center gap-1">
            <BookOpen className="w-2.5 h-2.5" />
            <span>BÀI VIẾT ĐỀ CỬ</span>
          </span>
          <h4 className="font-serif text-xs font-bold text-[#1E3F20] leading-tight mt-0.5 group-hover:text-emerald-950 line-clamp-1">
            Tranh Đông Hồ
          </h4>
          <span className="text-[9px] text-[#4A7C43] font-medium block">
            Thời lượng: 5 phút
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold text-[#2E5B27] pt-1 border-t border-[#C5E1B5]">
          <span>Đọc Ngay</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default HomeWidgetsGrid;
