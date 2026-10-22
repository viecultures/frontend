import type { CulturalHeritageSite } from '@/types/sampleTypes';

const CULTURAL_INSIGHTS: Record<string, string> = {
  sapa: 'Terraced farming adapts to steep mountain terrain and is woven together with indigo dyeing and the traditional embroidery of H’Mông and Red Dao communities.',
  hanoi: 'Each street in the Old Quarter takes its name from a traditional trade, such as Hàng Bạc and Hàng Đào. Ca Trù is a refined chamber music tradition performed with the đàn đáy lute and bamboo clappers.',
  trangan: 'This landscape combines dramatic limestone formations and waterways with traces of early human settlement and the ancient capital of Hoa Lư.',
  phongnha: 'Caves such as Sơn Đoòng and Phong Nha form a natural link between the Trường Sơn mountains and the region’s village cultures.',
  hue: 'Vietnam’s last imperial capital is known for its elegant royal court music and elaborate cuisine, shaped by ideas of yin and yang and the five elements.',
  hoian: 'Once a busy trading port on the maritime Silk Route, Hội An brings Vietnamese, Japanese, and Chinese architectural influences together along the Hoài River.',
  taynguyen: 'The sound of gongs connects people spiritually with the sacred world and the mountains. Each gong is seen as the embodiment of a guardian spirit.',
  saigon: 'This energetic city brings historic French architecture together with the open, welcoming rhythm of sidewalk iced coffee.',
  mekong: 'The Mekong Delta is rich in rice and fruit. Đờn ca tài tử expresses the generous, heartfelt spirit of life among the region’s waterways and canals.',
};

const VOCABULARY_MEANINGS: Record<string, Record<string, string>> = {
  sapa: {
    'Ecological ingenuity': 'Skill and creativity in adapting harmoniously to nature',
    'Indigo-dyed textile': 'Handwoven fabric naturally dyed with indigo',
    'Cascading terraces': 'Curving rice terraces layered across the mountainside',
  },
  hanoi: {
    'Artisanal guild': 'A traditional association of craftspeople',
    'Intangible heritage': 'Cultural heritage passed down through generations',
    'Chamber music': 'Refined music performed by a small ensemble',
  },
  trangan: {
    'Karst landscape': 'A dramatic limestone landscape shaped by water',
    'Royal bastion': 'A naturally fortified stronghold protecting an ancient dynasty',
  },
  phongnha: {
    'Subterranean expanse': 'A vast underground space or cave system',
    'Primeval rainforest': 'An ancient, largely undisturbed tropical forest',
  },
  hue: {
    'Imperial banquet': 'A formal feast held at the royal court',
    'Harmonize yin and yang': 'Balance yin and yang and the five elements in food',
    'Royal court ballad': 'An elegant ceremonial song of the royal court',
  },
  hoian: {
    'Maritime silk route': 'A sea route used to trade silk and ceramics across regions',
    'Architectural tapestry': 'A varied architectural landscape shaped by many cultures',
    'Amber luminescence': 'The warm amber glow of silk lanterns',
  },
  taynguyen: {
    'Resonant reverberation': 'A deep, powerful sound that lingers in a space',
    'Communal stilt house': 'A raised communal home at the heart of a village',
  },
  saigon: {
    'Democratic dining ethos': 'An informal food culture where everyone shares the same space',
    'Colonial neoclassical': 'Neoclassical architecture from the colonial era',
    'Slow-drip brew': 'Traditional coffee slowly brewed through a phin filter',
  },
  mekong: {
    'Riverine commerce': 'Trade carried out by boats along rivers and waterways',
    'Melancholic cadence': 'A wistful, gently flowing rhythm in traditional song',
    'Silt-laden waterway': 'A river carrying fertile sediment that enriches the land',
  },
};

const REGIONS: Record<CulturalHeritageSite['region'], string> = {
  'Bắc Bộ': 'Northern Vietnam',
  'Trung Bộ': 'Central Vietnam',
  'Nam Bộ': 'Southern Vietnam',
};

const CATEGORIES: Record<CulturalHeritageSite['category'], string> = {
  'Di sản UNESCO': 'UNESCO heritage',
  'Ẩm thực & Triết lý': 'Cuisine & culinary philosophy',
  'Làng nghề thủ công': 'Traditional crafts',
  'Nghệ thuật diễn xướng': 'Performing arts',
};

export const getEnglishHeritageCopy = (site: CulturalHeritageSite) => ({
  region: REGIONS[site.region],
  category: CATEGORIES[site.category],
  culturalInsight: CULTURAL_INSIGHTS[site.id] ?? site.culturalInsight,
  vocabularyList: site.vocabularyList.map((vocabulary) => ({
    ...vocabulary,
    meaning: VOCABULARY_MEANINGS[site.id]?.[vocabulary.word] ?? vocabulary.meaning,
  })),
});
