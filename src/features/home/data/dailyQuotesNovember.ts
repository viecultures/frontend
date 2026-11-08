export interface DailyQuoteVocabItem {
  word: string;
  ipa: string;
  pos: string;
  meaningVi: string;
}

export interface DailyQuoteItem {
  id: string;
  publishDate: string; // 'YYYY-MM-DD'
  locationName: string;
  artworkUrl: string;
  creator: string;
  quoteVi: string;
  quoteEn: string;
  author: string;
  authorIntro?: string;
  topicVi: string;
  topicEn: string;
  summary20sVi: string;
  summary20sEn: string;
  whoSaidItVi?: string;
  whoSaidItEn?: string;
  historicalContextVi?: string;
  historicalContextEn?: string;
  meaningVi?: string;
  meaningEn?: string;
  vocabulary: DailyQuoteVocabItem[];
}

export const NOVEMBER_DAILY_QUOTES: DailyQuoteItem[] = [
  {
    id: 'quote-2026-11-01',
    publishDate: '2026-11-01',
    locationName: 'Hà Giang · Đèo Mã Pí Lèng',
    artworkUrl: '/images/map-thumb/ha-giang.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Non cao cũng có đường trèo, đường dù hiểm nghèo cũng có lối đi.',
    quoteEn: 'Even the highest mountains have paths to climb; no matter how perilous the trail, there is always a way forward.',
    author: 'Ca dao dân gian',
    authorIntro: 'Vietnamese Folk Wisdom',
    topicVi: 'Ý chí & Nghị lực',
    topicEn: 'Perseverance & Willpower',
    summary20sVi: 'Câu ca dao mượn hình ảnh núi cao hiểm trở vùng địa đầu tổ quốc để nhắc nhở con người không bao giờ lùi bước trước nghịch cảnh.',
    summary20sEn: 'A timeless proverb reminding learners that obstacles may seem immense, but human determination can carve a path through any terrain.',
    whoSaidItVi: 'Trí tuệ dân gian đúc kết qua nhiều thế hệ đồng bào các dân tộc vùng núi cao phía Bắc Việt Nam.',
    whoSaidItEn: 'Ancestral folk wisdom preserved across generations by communities inhabiting the northern highlands of Vietnam.',
    historicalContextVi: 'Đèo Mã Pí Lèng tại Hà Giang từng là hiểm trở bậc nhất, được dựng nên bởi sức lao động phi thường của thanh niên xung phong mở Con đường Hạnh phúc.',
    historicalContextEn: 'The Ma Pi Leng pass in Ha Giang was once treacherous, conquered through the tireless endeavor of thousands of young volunteers building the Happiness Road.',
    meaningVi: 'Khẳng định niềm tin vào ý chí con người: không có thử thách nào là bất khả thi nếu giữ vững quyết tâm.',
    meaningEn: 'Emphasizes that obstacles exist only to be conquered, urging learners to remain steadfast in their journey.',
    vocabulary: [
      { word: 'perilous', ipa: '/ˈperələs/', pos: 'adjective', meaningVi: 'hiểm nghèo, đầy rủi ro' },
      { word: 'determination', ipa: '/dɪˌtɜːmɪˈneɪʃn/', pos: 'noun', meaningVi: 'lòng quyết tâm, ý chí kiên định' }
    ]
  },
  {
    id: 'quote-2026-11-02',
    publishDate: '2026-11-02',
    locationName: 'Hà Nội · Văn Miếu Quốc Tử Giám',
    artworkUrl: '/images/map-thumb/ha-noi.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Hiền tài là nguyên khí của quốc gia.',
    quoteEn: 'Talented and virtuous people are the vitality of the nation.',
    author: 'Thân Nhân Trung',
    authorIntro: 'Scholar & Statesman of the Early Lê Dynasty',
    topicVi: 'Giáo dục & Nguyên khí',
    topicEn: 'Education & National Talent',
    summary20sVi: 'Lời răn khắc trên bia tiến sĩ năm 1484, khẳng định tri thức và đức độ của con người là gốc rễ hưng thịnh của non sông.',
    summary20sEn: 'Inscribed on ancient stone stelae, this principle emphasizes that national prosperity stems from nurturing wisdom and virtue.',
    whoSaidItVi: 'Thân Nhân Trung (1419–1499) là vị danh nho, thượng thư bộ Lại và Đông các đại học sĩ dưới triều vua Lê Thánh Tông.',
    whoSaidItEn: 'Than Nhan Trung was an eminent Confucian scholar, minister and chancellor under the Golden Reign of Emperor Le Thanh Tong.',
    historicalContextVi: 'Khắc trên tấm văn bia khoa thi Nhâm Tuất (1442) tại Văn Miếu – Quốc Tử Giám, mở đầu cho truyền thống khắc bia tôn vinh các bậc hiền tài.',
    historicalContextEn: 'First inscribed on the doctoral stela of 1442 at the Temple of Literature in Hanoi to encourage learning and honor national scholars.',
    meaningVi: 'Nguyên khí thịnh thì thế nước mạnh, nguyên khí suy thì thế nước yếu. Tri thức chính là nội lực quý giá nhất.',
    meaningEn: 'When the cultural and intellectual vitality of a nation is nourished, its sovereignty and prosperity flourish.',
    vocabulary: [
      { word: 'vitality', ipa: '/vaɪˈtæləti/', pos: 'noun', meaningVi: 'nguyên khí, sinh khí tràn đầy' },
      { word: 'virtuous', ipa: '/ˈvɜːtʃuəs/', pos: 'adjective', meaningVi: 'đức độ, mẫu mực' }
    ]
  },
  {
    id: 'quote-2026-11-03',
    publishDate: '2026-11-03',
    locationName: 'Quảng Nam · Phố cổ Hội An',
    artworkUrl: '/images/map-thumb/da-nang.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Thuận vợ thuận chồng, tát biển Đông cũng cạn.',
    quoteEn: 'When husband and wife live in harmony, even the vast Eastern Sea can be drained.',
    author: 'Tục ngữ dân gian',
    authorIntro: 'Vietnamese Proverb',
    topicVi: 'Đồng lòng & Gia đạo',
    topicEn: 'Harmony & Unity',
    summary20sVi: 'Triết lý về sức mạnh của sự hòa thuận và gắn kết gia đình trong văn hóa làng xã truyền thống.',
    summary20sEn: 'A Vietnamese wisdom celebrating marital harmony and collaborative effort capable of overcoming seemingly insurmountable challenges.',
    whoSaidItVi: 'Đúc kết từ ngàn xưa của nhân dân Việt Nam về giá trị của tình cảm gia đình và sự chung sức đồng lòng.',
    whoSaidItEn: 'Centuries-old folk wisdom praising mutual devotion and collective solidarity within Vietnamese domestic life.',
    historicalContextVi: 'Hội An từng là thương cảng trù phú, nơi các gia đình truyền thống buôn bán và cùng nhau vượt qua muôn ngàn sóng gió thương trường.',
    historicalContextEn: 'In historical Hoi An, thriving trading families relied on mutual loyalty and resilience to build enduring merchant lineages.',
    meaningVi: 'Sức mạnh lớn nhất của một gia đình hay tập thể nằm ở sự thấu hiểu, sẻ chia và hòa thuận bền chặt.',
    meaningEn: 'The true strength of any team or family lies not in individual grandeur, but in unspoken unity and mutual care.',
    vocabulary: [
      { word: 'harmony', ipa: '/ˈhɑːməni/', pos: 'noun', meaningVi: 'sự hòa hợp, êm ấm' },
      { word: 'insurmountable', ipa: '/ˌɪnsəˈmaʊntəbl/', pos: 'adjective', meaningVi: 'không thể vượt qua nổi' }
    ]
  },
  {
    id: 'quote-2026-11-04',
    publishDate: '2026-11-04',
    locationName: 'Thừa Thiên Huế · Cố đô Huế',
    artworkUrl: '/images/landing/hue-citadel.webp',
    creator: 'VieCultures Heritage',
    quoteVi: 'Non nước hữu tình, đất thiêng sinh nhân kiệt.',
    quoteEn: 'Picturesque mountains and rivers; sacred land nurtures extraordinary minds.',
    author: 'Ca dao xứ Huế',
    authorIntro: 'Heritage Lore of the Imperial Capital',
    topicVi: 'Cảnh sắc & Tâm hồn',
    topicEn: 'Scenic Heritage & Soul',
    summary20sVi: 'Ca ngợi sự giao hòa giữa cảnh sắc thiên nhiên hữu tình và khí chất con người xứ cố đô.',
    summary20sEn: 'Celebrates the poetic landscapes of ancient Hue and the profound heritage of cultural luminaries shaped by this land.',
    whoSaidItVi: 'Dân gian miền Hương Ngự sáng tác để ca ngợi địa linh nhân kiệt xứ Thuận Hóa.',
    whoSaidItEn: 'Composed by folk poets along the Perfume River honoring the cultural refinement of the ancient Nguyen Dynasty capital.',
    historicalContextVi: 'Huế với sông Hương, núi Ngự và hệ thống đền đài di sản UNESCO là cái nôi nuôi dưỡng vô số học giả, nghệ sĩ và danh nhân văn hóa.',
    historicalContextEn: 'With its iconic Perfume River and imperial landmarks, Hue has served as an incubator for scholars, poets, and cultural pioneers.',
    meaningVi: 'Thiên nhiên tươi đẹp và truyền thống văn hóa sâu sắc là môi trường lý tưởng để bồi dưỡng nhân cách và tài năng.',
    meaningEn: 'A reminder that rich cultural environments and serene landscapes cultivate thoughtful, noble characters.',
    vocabulary: [
      { word: 'picturesque', ipa: '/ˌpɪktʃəˈresk/', pos: 'adjective', meaningVi: 'đẹp như tranh vẽ, hữu tình' },
      { word: 'luminary', ipa: '/ˈluːmɪnəri/', pos: 'noun', meaningVi: 'danh nhân, nhân kiệt kiệt xuất' }
    ]
  },
  {
    id: 'quote-2026-11-05',
    publishDate: '2026-11-05',
    locationName: 'Cao Bằng · Suối Lênin Pác Bó',
    artworkUrl: '/images/map-thumb/ha-giang.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Bàn đá chông chênh dịch sử Đảng, Cuộc đời cách mạng thật là sang.',
    quoteEn: 'Translating history on a precarious slab of stone, how truly noble the revolutionary life is.',
    author: 'Hồ Chí Minh',
    authorIntro: 'National Liberation Hero & World Cultural Celebrity',
    topicVi: 'Lạc quan & Phong thái',
    topicEn: 'Revolutionary Optimism',
    summary20sVi: 'Thể hiện phong thái ung dung, niềm lạc quan cách mạng vượt lên trên mọi gian nan thiếu thốn nơi chiến khu Pác Bó.',
    summary20sEn: 'Exemplifies calm dignity and sublime optimism amid hardship during the struggle for national freedom.',
    whoSaidItVi: 'Chủ tịch Hồ Chí Minh sáng tác bài thơ Tức cảnh Pác Bó vào tháng 2 năm 1941 khi trở về lãnh đạo cách mạng Việt Nam.',
    whoSaidItEn: 'Written in February 1941 by Ho Chi Minh upon his secret return to the Pac Bo caves after three decades abroad.',
    historicalContextVi: 'Nơi núi rừng Cao Bằng khi đó điều kiện vô cùng kham khổ: cháo bẹ, rau măng, bàn làm việc chỉ là tảng đá mấp mô.',
    historicalContextEn: 'Living in austere forest conditions, eating wild bamboo shoots and wild maize, he viewed fighting for freedom as the ultimate luxury.',
    meaningVi: 'Cái "sang" không đến từ vật chất đủ đầy, mà đến từ lý tưởng cao đẹp và tâm hồn thanh thản khi cống hiến cho đời.',
    meaningEn: 'True nobility originates not from worldly comfort, but from a purposeful heart devoted to liberating others.',
    vocabulary: [
      { word: 'precarious', ipa: '/prɪˈkeəriəs/', pos: 'adjective', meaningVi: 'chông chênh, bấp bênh' },
      { word: 'noble', ipa: '/ˈnəʊbl/', pos: 'adjective', meaningVi: 'cao quý, thanh cao' }
    ]
  },
  {
    id: 'quote-2026-11-06',
    publishDate: '2026-11-06',
    locationName: 'Ninh Bình · Tràng An Cố đô Hoa Lư',
    artworkUrl: '/images/landing/com-chay-ninh-binh.webp',
    creator: 'VieCultures Heritage',
    quoteVi: 'Lửa thử vàng, gian nan thử sức.',
    quoteEn: 'Fire tests gold, and adversity tests human strength.',
    author: 'Tục ngữ dân gian',
    authorIntro: 'Vietnamese Proverb',
    topicVi: 'Bản lĩnh & Thử thách',
    topicEn: 'Adversity & Resilience',
    summary20sVi: 'Gian khổ là thước đo chân thực nhất cho bản lĩnh và lòng can trường của con người.',
    summary20sEn: 'Hardships are not barriers but rather the furnace that tempers true character and resilience.',
    whoSaidItVi: 'Câu tục ngữ cổ truyền của người Việt được truyền miệng qua bao thăng trầm dựng nước và giữ nước.',
    whoSaidItEn: 'An ancient Vietnamese maxim passed down through centuries of triumph over adversity and conquest.',
    historicalContextVi: 'Cố đô Hoa Lư được bao bọc bởi địa thế núi đá vôi hiểm trở, minh chứng cho sức bền bỉ quật cường của triều Đinh và Tiền Lê.',
    historicalContextEn: 'The ancient capital Hoa Lu used natural karst barriers to establish independence following a millennium of foreign rule.',
    meaningVi: 'Mỗi khó khăn trong việc học tập hay cuộc sống là cơ hội trui rèn để chúng ta trở nên mạnh mẽ và vững vàng hơn.',
    meaningEn: 'Every linguistic obstacle encountered is an opportunity to cultivate genuine grit and enduring confidence.',
    vocabulary: [
      { word: 'adversity', ipa: '/ədˈvɜːsəti/', pos: 'noun', meaningVi: 'nghịch cảnh, gian nan' },
      { word: 'resilience', ipa: '/rɪˈzɪliəns/', pos: 'noun', meaningVi: 'sự kiên cường, khả năng phục hồi' }
    ]
  },
  {
    id: 'quote-2026-11-07',
    publishDate: '2026-11-07',
    locationName: 'TP. Hồ Chí Minh · Bến Nhà Rồng',
    artworkUrl: '/images/map-thumb/tp-hcm.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Không có gì quý hơn độc lập, tự do.',
    quoteEn: 'Nothing is more precious than independence and freedom.',
    author: 'Hồ Chí Minh',
    authorIntro: 'National Liberation Hero & World Cultural Celebrity',
    topicVi: 'Độc lập & Tự do',
    topicEn: 'Independence & Freedom',
    summary20sVi: 'Tuyên ngôn bất hủ khẳng định quyền tự quyết và giá trị thiêng liêng nhất của mỗi quốc gia dân tộc.',
    summary20sEn: "Vietnam's most iconic declaration asserting that national self-determination is paramount over any material possession.",
    whoSaidItVi: 'Trích trong lời kêu gọi đồng bào và chiến sĩ cả nước của Chủ tịch Hồ Chí Minh ngày 17/7/1966.',
    whoSaidItEn: 'Proclaimed by President Ho Chi Minh in his historic address to the nation on July 17, 1966.',
    historicalContextVi: 'Được phát đi trong giai đoạn khốc liệt của cuộc kháng chiến, trở thành chân lý soi đường và nguồn cổ vũ tinh thần to lớn.',
    historicalContextEn: 'Broadcasted across the nation, becoming an eternal guiding compass for the Vietnamese people.',
    meaningVi: 'Quyền được làm chủ vận mệnh chính mình là điều thiêng liêng và vô giá nhất của một dân tộc cũng như mỗi con người.',
    meaningEn: 'Self-governance and moral liberty form the sacred bedrock upon which human dignity and peace reside.',
    vocabulary: [
      { word: 'independence', ipa: '/ˌɪndɪˈpendəns/', pos: 'noun', meaningVi: 'nền độc lập, quyền tự chủ' },
      { word: 'precious', ipa: '/ˈpreʃəs/', pos: 'adjective', meaningVi: 'quý giá, trân quý' }
    ]
  },
  {
    id: 'quote-2026-11-08',
    publishDate: '2026-11-08',
    locationName: 'Hà Giang · Cao nguyên đá Đồng Văn',
    artworkUrl: '/images/map-thumb/ha-giang.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Hành trình vạn dặm bắt đầu từ một bước chân nhỏ.',
    quoteEn: 'A journey of a thousand miles begins with a single humble step.',
    author: 'Danh ngôn di sản',
    authorIntro: 'Classical Proverb',
    topicVi: 'Khởi đầu & Hành trình',
    topicEn: 'Beginnings & Progress',
    summary20sVi: 'Mỗi ngày tích lũy một chút tri thức là chìa khóa mở cánh cửa hiểu biết văn hóa và ngôn ngữ sâu rộng.',
    summary20sEn: 'Encourages daily consistency in learning, showing that masteries are built step by gradual step.',
    whoSaidItVi: 'Triết lý kinh điển phương Đông về sự khởi đầu khiêm tốn nhưng kiên trì của mọi sự nghiệp vĩ đại.',
    whoSaidItEn: 'A fundamental Eastern adage celebrating the courage required to embark on any profound transformation.',
    historicalContextVi: 'Được đặt làm phương châm cho mỗi bài đọc văn hóa tại VieCultures: mỗi ngày học một chút di sản, làm giàu tâm hồn.',
    historicalContextEn: 'Adopted as the foundational mindset for VieCultures: taking one small cultural discovery every single day.',
    meaningVi: 'Đừng ngần ngại trước những mục tiêu lớn, chỉ cần bạn bắt đầu bước đi đầu tiên hôm nay.',
    meaningEn: 'Do not be overwhelmed by language mastery goals; focus on taking one meaningful step each day.',
    vocabulary: [
      { word: 'humble', ipa: '/ˈhʌmbl/', pos: 'adjective', meaningVi: 'khiêm nhường, giản dị' },
      { word: 'consistency', ipa: '/kənˈsɪstənsi/', pos: 'noun', meaningVi: 'tính kiên định, bền bỉ' }
    ]
  },
  {
    id: 'quote-2026-11-09',
    publishDate: '2026-11-09',
    locationName: 'Quảng Ninh · Vịnh Hạ Long',
    artworkUrl: '/images/reader/reading-landscape.png',
    creator: 'VieCultures Heritage',
    quoteVi: 'Nước chảy đá mòn.',
    quoteEn: 'Persistent drops of water wear away the hardest stone.',
    author: 'Tục ngữ dân gian',
    authorIntro: 'Vietnamese Proverb',
    topicVi: 'Kiên trì & Nhẫn nại',
    topicEn: 'Patience & Endurance',
    summary20sVi: 'Tương tự như cách sóng nước tạc nên những tuyệt tác đảo đá kỳ vĩ của Hạ Long, sự nhẫn nại sẽ khắc phục mọi chướng ngại.',
    summary20sEn: 'Like ocean waves sculpting limestone karsts over millennia, gentle persistence overcomes any barrier.',
    whoSaidItVi: 'Người xưa quan sát thiên nhiên và quy luật bào mòn của dòng nước để đúc kết bài học nhân sinh.',
    whoSaidItEn: 'Drawn from nature observation where water drops gradually etch and carve ancient rock faces.',
    historicalContextVi: 'Kỳ quan thiên nhiên thế giới Vịnh Hạ Long được hình thành qua hàng triệu năm kiến tạo địa chất và sóng gió bào mòn.',
    historicalContextEn: 'Ha Long Bay stands as geological testimony to how patient environmental forces shape wondrous landscapes.',
    meaningVi: 'Sức mạnh của thói quen và sự lặp đi lặp lại bền bỉ mạnh hơn bất cứ sự bộc phát nhất thời nào.',
    meaningEn: 'Daily deliberate practice yields exponential breakthroughs that surpass impulsive bursts of energy.',
    vocabulary: [
      { word: 'persistent', ipa: '/pəˈsɪstənt/', pos: 'adjective', meaningVi: 'kiên trì, bền bỉ không dứt' },
      { word: 'sculpt', ipa: '/skʌlpt/', pos: 'verb', meaningVi: 'tạc nên, kiến tạo' }
    ]
  },
  {
    id: 'quote-2026-11-10',
    publishDate: '2026-11-10',
    locationName: 'Bắc Ninh · Làng tranh Đông Hồ',
    artworkUrl: '/images/map-thumb/ha-noi.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Tranh Đông Hồ gà lợn nét tươi trong, Hồn dân tộc sáng bừng trên giấy điệp.',
    quoteEn: "Dong Ho paintings shine with vivid rustic warmth; the nation's soul glows bright upon scallop-shell paper.",
    author: 'Hoàng Cầm',
    authorIntro: 'Prominent Vietnamese Modernist Poet',
    topicVi: 'Bản sắc & Tranh dân gian',
    topicEn: 'Preserving Heritage',
    summary20sVi: 'Vẻ đẹp mộc mạc và sức sống văn hóa dân gian được lưu giữ qua từng bản khắc gỗ thủ công của tiền nhân.',
    summary20sEn: "Celebrates the enduring aesthetic and soulful storytelling of Vietnam's traditional woodblock artistry.",
    whoSaidItVi: 'Nhà thơ Hoàng Cầm viết trong kiệt tác Bên kia sông Đuống (1948) khi hoài niệm về quê hương Kinh Bắc.',
    whoSaidItEn: 'Poet Hoang Cam penned in his 1948 masterwork recalling the cultural radiance of the Kinh Bac heartland.',
    historicalContextVi: 'Làng tranh Đông Hồ ven bờ sông Đuống sử dụng màu sắc hoàn toàn tự nhiên từ sỏi son, hoa dành dành, than lá tre và giấy điệp óng ánh.',
    historicalContextEn: 'Dong Ho woodblock artists hand-crafted colors from garden botanicals, oyster shells, and crushed charcoals.',
    meaningVi: 'Nghệ thuật đích thực là nghệ thuật mang hơi thở đời sống và giữ trọn tâm hồn thuần hậu của dân tộc.',
    meaningEn: 'True cultural beauty captures everyday agrarian life and mirrors the generous spirit of the populace.',
    vocabulary: [
      { word: 'rustic', ipa: '/ˈrʌstɪk/', pos: 'adjective', meaningVi: 'mộc mạc, đậm chất dân dã' },
      { word: 'enduring', ipa: '/ɪnˈdjʊərɪŋ/', pos: 'adjective', meaningVi: 'trường tồn, bền bỉ theo thời gian' }
    ]
  },
  {
    id: 'quote-2026-11-11',
    publishDate: '2026-11-11',
    locationName: 'Nam Định · Quê hương Trần Hưng Đạo',
    artworkUrl: '/images/map-thumb/ha-noi.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Ăn quả nhớ kẻ trồng cây.',
    quoteEn: 'When eating sweet fruit, remember those who planted the tree.',
    author: 'Tục ngữ đạo lý',
    authorIntro: 'Vietnamese Proverb',
    topicVi: 'Lòng biết ơn & Cội rễ',
    topicEn: 'Gratitude & Roots',
    summary20sVi: 'Đạo lý tri ân cội nguồn, nhắc nhở thế hệ sau trân trọng thành quả và công đức dựng xây của tiền nhân.',
    summary20sEn: "The cardinal Vietnamese virtue of gratitude toward ancestral sacrifices that forged today's peace.",
    whoSaidItVi: 'Bài học luân lý truyền thống của người Việt nhắc nhở về lối sống trọng nghĩa tình.',
    whoSaidItEn: 'A foundational moral compass instilling appreciation for ancestral labor and benevolence.',
    historicalContextVi: 'Vùng đất Thiên Trường Nam Định là căn cứ của hào khí Đông A, nơi các vị vua và tướng lĩnh nhà Trần luôn coi trọng công ơn tướng sĩ.',
    historicalContextEn: 'Thien Truong citadel in Nam Dinh birthed the Dong A Spirit, where rulers governed through filial piety and shared gratitude.',
    meaningVi: 'Biết ơn những gì ta đang thừa hưởng là nền tảng để trở thành một con người có chiều sâu văn hóa.',
    meaningEn: 'Cherishing what we inherit enables learners to carry cultural narratives forward with genuine reverence.',
    vocabulary: [
      { word: 'gratitude', ipa: '/ˈɡrætɪtjuːd/', pos: 'noun', meaningVi: 'lòng biết ơn sâu sắc' },
      { word: 'ancestral', ipa: '/ænˈsestrəl/', pos: 'adjective', meaningVi: 'thuộc về tổ tiên, cội nguồn' }
    ]
  },
  {
    id: 'quote-2026-11-12',
    publishDate: '2026-11-12',
    locationName: 'Lào Cai · Thung lũng Mường Hoa Sa Pa',
    artworkUrl: '/images/landing/mu-cang-chai.webp',
    creator: 'VieCultures Daily',
    quoteVi: 'Bàn tay ta làm nên tất cả, Có sức người sỏi đá cũng thành cơm.',
    quoteEn: 'With our own hands we create everything; through diligence, even barren stone yields golden grain.',
    author: 'Hoàng Trung Thông',
    authorIntro: 'Vietnamese Poet & Cultural Critic',
    topicVi: 'Sức lao động & Sáng tạo',
    topicEn: 'Labor & Diligence',
    summary20sVi: 'Ca ngợi sức mạnh lao động và bàn tay cần cù của con người biến vùng núi đá hiểm trở thành những thửa ruộng bậc thang màu mỡ.',
    summary20sEn: 'A tribute to human labor and ingenuity that transforms rugged mountain slopes into life-giving terraces.',
    whoSaidItVi: 'Nhà thơ Hoàng Trung Thông trong bài thơ Bài ca vỡ đất (1958).',
    whoSaidItEn: 'Written in 1958 by poet Hoang Trung Thong celebrating post-war reclamation and agrarian fortitude.',
    historicalContextVi: 'Ruộng bậc thang Sa Pa là di sản kết tinh từ hàng trăm năm khai khẩn nhọc nhằn của các dân tộc Mông, Dao, Giáy.',
    historicalContextEn: 'The awe-inspiring terraced fields of Sa Pa represent centuries of monumental manual cultivation by indigenous communities.',
    meaningVi: 'Sự kiên trì học tập và tự rèn luyện sẽ giúp ta làm chủ kiến thức, biến điều khó khăn thành kỹ năng thành thạo.',
    meaningEn: 'Consistent deliberate effort converts foreign linguistic structures into fluid, natural expression.',
    vocabulary: [
      { word: 'diligence', ipa: '/ˈdɪlɪdʒəns/', pos: 'noun', meaningVi: 'sự cần cù, chuyên cần' },
      { word: 'barren', ipa: '/ˈbærən/', pos: 'adjective', meaningVi: 'cằn cỗi, sỏi đá' }
    ]
  },
  {
    id: 'quote-2026-11-13',
    publishDate: '2026-11-13',
    locationName: 'Thanh Hóa · Đền Bà Triệu Núi Nưa',
    artworkUrl: '/images/map-thumb/ha-giang.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông.',
    quoteEn: 'I wish to ride tempestuous winds, tread ferocious waves, and slay monsters in the East Sea.',
    author: 'Bà Triệu (Triệu Thị Trinh)',
    authorIntro: 'Legendary Vietnamese Heroine (225–248)',
    topicVi: 'Khí phách & Tự tôn',
    topicEn: 'Courage & Defiance',
    summary20sVi: 'Tuyên ngôn bất khuất của nữ anh hùng dân tộc về khát vọng độc lập và tự tôn.',
    summary20sEn: 'A fearless historical manifesto of female leadership, sovereign pride, and undying resistance against domination.',
    whoSaidItVi: 'Bà Triệu khẳng khái đáp lại lời khuyên lấy chồng an phận năm mới 19 tuổi (năm 248).',
    whoSaidItEn: 'Spoken courageously by Lady Trieu at age 19 when urged to accept traditional domestic servitude.',
    historicalContextVi: 'Cuộc khởi nghĩa Bà Triệu là mốc son chói lọi khẳng định ý chí quật cường của phụ nữ Việt Nam trong dòng chảy nghìn năm lịch sử.',
    historicalContextEn: 'Her rebellion in 248 CE cemented female martial heroism deeply into the foundational bedrock of Vietnamese folklore.',
    meaningVi: 'Khát vọng vươn tới tự do và khẳng định phẩm giá bản thân là ngọn lửa không bao giờ tàn lụi.',
    meaningEn: 'Courage begins with the unwavering conviction that one is entitled to lead an autonomous, meaningful life.',
    vocabulary: [
      { word: 'tempestuous', ipa: '/temˈpestʃuəs/', pos: 'adjective', meaningVi: 'dữ dội như bão tố' },
      { word: 'servitude', ipa: '/ˈsɜːvɪtjuːd/', pos: 'noun', meaningVi: 'cảnh nô lệ, sự phụ thuộc' }
    ]
  },
  {
    id: 'quote-2026-11-14',
    publishDate: '2026-11-14',
    locationName: 'Cần Thơ · Chợ nổi Cái Răng',
    artworkUrl: '/images/map-thumb/tp-hcm.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Cần cù bù thông minh.',
    quoteEn: 'Unwavering diligence compensates for what talent might lack.',
    author: 'Tục ngữ học tập',
    authorIntro: 'Vietnamese Proverb',
    topicVi: 'Cần mẫn & Tiến bộ',
    topicEn: 'Perseverance & Diligence',
    summary20sVi: 'Khẳng định nỗ lực rèn luyện bền bỉ mỗi ngày là nền tảng vững chắc nhất để đạt được thành tựu.',
    summary20sEn: 'Highlights persistent daily practice as the ultimate equalizer in learning and language mastery.',
    whoSaidItVi: 'Câu thành ngữ dân gian được bao thế hệ thầy cô và cha mẹ Việt Nam dùng để khuyên dạy con trẻ.',
    whoSaidItEn: 'A household encouragement teaching students that dedication outshines raw talent over time.',
    historicalContextVi: 'Người dân miền Tây Nam Bộ với bản tính chịu thương chịu khó đã biến vùng đồng bằng sông nước Cửu Long thành vựa lúa trù phú.',
    historicalContextEn: 'The Mekong River delta was transformed into a prosperous breadbasket through generations of patient labor.',
    meaningVi: 'Trong việc học ngôn ngữ, sự tích lũy từ vựng đều đặn mỗi ngày quan trọng hơn nhiều so với năng khiếu bẩm sinh.',
    meaningEn: 'In language acquisition, ten minutes of daily review far exceeds occasional marathons of study.',
    vocabulary: [
      { word: 'unwavering', ipa: '/ʌnˈweɪvərɪŋ/', pos: 'adjective', meaningVi: 'kiên định, không lay chuyển' },
      { word: 'compensate', ipa: '/ˈkɒmpənseɪt/', pos: 'verb', meaningVi: 'bù đắp, đền bù' }
    ]
  },
  {
    id: 'quote-2026-11-15',
    publishDate: '2026-11-15',
    locationName: 'Hải Dương · Côn Sơn Kiếp Bạc',
    artworkUrl: '/images/map-thumb/ha-noi.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Dĩ bất biến, ứng vạn biến.',
    quoteEn: 'Hold fast to the unchanging core to navigate ten thousand shifting tides.',
    author: 'Hồ Chí Minh',
    authorIntro: 'National Liberation Hero & World Cultural Celebrity',
    topicVi: 'Điềm tĩnh & Linh hoạt',
    topicEn: 'Steadfastness & Flexibility',
    summary20sVi: 'Giữ vững nguyên tắc cốt lõi về bản sắc và độc lập, đồng thời mềm dẻo, linh hoạt trước mọi biến động thời cuộc.',
    summary20sEn: 'Philosophical wisdom advocating an unwavering inner anchor while remaining adaptable to fluid circumstances.',
    whoSaidItVi: 'Chủ tịch Hồ Chí Minh dặn dò cụ Huỳnh Thúc Kháng khi Người sang Pháp đàm phán năm 1946.',
    whoSaidItEn: 'Entrusted to acting President Huynh Thuc Khang by Ho Chi Minh before departing for diplomatic talks in Paris (1946).',
    historicalContextVi: 'Năm 1946, chính quyền cách mạng non trẻ đứng trước muôn vàn thù trong giặc ngoài, cần một sự vững vàng tột độ về ý chí.',
    historicalContextEn: 'Faced with multiple foreign armies in 1946, the young republic navigated perils by keeping sovereignty non-negotiable while showing tactical flexibility.',
    meaningVi: 'Biết điều gì là giá trị cốt lõi của mình sẽ giúp ta tự tin thích nghi với mọi đổi thay của hoàn cảnh.',
    meaningEn: 'Clarity regarding your core principles allows flexible adaptation without losing cultural identity.',
    vocabulary: [
      { word: 'anchor', ipa: '/ˈæŋkər/', pos: 'noun', meaningVi: 'điểm tựa vững chắc, mỏ neo' },
      { word: 'adaptable', ipa: '/əˈdæptəbl/', pos: 'adjective', meaningVi: 'linh hoạt, thích ứng cao' }
    ]
  },
  {
    id: 'quote-2026-11-16',
    publishDate: '2026-11-16',
    locationName: 'Nghệ An · Làng Sen Nam Đàn',
    artworkUrl: '/images/map-thumb/ha-noi.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Học không biết chán, rèn không biết mỏi.',
    quoteEn: 'Learn without satiety, practice without weariness.',
    author: 'Triết lý hiếu học',
    authorIntro: 'Classical Educational Canon',
    topicVi: 'Học tập suốt đời',
    topicEn: 'Lifelong Learning',
    summary20sVi: 'Tinh thần trọn đời theo đuổi tri thức và hoàn thiện bản thân của các bậc nho gia và tiền nhân.',
    summary20sEn: 'Commends curiosity and tireless dedication as the hallmarks of true personal enrichment.',
    whoSaidItVi: 'Phương châm học tập phương Đông được Bác Hồ và các nhà chí sĩ cách mạng lấy làm tấm gương tự học.',
    whoSaidItEn: 'Adopted by scholar-revolutionaries as a living motto for independent self-study throughout life.',
    historicalContextVi: 'Vùng đất Nghệ Tĩnh vốn nghèo khó về đất đai nhưng luôn dẫn đầu cả nước về tinh thần hiếu học và sự khổ luyện thành tài.',
    historicalContextEn: 'Nghe Tinh province has historically been renowned across Vietnam for producing scholars of unmatched discipline.',
    meaningVi: 'Học một ngôn ngữ mới là một hành trình mở rộng tâm thức không bao giờ có điểm dừng kết thúc.',
    meaningEn: 'Approaching language learning as an infinite voyage of wonder turns practice into effortless joy.',
    vocabulary: [
      { word: 'satiety', ipa: '/səˈtaɪəti/', pos: 'noun', meaningVi: 'sự thỏa mãn, cảm giác no chán' },
      { word: 'enrichment', ipa: '/ɪnˈrɪtʃmənt/', pos: 'noun', meaningVi: 'sự làm giàu tâm hồn, bồi bổ tri thức' }
    ]
  },
  {
    id: 'quote-2026-11-17',
    publishDate: '2026-11-17',
    locationName: 'Đà Nẵng · Ngũ Hành Sơn',
    artworkUrl: '/images/reader/reading-landscape.png',
    creator: 'VieCultures Heritage',
    quoteVi: 'Tâm bất biến giữa dòng đời vạn biến.',
    quoteEn: "Preserve an untroubled heart amidst life's ceaseless transformations.",
    author: 'Thiền học di sản',
    authorIntro: 'Zen Buddhist Wisdom',
    topicVi: 'An nhiên & Điềm tĩnh',
    topicEn: 'Tranquility & Poise',
    summary20sVi: 'Lời nhắc giữ tâm thế bình thản, tĩnh tại trước những ồn ào và áp lực của cuộc sống hiện đại.',
    summary20sEn: 'An invitation to mental serenity, encouraging inner peace even when surrounding currents are turbulent.',
    whoSaidItVi: 'Tư tưởng thiền phái Trúc Lâm Yên Tử do Phật hoàng Trần Nhân Tông sáng lập chú trọng an định nơi tâm trí.',
    whoSaidItEn: 'Echoes the Truc Lam Zen school founded by King-Monk Tran Nhan Tong, prioritizing inner composure.',
    historicalContextVi: 'Các hang động huyền bí và chùa cổ trên núi Ngũ Hành Sơn từ lâu là chốn thanh tịnh cho người tìm kiếm sự cân bằng nội tâm.',
    historicalContextEn: 'The sacred marble peaks of Da Nang have offered sanctuary for contemplative travelers for hundreds of years.',
    meaningVi: 'Khi đối mặt với khó khăn, sự bình tĩnh lắng đọng chính là vũ khí sắc bén nhất để tìm ra giải pháp.',
    meaningEn: 'Maintaining calm composure during confusing tasks creates mental clarity to identify optimal solutions.',
    vocabulary: [
      { word: 'serenity', ipa: '/səˈrenəti/', pos: 'noun', meaningVi: 'sự thanh thản, an nhiên' },
      { word: 'turbulent', ipa: '/ˈtɜːbjələnt/', pos: 'adjective', meaningVi: 'sóng gió, biến động dữ dội' }
    ]
  },
  {
    id: 'quote-2026-11-18',
    publishDate: '2026-11-18',
    locationName: 'Lâm Đồng · Rừng thông Lang Biang Đà Lạt',
    artworkUrl: '/images/landing/mu-cang-chai.webp',
    creator: 'VieCultures Daily',
    quoteVi: 'Chân cứng đá mềm.',
    quoteEn: 'Steadfast feet wear down hard stone; unbroken wills triumph over rocky trials.',
    author: 'Thành ngữ dân gian',
    authorIntro: 'Vietnamese Idiom',
    topicVi: 'Kiên tâm bền chí',
    topicEn: 'Steadfast Resolve',
    summary20sVi: 'Lời chúc và niềm tin vào sức mạnh nội tại của con người khi dấn thân vào những chặng đường thử thách mới.',
    summary20sEn: 'A poetic blessing for journeyers, celebrating stamina and resolve in the face of steep journeys.',
    whoSaidItVi: 'Câu chúc người đi xa thường được đồng bào trao gửi trước mỗi cuộc lên đường vượt đèo lội suối.',
    whoSaidItEn: 'An age-old blessing bestowed upon travelers embarking on hazardous mountain trails.',
    historicalContextVi: 'Cao nguyên Lang Biang hùng vĩ chứng kiến bao bước chân khai phá kiên gan của cộng đồng các dân tộc K’Ho, Mạ.',
    historicalContextEn: 'The Lang Biang plateaus reflect the deep resilience of indigenous peoples navigating misty highlands.',
    meaningVi: 'Khó khăn dẫu vững như đá tảng rồi cũng sẽ phải lùi bước trước ý chí kiên định của người học.',
    meaningEn: 'Steep obstacles inevitably crumble before patient, unrelenting commitment.',
    vocabulary: [
      { word: 'stamina', ipa: '/ˈstæmɪnə/', pos: 'noun', meaningVi: 'sức bền, sự dẻo dai' },
      { word: 'triumph', ipa: '/ˈtraɪʌmf/', pos: 'verb', meaningVi: 'chiến thắng rực rỡ, vượt qua' }
    ]
  },
  {
    id: 'quote-2026-11-19',
    publishDate: '2026-11-19',
    locationName: 'Hà Tĩnh · Làng Tiên Điền Nghi Xuân',
    artworkUrl: '/images/map-thumb/ha-noi.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Thiện căn ở tại lòng ta, Chữ tâm kia mới bằng ba chữ tài.',
    quoteEn: 'The root of goodness dwells within the heart; a compassionate spirit outweighs sheer talent threefold.',
    author: 'Nguyễn Du',
    authorIntro: 'Great Vietnamese Poet & UNESCO World Cultural Figure (1765–1820)',
    topicVi: 'Chữ Tâm & Đạo đức',
    topicEn: 'Virtue & Benevolence',
    summary20sVi: 'Đúc kết nhân sinh quan vĩ đại của Nguyễn Du: tài năng là đáng quý, nhưng đạo đức và lòng trắc ẩn mới là cốt lõi cao đẹp nhất.',
    summary20sEn: "Truest greatness is measured not solely by intellectual brilliance, but by the warmth and kindness of one's conscience.",
    whoSaidItVi: 'Hai câu thơ kết thúc Đoạn trường tân thanh (Truyện Kiều) của Đại thi hào dân tộc Nguyễn Du.',
    whoSaidItEn: 'The concluding moral synthesis of The Tale of Kieu, Vietnam’s greatest national poetic masterpiece.',
    historicalContextVi: 'Truyện Kiều gồm 3.254 câu lục bát là đỉnh cao của tiếng Việt văn học và tấm gương nhân đạo bất hủ.',
    historicalContextEn: 'With 3,254 verses in six-eight meter, Kieu stands as the monumental summit of Vietnamese linguistic beauty.',
    meaningVi: 'Học rộng tài cao nếu thiếu đi chữ Tâm và sự đồng cảm thì tri thức đó chưa trọn vẹn giá trị.',
    meaningEn: 'Intellectual mastery without empathy and moral integrity remains hollow and unfinished.',
    vocabulary: [
      { word: 'compassionate', ipa: '/kəmˈpæʃənət/', pos: 'adjective', meaningVi: 'giàu lòng trắc ẩn, nhân ái' },
      { word: 'conscience', ipa: '/ˈkɒnʃəns/', pos: 'noun', meaningVi: 'lương tâm, đạo đức nội tâm' }
    ]
  },
  {
    id: 'quote-2026-11-20',
    publishDate: '2026-11-20',
    locationName: 'Hà Nội · Văn Miếu Điện Đại Thành',
    artworkUrl: '/images/map-thumb/ha-noi.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Muốn sang thì bắc cầu kiều, Muốn con hay chữ thì yêu lấy thầy.',
    quoteEn: 'If you wish to cross over, build an arched bridge; if you wish your child to be learned, revere their mentors.',
    author: 'Ca dao truyền thống',
    authorIntro: 'Vietnamese Folk Heritage',
    topicVi: 'Tôn sư trọng đạo',
    topicEn: 'Reverence for Educators',
    summary20sVi: 'Khắc ghi truyền thống tôn vinh nghề giáo nhân ngày Nhà giáo Việt Nam 20/11, tri ân những người thầy dẫn đường khai mở tri thức.',
    summary20sEn: "Honors the profound cultural tradition of Vietnamese Teacher's Day, revering educators as architects of wisdom.",
    whoSaidItVi: 'Lời ru ca dao truyền miệng của nhân dân thể hiện lòng kính ngưỡng muôn đời đối với người thầy.',
    whoSaidItEn: 'A beloved lullaby verse celebrating the sacred bond between learners and their mentors.',
    historicalContextVi: 'Ngày 20/11 hàng năm tại Việt Nam là ngày hội tri ân toàn dân dành cho các thế hệ thầy cô giáo.',
    historicalContextEn: 'November 20th is celebrated nationwide in Vietnam with ceremonies honoring teachers.',
    meaningVi: 'Sự trân quý người dẫn dắt mở ra cánh cửa đón nhận tri thức với thái độ khiêm nhường và lòng biết ơn.',
    meaningEn: 'True intellectual growth begins with humility, gratitude, and reverence for those who guide our path.',
    vocabulary: [
      { word: 'revere', ipa: '/rɪˈvɪər/', pos: 'verb', meaningVi: 'kính trọng, tôn kính sâu sắc' },
      { word: 'mentor', ipa: '/ˈmentɔːr/', pos: 'noun', meaningVi: 'người thầy chỉ đường, cố vấn' }
    ]
  },
  {
    id: 'quote-2026-11-21',
    publishDate: '2026-11-21',
    locationName: 'Điện Biên · Sở chỉ huy Mường Phăng',
    artworkUrl: '/images/map-thumb/ha-giang.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Không có việc gì khó, Chỉ sợ lòng không bền, Đào núi và lấp biển, Quyết chí ắt làm nên.',
    quoteEn: 'No endeavor is impossible when resolve remains unbroken; leveling mountains and filling seas yield to steadfast will.',
    author: 'Hồ Chí Minh',
    authorIntro: 'National Liberation Hero & World Cultural Celebrity',
    topicVi: 'Ý chí & Quyết tâm',
    topicEn: 'Tenacity & Grit',
    summary20sVi: 'Bốn câu thơ cổ vũ tinh thần thế hệ trẻ sẵn sàng đương đầu với mọi chông gai để xây dựng non sông.',
    summary20sEn: 'A spirited verse inspiring youth to conquer monumental challenges through patience and willpower.',
    whoSaidItVi: 'Bác Hồ đọc tặng Liên phân đội thanh niên xung phong số 312 tại Bắc Kạn vào ngày 28/3/1951.',
    whoSaidItEn: 'Delivered spontaneously by Ho Chi Minh on March 28, 1951 to youth volunteer engineering brigades.',
    historicalContextVi: 'Chiến dịch Điện Biên Phủ với kỳ tích kéo pháo bằng tay qua đồi cao vực sâu chính là hiện thân hùng hồn nhất của bốn câu thơ này.',
    historicalContextEn: 'The historic hauling of heavy artillery by hand over sheer mountain passes at Dien Bien Phu proved this verse in action.',
    meaningVi: 'Sức mạnh lớn nhất không nằm ở tài nguyên sẵn có mà nằm ở ý chí quật khởi không bao giờ bỏ cuộc.',
    meaningEn: 'The decisive difference in achieving fluency is not innate aptitude, but stubborn refusal to quit.',
    vocabulary: [
      { word: 'endeavor', ipa: '/ɪnˈdevər/', pos: 'noun', meaningVi: 'nỗ lực lớn lao, sự nghiệp' },
      { word: 'tenacity', ipa: '/təˈnæsəti/', pos: 'noun', meaningVi: 'lòng kiên trì, sự gan góc' }
    ]
  },
  {
    id: 'quote-2026-11-22',
    publishDate: '2026-11-22',
    locationName: 'An Giang · Rừng tràm Trà Sư',
    artworkUrl: '/images/map-thumb/tp-hcm.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Lá lành đùm lá rách.',
    quoteEn: 'Unblemished leaves shelter torn ones; let goodwill comfort those in need.',
    author: 'Tục ngữ nhân ái',
    authorIntro: 'Vietnamese Moral Canon',
    topicVi: 'Tương thân tương ái',
    topicEn: 'Solidarity & Kindness',
    summary20sVi: 'Tinh thần sẻ chia, chở che đồng bào trong khó khăn hoạn nạn của dân tộc Việt Nam qua bao đời.',
    summary20sEn: 'Vietnam’s cherished principle of community solidarity and heartfelt empathy toward vulnerable neighbors.',
    whoSaidItVi: 'Đúc kết từ tình làng nghĩa xóm và sự đùm bọc gắn kết của cộng đồng cư dân nông nghiệp Việt Nam.',
    whoSaidItEn: 'Originating from village mutual aid networks responding to natural disasters along rivers and deltas.',
    historicalContextVi: 'Mỗi khi lũ lụt hay bão gió ập đến miền Trung hoặc đồng bằng Nam Bộ, hàng triệu người dân luôn chung tay cứu trợ đồng bào.',
    historicalContextEn: 'Demonstrated annually during typhoon seasons as communities rally food, medical aid, and care across provincial lines.',
    meaningVi: 'Sự chia sẻ tình thương và lòng vị tha là thước đo cho sự nhân văn của một cộng đồng văn minh.',
    meaningEn: 'A reminder that language thrives when learners encourage and lift each other up along the path.',
    vocabulary: [
      { word: 'unblemished', ipa: '/ʌnˈblemɪʃt/', pos: 'adjective', meaningVi: 'nguyên vẹn, lành lặn' },
      { word: 'solidarity', ipa: '/ˌsɒlɪˈdærəti/', pos: 'noun', meaningVi: 'tinh thần đoàn kết, tương trợ' }
    ]
  },
  {
    id: 'quote-2026-11-23',
    publishDate: '2026-11-23',
    locationName: 'Phú Thọ · Đền Hùng Núi Nghĩa Lĩnh',
    artworkUrl: '/images/map-thumb/ha-noi.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Các Vua Hùng đã có công dựng nước, Bác cháu ta phải cùng nhau giữ lấy nước.',
    quoteEn: 'The Hùng Kings laid the foundation of our homeland; it is our sacred duty to safeguard it together.',
    author: 'Hồ Chí Minh',
    authorIntro: 'National Liberation Hero & World Cultural Celebrity',
    topicVi: 'Cội nguồn & Trách nhiệm',
    topicEn: 'Sacred Heritage & Duty',
    summary20sVi: 'Lời căn dặn thiêng liêng nhân ngày Di sản văn hóa về trách nhiệm gìn giữ chủ quyền và văn hóa dân tộc.',
    summary20sEn: 'A solemn call to intergenerational stewardship, safeguarding cultural identity and sovereignty for future generations.',
    whoSaidItVi: 'Bác Hồ nói chuyện với các cán bộ, chiến sĩ Đại đoàn Quân Tiên Phong tại Đền Giếng ngày 19/9/1954.',
    whoSaidItEn: 'Spoken on September 19, 1954 at the Gieng Temple before returning victoriously to reclaim Hanoi.',
    historicalContextVi: 'Ngày 23/11 hàng năm được lấy làm Ngày Di sản Văn hóa Việt Nam nhằm tôn vinh các giá trị nghìn năm của tổ tiên.',
    historicalContextEn: 'November 23rd is designated as Vietnam National Cultural Heritage Day, celebrating ancestral foundations.',
    meaningVi: 'Bảo tồn văn hóa và ngôn ngữ mẹ đẻ cũng chính là một hình thức bảo vệ độc lập và phẩm giá dân tộc.',
    meaningEn: 'Preserving our linguistic roots and cultural stories is vital to protecting national selfhood in an interconnected world.',
    vocabulary: [
      { word: 'stewardship', ipa: '/ˈstjuːədʃɪp/', pos: 'noun', meaningVi: 'tinh thần trách nhiệm gìn giữ' },
      { word: 'sovereignty', ipa: '/ˈsɒvrənti/', pos: 'noun', meaningVi: 'chủ quyền thiêng liêng' }
    ]
  },
  {
    id: 'quote-2026-11-24',
    publishDate: '2026-11-24',
    locationName: 'Thái Bình · Làng chạm bạc Đồng Xâm Chùa Keo',
    artworkUrl: '/images/landing/banh-cay-thai-binh.webp',
    creator: 'VieCultures Daily',
    quoteVi: 'Uống nước nhớ nguồn.',
    quoteEn: 'When quenching your thirst, never forget the sacred source of the stream.',
    author: 'Tục ngữ đạo lý',
    authorIntro: 'Vietnamese Proverb',
    topicVi: 'Nhớ ơn cội nguồn',
    topicEn: 'Reverence for Origins',
    summary20sVi: 'Lời nhắc nhở mỗi bước trưởng thành trong cuộc đời đều bắt nguồn từ gia đình, quê hương và cội rễ văn hóa.',
    summary20sEn: 'Reminds us that personal achievements are rooted in the wisdom and cultural soil bequeathed by predecessors.',
    whoSaidItVi: 'Câu tục ngữ kinh điển gắn liền với đạo lý thờ cúng tổ tiên của người Việt.',
    whoSaidItEn: 'A timeless moral tenet interwoven with Vietnamese ancestral remembrance practices.',
    historicalContextVi: 'Chùa Keo Thái Bình với kiến trúc gỗ gần 400 năm tuổi là minh chứng trường tồn cho đôi bàn tay và trí tuệ của tổ tiên gửi gắm cho đời sau.',
    historicalContextEn: 'Keo Pagoda’s 400-year-old timber bell tower stands as a testimony to master carpenters across generations.',
    meaningVi: 'Dù đi xa đến đâu và nói bất cứ ngôn ngữ nào, cội nguồn văn hóa quê hương vẫn là gốc rễ bền vững nhất trong tâm hồn.',
    meaningEn: 'Wherever your linguistic journeys lead you, staying grounded in your heritage keeps your soul vibrant.',
    vocabulary: [
      { word: 'bequeath', ipa: '/bɪˈkwiːð/', pos: 'verb', meaningVi: 'truyền lại, trao lại cho đời sau' },
      { word: 'predecessor', ipa: '/ˈpriːdəsesər/', pos: 'noun', meaningVi: 'người đi trước, tiền bối' }
    ]
  },
  {
    id: 'quote-2026-11-25',
    publishDate: '2026-11-25',
    locationName: 'Bình Định · Đất võ Tây Sơn',
    artworkUrl: '/images/map-thumb/ha-giang.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Đánh cho để dài tóc, Đánh cho để đen răng, Đánh cho nó chích luân bất phản.',
    quoteEn: 'Fight so our hair remains long, fight so our teeth stay black, fight so invaders learn never to return.',
    author: 'Quang Trung (Nguyễn Huệ)',
    authorIntro: 'Heroic Emperor & Military Genius of the Tay Son Dynasty (1753–1792)',
    topicVi: 'Giữ gìn phong tục',
    topicEn: 'Cultural Identity',
    summary20sVi: 'Ý chí chiến đấu không chỉ để bảo vệ lãnh thổ mà cốt tử là bảo vệ phong tục, tập quán và bản sắc con người Việt.',
    summary20sEn: "Demonstrates that defending one's homeland is intrinsically tied to preserving its customs, identity, and cultural soul.",
    whoSaidItVi: 'Lời hịch xuất quân thần tốc của Hoàng đế Quang Trung tại phòng tuyến Tam Điệp trước khi tiến công giải phóng Thăng Long đầu xuân 1789.',
    whoSaidItEn: 'Proclaimed by Emperor Quang Trung to his troops at Tam Diep before the swift liberation of Thang Long in spring 1789.',
    historicalContextVi: 'Tục búi tóc dài và nhuộm răng đen từng là phong tục văn hóa cổ truyền thiêng liêng thể hiện bản sắc độc lập của người Đại Việt.',
    historicalContextEn: 'Wearing long topknots and lacquer teeth was the ancient cosmetic hallmark distinguishing Vietnamese identity from northern invaders.',
    meaningVi: 'Bảo vệ non sông gắn liền với bảo vệ nếp sống, tiếng nói và văn hóa riêng biệt của dân tộc.',
    meaningEn: 'Cultural heritage is not an ornament; it is the living essence of sovereignty and self-respect.',
    vocabulary: [
      { word: 'intrinsically', ipa: '/ɪnˈtrɪnzɪkli/', pos: 'adverb', meaningVi: 'về bản chất, gắn liền mật thiết' },
      { word: 'custom', ipa: '/ˈkʌstəm/', pos: 'noun', meaningVi: 'phong tục, tập quán cổ truyền' }
    ]
  },
  {
    id: 'quote-2026-11-26',
    publishDate: '2026-11-26',
    locationName: 'Kiên Giang · Đảo ngọc Phú Quốc',
    artworkUrl: '/images/reader/reading-landscape.png',
    creator: 'VieCultures Daily',
    quoteVi: 'Biển rộng trời cao, chí lớn tung hoành.',
    quoteEn: 'Vast seas and boundless skies welcome bold hearts to venture far.',
    author: 'Thành ngữ chí khí',
    authorIntro: 'Aspirational Idiom',
    topicVi: 'Tầm nhìn vươn khơi',
    topicEn: 'Expansive Horizons',
    summary20sVi: 'Mở rộng tầm nhìn ra biển lớn, khích lệ người học tự tin mang vẻ đẹp Việt Nam hội nhập cùng thế giới.',
    summary20sEn: 'Encourages expansive curiosity and confidence to share Vietnamese heritage across global shores.',
    whoSaidItVi: 'Thành ngữ ca ngợi những con người dám ước mơ lớn và dấn thân vượt qua ranh giới an toàn.',
    whoSaidItEn: 'Celebrates fearless explorers driven by noble aspiration to bridge diverse worlds.',
    historicalContextVi: 'Phú Quốc là cửa ngõ biển tây nam của Tổ quốc, nơi con người bám biển vươn khơi giữ gìn chủ quyền biển đảo thiêng liêng.',
    historicalContextEn: 'Phu Quoc island represents the southwest maritime gate of Vietnam, home to brave fishing fleets and naval guards.',
    meaningVi: 'Học tiếng Anh là đôi cánh giúp bạn mang câu chuyện văn hóa Việt Nam bay xa khắp năm châu.',
    meaningEn: 'Acquiring international language skills empowers you to tell Vietnam’s extraordinary story to the wider world.',
    vocabulary: [
      { word: 'boundless', ipa: '/ˈbaʊndləs/', pos: 'adjective', meaningVi: 'bao la, không bờ bến' },
      { word: 'venture', ipa: '/ˈventʃər/', pos: 'verb', meaningVi: 'dấn thân, mạo hiểm khám phá' }
    ]
  },
  {
    id: 'quote-2026-11-27',
    publishDate: '2026-11-27',
    locationName: 'Hải Phòng · Bạch Đằng Giang',
    artworkUrl: '/images/reader/reading-landscape.png',
    creator: 'VieCultures Heritage',
    quoteVi: 'Khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước.',
    quoteEn: 'Nurture the strength of the people to secure deep roots and enduring foundations; that is the supreme art of governance.',
    author: 'Trần Hưng Đạo',
    authorIntro: 'Supreme Commander & National Hero of the Tran Dynasty (1228–1300)',
    topicVi: 'Khoan thư sức dân',
    topicEn: 'Nurturing the People',
    summary20sVi: 'Tư tưởng chính trị kiệt xuất coi hạnh phúc và sức mạnh của nhân dân là gốc rễ trường tồn của quốc gia.',
    summary20sEn: 'Ancient strategic wisdom recognizing that the true longevity of any community relies on caring for its people.',
    whoSaidItVi: 'Hưng Đạo Đại Vương Trần Quốc Tuấn trả lời vua Trần Anh Tông về kế sách trị nước trước khi qua đời năm 1300.',
    whoSaidItEn: 'Spoken on his deathbed in 1300 to Emperor Tran Anh Tong as his ultimate testament on preserving the nation.',
    historicalContextVi: 'Ba lần đánh tan quân xâm lược Nguyên Mông hùng mạnh bậc nhất thế giới nhờ vào sự đồng lòng của toàn thể nhân dân qua Hội nghị Diên Hồng.',
    historicalContextEn: 'The Tran Dynasty repelled three Mongol invasions by earning the voluntary allegiance of citizens via democratic conferences.',
    meaningVi: 'Mọi sự phát triển bền vững đều phải bắt đầu từ việc chăm sóc và bồi đắp nguồn lực con người.',
    meaningEn: 'Enduring progress in any endeavor begins with gentle, steady care for the foundational well-being of people.',
    vocabulary: [
      { word: 'governance', ipa: '/ˈɡʌvənəns/', pos: 'noun', meaningVi: 'phép trị quốc, sự quản trị' },
      { word: 'longevity', ipa: '/lɒnˈdʒevəti/', pos: 'noun', meaningVi: 'sự trường tồn, tuổi thọ lâu bền' }
    ]
  },
  {
    id: 'quote-2026-11-28',
    publishDate: '2026-11-28',
    locationName: 'Đắk Lắk · Không gian Cồng chiêng Tây Nguyên',
    artworkUrl: '/images/landing/mu-cang-chai.webp',
    creator: 'VieCultures Daily',
    quoteVi: 'Một cây làm chẳng nên non, Ba cây chụm lại nên hòn núi cao.',
    quoteEn: 'A lonely sapling cannot make a hill; three joined together forge a mighty peak.',
    author: 'Ca dao đoàn kết',
    authorIntro: 'Vietnamese Folk Heritage',
    topicVi: 'Sức mạnh tập thể',
    topicEn: 'Community Synergy',
    summary20sVi: 'Bài học sâu sắc về sức mạnh tập thể và sự tương trợ lẫn nhau giữa cộng đồng người học.',
    summary20sEn: 'A reminder that collective collaboration accomplishes feats far greater than any solitary effort.',
    whoSaidItVi: 'Câu ca dao quen thuộc ăn sâu vào tiềm thức của mỗi người dân Việt Nam từ thuở ấu thơ.',
    whoSaidItEn: 'A beloved childhood verse emphasizing collective solidarity as the hallmark of community strength.',
    historicalContextVi: 'Không gian văn hóa cồng chiêng Tây Nguyên được UNESCO công nhận là Kiệt tác truyền khẩu và phi vật thể của nhân loại.',
    historicalContextEn: 'The Space of Gong Culture in the Central Highlands is recognized by UNESCO as intangible cultural heritage.',
    meaningVi: 'Được học cùng cộng đồng và cùng nhau chia sẻ kiến thức sẽ giúp chúng ta tiến xa hơn nhiều so với việc đơn độc.',
    meaningEn: 'Collaborative learning and sharing cultural reflections accelerates vocabulary growth exponentially.',
    vocabulary: [
      { word: 'sapling', ipa: '/ˈsæplɪŋ/', pos: 'noun', meaningVi: 'cây con, mầm non' },
      { word: 'synergy', ipa: '/ˈsɪnədʒi/', pos: 'noun', meaningVi: 'sức mạnh cộng hưởng' }
    ]
  },
  {
    id: 'quote-2026-11-29',
    publishDate: '2026-11-29',
    locationName: 'Đồng Tháp · Làng sen Tháp Mười',
    artworkUrl: '/images/map-thumb/tp-hcm.jpg',
    creator: 'VieCultures Heritage',
    quoteVi: 'Gần bùn mà chẳng hôi tanh mùi bùn.',
    quoteEn: 'Rising above muddy waters, the lotus blossoms in untainted purity.',
    author: 'Ca dao vịnh hoa sen',
    authorIntro: 'Vietnamese Classic Folk Verse',
    topicVi: 'Phẩm giá thanh cao',
    topicEn: 'Integrity & Purity',
    summary20sVi: 'Hình tượng hoa sen biểu trưng cho khí chất kiên trinh, giữ gìn nhân cách trong sạch giữa muôn vàn cám dỗ.',
    summary20sEn: 'The lotus embodies integrity, blossoming gracefully without absorbing impurities from its surroundings.',
    whoSaidItVi: 'Bài ca dao nổi tiếng Tháp Mười đẹp nhất bông sen ca ngợi phẩm chất thanh sạch của quốc hoa Việt Nam.',
    whoSaidItEn: 'Celebrated folk ode honoring the national flower of Vietnam for its graceful dignity.',
    historicalContextVi: 'Vùng đầm lầy Đồng Tháp Mười với bạt ngàn hoa sen ngát hương là biểu tượng văn hóa thanh tao của miền Tây Nam Bộ.',
    historicalContextEn: 'Dong Thap Muoi’s endless lotus plains symbolize the pure resilience of southern wetlands culture.',
    meaningVi: 'Giữ vững sự trong sáng và liêm chính trong tâm hồn là cốt lõi để sống an yên và có ích cho xã hội.',
    meaningEn: 'Staying true to ethical principles fosters authentic self-respect that external pressures cannot erode.',
    vocabulary: [
      { word: 'untainted', ipa: '/ʌnˈteɪntɪd/', pos: 'adjective', meaningVi: 'thanh khiết, không vấy bẩn' },
      { word: 'integrity', ipa: '/ɪnˈteɡrəti/', pos: 'noun', meaningVi: 'sự chính trực, phẩm giá nguyên vẹn' }
    ]
  },
  {
    id: 'quote-2026-11-30',
    publishDate: '2026-11-30',
    locationName: 'Hà Nội · Hồ Tây Khói Sương',
    artworkUrl: '/images/map-thumb/ha-noi.jpg',
    creator: 'VieCultures Daily',
    quoteVi: 'Đi một ngày đàng, học một sàng khôn.',
    quoteEn: "Travel a day's journey, gather a basket of timeless wisdom.",
    author: 'Tục ngữ khuyến học',
    authorIntro: 'Vietnamese Educational Wisdom',
    topicVi: 'Khám phá & Trí tuệ',
    topicEn: 'Exploration & Wisdom',
    summary20sVi: 'Đúc kết lại hành trình học tập tháng 11, khuyến khích người học bước ra thế giới với tinh thần rộng mở.',
    summary20sEn: "Caps off November's daily readings with an invitation to keep exploring new horizons and gaining wisdom.",
    whoSaidItVi: 'Lời khuyên của người xưa khuyến khích tinh thần đi đây đi đó để mở mang hiểu biết và tầm mắt.',
    whoSaidItEn: 'Ancient travelers’ counsel urging youth to venture into the world to expand understanding.',
    historicalContextVi: 'Hồ Tây ngàn năm văn hiến là nơi lắng đọng tinh hoa của các danh sĩ, thi nhân sau những chuyến đi dài khắp non sông.',
    historicalContextEn: 'West Lake in Hanoi has historically been the gathering sanctuary for poets and philosophers reflecting on journeys.',
    meaningVi: 'Mỗi trải nghiệm học tập và khám phá văn hóa đều mang lại cho bạn những hiểu biết quý giá không thể đong đếm.',
    meaningEn: 'Every cross-cultural encounter expands your intellectual horizon and deepens your human connection.',
    vocabulary: [
      { word: 'horizon', ipa: '/həˈraɪzn/', pos: 'noun', meaningVi: 'chân trời, tầm nhìn tri thức' },
      { word: 'enrich', ipa: '/ɪnˈrɪtʃ/', pos: 'verb', meaningVi: 'làm giàu thêm, bồi đắp giá trị' }
    ]
  }
];

/**
 * Lấy câu danh ngôn di sản theo ngày trong tháng 11/2026.
 * Nếu không truyền tham số, tự động lấy ngày hiện tại.
 * Nếu ngày không nằm trong danh sách, tự động lấy theo ngày trong tháng (1-30).
 */
export function getDailyQuoteForDate(dateInput?: Date | string | number): DailyQuoteItem {
  if (typeof dateInput === 'number') {
    const dayIndex = Math.max(1, Math.min(30, Math.floor(dateInput)));
    return NOVEMBER_DAILY_QUOTES[dayIndex - 1];
  }

  const targetDate = dateInput instanceof Date
    ? dateInput
    : typeof dateInput === 'string'
      ? new Date(dateInput)
      : new Date();

  const day = targetDate.getDate(); // 1 - 31
  const month = targetDate.getMonth() + 1; // 1 - 12
  const year = targetDate.getFullYear();

  // Tìm kiếm chính xác ngày trong tháng 11/2026
  const formattedDay = String(day).padStart(2, '0');
  const targetDateKey = `${year}-${String(month).padStart(2, '0')}-${formattedDay}`;
  const exactMatch = NOVEMBER_DAILY_QUOTES.find(q => q.publishDate === targetDateKey);

  if (exactMatch) {
    return exactMatch;
  }

  // Fallback an toàn theo chỉ số ngày (1 - 30)
  const clampedDay = ((day - 1) % 30) + 1;
  return NOVEMBER_DAILY_QUOTES[clampedDay - 1];
}

/**
 * Lấy câu trích dẫn cho ngày hôm nay
 */
export function getDailyQuoteForToday(): DailyQuoteItem {
  return getDailyQuoteForDate(new Date());
}
