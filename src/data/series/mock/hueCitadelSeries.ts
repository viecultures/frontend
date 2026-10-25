import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { ArticleSeries, SeriesMetadata } from '../types';

const imageUrl = 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80';

export const HUE_SERIES_METADATA: SeriesMetadata = {
  id: 'hue-citadel',
  title: 'Imperial Citadel of Hue',
  titleVi: 'Đại nội Kinh thành Huế',
  theme: 'places',
  provinceId: 'thua-thien-hue',
  region: 'central',
  description: 'Walk through the ancient royal capital on the banks of the Perfume River. Learn how to describe palace gates, courtyards and royal traditions in clear English.',
  imageUrl,
  status: 'draft',
  chapters: [
    {
      id: 'hue-citadel-gate',
      order: 1,
      titleEn: 'Hue 01: The Meridian Gate',
      titleVi: 'Huế 01: Cửa Ngọ Môn',
      summary: 'Explore the grand main entrance where royal ceremonies and decrees were announced.',
      summaryVi: 'Khám phá cổng chính tráng lệ nơi triều đình tổ chức đại lễ và ban bố chiếu chỉ.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'hue-citadel-forbidden-city',
      order: 2,
      titleEn: 'Hue 02: Inside the Forbidden City',
      titleVi: 'Huế 02: Bước vào Tử Cấm Thành',
      summary: 'Discover the quiet residential quarters reserved for the emperor and the royal family.',
      summaryVi: 'Tìm hiểu khu vực sinh sống tôn nghiêm dành riêng cho hoàng đế và hoàng gia.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'hue-citadel-music',
      order: 3,
      titleEn: 'Hue 03: Royal Court Music',
      titleVi: 'Huế 03: Nhã nhạc Cung đình',
      summary: 'Learn about Nhã nhạc, the sophisticated ceremonial music recognized by UNESCO.',
      summaryVi: 'Khám phá Nhã nhạc, loại hình âm nhạc cung đình tinh tế được UNESCO công nhận.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
  ],
};

const chapters = [
  {
    id: 'hue-citadel-gate',
    titleEn: 'Hue 01: The Meridian Gate',
    titleVi: 'Huế 01: Cửa Ngọ Môn',
    summary: 'Explore the grand main entrance where royal ceremonies and decrees were announced.',
    summaryVi: 'Khám phá cổng chính tráng lệ nơi triều đình tổ chức đại lễ và ban bố chiếu chỉ.',
    paragraphs: [
      { orderIndex: 0, enText: 'The Meridian Gate, or Ngọ Môn, is the southern main entrance to the Imperial City of Hue. Built during the reign of Emperor Minh Mạng, it served as the backdrop for significant imperial ceremonies and royal parades.', viText: 'Ngọ Môn là cổng chính ở phía nam của Hoàng thành Huế. Được xây dựng dưới thời vua Minh Mạng, cổng này là bối cảnh cho các đại lễ triều đình và các buổi duyệt binh quan trọng.' },
      { orderIndex: 1, enText: 'On top of the stone fortress stands the Pavilion of Five Phoenixes, constructed from ironwood with curved roof tiles. From here, the emperor watched military drills and proclaimed the national calendar.', viText: 'Phía trên nền đá là Lầu Ngũ Phụng, được dựng bằng gỗ lim với mái ngói uốn cong. Từ đây, hoàng đế chứng kiến các buổi diễn tập quân sự và ban bố lịch triều đình.' },
      { orderIndex: 2, enText: 'You can describe it to a traveller: “Ngọ Môn is not just a gateway; it is a grand architectural monument symbolising imperial authority.”', viText: 'Bạn có thể mô tả với du khách: “Ngọ Môn không chỉ là cánh cổng; đó là công trình kiến trúc kỳ vĩ biểu trưng cho vương quyền triều Nguyễn.”' },
    ],
    vocabularies: [
      { id: 'hue-meridian', word: 'meridian', pos: 'noun', ipa: '/məˈrɪd.i.ən/', viMeaning: 'kinh tuyến, hướng chính nam', enDefinition: 'A circle of constant longitude; the south-facing direction in imperial planning.', contextSentence: 'The southern gate faces the noon meridian sun.' },
      { id: 'hue-pavilion', word: 'pavilion', pos: 'noun', ipa: '/pəˈvɪl.jən/', viMeaning: 'lầu, vọng lâu', enDefinition: 'A light, open building used for shelter or ceremonies.', contextSentence: 'The wooden pavilion overlooks the courtyard.' },
      { id: 'hue-imperial', word: 'imperial', pos: 'adjective', ipa: '/ɪmˈpɪr.i.əl/', viMeaning: 'thuộc về hoàng gia, triều đình', enDefinition: 'Relating to an empire or an emperor.', contextSentence: 'Hue was the imperial capital of Vietnam.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Where is Ngọ Môn located in the Imperial City?', options: [{ key: 'A', text: 'On the southern wall' }, { key: 'B', text: 'Inside the market' }, { key: 'C', text: 'Near the sea' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What stands on top of the stone gateway?', options: [{ key: 'A', text: 'A bell tower' }, { key: 'B', text: 'The Pavilion of Five Phoenixes' }, { key: 'C', text: 'A modern library' }], correctKey: 'B' },
    ],
  },
  {
    id: 'hue-citadel-forbidden-city',
    titleEn: 'Hue 02: Inside the Forbidden City',
    titleVi: 'Huế 02: Bước vào Tử Cấm Thành',
    summary: 'Discover the quiet residential quarters reserved for the emperor and the royal family.',
    summaryVi: 'Tìm hiểu khu vực sinh sống tôn nghiêm dành riêng cho hoàng đế và hoàng gia.',
    paragraphs: [
      { orderIndex: 0, enText: 'Beyond the public court lies the Forbidden Purple City, known in Vietnamese as Tử Cấm Thành. This secluded enclave was dedicated solely to the private life of the royal family.', viText: 'Phía sau khu thiết triều là Tử Cấm Thành. Khuôn viên biệt lập này được dành riêng cho đời sống riêng tư của hoàng gia.' },
      { orderIndex: 1, enText: 'Winding corridors linked serene palaces, peaceful lotus ponds, and study halls where monarchs read poetry and composed essays. Intricate wood carvings and lacquered columns reflect the refined taste of the era.', viText: 'Các hành lang uốn lượn kết nối cung điện tĩnh lặng, hồ sen thanh bình và thư phòng nơi các bậc đế vương ngâm thơ, làm văn. Nghệ thuật chạm khắc gỗ và cột sơn son thếp vàng phản chiếu gu thẩm mỹ tinh tế của thời đại.' },
      { orderIndex: 2, enText: 'When describing this area, say: “Unlike the imposing outer walls, the inner courts were designed for contemplation and quiet harmony.”', viText: 'Khi miêu tả khu vực này, bạn có thể nói: “Khác với vẻ uy nghi của các bức tường thành bên ngoài, các điện bên trong được thiết kế cho sự tĩnh tại và hài hòa.”' },
    ],
    vocabularies: [
      { id: 'hue-secluded', word: 'secluded', pos: 'adjective', ipa: '/sɪˈkluː.dɪd/', viMeaning: 'biệt lập, thanh vắng', enDefinition: 'Quiet, private, and not frequented by large crowds.', contextSentence: 'The royal family lived in a secluded quarter.' },
      { id: 'hue-corridor', word: 'corridor', pos: 'noun', ipa: '/ˈkɔːr.ə.dɔːr/', viMeaning: 'hành lang', enDefinition: 'A long passage in a building from which doors lead into rooms.', contextSentence: 'Red lacquered corridors connect the palaces.' },
      { id: 'hue-contemplation', word: 'contemplation', pos: 'noun', ipa: '/ˌkɑːn.təmˈpleɪ.ʃən/', viMeaning: 'sự chiêm nghiệm, trầm mặc', enDefinition: 'The action of looking thoughtfully at something for a long time.', contextSentence: 'The royal gardens were spaces for contemplation.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Who was permitted to live in the Forbidden Purple City?', options: [{ key: 'A', text: 'All citizens of Hue' }, { key: 'B', text: 'The emperor and the royal family' }, { key: 'C', text: 'Only foreign ambassadors' }], correctKey: 'B' },
      { orderIndex: 1, question: 'What connects the inner palaces and ponds?', options: [{ key: 'A', text: 'Covered corridors' }, { key: 'B', text: 'Modern bridges' }, { key: 'C', text: 'Railway tracks' }], correctKey: 'A' },
    ],
  },
  {
    id: 'hue-citadel-music',
    titleEn: 'Hue 03: Royal Court Music',
    titleVi: 'Huế 03: Nhã nhạc Cung đình',
    summary: 'Learn about Nhã nhạc, the sophisticated ceremonial music recognized by UNESCO.',
    summaryVi: 'Khám phá Nhã nhạc, loại hình âm nhạc cung đình tinh tế được UNESCO công nhận.',
    paragraphs: [
      { orderIndex: 0, enText: 'Nhã nhạc, meaning “elegant music”, refers to the traditional ceremonial music performed at the royal court of Hue. It accompanied ancestral rituals, royal banquets, and state ceremonies.', viText: 'Nhã nhạc, nghĩa là “âm nhạc tao nhã”, dùng để chỉ loại hình âm nhạc nghi lễ truyền thống biểu diễn tại triều đình Huế. Nhã nhạc phục vụ các lễ tế tổ tiên, yến tiệc hoàng gia và nghi lễ quốc gia.' },
      { orderIndex: 1, enText: 'An ensemble typically features traditional instruments such as the moon lute, vertical flute, bronze gongs, and ceremonial drums. Each performance was carefully choreographed to honour the harmony between heaven, earth, and mankind.', viText: 'Một dàn nhạc thường gồm các nhạc cụ truyền thống như đàn nguyệt, sáo tiêu, cồng chiêng đồng và trống nghi lễ. Mỗi tiết mục đều được dàn dựng cẩn trọng để tôn vinh sự hòa hợp giữa trời, đất và con người.' },
      { orderIndex: 2, enText: 'In 2003, UNESCO recognized Nhã nhạc as a Masterpiece of the Oral and Intangible Heritage of Humanity, preserving a unique facet of Vietnamese classical music.', viText: 'Năm 2003, UNESCO đã vinh danh Nhã nhạc là Kiệt tác di sản truyền khẩu và phi vật thể của nhân loại, lưu giữ nét độc đáo của âm nhạc cổ điển Việt Nam.' },
    ],
    vocabularies: [
      { id: 'hue-ceremonial', word: 'ceremonial', pos: 'adjective', ipa: '/ˌser.əˈmoʊ.ni.əl/', viMeaning: 'mang tính nghi lễ', enDefinition: 'Relating to formal religious or public events.', contextSentence: 'Drums played a central role in ceremonial music.' },
      { id: 'hue-ensemble', word: 'ensemble', pos: 'noun', ipa: '/ɑːnˈsɑːm.bəl/', viMeaning: 'dàn nhạc, ban hòa tấu', enDefinition: 'A group of musicians or dancers who perform together.', contextSentence: 'The court ensemble performed at state banquets.' },
      { id: 'hue-intangible', word: 'intangible', pos: 'adjective', ipa: '/ɪnˈtæn.dʒə.bəl/', viMeaning: 'phi vật thể', enDefinition: 'Valuable traditions or qualities that cannot be touched physically.', contextSentence: 'Folklore and music are forms of intangible heritage.' },
    ],
    questions: [
      { orderIndex: 0, question: 'What does the term “Nhã nhạc” literally translate to?', options: [{ key: 'A', text: 'Street songs' }, { key: 'B', text: 'Elegant music' }, { key: 'C', text: 'Lullabies' }], correctKey: 'B' },
      { orderIndex: 1, question: 'When did UNESCO recognize Nhã nhạc as intangible heritage?', options: [{ key: 'A', text: '1975' }, { key: 'B', text: '2003' }, { key: 'C', text: '2020' }], correctKey: 'B' },
    ],
  },
];

export const HUE_SERIES_ARTICLES: ReaderArticleData[] = chapters.map(chapter => ({
  ...chapter,
  topic: 'Địa danh & Lịch sử',
  region: 'Thừa Thiên Huế',
  level: 'Level 2',
  cefrLevel: 'B1',
  readTime: '3 phút đọc',
  imageUrl,
  vocabMap: Object.fromEntries(chapter.vocabularies.map(item => [item.word.toLowerCase(), item])),
}));

export const HUE_SERIES: ArticleSeries = {
  metadata: HUE_SERIES_METADATA,
  articles: HUE_SERIES_ARTICLES,
};
