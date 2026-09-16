import type { Lesson, UserReflection } from '../types';
import picHue from '../assets/pictures/1789477888834_3466390194730922005_g2285579428170464438_97fb29714b65f3e4f91196487a1510be.jpg';
import picDongHo from '../assets/pictures/1789477897671_3466390194730922005_g2285579428170464438_208c3b16036482dde07954a98eba6f37.jpg';
import picAoDai from '../assets/pictures/1789477908863_3466390194730922005_g2285579428170464438_43e95faf8835448ecde377e2b7447d69.jpg';

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'dong-ho-paintings',
    titleEn: 'Dong Ho Folk Woodcut Paintings: The Soul of Vietnamese Traditional Art',
    titleVi: 'Tranh Dân Gian Đông Hồ: Hồn Cốt Mỹ Thuật Mộc Bản Dân Tộc',
    category: 'festivals',
    categoryNameVi: 'Nghệ thuật & Dân gian',
    level: 'B2',
    readTime: '4 phút đọc',
    imageUrl: picDongHo,
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
  {
    id: 'hue-citadel',
    titleEn: 'The Imperial Citadel of Hue: Architectural Grandeur & Royal Geomancy',
    titleVi: 'Đại Nội Cố Đô Huế: Kỳ Quan Kiến Trúc Hoàng Thành & Phong Thủy Cung Đình',
    category: 'heritage',
    categoryNameVi: 'Lịch sử & Di sản',
    level: 'B2',
    readTime: '4 phút đọc',
    imageUrl: picHue,
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
  {
    id: 'vietnamese-ao-dai',
    titleEn: 'Vietnamese Ao Dai & Silk Heritage: The Graceful Silhouette of Tradition',
    titleVi: 'Tà Áo Dài & Lụa Tơ Tằm: Dáng Vẻ Thanh Lịch Của Tinh Thần Dân Tộc',
    category: 'traditions',
    categoryNameVi: 'Đời sống & Truyền thống',
    level: 'B1',
    readTime: '3 phút đọc',
    imageUrl: picAoDai,
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
  {
    id: 'saigon-banh-mi',
    titleEn: 'Saigon Banh Mi: A Culinary Juxtaposition of French Baguette & Vietnamese Flavors',
    titleVi: 'Bánh Mì Sài Gòn: Sự Kết Hợp Tinh Tế Giữa Baguette Pháp & Hương Vị Việt',
    category: 'cuisine',
    categoryNameVi: 'Ẩm thực',
    level: 'B1',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=1200&q=80',
    summary: 'Nét sáng tạo của ẩm thực đường phố biến chiếc bánh mì giòn rụm thành biểu tượng thế giới.',
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
  {
    id: 'hoi-an-ancient-town',
    titleEn: 'Hoi An Ancient Town: Lanterns, Wooden Bridges and Heritage Shop-houses',
    titleVi: 'Phố Cổ Hội An: Đèn Lồng Sắc Màu, Chùa Cầu Cổ Kính & Phố Mái Ngêu Phong',
    category: 'heritage',
    categoryNameVi: 'Lịch sử & Di sản',
    level: 'A2',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    summary: 'Thương cảng thế kỷ 16 với những ngôi nhà tường vàng mái ngói âm dương rêu phong bên dòng sông Hoài.',
    totalReads: 980,
    likes: 215,
    paragraphs: [
      {
        id: 1,
        english: 'Hoi An was a prominent Asian trading port from the 15th to the 19th century. Merchants from Japan, China, and Europe came here to exchange silk, spices, and ceramics.',
        vietnamese: 'Hội An từng là một thương cảng sầm uất của châu Á từ thế kỷ 15 đến thế kỷ 19. Các thương nhân từ khắp nơi đã đến đây để trao đổi lụa tơ tằm, gia vị và gốm sứ.',
        highlightWords: ['prominent', 'merchants', 'ceramics']
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
  },
  {
    id: 'ha-long-bay',
    titleEn: 'Ha Long Bay: The Legend of Descending Dragons and Emerald Karsts',
    titleVi: 'Vịnh Hạ Long: Huyền Tích Rồng Mẹ Giáng Thế Giữa Làn Nước Ngọc Bích',
    category: 'landscapes',
    categoryNameVi: 'Danh lam thắng cảnh',
    level: 'B1',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    summary: 'Hàng ngàn đảo đá vôi kỳ vĩ nhô lên giữa vịnh biển ngọc bích phẳng lặng.',
    totalReads: 1780,
    likes: 490,
    paragraphs: [
      {
        id: 1,
        english: 'Featuring thousands of limestone karsts and isles rising dramatically from tranquil emerald waters, Ha Long Bay is a mesmerizing natural wonder of Southeast Asia.',
        vietnamese: 'Với hàng ngàn đảo đá vôi nhô lên sừng sững giữa làn nước ngọc bích phẳng lặng, Vịnh Hạ Long là một kỳ quan thiên nhiên kỳ vĩ của đất nước.',
        highlightWords: ['limestone', 'dramatically', 'mesmerizing']
      }
    ],
    vocabularies: [
      {
        id: 'v9',
        word: 'mesmerizing',
        ipa: '/ˈmezməraɪzɪŋ/',
        pos: 'adjective',
        vietnameseMeaning: 'Mê hoặc, cuốn hút lòng người',
        contextSentence: 'Ha Long Bay is a mesmerizing natural wonder of Southeast Asia.',
        highlightedWordInContext: 'mesmerizing',
        level: 'B2',
        usageNote: 'Từ gợi cảm xúc mạnh mẽ khi miêu tả cảnh quan thiên nhiên tráng lệ.'
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
    content: 'Learning about Dong Ho folk woodcut aesthetics in English feels so rewarding! The word "quintessence" and "pigments" helped me describe how artisans use bamboo soot and scallop shells to create Diep paper. I love the folk woodblock design of this website!',
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
    content: 'The 3D flashcards with original context sentences helped words like "quintessential" stick immediately in my mind. The woodblock stamp button style is so uniquely Vietnamese!',
    usedVocab: ['quintessential', 'enduring'],
    createdAt: 'Hôm qua',
    likes: 45
  }
];
