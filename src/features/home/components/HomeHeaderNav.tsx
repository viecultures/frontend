import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { BrandLogo } from '@/components/BrandLogo';
import { useSettings } from '@/context/SettingsContext';
import { PATHS } from '@/routes/paths';
import type { AppUser } from '@/utils/auth-storage';

interface HomeHeaderNavProps {
  isLoggedIn: boolean;
  user?: AppUser | null;
  onLogout?: () => void;
  onNavigate: (path: string) => void;
}

const navigation = [
  { label: 'Study room', path: PATHS.home },
  { label: 'Discover', path: PATHS.discovery },
  { label: 'Vocabulary', path: PATHS.dictionary },
  { label: 'Community', path: PATHS.community },
];

export function HomeHeaderNav({ isLoggedIn, user, onLogout, onNavigate }: HomeHeaderNavProps) {
  const { openSettings } = useSettings();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return <header className="home-room-header">
    <div className="home-room-header-inner">
      <Link to={PATHS.home} aria-label="VieCultures study room"><BrandLogo size="md" theme="light" /></Link>
      <nav className="home-room-nav" aria-label="Study navigation">
        {navigation.map(item => <Link key={item.path} to={item.path} aria-current={item.path === PATHS.home ? 'page' : undefined}>{item.label}</Link>)}
      </nav>
      <div className="home-room-account">
        <button type="button" className="home-room-icon" onClick={openSettings} aria-label="Room settings" title="Room settings"><Settings size={19} /></button>
        {isLoggedIn ? <div className="home-room-profile">
          <button type="button" className="home-room-avatar" onClick={() => setIsProfileOpen(value => !value)} aria-label="Account menu" aria-expanded={isProfileOpen} aria-haspopup="menu">
            {user?.avatar && /^(https?:\/\/|\/)/.test(user.avatar)
              ? <img src={user.avatar} alt="" />
              : <span>{user?.name?.trim().slice(0, 1).toUpperCase() || <User size={18} />}</span>}
          </button>
          <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} onLogout={onLogout} onNavigate={onNavigate} />
        </div> : <Link className="home-room-link" to={PATHS.login}>Sign in</Link>}
      </div>
    </div>
  </header>;
}
