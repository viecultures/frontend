/**
 * culturalIdiomsData.ts — Dataset for Cultural Idiom & Nuance Explorer
 */

export interface CulturalIdiomItem {
  id: string;
  category: 'Food' | 'Festivals' | 'Customs' | 'Crafts';
  vietnameseTerm: string;
  literalTranslation: string;
  naturalEnglish: string;
  culturalExplanationVi: string;
  culturalExplanationEn: string;
  sampleSpeakingSentenceEn: string;
  sampleSpeakingSentenceVi: string;
}

export const CULTURAL_IDIOMS: CulturalIdiomItem[] = [
  // 1. FOOD (Ẩm thực)
  {
    id: 'banh-chung',
    category: 'Food',
    vietnameseTerm: 'Bánh chưng',
    literalTranslation: 'Square green rice cake',
    naturalEnglish: 'Traditional square sticky rice cake wrapped in dong leaves, filled with mung beans and seasoned pork',
    culturalExplanationVi: 'Biểu tượng cho lòng biết ơn tổ tiên và hành tinh Trái Đất (đất tròn trời vuông) trong dịp Tết cổ truyền.',
    culturalExplanationEn: 'A foundational Lunar New Year dish symbolizing Earth, gratitude to ancestors, and family unity.',
    sampleSpeakingSentenceEn: 'During Tet, every Vietnamese family prepares Banh Chung, a square sticky rice cake wrapped in dong leaves with pork and mung bean fillings.',
    sampleSpeakingSentenceVi: 'Mỗi dịp Tết, các gia đình Việt Nam đều chuẩn bị Bánh chưng — món bánh chưng vuông gói lá đông kẹp nhân thịt heo và đậu xanh.'
  },
  {
    id: 'ca-kho-to',
    category: 'Food',
    vietnameseTerm: 'Cá kho tộ',
    literalTranslation: 'Fish cooked in a earthenware pot',
    naturalEnglish: 'Caramelized braised fish in a traditional clay pot',
    culturalExplanationVi: 'Nghệ thuật kho cá bằng niêu đất giúp nước sốt sóng sánh, cá thấm vị đượm đà ăn kèm cơm nóng.',
    culturalExplanationEn: 'Fish slow-cooked with fish sauce, pepper, and coconut water in clay cookware for deep caramelization.',
    sampleSpeakingSentenceEn: 'Ca Kho To is caramelized braised fish slow-cooked in a clay pot until rich, savory, and tender.',
    sampleSpeakingSentenceVi: 'Cá kho tộ là món cá kho đượm vị caramel trong niêu đất cho đến khi đậm đà và mềm ngấm.'
  },
  {
    id: 'nuoc-mam',
    category: 'Food',
    vietnameseTerm: 'Nước mắm nhỉ',
    literalTranslation: 'Dripping fish sauce',
    naturalEnglish: 'First-press artisanal fish sauce',
    culturalExplanationVi: 'Giọt nước mắm nguyên chất đầu tiên rỉ ra từ thùng gỗ chượp cá cơm truyền thống Phú Quốc / Phan Thiết.',
    culturalExplanationEn: 'The precious initial drop extracted from wooden barrels after months of anchovy sea-salt fermentation.',
    sampleSpeakingSentenceEn: 'First-press artisanal fish sauce is considered the liquid gold of traditional Vietnamese cuisine.',
    sampleSpeakingSentenceVi: 'Nước mắm nhỉ nguyên chất được ví như giọt vàng tinh hoa của ẩm thực Việt Nam.'
  },

  // 2. FESTIVALS (Lễ hội)
  {
    id: 'di-mot-ngay-dang',
    category: 'Festivals',
    vietnameseTerm: 'Đi một ngày đàng, học một sàng khôn',
    literalTranslation: 'Travel one day of road, learn a sieve of wisdom',
    naturalEnglish: 'Travel broadens the mind & worldly experience shapes wisdom',
    culturalExplanationVi: 'Câu tục ngữ nhắc nhở việc đi ra ngoài khám phá thế giới và các lễ hội vùng miền để tích lũy tri thức.',
    culturalExplanationEn: 'An ancient proverb encouraging exploration and hands-on cultural immersion to gain true wisdom.',
    sampleSpeakingSentenceEn: 'As the Vietnamese saying goes, travel broadens the mind — every journey enriches your perspective on life.',
    sampleSpeakingSentenceVi: 'Như câu tục ngữ Việt Nam "Đi một ngày đàng học một sàng khôn" — mỗi chuyến đi đều làm phong phú góc nhìn cuộc sống.'
  },
  {
    id: 'hoi-hoa-dang',
    category: 'Festivals',
    vietnameseTerm: 'Đêm hội hoa đăng',
    literalTranslation: 'Flower lantern festival night',
    naturalEnglish: 'Floating flower lantern release night',
    culturalExplanationVi: 'Nghi thức thả đèn hoa đăng xuống dòng sông hoa lệ để gửi gắm lời cầu nguyện bình an và may mắn.',
    culturalExplanationEn: 'A magical night ritual where lit paper lanterns floating on rivers carry wishes of peace and fortune.',
    sampleSpeakingSentenceEn: 'Visitors flock to Hoi An on full moon nights to witness the floating flower lantern festival on the river.',
    sampleSpeakingSentenceVi: 'Du khách đổ về Hội An đêm rằm để chiêm ngưỡng hội hoa đăng bồng bềnh trên dòng sông.'
  },

  // 3. CUSTOMS (Phong tục)
  {
    id: 'mung-tuoi',
    category: 'Customs',
    vietnameseTerm: 'Lì xì / Mừng tuổi',
    literalTranslation: 'Red envelope money / Congratulate age',
    naturalEnglish: 'Red envelope blessing for good fortune and longevity',
    culturalExplanationVi: 'Phong tục trao phong bao đỏ đựng tiền may mắn cùng lời chúc sức khỏe, học hành tiến tới dịp đầu năm.',
    culturalExplanationEn: 'The beloved New Year tradition of elders gifting crisp banknotes in red envelopes to children with heartfelt blessings.',
    sampleSpeakingSentenceEn: 'Giving red envelopes with crisp new bills is a traditional way to wish health and prosperity to children.',
    sampleSpeakingSentenceVi: 'Trao phong bao lì xì đỏ là cách truyền thống để chúc sức khỏe và may mắn cho trẻ nhỏ.'
  },
  {
    id: 'uong-nuoc-nho-nguon',
    category: 'Customs',
    vietnameseTerm: 'Uống nước nhớ nguồn',
    literalTranslation: 'When drinking water, remember the source',
    naturalEnglish: 'Always remember your roots & honor ancestral benefactors',
    culturalExplanationVi: 'Triết lý sống trọng đạo nghĩa, luôn tri ân công ơn tổ tiên, thầy cô và những thế hệ đi trước.',
    culturalExplanationEn: 'A core cultural moral value emphasizing gratitude to ancestors, teachers, and lineage origins.',
    sampleSpeakingSentenceEn: '"Uong nuoc nho nguon" reflects our deep cultural reverence for honoring ancestors and benefactors.',
    sampleSpeakingSentenceVi: '"Uống nước nhớ nguồn" phản ánh đạo lý truyền thống sâu sắc tri ân tổ tiên và người đi trước.'
  },

  // 4. CRAFTS (Làng nghề)
  {
    id: 'men-ran',
    category: 'Crafts',
    vietnameseTerm: 'Gốm men rạn',
    literalTranslation: 'Cracked glaze ceramics',
    naturalEnglish: 'Ancestral crackle glaze porcelain',
    culturalExplanationVi: 'Kỹ thuật tạo rạn tự nhiên trên men gốm độc bản của nghệ nhân Bát Tràng từ thế kỷ 16.',
    culturalExplanationEn: 'A sophisticated 16th-century ceramic glazing technique producing fine spiderweb crackle patterns.',
    sampleSpeakingSentenceEn: 'Bat Trang crackle glaze porcelain is famous for its intricate spiderweb patterns developed over centuries.',
    sampleSpeakingSentenceVi: 'Gốm men rạn Bát Tràng nổi tiếng với các đường rạn chân chim tinh xảo được sáng tạo qua nhiều thế kỷ.'
  },
  {
    id: 'mua-roi-nuoc',
    category: 'Crafts',
    vietnameseTerm: 'Múa rối nước',
    literalTranslation: 'Water puppet dance',
    naturalEnglish: 'Water puppetry performing art',
    culturalExplanationVi: 'Nghệ thuật trình diễn rối gỗ trên mặt nước ao làng có từ thế kỷ 11 ở vùng đồng bằng Bắc Bộ.',
    culturalExplanationEn: 'An 11th-century traditional folk performing art where wooden puppets are manipulated over water pools.',
    sampleSpeakingSentenceEn: 'Water puppetry is a unique 11th-century folk art originating from flooded rice paddies in Northern Vietnam.',
    sampleSpeakingSentenceVi: 'Múa rối nước là nghệ thuật dân gian độc đáo từ thế kỷ 11 xuất phát từ những ruộng lúa nước Bắc Bộ.'
  }
];
