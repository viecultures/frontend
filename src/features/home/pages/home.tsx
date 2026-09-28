import React, { useState, useEffect } from 'react';

// Modular Home Sub-components
import { HomeHeaderNav } from '../components/HomeHeaderNav';
import { HomeGreetingControls } from '../components/HomeGreetingControls';
import { HomeWidgetsGrid, type TaskItem } from '../components/HomeWidgetsGrid';
import { HomeBottomDock } from '../components/HomeBottomDock';
import { HomeFloatingSidebar } from '../components/HomeFloatingSidebar';

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
    { id: 'task1', label: 'Trang home khi login', completed: true },
    { id: 'task2', label: 'Tái sử dụng khi mobile', completed: true },
    { id: 'task3', label: 'BG thay đổi theo thời gian', completed: true },
    { id: 'task4', label: 'Giảm ma sát khi muốn dùng chức năng', completed: false },
  ]);

  const [activeDockMode, setActiveDockMode] = useState<'study' | 'pomodoro'>('study');
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);

  // Time of day detection (Morning: 5-11, Afternoon: 12-17, Evening: 18-4)
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');

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

  // Pomodoro countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPomoRunning && pomoSeconds > 0) {
      interval = setInterval(() => {
        setPomoSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomoSeconds === 0) {
      setIsPomoRunning(false);
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

  const handleNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
    }
  };

  return (
    <div className="min-h-screen bg-heritage-forest text-white flex flex-col justify-between relative overflow-hidden selection:bg-antique-bright selection:text-heritage-forest">
      {/* 1. Dynamic Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 z-0"
        style={{ backgroundImage: `url(${getBgImage(timeOfDay)})` }}
      />

      {/* 2. Top Header Navigation Bar */}
      <HomeHeaderNav
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={onLogout}
        onNavigate={handleNavigate}
        onOpenProfile={onOpenProfile}
      />

      {/* 3. Main Hero Study Room Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-center relative z-10">
        <HomeGreetingControls
          timeOfDay={timeOfDay}
          setTimeOfDay={setTimeOfDay}
          userName={user?.name || 'Luan Nin'}
          onNavigate={handleNavigate}
        />

        <HomeWidgetsGrid
          tasks={tasks}
          onToggleTask={toggleTask}
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
      />

      {/* 5. Right Floating Toolbar (Desktop only) */}
      <HomeFloatingSidebar onNavigate={handleNavigate} />
    </div>
  );
};

export default HomePage;
