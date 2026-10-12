export interface LandmarkArticle {
  id: string;
  provinceId: string;
  name: string;
  region: 'north' | 'central' | 'south' | 'all';
  locationNameVi: string;
  coordinates?: { lat: number; lng: number };
  pinCoordinates?: { x: number; y: number };
  offset?: { dx: number; dy: number };
  title: string;
  titleVi: string;
  subtitle: string;
  excerptEn: string;
  excerptVi: string;
  category: 'Heritage' | 'Cuisine' | 'Crafts' | 'Nature' | 'Folklore';
  level: string;
  image: string;
  readTime: string;
  vocabHighlights: string[];
  bilingualTerms: { en: string; vi: string }[];
  speakingSentenceEn: string;
  speakingSentenceVi: string;
  desc?: string;
  isNational?: boolean;
}

export const VIETNAM_LANDMARKS: LandmarkArticle[] = [
  // ==========================================
  // MIỀN BẮC (NORTHERN VIETNAM)
  // ==========================================
  {
    id: 'ha-long-bay',
    provinceId: 'quang-ninh',
    name: 'Vịnh Hạ Long',
    region: 'north',
    category: 'Nature',
    coordinates: { lat: 20.9101, lng: 107.1839 },
    offset: { dx: 0, dy: 0 },
    locationNameVi: 'Quảng Ninh • Vịnh Hạ Long (UNESCO)',
    title: 'Ha Long Bay: Myths of the Descending Dragon',
    titleVi: 'Vịnh Hạ Long: Truyền Thuyết Rồng Đáp Xuống Biển',
    subtitle: 'UNESCO natural wonder with thousands of towering emerald limestone karsts.',
    excerptEn: 'Rising dramatically from the emerald waters of the Gulf of Tonkin, thousands of sculpted limestone isles and hidden grottoes tell the ancient legend of celestial dragons descending to protect Vietnam.',
    excerptVi: 'Vươn mình sừng sững giữa làn nước ngọc bích của Vịnh Bắc Bộ, hàng ngàn đảo đá vôi và hang động kỳ vĩ khắc họa truyền thuyết rồng mẹ hạ phàm bảo vệ bờ cõi nước Nam.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    readTime: '6 mins',
    vocabHighlights: ['limestone karsts', 'descending dragon', 'emerald waters'],
    bilingualTerms: [
      { en: 'Sculpted limestone isles', vi: 'Những đảo đá vôi kỳ vĩ' },
      { en: 'Sublime seascape', vi: 'Cảnh quan biển cả tráng lệ' }
    ],
    speakingSentenceEn: 'Ha Long Bay is a world-renowned UNESCO natural heritage site in Quang Ninh Province.',
    speakingSentenceVi: 'Vịnh Hạ Long là di sản thiên nhiên thế giới UNESCO nổi tiếng tại tỉnh Quảng Ninh.',
    desc: 'Kỳ quan thiên nhiên thế giới • Non nước nghìn năm'
  },
  {
    id: 'sapa-terraces',
    provinceId: 'lao-cai',
    name: 'Sa Pa & Mù Cang Chải',
    region: 'north',
    category: 'Nature',
    coordinates: { lat: 22.3364, lng: 103.8438 },
    offset: { dx: -4, dy: -4 },
    locationNameVi: 'Sa Pa & Mù Cang Chải • Tây Bắc',
    title: 'Sapa Terraced Valleys & Highland Ethno-Culture',
    titleVi: 'Thung Lũng Bậc Thang Sa Pa & Bản Sắc Tây Bắc',
    subtitle: 'Highland harvest terraces and vibrant ethnic markets.',
    excerptEn: 'Carved directly into steep mountain slopes, golden rice terraces create a breathtaking staircase to the clouds during autumn harvest in the Hoang Lien Son range.',
    excerptVi: 'Được chạm khắc vào vách núi dốc đứng, những dải ruộng bậc thang vàng óng tạo nên chiếc cầu thang lên mây tuyệt đẹp mùa lúa chín vùng Hoàng Liên Sơn.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['sculpted terraces', 'highland harvest', 'staircase'],
    bilingualTerms: [
      { en: 'Sculpted mountain terraces', vi: 'Ruộng bậc thang chạm khắc núi' },
      { en: 'Mist-shrouded valleys', vi: 'Thung lũng mây giăng huyền ảo' }
    ],
    speakingSentenceEn: 'Sapa is renowned for its golden rice terraces and rich ethnic minority cultural markets.',
    speakingSentenceVi: 'Sa Pa nổi tiếng với những thửa ruộng bậc thang mùa lúa chín và bản sắc văn hóa các dân tộc.',
    desc: 'Ruộng bậc thang hùng vĩ • Đỉnh Fansipan 3.143m'
  },
  {
    id: 'trang-an',
    provinceId: 'ninh-binh',
    name: 'Tràng An Ninh Bình',
    region: 'north',
    category: 'Nature',
    coordinates: { lat: 20.2506, lng: 105.9042 },
    offset: { dx: 0, dy: 0 },
    locationNameVi: 'Tràng An • Ninh Bình (Di Sản Kép UNESCO)',
    title: 'Trang An Landscape Complex: Water Caves & Karsts',
    titleVi: 'Quần Thể Danh Thắng Tràng An: Hang Động & Núi Đá Vôi',
    subtitle: 'UNESCO dual heritage site of limestone towers and emerald waterways.',
    excerptEn: 'Gliding along emerald rivers bordered by towering karst peaks, sampan rowers navigate through mystical subterranean water caves in Trang An heritage sanctuary.',
    excerptVi: 'Lướt nhẹ trên dòng sông xanh ngọc bích quanh co giữa núi đá vôi sừng sững, thuyền nan đưa du khách qua những hang động xuyên thủy kỳ bí tại di sản Tràng An.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['karst peaks', 'subterranean', 'sanctuary'],
    bilingualTerms: [
      { en: 'Subterranean water caves', vi: 'Hang động xuyên thủy kỳ bí' },
      { en: 'Towering karst peaks', vi: 'Dải núi đá vôi sừng sững' }
    ],
    speakingSentenceEn: 'Trang An in Ninh Binh is a UNESCO dual heritage famous for its spectacular limestone karst landscape and river boat tours.',
    speakingSentenceVi: 'Tràng An Ninh Bình là di sản thế giới UNESCO nổi tiếng với danh thắng núi đá vôi và tour đi thuyền trên sông.',
    desc: 'Di sản thế giới kép UNESCO • Thuyền nan xuyên thủy động'
  },
  {
    id: 'quan-ho-bac-ninh',
    provinceId: 'bac-ninh',
    name: 'Quan Họ Bắc Ninh',
    region: 'north',
    category: 'Folklore',
    coordinates: { lat: 21.1861, lng: 106.0763 },
    offset: { dx: -4, dy: -3 },
    locationNameVi: 'Bắc Ninh • Dân Ca Quan Họ Kinh Bắc',
    title: 'Quan Ho Folk Duets & Kinh Bac Village Festivals',
    titleVi: 'Dân Ca Quan Họ Bắc Ninh & Lễ Hội Vùng Kinh Bắc',
    subtitle: 'Antiphonal singing tradition of friendship and hospitality.',
    excerptEn: 'Clad in traditional four-panel dresses and conical hats, Quan Ho singers exchange soul-stirring antiphonal duets of friendship and profound hospitality.',
    excerptVi: 'Khoác lên mình áo tứ thân và nón quai thao, các liền anh liền chị Quan Họ trao nhau những câu hát đối đáp mượt mà thắm thiết tình tri kỷ.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['antiphonal duets', 'hospitality', 'conical hat'],
    bilingualTerms: [
      { en: 'Antiphonal folk duets', vi: 'Câu hát đối đáp mượt mà' },
      { en: 'Profound hospitality', vi: 'Tình tri kỷ thắm thiết' }
    ],
    speakingSentenceEn: 'Quan Ho singing is a UNESCO intangible heritage celebrated for its harmonious call-and-response folk duets.',
    speakingSentenceVi: 'Dân ca Quan Họ Bắc Ninh là di sản phi vật thể UNESCO tôn vinh lối hát đối đáp giao duyên mượt mà.',
    desc: 'Di sản phi vật thể UNESCO • Liền anh liền chị Kinh Bắc'
  },
  {
    id: 'dong-ho-paintings',
    provinceId: 'bac-ninh',
    name: 'Tranh Đông Hồ',
    region: 'north',
    category: 'Crafts',
    coordinates: { lat: 21.0583, lng: 106.0833 },
    offset: { dx: 4, dy: 4 },
    locationNameVi: 'Bắc Ninh • Làng Tranh Dân Gian Đông Hồ',
    title: 'Dong Ho Folk Woodblock Prints & Natural Pigments',
    titleVi: 'Tranh Dân Gian Đông Hồ Dùng Màu Tự Nhiên',
    subtitle: 'Traditional woodblock paintings on shimmering scallop shell paper.',
    excerptEn: 'Printed on handmade Dzo paper brushed with shimmering scallop shell powder, Dong Ho prints celebrate village festivities, lunar harmony, and cheerful wishes for prosperity.',
    excerptVi: 'Được in mộc bản trên giấy điệp óng ánh vỏ sò, tranh Đông Hồ khắc họa sinh động cảnh làng quê, khúc ca mùa xuân và lời chúc ấm no an lành.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['woodblock prints', 'scallop shell paper', 'prosperity'],
    bilingualTerms: [
      { en: 'Natural mineral pigments', vi: 'Màu vẽ khoáng chất tự nhiên' },
      { en: 'Traditional woodblock print', vi: 'Bản in mộc bản cổ truyền' }
    ],
    speakingSentenceEn: 'Dong Ho folk paintings are handcrafted using natural colors made from tree leaves, ash, and scallop shell powder.',
    speakingSentenceVi: 'Tranh dân gian Đông Hồ được làm thủ công bằng màu sắc tự nhiên từ lá cây, than củi và bột sò điệp.',
    desc: 'Tranh khắc gỗ dân gian • Giấy điệp truyền thống'
  },
  {
    id: 'hanoi-ca-tru',
    provinceId: 'ha-noi',
    name: 'Phố Cổ & Ca Trù',
    region: 'north',
    category: 'Folklore',
    coordinates: { lat: 21.0333, lng: 105.8500 },
    offset: { dx: -6, dy: -4 },
    locationNameVi: 'Hà Nội • Phố Cổ & Ca Trù Nghìn Năm',
    title: 'Hanoi Old Quarter & Ca Tru Chamber Music Heritage',
    titleVi: 'Phố Cổ Hà Nội & Ca Trù Nghìn Năm Văn Hiến',
    subtitle: 'Preserving ancient guild streets and UNESCO-recognized chamber singing.',
    excerptEn: 'Narrow ancient guild streets echo with the melancholic rhythmic sounds of the Dan Day lute and bamboo clappers, celebrating Ca Tru chamber singing preserved by Hanoi masters.',
    excerptVi: 'Những con phố nghề cổ kính vang vọng tiếng đàn Đáy trầm bổng và phách tre nhịp nhàng, tôn vinh nghệ thuật Ca Trù di sản được lưu giữ bởi các ca nương Hà Thành.',
    level: 'Level 2',
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
    category: 'Heritage',
    coordinates: { lat: 21.0350, lng: 105.8417 },
    offset: { dx: 6, dy: 5 },
    locationNameVi: 'Hà Nội • Hoàng Thành Thăng Long (UNESCO)',
    title: 'Imperial Citadel of Thang Long Heritage',
    titleVi: 'Hoàng Thành Thăng Long: Dấu Ấn Đế Đô',
    subtitle: 'Over a thousand years of political power and monumental archaeology.',
    excerptEn: 'Standing as a resilient testament to over a millennium of Vietnamese history, the Imperial Citadel preserves ancient relics from the Ly, Tran, and Le dynasties.',
    excerptVi: 'Là minh chứng hào hùng cho hơn một thiên niên kỷ lịch sử dân tộc, Hoàng thành Thăng Long lưu giữ tầng tầng di tích của các triều đại Lý, Trần, Lê.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['monumental', 'millennium', 'archaeology'],
    bilingualTerms: [
      { en: 'Imperial relic precinct', vi: 'Khu di tích hoàng thành cổ' },
      { en: 'Centuries of dynastic rule', vi: 'Hàng thế kỷ triều đại kế thừa' }
    ],
    speakingSentenceEn: 'The Imperial Citadel of Thang Long is an outstanding UNESCO world cultural heritage site in Hanoi.',
    speakingSentenceVi: 'Hoàng thành Thăng Long là di sản văn hóa thế giới UNESCO đặc sắc tại trung tâm thủ đô Hà Nội.',
    desc: 'Kinh đô Đại Việt nghìn năm • Di sản thế giới UNESCO'
  },
  {
    id: 'bat-trang-pottery',
    provinceId: 'ha-noi',
    name: 'Làng Gốm Bát Tràng',
    region: 'north',
    category: 'Crafts',
    coordinates: { lat: 20.9764, lng: 105.9125 },
    offset: { dx: 5, dy: -6 },
    locationNameVi: 'Hà Nội • Làng Gốm Cổ Bát Tràng',
    title: 'Bat Trang Ceramic Heritage: Centuries of Kiln Mastery',
    titleVi: 'Nghệ Thuật Gốm Sứ Làng Cổ Bát Tràng',
    subtitle: 'Over seven centuries of ceramic arts along the Red River banks.',
    excerptEn: 'Along the Red River, master artisans in Bat Trang mold river silt into translucent porcelain and crackle-glazed ceramics that have adorned palaces worldwide.',
    excerptVi: 'Bên bờ sông Hồng, các nghệ nhân Bát Tràng nhào nặn đất phù sa thành những kiệt tác gốm men rạn và sứ ngọc tinh xảo từng xuất dương đi khắp năm châu.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['crackle glaze', 'porcelain', 'pottery kiln'],
    bilingualTerms: [
      { en: 'Master ceramic artisans', vi: 'Nghệ nhân gốm bậc thầy' },
      { en: 'Crackle-glazed pottery', vi: 'Gốm men rạn cổ truyền' }
    ],
    speakingSentenceEn: 'Bat Trang is a famous 700-year-old pottery village located on the outskirts of Hanoi.',
    speakingSentenceVi: 'Bát Tràng là làng gốm cổ truyền 700 năm tuổi nổi tiếng nằm ở ngoại thành Hà Nội.',
    desc: 'Làng gốm cổ truyền 700 năm • Men rạn tinh hoa'
  },
  {
    id: 'pho-hanoi-history',
    provinceId: 'ha-noi',
    name: 'Phở Hà Nội',
    region: 'north',
    category: 'Cuisine',
    coordinates: { lat: 21.0360, lng: 105.8480 },
    offset: { dx: -5, dy: 5 },
    locationNameVi: 'Hà Nội • Hương Vị Phở Đất Kinh Kỳ',
    title: 'Hanoi Pho: The Soul of Vietnamese Culinary Heritage',
    titleVi: 'Phở Hà Nội: Linh Hồn Ẩm Thực Đất Kinh Kỳ',
    subtitle: 'A fragrant bowl of slow-simmered broth, star anise, and silky rice noodles.',
    excerptEn: 'Simmered for twelve hours with charred ginger, cinnamon, and star anise, Hanoi pho delivers an aromatic clear broth that defines the morning rhythm of the capital.',
    excerptVi: 'Ninh suốt 12 tiếng cùng gừng nướng, quế chi và hoa hồi, nồi nước dùng phở Hà Nội trong veo thơm lừng đánh thức nhịp sống ban mai của thủ đô.',
    level: 'Level 1',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['aromatic broth', 'star anise', 'culinary heritage'],
    bilingualTerms: [
      { en: 'Slow-simmered broth', vi: 'Nước dùng ninh lửa chậm' },
      { en: 'Silky rice noodles', vi: 'Bánh phở mềm mượt' }
    ],
    speakingSentenceEn: 'Hanoi pho is widely celebrated as the culinary symbol of Vietnam.',
    speakingSentenceVi: 'Phở Hà Nội được tôn vinh là biểu tượng tinh hoa của nền ẩm thực Việt Nam.',
    desc: 'Biểu tượng ẩm thực Việt Nam • Nước dùng thanh ngọt'
  },

  // ==========================================
  // MIỀN TRUNG (CENTRAL VIETNAM)
  // ==========================================
  {
    id: 'son-doong-expedition',
    provinceId: 'quang-tri',
    name: 'Hang Sơn Đoòng',
    region: 'central',
    category: 'Nature',
    coordinates: { lat: 17.4569, lng: 106.2875 },
    offset: { dx: 0, dy: 0 },
    locationNameVi: 'Quảng Bình • Hang Sơn Đoòng Di Sản Thế Giới',
    title: "Son Doong: Expedition Into the World's Largest Cave",
    titleVi: 'Sơn Đoòng: Hành Trình Thám Hiểm Hang Động Lớn Nhất Thế Giới',
    subtitle: 'A colossal subterranean kingdom with its own jungle and weather system.',
    excerptEn: 'Deep inside Phong Nha - Ke Bang National Park, Son Doong cave spans vast caverns capable of fitting a 40-story skyscraper, sheltering an underground primeval rainforest and mist clouds.',
    excerptVi: 'Ẩn sâu trong Vườn Quốc gia Phong Nha - Kẻ Bàng, hang Sơn Đoòng sở hữu lòng hang khổng lồ chứa vừa tòa nhà 40 tầng, nuôi dưỡng cả một khu rừng nguyên sinh và mây mù kỳ ảo.',
    level: 'Level 3',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    readTime: '7 mins',
    vocabHighlights: ['colossal cavern', 'primeval forest', 'subterranean'],
    bilingualTerms: [
      { en: 'Subterranean weather system', vi: 'Hệ thời tiết riêng trong lòng đất' },
      { en: 'Colossal limestone cavern', vi: 'Vòm hang đá vôi khổng lồ' }
    ],
    speakingSentenceEn: 'Son Doong is verified as the largest natural cave on planet Earth.',
    speakingSentenceVi: 'Hang Sơn Đoòng được xác nhận là hang động tự nhiên lớn nhất trên hành tinh.',
    desc: 'Hang động tự nhiên lớn nhất thế giới • Rừng trong lòng đất'
  },
  {
    id: 'hue-citadel',
    provinceId: 'hue',
    name: 'Đại Nội Huế',
    region: 'central',
    category: 'Heritage',
    coordinates: { lat: 16.4698, lng: 107.5796 },
    offset: { dx: -5, dy: -3 },
    locationNameVi: 'Cố Đô Huế • Nhã Nhạc Hoàng Cung',
    title: 'Imperial Hue Court Architecture & Royal Nha Nhac',
    titleVi: 'Cổng Thành Hoàng Cung & Nhã Nhạc Cố Đô Huế',
    subtitle: 'Nguyen Dynasty imperial citadel and UNESCO royal court music.',
    excerptEn: 'Built under the Nguyen Dynasty in 1804, the Imperial Citadel features majestic gates harmoniously aligned with geomancy along the Perfume River, serenaded by royal Nha Nhac court music.',
    excerptVi: 'Xây dựng thời nhà Nguyễn năm 1804, Hoàng thành Huế sở hữu cổng thành uy nghiêm chuẩn phong thủy bên sông Hương, vang vọng giai điệu Nhã nhạc cung đình triều đại.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['geomancy', 'pavilion', 'court music'],
    bilingualTerms: [
      { en: 'Royal court music', vi: 'Nhã nhạc cung đình triều Nguyễn' },
      { en: 'Imperial geomancy design', vi: 'Kiến trúc hoàng cung chuẩn phong thủy' }
    ],
    speakingSentenceEn: 'Hue Imperial City is famous for its 19th-century royal citadel architecture and UNESCO Nha Nhac court music.',
    speakingSentenceVi: 'Cố đô Huế nổi tiếng với kiến trúc hoàng thành thế kỷ 19 và di sản Nhã nhạc cung đình UNESCO.',
    desc: 'Hoàng cung triều Nguyễn • Nhã nhạc cung đình UNESCO'
  },
  {
    id: 'hue-thien-mu',
    provinceId: 'hue',
    name: 'Chùa Thiên Mụ',
    region: 'central',
    category: 'Heritage',
    coordinates: { lat: 16.4533, lng: 107.5450 },
    offset: { dx: 6, dy: 4 },
    locationNameVi: 'Huế • Chùa Thiên Mụ & Sông Hương',
    title: 'Thien Mu Pagoda: Spiritual Icon of the Perfume River',
    titleVi: 'Chùa Thiên Mụ & Tháp Phước Duyên Bên Dòng Sông Hương',
    subtitle: 'Seven-tiered octagonal pagoda echoing across misty waters.',
    excerptEn: 'Perched on Ha Khe hill overlooking the serene Perfume River, the iconic octagonal tower of Thien Mu Pagoda has inspired poets and monks for centuries.',
    excerptVi: 'Tọa lạc trên đồi Hà Khê soi bóng xuống dòng sông Hương thơ mộng, tháp Phước Duyên bát giác chùa Thiên Mụ là biểu tượng tâm linh bất hủ của xứ Huế.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['octagonal tower', 'serene', 'monastic'],
    bilingualTerms: [
      { en: 'Octagonal pagoda tower', vi: 'Tháp chùa hình bát giác' },
      { en: 'Spiritual sanctuary', vi: 'Chốn thanh tịnh tâm linh' }
    ],
    speakingSentenceEn: 'Thien Mu Pagoda is the oldest and most revered pagoda in the ancient city of Hue.',
    speakingSentenceVi: 'Chùa Thiên Mụ là ngôi chùa cổ kính và tôn nghiêm bậc nhất của cố đô Huế.',
    desc: 'Tháp Phước Duyên 7 tầng • Biểu tượng bên sông Hương'
  },
  {
    id: 'hoi-an-lanterns',
    provinceId: 'da-nang',
    name: 'Phố Cổ Hội An',
    region: 'central',
    category: 'Heritage',
    coordinates: { lat: 15.8801, lng: 108.3380 },
    offset: { dx: 3, dy: -3 },
    locationNameVi: 'Phố Cổ Hội An • Đêm Hội Hoa Đăng',
    title: 'Hoi An Ancient Lantern Alleys & Silk Craftsmanship',
    titleVi: 'Đêm Hội Hoa Đăng Hội An & Nghề Dệt Lụa Cổ Truyền',
    subtitle: 'Full moon silk lantern festival along the Hoai River.',
    excerptEn: 'On full moon nights, the ancient trading port switches off electric lights, illuminating streets with thousands of colorful hand-woven silk lanterns floating gracefully on the water.',
    excerptVi: 'Vào đêm rằm hàng tháng, thương cảng cổ tắt toàn bộ ánh đèn điện, thắp sáng các con phố bằng hàng ngàn chiếc đèn lồng lụa thủ công rực rỡ trôi bồng bềnh trên dòng sông.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['illuminating', 'hand-woven', 'trading port'],
    bilingualTerms: [
      { en: 'Ancient lantern-lit alleys', vi: 'Ngõ phố cổ rực rỡ đèn lồng' },
      { en: 'Preserved architectural tapestry', vi: 'Dải lụa kiến trúc cổ bảo tồn' }
    ],
    speakingSentenceEn: 'Hoi An Ancient Town captivates visitors with its yellow heritage houses and monthly full moon lantern festivals.',
    speakingSentenceVi: 'Phố cổ Hội An cuốn hút du khách bởi những ngôi nhà di sản vàng tươi và đêm hội hoa đăng huyền ảo.',
    desc: 'Thương cảng cổ thế kỷ 16 • Đêm rằm hoa đăng'
  },
  {
    id: 'my-son-sanctuary',
    provinceId: 'da-nang',
    name: 'Thánh Địa Mỹ Sơn',
    region: 'central',
    category: 'Heritage',
    coordinates: { lat: 15.7997, lng: 108.1247 },
    offset: { dx: -4, dy: 4 },
    locationNameVi: 'Quảng Nam • Thánh Địa Mỹ Sơn (UNESCO)',
    title: 'My Son Sanctuary: Ancient Champa Kingdom Brick Temples',
    titleVi: 'Thánh Địa Mỹ Sơn: Ngôi Đền Gạch Cổ Vương Quốc Chăm Pa',
    subtitle: 'Mystical 4th-century Hindu brick temples nestled in a sacred valley.',
    excerptEn: 'Enclosed by lush forested mountains, My Son preserves over seventy ruined red brick temples built by Champa kings between the 4th and 13th centuries without visible mortar.',
    excerptVi: 'Bao bọc bởi thung lũng đại ngàn, Mỹ Sơn lưu giữ hơn 70 đền tháp gạch đỏ kỳ bí xây dựng bởi các vị vua Chăm Pa cổ đại mà không hề lộ dấu vữa kết dính.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['mortarless brick', 'sacred valley', 'sanctuary'],
    bilingualTerms: [
      { en: 'Mortarless red brick architecture', vi: 'Kiến trúc gạch đỏ không lộ mạch vữa' },
      { en: 'Sacred Hindu valley sanctuary', vi: 'Thánh địa thung lũng Ấn Độ giáo' }
    ],
    speakingSentenceEn: 'My Son Sanctuary is a UNESCO cultural heritage site showcasing the profound Hindu architectural achievements of Champa civilization.',
    speakingSentenceVi: 'Thánh địa Mỹ Sơn là di sản văn hóa thế giới UNESCO tôn vinh đỉnh cao kiến trúc đền tháp Chăm Pa.',
    desc: 'Tháp Chăm Pa cổ đại • Thung lũng linh thiêng UNESCO'
  },
  {
    id: 'tay-nguyen-cong-chieng',
    provinceId: 'dak-lak',
    name: 'Tây Nguyên Cồng Chiêng',
    region: 'central',
    category: 'Folklore',
    coordinates: { lat: 12.6667, lng: 108.0500 },
    offset: { dx: 0, dy: 0 },
    locationNameVi: 'Tây Nguyên • Không Gian Văn Hóa Cồng Chiêng',
    title: 'Central Highlands Gong Culture & Communal Houses',
    titleVi: 'Tây Nguyên: Không Gian Văn Hóa Cồng Chiêng & Nhà Rông',
    subtitle: 'Sacred bronze gong ensembles echo through mountain forests.',
    excerptEn: 'Gathered around bonfire flames by majestic communal Rong houses, ethnic villagers play sacred bronze gongs connecting tribal communities to mountain spirits.',
    excerptVi: 'Vây quanh bếp lửa bập bùng bên mái nhà Rông uy nghiêm, đồng bào Tây Nguyên diễn tấu tiếng cồng chiêng linh thiêng gắn kết cộng đồng với đại ngàn.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['gong ensembles', 'bonfire', 'communal house'],
    bilingualTerms: [
      { en: 'Sacred bronze gong resonance', vi: 'Tiếng cồng chiêng linh thiêng đại ngàn' },
      { en: 'Majestic communal Rong house', vi: 'Mái nhà Rông Tây Nguyên uy nghiêm' }
    ],
    speakingSentenceEn: 'The Cultural Space of Gong in the Central Highlands is a UNESCO Intangible Cultural Heritage of Humanity.',
    speakingSentenceVi: 'Không gian văn hóa Cồng chiêng Tây Nguyên là di sản văn hóa phi vật thể đại diện của nhân loại.',
    desc: 'Không gian văn hoá cồng chiêng • Mái nhà Rông đại ngàn'
  },

  // ==========================================
  // MIỀN NAM (SOUTHERN VIETNAM)
  // ==========================================
  {
    id: 'saigon-icon',
    provinceId: 'ho-chi-minh',
    name: 'Bến Thành & Bánh Mì',
    region: 'south',
    category: 'Cuisine',
    coordinates: { lat: 10.7725, lng: 106.6980 },
    offset: { dx: -5, dy: 3 },
    locationNameVi: 'Sài Gòn • Trung Tâm Bến Thành & Bánh Mì',
    title: 'Saigon Urban Pulse: Colonial Landmarks & Banh Mi Culture',
    titleVi: 'Sài Gòn: Nhịp Sống Đô Thị & Văn Hóa Bánh Mì',
    subtitle: 'Dynamic economic hub blending French colonial icons with street food dynamism.',
    excerptEn: 'Saigon blends historic French colonial landmarks like Notre Dame Cathedral with sleek modern skyscrapers and iconic street food corners serving crispy Banh Mi.',
    excerptVi: 'Sài Gòn giao thoa giữa các công trình kiến trúc cổ như Nhà thờ Đức Bà với các tòa tháp hiện đại và những góc phố ẩm thực lừng danh bánh mì giòn rụm.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1626804475297-41608e074eb1?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['urban pulse', 'colonial landmarks', 'dynamism'],
    bilingualTerms: [
      { en: 'Dynamic street food culture', vi: 'Văn hóa ẩm thực đường phố sôi động' },
      { en: 'Colonial architectural blend', vi: 'Giao thoa kiến trúc cổ điển & hiện đại' }
    ],
    speakingSentenceEn: 'Saigon is Vietnam’s largest city, famous for its vibrant street food scene and rich historical landmarks.',
    speakingSentenceVi: 'Sài Gòn là thành phố lớn nhất Việt Nam, nổi tiếng với ẩm thực đường phố sôi động và di sản lịch sử.',
    desc: 'Hòn ngọc Viễn Đông • Bánh mì & Chợ Bến Thành'
  },
  {
    id: 'saigon-cu-chi',
    provinceId: 'ho-chi-minh',
    name: 'Địa Đạo Củ Chi',
    region: 'south',
    category: 'Heritage',
    coordinates: { lat: 11.1408, lng: 106.4633 },
    offset: { dx: 6, dy: -6 },
    locationNameVi: 'Sài Gòn • Địa Đạo Củ Chi Di Tích Lịch Sử',
    title: 'Cu Chi Tunnels: Underground Historic Wonder',
    titleVi: 'Địa Đạo Củ Chi: Kỳ Tích Trong Lòng Đất',
    subtitle: 'Immense subterranean labyrinth reflecting wartime resilience.',
    excerptEn: 'Spanning hundreds of kilometers beneath the jungle floor, the intricate Cu Chi tunnel network housed whole communities during wartime defense.',
    excerptVi: 'Trải dài hàng trăm kilomet dưới lòng đất, hệ thống địa đạo Củ Chi kỳ vĩ từng là căn cứ bảo vệ quân dân trong những năm tháng kháng chiến oanh liệt.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['subterranean', 'resilience', 'labyrinth'],
    bilingualTerms: [
      { en: 'Underground tunnel network', vi: 'Mạng lưới hầm địa đạo' },
      { en: 'Wartime resilience', vi: 'Ý chí kiên cường thời chiến' }
    ],
    speakingSentenceEn: 'Cu Chi Tunnels is an astonishing subterranean historic system located northwest of Ho Chi Minh City.',
    speakingSentenceVi: 'Địa đạo Củ Chi là một công trình lịch sử ngầm kỳ vĩ nằm ở phía tây bắc TP. Hồ Chí Minh.',
    desc: 'Công trình địa đạo kỳ vĩ • Di tích lịch sử thời chiến'
  },
  {
    id: 'cai-rang-floating-market',
    provinceId: 'can-tho',
    name: 'Chợ Nổi Cái Răng',
    region: 'south',
    category: 'Nature',
    coordinates: { lat: 10.0055, lng: 105.7467 },
    offset: { dx: -5, dy: 3 },
    locationNameVi: 'Cần Thơ • Chợ Nổi Cái Răng & Sông Nước',
    title: 'Cai Rang Floating Market & Mekong Riverine Commerce',
    titleVi: 'Chợ Nổi Cái Răng & Văn Hóa Sông Nước Miền Tây',
    subtitle: 'Bustling dawn trading boats on the waterways of the Mekong Delta.',
    excerptEn: 'At sunrise, hundreds of wooden boats congregate on the river, displaying tropical fruits on bamboo sample poles in a vibrant generational trade tradition.',
    excerptVi: 'Khi bình minh vừa hé rạng, hàng trăm chiếc ghe xuồng tụ hội trên dòng sông, treo nông sản lên cây bẹo truyền thống tạo nên bức tranh thương hồ sông nước rực rỡ.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['riverine commerce', 'sample poles', 'congregate'],
    bilingualTerms: [
      { en: 'Bustling riverine commerce', vi: 'Nét thương hồ sông nước tấp nập' },
      { en: 'Generational trade tradition', vi: 'Truyền thống buôn bán qua nhiều thế hệ' }
    ],
    speakingSentenceEn: 'Cai Rang Floating Market in Can Tho is the largest wholesale floating market in the Mekong Delta region.',
    speakingSentenceVi: 'Chợ nổi Cái Răng ở Cần Thơ là chợ nổi bán buôn lớn nhất vùng đồng bằng sông Cửu Long.',
    desc: 'Chợ nổi lớn nhất miền Tây • Cây bẹo thương hồ'
  },
  {
    id: 'can-tho-binh-thuy',
    provinceId: 'can-tho',
    name: 'Nhà Cổ Bình Thủy',
    region: 'south',
    category: 'Heritage',
    coordinates: { lat: 10.0617, lng: 105.7533 },
    offset: { dx: 6, dy: -4 },
    locationNameVi: 'Cần Thơ • Nhà Cổ Bình Thủy Thế Kỷ 19',
    title: 'Binh Thuy Ancient House: French-Vietnamese Heritage Estate',
    titleVi: 'Nhà Cổ Bình Thủy: Di Sản Kiến Trúc Đông Dương',
    subtitle: 'Exquisite 1870 French-Vietnamese aristocratic mansion.',
    excerptEn: 'Built in 1870 by the Duong family, Binh Thuy Ancient House seamlessly fuses ornate French colonial neoclassical architecture with traditional Southern Vietnamese woodwork.',
    excerptVi: 'Xây dựng năm 1870 bởi dòng họ Dương, nhà cổ Bình Thủy kết hợp tinh tế giữa kiến trúc tân cổ điển Pháp với nghệ thuật chạm khắc gỗ cổ truyền Nam Bộ.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['aristocratic', 'neoclassical', 'woodwork'],
    bilingualTerms: [
      { en: 'French colonial neoclassical', vi: 'Kiến trúc tân cổ điển Pháp' },
      { en: 'Ornate wooden carving', vi: 'Nghệ thuật chạm khắc gỗ tinh xảo' }
    ],
    speakingSentenceEn: 'Binh Thuy Ancient House is a prime architectural treasure of Can Tho and the entire Mekong Delta.',
    speakingSentenceVi: 'Nhà cổ Bình Thủy là kiệt tác di sản kiến trúc tiêu biểu của Cần Thơ và miền Tây Nam Bộ.',
    desc: 'Biệt phủ Đông Dương 1870 • Giao thoa kiến trúc Pháp - Việt'
  },
  {
    id: 'don-ca-tai-tu',
    provinceId: 'dong-thap',
    name: 'Đờn Ca Tài Tử',
    region: 'south',
    category: 'Folklore',
    coordinates: { lat: 10.3544, lng: 106.3653 },
    offset: { dx: 0, dy: 0 },
    locationNameVi: 'Đồng Bằng Sông Cửu Long • Đờn Ca Tài Tử',
    title: 'Don Ca Tai Tu: Southern Folk Music & Moon Lute Melodies',
    titleVi: 'Đờn Ca Tài Tử: Âm Nhạc Dân Gian Nam Bộ',
    subtitle: 'Soulful southern improvisational folk music along peaceful canals.',
    excerptEn: 'Improvised by musicians on Moon lutes and zithers under fruit orchard shadows, Don Ca Tai Tu expresses the heartwarming emotional spirit of Southern people.',
    excerptVi: 'Được diễn tấu ngẫu hứng bởi các nghệ nhân đệm đàn Kìm, đàn Tranh dưới bóng vườn cây trái, Đờn ca tài tử thể hiện tâm hồn phóng khoáng, tình nghĩa của người miền Nam.',
    level: 'Level 2',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['improvisational', 'moon lute', 'orchard shadows'],
    bilingualTerms: [
      { en: 'Soulful improvisational melodies', vi: 'Giai điệu ngẫu hứng da diết' },
      { en: 'Orchard chamber acoustics', vi: 'Âm sắc mộc mạc miệt vườn' }
    ],
    speakingSentenceEn: 'Don Ca Tai Tu is an UNESCO intangible folk music art form deeply rooted in Southern Vietnamese life.',
    speakingSentenceVi: 'Đờn ca tài tử là di sản âm nhạc dân gian phi vật thể UNESCO gắn liền với đời sống người dân Nam Bộ.',
    desc: 'Di sản phi vật thể UNESCO • Đàn Kìm miệt vườn Nam Bộ'
  },

  // ==========================================
  // DI SẢN VĂN HÓA TOÀN QUỐC (NATIONAL HERITAGE)
  // ==========================================
  {
    id: 'tet-festivities',
    provinceId: 'ha-noi',
    name: 'Tết Nguyên Đán',
    region: 'all',
    isNational: true,
    category: 'Folklore',
    coordinates: { lat: 21.0285, lng: 105.8542 },
    offset: { dx: 0, dy: 0 },
    locationNameVi: 'Toàn Quốc • Tết Nguyên Đán & Mùa Xuân',
    title: 'Tet Nguyen Dan: Traditions & Spring Rituals',
    titleVi: 'Tết Nguyên Đán: Phong Tục & Nghi Lễ Mùa Xuân',
    subtitle: 'The sacred Vietnamese Lunar New Year celebrated across all regions.',
    excerptEn: 'As peach blossoms bloom in the north and yellow apricot blossoms brighten the south, Vietnamese families reunite to wrap square Banh Chung, honor ancestors, and welcome spring prosperity.',
    excerptVi: 'Hoa đào khoe sắc miền Bắc và hoa mai rực rỡ phương Nam, các gia đình Việt Nam đoàn viên bên nồi bánh chưng xanh, tưởng nhớ tổ tiên và đón chào năm mới an khang thịnh vượng.',
    level: 'Level 1',
    image: 'https://images.unsplash.com/photo-1548625361-195feee7e62a?auto=format&fit=crop&w=1200&q=80',
    readTime: '5 mins',
    vocabHighlights: ['lunar reunion', 'ancestral rites', 'spring prosperity'],
    bilingualTerms: [
      { en: 'Ancestral veneration rites', vi: 'Nghi lễ phụng thờ tổ tiên' },
      { en: 'Springtime familial reunion', vi: 'Đoàn viên gia đình mùa xuân' }
    ],
    speakingSentenceEn: 'Tet is the most significant and sacred holiday celebrated throughout Vietnam.',
    speakingSentenceVi: 'Tết là ngày lễ thiêng liêng và trọng đại bậc nhất được đón mừng trên khắp đất nước Việt Nam.',
    desc: 'Lễ hội thiêng liêng nhất của dân tộc • Bánh chưng đoàn viên'
  },
  {
    id: 'nem-ran-spring-rolls',
    provinceId: 'ha-noi',
    name: 'Nem Rán Truyền Thống',
    region: 'all',
    isNational: true,
    category: 'Cuisine',
    coordinates: { lat: 21.0285, lng: 105.8542 },
    offset: { dx: 0, dy: 0 },
    locationNameVi: 'Toàn Quốc • Tinh Hoa Nem Rán Việt Nam',
    title: 'Nem Ran: The Crispy Tradition of Vietnamese Spring Rolls',
    titleVi: 'Nem Rán Truyền Thống: Món Ăn Tinh Hoa Ngày Lễ Tết',
    subtitle: 'Crispy rice paper rolls filled with seasoned pork, wood-ear mushrooms, and glass noodles.',
    excerptEn: 'Golden crispy rolls wrapped in thin rice paper and dipped into balanced sweet-and-sour fish sauce represent the timeless harmony of Vietnamese gastronomy.',
    excerptVi: 'Những chiếc nem vàng rộm giòn tan bọc trong bánh đa nem mỏng, chấm cùng nước mắm chua ngọt hài hòa thể hiện trọn vẹn sự tinh tế của ẩm thực Việt.',
    level: 'Level 1',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    readTime: '4 mins',
    vocabHighlights: ['crispy spring rolls', 'savory filling', 'fish sauce dipping'],
    bilingualTerms: [
      { en: 'Golden crispy texture', vi: 'Vỏ nem vàng giòn rụm' },
      { en: 'Sweet-and-sour dipping sauce', vi: 'Nước chấm chua ngọt thanh vị' }
    ],
    speakingSentenceEn: 'Crispy spring rolls are an essential dish on celebratory feast tables across Vietnam.',
    speakingSentenceVi: 'Nem rán là món ăn không thể thiếu trên mâm cỗ ngày Tết và các dịp sum họp gia đình.',
    desc: 'Món ăn quốc hồn quốc túy • Giòn tan vàng rộm'
  }
];

export default VIETNAM_LANDMARKS;
