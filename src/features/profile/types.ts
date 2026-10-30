export type RegionType = 'north' | 'central' | 'south';

export interface CulturalSeal {
  id: string;
  postId: string;
  titleVi: string;
  titleEn: string;
  region: RegionType;
  province: string;
  isUnlocked: boolean;
  stampedAt: string | null;
  sealCode: string; // e.g. "MS-HN-001"
  badgeIcon: string;
  quoteVi: string;
  quoteEn: string;
  learnedWordsCount: number;
  readingMinutes: number;
}

export type BadgeCategory = 'heritage' | 'vocab' | 'streak' | 'community';

export interface UserBadge {
  id: string;
  title: string;
  subtitle: string;
  category: BadgeCategory;
  iconName: string;
  currentProgress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewardExp: number;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  targetCefr: string; // e.g. "B1 - Trung cấp"
  currentLevel: string; // "Level 2"
  dailyTargetMinutes: number; // e.g. 15
  streakDays: number;
  streakFreezeAvailable: number;
  totalReadTimeMinutes: number;
  totalPostsCompleted: number;
  totalVocabMastered: number;
  totalVocabLearning: number;
  joinedAt: string;
  isPro: boolean;
  proExpiresAt?: string;
  vietQrRefCode?: string;
}
