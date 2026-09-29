export interface LandmarkArticle {
  id: string;
  provinceId: string;
  name: string;
  region: 'north' | 'central' | 'south';
  locationNameVi: string;
  pinCoordinates?: { x: number; y: number };
  offset?: { dx: number; dy: number };
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
  bilingualTerms: { en: string; vi: string }[];
  speakingSentenceEn: string;
  speakingSentenceVi: string;
  desc?: string;
}

export const VIETNAM_LANDMARKS: LandmarkArticle[] = [
  // --- MIỀN BẮC (NORTH) ---
  {
    id: 'hanoi-ca-tru',
    provinceId: 'ha-noi',
    name: 'Phố Cổ & Ca Trù',
    region: 'north',
    locationNameVi: 'Hà Nội • Phố Cổ & Ca Trù Nghìn Năm',
    offset: { dx: -6, dy: -4 },
    title: 'Hanoi Old Quarter & Ca Tru Chamber Music Heritage',
    titleVi: 'Phố Cổ Hà Nội & Ca Trù Nghìn Năm Văn Hiến',
    subtitle: 'Preserving ancient guild streets and UNESCO-recognized chamber singing.',
    excerptEn: 'Narrow ancient guild streets echo with the melancholic rhythmic sounds of the Dan Day lute and bamboo clappers, celebrating Ca Tru chamber singing preserved by Hanoi masters.',
    excerptVi: 'Những con phố nghề cổ kính vang vọng tiếng đàn Đáy trầm bổng và phách tre nhịp nhàng, tôn vinh nghệ thuật Ca Trù di sản được lưu giữ bởi các ca nương Hà Thành.',
    category: 'Heritage',
    level: 'B2',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['melancholic', 'chamber singing', 'clappers'],
    bilingualTerms: [
      { en: 'Ancient guild streets', vi: 'Những con phố nghề cổ kính' },
      { en: 'Preserved musical tapestry', vi: 'Dải lụa âm nhạc cổ bảo tồn' }
    ],
    speakingSentenceEn: 'Hanoi Old Quarter is famous for its 36 guild streets and ancient Ca Tru chamber music performances.',
    speakingSentenceVi: 'Phố cổ Hà Nội nổi tiếng với 36 phố phường và các buổi biểu diễn Ca Trù di sản cổ truyền.',
    desc: 'Thủ đô ngàn năm văn hiến • Phố cổ & Ca trù'
  },
  {
    id: 'hanoi-hoang-thanh',
    provinceId: 'ha-noi',
    name: 'Hoàng Thành Thăng Long',
    region: 'north',
    locationNameVi: 'Hà Nội • Hoàng Thành Thăng Long (UNESCO)',
    offset: { dx: 6, dy: 5 },
    title: 'Imperial Citadel of Thang Long Heritage',
    titleVi: 'Hoàng Thành Thăng Long: Dấu Ấn Đế Đô',
    subtitle: 'Over a thousand years of political power and monumental archaeology.',
    excerptEn: 'Standing as a resilient testament to over a millennium of Vietnamese history, the Imperial Citadel preserves ancient relics from the Ly, Tran, and Le dynasties.',
    excerptVi: 'Là minh chứng hào hùng cho hơn một thiên niên kỷ lịch sử dân tộc, Hoàng thành Thăng Long lưu giữ tầng tầng di tích của các triều đại Lý, Trần, Lê.',
    category: 'Heritage',
    level: 'B2',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['monumental', 'millennium', 'archaeology'],
    bilingualTerms: [
      { en: 'Imperial relic precinct', vi: 'Khu di tích hoàng thành cổ' },
      { en: 'Centuries of dynastic rule', vi: 'Hàng thế kỷ triều đại kế thừa' }
    ],
    speakingSentenceEn: 'The Imperial Citadel of Thang Long is an outstanding UNESCO world cultural heritage site in Hanoi.',
    speakingSentenceVi: 'Hoàng thành Thăng Long là di sản văn hóa thế giới UNESCO đặc sắc tại trung tâm thủ đô Hà Nội.'
  },
  {
    id: 'trang-an',
    provinceId: 'ha-noi', // Map pin region anchor
    name: 'Tràng An Ninh Bình',
    region: 'north',
    locationNameVi: 'Tràng An • Ninh Bình (Di Sản Thế Giới)',
    pinCoordinates: { x: 35, y: 22 },
    title: 'Trang An Landscape Complex: Water Caves & Karsts',
    titleVi: 'Quần Thể Danh Thắng Tràng An: Hang Động & Núi Đá Vôi',
    subtitle: 'UNESCO dual heritage site of limestone towers and emerald waterways.',
    excerptEn: 'Gliding along emerald rivers bordered by towering karst peaks, sampan rowers navigate through mystical subterranean water caves in Trang An heritage sanctuary.',
    excerptVi: 'Lướt nhẹ trên dòng sông xanh ngọc bích quanh co giữa núi đá vôi sừng sững, thuyền nan đưa du khách qua những hang động xuyên thủy kỳ bí tại di sản Tràng An.',
    category: 'Nature',
    level: 'B1',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['karst peaks', 'subterranean', 'sanctuary'],
    bilingualTerms: [
      { en: 'Subterranean water caves', vi: 'Hang động xuyên thủy kỳ bí' },
      { en: 'Towering karst peaks', vi: 'Dải núi đá vôi sừng sững' }
    ],
    speakingSentenceEn: 'Trang An in Ninh Binh is a UNESCO dual heritage famous for its spectacular limestone karst landscape and river boat tours.',
    speakingSentenceVi: 'Tràng An Ninh Bình là di sản thế giới UNESCO nổi tiếng với danh thắng núi đá vôi và tour đi thuyền trên sông.'
  },
  {
    id: 'sapa-terraces',
    provinceId: 'lao-cai',
    name: 'Sa Pa & Mù Cang Chải',
    region: 'north',
    locationNameVi: 'Sa Pa & Mù Cang Chải • Tây Bắc',
    pinCoordinates: { x: 24, y: 12 },
    title: 'Sapa Terraced Valleys & Highland Ethno-Culture',
    titleVi: 'Thung Lũng Bậc Thang Sa Pa & Bản Sắc Tây Bắc',
    subtitle: 'Highland harvest terraces and vibrant ethnic markets.',
    excerptEn: 'Carved directly into steep mountain slopes, golden rice terraces create a breathtaking staircase to the clouds during autumn harvest in the Hoang Lien Son range.',
    excerptVi: 'Được chạm khắc vào vách núi dốc đứng, những dải ruộng bậc thang vàng óng tạo nên chiếc cầu thang lên mây tuyệt đẹp mùa lúa chín vùng Hoàng Liên Sơn.',
    category: 'Nature',
    level: 'B1',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['sculpted terraces', 'highland harvest', 'staircase'],
    bilingualTerms: [
      { en: 'Sculpted mountain terraces', vi: 'Ruộng bậc thang chạm khắc núi' },
      { en: 'Mist-shrouded valleys', vi: 'Thung lũng mây giăng huyền ảo' }
    ],
    speakingSentenceEn: 'Sapa is renowned for its golden rice terraces and rich ethnic minority cultural markets.',
    speakingSentenceVi: 'Sa Pa nổi tiếng với những thửa ruộng bậc thang mùa lúa chín và bản sắc văn hóa các dân tộc.'
  },
  {
    id: 'quan-ho-bac-ninh',
    provinceId: 'bac-ninh',
    name: 'Quan Họ Bắc Ninh',
    region: 'north',
    locationNameVi: 'Bắc Ninh • Dân Ca Quan Họ Kinh Bắc',
    pinCoordinates: { x: 34, y: 15 },
    title: 'Quan Ho Folk Duets & Kinh Bac Village Festivals',
    titleVi: 'Dân Ca Quan Họ Bắc Ninh & Lễ Hội Vùng Kinh Bắc',
    subtitle: 'Antiphonal singing tradition of friendship and hospitality.',
    excerptEn: 'Clad in traditional four-panel dresses and conical hats, Quan Ho singers exchange soul-stirring antiphonal duets of friendship and profound hospitality.',
    excerptVi: 'Khoác lên mình áo tứ thân và nón lá ba tầm, các liền anh liền chị Quan Họ trao nhau những câu hát đối đáp mượt mà thắm thiết tình tri kỷ.',
    category: 'Heritage',
    level: 'B1',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['antiphonal duets', 'hospitality', 'conical hat'],
    bilingualTerms: [
      { en: 'Antiphonal folk duets', vi: 'Câu hát đối đáp mượt mà' },
      { en: 'Profound hospitality', vi: 'Tình tri kỷ thắm thiết' }
    ],
    speakingSentenceEn: 'Quan Ho singing is a UNESCO intangible heritage celebrated for its harmonious call-and-response folk duets.',
    speakingSentenceVi: 'Dân ca Quan Họ Bắc Ninh là di sản phi vật thể UNESCO tôn vinh lối hát đối đáp giao duyên mượt mà.'
  },

  // --- MIỀN TRUNG (CENTRAL) ---
  {
    id: 'hue-citadel',
    provinceId: 'hue',
    name: 'Đại Nội Huế',
    region: 'central',
    locationNameVi: 'Cố Đô Huế • Nhã Nhạc Hoàng Cung',
    offset: { dx: -5, dy: -3 },
    title: 'Imperial Hue Court Architecture & Royal Nha Nhac',
    titleVi: 'Cổng Thành Hoàng Cung & Nhã Nhạc Cố Đô Huế',
    subtitle: 'Nguyen Dynasty imperial citadel and UNESCO royal court music.',
    excerptEn: 'Built under the Nguyen Dynasty in 1804, the Imperial Citadel features majestic gates harmoniously aligned with geomancy along the Perfume River, serenaded by royal Nha Nhac court music.',
    excerptVi: 'Xây dựng thời nhà Nguyễn năm 1804, Hoàng thành Huế sở hữu cổng thành uy nghiêm chuẩn phong thủy bên sông Hương, vang vọng giai điệu Nhã nhạc cung đình triều đại.',
    category: 'Heritage',
    level: 'B1',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['geomancy', 'pavilion', 'court music'],
    bilingualTerms: [
      { en: 'Royal court music', vi: 'Nhã nhạc cung đình triều Nguyễn' },
      { en: 'Imperial geomancy design', vi: 'Kiến trúc hoàng cung chuẩn phong thủy' }
    ],
    speakingSentenceEn: 'Hue Imperial City is famous for its 19th-century royal citadel architecture and UNESCO Nha Nhac court music.',
    speakingSentenceVi: 'Cố đô Huế nổi tiếng với kiến trúc hoàng thành thế kỷ 19 và di sản Nhã nhạc cung đình UNESCO.'
  },
  {
    id: 'hue-thien-mu',
    provinceId: 'hue',
    name: 'Chùa Thiên Mụ',
    region: 'central',
    locationNameVi: 'Huế • Chùa Thiên Mụ & Sông Hương',
    offset: { dx: 6, dy: 4 },
    title: 'Thien Mu Pagoda: Spiritual Icon of the Perfume River',
    titleVi: 'Chùa Thiên Mụ & Tháp Phước Duyên Bên Dòng Sông Hương',
    subtitle: 'Seven-tiered octagonal pagoda echoing across misty waters.',
    excerptEn: 'Perched on Ha Khe hill overlooking the serene Perfume River, the iconic octagonal tower of Thien Mu Pagoda has inspired poets and monks for centuries.',
    excerptVi: 'Tọa lạc trên đồi Hà Khê soi bóng xuống dòng sông Hương thơ mộng, tháp Phước Duyên bát giác chùa Thiên Mụ là biểu tượng tâm linh bất hủ của xứ Huế.',
    category: 'Heritage',
    level: 'B1',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['octagonal tower', 'serene', 'monastic'],
    bilingualTerms: [
      { en: 'Octagonal pagoda tower', vi: 'Tháp chùa hình bát giác' },
      { en: 'Spiritual sanctuary', vi: 'Chốn thanh tịnh tâm linh' }
    ],
    speakingSentenceEn: 'Thien Mu Pagoda is the oldest and most revered pagoda in the ancient city of Hue.',
    speakingSentenceVi: 'Chùa Thiên Mụ là ngôi chùa cổ kính và tôn nghiêm bậc nhất của cố đô Huế.'
  },
  {
    id: 'hoi-an-lanterns',
    provinceId: 'da-nang',
    name: 'Phố Cổ Hội An',
    region: 'central',
    locationNameVi: 'Phố Cổ Hội An • Đà Nẵng & Quảng Nam',
    offset: { dx: 3, dy: 2 },
    title: 'Hoi An Ancient Lantern Alleys & Silk Craftsmanship',
    titleVi: 'Đêm Hội Hoa Đăng Hội An & Nghề Dệt Lụa Cổ Truyền',
    subtitle: 'Full moon silk lantern festival along the Hoai River.',
    excerptEn: 'On full moon nights, the ancient trading port switches off electric lights, illuminating streets with thousands of colorful hand-woven silk lanterns floating gracefully on the water.',
    excerptVi: 'Vào đêm rằm hàng tháng, thương cảng cổ tắt toàn bộ ánh đèn điện, thắp sáng các con phố bằng hàng ngàn chiếc đèn lồng lụa thủ công rực rỡ trôi bồng bềnh trên dòng sông.',
    category: 'Heritage',
    level: 'B1',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['illuminating', 'hand-woven', 'trading port'],
    bilingualTerms: [
      { en: 'Ancient lantern-lit alleys', vi: 'Ngõ phố cổ rực rỡ đèn lồng' },
      { en: 'Preserved architectural tapestry', vi: 'Dải lụa kiến trúc cổ bảo tồn' }
    ],
    speakingSentenceEn: 'Hoi An Ancient Town captivates visitors with its yellow heritage houses and monthly full moon lantern festivals.',
    speakingSentenceVi: 'Phố cổ Hội An cuốn hút du khách bởi những ngôi nhà di sản vàng tươi và đêm hội hoa đăng huyền ảo.'
  },
  {
    id: 'tay-nguyen-cong-chieng',
    provinceId: 'lam-dong',
    name: 'Tây Nguyên Cồng Chiêng',
    region: 'central',
    locationNameVi: 'Tây Nguyên • Không Gian Văn Hóa Cồng Chiêng',
    offset: { dx: 0, dy: 0 },
    title: 'Central Highlands Gong Culture & Communal Houses',
    titleVi: 'Tây Nguyên: Không Gian Văn Hóa Cồng Chiêng & Nhà Rông',
    subtitle: 'Sacred bronze gong ensembles echo through mountain forests.',
    excerptEn: 'Gathered around bonfire flames by majestic communal Rong houses, ethnic villagers play sacred bronze gongs connecting tribal communities to mountain spirits.',
    excerptVi: 'Vây quanh bếp lửa bập bùng bên mái nhà Rông uy nghiêm, đồng bào Tây Nguyên diễn tấu tiếng cồng chiêng linh thiêng gắn kết cộng đồng với đại ngàn.',
    category: 'Heritage',
    level: 'B2',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['gong ensembles', 'bonfire', 'communal house'],
    bilingualTerms: [
      { en: 'Sacred bronze gong resonance', vi: 'Tiếng cồng chiêng linh thiêng đại ngàn' },
      { en: 'Majestic communal Rong house', vi: 'Mái nhà Rông Tây Nguyên uy nghiêm' }
    ],
    speakingSentenceEn: 'The Cultural Space of Gong in the Central Highlands is a UNESCO Intangible Cultural Heritage of Humanity.',
    speakingSentenceVi: 'Không gian văn hóa Cồng chiêng Tây Nguyên là di sản văn hóa phi vật thể đại diện của nhân loại.'
  },

  // --- MIỀN NAM (SOUTH) ---
  {
    id: 'saigon-icon',
    provinceId: 'ho-chi-minh',
    name: 'Chợ Bến Thành & Bánh Mì',
    region: 'south',
    locationNameVi: 'Sài Gòn • Trung Tâm Bến Thành & Bánh Mì',
    offset: { dx: -5, dy: 3 },
    title: 'Saigon Urban Pulse: Colonial Landmarks & Banh Mi Culture',
    titleVi: 'Sài Gòn: Nhịp Sống Đô Thị & Văn Hóa Bánh Mì',
    subtitle: 'Dynamic economic hub blending French colonial icons with street food dynamism.',
    excerptEn: 'Saigon blends historic French colonial landmarks like Notre Dame Cathedral with sleek modern skyscrapers and iconic street food corners serving crispy Banh Mi.',
    excerptVi: 'Sài Gòn giao thoa giữa các công trình kiến trúc cổ như Nhà thờ Đức Bà với các tòa tháp hiện đại và những góc phố ẩm thực lừng danh bánh mì giòn rụm.',
    category: 'Cuisine',
    level: 'B1',
    image: 'https://images.unsplash.com/photo-1626804475297-41608e074eb1?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['urban pulse', 'colonial landmarks', 'dynamism'],
    bilingualTerms: [
      { en: 'Dynamic street food culture', vi: 'Văn hóa ẩm thực đường phố sôi động' },
      { en: 'Colonial architectural blend', vi: 'Giao thoa kiến trúc cổ điển & hiện đại' }
    ],
    speakingSentenceEn: 'Saigon is Vietnam’s largest city, famous for its vibrant street food scene and rich historical landmarks.',
    speakingSentenceVi: 'Sài Gòn là thành phố lớn nhất Việt Nam, nổi tiếng với ẩm thực đường phố sôi động và di sản lịch sử.'
  },
  {
    id: 'saigon-cu-chi',
    provinceId: 'ho-chi-minh',
    name: 'Địa Đạo Củ Chi',
    region: 'south',
    locationNameVi: 'Sài Gòn • Địa Đạo Củ Chi Di Tích Lịch Sử',
    offset: { dx: 6, dy: -6 },
    title: 'Cu Chi Tunnels: Underground Historic Wonder',
    titleVi: 'Địa Đạo Củ Chi: Kỳ Tích Trong Lòng Đất',
    subtitle: 'Immense subterranean labyrinth reflecting wartime resilience.',
    excerptEn: 'Spanning hundreds of kilometers beneath the jungle floor, the intricate Cu Chi tunnel network housed whole communities during wartime defense.',
    excerptVi: 'Trải dài hàng trăm kilomet dưới lòng đất, hệ thống địa đạo Củ Chi kỳ vĩ từng là căn cứ bảo vệ quân dân trong những năm tháng kháng chiến oanh liệt.',
    category: 'Heritage',
    level: 'B2',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['subterranean', 'resilience', 'labyrinth'],
    bilingualTerms: [
      { en: 'Underground tunnel network', vi: 'Mạng lưới hầm địa đạo' },
      { en: 'Wartime resilience', vi: 'Ý chí kiên cường thời chiến' }
    ],
    speakingSentenceEn: 'Cu Chi Tunnels is an astonishing subterranean historic system located northwest of Ho Chi Minh City.',
    speakingSentenceVi: 'Địa đạo Củ Chi là một công trình lịch sử ngầm kỳ vĩ nằm ở phía tây bắc TP. Hồ Chí Minh.'
  },
  {
    id: 'cai-rang-floating-market',
    provinceId: 'can-tho',
    name: 'Chợ Nổi Cái Răng',
    region: 'south',
    locationNameVi: 'Cần Thơ • Chợ Nổi Cái Răng & Sông Nước Mekong',
    offset: { dx: -5, dy: 3 },
    title: 'Cai Rang Floating Market & Mekong Riverine Commerce',
    titleVi: 'Chợ Nổi Cái Răng & Văn Hóa Sông Nước Miền Tây',
    subtitle: 'Bustling dawn trading boats on the waterways of the Mekong Delta.',
    excerptEn: 'At sunrise, hundreds of wooden boats congregate on the river, displaying tropical fruits on bamboo sample poles ("Beo") in a vibrant generational trade tradition.',
    excerptVi: 'Khi bình minh vừa hế hé, hàng trăm chiếc ghe xuồng tụ hội trên dòng sông, treo nông sản lên cây bẹo truyền thống tạo nên bức tranh thương hồ sông nước rực rỡ.',
    category: 'Customs',
    level: 'B1',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['riverine commerce', 'sample poles', 'congregate'],
    bilingualTerms: [
      { en: 'Bustling riverine commerce', vi: 'Nét thương hồ sông nước tấp nập' },
      { en: 'Generational trade tradition', vi: 'Truyền thống buôn bán qua nhiều thế hệ' }
    ],
    speakingSentenceEn: 'Cai Rang Floating Market in Can Tho is the largest wholesale floating market in the Mekong Delta region.',
    speakingSentenceVi: 'Chợ nổi Cái Răng ở Cần Thơ là chợ nổi bán buôn lớn nhất vùng đồng bằng sông Cửu Long.'
  },
  {
    id: 'can-tho-binh-thuy',
    provinceId: 'can-tho',
    name: 'Nhà Cổ Bình Thủy',
    region: 'south',
    locationNameVi: 'Cần Thơ • Nhà Cổ Bình Thủy Thế Kỷ 19',
    offset: { dx: 6, dy: -4 },
    title: 'Binh Thuy Ancient House: French-Vietnamese Heritage Estate',
    titleVi: 'Nhà Cổ Bình Thủy: Di Sản Kiến Trúc Đông Dương',
    subtitle: 'Exquisite 1870 French-Vietnamese aristocratic mansion.',
    excerptEn: 'Built in 1870 by the Duong family, Binh Thuy Ancient House seamlessly fuses ornate French colonial neoclassical architecture with traditional Southern Vietnamese woodwork.',
    excerptVi: 'Xây dựng năm 1870 bởi dòng họ Dương, nhà cổ Bình Thủy kết hợp tinh tế giữa kiến trúc tân cổ điển Pháp với nghệ thuật chạm khắc gỗ cổ truyền Nam Bộ.',
    category: 'Heritage',
    level: 'B2',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['aristocratic', 'neoclassical', 'woodwork'],
    bilingualTerms: [
      { en: 'French colonial neoclassical', vi: 'Kiến trúc tân cổ điển Pháp' },
      { en: 'Ornate wooden carving', vi: 'Nghệ thuật chạm khắc gỗ tinh xảo' }
    ],
    speakingSentenceEn: 'Binh Thuy Ancient House is a prime architectural treasure of Can Tho and the entire Mekong Delta.',
    speakingSentenceVi: 'Nhà cổ Bình Thủy là kiệt tác di sản kiến trúc tiêu biểu của Cần Thơ và miền Tây Nam Bộ.'
  },
  {
    id: 'don-ca-tai-tu',
    provinceId: 'tien-giang',
    name: 'Đờn Ca Tài Tử',
    region: 'south',
    locationNameVi: 'Đồng Bằng Sông Cửu Long • Đờn Ca Tài Tử',
    offset: { dx: 0, dy: 0 },
    title: 'Don Ca Tai Tu: Southern Folk Music & Moon Lute Melodies',
    titleVi: 'Đờn Ca Tài Tử: Âm Nhạc Dân Gian Nam Bộ',
    subtitle: 'Soulful southern improvisational folk music along peaceful canals.',
    excerptEn: 'Improvised by musicians on Moon lutes and zithers under fruit orchard shadows, Don Ca Tai Tu expresses the heartwarming emotional spirit of Southern people.',
    excerptVi: 'Được diễn tấu ngẫu hứng bởi các nghệ nhân đệm đàn Kìm, đàn Tranh dưới bóng vườn cây trái, Đờn ca tài tử thể hiện tâm hồn phóng khoáng, tình nghĩa của người miền Nam.',
    category: 'Heritage',
    level: 'B1',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['improvisational', 'moon lute', 'orchard shadows'],
    bilingualTerms: [
      { en: 'Soulful improvisational melodies', vi: 'Giai điệu ngẫu hứng da diết' },
      { en: 'Orchard chamber acoustics', vi: 'Âm sắc mộc mạc miệt vườn' }
    ],
    speakingSentenceEn: 'Don Ca Tai Tu is an UNESCO intangible folk music art form deeply rooted in Southern Vietnamese life.',
    speakingSentenceVi: 'Đờn ca tài tử là di sản âm nhạc dân gian phi vật thể UNESCO gắn liền với đời sống người dân Nam Bộ.'
  }
];
