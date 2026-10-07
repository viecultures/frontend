export type Level = 'Level 1' | 'Level 2' | 'Level 3';
export type CEFRLevel = Level | 'A2' | 'B1' | 'B2' | 'C1';

export type Category = 
  | 'all'
  | 'heritage'      // Lịch sử & Di sản
  | 'cuisine'       // Ẩm thực
  | 'landscapes'    // Danh lam thắng cảnh
  | 'festivals'     // Lễ hội & Nghệ thuật
  | 'traditions';   // Đời sống & Truyền thống

export interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  pos: string; // Part of speech (noun, verb, adj, etc.)
  vietnameseMeaning: string;
  contextSentence: string;
  highlightedWordInContext: string;
  audioExample?: string;
  level: CEFRLevel;
  usageNote?: string;
}

export interface ParagraphPair {
  id: number;
  english: string;
  vietnamese: string;
  highlightWords?: string[]; // words to highlight
}

export interface Lesson {
  id: string;
  titleEn: string;
  titleVi: string;
  category: Category;
  categoryNameVi: string;
  level: CEFRLevel;
  readTime: string;
  imageUrl: string;
  summary: string;
  paragraphs: ParagraphPair[];
  vocabularies: VocabItem[];
  featured?: boolean;
  totalReads?: number;
  likes?: number;
}

export interface UserReflection {
  id: string;
  lessonId: string;
  lessonTitle: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: CEFRLevel;
  content: string;
  usedVocab: string[];
  createdAt: string;
  likes: number;
  userLiked?: boolean;
}

// ─── Gamification & Rewards Types ───────────────────────────────────────────
export type RewardActionType =
  | 'READER_ARTICLE_COMPLETED'
  | 'READER_QUIZ_COMPLETED'
  | 'FLASHCARD_DECK_COMPLETED'
  | 'FLASHCARD_WORD_MASTERED'
  | 'SHADOWING_PRACTICE'
  | 'COMMUNITY_POST_SUBMITTED'
  | 'COMMUNITY_VOTE'
  | 'DAILY_TASK_COMPLETED'
  | 'DAILY_CHECKIN';

export interface BonusContext {
  isPerfect?: boolean;
  cardCount?: number;
  customCoins?: number;
  customXP?: number;
  title?: string;
  description?: string;
}

export interface GamificationStats {
  coins: number;
  xp: number;
  level: Level;
  streakDays: number;
  lastActiveDate: string;
  streakProtected: boolean;
  streakFreezeCount: number;
  unlockedBadges: string[];
  equippedTitle: string;
  inventory: string[];
  completedMissions: Record<string, boolean>;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type?: 'daily' | 'weekly' | string;
  target: number;
  current: number;
  rewardCoins: number;
  rewardXP: number;
  completed: boolean;
  claimed: boolean;
  iconName: string;
}

export interface HeritageBadge {
  id: string;
  name: string;
  title: string;
  description: string;
  category: 'reading' | 'mastery' | 'vocab' | 'streak' | 'community';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  iconName: string;
}

export interface HeritageShopItem {
  id: string;
  name: string;
  desc: string;
  cost: number;
  tag: string;
  category: 'audio' | 'theme' | 'title' | 'powerup';
  iconName: string;
  isPurchased?: boolean;
  isEquipped?: boolean;
}

export interface RewardCelebrationPayload {
  title: string;
  subtitle: string;
  coinsEarned: number;
  xpEarned: number;
  bonusMultiplier?: number;
  bonusReason?: string;
  isLevelUp?: boolean;
  newLevel?: Level;
  unlockedBadge?: HeritageBadge;
}

