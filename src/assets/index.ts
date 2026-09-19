/**
 * VIE CULTURE ASSETS REGISTRY
 * 
 * Thư mục trung tâm quản lý tất cả tài nguyên ảnh, video, icon và branding.
 * Khi bạn bổ sung file asset mới vào các thư mục tương ứng:
 * - src/assets/branding/ (logo-viecultures.png, etc.)
 * - src/assets/hero/     (hero-illustration.webp, icon-book.webp, etc.)
 * - src/assets/cards/    (card-van-hoa.webp, card-truyen-thuyet.webp, card-am-thuc.webp, card-le-hoi.webp)
 * - src/assets/icons/    (icon-search.svg, icon-user.svg, etc.)
 * 
 * Bạn chỉ cần import và gán tại đây, toàn bộ giao diện sẽ tự động cập nhật!
 */

// 1. Branding
import defaultLogo from './branding/logo.jpg';

// 2. Hero Section Assets
import bannerVideo from './hero/banner.webm';

// Ảnh fallback tạm thời khi chưa thêm file local webp
const FALLBACK_HERO_ART = 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_VAN_HOA = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80';
const FALLBACK_TRUYEN_THUYET = 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80';
const FALLBACK_AM_THUC = 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80';
const FALLBACK_LE_HOI = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

export const BRAND_ASSETS = {
  logo: defaultLogo,
  sloganVi: 'Khắc ghi nguồn cội, gìn giữ văn hóa',
  sloganEn: 'Small words, wonderful worlds',
};

export const HERO_ASSETS = {
  bannerVideo: bannerVideo,
  // Sau này khi thêm file local: thay bằng import heroArt from './hero/hero-illustration.webp'
  illustration: FALLBACK_HERO_ART,
  quoteDecorative: 'Small words, wonderful worlds',
};

export const EXPLORE_CARDS_ASSETS = {
  vanHoa: {
    titleVi: 'Nếp sống & văn hóa',
    titleEn: 'Living & Culture',
    // Sau này khi thêm file local: thay bằng import cardVanHoa from './cards/card-van-hoa.webp'
    image: FALLBACK_VAN_HOA,
    expectedFile: 'src/assets/cards/card-van-hoa.webp',
  },
  truyenThuyet: {
    titleVi: 'Truyền thuyết',
    titleEn: 'Myths & Legends',
    // Sau này khi thêm file local: thay bằng import cardTruyenThuyet from './cards/card-truyen-thuyet.webp'
    image: FALLBACK_TRUYEN_THUYET,
    expectedFile: 'src/assets/cards/card-truyen-thuyet.webp',
  },
  amThuc: {
    titleVi: 'Ẩm thực',
    titleEn: 'Culinary Heritage',
    // Sau này khi thêm file local: thay bằng import cardAmThuc from './cards/card-am-thuc.webp'
    image: FALLBACK_AM_THUC,
    expectedFile: 'src/assets/cards/card-am-thuc.webp',
  },
  leHoi: {
    titleVi: 'Lễ hội & sắc màu',
    titleEn: 'Festivals & Colors',
    // Sau này khi thêm file local: thay bằng import cardLeHoi from './cards/card-le-hoi.webp'
    image: FALLBACK_LE_HOI,
    expectedFile: 'src/assets/cards/card-le-hoi.webp',
  },
};
