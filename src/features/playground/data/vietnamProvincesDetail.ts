export interface ProvinceCultureData {
  id: string;
  name: string;
  slug: string;
  region: 'north' | 'central' | 'south';
  regionName: string;
  capital: string;
  area: string;
  population: string;
  heritageType?: string;
  unescoTitle?: string;
  landmarks: string[];
  specialties: string[];
  itinerary: string[];
  englishVocab: { word: string; ipa: string; meaning: string }[];
  summary: string;
  travelTips: string;
}

export const PROVINCES_CULTURE_DETAILS: Record<string, ProvinceCultureData> = {
  'ha-noi': {
    id: 'ha-noi',
    name: 'Hà Nội',
    slug: 'ha-noi',
    region: 'north',
    regionName: 'Bắc Bộ',
    capital: 'Thủ đô Hà Nội',
    area: '3.359 km²',
    population: '8.5 triệu người',
    heritageType: 'Thủ Đô Ngàn Năm Văn Hiến',
    unescoTitle: 'Hoàng thành Thăng Long & Bia Tiến sĩ Văn Miếu',
    landmarks: [
      'Hoàng thành Thăng Long (UNESCO)',
      'Văn Miếu - Quốc Tử Giám',
      'Hồ Hoàn Kiếm & Tháp Rùa',
      'Chùa Một Cột',
      '36 Phố Phường Cổ Kính'
    ],
    specialties: ['Phở Hà Nội', 'Bún chả Cửa Đông', 'Chả cá Lã Vọng', 'Bánh cuốn Thanh Trì', 'Cốm Làng Vòng'],
    itinerary: [
      'Ngày 1: Hoàng thành Thăng Long - Văn Miếu - Thưởng thức Phở Bát Đàn',
      'Ngày 2: Dạo quanh Hồ Gươm - Phố Cổ - Cà phê trứng Giảng - Xem múa rối nước'
    ],
    englishVocab: [
      { word: 'Imperial Citadel', ipa: '/ɪmˈpɪə.ri.əl ˈsɪt.ə.dəl/', meaning: 'Hoàng thành cổ kính' },
      { word: 'Temple of Literature', ipa: '/ˈtem.pəl əv ˈlɪt.rə.tʃər/', meaning: 'Văn Miếu' },
      { word: 'Old Quarter', ipa: '/əʊld ˈkwɔː.tər/', meaning: 'Khu phố cổ 36 phố phường' }
    ],
    summary: 'Hà Nội là trái tim ngàn năm văn hiến của Việt Nam, nơi giao thoa giữa nét cổ kính rêu phong của các di tích lịch sử và nhịp sống đô thị đương đại đầy sức sống.',
    travelTips: 'Nên khám phá Phố Cổ vào sáng sớm hoặc buổi tối cuối tuần khi có phố đi bộ.'
  },
  'quang-ninh': {
    id: 'quang-ninh',
    name: 'Quảng Ninh',
    slug: 'quang-ninh',
    region: 'north',
    regionName: 'Bắc Bộ',
    capital: 'Thành phố Hạ Long',
    area: '6.178 km²',
    population: '1.4 triệu người',
    heritageType: 'Kỳ Quan Thiên Nhiên Thế Giới',
    unescoTitle: 'Vịnh Hạ Long (UNESCO 1994, 2000, 2023)',
    landmarks: ['Vịnh Hạ Long', 'Non thiêng Yên Tử', 'Đảo Cô Tô', 'Bảo tàng Quảng Ninh', 'Vịnh Bái Tử Long'],
    specialties: ['Chả mực giã tay Hạ Long', 'Sá sùng Quan Lạn', 'Gà đồi Tiên Yên', 'Bánh gật gù Tiên Yên'],
    itinerary: [
      'Ngày 1: Du thuyền ngắm Vịnh Hạ Long - Thăm hang Sửng Sốt - Đảo Ti Tốp',
      'Ngày 2: Khám phá Non thiêng Yên Tử - Chiêm bái Chùa Đồng'
    ],
    englishVocab: [
      { word: 'Karst Topography', ipa: '/kɑːst təˈpɒɡ.rə.fi/', meaning: 'Địa hình karst đá vôi' },
      { word: 'Secluded Bay', ipa: '/sɪˈkluː.dɪd beɪ/', meaning: 'Vịnh biển biệt lập' },
      { word: 'Pilgrimage Sanctuary', ipa: '/ˈpɪl.ɡrɪ.mɪdʒ ˈsæŋk.tʃʊə.ri/', meaning: 'Thánh địa hành hương' }
    ],
    summary: 'Quảng Ninh sở hữu Di sản Thiên nhiên Thế giới Vịnh Hạ Long với hàng nghìn hòn đảo đá vôi kỳ vĩ và cái nôi Phật giáo Trúc Lâm Yên Tử.',
    travelTips: 'Trải nghiệm ngủ đêm trên du thuyền Vịnh Hạ Long để đón bình minh tuyệt đẹp trên biển.'
  },
  'ninh-binh': {
    id: 'ninh-binh',
    name: 'Ninh Bình',
    slug: 'ninh-binh',
    region: 'north',
    regionName: 'Bắc Bộ',
    capital: 'Thành phố Hoa Lư - Ninh Bình',
    area: '1.387 km²',
    population: '1.0 triệu người',
    heritageType: 'Di Sản Kép Thế Giới (Văn hóa & Tự nhiên)',
    unescoTitle: 'Quần thể danh thắng Tràng An (UNESCO 2014)',
    landmarks: ['Quần thể Tràng An', 'Cố đô Hoa Lư', 'Tam Cốc - Bích Động', 'Chùa Bái Đính', 'Hang Múa'],
    specialties: ['Cơm cháy Ninh Bình', 'Thịt dê núi 7 món', 'Ốc núi đá', 'Rượu Kim Sơn'],
    itinerary: [
      'Ngày 1: Chèo thuyền Tràng An - Thăm Đền Trình - Cố đô Hoa Lư',
      'Ngày 2: Leo đỉnh Hang Múa ngắm Tam Cốc - Chiêm bái Chùa Bái Đính'
    ],
    englishVocab: [
      { word: 'Ancient Capital', ipa: '/ˈeɪn.ʃənt ˈkæp.ɪ.təl/', meaning: 'Cố đô cổ xưa' },
      { word: 'Limestone Caves', ipa: '/ˈlaɪm.stəʊn keɪvz/', meaning: 'Hệ thống hang động đá vôi' },
      { word: 'Mixed Heritage', ipa: '/mɪkst ˈher.ɪ.tɪdʒ/', meaning: 'Di sản thế giới hỗn hợp' }
    ],
    summary: 'Ninh Bình nổi tiếng với vẻ đẹp non nước hữu tình, được mệnh danh là "Vịnh Hạ Long trên cạn", từng là kinh đô của ba triều đại Đinh - Tiền Lê - Lý.',
    travelTips: 'Mùa lúa chín Tam Cốc (tháng 5 - tháng 6) là thời điểm vàng để chụp ảnh phong cảnh.'
  },
  'cao-bang': {
    id: 'cao-bang',
    name: 'Cao Bằng',
    slug: 'cao-bang',
    region: 'north',
    regionName: 'Bắc Bộ',
    capital: 'Thành phố Cao Bằng',
    area: '6.700 km²',
    population: '540.000 người',
    heritageType: 'Công Viên Địa Chất Toàn Cầu UNESCO',
    unescoTitle: 'Công viên địa chất Non Nước Cao Bằng (UNESCO 2018)',
    landmarks: ['Thác Bản Giốc', 'Khu di tích Pác Bó', 'Động Ngườm Ngao', 'Hồ Thang Hen', 'Đèo Mã Phục'],
    specialties: ['Vịt quay 7 vị Cao Bằng', 'Bánh cuốn canh Cao Bằng', 'Hạt dẻ Trùng Khánh', 'Miến dong Phia Đén'],
    itinerary: [
      'Ngày 1: Thăm Thác Bản Giốc - Khám phá Động Ngườm Ngao',
      'Ngày 2: Thăm Suối Lê-nin, Hang Pác Bó - Thưởng thức ẩm thực Tày Nùng'
    ],
    englishVocab: [
      { word: 'Cascading Waterfall', ipa: '/kæˈskeɪ.dɪŋ ˈwɔː.tə.fɔːl/', meaning: 'Thác nước nhiều tầng đổ' },
      { word: 'Geopark', ipa: '/ˈdʒiː.əʊ.pɑːk/', meaning: 'Công viên địa chất' },
      { word: 'Border Monument', ipa: '/ˈbɔː.dər ˈmɒn.jʊ.mənt/', meaning: 'Cột mốc biên cương' }
    ],
    summary: 'Cao Bằng là vùng đất biên cương hùng tráng với Thác Bản Giốc - thác nước tự nhiên lớn thứ 4 thế giới nằm trên đường biên giới quốc gia.',
    travelTips: 'Thời điểm lý tưởng nhất đến Thác Bản Giốc là tháng 9 - tháng 10 khi dòng nước xanh ngọc bích.'
  },
  'thua-thien-hue': {
    id: 'thua-thien-hue',
    name: 'Thừa Thiên Huế',
    slug: 'thua-thien-hue',
    region: 'central',
    regionName: 'Trung Bộ',
    capital: 'Thành phố Huế (Thành phố trực thuộc TW)',
    area: '4.902 km²',
    population: '1.2 triệu người',
    heritageType: 'Quần Thể Di Tích Cố Đô',
    unescoTitle: 'Quần thể Di tích Cố đô Huế (1993) & Nhã nhạc Cung đình Huế (2003)',
    landmarks: [
      'Đại Nội Huế & Ngọ Môn',
      'Lăng Tự Đức, Lăng Khải Định, Lăng Minh Mạng',
      'Chùa Thiên Mụ & Sông Hương',
      'Cầu Tràng Tiền',
      'Vịnh Lăng Cô'
    ],
    specialties: ['Bún bò Huế gia truyền', 'Cơm hến Cồn Hến', 'Bánh bèo - nậm - lọc', 'Chè bột lọc heo quay', 'Trà cung đình Huế'],
    itinerary: [
      'Ngày 1: Đại Nội Hoàng Cung - Chùa Thiên Mụ - Đi thuyền nghe Ca Huế trên Sông Hương',
      'Ngày 2: Hệ thống Lăng tẩm Triều Nguyễn (Tự Đức, Khải Định) - Khám phá Ẩm thực Cố đô'
    ],
    englishVocab: [
      { word: 'Royal Court Music', ipa: '/ˈrɔɪ.əl kɔːt ˈmjuː.zɪk/', meaning: 'Nhã nhạc cung đình' },
      { word: 'Imperial Enclosure', ipa: '/ɪmˈpɪə.ri.əl ɪnˈkləʊ.ʒər/', meaning: 'Tử Cấm Thành / Hoàng Thành' },
      { word: 'Mausoleum Complex', ipa: '/ˌmɔː.zəˈliː.əm ˈkɒm.pleks/', meaning: 'Quần thể lăng tẩm hoàng gia' }
    ],
    summary: 'Huế là cố đô phong nhã cuối cùng của triều đại phong kiến Việt Nam, nổi danh với di sản kiến trúc hoàng gia, nhã nhạc cung đình và nền ẩm thực cung đình tinh xảo.',
    travelTips: 'Thuê áo dài truyền thống hoặc Cổ phục Nhật Bình để chụp ảnh kỷ niệm tại Đại Nội.'
  },
  'da-nang': {
    id: 'da-nang',
    name: 'Đà Nẵng',
    slug: 'da-nang',
    region: 'central',
    regionName: 'Trung Bộ',
    capital: 'Thành phố Đà Nẵng',
    area: '1.285 km²',
    population: '1.25 triệu người',
    heritageType: 'Thành Phố Đáng Sống & Cửa Ngõ Di Sản',
    unescoTitle: 'Cửa ngõ 3 Di sản Thế giới (Huế, Hội An, Mỹ Sơn)',
    landmarks: ['Bà Nà Hills & Cầu Vàng', 'Ngũ Hành Sơn', 'Bán đảo Sơn Trà & Chùa Linh Ứng', 'Cầu Rồng', 'Bãi biển Mỹ Khê'],
    specialties: ['Mì Quảng Đà Nẵng', 'Bánh tráng cuốn thịt heo hai đầu da', 'Bún chả cá', 'Gỏi cá Nam Ô'],
    itinerary: [
      'Ngày 1: Bán đảo Sơn Trà - Bãi biển Mỹ Khê - Ngắm Cầu Rồng phun lửa cuối tuần',
      'Ngày 2: Chinh phục Bà Nà Hills Cầu Vàng - Khám phá Danh thắng Ngũ Hành Sơn'
    ],
    englishVocab: [
      { word: 'Coastal Metropolis', ipa: '/ˈkəʊ.stəl məˈtrɒp.əl.ɪs/', meaning: 'Đô thị ven biển hiện đại' },
      { word: 'Golden Bridge', ipa: '/ˈɡəʊl.dən brɪdʒ/', meaning: 'Cầu Vàng bàn tay khổng lồ' },
      { word: 'Marble Mountains', ipa: '/ˈmɑː.bəl ˈmaʊn.tɪnz/', meaning: 'Ngũ Hành Sơn' }
    ],
    summary: 'Đà Nẵng là đô thị biển năng động bậc nhất miền Trung, cầu nối chiến lược giữa Cố đô Huế, Phố cổ Hội An và Thánh địa Mỹ Sơn.',
    travelTips: 'Xem Cầu Rồng phun lửa và nước vào lúc 21h00 thứ Bảy và Chủ Nhật.'
  },
  'quang-nam': {
    id: 'quang-nam',
    name: 'Quảng Nam',
    slug: 'quang-nam',
    region: 'central',
    regionName: 'Trung Bộ',
    capital: 'Thành phố Tam Kỳ & Đô thị cổ Hội An',
    area: '10.574 km²',
    population: '1.5 triệu người',
    heritageType: 'Hai Di Sản Văn Hóa Thế Giới UNESCO',
    unescoTitle: 'Đô thị cổ Hội An (1999) & Thánh địa Mỹ Sơn (1999)',
    landmarks: [
      'Đô thị cổ Hội An',
      'Thánh địa Mỹ Sơn (UNESCO)',
      'Chùa Cầu Hội An',
      'Khu dự trữ sinh quyển Cù Lao Chàm',
      'Làng gốm Thanh Hà'
    ],
    specialties: ['Cao lầu Hội An', 'Cơm gà Tam Kỳ', 'Mì Quảng ếch', 'Bánh bao bánh vạc', 'Bê thui Cầu Mống'],
    itinerary: [
      'Ngày 1: Dạo bước phố cổ Hội An - Thả hoa đăng Sông Hoài - Thưởng thức Cao lầu',
      'Ngày 2: Thăm quần thể tháp Chăm Mỹ Sơn - Khám phá Làng gốm Thanh Hà'
    ],
    englishVocab: [
      { word: 'Ancient Trading Port', ipa: '/ˈeɪn.ʃənt ˈtreɪ.dɪŋ pɔːt/', meaning: 'Thương cảng cổ truyền thống' },
      { word: 'Cham Sanctuary', ipa: '/tʃɑːm ˈsæŋk.tʃʊə.ri/', meaning: 'Thánh địa đền tháp Champa' },
      { word: 'Lantern Festival', ipa: '/ˈlæn.tən ˈfes.tɪ.vəl/', meaning: 'Lễ hội đèn lồng phố cổ' }
    ],
    summary: 'Quảng Nam là vùng đất di sản độc nhất vô nhị sở hữu hai Di sản Văn hóa Thế giới: Đô thị cổ Hội An mộc mạc và Thánh địa Mỹ Sơn huyền bí.',
    travelTips: 'Tham quan phố cổ vào ngày rằm (14 âm lịch hàng tháng) để ngắm trọn vẹn lễ hội đêm hoa đăng.'
  },
  'quang-binh': {
    id: 'quang-binh',
    name: 'Quảng Bình',
    slug: 'quang-binh',
    region: 'central',
    regionName: 'Trung Bộ',
    capital: 'Thành phố Đồng Hới',
    area: '8.065 km²',
    population: '900.000 người',
    heritageType: 'Vương Quốc Hang Động Thế Giới',
    unescoTitle: 'Vườn Quốc gia Phong Nha - Kẻ Bàng (UNESCO 2003, 2015)',
    landmarks: ['Hang Sơn Đoòng', 'Động Phong Nha', 'Động Thiên Đường', 'Suối Nước Moọc', 'Bãi biển Nhật Lệ'],
    specialties: ['Bánh bột lọc Quảng Bình', 'Cháo canh cá lóc', 'Khoai dẻo Ba Đồn', 'Mực nhảy Nhật Lệ'],
    itinerary: [
      'Ngày 1: Chèo thuyền vào Động Phong Nha - Tắm mát Suối Nước Moọc',
      'Ngày 2: Khám phá Động Thiên Đường dài 31km - Dạo biển Nhật Lệ'
    ],
    englishVocab: [
      { word: 'Subterranean World', ipa: '/ˌsʌb.təˈreɪ.ni.ən wɜːld/', meaning: 'Thế giới ngầm dưới lòng đất' },
      { word: 'Colossal Cave', ipa: '/kəˈlɒs.əl keɪv/', meaning: 'Hang động khổng lồ hùng vĩ' },
      { word: 'Stalactite & Stalagmite', ipa: '/ˈstæl.ək.taɪt ənd ˈstæl.əɡ.maɪt/', meaning: 'Nhũ đá và măng đá' }
    ],
    summary: 'Quảng Bình mệnh danh là vương quốc hang động với Hang Sơn Đoòng - hang động tự nhiên lớn nhất hành tinh cùng hệ thống karst cổ 400 triệu năm.',
    travelTips: 'Nên chuẩn bị trang phục thể thao chống trượt khi trekking vào các hang động.'
  },
  'lam-dong': {
    id: 'lam-dong',
    name: 'Lâm Đồng',
    slug: 'lam-dong',
    region: 'central',
    regionName: 'Tây Nguyên',
    capital: 'Thành phố Đà Lạt',
    area: '9.783 km²',
    population: '1.3 triệu người',
    heritageType: 'Không Gian Văn Hóa Cồng Chiêng Tây Nguyên',
    unescoTitle: 'Không gian văn hóa Cồng chiêng Tây Nguyên (UNESCO 2005) & Khu DTSQ Langbiang',
    landmarks: ['Đỉnh Langbiang', 'Hồ Xuân Hương', 'Thiền viện Trúc Lâm', 'Thung lũng Tình Yêu', 'Ga Đà Lạt cổ'],
    specialties: ['Lẩu gà lá é', 'Bánh tráng nướng Đà Lạt', 'Cà phê Arabica Cầu Đất', 'Dâu tây tươi Đà Lạt', 'Hồng treo gió'],
    itinerary: [
      'Ngày 1: Dạo quanh Hồ Xuân Hương - Thăm Dinh Bảo Đại - Thưởng thức lẩu gà lá é',
      'Ngày 2: Đón mây đồi chè Cầu Đất - Chinh phục đỉnh Langbiang - Giao lưu cồng chiêng'
    ],
    englishVocab: [
      { word: 'Misty Highlands', ipa: '/ˈmɪs.ti ˈhaɪ.ləndz/', meaning: 'Cao nguyên sương mù' },
      { word: 'Pine Forest', ipa: '/paɪn ˈfɒr.ɪst/', meaning: 'Rừng thông bạt ngàn' },
      { word: 'Gong Culture Space', ipa: '/ɡɒŋ ˈkʌl.tʃər speɪs/', meaning: 'Không gian văn hóa Cồng chiêng' }
    ],
    summary: 'Lâm Đồng là thủ phủ ngàn hoa của cao nguyên đất đỏ bazan, nổi tiếng với khí hậu mát mẻ quanh năm và di sản cồng chiêng huyền thoại.',
    travelTips: 'Thời điểm săn mây Đà Lạt đẹp nhất từ 5h00 đến 6h30 sáng tại khu vực Cầu Đất.'
  },
  'ho-chi-minh': {
    id: 'ho-chi-minh',
    name: 'TP. Hồ Chí Minh',
    slug: 'ho-chi-minh',
    region: 'south',
    regionName: 'Nam Bộ',
    capital: 'Thành phố Hồ Chí Minh',
    area: '2.061 km²',
    population: '9.4 triệu người',
    heritageType: 'Đô Thị Hiện Đại & Lịch Sử Đất Phương Nam',
    unescoTitle: 'Khu dự trữ sinh quyển rừng ngập mặn Cần Giờ (UNESCO 2000)',
    landmarks: [
      'Dinh Độc Lập (Di tích Quốc gia đặc biệt)',
      'Nhà thờ Đức Bà & Bưu điện Trung tâm',
      'Chợ Bến Thành',
      'Bến Nhà Rồng',
      'Địa đạo Củ Chi',
      'Rừng ngập mặn Cần Giờ'
    ],
    specialties: ['Cơm tấm sườn bì chả', 'Bánh mì Sài Gòn', 'Hủ tiếu Nam Vang', 'Cà phê sữa đá vỉa hè', 'Bánh xèo miền Tây'],
    itinerary: [
      'Ngày 1: Thăm Dinh Độc Lập - Bưu điện Trung tâm - Check-in Chợ Bến Thành - Du ngoạn sông Sài Gòn',
      'Ngày 2: Thăm Di tích Lịch sử Địa đạo Củ Chi - Thưởng thức Cơm tấm và cà phê sữa đá'
    ],
    englishVocab: [
      { word: 'Metropolitan Hub', ipa: '/ˌmet.rəˈpɒl.ɪ.tən hʌb/', meaning: 'Trung tâm đô thị sầm uất' },
      { word: 'Independence Palace', ipa: '/ˌɪn.dɪˈpen.dəns ˈpæl.ɪs/', meaning: 'Dinh Độc Lập' },
      { word: 'Historic Tunnels', ipa: '/hɪˈstɒr.ɪk ˈtʌn.əlz/', meaning: 'Hệ thống địa đạo lịch sử' }
    ],
    summary: 'Thành phố Hồ Chí Minh là trung tâm kinh tế, văn hóa và đổi mới sáng tạo lớn nhất Việt Nam, nơi giao thoa giữa di sản phương Nam hào sảng và năng lượng thời đại mới.',
    travelTips: 'Trải nghiệm xe buýt đường sông (Saigon Waterbus) để ngắm toàn cảnh thành phố từ dòng sông.'
  },
  'can-tho': {
    id: 'can-tho',
    name: 'Cần Thơ',
    slug: 'can-tho',
    region: 'south',
    regionName: 'Nam Bộ',
    capital: 'Thành phố Cần Thơ',
    area: '1.439 km²',
    population: '1.25 triệu người',
    heritageType: 'Đô Thị Sông Nước Miền Tây Đệ Nhất',
    unescoTitle: 'Văn hóa Chợ nổi Cái Răng & Đờn ca tài tử Nam Bộ',
    landmarks: ['Chợ nổi Cái Răng', 'Bến Ninh Kiều', 'Nhà cổ Bình Thủy', 'Cồn Sơn', 'Thiền viện Trúc Lâm Phương Nam'],
    specialties: ['Bánh xèo củ hủ dừa', 'Lẩu mắm Dạ Lý', 'Bún nước lèo', 'Vịt nấu chao Cần Thơ', 'Bánh tét lá cẩm'],
    itinerary: [
      'Ngày 1: Đi thuyền sáng sớm Chợ nổi Cái Răng - Thăm Nhà cổ Bình Thủy - Dạo Bến Ninh Kiều',
      'Ngày 2: Trải nghiệm làm bánh dân gian tại Cồn Sơn - Nghe Đờn ca tài tử Nam Bộ'
    ],
    englishVocab: [
      { word: 'Floating Market', ipa: '/ˈfləʊ.tɪŋ ˈmɑː.kɪt/', meaning: 'Chợ nổi sông nước' },
      { word: 'Mekong Delta Riverway', ipa: '/ˈmeɪ.kɒŋ ˈdel.tə ˈrɪv.ə.weɪ/', meaning: 'Mạng lưới sông ngòi Đồng bằng Sông Cửu Long' },
      { word: 'Traditional Chamber Music', ipa: '/trəˈdɪʃ.ən.əl ˈtʃeɪm.bər ˈmjuː.zɪk/', meaning: 'Đờn ca tài tử thính phòng' }
    ],
    summary: 'Cần Thơ là Tây Đô - trung tâm của miền châu thổ Cửu Long với văn hóa chợ nổi trên sông độc đáo và lòng mến khách nồng hậu của người Nam Bộ.',
    travelTips: 'Nên xuất phát đi Chợ nổi Cái Răng từ 5h30 sáng khi thuyền buôn tụ họp sầm uất nhất.'
  },
  'kien-giang': {
    id: 'kien-giang',
    name: 'Kiên Giang',
    slug: 'kien-giang',
    region: 'south',
    regionName: 'Nam Bộ',
    capital: 'Thành phố Rạch Giá & Đảo ngọc Phú Quốc',
    area: '6.348 km²',
    population: '1.8 triệu người',
    heritageType: 'Đảo Ngọc & Khu Dự Trữ Sinh Quyển Biển Đảo',
    unescoTitle: 'Khu dự trữ sinh quyển Kiên Giang (UNESCO 2006)',
    landmarks: ['Đảo ngọc Phú Quốc', 'Quần đảo Nam Du', 'Quần đảo Hải Tặc', 'Hòn Phụ Tử', 'Vườn quốc gia U Minh Thượng'],
    specialties: ['Nước mắm Phú Quốc truyền thống', 'Gỏi cá trích Phú Quốc', 'Bún kèn Hà Tiên', 'Hồ tiêu Phú Quốc'],
    itinerary: [
      'Ngày 1: Khám phá Bãi Sao Phú Quốc - Thăm nhà thùng Nước mắm truyền thống',
      'Ngày 2: Lặn ngắm san hô Hòn Mây Rút - Ngắm hoàng hôn tại Sunset Town'
    ],
    englishVocab: [
      { word: 'Pearl Island', ipa: '/pɜːl ˈaɪ.lənd/', meaning: 'Đảo ngọc' },
      { word: 'Coral Reef Sanctuary', ipa: '/ˈkɒr.əl riːf ˈsæŋk.tʃʊə.ri/', meaning: 'Khu bảo tồn rạn san hô' },
      { word: 'Fish Sauce Distillery', ipa: '/fɪʃ sɔːs dɪˈstɪl.ər.i/', meaning: 'Nhà thùng nước mắm' }
    ],
    summary: 'Kiên Giang sở hữu vịnh đảo nhiệt đới trù phú với Đảo ngọc Phú Quốc vươn tầm thế giới và Vườn quốc gia U Minh Thượng trứ danh.',
    travelTips: 'Mùa đẹp nhất để khám phá Phú Quốc là từ tháng 11 đến tháng 4 hàng năm khi biển êm đềm.'
  }
};

export const DEFAULT_PROVINCE_DETAIL = (id: string, name: string): ProvinceCultureData => {
  return {
    id,
    name,
    slug: id,
    region: 'north',
    regionName: 'Bắc Bộ',
    capital: `Trung tâm hành chính ${name}`,
    area: 'Đang cập nhật',
    population: 'Đang cập nhật',
    heritageType: 'Di Sản Văn Hóa & Địa Phương',
    landmarks: [`Di tích lịch sử ${name}`, `Danh lam thắng cảnh ${name}`, `Đền đài cổ kính`],
    specialties: [`Đặc sản truyền thống ${name}`, `Ẩm thực dân gian bản địa`],
    itinerary: [
      `Ngày 1: Thăm trung tâm văn hóa và di tích biểu tượng ${name}`,
      `Ngày 2: Trải nghiệm ẩm thực địa phương và làng nghề truyền thống`
    ],
    englishVocab: [
      { word: 'Cultural Heritage', ipa: '/ˈkʌl.tʃər.əl ˈher.ɪ.tɪdʒ/', meaning: 'Di sản văn hóa' },
      { word: 'Local Specialty', ipa: '/ˈləʊ.kəl ˈspeʃ.əl.ti/', meaning: 'Đặc sản địa phương' }
    ],
    summary: `${name} là vùng đất giàu truyền thống văn hóa lịch sử của Việt Nam với nhiều danh lam thắng cảnh và đặc sản độc đáo.`,
    travelTips: `Nên liên hệ hướng dẫn viên địa phương để tìm hiểu sâu sắc về phong tục tập quán tại ${name}.`
  };
};

export function getProvinceCultureData(provinceId: string, provinceName?: string): ProvinceCultureData {
  if (PROVINCES_CULTURE_DETAILS[provinceId]) {
    return PROVINCES_CULTURE_DETAILS[provinceId];
  }
  return DEFAULT_PROVINCE_DETAIL(provinceId, provinceName || provinceId);
}
