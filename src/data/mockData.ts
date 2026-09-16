import type { Lesson, UserReflection } from '../types';

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'hue-imperial-city',
    titleEn: 'The Imperial City of Hue: Architectural Grandeur and Royal Legacy',
    titleVi: 'Cố Đô Huế: Kỳ Quan Kiến Trúc Hoàng Gia và Di Sản Trường Tồn',
    category: 'heritage',
    categoryNameVi: 'Lịch sử & Di sản',
    level: 'B2',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80',
    summary: 'Khám phá sự giao thoa hài hòa giữa kiến trúc cung đình triều Nguyễn và vẻ đẹp sông Hương êm đềm.',
    featured: true,
    totalReads: 1420,
    likes: 384,
    paragraphs: [
      {
        id: 1,
        english: 'Nestled along the tranquil banks of the Perfume River, the Imperial Citadel of Hue stands as a monumental testament to the Nguyen Dynasty. Recognized as a UNESCO World Heritage site, this sprawling complex embodies the epitome of Vietnamese monarchical architecture.',
        vietnamese: 'Tọa lạc bên bờ sông Hương êm đềm, Đại Nội Huế sừng sững như một minh chứng hoành tráng cho triều đại nhà Nguyễn. Được UNESCO công nhận là Di sản Thế giới, quần thể đồ sộ này là hiện thân đỉnh cao của kiến trúc hoàng gia Việt Nam.',
        highlightWords: ['monumental', 'epitome', 'monarchical']
      },
      {
        id: 2,
        english: 'The citadel is meticulously designed according to Eastern geomancy and Confucian principles. Its majestic ramparts and intricate moats once shielded the Forbidden Purple City, where the emperor and royal household conducted state affairs and resided.',
        vietnamese: 'Kinh thành được thiết kế tỉ mỉ theo các nguyên lý phong thủy phương Đông và Nho giáo. Những tường thành uy nghiêm và hào nước tinh xảo từng che chở cho Tử Cấm Thành, nơi hoàng đế và hoàng gia thiết triều và sinh sống.',
        highlightWords: ['geomancy', 'ramparts', 'intricate']
      },
      {
        id: 3,
        english: 'Despite the ravages of past conflicts, the restoration efforts have successfully revived the ornate palaces, solemn temples, and serene lotus ponds, offering modern visitors an evocative journey back into Vietnam\'s feudal golden era.',
        vietnamese: 'Bất chấp những tàn phá của các cuộc chiến trong quá khứ, những nỗ lực phục dựng đã hồi sinh thành công các cung điện nguy nga, những ngôi đền trang nghiêm và hồ sen thanh tịnh, mang đến cho du khách chuyến hành trình gợi nhớ về thời hoàng kim phong kiến Việt Nam.',
        highlightWords: ['ravages', 'ornate', 'evocative']
      }
    ],
    vocabularies: [
      {
        id: 'v1',
        word: 'monumental',
        ipa: '/ˌmɒnjuˈmentl/',
        pos: 'adjective',
        vietnameseMeaning: 'Hoành tráng, mang tính tượng đài, vĩ đại',
        contextSentence: 'The Imperial Citadel of Hue stands as a monumental testament to the Nguyen Dynasty.',
        highlightedWordInContext: 'monumental',
        level: 'B2',
        usageNote: 'Thường dùng để mô tả công trình kiến trúc hoặc thành tựu lịch sử quy mô lớn.'
      },
      {
        id: 'v2',
        word: 'epitome',
        ipa: '/ɪˈpɪtəmi/',
        pos: 'noun',
        vietnameseMeaning: 'Hiện thân mẫu mực, biểu tượng thu nhỏ hoàn hảo',
        contextSentence: 'This sprawling complex embodies the epitome of Vietnamese monarchical architecture.',
        highlightedWordInContext: 'epitome',
        level: 'C1',
        usageNote: 'Cấu trúc thường gặp: "the epitome of something" (ví dụ: the epitome of elegance).'
      },
      {
        id: 'v3',
        word: 'geomancy',
        ipa: '/ˈdʒiːəmænsi/',
        pos: 'noun',
        vietnameseMeaning: 'Thuật phong thủy, phép địa lý',
        contextSentence: 'The citadel is meticulously designed according to Eastern geomancy and Confucian principles.',
        highlightedWordInContext: 'geomancy',
        level: 'C1',
        usageNote: 'Thuật ngữ học thuật chỉ thuật xem thế đất, hướng gió và dòng nước để xây dựng cung điện.'
      },
      {
        id: 'v4',
        word: 'intricate',
        ipa: '/ˈɪntrɪkət/',
        pos: 'adjective',
        vietnameseMeaning: 'Phức tạp, tinh xảo, tỉ mỉ',
        contextSentence: 'Its majestic ramparts and intricate moats once shielded the Forbidden Purple City.',
        highlightedWordInContext: 'intricate',
        level: 'B2',
        usageNote: 'Dùng cho hoa văn điêu khắc, mạng lưới đường thủy, hoặc hệ thống kiến trúc nhiều chi tiết.'
      },
      {
        id: 'v5',
        word: 'evocative',
        ipa: '/ɪˈvɒkətɪv/',
        pos: 'adjective',
        vietnameseMeaning: 'Gợi cảm, gợi nhớ những ký ức sâu lắng',
        contextSentence: 'Offering modern visitors an evocative journey back into Vietnam\'s feudal golden era.',
        highlightedWordInContext: 'evocative',
        level: 'B2',
        usageNote: 'Từ học thuật thường dùng trong bài viết cảm nhận văn hóa, âm nhạc, nghệ thuật.'
      }
    ]
  },
  {
    id: 'saigon-banh-mi',
    titleEn: 'Saigon Banh Mi: The Culinary Symphony of French Heritage and Vietnamese Soul',
    titleVi: 'Bánh Mì Sài Gòn: Bản Giao Hưởng Ẩm Thực Giữa Di Sản Pháp và Tâm Hồn Việt',
    category: 'cuisine',
    categoryNameVi: 'Ẩm thực',
    level: 'B1',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=1200&q=80',
    summary: 'Cách chiếc bánh mì baguette của Pháp được người Sài Gòn biến tấu thành biểu tượng ẩm thực đường phố lừng danh thế giới.',
    featured: true,
    totalReads: 2150,
    likes: 620,
    paragraphs: [
      {
        id: 1,
        english: 'Originating from the French colonial baguette, Vietnamese Banh Mi underwent a fascinating culinary transformation on the bustling streets of Saigon. Local bakers aerated the dough with rice flour to produce an exceptionally crisp crust and an airy interior.',
        vietnamese: 'Có nguồn gốc từ chiếc bánh mì baguette thời Pháp thuộc, Bánh mì Việt Nam đã trải qua một cuộc biến chuyển ẩm thực kỳ thú trên những con phố nhộn nhịp của Sài Gòn. Các thợ bánh địa phương đã kết hợp bột gạo để tạo nên lớp vỏ giòn rụm và phần ruột xốp nhẹ.',
        highlightWords: ['transformation', 'aerated', 'exceptionally']
      },
      {
        id: 2,
        english: 'What makes Banh Mi iconic is its harmonious juxtaposition of contrasting textures and bold flavors: savory liver pâté, succulent roasted meats, pickled daikon and carrots, fresh cilantro, and a dash of spicy chili.',
        vietnamese: 'Điều làm nên tên tuổi của Bánh mì chính là sự đan cài hài hòa giữa những kết cấu đối lập và hương vị đậm đà: pa-tê gan béo ngậy, thịt nướng thơm lừng, đồ chua thanh mát, ngò rí tươi và chút ớt cay nồng.',
        highlightWords: ['iconic', 'juxtaposition', 'succulent']
      }
    ],
    vocabularies: [
      {
        id: 'v6',
        word: 'transformation',
        ipa: '/ˌtrænsfəˈmeɪʃn/',
        pos: 'noun',
        vietnameseMeaning: 'Sự biến đổi sâu sắc, chuyển hóa toàn diện',
        contextSentence: 'Vietnamese Banh Mi underwent a fascinating culinary transformation.',
        highlightedWordInContext: 'transformation',
        level: 'B1',
        usageNote: 'Dùng để diễn tả sự thay đổi tích cực về hình thức hoặc bản chất.'
      },
      {
        id: 'v7',
        word: 'juxtaposition',
        ipa: '/ˌdʒʌkstəpəˈzɪʃn/',
        pos: 'noun',
        vietnameseMeaning: 'Sự đặt cạnh nhau để làm nổi bật sự tương phản',
        contextSentence: 'What makes Banh Mi iconic is its harmonious juxtaposition of contrasting textures.',
        highlightedWordInContext: 'juxtaposition',
        level: 'C1',
        usageNote: 'Từ vựng đắt giá trong bài thi IELTS Writing khi so sánh nghệ thuật hoặc ẩm thực.'
      },
      {
        id: 'v8',
        word: 'succulent',
        ipa: '/ˈsʌkjələnt/',
        pos: 'adjective',
        vietnameseMeaning: 'Mọng nước, thơm ngon, đậm đà',
        contextSentence: 'Savory liver pâté, succulent roasted meats, and pickled daikon.',
        highlightedWordInContext: 'succulent',
        level: 'B2',
        usageNote: 'Tính từ cao cấp thay thế cho "delicious" hoặc "juicy" trong miêu tả món ăn.'
      }
    ]
  },
  {
    id: 'hoi-an-ancient-town',
    titleEn: 'Hoi An Ancient Town: Lanterns, Maritime Trade and Timeless Charm',
    titleVi: 'Phố Cổ Hội An: Ánh Đèn Lồng, Thương Cảng Hàng Hải và Nét Đẹp Vượt Thời Gian',
    category: 'heritage',
    categoryNameVi: 'Lịch sử & Di sản',
    level: 'A2',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    summary: 'Thương cảng cổ thế kỷ 16 với những mái nhà ngói rêu phong và dòng sông Hoài lung linh hoa đăng.',
    totalReads: 980,
    likes: 215,
    paragraphs: [
      {
        id: 1,
        english: 'Hoi An was a prominent Asian trading port from the 15th to the 19th century. Merchants from Japan, China, and Europe came here to exchange silk, spices, and ceramics.',
        vietnamese: 'Hội An từng là một thương cảng sầm uất của châu Á từ thế kỷ 15 đến thế kỷ 19. Các thương nhân từ Nhật Bản, Trung Quốc và châu Âu đã đến đây để trao đổi lụa, gia vị và gốm sứ.',
        highlightWords: ['prominent', 'merchants', 'ceramics']
      },
      {
        id: 2,
        english: 'Today, the town preserves its distinct yellow shop-houses, wooden Japanese bridge, and colorful handmade lanterns that illuminate the narrow streets every evening.',
        vietnamese: 'Ngày nay, thị trấn vẫn gìn giữ những dãy nhà phố màu vàng đặc trưng, chiếc Chùa Cầu gỗ của người Nhật và những chiếc đèn lồng thủ công rực rỡ thắp sáng các con phố nhỏ mỗi chiều tà.',
        highlightWords: ['preserves', 'distinct', 'illuminate']
      }
    ],
    vocabularies: [
      {
        id: 'v9',
        word: 'prominent',
        ipa: '/ˈprɒmɪnənt/',
        pos: 'adjective',
        vietnameseMeaning: 'Nổi bật, quan trọng, xuất chúng',
        contextSentence: 'Hoi An was a prominent Asian trading port from the 15th to the 19th century.',
        highlightedWordInContext: 'prominent',
        level: 'A2',
        usageNote: 'Dùng để mô tả vị trí hoặc nhân vật quan trọng trong lịch sử.'
      },
      {
        id: 'v10',
        word: 'illuminate',
        ipa: '/ɪˈluːmɪneɪt/',
        pos: 'verb',
        vietnameseMeaning: 'Thắp sáng, rọi sáng',
        contextSentence: 'Handmade lanterns that illuminate the narrow streets every evening.',
        highlightedWordInContext: 'illuminate',
        level: 'B1',
        usageNote: 'Từ đẹp dùng thay thế cho "light up" trong văn miêu tả cảnh đêm.'
      }
    ]
  },
  {
    id: 'ha-long-bay',
    titleEn: 'Ha Long Bay: The Legend of Descending Dragons and Emerald Waters',
    titleVi: 'Vịnh Hạ Long: Truyền Thuyết Rồng Giáng Thế và Làn Nước Ngọc Bích',
    category: 'landscapes',
    categoryNameVi: 'Danh lam thắng cảnh',
    level: 'B1',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    summary: 'Kỳ quan thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi kỳ vĩ nhô lên giữa làn nước xanh thẳm.',
    totalReads: 1780,
    likes: 490,
    paragraphs: [
      {
        id: 1,
        english: 'Featuring thousands of limestone karsts and isles rising dramatically from tranquil emerald waters, Ha Long Bay is a mesmerizing natural wonder of Southeast Asia.',
        vietnamese: 'Với hàng ngàn đảo đá vôi nhô lên sừng sững giữa làn nước ngọc bích phẳng lặng, Vịnh Hạ Long là một kỳ quan thiên nhiên kỳ vĩ làm say đắm lòng người của Đông Nam Á.',
        highlightWords: ['limestone', 'dramatically', 'mesmerizing']
      },
      {
        id: 2,
        english: 'According to ancient folklore, mother dragon and her children spat out jewels that turned into towering islands to defend the Vietnamese homeland from foreign invaders.',
        vietnamese: 'Theo truyền thuyết xa xưa, rồng mẹ và đàn rồng con đã nhả ra những viên ngọc châu biến thành các hòn đảo sừng sững để bảo vệ bờ cõi đất nước khỏi quân xâm lược.',
        highlightWords: ['folklore', 'towering', 'invaders']
      }
    ],
    vocabularies: [
      {
        id: 'v11',
        word: 'mesmerizing',
        ipa: '/ˈmezməraɪzɪŋ/',
        pos: 'adjective',
        vietnameseMeaning: 'Mê hoặc, cuốn hút lạ thường',
        contextSentence: 'Ha Long Bay is a mesmerizing natural wonder of Southeast Asia.',
        highlightedWordInContext: 'mesmerizing',
        level: 'B2',
        usageNote: 'Dùng để khen ngợi cảnh quan thiên nhiên hoặc màn trình diễn nghệ thuật ấn tượng.'
      }
    ]
  },
  {
    id: 'vietnamese-ao-dai',
    titleEn: 'The Elegance of Vietnamese Ao Dai: Flowing Silk and Cultural Identity',
    titleVi: 'Nét Thanh Lịch Của Áo Dài Việt Nam: Tà Lụa Bay và Bản Sắc Văn Hóa',
    category: 'traditions',
    categoryNameVi: 'Đời sống & Truyền thống',
    level: 'B2',
    readTime: '3 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    summary: 'Tà áo dài thướt tha tôn vinh vẻ đẹp kín đáo, duyên dáng và kiêu hãnh của người phụ nữ Việt Nam.',
    totalReads: 1210,
    likes: 310,
    paragraphs: [
      {
        id: 1,
        english: 'The Ao Dai is widely cherished as the quintessential national attire of Vietnam. Its figure-hugging tunic split into long front and back flaps over wide-legged trousers creates an unmatched silhouette of grace and modesty.',
        vietnamese: 'Áo dài được trân quý như trang phục truyền thống tiêu biểu nhất của Việt Nam. Thân áo ôm sát xẻ hai tà dài bay bổng bên trên chiếc quần ống rộng tạo nên một dáng vẻ thanh thoát, duyên dáng và kín đáo vô song.',
        highlightWords: ['quintessential', 'attire', 'modesty']
      }
    ],
    vocabularies: [
      {
        id: 'v12',
        word: 'quintessential',
        ipa: '/ˌkwɪntɪˈsenʃl/',
        pos: 'adjective',
        vietnameseMeaning: 'Tiêu biểu nhất, tinh túy nhất',
        contextSentence: 'The Ao Dai is widely cherished as the quintessential national attire of Vietnam.',
        highlightedWordInContext: 'quintessential',
        level: 'C1',
        usageNote: 'Từ học thuật cao cấp mô tả đặc trưng hoàn hảo nhất của một nét văn hóa.'
      }
    ]
  },
  {
    id: 'hanoi-egg-coffee',
    titleEn: 'Hanoi Egg Coffee: A Wartime Innovation That Became a Global Phenomenon',
    titleVi: 'Cà Phê Trứng Hà Nội: Sáng Kiến Thời Chiến Trở Thành Hiện Tượng Toàn Cầu',
    category: 'cuisine',
    categoryNameVi: 'Ẩm thực',
    level: 'C1',
    readTime: '4 phút đọc',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    summary: 'Câu chuyện ra đời của tách cà phê trứng béo ngậy giữa lòng phố cổ Hà Nội năm 1946.',
    totalReads: 1940,
    likes: 540,
    paragraphs: [
      {
        id: 1,
        english: 'In the late 1940s, severe milk shortages prompted Nguyen Van Giang, a resourceful bartender at the prestigious Metropole Hotel, to whisk egg yolks with condensed milk and robusta coffee, pioneering a velvety concoction.',
        vietnamese: 'Vào cuối những năm 1940, tình trạng khan hiếm sữa trầm trọng đã thôi thúc ông Nguyễn Văn Giảng, một nhân viên pha chế tháo vát tại khách sạn danh giá Metropole, đánh bông lòng đỏ trứng với sữa đặc và cà phê robusta, tiên phong tạo nên một thức uống sánh mịn ngọt ngào.',
        highlightWords: ['resourceful', 'prestigious', 'concoction']
      }
    ],
    vocabularies: [
      {
        id: 'v13',
        word: 'concoction',
        ipa: '/kənˈkɒkʃn/',
        pos: 'noun',
        vietnameseMeaning: 'Hỗn hợp pha chế độc đáo (đồ uống, món ăn)',
        contextSentence: 'Pioneering a velvety concoction that took Hanoi by storm.',
        highlightedWordInContext: 'concoction',
        level: 'C1',
        usageNote: 'Thường dùng để mô tả một công thức pha chế sáng tạo giữa nhiều thành phần lạ.'
      }
    ]
  }
];

export const MOCK_REFLECTIONS: UserReflection[] = [
  {
    id: 'ref-1',
    lessonId: 'hue-imperial-city',
    lessonTitle: 'The Imperial City of Hue',
    authorName: 'Mai Linh (Hà Nội)',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    authorLevel: 'B2',
    content: 'Reading about Hue Citadel gave me immense pride! I never knew how to describe the "geomancy" and "monarchical architecture" to my foreign friends before. The bilingual paired reading makes it so intuitive to express our cultural heritage in academic English.',
    usedVocab: ['geomancy', 'monumental', 'epitome'],
    createdAt: '2 giờ trước',
    likes: 24,
    userLiked: true
  },
  {
    id: 'ref-2',
    lessonId: 'saigon-banh-mi',
    lessonTitle: 'Saigon Banh Mi',
    authorName: 'Hoàng Long (TP.HCM)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    authorLevel: 'B1',
    content: 'The word "juxtaposition" perfectly captured how crispy baguette and savory pâté work together! I love that I can write here freely without being red-penned or judged for small grammar slip-ups. It gives me confidence to write daily.',
    usedVocab: ['juxtaposition', 'succulent', 'transformation'],
    createdAt: '5 giờ trước',
    likes: 18
  },
  {
    id: 'ref-3',
    lessonId: 'ha-long-bay',
    lessonTitle: 'Ha Long Bay',
    authorName: 'Tuấn Anh (Quảng Ninh)',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    authorLevel: 'C1',
    content: 'Learning the mythological background of Ha Long Bay using words like "mesmerizing" and "towering" karsts is so engaging. The 3D flashcards with original context sentences helped the words stick in my mind immediately.',
    usedVocab: ['mesmerizing'],
    createdAt: 'Hôm qua',
    likes: 35
  }
];
