import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { ALL_SERIES } from '../src/data/series/seriesRegistry';
import { getDefaultReaderArticle } from '../src/features/reader/data/defaultReaderArticle';
import { readerApiService } from '../src/features/reader/services/readerApiService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, '../../backend/src/main/resources/seed-data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Export Learning Journeys
const journeys = ALL_SERIES.map(series => {
  const meta = series.metadata;
  return {
    id: meta.id,
    titleEn: meta.title,
    titleVi: meta.titleVi,
    theme: meta.theme || 'cuisine',
    provinceId: meta.provinceId,
    region: meta.region || 'north',
    description: meta.description || '',
    imageUrl: meta.imageUrl || '',
    status: meta.status || 'published',
  };
});

// 2. Export Reading Posts (Journey Chapters + Standalone Posts)
const posts: any[] = [];

// A. Journey Chapters
ALL_SERIES.forEach(series => {
  const meta = series.metadata;
  series.articles.forEach((article, index) => {
    const chapterOrder = index + 1;
    const level = (article.cefrLevel || article.level || 'B1')
      .replace(/Level\s*1/i, 'A2')
      .replace(/Level\s*2/i, 'B1')
      .replace(/Level\s*3/i, 'B2')
      .toUpperCase();

    const paragraphs = (article.paragraphs || []).map((p, pIdx) => ({
      orderIndex: p.orderIndex ?? pIdx,
      enText: p.enText,
      viText: p.viText,
      audioTimestampStart: p.audioTimestampStart ?? null,
      audioTimestampEnd: p.audioTimestampEnd ?? null,
    }));

    const vocabularies = (article.vocabularies || []).map(v => ({
      word: v.word,
      ipa: v.ipa || null,
      pos: v.pos || null,
      viMeaning: v.viMeaning,
      contextSentence: v.contextSentence || null,
      audioUrl: v.audioUrl || null,
      level: 'B1',
      usageNote: v.enDefinition || null,
    }));

    const questions = (article.questions || []).map((q, qIdx) => ({
      orderIndex: q.orderIndex ?? qIdx,
      question: q.question,
      options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
      correctKey: q.correctKey,
      explanation: q.explanation || null,
    }));

    posts.push({
      id: article.id,
      journeyId: meta.id,
      chapterOrder,
      provinceId: meta.provinceId,
      topicGroup: meta.id,
      titleEn: article.titleEn,
      titleVi: article.titleVi,
      topic: meta.theme || 'cuisine',
      region: meta.region || 'north',
      imageUrl: article.imageUrl || meta.imageUrl,
      wordCount: article.wordCount || 200,
      summary: article.summary || '',
      contentEn: paragraphs.map(p => p.enText).join('\n\n'),
      contentVi: paragraphs.map(p => p.viText).join('\n\n'),
      shadowingAudioUrl: article.shadowingAudioUrl || null,
      level: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level) ? level : 'B1',
      readTime: article.readTime || '3 min read',
      featured: false,
      paragraphs,
      vocabularies,
      questions,
    });
  });
});

// B. Standalone Posts (tet-holiday, tet-festivities, dong-ho-paintings, ao-dai-vietnam, etc.)
const tetArticle = getDefaultReaderArticle('Level 2');
const tetParagraphs = tetArticle.paragraphs.map((p, pIdx) => ({
  orderIndex: p.orderIndex ?? pIdx,
  enText: p.enText,
  viText: p.viText,
  audioTimestampStart: p.audioTimestampStart ?? null,
  audioTimestampEnd: p.audioTimestampEnd ?? null,
}));
const tetVocabularies = tetArticle.vocabularies.map(v => ({
  word: v.word,
  ipa: v.ipa || null,
  pos: v.pos || null,
  viMeaning: v.viMeaning,
  contextSentence: v.contextSentence || null,
  audioUrl: v.audioUrl || null,
  level: 'B1',
  usageNote: v.enDefinition || null,
}));
const tetQuestions = (tetArticle.questions || []).map((q, qIdx) => ({
  orderIndex: q.orderIndex ?? qIdx,
  question: q.question,
  options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
  correctKey: q.correctKey,
  explanation: q.explanation || null,
}));

// Standalone: tet-holiday
posts.push({
  id: 'tet-holiday',
  journeyId: null,
  chapterOrder: null,
  provinceId: 'ha-noi',
  topicGroup: 'tet-tradition',
  titleEn: tetArticle.titleEn,
  titleVi: tetArticle.titleVi,
  topic: 'festivals',
  region: 'Việt Nam',
  imageUrl: tetArticle.imageUrl || '/images/landing/hoi-an-lanterns.webp',
  wordCount: 450,
  summary: tetArticle.summary || '',
  contentEn: tetParagraphs.map(p => p.enText).join('\n\n'),
  contentVi: tetParagraphs.map(p => p.viText).join('\n\n'),
  shadowingAudioUrl: null,
  level: 'B1',
  readTime: '5 phút đọc',
  featured: true,
  paragraphs: tetParagraphs,
  vocabularies: tetVocabularies,
  questions: tetQuestions,
});

// Standalone: tet-festivities (alias/matching catalog)
posts.push({
  id: 'tet-festivities',
  journeyId: null,
  chapterOrder: null,
  provinceId: 'ha-noi',
  topicGroup: 'tet-tradition',
  titleEn: tetArticle.titleEn,
  titleVi: tetArticle.titleVi,
  topic: 'festivals',
  region: 'Việt Nam',
  imageUrl: tetArticle.imageUrl || '/images/landing/hoi-an-lanterns.webp',
  wordCount: 450,
  summary: tetArticle.summary || '',
  contentEn: tetParagraphs.map(p => p.enText).join('\n\n'),
  contentVi: tetParagraphs.map(p => p.viText).join('\n\n'),
  shadowingAudioUrl: null,
  level: 'B1',
  readTime: '5 phút đọc',
  featured: true,
  paragraphs: tetParagraphs,
  vocabularies: tetVocabularies,
  questions: tetQuestions,
});

// Standalone: dong-ho-paintings
posts.push({
  id: 'dong-ho-paintings',
  journeyId: null,
  chapterOrder: null,
  provinceId: 'bac-ninh',
  topicGroup: 'dong-ho-folk-art',
  titleEn: 'Dong Ho Folk Woodcut Paintings: The Soul of Vietnamese Traditional Art',
  titleVi: 'Tranh Dân Gian Đông Hồ: Hồn Cốt Mỹ Thuật Mộc Bản Dân Tộc',
  topic: 'crafts',
  region: 'north',
  imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  wordCount: 250,
  summary: 'Nét khắc than củi đanh gọn, màu khoáng từ điệp sò, hoa hòe và tro lá tre tạo nên bức tranh dân gian tràn đầy sức sống.',
  contentEn: 'Originating from Bac Ninh province, Dong Ho folk woodcut paintings embody the quintessence of Vietnamese rural philosophy and cultural aesthetics. Each artwork is printed manually on Dzo paper coated with a shimmering layer of crushed scallop shells known as Diep paper.\n\nThe artisans rely entirely on natural mineral pigments: soot from burned bamboo leaves for deep black outlines, gardenia seeds and sophora flowers for radiant yellow, and verdigris rust for antique jade green.',
  contentVi: 'Bắt nguồn từ làng tranh Đông Hồ tỉnh Bắc Ninh, tranh khắc gỗ dân gian là hiện thân của tinh hoa triết lý nông thôn và mỹ thuật truyền thống Việt Nam. Mỗi bức tranh được in thủ công trên giấy Dó quét lớp bột vỏ sò điệp lấp lánh.\n\nCác nghệ nhân hoàn toàn sử dụng phẩm màu tự nhiên từ khoáng vật: than tro lá tre cho nét viền đen than đanh gọn, hạt dành dành và hoa hòe cho sắc vàng rực rỡ, và gỉ đồng cho sắc xanh ngọc cổ kính.',
  shadowingAudioUrl: null,
  level: 'B2',
  readTime: '4 phút',
  featured: false,
  paragraphs: [
    {
      orderIndex: 0,
      enText: 'Originating from Bac Ninh province, Dong Ho folk woodcut paintings embody the quintessence of Vietnamese rural philosophy and cultural aesthetics. Each artwork is printed manually on Dzo paper coated with a shimmering layer of crushed scallop shells known as Diep paper.',
      viText: 'Bắt nguồn từ làng tranh Đông Hồ tỉnh Bắc Ninh, tranh khắc gỗ dân gian là hiện thân của tinh hoa triết lý nông thôn và mỹ thuật truyền thống Việt Nam. Mỗi bức tranh được in thủ công trên giấy Dó quét lớp bột vỏ sò điệp lấp lánh.',
      audioTimestampStart: 0.0,
      audioTimestampEnd: 12.5,
    },
    {
      orderIndex: 1,
      enText: 'The artisans rely entirely on natural mineral pigments: soot from burned bamboo leaves for deep black outlines, gardenia seeds and sophora flowers for radiant yellow, and verdigris rust for antique jade green.',
      viText: 'Các nghệ nhân hoàn toàn sử dụng phẩm màu tự nhiên từ khoáng vật: than tro lá tre cho nét viền đen than đanh gọn, hạt dành dành và hoa hòe cho sắc vàng rực rỡ, và gỉ đồng cho sắc xanh ngọc cổ kính.',
      audioTimestampStart: 12.5,
      audioTimestampEnd: 25.0,
    },
  ],
  vocabularies: [
    {
      word: 'quintessence',
      ipa: '/kwɪnˈtesns/',
      pos: 'noun',
      viMeaning: 'Tinh hoa, phần tinh túy nhất của một nền văn hóa',
      contextSentence: 'Dong Ho folk woodcut paintings embody the quintessence of Vietnamese rural philosophy.',
      audioUrl: null,
      level: 'C1',
      usageNote: 'Thường dùng trong văn viết học thuật: the quintessence of Vietnamese culture.',
    },
    {
      word: 'aesthetics',
      ipa: '/iːsˈθetɪks/',
      pos: 'noun',
      viMeaning: 'Mỹ học, tính thẩm mỹ',
      contextSentence: 'Embody the quintessence of Vietnamese rural philosophy and cultural aesthetics.',
      audioUrl: null,
      level: 'B2',
      usageNote: 'Thuộc tính cảm thụ vẻ đẹp nghệ thuật.',
    },
  ],
  questions: [
    {
      orderIndex: 0,
      question: 'What special paper is used for Dong Ho paintings?',
      options: JSON.stringify([
        { key: 'A', text: 'Diep paper coated with crushed scallop shells' },
        { key: 'B', text: 'Plastic coated paper' },
        { key: 'C', text: 'Newspaper' },
      ]),
      correctKey: 'A',
      explanation: 'Dong Ho paintings are printed manually on Dzo paper coated with crushed scallop shells (Diep paper).',
    },
  ],
});

// Standalone: ao-dai-vietnam
posts.push({
  id: 'ao-dai-vietnam',
  journeyId: null,
  chapterOrder: null,
  provinceId: 'ha-noi',
  topicGroup: 'ao-dai-tradition',
  titleEn: 'The Timeless Grace of the Vietnamese Ao Dai',
  titleVi: 'Nét Duyên Dáng Vượt Thời Gian Của Chiếc Áo Dài Việt Nam',
  topic: 'traditions',
  region: 'Việt Nam',
  imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
  wordCount: 220,
  summary: 'Biểu tượng của nét đẹp duyên dáng, kín đáo nhưng vẫn tôn vinh sự thanh lịch của người phụ nữ Việt Nam qua từng thời kỳ lịch sử.',
  contentEn: 'The Ao Dai is more than just a traditional garment; it is an enduring cultural symbol of Vietnamese elegance, modesty, and grace.\n\nWith its split tunic worn over silk trousers, the dress blends ancient modesty with modern sophistication, making it celebrated across the world.',
  contentVi: 'Áo Dài không chỉ đơn thuần là một bộ trang phục truyền thống; đó là một biểu tượng văn hóa bất hủ về nét thanh lịch, kín đáo và duyên dáng của người Việt.\n\nVới tà áo xẻ tà thướt tha mặc cùng quần lụa, chiếc áo kết hợp sự kín đáo cổ điển cùng vẻ đẹp tinh tế hiện đại, được tôn vinh trên toàn thế giới.',
  shadowingAudioUrl: null,
  level: 'B1',
  readTime: '3 phút',
  featured: false,
  paragraphs: [
    {
      orderIndex: 0,
      enText: 'The Ao Dai is more than just a traditional garment; it is an enduring cultural symbol of Vietnamese elegance, modesty, and grace.',
      viText: 'Áo Dài không chỉ đơn thuần là một bộ trang phục truyền thống; đó là một biểu tượng văn hóa bất hủ về nét thanh lịch, kín đáo và duyên dáng của người Việt.',
      audioTimestampStart: 0.0,
      audioTimestampEnd: 8.0,
    },
    {
      orderIndex: 1,
      enText: 'With its split tunic worn over silk trousers, the dress blends ancient modesty with modern sophistication, making it celebrated across the world.',
      viText: 'Với tà áo xẻ tà thướt tha mặc cùng quần lụa, chiếc áo kết hợp sự kín đáo cổ điển cùng vẻ đẹp tinh tế hiện đại, được tôn vinh trên toàn thế giới.',
      audioTimestampStart: 8.0,
      audioTimestampEnd: 18.0,
    },
  ],
  vocabularies: [
    {
      word: 'enduring',
      ipa: '/ɪnˈdjʊərɪŋ/',
      pos: 'adjective',
      viMeaning: 'Bền bỉ, lâu dài, trường tồn',
      contextSentence: 'It is an enduring cultural symbol of Vietnamese elegance.',
      audioUrl: null,
      level: 'B2',
      usageNote: 'Thường dùng để mô tả truyền thống hoặc giá trị bền vững.',
    },
    {
      word: 'sophistication',
      ipa: '/səˌfɪstɪˈkeɪʃn/',
      pos: 'noun',
      viMeaning: 'Sự tinh tế, sự trang nhã hiện đại',
      contextSentence: 'The dress blends ancient modesty with modern sophistication.',
      audioUrl: null,
      level: 'B2',
      usageNote: 'Miêu tả phong cách tao nhã, có chiều sâu.',
    },
  ],
  questions: [
    {
      orderIndex: 0,
      question: 'What does the Ao Dai symbolize in Vietnamese culture?',
      options: JSON.stringify([
        { key: 'A', text: 'Vietnamese elegance, modesty, and grace' },
        { key: 'B', text: 'Martial arts discipline' },
        { key: 'C', text: 'Urban industrialization' },
      ]),
      correctKey: 'A',
      explanation: 'The Ao Dai is an enduring cultural symbol of Vietnamese elegance, modesty, and grace.',
    },
  ],
});

// Additional standalone lessons from discovery:
const discoveryStandaloneIds = [
  'nem-ran-spring-rolls',
  'gong-culture-tay-nguyen',
  'non-la-culture',
  'quan-ho-singing',
  'floating-markets-mekong',
  'my-son-sanctuary',
  'ha-long-bay',
];

discoveryStandaloneIds.forEach(id => {
  const art = readerApiService.getLocalArticle(id);
  if (art) {
    const paragraphs = (art.paragraphs || []).map((p, pIdx) => ({
      orderIndex: p.orderIndex ?? pIdx,
      enText: p.enText,
      viText: p.viText,
      audioTimestampStart: null,
      audioTimestampEnd: null,
    }));

    const vocabularies = (art.vocabularies || []).map(v => ({
      word: v.word,
      ipa: v.ipa || null,
      pos: v.pos || null,
      viMeaning: v.viMeaning,
      contextSentence: v.contextSentence || null,
      audioUrl: null,
      level: 'B1',
      usageNote: v.enDefinition || null,
    }));

    posts.push({
      id: art.id,
      journeyId: null,
      chapterOrder: null,
      provinceId: id === 'nem-ran-spring-rolls' ? 'ha-noi' :
                  id === 'gong-culture-tay-nguyen' ? 'dak-lak' :
                  id === 'non-la-culture' ? 'hue' :
                  id === 'quan-ho-singing' ? 'bac-ninh' :
                  id === 'floating-markets-mekong' ? 'can-tho' :
                  id === 'my-son-sanctuary' ? 'da-nang' :
                  id === 'ha-long-bay' ? 'quang-ninh' : 'ha-noi',
      topicGroup: id,
      titleEn: art.titleEn,
      titleVi: art.titleVi,
      topic: art.topic || 'Cuisine',
      region: art.region || 'Việt Nam',
      imageUrl: art.imageUrl || '',
      wordCount: art.wordCount || 300,
      summary: art.summary || '',
      contentEn: paragraphs.map(p => p.enText).join('\n\n'),
      contentVi: paragraphs.map(p => p.viText).join('\n\n'),
      shadowingAudioUrl: null,
      level: 'B1',
      readTime: art.readTime || '5 min read',
      featured: false,
      paragraphs,
      vocabularies,
      questions: [
        {
          orderIndex: 0,
          question: `What is the cultural significance of ${art.titleEn}?`,
          options: JSON.stringify([
            { key: 'A', text: `It represents traditional Vietnamese cultural identity and values.` },
            { key: 'B', text: `It is an imported fast food concept.` },
            { key: 'C', text: `It was only celebrated in recent decades.` },
          ]),
          correctKey: 'A',
          explanation: `Cultural heritage reflects the enduring spirit and identity of Vietnam.`,
        },
      ],
    });
  }
});

// Write to JSON files
const journeysPath = path.join(outputDir, 'learning-journeys.json');
const postsPath = path.join(outputDir, 'reading-posts.json');

fs.writeFileSync(journeysPath, JSON.stringify(journeys, null, 2), 'utf-8');
fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');

console.log(`Generated ${journeys.length} learning journeys -> ${journeysPath}`);
console.log(`Generated ${posts.length} reading posts -> ${postsPath}`);
