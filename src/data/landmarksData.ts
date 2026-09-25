import picHue from '@/assets/pictures/1789477888834_3466390194730922005_g2285579428170464438_97fb29714b65f3e4f91196487a1510be.jpg';
import picDongHo from '@/assets/pictures/1789477897671_3466390194730922005_g2285579428170464438_208c3b16036482dde07954a98eba6f37.jpg';
import picAoDai from '@/assets/pictures/1789477908863_3466390194730922005_g2285579428170464438_43e95faf8835448ecde377e2b7447d69.jpg';

export interface LandmarkArticle {
  id: string;
  name: string;
  region: string;
  locationNameVi: string;
  pinCoordinates: { x: number; y: number };
  title: string;
  titleVi: string;
  subtitle: string;
  excerptEn: string;
  excerptVi: string;
  category: string;
  level: string;
  image: string;
  readTime: string;
  vocabHighlights: string[];
}

export const VIETNAM_LANDMARKS: LandmarkArticle[] = [
  {
    id: 'mu-cang-chai',
    name: 'Mù Cang Chải',
    region: 'Tây Bắc',
    locationNameVi: 'Mù Cang Chải • Yên Bái (Tây Bắc)',
    pinCoordinates: { x: 26, y: 13 },
    title: 'Mu Cang Chai Terraces & Highland Agricultural Wisdom',
    titleVi: 'Ruộng Bậc Thang Mù Cang Chải & Tri Thức Nông Nghiệp',
    subtitle: 'Highland harvest season and traditional agricultural wisdom of Hmong villagers.',
    excerptEn: 'Carved directly into steep mountain slopes by Hmong farmers, these golden terraces harvest mountain stream water creating a breathtaking staircase to the sky during autumn harvest season.',
    excerptVi: 'Được bàn tay người H’Mông khắc chạm trực tiếp vào vách núi dốc đứng, những dải ruộng bậc thang vàng óng dẫn nước suối ngàn tạo nên chiếc cầu thang lên mây tuyệt đẹp mùa lúa chín.',
    category: 'Nature',
    level: 'B1',
    image: picDongHo,
    readTime: '4 mins',
    vocabHighlights: ['terraces', 'breathtaking', 'agricultural']
  },
  {
    id: 'hanoi-bat-trang',
    name: 'Hà Nội & Bát Tràng',
    region: 'Đồng Bằng Sông Hồng',
    locationNameVi: 'Hà Nội • Thủ Đô Nghìn Năm Văn Hiến',
    pinCoordinates: { x: 31, y: 16 },
    title: 'Bat Trang Ceramic Heritage: 700 Years of Kiln Arts',
    titleVi: 'Gốm Bát Tràng: 700 Năm Hồn Đất & Lửa Thủ Đô',
    subtitle: '700 years of traditional pottery craftsmanship in Hanoi.',
    excerptEn: 'Nestled along the Red River, Bat Trang artisans transform raw white clay into porcelain masterpieces using ancient crackle glaze technique and hand-painted blue dragon motifs passed through generations.',
    excerptVi: 'Nằm ven dòng sông Hồng, các nghệ nhân Bát Tràng biến đất sét trắng thô thành kiệt tác gốm sứ với kỹ thuật men rạn cổ truyền và họa tiết rồng xanh vẽ tay qua nhiều thế hệ.',
    category: 'Crafts',
    level: 'B2',
    image: picHue,
    readTime: '5 mins',
    vocabHighlights: ['masterpieces', 'crackle glaze', 'motifs']
  },
  {
    id: 'hue-citadel',
    name: 'Cố Đô Huế',
    region: 'Bắc Trung Bộ',
    locationNameVi: 'Cố Đô Huế • Di Sản Triều Nguyễn',
    pinCoordinates: { x: 44, y: 48 },
    title: 'Imperial Hue Citadel Gates & Court Architecture',
    titleVi: 'Cổng Thành & Kiến Trúc Hoàng Cung Cố Đô Huế',
    subtitle: 'Explore 19th-century court architecture and geomancy design along the Perfume River.',
    excerptEn: 'Built under the Nguyen Dynasty in 1804, the Imperial Citadel features ten majestic gates harmoniously aligned with geomancy principles along the Perfume River. Each wooden pavilion reflects royal craftsmanship and court ceremonies.',
    excerptVi: 'Xây dựng dưới thời nhà Nguyễn năm 1804, Hoàng thành Huế sở hữu 10 cổng thành uy nghiêm nằm hài hòa theo triết lý phong thủy sông Hương. Mỗi lầu vọng cảnh phản ánh tinh hoa chạm khắc hoàng gia.',
    category: 'Heritage',
    level: 'B1',
    image: picHue,
    readTime: '5 mins',
    vocabHighlights: ['geomancy', 'pavilion', 'craftsmanship']
  },
  {
    id: 'hoi-an-lanterns',
    name: 'Phố Cổ Hội An',
    region: 'Duyên Hải Nam Trung Bộ',
    locationNameVi: 'Phố Cổ Hội An • Quảng Nam',
    pinCoordinates: { x: 50, y: 54 },
    title: 'Hoi An Lantern Festival & Ancient Silk Craftsmanship',
    titleVi: 'Đêm Hội Hoa Đăng Hội An & Nghề Lụa Cổ Truyền',
    subtitle: 'Full moon rituals and ancient silk craftsmanship along the Thu Bon river.',
    excerptEn: 'On the 14th night of every lunar month, the ancient town of Hoi An switches off electric lights, illuminating streets with thousands of colorful hand-woven silk lanterns floating gracefully on the river.',
    excerptVi: 'Vào đêm 14 âm lịch hàng tháng, phố cổ Hội An tắt toàn bộ ánh đèn điện, thắp sáng các con phố bằng hàng ngàn chiếc đèn lồng lụa thủ công rực rỡ trôi bồng bềnh trên dòng sông Hoài.',
    category: 'Heritage',
    level: 'B1',
    image: picAoDai,
    readTime: '6 mins',
    vocabHighlights: ['illuminating', 'hand-woven', 'folklore']
  },
  {
    id: 'saigon-banh-mi',
    name: 'Thành Phố Hồ Chí Minh',
    region: 'Nam Bộ',
    locationNameVi: 'Sài Gòn - TP. Hồ Chí Minh • Hòn Ngọc Viễn Đông',
    pinCoordinates: { x: 34, y: 79 },
    title: 'The Story of Saigon Banh Mi: A Culinary Evolution',
    titleVi: 'Hành Trình Bánh Mì Sài Gòn: Từ Ngõ Hẻm Ra Thế Giới',
    subtitle: 'From French baguette origins to global street food culinary icon.',
    excerptEn: 'Saigon Banh Mi reinvented the classic French baguette by adding rice flour for extra crispness, stuffed with savory pate, pork cold cuts, pickled daikon, and fresh cilantro. It stands as a symbol of Vietnamese culinary creativity.',
    excerptVi: 'Bánh mì Sài Gòn đã sáng tạo lại chiếc bánh baguette kiểu Pháp bằng cách phối trộn bột gạo cho vỏ giòn rụm, kẹp pate đậm đà, chả lụa, đồ chua và ngò rí. Đây là biểu tượng của sự sáng tạo ẩm thực Việt.',
    category: 'Cuisine',
    level: 'B1',
    image: picDongHo,
    readTime: '4 mins',
    vocabHighlights: ['culinary', 'crispness', 'reinvented']
  }
];
