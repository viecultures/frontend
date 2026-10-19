const TOPIC_LABELS: Record<string, string> = {
  traditions: 'Culture & traditions',
  festivals: 'Festivals & arts',
  'Văn hóa & Phong tục': 'Culture & traditions',
  'Lễ hội & Nghệ thuật': 'Festivals & arts',
  'Ẩm thực truyền thống': 'Traditional cuisine',
  'Di sản & Lịch sử': 'Heritage & history',
  'Danh lam thắng cảnh': 'Landscapes & landmarks',
  'Đời sống cộng đồng': 'Community life',
};

// Translate labels only. API values and authored bilingual content stay unchanged.
export function adminTopicLabel(topic = ''): string {
  return TOPIC_LABELS[topic] || topic;
}

export function adminRegionLabel(region = ''): string {
  return region === 'Toàn quốc' || !region ? 'Nationwide' : region;
}

export function adminReadTimeLabel(readTime = ''): string {
  return readTime.replace(/(\d+)\s*phút/gi, '$1 min');
}
