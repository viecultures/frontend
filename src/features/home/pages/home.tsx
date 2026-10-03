import React, { useState, useEffect } from 'react';

// Modular Home Sub-components
import { HomeHeaderNav } from '../components/HomeHeaderNav';
import { HomeGreetingControls } from '../components/HomeGreetingControls';
import { HomeWidgetsGrid, type TaskItem } from '../components/HomeWidgetsGrid';
import { HomeBottomDock } from '../components/HomeBottomDock';
import { HomeFloatingSidebar } from '../components/HomeFloatingSidebar';
import { Check } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface HomePageProps {
  onNavigate?: (view: string) => void;
  isLoggedIn?: boolean;
  user?: { name: string; email: string; avatar: string } | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  isLoggedIn = false,
  user,
  onLogout,
  onOpenProfile,
}) => {
  const { activeBackground, backgroundMode, currentTimePeriod } = useSettings();
  const [tasks, setTasks] = useState<TaskItem[]>([
    { id: 'task1', label: 'Đọc bài di sản Hoàng Thành Huế (5 phút)', completed: true },
    { id: 'task2', label: 'Ôn tập 10 thẻ Flashcard SRS', completed: true },
    { id: 'task3', label: 'Luyện phát âm AI Shadowing 1 đoạn văn', completed: false },
    { id: 'task4', label: 'Viết bài cảm nhận thử thách tuần', completed: false },
  ]);

  const [activeDockMode, setActiveDockMode] = useState<'study' | 'pomodoro'>('study');
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pomodoro countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPomoRunning && pomoSeconds > 0) {
      interval = setInterval(() => {
        setPomoSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomoSeconds === 0) {
      setIsPomoRunning(false);
      showToast('Hoàn thành 1 chu kỳ Pomodoro 25 phút! Hãy nghỉ ngơi 5 phút nhé.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomoRunning, pomoSeconds]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const handleAddTask = (label: string) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      label,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    showToast('Đã thêm mục tiêu học tập mới!');
  };

  const handleResetPomo = () => {
    setIsPomoRunning(false);
    setPomoSeconds(25 * 60);
    showToast('Đã đặt lại đồng hồ Pomodoro về 25:00');
  };

  const handleNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
    }
  };

  const isGradient = activeBackground.url.startsWith('linear-gradient');

  return (
    <div className="min-h-screen bg-heritage-dark text-white flex flex-col justify-between relative overflow-hidden selection:bg-antique-gold selection:text-heritage-dark">
      {/* 1. Dynamic Background Image Layer with Ambient Overlay */}
      {isGradient ? (
        <div
          className="absolute inset-0 transition-all duration-700 z-0"
          style={{ background: activeBackground.url }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 z-0"
          style={{ backgroundImage: `url(${activeBackground.url})` }}
        />
      )}
      {/* Ambient Depth Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-heritage-dark/80 via-heritage-dark/40 to-heritage-dark/90 z-0 pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-heritage-green/95 backdrop-blur-md text-warm-ivory shadow-2xl border border-antique-gold/50 flex items-center gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-3 duration-300 max-w-[90vw] whitespace-nowrap">
          <Check className="w-4 h-4 text-antique-gold shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Top Header Navigation Bar */}
      <HomeHeaderNav
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={onLogout}
        onNavigate={handleNavigate}
        onOpenProfile={onOpenProfile}
        onShowToast={showToast}
      />

      {/* 3. Main Hero Study Room Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex-1 flex flex-col justify-center relative z-10">
        <HomeGreetingControls
          userName={user?.name || 'Học Viên'}
          onNavigate={handleNavigate}
        />

        <HomeWidgetsGrid
          tasks={tasks}
          onToggleTask={toggleTask}
          onAddTask={handleAddTask}
          onNavigate={handleNavigate}
        />
      </main>

      {/* 4. Bottom Study Dock Bar */}
      <HomeBottomDock
        activeDockMode={activeDockMode}
        onSelectDockMode={setActiveDockMode}
        pomoSeconds={pomoSeconds}
        isPomoRunning={isPomoRunning}
        onTogglePomo={() => setIsPomoRunning(!isPomoRunning)}
        onResetPomo={handleResetPomo}
      />

      {/* 5. Right Floating Toolbar (Desktop only) */}
      <HomeFloatingSidebar onNavigate={handleNavigate} />

      {/* 6. Subtle Photo Location Credit (Bottom-Right Corner) */}
      <div className="fixed bottom-2.5 right-4 z-20 text-[11px] text-white/40 select-none pointer-events-none hidden sm:block tracking-wide font-normal">
        {backgroundMode === 'auto'
          ? `Nền tự động (${
              currentTimePeriod === 'morning'
                ? 'Buổi Sáng'
                : currentTimePeriod === 'afternoon'
                ? 'Buổi Chiều'
                : 'Buổi Tối'
            }): ${activeBackground.name}`
          : `Nền: ${activeBackground.name}`}
      </div>
    </div>
  );
};

export default HomePage;
