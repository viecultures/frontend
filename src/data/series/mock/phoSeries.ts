import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { ArticleSeries, SeriesMetadata } from '../types';

const imageUrl = '/images/series/pho-hanoi.jpg';

export const PHO_SERIES_METADATA: SeriesMetadata = {
  id: 'pho',
  title: 'Pho in Hanoi',
  titleVi: 'Phở Hà Nội',
  theme: 'cuisine',
  provinceId: 'ha-noi',
  region: 'north',
  description: 'Explore the culinary science, morning rituals, and regional diversity of Vietnam’s iconic noodle soup.',
  imageUrl,
  status: 'published',
  chapters: [
    {
      id: 'pho-hanoi-history',
      order: 1,
      titleEn: 'Pho 01: The Kitchen Secrets Behind a Bowl of Phở',
      titleVi: 'Phở 01: Bí Quyết Gian Bếp Đằng Sau Một Bát Phở',
      summary: 'Explore the culinary science and careful heat control required to craft a rich, clear broth.',
      summaryVi: 'Khám phá khoa học thực phẩm và kỹ thuật kiểm soát nhiệt độ đằng sau một nồi nước dùng trong và đậm đà.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'pho-hanoi-flavour',
      order: 2,
      titleEn: 'Pho 02: How Vietnamese People Enjoy Their Morning Phở',
      titleVi: 'Phở 02: Cách Người Việt Thưởng Thức Bát Phở Buổi Sáng',
      summary: 'Discover the morning sidewalk ritual, traditional tasting habits, and social harmony around a bowl of phở.',
      summaryVi: 'Khám phá nghi thức ăn phở sáng ven đường, thói quen nếm nước dùng và sự gắn kết cộng đồng quanh bát phở.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'pho-hanoi-serving',
      order: 3,
      titleEn: 'Pho 03: Northern and Southern Phở: One Name, Two Tastes',
      titleVi: 'Phở 03: Phở Bắc Và Phở Nam: Một Tên Gọi, Hai Khẩu Vị',
      summary: 'Contrast the delicate simplicity of northern phở with the sweet, herb-filled vibrancy of the south.',
      summaryVi: 'So sánh nét thanh đạm tinh tế của phở Bắc với hương vị ngọt ngào, đậm rau thơm của phở Nam.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
  ],
};

const chapters = [
  {
    id: 'pho-hanoi-history',
    titleEn: 'Pho 01: The Kitchen Secrets Behind a Bowl of Phở',
    titleVi: 'Phở 01: Bí Quyết Gian Bếp Đằng Sau Một Bát Phở',
    summary: 'Explore the culinary science and careful heat control required to craft a rich, clear broth.',
    summaryVi: 'Khám phá khoa học thực phẩm và kỹ thuật kiểm soát nhiệt độ đằng sau một nồi nước dùng trong và đậm đà.',
    wordCount: 198,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Cooking a great bowl of phở is not just about tradition, but also about food science. The most important element is the broth, which requires patience and careful temperature control. Chefs slowly simmer beef bones for up to twelve hours. This long process breaks down natural collagen into gelatin, giving the broth a rich and smooth texture without adding artificial ingredients.',
        viText: 'Nấu một bát phở ngon không chỉ dựa vào truyền thống mà còn là khoa học thực phẩm. Yếu tố quan trọng nhất là nước dùng, đòi hỏi sự kiên nhẫn và kiểm soát nhiệt độ cẩn thận. Người nấu ninh xương bò thật chậm tới mười hai tiếng. Quá trình kéo dài này phân giải collagen tự nhiên thành gelatin, mang lại cho nước dùng độ sánh đậm và mịn màng mà không cần dùng phụ gia nhân tạo.',
      },
      {
        orderIndex: 1,
        enText: 'Keeping the heat low is a strict rule in the kitchen. If the water boils too violently, the fat will mix completely into the water and make the broth cloudy. To achieve clear amber soup, cooks must regularly skim off the foam and impurities that rise to the top.',
        viText: 'Giữ lửa nhỏ là một nguyên tắc khắt khe trong gian bếp. Nếu nước sôi quá mạnh, mỡ sẽ hòa lẫn hoàn toàn vào nước và làm đục nước dùng. Để có được làn nước trong màu hổ phách, người nấu phải thường xuyên vớt bọt và tạp chất nổi lên trên bề mặt.',
      },
      {
        orderIndex: 2,
        enText: 'Aromas also play a big role in phở. Before entering the stockpot, whole onions and fresh ginger are charred directly over an open flame. The high heat triggers a chemical reaction that creates a pleasant smoky scent and removes the strong smell of raw beef.',
        viText: 'Hương thơm cũng đóng vai trò rất lớn trong phở. Trước khi cho vào nồi ninh, hành tây và gừng tươi được nướng cháy xém trực tiếp trên ngọn lửa trần. Nhiệt độ cao kích hoạt phản ứng hóa học tạo ra mùi khói dễ chịu và khử sạch mùi gây của thịt bò sống.',
      },
      {
        orderIndex: 3,
        enText: 'Finally, spices like cinnamon, star anise, and cardamom are added near the end of the cooking process. When poured hot over tender noodles and sliced beef, the broth creates a clean, balanced meal that warms the entire body.',
        viText: 'Cuối cùng, các loại gia vị như quế, hoa hồi và thảo quả được thêm vào gần cuối quá trình nấu. Khi chan nóng lên sợi bánh phở mềm và thịt bò thái lát, nước dùng tạo nên một bữa ăn thanh nhẹ, cân bằng giúp làm ấm toàn bộ cơ thể.',
      },
    ],
    vocabularies: [
      { id: 'pho-element', word: 'element', pos: 'noun', ipa: '/ˈel.ə.mənt/', viMeaning: 'yếu tố quan trọng', enDefinition: 'An essential or characteristic part of something.', contextSentence: 'The most important element is the broth.' },
      { id: 'pho-simmer', word: 'simmer', pos: 'verb', ipa: '/ˈsɪm.ər/', viMeaning: 'ninh nhỏ lửa', enDefinition: 'To cook gently in liquid just below the boiling point.', contextSentence: 'Chefs slowly simmer beef bones for up to twelve hours.' },
      { id: 'pho-smooth-texture', word: 'smooth texture', pos: 'noun phrase', ipa: '/smuːð ˈteks.tʃɚ/', viMeaning: 'kết cấu mịn màng', enDefinition: 'A pleasant surface feel or consistency that is even and not rough.', contextSentence: 'Gelatin gives the broth a rich and smooth texture.' },
      { id: 'pho-artificial-ingredients', word: 'artificial ingredients', pos: 'noun phrase', ipa: '/ˌɑːr.t̬əˈfɪʃ.əl ɪnˈɡriː.di.ənts/', viMeaning: 'nguyên liệu / phụ gia nhân tạo', enDefinition: 'Substances added to food that are not found in nature.', contextSentence: 'It creates a rich taste without adding artificial ingredients.' },
      { id: 'pho-boil-violently', word: 'boil violently', pos: 'verb phrase', ipa: '/bɔɪl ˈvaɪə.lənt.li/', viMeaning: 'sôi sùng sục, sôi mạnh', enDefinition: 'To bubble with extreme force or agitation.', contextSentence: 'If the water boils too violently, the fat will mix into the liquid.' },
      { id: 'pho-cloudy', word: 'cloudy', pos: 'adjective', ipa: '/ˈklaʊ.di/', viMeaning: 'bị đục (nước)', enDefinition: 'Not transparent; containing suspended particles.', contextSentence: 'Fast boiling makes the broth cloudy.' },
      { id: 'pho-skim-off', word: 'skim off', pos: 'phrasal verb', ipa: '/skɪm ɔːf/', viMeaning: 'hớt bọt, vớt ra', enDefinition: 'To remove a layer of substance floating on the surface of a liquid.', contextSentence: 'Cooks regularly skim off foam from the surface.' },
      { id: 'pho-impurities', word: 'impurities', pos: 'plural noun', ipa: '/ɪmˈpjʊr.ə.t̬iz/', viMeaning: 'tạp chất', enDefinition: 'Unwanted substances that make something less pure.', contextSentence: 'Skimming removes impurities that rise to the top.' },
      { id: 'pho-trigger', word: 'trigger', pos: 'verb', ipa: '/ˈtrɪɡ.ɚ/', viMeaning: 'kích hoạt, gây ra', enDefinition: 'To cause a process or reaction to begin.', contextSentence: 'The high heat triggers a chemical reaction.' },
      { id: 'pho-balanced', word: 'balanced', pos: 'adjective', ipa: '/ˈbæl.ənst/', viMeaning: 'cân bằng, hài hòa', enDefinition: 'Having elements in pleasing or correct proportions.', contextSentence: 'The broth creates a clean, balanced meal.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Why must chefs keep the heat low while simmering broth?', options: [{ key: 'A', text: 'To prevent the fat from mixing into the water and making it cloudy' }, { key: 'B', text: 'To make the beef cook faster' }, { key: 'C', text: 'To cool the noodles quickly' }], correctKey: 'A' },
      { orderIndex: 1, question: 'Why are whole onions and fresh ginger charred over an open flame?', options: [{ key: 'A', text: 'To turn them into powder' }, { key: 'B', text: 'To create a pleasant smoky scent and remove raw beef odors' }, { key: 'C', text: 'To make the soup sweet like sugar' }], correctKey: 'B' },
    ],
  },
  {
    id: 'pho-hanoi-flavour',
    titleEn: 'Pho 02: How Vietnamese People Enjoy Their Morning Phở',
    titleVi: 'Phở 02: Cách Người Việt Thưởng Thức Bát Phở Buổi Sáng',
    summary: 'Discover the morning sidewalk ritual, traditional tasting habits, and social harmony around a bowl of phở.',
    summaryVi: 'Khám phá nghi thức ăn phở sáng ven đường, thói quen nếm nước dùng và sự gắn kết cộng đồng quanh bát phở.',
    wordCount: 196,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'For many Vietnamese people, a steaming bowl of phở is the best way to start a new day. In busy cities like Hanoi, phở shops open in the early morning while the streets are still quiet. Customers sit on small plastic stools on the pavement, waiting patiently as steam rises from huge stockpots into the cool morning air.',
        viText: 'Với nhiều người Việt Nam, một bát phở bốc khói nghi ngút là cách tuyệt vời nhất để bắt đầu ngày mới. Ở những thành phố nhộn nhịp như Hà Nội, các quán phở mở cửa từ sáng sớm khi đường phố vẫn còn tĩnh lặng. Khách hàng ngồi trên những chiếc ghế nhựa nhỏ ven vỉa hè, kiên nhẫn chờ đợi trong khi làn khói bốc lên từ những nồi nước dùng khổng lồ vào không khí sớm se lạnh.',
      },
      {
        orderIndex: 1,
        enText: 'Eating phở has its own traditional steps. Connoisseurs always take a spoonful of broth first before adding any extra condiments. This simple habit allows them to judge the true quality and natural sweetness of the soup made by the master chef.',
        viText: 'Ăn phở có những bước thưởng thức truyền thống riêng. Những người sành ăn luôn nếm một thìa nước dùng trước khi cho thêm bất kỳ loại gia vị nào. Thói quen giản dị này cho phép họ đánh giá chất lượng thực sự và vị ngọt tự nhiên của nồi súp do người đầu bếp nấu ra.',
      },
      {
        orderIndex: 2,
        enText: 'After the first taste, diners customize their bowls according to personal preferences. In the north, people usually add a spoonful of garlic vinegar and fresh red chili slices. They also enjoy dipping crispy fried dough, called quẩy, directly into the hot broth to absorb the savory flavors.',
        viText: 'Sau ngụm đầu tiên, người ăn nêm nếm bát phở theo sở thích cá nhân. Ở miền Bắc, mọi người thường thêm một thìa giấm tỏi và vài lát ớt đỏ tươi. Họ cũng thích chấm những miếng quẩy giòn tan trực tiếp vào nước dùng nóng hổi để ngấm trọn vị đậm đà.',
      },
      {
        orderIndex: 3,
        enText: 'Phở shops are special places where social distance disappears. High-ranking officials, office workers, and students often sit at the same wooden table, sharing a box of chopsticks. In this way, phở is not just morning fuel; it is a shared cultural ritual that connects people across daily life.',
        viText: 'Quán phở là nơi chốn đặc biệt, nơi khoảng cách xã hội bị xóa nhòa. Các quan chức, nhân viên văn phòng và học sinh sinh viên thường ngồi chung một chiếc bàn gỗ, dùng chung một ống đũa. Nhờ vậy, phở không chỉ là bữa ăn nạp năng lượng buổi sáng; đó là một nghi thức văn hóa chung gắn kết mọi người trong đời sống thường nhật.',
      },
    ],
    vocabularies: [
      { id: 'pho-steaming', word: 'steaming', pos: 'adjective', ipa: '/ˈstiː.mɪŋ/', viMeaning: 'bốc khói nghi ngút', enDefinition: 'Emitting hot vapor or steam.', contextSentence: 'A steaming bowl of phở is the best way to start a new day.' },
      { id: 'pho-stockpot', word: 'stockpot', pos: 'noun', ipa: '/ˈstɑːk.pɑːt/', viMeaning: 'nồi ninh nước dùng lớn', enDefinition: 'A large, deep pot for preparing soup or stock.', contextSentence: 'Steam rises from huge stockpots into the morning air.' },
      { id: 'pho-connoisseur', word: 'connoisseur', pos: 'noun', ipa: '/ˌkɑː.nəˈsɝː/', viMeaning: 'người sành ăn, sành sỏi', enDefinition: 'An expert judge in matters of taste or culinary art.', contextSentence: 'Connoisseurs always take a spoonful of broth first.' },
      { id: 'pho-condiment', word: 'condiment', pos: 'noun', ipa: '/ˈkɑːn.də.mənt/', viMeaning: 'gia vị nêm nếm thêm', enDefinition: 'A substance such as a sauce or spice added to food to enhance flavor.', contextSentence: 'Taste the broth before adding extra condiments.' },
      { id: 'pho-customize', word: 'customize', pos: 'verb', ipa: '/ˈkʌs.tə.maɪz/', viMeaning: 'điều chỉnh theo ý thích', enDefinition: 'To modify something to suit personal tastes or needs.', contextSentence: 'Diners customize their bowls according to preference.' },
      { id: 'pho-garlic-vinegar', word: 'garlic vinegar', pos: 'noun phrase', ipa: '/ˈɡɑːr.lɪk ˈvɪn.ɪ.ɡɚ/', viMeaning: 'giấm tỏi', enDefinition: 'Vinegar infused with slices of raw garlic.', contextSentence: 'People usually add a spoonful of garlic vinegar.' },
      { id: 'pho-crispy-fried-dough', word: 'crispy fried dough', pos: 'noun phrase', ipa: '/ˈkrɪs.pi fraɪd doʊ/', viMeaning: 'bánh quẩy giòn', enDefinition: 'Golden fried dough sticks commonly dipped into soup.', contextSentence: 'Diners dip crispy fried dough directly into broth.' },
      { id: 'pho-absorb', word: 'absorb', pos: 'verb', ipa: '/əbˈzɔːrb/', viMeaning: 'thấm hút, ngấm', enDefinition: 'To take in or soak up liquid or flavor.', contextSentence: 'Fried dough absorbs the savory flavors of the broth.' },
      { id: 'pho-social-distance', word: 'social distance', pos: 'noun phrase', ipa: '/ˌsoʊ.ʃəl ˈdɪs.təns/', viMeaning: 'khoảng cách xã hội', enDefinition: 'The perceived distance or difference between social classes.', contextSentence: 'Phở shops are places where social distance disappears.' },
      { id: 'pho-ritual', word: 'ritual', pos: 'noun', ipa: '/ˈrɪtʃ.u.əl/', viMeaning: 'nghi thức văn hóa', enDefinition: 'A customary series of actions regular in daily life.', contextSentence: 'Phở is a shared cultural ritual that connects people.' },
    ],
    questions: [
      { orderIndex: 0, question: 'What do phở connoisseurs traditionally do before adding condiments?', options: [{ key: 'A', text: 'Put lots of chili sauce immediately' }, { key: 'B', text: 'Take a spoonful of broth first to judge its true quality' }, { key: 'C', text: 'Mix the noodles with soy sauce' }], correctKey: 'B' },
      { orderIndex: 1, question: 'How do phở shops in Vietnam connect different people in daily life?', options: [{ key: 'A', text: 'People of all backgrounds sit together and share tables and chopstick boxes' }, { key: 'B', text: 'Customers are separated into private rooms by job rank' }, { key: 'C', text: 'Everyone must eat in complete silence' }], correctKey: 'A' },
    ],
  },
  {
    id: 'pho-hanoi-serving',
    titleEn: 'Pho 03: Northern and Southern Phở: One Name, Two Tastes',
    titleVi: 'Phở 03: Phở Bắc Và Phở Nam: Một Tên Gọi, Hai Khẩu Vị',
    summary: 'Contrast the delicate simplicity of northern phở with the sweet, herb-filled vibrancy of the south.',
    summaryVi: 'So sánh nét thanh đạm tinh tế của phở Bắc với hương vị ngọt ngào, đậm rau thơm của phở Nam.',
    wordCount: 191,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Although phở is loved nationwide, northern and southern versions offer very different eating experiences. The dish originated in the north, but it migrated to the south in the middle of the 20th century. During this journey, southern cooks adapted the recipe to fit the tropical climate and abundant agricultural products of their region.',
        viText: 'Dù phở được yêu thích trên cả nước, hai phiên bản miền Bắc và miền Nam lại mang đến những trải nghiệm ăn uống rất khác nhau. Món ăn bắt nguồn từ miền Bắc, nhưng đã di cư vào miền Nam vào giữa thế kỷ 20. Trong hành trình này, những người nấu ăn phương Nam đã biến tấu công thức để phù hợp với khí hậu nhiệt đới và nguồn nông sản trù phú của vùng đất mới.',
      },
      {
        orderIndex: 1,
        enText: 'The biggest difference lies in the flavor of the broth. Northern phở emphasizes pure simplicity and clear broth. The soup relies mostly on simmered bones and charred spices, with very little added sweetness. In contrast, southern phở features a noticeably sweeter and darker broth, often cooked with rock sugar and served with extra beef meatballs.',
        viText: 'Điểm khác biệt lớn nhất nằm ở hương vị của nước dùng. Phở Bắc đề cao sự thanh đạm và nước dùng trong vắt. Nồi súp chủ yếu dựa vào xương ninh và gia vị nướng, hầu như không thêm độ ngọt nhân tạo. Ngược lại, phở Nam sở hữu phần nước dùng ngọt rõ rệt và sẫm màu hơn, thường được nấu với đường phèn và ăn kèm bò viên.',
      },
      {
        orderIndex: 2,
        enText: 'Garnish and side dishes also set the two styles apart. While northerners only use fresh scallions and a splash of garlic vinegar, southerners love a colorful table. A southern bowl always comes with a large basket of raw herbs, crunchy bean sprouts, and dark hoisin sauce mixed with sriracha.',
        viText: 'Rau thơm và đồ ăn kèm cũng tạo nên sự tách biệt giữa hai phong cách. Trong khi người miền Bắc chỉ dùng hành lá tươi và một chút giấm tỏi, người miền Nam lại chuộng một bàn ăn đầy màu sắc. Một bát phở Nam luôn đi kèm một rổ rau thơm sống đầy ắp, giá đỗ giòn, cùng tương đen trộn tương ớt.',
      },
      {
        orderIndex: 3,
        enText: 'These differences show how adaptable Vietnamese food can be. Neither style is better than the other; instead, they reflect the unique lifestyle and local tastes of each region across the country.',
        viText: 'Những khác biệt này cho thấy khả năng biến đổi linh hoạt của ẩm thực Việt Nam. Không phong cách nào ngon hơn phong cách nào; thay vào đó, chúng phản ánh lối sống độc đáo và khẩu vị bản địa của từng vùng miền trên khắp đất nước.',
      },
    ],
    vocabularies: [
      { id: 'pho-nationwide', word: 'nationwide', pos: 'adverb', ipa: '/ˌneɪ.ʃənˈwaɪd/', viMeaning: 'trên toàn quốc', enDefinition: 'Throughout the entire country.', contextSentence: 'Although phở is loved nationwide, versions differ.' },
      { id: 'pho-migrate', word: 'migrate', pos: 'verb', ipa: '/ˈmaɪ.ɡreɪt/', viMeaning: 'di cư, dịch chuyển', enDefinition: 'To move from one area or region to settle in another.', contextSentence: 'The dish migrated to the south in the 20th century.' },
      { id: 'pho-adapt', word: 'adapt', pos: 'verb', ipa: '/əˈdæpt/', viMeaning: 'thích nghi, biến tấu', enDefinition: 'To make something suitable for a new use or purpose.', contextSentence: 'Southern cooks adapted the recipe for local ingredients.' },
      { id: 'pho-abundant', word: 'abundant', pos: 'adjective', ipa: '/əˈbʌn.dənt/', viMeaning: 'trù phú, dồi dào', enDefinition: 'Existing or available in large quantities; plentiful.', contextSentence: 'It reflects the abundant agricultural products of the south.' },
      { id: 'pho-pure-simplicity', word: 'pure simplicity', pos: 'noun phrase', ipa: '/pjʊr sɪmˈplɪs.ə.t̬i/', viMeaning: 'sự thanh đạm, mộc mạc', enDefinition: 'The state of being natural, unadorned, and uncomplicated.', contextSentence: 'Northern phở emphasizes pure simplicity and clear broth.' },
      { id: 'pho-in-contrast', word: 'in contrast', pos: 'adverbial phrase', ipa: '/ɪn ˈkɑːn.træst/', viMeaning: 'ngược lại, đối lập', enDefinition: 'When compared to show distinct differences.', contextSentence: 'In contrast, southern phở features a noticeably sweeter broth.' },
      { id: 'pho-rock-sugar', word: 'rock sugar', pos: 'noun phrase', ipa: '/ˈrɑːk ˌʃʊɡ.ɚ/', viMeaning: 'đường phèn', enDefinition: 'Sugar in the form of large, clear crystals.', contextSentence: 'The southern broth is often cooked with rock sugar.' },
      { id: 'pho-beef-meatball', word: 'beef meatball', pos: 'noun phrase', ipa: '/biːf ˈmiːt.bɑːl/', viMeaning: 'bò viên', enDefinition: 'Seasoned beef rolled into small round balls.', contextSentence: 'Southern bowls are served with extra beef meatballs.' },
      { id: 'pho-garnish', word: 'garnish', pos: 'noun', ipa: '/ˈɡɑːr.nɪʃ/', viMeaning: 'đồ trang trí, rau rắc mặt món ăn', enDefinition: 'A small amount of food used to decorate a savory dish.', contextSentence: 'Garnish and side dishes set the two styles apart.' },
      { id: 'pho-adaptable', word: 'adaptable', pos: 'adjective', ipa: '/əˈdæp.tə.bəl/', viMeaning: 'dễ biến đổi, linh hoạt', enDefinition: 'Able to adjust to new conditions or regional tastes.', contextSentence: 'These differences show how adaptable Vietnamese food can be.' },
    ],
    questions: [
      { orderIndex: 0, question: 'What is the key characteristic of northern phở broth compared to southern phở?', options: [{ key: 'A', text: 'It is much sweeter and darker' }, { key: 'B', text: 'It emphasizes pure simplicity and clear broth with very little added sweetness' }, { key: 'C', text: 'It is made with coconut milk' }], correctKey: 'B' },
      { orderIndex: 1, question: 'What side dishes typically accompany a bowl of southern phở?', options: [{ key: 'A', text: 'A large basket of raw herbs, bean sprouts, and hoisin sauce mixed with sriracha' }, { key: 'B', text: 'French fries and bread' }, { key: 'C', text: 'Boiled eggs and pickled cabbage' }], correctKey: 'A' },
    ],
  },
];

export const PHO_SERIES_ARTICLES: ReaderArticleData[] = chapters.map(chapter => ({
  ...chapter,
  topic: 'Ẩm thực',
  region: 'Hà Nội',
  level: 'Level 2',
  cefrLevel: 'B1',
  readTime: '3 phút đọc',
  imageUrl,
  vocabMap: Object.fromEntries(chapter.vocabularies.map(item => [item.word.toLowerCase(), item])),
}));

export const PHO_SERIES: ArticleSeries = {
  metadata: PHO_SERIES_METADATA,
  articles: PHO_SERIES_ARTICLES,
};
