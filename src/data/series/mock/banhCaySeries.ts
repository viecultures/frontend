import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { ArticleSeries, SeriesMetadata } from '../types';

const imageUrl = '/images/series/banh-cay-thai-binh.jpg';

export const BANH_CAY_SERIES_METADATA: SeriesMetadata = {
  id: 'banh-cay-thai-binh',
  title: 'Bánh Cáy in Thái Bình',
  titleVi: 'Bánh Cáy Làng Nguyễn',
  theme: 'cuisine',
  provinceId: 'hung-yen',
  region: 'north',
  description: 'Explore Lady Nguyễn Thị Tần’s royal tribute, natural coloring with gac and gardenia, and the comforting winter ritual of hot tea with crispy sweet bánh cáy.',
  imageUrl,
  status: 'published',
  chapters: [
    {
      id: 'banh-cay-royal-gift',
      order: 1,
      titleEn: 'Bánh Cáy 01: The Royal Gift from Làng Nguyễn',
      titleVi: 'Bánh Cáy 01: Thức Quà Tiến Vua Của Làng Nguyễn',
      summary: 'Discover the 18th-century origin story of Lady Nguyễn Thị Tần and how simple village harvest became a royal delicacy.',
      summaryVi: 'Tìm hiểu nguồn gốc thế kỷ 18 của Nữ quan Nguyễn Thị Tần và cách nông sản bình dị trở thành thức quà tiến vua trứ danh.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'banh-cay-natural-craft',
      order: 2,
      titleEn: 'Bánh Cáy 02: Natural Colors and Craftsmanship in Every Cake',
      titleVi: 'Bánh Cáy 02: Màu Sắc Tự Nhiên Và Bàn Tay Khéo Léo Trong Từng Chiếc Bánh',
      summary: 'Learn how artisans dye puffed rice with gac fruit and gardenia seeds, folding in ginger malt and candied lard cubes.',
      summaryVi: 'Khám phá bí quyết nhuộm xôi nổ bằng gấc và hạt dành dành, hòa quyện mạch nha gừng cay ấm và mỡ khổ ướp đường.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'banh-cay-tea-pairing',
      order: 3,
      titleEn: 'Bánh Cáy 03: Bánh Cáy and Green Tea: A Perfect Winter Pairing',
      titleVi: 'Bánh Cáy 03: Bánh Cáy Và Trà Xanh: Cặp Đôi Hoàn Hảo Cho Ngày Đông',
      summary: 'Experience the northern winter ritual of pairing rich, ginger-spiced bánh cáy with bitter hot green tea on rainy afternoons.',
      summaryVi: 'Trải nghiệm nét đẹp ẩm thực ngày đông xứ Bắc khi nhâm nhi bánh cáy cay ấm nồng bên chén trà xanh chát ngọt dịu.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
  ],
};

const chapters = [
  {
    id: 'banh-cay-royal-gift',
    titleEn: 'Bánh Cáy 01: The Royal Gift from Làng Nguyễn',
    titleVi: 'Bánh Cáy 01: Thức Quà Tiến Vua Của Làng Nguyễn',
    summary: 'Discover the 18th-century origin story of Lady Nguyễn Thị Tần and how simple village harvest became a royal delicacy.',
    summaryVi: 'Tìm hiểu nguồn gốc thế kỷ 18 của Nữ quan Nguyễn Thị Tần và cách nông sản bình dị trở thành thức quà tiến vua trứ danh.',
    wordCount: 184,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Bánh cáy is a celebrated traditional sweet from Làng Nguyễn in Thái Bình Province. The origins of this unique cake date back to the early 18th century during the Lê Dynasty. It was created by a talented woman named Nguyễn Thị Tần, who served as a royal teacher in the royal court.',
        viText: 'Bánh cáy là món bánh ngọt truyền thống trứ danh của làng Nguyễn thuộc tỉnh Thái Bình. Nguồn gốc của món bánh độc đáo này bắt đầu từ đầu thế kỷ 18 dưới thời nhà Lê. Bánh do một người phụ nữ tài hoa tên là Nguyễn Thị Tần sáng tạo ra khi bà đang làm nữ quan dạy học trong cung đình.',
      },
      {
        orderIndex: 1,
        enText: 'Using simple agricultural products from her hometown, she invented a delicate pastry to offer to the king. When the king tasted the cake, he was deeply impressed by its pleasant sweetness, gentle spice, and beautiful yellow and red flecks that resembled the eggs of a small freshwater crab, locally called con cáy. Because of this unique appearance, the king named it bánh cáy.',
        viText: 'Tận dụng những nông sản bình dị của quê nhà, bà đã làm ra thứ bánh thanh nhã để dâng tiến lên nhà vua. Khi thưởng thức, nhà vua vô cùng ấn tượng trước vị ngọt thanh, chút cay dịu cùng những đốm màu vàng, đỏ lấm tấm tựa như trứng của con cáy biển nhỏ. Chính vì diện mạo đặc biệt này, nhà vua đã ban tên cho món bánh là bánh cáy.',
      },
      {
        orderIndex: 2,
        enText: 'After retiring, Lady Tần returned to Làng Nguyễn and taught the villagers how to make the cake. The craft has been preserved through generations, turning the village into a bustling confectionery center in northern Vietnam.',
        viText: 'Sau khi cáo quan về quê, bà Tần đã trở lại làng Nguyễn và truyền dạy nghề làm bánh cho dân làng. Nghề thủ công này được gìn giữ qua nhiều thế hệ, biến ngôi làng thành một trung tâm sản xuất bánh kẹo nhộn nhịp ở miền Bắc.',
      },
      {
        orderIndex: 3,
        enText: 'Today, bánh cáy is not just a daily treat, but an essential offering on ancestral altars during Tết. Lady Tần’s legacy lives on, reminding locals of a woman who elevated humble farm produce into a royal masterpiece.',
        viText: 'Ngày nay, bánh cáy không chỉ là món quà vặt thường nhật mà còn là lễ vật không thể thiếu trên bàn thờ tổ tiên mỗi dịp Tết. Di sản của bà Tần vẫn sống mãi, nhắc nhở người dân về người phụ nữ đã nâng tầm nông sản bình dị thành một kiệt tác cung đình.',
      },
    ],
    vocabularies: [
      { id: 'bcl-celebrated', word: 'celebrated', pos: 'adjective', ipa: '/ˈsel.ə.breɪ.t̬ɪd/', viMeaning: 'trứ danh, nổi tiếng', enDefinition: 'Widely known, respected, and praised by many people.', contextSentence: 'Bánh cáy is a celebrated traditional sweet from Làng Nguyễn.' },
      { id: 'bcl-origin', word: 'origin', pos: 'noun', ipa: '/ˈɔːr.ə.dʒɪn/', viMeaning: 'nguồn gốc', enDefinition: 'The historical beginning or source from which something develops.', contextSentence: 'The origins of this unique cake date back to the early 18th century.' },
      { id: 'bcl-delicate-pastry', word: 'delicate pastry', pos: 'noun phrase', ipa: '/ˈdel.ə.kət ˈpeɪ.stri/', viMeaning: 'thứ bánh ngọt thanh nhã, tinh tế', enDefinition: 'A refined, subtly flavored sweet treat crafted with artisanal care.', contextSentence: 'She invented a delicate pastry to offer to the king.' },
      { id: 'bcl-fleck', word: 'fleck', pos: 'noun', ipa: '/flek/', viMeaning: 'đốm màu, vết lấm tấm', enDefinition: 'A very small speck, dot, or streak of color on a surface.', contextSentence: 'The yellow and red flecks resembled crab eggs.' },
      { id: 'bcl-resemble', word: 'resemble', pos: 'verb', ipa: '/rɪˈzem.bəl/', viMeaning: 'giống với', enDefinition: 'To be similar to or look like someone or something else.', contextSentence: 'The colorful puffed rice flecks resembled small crab eggs.' },
      { id: 'bcl-retire', word: 'retire', pos: 'verb', ipa: '/rɪˈtaɪr/', viMeaning: 'nghỉ hưu, cáo quan về quê', enDefinition: 'To leave one’s official royal post to lead a quiet rural life.', contextSentence: 'After retiring, Lady Tần returned to her hometown village.' },
      { id: 'bcl-bustling-center', word: 'bustling center', pos: 'noun phrase', ipa: '/ˈbʌs.lɪŋ ˈsen.t̬ɚ/', viMeaning: 'trung tâm nhộn nhịp, sầm uất', enDefinition: 'A lively, energetic town hub where trade and crafts flourish.', contextSentence: 'Làng Nguyễn became a bustling confectionery center.' },
      { id: 'bcl-confectionery', word: 'confectionery', pos: 'noun', ipa: '/kənˈfek.ʃən.er.i/', viMeaning: 'nghề làm bánh kẹo, đồ ngọt', enDefinition: 'The craft, business, or category of sweet foods and traditional candies.', contextSentence: 'The village became a renowned northern confectionery hub.' },
      { id: 'bcl-ancestral-altar', word: 'ancestral altar', pos: 'noun phrase', ipa: '/ænˈses.trəl ˈɑːl.tɚ/', viMeaning: 'bàn thờ tổ tiên', enDefinition: 'A holy household shrine dedicated to remembering departed forebears.', contextSentence: 'Bánh cáy is an essential offering on ancestral altars during Tết.' },
      { id: 'bcl-elevate', word: 'elevate', pos: 'verb', ipa: '/ˈel.ə.veɪt/', viMeaning: 'nâng tầm', enDefinition: 'To lift something to a much higher, noble, or celebrated status.', contextSentence: 'She elevated humble farm produce into a royal masterpiece.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Who created Bánh Cáy in the early 18th century during the Lê Dynasty?', options: [{ key: 'A', text: 'Lady Nguyễn Thị Tần, a royal teacher from Làng Nguyễn' }, { key: 'B', text: 'French colonial bakers' }, { key: 'C', text: 'Royal cooks from the ancient capital of Huế' }], correctKey: 'A' },
      { orderIndex: 1, question: 'Why did the king name this sweet treat "Bánh Cáy"?', options: [{ key: 'A', text: 'Because its yellow and red flecks looked like the eggs of a small crab called con cáy' }, { key: 'B', text: 'Because it was made using saltwater crab meat' }, { key: 'C', text: 'Because it was caught by fishermen during high tide' }], correctKey: 'A' },
    ],
  },
  {
    id: 'banh-cay-natural-craft',
    titleEn: 'Bánh Cáy 02: Natural Colors and Craftsmanship in Every Cake',
    titleVi: 'Bánh Cáy 02: Màu Sắc Tự Nhiên Và Bàn Tay Khéo Léo Trong Từng Chiếc Bánh',
    summary: 'Learn how artisans dye puffed rice with gac fruit and gardenia seeds, folding in ginger malt and candied lard cubes.',
    summaryVi: 'Khám phá bí quyết nhuộm xôi nổ bằng gấc và hạt dành dành, hòa quyện mạch nha gừng cay ấm và mỡ khổ ướp đường.',
    wordCount: 189,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Making authentic bánh cáy is a complex craft that requires patience, skill, and entirely natural ingredients. Despite its name, the modern cake does not contain any actual crab meat. Instead, it gets its name and color palette from plants, fruits, and glutinous rice grown in the northern countryside.',
        viText: 'Làm bánh cáy chuẩn vị là một nghề thủ công phức tạp đòi hỏi sự kiên nhẫn, hoa tay và nguyên liệu hoàn toàn từ tự nhiên. Dù mang tên gọi này, chiếc bánh ngày nay không chứa thịt con cáy thật. Thay vào đó, nó lấy tên và dải màu sắc từ các loại cây trái và gạo nếp trồng ở làng quê miền Bắc.',
      },
      {
        orderIndex: 1,
        enText: 'The process begins by preparing two colorful types of dough. Artisans mix steamed sticky rice with bright red gac fruit to create a vibrant red color, and with gardenia seeds to produce a sunny yellow tone. These dough sheets are dried, sliced into tiny strips, and then fried in hot lard until they puff up into light, crunchy pieces.',
        viText: 'Quy trình bắt đầu bằng việc chuẩn bị hai loại khối bột màu sắc. Các nghệ nhân trộn xôi nếp với quả gấc đỏ tươi để tạo màu đỏ rực rỡ, và với hạt dành dành để lấy sắc vàng ươm. Những tảng bột này được phơi khô, thái thành từng sợi nhỏ rồi đem chiên trong mỡ lợn nóng cho đến khi nở phồng thành những hạt xôi nổ nhẹ xốp, giòn tan.',
      },
      {
        orderIndex: 2,
        enText: 'Next, puffed rice, roasted peanuts, and sesame seeds are prepared. Cooks melt sticky rice malt and sugarcane sugar in a large pan over low heat, adding fresh ginger juice and a little citrus peel for warmth and fragrance.',
        viText: 'Tiếp theo, bỏng nếp, lạc rang và vừng được chuẩn bị sẵn. Người thợ đun chảy mạch nha gạo nếp và đường mía trong chảo lớn trên lửa nhỏ, hòa thêm nước cốt gừng tươi và một chút vỏ quýt để tạo độ ấm nóng và mùi thơm.',
      },
      {
        orderIndex: 3,
        enText: 'When the sugar syrup is ready, all the fried rice strips, peanuts, and candied lard cubes are quickly folded in. Artisans press the warm mixture firmly into wooden molds and slice it into neat rectangles. The result is a chewy, crunchy treat bursting with natural aromas.',
        viText: 'Khi nước đường đã tới, toàn bộ sợi xôi nổ, lạc và mỡ khổ ướp đường được đảo nhanh tay cho ngấm đều. Nghệ nhân dùng lực lèn chặt hỗn hợp còn nóng vào khuôn gỗ rồi cắt thành từng thanh chữ nhật ngay ngắn. Thành phẩm là món quà dẻo dai, giòn xốp và dậy mùi hương thơm tự nhiên.',
      },
    ],
    vocabularies: [
      { id: 'bcl-color-palette', word: 'color palette', pos: 'noun phrase', ipa: '/ˈkʌl.ɚ ˈpæl.ət/', viMeaning: 'dải màu sắc, bảng màu', enDefinition: 'The chosen spectrum or selection of harmonious colors in a creation.', contextSentence: 'It gets its vibrant color palette from countryside fruits and seeds.' },
      { id: 'bcl-glutinous-rice', word: 'glutinous rice', pos: 'noun phrase', ipa: '/ˈɡluː.tən.əs raɪs/', viMeaning: 'gạo nếp', enDefinition: 'A sweet, sticky type of rice rich in starch, ideal for traditional desserts.', contextSentence: 'The cake is prepared using premium glutinous rice.' },
      { id: 'bcl-gac-fruit', word: 'gac fruit', pos: 'noun phrase', ipa: '/ɡæk fruːt/', viMeaning: 'quả gấc', enDefinition: 'A tropical spiky fruit whose aril yields a rich, festive red color.', contextSentence: 'Artisans blend sticky rice with gac fruit for bright red strips.' },
      { id: 'bcl-gardenia-seeds', word: 'gardenia seeds', pos: 'noun phrase', ipa: '/ɡɑːrˈdiː.ni.ə siːdz/', viMeaning: 'hạt dành dành', enDefinition: 'Botanical dried seeds steeped to provide radiant, warm yellow tones.', contextSentence: 'Gardenia seeds produce a sunny yellow tone in the dough.' },
      { id: 'bcl-puff-up', word: 'puff up', pos: 'phrasal verb', ipa: '/pʌf ʌp/', viMeaning: 'nở phồng lên', enDefinition: 'To expand rapidly into an airy, crisp state when dropped in hot oil.', contextSentence: 'Rice strips puff up into light, crunchy pieces in hot lard.' },
      { id: 'bcl-sticky-rice-malt', word: 'sticky rice malt', pos: 'noun phrase', ipa: '/ˈstɪk.i raɪs mɑːlt/', viMeaning: 'mạch nha làm từ mầm lúa nếp', enDefinition: 'A thick, golden syrup made from sprouted glutinous grains.', contextSentence: 'Cooks gently simmer sticky rice malt with sugarcane sugar.' },
      { id: 'bcl-citrus-peel', word: 'citrus peel', pos: 'noun phrase', ipa: '/ˈsɪt.rəs piːl/', viMeaning: 'vỏ cam, vỏ quýt', enDefinition: 'The fragrant zest of citrus fruits adding bright essential oils.', contextSentence: 'A little citrus peel is added for zesty warmth and aroma.' },
      { id: 'bcl-fold-in', word: 'fold in', pos: 'phrasal verb', ipa: '/foʊld ɪn/', viMeaning: 'trộn đều, đảo nhẹ tay', enDefinition: 'To gently blend ingredients into a warm syrup without crushing them.', contextSentence: 'All the puffed rice and peanuts are quickly folded in.' },
      { id: 'bcl-mold', word: 'mold', pos: 'noun', ipa: '/moʊld/', viMeaning: 'khuôn đúc', enDefinition: 'A shaped wooden casing used to compact and form cakes.', contextSentence: 'Artisans press the warm mixture firmly into wooden molds.' },
      { id: 'bcl-candied-lard', word: 'candied lard', pos: 'noun phrase', ipa: '/ˈkæn.diːd lɑːrd/', viMeaning: 'mỡ khổ ướp đường', enDefinition: 'Finely cubed pork fat cured with crystal sugar until clear and chewy.', contextSentence: 'Candied lard cubes give the cake moisture and savory depth.' },
    ],
    questions: [
      { orderIndex: 0, question: 'What provides the natural red and yellow colors in Bánh Cáy?', options: [{ key: 'A', text: 'Fresh gac fruit and steeped gardenia seeds' }, { key: 'B', text: 'Chemical food coloring powders' }, { key: 'C', text: 'Imported saffron and beet root' }], correctKey: 'A' },
      { orderIndex: 1, question: 'How do artisans give the cake its traditional rectangular shape?', options: [{ key: 'A', text: 'By firmly pressing the warm mixture into wooden molds and slicing it' }, { key: 'B', text: 'By baking it in individual metal baking pans' }, { key: 'C', text: 'By hand-rolling each cake like a sushi roll' }], correctKey: 'A' },
    ],
  },
  {
    id: 'banh-cay-tea-pairing',
    titleEn: 'Bánh Cáy 03: Bánh Cáy and Green Tea: A Perfect Winter Pairing',
    titleVi: 'Bánh Cáy 03: Bánh Cáy Và Trà Xanh: Cặp Đôi Hoàn Hảo Cho Ngày Đông',
    summary: 'Experience the northern winter ritual of pairing rich, ginger-spiced bánh cáy with bitter hot green tea on rainy afternoons.',
    summaryVi: 'Trải nghiệm nét đẹp ẩm thực ngày đông xứ Bắc khi nhâm nhi bánh cáy cay ấm nồng bên chén trà xanh chát ngọt dịu.',
    wordCount: 184,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'In northern Vietnam, cold winter afternoons are the ideal time to enjoy bánh cáy. The sweet is not designed to be eaten quickly or in large bites. Instead, it belongs to the slow-paced tea culture that defines everyday life in northern rural villages.',
        viText: 'Ở miền Bắc Việt Nam, những buổi chiều mùa đông rét mướt là thời điểm lý tưởng nhất để thưởng thức bánh cáy. Món bánh ngọt này sinh ra không phải để ăn vội vàng hay cắn những miếng lớn. Thay vào đó, nó thuộc về văn hóa thưởng trà chậm rãi vốn định hình đời sống thường nhật ở các làng quê đồng bằng Bắc Bộ.',
      },
      {
        orderIndex: 1,
        enText: 'A piece of bánh cáy offers a fascinating mix of textures and sensations. When you take a bite, you first experience the pleasant crunch of puffed rice and roasted peanuts, followed by the soft chewiness of rice malt and sweet pork fat. The heat of fresh ginger quickly spreads across your tongue, cutting through the sweetness and warming your chest.',
        viText: 'Một miếng bánh cáy mang đến sự hòa quyện thú vị giữa kết cấu và cảm giác. Khi cắn một miếng, ban đầu bạn sẽ cảm nhận được độ giòn xốp vui miệng của bỏng nếp và lạc rang, nối tiếp là độ dẻo mềm của mạch nha cùng miếng mỡ khẩu béo ngọt. Vị cay ấm của gừng tươi nhanh chóng lan tỏa khắp đầu lưỡi, xua tan vị ngọt đậm và sưởi ấm lồng ngực.',
      },
      {
        orderIndex: 2,
        enText: 'To balance this rich treat, locals always serve it with a small cup of hot green tea. The bitter notes and natural tannins in the tea wash away the sugary coating, cleansing your palate and leaving a sweet aftertaste in your throat.',
        viText: 'Để cân bằng lại thức quà đậm vị này, người dân luôn dùng kèm với một chén trà xanh nóng hổi. Vị chát nhẹ và chất tanin tự nhiên trong trà rửa trôi lớp ngọt bám trên vòm miệng, làm thanh sạch vị giác và để lại hậu ngọt sâu nơi cuống họng.',
      },
      {
        orderIndex: 3,
        enText: 'Sharing bánh cáy and hot tea is a warm social gesture. Sitting around a wooden table while rain drizzles outside, family members enjoy peaceful conversation. This quiet pairing shows how traditional Vietnamese snacks bring comfort and connection to ordinary winter days.',
        viText: 'Mời nhau miếng bánh cáy bên chén trà nóng là cử chỉ gắn kết thân tình. Ngồi quây quần bên chiếc bàn gỗ giữa làn mưa phùn rả rích ngoài hiên, các thành viên trong gia đình cùng nhau trò chuyện êm đềm. Cặp đôi mộc mạc này cho thấy những món ăn vặt truyền thống của Việt Nam mang lại sự ấm áp và kết nối cho những ngày đông bình dị đến nhường nào.',
      },
    ],
    vocabularies: [
      { id: 'bcl-slow-paced', word: 'slow-paced', pos: 'adjective', ipa: '/ˌsloʊˈpeɪst/', viMeaning: 'chậm rãi, thong thả', enDefinition: 'Moving, living, or unfolding at a serene, unhurried tempo.', contextSentence: 'It belongs to the slow-paced tea culture of northern rural villages.' },
      { id: 'bcl-sensation', word: 'sensation', pos: 'noun', ipa: '/senˈseɪ.ʃən/', viMeaning: 'cảm giác, cảm quan', enDefinition: 'A physical sensory feeling resulting from taste, touch, or temperature.', contextSentence: 'A piece of bánh cáy offers a mix of textures and sensations.' },
      { id: 'bcl-chewiness', word: 'chewiness', pos: 'noun', ipa: '/ˈtʃuː.i.nəs/', viMeaning: 'độ dẻo dai', enDefinition: 'The culinary quality of being delightfully chewy and pliable.', contextSentence: 'Experience the soft chewiness of rice malt and sweet pork fat.' },
      { id: 'bcl-cut-through', word: 'cut through', pos: 'phrasal verb', ipa: '/kʌt θruː/', viMeaning: 'cắt giảm, trung hòa (vị ngấy/ngọt)', enDefinition: 'To penetrate and relieve heavy sweetness or fattiness with sharp zest.', contextSentence: 'The heat of ginger cuts through the sweetness and warms your chest.' },
      { id: 'bcl-bitter-note', word: 'bitter note', pos: 'noun phrase', ipa: '/ˈbɪt.ɚ noʊt/', viMeaning: 'nốt vị chát, đắng nhẹ', enDefinition: 'A pleasant, astringent herbal undertone found in fresh green tea.', contextSentence: 'The bitter notes in green tea cleanse your palate after sweet bites.' },
      { id: 'bcl-tannin', word: 'tannin', pos: 'noun', ipa: '/ˈtæn.ɪn/', viMeaning: 'chất chát tự nhiên trong trà', enDefinition: 'Natural plant polyphenols that give brewed tea its brisk astringency.', contextSentence: 'Natural tannins wash away the sugary coating on your tongue.' },
      { id: 'bcl-cleanse-the-palate', word: 'cleanse the palate', pos: 'verb phrase', ipa: '/klenz ðə ˈpæl.ət/', viMeaning: 'làm thanh sạch vị giác', enDefinition: 'To refresh mouth receptors so subtle flavors can be savored anew.', contextSentence: 'Hot green tea cleanses your palate with every sip.' },
      { id: 'bcl-aftertaste', word: 'aftertaste', pos: 'noun', ipa: '/ˈæf.tɚ.teɪst/', viMeaning: 'hậu vị', enDefinition: 'The pleasant, lingering flavor remaining in the throat after tasting.', contextSentence: 'The pairing leaves a fragrant sweet aftertaste.' },
      { id: 'bcl-social-gesture', word: 'social gesture', pos: 'noun phrase', ipa: '/ˈsoʊ.ʃəl ˈdʒes.tʃɚ/ ', viMeaning: 'cử chỉ kết nối xã hội, hành động gắn kết', enDefinition: 'A thoughtful customary act reinforcing warmth and bond among companions.', contextSentence: 'Sharing bánh cáy and hot tea is a warm social gesture.' },
      { id: 'bcl-drizzle', word: 'drizzle', pos: 'verb', ipa: '/ˈdrɪz.əl/', viMeaning: 'mưa phùn, mưa lất phất', enDefinition: 'To rain steadily in fine, mist-like droplets typical of northern winter.', contextSentence: 'Rain drizzles outside while family members share tea inside.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Why is bánh cáy traditionally paired with hot green tea in northern winter?', options: [{ key: 'A', text: 'The natural bitterness and tannins in green tea balance the sweetness and cleanse the palate' }, { key: 'B', text: 'Because tea is the only beverage permitted during village festivals' }, { key: 'C', text: 'To soften the cake before swallowing' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What role does fresh ginger play in the sensory balance of the cake?', options: [{ key: 'A', text: 'Its warm heat spreads across the tongue and cuts through the rich sweetness' }, { key: 'B', text: 'It acts as an artificial food coloring agent' }, { key: 'C', text: 'It makes the cake sour and citrusy' }], correctKey: 'A' },
    ],
  },
];

export const BANH_CAY_SERIES_ARTICLES: ReaderArticleData[] = chapters.map(chapter => ({
  ...chapter,
  topic: 'Ẩm thực',
  region: 'Thái Bình',
  level: 'Level 2',
  cefrLevel: 'B1',
  readTime: '3 phút đọc',
  imageUrl,
  vocabMap: Object.fromEntries(chapter.vocabularies.map(item => [item.word.toLowerCase(), item])),
}));

export const BANH_CAY_SERIES: ArticleSeries = {
  metadata: BANH_CAY_SERIES_METADATA,
  articles: BANH_CAY_SERIES_ARTICLES,
};

export const banhCaySeries = BANH_CAY_SERIES;

export const BANH_CAY_JOURNEY = {
  id: BANH_CAY_SERIES_METADATA.id,
  provinceId: BANH_CAY_SERIES_METADATA.provinceId,
  title: BANH_CAY_SERIES_METADATA.titleVi,
  englishTitle: BANH_CAY_SERIES_METADATA.title,
  level: 'B1',
  estimatedTime: '9 phút',
  totalWords: 557,
  badgeIcon: 'Award',
  thumbnailUrl: imageUrl,
  featuredStories: BANH_CAY_SERIES_ARTICLES.map((art, idx) => ({
    id: art.id,
    seriesId: BANH_CAY_SERIES_METADATA.id,
    title: art.titleVi,
    englishTitle: art.titleEn,
    level: art.level,
    readTime: art.readTime,
    wordCount: art.wordCount,
    thumbnailUrl: imageUrl,
    summary: art.summaryVi,
    order: idx + 1,
  })),
};
