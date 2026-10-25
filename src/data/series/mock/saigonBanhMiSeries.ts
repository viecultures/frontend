import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { ArticleSeries, SeriesMetadata } from '../types';

const imageUrl = 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80';

export const SAIGON_BANH_MI_METADATA: SeriesMetadata = {
  id: 'saigon-banh-mi',
  title: 'Bánh Mì: Street Culture in Saigon',
  titleVi: 'Bánh Mì: Văn hóa đường phố Sài Gòn',
  theme: 'cuisine',
  provinceId: 'ho-chi-minh',
  region: 'south',
  description: 'Follow the journey of the iconic Vietnamese baguette from French culinary influence to a beloved global street food phenomenon.',
  imageUrl,
  status: 'draft',
  chapters: [
    {
      id: 'banh-mi-crust',
      order: 1,
      titleEn: 'Bánh Mì 01: The Crispy Crust',
      titleVi: 'Bánh Mì 01: Vỏ giòn ruột xốp',
      summary: 'Learn how Vietnamese bakers adapted the French baguette into an airy, crispy sandwich.',
      summaryVi: 'Tìm hiểu cách thợ làm bánh Việt biến tấu bánh mì Pháp thành ổ bánh vỏ giòn, ruột xốp nhẹ.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'banh-mi-fillings',
      order: 2,
      titleEn: 'Bánh Mì 02: Pâté, Pickles and Herbs',
      titleVi: 'Bánh Mì 02: Pa-tê, đồ chua và rau thơm',
      summary: 'Discover the contrast of savoury meats, rich spread and crunchy pickled vegetables.',
      summaryVi: 'Khám phá sự hòa quyện giữa thịt mặn mà, pa-tê béo bùi và đồ chua giòn rụm.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'banh-mi-sidewalk',
      order: 3,
      titleEn: 'Bánh Mì 03: The Sidewalk Cart',
      titleVi: 'Bánh Mì 03: Xe bánh mì vỉa hè',
      summary: 'Practice English phrases for ordering your custom sandwich at a busy Saigon roadside stall.',
      summaryVi: 'Luyện tập các cụm từ tiếng Anh để gọi một ổ bánh mì theo sở thích tại xe đẩy vỉa hè.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
  ],
};

const chapters = [
  {
    id: 'banh-mi-crust',
    titleEn: 'Bánh Mì 01: The Crispy Crust',
    titleVi: 'Bánh Mì 01: Vỏ giòn ruột xốp',
    summary: 'Learn how Vietnamese bakers adapted the French baguette into an airy, crispy sandwich.',
    summaryVi: 'Tìm hiểu cách thợ làm bánh Việt biến tấu bánh mì Pháp thành ổ bánh vỏ giòn, ruột xốp nhẹ.',
    paragraphs: [
      { orderIndex: 0, enText: 'The story of bánh mì began in the late nineteenth century when French baguettes arrived in Indochina. Local bakers soon adapted the recipe, adding rice flour to create a thinner, lighter loaf with an intensely crispy crust.', viText: 'Câu chuyện bánh mì bắt đầu từ cuối thế kỷ 19 khi bánh mì baguette của Pháp du nhập vào Đông Dương. Những người thợ làm bánh bản địa đã sớm biến tấu công thức, thêm bột gạo để tạo nên ổ bánh mỏng, nhẹ hơn với lớp vỏ giòn rụm.' },
      { orderIndex: 1, enText: 'Unlike European bread which is often dense and chewy, a Vietnamese loaf is prized for being airy inside and flaky outside. When sliced open, it provides the perfect vessel for a rich variety of savoury fillings.', viText: 'Khác với bánh mì phương Tây thường đặc ruột và dai, bánh mì Việt Nam được ưa chuộng nhờ ruột xốp nhẹ và vỏ giòn tan. Khi xẻ đôi, nó trở thành chiếc vỏ bọc hoàn hảo cho các loại nhân mặn đậm đà.' },
      { orderIndex: 2, enText: 'You can explain this culinary adaptation: “By modifying the baking technique, Vietnamese cooks transformed a foreign staple into an original street food classic.”', viText: 'Bạn có thể giải thích sự giao thoa này: “Bằng cách biến tấu kỹ thuật nướng, những người thợ Việt đã biến một món ăn ngoại quốc thành biểu tượng ẩm thực đường phố độc đáo.”' },
    ],
    vocabularies: [
      { id: 'bm-crust', word: 'crust', pos: 'noun', ipa: '/krʌst/', viMeaning: 'lớp vỏ bánh', enDefinition: 'The tough or crisp outer part of a loaf of bread.', contextSentence: 'The hot bread had a delightfully crunchy crust.' },
      { id: 'bm-flaky', word: 'flaky', pos: 'adjective', ipa: '/ˈfleɪ.ki/', viMeaning: 'giòn xốp, dễ vỡ vụn nhỏ', enDefinition: 'Breaking easily into small, thin pieces.', contextSentence: 'Freshly baked baguettes have a flaky texture.' },
      { id: 'bm-vessel', word: 'vessel', pos: 'noun', ipa: '/ˈves.əl/', viMeaning: 'vỏ bọc, vật chứa', enDefinition: 'A container or holder used to carry substances.', contextSentence: 'The crispy loaf acts as a vessel for tasty fillings.' },
    ],
    questions: [
      { orderIndex: 0, question: 'What makes Vietnamese baguettes lighter and crisper than traditional French ones?', options: [{ key: 'A', text: 'Adding rice flour and specific baking techniques' }, { key: 'B', text: 'Boiling the dough before baking' }, { key: 'C', text: 'Using only wheat flour' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What texture is prized in Vietnamese bread?', options: [{ key: 'A', text: 'Dense and heavy' }, { key: 'B', text: 'Airy inside and flaky outside' }, { key: 'C', text: 'Soft and completely crustless' }], correctKey: 'B' },
    ],
  },
  {
    id: 'banh-mi-fillings',
    titleEn: 'Bánh Mì 02: Pâté, Pickles and Herbs',
    titleVi: 'Bánh Mì 02: Pa-tê, đồ chua và rau thơm',
    summary: 'Discover the contrast of savoury meats, rich spread and crunchy pickled vegetables.',
    summaryVi: 'Khám phá sự hòa quyện giữa thịt mặn mà, pa-tê béo bùi và đồ chua giòn rụm.',
    paragraphs: [
      { orderIndex: 0, enText: 'The secret of a memorable bánh mì lies in the harmony of contrasting textures and tastes. A smear of rich pork liver pâté and creamy mayonnaise lines the warm interior of the loaf.', viText: 'Bí quyết của một ổ bánh mì đáng nhớ nằm ở sự hài hòa giữa các tầng vị và kết cấu đối lập. Một lớp pa-tê gan béo ngậy và sốt bơ trứng được phết đều trong lòng ổ bánh ấm giòn.' },
      { orderIndex: 1, enText: 'Next come savoury meats such as cold cuts, roasted pork, or grilled sausage. To cut through the richness, the vendor adds pickled daikon and carrot, crisp cucumber spears, fresh cilantro, and thin slices of fiery chili.', viText: 'Tiếp theo là các loại thịt như chả lụa, thịt nguội, thịt quay hoặc xíu mại. Để cân bằng độ béo, người bán thêm đồ chua từ củ cải và cà rốt, dưa leo giòn mát, ngò rí và vài lát ớt hiểm cay nồng.' },
      { orderIndex: 2, enText: 'Each bite delivers crunch, savoury warmth, acidity, and aromatic freshness all at once.', viText: 'Mỗi miếng cắn đem lại cảm giác giòn rụm, vị mặn ấm áp, chút chua dịu và hương thơm tươi mát cùng lúc.' },
    ],
    vocabularies: [
      { id: 'bm-savoury', word: 'savoury', pos: 'adjective', ipa: '/ˈseɪ.vɚ.i/', viMeaning: 'mặn mà, đậm đà', enDefinition: 'Belonging to the category that is salty or spicy rather than sweet.', contextSentence: 'Grilled pork adds a savoury warmth to the bread.' },
      { id: 'bm-acidity', word: 'acidity', pos: 'noun', ipa: '/əˈsɪd.ə.ti/', viMeaning: 'vị chua cân bằng', enDefinition: 'The quality of tasting sour or having an acidic touch.', contextSentence: 'Pickled vegetables provide crisp acidity.' },
      { id: 'bm-cilantro', word: 'cilantro', pos: 'noun', ipa: '/sɪˈlæn.troʊ/', viMeaning: 'rau ngò rí, mùi ta', enDefinition: 'The fresh green leaves of coriander used in cooking.', contextSentence: 'Sprigs of cilantro give the sandwich a fresh aroma.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Why are pickled vegetables added to bánh mì?', options: [{ key: 'A', text: 'To cut through richness with acidity and crunch' }, { key: 'B', text: 'To make the bread soggy' }, { key: 'C', text: 'To replace meat completely' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What rich spread is commonly used inside the loaf?', options: [{ key: 'A', text: 'Strawberry jam' }, { key: 'B', text: 'Pork liver pâté' }, { key: 'C', text: 'Melted cheese only' }], correctKey: 'B' },
    ],
  },
  {
    id: 'banh-mi-sidewalk',
    titleEn: 'Bánh Mì 03: The Sidewalk Cart',
    titleVi: 'Bánh Mì 03: Xe bánh mì vỉa hè',
    summary: 'Practice English phrases for ordering your custom sandwich at a busy Saigon roadside stall.',
    summaryVi: 'Luyện tập các cụm từ tiếng Anh để gọi một ổ bánh mì theo sở thích tại xe đẩy vỉa hè.',
    paragraphs: [
      { orderIndex: 0, enText: 'In Ho Chi Minh City, life pulses around glass display carts perched on street corners. Morning commuters on motorbikes pause briefly to order breakfast without ever turning off their engines.', viText: 'Tại Thành phố Hồ Chí Minh, nhịp sống rộn ràng quanh những chiếc xe tủ kính nhỏ nơi góc phố. Người đi xe máy buổi sáng chỉ dừng lại chốc lát để mua bữa điểm tâm mà không cần tắt máy xe.' },
      { orderIndex: 1, enText: 'When purchasing a sandwich, speed and customization are essential. You can tailor your order easily: “Can I have one bánh mì with extra pâté, but easy on the chili, please?”', viText: 'Khi mua bánh mì, tốc độ và sở thích cá nhân rất quan trọng. Bạn có thể dễ dàng yêu cầu: “Cho tôi một ổ thêm pa-tê, nhưng ít ớt thôi nhé!”' },
      { orderIndex: 2, enText: 'Watching the vendor assemble your loaf in under sixty seconds is a hallmark of Vietnamese street food hospitality.', viText: 'Ngắm nhìn người bán hoàn thành ổ bánh trong chưa đầy sáu mươi giây là nét văn hóa hiếu khách đặc trưng của ẩm thực đường phố Việt Nam.' },
    ],
    vocabularies: [
      { id: 'bm-commuter', word: 'commuter', pos: 'noun', ipa: '/kəˈmjuː.t̬ɚ/', viMeaning: 'người đi làm hàng ngày', enDefinition: 'A person who travels some distance to work on a regular basis.', contextSentence: 'Motorbike commuters grab quick morning meals.' },
      { id: 'bm-customization', word: 'customization', pos: 'noun', ipa: '/ˌkʌs.tə.məˈzeɪ.ʃən/', viMeaning: 'sự tùy biến theo ý thích', enDefinition: 'The modification of something to suit a particular individual.', contextSentence: 'Bánh mì stands allow total customization.' },
      { id: 'bm-hallmark', word: 'hallmark', pos: 'noun', ipa: '/ˈhɑːl.mɑːrk/', viMeaning: 'dấu ấn đặc trưng', enDefinition: 'A distinctive feature or characteristic of something.', contextSentence: 'Rapid assembly is the hallmark of street vendors.' },
    ],
    questions: [
      { orderIndex: 0, question: 'How do many Saigon commuters buy bánh mì on the way to work?', options: [{ key: 'A', text: 'By stopping by roadside carts on their motorbikes' }, { key: 'B', text: 'By booking days in advance at five-star hotels' }, { key: 'C', text: 'Only through postal mail' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What does “easy on the chili” mean in colloquial English?', options: [{ key: 'A', text: 'Add a very small amount of chili' }, { key: 'B', text: 'Add maximum chili' }, { key: 'C', text: 'Cook the chili in water' }], correctKey: 'A' },
    ],
  },
];

export const SAIGON_BANH_MI_ARTICLES: ReaderArticleData[] = chapters.map(chapter => ({
  ...chapter,
  topic: 'Ẩm thực & Đời sống',
  region: 'Hồ Chí Minh',
  level: 'Level 2',
  cefrLevel: 'B1',
  readTime: '3 phút đọc',
  imageUrl,
  vocabMap: Object.fromEntries(chapter.vocabularies.map(item => [item.word.toLowerCase(), item])),
}));

export const SAIGON_BANH_MI_SERIES: ArticleSeries = {
  metadata: SAIGON_BANH_MI_METADATA,
  articles: SAIGON_BANH_MI_ARTICLES,
};
