import React, { useState, useEffect } from 'react';

// Modular Home Sub-components
import { HomeHeaderNav } from '../components/HomeHeaderNav';
import { HomeGreetingControls } from '../components/HomeGreetingControls';
import { HomeWidgetsGrid, type TaskItem } from '../components/HomeWidgetsGrid';
import { HomeBottomDock } from '../components/HomeBottomDock';
import { HomeFloatingSidebar } from '../components/HomeFloatingSidebar';
import { Check } from 'lucide-react';

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

  // Time of day detection (Morning: 5-11, Afternoon: 12-17, Evening: 18-4)
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('Morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  const getBgImage = (time: 'Morning' | 'Afternoon' | 'Evening') => {
    switch (time) {
      case 'Morning':
        return 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2400&q=80';
      case 'Afternoon':
        return 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=2400&q=80';
      case 'Evening':
        return 'https://images.unsplash.com/photo-1536086845112-89de23aa4772?auto=format&fit=crop&w=2400&q=80';
    }
  };

  const getBgLocation = (time: 'Morning' | 'Afternoon' | 'Evening') => {
    switch (time) {
      case 'Morning':
        return 'Bình minh Tràng An (Ninh Bình)';
      case 'Afternoon':
        return 'Nắng vàng Phố Cổ (Hội An)';
      case 'Evening':
        return 'Đêm Sài Gòn Hoa Lệ (TP. Hồ Chí Minh)';
    }
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

  return (
    <div className="min-h-screen bg-heritage-dark text-white flex flex-col justify-between relative overflow-hidden selection:bg-antique-gold selection:text-heritage-dark">
      {/* 1. Dynamic Background Image Layer with Ambient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 z-0"
        style={{ backgroundImage: `url(${getBgImage(timeOfDay)})` }}
      />
      {/* Ambient Depth Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-heritage-dark/80 via-heritage-dark/40 to-heritage-dark/90 z-0 pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-heritage-green text-warm-ivory shadow-2xl border border-antique-gold/40 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-antique-gold" />
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
        Ảnh: {getBgLocation(timeOfDay)}
      </div>
    </div>
  );
};

export default HomePage;
