/**
 * Lesson Agent Catalog
 * Standardized pedagogical metadata for Gemini Voice-to-Voice AI Agent.
 * Enables zero-RAG, tool-driven English speaking & listening scaffolding.
 */

export interface LessonAgentVocab {
  word: string;
  ipa: string;
  meaningVi: string;
  exampleSentence: string;
}

export interface LessonAgentMetadata {
  id: string;
  title: string;
  vietnameseTitle: string;
  category: 'Cuisine' | 'Heritage' | 'Crafts' | 'Nature' | 'Folklore';
  provinceId: string;
  provinceName: string;
  region: 'north' | 'central' | 'south' | 'all';
  cefrLevel: 'A2' | 'B1' | 'B2';
  durationMinutes: number;
  summaryEn: string;
  summaryVi: string;
  keyVocabularies: LessonAgentVocab[];
  discussionPrompts: {
    comprehension: string[];
    personalOpinion: string[];
  };
}

export const LESSON_AGENT_CATALOG: LessonAgentMetadata[] = [
  {
    id: 'pho-hanoi-history',
    title: 'Hanoi Phở: The Soul of Vietnamese Culinary Heritage',
    vietnameseTitle: 'Phở Hà Nội: Linh Hồn Ẩm Thực Đất Kinh Kỳ',
    category: 'Cuisine',
    provinceId: 'ha-noi',
    provinceName: 'Hà Nội',
    region: 'north',
    cefrLevel: 'B1',
    durationMinutes: 6,
    summaryEn:
      'Hanoi Phở is celebrated worldwide for its clear, aromatic broth infused with star anise and cinnamon, served with delicate rice noodles and fresh herbs. It represents over a century of culinary evolution and Hanoi street dining culture.',
    summaryVi:
      'Phở Hà Nội nức tiếng với nước dùng trong veo, thơm lừng hồi quế, bánh phở mềm mượt và rau thơm tươi ngon, đại diện cho hơn một thế kỷ tinh hoa ẩm thực thủ đô.',
    keyVocabularies: [
      {
        word: 'culinary heritage',
        ipa: '/ˈkʌl.ɪ.nər.i ˈher.ɪ.tɪdʒ/',
        meaningVi: 'di sản văn hóa ẩm thực',
        exampleSentence: 'Hanoi Phở is an essential part of Vietnam culinary heritage.',
      },
      {
        word: 'simmered broth',
        ipa: '/ˈsɪm.əd brɒθ/',
        meaningVi: 'nước dùng ninh kỹ nhiều giờ',
        exampleSentence: 'The rich flavor comes from beef bones simmered broth for ten hours.',
      },
      {
        word: 'star anise',
        ipa: '/ˌstɑːr ˈæn.ɪs/',
        meaningVi: 'hoa hồi, đại hồi (gia vị đặc trưng)',
        exampleSentence: 'Roasted star anise gives the broth its distinctive warm aroma.',
      },
      {
        word: 'artisanal noodle',
        ipa: '/ˌɑː.tɪˈzæn.əl ˈnuː.dəl/',
        meaningVi: 'sợi bánh phở làm thủ công truyền thống',
        exampleSentence: 'Traditional cooks take pride in fresh artisanal noodles made daily.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'What main spices give Hanoi Phở its signature aromatic fragrance?',
        'How does Hanoi-style Phở differ from Southern Vietnamese Phở in terms of herbs and sweetness?',
      ],
      personalOpinion: [
        'Do you prefer eating Phở in the morning or for late-night supper, and why?',
        'If you were introducing Vietnamese food to an international friend, would Phở be your top recommendation?',
      ],
    },
  },
  {
    id: 'ha-long-bay',
    title: 'Ha Long Bay: Myths of the Descending Dragon',
    vietnameseTitle: 'Vịnh Hạ Long: Truyền Thuyết Rồng Đáp Xuống Biển',
    category: 'Nature',
    provinceId: 'quang-ninh',
    provinceName: 'Quảng Ninh',
    region: 'north',
    cefrLevel: 'B1',
    durationMinutes: 7,
    summaryEn:
      'Ha Long Bay features thousands of towering limestone karst islands emerging from tranquil emerald waters. UNESCO has recognized it as a World Natural Heritage site for both its breathtaking geological beauty and ancient ecological biodiversity.',
    summaryVi:
      'Vịnh Hạ Long nổi tiếng với hàng nghìn đảo đá vôi kỳ vĩ nhô lên giữa làn nước xanh ngọc bích, được UNESCO vinh danh là Di sản Thiên nhiên Thế giới.',
    keyVocabularies: [
      {
        word: 'limestone karst',
        ipa: '/ˈlaɪm.stəʊn kɑːst/',
        meaningVi: 'địa hình đảo đá vôi karst kỳ vĩ',
        exampleSentence: 'Ha Long Bay is globally famous for its magnificent limestone karst pillars.',
      },
      {
        word: 'emerald waters',
        ipa: '/ˈem.ər.əld ˈwɔː.təz/',
        meaningVi: 'làn nước xanh ngọc bích',
        exampleSentence: 'Cruise boats glide gracefully across the calm emerald waters.',
      },
      {
        word: 'descending dragon',
        ipa: '/dɪˈsen.dɪŋ ˈdræɡ.ən/',
        meaningVi: 'rồng hạ thế (nguồn gốc tên Hạ Long)',
        exampleSentence: 'Legend holds that the bay was formed by a descending dragon spitting pearls.',
      },
      {
        word: 'floating village',
        ipa: '/ˈfləʊ.tɪŋ ˈvɪl.ɪdʒ/',
        meaningVi: 'làng chài nổi trên biển',
        exampleSentence: 'Local fishermen have lived in peaceful floating villages for generations.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'According to Vietnamese folklore, what is the mythic origin of the name Ha Long?',
        'Why was Ha Long Bay recognized by UNESCO as a World Natural Heritage site?',
      ],
      personalOpinion: [
        'Would you prefer spending an overnight stay on a wooden cruise ship or exploring hidden sea caves?',
        'What sustainable tourism practices should we follow to protect Ha Long marine ecology?',
      ],
    },
  },
  {
    id: 'gong-culture-tay-nguyen',
    title: 'The Sacred Space of Gong Culture in Central Highlands',
    vietnameseTitle: 'Không Gian Văn Hóa Cồng Chiêng Tây Nguyên',
    category: 'Heritage',
    provinceId: 'dak-lak',
    provinceName: 'Đắk Lắk (Tây Nguyên)',
    region: 'central',
    cefrLevel: 'B2',
    durationMinutes: 8,
    summaryEn:
      'The Gong Culture of Vietnam’s Central Highlands is an intangible UNESCO cultural masterpiece. Gong ensembles communicate with ancestral spirits, accompany community harvest rituals, and bind ethnic communities together around communal fires.',
    summaryVi:
      'Không gian văn hóa Cồng Chiêng Tây Nguyên là kiệt tác di sản phi vật thể nhân loại, sợi dây tâm linh kết nối con người với thần linh và buôn làng quanh ngọn lửa hồng.',
    keyVocabularies: [
      {
        word: 'gong ensemble',
        ipa: '/ɡɒŋ ɒnˈsɒm.bəl/',
        meaningVi: 'dàn hòa tấu cồng chiêng',
        exampleSentence: 'The village gong ensemble plays solemn rhythms during the buffalo sacrifice ceremony.',
      },
      {
        word: 'ancestral spirit',
        ipa: '/ænˈses.trəl ˈspɪr.ɪt/',
        meaningVi: 'linh hồn tổ tiên, thần linh hộ mệnh',
        exampleSentence: 'Gong melodies are believed to communicate directly with ancestral spirits.',
      },
      {
        word: 'communal stilt house',
        ipa: '/kəˈmjuː.nəl stɪlt haʊs/',
        meaningVi: 'nhà rông cộng đồng, nhà sàn',
        exampleSentence: 'Villagers gather inside the communal stilt house for harvest celebrations.',
      },
      {
        word: 'intangible heritage',
        ipa: '/ɪnˈtæn.dʒə.bəl ˈher.ɪ.tɪdʒ/',
        meaningVi: 'di sản văn hóa phi vật thể',
        exampleSentence: 'UNESCO recognized the Gong Culture as an intangible cultural heritage of humanity.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'What spiritual role do bronze gongs play in ethnic minority communities of Central Highlands?',
        'Where do community members usually gather when hearing the gong call?',
      ],
      personalOpinion: [
        'How can younger generations be encouraged to preserve ethnic musical traditions?',
        'Have you ever experienced live ethnic instrument performances? What impressed you most?',
      ],
    },
  },
  {
    id: 'non-la-culture',
    title: 'Nón Lá: The Symbolic Craft of Vietnamese Conical Hats',
    vietnameseTitle: 'Nón Lá: Biểu Tượng Duyên Dáng Của Làng Nghề Việt',
    category: 'Crafts',
    provinceId: 'thua-thien-hue',
    provinceName: 'Thừa Thiên Huế',
    region: 'central',
    cefrLevel: 'A2',
    durationMinutes: 5,
    summaryEn:
      'The Nón Lá (conical leaf hat) is an iconic symbol of Vietnamese elegance and hard work. Made from dried palm leaves stitched onto bamboo frames, special poem-hats (nón bài thơ) from Hue reveal poetic verses when held against the sunlight.',
    summaryVi:
      'Nón lá là biểu tượng thanh lịch, chịu thương chịu khó của người phụ nữ Việt Nam. Đặc biệt nón bài thơ xứ Huế còn ẩn chứa những câu thơ trữ tình khi soi dưới ánh mặt trời.',
    keyVocabularies: [
      {
        word: 'conical hat',
        ipa: '/ˈkɒn.ɪ.kəl hæt/',
        meaningVi: 'nón lá hình chóp nón',
        exampleSentence: 'The conical hat protects farmers from tropical sun and heavy rain.',
      },
      {
        word: 'palm leaf',
        ipa: '/pɑːm liːf/',
        meaningVi: 'lá cọ, lá nón đã phơi khô',
        exampleSentence: 'Artisans carefully iron dry palm leaves before stitching them onto bamboo rings.',
      },
      {
        word: 'bamboo frame',
        ipa: '/bæmˈbuː freɪm/',
        meaningVi: 'khung vành tre tạo dáng nón',
        exampleSentence: 'A standard Hue conical hat consists of sixteen delicate bamboo frame rings.',
      },
      {
        word: 'poem-inlaid hat',
        ipa: '/ˈpəʊ.ɪm ˌɪn.leɪd hæt/',
        meaningVi: 'nón bài thơ (đặc sản xứ Huế)',
        exampleSentence: 'When held up to the sunlight, the poem-inlaid hat reveals hidden verses and landscapes.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'What natural materials are used by craft village artisans to make a traditional Nón Lá?',
        'What secret feature makes the Hue poem-hat (nón bài thơ) unique when held against sunlight?',
      ],
      personalOpinion: [
        'Why do you think Nón Lá paired with Áo Dài has become the signature visual symbol of Vietnam?',
        'If you visited Hue, would you like to try making your own custom conical hat at a craft village?',
      ],
    },
  },
  {
    id: 'my-son-sanctuary',
    title: 'Mỹ Sơn Sanctuary: Ancient Champa Kingdom Brick Temples',
    vietnameseTitle: 'Thánh Địa Mỹ Sơn: Quần Thể Đền Tháp Chăm Pa Cổ Kính',
    category: 'Heritage',
    provinceId: 'quang-nam',
    provinceName: 'Quảng Nam',
    region: 'central',
    cefrLevel: 'B2',
    durationMinutes: 8,
    summaryEn:
      'Nestled in a lush green valley in Quang Nam, Mỹ Sơn Sanctuary is an archaeological complex of red brick temples built by the kings of Champa between the 4th and 14th centuries to honor Hindu deities.',
    summaryVi:
      'Nằm giữa thung lũng xanh tươi tỉnh Quảng Nam, Thánh địa Mỹ Sơn là quần thể tháp gạch đỏ huyền bí được xây dựng bởi các vương triều Champa từ thế kỷ 4 đến thế kỷ 14.',
    keyVocabularies: [
      {
        word: 'archaeological complex',
        ipa: '/ˌɑː.ki.əˈlɒdʒ.ɪ.kəl ˈkɒm.pleks/',
        meaningVi: 'quần thể di tích khảo cổ học',
        exampleSentence: 'My Son is one of Southeast Asia most renowned archaeological complexes.',
      },
      {
        word: 'mortarless brickwork',
        ipa: '/ˈmɔː.tə.ləs ˈbrɪk.wɜːk/',
        meaningVi: 'kỹ thuật xây gạch không lộ mạch vữa kết dính',
        exampleSentence: 'Scientists still marvel at the mystery of Champa mortarless brickwork technique.',
      },
      {
        word: 'Hindu deity',
        ipa: '/ˈhɪn.duː ˈdiː.ə.ti/',
        meaningVi: 'vị thần trong Ấn Độ giáo (Shiva, Vishnu)',
        exampleSentence: 'The sanctuaries were dedicated to Hindu deities, especially Lord Shiva.',
      },
      {
        word: 'sacred valley',
        ipa: '/ˈseɪ.krɪd ˈvæl.i/',
        meaningVi: 'thung lũng linh thiêng',
        exampleSentence: 'Surrounding mountain peaks guard this sacred valley from outside disturbances.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'Which ancient civilization built the red brick towers of Mỹ Sơn Sanctuary?',
        'What architectural mystery about the temple bricks continues to intrigue modern engineers?',
      ],
      personalOpinion: [
        'How do historical ruins like Mỹ Sơn help us understand the multicultural origins of Vietnam?',
        'What challenges do archaeologists face when restoring centuries-old brick structures damaged by wars?',
      ],
    },
  },
  {
    id: 'floating-markets-mekong',
    title: 'Cái Răng Floating Market & River Life in Mekong Delta',
    vietnameseTitle: 'Chợ Nổi Cái Răng & Nhịp Sống Sông Nước Miền Tây',
    category: 'Nature',
    provinceId: 'can-tho',
    provinceName: 'Cần Thơ',
    region: 'south',
    cefrLevel: 'B1',
    durationMinutes: 6,
    summaryEn:
      'Cái Răng Floating Market in Cần Thơ wakes before dawn with hundreds of vibrant boats trading tropical fruits and hot bowls of hủ tiếu. Sellers hang sample produce on tall bamboo poles so buyers can spot their wares across the river.',
    summaryVi:
      'Chợ nổi Cái Răng tại Cần Thơ nhộn nhịp từ sáng sớm với hàng trăm ghe xuồng buôn bán trái cây nhiệt đới và hủ tiếu nóng hổi, treo sản vật mẫu lên cây bẹo độc đáo.',
    keyVocabularies: [
      {
        word: 'floating market',
        ipa: '/ˈfləʊ.tɪŋ ˈmɑː.kɪt/',
        meaningVi: 'chợ nổi trên sông',
        exampleSentence: 'Cai Rang is the largest and most bustling floating market in the Mekong Delta.',
      },
      {
        word: 'bamboo sample pole',
        ipa: '/bæmˈbuː ˈsɑːm.pəl pəʊl/',
        meaningVi: 'cây bẹo treo hàng mẫu chào bán',
        exampleSentence: 'Merchants hang pineapples and watermelons on a bamboo sample pole called cay beo.',
      },
      {
        word: 'river tributary',
        ipa: '/ˈrɪv.ər ˈtrɪb.jə.tər.i/',
        meaningVi: 'nhánh sông, phụ lưu sông Mekong',
        exampleSentence: 'Life in the delta revolves around interconnected river tributaries and canals.',
      },
      {
        word: 'tropical orchard',
        ipa: '/ˈtrɒp.ɪ.kəl ˈɔː.tʃəd/',
        meaningVi: 'vườn cây ăn trái nhiệt đới',
        exampleSentence: 'Boats deliver fresh mangosteens and durians straight from lush tropical orchards.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'How do boat vendors at Cái Răng advertise what they are selling from a distance?',
        'Why does trading at the floating market start so early in the morning?',
      ],
      personalOpinion: [
        'Would you enjoy having breakfast and hot coffee on a gently rocking boat in the middle of a river?',
        'How can Mekong Delta communities preserve floating market culture in the era of modern road transport?',
      ],
    },
  },
  {
    id: 'nem-ran-spring-rolls',
    title: 'Nem Rán: The Crispy Tradition of Vietnamese Spring Rolls',
    vietnameseTitle: 'Nem Rán Truyền Thống: Món Ăn Không Thể Thiếu Ngày Tết',
    category: 'Cuisine',
    provinceId: 'ha-noi',
    provinceName: 'Hà Nội',
    region: 'north',
    cefrLevel: 'A2',
    durationMinutes: 5,
    summaryEn:
      'Nem Rán (deep-fried spring rolls) are a centerpiece of celebratory meals and Tet holiday feasts. Wrapped in thin rice paper with minced pork, wood ear mushrooms, glass noodles, and herbs, they are fried to golden perfection and paired with sweet-sour dipping sauce.',
    summaryVi:
      'Nem rán là món ăn tâm điểm trong mâm cỗ Tết cổ truyền, hòa quyện thịt băm, nấm mộc nhĩ, miến dong, bọc bánh đa nem chiên giòn rụm chấm nước mắm chua ngọt.',
    keyVocabularies: [
      {
        word: 'crispy roll',
        ipa: '/ˈkrɪs.pi rəʊl/',
        meaningVi: 'nem cuộn giòn rụm',
        exampleSentence: 'Everyone loves the crispy roll texture when eaten fresh from the pan.',
      },
      {
        word: 'wood ear mushroom',
        ipa: '/wʊd ɪər ˈmʌʃ.ruːm/',
        meaningVi: 'nấm mộc nhĩ, nấm mèo',
        exampleSentence: 'Shredded wood ear mushrooms add a delightful crunchy bite to the filling.',
      },
      {
        word: 'rice paper wrapper',
        ipa: '/raɪs ˈpeɪ.pər ˈræp.ər/',
        meaningVi: 'bánh tráng, bánh đa nem gói',
        exampleSentence: 'Dip the dry rice paper wrapper lightly in beer or water to make it golden and crispy.',
      },
      {
        word: 'sweet-sour dipping sauce',
        ipa: '/swiːt saʊər ˈdɪp.ɪŋ sɔːs/',
        meaningVi: 'nước mắm chua ngọt tỏi ớt',
        exampleSentence: 'A balanced sweet-sour dipping sauce with garlic and chili completes the dish.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'What main ingredients are mixed inside the traditional filling of northern Nem Rán?',
        'What special family occasions in Vietnam always feature a platter of golden spring rolls?',
      ],
      personalOpinion: [
        'Have you ever rolled spring rolls with your family before a big festive gathering?',
        'What is your personal secret recipe for making the perfect dipping fish sauce?',
      ],
    },
  },
  {
    id: 'dong-ho-paintings',
    title: 'Đông Hồ Folk Woodblock Paintings',
    vietnameseTitle: 'Tranh Dân Gian Đông Hồ Dùng Màu Tự Nhiên',
    category: 'Crafts',
    provinceId: 'bac-ninh',
    provinceName: 'Bắc Ninh',
    region: 'north',
    cefrLevel: 'A2',
    durationMinutes: 5,
    summaryEn:
      'Originating from Bac Ninh province, Đông Hồ folk woodblock paintings are created using completely natural mineral and herbal colors printed on sparkling scallop-shell paper (giấy điệp). They express heartfelt wishes for prosperity, luck, and family harmony.',
    summaryVi:
      'Tranh dân gian Đông Hồ đất Bắc Ninh được in khắc gỗ bằng màu sắc tự nhiên từ cây cỏ, sỏi đá trên nền giấy điệp lấp lánh, gửi gắm ước nguyện no ấm, hòa thuận.',
    keyVocabularies: [
      {
        word: 'woodblock print',
        ipa: '/ˈwʊd.blɒk prɪnt/',
        meaningVi: 'tranh khắc ván gỗ dân gian',
        exampleSentence: 'Each color in a Dong Ho woodblock print requires a separate carved wooden block.',
      },
      {
        word: 'natural pigment',
        ipa: '/ˈnætʃ.ər.əl ˈpɪɡ.mənt/',
        meaningVi: 'màu vẽ chiết xuất từ thiên nhiên (hoa hòe, tro rơm, sỏi son)',
        exampleSentence: 'Artisans extract natural pigments: black from burnt bamboo leaves and yellow from pagoda tree flowers.',
      },
      {
        word: 'scallop-shell paper',
        ipa: '/ˈskɒl.əp ʃel ˈpeɪ.pər/',
        meaningVi: 'giấy điệp óng ánh bột vỏ sò điệp',
        exampleSentence: 'The shimmering background is crafted from scallop-shell paper ground with rice paste.',
      },
      {
        word: 'folk blessing',
        ipa: '/fəʊk ˈbles.ɪŋ/',
        meaningVi: 'lời chúc tụng may mắn dân gian',
        exampleSentence: 'Paintings of fat pigs and roosters carry folk blessings for wealth and fertility in the new year.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'How do Dong Ho village artisans produce their brilliant natural red, yellow, and black colors?',
        'Why does the traditional paper used for Dong Ho paintings shimmer softly in natural light?',
      ],
      personalOpinion: [
        'Do you think modern homes should display traditional folk art alongside contemporary decor?',
        'What can artists do to keep traditional woodblock printing relevant to younger digital audiences?',
      ],
    },
  },
];

/**
 * Helper search and lookup functions
 */
export function findLessonById(id: string): LessonAgentMetadata | undefined {
  return LESSON_AGENT_CATALOG.find(l => l.id === id);
}

export function searchLessonsByKeyword(keyword: string): LessonAgentMetadata[] {
  const norm = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return LESSON_AGENT_CATALOG.filter(l => {
    const titleNorm = l.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const viTitleNorm = l.vietnameseTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const provinceNorm = l.provinceName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return (
      titleNorm.includes(norm) ||
      viTitleNorm.includes(norm) ||
      provinceNorm.includes(norm) ||
      l.category.toLowerCase().includes(norm)
    );
  });
}

export function filterLessons(filter: {
  region?: 'north' | 'central' | 'south' | 'all';
  category?: 'Cuisine' | 'Heritage' | 'Crafts' | 'Nature' | 'Folklore';
  cefrLevel?: 'A2' | 'B1' | 'B2';
}): LessonAgentMetadata[] {
  return LESSON_AGENT_CATALOG.filter(l => {
    if (filter.region && filter.region !== 'all' && l.region !== filter.region) {
      return false;
    }
    if (filter.category && l.category !== filter.category) {
      return false;
    }
    if (filter.cefrLevel && l.cefrLevel !== filter.cefrLevel) {
      return false;
    }
    return true;
  });
}
