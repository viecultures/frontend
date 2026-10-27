import { getStoredUser, setStoredUser, getIsProUser, setIsProUser } from '@/utils/auth-storage';
import type { CulturalSeal, UserBadge, UserProfileData } from '../types';

const PROFILE_STORAGE_KEY = 'vie_profile_data_v1';
const SEALS_STORAGE_KEY = 'vie_cultural_seals_v1';

export const INITIAL_SEALS: CulturalSeal[] = [
  // Miền Bắc
  {
    id: 'seal-tet',
    postId: 'tet-holiday',
    titleVi: 'Tết Cổ Truyền: Khởi Sắc & Nhớ Về Cội Nguồn',
    titleEn: 'Vietnamese Lunar New Year: Renewal & Heritage',
    region: 'north',
    province: 'Hà Nội & Ba Miền',
    isUnlocked: true,
    stampedAt: '12/10/2026',
    sealCode: 'VN-BAC-001',
    badgeIcon: '🌸',
    quoteVi: 'Tết là biểu tượng sum vầy, lòng hiếu thảo tổ tiên và sự hồi sinh của vạn vật.',
    quoteEn: 'Tết symbolizes family reunion, ancestral reverence, and natural rejuvenation.',
    learnedWordsCount: 8,
    readingMinutes: 12,
  },
  {
    id: 'seal-lotus-tea',
    postId: 'thang-long-lotus-tea',
    titleVi: 'Hương Trà Sen Tây Hồ & Nghệ Thuật Thưởng Trà Kẻ Chợ',
    titleEn: 'West Lake Lotus Tea: The Refined Art of Ancient Thang Long',
    region: 'north',
    province: 'Hà Nội',
    isUnlocked: true,
    stampedAt: '14/10/2026',
    sealCode: 'VN-BAC-002',
    badgeIcon: '🪷',
    quoteVi: 'Hương sen thanh khiết đượm trong từng búp chè sớm, gói trọn tinh hoa ngàn năm Thăng Long.',
    quoteEn: 'Pure lotus fragrance imbued in morning tea leaves captures a thousand years of Hanoi elegance.',
    learnedWordsCount: 6,
    readingMinutes: 9,
  },
  {
    id: 'seal-ha-long',
    postId: 'ha-long-bay',
    titleVi: 'Vịnh Hạ Long: Kỳ Quan Đá Vôi & Huyền Thoại Rồng Giáng',
    titleEn: 'Ha Long Bay: Limestone Splendors & Dragon Legends',
    region: 'north',
    province: 'Quảng Ninh',
    isUnlocked: false,
    stampedAt: null,
    sealCode: 'VN-BAC-003',
    badgeIcon: '⛵',
    quoteVi: 'Hàng ngàn đảo đá nhấp nhô như đàn rồng mẹ giáng thế canh giữ non sông gấm vóc.',
    quoteEn: 'Thousands of emerald limestone karsts evoke mother dragons defending the sacred coastline.',
    learnedWordsCount: 0,
    readingMinutes: 14,
  },

  // Miền Trung
  {
    id: 'seal-hue',
    postId: 'imperial-hue',
    titleVi: 'Cố Đô Huế: Dấu Tích Hoàng Triều & Nhã Nhạc Cung Đình',
    titleEn: 'Imperial Citadel of Hue: Royal Echoes & Court Melodies',
    region: 'central',
    province: 'Thừa Thiên Huế',
    isUnlocked: true,
    stampedAt: '15/10/2026',
    sealCode: 'VN-TRG-001',
    badgeIcon: '🏯',
    quoteVi: 'Dòng sông Hương êm đềm soi bóng thành quách rêu phong và tiếng ca Huế ngân vang đêm trăng.',
    quoteEn: 'The poetic Perfume River mirrors mossy citadel walls and eternal royal harmonics.',
    learnedWordsCount: 10,
    readingMinutes: 15,
  },
  {
    id: 'seal-hoi-an',
    postId: 'hoi-an-lanterns',
    titleVi: 'Phố Cổ Hội An: Đêm Hoa Đăng & Thương Cảng Trầm Mặc',
    titleEn: 'Hoi An Ancient Town: Lantern Nights & Heritage Trading Port',
    region: 'central',
    province: 'Quảng Nam',
    isUnlocked: true,
    stampedAt: '16/10/2026',
    sealCode: 'VN-TRG-002',
    badgeIcon: '🏮',
    quoteVi: 'Ánh lồng đèn lung linh bên dòng sông Hoài đưa người lữ thứ trở về thời hoàng kim giao thương.',
    quoteEn: 'Luminous lanterns along the Hoai River guide travelers back to seventeenth-century maritime glory.',
    learnedWordsCount: 7,
    readingMinutes: 11,
  },
  {
    id: 'seal-gongs',
    postId: 'tay-nguyen-gongs',
    titleVi: 'Không Gian Văn Hóa Cồng Chiêng Tây Nguyên',
    titleEn: 'Space of Gong Culture in the Central Highlands',
    region: 'central',
    province: 'Đắk Lắk & Gia Lai',
    isUnlocked: false,
    stampedAt: null,
    sealCode: 'VN-TRG-003',
    badgeIcon: '🥁',
    quoteVi: 'Tiếng chiêng là ngôn ngữ thiêng liêng nối con người với thần linh và rừng già đại ngàn.',
    quoteEn: 'Gong resonances connect mortals, ancestors, and primeval highland forests.',
    learnedWordsCount: 0,
    readingMinutes: 13,
  },

  // Miền Nam
  {
    id: 'seal-cai-rang',
    postId: 'cai-rang-floating-market',
    titleVi: 'Chợ Nổi Cái Răng: Nét Sinh Hoạt Sông Nước Miền Tây',
    titleEn: 'Cai Rang Floating Market: Mekong Delta Waterway Tapestry',
    region: 'south',
    province: 'Cần Thơ',
    isUnlocked: true,
    stampedAt: '17/10/2026',
    sealCode: 'VN-NAM-001',
    badgeIcon: '🛶',
    quoteVi: 'Cây bẹo treo hàng chào khách, ghe thuyền tấp nập buổi sớm mai đậm tình phù sa phương Nam.',
    quoteEn: 'Bamboo display poles and vibrant boats celebrate the fertile generosity of the Southern delta.',
    learnedWordsCount: 9,
    readingMinutes: 12,
  },
  {
    id: 'seal-saigon-food',
    postId: 'saigon-street-food',
    titleVi: 'Ẩm Thực Hẻm Phố Sài Gòn: Sự Giao Thoa Phóng Khoáng',
    titleEn: 'Saigon Alley Gastronomy: Cosmopolitan Flavors of the South',
    region: 'south',
    province: 'TP. Hồ Chí Minh',
    isUnlocked: false,
    stampedAt: null,
    sealCode: 'VN-NAM-002',
    badgeIcon: '🍜',
    quoteVi: 'Những con hẻm nhỏ thơm lừng mùi khói bếp, nơi mọi tầng lớp cùng quây quần bên bát hủ tiếu gõ.',
    quoteEn: 'Lively alleys filled with fragrant broths where strangers unite over steaming noodle bowls.',
    learnedWordsCount: 0,
    readingMinutes: 10,
  },
  {
    id: 'seal-don-ca',
    postId: 'don-ca-tai-tu',
    titleVi: 'Đờn Ca Tài Tử: Giai Điệu Mộc Mạc Vườn Cây Trái',
    titleEn: 'Don Ca Tai Tu: Folk Chamber Melodies of Southern Orchards',
    region: 'south',
    province: 'Bến Tre',
    isUnlocked: false,
    stampedAt: null,
    sealCode: 'VN-NAM-003',
    badgeIcon: '🎸',
    quoteVi: 'Tiếng đàn kìm, đàn tranh nắn nót từng điệu buồn vui của người mở cõi phương Nam.',
    quoteEn: 'Plucked lutes narrate the romantic perseverance of Southern settlers.',
    learnedWordsCount: 0,
    readingMinutes: 11,
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
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEALS;
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

