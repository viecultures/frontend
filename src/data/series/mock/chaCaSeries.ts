import type { ReaderArticleData } from '@/features/reader/services/readerApiService';
import type { ArticleSeries, SeriesMetadata } from '../types';

const imageUrl = '/images/series/cha-ca-la-vong.webp';

export const CHA_CA_SERIES_METADATA: SeriesMetadata = {
  id: 'cha-ca-la-vong',
  title: 'Chả Cá Lã Vọng in Hanoi',
  titleVi: 'Chả Cá Lã Vọng Hà Nội',
  theme: 'cuisine',
  provinceId: 'ha-noi',
  region: 'north',
  description: 'Explore the 1871 origin, interactive tabletop cooking, dill-turmeric pairing, and five elements balance of Hanoi’s iconic fish specialty.',
  imageUrl,
  status: 'published',
  chapters: [
    {
      id: 'cha-ca-legend-history',
      order: 1,
      titleEn: 'Chả Cá 01: Chả Cá Lã Vọng: A Dish Named After a Legend',
      titleVi: 'Chả Cá 01: Chả Cá Lã Vọng: Món Ăn Mang Tên Một Huyền Thoại',
      summary: 'Discover the 1871 origin of the Đoàn family on Hàng Sơn Street, the patriotic fighters, and why a street was named after the dish.',
      summaryVi: 'Khám phá nguồn gốc năm 1871 của gia tộc họ Đoàn trên phố Hàng Sơn, nghĩa sĩ yêu nước và lý do một con phố được đặt tên theo món ăn.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'cha-ca-table-experience',
      order: 2,
      titleEn: 'Chả Cá 02: The Art of Dining at a Chả Cá Table',
      titleVi: 'Chả Cá 02: Nghệ Thuật Thưởng Thức Trên Bàn Tiệc Chả Cá',
      summary: 'Experience the interactive tabletop cooking with sizzling catfish, fresh dill, crunchy peanuts, and whisked shrimp paste.',
      summaryVi: 'Trải nghiệm nấu ăn tương tác tại bàn với chảo cá lăng xèo xèo, rau thì là thơm nức, lạc rang giòn và mắm tôm đánh sủi bọt.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
    {
      id: 'cha-ca-dill-harmony',
      order: 3,
      titleEn: 'Chả Cá 03: Why Dill and Turmeric Make Chả Cá Unique',
      titleVi: 'Chả Cá 03: Vì Sao Thì Là Và Nghệ Tạo Nên Sự Độc Đáo Cho Chả Cá',
      summary: 'Explore the digestive balance of dill with river fish and the visual harmony of five elements in Tràng An cuisine.',
      summaryVi: 'Khám phá tính cân bằng tiêu hóa của thì là với cá sông và sự hài hòa thị giác theo thuyết ngũ hành trong ẩm thực Tràng An.',
      readTime: '3 min read',
      cefrLevel: 'B1',
    },
  ],
};

const chapters = [
  {
    id: 'cha-ca-legend-history',
    titleEn: 'Chả Cá 01: Chả Cá Lã Vọng: A Dish Named After a Legend',
    titleVi: 'Chả Cá 01: Chả Cá Lã Vọng: Món Ăn Mang Tên Một Huyền Thoại',
    summary: 'Discover the 1871 origin of the Đoàn family on Hàng Sơn Street, the patriotic fighters, and why a street was named after the dish.',
    summaryVi: 'Khám phá nguồn gốc năm 1871 của gia tộc họ Đoàn trên phố Hàng Sơn, nghĩa sĩ yêu nước và lý do một con phố được đặt tên theo món ăn.',
    wordCount: 189,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Chả cá Lã Vọng is one of the oldest and most legendary dishes in Hanoi. The dish was first created in 1871 by the Đoàn family living on Hàng Sơn Street. During the French colonial period, their home was a secret meeting place for patriotic fighters. To welcome these guests, the family invented a special fried fish recipe that quickly became popular.',
        viText: 'Chả cá Lã Vọng là một trong những món ăn lâu đời và mang tính huyền thoại nhất ở Hà Nội. Món ăn được gia tộc họ Đoàn sống trên phố Hàng Sơn sáng tạo lần đầu vào năm 1871. Trong thời kỳ Pháp thuộc, ngôi nhà của họ là điểm hẹn bí mật của các nghĩa sĩ yêu nước. Để tiếp đãi những vị khách này, gia đình đã nghĩ ra công thức làm món cá rán đặc biệt và nhanh chóng được ưa chuộng.',
      },
      {
        orderIndex: 1,
        enText: 'Outside the restaurant, the family placed a small statue of Lã Vọng, an ancient wise man holding a fishing rod. He was a symbol of patience and waiting for the right moment to serve his country. Diners were deeply impressed by this wooden statue, so they began calling the food "Chả cá Lã Vọng."',
        viText: 'Bên ngoài quán ăn, gia đình đặt bức tượng nhỏ hình Lã Vọng, một vị hiền triết xưa đang cầm cần câu cá. Ông là biểu tượng của sự kiên nhẫn và chờ đợi thời cơ chín muồi để giúp nước. Thực khách vô cùng ấn tượng với bức tượng gỗ này, vì thế họ bắt đầu gọi món ăn là "Chả cá Lã Vọng".',
      },
      {
        orderIndex: 2,
        enText: 'The dish became so famous that the colonial government eventually renamed Hàng Sơn Street to Chả Cá Street. This is an unusual event in Hanoi’s history, as a street was officially named after a local specialty.',
        viText: 'Món ăn trở nên nổi tiếng đến mức chính quyền thời bấy giờ cuối cùng đã đổi tên phố Hàng Sơn thành phố Chả Cá. Đây là một sự kiện hiếm hoi trong lịch sử Hà Nội, khi một con phố được chính thức đặt tên theo một món ăn đặc sản địa phương.',
      },
      {
        orderIndex: 3,
        enText: 'Today, after more than a century, the original family restaurant still welcomes guests at 14 Chả Cá Street. It remains a proud symbol of Hanoi’s heritage, showing how food and history can blend together in daily life.',
        viText: 'Ngày nay, sau hơn một thế kỷ, quán ăn gốc của gia đình vẫn đón khách tại số 14 phố Chả Cá. Nơi đây vẫn là một biểu tượng đáng tự hào của di sản Hà Nội, minh chứng cho sự hòa quyện giữa ẩm thực và lịch sử trong đời sống thường nhật.',
      },
    ],
    vocabularies: [
      { id: 'cc-legendary', word: 'legendary', pos: 'adjective', ipa: '/ˈledʒ.ən.der.i/', viMeaning: 'mang tính huyền thoại', enDefinition: 'Remarkable enough to be famous; very well known in history or tradition.', contextSentence: 'Chả cá Lã Vọng is one of the oldest and most legendary dishes in Hanoi.' },
      { id: 'cc-colonial-period', word: 'colonial period', pos: 'noun phrase', ipa: '/kəˈloʊ.ni.əl ˌpɪr.i.əd/', viMeaning: 'thời kỳ thuộc địa', enDefinition: 'The historical era when a country was ruled by a foreign colonial power.', contextSentence: 'During the French colonial period, their home was a secret meeting place.' },
      { id: 'cc-patriotic-fighter', word: 'patriotic fighter', pos: 'noun phrase', ipa: '/ˌpeɪ.triˈɑː.t̬ɪk ˈfaɪ.t̬ɚ/', viMeaning: 'nghĩa sĩ yêu nước', enDefinition: 'A person fighting with deep love and devotion for their country’s freedom.', contextSentence: 'Their home was a meeting place for patriotic fighters.' },
      { id: 'cc-fishing-rod', word: 'fishing rod', pos: 'noun phrase', ipa: '/ˈfɪʃ.ɪŋ ˌrɑːd/', viMeaning: 'cần câu cá', enDefinition: 'A long, flexible pole used with a line for catching fish.', contextSentence: 'The statue showed an ancient wise man holding a fishing rod.' },
      { id: 'cc-symbol-of-patience', word: 'symbol of patience', pos: 'noun phrase', ipa: '/ˈsɪm.bəl əv ˈpeɪ.ʃəns/', viMeaning: 'biểu tượng của sự kiên nhẫn', enDefinition: 'An image or figure representing endurance and waiting for the right moment.', contextSentence: 'He was a symbol of patience and waiting for the right moment.' },
      { id: 'cc-deeply-impressed', word: 'be deeply impressed', pos: 'verb phrase', ipa: '/biː ˈdiːp.li ɪmˈprest/', viMeaning: 'vô cùng ấn tượng', enDefinition: 'Feeling great admiration, respect, or interest in something remarkable.', contextSentence: 'Diners were deeply impressed by this wooden statue.' },
      { id: 'cc-rename', word: 'rename', pos: 'verb', ipa: '/ˌriːˈneɪm/', viMeaning: 'đổi tên', enDefinition: 'To give a new name to someone or something.', contextSentence: 'The government eventually renamed Hàng Sơn Street to Chả Cá Street.' },
      { id: 'cc-specialty', word: 'specialty', pos: 'noun', ipa: '/ˈspeʃ.əl.ti/', viMeaning: 'đặc sản', enDefinition: 'A distinctive product or dish characteristic of a specific place.', contextSentence: 'A street was officially named after a local specialty.' },
      { id: 'cc-original', word: 'original', pos: 'adjective', ipa: '/əˈrɪdʒ.ən.əl/', viMeaning: 'nguyên bản, gốc', enDefinition: 'Present or existing from the beginning; the earliest version.', contextSentence: 'The original family restaurant still welcomes guests at 14 Chả Cá Street.' },
      { id: 'cc-blend-together', word: 'blend together', pos: 'phrasal verb', ipa: '/blend təˈɡeð.ɚ/', viMeaning: 'hòa quyện cùng nhau', enDefinition: 'To combine harmoniously into a unified whole.', contextSentence: 'Food and history blend together in Hanoi’s daily life.' },
    ],
    questions: [
      { orderIndex: 0, question: 'When and by whom was Chả cá Lã Vọng first created?', options: [{ key: 'A', text: 'In 1871 by the Đoàn family on Hàng Sơn Street' }, { key: 'B', text: 'In 1954 by French chefs' }, { key: 'C', text: 'In the 15th century by royal palace cooks' }], correctKey: 'A' },
      { orderIndex: 1, question: 'Why was Hàng Sơn Street renamed to Chả Cá Street?', options: [{ key: 'A', text: 'Because fish trading was banned there' }, { key: 'B', text: 'Because the dish became so famous that the street was named after the specialty' }, { key: 'C', text: 'Because fishermen lived on the street' }], correctKey: 'B' },
    ],
  },
  {
    id: 'cha-ca-table-experience',
    titleEn: 'Chả Cá 02: The Art of Dining at a Chả Cá Table',
    titleVi: 'Chả Cá 02: Nghệ Thuật Thưởng Thức Trên Bàn Tiệc Chả Cá',
    summary: 'Experience the interactive tabletop cooking with sizzling catfish, fresh dill, crunchy peanuts, and whisked shrimp paste.',
    summaryVi: 'Trải nghiệm nấu ăn tương tác tại bàn với chảo cá lăng xèo xèo, rau thì là thơm nức, lạc rang giòn và mắm tôm đánh sủi bọt.',
    wordCount: 202,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Eating Chả cá Lã Vọng is completely different from enjoying ordinary street food. It is an interactive cooking experience right at your table. Instead of receiving a finished bowl, customers sit around a small sizzling stove, watching the fish cook gently in hot oil before their eyes.',
        viText: 'Thưởng thức Chả cá Lã Vọng hoàn toàn khác biệt so với việc ăn các món đường phố thông thường. Đây là một trải nghiệm nấu ăn tương tác ngay tại bàn của bạn. Thay vì nhận một bát đồ ăn đã hoàn thiện, thực khách ngồi quây quần quanh một chiếc chảo xèo xèo trên bếp nhỏ, ngắm nhìn những miếng cá chín từ từ trong dầu nóng ngay trước mắt.',
      },
      {
        orderIndex: 1,
        enText: 'The fish chunks are prepared from hemibagrus, known as cá lăng, a river fish famous for firm and sweet meat without fine bones. The fish is cut into bite-sized pieces, marinated with turmeric, galangal, and fermented rice, which gives the meat a brilliant golden color and a fragrant scent.',
        viText: 'Những miếng cá được chế biến từ cá lăng, một loài cá sông nổi tiếng với thớ thịt săn chắc, ngọt bùi và không có xương dăm. Cá được cắt thành từng miếng vừa ăn, ướp với nghệ, riềng và mẻ, mang lại cho miếng thịt màu vàng óng ả cùng hương thơm lừng.',
      },
      {
        orderIndex: 2,
        enText: 'When the oil heats up, diners drop large handfuls of fresh dill and green scallions into the pan. As the herbs cook, their strong herbal aroma mixes with the rich fish fat. Watching the green vegetables soften beside the bright yellow fish creates an exciting show of sound and color.',
        viText: 'Khi dầu sôi lăn tăn, thực khách thả những nắm thì là tươi và hành hoa vào chảo. Khi rau chín tới, mùi thảo mộc thơm nồng quyện vào mỡ cá béo ngậy. Việc nhìn những cọng rau xanh mướt mềm dần bên cạnh từng miếng cá vàng ruộm tạo nên màn trình diễn đầy cuốn hút về cả âm thanh lẫn màu sắc.',
      },
      {
        orderIndex: 3,
        enText: 'To eat, you place fresh rice noodles in a bowl, add a piece of crispy fish, and top it with cooked dill and crunchy roasted peanuts. Finally, you drizzle a spoonful of whisked shrimp paste with lime juice over the bowl. The complex combination of savory, tangy, and herbal tastes is unlike anything else in Vietnamese cuisine.',
        viText: 'Để thưởng thức, bạn gắp bún tươi vào bát, đặt miếng cá giòn thơm lên trên, thêm thì là xào chín và rắc đậu phộng rang giòn rụm. Cuối cùng, bạn rưới một thìa mắm tôm đã đánh sủi bọt cùng nước cốt chanh. Sự hòa trộn phức hợp giữa vị đậm đà, chua thanh và hương thảo mộc không giống bất kỳ món nào khác trong ẩm thực Việt Nam.',
      },
    ],
    vocabularies: [
      { id: 'cc-interactive', word: 'interactive', pos: 'adjective', ipa: '/ˌɪn.t̬ɚˈæk.tɪv/', viMeaning: 'có tính tương tác', enDefinition: 'Allowing two-way involvement and active participation from people.', contextSentence: 'It is an interactive cooking experience right at your table.' },
      { id: 'cc-sizzling-stove', word: 'sizzling stove', pos: 'noun phrase', ipa: '/ˈsɪz.əl.ɪŋ ˌstoʊv/', viMeaning: 'bếp lò kêu xèo xèo', enDefinition: 'A portable burner making a continuous hissing frying sound.', contextSentence: 'Customers sit around a small sizzling stove.' },
      { id: 'cc-firm-meat', word: 'firm meat', pos: 'noun phrase', ipa: '/fɝːm miːt/', viMeaning: 'thịt săn chắc', enDefinition: 'Meat that is solid, dense, and holds its shape well when cooked.', contextSentence: 'Cá lăng is famous for firm and sweet meat without fine bones.' },
      { id: 'cc-marinate', word: 'marinate', pos: 'verb', ipa: '/ˈmer.ə.neɪt/', viMeaning: 'tẩm ướp', enDefinition: 'To soak food in seasoned liquid or spices before cooking.', contextSentence: 'The fish is marinated with turmeric, galangal, and fermented rice.' },
      { id: 'cc-turmeric', word: 'turmeric', pos: 'noun', ipa: '/ˈtɝː.mər.ɪk/', viMeaning: 'củ nghệ', enDefinition: 'A bright yellow aromatic powder or root used for flavor and coloring.', contextSentence: 'Turmeric gives the meat a brilliant golden color.' },
      { id: 'cc-handful', word: 'handful', pos: 'noun', ipa: '/ˈhænd.fʊl/', viMeaning: 'một nắm', enDefinition: 'A quantity that fills the hand.', contextSentence: 'Diners drop large handfuls of fresh dill into the pan.' },
      { id: 'cc-dill', word: 'dill', pos: 'noun', ipa: '/dɪl/', viMeaning: 'rau thì là', enDefinition: 'An aromatic herb with fine feathery green leaves.', contextSentence: 'Fresh dill softens beside the bright yellow fish.' },
      { id: 'cc-crunchy-roasted-peanut', word: 'crunchy roasted peanut', pos: 'noun phrase', ipa: '/ˌkrʌn.tʃi ˈroʊ.stɪd ˌpiː.nʌt/', viMeaning: 'đậu phộng / lạc rang giòn', enDefinition: 'Peanuts baked or toasted until crisp and aromatic.', contextSentence: 'Top the bowl with crunchy roasted peanuts.' },
      { id: 'cc-drizzle', word: 'drizzle', pos: 'verb', ipa: '/ˈdrɪz.əl/', viMeaning: 'rưới nhẹ', enDefinition: 'To pour a thin stream of liquid gently over food.', contextSentence: 'You drizzle a spoonful of whisked shrimp paste over the bowl.' },
      { id: 'cc-whisked-shrimp-paste', word: 'whisked shrimp paste', pos: 'noun phrase', ipa: '/wɪskt ˈʃrɪmp ˌpeɪst/', viMeaning: 'mắm tôm đánh sủi bọt', enDefinition: 'Fermented shrimp condiment beaten briskly with lime and sugar until foamy.', contextSentence: 'Whisked shrimp paste gives a complex savory and tangy taste.' },
    ],
    questions: [
      { orderIndex: 0, question: 'What kind of fish is traditionally used in Chả cá Lã Vọng?', options: [{ key: 'A', text: 'Cá lăng (hemibagrus), known for firm and sweet meat without fine bones' }, { key: 'B', text: 'Saltwater tuna' }, { key: 'C', text: 'Small dried fish' }], correctKey: 'A' },
      { orderIndex: 1, question: 'Which condiment completes the flavor profile of a chả cá bowl?', options: [{ key: 'A', text: 'Whisked shrimp paste with fresh lime juice' }, { key: 'B', text: 'Sweet ketchup' }, { key: 'C', text: 'Cold cheese sauce' }], correctKey: 'A' },
    ],
  },
  {
    id: 'cha-ca-dill-harmony',
    titleEn: 'Chả Cá 03: Why Dill and Turmeric Make Chả Cá Unique',
    titleVi: 'Chả Cá 03: Vì Sao Thì Là Và Nghệ Tạo Nên Sự Độc Đáo Cho Chả Cá',
    summary: 'Explore the digestive balance of dill with river fish and the visual harmony of five elements in Tràng An cuisine.',
    summaryVi: 'Khám phá tính cân bằng tiêu hóa của thì là với cá sông và sự hài hòa thị giác theo thuyết ngũ hành trong ẩm thực Tràng An.',
    wordCount: 183,
    paragraphs: [
      {
        orderIndex: 0,
        enText: 'Vietnamese cuisine uses hundreds of fragrant herbs, but Chả cá Lã Vọng is one of the rare traditional recipes where dill plays the leading role. Dill is usually added in small amounts to fish soup, but in this iconic dish, it is treated like a main vegetable that covers the entire pan.',
        viText: 'Ẩm thực Việt Nam sử dụng hàng trăm loại rau thơm, nhưng Chả cá Lã Vọng là một trong những món ăn truyền thống hiếm hoi mà rau thì là đóng vai trò chủ đạo. Thì là thường chỉ được thêm vào một lượng nhỏ trong các món canh cá, nhưng ở món ăn biểu tượng này, nó được dùng như một loại rau chính phủ kín toàn bộ mặt chảo.',
      },
      {
        orderIndex: 1,
        enText: 'The secret behind this pairing lies in natural balance. River fish can sometimes have a muddy flavor, but the fresh, sweet herbal notes of dill completely remove this problem. Along with fresh scallions, warm dill helps warm the stomach and aids digestion after eating oily food.',
        viText: 'Bí mật đằng sau sự kết hợp này nằm ở tính cân bằng tự nhiên. Cá sông đôi khi có mùi tanh của bùn đất, nhưng vị thảo mộc ngọt mát và tươi mới của thì là sẽ triệt tiêu hoàn toàn nhược điểm này. Cùng với hành hoa tươi, tính ấm của thì là giúp làm ấm bụng và hỗ trợ tiêu hóa sau khi thưởng thức món ăn có dầu mỡ.',
      },
      {
        orderIndex: 2,
        enText: 'The visual beauty of the dish also follows the traditional concept of five elements. Golden fish colored by natural turmeric represents Earth, vibrant green herbs represent Wood, and snowy white rice noodles symbolize Metal. Deep purple shrimp paste and red chili slices complete the harmony of colors and nutritional balance.',
        viText: 'Vẻ đẹp thị giác của món ăn cũng tuân theo triết lý ngũ hành truyền thống. Miếng cá vàng ươm nhuộm màu nghệ tự nhiên tượng trưng cho hành Thổ, rau xanh mướt tượng trưng cho hành Mộc, và những sợi bún trắng ngần biểu trưng cho hành Kim. Bát mắm tôm màu tím thẫm cùng những lát ớt đỏ tươi hoàn thiện sự hài hòa về sắc màu lẫn cân bằng dinh dưỡng.',
      },
      {
        orderIndex: 3,
        enText: 'Through this thoughtful arrangement of ingredients, the people of Hanoi turned an everyday river fish into a refined specialty. It demonstrates how traditional cooking uses natural medicine principles to make heavy meals feel refreshing and wholesome.',
        viText: 'Nhờ sự sắp đặt nguyên liệu đầy dụng ý này, người Hà Nội đã biến một con cá sông bình dị thành một món đặc sản tao nhã. Món ăn chứng minh cách người xưa vận dụng các nguyên lý y học tự nhiên để một bữa ăn nhiều dầu mỡ vẫn mang lại cảm giác thanh mát và lành mạnh.',
      },
    ],
    vocabularies: [
      { id: 'cc-rare-recipe', word: 'rare recipe', pos: 'noun phrase', ipa: '/rer ˈres.ə.pi/', viMeaning: 'công thức hiếm thấy', enDefinition: 'An uncommon or exceptional culinary preparation method.', contextSentence: 'It is one of the rare traditional recipes where dill plays the leading role.' },
      { id: 'cc-leading-role', word: 'play the leading role', pos: 'verb phrase', ipa: '/pleɪ ðə ˈliː.dɪŋ roʊl/', viMeaning: 'đóng vai trò chủ đạo', enDefinition: 'To serve as the principal or most important element.', contextSentence: 'Dill plays the leading role in this iconic dish.' },
      { id: 'cc-pairing', word: 'pairing', pos: 'noun', ipa: '/ˈper.ɪŋ/', viMeaning: 'sự ghép đôi, sự kết hợp', enDefinition: 'The combination of two complementary items or ingredients.', contextSentence: 'The secret behind this pairing lies in natural balance.' },
      { id: 'cc-muddy-flavor', word: 'muddy flavor', pos: 'noun phrase', ipa: '/ˈmʌd.i ˌfleɪ.vɚ/', viMeaning: 'mùi tanh bùn (của cá nước ngọt)', enDefinition: 'An earthy, unpleasant odor or taste sometimes found in freshwater fish.', contextSentence: 'Herbal notes of dill completely remove any muddy flavor.' },
      { id: 'cc-herbal-note', word: 'herbal note', pos: 'noun phrase', ipa: '/ˈɝː.bəl noʊt/', viMeaning: 'nốt hương thảo mộc', enDefinition: 'A distinct aromatic characteristic originating from fresh herbs.', contextSentence: 'Fresh, sweet herbal notes of dill eliminate fishiness.' },
      { id: 'cc-digestion', word: 'digestion', pos: 'noun', ipa: '/daɪˈdʒes.tʃən/', viMeaning: 'hệ tiêu hóa, sự tiêu hóa', enDefinition: 'The process of breaking down food in the stomach.', contextSentence: 'Warm dill aids digestion after eating oily food.' },
      { id: 'cc-five-elements', word: 'five elements', pos: 'noun phrase', ipa: '/faɪv ˈel.ə.mənts/', viMeaning: 'thuyết Ngũ hành', enDefinition: 'The ancient philosophical system of Metal, Wood, Water, Fire, and Earth.', contextSentence: 'The visual beauty of the dish follows the concept of five elements.' },
      { id: 'cc-harmony', word: 'harmony', pos: 'noun', ipa: '/ˈhɑːr.mə.ni/', viMeaning: 'sự hài hòa', enDefinition: 'A pleasing combination of different elements in proper agreement.', contextSentence: 'The colors create a harmony and nutritional balance.' },
      { id: 'cc-refined-specialty', word: 'refined specialty', pos: 'noun phrase', ipa: '/rɪˈfaɪnd ˈspeʃ.əl.ti/', viMeaning: 'đặc sản tao nhã, tinh tế', enDefinition: 'A sophisticated and culturally polished regional culinary creation.', contextSentence: 'Hanoi people turned river fish into a refined specialty.' },
      { id: 'cc-wholesome', word: 'wholesome', pos: 'adjective', ipa: '/ˈhoʊl.səm/', viMeaning: 'bổ dưỡng, lành mạnh', enDefinition: 'Good for physical health and well-being.', contextSentence: 'It makes oily meals feel refreshing and wholesome.' },
    ],
    questions: [
      { orderIndex: 0, question: 'Why is dill used so generously in Chả cá Lã Vọng?', options: [{ key: 'A', text: 'Its fresh herbal notes eliminate muddy fish odors and aid digestion' }, { key: 'B', text: 'To color the soup green' }, { key: 'C', text: 'Because dill was the only herb available in Hanoi' }], correctKey: 'A' },
      { orderIndex: 1, question: 'How is the concept of five elements represented in Chả cá Lã Vọng?', options: [{ key: 'A', text: 'Through the visual harmony of golden fish (Earth), green dill (Wood), and white noodles (Metal)' }, { key: 'B', text: 'By eating at five different times of day' }, { key: 'C', text: 'By serving the dish on five wooden tables' }], correctKey: 'A' },
    ],
  },
];

export const CHA_CA_SERIES_ARTICLES: ReaderArticleData[] = chapters.map(chapter => ({
  ...chapter,
  topic: 'Ẩm thực',
  region: 'Hà Nội',
  level: 'Level 2',
  cefrLevel: 'B1',
  readTime: '3 phút đọc',
  imageUrl,
  vocabMap: Object.fromEntries(chapter.vocabularies.map(item => [item.word.toLowerCase(), item])),
}));

export const CHA_CA_SERIES: ArticleSeries = {
  metadata: CHA_CA_SERIES_METADATA,
  articles: CHA_CA_SERIES_ARTICLES,
};
