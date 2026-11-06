import { getStoredUser, setStoredUser, getIsProUser, setIsProUser } from '@/utils/auth-storage';
import type { CulturalSeal, UserBadge, UserProfileData } from '../types';

const PROFILE_STORAGE_KEY = 'vie_profile_data_v1';
const SEALS_STORAGE_KEY = 'vie_cultural_seals_v1';

import { ALL_SERIES, ALL_SERIES_ARTICLES } from "@/data/series/seriesRegistry";

const allowedPostIds = new Set(ALL_SERIES_ARTICLES.map(article => article.id));

export const INITIAL_SEALS: CulturalSeal[] = ALL_SERIES.map((series, index) => ({
  id: `seal-${series.metadata.id}`,
  postId: series.metadata.chapters[0].id,
  titleVi: series.metadata.titleVi,
  titleEn: series.metadata.title,
  region: series.metadata.region,
  province: series.metadata.provinceId,
  isUnlocked: false,
  stampedAt: null,
  sealCode: `VN-CUISINE-${String(index + 1).padStart(3, "0")}`,
  badgeIcon: "utensils",
  quoteVi: series.metadata.description,
  quoteEn: series.metadata.description,
  learnedWordsCount: 0,
  readingMinutes: 0,
}));

export const INITIAL_BADGES: UserBadge[] = [
  {
    id: 'badge-first-step',
    title: 'Bước Chân Di Sản',
    subtitle: 'Hoàn thành bài đọc song ngữ văn hóa đầu tiên',
    category: 'heritage',
    iconName: 'Compass',
    currentProgress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: '12/10/2026',
    rewardExp: 50,
  },
  {
    id: 'badge-3-regions',
    title: 'Sứ Giả Ba Miền',
    subtitle: 'Đạt ít nhất 1 Mộc Son ở mỗi miền Bắc, Trung, Nam',
    category: 'heritage',
    iconName: 'MapPin',
    currentProgress: 3,
    maxProgress: 3,
    isUnlocked: true,
    unlockedAt: '17/10/2026',
    rewardExp: 150,
  },
  {
    id: 'badge-vocab-hunter',
    title: 'Thợ Săn Từ Vựng Văn Hóa',
    subtitle: 'Lưu trữ và nắm vững trên 30 từ vựng học thuật ngữ cảnh',
    category: 'vocab',
    iconName: 'BookMarked',
    currentProgress: 40,
    maxProgress: 30,
    isUnlocked: true,
    unlockedAt: '16/10/2026',
    rewardExp: 100,
  },
  {
    id: 'badge-vocab-centurion',
    title: 'Kho Báu Bách Từ',
    subtitle: 'Nắm vững 100 từ vựng chuyên sâu về văn hóa Việt Nam',
    category: 'vocab',
    iconName: 'Lightbulb',
    currentProgress: 40,
    maxProgress: 100,
    isUnlocked: false,
    rewardExp: 300,
  },
  {
    id: 'badge-streak-fire',
    title: 'Ngọn Lửa Chuyên Cần',
    subtitle: 'Duy trì chuỗi học liên tục suốt 7 ngày',
    category: 'streak',
    iconName: 'Flame',
    currentProgress: 7,
    maxProgress: 7,
    isUnlocked: true,
    unlockedAt: '17/10/2026',
    rewardExp: 120,
  },
  {
    id: 'badge-streak-legend',
    title: 'Kỷ Luật Thép 30 Ngày',
    subtitle: 'Học tiếng Anh di sản mỗi ngày trong 30 ngày',
    category: 'streak',
    iconName: 'ShieldCheck',
    currentProgress: 7,
    maxProgress: 30,
    isUnlocked: false,
    rewardExp: 500,
  },
  {
    id: 'badge-community-voice',
    title: 'Cây Bút Không Phán Xét',
    subtitle: 'Viết và chia sẻ 3 bài cảm nghĩ văn hóa trong cộng đồng',
    category: 'community',
    iconName: 'PenTool',
    currentProgress: 2,
    maxProgress: 3,
    isUnlocked: false,
    rewardExp: 100,
  },
  {
    id: 'badge-pro-pioneer',
    title: 'Hội Viên Tiên Phong',
    subtitle: 'Mở khóa đặc quyền gói Pro và tương tác với Gemini AI',
    category: 'heritage',
    iconName: 'Crown',
    currentProgress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: '15/10/2026',
    rewardExp: 200,
  },
];

const getUserKey = (prefix: string): string => {
  const user = getStoredUser();
  const safeEmail = user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'guest';
  return `${prefix}_${safeEmail}`;
};

export const profileService = {
  getProfileData(): UserProfileData {
    const storedUser = getStoredUser();
    const isPro = getIsProUser();

    const fallback: UserProfileData = {
      id: 'user-001',
      name: storedUser?.name || 'Ninh Thiên Luân',
      email: storedUser?.email || 'luanninh@viecultures.com',
      avatar: storedUser?.avatar || 'NL',
      bio: 'Người trẻ đam mê lan tỏa vẻ đẹp văn hóa và ẩm thực Việt Nam ra thế giới bằng ngôn ngữ toàn cầu.',
      targetCefr: 'B1 - Giao tiếp & Thuyết trình Văn hóa',
      currentLevel: 'Level 2',
      dailyTargetMinutes: 15,
      streakDays: 7,
      streakFreezeAvailable: 1,
      totalReadTimeMinutes: 84,
      totalPostsCompleted: 5,
      totalVocabMastered: 40,
      totalVocabLearning: 18,
      joinedAt: '10/2026',
      isPro,
      proExpiresAt: isPro ? '15/11/2026' : undefined,
      vietQrRefCode: isPro ? 'VIE-PRO-889213' : undefined,
    };

    try {
      const userKey = getUserKey(PROFILE_STORAGE_KEY);
      const raw = localStorage.getItem(userKey) || localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        ...fallback,
        ...parsed,
        name: storedUser?.name || parsed.name || fallback.name,
        email: storedUser?.email || parsed.email || fallback.email,
        avatar: storedUser?.avatar || parsed.avatar || fallback.avatar,
        isPro,
      };
    } catch {
      return fallback;
    }
  },

  updateProfileData(updates: Partial<UserProfileData>): UserProfileData {
    const current = this.getProfileData();
    const updated: UserProfileData = {
      ...current,
      ...updates,
    };

    try {
      const userKey = getUserKey(PROFILE_STORAGE_KEY);
      localStorage.setItem(userKey, JSON.stringify(updated));
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable
    }

    // Also sync to auth storage
    const storedUser = getStoredUser();
    if (storedUser) {
      setStoredUser({
        ...storedUser,
        name: updated.name,
        email: updated.email,
        avatar: updated.avatar,
      });
    }

    if (updates.isPro !== undefined) {
      setIsProUser(updates.isPro);
    }

    window.dispatchEvent(new CustomEvent('profile:change', { detail: updated }));
    return updated;
  },

  getCulturalSeals(): CulturalSeal[] {
    try {
      const userKey = getUserKey(SEALS_STORAGE_KEY);
      const raw = localStorage.getItem(userKey) || localStorage.getItem(SEALS_STORAGE_KEY);
      if (!raw) return INITIAL_SEALS;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((seal): seal is CulturalSeal => allowedPostIds.has(seal?.postId)) : INITIAL_SEALS;
    } catch {
      return INITIAL_SEALS;
    }
  },

  unlockSeal(sealId: string): CulturalSeal[] {
    const seals = this.getCulturalSeals();
    const now = new Date();
    const formatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const updated = seals.map((s) => {
      if (s.id === sealId || s.postId === sealId) {
        return {
          ...s,
          isUnlocked: true,
          stampedAt: s.stampedAt || formatted,
        };
      }
      return s;
    });

    try {
      const userKey = getUserKey(SEALS_STORAGE_KEY);
      localStorage.setItem(userKey, JSON.stringify(updated));
      localStorage.setItem(SEALS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('seals:change', { detail: updated }));
    }
    return updated;
  },

  getUserBadges(): UserBadge[] {
    return INITIAL_BADGES;
  },

  changePassword(oldPass: string, newPass: string): { success: boolean; message: string } {
    if (!oldPass || !newPass) {
      return { success: false, message: 'Vui lòng nhập đầy đủ thông tin mật khẩu.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' };
    }
    return { success: true, message: 'Đổi mật khẩu tài khoản thành công!' };
  },
};

