import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeHeaderNav } from '../components/HomeHeaderNav';
import { HomeGreetingControls } from '../components/HomeGreetingControls';
import { HomeWidgetsGrid } from '../components/HomeWidgetsGrid';
import { HomeBottomDock } from '../components/HomeBottomDock';
import { HomeContinueCard } from '../components/HomeContinueCard';
import { HomeRecommendations } from '../components/HomeRecommendations';
import { HomeReviewCard } from '../components/HomeReviewCard';
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
    setStorageError(saveStudyTasks(account, next) ? '' : 'Your plan could not be saved. Check browser storage permissions.');
  }

  const bookmark = history[0];
  return <main className="home-room-main" id="study-room-content">
    <HomeGreetingControls userName={userName} hasHistory={history.length > 0} />
    {storageError && <p className="home-room-error" role="alert">{storageError}</p>}
    <div className="home-room-grid">
      <HomeContinueCard bookmark={bookmark} />
      <HomeReviewCard />
      <HomeWidgetsGrid tasks={tasks}
        onToggleTask={id => updateTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))}
        onAddTask={label => updateTasks([...tasks, { id: crypto.randomUUID(), label, completed: false }])} />
      <HomeRecommendations currentId={bookmark?.id} />
      <HomeBottomDock />
    </div>
  </main>;
}

export function HomePage({ isLoggedIn = false, user, onLogout }: HomePageProps) {
  const { activeBackground, backgroundMode } = useSettings();
  const navigate = useAppNavigate();
  const hasPhoto = activeBackground.id !== 'minimal-none';
  const account = user?.email || 'guest';

  return <div className="home-classic home-room">
    {hasPhoto && <div className="home-room-background" style={{ backgroundImage: `url(${activeBackground.url})` }} aria-hidden="true" />}
    <div className="home-room-veil" aria-hidden="true" />
    <a className="home-room-skip" href="#study-room-content">Skip to study content</a>
    <HomeHeaderNav isLoggedIn={isLoggedIn} user={user} onLogout={onLogout} onNavigate={navigate} />
    <StudyRoomContent key={account} account={account} userName={user?.name || 'Learner'} />
    <footer className="home-room-footer">
      <span>{hasPhoto ? `${backgroundMode === 'auto' ? 'Room scenery' : 'Background'} · ${activeBackground.nameEn}` : 'Your own little corner of Vietnam.'}</span>
      <Link to={PATHS.landing}>About VieCultures</Link>
    </footer>
  </div>;
}

export default HomePage;
