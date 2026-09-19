import type { Lesson, UserReflection } from '../types';

export const MOCK_LESSONS: Lesson[] = [
  // 1. Lễ hội & sắc màu
  {
    id: 'dong-ho-paintings',
    titleEn: 'Dong Ho Folk Woodcut Paintings: The Soul of Vietnamese Traditional Art',
    titleVi: 'Tranh Dân Gian Đông Hồ: Hồn Cốt Mỹ Thuật Mộc Bản Dân Tộc',
    category: 'le-hoi',
    categoryNameVi: 'Lễ hội & sắc màu',
    level: 'B2',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    summary: 'Nét khắc than củi đanh gọn, màu khoáng từ điệp sò, hoa hòe và tro lá tre tạo nên bức tranh dân gian tràn đầy sức sống.',
    featured: true,
    totalReads: 1890,
    likes: 540,
    paragraphs: [
      {
        id: 1,
        english: 'Originating from Bac Ninh province, Dong Ho folk woodcut paintings embody the quintessence of Vietnamese rural philosophy and cultural aesthetics. Each artwork is printed manually on Dzo paper coated with a shimmering layer of crushed scallop shells known as Diep paper.',
        vietnamese: 'Bắt nguồn từ làng tranh Đông Hồ tỉnh Bắc Ninh, tranh khắc gỗ dân gian là hiện thân của tinh hoa triết lý nông thôn và mỹ thuật truyền thống Việt Nam. Mỗi bức tranh được in thủ công trên giấy Dó quét lớp bột vỏ sò điệp lấp lánh.',
        highlightWords: ['quintessence', 'aesthetics', 'shimmering']
      },
      {
        id: 2,
        english: 'The artisans rely entirely on natural mineral pigments: soot from burned bamboo leaves for deep black outlines, gardenia seeds and sophora flowers for radiant yellow, and verdigris rust for antique jade green.',
        vietnamese: 'Các nghệ nhân hoàn toàn sử dụng phẩm màu tự nhiên từ khoáng vật: than tro lá tre cho nét viền đen than đanh gọn, hạt dành dành và hoa hòe cho sắc vàng rực rỡ, và gỉ đồng cho sắc xanh ngọc cổ kính.',
        highlightWords: ['artisans', 'pigments', 'verdigris']
      },
      {
        id: 3,
        english: 'Beyond their decorative charm, these woodcuts convey auspicious blessings for prosperity, harmonious family life, and satirize feudal corruption with witty allegories like the famous Wedding of Mice.',
        vietnamese: 'Vượt lên giá trị trang trí ngày Tết, tranh khắc gỗ gửi gắm những lời chúc phúc cát tường về sự hưng thịnh, gia đình thuận hòa, và châm biếm thói hư tật xấu bằng những ẩn dụ dí dỏm như bức Đám cưới chuột.',
        highlightWords: ['auspicious', 'prosperity', 'allegories']
      }
    ],
    vocabularies: [
      {
        id: 'v-dh1',
        word: 'quintessence',
        ipa: '/kwɪnˈtesns/',
        pos: 'noun',
        vietnameseMeaning: 'Tinh hoa, phần tinh túy nhất của một nền văn hóa',
        contextSentence: 'Dong Ho folk woodcut paintings embody the quintessence of Vietnamese rural philosophy.',
        highlightedWordInContext: 'quintessence',
        level: 'C1',
        usageNote: 'Thường dùng trong văn viết học thuật: "the quintessence of Vietnamese culture".'
      },
      {
        id: 'v-dh2',
        word: 'aesthetics',
        ipa: '/iːsˈθetɪks/',
        pos: 'noun',
        vietnameseMeaning: 'Mỹ học, tính thẩm mỹ, quan niệm về cái đẹp',
        contextSentence: 'Reflecting traditional cultural aesthetics and woodcut craftsmanship.',
        highlightedWordInContext: 'aesthetics',
        level: 'B2',
        usageNote: 'Dùng khi thảo luận về nghệ thuật tạo hình, kiến trúc hoặc thời trang.'
      },
      {
        id: 'v-dh3',
        word: 'pigments',
        ipa: '/ˈpɪɡmənts/',
        pos: 'noun',
        vietnameseMeaning: 'Sắc tố, phẩm màu tự nhiên (khoáng thô, thảo mộc)',
        contextSentence: 'The artisans rely entirely on natural mineral pigments from plants and seashells.',
        highlightedWordInContext: 'pigments',
        level: 'B2',
        usageNote: 'Chỉ các chất màu lấy từ thiên nhiên dùng trong hội họa truyền thống.'
      },
      {
        id: 'v-dh4',
        word: 'auspicious',
        ipa: '/ɔːˈspɪʃəs/',
        pos: 'adjective',
        vietnameseMeaning: 'Cát tường, mang lại may mắn và điềm lành',
        contextSentence: 'These woodcuts convey auspicious blessings for prosperity and joy.',
        highlightedWordInContext: 'auspicious',
        level: 'C1',
        usageNote: 'Thường dùng trong các dịp lễ tết, sự kiện văn hóa đầu xuân: "an auspicious start".'
      }
    ]
  },

  // 2. Truyền thuyết
  {
    id: 'ha-long-bay',
    titleEn: 'Ha Long Bay: The Legend of Descending Dragons and Emerald Karsts',
    titleVi: 'Vịnh Hạ Long: Huyền Tích Rồng Mẹ Giáng Thế Giữa Làn Nước Ngọc Bích',
    category: 'truyen-thuyet',
    categoryNameVi: 'Truyền thuyết',
    level: 'B1',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    summary: 'Hàng ngàn đảo đá vôi kỳ vĩ nhô lên giữa vịnh biển ngọc bích, bắt nguồn từ truyền thuyết đàn rồng phun châu ngọc bảo vệ bờ cõi.',
    totalReads: 1780,
    likes: 490,
    paragraphs: [
      {
        id: 1,
        english: 'Featuring thousands of limestone karsts and isles rising dramatically from tranquil emerald waters, Ha Long Bay is steeped in ancient mythology. According to folklore, the Jade Emperor sent Mother Dragon and her offspring to help the Vietnamese defend their homeland from foreign invaders.',
        vietnamese: 'Với hàng ngàn đảo đá vôi nhô lên sừng sững giữa làn nước ngọc bích phẳng lặng, Vịnh Hạ Long thấm đẫm các huyền tích cổ xưa. Theo truyền thuyết dân gian, Ngọc Hoàng đã phái Rồng Mẹ cùng đàn con hạ phàm giúp người Việt chống giặc ngoại xâm.',
        highlightWords: ['limestone', 'mythology', 'folklore']
      },
      {
        id: 2,
        english: 'The dragons incinerated enemy vessels with divine fire and scattered emerald jewels that instantly metamorphosed into formidable island ramparts across the gulf.',
        vietnamese: 'Đoàn rồng thiêu rụi thuyền giặc bằng ngọn lửa thần và nhả ra vô số ngọc châu, ngay lập tức hóa thành những hòn đảo trùng điệp như bức trường thành vững chãi bảo vệ bờ cõi.',
        highlightWords: ['incinerated', 'metamorphosed', 'ramparts']
      }
    ],
    vocabularies: [
      {
        id: 'v-hl1',
        word: 'folklore',
        ipa: '/ˈfəʊklɔː/',
        pos: 'noun',
        vietnameseMeaning: 'Văn hóa dân gian, truyền thuyết truyền miệng của cộng đồng',
        contextSentence: 'According to Vietnamese folklore, the Jade Emperor sent dragons to defend the land.',
        highlightedWordInContext: 'folklore',
        level: 'B2',
        usageNote: 'Dùng khi nói về các câu chuyện thần thoại dân gian lưu truyền từ đời này sang đời khác.'
      },
      {
        id: 'v-hl2',
        word: 'metamorphosed',
        ipa: '/ˌmetəˈmɔːfəʊzd/',
        pos: 'verb',
        vietnameseMeaning: 'Biến hóa, chuyển thể một cách kỳ diệu',
        contextSentence: 'The jewels instantly metamorphosed into formidable limestone islands.',
        highlightedWordInContext: 'metamorphosed',
        level: 'C1',
        usageNote: 'Từ vựng cao cấp miêu tả sự biến đổi kỳ ảo trong huyền sử văn học.'
      }
    ]
  },

  // 3. Nếp sống & văn hóa
  {
    id: 'vietnamese-ao-dai',
    titleEn: 'Vietnamese Ao Dai & Silk Heritage: The Graceful Silhouette of Tradition',
    titleVi: 'Tà Áo Dài & Lụa Tơ Tằm: Dáng Vẻ Thanh Lịch Của Tinh Thần Dân Tộc',
    category: 'van-hoa',
    categoryNameVi: 'Nếp sống & văn hóa',
    level: 'B1',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    summary: 'Tà áo dài lụa tơ tằm thướt tha hòa cùng sắc sen ngọc, biểu trưng cho vẻ đẹp kín đáo và kiêu hãnh của phụ nữ Việt.',
    totalReads: 1650,
    likes: 490,
    paragraphs: [
      {
        id: 1,
        english: 'The Ao Dai is widely celebrated as the quintessential national attire of Vietnam. Its flowing silk flaps over loose-fitting trousers create a harmonious silhouette that blends elegance with modesty.',
        vietnamese: 'Áo dài được tôn vinh là quốc phục tiêu biểu nhất của Việt Nam. Tà lụa mềm mại bay bổng bên trên chiếc quần ống rộng tạo nên dáng vẻ hài hòa kết hợp giữa thanh lịch và đoan trang.',
        highlightWords: ['quintessential', 'attire', 'silhouette']
      },
      {
        id: 2,
        english: 'Worn with pride during traditional festivals, Lunar New Year, and weddings, the garment transcends generations to remain an enduring cultural emblem of Vietnamese identity.',
        vietnamese: 'Được khoác lên đầy tự hào trong các lễ hội cổ truyền, Tết Nguyên Đán và lễ cưới, chiếc áo vượt qua mọi thế hệ để luôn là biểu tượng văn hóa trường tồn của bản sắc Việt.',
        highlightWords: ['transcends', 'enduring', 'emblem']
      }
    ],
    vocabularies: [
      {
        id: 'v3',
        word: 'quintessential',
        ipa: '/ˌkwɪntɪˈsenʃl/',
        pos: 'adjective',
        vietnameseMeaning: 'Tiêu biểu nhất, chuẩn mực tinh túy nhất',
        contextSentence: 'The Ao Dai is widely celebrated as the quintessential national attire of Vietnam.',
        highlightedWordInContext: 'quintessential',
        level: 'C1',
        usageNote: 'Từ học thuật cao cấp mô tả đặc trưng hoàn hảo nhất của một nét văn hóa.'
      },
      {
        id: 'v4',
        word: 'enduring',
        ipa: '/ɪnˈdjʊərɪŋ/',
        pos: 'adjective',
        vietnameseMeaning: 'Trường tồn, bền bỉ cùng thời gian',
        contextSentence: 'To remain an enduring cultural emblem of Vietnamese identity.',
        highlightedWordInContext: 'enduring',
        level: 'B2',
        usageNote: 'Dùng mô tả các giá trị văn hóa không bị phai mờ qua năm tháng.'
      }
    ]
  },

  // 4. Ẩm thực
  {
    id: 'saigon-banh-mi',
    titleEn: 'Saigon Banh Mi: A Culinary Juxtaposition of French Baguette & Vietnamese Flavors',
    titleVi: 'Bánh Mì Sài Gòn: Sự Kết Hợp Tinh Tế Giữa Baguette Pháp & Hương Vị Việt',
    category: 'am-thuc',
    categoryNameVi: 'Ẩm thực',
    level: 'B1',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=1200&q=80',
    summary: 'Nét sáng tạo của ẩm thực đường phố biến chiếc bánh mì giòn rụm thành biểu tượng văn hóa ẩm thực thế giới.',
    totalReads: 2150,
    likes: 620,
    paragraphs: [
      {
        id: 1,
        english: 'Vietnamese Banh Mi underwent a fascinating culinary transformation on the bustling streets of Saigon. Local bakers aerated the dough with rice flour to produce an exceptionally crisp crust and an airy interior.',
        vietnamese: 'Bánh mì Việt Nam đã trải qua một cuộc biến chuyển ẩm thực kỳ thú trên đường phố Sài Gòn. Thợ bánh địa phương kết hợp bột gạo để tạo nên lớp vỏ giòn rụm và phần ruột xốp nhẹ.',
        highlightWords: ['transformation', 'aerated', 'exceptionally']
      },
      {
        id: 2,
        english: 'What makes Banh Mi iconic is its harmonious juxtaposition of savory liver pâté, succulent roasted meats, pickled daikon, fresh cilantro, and chili.',
        vietnamese: 'Điều làm nên tên tuổi của Bánh mì chính là sự kết hợp hài hòa giữa pa-tê gan béo ngậy, thịt nướng thơm lừng, đồ chua thanh mát và rau mùi tươi ngon.',
        highlightWords: ['iconic', 'juxtaposition', 'succulent']
      }
    ],
    vocabularies: [
      {
        id: 'v6',
        word: 'juxtaposition',
        ipa: '/ˌdʒʌkstəpəˈzɪʃn/',
        pos: 'noun',
        vietnameseMeaning: 'Sự đặt cạnh nhau để tạo nên sự hòa quyện tương phản',
        contextSentence: 'Its harmonious juxtaposition of savory liver pâté and pickled daikon.',
        highlightedWordInContext: 'juxtaposition',
        level: 'C1',
        usageNote: 'Từ vựng đắt giá khi miêu tả sự giao thoa văn hóa hoặc nghệ thuật ẩm thực.'
      },
      {
        id: 'v7',
        word: 'succulent',
        ipa: '/ˈsʌkjələnt/',
        pos: 'adjective',
        vietnameseMeaning: 'Mọng nước, thơm ngon, đậm đà',
        contextSentence: 'Savory liver pâté, succulent roasted meats, and fresh herbs.',
        highlightedWordInContext: 'succulent',
        level: 'B2',
        usageNote: 'Tính từ cao cấp trong ẩm thực thay cho "delicious".'
      }
    ]
  },

  // 5. Nếp sống & di sản (Hue Citadel)
  {
    id: 'hue-citadel',
    titleEn: 'The Imperial Citadel of Hue: Architectural Grandeur & Royal Geomancy',
    titleVi: 'Đại Nội Cố Đô Huế: Kỳ Quan Kiến Trúc Hoàng Thành & Phong Thủy Cung Đình',
    category: 'van-hoa',
    categoryNameVi: 'Nếp sống & văn hóa',
    level: 'B2',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    summary: 'Sự kết hợp hoàn mỹ giữa phong thủy phương Đông, tường thành ngọ môn và sông Hương thơ mộng.',
    totalReads: 2410,
    likes: 680,
    paragraphs: [
      {
        id: 1,
        english: 'Nestled along the tranquil banks of the Perfume River, the Imperial Citadel of Hue stands as a monumental testament to the Nguyen Dynasty. Recognized as a UNESCO World Heritage site, this complex embodies the epitome of Vietnamese monarchical architecture.',
        vietnamese: 'Tọa lạc bên bờ sông Hương êm đềm, Đại Nội Huế sừng sững như một minh chứng hoành tráng cho triều đại nhà Nguyễn. Được UNESCO công nhận là Di sản Thế giới, quần thể này là hiện thân đỉnh cao của kiến trúc hoàng gia Việt Nam.',
        highlightWords: ['monumental', 'epitome', 'monarchical']
      },
      {
        id: 2,
        english: 'The citadel is meticulously designed according to Eastern geomancy and Confucian principles. Its majestic ramparts and intricate moats once shielded the Forbidden Purple City.',
        vietnamese: 'Kinh thành được thiết kế tỉ mỉ theo các nguyên lý phong thủy phương Đông và Nho giáo. Những tường thành uy nghiêm và hào nước tinh xảo từng che chở cho Tử Cấm Thành.',
        highlightWords: ['geomancy', 'ramparts', 'intricate']
      }
    ],
    vocabularies: [
      {
        id: 'v1',
        word: 'monumental',
        ipa: '/ˌmɒnjuˈmentl/',
        pos: 'adjective',
        vietnameseMeaning: 'Hoành tráng, vĩ đại, mang tầm vóc lịch sử',
        contextSentence: 'The Imperial Citadel of Hue stands as a monumental testament to the Nguyen Dynasty.',
        highlightedWordInContext: 'monumental',
        level: 'B2',
        usageNote: 'Dùng mô tả các công trình di tích hoặc dấu mốc lịch sử to lớn.'
      },
      {
        id: 'v2',
        word: 'geomancy',
        ipa: '/ˈdʒiːəmænsi/',
        pos: 'noun',
        vietnameseMeaning: 'Thuật phong thủy, xem thế đất và dòng nước',
        contextSentence: 'The citadel is meticulously designed according to Eastern geomancy and Confucian principles.',
        highlightedWordInContext: 'geomancy',
        level: 'C1',
        usageNote: 'Thuật ngữ học thuật chỉ nghệ thuật sắp đặt không gian hài hòa với tự nhiên.'
      }
    ]
  },

  // 6. Lễ hội & sắc màu (Hoi An Ancient Town)
  {
    id: 'hoi-an-ancient-town',
    titleEn: 'Hoi An Lantern Heritage: Ancient Colors along the Hoai River',
    titleVi: 'Phố Cổ Hội An: Đèn Lồng Sắc Màu, Chùa Cầu Cổ Kính & Phố Mái Rêu Phong',
    category: 'le-hoi',
    categoryNameVi: 'Lễ hội & sắc màu',
    level: 'A2',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    summary: 'Thương cảng thế kỷ 16 với những ngôi nhà tường vàng mái ngói âm dương và những đêm hội thả đèn hoa đăng lung linh.',
    totalReads: 980,
    likes: 215,
    paragraphs: [
      {
        id: 1,
        english: 'Hoi An was a prominent Asian trading port from the 15th to the 19th century. On the fourteenth night of every lunar month, the entire town extinguishes electric lights to illuminate thousands of handmade silk lanterns.',
        vietnamese: 'Hội An từng là một thương cảng sầm uất của châu Á từ thế kỷ 15 đến thế kỷ 19. Vào đêm rằm hàng tháng, cả phố cổ tắt hết đèn điện để thắp sáng hàng ngàn chiếc đèn lồng lụa thủ công rực rỡ.',
        highlightWords: ['prominent', 'illuminate', 'handmade']
      }
    ],
    vocabularies: [
      {
        id: 'v8',
        word: 'prominent',
        ipa: '/ˈprɒmɪnənt/',
        pos: 'adjective',
        vietnameseMeaning: 'Nổi bật, quan trọng, giữ vị trí then chốt',
        contextSentence: 'Hoi An was a prominent Asian trading port in the 16th century.',
        highlightedWordInContext: 'prominent',
        level: 'A2',
        usageNote: 'Mô tả vị trí nổi bật của nhân vật hoặc địa danh lịch sử.'
      }
    ]
  }
];

export const MOCK_REFLECTIONS: UserReflection[] = [
  {
    id: 'ref-1',
    lessonId: 'dong-ho-paintings',
    lessonTitle: 'Dong Ho Folk Woodcut Paintings',
    authorName: 'Mai Linh (Hà Nội)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    authorLevel: 'B2',
    content: 'Learning about Dong Ho folk woodcut aesthetics in English feels so rewarding! The word "quintessence" and "pigments" helped me describe how artisans use bamboo soot and scallop shells to create Diep paper. I love the warm heritage editorial design of this website!',
    usedVocab: ['quintessence', 'aesthetics', 'pigments'],
    createdAt: '1 giờ trước',
    likes: 32,
    userLiked: true
  },
  {
    id: 'ref-2',
    lessonId: 'hue-citadel',
    lessonTitle: 'The Imperial Citadel of Hue',
    authorName: 'Hoàng Long (Huế)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorLevel: 'B2',
    content: 'The bilingual paired reading makes it so intuitive to explain our royal geomancy and monarchical architecture to foreign friends. Best of all, I can practice writing my reflection freely without being graded or judged!',
    usedVocab: ['monumental', 'geomancy'],
    createdAt: '3 giờ trước',
    likes: 27
  },
  {
    id: 'ref-3',
    lessonId: 'vietnamese-ao-dai',
    lessonTitle: 'Vietnamese Ao Dai & Silk Heritage',
    authorName: 'Phương Thảo (TP.HCM)',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    authorLevel: 'B1',
    content: 'The 3D flashcards with original context sentences helped words like "quintessential" stick immediately in my mind. The warm paper style feels like reading a classic book!',
    usedVocab: ['quintessential', 'enduring'],
    createdAt: 'Hôm qua',
    likes: 45
  }
];
