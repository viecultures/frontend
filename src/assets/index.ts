/**
 * VIE CULTURE ASSETS REGISTRY
 * 
 * Thư mục trung tâm quản lý tất cả tài nguyên ảnh, video, icon và branding.
 * Khi chưa có file asset chính thức, hệ thống trả về `null` hoặc cờ `hasAsset: false`
 * để UI render khối khung placeholder xám chuẩn ("Cần ảnh asset: ...").
 * 
 * Khi bạn bổ sung file asset vào:
 * - src/assets/branding/ (logo-viecultures.png, etc.)
 * - src/assets/hero/     (hero-illustration.webp, icon-book.webp, etc.)
 * - src/assets/cards/    (card-van-hoa.webp, card-truyen-thuyet.webp, card-am-thuc.webp, card-le-hoi.webp)
 * - src/assets/icons/    (icon-search.svg, icon-user.svg, etc.)
 * 
 * Chỉ cần import file thực tế và gán vào đây, giao diện sẽ lập tức hiển thị ảnh!
 */

// 1. Branding
import defaultLogo from './branding/logo.jpg';

// 2. Hero Section
import bannerVideo from './hero/banner.webm';

export const BRAND_ASSETS = {
  logo: defaultLogo,
  sloganVi: 'Khắc ghi nguồn cội, gìn giữ văn hóa',
  sloganEn: 'Small words, wonderful worlds',
  // Khi có logo-viecultures.png: import logoPng from './branding/logo-viecultures.png'
  logoPng: null as string | null,
  expectedLogoPng: 'assets/logo-viecultures.png',
};

export const HERO_ASSETS = {
  bannerVideo: bannerVideo,
  // Khi có hero-illustration.webp: import heroArt from './hero/hero-illustration.webp'
  illustration: null as string | null,
  expectedIllustration: 'assets/hero-illustration.webp',
  // Khi có icon-book.webp: import iconBook from './hero/icon-book.webp'
  iconBook: null as string | null,
  expectedIconBook: 'assets/icon-book.webp',
  quoteDecorative: 'Small words, wonderful worlds',
};

export const EXPLORE_CARDS_ASSETS = {
  vanHoa: {
    titleVi: 'Nếp sống & văn hóa',
    titleEn: 'Living & Culture',
    // Khi có card-van-hoa.webp: import cardVanHoa from './cards/card-van-hoa.webp'
    image: null as string | null,
    expectedFile: 'assets/card-van-hoa.webp',
    description: 'Ảnh minh họa cảnh sinh hoạt mộc mạc, mái đình, nếp nhà xưa hoặc chén trà đầu làng.',
  },
  truyenThuyet: {
    titleVi: 'Truyền thuyết',
    titleEn: 'Myths & Legends',
    // Khi có card-truyen-thuyet.webp: import cardTruyenThuyet from './cards/card-truyen-thuyet.webp'
    image: null as string | null,
    expectedFile: 'assets/card-truyen-thuyet.webp',
    description: 'Ảnh minh họa thần thoại, huyền sử tích xưa Việt Nam phong cách hào khí dân gian.',
  },
  amThuc: {
    titleVi: 'Ẩm thực',
    titleEn: 'Culinary Heritage',
    // Khi có card-am-thuc.webp: import cardAmThuc from './cards/card-am-thuc.webp'
    image: null as string | null,
    expectedFile: 'assets/card-am-thuc.webp',
    description: 'Ảnh minh họa các món ăn truyền thống thanh nhã (bát phở bốc khói, mâm cơm gia đình, hương vị cốm non).',
  },
  leHoi: {
    titleVi: 'Lễ hội & sắc màu',
    titleEn: 'Festivals & Colors',
    // Khi có card-le-hoi.webp: import cardLeHoi from './cards/card-le-hoi.webp'
    image: null as string | null,
    expectedFile: 'assets/card-le-hoi.webp',
    description: 'Ảnh minh họa không khí lễ hội vui tươi, đèn hoa đăng, cờ hội truyền thống hoặc tà áo tứ thân trẩy hội.',
  },
};
