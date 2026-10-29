import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('reader');
  const navigate = useAppNavigate();
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
      setFullscreenError(t('toolbar.fullscreen_error', 'Your browser could not enter fullscreen. Please try again.'));
    }
  };

  return <>
    <Navbar activeView="reader" isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} onNavigateToSection={navigate} />

    <nav ref={toolbarRef} className="reader-desk-toolbar" aria-label={t('toolbar.reading_tools', 'Reading tools')}>
      <div className="reader-desk-title">
        <Link href={PATHS.discovery} aria-label={t('toolbar.back_to_discovery', 'Back to Discovery')}>
          <ArrowLeft size={19} />
          <span>{readingMode === 'bilingual' ? t('toolbar.reading', 'Reading') : t('toolbar.practice', 'Practice')}</span>
        </Link>
        <button type="button" className="reader-workspace-switch" onClick={() => onChangeReadingMode(readingMode === 'bilingual' ? 'practice' : 'bilingual')}>
          {readingMode === 'bilingual' ? t('toolbar.practice_this_article', 'Practice this article') : t('toolbar.back_to_reading', 'Back to reading')}
        </button>
      </div>
      <div className="reader-desk-controls">
        <div className="reader-level-control">
          <select aria-label={t('toolbar.reading_level', 'Reading level')} value={selectedLevel} onChange={event => onChangeLevel?.(event.target.value as 'Level 1' | 'Level 2' | 'Level 3')}>
            <option>Level 1</option><option>Level 2</option><option>Level 3</option>
          </select>
        </div>
        <button type="button" className="reader-desk-pill" onClick={onOpenVocabList} aria-label={t('toolbar.vocab_pill_aria', { count: vocabCount, defaultValue: `Vocabulary (${vocabCount} words)` })}>
          <BookOpen size={15} />
          <span>{t('toolbar.vocab_pill', { count: vocabCount, defaultValue: `${vocabCount} words` })}</span>
        </button>
        <button type="button" className="reader-desk-pill reader-fullscreen-button" aria-pressed={isFullscreen} onClick={() => void toggleFullscreen()}>
          {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          <span>{isFullscreen ? t('toolbar.exit_fullscreen', 'Exit fullscreen') : t('toolbar.fullscreen', 'Fullscreen')}</span>
        </button>
        <Popover className="reader-desk-settings">
          <PopoverButton className="reader-desk-pill" aria-label={t('toolbar.reading_settings', 'Reading settings')} title={t('toolbar.reading_settings', 'Reading settings')}>
            <SlidersHorizontal size={16} />
          </PopoverButton>
          <PopoverPanel className="reader-desk-menu" focus>
            {({ close }) => <>
              <h2>{t('toolbar.reading_settings', 'Reading settings')}</h2>
              <div className="reader-setting-row">
                <span>{t('toolbar.font_size', 'Font size')}</span>
                <div className="reader-setting-size" role="group" aria-label={t('toolbar.text_size', 'Text size')}>
                  <button type="button" aria-label={t('toolbar.decrease_text_size', 'Decrease text size')} disabled={fontSize <= 14} onClick={() => onChangeFontSize(previous => Math.max(14, previous - 1))}>−</button>
                  <output aria-live="polite">{fontSize}</output>
                  <button type="button" aria-label={t('toolbar.increase_text_size', 'Increase text size')} disabled={fontSize >= 24} onClick={() => onChangeFontSize(previous => Math.min(24, previous + 1))}>+</button>
                </div>
              </div>
              <div className="reader-setting-row">
                <span>{t('toolbar.theme', 'Theme')}</span>
                <button
                  type="button"
                  className="reader-setting-theme"
                  aria-label={t('toolbar.switch_theme', { theme: themeMode === 'paper' ? t('toolbar.theme_dark', 'Dark') : t('toolbar.theme_light', 'Light') })}
                  aria-pressed={themeMode === 'dark'}
                  onClick={() => onChangeThemeMode(themeMode === 'paper' ? 'dark' : 'paper')}
                >
                  {themeMode === 'paper' ? <Moon size={15} /> : <Sun size={15} />}
                  <span>{themeMode === 'paper' ? t('toolbar.theme_dark', 'Dark') : t('toolbar.theme_light', 'Light')}</span>
                </button>
              </div>
              {readingMode === 'bilingual' && <button type="button" onClick={() => {
                close();
                document.getElementById('reader-audio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}>{t('toolbar.listen_to_article', 'Listen to article')}</button>}
              {readingMode === 'bilingual' && onOpenVoiceCustomizer && <button type="button" onClick={() => { close(); onOpenVoiceCustomizer(); }}>
                {t('toolbar.voice_label', { name: selectedVoiceName, defaultValue: `Voice · ${selectedVoiceName}` })}
              </button>}
              <Link href={PATHS.pricing} onClick={() => close()}>{isPro ? t('toolbar.pro_membership', 'Pro membership') : t('toolbar.explore_pro', 'Explore Pro')}</Link>
              {!isLoggedIn && <button type="button" onClick={() => navigate(paths.login({ redirect: window.location.pathname + window.location.search }))}>{t('toolbar.sign_in', 'Sign in')}</button>}
            </>}
          </PopoverPanel>
        </Popover>
      </div>
      {fullscreenError && <p className="reader-fullscreen-error" role="status">{fullscreenError}</p>}
    </nav>
  </>;
}
