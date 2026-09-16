import React from 'react';
import { X, FileText } from 'lucide-react';

interface ProjectSpecsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectSpecsDrawer: React.FC<ProjectSpecsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const docModules = [
    {
      code: 'BR-01',
      name: 'Paragraph Pairing & Shadowing Audio',
      desc: 'Hiển thị bài đọc song ngữ tiếng Anh - tiếng Việt khớp tỷ lệ 1:1 theo từng cặp đoạn văn. Tích hợp audio phát âm chuẩn bản xứ theo từng câu.',
      badge: 'Đã hoàn thành Demo',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      code: 'BR-02',
      name: 'Contextual Academic Vocab Extraction',
      desc: 'Mỗi từ vựng bắt buộc đính kèm câu ngữ cảnh gốc (Context Sentence), phiên âm IPA, định nghĩa tiếng Việt và âm thanh phát âm.',
      badge: 'Đã hoàn thành Demo',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      code: 'BR-03',
      name: 'Safe Reflections Community (No-Judgment)',
      desc: 'Xóa bỏ áp lực chấm điểm và soi lỗi ngữ pháp. Tích hợp Quick Vocab Toolbar chèn từ nhanh vào cảm nghĩ người học.',
      badge: 'Đã hoàn thành Demo',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      code: 'BR-04',
      name: 'Two-Sided Flashcard & Spaced Repetition',
      desc: 'Thẻ 3D 2 mặt với cơ chế đánh giá nhị phân "Cần ôn lại" (Re-queue) và "Đã nhớ" theo chu kỳ 1 - 3 - 7 - 30 ngày.',
      badge: 'Đã hoàn thành Demo',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    },
    {
      code: 'SPEC-01',
      name: 'Multi-dimensional Filter Bar',
      desc: 'Lọc bài học theo Ma trận 2 chiều: Chủ đề văn hóa (Ẩm thực, Di sản, Danh lam...) x Cấp độ CEFR (A2, B1, B2, C1).',
      badge: 'Đã hoàn thành Demo',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-700/80 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                  Tài Liệu Kỹ Thuật & Nghiệp Vụ
                </span>
                <h2 className="font-serif text-xl font-bold text-white">
                  VN Culture Reader Project Specs
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Description */}
          <div className="py-6 space-y-4">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dự án được xây dựng dựa trên bộ tài liệu hoàn chỉnh tại thư mục <code className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 text-xs">/document</code> với các nguyên tắc cốt lõi:
            </p>

            <div className="space-y-3.5">
              {docModules.map((m, idx) => (
                <div key={idx} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      [{m.code}] {m.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
              <strong className="block font-bold">✨ Video Banner Asset:</strong>
              <p className="text-emerald-400/80">
                Đã tích hợp file video <code>Lotus_leaves_swaying_in_breeze_20260916204003.webm</code> làm banner động trang chủ với hiệu ứng thị giác và tương phản chữ cao cấp.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition-all border border-slate-700"
          >
            Đóng bảng đặc tả
          </button>
        </div>

      </div>
    </div>
  );
};
