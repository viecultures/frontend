import { useEffect, useRef } from 'react';
import { Award, BookOpen, LogOut, ShieldCheck, User } from 'lucide-react';
import { PATHS, paths } from '@/routes/paths';
import { clearAuthStorage, isAdminUser, type AppUser } from '@/utils/auth-storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user?: AppUser | null;
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
}

export function ProfileDropdown({ isOpen, onClose, user, onLogout, onNavigate }: Props) {
  const menu = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    menu.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close.current(); }
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      const items = [...(menu.current?.querySelectorAll<HTMLButtonElement>('button') || [])];
      if (!items.length) return;
      event.preventDefault();
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[next].focus();
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); if (trigger?.isConnected) trigger.focus(); };
  }, [isOpen]);
  if (!isOpen) return null;
  const go = (path: string) => {
    onClose();
    if (onNavigate) onNavigate(path);
    else window.location.assign(path);
  };
  const logout = () => {
    onClose();
    if (onLogout) onLogout();
    else {
      clearAuthStorage();
      if (onNavigate) onNavigate(PATHS.landing);
      else window.location.assign(PATHS.landing);
    }
  };
  const itemClass = 'focus-ring flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-surface-muted';
  return <>
    <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
    <div ref={menu} role="menu" aria-label="Account" className="absolute right-0 top-full z-50 mt-3 w-64 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-line bg-surface-raised p-3 text-ink shadow-xl">
      <div className="mb-2 border-b border-line px-3 pb-3"><p className="break-words text-base font-semibold">{user?.name || 'Your account'}</p>{user?.email && <p className="mt-1 break-words text-sm text-ink-soft">{user.email}</p>}</div>
      <button type="button" role="menuitem" className={itemClass} onClick={() => go(PATHS.home)}><User size={18} />Study room</button>
      <button type="button" role="menuitem" className={itemClass} onClick={() => go(PATHS.profile)}><User size={18} />Your profile</button>
      <button type="button" role="menuitem" className={itemClass} onClick={() => go(paths.profile({ tab: 'passport' }))}><Award size={18} />Heritage passport</button>
      <button type="button" role="menuitem" className={itemClass} onClick={() => go(PATHS.discovery)}><BookOpen size={18} />Discover stories</button>
      <button type="button" role="menuitem" className={itemClass} onClick={() => go(PATHS.playground)}><BookOpen size={18} />Practice</button>
      {isAdminUser() && <button type="button" role="menuitem" className={itemClass} onClick={() => go(PATHS.admin)}><ShieldCheck size={18} />Admin CMS</button>}
      <button type="button" role="menuitem" className={`${itemClass} mt-2 border-t border-line`} onClick={logout}><LogOut size={18} />Sign out</button>
    </div>
  </>;
}
