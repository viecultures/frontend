import {
  VIETNAM_34_PROVINCES,
  VIETNAM_ISLANDS,
  VIETNAM_MAP_DIMENSIONS,
  VIETNAM_REGION_VIEWBOXES,
  type ProvinceMapItem,
} from '@/data/vietnamMapData';

export interface ProvinceCulturalSpecialty {
  icon: string;
  heritageType?: string;
  highlight: string;
}

export const PROVINCE_CULTURAL_SPECIALTIES: Record<string, ProvinceCulturalSpecialty> = {
  'ha-noi': {
    icon: '🏛️',
    heritageType: 'Thủ Đô Ngàn Năm',
    highlight: 'Hoàng thành Thăng Long (UNESCO), 36 Phố Phường, Văn Miếu Quốc Tử Giám',
  },
  'hai-phong': {
    icon: '⚓',
    heritageType: 'UNESCO Thế Giới',
    highlight: 'Quần đảo Cát Bà (UNESCO), Bến Nghiêng, Bánh đa cua Đất Cảng',
  },
  'quang-ninh': {
    icon: '⛵',
    heritageType: 'Kỳ Quan Tự Nhiên',
    highlight: 'Vịnh Hạ Long (UNESCO), Non thiêng Yên Tử, Đảo Cô Tô trong xanh',
  },
  'bac-ninh': {
    icon: '🎵',
    heritageType: 'UNESCO Phi Vật Thể',
    highlight: 'Dân ca Quan họ Bắc Ninh, Chùa Dâu cổ kính, Làng gốm Phù Lãng',
  },
  'thai-nguyen': {
    icon: '🍵',
    heritageType: 'Đệ Nhất Danh Trà',
    highlight: 'Vùng chè Tân Cương trứ danh, Hồ Núi Cốc, Khu di tích ATK Định Hóa',
  },
  'cao-bang': {
    icon: '🌊',
    heritageType: 'Công Viên Địa Chất',
    highlight: 'Thác Bản Giốc hùng vĩ, Hang Pác Bó cội nguồn, Non nước Cao Bằng (UNESCO)',
  },
  'lang-son': {
    icon: '🏔️',
    heritageType: 'Xứ Lạng Biên Cương',
    highlight: 'Ải Chi Lăng lịch sử, Động Tam Thanh, Mẫu Sơn quanh năm mây phủ',
  },
  'tuyen-quang': {
    icon: '🏮',
    heritageType: 'Lễ Hội Sắc Màu',
    highlight: 'Lễ hội Thành Tuyên rực rỡ, Cao nguyên đá Đồng Văn, Khu di tích Tân Trào',
  },
  'lao-cai': {
    icon: '⛰️',
    heritageType: 'Nóc Nhà Đông Dương',
    highlight: 'Đỉnh Fansipan 3.143m, Ruộng bậc thang Sa Pa, Chợ phiên Bắc Hà',
  },
  'phu-tho': {
    icon: '👑',
    heritageType: 'Cội Nguồn Dân Tộc',
    highlight: 'Khu di tích Đền Hùng (UNESCO Giỗ Tổ), Hát Xoan Phú Thọ',
  },
  'ninh-binh': {
    icon: '🛶',
    heritageType: 'UNESCO Kép Di Sản',
    highlight: 'Quần thể danh thắng Tràng An, Cố đô Hoa Lư, Chùa Bái Đính',
  },
  'hung-yen': {
    icon: '🪷',
    heritageType: 'Thứ Nhất Kinh Kỳ',
    highlight: 'Phố Hiến ngàn năm, Nhãn lồng Hưng Yên, Làng nghề đan đó Thủ Sỹ',
  },
  'son-la': {
    icon: '🌿',
    heritageType: 'Cao Nguyên Trắng',
    highlight: 'Thảo nguyên Mộc Châu mùa hoa cải, Đồi chè trái tim, Thác Dải Yếm',
  },
  'dien-bien': {
    icon: '🎖️',
    heritageType: 'Địa Danh Lịch Sử',
    highlight: 'Chiến trường Điện Biên Phủ, Đèo Pha Đin huyền thoại, Cánh đồng Mường Thanh',
  },
  'lai-chau': {
    icon: '🦅',
    heritageType: 'Kỳ Quan Tây Bắc',
    highlight: 'Đèo Ô Quy Hồ - Tứ đại đỉnh đèo, Đỉnh Pu Si Lung, Hang Tiên Pu Sam Cáp',
  },
  'thanh-hoa': {
    icon: '🏰',
    heritageType: 'UNESCO Thế Giới',
    highlight: 'Thành Nhà Hồ (UNESCO), Bãi biển Sầm Sơn, Suối cá thần Cẩm Lương',
  },
  'nghe-an': {
    icon: '📖',
    heritageType: 'UNESCO Phi Vật Thể',
    highlight: 'Dân ca Ví Giặm Nghệ Tĩnh, Khu di tích Kim Liên Nam Đàn, Rừng Pù Mát',
  },
  'ha-tinh': {
    icon: '🎼',
    heritageType: 'Địa Linh Nhân Kiệt',
    highlight: 'Quê hương Đại thi hào Nguyễn Du, Ngã ba Đồng Lộc, Chùa Hương Tích',
  },
  'quang-binh': {
    icon: '🪨',
    heritageType: 'Kỳ Quan Hang Động',
    highlight: 'Vườn Quốc Gia Phong Nha - Kẻ Bàng (UNESCO), Hang Sơn Đoòng kỳ vĩ',
  },
  'quang-tri': {
    icon: '🕊️',
    heritageType: 'Vĩ Tuyến Lịch Sử',
    highlight: 'Thành Cổ Quảng Trị, Địa đạo Vịnh Mốc, Cầu Hiền Lương - Sông Bến Hải',
  },
  'hue': {
    icon: '🏯',
    heritageType: 'Quần Thể UNESCO',
    highlight: 'Quần thể Di tích Cố đô Huế, Nhã nhạc Cung đình, Chùa Thiên Mụ, Sông Hương',
  },
  'thua-thien-hue': {
    icon: '🏯',
    heritageType: 'Quần Thể UNESCO',
    highlight: 'Quần thể Di tích Cố đô Huế, Nhã nhạc Cung đình, Chùa Thiên Mụ, Sông Hương',
  },
  'da-nang': {
    icon: '🌉',
    heritageType: 'Thành Phố Đáng Sống',
    highlight: 'Bà Nà Hills - Cầu Vàng, Bán đảo Sơn Trà, Ngũ Hành Sơn, Cầu Rồng',
  },
  'quang-ngai': {
    icon: '🌋',
    heritageType: 'Vương Quốc Tỏi',
    highlight: 'Đảo Lý Sơn - Miệng núi lửa cổ, Bệnh xá Đặng Thùy Trâm, Biển Sa Huỳnh',
  },
  'gia-lai': {
    icon: '🐘',
    heritageType: 'UNESCO Phi Vật Thể',
    highlight: 'Không gian văn hóa Cồng Chiêng Tây Nguyên, Biển Hồ T\'Nưng, Núi lửa Chư Đăng Ya',
  },
  'dak-lak': {
    icon: '☕',
    heritageType: 'Thủ Phủ Cà Phê',
    highlight: 'Bảo tàng Thế giới Cà phê Buôn Ma Thuột, Hồ Lắk thơ mộng, Thác Dray Nur',
  },
  'khanh-hoa': {
    icon: '🏖️',
    heritageType: 'Xứ Trầm Biển Yến',
    highlight: 'Vịnh Nha Trang, Tháp Bà Ponagar (UNESCO Di sản Chăm), Yến sào Khánh Hòa',
  },
  'lam-dong': {
    icon: '🌲',
    heritageType: 'Thành Phố Ngàn Hoa',
    highlight: 'Đà Lạt ngàn hoa, Cao nguyên Langbiang (UNESCO), Thác Dambri, Đồi chè Cầu Đất',
  },
  'dong-nai': {
    icon: '🌳',
    heritageType: 'Khu Dự Trữ Sinh Quyển',
    highlight: 'Vườn quốc gia Cát Tiên (UNESCO), Chiến khu Đ, Làng gốm Biên Hòa',
  },
  'ho-chi-minh': {
    icon: '🏙️',
    heritageType: 'Đô Thị Hạt Nhân',
    highlight: 'Bến Nhà Rồng, Chợ Bến Thành, Dinh Độc Lập, Địa đạo Củ Chi',
  },
  'tay-ninh': {
    icon: '☀️',
    heritageType: 'Nóc Nhà Nam Bộ',
    highlight: 'Núi Bà Đen linh thiêng, Tòa Thánh Tây Ninh, Bánh tráng phơi sương Trảng Bàng',
  },
  'an-giang': {
    icon: '🛶',
    heritageType: 'Thất Sơn Bảy Núi',
    highlight: 'Rừng tràm Trà Sư, Miếu Bà Chúa Xứ Núi Sam, Lễ hội Đua bò Bảy Núi',
  },
  'can-tho': {
    icon: '🍉',
    heritageType: 'Thủ Phủ Miền Tây',
    highlight: 'Chợ nổi Cái Răng, Nhà cổ Bình Thủy, Bến Ninh Kiều thi vị',
  },
  'vinh-long': {
    icon: '🌴',
    heritageType: 'Vương Quốc Cù Lao',
    highlight: 'Cù lao An Bình, Lò gạch Mang Thít, Chợ nổi Trà Ôn, Miệt vườn trù phú',
  },
  'ca-mau': {
    icon: '🦀',
    heritageType: 'Mũi Cực Nam',
    highlight: 'Mũi Cà Mau, Vườn quốc gia Mũi Cà Mau, Rừng đước U Minh Hạ',
  },
};

/**
 * Get cultural specialty and highlight info for a province ID
 */
export function getProvinceSpecialty(id: string | null | undefined): ProvinceCulturalSpecialty | undefined {
  if (!id) return undefined;
  return PROVINCE_CULTURAL_SPECIALTIES[id] || {
    icon: '📍',
    heritageType: 'Di Tích Di Sản',
    highlight: 'Khám phá văn hóa, phong cảnh và ẩm thực địa phương.',
  };
}

/**
 * Get province item by ID (e.g., 'ha-noi', 'ho-chi-minh', 'hue')
 */
export function getProvinceById(id: string | null | undefined): ProvinceMapItem | undefined {
  if (!id) return undefined;
  return VIETNAM_34_PROVINCES.find((p) => p.id === id);
}

/**
 * Search provinces by name or merge info (accent-insensitive)
 */
export function searchProvincesByName(query: string): ProvinceMapItem[] {
  if (!query.trim()) return VIETNAM_34_PROVINCES;
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return VIETNAM_34_PROVINCES.filter((p) => {
    const normName = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normMerge = p.mergeInfo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normName.includes(q) || normMerge.includes(q);
  });
}

/**
 * Clamp zoom scale within bounds
 */
export function clampZoom(scale: number, min = 1.0, max = 2.5): number {
  return Math.min(max, Math.max(min, scale));
}

export { VIETNAM_34_PROVINCES, VIETNAM_ISLANDS, VIETNAM_MAP_DIMENSIONS, VIETNAM_REGION_VIEWBOXES, type ProvinceMapItem };

