import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { PLAYGROUND_SCREENS } from '../types';
import { PlaygroundSidebarNav } from '../components/PlaygroundSidebarNav';
import { Feather, Radio, Zap, Home } from 'lucide-react';

// Experimental Screen Components
import { VideoDictationShadowingScreen } from '../components/screens/VideoDictationShadowingScreen';
import { VietnamMapAiScreen } from '../components/map-ai/VietnamMapAiScreen';
import { VietnamMapImmersiveScreen } from '../components/map-ai/VietnamMapImmersiveScreen';
import { LiveAPIProvider } from '../components/map-ai/contexts/LiveAPIContext';
import { PATHS, paths } from '@/routes/paths';

export const PlaygroundPage: React.FC = () => {
  const navigate = useAppNavigate();
  const [searchParams] = useSearchParams();
  const enterChat = searchParams.get('view') === 'chat' || !!searchParams.get('story');
  const [currentScreenIndex, setCurrentScreenIndex] = useState(enterChat ? 1 : 0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const screenRefs = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    if (enterChat) {
      setCurrentScreenIndex(1);
      screenRefs.current[1]?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }, [enterChat]);

  // Scroll to selected screen index
  const scrollToScreen = (index: number) => {
    if (index >= 0 && index < PLAYGROUND_SCREENS.length) {
      setCurrentScreenIndex(index);
      const targetElement = screenRefs.current[index];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Observe scroll position to automatically update active screen index
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const scrollPosition = container.scrollTop + window.innerHeight / 3;
      screenRefs.current.forEach((el, idx) => {
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentScreenIndex(idx);
          }
        }
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in textarea or input
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'AUDIO'].includes((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        scrollToScreen(Math.min(PLAYGROUND_SCREENS.length - 1, currentScreenIndex + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        scrollToScreen(Math.max(0, currentScreenIndex - 1));
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const num = parseInt(e.key, 10) - 1;
        if (num >= 0 && num < PLAYGROUND_SCREENS.length) {
          e.preventDefault();
          scrollToScreen(num);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreenIndex]);

  if (enterChat) return <Navigate replace to={paths.aiWorkspace({ story: searchParams.get('story') || undefined, topic: searchParams.get('topic') || undefined, level: searchParams.get('level') || undefined })} />;

  return (
    <LiveAPIProvider activeView={currentScreenIndex === 1 ? 'chat' : currentScreenIndex === 2 ? 'immersive' : null}>
    <div className="relative w-full h-screen overflow-hidden bg-warm-ivory dark:bg-[#0b1a17]">
      {/* Mobile / Tablet Quick Exit to Home */}
      {currentScreenIndex !== 0 && <div className="xl:hidden fixed top-3 right-3 z-50">
        <button
          onClick={() => navigate(PATHS.home)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E2925]/90 backdrop-blur-md border border-antique-gold/40 text-antique-gold hover:text-white text-xs font-semibold shadow-lg cursor-pointer"
          title="Về Phòng Học"
          aria-label="Về Phòng Học"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Về Phòng Học</span>
        </button>
      </div>}

      {/* Floating Sidebar Navigation */}
      <PlaygroundSidebarNav
        currentScreenIndex={currentScreenIndex}
        onSelectScreen={scrollToScreen}
      />

      {/* Main Snap Scrollable Multi-Screen Desktop Container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-auto scroll-smooth snap-y snap-mandatory select-text"
      >
        {/* Screen 1: Video Dictation & Shadowing Hub */}
        <section
          ref={el => { screenRefs.current[0] = el; }}
          id="screen-dictation-shadowing"
          className="w-full h-screen snap-start flex flex-col justify-center border-b border-heritage-green/10 overflow-hidden"
        >
          <VideoDictationShadowingScreen isActive={currentScreenIndex === 0} />
        </section>

        {/* Screen 2: Vietnam Map AI & Cultural Assistant */}
        <section
          ref={el => { screenRefs.current[1] = el; }}
          id="screen-vietnam-map-ai"
          className="w-full h-screen snap-start flex flex-col justify-center border-b border-heritage-green/10 overflow-hidden"
        >
          <VietnamMapAiScreen />
        </section>

        {/* Screen 3: Vietnam Map AI Immersive (Ambient Center) */}
        <section
          ref={el => { screenRefs.current[2] = el; }}
          id="screen-vietnam-map-immersive"
          className="w-full h-screen snap-start flex flex-col justify-center border-b border-heritage-green/10 overflow-hidden"
        >
          <VietnamMapImmersiveScreen />
        </section>

        {/* Screen 4: 3-Region Dialect & Tone Explorer */}
        <section
          ref={el => { screenRefs.current[3] = el; }}
          id="screen-regional-dialects"
          className="w-full h-screen snap-start flex flex-col items-center justify-center border-b border-heritage-green/10 p-6 bg-warm-ivory dark:bg-[#0b1a17]"
        >
          <div className="max-w-xl text-center p-8 rounded-3xl bg-white/80 dark:bg-[#12231F]/80 backdrop-blur-md border border-heritage-green/15 shadow-xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-heritage-green text-antique-gold flex items-center justify-center shadow-lg">
              <Radio className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-antique-gold/20 text-[#B8860B] dark:text-antique-bright">
              <Feather className="w-3.5 h-3.5" /> Màn hình #04 · Đang phát triển (Alpha)
            </div>
            <h2 className="text-2xl font-serif font-bold text-heritage-green dark:text-warm-ivory">
              3-Region Dialect &amp; Tone Explorer
            </h2>
            <p className="text-sm text-[#5D706A] dark:text-[#9FB1AA] leading-relaxed">
              Khám phá sóng âm và ma trận phương ngữ Bắc - Trung - Nam, so sánh đường biểu diễn thanh điệu và biến thể từ vựng văn hóa dân gian.
            </p>
          </div>
        </section>

        {/* Screen 5: Heritage Speed-Run Duel Arena */}
        <section
          ref={el => { screenRefs.current[4] = el; }}
          id="screen-heritage-speed-duel"
          className="w-full h-screen snap-start flex flex-col items-center justify-center border-b border-heritage-green/10 p-6 bg-warm-ivory dark:bg-[#0b1a17]"
        >
          <div className="max-w-xl text-center p-8 rounded-3xl bg-white/80 dark:bg-[#12231F]/80 backdrop-blur-md border border-heritage-green/15 shadow-xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-heritage-green text-antique-gold flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-antique-gold/20 text-[#B8860B] dark:text-antique-bright">
              <Feather className="w-3.5 h-3.5" /> Màn hình #05 · Lab Concept
            </div>
            <h2 className="text-2xl font-serif font-bold text-heritage-green dark:text-warm-ivory">
              Heritage Speed-Run Duel Arena
            </h2>
            <p className="text-sm text-[#5D706A] dark:text-[#9FB1AA] leading-relaxed">
              Đấu trường di sản thử thách phản xạ và từ vựng tốc độ 60 giây dồn dập, tích lũy điểm combo và huy hiệu Sứ Giả Văn Hóa.
            </p>
          </div>
        </section>
      </div>
    </div>
    </LiveAPIProvider>
  );
};

export default PlaygroundPage;
