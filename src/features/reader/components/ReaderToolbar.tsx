import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import Link from '@/components/Link';
import { ArrowLeft, BookOpen, Maximize, Minimize, Moon, SlidersHorizontal, Sun } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { PATHS, paths } from '@/routes/paths';
import { useAppNavigate } from '@/routes/useAppNavigate';
import type { AppUser } from '@/utils/auth-storage';

interface ReaderToolbarProps {
  fontSize: number;
  onChangeFontSize: (updater: (prev: number) => number) => void;
  readingMode: 'bilingual' | 'practice';
  onChangeReadingMode: (mode: 'bilingual' | 'practice') => void;
  onOpenVocabList: () => void;
  vocabCount: number;
  themeMode: 'paper' | 'dark';
  onChangeThemeMode: (theme: 'paper' | 'dark') => void;
  selectedLevel?: 'Level 1' | 'Level 2' | 'Level 3';
  onChangeLevel?: (level: 'Level 1' | 'Level 2' | 'Level 3') => void;
  onOpenVoiceCustomizer?: () => void;
  selectedVoiceName?: string;
  selectedVoiceFlag?: string;
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onLogout?: () => void;
  isPro?: boolean;
}

export function ReaderToolbar({
  fontSize, onChangeFontSize,
  readingMode, onChangeReadingMode, onOpenVocabList, vocabCount,
  themeMode, onChangeThemeMode, selectedLevel = 'Level 2', onChangeLevel,
  onOpenVoiceCustomizer, selectedVoiceName = 'Puck',
  isLoggedIn = false, user = null, onLogout, isPro = false,
}: ReaderToolbarProps) {
  const navigate = useNavigate();
  const appNavigate = useAppNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const toolbarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    const desk = toolbar.closest<HTMLElement>('.reader-desk');
    const measure = () => desk?.style.setProperty('--reader-toolbar-offset', `${toolbar.getBoundingClientRect().height + 12}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(toolbar); measure();
    return () => { observer.disconnect(); desk?.style.removeProperty('--reader-toolbar-offset'); };
  }, []);
  useEffect(() => {
    const update = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  const toggleFullscreen = async () => {
    setFullscreenError('');
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setFullscreenError('Your browser could not enter fullscreen. Please try again.');
    }
  };

  return <>
    <Navbar activeView="reader" isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} onNavigateToSection={appNavigate} />

    <nav ref={toolbarRef} className="reader-desk-toolbar" aria-label="Reading tools">
      <div className="reader-desk-title">
        <Link href={PATHS.discovery} aria-label="Back to Discovery"><ArrowLeft size={19} /><span>{readingMode === 'bilingual' ? 'Reading' : 'Practice'}</span></Link>
        <span className="reader-desk-caption">The VN Culture Dictionary</span>
        <button type="button" className="reader-workspace-switch" onClick={() => onChangeReadingMode(readingMode === 'bilingual' ? 'practice' : 'bilingual')}>{readingMode === 'bilingual' ? 'Practice this article' : 'Back to reading'}</button>
      </div>
      <div className="reader-desk-controls">
        <div className="reader-size-control" role="group" aria-label="Text size">
          <span>Text size</span>
          <button type="button" aria-label="Decrease text size" disabled={fontSize <= 14} onClick={() => onChangeFontSize(previous => Math.max(14, previous - 1))}>−</button>
          <output aria-live="polite">{fontSize}</output>
          <button type="button" aria-label="Increase text size" disabled={fontSize >= 24} onClick={() => onChangeFontSize(previous => Math.min(24, previous + 1))}>+</button>
        </div>
        <button type="button" className="reader-desk-pill" onClick={onOpenVocabList} aria-label={`Vocabulary (${vocabCount} words)`}><BookOpen size={15} /><span>{vocabCount} words</span></button>
        <button type="button" className="reader-desk-pill" aria-pressed={themeMode === 'dark'} onClick={() => onChangeThemeMode(themeMode === 'paper' ? 'dark' : 'paper')}>
          {themeMode === 'paper' ? <Moon size={15} /> : <Sun size={15} />}<span>{themeMode === 'paper' ? 'Dark' : 'Light'}</span>
        </button>
        <button type="button" className="reader-desk-pill reader-fullscreen-button" aria-pressed={isFullscreen} onClick={() => void toggleFullscreen()}>
          {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}<span>{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
        </button>
        <Popover className="reader-desk-settings">
          <PopoverButton className="reader-desk-pill" aria-label="Reading settings" title="Reading settings"><SlidersHorizontal size={16} /></PopoverButton>
          <PopoverPanel className="reader-desk-menu" focus>
            {({ close }) => <>
              <h2>Reading settings</h2>
              <label className="reader-level-control">Level
                <select aria-label="Reading level" value={selectedLevel} onChange={event => onChangeLevel?.(event.target.value as 'Level 1' | 'Level 2' | 'Level 3')}>
                  <option>Level 1</option><option>Level 2</option><option>Level 3</option>
                </select>
              </label>
              {readingMode === 'bilingual' && <button type="button" onClick={() => {
                close();
                const audio = document.getElementById('reader-audio') as HTMLDetailsElement | null;
                if (audio) { audio.open = true; audio.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
              }}>Listen to article</button>}
              {readingMode === 'bilingual' && onOpenVoiceCustomizer && <button type="button" onClick={() => { close(); onOpenVoiceCustomizer(); }}>Voice · {selectedVoiceName}</button>}
              <Link href={PATHS.pricing} onClick={() => close()}>{isPro ? 'Pro membership' : 'Explore Pro'}</Link>
              {!isLoggedIn && <button type="button" onClick={() => navigate(paths.login({ redirect: window.location.pathname + window.location.search }))}>Sign in</button>}
            </>}
          </PopoverPanel>
        </Popover>
      </div>
      {fullscreenError && <p className="reader-fullscreen-error" role="status">{fullscreenError}</p>}
    </nav>
  </>;
}
