import type { QuizQuestionItem } from '@/features/reader/services/readerApiService';

export const CUISINE_QUESTIONS: Record<string, QuizQuestionItem[]> = {
  // ── 1. PHỞ HÀ NỘI ──────────────────────────────────────────────────────────
  'pho-hanoi-history': [
    {
      orderIndex: 0,
      question: 'When did pho first appear in Northern Vietnam?',
      options: [
        { key: 'A', text: 'In the early 19th century' },
        { key: 'B', text: 'In the early 20th century' },
        { key: 'C', text: 'In the late 20th century' },
      ],
      correctKey: 'B',
      explanation: 'Phở xuất hiện lần đầu ở miền Bắc Việt Nam vào đầu thế kỷ XX và dần trở nên phổ biến tại Hà Nội.',
    },
    {
      orderIndex: 1,
      question: 'What significant recognition did Hanoi pho receive in 2024?',
      options: [
        { key: 'A', text: 'UNESCO World Heritage Site' },
        { key: 'B', text: 'National Intangible Cultural Heritage of Vietnam' },
        { key: 'C', text: 'Michelin 3-Star Award' },
      ],
      correctKey: 'B',
      explanation: 'Năm 2024, phở Hà Nội chính thức được công nhận là Di sản văn hóa phi vật thể quốc gia của Việt Nam.',
    },
    {
      orderIndex: 2,
      question: 'Which famous Vietnamese writers described pho in their literature?',
      options: [
        { key: 'A', text: 'Nam Cao, Vũ Trọng Phụng, and Xuân Diệu' },
        { key: 'B', text: 'Thạch Lam, Nguyễn Tuân, and Vũ Bằng' },
        { key: 'C', text: 'Nguyễn Du, Hồ Xuân Hương, and Đoàn Thị Điểm' },
      ],
      correctKey: 'B',
      explanation: 'Các nhà văn Thạch Lam, Nguyễn Tuân và Vũ Bằng đã viết về phở và sự gắn bó của món ăn với đời sống thường ngày.',
    },
  ],

  'pho-hanoi-flavour': [
    {
      orderIndex: 0,
      question: 'Why must chefs slowly simmer the beef bones for around twelve hours?',
      options: [
        { key: 'A', text: 'To extract natural flavor and convert collagen into gelatin for a rich broth' },
        { key: 'B', text: 'To make the beef cook faster' },
        { key: 'C', text: 'To cool the broth quickly' },
      ],
      correctKey: 'A',
      explanation: 'Ninh chậm 12 tiếng giúp tiết ra hương vị tự nhiên và phân giải collagen thành gelatin, mang lại nước dùng sánh mịn mà không cần phụ gia.',
    },
    {
      orderIndex: 1,
      question: 'Why are whole onions and fresh ginger charred over an open flame before entering the stockpot?',
      options: [
        { key: 'A', text: 'To turn them into fine powder' },
        { key: 'B', text: 'To create a pleasant smoky aroma and remove raw beef odours' },
        { key: 'C', text: 'To make the broth taste sweet like sugar' },
      ],
      correctKey: 'B',
      explanation: 'Nướng cháy xém hành và gừng tạo ra mùi khói dễ chịu và khử sạch mùi gây của thịt bò sống.',
    },
    {
      orderIndex: 2,
      question: 'What happens if the broth is allowed to boil too violently?',
      options: [
        { key: 'A', text: 'The fat mixes completely into the water and makes the broth cloudy' },
        { key: 'B', text: 'The noodles will break into pieces' },
        { key: 'C', text: 'The spices lose all their color' },
      ],
      correctKey: 'A',
      explanation: 'Nếu nước sôi quá mạnh, mỡ sẽ hòa lẫn vào nước làm nước dùng bị đục thay vì trong màu hổ phách.',
    },
  ],

  'pho-hanoi-serving': [
    {
      orderIndex: 0,
      question: 'In which year was the word "pho" officially added to the Oxford English Dictionary?',
      options: [
        { key: 'A', text: 'In 1995' },
        { key: 'B', text: 'In 2007' },
        { key: 'C', text: 'In 2018' },
      ],
      correctKey: 'B',
      explanation: 'Năm 2007, từ "pho" chính thức được bổ sung vào Từ điển tiếng Anh Oxford, ghi nhận vị thế quốc tế của món ăn.',
    },
    {
      orderIndex: 1,
      question: 'How is pho often adjusted when served in the United States?',
      options: [
        { key: 'A', text: 'It often has more meat and a richer broth to suit local tastes' },
        { key: 'B', text: 'It replaces beef with pork' },
        { key: 'C', text: 'It is served cold without soup' },
      ],
      correctKey: 'A',
      explanation: 'Tại Hoa Kỳ, phở thường được điều chỉnh có nhiều thịt hơn và nước dùng đậm đà hơn để phù hợp với sở thích thực khách bản địa.',
    },
    {
      orderIndex: 2,
      question: 'What does a bowl of pho represent beyond just an everyday meal?',
      options: [
        { key: 'A', text: 'An imported foreign luxury' },
        { key: 'B', text: 'A quick meal with no historical roots' },
        { key: 'C', text: 'Vietnamese culinary history, creativity, and cultural identity' },
      ],
      correctKey: 'C',
      explanation: 'Phở đại diện cho lịch sử, óc sáng tạo và bản sắc văn hóa Việt Nam kết nối bạn bè quốc tế.',
    },
  ],

  // ── 2. BÚN CHẢ HÀ NỘI ──────────────────────────────────────────────────────
  'bun-cha-grilling-secrets': [
    {
      orderIndex: 0,
      question: 'How is bun cha traditionally served compared to noodle soups?',
      options: [
        { key: 'A', text: 'All ingredients are mixed in one giant bowl' },
        { key: 'B', text: 'The noodles, meat, and vegetables are placed separately and dipped into warm sauce' },
        { key: 'C', text: 'The noodles are stir-fried before eating' },
      ],
      correctKey: 'B',
      explanation: 'Khác với bún nước, bún chả được dọn riêng từng phần: bún, thịt nướng, rau sống và chấm vào bát nước chấm ấm.',
    },
    {
      orderIndex: 1,
      question: 'Which historic event in 2016 brought bun cha into the global spotlight?',
      options: [
        { key: 'A', text: 'Former US President Barack Obama enjoyed bun cha with chef Anthony Bourdain in Hanoi' },
        { key: 'B', text: 'A culinary world cup held in Paris' },
        { key: 'C', text: 'It was declared a UNESCO World Wonder' },
      ],
      correctKey: 'A',
      explanation: 'Năm 2016, cựu Tổng thống Mỹ Barack Obama cùng đầu bếp Anthony Bourdain ăn bún chả tại Hà Nội, đưa món ăn lên sóng truyền hình toàn cầu.',
    },
    {
      orderIndex: 2,
      question: 'In which literary work did Thạch Lam write about the special taste of Hanoi bun cha?',
      options: [
        { key: 'A', text: 'Số Đỏ' },
        { key: 'B', text: 'Vợ Chồng A Phủ' },
        { key: 'C', text: 'Hà Nội băm sáu phố phường' },
      ],
      correctKey: 'C',
      explanation: 'Trong tác phẩm "Hà Nội băm sáu phố phường", nhà văn Thạch Lam đã ca ngợi hương vị khó quên của bún chả Hà Nội.',
    },
  ],

  'bun-cha-lunchtime-culture': [
    {
      orderIndex: 0,
      question: 'What are the two traditional forms of grilled pork in a serving of bun cha?',
      options: [
        { key: 'A', text: 'Pork ribs and pork sausages' },
        { key: 'B', text: 'Thin slices of pork (chả miếng) and minced pork patties (chả viên)' },
        { key: 'C', text: 'Boiled pork belly and roasted pork skin' },
      ],
      correctKey: 'B',
      explanation: 'Một suất bún chả truyền thống luôn có hai loại thịt nướng: chả miếng (thịt thái mỏng) và chả viên (thịt băm nặn tròn).',
    },
    {
      orderIndex: 1,
      question: 'What kind of fuel is traditionally used to grill bun cha to achieve its smoky aroma?',
      options: [
        { key: 'A', text: 'Natural charcoal' },
        { key: 'B', text: 'Gas burners' },
        { key: 'C', text: 'Electric heating elements' },
      ],
      correctKey: 'A',
      explanation: 'Thịt được nướng trên than hoa (charcoal) giúp thịt hơi xém vàng bên ngoài mà vẫn mềm ẩm và thơm mùi khói đặc trưng.',
    },
    {
      orderIndex: 2,
      question: 'What ingredients create the balanced sweet, sour, and savory flavor of bun cha dipping sauce?',
      options: [
        { key: 'A', text: 'Soy sauce and ginger' },
        { key: 'B', text: 'Mayonnaise and chili oil' },
        { key: 'C', text: 'Fish sauce, sugar, water, and vinegar' },
      ],
      correctKey: 'C',
      explanation: 'Nước chấm bún chả được pha từ nước mắm, đường, nước lọc và giấm, thường thêm đu đủ xanh và cà rốt muối chua.',
    },
  ],

  'bun-cha-elegant-taste': [
    {
      orderIndex: 0,
      question: 'What international culinary authority described bun cha as an iconic dish of Hanoi?',
      options: [
        { key: 'A', text: 'The Guinness Book of World Records' },
        { key: 'B', text: 'Michelin Guide' },
        { key: 'C', text: 'The World Bank' },
      ],
      correctKey: 'B',
      explanation: 'Cẩm nang ẩm thực Michelin Guide đã mô tả bún chả là một món ăn mang tính biểu tượng của thủ đô Hà Nội.',
    },
    {
      orderIndex: 1,
      question: 'Which overseas chef was inspired by bun cha to include it on his restaurant menu in Singapore?',
      options: [
        { key: 'A', text: 'Chef Chris Fong' },
        { key: 'B', text: 'Chef Gordon Ramsay' },
        { key: 'C', text: 'Chef Jamie Oliver' },
      ],
      correctKey: 'A',
      explanation: 'Đầu bếp người Singapore Chris Fong (nhà hàng Oryz) đã đưa bún chả vào thực đơn món Việt của mình.',
    },
    {
      orderIndex: 2,
      question: 'Why do traditional cooks prefer mincing pork by hand rather than using a machine?',
      options: [
        { key: 'A', text: 'Because machines are not available in Vietnam' },
        { key: 'B', text: 'Hand-mincing helps retain more of the meat’s natural texture and moisture' },
        { key: 'C', text: 'To make the meat completely powdered' },
      ],
      correctKey: 'B',
      explanation: 'Băm thịt bằng tay giúp giữ được kết cấu sợi tự nhiên và độ ẩm mọng của thịt tốt hơn so với xay bằng máy.',
    },
  ],

  // ── 3. CHẢ CÁ LÃ VỌNG ──────────────────────────────────────────────────────
  'cha-ca-legend-history': [
    {
      orderIndex: 0,
      question: 'Which family created Cha Ca La Vong in 1871?',
      options: [
        { key: 'A', text: 'The Doan family at 14 Hang Son Street' },
        { key: 'B', text: 'The Nguyen family in Hue Citadel' },
        { key: 'C', text: 'The Tran family in Nam Dinh' },
      ],
      correctKey: 'A',
      explanation: 'Gia đình họ Đoàn tại số 14 phố Hàng Sơn (nay là phố Chả Cá) đã sáng tạo ra món ăn này vào năm 1871.',
    },
    {
      orderIndex: 1,
      question: 'What was the origin of the restaurant name "La Vong"?',
      options: [
        { key: 'A', text: 'It was the name of a famous lake in Hanoi' },
        { key: 'B', text: 'A statue of the legendary angler La Vong (Khương Tử Nha) placed in front of the shop' },
        { key: 'C', text: 'The name of a French military officer' },
      ],
      correctKey: 'B',
      explanation: 'Gia đình đặt bức tượng ông lão câu cá Lã Vọng (Khương Tử Nha) trước cửa hàng, dần dần thực khách quen gọi thành tên món ăn.',
    },
    {
      orderIndex: 2,
      question: 'What cultural honor did Cha Ca La Vong receive in December 2025?',
      options: [
        { key: 'A', text: 'Included in Vietnam’s National List of Intangible Cultural Heritage' },
        { key: 'B', text: 'Recognized as an official national flag symbol' },
        { key: 'C', text: 'Recorded as the oldest restaurant in Asia' },
      ],
      correctKey: 'A',
      explanation: 'Tháng 12 năm 2025, tri thức và thực hành chế biến, thưởng thức chả cá Lã Vọng được ghi danh vào Di sản văn hóa phi vật thể quốc gia.',
    },
  ],

  'cha-ca-table-experience': [
    {
      orderIndex: 0,
      question: 'What freshwater fish is traditionally preferred for Cha Ca La Vong because of its firm flesh and few bones?',
      options: [
        { key: 'A', text: 'Cá hồi (Salmon)' },
        { key: 'B', text: 'Cá lăng (Hemibagrus)' },
        { key: 'C', text: 'Cá mòi (Sardine)' },
      ],
      correctKey: 'B',
      explanation: 'Cá lăng là loại cá nước ngọt được ưu tiên hàng đầu nhờ thịt chắc ngọt và rất ít xương dăm.',
    },
    {
      orderIndex: 1,
      question: 'What natural spice gives the marinated fish its characteristic golden-yellow color?',
      options: [
        { key: 'A', text: 'Turmeric (nghệ)' },
        { key: 'B', text: 'Paprika' },
        { key: 'C', text: 'Curry leaves' },
      ],
      correctKey: 'A',
      explanation: 'Nghệ tươi giã nhỏ tạo cho cá màu vàng ruộm hấp dẫn đặc trưng.',
    },
    {
      orderIndex: 2,
      question: 'How is Cha Ca La Vong uniquely cooked during the dining experience?',
      options: [
        { key: 'A', text: 'It is baked in an underground pit' },
        { key: 'B', text: 'It is served raw as sashimi' },
        { key: 'C', text: 'It is finished directly at the table in a sizzling pan with spring onions and fresh dill' },
      ],
      correctKey: 'C',
      explanation: 'Cá sau khi nướng sơ sẽ được cho vào chảo mỡ nóng ngay tại bàn ăn cùng hành hoa và thì là, tạo trải nghiệm tương tác thú vị.',
    },
  ],

  'cha-ca-dill-harmony': [
    {
      orderIndex: 0,
      question: 'Which herb is essential when sizzling Cha Ca La Vong in the pan?',
      options: [
        { key: 'A', text: 'Rosemary' },
        { key: 'B', text: 'Fresh dill (thì là)' },
        { key: 'C', text: 'Oregano' },
      ],
      correctKey: 'B',
      explanation: 'Thì là tươi cắt khúc cùng hành lá là hai loại rau gia vị không thể thiếu khi chao cá trên chảo.',
    },
    {
      orderIndex: 1,
      question: 'What traditional fermented condiment is commonly whipped with lime, sugar, and chili to dip Cha Ca?',
      options: [
        { key: 'A', text: 'Fermented shrimp paste (mắm tôm)' },
        { key: 'B', text: 'Tomato ketchup' },
        { key: 'C', text: 'Mustard paste' },
      ],
      correctKey: 'A',
      explanation: 'Mắm tôm đánh sủi bọt cùng nước cốt chanh, đường và ớt tươi là nước chấm chuẩn vị nhất của chả cá.',
    },
    {
      orderIndex: 2,
      question: 'How has Cha Ca La Vong uniquely influenced the street map of Hanoi’s Old Quarter?',
      options: [
        { key: 'A', text: 'A bridge was built in its honor' },
        { key: 'B', text: 'Hang Son Street was officially renamed Cha Ca Street' },
        { key: 'C', text: 'A city gate was named after it' },
      ],
      correctKey: 'B',
      explanation: 'Phố Hàng Sơn ban đầu đã được đổi tên chính thức thành phố Chả Cá, trường hợp hiếm hoi món ăn làm nên tên một con phố.',
    },
  ],

  // ── 4. CÁ KHO LÀNG VŨ ĐẠI ──────────────────────────────────────────────────
  'ca-kho-nam-cao-village': [
    {
      orderIndex: 0,
      question: 'In which famous literary short story by Nam Cao is Vu Dai Village the primary setting?',
      options: [
        { key: 'A', text: 'Tắt Đèn' },
        { key: 'B', text: 'Chí Phèo' },
        { key: 'C', text: 'Lão Hạc' },
      ],
      correctKey: 'B',
      explanation: 'Làng Vũ Đại (làng Đại Hoàng) là bối cảnh kinh điển trong kiệt tác truyện ngắn "Chí Phèo" của nhà văn Nam Cao.',
    },
    {
      orderIndex: 1,
      question: 'Why did local villagers originally develop this slow-braised fish tradition during Tet?',
      options: [
        { key: 'A', text: 'To prepare a durable, meaningful offering for ancestors when other food was scarce' },
        { key: 'B', text: 'To export to foreign merchants' },
        { key: 'C', text: 'To avoid cooking rice' },
      ],
      correctKey: 'A',
      explanation: 'Trước đây khi kinh tế khó khăn, người dân kho cá thật kỹ để dâng cúng tổ tiên ngày Tết và bảo quản ăn được dài ngày.',
    },
    {
      orderIndex: 2,
      question: 'What is another traditional name for Vu Dai Village in Ha Nam?',
      options: [
        { key: 'A', text: 'Làng gốm Bát Tràng' },
        { key: 'B', text: 'Làng tranh Đông Hồ' },
        { key: 'C', text: 'Làng Đại Hoàng' },
      ],
      correctKey: 'C',
      explanation: 'Làng Vũ Đại còn có tên gọi hành chính và truyền thống là làng Đại Hoàng, thuộc xã Hòa Hậu, huyện Lý Nhân, Hà Nam.',
    },
  ],

  'ca-kho-16-hour-secret': [
    {
      orderIndex: 0,
      question: 'What type of cookware is strictly required for authentic Vu Dai braised fish?',
      options: [
        { key: 'A', text: 'Traditional earthenware pot (niêu đất)' },
        { key: 'B', text: 'Stainless steel pressure cooker' },
        { key: 'C', text: 'Cast iron skillet' },
      ],
      correctKey: 'A',
      explanation: 'Niêu đất nung giữ nhiệt tốt và tỏa nhiệt đều, yếu tố then chốt cho quá trình kho chậm suốt nhiều giờ.',
    },
    {
      orderIndex: 1,
      question: 'Why is longan firewood (củi nhãn) traditionally preferred for cooking the fish?',
      options: [
        { key: 'A', text: 'It burns steadily, retains embers, and imparts a distinctive smoky aroma' },
        { key: 'B', text: 'It is the cheapest wood available' },
        { key: 'C', text: 'It makes the pot turn red' },
      ],
      correctKey: 'A',
      explanation: 'Củi nhãn đượm than, cháy đều, không bị mùi hăng và tạo cho cá mùi thơm khói đặc trưng.',
    },
    {
      orderIndex: 2,
      question: 'What is the typical simmering duration for an authentic pot of Vu Dai fish?',
      options: [
        { key: 'A', text: '30 to 45 minutes' },
        { key: 'B', text: '2 to 3 hours' },
        { key: 'C', text: '10 to 16 continuous hours' },
      ],
      correctKey: 'C',
      explanation: 'Cá kho Vũ Đại đòi hỏi kho liên tục từ 10 đến 16 tiếng để thịt cá săn chắc còn xương thì nhừ tan.',
    },
  ],

  'ca-kho-natural-preservation': [
    {
      orderIndex: 0,
      question: 'Why is Vu Dai braised fish especially popular as a Tet gift?',
      options: [
        { key: 'A', text: 'It communicates thoughtfulness, respect, and deep roots in Vietnamese traditions' },
        { key: 'B', text: 'It is imported from abroad' },
        { key: 'C', text: 'It can only be ordered in summer' },
      ],
      correctKey: 'A',
      explanation: 'Niêu cá kho là món quà Tết thể hiện sự chu đáo, kính trọng và gắn kết với hương vị cội nguồn quê hương.',
    },
    {
      orderIndex: 1,
      question: 'What natural ingredient layered at the bottom of the earthen pot prevents scorching while enhancing aroma?',
      options: [
        { key: 'A', text: 'Sliced fresh galangal (riềng) and ginger' },
        { key: 'B', text: 'Banana skins' },
        { key: 'C', text: 'Rice straw' },
      ],
      correctKey: 'A',
      explanation: 'Lớp riềng và gừng lót dưới đáy niêu giúp cá không bị cháy xém và thấm đượm vị cay ấm.',
    },
    {
      orderIndex: 2,
      question: 'What is the texture of the fish once the 16-hour braising process is complete?',
      options: [
        { key: 'A', text: 'The fish is watery and broken into pieces' },
        { key: 'B', text: 'The flesh remains firm while the bones become completely softened' },
        { key: 'C', text: 'The fish dries out into jerky' },
      ],
      correctKey: 'B',
      explanation: 'Thành phẩm chuẩn là khúc cá chắc nịch, màu nâu sẫm cánh gián và xương mềm tan khi ăn.',
    },
  ],

  // ── 5. GỎI CÁ NHỆCH ────────────────────────────────────────────────────────
  'goi-ca-nhech-1': [
    {
      orderIndex: 0,
      question: 'Where is the distinctive natural habitat of cá nhệch along Kim Son, Ninh Binh?',
      options: [
        { key: 'A', text: 'High mountain lakes' },
        { key: 'B', text: 'Brackish water, coastal lagoons, and river mouths' },
        { key: 'C', text: 'Deep ocean trenches' },
      ],
      correctKey: 'B',
      explanation: 'Cá nhệch sinh sống ở các đầm phá ven biển, cửa sông nước lợ và đáy bùn cát vùng Kim Sơn.',
    },
    {
      orderIndex: 1,
      question: 'What natural physical characteristic makes cá nhệch challenging to catch?',
      options: [
        { key: 'A', text: 'Its slippery skin covered with thick mucus and rapid movement' },
        { key: 'B', text: 'It flies above the water surface' },
        { key: 'C', text: 'It has sharp poison spines' },
      ],
      correctKey: 'A',
      explanation: 'Lớp nhớt trơn trượt bao phủ cơ thể cùng khả năng luồn lách nhanh khiến cá nhệch rất khó đánh bắt.',
    },
    {
      orderIndex: 2,
      question: 'What are the two local varieties of cá nhệch distinguished by Kim Son residents?',
      options: [
        { key: 'A', text: 'Nhệch củ and nhệch khét' },
        { key: 'B', text: 'Nhệch hoa and nhệch đỏ' },
        { key: 'C', text: 'Nhệch hồ and nhệch suối' },
      ],
      correctKey: 'A',
      explanation: 'Người dân địa phương phân biệt nhệch củ (thân to, ở nước mặn nhẹ) và nhệch khét (thân dài, ở nước lợ).',
    },
  ],

  'goi-ca-nhech-2': [
    {
      orderIndex: 0,
      question: 'What is the defining secret ingredient used to make "chẻo" sauce for gỏi cá nhệch?',
      options: [
        { key: 'A', text: 'Crushed peanut butter' },
        { key: 'B', text: 'Finely crushed fish bones cooked with fermented rice (mẻ)' },
        { key: 'C', text: 'Melted cheese' },
      ],
      correctKey: 'B',
      explanation: 'Nước chẻo độc đáo được làm từ chính xương cá giã thật nhuyễn nấu cùng mẻ, gia vị và mắm tôm.',
    },
    {
      orderIndex: 1,
      question: 'Why must chẻo sauce achieve a thick, smooth consistency?',
      options: [
        { key: 'A', text: 'So it clings generously to the fish and herbs instead of running off' },
        { key: 'B', text: 'To make it turn solid like ice' },
        { key: 'C', text: 'To dilute the fish taste' },
      ],
      correctKey: 'A',
      explanation: 'Chẻo cần có độ sánh đặc chuẩn để khi rưới lên cuốn gỏi, nước sốt bám chặt vào miếng cá và rau.',
    },
    {
      orderIndex: 2,
      question: 'Which leaves are traditionally rolled with the fish to balance the rich chẻo sauce?',
      options: [
        { key: 'A', text: 'Lettuce and spinach only' },
        { key: 'B', text: 'Cabbage and mint' },
        { key: 'C', text: 'Fig leaves, guava leaves, lá mơ, and đinh lăng' },
      ],
      correctKey: 'C',
      explanation: 'Vị chát và đắng nhẹ của lá sung, lá ổi, lá mơ và đinh lăng giúp cân bằng vị béo của chẻo và vị ngọt của cá.',
    },
  ],

  'goi-ca-nhech-3': [
    {
      orderIndex: 0,
      question: 'Which historical figure led the land reclamation of Kim Son that fostered this coastal culinary heritage?',
      options: [
        { key: 'A', text: 'Trần Hưng Đạo' },
        { key: 'B', text: 'Nguyễn Công Trứ' },
        { key: 'C', text: 'Lê Lợi' },
      ],
      correctKey: 'B',
      explanation: 'Nhà dinh điền sứ Nguyễn Công Trứ đã cùng nhân dân quai đê lấn biển lập nên vùng đất Kim Sơn trù phú.',
    },
    {
      orderIndex: 1,
      question: 'What traditional regional beverage is famously paired with gỏi cá nhệch Kim Son?',
      options: [
        { key: 'A', text: 'Kim Son sticky rice wine (rượu nếp Kim Sơn)' },
        { key: 'B', text: 'Green tea latte' },
        { key: 'C', text: 'Fermented grape cider' },
      ],
      correctKey: 'A',
      explanation: 'Gỏi cá nhệch thường được nhâm nhi cùng chén rượu nếp Kim Sơn cay nồng ấm bụng.',
    },
    {
      orderIndex: 2,
      question: 'How do diners assemble and eat a serving of gỏi cá nhệch?',
      options: [
        { key: 'A', text: 'Boil everything in hot soup' },
        { key: 'B', text: 'Wrap fish and herbs inside a cone-shaped leaf and spoon warm chẻo on top' },
        { key: 'C', text: 'Blend all ingredients into a smoothie' },
      ],
      correctKey: 'B',
      explanation: 'Thực khách cuộn lá thành hình phễu, cho cá và rau thơm vào rồi dùng thìa rưới nước chẻo lên trên.',
    },
  ],

  // ── 6. BÊ CHAO MỘC CHÂU ──────────────────────────────────────────────────
  'be-chao-1': [
    {
      orderIndex: 0,
      question: 'How did the dish bê chao originate from local agriculture in Moc Chau?',
      options: [
        { key: 'A', text: 'Imported by foreign tourists' },
        { key: 'B', text: 'From dairy farms utilizing young male calves not kept for breeding or milk' },
        { key: 'C', text: 'Created during a royal hunting feast' },
      ],
      correctKey: 'B',
      explanation: 'Nghề nuôi bò sữa Mộc Châu giữ lại bê cái lấy sữa, những chú bê đực non được người dân tận dụng chế biến thành món bê chao.',
    },
    {
      orderIndex: 1,
      question: 'What gives bê chao its tender texture and natural sweetness compared to mature beef?',
      options: [
        { key: 'A', text: 'It is prepared from very young, milk-fed veal' },
        { key: 'B', text: 'It is soaked in artificial sweeteners' },
        { key: 'C', text: 'It is boiled for 24 hours' },
      ],
      correctKey: 'A',
      explanation: 'Thịt bê sữa còn rất non có thớ thịt mềm ngọt tự nhiên, không bị dai như thịt bò trưởng thành.',
    },
    {
      orderIndex: 2,
      question: 'In which province is the cool green plateau of Moc Chau located?',
      options: [
        { key: 'A', text: 'Lào Cai' },
        { key: 'B', text: 'Hà Giang' },
        { key: 'C', text: 'Sơn La' },
      ],
      correctKey: 'C',
      explanation: 'Cao nguyên Mộc Châu nổi tiếng với những đồi chè và đồng cỏ xanh thuộc tỉnh Sơn La.',
    },
  ],

  'be-chao-2': [
    {
      orderIndex: 0,
      question: 'What is the key culinary technique in "chao" (flash-frying) young veal?',
      options: [
        { key: 'A', text: 'Slow simmering over low heat for hours' },
        { key: 'B', text: 'Quick frying in hot oil so the exterior turns crisp while the interior stays tender and juicy' },
        { key: 'C', text: 'Baking without any cooking fat' },
      ],
      correctKey: 'B',
      explanation: 'Kỹ thuật chao dầu nóng lửa lớn làm bề mặt miếng thịt vàng giòn tức thì nhưng giữ trọn nước ngọt bên trong.',
    },
    {
      orderIndex: 1,
      question: 'What aromatic ingredients are tossed with freshly fried bê chao for fragrance?',
      options: [
        { key: 'A', text: 'Sliced lime leaves, sesame, ginger, and fried lemongrass' },
        { key: 'B', text: 'Cinnamon and star anise powder' },
        { key: 'C', text: 'Tomato sauce and garlic mayonnaise' },
      ],
      correctKey: 'A',
      explanation: 'Lá chanh thái chỉ, vừng rang, gừng và sả chiên vàng được rắc lên giúp đĩa thịt bê dậy mùi thơm quyến rũ.',
    },
    {
      orderIndex: 2,
      question: 'Why do restaurants in Moc Chau prepare bê chao only after an order is placed?',
      options: [
        { key: 'A', text: 'Because they lack refrigerators' },
        { key: 'B', text: 'The dish tastes best when freshly fried and served piping hot' },
        { key: 'C', text: 'To save cooking oil' },
      ],
      correctKey: 'B',
      explanation: 'Bê chao ngon nhất khi vừa vớt khỏi chảo, lớp vỏ còn nóng hổi và giòn tan.',
    },
  ],

  'be-chao-3': [
    {
      orderIndex: 0,
      question: 'What dipping sauce traditionally accompanies hot bê chao on the highland table?',
      options: [
        { key: 'A', text: 'Sweet chili sauce' },
        { key: 'B', text: 'Thick soy-based sauce (tương bần) mixed with minced ginger and lemongrass' },
        { key: 'C', text: 'Fish sauce with vinegar' },
      ],
      correctKey: 'B',
      explanation: 'Nước tương gừng sánh đặc là thức chấm đồng điệu nhất tôn lên vị béo ngọt của thịt bê.',
    },
    {
      orderIndex: 1,
      question: 'Why is bê chao considered an ideal communal dish for sharing in Moc Chau?',
      options: [
        { key: 'A', text: 'It is served on a large platter, perfect for sharing around a warm table in cool highland weather' },
        { key: 'B', text: 'It must be eaten in under two minutes' },
        { key: 'C', text: 'It cannot be served to more than one person' },
      ],
      correctKey: 'A',
      explanation: 'Đĩa bê chao nóng sốt giữa tiết trời se lạnh của cao nguyên gắn kết gia đình và bạn bè quây quần trò chuyện.',
    },
    {
      orderIndex: 2,
      question: 'What role does bê chao play in the broader development of Moc Chau?',
      options: [
        { key: 'A', text: 'It replaces all agricultural activities' },
        { key: 'B', text: 'It is an export-only commercial commodity' },
        { key: 'C', text: 'It connects farming resources, culinary craft, and destination tourism' },
      ],
      correctKey: 'C',
      explanation: 'Món ăn là cầu nối hài hòa giữa chăn nuôi bò sữa, kỹ nghệ nấu nướng và du lịch trải nghiệm cao nguyên.',
    },
  ],

  // ── 7. XÔI NẾP NƯƠNG MAI CHÂU ──────────────────────────────────────────────
  'xoi-nep-nuong-1': [
    {
      orderIndex: 0,
      question: 'Where do the Thai ethnic community cultivate nếp nương sticky rice in Mai Châu?',
      options: [
        { key: 'A', text: 'Deep underground caves' },
        { key: 'B', text: 'On terraced fields spread across the highland valley' },
        { key: 'C', text: 'Floating river rafts' },
      ],
      correctKey: 'B',
      explanation: 'Lúa nếp nương được đồng bào Thái canh tác trên các thửa ruộng bậc thang uốn lượn quanh thung lũng Mai Châu.',
    },
    {
      orderIndex: 1,
      question: 'What are the distinctive physical characteristics of cooked nếp nương rice grains?',
      options: [
        { key: 'A', text: 'Round, naturally fragrant, glossy, and remaining soft even after cooling' },
        { key: 'B', text: 'Long, dry, and easily broken' },
        { key: 'C', text: 'Yellow, hard, and powdery' },
      ],
      correctKey: 'A',
      explanation: 'Hạt nếp nương tròn mẩy, thơm ngát, dẻo bóng và đặc biệt vẫn giữ được độ mềm khi để nguội.',
    },
    {
      orderIndex: 2,
      question: 'What traditional food often accompanies xôi nếp nương in everyday highland meals?',
      options: [
        { key: 'A', text: 'Sesame salt (muối vừng), grilled stream fish, or hill chicken' },
        { key: 'B', text: 'Tomato soup and spaghetti' },
        { key: 'C', text: 'Bread and butter' },
      ],
      correctKey: 'A',
      explanation: 'Xôi nếp nương ăn kèm muối vừng, gà đồi nướng hoặc cá suối là mâm cơm đặc trưng của núi rừng Tây Bắc.',
    },
  ],

  'xoi-nep-nuong-2': [
    {
      orderIndex: 0,
      question: 'What traditional wooden utensil is used by Thai women to steam xôi nếp nương?',
      options: [
        { key: 'A', text: 'Chõ gỗ (wooden steamer)' },
        { key: 'B', text: 'Metal frying pan' },
        { key: 'C', text: 'Clay baking brick' },
      ],
      correctKey: 'A',
      explanation: 'Chõ gỗ truyền thống của người Thái giúp hạt gạo chín đều bằng hơi nước mà không bị đọng nước gây nhão.',
    },
    {
      orderIndex: 1,
      question: 'Why is the "two-stage steaming" (đồ hai lần) method essential for xôi nếp nương?',
      options: [
        { key: 'A', text: 'To change the color of the rice' },
        { key: 'B', text: 'The rice is partly steamed, fluffed in a basket, then steamed again to achieve perfect softness' },
        { key: 'C', text: 'To dry out the grains completely' },
      ],
      correctKey: 'B',
      explanation: 'Kỹ thuật đồ 2 lần kết hợp xới tơi giữa chừng giúp xôi chín dẻo thấu tận lõi hạt gạo.',
    },
    {
      orderIndex: 2,
      question: 'How long is the sticky rice typically soaked in water before steaming?',
      options: [
        { key: 'A', text: '5 to 10 minutes' },
        { key: 'B', text: 'Around 4 to 5 hours' },
        { key: 'C', text: '24 hours in hot oil' },
      ],
      correctKey: 'B',
      explanation: 'Ngâm gạo từ 4 đến 5 tiếng giúp hạt gạo no nước trước khi tiếp xúc với hơi nước nóng.',
    },
  ],

  'xoi-nep-nuong-3': [
    {
      orderIndex: 0,
      question: 'In the Thai new rice ceremony (lễ cúng cơm mới), what meat is traditionally excluded from the offering tray?',
      options: [
        { key: 'A', text: 'Fresh stream fish' },
        { key: 'B', text: 'Meat from domestic animals and poultry' },
        { key: 'C', text: 'Crab and shrimp' },
      ],
      correctKey: 'B',
      explanation: 'Trong lễ mừng cơm mới của người Thái Mai Châu, mâm lễ tuyệt đối không cúng thịt gia súc, gia cầm.',
    },
    {
      orderIndex: 1,
      question: 'What is offered alongside sticky rice wrapped in dong leaves during the ceremony?',
      options: [
        { key: 'A', text: 'Fresh stream fish (cá suối)' },
        { key: 'B', text: 'Pork sausages' },
        { key: 'C', text: 'Beef steak' },
      ],
      correctKey: 'A',
      explanation: 'Cá suối nướng hoặc hấp gói lá dong là lễ vật đồng hành thiêng liêng cùng xôi nếp mới.',
    },
    {
      orderIndex: 2,
      question: 'What moral value does the folktale behind the new rice offering highlight?',
      options: [
        { key: 'A', text: 'Competition among hunters' },
        { key: 'B', text: 'Compassion towards living creatures and filial piety towards ancestors' },
        { key: 'C', text: 'Trading wealth for power' },
      ],
      correctKey: 'B',
      explanation: 'Câu chuyện tha mạng gà mẹ đàn con thể hiện lòng nhân ái với muôn loài và sự thành kính tri ân công đức tổ tiên.',
    },
  ],

  // ── 8. BÁNH CHƯNG LÀNG ĐẦM ────────────────────────────────────────────────
  'banh-chung-lang-dam-1': [
    {
      orderIndex: 0,
      question: 'What artisan technique distinguishes Làng Đầm’s bánh chưng from other regions?',
      options: [
        { key: 'A', text: 'Cakes are shaped in industrial steel moulds' },
        { key: 'B', text: 'Artisans wrap and shape each cake entirely by hand without using moulds' },
        { key: 'C', text: 'Cakes are baked in clay ovens' },
      ],
      correctKey: 'B',
      explanation: 'Nghệ nhân làng Đầm gói bánh chưng hoàn toàn bằng tay vo tròn góc vuông vức mà không dùng khuôn.',
    },
    {
      orderIndex: 1,
      question: 'What unusual local practice do villagers believe makes the cakes cook evenly and taste sweeter?',
      options: [
        { key: 'A', text: 'Boiling the cakes in collected rainwater for 10 to 12 hours' },
        { key: 'B', text: 'Cooking the cakes with ocean saltwater' },
        { key: 'C', text: 'Adding artificial color dye' },
      ],
      correctKey: 'A',
      explanation: 'Dân làng Đầm có truyền thống luộc bánh bằng nước mưa tinh khiết giúp hạt nếp chín rền và bánh thơm ngọt.',
    },
    {
      orderIndex: 2,
      question: 'Where is Làng Đầm located?',
      options: [
        { key: 'A', text: 'In Ca Mau province' },
        { key: 'B', text: 'In Da Nang city' },
        { key: 'C', text: 'In Ha Nam / Ninh Binh, about 50 km south of Hanoi' },
      ],
      correctKey: 'C',
      explanation: 'Làng Đầm nằm cách Hà Nội khoảng 50 km về phía Nam thuộc vùng đồng bằng Bắc Bộ.',
    },
  ],

  'banh-chung-lang-dam-2': [
    {
      orderIndex: 0,
      question: 'When does Làng Đầm experience its busiest production period, requiring extra workers through the night?',
      options: [
        { key: 'A', text: 'During mid-autumn festival' },
        { key: 'B', text: 'The weeks leading up to Lunar New Year (Tết)' },
        { key: 'C', text: 'In the middle of summer' },
      ],
      correctKey: 'B',
      explanation: 'Dịp giáp Tết là cao điểm khi cả làng đỏ lửa suốt đêm ngày để phục vụ đơn đặt hàng của khách muôn phương.',
    },
    {
      orderIndex: 1,
      question: 'Beyond economic income, what does continuing this craft mean to Làng Đầm villagers?',
      options: [
        { key: 'A', text: 'Preserving ancestral heritage, festive cultural memory, and craftsmanship' },
        { key: 'B', text: 'A hobby with no cultural significance' },
        { key: 'C', text: 'A required government assignment' },
      ],
      correctKey: 'A',
      explanation: 'Nghề làm bánh chưng gìn giữ hồn Tết Việt, ký ức văn hóa và lòng biết ơn tổ tiên qua nhiều thế hệ.',
    },
    {
      orderIndex: 2,
      question: 'What three core ingredients form the foundation of traditional bánh chưng?',
      options: [
        { key: 'A', text: 'Sticky rice, mung beans, and seasoned pork wrapped in dong leaves' },
        { key: 'B', text: 'Wheat flour, beef, and cabbage' },
        { key: 'C', text: 'Cornmeal, shrimp, and seaweed' },
      ],
      correctKey: 'A',
      explanation: 'Gạo nếp, đậu xanh và thịt heo ướp tiêu gói trong lá dong xanh là bộ ba nguyên liệu cốt lõi của chiếc bánh chưng.',
    },
  ],

  // ── 9. KHÂU NHỤC LẠNG SƠN ──────────────────────────────────────────────────
  'khau-nhuc-lang-son-1': [
    {
      orderIndex: 0,
      question: 'Which ethnic communities adapted khâu nhục into a celebrated regional specialty of Lạng Sơn?',
      options: [
        { key: 'A', text: 'The Cham and Khmer communities' },
        { key: 'B', text: 'The Tày and Nùng communities' },
        { key: 'C', text: 'The Ede and Ba Na communities' },
      ],
      correctKey: 'B',
      explanation: 'Người Tày và người Nùng ở xứ Lạng đã tiếp nhận món ăn và sáng tạo nên bản sắc ẩm thực độc đáo riêng.',
    },
    {
      orderIndex: 1,
      question: 'What distinctive local salted vegetable is an essential ingredient in Lang Son khâu nhục?',
      options: [
        { key: 'A', text: 'Tàu soi' },
        { key: 'B', text: 'Kimchi' },
        { key: 'C', text: 'Pickled cucumber' },
      ],
      correctKey: 'A',
      explanation: 'Rau muối tàu soi là gia vị đặc trưng không thể thiếu tạo nên vị đậm đà và màu sắc của khâu nhục.',
    },
    {
      orderIndex: 2,
      question: 'What is the literal meaning of the name "khâu nhục"?',
      options: [
        { key: 'A', text: 'Crispy fried pork' },
        { key: 'B', text: 'Grilled meat on sticks' },
        { key: 'C', text: 'Meat cooked until exceptionally tender and soft' },
      ],
      correctKey: 'C',
      explanation: 'Tên gọi khâu nhục bắt nguồn từ tiếng Hoa, chỉ món thịt được hấp chín kỹ cho đến khi mềm nhừ.',
    },
  ],

  'khau-nhuc-lang-son-2': [
    {
      orderIndex: 0,
      question: 'On what occasions is khâu nhục traditionally indispensable in Lạng Sơn?',
      options: [
        { key: 'A', text: 'Only as a breakfast snack' },
        { key: 'B', text: 'Weddings, Tết celebrations, and important family banquets' },
        { key: 'C', text: 'Fasting rituals' },
      ],
      correctKey: 'B',
      explanation: 'Khâu nhục là món ăn trang trọng nhất trên mâm cỗ cưới xin, ngày Tết và các dịp sum họp gia đình.',
    },
    {
      orderIndex: 1,
      question: 'How is khâu nhục ceremonially presented when served at a feast?',
      options: [
        { key: 'A', text: 'The steaming bowl is inverted upside down onto a deep plate to display neat layers of tender pork' },
        { key: 'B', text: 'It is chopped finely into soup' },
        { key: 'C', text: 'It is skewered on bamboo sticks' },
      ],
      correctKey: 'A',
      explanation: 'Bát thịt được úp ngược lên đĩa sâu lòng, để lộ lớp bì phồng giòn vàng óng và những miếng thịt xếp đều tăm tắp.',
    },
    {
      orderIndex: 2,
      question: 'How long is the meat typically steamed to achieve its signature tender texture?',
      options: [
        { key: 'A', text: '10 to 15 minutes' },
        { key: 'B', text: '3 to 5 hours' },
        { key: 'C', text: '3 days' },
      ],
      correctKey: 'B',
      explanation: 'Thịt được hấp cách thủy từ 3 đến 5 tiếng để mỡ ngấm đều vào khoai môn và thịt tan mềm trong miệng.',
    },
  ],

  // ── 10. THẮNG CỐ BẮC HÀ ────────────────────────────────────────────────────
  'thang-co-1': [
    {
      orderIndex: 0,
      question: 'Where do local mountain communities regularly gather every Sunday to share steaming pots of thắng cố?',
      options: [
        { key: 'A', text: 'Ben Thanh Market in Ho Chi Minh City' },
        { key: 'B', text: 'Bắc Hà Market in Lào Cai' },
        { key: 'C', text: 'Dong Xuan Market in Hanoi' },
      ],
      correctKey: 'B',
      explanation: 'Chợ phiên Bắc Hà họp vào Chủ nhật hằng tuần là nơi đồng bào các bản làng tề tựu bên chảo thắng cố nghi ngút khói.',
    },
    {
      orderIndex: 1,
      question: 'In highland culture, how is thắng cố traditionally enjoyed?',
      options: [
        { key: 'A', text: 'Communally shared with friends and companions over corn wine' },
        { key: 'B', text: 'Eaten quickly in complete silence alone' },
        { key: 'C', text: 'Used as an offering thrown into rivers' },
      ],
      correctKey: 'A',
      explanation: 'Thắng cố là món ăn mang tính gắn kết bạn bè, mọi người cùng quây quần bên chảo lớn và nâng chén rượu ngô.',
    },
    {
      orderIndex: 2,
      question: 'What social role does the weekly highland market play for mountain villages?',
      options: [
        { key: 'A', text: 'A purely commercial bank branch' },
        { key: 'B', text: 'An industrial manufacturing zone' },
        { key: 'C', text: 'A lively meeting place to renew friendships, exchange news, and express community culture' },
      ],
      correctKey: 'C',
      explanation: 'Chợ phiên là ngày hội gặp gỡ, giao lưu văn hóa và thắt chặt tình cảm cộng đồng của đồng bào vùng cao.',
    },
  ],

  'thang-co-2': [
    {
      orderIndex: 0,
      question: 'What meat and ingredients are used in authentic traditional Hmong thắng cố?',
      options: [
        { key: 'A', text: 'Chicken breast and mushrooms' },
        { key: 'B', text: 'Horse meat, bones, and internal organs cooked in a large iron pot' },
        { key: 'C', text: 'Deep ocean seafood' },
      ],
      correctKey: 'B',
      explanation: 'Thắng cố ngựa truyền thống của người Mông kết hợp thịt, xương và nội tạng ngựa ninh kỹ trong chảo gang lớn.',
    },
    {
      orderIndex: 1,
      question: 'Which aromatic mountain spices give thắng cố its distinctive, pungent aroma?',
      options: [
        { key: 'A', text: 'Black cardamom (thảo quả), cinnamon, star anise, and dried chili' },
        { key: 'B', text: 'Vanilla and chocolate' },
        { key: 'C', text: 'Mustard and mayonnaise' },
      ],
      correctKey: 'A',
      explanation: 'Thảo quả, quế, hoa hồi, hạt dổi và ớt khô là những gia vị núi rừng tạo nên hương thơm đặc trưng của thắng cố.',
    },
    {
      orderIndex: 2,
      question: 'How does the seasoning in Bắc Hà thắng cố differ from Si Ma Cai?',
      options: [
        { key: 'A', text: 'Bắc Hà cooks generally use more spices than those in Si Ma Cai' },
        { key: 'B', text: 'Bắc Hà uses sugar while Si Ma Cai uses salt' },
        { key: 'C', text: 'There is no difference at all' },
      ],
      correctKey: 'A',
      explanation: 'Người nấu thắng cố ở Bắc Hà thường dùng nhiều tầng gia vị nồng nàn hơn so với hương vị thanh mộc ở Si Ma Cai.',
    },
  ],

  'thang-co-3': [
    {
      orderIndex: 0,
      question: 'According to oral folklore among village elders, how was thắng cố originally created?',
      options: [
        { key: 'A', text: 'By a royal imperial decree' },
        { key: 'B', text: 'During an arduous migration through mountains when ancestors survived using their horses' },
        { key: 'C', text: 'Discovered in an ancient cookbook' },
      ],
      correctKey: 'B',
      explanation: 'Truyền thuyết kể rằng thắng cố ra đời trong cuộc di cư gian khó của tổ tiên người Mông vượt núi tìm vùng đất mới.',
    },
    {
      orderIndex: 1,
      question: 'What is one popular linguistic explanation for the name "thắng cố"?',
      options: [
        { key: 'A', text: 'From "thảng cố" or "thang cốt", meaning bone soup' },
        { key: 'B', text: 'From a French word for roast' },
        { key: 'C', text: 'From a type of cooking pot' },
      ],
      correctKey: 'A',
      explanation: 'Một cách giải thích phổ biến là tên món ăn bắt nguồn từ từ "thảng cố" hay "thang cốt", có nghĩa là canh hầm xương.',
    },
    {
      orderIndex: 2,
      question: 'What other meats have been introduced in modern regional variations of thắng cố?',
      options: [
        { key: 'A', text: 'Beef, buffalo, or pork' },
        { key: 'B', text: 'Seafood and shrimp' },
        { key: 'C', text: 'Ostrich and turkey' },
      ],
      correctKey: 'A',
      explanation: 'Ngày nay để đáp ứng khẩu vị đa dạng của thực khách, thắng cố còn được nấu từ thịt bò, trâu hoặc thịt lợn.',
    },
  ],
};
