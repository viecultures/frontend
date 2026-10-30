import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { ArticleSeries, SeriesMetadata } from '../types';

const imageUrl = '/images/series/com-chay-ninh-binh.webp';

export const COM_CHAY_SERIES_METADATA: SeriesMetadata = {
  id: 'com-chay-ninh-binh',
  title: 'Cơm Cháy in Ninh Bình',
  titleVi: 'Cơm Cháy Ninh Bình',
  theme: 'cuisine',
  provinceId: 'ninh-binh',
  region: 'north',
  description: 'Discover the 19th-century origin of Đinh Hoàng Thăng, cast-iron pot crust techniques, and the dramatic sizzle of mountain goat sauce over crispy rice.',
  imageUrl,
  status: 'published',
  chapters: [
    {
      id: 'com-chay-creative-origin',
      order: 1,
      titleEn: 'Cơm Cháy 01: Cơm Cháy Ninh Bình: The Story of a Creative Youth',
      titleVi: 'Cơm Cháy 01: Cơm Cháy Ninh Bình: Câu Chuyện Của Một Chàng Trai Sáng Tạo',
      summary: 'Explore how young Đinh Hoàng Thăng adapted culinary techniques in Hanoi to create Ninh Bình’s famous goat-meat crispy rice.',
      summaryVi: 'Tìm hiểu cách chàng trai trẻ Đinh Hoàng Thăng vận dụng kỹ thuật học được ở Hà Nội để sáng tạo món cơm cháy dê núi trứ danh Ninh Bình.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'com-chay-craft-science',
      order: 2,
      titleEn: 'Cơm Cháy 02: How to Make the Perfect Crispy Rice',
      titleVi: 'Cơm Cháy 02: Cách Tạo Ra Lớp Cơm Cháy Giòn Hoàn Hảo',
      summary: 'Learn the food science of blending sticky rice, pressing crusts in thick cast-iron pots, sun-drying, and rapid oil expansion.',
      summaryVi: 'Khám phá bí quyết pha trộn gạo nếp, kỹ thuật ép cháy chảo gang đáy dày, phơi sấy rút ẩm và chiên phồng hạt gạo giòn tan.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'com-chay-savory-symphony',
      order: 3,
      titleEn: 'Cơm Cháy 03: A Symphony of Sound and Savory Flavors',
      titleVi: 'Cơm Cháy 03: Bản Giao Hưởng Của Âm Thanh Và Hương Vị Đậm Đà',
      summary: 'Experience the multi-sensory contrast of hot goat and kidney sauce poured over freshly fried rice with a dramatic sizzle.',
      summaryVi: 'Trải nghiệm đa giác quan khi rưới nước xốt dê núi, tim cật sôi sùng sục lên đĩa cơm cháy tạo tiếng xèo xèo giòn giã đầy kích thích.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
  ],
};

const chapters = [
  {
    id: 'com-chay-creative-origin',
    titleEn: 'Cơm Cháy 01: Cơm Cháy Ninh Bình: The Story of a Creative Youth',
    titleVi: 'Cơm Cháy 01: Cơm Cháy Ninh Bình: Câu Chuyện Của Một Chàng Trai Sáng Tạo',
    summary: 'Explore how young Đinh Hoàng Thăng adapted culinary techniques in Hanoi to create Ninh Bình’s famous goat-meat crispy rice.',
    summaryVi: 'Tìm hiểu cách chàng trai trẻ Đinh Hoàng Thăng vận dụng kỹ thuật học được ở Hà Nội để sáng tạo món cơm cháy dê núi trứ danh Ninh Bình.',
    wordCount: 197,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Cơm cháy Ninh Bình is one of the most famous regional specialties in northern Vietnam, but few people know its fascinating origin. The dish was created in the late 19th century by a young man named Đinh Hoàng Thăng. Born in Ninh Bình, he went to Hanoi to work for a wealthy Chinese restaurant owner, where he learned valuable culinary techniques.',
        viText: 'Cơm cháy Ninh Bình là một trong những đặc sản vùng miền nổi tiếng nhất ở miền Bắc Việt Nam, nhưng ít ai biết về nguồn gốc thú vị của nó. Món ăn này được sáng tạo vào cuối thế kỷ 19 bởi một chàng trai trẻ tên là Đinh Hoàng Thăng. Sinh ra tại Ninh Bình, ông lên Hà Nội làm việc cho một chủ tiệm ăn người Hoa giàu có, nơi ông đã học được nhiều kỹ thuật nấu nướng quý giá.',
      },
      {
        orderIndex: 1,
        enText: 'During his time there, he learned a recipe for crispy rice dishes. However, instead of simply copying what he was taught, Thăng decided to return to his hometown and improve the idea. He cleverly combined the crispy rice concept with local ingredients from the limestone mountains of Ninh Bình, especially mountain goat meat.',
        viText: 'Trong thời gian ở đây, ông đã học được công thức chế biến các món cơm giòn. Tuy nhiên, thay vì chỉ sao chép lại những gì đã học, ông Thăng quyết định trở về quê hương và cải tiến ý tưởng đó. Ông đã khéo léo kết hợp kỹ thuật làm cơm giòn với các nguyên liệu địa phương từ vùng núi đá vôi Ninh Bình, đặc biệt là thịt dê núi.',
      },
      {
        orderIndex: 2,
        enText: 'The dish quickly became a hit among locals and travelers. Thăng then opened several eateries, helping to popularize the dish throughout the region. Over the decades, his family kept the recipe alive, passing down the secret techniques through generations.',
        viText: 'Món ăn nhanh chóng được người dân địa phương và du khách ưa chuộng. Ông Thăng sau đó đã mở nhiều quán ăn, giúp món ăn trở nên phổ biến khắp vùng. Qua nhiều thập kỷ, gia đình ông đã gìn giữ công thức này, truyền lại những bí quyết qua nhiều thế hệ.',
      },
      {
        orderIndex: 3,
        enText: 'Today, cơm cháy is recognized as an official national specialty and a must-try dish for tourists visiting ancient temples in Ninh Bình. Thăng’s story proves that culinary creativity often begins when someone adapts foreign skills to highlight the best produce of their homeland.',
        viText: 'Ngày nay, cơm cháy được công nhận là đặc sản quốc gia chính thức và là món ăn không thể bỏ qua đối với du khách ghé thăm các ngôi chùa cổ ở Ninh Bình. Câu chuyện của ông Thăng chứng minh rằng sự sáng tạo trong ẩm thực thường bắt đầu khi ai đó vận dụng những kỹ năng học được để tôn vinh nông sản quê hương.',
      },
    ],
    vocabularies: [
      { id: 'ccy-regional-specialty', word: 'regional specialty', pos: 'noun phrase', ipa: '/ˌriː.dʒən.əl ˈspeʃ.əl.ti/', viMeaning: 'đặc sản vùng miền', enDefinition: 'A famous food or product uniquely associated with a specific geographic area.', contextSentence: 'Cơm cháy is one of the most famous regional specialties in northern Vietnam.' },
      { id: 'ccy-fascinating-origin', word: 'fascinating origin', pos: 'noun phrase', ipa: '/ˈfæs.ən.eɪ.tɪŋ ˈɔːr.ə.dʒɪn/', viMeaning: 'nguồn gốc thú vị', enDefinition: 'An extremely interesting and captivating historical beginning.', contextSentence: 'Few people know its fascinating origin in the late 19th century.' },
      { id: 'ccy-culinary-technique', word: 'culinary technique', pos: 'noun phrase', ipa: '/ˈkʌl.ə.ner.i tekˈniːk/', viMeaning: 'kỹ thuật nấu nướng', enDefinition: 'A precise method or professional skill used in cooking and food preparation.', contextSentence: 'He learned valuable culinary techniques in Hanoi.' },
      { id: 'ccy-crispy-rice', word: 'crispy rice', pos: 'noun phrase', ipa: '/ˈkrɪs.pi raɪs/', viMeaning: 'cơm giòn, cơm cháy', enDefinition: 'Cooked rice fried or toasted until crisp, golden, and crunchy.', contextSentence: 'He combined the crispy rice concept with local mountain ingredients.' },
      { id: 'ccy-limestone-mountain', word: 'limestone mountain', pos: 'noun phrase', ipa: '/ˈlaɪm.stoʊn ˈmaʊn.tən/', viMeaning: 'núi đá vôi', enDefinition: 'A mountain formed of sedimentary rock, typical of Ninh Bình karsts.', contextSentence: 'Goats graze on the limestone mountains of Ninh Bình.' },
      { id: 'ccy-mountain-goat', word: 'mountain goat', pos: 'noun phrase', ipa: '/ˈmaʊn.tən ɡoʊt/', viMeaning: 'dê núi', enDefinition: 'Goats raised naturally on steep rocky cliffs, known for lean, fragrant meat.', contextSentence: 'The sauce highlights tender mountain goat meat.' },
      { id: 'ccy-hit', word: 'hit', pos: 'noun', ipa: '/hɪt/', viMeaning: 'sự thành công, món ăn được ưa chuộng', enDefinition: 'A popular success or widely celebrated creation.', contextSentence: 'The dish quickly became a hit among locals and travelers.' },
      { id: 'ccy-popularize', word: 'popularize', pos: 'verb', ipa: '/ˈpɑː.pjə.lɚ.aɪz/', viMeaning: 'phổ biến hóa', enDefinition: 'To make something widely known, appreciated, or adopted by many people.', contextSentence: 'He opened eateries, helping to popularize the dish throughout the region.' },
      { id: 'ccy-national-specialty', word: 'national specialty', pos: 'noun phrase', ipa: '/ˈnæʃ.ən.əl ˈspeʃ.əl.ti/', viMeaning: 'đặc sản quốc gia', enDefinition: 'A regional delicacy formally honored as a culinary emblem of the nation.', contextSentence: 'Cơm cháy is recognized as an official national specialty.' },
      { id: 'ccy-highlight', word: 'highlight', pos: 'verb', ipa: '/ˈhaɪ.laɪt/', viMeaning: 'làm nổi bật, tôn vinh', enDefinition: 'To emphasize or draw special attention to the best qualities of something.', contextSentence: 'Creativity adapts foreign skills to highlight homeland produce.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Who created Cơm Cháy Ninh Bình in the late 19th century?', options: [{ key: 'A', text: 'Đinh Hoàng Thăng, by combining crispy rice skills with local mountain goat meat' }, { key: 'B', text: 'French colonial governors' }, { key: 'C', text: 'Royal chefs from Huế' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What does the story of Đinh Hoàng Thăng prove about culinary invention?', options: [{ key: 'A', text: 'Creativity happens when foreign skills are adapted to celebrate local homeland produce' }, { key: 'B', text: 'Dishes should never change over centuries' }, { key: 'C', text: 'Cooking requires expensive imported machinery' }], correctKey: 'A' },
    ],
  },
  {
    id: 'com-chay-craft-science',
    titleEn: 'Cơm Cháy 02: How to Make the Perfect Crispy Rice',
    titleVi: 'Cơm Cháy 02: Cách Tạo Ra Lớp Cơm Cháy Giòn Hoàn Hảo',
    summary: 'Learn the food science of blending sticky rice, pressing crusts in thick cast-iron pots, sun-drying, and rapid oil expansion.',
    summaryVi: 'Khám phá bí quyết pha trộn gạo nếp, kỹ thuật ép cháy chảo gang đáy dày, phơi sấy rút ẩm và chiên phồng hạt gạo giòn tan.',
    wordCount: 191,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Making authentic cơm cháy is a precise craft that requires time, patience, and careful temperature management. The foundation of this dish is a blend of sticky rice and premium non-glutinous rice. This specific combination creates a crust that is crunchy on the outside yet pleasantly soft and chewy inside.',
        viText: 'Làm cơm cháy chuẩn vị là một nghề thủ công đòi hỏi thời gian, sự kiên nhẫn và kiểm soát nhiệt độ cẩn thận. Nền tảng của món ăn này là sự pha trộn giữa gạo nếp và gạo tẻ hảo hạng. Tỷ lệ kết hợp đặc biệt này tạo ra một lớp cháy giòn rụm bên ngoài nhưng vẫn giữ được độ mềm dẻo dễ chịu bên trong.',
      },
      {
        orderIndex: 1,
        enText: 'The rice must be cooked in a thick-bottomed cast-iron pot over gentle heat. As the rice steams, cooks press it firmly against the bottom of the hot pot to form a continuous, golden-brown crust. Timing is essential; if the fire is too high, the rice will burn, but if the heat is too weak, the crust will break apart easily.',
        viText: 'Cơm phải được nấu trong chảo gang đáy dày trên lửa nhỏ liu riu. Khi cơm chín tới, người nấu dùng muôi ấn chặt cơm xuống đáy chảo nóng để tạo thành một lớp cháy vàng ươm, liền mạch. Canh thời gian là điều cốt lõi; nếu lửa quá to cơm sẽ bị khét, nhưng nếu lửa quá yếu thì lớp cháy sẽ dễ vỡ vụn.',
      },
      {
        orderIndex: 2,
        enText: 'Once formed, the rice sheets are removed and dried thoroughly under the sun or inside a special dehydrator. Drying removes internal moisture so the grains will puff up evenly when exposed to hot cooking oil later.',
        viText: 'Sau khi tạo hình, các tảng cơm cháy được lấy ra và phơi thật khô dưới ánh nắng mặt trời hoặc trong máy sấy chuyên dụng. Việc sấy khô giúp loại bỏ hoàn toàn độ ẩm bên trong để các hạt gạo nở phồng đều khi thả vào dầu nóng sau này.',
      },
      {
        orderIndex: 3,
        enText: 'When an order arrives, the dried rice is dropped into boiling oil for just a few seconds. The grains expand instantly, creating light, golden tiles with a distinctive crackling texture. This careful balance of moisture extraction and rapid frying is the real secret behind the signature crunch.',
        viText: 'Khi có khách gọi món, tảng cơm khô được thả vào chảo dầu sôi chỉ trong vài giây. Hạt gạo lập tức nở bung ra, tạo thành những miếng cơm vàng óng với kết cấu giòn tan đặc trưng. Sự cân bằng cẩn trọng giữa việc rút ẩm và chiên nhanh chính là bí quyết thực sự đằng sau độ giòn trứ danh này.',
      },
    ],
    vocabularies: [
      { id: 'ccs-precise-craft', word: 'precise craft', pos: 'noun phrase', ipa: '/prəˈsaɪs kræft/', viMeaning: 'nghề thủ công chuẩn xác', enDefinition: 'An artisanal skill that demands exact methods and careful timing.', contextSentence: 'Making authentic cơm cháy is a precise craft requiring patience.' },
      { id: 'ccs-blend', word: 'blend', pos: 'noun', ipa: '/blend/', viMeaning: 'sự pha trộn, kết hợp', enDefinition: 'A harmonious mixture of different varieties or components.', contextSentence: 'The foundation is a blend of sticky rice and non-glutinous rice.' },
      { id: 'ccs-crust', word: 'crust', pos: 'noun', ipa: '/krʌst/', viMeaning: 'lớp vỏ, lớp cháy', enDefinition: 'The hardened, crisp outer layer of cooked or baked food.', contextSentence: 'This combination creates a crust that is crunchy yet chewy.' },
      { id: 'ccs-cast-iron-pot', word: 'cast-iron pot', pos: 'noun phrase', ipa: '/ˌkæst ˈaɪ.ɚn ˌpɑːt/', viMeaning: 'nồi gang, chảo gang', enDefinition: 'A heavy metal pot capable of retaining and radiating heat evenly.', contextSentence: 'The rice must be cooked in a thick-bottomed cast-iron pot.' },
      { id: 'ccs-continuous', word: 'continuous', pos: 'adjective', ipa: '/kənˈtɪn.ju.əs/', viMeaning: 'liền mạch, liên tục', enDefinition: 'Forming an unbroken whole without gaps or interruptions.', contextSentence: 'Cooks press the rice to form a continuous, golden-brown crust.' },
      { id: 'ccs-break-apart', word: 'break apart', pos: 'phrasal verb', ipa: '/breɪk əˈpɑːrt/', viMeaning: 'vỡ vụn, nứt gãy', enDefinition: 'To separate or crumble into pieces unexpectedly.', contextSentence: 'If heat is too weak, the crust will break apart easily.' },
      { id: 'ccs-dehydrator', word: 'dehydrator', pos: 'noun', ipa: '/diːˈhaɪ.dreɪ.t̬ɚ/', viMeaning: 'máy sấy khô', enDefinition: 'An appliance that removes water and moisture from food items.', contextSentence: 'Rice sheets are dried under the sun or in a dehydrator.' },
      { id: 'ccs-moisture', word: 'moisture', pos: 'noun', ipa: '/ˈmɔɪs.tʃɚ/', viMeaning: 'độ ẩm', enDefinition: 'Liquid diffused or condensed in a substance.', contextSentence: 'Drying removes internal moisture from the rice grains.' },
      { id: 'ccs-puff-up', word: 'puff up', pos: 'phrasal verb', ipa: '/pʌf ʌp/', viMeaning: 'nở phồng ra', enDefinition: 'To expand or swell rapidly when heated in hot liquid or air.', contextSentence: 'The grains puff up evenly when exposed to hot cooking oil.' },
      { id: 'ccs-crackling-texture', word: 'crackling texture', pos: 'noun phrase', ipa: '/ˈkræk.lɪŋ ˈteks.tʃɚ/', viMeaning: 'kết cấu giòn rụm, giòn tan', enDefinition: 'A pleasantly crisp consistency that snaps audibly when bitten.', contextSentence: 'Frying creates golden tiles with a distinctive crackling texture.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Why must the cooked rice crust be thoroughly dried before frying?', options: [{ key: 'A', text: 'To remove internal moisture so the grains will puff up evenly in boiling oil' }, { key: 'B', text: 'To preserve it for years without cooking' }, { key: 'C', text: 'To turn the rice sweet' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What cooking vessel is used to form a solid, unbroken rice crust?', options: [{ key: 'A', text: 'A thick-bottomed cast-iron pot over gentle heat' }, { key: 'B', text: 'A plastic microwave dish' }, { key: 'C', text: 'A thin glass baking pan' }], correctKey: 'A' },
    ],
  },
  {
    id: 'com-chay-savory-symphony',
    titleEn: 'Cơm Cháy 03: A Symphony of Sound and Savory Flavors',
    titleVi: 'Cơm Cháy 03: Bản Giao Hưởng Của Âm Thanh Và Hương Vị Đậm Đà',
    summary: 'Experience the multi-sensory contrast of hot goat and kidney sauce poured over freshly fried rice with a dramatic sizzle.',
    summaryVi: 'Trải nghiệm đa giác quan khi rưới nước xốt dê núi, tim cật sôi sùng sục lên đĩa cơm cháy tạo tiếng xèo xèo giòn giã đầy kích thích.',
    wordCount: 185,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Eating traditional cơm cháy in Ninh Bình is a multi-sensory culinary adventure. Unlike commercial packaged versions topped simply with dried pork floss, eating authentic cơm cháy in a local restaurant involves a steaming bowl of hot savory dipping sauce, creating an exciting contrast of temperatures and textures.',
        viText: 'Thưởng thức cơm cháy truyền thống tại Ninh Bình là một trải nghiệm ẩm thực đa giác quan. Khác với các phiên bản đóng gói thương mại chỉ rắc ruốc thịt heo đơn giản, việc ăn cơm cháy chuẩn vị tại quán địa phương luôn đi kèm một bát nước xốt đậm đà nóng hổi, tạo nên sự đối lập đầy thú vị về cả nhiệt độ lẫn kết cấu.',
      },
      {
        orderIndex: 1,
        enText: 'The signature sauce is typically made from tender goat meat, beef heart, kidney, and local vegetables like carrots and mushrooms. The meat and organs are stir-fried quickly with garlic, scallions, and fish sauce before being thickened into a rich, glossy gravy. This savory liquid carries the natural sweetness of mountain-raised meat.',
        viText: 'Phần nước xốt đặc trưng thường được nấu từ thịt dê mềm, tim cật bò và các loại rau củ địa phương như cà rốt, nấm. Thịt và nội tạng được xào nhanh với tỏi, hành lá và nước mắm trước khi được làm sánh thành lớp xốt óng ả, đậm đà. Thứ nước xốt này mang trọn vị ngọt tự nhiên của thịt dê nuôi trên núi đá.',
      },
      {
        orderIndex: 2,
        enText: 'When the boiling sauce is poured over the freshly fried rice plate, it creates a loud, dramatic sizzle that delights every diner at the table. The warm, thick broth slowly softens the crispy edges of the rice without completely destroying its crunchiness.',
        viText: 'Khi nước xốt sôi sùng sục được rưới lên đĩa cơm vừa chiên nóng, nó tạo ra tiếng xèo xèo giòn giã đầy kích thích khiến mọi thực khách trên bàn đều thích thú. Nước xốt ấm nóng, sánh sệt làm mềm nhẹ phần rìa của miếng cơm mà không hề phá hỏng độ giòn rụm vốn có.',
      },
      {
        orderIndex: 3,
        enText: 'Every mouthful delivers an incredible balance: the crunchy texture of the rice, the tender chewiness of goat meat, and the rich umami of the brown sauce. This pairing turns ordinary rice into an unforgettable feast that keeps visitors coming back to Ninh Bình.',
        viText: 'Mỗi miếng ăn mang lại một sự cân bằng tuyệt vời: độ giòn tan của cơm, độ mềm ngọt của thịt dê và vị umami đậm đà của nước xốt nâu sánh. Sự kết hợp hoàn hảo này biến hạt cơm bình dị thành một bữa tiệc khó quên khiến du khách luôn muốn quay lại Ninh Bình.',
      },
    ],
    vocabularies: [
      { id: 'css-multi-sensory', word: 'multi-sensory', pos: 'adjective', ipa: '/ˌmʌl.tiˈsen.sɚ.i/', viMeaning: 'đa giác quan', enDefinition: 'Involving or stimulating several bodily senses at the same time.', contextSentence: 'Eating traditional cơm cháy is a multi-sensory adventure.' },
      { id: 'css-pork-floss', word: 'pork floss', pos: 'noun phrase', ipa: '/pɔːrk flɑːs/', viMeaning: 'chà bông, ruốc thịt heo', enDefinition: 'Dried shredded pork with a light, fluffy cotton-like texture.', contextSentence: 'Packaged versions are simply topped with dried pork floss.' },
      { id: 'css-kidney', word: 'kidney', pos: 'noun', ipa: '/ˈkɪd.ni/', viMeaning: 'cật (thận động vật)', enDefinition: 'An edible organ used in Vietnamese savory stir-fries and gravies.', contextSentence: 'The sauce is made from tender goat meat, beef heart, and kidney.' },
      { id: 'css-glossy-gravy', word: 'glossy gravy', pos: 'noun phrase', ipa: '/ˈɡlɑː.si ˈɡreɪ.vi/', viMeaning: 'nước xốt sánh óng ả', enDefinition: 'A smooth, shiny, thickened savory sauce with deep luster.', contextSentence: 'Ingredients are thickened into a rich, glossy gravy.' },
      { id: 'css-dramatic-sizzle', word: 'dramatic sizzle', pos: 'noun phrase', ipa: '/drəˈmæt̬.ɪk ˈsɪz.əl/', viMeaning: 'tiếng xèo xèo sống động, giòn giã', enDefinition: 'A loud, exciting hissing noise produced when hot sauce meets fried rice.', contextSentence: 'Pouring the boiling sauce creates a loud, dramatic sizzle.' },
      { id: 'css-crispy-edges', word: 'crispy edges', pos: 'plural noun', ipa: '/ˈkrɪs.pi ˈedʒ.ɪz/', viMeaning: 'phần rìa giòn', enDefinition: 'The crunchiest border parts of fried or roasted food.', contextSentence: 'The warm broth slowly softens the crispy edges of the rice.' },
      { id: 'css-mouthful', word: 'mouthful', pos: 'noun', ipa: '/ˈmaʊθ.fʊl/', viMeaning: 'miếng ăn, ngụm thức ăn', enDefinition: 'An amount of food that comfortably fills the mouth.', contextSentence: 'Every mouthful delivers an incredible balance of crunch and umami.' },
      { id: 'css-incredible-balance', word: 'incredible balance', pos: 'noun phrase', ipa: '/ɪnˈkred.ə.bəl ˈbæl.əns/', viMeaning: 'sự cân bằng khó tin, tuyệt vời', enDefinition: 'An extraordinarily pleasing harmony of contrasting flavors and textures.', contextSentence: 'Enjoy an incredible balance of crunchy rice and tender meat.' },
      { id: 'css-pairing', word: 'pairing', pos: 'noun', ipa: '/ˈper.ɪŋ/', viMeaning: 'sự ghép đôi, kết hợp', enDefinition: 'A thoughtful combination of two foods that enhance each other.', contextSentence: 'This pairing turns ordinary rice into an unforgettable feast.' },
      { id: 'css-unforgettable-feast', word: 'unforgettable feast', pos: 'noun phrase', ipa: '/ˌʌn.fɚˈɡet̬.ə.bəl fiːst/', viMeaning: 'bữa tiệc khó quên', enDefinition: 'A memorable meal providing remarkable pleasure and satisfaction.', contextSentence: 'Visitors return to Ninh Bình for this unforgettable feast.' },
    ],
    questions: [
      { orderIndex: 0, question: 'What accompanies authentic restaurant cơm cháy in Ninh Bình?', options: [{ key: 'A', text: 'A steaming bowl of hot savory sauce made from goat meat, heart, kidney, and vegetables' }, { key: 'B', text: 'Sweet chocolate cream' }, { key: 'C', text: 'Cold fruit salad' }], correctKey: 'A' },
      { orderIndex: 1, question: 'What sensory experience happens when the boiling sauce is poured onto the rice?', options: [{ key: 'A', text: 'A loud, dramatic sizzle that delights diners while preserving the crust’s crunchiness' }, { key: 'B', text: 'The rice completely burns black' }, { key: 'C', text: 'The plate turns cold instantly' }], correctKey: 'A' },
    ],
  },
];

export const COM_CHAY_SERIES_ARTICLES: ReaderArticleData[] = chapters.map(chapter => ({
  ...chapter,
  topic: 'Ẩm thực',
  region: 'Ninh Bình',
  level: 'Level 2',
  cefrLevel: 'B1',
  readTime: '3 phút đọc',
  imageUrl,
  vocabMap: Object.fromEntries(chapter.vocabularies.map(item => [item.word.toLowerCase(), item])),
}));

export const COM_CHAY_SERIES: ArticleSeries = {
  metadata: COM_CHAY_SERIES_METADATA,
  articles: COM_CHAY_SERIES_ARTICLES,
};
