import React, { useState, useEffect, useRef } from 'react';
import { PLAYGROUND_SCREENS } from '../types';

// Experimental Screen Components
import { VideoDictationShadowingScreen } from '../components/screens/VideoDictationShadowingScreen';
import { VietnamMapAiScreen } from '../components/screens/VietnamMapAiScreen';


export const PlaygroundPage: React.FC = () => {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const screenRefs = useRef<(HTMLElement | null)[]>([]);

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
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
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

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#FBF7EE] dark:bg-[#0b1a17]">
      {/* Main Snap Scrollable Multi-Screen Desktop Container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-auto scroll-smooth snap-y snap-mandatory select-text"
      >
        {/* Screen 1: Video Dictation & Shadowing Hub */}
        <section
          ref={el => { screenRefs.current[0] = el; }}
          id="screen-dictation-shadowing"
          className="w-full min-h-screen lg:h-screen lg:snap-start flex flex-col justify-center border-b border-[#1E4B43]/10"
        >
          <VideoDictationShadowingScreen />
        </section>

        {/* Screen 2: Vietnam Map AI & Cultural Assistant */}
        <section
          ref={el => { screenRefs.current[1] = el; }}
          id="screen-vietnam-map-ai"
          className="w-full min-h-screen lg:h-screen lg:snap-start flex flex-col justify-center border-b border-[#1E4B43]/10"
        >
          <VietnamMapAiScreen />
        </section>
      </div>
    </div>
  );
};

export default PlaygroundPage;
