import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type {
  Level,
  RewardActionType,
  BonusContext,
  GamificationStats,
  Mission,
  HeritageBadge,
  HeritageShopItem,
  RewardCelebrationPayload,
} from '@/types';

// ─── Constants & Configuration ──────────────────────────────────────────────────
export const LEVEL_CONFIG = {
  'Level 1': {
    name: 'Level 1',
    title: 'Người Tìm Hiểu Di Sản',
    titleEn: 'Heritage Explorer',
    minXP: 0,
    maxXP: 500,
  },
  'Level 2': {
    name: 'Level 2',
    title: 'Người Kể Chuyện Văn Hóa',
    titleEn: 'Cultural Storyteller',
    minXP: 500,
    maxXP: 1500,
  },
  'Level 3': {
    name: 'Level 3',
    title: 'Sứ Giả Di Sản Việt',
    titleEn: 'Vietnamese Heritage Ambassador',
    minXP: 1500,
    maxXP: 3000,
  },
};

export function getLevelFromXP(xp: number): Level {
  if (xp >= 1500) return 'Level 3';
  if (xp >= 500) return 'Level 2';
  return 'Level 1';
}

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7) return 1.25;
  if (streakDays >= 3) return 1.1;
  return 1.0;
}

export const INITIAL_HERITAGE_BADGES: HeritageBadge[] = [
  {
    id: 'explorer',
    name: 'Người Khám Phá',
    title: 'Hoàn thành bài đọc song ngữ đầu tiên',
    description: 'Bắt đầu hành trình tìm hiểu các giá trị văn hóa và di sản Việt.',
    category: 'reading',
    rarity: 'common',
    iconName: 'Compass',
  },
  {
    id: 'quiz_master',
    name: 'Nhà Thông Thái',
    title: 'Đạt điểm tuyệt đối Reading Quiz',
    description: 'Trả lời đúng 100% tất cả các câu hỏi kiểm tra thấu hiểu bài đọc.',
    category: 'mastery',
    rarity: 'rare',
    iconName: 'Award',
  },
  {
    id: 'vocab_scholar',
    name: 'Bậc Thầy Từ Vựng',
    title: 'Ôn tập 20+ thẻ Flashcard Spaced Repetition',
    description: 'Thành thạo kho từ vựng di sản và ghi nhớ bền vững.',
    category: 'vocab',
    rarity: 'rare',
    iconName: 'BookMarked',
  },
  {
    id: 'flame_keeper',
    name: 'Ngọn Lửa Bất Diệt',
    title: 'Duy trì chuỗi học 5 ngày liên tục',
    description: 'Kiên trì rèn luyện tiếng Anh mỗi ngày không gián đoạn.',
    category: 'streak',
    rarity: 'epic',
    iconName: 'Flame',
  },
  {
    id: 'heritage_scribe',
    name: 'Cây Bút Di Sản',
    title: 'Đăng bài chia sẻ cảm nhận trong Cộng đồng',
    description: 'Lan tỏa tình yêu văn hóa qua những góc nhìn song ngữ độc đáo.',
    category: 'community',
    rarity: 'epic',
    iconName: 'PenTool',
  },
  {
    id: 'ambassador_elite',
    name: 'Đại Sứ Di Sản Việt',
    title: 'Đạt Level 3 - Sứ Giả Văn Hóa',
    description: 'Cấp bậc danh dự cao nhất của cộng đồng người học VieCultures.',
    category: 'mastery',
    rarity: 'legendary',
    iconName: 'Crown',
  },
];

export const INITIAL_SHOP_ITEMS: HeritageShopItem[] = [
  {
    id: 'ai-audio',
    name: 'Giọng Đọc AI Premium',
    desc: 'Mở khóa giọng đọc bản ngữ chuẩn Anh - Mỹ cho toàn bộ bài học di sản.',
    cost: 300,
    tag: 'Âm Thanh',
    category: 'audio',
    iconName: 'Headphones',
  },
  {
    id: 'vintage-theme',
    name: 'Giao Diện Giấy Dó Vintage',
    desc: 'Theme giấy Dó ngà hoàng gia sang trọng cho giao diện Reader.',
    cost: 400,
    tag: 'Giao Diện',
    category: 'theme',
    iconName: 'Palette',
  },
  {
    id: 'badge-scribe',
    name: "Huy Hiệu 'Cây Bút Di Sản'",
    desc: 'Huy hiệu đặc biệt hiển thị trên trang Profile và góc bài viết cảm nhận.',
    cost: 200,
    tag: 'Danh Hiệu',
    category: 'title',
    iconName: 'Medal',
  },
  {
    id: 'avatar-frame-royal',
    name: 'Khung Avatar Hoàng Thành',
    desc: 'Khung viền vàng kim hoàng triều nổi bật quanh ảnh đại diện.',
    cost: 250,
    tag: 'Trang Trí',
    category: 'theme',
    iconName: 'Sparkles',
  },
  {
    id: 'streak-freeze',
    name: 'Bình Giữ Chuỗi (Streak Freeze)',
    desc: 'Bảo vệ chuỗi ngày học của bạn không bị đứt đoạn nếu quên học 1 ngày.',
    cost: 100,
    tag: 'Bảo Hộ',
    category: 'powerup',
    iconName: 'ShieldCheck',
  },
  {
    id: 'hd-citadel-bg',
    name: 'Hình Nền Hoàng Thành Huế HD',
    desc: 'Wallpaper Cố Đô Huế độc quyền chất lượng cao cho phòng học.',
    cost: 150,
    tag: 'Phòng Học',
    category: 'theme',
    iconName: 'Landmark',
  },
];

const DEFAULT_GAMIFICATION_STATS: GamificationStats = {
  coins: 450,
  xp: 720,
  level: 'Level 2',
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  streakProtected: false,
  streakFreezeCount: 1,
  unlockedBadges: ['explorer', 'vocab_scholar'],
  equippedTitle: 'Người Kể Chuyện Văn Hóa',
  inventory: ['ai-audio'],
  completedMissions: {},
};

// ─── Context Interface ─────────────────────────────────────────────────────────
interface GamificationContextType {
  stats: GamificationStats;
  currentLevelInfo: {
    level: Level;
    title: string;
    titleEn: string;
    currentXP: number;
    minXP: number;
    maxXP: number;
    levelXP: number;
    neededXP: number;
    progressPercent: number;
  };
  streakMultiplier: number;
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  allBadges: HeritageBadge[];
  shopItems: HeritageShopItem[];
  activeCelebration: RewardCelebrationPayload | null;
  isMissionsOpen: boolean;
  openMissions: () => void;
  closeMissions: () => void;
  toggleMissions: () => void;
  earnReward: (action: RewardActionType, context?: BonusContext) => RewardCelebrationPayload;
  spendCoins: (amount: number, itemId: string, itemName?: string) => boolean;
  claimMissionReward: (missionId: string) => void;
  equipItem: (itemId: string) => void;
  dismissCelebration: () => void;
  resetGamification: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'viecultures_gamification_v1';

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<GamificationStats>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const correctLevel = getLevelFromXP(parsed.xp ?? DEFAULT_GAMIFICATION_STATS.xp);
        return {
          ...DEFAULT_GAMIFICATION_STATS,
          ...parsed,
          level: correctLevel,
        };
      }
    } catch (e) {
      console.error('Failed to load gamification stats from localStorage', e);
    }
    return DEFAULT_GAMIFICATION_STATS;
  });

  const [activeCelebration, setActiveCelebration] = useState<RewardCelebrationPayload | null>(null);
  const [isMissionsOpen, setIsMissionsOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save gamification stats to localStorage', e);
    }
  }, [stats]);

  // Streak Multiplier
  const streakMultiplier = useMemo(() => getStreakMultiplier(stats.streakDays), [stats.streakDays]);

  // Current Level Progress Calculations
  const currentLevelInfo = useMemo(() => {
    const level = getLevelFromXP(stats.xp);
    const config = LEVEL_CONFIG[level];
    const levelXP = stats.xp - config.minXP;
    const neededXP = config.maxXP - config.minXP;
    const progressPercent = Math.min(100, Math.max(0, Math.round((levelXP / neededXP) * 100)));

    return {
      level,
      title: config.title,
      titleEn: config.titleEn,
      currentXP: stats.xp,
      minXP: config.minXP,
      maxXP: config.maxXP,
      levelXP,
      neededXP,
      progressPercent,
    };
  }, [stats.xp]);

  // Daily Missions definition
  const dailyMissions = useMemo<Mission[]>(() => {
    return [
      {
        id: 'daily_read_article',
        title: 'Đọc 1 Bài Đọc Di Sản',
        description: 'Đọc trọn vẹn bài viết song ngữ hoặc chuyên sâu',
        type: 'daily',
        target: 1,
        current: 1, // completed
        rewardCoins: 30,
        rewardXP: 50,
        completed: true,
        claimed: !!stats.completedMissions['daily_read_article'],
        iconName: 'BookOpen',
      },
      {
        id: 'daily_flashcard_review',
        title: 'Ôn Tập 10 Thẻ Flashcard',
        description: 'Luyện tập bộ thẻ Spaced Repetition hôm nay',
        type: 'daily',
        target: 10,
        current: 8,
        rewardCoins: 25,
        rewardXP: 40,
        completed: false,
        claimed: !!stats.completedMissions['daily_flashcard_review'],
        iconName: 'Layers',
      },
      {
        id: 'daily_perfect_quiz',
        title: 'Đạt 100% Reading Quiz',
        description: 'Làm đúng tất cả câu hỏi kiểm tra thấu hiểu bài đọc',
        type: 'daily',
        target: 1,
        current: 1,
        rewardCoins: 40,
        rewardXP: 60,
        completed: true,
        claimed: !!stats.completedMissions['daily_perfect_quiz'],
        iconName: 'Award',
      },
      {
        id: 'daily_shadowing',
        title: 'Luyện Nghe & Shadowing',
        description: 'Luyện phát âm theo giọng đọc câu văn mẫu',
        type: 'daily',
        target: 1,
        current: 0,
        rewardCoins: 20,
        rewardXP: 30,
        completed: false,
        claimed: !!stats.completedMissions['daily_shadowing'],
        iconName: 'Headphones',
      },
    ];
  }, [stats.completedMissions]);

  // Weekly Missions definition
  const weeklyMissions = useMemo<Mission[]>(() => {
    return [
      {
        id: 'weekly_reflection',
        title: 'Cây Bút Di Sản Tuần',
        description: 'Gửi 1 bài viết cảm nhận theo chủ đề tuần trong Cộng đồng',
        type: 'weekly',
        target: 1,
        current: 1,
        rewardCoins: 100,
        rewardXP: 150,
        completed: true,
        claimed: !!stats.completedMissions['weekly_reflection'],
        iconName: 'PenTool',
      },
      {
        id: 'weekly_votes',
        title: 'Tương Tác Bạn Học',
        description: 'Bình chọn hoặc thả tim 5 bài viết của học viên khác',
        type: 'weekly',
        target: 5,
        current: 3,
        rewardCoins: 50,
        rewardXP: 80,
        completed: false,
        claimed: !!stats.completedMissions['weekly_votes'],
        iconName: 'Heart',
      },
      {
        id: 'weekly_streak_5',
        title: 'Kiên Trì 5 Ngày Liên Tục',
        description: 'Duy trì chuỗi học tập ít nhất 5 ngày trong tuần',
        type: 'weekly',
        target: 5,
        current: stats.streakDays,
        rewardCoins: 150,
        rewardXP: 250,
        completed: stats.streakDays >= 5,
        claimed: !!stats.completedMissions['weekly_streak_5'],
        iconName: 'Flame',
      },
    ];
  }, [stats.completedMissions, stats.streakDays]);

  // All Badges with unlocked status
  const allBadges = useMemo<HeritageBadge[]>(() => {
    return INITIAL_HERITAGE_BADGES.map((b) => ({
      ...b,
      unlockedAt: stats.unlockedBadges.includes(b.id) ? 'Đã đạt được' : undefined,
    }));
  }, [stats.unlockedBadges]);

  // Shop Items with purchase/equipped state
  const shopItems = useMemo<HeritageShopItem[]>(() => {
    return INITIAL_SHOP_ITEMS.map((item) => ({
      ...item,
      isPurchased: stats.inventory.includes(item.id),
      isEquipped: stats.equippedTitle === item.name || stats.inventory.includes(item.id),
    }));
  }, [stats.inventory, stats.equippedTitle]);

  // Core Earn Reward function
  const earnReward = useCallback(
    (action: RewardActionType, context?: BonusContext): RewardCelebrationPayload => {
      let baseCoins = 0;
      let baseXP = 0;
      let title = 'Phần Thưởng Học Tập!';
      let subtitle = 'Bạn đã nỗ lực hoàn thành bài học di sản hôm nay.';
      let bonusReason = '';
      let isPerfectBonus = false;

      switch (action) {
        case 'READER_ARTICLE_COMPLETED':
          baseCoins = 30;
          baseXP = 50;
          title = 'Hoàn Thành Bài Đọc Di Sản!';
          subtitle = 'Bạn đã tiếp thu những góc nhìn văn hóa sâu sắc.';
          break;

        case 'READER_QUIZ_COMPLETED':
          baseCoins = 40;
          baseXP = 60;
          if (context?.isPerfect) {
            isPerfectBonus = true;
            baseCoins = Math.round(baseCoins * 1.5);
            baseXP = Math.round(baseXP * 1.5);
            title = 'Điểm Tuyệt Đối 100% Reading Quiz!';
            subtitle = 'Xuất sắc! Bạn đã thấu hiểu trọn vẹn từng chi tiết bài học.';
            bonusReason = 'Thưởng thấu hiểu xuất sắc (+50% Xu & XP)';
          } else {
            title = 'Hoàn Thành Reading Quiz!';
            subtitle = 'Kiểm tra độ thấu hiểu bài đọc thành công.';
          }
          break;

        case 'FLASHCARD_DECK_COMPLETED':
          baseCoins = 25;
          baseXP = 40;
          title = 'Thuần Thục Bộ Thẻ Flashcard!';
          subtitle = `Đã ôn luyện toàn diện ${context?.cardCount || 10} từ vựng Spaced Repetition.`;
          break;

        case 'FLASHCARD_WORD_MASTERED':
          baseCoins = 5;
          baseXP = 10;
          title = 'Từ Vựng Đã Thuần Thục!';
          subtitle = 'Thêm 1 từ vựng di sản được ghi nhớ bền vững.';
          break;

        case 'SHADOWING_PRACTICE':
          baseCoins = 15;
          baseXP = 25;
          title = 'Luyện Phát Âm Bản Xứ!';
          subtitle = 'Cải thiện ngữ điệu và phát âm tự nhiên.';
          break;

        case 'COMMUNITY_POST_SUBMITTED':
          baseCoins = 100;
          baseXP = 150;
          title = 'Đăng Bài Dự Thi Thành Công!';
          subtitle = 'Góc nhìn văn hóa của bạn đã được lan tỏa đến toàn thể học viên.';
          break;

        case 'COMMUNITY_VOTE':
          baseCoins = 5;
          baseXP = 10;
          title = 'Tương Tác Cộng Đồng!';
          subtitle = 'Đã bình chọn và động viên bài viết bạn học.';
          break;

        case 'DAILY_TASK_COMPLETED':
          baseCoins = context?.customCoins || 15;
          baseXP = context?.customXP || 25;
          title = context?.title || 'Hoàn Thành Mục Tiêu!';
          subtitle = context?.description || 'Tiến thêm một bước trên hành trình trở thành Sứ Giả Văn Hóa.';
          break;

        case 'DAILY_CHECKIN':
          baseCoins = 20;
          baseXP = 30;
          title = 'Điểm Danh Ngày Mới!';
          subtitle = `Duy trì chuỗi học liên tiếp ${stats.streakDays + 1} ngày!`;
          break;
      }

      // Apply streak multiplier to XP
      const finalXP = Math.round(baseXP * streakMultiplier);
      const finalCoins = baseCoins;

      const previousLevel = getLevelFromXP(stats.xp);
      const nextXP = stats.xp + finalXP;
      const nextLevel = getLevelFromXP(nextXP);
      const isLevelUp = nextLevel !== previousLevel;

      // Check for unlockable badges
      const newBadges = [...stats.unlockedBadges];
      let newlyUnlockedBadge: HeritageBadge | undefined;

      if (action === 'READER_QUIZ_COMPLETED' && context?.isPerfect && !newBadges.includes('quiz_master')) {
        newBadges.push('quiz_master');
        newlyUnlockedBadge = INITIAL_HERITAGE_BADGES.find((b) => b.id === 'quiz_master');
      }
      if (isLevelUp && nextLevel === 'Level 3' && !newBadges.includes('ambassador_elite')) {
        newBadges.push('ambassador_elite');
        newlyUnlockedBadge = INITIAL_HERITAGE_BADGES.find((b) => b.id === 'ambassador_elite');
      }

      // Update state
      setStats((prev: GamificationStats) => ({
        ...prev,
        coins: prev.coins + finalCoins,
        xp: nextXP,
        level: nextLevel,
        unlockedBadges: newBadges,
      }));

      const payload: RewardCelebrationPayload = {
        title,
        subtitle,
        coinsEarned: finalCoins,
        xpEarned: finalXP,
        bonusMultiplier: streakMultiplier > 1 ? streakMultiplier : undefined,
        bonusReason: bonusReason || (streakMultiplier > 1 ? `Chuỗi ${stats.streakDays} ngày liên tục (+${Math.round((streakMultiplier - 1) * 100)}% XP)` : undefined),
        isLevelUp,
        newLevel: isLevelUp ? nextLevel : undefined,
        unlockedBadge: newlyUnlockedBadge,
      };

      // Set active celebration modal
      setActiveCelebration(payload);

      return payload;
    },
    [stats.xp, stats.streakDays, stats.unlockedBadges, streakMultiplier]
  );

  // Spend Coins for Shop
  const spendCoins = useCallback((amount: number, itemId: string, itemName?: string): boolean => {
    if (stats.coins < amount) {
      return false;
    }

    setStats((prev: GamificationStats) => ({
      ...prev,
      coins: prev.coins - amount,
      inventory: prev.inventory.includes(itemId) ? prev.inventory : [...prev.inventory, itemId],
      equippedTitle: itemId.startsWith('badge-') ? itemName || prev.equippedTitle : prev.equippedTitle,
      streakProtected: itemId === 'streak-freeze' ? true : prev.streakProtected,
    }));

    return true;
  }, [stats.coins]);

  // Claim Mission Reward
  const claimMissionReward = useCallback(
    (missionId: string) => {
      const allMissions = [...dailyMissions, ...weeklyMissions];
      const targetMission = allMissions.find((m) => m.id === missionId);

      if (!targetMission || !targetMission.completed || targetMission.claimed) {
        return;
      }

      setStats((prev: GamificationStats) => ({
        ...prev,
        coins: prev.coins + targetMission.rewardCoins,
        xp: prev.xp + targetMission.rewardXP,
        level: getLevelFromXP(prev.xp + targetMission.rewardXP),
        completedMissions: {
          ...prev.completedMissions,
          [missionId]: true,
        },
      }));

      setActiveCelebration({
        title: 'Nhận Thưởng Nhiệm Vụ!',
        subtitle: `Bạn đã hoàn thành "${targetMission.title}"`,
        coinsEarned: targetMission.rewardCoins,
        xpEarned: targetMission.rewardXP,
      });
    },
    [dailyMissions, weeklyMissions]
  );

  // Equip Item
  const equipItem = useCallback((itemId: string) => {
    const item = INITIAL_SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) return;

    if (item.category === 'title') {
      setStats((prev: GamificationStats) => ({ ...prev, equippedTitle: item.name }));
    }
  }, []);

  const openMissions = () => setIsMissionsOpen(true);
  const closeMissions = () => setIsMissionsOpen(false);
  const toggleMissions = () => setIsMissionsOpen((prev) => !prev);
  const dismissCelebration = () => setActiveCelebration(null);

  const resetGamification = () => {
    setStats(DEFAULT_GAMIFICATION_STATS);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <GamificationContext.Provider
      value={{
        stats,
        currentLevelInfo,
        streakMultiplier,
        dailyMissions,
        weeklyMissions,
        allBadges,
        shopItems,
        activeCelebration,
        isMissionsOpen,
        openMissions,
        closeMissions,
        toggleMissions,
        earnReward,
        spendCoins,
        claimMissionReward,
        equipItem,
        dismissCelebration,
        resetGamification,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
