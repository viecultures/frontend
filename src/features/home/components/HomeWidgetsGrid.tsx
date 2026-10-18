import React, { useState } from 'react';
import { Sparkles, Plus, BookOpen, BookMarked, ArrowRight } from 'lucide-react';
import { PATHS } from '@/routes/paths';

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
    <div className="home-classic-widgets pt-2 sm:pt-3 flex flex-wrap items-start gap-3.5">
      {/* 1. Main Compact "TODAY'S TASKS" Post-It Desk Note (Width: ~260px) */}
      <div className="home-classic-tasks w-[260px] bg-heritage-forest/90 text-warm-ivory p-3.5 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl relative select-none">
        {/* 3 Colorful Decorative Washi Tapes pinned on top-right */}
        <div className="absolute -top-2 right-4 flex items-center gap-1">
          <div className="w-3.5 h-4 bg-lotus-pink/80 rounded-xs rotate-[-8deg] shadow-xs" />
          <div className="w-3.5 h-4 bg-antique-gold/80 rounded-xs rotate-[4deg] shadow-xs" />
          <div className="w-3.5 h-4 bg-mountain-teal/80 rounded-xs rotate-[-4deg] shadow-xs" />
        </div>

        {/* Header */}
        <div className="home-task-heading flex items-center justify-between mb-2">
          <span>
            Study tasks
          </span>
          <span className="tabular-nums" aria-label={`${completedCount} of ${tasks.length} tasks completed`}>
            {completedCount}/{tasks.length}
          </span>
        </div>

        {/* 4 Task Items (Compact & Clean) */}
        <ul className="h-[92px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
          {tasks.map((task) => (
            <li key={task.id}>
              <label className="home-task-row">
                <input type="checkbox" className="home-task-checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} />
              <span
                className={`line-clamp-1 ${task.completed ? 'home-task-completed' : ''}`}
                title={task.label}
              >
                {task.label}
              </span>
              </label>
            </li>
          ))}
        </ul>

        {/* Inline Quick Add Task Form */}
        <form onSubmit={handleCreateTask} className="home-task-form">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a task…"
            aria-label="New study task"
            className="home-task-input min-w-0 flex-1"
          />
          <button
            type="submit"
            disabled={!newTaskText.trim()}
            className="home-task-add"
            title="Add task"
            aria-label="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Small Mascot Emblem on bottom-right */}
        <div
          className="absolute -bottom-2 -right-2 w-6 h-6 rounded-xl bg-heritage-dark border border-antique-gold/70 flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
          title="VieCultures Companion"
        >
          <Sparkles className="w-3 h-3 text-antique-gold" />
        </div>
      </div>

      {/* Vocabulary and reading notes keep their original desk positions. */}
      <button
        type="button"
        onClick={() => onNavigate(PATHS.flashcardStudy)}
        className="home-classic-note home-note-review w-[135px] min-h-[148px] p-3 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 flex flex-col justify-between select-none group"
        title="Review today’s vocabulary cards"
      >
        <span className="home-note-content">
          <span className="home-note-label">
            <BookMarked aria-hidden="true" />
            <span>Review words</span>
          </span>
          <span className="home-note-title">12 words due</span>
          <span className="home-note-meta">85% mastered</span>
        </span>
        <span className="home-note-action">
          <span>Review now</span>
          <ArrowRight aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </button>

      <button
        type="button"
        onClick={() => onNavigate(PATHS.reader)}
        className="home-classic-note w-[140px] min-h-[148px] p-3 rotate-[3deg] hover:rotate-0 transition-transform duration-300 flex flex-col justify-between select-none group"
        title="Open the featured story"
      >
        <span className="home-note-content">
          <span className="home-note-label">
            <BookOpen aria-hidden="true" />
            <span>Featured</span>
          </span>
          <span className="home-note-title">Dong Ho prints</span>
          <span className="home-note-meta">5 min read</span>
        </span>
        <span className="home-note-action">
          <span>Read now</span>
          <ArrowRight aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </button>
    </div>
  );
};

export default HomeWidgetsGrid;
