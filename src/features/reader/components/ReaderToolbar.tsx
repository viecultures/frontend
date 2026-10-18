import { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import Link from '@/components/Link';
import { ArrowLeft, BookOpen, SlidersHorizontal, User } from 'lucide-react';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { PATHS, paths } from '@/routes/paths';
import type { AppUser } from '@/utils/auth-storage';

interface ReaderToolbarProps {
  fontSize: number;
  onChangeFontSize: (updater: (prev: number) => number) => void;
  readingMode: "bilingual" | "extensive";
  onChangeReadingMode: (mode: "bilingual" | "extensive") => void;
  onOpenVocabList: () => void;
  vocabCount: number;
  themeMode: "paper" | "dark";
  onChangeThemeMode: (theme: "paper" | "dark") => void;
  selectedLevel?: "Level 1" | "Level 2" | "Level 3";
  onChangeLevel?: (lvl: "Level 1" | "Level 2" | "Level 3") => void;
  onOpenVoiceCustomizer?: () => void;
  selectedVoiceName?: string;
  selectedVoiceFlag?: string;
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onLogout?: () => void;
  isPro?: boolean;
}

export function ReaderToolbar({
  fontSize, onChangeFontSize, readingMode, onChangeReadingMode,
  onOpenVocabList, vocabCount, themeMode, onChangeThemeMode,
  onOpenVoiceCustomizer, selectedVoiceName = 'Puck',
  isLoggedIn = false, user = null, onLogout, isPro = false,
}: ReaderToolbarProps) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <nav className="reader-component-toolbar reader-navbar" aria-label="Reading tools">
      <div className="reader-navbar-inner">
        <Link href={PATHS.discovery} className="reader-navbar-back">
          <ArrowLeft aria-hidden="true" />
          <span>Back<span className="reader-navbar-back-detail"> to Discovery</span></span>
        </Link>
        <div className="reader-navbar-modes" role="group" aria-label="Reading mode">
          <button type="button" aria-pressed={readingMode === 'bilingual'} onClick={() => onChangeReadingMode('bilingual')}>Bilingual</button>
          <button type="button" aria-pressed={readingMode === 'extensive'} onClick={() => onChangeReadingMode('extensive')}>English only</button>
        </div>
        <div className="reader-navbar-actions">
          <button type="button" className="reader-navbar-action" onClick={onOpenVocabList}>
            <BookOpen aria-hidden="true" /><span>Vocabulary</span><span className="reader-navbar-count">{vocabCount}</span>
          </button>
          <Popover className="reader-navbar-settings">
            <PopoverButton className="reader-navbar-icon" aria-label="Reading settings" title="Reading settings"><SlidersHorizontal aria-hidden="true" /></PopoverButton>
            <PopoverPanel className="reader-navbar-settings-panel" data-theme={themeMode} focus>
              {({ close }) => <>
                <h2>Reading settings</h2>
                <div className="reader-navbar-setting-row">
                  <span>Text size</span>
                  <div className="reader-navbar-size">
                    <button type="button" aria-label="Decrease text size" disabled={fontSize <= 14} onClick={() => onChangeFontSize(prev => Math.max(14, prev - 1))}>A−</button>
                    <output aria-live="polite">{fontSize}px</output>
                    <button type="button" aria-label="Increase text size" disabled={fontSize >= 24} onClick={() => onChangeFontSize(prev => Math.min(24, prev + 1))}>A+</button>
                  </div>
                </div>
                <div className="reader-navbar-setting-row">
                  <span>Appearance</span>
                  <div className="reader-navbar-appearance" role="group" aria-label="Appearance">
                    <button type="button" aria-pressed={themeMode === 'paper'} onClick={() => onChangeThemeMode('paper')}>Paper</button>
                    <button type="button" aria-pressed={themeMode === 'dark'} onClick={() => onChangeThemeMode('dark')}>Dark</button>
                  </div>
                </div>
                {onOpenVoiceCustomizer && <button type="button" className="reader-navbar-voice" onClick={() => { close(); onOpenVoiceCustomizer(); }}>
                  <span>Voice settings</span><span>{selectedVoiceName}</span>
                </button>}
                <Link href={PATHS.pricing} className="reader-navbar-membership" onClick={() => close()}>{isPro ? 'Pro membership' : 'Explore Pro'}</Link>
              </>}
            </PopoverPanel>
          </Popover>
          {isLoggedIn ? <div className="reader-navbar-account">
            <button type="button" className="reader-navbar-icon" aria-label="Account" title="Account" aria-expanded={isProfileOpen} onClick={() => setIsProfileOpen(open => !open)}>
              {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? <img src={user.avatar} alt="" /> : <User aria-hidden="true" />}
            </button>
            <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} onLogout={onLogout} onNavigate={to => navigate(to)} />
          </div> : <button type="button" className="reader-navbar-action" onClick={() => navigate(paths.login({ redirect: window.location.pathname + window.location.search }))}>Sign in</button>}
        </div>
      </div>
    </nav>
  );
}
