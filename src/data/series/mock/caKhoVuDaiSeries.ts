import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { ArticleSeries, SeriesMetadata } from '../types';

const imageUrl = '/images/series/ca-kho-vu-dai.jpg';

export const CA_KHO_VU_DAI_SERIES_METADATA: SeriesMetadata = {
  id: 'ca-kho-vu-dai',
  title: 'Vũ Đại Braised Fish',
  titleVi: 'Cá Kho Làng Vũ Đại',
  theme: 'cuisine',
  provinceId: 'ninh-binh',
  region: 'north',
  description: 'Discover the 16-hour longan wood simmering, literary roots in Nam Cao’s stories, and natural flavor layering of Hà Nam’s legendary braised carp.',
  imageUrl,
  status: 'published',
  chapters: [
    {
      id: 'ca-kho-16-hour-secret',
      order: 1,
      titleEn: 'Cá Kho 01: The 16-Hour Secret of Vũ Đại Braised Fish',
      titleVi: 'Cá Kho 01: Bí Quyết 16 Tiếng Của Cá Kho Làng Vũ Đại',
      summary: 'Explore the 16-hour cooking process in Nghệ An clay pots, black carp selection, and longan wood fire.',
      summaryVi: 'Khám phá quy trình kho 16 tiếng trong niêu đất Nghệ An, tiêu chuẩn chọn cá trắm đen và kỹ thuật đun củi nhãn.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'ca-kho-nam-cao-village',
      order: 2,
      titleEn: 'Cá Kho 02: Vũ Đại Village: From Literature to a Famous Specialty',
      titleVi: 'Cá Kho 02: Làng Vũ Đại: Từ Văn Học Đến Món Đặc Sản Nổi Tiếng',
      summary: 'Experience the historical hardship in Nam Cao’s stories, the bustling Tết pot-watching season, and modern village pride.',
      summaryVi: 'Trải nghiệm bối cảnh gian khó trong văn học Nam Cao, không khí thức trắng đêm canh niêu vụ Tết và niềm tự hào làng nghề thời hiện đại.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'ca-kho-natural-preservation',
      order: 3,
      titleEn: 'Cá Kho 03: Natural Preservation and the Science of Flavor Layering',
      titleVi: 'Cá Kho 03: Bảo Quản Tự Nhiên Và Nghệ Thuật Xếp Tầng Hương Vị',
      summary: 'Learn how galangal, pork fat, field crab extract, and lime juice preserve fish naturally for weeks at room temperature.',
      summaryVi: 'Tìm hiểu cách riềng tươi, mỡ lợn, nước cốt cua đồng và nước chanh giúp bảo quản cá tự nhiên nhiều tuần ở nhiệt độ phòng.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
  ],
};

const chapters = [
  {
    id: 'ca-kho-16-hour-secret',
    titleEn: 'Cá Kho 01: The 16-Hour Secret of Vũ Đại Braised Fish',
    titleVi: 'Cá Kho 01: Bí Quyết 16 Tiếng Của Cá Kho Làng Vũ Đại',
    summary: 'Explore the 16-hour cooking process in Nghệ An clay pots, black carp selection, and longan wood fire.',
    summaryVi: 'Khám phá quy trình kho 16 tiếng trong niêu đất Nghệ An, tiêu chuẩn chọn cá trắm đen và kỹ thuật đun củi nhãn.',
    wordCount: 196,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Cá kho làng Vũ Đại, also known as Đại Hoàng fish, is famous for its incredible 16-hour cooking process. The recipe requires great patience and strict cooking rules that have been passed down for generations. The dish is cooked only in clay pots made in Nghệ An Province, because the clay distributes heat slowly and evenly without cracking.',
        viText: 'Cá kho làng Vũ Đại, còn được gọi là cá kho Đại Hoàng, nổi tiếng với quy trình kho kỳ công kéo dài suốt 16 tiếng. Công thức này đòi hỏi sự kiên nhẫn cao độ và các quy tắc nấu nướng nghiêm ngặt được truyền lại qua nhiều thế hệ. Món ăn chỉ được nấu trong những chiếc niêu đất có nguồn gốc từ tỉnh Nghệ An, bởi chất đất này truyền nhiệt chậm và đều mà không bị nứt vỡ.',
      },
      {
        orderIndex: 1,
        enText: 'The primary fish chosen for this dish is black carp, called cá trắm đen. Cooks only select mature carp that weigh over three kilograms because their meat is naturally sweet, firm, and low in water. The fish is cut into thick steaks and layered inside the pot over fresh galangal slices to prevent burning.',
        viText: 'Loại cá chính được chọn cho món ăn này là cá trắm đen. Người nấu chỉ tuyển chọn những con cá trắm trưởng thành nặng trên ba kilôgam vì thịt của chúng ngọt đậm tự nhiên, săn chắc và ít nước. Cá được cắt khúc dày rồi xếp vào niêu bên trên lớp riềng tươi thái lát để tránh bị cháy đáy.',
      },
      {
        orderIndex: 2,
        enText: 'The secret to its unique flavor lies in the firewood. Villagers exclusively burn longan wood because it produces stable heat, little smoke, and no unpleasant odor. For nearly sixteen continuous hours, the fire must be kept at a steady simmer, never allowed to stop.',
        viText: 'Bí mật tạo nên hương vị độc nhất nằm ở củi đun. Dân làng chỉ đốt củi nhãn vì loại củi này cho nhiệt lượng ổn định, ít khói và không có mùi khó chịu. Trong gần mười sáu giờ liên tục, ngọn lửa phải luôn được giữ ở mức liu riu ổn định, tuyệt đối không được tắt.',
      },
      {
        orderIndex: 3,
        enText: 'By the end of the long cooking time, all fish bones become soft enough to chew easily, while the meat remains intact and firm. This slow extraction turns humble freshwater fish into a rich, savory delicacy that can be stored naturally for weeks.',
        viText: 'Khi kết thúc thời gian kho kéo dài, toàn bộ xương cá đều nhừ tơi đến mức có thể nhai dễ dàng, trong khi thớ thịt vẫn nguyên vẹn và săn chắc. Quá trình chiết xuất chậm này biến con cá nước ngọt bình dị thành một món đặc sản đậm đà, có thể bảo quản tự nhiên trong nhiều tuần.',
      },
    ],
    vocabularies: [
      { id: 'ck-braised-fish', word: 'braised fish', pos: 'noun phrase', ipa: '/breɪzd fɪʃ/', viMeaning: 'cá kho', enDefinition: 'Fish cooked slowly in a seasoned, flavorful liquid inside a closed pot.', contextSentence: 'Cá kho làng Vũ Đại is famous for its 16-hour cooking process.' },
      { id: 'ck-clay-pot', word: 'clay pot', pos: 'noun phrase', ipa: '/ˈkleɪ ˌpɑːt/', viMeaning: 'niêu đất, nồi đất', enDefinition: 'A traditional earthenware pot made of baked clay used for slow simmering.', contextSentence: 'The dish is cooked only in clay pots made in Nghệ An.' },
      { id: 'ck-distribute-heat', word: 'distribute heat', pos: 'verb phrase', ipa: '/dɪˈstrɪb.juːt hiːt/', viMeaning: 'phân tán nhiệt', enDefinition: 'To spread thermal energy evenly throughout a surface or cooking vessel.', contextSentence: 'The clay distributes heat slowly and evenly without cracking.' },
      { id: 'ck-black-carp', word: 'black carp', pos: 'noun phrase', ipa: '/blæk kɑːrp/', viMeaning: 'cá trắm đen', enDefinition: 'A large East Asian freshwater fish valued for firm, sweet meat.', contextSentence: 'The primary fish chosen for this dish is black carp.' },
      { id: 'ck-mature', word: 'mature', pos: 'adjective', ipa: '/məˈtʃʊr/', viMeaning: 'trưởng thành, già dặn', enDefinition: 'Fully grown or developed in size and quality.', contextSentence: 'Cooks only select mature carp weighing over three kilograms.' },
      { id: 'ck-galangal', word: 'galangal', pos: 'noun', ipa: '/ɡəˈlæŋ.ɡəl/', viMeaning: 'củ riềng', enDefinition: 'An aromatic Asian rhizome related to ginger with an earthy, spicy flavor.', contextSentence: 'The fish is layered inside the pot over fresh galangal slices.' },
      { id: 'ck-exclusively', word: 'exclusively', pos: 'adverb', ipa: '/ɪkˈskluː.sɪv.li/', viMeaning: 'độc quyền, duy nhất', enDefinition: 'Solely, only, and without sharing or including anything else.', contextSentence: 'Villagers exclusively burn longan wood for simmering.' },
      { id: 'ck-longan-wood', word: 'longan wood', pos: 'noun phrase', ipa: '/ˈloʊŋ.ɡən wʊd/', viMeaning: 'củi nhãn', enDefinition: 'Firewood from the longan fruit tree, producing clean, steady heat.', contextSentence: 'Longan wood produces stable heat and no unpleasant odor.' },
      { id: 'ck-steady-simmer', word: 'steady simmer', pos: 'noun phrase', ipa: '/ˈsted.i ˈsɪm.ɚ/', viMeaning: 'sôi liu riu ổn định', enDefinition: 'A continuous, gentle, controlled boiling below extreme bubbling.', contextSentence: 'The fire must be kept at a steady simmer for sixteen hours.' },
      { id: 'ck-chew-easily', word: 'chew easily', pos: 'verb phrase', ipa: '/tʃuː ˈiː.zəl.i/', viMeaning: 'nhai dễ dàng', enDefinition: 'To crush food softly with the teeth without difficulty or resistance.', contextSentence: 'All fish bones become soft enough to chew easily.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Why do Vũ Đại villagers exclusively use longan wood to simmer the pots?', options: [{ key: 'A', text: 'Because it produces stable heat, little smoke, and no unpleasant odor' }, { key: 'B', text: 'Because longan wood is the only wood in Vietnam' }, { key: 'C', text: 'To color the fish blue' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What texture transformation happens to the fish after 16 hours of slow extraction?', options: [{ key: 'A', text: 'All bones become soft enough to chew easily while the meat remains firm and intact' }, { key: 'B', text: 'The fish turns into dry powder' }, { key: 'C', text: 'The fish dissolves into thin broth' }], correctKey: 'A' },
    ],
  },
  {
    id: 'ca-kho-nam-cao-village',
    titleEn: 'Cá Kho 02: Vũ Đại Village: From Literature to a Famous Specialty',
    titleVi: 'Cá Kho 02: Làng Vũ Đại: Từ Văn Học Đến Món Đặc Sản Nổi Tiếng',
    summary: 'Experience the historical hardship in Nam Cao’s stories, the bustling Tết pot-watching season, and modern village pride.',
    summaryVi: 'Trải nghiệm bối cảnh gian khó trong văn học Nam Cao, không khí thức trắng đêm canh niêu vụ Tết và niềm tự hào làng nghề thời hiện đại.',
    wordCount: 194,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Vũ Đại village in Hà Nam Province is widely known in Vietnamese literature through the realistic stories of writer Nam Cao. In the past, this rural area suffered from severe poverty, and villagers lived very difficult lives. During cold winter days and Tết holidays, families gathered around the kitchen hearth to simmer clay pots of fish to eat over many days.',
        viText: 'Làng Vũ Đại ở tỉnh Hà Nam được biết đến rộng rãi trong văn học Việt Nam qua những trang viết hiện thực của nhà văn Nam Cao. Trong quá khứ, vùng quê này từng chịu cảnh nghèo khó khốn cùng, người dân có cuộc sống vô cùng chật vật. Vào những ngày đông lạnh giá và dịp Tết, các gia đình thường quây quần bên bếp lửa để kho những niêu cá ăn dần trong nhiều ngày.',
      },
      {
        orderIndex: 1,
        enText: 'What used to be a dish born out of hardship has now become a prestigious culinary gift across Vietnam. Every year, starting from the eleventh lunar month, the entire village is filled with aromatic wood smoke. Hundreds of families stay awake through the night, taking turns watching thousands of burning pots.',
        viText: 'Thứ từng là món ăn sinh ra từ gian khó nay đã trở thành món quà ẩm thực cao cấp trên khắp Việt Nam. Hàng năm, bắt đầu từ tháng mười một âm lịch, cả ngôi làng lại ngập tràn trong làn khói củi thơm nồng. Hàng trăm gia đình thức trắng đêm, thay phiên nhau canh chừng hàng nghìn niêu cá đang đỏ lửa.',
      },
      {
        orderIndex: 2,
        enText: 'Managing the pots during the busy Tết season requires teamwork and dedication. Experienced cooks constantly add boiling water, lime juice, and caramelized sugar broth to ensure the liquid never dries up before the fish is fully softened.',
        viText: 'Việc trông nom các niêu cá trong mùa Tết bận rộn đòi hỏi sự phối hợp nhịp nhàng và tận tâm. Những người nấu giàu kinh nghiệm phải liên tục châm thêm nước sôi, nước cốt chanh và nước hàng để đảm bảo nước kho không bao giờ cạn trước khi cá kịp nhừ xương.',
      },
      {
        orderIndex: 3,
        enText: 'Today, this traditional craft brings economic stability and pride to local villagers. Many younger people return to their hometown to develop the family brand and sell these heritage pots online. Cá kho Vũ Đại shows how a humble village tradition can adapt to modern markets while keeping its authentic soul.',
        viText: 'Ngày nay, nghề thủ công truyền thống này mang lại sự ổn định kinh tế và niềm tự hào cho người dân địa phương. Nhiều bạn trẻ đã trở về quê hương để phát triển thương hiệu gia đình và bán những niêu cá di sản này trên mạng. Cá kho Vũ Đại cho thấy một truyền thống làng quê bình dị có thể thích nghi với thị trường hiện đại mà vẫn gìn giữ được cái hồn nguyên bản.',
      },
    ],
    vocabularies: [
      { id: 'ck-realistic-story', word: 'realistic story', pos: 'noun phrase', ipa: '/ˌriː.əˈlɪs.tɪk ˈstɔːr.i/', viMeaning: 'câu chuyện hiện thực', enDefinition: 'A narrative depicting life, society, and struggles truthfully without romantic fantasy.', contextSentence: 'Vũ Đại is known through the realistic stories of Nam Cao.' },
      { id: 'ck-severe-poverty', word: 'severe poverty', pos: 'noun phrase', ipa: '/səˈvɪr ˈpɑː.vɚ.t̬i/', viMeaning: 'sự nghèo khó cùng cực', enDefinition: 'A condition of extreme financial deprivation and hardship.', contextSentence: 'In the past, this rural area suffered from severe poverty.' },
      { id: 'ck-kitchen-hearth', word: 'kitchen hearth', pos: 'noun phrase', ipa: '/ˈkɪtʃ.ən hɑːrθ/', viMeaning: 'bếp lửa gian bếp', enDefinition: 'The floor or brick base of a traditional rural fireplace used for cooking.', contextSentence: 'Families gathered around the kitchen hearth to simmer clay pots.' },
      { id: 'ck-hardship', word: 'hardship', pos: 'noun', ipa: '/ˈhɑːrd.ʃɪp/', viMeaning: 'nỗi gian nan, sự khó khăn', enDefinition: 'Severe suffering or privation endured during difficult times.', contextSentence: 'What used to be a dish born out of hardship became a famous delicacy.' },
      { id: 'ck-prestigious-gift', word: 'prestigious gift', pos: 'noun phrase', ipa: '/presˈtɪdʒ.əs ɡɪft/', viMeaning: 'món quà cao cấp, sang trọng', enDefinition: 'A respected, high-value present given with great esteem and honor.', contextSentence: 'It has become a prestigious culinary gift across Vietnam.' },
      { id: 'ck-lunar-month', word: 'lunar month', pos: 'noun phrase', ipa: '/ˌluː.nɚ ˈmʌnθ/', viMeaning: 'tháng âm lịch', enDefinition: 'A calendar month measured by the phases of the moon.', contextSentence: 'Starting from the eleventh lunar month, the village is filled with smoke.' },
      { id: 'ck-take-turns', word: 'take turns', pos: 'verb phrase', ipa: '/teɪk tɝːnz/', viMeaning: 'thay phiên nhau', enDefinition: 'To alternate in succession when doing a continuous task.', contextSentence: 'Families stay awake, taking turns watching thousands of pots.' },
      { id: 'ck-caramelized-sugar', word: 'caramelized sugar', pos: 'noun phrase', ipa: '/ˈker.ə.məl.aɪzd ˌʃʊɡ.ɚ/', viMeaning: 'nước hàng, đường thắng', enDefinition: 'Sugar heated until golden-brown, used to impart deep color and bittersweet flavor.', contextSentence: 'Cooks constantly add boiling water and caramelized sugar broth.' },
      { id: 'ck-economic-stability', word: 'economic stability', pos: 'noun phrase', ipa: '/ˌiː.kəˈnɑː.mɪk stəˈbɪl.ə.t̬i/', viMeaning: 'sự ổn định kinh tế', enDefinition: 'A steady and secure financial condition free from extreme fluctuations.', contextSentence: 'This traditional craft brings economic stability to villagers.' },
      { id: 'ck-authentic-soul', word: 'authentic soul', pos: 'noun phrase', ipa: '/ɑːˈθen.tɪk soʊl/', viMeaning: 'linh hồn nguyên bản', enDefinition: 'The genuine, original essence and traditional spirit of a culture.', contextSentence: 'It adapts to modern markets while keeping its authentic soul.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Which renowned Vietnamese writer depicted Vũ Đại village in literature?', options: [{ key: 'A', text: 'Writer Nam Cao' }, { key: 'B', text: 'Writer Thạch Lam' }, { key: 'C', text: 'Poet Huy Cận' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What liquids do experienced cooks continually add during the 16-hour simmer?', options: [{ key: 'A', text: 'Boiling water, lime juice, and caramelized sugar broth' }, { key: 'B', text: 'Cold milk and butter' }, { key: 'C', text: 'Iced green tea' }], correctKey: 'A' },
    ],
  },
  {
    id: 'ca-kho-natural-preservation',
    titleEn: 'Cá Kho 03: Natural Preservation and the Science of Flavor Layering',
    titleVi: 'Cá Kho 03: Bảo Quản Tự Nhiên Và Nghệ Thuật Xếp Tầng Hương Vị',
    summary: 'Learn how galangal, pork fat, field crab extract, and lime juice preserve fish naturally for weeks at room temperature.',
    summaryVi: 'Tìm hiểu cách riềng tươi, mỡ lợn, nước cốt cua đồng và nước chanh giúp bảo quản cá tự nhiên nhiều tuần ở nhiệt độ phòng.',
    wordCount: 183,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Long before modern refrigerators existed, northern Vietnamese farmers invented brilliant ways to preserve food naturally, and Vũ Đại braised fish is a prime example. The recipe relies on an intricate balance of local spices that act as natural preservatives against tropical humidity.',
        viText: 'Rất lâu trước khi có tủ lạnh hiện đại, những người nông dân miền Bắc Việt Nam đã phát minh ra những cách tài tình để bảo quản thực phẩm tự nhiên, và cá kho Vũ Đại là một ví dụ điển hình. Công thức này dựa vào sự cân bằng phức hợp giữa các loại gia vị bản địa đóng vai trò như chất bảo quản tự nhiên trước độ ẩm nhiệt đới.',
      },
      {
        orderIndex: 1,
        enText: 'The bottom of the clay pot is lined with thick slices of fresh galangal and ginger. These roots do not just give warmth; their antimicrobial properties prevent meat from spoiling. On top of the fish, cooks layer strips of pork belly. As the pork fat melts over sixteen hours, it seeps into the fish meat, keeping it moist and creating a shiny coat.',
        viText: 'Đáy niêu đất được lót bằng những lát riềng tươi và gừng thái dày. Những củ gia vị này không chỉ đem lại hơi ấm; đặc tính kháng khuẩn của chúng còn ngăn chặn thịt cá bị ôi thiu. Phía trên cá, người nấu xếp các dải thịt ba chỉ. Khi mỡ lợn tan chảy suốt mười sáu tiếng, nó ngấm sâu vào từng thớ thịt cá, giữ cho thịt luôn mềm ẩm và tạo lớp áo ngoài bóng bẩy.',
      },
      {
        orderIndex: 2,
        enText: 'Two surprising seasonings define the signature taste: field crab extract and fresh lime juice. The fermented juice of freshwater crabs provides natural umami depth, while lime juice tenderizes tough fish bones without making the meat mushy.',
        viText: 'Hai loại gia vị bất ngờ làm nên hương vị đặc trưng là nước cốt cua đồng và nước cốt chanh tươi. Nước cốt cua đồng lên men mang lại vị umami sâu đậm tự nhiên, trong khi nước chanh làm mềm những chiếc xương cá cứng mà không khiến thịt bị bở nát.',
      },
      {
        orderIndex: 3,
        enText: 'Thanks to this careful combination of salt, pork fat, and acidic plant juices, a finished pot can stay fresh at room temperature for several weeks without any chemical additives. It represents the timeless wisdom of traditional Vietnamese food preservation.',
        viText: 'Nhờ sự kết hợp cẩn trọng giữa muối, mỡ lợn và dịch chua thực vật, một niêu cá thành phẩm có thể giữ tươi ngon ở nhiệt độ phòng trong nhiều tuần mà không cần bất kỳ phụ gia hóa học nào. Món ăn đại diện cho trí tuệ vượt thời gian của người Việt trong việc bảo quản thực phẩm truyền thống.',
      },
    ],
    vocabularies: [
      { id: 'ck-preservation', word: 'preservation', pos: 'noun', ipa: '/ˌprez.ɚˈveɪ.ʃən/', viMeaning: 'sự bảo quản', enDefinition: 'The act of keeping something intact and preventing decay or deterioration.', contextSentence: 'Northern farmers invented brilliant ways of natural food preservation.' },
      { id: 'ck-flavor-layering', word: 'flavor layering', pos: 'noun phrase', ipa: '/ˈfleɪ.vɚ ˌleɪ.ɚ.ɪŋ/', viMeaning: 'nghệ thuật xếp tầng hương vị', enDefinition: 'Arranging complementary ingredients in stages to build complex taste.', contextSentence: 'The recipe is a masterclass in flavor layering and balance.' },
      { id: 'ck-preservative', word: 'preservative', pos: 'noun', ipa: '/prɪˈzɝː.və.t̬ɪv/', viMeaning: 'chất bảo quản', enDefinition: 'A natural substance or additive that retards spoilage of food.', contextSentence: 'Local spices act as natural preservatives against humidity.' },
      { id: 'ck-antimicrobial', word: 'antimicrobial properties', pos: 'plural noun', ipa: '/ˌæn.t̬i.maɪˈkroʊ.bi.əl ˈprɑː.pɚ.t̬iz/', viMeaning: 'đặc tính kháng khuẩn', enDefinition: 'Characteristics capable of killing or stopping bacteria growth.', contextSentence: 'Their antimicrobial properties prevent meat from spoiling.' },
      { id: 'ck-spoil', word: 'spoil', pos: 'verb', ipa: '/spɔɪl/', viMeaning: 'ôi thiu, hỏng hóc', enDefinition: 'To become unfit for eating through decay and bacterial action.', contextSentence: 'Spices prevent the fish meat from spoiling in warm weather.' },
      { id: 'ck-seep-into', word: 'seep into', pos: 'phrasal verb', ipa: '/siːp ˈɪn.tuː/', viMeaning: 'ngấm vào, thấm sâu vào', enDefinition: 'To flow or pass slowly through small pores or openings.', contextSentence: 'As pork fat melts, it seeps into the fish meat.' },
      { id: 'ck-field-crab-extract', word: 'field crab extract', pos: 'noun phrase', ipa: '/fiːld kræb ˈek.strækt/', viMeaning: 'nước cốt cua đồng', enDefinition: 'Concentrated savory liquid pressed from freshwater rice-paddy crabs.', contextSentence: 'Field crab extract provides natural umami depth.' },
      { id: 'ck-tenderize', word: 'tenderize', pos: 'verb', ipa: '/ˈten.dɚ.aɪz/', viMeaning: 'làm mềm (thịt, xương)', enDefinition: 'To make tough meat or bones softer and easier to break down.', contextSentence: 'Lime juice tenderizes tough fish bones without making meat mushy.' },
      { id: 'ck-mushy', word: 'mushy', pos: 'adjective', ipa: '/ˈmʌʃ.i/', viMeaning: 'bị bở, nhũn nát', enDefinition: 'Soft, pulpy, and lacking firmness or texture.', contextSentence: 'Lime juice softens bones without making the meat mushy.' },
      { id: 'ck-timeless-wisdom', word: 'timeless wisdom', pos: 'noun phrase', ipa: '/ˈtaɪm.ləs ˈwɪz.dəm/', viMeaning: 'trí tuệ vượt thời gian', enDefinition: 'Enduring knowledge and insight that remains valuable across centuries.', contextSentence: 'It represents the timeless wisdom of Vietnamese culinary heritage.' },
    ],
    questions: [
      { orderIndex: 0, question: 'What roles do field crab extract and lime juice perform in the recipe?', options: [{ key: 'A', text: 'Crab extract adds umami depth, while lime juice tenderizes bones without softening meat into mush' }, { key: 'B', text: 'They turn the dish sweet like candy' }, { key: 'C', text: 'They replace the clay pot' }], correctKey: 'A' },
      { orderIndex: 1, question: 'Why can Vũ Đại braised fish remain fresh at room temperature for several weeks?', options: [{ key: 'A', text: 'Through the balanced interaction of salt, pork fat, and natural antimicrobial root spices' }, { key: 'B', text: 'Because chemical preservatives are added' }, { key: 'C', text: 'Because it is kept in industrial freezers' }], correctKey: 'A' },
    ],
  },
];

export const CA_KHO_VU_DAI_SERIES_ARTICLES: ReaderArticleData[] = chapters.map(chapter => ({
  ...chapter,
  topic: 'Ẩm thực',
  region: 'Hà Nam',
  level: 'Level 2',
  cefrLevel: 'B1',
  readTime: '3 phút đọc',
  imageUrl,
  vocabMap: Object.fromEntries(chapter.vocabularies.map(item => [item.word.toLowerCase(), item])),
}));

export const CA_KHO_VU_DAI_SERIES: ArticleSeries = {
  metadata: CA_KHO_VU_DAI_SERIES_METADATA,
  articles: CA_KHO_VU_DAI_SERIES_ARTICLES,
};
