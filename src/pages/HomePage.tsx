import React, { useState, useEffect } from 'react';
import {
  Mic,
  BookOpen,
  Sparkles,
  Rocket,
  FileText,
  Video,
  Bell,
  Trophy,
  Calendar,
  BarChart3,
  ShoppingBag,
  Search,
  Bot,
  MessageSquare,
  Settings,
  CheckSquare,
  Square,
  Clock
} from 'lucide-react';

interface HomePageProps {
  onNavigate?: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [tasks, setTasks] = useState([
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
        return '/bg-morning.jpg';
      case 'Afternoon':
        return '/bg-afternoon.jpg';
      case 'Evening':
        return '/bg-evening.jpg';
    }
  };

  const getTimeLabel = (time: 'Morning' | 'Afternoon' | 'Evening') => {
    switch (time) {
      case 'Morning':
        return 'Buổi Sáng (Morning)';
      case 'Afternoon':
        return 'Buổi Trưa (Afternoon)';
      case 'Evening':
        return 'Buổi Tối (Evening)';
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

  const formatPomoTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0A1612] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#FCE5B5] selection:text-[#18221E]">

      {/* Dynamic Background Image layer based on time of day (Clear & Sharp, no blur) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 z-0"
        style={{ backgroundImage: `url(${getBgImage(timeOfDay)})` }}
      />

      {/* Top Header Action Icons Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavigate('landing')}
            className="flex items-center gap-2 text-white font-heading font-bold text-lg hover:opacity-80 transition-opacity"
            title="Quay về Trang chủ Landing"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FCE5B5] to-[#E5A93C] flex items-center justify-center text-[#18221E] shadow-md font-black text-sm">
              V
            </div>
            <span className="tracking-tight">VieCultures</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-medium pl-2 border-l border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Phòng Học Văn Hóa</span>
          </div>
        </div>

        {/* Header Icon Quick Links Wireframe */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#122A22]/80 backdrop-blur-md p-1.5 rounded-full border border-white/15 shadow-lg">
          <button
            onClick={() => alert('Thông báo: Bạn có 2 bài ôn tập từ vựng mới hôm nay!')}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-[#FCE5B5] transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
          </button>
          <button
            onClick={() => handleNavigate('community-2')}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-[#FCE5B5] transition-all"
            title="Achievements & Contest Hub"
          >
            <Trophy className="w-4 h-4 text-[#F5D280]" />
          </button>
          <button
            onClick={() => alert('Lịch học: Chuỗi 2 ngày đang được duy trì!')}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-[#FCE5B5] transition-all"
            title="Study Calendar"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleNavigate('community-2')}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-[#FCE5B5] transition-all"
            title="Leaderboard & Stats"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('Heritage Shop: Đã mở khóa Huy hiệu Sứ Giả!')}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-[#FCE5B5] transition-all"
            title="Heritage Shop"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleNavigate('login')}
            className="flex items-center gap-1 pl-2 pr-3 py-1 bg-[#FCE5B5] text-[#18221E] rounded-full text-xs font-bold hover:brightness-105 transition-all shadow-sm"
            title="Profile & Settings"
          >
            <span>👑</span>
            <span>Luan Ninh</span>
          </button>
        </div>
      </div>

      {/* Main Hero Study Room Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-center relative z-10">

        {/* Top Hero Content Layer */}
        <div className="space-y-6">

          {/* Time Badge Pill & Mode Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 text-xs font-semibold text-[#FCE5B5] backdrop-blur-md shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#FCE5B5] animate-ping" />
              <span>{getTimeLabel(timeOfDay)}</span>
            </div>

            {/* Manual Time Selector */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/15 backdrop-blur-md text-[11px] shadow-md">
              <button
                onClick={() => setTimeOfDay('Morning')}
                className={`px-2.5 py-0.5 rounded-full transition-all font-medium ${timeOfDay === 'Morning' ? 'bg-[#FCE5B5] text-[#18221E] font-bold shadow' : 'text-white/70 hover:text-white'
                  }`}
                title="Đổi background Sáng"
              >
                🌅 Sáng
              </button>
              <button
                onClick={() => setTimeOfDay('Afternoon')}
                className={`px-2.5 py-0.5 rounded-full transition-all font-medium ${timeOfDay === 'Afternoon' ? 'bg-[#FCE5B5] text-[#18221E] font-bold shadow' : 'text-white/70 hover:text-white'
                  }`}
                title="Đổi background Trưa"
              >
                ☀️ Trưa
              </button>
              <button
                onClick={() => setTimeOfDay('Evening')}
                className={`px-2.5 py-0.5 rounded-full transition-all font-medium ${timeOfDay === 'Evening' ? 'bg-[#FCE5B5] text-[#18221E] font-bold shadow' : 'text-white/70 hover:text-white'
                  }`}
                title="Đổi background Tối"
              >
                🌙 Tối
              </button>
            </div>

            {/* Unsplash Image Source Credit */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/15 text-[11px] text-white/70 backdrop-blur-md">
              <span>📷 Nguồn ảnh:</span>
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FCE5B5] hover:underline font-medium"
              >
                Unsplash
              </a>
            </div>
          </div>

          {/* User Greeting Header */}
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
              Luan Ninh Dep Trai
            </h1>
            <p className="text-sm sm:text-base text-white/90 mt-2 font-medium drop-shadow-[0_1px_5px_rgba(0,0,0,0.85)]">
              Chào mừng trở lại — cùng khởi động nhanh nhé!
            </p>
          </div>

          {/* Quick Practice Shortcut Pills Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleNavigate('flashcard-study')}
              className="px-4 py-2.5 bg-[#122A22] border border-white/20 hover:border-[#FCE5B5] rounded-full text-xs sm:text-sm font-semibold text-white/90 hover:text-[#FCE5B5] hover:bg-white/10 transition-all flex items-center gap-2 shadow-md group"
            >
              <Mic className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Luyện phát âm</span>
            </button>

            <button
              onClick={() => handleNavigate('bilingual-reader')}
              className="px-4 py-2.5 bg-[#122A22] border border-white/20 hover:border-[#FCE5B5] rounded-full text-xs sm:text-sm font-semibold text-white/90 hover:text-[#FCE5B5] hover:bg-white/10 transition-all flex items-center gap-2 shadow-md group"
            >
              <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Học ngữ pháp</span>
            </button>

            <button
              onClick={() => handleNavigate('flashcard-study')}
              className="px-4 py-2.5 bg-[#122A22] border border-white/20 hover:border-[#FCE5B5] rounded-full text-xs sm:text-sm font-semibold text-white/90 hover:text-[#FCE5B5] hover:bg-white/10 transition-all flex items-center gap-2 shadow-md group"
            >
              <BookOpen className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Học từ vựng</span>
            </button>

            <button
              onClick={() => handleNavigate('flashcard-study')}
              className="px-4 py-2.5 bg-[#122A22] border border-white/20 hover:border-[#FCE5B5] rounded-full text-xs sm:text-sm font-semibold text-white/90 hover:text-[#FCE5B5] hover:bg-white/10 transition-all flex items-center gap-2 shadow-md group"
            >
              <Rocket className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Ôn từ vựng</span>
            </button>

            <button
              onClick={() => handleNavigate('bilingual-reader')}
              className="px-4 py-2.5 bg-[#122A22] border border-white/20 hover:border-[#FCE5B5] rounded-full text-xs sm:text-sm font-semibold text-white/90 hover:text-[#FCE5B5] hover:bg-white/10 transition-all flex items-center gap-2 shadow-md group"
            >
              <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Luyện đọc</span>
            </button>

            <button
              onClick={() => handleNavigate('discovery')}
              className="px-4 py-2.5 bg-[#122A22] border border-white/20 hover:border-[#FCE5B5] rounded-full text-xs sm:text-sm font-semibold text-white/90 hover:text-[#FCE5B5] hover:bg-white/10 transition-all flex items-center gap-2 shadow-md group"
            >
              <Video className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>Xem video</span>
            </button>
          </div>

          {/* Overlaid Desktop Widgets Grid (Post-It Checklist Card) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">

            {/* Widget 1: Post-It Checklist Card */}
            <div className="bg-[#FFFDF5] text-[#18221E] p-6 rounded-2xl border-2 border-amber-200/80 shadow-2xl relative rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300">
              {/* Tape Accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-amber-200/60 rounded backdrop-blur-sm border border-amber-300/40 shadow-sm" />

              <div className="flex items-center justify-between mb-4 pt-1">
                <span className="font-heading text-xs font-black uppercase tracking-widest text-amber-900 border-b-2 border-amber-800 pb-0.5">
                  VIỆC HÔM NAY
                </span>
                <span className="text-xs font-bold text-amber-800/80">
                  {tasks.filter((t) => t.completed).length}/{tasks.length} Đã xong
                </span>
              </div>

              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-3 cursor-pointer group select-none"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-amber-800/40 group-hover:text-amber-800 shrink-0 transition-colors" />
                    )}
                    <span
                      className={`text-xs sm:text-sm font-semibold transition-all ${task.completed
                        ? 'line-through text-gray-500'
                        : 'text-[#18221E] group-hover:text-amber-900'
                        }`}
                    >
                      {task.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Mascot Sticker */}
              <div
                className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-[#122A22] border-2 border-[#FCE5B5] flex items-center justify-center text-2xl shadow-lg cursor-pointer hover:scale-110 transition-transform"
                title="Mascot Companion VieCulture Turtle"
              >
                🐢
              </div>
            </div>

            {/* Widget 2: Study Recommendation Card */}
            <div className="bg-[#122A22]/90 border border-white/20 p-6 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Gợi ý hôm nay
                  </span>
                  <Sparkles className="w-4 h-4 text-[#FCE5B5]" />
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
                  onClick={() => handleNavigate('bilingual-reader')}
                  className="flex-1 py-2 px-3 bg-[#FCE5B5] text-[#18221E] rounded-xl text-xs font-bold hover:brightness-105 transition-all text-center"
                >
                  Đọc ngay (5 phút)
                </button>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Bottom Study Dock Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 relative z-10">
        <div className="flex items-center gap-3">

          {/* Unified Floating Bottom Control Dock Container */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-[#122A22]/90 border border-white/20 backdrop-blur-xl shadow-2xl p-2 rounded-2xl w-full sm:w-auto">
            {/* Streak Sub-card */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-black/40 rounded-xl border border-white/10">
              <span className="text-xl">🔥</span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300">STREAK</div>
                <div className="text-xs font-extrabold text-white">2 Ngày Liên Tiếp</div>
              </div>
            </div>

            {/* Daily Challenge Sub-card */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-black/40 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">THỬ THÁCH HẰNG NGÀY</div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Còn lại</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-mono border border-emerald-500/30">
                    13:40:27
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:block w-px h-7 bg-white/15 mx-0.5" />

            {/* Mode Switcher Dock (Study / Pomodoro) */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveDockMode('study')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${activeDockMode === 'study'
                    ? 'bg-[#FCE5B5] text-[#18221E] shadow-md'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                Study Mode
              </button>
              <button
                onClick={() => setActiveDockMode('pomodoro')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activeDockMode === 'pomodoro'
                    ? 'bg-[#FCE5B5] text-[#18221E] shadow-md'
                    : 'text-white/70 hover:text-white'
                  }`}
              >
                <span>Pomodoro</span>
                {activeDockMode === 'pomodoro' && (
                  <span className="font-mono text-[11px] bg-black/20 px-1.5 py-0.5 rounded">
                    {formatPomoTime(pomoSeconds)}
                  </span>
                )}
              </button>

              {activeDockMode === 'pomodoro' && (
                <button
                  onClick={() => setIsPomoRunning(!isPomoRunning)}
                  className="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-600 transition-all ml-1"
                >
                  {isPomoRunning ? 'Pause' : 'Start'}
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Right Floating Control Toolbar */}
      <aside className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 bg-[#122A22]/90 border border-white/20 p-2 rounded-2xl backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => handleNavigate('discovery')}
          className="p-3 rounded-xl hover:bg-white/15 text-white/80 hover:text-[#FCE5B5] transition-all relative group"
          title="Search catalog"
        >
          <Search className="w-5 h-5" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Tìm kiếm bài đọc
          </span>
        </button>

        <button
          onClick={() => handleNavigate('community-1')}
          className="p-3 rounded-xl hover:bg-white/15 text-white/80 hover:text-[#FCE5B5] transition-all relative group"
          title="AI Companion"
        >
          <Bot className="w-5 h-5 text-emerald-400" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Trợ lý AI Companion
          </span>
        </button>

        <button
          onClick={() => handleNavigate('community-1')}
          className="p-3 rounded-xl hover:bg-white/15 text-white/80 hover:text-[#FCE5B5] transition-all relative group"
          title="Community Discussion"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Cộng đồng Thảo luận
          </span>
        </button>

        <button
          onClick={() => handleNavigate('login')}
          className="p-3 rounded-xl hover:bg-white/15 text-white/80 hover:text-[#FCE5B5] transition-all relative group"
          title="Settings & Tools"
        >
          <Settings className="w-5 h-5" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-black text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Cài đặt &amp; Tài khoản
          </span>
        </button>
      </aside>

    </div>
  );
};

export default HomePage;
