import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { ArticleSeries, SeriesMetadata } from '../types';

const imageUrl = '/images/series/bun-cha.jpg';

export const BUN_CHA_SERIES_METADATA: SeriesMetadata = {
  id: 'bun-cha',
  title: 'Bún Chả in Hanoi',
  titleVi: 'Bún Chả Hà Nội',
  theme: 'cuisine',
  provinceId: 'ha-noi',
  region: 'north',
  description: 'Discover the charcoal grilling secrets, lunchtime sidewalk culture, and refined elegance of Hanoi’s iconic bún chả.',
  imageUrl,
  status: 'published',
  chapters: [
    {
      id: 'bun-cha-grilling-secrets',
      order: 1,
      titleEn: 'Bún Chả 01: The Grilling Secrets of Traditional Bún Chả',
      titleVi: 'Bún Chả 01: Bí Quyết Nướng Than Hoa Của Món Bún Chả Truyền Thống',
      summary: 'Explore the grilling art over natural charcoal, bamboo sticks technique, and warm dipping sauce balance.',
      summaryVi: 'Khám phá nghệ thuật nướng than hoa, kẹp que tre truyền thống và sự cân bằng chuẩn xác của bát nước chấm ấm nóng.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'bun-cha-lunchtime-culture',
      order: 2,
      titleEn: 'Bún Chả 02: Bún Chả: The Soul of Hanoi’s Lunchtime',
      titleVi: 'Bún Chả 02: Bún Chả: Linh Hồn Của Bữa Trưa Người Hà Nội',
      summary: 'Experience the midday sidewalk atmosphere, dipping habits, and global fame of Hanoi’s favorite lunch.',
      summaryVi: 'Trải nghiệm không khí bữa trưa phố cổ, cách thưởng thức từ tốn và dấu ấn quốc tế của món ăn trưa được yêu thích nhất Hà Nội.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'bun-cha-elegant-taste',
      order: 3,
      titleEn: 'Bún Chả 03: Bún Chả and the Elegant Taste of Hanoi',
      titleVi: 'Bún Chả 03: Bún Chả Và Khẩu Vị Thanh Lịch Của Người Hà Nội',
      summary: 'Discover the harmony of five senses, seasonal balance, and timeless elegance in Tràng An cuisine.',
      summaryVi: 'Khám phá sự hòa quyện năm giác quan, triết lý cân bằng theo mùa và nét thanh lịch ngàn đời trong ẩm thực Tràng An.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
  ],
};

const chapters = [
  {
    id: 'bun-cha-grilling-secrets',
    titleEn: 'Bún Chả 01: The Grilling Secrets of Traditional Bún Chả',
    titleVi: 'Bún Chả 01: Bí Quyết Nướng Than Hoa Của Món Bún Chả Truyền Thống',
    summary: 'Explore the grilling art over natural charcoal, bamboo sticks technique, and warm dipping sauce balance.',
    summaryVi: 'Khám phá nghệ thuật nướng than hoa, kẹp que tre truyền thống và sự cân bằng chuẩn xác của bát nước chấm ấm nóng.',
    wordCount: 196,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Bún chả is famous for its fragrant grilled pork, but making it well requires precise cooking techniques. The dish features two types of meat: minced pork patties and thinly sliced pork belly. Chefs must balance lean meat and fat so that the pork stays juicy and soft when cooked over intense heat.',
        viText: 'Bún chả nổi tiếng với thịt lợn nướng thơm lừng, nhưng để làm ngon đòi hỏi kỹ thuật nấu nướng chính xác. Món ăn gồm hai loại thịt: chả viên băm nhỏ và chả miếng thịt ba chỉ thái mỏng. Người nấu phải cân bằng giữa thịt nạc và mỡ để miếng thịt giữ được độ mọng nước và mềm mại khi nướng trên nhiệt độ cao.',
      },
      {
        orderIndex: 1,
        enText: 'The real magic happens during the grilling process over natural charcoal. In the past, cooks clamped the seasoned meat between fresh bamboo sticks instead of metal grates. The bamboo protects the meat from burning too quickly while adding a subtle natural aroma. As pork fat drips onto the hot coals, it creates aromatic smoke that coats every single bite.',
        viText: 'Phép màu thực sự diễn ra trong quá trình nướng trên than hoa tự nhiên. Trước đây, người nấu kẹp thịt đã ướp gia vị vào những thanh tre tươi thay vì vỉ sắt. Cây tre giúp thịt không bị cháy quá nhanh, đồng thời tạo thêm hương thơm tự nhiên thoang thoảng. Khi mỡ lợn nhỏ xuống than hồng, nó tạo ra làn khói thơm lừng bao bọc lấy từng miếng chả.',
      },
      {
        orderIndex: 2,
        enText: 'The dipping sauce is another culinary masterpiece. Unlike cold dressing, the sauce for bún chả is served warm. It is made from a precise mixture of fish sauce, vinegar, sugar, and warm water. Green papaya and carrot slices are pickled quickly to give a refreshing crunch and balance the rich pork fat.',
        viText: 'Nước chấm cũng là một kiệt tác ẩm thực khác. Không giống nước xốt lạnh, nước chấm bún chả luôn được phục vụ ấm nóng. Nó được pha từ sự kết hợp chuẩn xác giữa nước mắm, giấm, đường và nước ấm. Đu đủ xanh và cà rốt được ngâm chua ngọt nhanh để tạo độ giòn sảng khoái và giải ngấy cho mỡ lợn.',
      },
      {
        orderIndex: 3,
        enText: 'When the smoking patties are dropped directly into the warm sauce, they release their sweet juices. This combination forms a savory liquid that coats the fresh rice noodles perfectly without feeling oily.',
        viText: 'Khi những miếng chả bốc khói được thả trực tiếp vào bát nước chấm ấm, chúng ứa ra vị ngọt béo tự nhiên. Sự hòa quyện này tạo nên thứ nước chấm đậm đà bám đều vào sợi bún tươi mà không hề gây cảm giác ngấy mỡ.',
      },
    ],
    vocabularies: [
      { id: 'bc-minced-pork-patty', word: 'minced pork patty', pos: 'noun phrase', ipa: '/ˌmɪnst ˈpɔːrk ˌpæt.i/', viMeaning: 'chả viên băm nhỏ', enDefinition: 'Finely chopped seasoned pork shaped into flat round cakes.', contextSentence: 'The dish features two types of meat: minced pork patties and pork belly.' },
      { id: 'bc-pork-belly', word: 'pork belly', pos: 'noun phrase', ipa: '/ˌpɔːrk ˈbel.i/', viMeaning: 'thịt ba chỉ', enDefinition: 'A boneless cut of fatty meat from the belly of a pig.', contextSentence: 'Cooks grill thinly sliced pork belly over coals.' },
      { id: 'bc-natural-charcoal', word: 'natural charcoal', pos: 'noun phrase', ipa: '/ˌnætʃ.ər.əl ˈtʃɑːr.koʊl/', viMeaning: 'than hoa tự nhiên', enDefinition: 'Carbon fuel made from wood without chemical accelerants.', contextSentence: 'The real magic happens during the grilling process over natural charcoal.' },
      { id: 'bc-clamp', word: 'clamp', pos: 'verb', ipa: '/klæmp/', viMeaning: 'kẹp chặt', enDefinition: 'To hold tightly with a device or between two pieces.', contextSentence: 'Cooks clamped the seasoned meat between fresh bamboo sticks.' },
      { id: 'bc-subtle-aroma', word: 'subtle aroma', pos: 'noun phrase', ipa: '/ˌsʌt̬.əl əˈroʊ.mə/', viMeaning: 'hương thơm thoang thoảng, tinh tế', enDefinition: 'A delicate, pleasant, and faint smell.', contextSentence: 'The bamboo adds a subtle natural aroma to the meat.' },
      { id: 'bc-culinary-masterpiece', word: 'culinary masterpiece', pos: 'noun phrase', ipa: '/ˌkʌl.ə.ner.i ˈmæs.tɚ.piːs/', viMeaning: 'kiệt tác ẩm thực', enDefinition: 'An outstanding culinary creation of highest skill.', contextSentence: 'The dipping sauce is another culinary masterpiece.' },
      { id: 'bc-pickle', word: 'pickle', pos: 'verb', ipa: '/ˈpɪk.əl/', viMeaning: 'ngâm chua ngọt', enDefinition: 'To preserve food in vinegar or brine.', contextSentence: 'Green papaya and carrot slices are pickled quickly.' },
      { id: 'bc-refreshing-crunch', word: 'refreshing crunch', pos: 'noun phrase', ipa: '/rɪˈfreʃ.ɪŋ krʌntʃ/', viMeaning: 'độ giòn sảng khoái', enDefinition: 'A pleasant crisp texture that cleanses the palate.', contextSentence: 'Pickled vegetables give a refreshing crunch.' },
      { id: 'bc-savory', word: 'savory', pos: 'adjective', ipa: '/ˈseɪ.vɚ.i/', viMeaning: 'đậm đà, thơm ngon', enDefinition: 'Pleasant in taste without being sweet; salty or spicy.', contextSentence: 'This combination forms a savory liquid that coats the noodles.' },
      { id: 'bc-coat', word: 'coat', pos: 'verb', ipa: '/koʊt/', viMeaning: 'bao phủ, bám đều', enDefinition: 'To cover with a layer of something.', contextSentence: 'The aromatic smoke coats every single bite.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Why did traditional cooks clamp the meat between fresh bamboo sticks?', options: [{ key: 'A', text: 'To protect the meat from burning too quickly and add a subtle natural aroma' }, { key: 'B', text: 'To freeze the meat before cooking' }, { key: 'C', text: 'Because iron grills were too cheap' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What is unique about the dipping sauce for bún chả?', options: [{ key: 'A', text: 'It is always served boiling cold with ice cubes' }, { key: 'B', text: 'It is served warm and includes quick-pickled green papaya and carrot' }, { key: 'C', text: 'It is made entirely from pure chili oil' }], correctKey: 'B' },
    ],
  },
  {
    id: 'bun-cha-lunchtime-culture',
    titleEn: 'Bún Chả 02: Bún Chả: The Soul of Hanoi’s Lunchtime',
    titleVi: 'Bún Chả 02: Bún Chả: Linh Hồn Của Bữa Trưa Người Hà Nội',
    summary: 'Experience the midday sidewalk atmosphere, dipping habits, and global fame of Hanoi’s favorite lunch.',
    summaryVi: 'Trải nghiệm không khí bữa trưa phố cổ, cách thưởng thức từ tốn và dấu ấn quốc tế của món ăn trưa được yêu thích nhất Hà Nội.',
    wordCount: 201,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'If phở is Hanoi’s favorite breakfast, bún chả is the undeniable king of lunchtime. Walking through the narrow streets of the Old Quarter around noon, you will immediately smell pork grilling over glowing coals. The tempting smoke drifts from sidewalk eateries, inviting office workers, students, and tourists to stop for a meal.',
        viText: 'Nếu phở là bữa sáng yêu thích của người Hà Nội, thì bún chả chắc chắn là vua của bữa trưa. Đi dạo qua những con phố hẹp của phố cổ vào khoảng giữa trưa, bạn sẽ lập tức ngửi thấy mùi thịt lợn nướng trên than hồng. Làn khói đầy cám dỗ bay ra từ những quán ăn vỉa hè, mời gọi dân văn phòng, học sinh và du khách dừng chân dùng bữa.',
      },
      {
        orderIndex: 1,
        enText: 'A serving of bún chả is arranged like a colorful puzzle on the table. Diners receive a warm bowl of dipping sauce filled with grilled pork, a plate of snowy white rice noodles, and a large basket of fresh herbs. Local herbs like perilla, lettuce, and coriander are essential because they balance the savory flavor.',
        viText: 'Một suất bún chả được bày biện như một bức tranh ghép màu sắc trên bàn ăn. Thực khách nhận được một bát nước chấm ấm đầy chả nướng, một đĩa bún trắng ngần và một rổ rau thơm tươi lớn. Các loại rau bản địa như tía tô, xà lách và rau mùi là không thể thiếu vì chúng giúp cân bằng vị mặn mà của thịt.',
      },
      {
        orderIndex: 2,
        enText: 'Eating bún chả correctly is a mindful experience. Instead of pouring the sauce over the noodles, you pick up a small portion of noodles with chopsticks and dip it into the bowl. You then eat the noodles together with a piece of meat and raw greens in one satisfying bite.',
        viText: 'Ăn bún chả đúng cách là một trải nghiệm từ tốn và tinh tế. Thay vì chan nước chấm lên đĩa bún, bạn gắp một lượng bún vừa phải bằng đũa rồi chấm ngập vào bát nước chấm. Sau đó, bạn thưởng thức bún cùng với một miếng thịt nướng và rau sống trong một miếng ăn thỏa mãn.',
      },
      {
        orderIndex: 3,
        enText: 'In 2016, bún chả gained global fame when US President Barack Obama enjoyed it with chef Anthony Bourdain at a humble local shop. Yet, despite worldwide attention, bún chả remains an affordable, down-to-earth comfort food deeply rooted in Hanoi’s daily street culture.',
        viText: 'Năm 2016, bún chả đã nổi tiếng toàn cầu khi Tổng thống Mỹ Barack Obama cùng đầu bếp Anthony Bourdain thưởng thức món ăn này tại một quán ăn bình dân. Dù nhận được sự chú ý của quốc tế, bún chả vẫn là món ăn ấm lòng, giá cả bình dân và gắn bó sâu sắc với văn hóa đường phố thường nhật của Hà Nội.',
      },
    ],
    vocabularies: [
      { id: 'bc-undeniable-king', word: 'undeniable king', pos: 'noun phrase', ipa: '/ˌʌn.dɪˈnaɪ.ə.bəl kɪŋ/', viMeaning: 'vua không thể phủ nhận', enDefinition: 'Something whose supreme position or popularity cannot be disputed.', contextSentence: 'Bún chả is the undeniable king of lunchtime.' },
      { id: 'bc-glowing-coals', word: 'glowing coals', pos: 'plural noun', ipa: '/ˌɡloʊ.ɪŋ ˈkoʊlz/', viMeaning: 'than hồng', enDefinition: 'Pieces of hot carbon giving off a steady light and intense heat.', contextSentence: 'You will smell pork grilling over glowing coals.' },
      { id: 'bc-tempting-smoke', word: 'tempting smoke', pos: 'noun phrase', ipa: '/ˌtemp.tɪŋ ˈsmoʊk/', viMeaning: 'làn khói cám dỗ, mời gọi', enDefinition: 'Aromatic steam or smoke that makes you desire food.', contextSentence: 'The tempting smoke drifts from sidewalk eateries.' },
      { id: 'bc-sidewalk-eatery', word: 'sidewalk eatery', pos: 'noun phrase', ipa: '/ˈsaɪd.wɑːk ˌiː.t̬ɚ.i/', viMeaning: 'quán ăn vỉa hè', enDefinition: 'An informal casual restaurant located along pavement sidewalks.', contextSentence: 'Smoke drifts from sidewalk eateries across the Old Quarter.' },
      { id: 'bc-perilla', word: 'perilla', pos: 'noun', ipa: '/pəˈrɪl.ə/', viMeaning: 'lá tía tô', enDefinition: 'An East Asian herb with purple-green leaves and an aromatic taste.', contextSentence: 'Local herbs like perilla are essential for bún chả.' },
      { id: 'bc-essential', word: 'essential', pos: 'adjective', ipa: '/ɪˈsen.ʃəl/', viMeaning: 'thiết yếu, không thể thiếu', enDefinition: 'Extremely important and necessary.', contextSentence: 'Fresh local herbs are essential because they balance savory flavors.' },
      { id: 'bc-mindful-experience', word: 'mindful experience', pos: 'noun phrase', ipa: '/ˌmaɪnd.fəl ɪkˈspɪr.i.əns/', viMeaning: 'trải nghiệm từ tốn, chú tâm', enDefinition: 'An activity done with deliberate presence, calm, and awareness.', contextSentence: 'Eating bún chả correctly is a mindful experience.' },
      { id: 'bc-satisfying-bite', word: 'satisfying bite', pos: 'noun phrase', ipa: '/ˌsæt̬.əs.faɪ.ɪŋ ˈbaɪt/', viMeaning: 'miếng ăn thỏa mãn', enDefinition: 'A mouthful of food giving complete contentment and pleasure.', contextSentence: 'Enjoy the noodles, pork, and herbs in one satisfying bite.' },
      { id: 'bc-gain-global-fame', word: 'gain global fame', pos: 'verb phrase', ipa: '/ɡeɪn ˌɡloʊ.bəl ˈfeɪm/', viMeaning: 'nổi tiếng toàn cầu', enDefinition: 'To become well known and celebrated all around the world.', contextSentence: 'Bún chả gained global fame after President Obama visited Hanoi.' },
      { id: 'bc-down-to-earth', word: 'down-to-earth', pos: 'adjective', ipa: '/ˌdaʊn.tuːˈɝːθ/', viMeaning: 'bình dân, giản dị', enDefinition: 'Practical, realistic, unpretentious, and accessible to everyone.', contextSentence: 'Bún chả remains an affordable, down-to-earth comfort food.' },
    ],
    questions: [
      { orderIndex: 0, question: 'How is bún chả traditionally eaten?', options: [{ key: 'A', text: 'Pouring the entire bowl of sauce over the plate of cold noodles' }, { key: 'B', text: 'Dipping a small portion of noodles into the warm sauce and eating with pork and herbs' }, { key: 'C', text: 'Drinking the sauce before touching the noodles' }], correctKey: 'B' },
      { orderIndex: 1, question: 'Which famous world leader enjoyed bún chả in Hanoi in 2016?', options: [{ key: 'A', text: 'Barack Obama' }, { key: 'B', text: 'Nelson Mandela' }, { key: 'C', text: 'Emmanuel Macron' }], correctKey: 'A' },
    ],
  },
  {
    id: 'bun-cha-elegant-taste',
    titleEn: 'Bún Chả 03: Bún Chả and the Elegant Taste of Hanoi',
    titleVi: 'Bún Chả 03: Bún Chả Và Khẩu Vị Thanh Lịch Của Người Hà Nội',
    summary: 'Discover the harmony of five senses, seasonal balance, and timeless elegance in Tràng An cuisine.',
    summaryVi: 'Khám phá sự hòa quyện năm giác quan, triết lý cân bằng theo mùa và nét thanh lịch ngàn đời trong ẩm thực Tràng An.',
    wordCount: 189,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Behind the simple appearance of bún chả lies the refined culinary philosophy of Hanoi. People from the ancient capital have always valued harmony, moderation, and elegance in their cooking. Bún chả perfectly reflects this lifestyle through its careful balance of tastes, colors, and textures.',
        viText: 'Đằng sau vẻ ngoài giản dị của bún chả là triết lý ẩm thực tinh tế của người Hà Nội. Con người đất kinh kỳ xưa luôn coi trọng sự hài hòa, chừng mực và thanh lịch trong nấu nướng. Bún chả phản ánh hoàn hảo lối sống này thông qua sự cân bằng cẩn trọng giữa hương vị, màu sắc và kết cấu.',
      },
      {
        orderIndex: 1,
        enText: 'Unlike modern fast food, bún chả is designed to stimulate all five senses. The eyes enjoy the contrast between brown meat, red chili, and green herbs. The ears hear the gentle sizzle of meat fat hitting charcoal. Finally, the palate enjoys a harmonious mix of sour, spicy, salty, and sweet notes in every mouthful.',
        viText: 'Khác với đồ ăn nhanh hiện đại, bún chả được thiết kế để kích thích cả năm giác quan. Mắt ngắm nhìn sự tương phản giữa miếng thịt nâu cánh gián, ớt đỏ và rau xanh. Tai nghe tiếng mỡ thịt xèo xèo êm tai khi rơi xuống than hoa. Cuối cùng, vòm họng tận hưởng sự pha trộn hài hòa của các nốt vị chua, cay, mặn, ngọt trong từng miếng ăn.',
      },
      {
        orderIndex: 2,
        enText: 'The choice of ingredients also shows seasonal adaptation. During hot summer days, a heavy bowl of hot soup can make diners feel uncomfortably warm. Bún chả solves this problem by using cold noodles and crisp herbs, paired with warm sauce rather than boiling soup, creating a light and refreshing meal.',
        viText: 'Việc lựa chọn nguyên liệu cũng cho thấy sự thích nghi với thời tiết theo mùa. Vào những ngày hè oi ả, một bát nước dùng nóng hổi có thể khiến thực khách cảm thấy bức bối. Bún chả giải quyết vấn đề này bằng cách dùng sợi bún nguội mát và rau sống giòn, kết hợp với bát nước chấm ấm vừa phải thay vì nước dùng sôi sùng sục, tạo nên một bữa ăn thanh nhẹ và giải nhiệt.',
      },
      {
        orderIndex: 3,
        enText: 'For generations, bún chả has been mentioned in famous Vietnamese literature as a symbol of nostalgic home memories. It proves that culinary greatness does not require luxury ingredients; it only needs respect for balance, fresh produce, and community traditions.',
        viText: 'Qua nhiều thế hệ, bún chả đã đi vào các tác phẩm văn học nổi tiếng của Việt Nam như một biểu tượng của ký ức quê nhà đầy hoài niệm. Món ăn chứng minh rằng sự vĩ đại của ẩm thực không cần đến nguyên liệu xa xỉ; nó chỉ cần sự tôn trọng đối với tính cân bằng, nông sản tươi sạch và truyền thống cộng đồng.',
      },
    ],
    vocabularies: [
      { id: 'bc-refined-philosophy', word: 'refined philosophy', pos: 'noun phrase', ipa: '/rɪˈfaɪnd fɪˈlɑː.sə.fi/', viMeaning: 'triết lý tinh tế', enDefinition: 'A sophisticated and well-developed set of guiding culinary principles.', contextSentence: 'Behind the dish lies the refined culinary philosophy of Hanoi.' },
      { id: 'bc-moderation', word: 'moderation', pos: 'noun', ipa: '/ˌmɑː.dəˈreɪ.ʃən/', viMeaning: 'sự chừng mực, điều độ', enDefinition: 'The avoidance of excess or extremes in actions or taste.', contextSentence: 'Hanoi people value harmony, moderation, and elegance in cooking.' },
      { id: 'bc-elegance', word: 'elegance', pos: 'noun', ipa: '/ˈel.ə.ɡəns/', viMeaning: 'sự thanh lịch, tao nhã', enDefinition: 'The quality of being graceful and stylish in appearance or manner.', contextSentence: 'Bún chả reflects the elegance of ancient capital lifestyle.' },
      { id: 'bc-stimulate', word: 'stimulate', pos: 'verb', ipa: '/ˈstɪm.jə.leɪt/', viMeaning: 'kích thích (giác quan)', enDefinition: 'To encourage or raise levels of physiological or nervous activity.', contextSentence: 'Bún chả is designed to stimulate all five senses.' },
      { id: 'bc-gentle-sizzle', word: 'gentle sizzle', pos: 'noun phrase', ipa: '/ˌdʒen.t̬əl ˈsɪz.əl/', viMeaning: 'tiếng xèo xèo êm tai', enDefinition: 'A soft hissing sound made by frying or grilling fat.', contextSentence: 'The ears hear the gentle sizzle of meat fat hitting charcoal.' },
      { id: 'bc-palate', word: 'palate', pos: 'noun', ipa: '/ˈpæl.ət/', viMeaning: 'vòm họng, vị giác', enDefinition: 'The roof of the mouth; a person’s appreciation of taste and flavor.', contextSentence: 'The palate enjoys a harmonious mix of sour, spicy, salty, and sweet notes.' },
      { id: 'bc-seasonal-adaptation', word: 'seasonal adaptation', pos: 'noun phrase', ipa: '/ˌsiː.zən.əl ˌæd.æpˈteɪ.ʃən/', viMeaning: 'sự thích nghi theo mùa', enDefinition: 'Adjusting diet, habits, or recipes according to weather seasons.', contextSentence: 'The choice of ingredients shows seasonal adaptation.' },
      { id: 'bc-boiling-soup', word: 'boiling soup', pos: 'noun phrase', ipa: '/ˌbɔɪ.lɪŋ ˈsuːp/', viMeaning: 'súp / nước dùng sôi sùng sục', enDefinition: 'Broth kept at extremely high, bubbling temperature.', contextSentence: 'Warm dipping sauce is used rather than boiling soup.' },
      { id: 'bc-nostalgic-memory', word: 'nostalgic memory', pos: 'noun phrase', ipa: '/nɑːˈstæl.dʒɪk ˌmem.ər.i/', viMeaning: 'ký ức hoài niệm', enDefinition: 'A sentimental longing or affectionate feeling for the past.', contextSentence: 'Bún chả is a symbol of nostalgic home memories in literature.' },
      { id: 'bc-fresh-produce', word: 'fresh produce', pos: 'noun phrase', ipa: '/ˌfreʃ ˈproʊ.duːs/', viMeaning: 'nông sản tươi sạch', enDefinition: 'Agricultural products such as fresh fruits and vegetables.', contextSentence: 'Great cooking relies on balance and fresh produce.' },
    ],
    questions: [
      { orderIndex: 0, question: 'How does bún chả adapt to hot summer weather?', options: [{ key: 'A', text: 'By serving cold noodles and crisp herbs with warm sauce instead of boiling soup' }, { key: 'B', text: 'By skipping meat entirely' }, { key: 'C', text: 'By drinking boiling water with chili' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What does bún chả prove about culinary greatness?', options: [{ key: 'A', text: 'It requires rare and expensive imported ingredients' }, { key: 'B', text: 'It does not require luxury ingredients, only respect for balance and fresh produce' }, { key: 'C', text: 'It can only be made in five-star hotel kitchens' }], correctKey: 'B' },
    ],
  },
];

export const BUN_CHA_SERIES_ARTICLES: ReaderArticleData[] = chapters.map(chapter => ({
  ...chapter,
  topic: 'Ẩm thực',
  region: 'Hà Nội',
  level: 'Level 2',
  cefrLevel: 'B1',
  readTime: '3 phút đọc',
  imageUrl,
  vocabMap: Object.fromEntries(chapter.vocabularies.map(item => [item.word.toLowerCase(), item])),
}));

export const BUN_CHA_SERIES: ArticleSeries = {
  metadata: BUN_CHA_SERIES_METADATA,
  articles: BUN_CHA_SERIES_ARTICLES,
};
