export interface HomeStoryRecommendation {
  id: string;
  titleEn: string;
  titleVi: string;
  category: 'Cuisine' | 'Heritage' | 'Crafts' | 'Nature' | 'Folklore';
  categoryVi: string;
  imageUrl: string;
  readTime: string;
  preferredLevel: 'Level 1' | 'Level 2' | 'Level 3';
}

export const FEATURED_HOME_STORIES: HomeStoryRecommendation[] = [
  {
    id: 'pho-hanoi-history',
    titleEn: 'Pho: The Soul of Vietnamese Food Culture',
    titleVi: 'Phở Hà Nội: Linh Hồn Của Văn Hóa Ẩm Thực',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/pho-hanoi.webp',
    readTime: '3 min read',
    preferredLevel: 'Level 1',
  },
  {
    id: 'thang-co-1',
    titleEn: 'Thang Co: Flavours Around the Highland Cauldron',
    titleVi: 'Thắng Cố Bắc Hà: Hương Vị Bên Chảo Lửa Vùng Cao',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/thang-co.jpg',
    readTime: '3 min read',
    preferredLevel: 'Level 1',
  },
  {
    id: 'khau-nhuc-lang-son-1',
    titleEn: 'Khau Nhuc: A Dish That Crossed Borders',
    titleVi: 'Khâu Nhục Lạng Sơn: Khi Món Ăn Vượt Qua Biên Giới',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/khau-nhuc.jpg',
    readTime: '3 min read',
    preferredLevel: 'Level 1',
  },
  {
    id: 'bun-cha-grilling-secrets',
    titleEn: "Bun Cha: A Taste of Hanoi's Culture",
    titleVi: 'Bún Chả Hà Nội: Hương Vị Đời Sống Văn Hóa',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/bun-cha.webp',
    readTime: '3 min read',
    preferredLevel: 'Level 1',
  },
  {
    id: 'cha-ca-legend-history',
    titleEn: 'Cha Ca La Vong: From Family Recipe to Heritage',
    titleVi: 'Chả Cá Lã Vọng: Từ Món Gia Truyền Đến Di Sản',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/cha-ca-la-vong.webp',
    readTime: '3 min read',
    preferredLevel: 'Level 1',
  },
  {
    id: 'ca-kho-nam-cao-village',
    titleEn: 'Vu Dai Braised Fish: From Village Dish to Tradition',
    titleVi: 'Cá Kho Làng Vũ Đại: Từ Món Giản Dị Đến Đặc Sản',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/ca-kho-vu-dai.webp',
    readTime: '3 min read',
    preferredLevel: 'Level 1',
  },
  {
    id: 'goi-ca-nhech-1',
    titleEn: 'Cá Nhệch: From Brackish Waters to the Table',
    titleVi: 'Gỏi Cá Nhệch Kim Sơn: Từ Vùng Nước Lợ Đến Bàn Ăn',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/goi-ca-nhech.jpg',
    readTime: '3 min read',
    preferredLevel: 'Level 1',
  },
  {
    id: 'be-chao-1',
    titleEn: 'Bê Chao: Dairy Farming and a Moc Chau Specialty',
    titleVi: 'Bê Chao Mộc Châu: Đặc Sản Cao Nguyên Xứ Sương Mù',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/be-chao.jpg',
    readTime: '3 min read',
    preferredLevel: 'Level 1',
  },
  {
    id: 'xoi-nep-nuong-1',
    titleEn: 'Nếp Nương: The Sacred Sticky Rice of Mai Chau',
    titleVi: 'Xôi Nếp Nương Mai Châu: Hạt Ngọc Thung Lũng Tây Bắc',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/xoi-nep-nuong.jpg',
    readTime: '3 min read',
    preferredLevel: 'Level 1',
  },
  {
    id: 'com-chay-crispy-heritage',
    titleEn: 'Com Chay: Crispy Rice of the Ancient Capital',
    titleVi: 'Cơm Cháy Ninh Bình: Nét Giòn Thơm Đất Cố Đô',
    category: 'Cuisine',
    categoryVi: 'Ẩm thực & Cà phê',
    imageUrl: '/images/series/com-chay-ninh-binh.webp',
    readTime: '3 min read',
    preferredLevel: 'Level 2',
  },
  {
    id: 'banh-cay-village-heritage',
    titleEn: 'Banh Cay: Royal Tribute Cake of Nguyen Village',
    titleVi: 'Bánh Cáy Làng Nguyễn: Thức Quà Tiến Vua Đất Thái Bình',
    category: 'Crafts',
    categoryVi: 'Nghệ thuật & Làng nghề',
    imageUrl: '/images/series/banh-cay-thai-binh.webp',
    readTime: '3 min read',
    preferredLevel: 'Level 2',
  },
];
