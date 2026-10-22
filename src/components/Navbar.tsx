import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Settings, User, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ProfileDropdown } from './ProfileDropdown';
import { PATHS } from '@/routes/paths';
import type { AppUser } from '@/utils/auth-storage';

interface NavbarProps {
  activeView?: string;
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onNavigateToSection: (sectionId: string) => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
}

const navigation = [
  { label: 'Study room', path: PATHS.home, active: ['home'] },
  { label: 'Discover', path: PATHS.discovery, active: ['discovery'] },
  { label: 'Read', path: PATHS.reader, active: ['reader'] },
  { label: 'Vocabulary', path: PATHS.dictionary, active: ['dictionary', 'flashcard-study'] },
  { label: 'Community', path: PATHS.community, active: ['community', 'community-contest'] },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeView = 'landing', isLoggedIn = false, user, onNavigateToSection, onLogout, onOpenSettings,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNavigate = (path: string) => { setIsMenuOpen(false); onNavigateToSection(path); };

  return <header className="vc-navbar">
    <div className="vc-navbar-inner">
      <Link to={PATHS.home} aria-label="VieCultures study room" className="vc-navbar-brand"><BrandLogo size="md" theme="light" /></Link>
      <nav id="main-navigation" className={`vc-navbar-links${isMenuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        {navigation.map(item => <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} aria-current={item.active.includes(activeView) ? 'page' : undefined}>{item.label}</Link>)}
      </nav>
      <div className="vc-navbar-actions">
        {onOpenSettings && <button type="button" className="vc-navbar-icon" onClick={onOpenSettings} aria-label="Room settings" title="Room settings"><Settings size={19} /></button>}
        {isLoggedIn ? <div className="vc-navbar-profile">
          <button type="button" className="vc-navbar-avatar" onClick={() => setIsProfileOpen(value => !value)} aria-label="Account menu" aria-expanded={isProfileOpen} aria-haspopup="menu">
            {user?.avatar && /^(https?:\/\/|\/)/.test(user.avatar) ? <img src={user.avatar} alt="" /> : <span>{user?.name?.trim().slice(0, 1).toUpperCase() || <User size={18} />}</span>}
          </button>
          <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} onLogout={onLogout} onNavigate={handleNavigate} />
        </div> : <Link className="vc-navbar-signin" to={PATHS.login}>Sign in</Link>}
        <button type="button" className="vc-navbar-menu" aria-label={isMenuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isMenuOpen} aria-controls="main-navigation" onClick={() => setIsMenuOpen(value => !value)}>{isMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </div>
  </header>;
};

export default Navbar;
