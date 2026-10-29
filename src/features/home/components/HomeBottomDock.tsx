import { useEffect, useState } from 'react';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { ChevronDown, Clock, Pause, Play, RotateCcw, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PATHS } from '@/routes/paths';

export function HomeBottomDock() {
  const { t } = useTranslation('home');
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);
  useEffect(() => { if (seconds === 0) setIsRunning(false); }, [seconds]);
  const time = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  return <section className="home-room-focus home-room-panel" aria-label={t('bottom_dock.aria_label', 'Focus tools')}>
    <button type="button" className="home-room-focus-toggle" onClick={() => setIsOpen(value => !value)} aria-expanded={isOpen} aria-controls="home-focus-tools">
      <span>
        <Clock size={18} aria-hidden="true" />
        {t('bottom_dock.focus_tools', 'Focus tools')}
        {isRunning && <span className="home-room-timer-preview">{time}</span>}
      </span>
      <ChevronDown size={18} className={isOpen ? 'home-room-chevron-open' : ''} aria-hidden="true" />
    </button>
    <div id="home-focus-tools" hidden={!isOpen}>
      <div className="home-room-focus-content">
        <div>
          <p className="home-room-eyebrow">{t('bottom_dock.pomodoro', 'POMODORO')}</p>
          <p>{t('bottom_dock.quote', 'A quiet moment for your next chapter.')}</p>
        </div>
        <div className="home-room-timer-controls">
          <span className="home-room-timer" role="timer" aria-label={t('bottom_dock.timer_aria', 'Focus time remaining')}>{time}</span>
          <button type="button" className="home-room-primary" onClick={() => { if (seconds === 0) setSeconds(25 * 60); setIsRunning(value => !value); }}>
            {isRunning ? <Pause size={15} /> : <Play size={15} />}
            {isRunning ? t('bottom_dock.btn_pause', 'Pause') : seconds === 0 ? t('bottom_dock.btn_restart', 'Start again') : t('bottom_dock.btn_start', 'Start')}
          </button>
          <button type="button" className="home-room-icon" onClick={() => { setIsRunning(false); setSeconds(25 * 60); }} aria-label={t('bottom_dock.btn_reset_aria', 'Reset focus timer')}>
            <RotateCcw size={17} />
          </button>
        </div>
        {seconds === 0 && <p role="status">{t('bottom_dock.completed_status', 'Your focus session is complete. Time for a short break.')}</p>}
        <Link className="home-room-link" to={PATHS.playground}>
          <MessageCircle size={15} />
          {t('bottom_dock.practise_companion', 'Practise with your AI companion')}
        </Link>
      </div>
    </div>
  </section>;
}
