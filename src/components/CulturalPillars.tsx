import React from 'react';
import { Sparkles } from 'lucide-react';

export const CulturalPillars: React.FC = () => {
  const pillars = [
    {
      icon: '🪷',
      title: 'Học Trong Ngữ Cảnh Thân Thuộc & Tự Hào',
      subtitle: 'Contextual Pride-driven Learning',
      description: 'Thay vì những chủ đề phương Tây xa lạ, bạn tiếp thu tiếng Anh qua danh lam, ẩm thực, lịch sử và phong vị quê hương. Càng quen thuộc, ngôn ngữ càng dễ ngấm.',
      color: 'from-amber-500/20 to-emerald-500/10',
      border: 'border-amber-500/30',
      tag: 'Tâm lý học ngôn ngữ'
    },
    {
      icon: '🏛️',
      title: 'Từ Vựng Học Thuật Chuẩn CEFR (A2 - C1)',
      subtitle: 'Academic Vocabulary in Cultural Context',
      description: 'Mỗi từ vựng được trích xuất đều có câu ngữ cảnh gốc và phiên âm chuẩn. Giúp bạn tự tin giới thiệu di sản Việt Nam với bạn bè quốc tế bằng tiếng Anh chuẩn mực.',
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      tag: 'Chuẩn học thuật'
    },
    {
      icon: '🎧',
      title: 'Luyện Nghe Shadowing AI & Flashcards 3D',
      subtitle: 'Spaced Repetition System (1-3-7-30)',
      description: 'Luyện tai nghe và khẩu hình với AI chuẩn bản xứ theo từng câu. Củng cố trí nhớ dài hạn bằng thẻ nhớ 2 mặt và thuật toán lặp ngắt quãng tự động.',
      color: 'from-teal-500/20 to-blue-500/10',
      border: 'border-teal-500/30',
      tag: 'Ghi nhớ dài hạn'
    },
    {
      icon: '🛡️',
      title: 'Môi Trường Cảm Nghĩ "No-Judgment"',
      subtitle: 'Safe Reflection & UGC Community',
      description: 'Tuyệt đối không chấm điểm hay soi lỗi ngữ pháp bài viết cảm nghĩ. Tạo không gian an toàn 100% để bạn tự do viết và trở thành "Sứ giả văn hóa".',
      color: 'from-purple-500/20 to-pink-500/10',
      border: 'border-purple-500/30',
      tag: 'Xóa bỏ áp lực'
    }
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-amber-300 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRIẾT LÝ SẢN PHẨM EDTECH</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
          Tại Sao Nên Học Tiếng Anh Qua Ngữ Cảnh Văn Hóa Việt?
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Sự kết hợp hoàn hảo giữa tình yêu văn hóa dân tộc và phương pháp tiếp thu ngôn ngữ tự nhiên tiên tiến nhất.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, index) => (
          <div
            key={index}
            className={`p-6 rounded-3xl bg-gradient-to-br ${p.color} bg-slate-900/60 border ${p.border} backdrop-blur-xl flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 shadow-xl`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{p.icon}</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-slate-300 border border-slate-800">
                  {p.tag}
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-slate-100 mb-1 leading-snug">
                {p.title}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-400 mb-3">
                {p.subtitle}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] font-bold text-amber-300/90">
              <span>Khám phá phương pháp</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
