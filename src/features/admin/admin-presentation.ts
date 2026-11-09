const VI_TOPIC_LABELS: Record<string, string> = {
  places: 'Địa danh & Di tích',
  cuisine: 'Ẩm thực truyền thống',
  crafts: 'Làng nghề thủ công',
  festivals: 'Lễ hội & Nghệ thuật',
  history: 'Di sản & Lịch sử',
  traditions: 'Văn hóa & Phong tục',
  'Culture & traditions': 'Văn hóa & Phong tục',
  'Festivals & arts': 'Lễ hội & Nghệ thuật',
  'Traditional cuisine': 'Ẩm thực truyền thống',
  'Heritage & history': 'Di sản & Lịch sử',
  'Landscapes & landmarks': 'Danh lam thắng cảnh',
  'Community life': 'Đời sống cộng đồng',
  'Văn hóa & Phong tục': 'Văn hóa & Phong tục',
  'Lễ hội & Nghệ thuật': 'Lễ hội & Nghệ thuật',
  'Ẩm thực truyền thống': 'Ẩm thực truyền thống',
  'Di sản & Lịch sử': 'Di sản & Lịch sử',
  'Danh lam thắng cảnh': 'Danh lam thắng cảnh',
  'Đời sống cộng đồng': 'Đời sống cộng đồng',
};

const EN_TOPIC_LABELS: Record<string, string> = {
  places: 'Places & Landmarks',
  cuisine: 'Traditional Cuisine',
  crafts: 'Traditional Crafts',
  festivals: 'Festivals & Arts',
  history: 'Heritage & History',
  traditions: 'Culture & Traditions',
  'Văn hóa & Phong tục': 'Culture & traditions',
  'Lễ hội & Nghệ thuật': 'Festivals & arts',
  'Ẩm thực truyền thống': 'Traditional cuisine',
  'Di sản & Lịch sử': 'Heritage & history',
  'Danh lam thắng cảnh': 'Landscapes & landmarks',
  'Đời sống cộng đồng': 'Community life',
};

const VI_REGION_LABELS: Record<string, string> = {
  north: 'Miền Bắc',
  central: 'Miền Trung',
  south: 'Miền Nam',
  all: 'Toàn quốc',
  nationwide: 'Toàn quốc',
  'Toàn quốc': 'Toàn quốc',
};

const EN_REGION_LABELS: Record<string, string> = {
  north: 'North',
  central: 'Central',
  south: 'South',
  all: 'Nationwide',
  nationwide: 'Nationwide',
  'Toàn quốc': 'Nationwide',
};

// Translate labels only. API values and authored bilingual content stay unchanged.
export function adminTopicLabel(topic = '', lang = 'vi'): string {
  if (!topic) return '';
  if (lang === 'en') {
    return EN_TOPIC_LABELS[topic] || topic;
  }
  return VI_TOPIC_LABELS[topic] || topic;
}

export function adminRegionLabel(region = '', lang = 'vi'): string {
  if (!region) return lang === 'en' ? 'Nationwide' : 'Toàn quốc';
  if (lang === 'en') {
    return EN_REGION_LABELS[region.toLowerCase()] || (region === 'Toàn quốc' ? 'Nationwide' : region);
  }
  return VI_REGION_LABELS[region.toLowerCase()] || region;
}

export function adminReadTimeLabel(readTime = '', lang = 'vi'): string {
  if (!readTime) return '';
  if (lang === 'en') {
    return readTime.replace(/(\d+)\s*phút/gi, '$1 min');
  }
  return readTime.replace(/(\d+)\s*min/gi, '$1 phút');
}
