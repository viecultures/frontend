import { READER_QUIZ_QUESTIONS, VOCAB_DATABASE } from '@/data/readerData';
import type { ReaderArticleData } from '../services/readerApiService';

/** The existing Tết reading, shared by Reading and its practice activities. */
export function getDefaultReaderArticle(level: string): ReaderArticleData {
  const vocabularies = Object.values(VOCAB_DATABASE);
  return {
    id: 'tet-holiday', level,
    titleEn: 'Tết: Renewal, Remembrance and Regional Flavours',
    titleVi: 'Tết: Sự đổi mới, lòng tưởng nhớ và hương vị các vùng miền',
    topic: 'Customs & Festivals', imageUrl: '/images/landing/hoi-an-lanterns.jpg',
    summary: 'A cultural exploration of renewal, ancestral gratitude, and rich regional culinary traditions',
    summaryVi: 'Khám phá văn hóa về sự đổi mới, lòng tri ân tổ tiên và phong vị ẩm thực ba miền',
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Tết Nguyên Đán, often called simply Tết, is described as the most important and sacred holiday in Vietnamese culture. It marks the passage from the old year to the new one, but its meaning goes further. According to the article, Tết stands for family reunion, respect for ancestors, and hope for a better future.',
        viText: 'Tết Nguyên Đán, thường được gọi đơn giản là Tết, được mô tả là ngày lễ quan trọng và thiêng liêng nhất trong văn hóa Việt Nam. Tết đánh dấu sự chuyển giao từ năm cũ sang năm mới, nhưng ý nghĩa của nó còn sâu xa hơn thế. Theo bài viết, Tết tượng trưng cho sự đoàn viên gia đình, lòng kính trọng tổ tiên và hy vọng về một tương lai tốt đẹp hơn.',
      },
      {
        orderIndex: 1,
        enText: 'The article traces Tết back to the ancient agricultural civilization of East Asia, where the cycle of the seasons played a central role in daily life. Tết takes place when winter gives way to spring and plants begin to grow again, which symbolizes a new beginning. A folk legend also says that the festival is a time for descendants to remember their ancestors and pray for a good harvest. Over time, Tết absorbed influences from Chinese culture during the period of Chinese rule, yet it kept its own identity.',
        viText: 'Bài viết truy nguồn gốc của Tết về nền văn minh nông nghiệp lâu đời của người Á Đông, nơi vòng quay của các mùa đóng vai trò trung tâm trong đời sống hằng ngày. Tết diễn ra khi mùa đông nhường chỗ cho mùa xuân và cây cối bắt đầu sinh trưởng trở lại, điều này tượng trưng cho một khởi đầu mới. Một truyền thuyết dân gian cũng kể rằng Tết là dịp để con cháu tưởng nhớ tổ tiên và cầu mong mùa màng bội thu. Theo thời gian, Tết tiếp nhận những ảnh hưởng từ văn hóa Trung Hoa trong thời kỳ Bắc thuộc, nhưng vẫn giữ được bản sắc riêng.',
      },
      {
        orderIndex: 2,
        enText: 'Traditional customs follow three stages. Before Tết, people clean their houses, prepare a five-fruit tray, and wrap bánh chưng or bánh tét together. During the holiday, families hold ancestor worship ceremonies, exchange New Year wishes, give lì xì to children, and visit pagodas. Afterwards, people take part in spring festivals to wish for good luck. Although the way Vietnamese people celebrate has changed, the article argues that the core values of togetherness, gratitude, and hope remain the soul of the holiday.',
        viText: 'Các phong tục truyền thống diễn ra theo ba giai đoạn. Trước Tết, mọi người dọn dẹp nhà cửa, bày mâm ngũ quả và cùng nhau gói bánh chưng hoặc bánh tét. Trong Tết, các gia đình cúng gia tiên, chúc Tết, lì xì cho trẻ em và đi chùa. Sau Tết, mọi người tham gia các lễ hội xuân để cầu may mắn. Dù cách người Việt đón Tết đã thay đổi, bài viết cho rằng những giá trị cốt lõi như sự sum họp, lòng biết ơn và hy vọng vẫn là linh hồn của ngày lễ.',
      },
      {
        orderIndex: 3,
        enText: 'Food carries cultural and spiritual meaning as well. Bánh chưng and bánh tét, which the article calls symbols of earth and sky, express gratitude to ancestors. Bánh chưng is usually made in the North, whereas bánh tét is more common in the Centre and the South. Dưa hành balances rich, protein-heavy dishes, and thịt kho tàu with duck eggs represents fullness and prosperity. Mứt Tết, made from coconut, ginger, or kumquat, stands for sweetness and a good start.',
        viText: 'Ẩm thực cũng mang ý nghĩa văn hóa và tâm linh. Bánh chưng và bánh tét, mà bài viết gọi là biểu tượng của đất và trời, thể hiện lòng biết ơn tổ tiên. Bánh chưng thường được làm ở miền Bắc, trong khi bánh tét phổ biến hơn ở miền Trung và miền Nam. Dưa hành giúp cân bằng các món nhiều đạm, còn thịt kho tàu với trứng vịt thể hiện sự tròn đầy và sung túc. Mứt Tết, làm từ dừa, gừng hoặc quất, biểu trưng cho sự ngọt ngào và một khởi đầu tốt đẹp.',
      },
      {
        orderIndex: 4,
        enText: 'Finally, the atmosphere of Tết differs from region to region. In the North, it is linked to peach blossoms, bánh chưng, and solemn customs, with a busy Tết market and a nostalgic mood. The Central region celebrates in a simpler but equally warm way, with yellow mai flowers, red couplets, and dishes such as nem chua and tré. In the South, Tết feels lively and open, with mai flowers, red watermelons, flower markets, and folk games.',
        viText: 'Cuối cùng, không khí Tết khác nhau giữa các vùng miền. Ở miền Bắc, Tết gắn với hoa đào, bánh chưng và những phong tục trang trọng, với phiên chợ Tết nhộn nhịp và không khí hoài niệm. Miền Trung đón Tết giản dị hơn nhưng không kém phần ấm cúng, với hoa mai vàng, câu đối đỏ và các món như nem chua, tré. Ở miền Nam, Tết sôi động và phóng khoáng, với hoa mai, dưa hấu đỏ, chợ hoa và các trò chơi dân gian.',
      },
    ],
    vocabularies,
    vocabMap: Object.fromEntries(vocabularies.flatMap(word => [[word.word.toLowerCase(), word], [word.id, word]])),
    questions: READER_QUIZ_QUESTIONS.map((question, index) => ({
      id: question.id, orderIndex: index, question: question.question.replace(/^\d+\.\s*/, ''),
      options: question.options.map(option => ({ key: option.value, text: option.label.replace(/^[A-Z]\.\s*/, '') })),
      correctKey: question.correctValue,
    })),
  };
}
