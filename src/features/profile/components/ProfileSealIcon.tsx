import { Award, Coffee, Drum, Flower2, Landmark, Lamp, Music, Sailboat, Ship, Utensils, type LucideIcon } from 'lucide-react';

const SEAL_ICONS: Record<string, LucideIcon> = {
  'tet-holiday': Flower2,
  'thang-long-lotus-tea': Coffee,
  'ha-long-bay': Sailboat,
  'imperial-hue': Landmark,
  'hoi-an-lanterns': Lamp,
  'tay-nguyen-gongs': Drum,
  'cai-rang-floating-market': Ship,
  'saigon-street-food': Utensils,
  'don-ca-tai-tu': Music,
};

interface ProfileSealIconProps {
  postId: string;
  className?: string;
}

export function ProfileSealIcon({ postId, className = 'size-8' }: ProfileSealIconProps) {
  const Icon = SEAL_ICONS[postId] || Award;
  return <Icon className={className} aria-hidden="true" />;
}
