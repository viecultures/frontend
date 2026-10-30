import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { Navbar } from '@/components/Navbar';
import { HomeGreetingControls } from '../components/HomeGreetingControls';
import { HomeWidgetsGrid } from '../components/HomeWidgetsGrid';
import { HomeBottomDock } from '../components/HomeBottomDock';
import { HomeContinueCard } from '../components/HomeContinueCard';
import { HomeRecommendations } from '../components/HomeRecommendations';
import { HomeVocabularyCard } from '../components/HomeVocabularyCard';
import { HomeCalendarCard } from '../components/HomeCalendarCard';
import { HomeStudyCalendar } from '../components/HomeStudyCalendar';
import { readReadingHistory, readStudyTasks, saveStudyTasks, type StudyTask } from '../lib/studyRoomStorage';
import { useSettings } from '@/context/SettingsContext';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { PATHS } from '@/routes/paths';
import type { AppUser } from '@/utils/auth-storage';
import '../home-classic.css';

interface HomePageProps {
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

interface StudyRoomContentProps { account: string; userName: string; }

function StudyRoomContent({ account, userName }: StudyRoomContentProps) {
  const { t } = useTranslation('home');
  const [tasks, setTasks] = useState(() => readStudyTasks(account));
  const [history, setHistory] = useState(() => readReadingHistory(account));
  const [storageError, setStorageError] = useState('');
  const [, refreshVocabulary] = useState(0);
  useEffect(() => {
    const refresh = () => { setHistory(readReadingHistory(account)); refreshVocabulary(value => value + 1); };
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('focus', refresh); window.removeEventListener('storage', refresh); };
  }, [account]);

  function updateTasks(next: StudyTask[]) {
    setTasks(next);
    setStorageError(saveStudyTasks(account, next) ? '' : t('storage_error', 'Your plan could not be saved. Check browser storage permissions.'));
  }

  const bookmark = history[0];
  return <main className="home-room-main" id="study-room-content">
    <HomeGreetingControls userName={userName} hasHistory={history.length > 0} />
    {storageError && <p className="home-room-error" role="alert">{storageError}</p>}
    <div className="home-room-grid">
      <HomeContinueCard bookmark={bookmark} />
      <HomeCalendarCard />
      <HomeRecommendations currentId={bookmark?.id} />
      <HomeVocabularyCard />
      <HomeStudyCalendar account={account} />
    </div>
  </main>;
}

export function HomePage({ isLoggedIn = false, user, onLogout }: HomePageProps) {
  const { t, i18n } = useTranslation(['home', 'common']);
  const { activeBackground, backgroundMode, openSettings } = useSettings();
  const navigate = useAppNavigate();
  const hasPhoto = activeBackground.id !== 'minimal-none';
  const account = user?.email || 'guest';
  const backgroundName = i18n.language === 'vi' ? activeBackground.name : activeBackground.nameEn;

  return <div className="home-classic home-room">
    {hasPhoto && <div className="home-room-background" style={{ backgroundImage: `url(${activeBackground.url})` }} aria-hidden="true" />}
    <div className="home-room-veil" aria-hidden="true" />
    <a className="home-room-skip" href="#study-room-content">{t('skip_content', 'Skip to study content')}</a>
    <Navbar activeView="home" isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} onNavigateToSection={navigate} onOpenSettings={openSettings} />
    <StudyRoomContent key={account} account={account} userName={user?.name || t('greeting.default_user', 'Learner')} />
    <footer className="home-room-footer">
      <span>{hasPhoto ? `${backgroundMode === 'auto' ? t('footer.scenery', 'Room scenery') : t('footer.background', 'Background')} · ${backgroundName}` : t('footer.default_scenery', 'Your own little corner of Vietnam.')}</span>
      <Link to={PATHS.landing}>{t('footer.about', 'About VieCultures')}</Link>
    </footer>
  </div>;
}

export default HomePage;
