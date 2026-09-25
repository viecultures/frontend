import React from 'react';
import { ProfileDropdown } from './ProfileDropdown';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { name: string; email: string; avatar: string } | null;
  onLogout?: () => void;
  onNavigate?: (view: string) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = (props) => {
  return <ProfileDropdown {...props} />;
};

export default ProfileDrawer;
export { ProfileDropdown };
