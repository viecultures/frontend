import React from 'react';
import { ArrowRight } from 'lucide-react';

export const CulturalPillars: React.FC = () => {
  const pillars = [
    {
      icon: '🪷',
      title: 'Ngữ Cảnh Bản Sắc Thân Thuộc',
      subtitle: 'Pride-driven Contextual Learning',
      description: 'Thay vì các chủ đề phương Tây xa lạ, bạn tiếp thu tiếng Anh học thuật qua Cố đô Huế, Phố cổ Hội An, Bánh mì Sài Gòn và tranh Đông Hồ.',
      tag: 'Bản Sắc Việt'
    },
    {
      icon: '🏛️',
      title: 'Từ Vựng Học Thuật Chuẩn CEFR',
      subtitle: 'Academic Vocabulary & Rich Context',
      description: 'Mỗi từ vựng đều gắn với câu ngữ cảnh gốc và phiên âm IPA, giúp bạn tự tin thuyết trình về văn hóa dân tộc với bạn bè quốc tế.',
      tag: 'Chuẩn Học Thuật'
    },
    {
      icon: '🎧',
      title: 'Luyện Nghe Shadowing AI & 3D Cards',
      subtitle: 'Spaced Repetition (1-3-7-30 Days)',
      description: 'Luyện tai nghe và khẩu hình theo từng câu với AI bản xứ. Khắc sâu trí nhớ dài hạn nhờ thuật toán lặp ngắt quãng khoa học.',
      tag: 'Ghi Nhớ Sâu'
    },
    {
      icon: '🛡️',
      title: 'Không Gian Viết No-Judgment',
      subtitle: 'Safe Reflection & UGC Community',
      description: 'Xóa bỏ hoàn toàn áp lực chấm điểm hay soi lỗi ngữ pháp. Nơi người học tự do chia sẻ góc nhìn văn hóa của mình.',
      tag: 'Xóa Bỏ Áp Lực'
    }
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="glass-pill mb-4 shadow-xs">
          <span className="glass-pill-dot" />
          <span>TRIẾT LÝ SẢN PHẨM EDTECH ĐƯƠNG ĐẠI</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1E4B43] mb-4 tracking-tight">
          Học Tiếng Anh Qua Nghệ Thuật &amp; Di Sản Việt
        </h2>
        <p className="text-[#6B635B] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
          Sự hòa quyện giữa tình yêu văn hóa dân tộc và phương pháp tiếp thu ngôn ngữ tự nhiên hiện đại nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, index) => (
          <div
            key={index}
            className="heritage-card p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl">{p.icon}</span>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#F6EEDC] text-[#1E4B43] border border-[#E8DFCB]">
                  {p.tag}
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#1E4B43] mb-1.5 leading-snug">
                {p.title}
              </h3>
              <p className="text-xs font-semibold text-[#D9B76A] mb-3">
                {p.subtitle}
              </p>
              <p className="text-xs text-[#6B635B] leading-relaxed font-normal">
                {p.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8DFCB] flex items-center justify-between text-xs font-semibold text-[#1E4B43]">
              <span>Khám phá phương pháp</span>
              <ArrowRight className="w-4 h-4 text-[#1E4B43]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
