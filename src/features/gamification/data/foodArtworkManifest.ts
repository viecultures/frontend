import type { LucideIcon } from 'lucide-react';
import { Utensils, Soup, Fish, Sparkles, Flame, Wheat } from 'lucide-react';

export interface FoodArtworkDefinition {
  foodId: string;
  nameVi: string;
  nameEn: string;
  regionVi: string;
  provinceVi: string;
  descriptionVi: string;
  /** Official high-fidelity vector/cutout sticker illustration (1:1 with transparent background) */
  illustrationSrc?: string;
  /** Retained local photographic fallback image asset */
  imageSrc?: string;
  fallbackIcon: LucideIcon;
  heritageThemeToken: 'heritage-green' | 'antique-gold' | 'terracotta';
  presentationVariant?: 'bowl' | 'pot' | 'pan' | 'plate' | 'tray';
  altTextVi: string;
  altTextEn: string;
}

/**
 * Verified Manifest for the 6 approved Heritage Cuisine Identities.
 * Strictly separates visual artwork presentation metadata from backend FoodRewardRules.
 * Uses existing local photographic fallbacks until official 512x512 transparent WebP illustrations are produced.
 */
export const FOOD_ARTWORK_MANIFEST: Record<string, FoodArtworkDefinition> = {
  'pho-hanoi': {
    foodId: 'pho-hanoi',
    nameVi: 'Phở Hà Nội',
    nameEn: 'Hanoi Pho',
    regionVi: 'Đồng Bằng Sông Hồng',
    provinceVi: 'Hà Nội',
    descriptionVi: 'Biểu tượng tinh hoa ẩm thực đất Thăng Long với nước dùng thanh trong thơm thảo mộc.',
    illustrationSrc: undefined, // Official 512x512 transparent WebP to be added in production
    imageSrc: '/images/series/pho-hanoi.webp',
    fallbackIcon: Soup,
    heritageThemeToken: 'heritage-green',
    presentationVariant: 'bowl',
    altTextVi: 'Tem ẩm thực di sản Phở Hà Nội với tô phở bò bốc khói thanh tao bên chanh ớt truyền thống',
    altTextEn: 'Heritage food sticker of Hanoi Pho with aromatic clear broth and fresh herbs',
  },
  'bun-cha-hanoi': {
    foodId: 'bun-cha-hanoi',
    nameVi: 'Bún Chả Hà Nội',
    nameEn: 'Hanoi Bun Cha',
    regionVi: 'Đồng Bằng Sông Hồng',
    provinceVi: 'Hà Nội',
    descriptionVi: 'Chả nướng than hoa thơm lừng quyện cùng nước chấm chua ngọt và thảo mộc tươi mát.',
    illustrationSrc: undefined,
    imageSrc: '/images/series/bun-cha.webp',
    fallbackIcon: Flame,
    heritageThemeToken: 'terracotta',
    presentationVariant: 'tray',
    altTextVi: 'Tem ẩm thực di sản Bún Chả Hà Nội với bát chả nướng than hoa vàng rộm và đĩa bún thanh khiết',
    altTextEn: 'Heritage food sticker of Hanoi Bun Cha with charcoal-grilled patties and dipping sauce',
  },
  'ca-kho-vu-dai': {
    foodId: 'ca-kho-vu-dai',
    nameVi: 'Cá Kho Làng Vũ Đại',
    nameEn: 'Vu Dai Braised Fish',
    regionVi: 'Đồng Bằng Sông Hồng',
    provinceVi: 'Hà Nam',
    descriptionVi: 'Niêu cá trắm đen kho củi nhãn 16 tiếng kỳ công đậm đà bản sắc châu thổ sông Hồng.',
    illustrationSrc: undefined,
    imageSrc: '/images/series/ca-kho-vu-dai.webp',
    fallbackIcon: Fish,
    heritageThemeToken: 'antique-gold',
    presentationVariant: 'pot',
    altTextVi: 'Tem ẩm thực di sản Cá Kho Làng Vũ Đại trong niêu đất nung cổ truyền sẫm màu đượm vị củi nhãn',
    altTextEn: 'Heritage food sticker of Vu Dai Braised Fish in a traditional clay pot',
  },
  'cha-ca-la-vong': {
    foodId: 'cha-ca-la-vong',
    nameVi: 'Chả Cá Lã Vọng',
    nameEn: 'La Vong Grilled Fish',
    regionVi: 'Đồng Bằng Sông Hồng',
    provinceVi: 'Hà Nội',
    descriptionVi: 'Món ăn trăm năm phố cổ nướng chảo tại bàn cùng thì là, hành hoa và mắm tôm nguyên bản.',
    illustrationSrc: undefined,
    imageSrc: '/images/series/cha-ca-la-vong.webp',
    fallbackIcon: Utensils,
    heritageThemeToken: 'heritage-green',
    presentationVariant: 'pan',
    altTextVi: 'Tem ẩm thực di sản Chả Cá Lã Vọng xèo xèo trên chảo gang nhỏ cùng thì là và hành hoa tươi',
    altTextEn: 'Heritage food sticker of La Vong Grilled Fish sizzling with fresh dill and spring onions',
  },
  'banh-cay-thai-binh': {
    foodId: 'banh-cay-thai-binh',
    nameVi: 'Bánh Cáy Thái Bình',
    nameEn: 'Thai Binh Cay Cake',
    regionVi: 'Đồng Bằng Sông Hồng',
    provinceVi: 'Thái Bình',
    descriptionVi: 'Thức quà tiến vua cầu kỳ mang vị cay ấm của gừng tươi và hương dẻo thơm nếp cái hoa vàng.',
    illustrationSrc: undefined,
    imageSrc: '/images/series/banh-cay-thai-binh.webp',
    fallbackIcon: Sparkles,
    heritageThemeToken: 'terracotta',
    presentationVariant: 'plate',
    altTextVi: 'Tem ẩm thực di sản Bánh Cáy Thái Bình óng ả sắc mật mía và hạt nếp dẻo thơm ấm vị gừng',
    altTextEn: 'Heritage food sticker of Thai Binh Cay Cake with golden molasses and ginger fragrance',
  },
  'com-chay-ninh-binh': {
    foodId: 'com-chay-ninh-binh',
    nameVi: 'Cơm Cháy Ninh Bình',
    nameEn: 'Ninh Binh Crispy Rice',
    regionVi: 'Đồng Bằng Sông Hồng',
    provinceVi: 'Ninh Bình',
    descriptionVi: 'Hạt gạo nếp hương chiên phồng giòn rụm quyện nước sốt dê núi thơm lừng đất cố đô.',
    illustrationSrc: undefined,
    imageSrc: '/images/series/com-chay-ninh-binh.webp',
    fallbackIcon: Wheat,
    heritageThemeToken: 'antique-gold',
    presentationVariant: 'plate',
    altTextVi: 'Tem ẩm thực di sản Cơm Cháy Ninh Bình giòn xốp vàng ươm bên bát nước sốt dê đậm đà cố đô',
    altTextEn: 'Heritage food sticker of Ninh Binh Crispy Rice with rich savory sauce',
  },
};

/**
 * Returns artwork definition with graceful fallback for unlisted or custom cuisines.
 */
export function getFoodArtwork(foodId?: string | null, fallbackName?: string): FoodArtworkDefinition {
  if (foodId && FOOD_ARTWORK_MANIFEST[foodId]) {
    return FOOD_ARTWORK_MANIFEST[foodId];
  }

  return {
    foodId: foodId || 'heritage-food',
    nameVi: fallbackName || 'Món Ăn Di Sản',
    nameEn: 'Heritage Cuisine',
    regionVi: 'Việt Nam',
    provinceVi: 'Di Sản Văn Hóa',
    descriptionVi: 'Món ăn truyền thống lưu giữ hương vị và tinh hoa văn hóa ẩm thực Việt.',
    illustrationSrc: undefined,
    imageSrc: undefined,
    fallbackIcon: Utensils,
    heritageThemeToken: 'heritage-green',
    presentationVariant: 'plate',
    altTextVi: 'Tem ẩm thực di sản văn hóa Việt Nam',
    altTextEn: 'Vietnamese cultural heritage food sticker',
  };
}
