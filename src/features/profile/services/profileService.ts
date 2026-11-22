import { getStoredUser, setStoredUser, getIsProUser, setIsProUser } from '@/utils/auth-storage';
import type { CulturalSeal, UserBadge, UserProfileData } from '../types';

const PROFILE_STORAGE_KEY = 'vie_profile_data_v1';
const SEALS_STORAGE_KEY = 'vie_cultural_seals_v1';

export const INITIAL_SEALS: CulturalSeal[] = [
  {
    id: 'seal-pho',
    postId: 'pho-01',
    titleVi: 'Phở Hà Nội',
    titleEn: 'Hanoi Pho Heritage',
    region: 'north',
    province: 'ha-noi',
    isUnlocked: false,
    stampedAt: null,
    sealCode: 'VN-CUISINE-001',
    badgeIcon: 'utensils',
    quoteVi: 'Hương vị tinh hoa ẩm thực thủ đô nghìn năm văn hiến.',
    quoteEn: 'The quintessential flavor of thousand-year-old Hanoi.',
    learnedWordsCount: 0,
    readingMinutes: 0,
  },
  {
    id: 'seal-bun-cha',
    postId: 'bun-cha-01',
    titleVi: 'Bún Chả Hà Nội',
    titleEn: 'Hanoi Bun Cha',
    region: 'north',
    province: 'ha-noi',
    isUnlocked: false,
    stampedAt: null,
    sealCode: 'VN-CUISINE-002',
    badgeIcon: 'utensils',
    quoteVi: 'Món ăn truyền thống lưu giữ nét thanh lịch Tràng An.',
    quoteEn: 'A traditional dish capturing the elegance of ancient Hanoi.',
    learnedWordsCount: 0,
    readingMinutes: 0,
  },
  {
    id: 'seal-banh-mi',
    postId: 'saigon-banh-mi-01',
    titleVi: 'Bánh Mì Sài Gòn',
    titleEn: 'Saigon Banh Mi',
    region: 'south',
    province: 'ho-chi-minh',
    isUnlocked: false,
    stampedAt: null,
    sealCode: 'VN-CUISINE-003',
    badgeIcon: 'utensils',
    quoteVi: 'Văn hóa ẩm thực đường phố vang danh thế giới.',
    quoteEn: 'World-renowned street food culture from the heart of Saigon.',
    learnedWordsCount: 0,
    readingMinutes: 0,
  },
  {
    id: 'seal-hue-cuisine',
    postId: 'hue-cuisine-01',
    titleVi: 'Ẩm Thực Cung Đình Huế',
    titleEn: 'Hue Imperial Cuisine',
    region: 'central',
    province: 'thua-thien-hue',
    isUnlocked: false,
    stampedAt: null,
    sealCode: 'VN-CUISINE-004',
    badgeIcon: 'utensils',
    quoteVi: 'Sự tao nhã và cầu kỳ của ẩm thực hoàng gia xứ Huế.',
    quoteEn: 'The elegance and sophistication of royal Hue cuisine.',
    learnedWordsCount: 0,
    readingMinutes: 0,
  },
];

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
      name: storedUser?.name || 'Học viên',
      email: storedUser?.email || '',
      avatar: storedUser?.avatar || 'NL',
      bio: '',
      targetCefr: '',
      currentLevel: '',
      dailyTargetMinutes: 0,
      streakDays: 0,
      streakFreezeAvailable: 0,
      totalReadTimeMinutes: 0,
      totalPostsCompleted: 0,
      totalVocabMastered: 0,
      totalVocabLearning: 0,
      joinedAt: '',
      isPro,
      proExpiresAt: undefined,
      vietQrRefCode: undefined,
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
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEALS;
    } catch {
      return INITIAL_SEALS;
    }
  },

  unlockSeal(sealId: string): CulturalSeal[] {
    const seals = this.getCulturalSeals();
    const now = new Date();
    const formatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;

    const existingIndex = seals.findIndex((s) => s.id === sealId || s.postId === sealId);
    let updated: CulturalSeal[];
    if (existingIndex >= 0) {
      updated = seals.map((s, idx) => {
        if (idx === existingIndex) {
          return {
            ...s,
            isUnlocked: true,
            stampedAt: s.stampedAt || formatted,
          };
        }
        return s;
      });
    } else {
      updated = [
        ...seals,
        {
          id: `seal-${sealId}`,
          postId: sealId,
          titleVi: 'Mộc Son Di Sản',
          titleEn: 'Heritage Seal',
          region: 'north',
          province: 'vietnam',
          isUnlocked: true,
          stampedAt: formatted,
          sealCode: `VN-MOC-${Math.floor(1000 + Math.random() * 9000)}`,
          badgeIcon: 'award',
          quoteVi: 'Chứng nhận hoàn thành bài đọc di sản',
          quoteEn: 'Heritage reading completion certificate',
          learnedWordsCount: 0,
          readingMinutes: 0,
        },
      ];
    }

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

