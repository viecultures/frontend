/**
 * Lesson Agent Catalog
 * Standardized pedagogical metadata for Gemini Voice-to-Voice AI Agent.
 * Enables zero-RAG, tool-driven English speaking & listening scaffolding.
 */

export type ProficiencyLevel = 'Level 1' | 'Level 2' | 'Level 3';

export interface LessonAgentVocab {
  word: string;
  ipa: string;
  meaningVi: string;
  exampleSentence: string;
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
}

export interface LevelSpecificContent {
  summaryEn: string;
  summaryVi: string;
  keyVocabularies: LessonAgentVocab[];
  discussionPrompts: {
    comprehension: string[];
    personalOpinion: string[];
    sentenceStarters?: string[];
  };
}

export interface LessonAgentMetadata {
  id: string;
  title: string;
  vietnameseTitle: string;
  category: 'Cuisine' | 'Heritage' | 'Crafts' | 'Nature' | 'Folklore';
  provinceId: string;
  provinceName: string;
  region: 'north' | 'central' | 'south' | 'all';
  cefrLevel: 'Level 1' | 'Level 2' | 'Level 3' | 'A2' | 'B1' | 'B2';
  durationMinutes: number;
  availableLevels: ProficiencyLevel[];
  levelContent: Record<ProficiencyLevel, LevelSpecificContent>;
  summaryEn: string;
  summaryVi: string;
  keyVocabularies: LessonAgentVocab[];
  discussionPrompts: {
    comprehension: string[];
    personalOpinion: string[];
    sentenceStarters?: string[];
  };
}

export const LESSON_AGENT_CATALOG: LessonAgentMetadata[] = [
  {
    id: 'pho-hanoi-history',
    title: 'Hanoi Phở: The Soul of Vietnamese Culinary Heritage',
    vietnameseTitle: 'Phở Hà Nội: Linh Hồn Ẩm Thực Đất Kinh Kỳ',
    category: 'Cuisine',
    provinceId: 'ha-noi',
    provinceName: 'Hà Nội',
    region: 'north',
    cefrLevel: 'Level 2',
    durationMinutes: 6,
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelContent: {
      'Level 1': {
        summaryEn:
          'Hanoi Phở is a famous noodle soup. It has warm, tasty beef soup, soft rice noodles, and green herbs. People in Hanoi love eating hot Phở in the morning.',
        summaryVi:
          'Phở Hà Nội là món phở bò nổi tiếng với nước dùng nóng hổi, bánh phở mềm và rau thơm tươi ngon. Người Hà Nội rất thích ăn phở vào bữa sáng.',
        keyVocabularies: [
          {
            word: 'noodle soup',
            ipa: '/ˈnuː.dəl suːp/',
            meaningVi: 'món súp mì, phở nước',
            exampleSentence: 'Phở is the most famous Vietnamese noodle soup.',
            cefrLevel: 'A1',
          },
          {
            word: 'fresh herbs',
            ipa: '/freʃ hɜːbz/',
            meaningVi: 'rau thơm tươi',
            exampleSentence: 'We add fresh herbs like coriander and mint into Phở.',
            cefrLevel: 'A2',
          },
          {
            word: 'tasty broth',
            ipa: '/ˈteɪ.sti brɒθ/',
            meaningVi: 'nước dùng ngon ngọt',
            exampleSentence: 'The hot beef soup has a very tasty broth.',
            cefrLevel: 'A2',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'Is Phở eaten with rice noodles or bread?',
            'When do people in Hanoi usually enjoy a hot bowl of Phở?',
          ],
          personalOpinion: [
            'Do you like beef Phở (Phở bò) or chicken Phở (Phở gà)?',
            'Do you prefer eating Phở for breakfast or dinner?',
          ],
          sentenceStarters: [
            'I prefer eating...',
            'My favorite Phở is... because it is...',
            'I usually eat Phở with...',
          ],
        },
      },
      'Level 2': {
        summaryEn:
          'Hanoi Phở is celebrated for its clear, aromatic broth simmered with roasted spices like star anise and cinnamon. Served with flat rice noodles, tender beef, and fresh herbs, it reflects the delicate street food culture of Hanoi.',
        summaryVi:
          'Phở Hà Nội nức tiếng với nước dùng trong veo, thơm ngát thảo mộc nướng như hoa hồi và quế, ăn kèm bánh phở mềm và thịt bò tái lăn mềm ngọt.',
        keyVocabularies: [
          {
            word: 'culinary heritage',
            ipa: '/ˈkʌl.ɪ.nər.i ˈher.ɪ.tɪdʒ/',
            meaningVi: 'di sản văn hóa ẩm thực',
            exampleSentence: 'Hanoi Phở is an essential part of Vietnam culinary heritage.',
            cefrLevel: 'B1',
          },
          {
            word: 'simmered broth',
            ipa: '/ˈsɪm.əd brɒθ/',
            meaningVi: 'nước dùng ninh kỹ nhiều giờ',
            exampleSentence: 'The rich flavor comes from beef bones simmered broth for ten hours.',
            cefrLevel: 'B1',
          },
          {
            word: 'star anise',
            ipa: '/ˌstɑːr ˈæn.ɪs/',
            meaningVi: 'hoa hồi, đại hồi (gia vị đặc trưng)',
            exampleSentence: 'Roasted star anise gives the broth its distinctive warm aroma.',
            cefrLevel: 'B2',
          },
          {
            word: 'artisanal noodle',
            ipa: '/ˌɑː.tɪˈzæn.əl ˈnuː.dəl/',
            meaningVi: 'sợi bánh phở làm thủ công truyền thống',
            exampleSentence: 'Traditional cooks take pride in fresh artisanal noodles made daily.',
            cefrLevel: 'B2',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'What roasted spices give Hanoi Phở its signature fragrant broth?',
            'How does Hanoi-style Phở differ from Southern Vietnamese Phở in herbs and sweetness?',
          ],
          personalOpinion: [
            'How would you describe the balance of flavors in Hanoi Phở to an international friend?',
            'Why has Phở become an internationally recognized symbol of Vietnamese gastronomy?',
          ],
          sentenceStarters: [
            'Compared to Southern Phở, Hanoi Phở is distinctive because...',
            'The main reason Phở is so beloved internationally is...',
          ],
        },
      },
      'Level 3': {
        summaryEn:
          'Hanoi Phở embodies the historical syncretism and culinary philosophy of northern Vietnam. Evolving throughout the early twentieth century, its crystalline bouillon achieves an exquisite umami balance through slow bone-marrow decoction and torrefied aromatics, serving as a cornerstone of Vietnamese cultural identity.',
        summaryVi:
          'Phở Hà Nội kết tinh triết lý ẩm thực và sự giao thoa lịch sử của đất Bắc. Nước dùng trong thanh tao đạt đến đỉnh cao vị ngọt umami nhờ kỹ thuật ninh tủy xương chậm kết hợp thảo mộc nướng.',
        keyVocabularies: [
          {
            word: 'gastronomic identity',
            ipa: '/ˌɡæs.trəˈnɒm.ɪk aɪˈden.tə.ti/',
            meaningVi: 'bản sắc văn hóa ẩm thực đỉnh cao',
            exampleSentence: 'Phở anchors the gastronomic identity of Hanoi across generations.',
            cefrLevel: 'C1',
          },
          {
            word: 'bone-marrow decoction',
            ipa: '/bəʊn ˈmær.əʊ dɪˈkɒk.ʃən/',
            meaningVi: 'kỹ thuật ninh chiết tinh chất tủy xương',
            exampleSentence: 'Master chefs rely on prolonged bone-marrow decoction for crystalline clarity.',
            cefrLevel: 'C1',
          },
          {
            word: 'torrefied aromatics',
            ipa: '/ˈtɒr.ɪ.faɪd ˌær.əˈmæt.ɪks/',
            meaningVi: 'thảo mộc được sao/nướng dậy mùi thơm',
            exampleSentence: 'Torrefied aromatics of charred ginger and black cardamom define the flavor profile.',
            cefrLevel: 'C1',
          },
          {
            word: 'cultural syncretism',
            ipa: '/ˈkʌl.tʃər.əl ˈsɪŋ.krə.tɪ.zəm/',
            meaningVi: 'sự dung hợp và giao thoa văn hóa',
            exampleSentence: 'The historical evolution of Phở reflects subtle Franco-Vietnamese cultural syncretism.',
            cefrLevel: 'C1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'How do culinary historians trace the socio-historical genesis and regional variations of Phở across the 20th century?',
            'What technical cooking principles govern the pursuit of crystalline broth clarity versus murky emulsification?',
          ],
          personalOpinion: [
            'To what extent does the global commercialization of Phở risk diluting its traditional artisanal practices?',
            'How should culinary institutions safeguard the intangible craftsmanship of multi-generational street-food masters?',
          ],
          sentenceStarters: [
            'From a socio-cultural vantage point, Phở serves as...',
            'The tension between artisanal authenticity and global commercialization highlights...',
          ],
        },
      },
    },
    summaryEn:
      'Hanoi Phở is celebrated worldwide for its clear, aromatic broth infused with star anise and cinnamon, served with delicate rice noodles and fresh herbs. It represents over a century of culinary evolution and Hanoi street dining culture.',
    summaryVi:
      'Phở Hà Nội nức tiếng với nước dùng trong veo, thơm lừng hồi quế, bánh phở mềm mượt và rau thơm tươi ngon, đại diện cho hơn một thế kỷ tinh hoa ẩm thực thủ đô.',
    keyVocabularies: [
      {
        word: 'culinary heritage',
        ipa: '/ˈkʌl.ɪ.nər.i ˈher.ɪ.tɪdʒ/',
        meaningVi: 'di sản văn hóa ẩm thực',
        exampleSentence: 'Hanoi Phở is an essential part of Vietnam culinary heritage.',
      },
      {
        word: 'simmered broth',
        ipa: '/ˈsɪm.əd brɒθ/',
        meaningVi: 'nước dùng ninh kỹ nhiều giờ',
        exampleSentence: 'The rich flavor comes from beef bones simmered broth for ten hours.',
      },
      {
        word: 'star anise',
        ipa: '/ˌstɑːr ˈæn.ɪs/',
        meaningVi: 'hoa hồi, đại hồi (gia vị đặc trưng)',
        exampleSentence: 'Roasted star anise gives the broth its distinctive warm aroma.',
      },
      {
        word: 'artisanal noodle',
        ipa: '/ˌɑː.tɪˈzæn.əl ˈnuː.dəl/',
        meaningVi: 'sợi bánh phở làm thủ công truyền thống',
        exampleSentence: 'Traditional cooks take pride in fresh artisanal noodles made daily.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'What main spices give Hanoi Phở its signature aromatic fragrance?',
        'How does Hanoi-style Phở differ from Southern Vietnamese Phở in terms of herbs and sweetness?',
      ],
      personalOpinion: [
        'Do you prefer eating Phở in the morning or for late-night supper, and why?',
        'If you were introducing Vietnamese food to an international friend, would Phở be your top recommendation?',
      ],
    },
  },
  {
    id: 'ha-long-bay',
    title: 'Ha Long Bay: Myths of the Descending Dragon',
    vietnameseTitle: 'Vịnh Hạ Long: Truyền Thuyết Rồng Đáp Xuống Biển',
    category: 'Nature',
    provinceId: 'quang-ninh',
    provinceName: 'Quảng Ninh',
    region: 'north',
    cefrLevel: 'Level 2',
    durationMinutes: 7,
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelContent: {
      'Level 1': {
        summaryEn:
          'Ha Long Bay is in Quang Ninh. It has thousands of green limestone islands on calm blue water. Legend says a giant dragon flew down from heaven to create this magical bay.',
        summaryVi:
          'Vịnh Hạ Long thuộc tỉnh Quảng Ninh. Nơi đây có hàng nghìn hòn đảo đá vôi xanh ngắt trên mặt biển xanh ngọc. Truyền thuyết kể rằng đàn rồng hạ giới đã tạo nên vịnh biển kỳ diệu này.',
        keyVocabularies: [
          {
            word: 'green island',
            ipa: '/ɡriːn ˈaɪ.lənd/',
            meaningVi: 'hòn đảo xanh',
            exampleSentence: 'There are thousands of green islands in the bay.',
            cefrLevel: 'A1',
          },
          {
            word: 'calm water',
            ipa: '/kɑːm ˈwɔː.tər/',
            meaningVi: 'làn nước êm đềm',
            exampleSentence: 'Boats sail smoothly on the calm water.',
            cefrLevel: 'A2',
          },
          {
            word: 'giant dragon',
            ipa: '/ˈdʒaɪ.ənt ˈdræɡ.ən/',
            meaningVi: 'con rồng khổng lồ',
            exampleSentence: 'Vietnamese legend tells the story of a giant dragon.',
            cefrLevel: 'A2',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'Where is Ha Long Bay located in Vietnam?',
            'What magical animal in folklore created Ha Long Bay?',
          ],
          personalOpinion: [
            'Would you like to take a boat trip around Ha Long Bay?',
            'What is the most beautiful natural place in Vietnam you have visited?',
          ],
          sentenceStarters: [
            'I want to visit Ha Long Bay because...',
            'The natural place I like most is...',
          ],
        },
      },
      'Level 2': {
        summaryEn:
          'Ha Long Bay features thousands of towering limestone karst islands emerging from tranquil emerald waters. UNESCO has recognized it as a World Natural Heritage site for both its breathtaking geological beauty and ancient ecological biodiversity.',
        summaryVi:
          'Vịnh Hạ Long nổi tiếng với hàng nghìn đảo đá vôi kỳ vĩ nhô lên giữa làn nước xanh ngọc bích, được UNESCO vinh danh là Di sản Thiên nhiên Thế giới.',
        keyVocabularies: [
          {
            word: 'limestone karst',
            ipa: '/ˈlaɪm.stəʊn kɑːst/',
            meaningVi: 'địa hình đảo đá vôi karst kỳ vĩ',
            exampleSentence: 'Ha Long Bay is globally famous for its magnificent limestone karst pillars.',
            cefrLevel: 'B1',
          },
          {
            word: 'emerald waters',
            ipa: '/ˈem.ər.əld ˈwɔː.təz/',
            meaningVi: 'làn nước xanh ngọc bích',
            exampleSentence: 'Cruise boats glide gracefully across the calm emerald waters.',
            cefrLevel: 'B1',
          },
          {
            word: 'descending dragon',
            ipa: '/dɪˈsen.dɪŋ ˈdræɡ.ən/',
            meaningVi: 'rồng hạ thế (nguồn gốc tên Hạ Long)',
            exampleSentence: 'Legend holds that the bay was formed by a descending dragon spitting pearls.',
            cefrLevel: 'B2',
          },
          {
            word: 'floating village',
            ipa: '/ˈfləʊ.tɪŋ ˈvɪl.ɪdʒ/',
            meaningVi: 'làng chài nổi trên biển',
            exampleSentence: 'Local fishermen have lived in peaceful floating villages for generations.',
            cefrLevel: 'B2',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'According to Vietnamese folklore, what is the mythic origin of the name Ha Long?',
            'Why was Ha Long Bay recognized by UNESCO as a World Natural Heritage site?',
          ],
          personalOpinion: [
            'Would you prefer spending an overnight stay on a wooden cruise ship or exploring hidden sea caves?',
            'What sustainable tourism practices should we follow to protect Ha Long marine ecology?',
          ],
          sentenceStarters: [
            'I believe eco-tourism in Ha Long Bay can be improved by...',
            'When visiting Ha Long Bay, tourists should be aware of...',
          ],
        },
      },
      'Level 3': {
        summaryEn:
          'Ha Long Bay constitutes an exceptional geomorphological marvel of submerged fengcong and fenglin karst topography, sculpted over five hundred million years of tectonic evolution. Beyond its UNESCO World Natural Heritage status, it shelters unique endemic marine ecosystems and rich prehistoric archaeological strata.',
        summaryVi:
          'Vịnh Hạ Long là kỳ quan địa chất geomophology vô song với dạng địa hình karst phong linh và phong tùng bị chìm ngập, trải qua hơn 500 triệu năm kiến tạo địa chất và lưu giữ các tầng văn hóa tiền sử quý giá.',
        keyVocabularies: [
          {
            word: 'geomorphological marvel',
            ipa: '/ˌdʒiː.əʊ.mɔː.fəˈlɒdʒ.ɪ.kəl ˈmɑː.vəl/',
            meaningVi: 'kỳ quan biến chuyển địa mạo học',
            exampleSentence: 'The karst pillars represent a globally significant geomorphological marvel.',
            cefrLevel: 'C1',
          },
          {
            word: 'endemic ecosystem',
            ipa: '/enˈdem.ɪk ˈiː.kəʊˌsɪs.təm/',
            meaningVi: 'hệ sinh thái đặc hữu bản địa',
            exampleSentence: 'The limestone islets harbor delicate endemic ecosystems found nowhere else.',
            cefrLevel: 'C1',
          },
          {
            word: 'submerged topography',
            ipa: '/səbˈmɜːdʒd təˈpɒɡ.rə.fi/',
            meaningVi: 'địa hình ngập nước biển cổ đại',
            exampleSentence: 'Transgression cycles created the breathtaking submerged topography of the Gulf of Tonkin.',
            cefrLevel: 'C1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'How do geologists characterize the multi-phase karstification and sea-level transgression processes of the bay?',
            'What ecological vulnerabilities threaten the endemic cave-dwelling fauna in Ha Long and Bai Tu Long?',
          ],
          personalOpinion: [
            'How should international environmental policymakers balance mass tourism revenue against strict marine conservation in Ha Long Bay?',
            'In your role as a cultural ambassador, how would you present Ha Long geological heritage at an international summit?',
          ],
          sentenceStarters: [
            'Preserving Ha Long Bay requires a multi-faceted strategy that balances...',
            'From an ecological conservation perspective, the primary imperative is...',
          ],
        },
      },
    },
    summaryEn:
      'Ha Long Bay features thousands of towering limestone karst islands emerging from tranquil emerald waters. UNESCO has recognized it as a World Natural Heritage site for both its breathtaking geological beauty and ancient ecological biodiversity.',
    summaryVi:
      'Vịnh Hạ Long nổi tiếng với hàng nghìn đảo đá vôi kỳ vĩ nhô lên giữa làn nước xanh ngọc bích, được UNESCO vinh danh là Di sản Thiên nhiên Thế giới.',
    keyVocabularies: [
      {
        word: 'limestone karst',
        ipa: '/ˈlaɪm.stəʊn kɑːst/',
        meaningVi: 'địa hình đảo đá vôi karst kỳ vĩ',
        exampleSentence: 'Ha Long Bay is globally famous for its magnificent limestone karst pillars.',
      },
      {
        word: 'emerald waters',
        ipa: '/ˈem.ər.əld ˈwɔː.təz/',
        meaningVi: 'làn nước xanh ngọc bích',
        exampleSentence: 'Cruise boats glide gracefully across the calm emerald waters.',
      },
      {
        word: 'descending dragon',
        ipa: '/dɪˈsen.dɪŋ ˈdræɡ.ən/',
        meaningVi: 'rồng hạ thế (nguồn gốc tên Hạ Long)',
        exampleSentence: 'Legend holds that the bay was formed by a descending dragon spitting pearls.',
      },
      {
        word: 'floating village',
        ipa: '/ˈfləʊ.tɪŋ ˈvɪl.ɪdʒ/',
        meaningVi: 'làng chài nổi trên biển',
        exampleSentence: 'Local fishermen have lived in peaceful floating villages for generations.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'According to Vietnamese folklore, what is the mythic origin of the name Ha Long?',
        'Why was Ha Long Bay recognized by UNESCO as a World Natural Heritage site?',
      ],
      personalOpinion: [
        'Would you prefer spending an overnight stay on a wooden cruise ship or exploring hidden sea caves?',
        'What sustainable tourism practices should we follow to protect Ha Long marine ecology?',
      ],
    },
  },
  {
    id: 'gong-culture-tay-nguyen',
    title: 'The Sacred Space of Gong Culture in Central Highlands',
    vietnameseTitle: 'Không Gian Văn Hóa Cồng Chiêng Tây Nguyên',
    category: 'Heritage',
    provinceId: 'dak-lak',
    provinceName: 'Đắk Lắk (Tây Nguyên)',
    region: 'central',
    cefrLevel: 'Level 3',
    durationMinutes: 8,
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelContent: {
      'Level 1': {
        summaryEn:
          'In the Central Highlands of Vietnam, ethnic minority people play bronze gongs during village festivals. The gong music brings people together around a warm fire.',
        summaryVi:
          'Tại vùng Tây Nguyên, đồng bào các dân tộc chơi cồng chiêng bằng đồng trong các lễ hội làng. Tiếng chiêng gắn kết mọi người bên ngọn lửa ấm.',
        keyVocabularies: [
          {
            word: 'bronze gong',
            ipa: '/brɒnz ɡɒŋ/',
            meaningVi: 'cồng chiêng bằng đồng',
            exampleSentence: 'The village plays bronze gongs during celebrations.',
            cefrLevel: 'A1',
          },
          {
            word: 'village festival',
            ipa: '/ˈvɪl.ɪdʒ ˈfes.tɪ.vəl/',
            meaningVi: 'lễ hội làng',
            exampleSentence: 'Everyone dances together at the village festival.',
            cefrLevel: 'A2',
          },
          {
            word: 'warm fire',
            ipa: '/wɔːm faɪər/',
            meaningVi: 'ngọn lửa ấm cúng',
            exampleSentence: 'People sit together around a warm fire.',
            cefrLevel: 'A1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'What material are the gongs made of in the Central Highlands?',
            'Where do village people gather to listen to gong music?',
          ],
          personalOpinion: [
            'Do you enjoy listening to traditional musical instruments?',
            'Have you ever seen a live bonfire festival?',
          ],
          sentenceStarters: [
            'I think gong music sounds...',
            'I like traditional instruments because...',
          ],
        },
      },
      'Level 2': {
        summaryEn:
          'The Gong Culture of Vietnam’s Central Highlands is an intangible UNESCO cultural masterpiece. Gong ensembles communicate with ancestral spirits, accompany community harvest rituals, and bind ethnic communities together around communal fires.',
        summaryVi:
          'Không gian văn hóa Cồng Chiêng Tây Nguyên là kiệt tác di sản phi vật thể nhân loại, sợi dây tâm linh kết nối con người với thần linh và buôn làng quanh ngọn lửa hồng.',
        keyVocabularies: [
          {
            word: 'gong ensemble',
            ipa: '/ɡɒŋ ɒnˈsɒm.bəl/',
            meaningVi: 'dàn hòa tấu cồng chiêng',
            exampleSentence: 'The village gong ensemble plays solemn rhythms during the buffalo sacrifice ceremony.',
            cefrLevel: 'B1',
          },
          {
            word: 'ancestral spirit',
            ipa: '/ænˈses.trəl ˈspɪr.ɪt/',
            meaningVi: 'linh hồn tổ tiên, thần linh hộ mệnh',
            exampleSentence: 'Gong melodies are believed to communicate directly with ancestral spirits.',
            cefrLevel: 'B2',
          },
          {
            word: 'communal stilt house',
            ipa: '/kəˈmjuː.nəl stɪlt haʊs/',
            meaningVi: 'nhà rông cộng đồng, nhà sàn',
            exampleSentence: 'Villagers gather inside the communal stilt house for harvest celebrations.',
            cefrLevel: 'B1',
          },
          {
            word: 'intangible heritage',
            ipa: '/ɪnˈtæn.dʒə.bəl ˈher.ɪ.tɪdʒ/',
            meaningVi: 'di sản văn hóa phi vật thể',
            exampleSentence: 'UNESCO recognized the Gong Culture as an intangible cultural heritage of humanity.',
            cefrLevel: 'B2',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'What spiritual role do bronze gongs play in ethnic minority communities of Central Highlands?',
            'Where do community members usually gather when hearing the gong call?',
          ],
          personalOpinion: [
            'How can younger generations be encouraged to preserve ethnic musical traditions?',
            'Have you ever experienced live ethnic instrument performances? What impressed you most?',
          ],
          sentenceStarters: [
            'To preserve ethnic music, schools should...',
            'The most fascinating aspect of gong culture is...',
          ],
        },
      },
      'Level 3': {
        summaryEn:
          'The Space of Gong Culture in the Central Highlands spans seventeen ethnic groups across five provinces. Manifesting a profound cosmological polyphony, each gong possesses a sacred deity (Yang), serving as the auditory conduit between mortal communities, ancestral spirits, and agrarian cycles.',
        summaryVi:
          'Không gian văn hóa Cồng Chiêng Tây Nguyên trải rộng qua 17 tộc người thuộc 5 tỉnh, thể hiện nghệ thuật đa âm phức điệu vũ trụ quan độc đáo. Mỗi chiếc chiêng đều có một vị thần Yang cư ngụ, là cầu nối giữa con người và vòng tuần hoàn nương rẫy.',
        keyVocabularies: [
          {
            word: 'cosmological polyphony',
            ipa: '/ˌkɒz.məˈlɒdʒ.ɪ.kəl pəˈlɪf.ə.ni/',
            meaningVi: 'nghệ thuật phức điệu đa thanh vũ trụ quan',
            exampleSentence: 'The complex rhythmic layers reflect an intricate cosmological polyphony.',
            cefrLevel: 'C1',
          },
          {
            word: 'auditory conduit',
            ipa: '/ˈɔː.dɪ.tər.i ˈkɒn.djuː.ɪt/',
            meaningVi: 'cầu nối tâm linh thông qua âm thanh thiêng liêng',
            exampleSentence: 'The bronze resonance acts as an auditory conduit to the celestial realm.',
            cefrLevel: 'C1',
          },
          {
            word: 'agrarian ritual',
            ipa: '/əˈɡreə.ri.ən ˈrɪtʃ.u.əl/',
            meaningVi: 'nghi lễ nông nghiệp và thờ cúng thần lúa',
            exampleSentence: 'Gong performances structure the entire calendar of agrarian rituals.',
            cefrLevel: 'C1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'How do ethnomusicologists explain the pitch tuning and acoustic spatialization during outdoor gong rituals?',
            'In what ways has the socioeconomic transition from communal farming impacted the oral transmission of gong repertoires?',
          ],
          personalOpinion: [
            'How should national cultural agencies reconcile tourist stage reenactments with the sacred in situ authenticity of indigenous rituals?',
            'What role can digital acoustic archiving play in safeguarding endangered ethnic musical heritage?',
          ],
          sentenceStarters: [
            'The core dilemma in indigenous heritage preservation lies in...',
            'From an anthropological perspective, gong resonance signifies...',
          ],
        },
      },
    },
    summaryEn:
      'The Gong Culture of Vietnam’s Central Highlands is an intangible UNESCO cultural masterpiece. Gong ensembles communicate with ancestral spirits, accompany community harvest rituals, and bind ethnic communities together around communal fires.',
    summaryVi:
      'Không gian văn hóa Cồng Chiêng Tây Nguyên là kiệt tác di sản phi vật thể nhân loại, sợi dây tâm linh kết nối con người với thần linh và buôn làng quanh ngọn lửa hồng.',
    keyVocabularies: [
      {
        word: 'gong ensemble',
        ipa: '/ɡɒŋ ɒnˈsɒm.bəl/',
        meaningVi: 'dàn hòa tấu cồng chiêng',
        exampleSentence: 'The village gong ensemble plays solemn rhythms during the buffalo sacrifice ceremony.',
      },
      {
        word: 'ancestral spirit',
        ipa: '/ænˈses.trəl ˈspɪr.ɪt/',
        meaningVi: 'linh hồn tổ tiên, thần linh hộ mệnh',
        exampleSentence: 'Gong melodies are believed to communicate directly with ancestral spirits.',
      },
      {
        word: 'communal stilt house',
        ipa: '/kəˈmjuː.nəl stɪlt haʊs/',
        meaningVi: 'nhà rông cộng đồng, nhà sàn',
        exampleSentence: 'Villagers gather inside the communal stilt house for harvest celebrations.',
      },
      {
        word: 'intangible heritage',
        ipa: '/ɪnˈtæn.dʒə.bəl ˈher.ɪ.tɪdʒ/',
        meaningVi: 'di sản văn hóa phi vật thể',
        exampleSentence: 'UNESCO recognized the Gong Culture as an intangible cultural heritage of humanity.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'What spiritual role do bronze gongs play in ethnic minority communities of Central Highlands?',
        'Where do community members usually gather when hearing the gong call?',
      ],
      personalOpinion: [
        'How can younger generations be encouraged to preserve ethnic musical traditions?',
        'Have you ever experienced live ethnic instrument performances? What impressed you most?',
      ],
    },
  },
  {
    id: 'non-la-culture',
    title: 'Nón Lá: The Symbolic Craft of Vietnamese Conical Hats',
    vietnameseTitle: 'Nón Lá: Biểu Tượng Duyên Dáng Của Làng Nghề Việt',
    category: 'Crafts',
    provinceId: 'thua-thien-hue',
    provinceName: 'Thừa Thiên Huế',
    region: 'central',
    cefrLevel: 'Level 1',
    durationMinutes: 5,
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelContent: {
      'Level 1': {
        summaryEn:
          'The Nón Lá is the traditional Vietnamese leaf hat. It is shaped like a cone and made from dried palm leaves and bamboo. It protects people from hot sun and rain.',
        summaryVi:
          'Nón lá là chiếc nón lá truyền thống của Việt Nam. Nón có hình chóp nón, làm từ lá cọ phơi khô và vành tre, giúp che nắng che mưa.',
        keyVocabularies: [
          {
            word: 'leaf hat',
            ipa: '/liːf hæt/',
            meaningVi: 'chiếc nón lá',
            exampleSentence: 'The leaf hat is very light and easy to wear.',
            cefrLevel: 'A1',
          },
          {
            word: 'bamboo ring',
            ipa: '/bæmˈbuː rɪŋ/',
            meaningVi: 'vành tre',
            exampleSentence: 'Artisans use 16 bamboo rings to make the hat shape.',
            cefrLevel: 'A2',
          },
          {
            word: 'sunny day',
            ipa: '/ˈsʌn.i deɪ/',
            meaningVi: 'ngày nắng',
            exampleSentence: 'A conical hat keeps you cool on a sunny day.',
            cefrLevel: 'A1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'What natural leaves are used to make a Vietnamese Nón Lá?',
            'Why do Vietnamese farmers and women wear Nón Lá outdoors?',
          ],
          personalOpinion: [
            'Have you ever worn a Nón Lá when visiting Hue or the countryside?',
            'Do you think Nón Lá looks graceful with Áo Dài?',
          ],
          sentenceStarters: [
            'I think Nón Lá is...',
            'When I see someone wearing Nón Lá, I feel...',
          ],
        },
      },
      'Level 2': {
        summaryEn:
          'The Nón Lá (conical leaf hat) is an iconic symbol of Vietnamese elegance and hard work. Made from dried palm leaves stitched onto bamboo frames, special poem-hats (nón bài thơ) from Hue reveal poetic verses when held against the sunlight.',
        summaryVi:
          'Nón lá là biểu tượng thanh lịch, chịu thương chịu khó của người phụ nữ Việt Nam. Đặc biệt nón bài thơ xứ Huế còn ẩn chứa những câu thơ trữ tình khi soi dưới ánh mặt trời.',
        keyVocabularies: [
          {
            word: 'conical hat',
            ipa: '/ˈkɒn.ɪ.kəl hæt/',
            meaningVi: 'nón lá hình chóp nón',
            exampleSentence: 'The conical hat protects farmers from tropical sun and heavy rain.',
            cefrLevel: 'B1',
          },
          {
            word: 'palm leaf',
            ipa: '/pɑːm liːf/',
            meaningVi: 'lá cọ, lá nón đã phơi khô',
            exampleSentence: 'Artisans carefully iron dry palm leaves before stitching them onto bamboo rings.',
            cefrLevel: 'B1',
          },
          {
            word: 'bamboo frame',
            ipa: '/bæmˈbuː freɪm/',
            meaningVi: 'khung vành tre tạo dáng nón',
            exampleSentence: 'A standard Hue conical hat consists of sixteen delicate bamboo frame rings.',
            cefrLevel: 'B1',
          },
          {
            word: 'poem-inlaid hat',
            ipa: '/ˈpəʊ.ɪm ˌɪn.leɪd hæt/',
            meaningVi: 'nón bài thơ (đặc sản xứ Huế)',
            exampleSentence: 'When held up to the sunlight, the poem-inlaid hat reveals hidden verses and landscapes.',
            cefrLevel: 'B2',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'What natural materials are used by craft village artisans to make a traditional Nón Lá?',
            'What secret feature makes the Hue poem-hat (nón bài thơ) unique when held against sunlight?',
          ],
          personalOpinion: [
            'Why do you think Nón Lá paired with Áo Dài has become the signature visual symbol of Vietnam?',
            'If you visited Hue, would you like to try making your own custom conical hat at a craft village?',
          ],
          sentenceStarters: [
            'Nón Lá paired with Áo Dài represents...',
            'Crafting traditional hats in Hue requires great patience because...',
          ],
        },
      },
      'Level 3': {
        summaryEn:
          'The Vietnamese Nón Lá transcends mere utilitarian sunwear to represent an enduring aesthetic trope of feminine grace and agrarian fortitude. In Hue, the storied craft village of Tay Ho elevated hatmaking into an epistolary art form through the "nón bài thơ", sandwiching calligraphy and riverine silhouettes between translucent palm leaf layers.',
        summaryVi:
          'Nón lá vượt lên trên công năng che mưa nắng thông thường để trở thành biểu tượng thẩm mỹ vĩnh cửu về nét duyên dáng phụ nữ Việt và tinh thần lao động kiên cường. Tại làng nón Tây Hồ xứ Huế, nón bài thơ được nâng tầm thành một nghệ thuật thi ca độc đáo.',
        keyVocabularies: [
          {
            word: 'utilitarian sunwear',
            ipa: '/ˌjuː.tɪ.lɪˈteə.ri.ən ˈsʌn.weər/',
            meaningVi: 'trang phục che nắng thuần công năng',
            exampleSentence: 'Nón Lá evolved far beyond utilitarian sunwear into high cultural art.',
            cefrLevel: 'C1',
          },
          {
            word: 'agrarian fortitude',
            ipa: '/əˈɡreə.ri.ən ˈfɔː.tɪ.tʃuːd/',
            meaningVi: 'nghị lực kiên cường của cư dân nông nghiệp',
            exampleSentence: 'The hat symbolizes the resilience and agrarian fortitude of Vietnamese mothers.',
            cefrLevel: 'C1',
          },
          {
            word: 'translucent layering',
            ipa: '/trænzˈluː.sənt ˈleɪ.ə.rɪŋ/',
            meaningVi: 'kỹ thuật ghép lớp lá mỏng thấu quang',
            exampleSentence: 'Artisans use translucent layering so verses illuminate under backlight.',
            cefrLevel: 'C1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'What structural and aesthetic techniques distinguish Hue poem-hats from utilitarian agrarian sun-hats?',
            'How does the manual 16-ring bamboo framing tradition maintain its geometric precision without modern measuring tools?',
          ],
          personalOpinion: [
            'How can traditional craft villages maintain sustainable livelihoods while competing against mass-produced synthetic accessories?',
            'In diplomatic and international fashion spheres, how can Nón Lá be represented modernly without losing its cultural roots?',
          ],
          sentenceStarters: [
            'The cultural enduring power of Nón Lá stems from its dual role as...',
            'To ensure the economic viability of craft villages, modern designers should...',
          ],
        },
      },
    },
    summaryEn:
      'The Nón Lá (conical leaf hat) is an iconic symbol of Vietnamese elegance and hard work. Made from dried palm leaves stitched onto bamboo frames, special poem-hats (nón bài thơ) from Hue reveal poetic verses when held against the sunlight.',
    summaryVi:
      'Nón lá là biểu tượng thanh lịch, chịu thương chịu khó của người phụ nữ Việt Nam. Đặc biệt nón bài thơ xứ Huế còn ẩn chứa những câu thơ trữ tình khi soi dưới ánh mặt trời.',
    keyVocabularies: [
      {
        word: 'conical hat',
        ipa: '/ˈkɒn.ɪ.kəl hæt/',
        meaningVi: 'nón lá hình chóp nón',
        exampleSentence: 'The conical hat protects farmers from tropical sun and heavy rain.',
      },
      {
        word: 'palm leaf',
        ipa: '/pɑːm liːf/',
        meaningVi: 'lá cọ, lá nón đã phơi khô',
        exampleSentence: 'Artisans carefully iron dry palm leaves before stitching them onto bamboo rings.',
      },
      {
        word: 'bamboo frame',
        ipa: '/bæmˈbuː freɪm/',
        meaningVi: 'khung vành tre tạo dáng nón',
        exampleSentence: 'A standard Hue conical hat consists of sixteen delicate bamboo frame rings.',
      },
      {
        word: 'poem-inlaid hat',
        ipa: '/ˈpəʊ.ɪm ˌɪn.leɪd hæt/',
        meaningVi: 'nón bài thơ (đặc sản xứ Huế)',
        exampleSentence: 'When held up to the sunlight, the poem-inlaid hat reveals hidden verses and landscapes.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'What natural materials are used by craft village artisans to make a traditional Nón Lá?',
        'What secret feature makes the Hue poem-hat (nón bài thơ) unique when held against sunlight?',
      ],
      personalOpinion: [
        'Why do you think Nón Lá paired with Áo Dài has become the signature visual symbol of Vietnam?',
        'If you visited Hue, would you like to try making your own custom conical hat at a craft village?',
      ],
    },
  },
  {
    id: 'my-son-sanctuary',
    title: 'Mỹ Sơn Sanctuary: Ancient Champa Kingdom Brick Temples',
    vietnameseTitle: 'Thánh Địa Mỹ Sơn: Quần Thể Đền Tháp Chăm Pa Cổ Kính',
    category: 'Heritage',
    provinceId: 'quang-nam',
    provinceName: 'Quảng Nam',
    region: 'central',
    cefrLevel: 'Level 3',
    durationMinutes: 8,
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelContent: {
      'Level 1': {
        summaryEn:
          'Mỹ Sơn is an ancient temple valley in Quang Nam. Hundreds of years ago, the Champa kings built red brick towers to pray to Hindu gods. It is a UNESCO World Heritage site.',
        summaryVi:
          'Mỹ Sơn là thung lũng đền tháp cổ kính tại Quảng Nam. Nhiều thế kỷ trước, các vị vua Chăm Pa đã xây dựng các tháp gạch đỏ để thờ cúng các vị thần Hindu.',
        keyVocabularies: [
          {
            word: 'ancient temple',
            ipa: '/ˈeɪn.ʃənt ˈtem.pəl/',
            meaningVi: 'ngôi đền cổ xưa',
            exampleSentence: 'Mỹ Sơn has many ancient temples built of red brick.',
            cefrLevel: 'A2',
          },
          {
            word: 'red brick',
            ipa: '/red brɪk/',
            meaningVi: 'viên gạch màu đỏ',
            exampleSentence: 'The towers were built with mysterious red bricks.',
            cefrLevel: 'A1',
          },
          {
            word: 'green valley',
            ipa: '/ɡriːn ˈvæl.i/',
            meaningVi: 'thung lũng xanh',
            exampleSentence: 'The temples are hidden in a quiet green valley.',
            cefrLevel: 'A2',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'In which province of Vietnam is Mỹ Sơn Sanctuary located?',
            'What color are the ancient temple bricks at Mỹ Sơn?',
          ],
          personalOpinion: [
            'Do you enjoy visiting historic ruins and ancient towers?',
            'Why is it important to protect old temples in Vietnam?',
          ],
          sentenceStarters: [
            'I want to visit Mỹ Sơn because...',
            'Historic ruins are important because...',
          ],
        },
      },
      'Level 2': {
        summaryEn:
          'Nestled in a lush green valley in Quang Nam, Mỹ Sơn Sanctuary is an archaeological complex of red brick temples built by the kings of Champa between the 4th and 14th centuries to honor Hindu deities.',
        summaryVi:
          'Nằm giữa thung lũng xanh tươi tỉnh Quảng Nam, Thánh địa Mỹ Sơn là quần thể tháp gạch đỏ huyền bí được xây dựng bởi các vương triều Champa từ thế kỷ 4 đến thế kỷ 14.',
        keyVocabularies: [
          {
            word: 'archaeological complex',
            ipa: '/ˌɑː.ki.əˈlɒdʒ.ɪ.kəl ˈkɒm.pleks/',
            meaningVi: 'quần thể di tích khảo cổ học',
            exampleSentence: 'My Son is one of Southeast Asia most renowned archaeological complexes.',
            cefrLevel: 'B1',
          },
          {
            word: 'mortarless brickwork',
            ipa: '/ˈmɔː.tə.ləs ˈbrɪk.wɜːk/',
            meaningVi: 'kỹ thuật xây gạch không lộ mạch vữa kết dính',
            exampleSentence: 'Scientists still marvel at the mystery of Champa mortarless brickwork technique.',
            cefrLevel: 'B2',
          },
          {
            word: 'Hindu deity',
            ipa: '/ˈhɪn.duː ˈdiː.ə.ti/',
            meaningVi: 'vị thần trong Ấn Độ giáo (Shiva, Vishnu)',
            exampleSentence: 'The sanctuaries were dedicated to Hindu deities, especially Lord Shiva.',
            cefrLevel: 'B2',
          },
          {
            word: 'sacred valley',
            ipa: '/ˈseɪ.krɪd ˈvæl.i/',
            meaningVi: 'thung lũng linh thiêng',
            exampleSentence: 'Surrounding mountain peaks guard this sacred valley from outside disturbances.',
            cefrLevel: 'B1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'Which ancient civilization built the red brick towers of Mỹ Sơn Sanctuary?',
            'What architectural mystery about the temple bricks continues to intrigue modern engineers?',
          ],
          personalOpinion: [
            'How do historical ruins like Mỹ Sơn help us understand the multicultural origins of Vietnam?',
            'What challenges do archaeologists face when restoring centuries-old brick structures damaged by wars?',
          ],
          sentenceStarters: [
            'Mỹ Sơn demonstrates that Vietnam has a rich, multicultural history because...',
            'The main challenge in restoring ancient brick monuments is...',
          ],
        },
      },
      'Level 3': {
        summaryEn:
          'Mỹ Sơn Sanctuary embodies the spiritual apex of the Champa Kingdom, serving as a royal necropolis and religious nexus dedicated to Shiva-Bhadreshvara. Erected with sophisticated firing methods and organic botanical adhesives, these monumental Shaivite sanctuaries showcase the localized assimilation of Indic cosmology in maritime Southeast Asia.',
        summaryVi:
          'Thánh địa Mỹ Sơn là đỉnh cao tâm linh của vương quốc Champa cổ đại, đóng vai trò là thánh địa hoàng gia thờ thần Shiva-Bhadreshvara với kỹ thuật nung gạch và chất kết dính thảo mộc độc đáo.',
        keyVocabularies: [
          {
            word: 'royal necropolis',
            ipa: '/ˈrɔɪ.əl nɪˈkrɒp.əl.ɪs/',
            meaningVi: 'khu lăng mộ và thánh địa tế tự hoàng gia',
            exampleSentence: 'My Son functioned as the royal necropolis for Champa monarchs.',
            cefrLevel: 'C1',
          },
          {
            word: 'Indic cosmology',
            ipa: '/ˈɪn.dɪk kɒzˈmɒl.ə.dʒi/',
            meaningVi: 'vũ trụ quan Ấn Độ giáo cổ đại',
            exampleSentence: 'The temple orientations precisely reflect sacred Indic cosmology principles.',
            cefrLevel: 'C1',
          },
          {
            word: 'botanical adhesive',
            ipa: '/bəˈtæn.ɪ.kəl ədˈhiː.sɪv/',
            meaningVi: 'chất kết dính tự nhiên chiết xuất từ nhựa thực vật',
            exampleSentence: 'Researchers hypothesize the use of indigenous botanical adhesives like resin.',
            cefrLevel: 'C1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'How did Champa master builders achieve structural longevity without visible lime mortar binders?',
            'What epigraphical evidence in Sanskrit and Old Cham sheds light on the diplomatic relations of the Champa court?',
          ],
          personalOpinion: [
            'How should modern preservationists negotiate the ethics of structural anastylosis versus leaving weathered ruins in their authentic state?',
            'How does integrating Champa heritage into the national historical narrative enrich contemporary Vietnamese identity?',
          ],
          sentenceStarters: [
            'From an architectural conservation viewpoint, the dilemma between anastylosis and preservation revolves around...',
            'Recognizing Champa heritage as integral to Vietnam illuminates...',
          ],
        },
      },
    },
    summaryEn:
      'Nestled in a lush green valley in Quang Nam, Mỹ Sơn Sanctuary is an archaeological complex of red brick temples built by the kings of Champa between the 4th and 14th centuries to honor Hindu deities.',
    summaryVi:
      'Nằm giữa thung lũng xanh tươi tỉnh Quảng Nam, Thánh địa Mỹ Sơn là quần thể tháp gạch đỏ huyền bí được xây dựng bởi các vương triều Champa từ thế kỷ 4 đến thế kỷ 14.',
    keyVocabularies: [
      {
        word: 'archaeological complex',
        ipa: '/ˌɑː.ki.əˈlɒdʒ.ɪ.kəl ˈkɒm.pleks/',
        meaningVi: 'quần thể di tích khảo cổ học',
        exampleSentence: 'My Son is one of Southeast Asia most renowned archaeological complexes.',
      },
      {
        word: 'mortarless brickwork',
        ipa: '/ˈmɔː.tə.ləs ˈbrɪk.wɜːk/',
        meaningVi: 'kỹ thuật xây gạch không lộ mạch vữa kết dính',
        exampleSentence: 'Scientists still marvel at the mystery of Champa mortarless brickwork technique.',
      },
      {
        word: 'Hindu deity',
        ipa: '/ˈhɪn.duː ˈdiː.ə.ti/',
        meaningVi: 'vị thần trong Ấn Độ giáo (Shiva, Vishnu)',
        exampleSentence: 'The sanctuaries were dedicated to Hindu deities, especially Lord Shiva.',
      },
      {
        word: 'sacred valley',
        ipa: '/ˈseɪ.krɪd ˈvæl.i/',
        meaningVi: 'thung lũng linh thiêng',
        exampleSentence: 'Surrounding mountain peaks guard this sacred valley from outside disturbances.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'Which ancient civilization built the red brick towers of Mỹ Sơn Sanctuary?',
        'What architectural mystery about the temple bricks continues to intrigue modern engineers?',
      ],
      personalOpinion: [
        'How do historical ruins like Mỹ Sơn help us understand the multicultural origins of Vietnam?',
        'What challenges do archaeologists face when restoring centuries-old brick structures damaged by wars?',
      ],
    },
  },
  {
    id: 'floating-markets-mekong',
    title: 'Cái Răng Floating Market & River Life in Mekong Delta',
    vietnameseTitle: 'Chợ Nổi Cái Răng & Nhịp Sống Sông Nước Miền Tây',
    category: 'Nature',
    provinceId: 'can-tho',
    provinceName: 'Cần Thơ',
    region: 'south',
    cefrLevel: 'Level 2',
    durationMinutes: 6,
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelContent: {
      'Level 1': {
        summaryEn:
          'Cái Răng Floating Market is in Can Tho. Hundreds of wooden boats meet on the river every morning. People buy and sell fresh fruits, hot noodles, and iced coffee on the water.',
        summaryVi:
          'Chợ nổi Cái Răng nằm tại Cần Thơ. Hàng trăm ghe thuyền họp chợ trên sông mỗi sáng sớm. Người dân mua bán trái cây tươi, hủ tiếu nóng và cà phê đá ngay trên mặt nước.',
        keyVocabularies: [
          {
            word: 'wooden boat',
            ipa: '/ˈwʊd.ən bəʊt/',
            meaningVi: 'thuyền gỗ, ghe xuồng',
            exampleSentence: 'Vendors travel on wooden boats to sell fruit.',
            cefrLevel: 'A1',
          },
          {
            word: 'fresh fruit',
            ipa: '/freʃ fruːt/',
            meaningVi: 'trái cây tươi ngon',
            exampleSentence: 'You can buy delicious fresh fruit like mango and pineapple.',
            cefrLevel: 'A1',
          },
          {
            word: 'morning market',
            ipa: '/ˈmɔː.nɪŋ ˈmɑː.kɪt/',
            meaningVi: 'chợ sáng sớm',
            exampleSentence: 'The morning market opens before sunrise.',
            cefrLevel: 'A2',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'What city in the Mekong Delta is home to Cái Răng Floating Market?',
            'What delicious foods and drinks can you buy directly on the river?',
          ],
          personalOpinion: [
            'Would you like to have breakfast on a boat in the middle of a river?',
            'What is your favorite tropical fruit from the Mekong Delta?',
          ],
          sentenceStarters: [
            'I would love to eat breakfast on a boat because...',
            'My favorite fruit is... because it tastes...',
          ],
        },
      },
      'Level 2': {
        summaryEn:
          'Cái Răng Floating Market in Cần Thơ wakes before dawn with hundreds of vibrant boats trading tropical fruits and hot bowls of hủ tiếu. Sellers hang sample produce on tall bamboo poles so buyers can spot their wares across the river.',
        summaryVi:
          'Chợ nổi Cái Răng tại Cần Thơ nhộn nhịp từ sáng sớm với hàng trăm ghe xuồng buôn bán trái cây nhiệt đới và hủ tiếu nóng hổi, treo sản vật mẫu lên cây bẹo độc đáo.',
        keyVocabularies: [
          {
            word: 'floating market',
            ipa: '/ˈfləʊ.tɪŋ ˈmɑː.kɪt/',
            meaningVi: 'chợ nổi trên sông',
            exampleSentence: 'Cai Rang is the largest and most bustling floating market in the Mekong Delta.',
            cefrLevel: 'B1',
          },
          {
            word: 'bamboo sample pole',
            ipa: '/bæmˈbuː ˈsɑːm.pəl pəʊl/',
            meaningVi: 'cây bẹo treo hàng mẫu chào bán',
            exampleSentence: 'Merchants hang pineapples and watermelons on a bamboo sample pole called cay beo.',
            cefrLevel: 'B2',
          },
          {
            word: 'river tributary',
            ipa: '/ˈrɪv.ər ˈtrɪb.jə.tər.i/',
            meaningVi: 'nhánh sông, phụ lưu sông Mekong',
            exampleSentence: 'Life in the delta revolves around interconnected river tributaries and canals.',
            cefrLevel: 'B2',
          },
          {
            word: 'tropical orchard',
            ipa: '/ˈtrɒp.ɪ.kəl ˈɔː.tʃəd/',
            meaningVi: 'vườn cây ăn trái nhiệt đới',
            exampleSentence: 'Boats deliver fresh mangosteens and durians straight from lush tropical orchards.',
            cefrLevel: 'B1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'How do boat vendors at Cái Răng advertise what they are selling from a distance?',
            'Why does trading at the floating market start so early in the morning?',
          ],
          personalOpinion: [
            'Would you enjoy having breakfast and hot coffee on a gently rocking boat in the middle of a river?',
            'How can Mekong Delta communities preserve floating market culture in the era of modern road transport?',
          ],
          sentenceStarters: [
            'The tradition of hanging fruit on bamboo poles shows that...',
            'To keep the floating market lively, local tourism should...',
          ],
        },
      },
      'Level 3': {
        summaryEn:
          'Cái Răng Floating Market exemplifies the hydraulic civilization and mercantile ecology of the Mekong Delta basin. Operating as a decentralized aquatic wholesale nexus, its unique barter conventions, vernacular navigation customs, and riverine social capital reflect centuries of resilient human adaptation to seasonal monsoonal hydrology.',
        summaryVi:
          'Chợ nổi Cái Răng là biểu trưng sinh động của nền văn minh sông nước và hệ sinh thái thương mại châu thổ sông Cửu Long, phản ánh sự thích ứng tài tình của con người trước quy luật thủy văn tự nhiên.',
        keyVocabularies: [
          {
            word: 'hydraulic civilization',
            ipa: '/haɪˈdrɒl.ɪk ˌsɪv.əl.aɪˈzeɪ.ʃən/',
            meaningVi: 'nền văn minh châu thổ sông nước',
            exampleSentence: 'Mekong communities embody a resilient hydraulic civilization.',
            cefrLevel: 'C1',
          },
          {
            word: 'aquatic wholesale nexus',
            ipa: '/əˈkwæt.ɪk ˈhəʊl.seɪl ˈnek.səs/',
            meaningVi: 'đầu mối giao thương bán buôn trên mặt nước',
            exampleSentence: 'Cai Rang functions as a strategic aquatic wholesale nexus for agrarian produce.',
            cefrLevel: 'C1',
          },
          {
            word: 'riverine social capital',
            ipa: '/ˈrɪv.ə.raɪn ˈsəʊ.ʃəl ˈkæp.ɪ.təl/',
            meaningVi: 'vốn xã hội và sự gắn kết cộng đồng sông nước',
            exampleSentence: 'Generational trust between boatmen builds robust riverine social capital.',
            cefrLevel: 'C1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'How do upstream dams and riverbank infrastructure projects affect the hydrologic viability of delta floating markets?',
            'What socio-economic factors are driving younger delta residents toward onshore urbanization instead of boat trade?',
          ],
          personalOpinion: [
            'How can regional planners design sustainable riverine tourism models without turning authentic community markets into artificial tourist traps?',
            'In what ways does delta river culture enrich Vietnam\'s maritime and agricultural identity globally?',
          ],
          sentenceStarters: [
            'The decline of traditional floating commerce highlights the inevitable tension between...',
            'Sustainable riverine cultural preservation requires policymakers to...',
          ],
        },
      },
    },
    summaryEn:
      'Cái Răng Floating Market in Cần Thơ wakes before dawn with hundreds of vibrant boats trading tropical fruits and hot bowls of hủ tiếu. Sellers hang sample produce on tall bamboo poles so buyers can spot their wares across the river.',
    summaryVi:
      'Chợ nổi Cái Răng tại Cần Thơ nhộn nhịp từ sáng sớm với hàng trăm ghe xuồng buôn bán trái cây nhiệt đới và hủ tiếu nóng hổi, treo sản vật mẫu lên cây bẹo độc đáo.',
    keyVocabularies: [
      {
        word: 'floating market',
        ipa: '/ˈfləʊ.tɪŋ ˈmɑː.kɪt/',
        meaningVi: 'chợ nổi trên sông',
        exampleSentence: 'Cai Rang is the largest and most bustling floating market in the Mekong Delta.',
      },
      {
        word: 'bamboo sample pole',
        ipa: '/bæmˈbuː ˈsɑːm.pəl pəʊl/',
        meaningVi: 'cây bẹo treo hàng mẫu chào bán',
        exampleSentence: 'Merchants hang pineapples and watermelons on a bamboo sample pole called cay beo.',
      },
      {
        word: 'river tributary',
        ipa: '/ˈrɪv.ər ˈtrɪb.jə.tər.i/',
        meaningVi: 'nhánh sông, phụ lưu sông Mekong',
        exampleSentence: 'Life in the delta revolves around interconnected river tributaries and canals.',
      },
      {
        word: 'tropical orchard',
        ipa: '/ˈtrɒp.ɪ.kəl ˈɔː.tʃəd/',
        meaningVi: 'vườn cây ăn trái nhiệt đới',
        exampleSentence: 'Boats deliver fresh mangosteens and durians straight from lush tropical orchards.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'How do boat vendors at Cái Răng advertise what they are selling from a distance?',
        'Why does trading at the floating market start so early in the morning?',
      ],
      personalOpinion: [
        'Would you enjoy having breakfast and hot coffee on a gently rocking boat in the middle of a river?',
        'How can Mekong Delta communities preserve floating market culture in the era of modern road transport?',
      ],
    },
  },
  {
    id: 'nem-ran-spring-rolls',
    title: 'Nem Rán: The Crispy Tradition of Vietnamese Spring Rolls',
    vietnameseTitle: 'Nem Rán Truyền Thống: Món Ăn Không Thể Thiếu Ngày Tết',
    category: 'Cuisine',
    provinceId: 'ha-noi',
    provinceName: 'Hà Nội',
    region: 'north',
    cefrLevel: 'Level 1',
    durationMinutes: 5,
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelContent: {
      'Level 1': {
        summaryEn:
          'Nem Rán is crispy Vietnamese spring rolls. They are filled with minced pork, glass noodles, and mushrooms, wrapped in thin rice paper and fried golden. We eat them with sweet-sour sauce on holidays.',
        summaryVi:
          'Nem rán là món chả giò giòn rụm của Việt Nam, nhân thịt băm, miến và mộc nhĩ cuộn bánh tráng chiên vàng ruộm, chấm cùng nước mắm chua ngọt trong dịp lễ Tết.',
        keyVocabularies: [
          {
            word: 'spring roll',
            ipa: '/ˈsprɪŋ rəʊl/',
            meaningVi: 'món nem rán, chả giò',
            exampleSentence: 'Crispy spring rolls are loved by children and adults.',
            cefrLevel: 'A1',
          },
          {
            word: 'minced pork',
            ipa: '/mɪnst pɔːk/',
            meaningVi: 'thịt lợn/heo xay nhuyễn',
            exampleSentence: 'The filling is made with tasty minced pork and vegetables.',
            cefrLevel: 'A2',
          },
          {
            word: 'golden color',
            ipa: '/ˈɡəʊl.dən ˈkʌl.ər/',
            meaningVi: 'màu vàng óng',
            exampleSentence: 'Fried rolls turn a beautiful golden color in the pan.',
            cefrLevel: 'A1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'What ingredients are mixed inside a traditional Nem Rán roll?',
            'What special holiday in Vietnam always has plates of hot Nem Rán?',
          ],
          personalOpinion: [
            'Do you prefer Nem Rán (fried spring rolls) or Gỏi Cuốn (fresh summer rolls)?',
            'Have you ever rolled spring rolls with your family members?',
          ],
          sentenceStarters: [
            'I like eating Nem Rán with...',
            'Between Nem Rán and Gỏi Cuốn, I prefer...',
          ],
        },
      },
      'Level 2': {
        summaryEn:
          'Nem Rán (deep-fried spring rolls) are a centerpiece of celebratory meals and Tet holiday feasts. Wrapped in thin rice paper with minced pork, wood ear mushrooms, glass noodles, and herbs, they are fried to golden perfection and paired with sweet-sour dipping sauce.',
        summaryVi:
          'Nem rán là món ăn tâm điểm trong mâm cỗ Tết cổ truyền, hòa quyện thịt băm, nấm mộc nhĩ, miến dong, bọc bánh đa nem chiên giòn rụm chấm nước mắm chua ngọt.',
        keyVocabularies: [
          {
            word: 'crispy roll',
            ipa: '/ˈkrɪs.pi rəʊl/',
            meaningVi: 'nem cuộn giòn rụm',
            exampleSentence: 'Everyone loves the crispy roll texture when eaten fresh from the pan.',
            cefrLevel: 'B1',
          },
          {
            word: 'wood ear mushroom',
            ipa: '/wʊd ɪər ˈmʌʃ.ruːm/',
            meaningVi: 'nấm mộc nhĩ, nấm mèo',
            exampleSentence: 'Shredded wood ear mushrooms add a delightful crunchy bite to the filling.',
            cefrLevel: 'B2',
          },
          {
            word: 'rice paper wrapper',
            ipa: '/raɪs ˈpeɪ.pər ˈræp.ər/',
            meaningVi: 'bánh tráng, bánh đa nem gói',
            exampleSentence: 'Dip the dry rice paper wrapper lightly in beer or water to make it golden and crispy.',
            cefrLevel: 'B1',
          },
          {
            word: 'sweet-sour dipping sauce',
            ipa: '/swiːt saʊər ˈdɪp.ɪŋ sɔːs/',
            meaningVi: 'nước mắm chua ngọt tỏi ớt',
            exampleSentence: 'A balanced sweet-sour dipping sauce with garlic and chili completes the dish.',
            cefrLevel: 'B1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'What main ingredients are mixed inside the traditional filling of northern Nem Rán?',
            'What special family occasions in Vietnam always feature a platter of golden spring rolls?',
          ],
          personalOpinion: [
            'Have you ever rolled spring rolls with your family before a big festive gathering?',
            'What is your personal secret recipe for making the perfect dipping fish sauce?',
          ],
          sentenceStarters: [
            'Preparing Nem Rán for Tet is a joyful family tradition because...',
            'The key to making the crispiest spring rolls is...',
          ],
        },
      },
      'Level 3': {
        summaryEn:
          'Nem Rán represents a masterclass in textural interplay and festive ritual in Vietnamese domestic gastronomy. Balancing porcine richness with hydrated vermicelli, fungi, and aromatic aromatics, this celebratory staple encapsulates familial solidarity during Lunar New Year ancestral banquets.',
        summaryVi:
          'Nem rán là đỉnh cao của sự hòa quyện cấu trúc giòn-mềm và nghi thức ẩm thực ngày Tết, biểu trưng cho sự sum vầy đoàn viên gia đình trước bàn thờ gia tiên.',
        keyVocabularies: [
          {
            word: 'textural interplay',
            ipa: '/ˈteks.tʃər.əl ˈɪn.tə.pleɪ/',
            meaningVi: 'sự tương hỗ hài hòa giữa các tầng cấu trúc giòn mềm',
            exampleSentence: 'The dish achieves a delightful textural interplay between crisp crust and tender filling.',
            cefrLevel: 'C1',
          },
          {
            word: 'ancestral banquet',
            ipa: '/ænˈses.trəl ˈbæŋ.kwɪt/',
            meaningVi: 'mâm cỗ cúng gia tiên trang trọng',
            exampleSentence: 'Nem Ran is an indispensable offering on the Lunar New Year ancestral banquet.',
            cefrLevel: 'C1',
          },
          {
            word: 'communal culinary ritual',
            ipa: '/kəˈmjuː.nəl ˈkʌl.ɪ.nər.i ˈrɪtʃ.u.əl/',
            meaningVi: 'nghi thức nấu nướng gắn kết đại gia đình',
            exampleSentence: 'Wrapping spring rolls together serves as a cherished communal culinary ritual.',
            cefrLevel: 'C1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'How does the balance of fat, moisture, and starch in the filling prevent wrapper sogginess during high-heat frying?',
            'What symbolic connotations did circular/cylindrical rolls carry in traditional agrarian banquet cosmology?',
          ],
          personalOpinion: [
            'How can home-cooking traditions survive in contemporary urban lifestyles where pre-packaged frozen foods dominate?',
            'Why does the sensorial memory of cooking with family create such powerful diasporic nostalgia?',
          ],
          sentenceStarters: [
            'Beyond its culinary merits, Nem Rán functions socially as...',
            'The sensory nostalgia associated with traditional Tet cooking reflects...',
          ],
        },
      },
    },
    summaryEn:
      'Nem Rán (deep-fried spring rolls) are a centerpiece of celebratory meals and Tet holiday feasts. Wrapped in thin rice paper with minced pork, wood ear mushrooms, glass noodles, and herbs, they are fried to golden perfection and paired with sweet-sour dipping sauce.',
    summaryVi:
      'Nem rán là món ăn tâm điểm trong mâm cỗ Tết cổ truyền, hòa quyện thịt băm, nấm mộc nhĩ, miến dong, bọc bánh đa nem chiên giòn rụm chấm nước mắm chua ngọt.',
    keyVocabularies: [
      {
        word: 'crispy roll',
        ipa: '/ˈkrɪs.pi rəʊl/',
        meaningVi: 'nem cuộn giòn rụm',
        exampleSentence: 'Everyone loves the crispy roll texture when eaten fresh from the pan.',
      },
      {
        word: 'wood ear mushroom',
        ipa: '/wʊd ɪər ˈmʌʃ.ruːm/',
        meaningVi: 'nấm mộc nhĩ, nấm mèo',
        exampleSentence: 'Shredded wood ear mushrooms add a delightful crunchy bite to the filling.',
      },
      {
        word: 'rice paper wrapper',
        ipa: '/raɪs ˈpeɪ.pər ˈræp.ər/',
        meaningVi: 'bánh tráng, bánh đa nem gói',
        exampleSentence: 'Dip the dry rice paper wrapper lightly in beer or water to make it golden and crispy.',
      },
      {
        word: 'sweet-sour dipping sauce',
        ipa: '/swiːt saʊər ˈdɪp.ɪŋ sɔːs/',
        meaningVi: 'nước mắm chua ngọt tỏi ớt',
        exampleSentence: 'A balanced sweet-sour dipping sauce with garlic and chili completes the dish.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'What main ingredients are mixed inside the traditional filling of northern Nem Rán?',
        'What special family occasions in Vietnam always feature a platter of golden spring rolls?',
      ],
      personalOpinion: [
        'Have you ever rolled spring rolls with your family before a big festive gathering?',
        'What is your personal secret recipe for making the perfect dipping fish sauce?',
      ],
    },
  },
  {
    id: 'dong-ho-paintings',
    title: 'Đông Hồ Folk Woodblock Paintings',
    vietnameseTitle: 'Tranh Dân Gian Đông Hồ Dùng Màu Tự Nhiên',
    category: 'Crafts',
    provinceId: 'bac-ninh',
    provinceName: 'Bắc Ninh',
    region: 'north',
    cefrLevel: 'Level 1',
    durationMinutes: 5,
    availableLevels: ['Level 1', 'Level 2', 'Level 3'],
    levelContent: {
      'Level 1': {
        summaryEn:
          'Đông Hồ paintings come from Bac Ninh. Artists carve wood blocks and print with colors made from trees and rocks. They print on shiny paper made from sea shells to wish everyone a happy new year.',
        summaryVi:
          'Tranh Đông Hồ đến từ Bắc Ninh. Các nghệ nhân khắc ván gỗ và in tranh bằng màu lấy từ cây cỏ, sỏi đá trên nền giấy vỏ sò lấp lánh để cầu chúc năm mới may mắn.',
        keyVocabularies: [
          {
            word: 'wood block',
            ipa: '/wʊd blɒk/',
            meaningVi: 'bản khắc gỗ',
            exampleSentence: 'Artists carve pictures onto a flat wood block.',
            cefrLevel: 'A1',
          },
          {
            word: 'natural color',
            ipa: '/ˈnætʃ.ər.əl ˈkʌl.ər/',
            meaningVi: 'màu sắc tự nhiên',
            exampleSentence: 'The paintings use natural colors from flowers and leaves.',
            cefrLevel: 'A1',
          },
          {
            word: 'good luck',
            ipa: '/ɡʊd lʌk/',
            meaningVi: 'sự may mắn, phúc lành',
            exampleSentence: 'The pictures bring good luck and happiness for Tet.',
            cefrLevel: 'A1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'Which province in Northern Vietnam is famous for Đông Hồ paintings?',
            'What natural things are used to make the special paint colors?',
          ],
          personalOpinion: [
            'Do you like the cute drawings of pigs and chickens in Dong Ho art?',
            'Would you hang a traditional folk painting in your bedroom or living room?',
          ],
          sentenceStarters: [
            'I like Dong Ho paintings because they look...',
            'If I had a Dong Ho picture, I would hang it in...',
          ],
        },
      },
      'Level 2': {
        summaryEn:
          'Originating from Bac Ninh province, Đông Hồ folk woodblock paintings are created using completely natural mineral and herbal colors printed on sparkling scallop-shell paper (giấy điệp). They express heartfelt wishes for prosperity, luck, and family harmony.',
        summaryVi:
          'Tranh dân gian Đông Hồ đất Bắc Ninh được in khắc gỗ bằng màu sắc tự nhiên từ cây cỏ, sỏi đá trên nền giấy điệp lấp lánh, gửi gắm ước nguyện no ấm, hòa thuận.',
        keyVocabularies: [
          {
            word: 'woodblock print',
            ipa: '/ˈwʊd.blɒk prɪnt/',
            meaningVi: 'tranh khắc ván gỗ dân gian',
            exampleSentence: 'Each color in a Dong Ho woodblock print requires a separate carved wooden block.',
            cefrLevel: 'B1',
          },
          {
            word: 'natural pigment',
            ipa: '/ˈnætʃ.ər.əl ˈpɪɡ.mənt/',
            meaningVi: 'màu vẽ chiết xuất từ thiên nhiên (hoa hòe, tro rơm, sỏi son)',
            exampleSentence: 'Artisans extract natural pigments: black from burnt bamboo leaves and yellow from pagoda tree flowers.',
            cefrLevel: 'B2',
          },
          {
            word: 'scallop-shell paper',
            ipa: '/ˈskɒl.əp ʃel ˈpeɪ.pər/',
            meaningVi: 'giấy điệp óng ánh bột vỏ sò điệp',
            exampleSentence: 'The shimmering background is crafted from scallop-shell paper ground with rice paste.',
            cefrLevel: 'B2',
          },
          {
            word: 'folk blessing',
            ipa: '/fəʊk ˈbles.ɪŋ/',
            meaningVi: 'lời chúc tụng may mắn dân gian',
            exampleSentence: 'Paintings of fat pigs and roosters carry folk blessings for wealth and fertility in the new year.',
            cefrLevel: 'B1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'How do Dong Ho village artisans produce their brilliant natural red, yellow, and black colors?',
            'Why does the traditional paper used for Dong Ho paintings shimmer softly in natural light?',
          ],
          personalOpinion: [
            'Do you think modern homes should display traditional folk art alongside contemporary decor?',
            'What can artists do to keep traditional woodblock printing relevant to younger digital audiences?',
          ],
          sentenceStarters: [
            'Integrating Dong Ho art into modern interior decor is a great way to...',
            'To appeal to young people, traditional woodblock artists could...',
          ],
        },
      },
      'Level 3': {
        summaryEn:
          'Đông Hồ folk xylography encapsulates the agrarian ethos, satirical humor, and spiritual yearnings of Red River Delta villagers. Utilizing handcrafted Điệp paper brushed with crushed scallop shells and organic pigments derived from soot, indigo, and gardenia, each chromatic layer is manually stamped using carved jackfruit wood blocks.',
        summaryVi:
          'Nghệ thuật tranh khắc gỗ dân gian Đông Hồ kết tinh triết lý nhân sinh mộc mạc, tính châm biếm hóm hỉnh và khát vọng phồn vinh của cư dân đồng bằng sông Hồng. Mỗi lớp màu được in thủ công bằng ván khắc gỗ mít trên nền giấy điệp quét hồ nếp óng ánh.',
        keyVocabularies: [
          {
            word: 'xylographic craftsmanship',
            ipa: '/ˌzaɪ.ləˈɡræf.ɪk ˈkrɑːfts.mən.ʃɪp/',
            meaningVi: 'kỹ nghệ khắc gỗ in tranh dân gian',
            exampleSentence: 'Dong Ho master carvers demonstrate peerless xylographic craftsmanship.',
            cefrLevel: 'C1',
          },
          {
            word: 'agrarian ethos',
            ipa: '/əˈɡreə.ri.ən ˈiː.θɒs/',
            meaningVi: 'tinh thần và triết lý sống của cư dân nông nghiệp',
            exampleSentence: 'The cheerful swine and roosters represent the optimistic agrarian ethos.',
            cefrLevel: 'C1',
          },
          {
            word: 'satirical allegory',
            ipa: '/səˈtɪr.ɪ.kəl ˈæl.ə.ɡə.ri/',
            meaningVi: 'phép ẩn dụ châm biếm sâu cay (Tranh Đám cưới chuột)',
            exampleSentence: 'The famed Mouse Wedding uses satirical allegory to critique feudal corruption.',
            cefrLevel: 'C1',
          },
        ],
        discussionPrompts: {
          comprehension: [
            'How did the choice of jackfruit timber (gỗ mít) enable fine dimensional stability against tropical humidity in woodblock printing?',
            'What subtle political critiques and social satire were embedded within paintings like "The Mice\'s Wedding" (Đám cưới chuột)?',
          ],
          personalOpinion: [
            'How can Vietnam achieve UNESCO Intangible Cultural Heritage recognition for Dong Ho craft while revitalizing the economic ecosystem of Bac Ninh artisans?',
            'How can digital NFTs or creative graphic merchandise bridge the generational divide in traditional folk art appreciation?',
          ],
          sentenceStarters: [
            'The social commentary embedded in Dong Ho artwork reveals that...',
            'Revitalizing the Dong Ho craft village requires an innovative model that combines...',
          ],
        },
      },
    },
    summaryEn:
      'Originating from Bac Ninh province, Đông Hồ folk woodblock paintings are created using completely natural mineral and herbal colors printed on sparkling scallop-shell paper (giấy điệp). They express heartfelt wishes for prosperity, luck, and family harmony.',
    summaryVi:
      'Tranh dân gian Đông Hồ đất Bắc Ninh được in khắc gỗ bằng màu sắc tự nhiên từ cây cỏ, sỏi đá trên nền giấy điệp lấp lánh, gửi gắm ước nguyện no ấm, hòa thuận.',
    keyVocabularies: [
      {
        word: 'woodblock print',
        ipa: '/ˈwʊd.blɒk prɪnt/',
        meaningVi: 'tranh khắc ván gỗ dân gian',
        exampleSentence: 'Each color in a Dong Ho woodblock print requires a separate carved wooden block.',
      },
      {
        word: 'natural pigment',
        ipa: '/ˈnætʃ.ər.əl ˈpɪɡ.mənt/',
        meaningVi: 'màu vẽ chiết xuất từ thiên nhiên (hoa hòe, tro rơm, sỏi son)',
        exampleSentence: 'Artisans extract natural pigments: black from burnt bamboo leaves and yellow from pagoda tree flowers.',
      },
      {
        word: 'scallop-shell paper',
        ipa: '/ˈskɒl.əp ʃel ˈpeɪ.pər/',
        meaningVi: 'giấy điệp óng ánh bột vỏ sò điệp',
        exampleSentence: 'The shimmering background is crafted from scallop-shell paper ground with rice paste.',
      },
      {
        word: 'folk blessing',
        ipa: '/fəʊk ˈbles.ɪŋ/',
        meaningVi: 'lời chúc tụng may mắn dân gian',
        exampleSentence: 'Paintings of fat pigs and roosters carry folk blessings for wealth and fertility in the new year.',
      },
    ],
    discussionPrompts: {
      comprehension: [
        'How do Dong Ho village artisans produce their brilliant natural red, yellow, and black colors?',
        'Why does the traditional paper used for Dong Ho paintings shimmer softly in natural light?',
      ],
      personalOpinion: [
        'Do you think modern homes should display traditional folk art alongside contemporary decor?',
        'What can artists do to keep traditional woodblock printing relevant to younger digital audiences?',
      ],
    },
  },
];

/**
 * Helper search and lookup functions
 */
export function findLessonById(id: string): LessonAgentMetadata | undefined {
  return LESSON_AGENT_CATALOG.find(l => l.id === id);
}

export function getLessonForLevel(
  lessonId: string,
  level: ProficiencyLevel = 'Level 2',
): {
  lesson: LessonAgentMetadata;
  content: LevelSpecificContent;
} | undefined {
  const lesson = findLessonById(lessonId) || LESSON_AGENT_CATALOG[0];
  if (!lesson) return undefined;
  const content = lesson.levelContent?.[level] || lesson.levelContent?.['Level 2'] || {
    summaryEn: lesson.summaryEn,
    summaryVi: lesson.summaryVi,
    keyVocabularies: lesson.keyVocabularies,
    discussionPrompts: lesson.discussionPrompts,
  };
  return { lesson, content };
}

export function searchLessonsByKeyword(keyword: string): LessonAgentMetadata[] {
  const norm = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  return LESSON_AGENT_CATALOG.filter(l => {
    const titleNorm = l.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const viTitleNorm = l.vietnameseTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const provinceNorm = l.provinceName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return (
      titleNorm.includes(norm) ||
      viTitleNorm.includes(norm) ||
      provinceNorm.includes(norm) ||
      l.category.toLowerCase().includes(norm)
    );
  });
}

export function filterLessons(filter: {
  region?: 'north' | 'central' | 'south' | 'all';
  category?: 'Cuisine' | 'Heritage' | 'Crafts' | 'Nature' | 'Folklore';
  cefrLevel?: string;
}): LessonAgentMetadata[] {
  return LESSON_AGENT_CATALOG.filter(l => {
    if (filter.region && filter.region !== 'all' && l.region !== filter.region) {
      return false;
    }
    if (filter.category && l.category !== filter.category) {
      return false;
    }
    if (filter.cefrLevel) {
      const target = filter.cefrLevel.toLowerCase();
      const levelNorm = l.cefrLevel.toLowerCase();
      if (
        !levelNorm.includes(target) &&
        !l.availableLevels.some(lvl => lvl.toLowerCase().includes(target))
      ) {
        return false;
      }
    }
    return true;
  });
}

