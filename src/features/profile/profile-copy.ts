const LABELS: Record<string, string> = {
  'Bước Chân Di Sản': 'First heritage steps',
  'Hoàn thành bài đọc song ngữ văn hóa đầu tiên': 'Complete your first bilingual cultural story.',
  'Sứ Giả Ba Miền': 'Three-region explorer',
  'Đạt ít nhất 1 Mộc Son ở mỗi miền Bắc, Trung, Nam': 'Collect a heritage stamp from each region.',
  'Thợ Săn Từ Vựng Văn Hóa': 'Words in context',
  'Lưu trữ và nắm vững trên 30 từ vựng học thuật ngữ cảnh': 'Save and master 30 words in context.',
  'Kho Báu Bách Từ': 'A hundred words',
  'Nắm vững 100 từ vựng chuyên sâu về văn hóa Việt Nam': 'Master 100 words about Vietnamese culture.',
  'Ngọn Lửa Chuyên Cần': 'A week of learning',
  'Duy trì chuỗi học liên tục suốt 7 ngày': 'Keep learning for seven consecutive days.',
  'Kỷ Luật Thép 30 Ngày': 'Thirty-day rhythm',
  'Học tiếng Anh di sản mỗi ngày trong 30 ngày': 'Learn through cultural stories for 30 days.',
  'Cây Bút Không Phán Xét': 'Community storyteller',
  'Viết và chia sẻ 3 bài cảm nghĩ văn hóa trong cộng đồng': 'Share three cultural reflections with the community.',
  'Hội Viên Tiên Phong': 'Pro pioneer',
  'Mở khóa đặc quyền gói Pro và tương tác với Gemini AI': 'Explore Pro membership and the cultural companion.',
};

// Display known interface labels in English while keeping stored values intact.
export function profileLabel(value: string): string {
  return LABELS[value] || value;
}

export function profileTargetLabel(value: string): string {
  const code = value.match(/^(A[12]|B[12]|C[12])\b/)?.[1];
  const levels: Record<string, string> = {
    A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate',
    B2: 'Upper intermediate', C1: 'Advanced', C2: 'Proficient',
  };
  return code ? `${code} · ${levels[code]}` : value;
}
