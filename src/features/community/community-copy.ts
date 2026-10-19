// Translate authored metadata for display while preserving stored/demo data and keys.
const LABELS: Record<string, string> = {
  'Học Viên VieCultures': 'VieCultures learner',
  'Bạn (Sứ Giả)': 'You (ambassador)',
  'Sứ Giả Cố Đô': 'Imperial Hue ambassador',
  'Sứ Giả Hội An': 'Hoi An ambassador',
  'Sứ Giả Mới': 'New ambassador',
  'Học viên Quốc tế': 'International learner',
  'Thành viên tích cực': 'Active member',
  'Thành viên tích cực • Huế, Việt Nam': 'Active member · Hue, Vietnam',
  'Người học quốc tế • Tokyo, Japan': 'International learner · Tokyo, Japan',
  'Học viên B2 • Hà Nội, Việt Nam': 'B2 learner · Hanoi, Vietnam',
  'Vừa tham gia thử thách tuần': 'New to this week’s challenge',
  'Giọng Đọc AI Premium': 'Premium AI voices',
  'Mở khóa giọng đọc bản ngữ chuẩn Anh - Mỹ cho toàn bộ bài học di sản.': 'Unlock British and American voices for heritage lessons.',
  'Âm Thanh': 'Audio',
  'Giao Diện Giấy Dó Vintage': 'Vintage dó paper theme',
  'Theme giấy Dó ngà hoàng gia sang trọng cho giao diện Reader.': 'An ivory dó paper theme for the Reader.',
  'Giao Diện': 'Appearance',
  "Huy Hiệu 'Cây Bút Di Sản'": 'Heritage writer badge',
  'Huy hiệu đặc biệt hiển thị trên trang Profile và góc bài viết cảm nhận.': 'A special badge for your profile and community reflections.',
  'Danh Hiệu': 'Badge',
};

export function communityLabel(value = '', fallback = ''): string {
  if (!value) return fallback;
  return LABELS[value] || value
    .replace(/^TOP (\d+) CHỦ ĐỀ • \+(\d+) XU$/, 'TOP $1 · +$2 coins')
    .replace(/^Ảnh di sản đính kèm • /, 'Attached heritage photo · ')
    .replace(/^Ảnh bài dự thi đính kèm • Cố Đô Huế$/, 'Entry photo · Imperial Hue');
}

export function communityTime(value: string): string {
  if (value === 'Vừa xong') return 'Just now';
  const match = value.match(/^(\d+) (giờ|phút|ngày) trước$/);
  if (!match) return value;
  const units: Record<string, string> = { giờ: 'hour', phút: 'minute', ngày: 'day' };
  return `${match[1]} ${units[match[2]]}${Number(match[1]) === 1 ? '' : 's'} ago`;
}
