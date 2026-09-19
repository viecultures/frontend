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

  const designSpecs = [
    {
      title: '1. Không Gian Giấy Mộc & Di Sản Ấm Áp',
      color: 'Kem ngà sáng (#FBF7EE) • Kem giấy (#F6EEDC)',
      desc: 'Nền giấy dó ấm cúng mang lại cảm giác lật mở từng trang sách ảnh di sản văn hóa, tránh nền trắng tinh công nghiệp gây mỏi mắt.',
      tag: 'Bản sắc'
    },
    {
      title: '2. Bảng Màu Văn Hóa Đương Đại',
      color: 'Xanh di sản (#1E4B43) • Vàng cổ (#D9B76A) • Hồng sen (#E8B7B2)',
      desc: 'Sắc xanh đậm của tà áo dài và nếp rêu cổ kính, kết hợp vàng son cung đình và cánh sen hồng tao nhã.',
      tag: 'Bảng màu'
    },
    {
      title: '3. Hệ Thống 3 Dòng Kiểu Chữ (Typography)',
      color: 'Playfair Display (Serif) • Be Vietnam Pro (Sans) • Dancing Script (Cursive)',
      desc: 'Serif trang trọng học thuật cho tiêu đề, Sans-serif tối ưu đọc lướt từ vựng và Cursive cho danh ngôn thi pháp.',
      tag: 'Kiểu chữ'
    },
    {
      title: '4. Bốn Miền Khám Phá (Explore Section)',
      color: 'Nếp sống & văn hóa • Truyền thuyết • Ẩm thực • Lễ hội & sắc màu',
      desc: 'Cấu trúc 4 chuyên đề với ảnh bìa tỷ lệ 4:3, thẻ bo góc mềm mại và nút chuyển tiếp trực quan.',
      tag: 'Bố cục'
    },
    {
      title: '5. Phương Pháp EdTech Toàn Diện',
      color: 'Shadowing AI • Spaced Repetition Flashcard • No-Judgment Community',
      desc: 'Tiếp thu từ vựng học thuật qua ngữ cảnh di sản thật, luyện nghe phát âm và tự do viết cảm nghĩ.',
      tag: 'Phương pháp'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl h-full bg-[#FBF7EE] border-l border-[#E8DFCB] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-[#E8DFCB]">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#F6EEDC] text-[#1E4B43] flex items-center justify-center border border-[#E8DFCB]">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F6EEDC] text-[#1E4B43] text-[10px] font-semibold border border-[#E8DFCB]">
                  Tài Liệu Thiết Kế (DESIGN.MD)
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#1E4B43] mt-1">
                  Warm Heritage Editorial System
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#6B635B] hover:text-[#1E4B43] hover:bg-[#F6EEDC] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description list */}
          <div className="py-6 space-y-4">
            <p className="text-xs sm:text-sm text-[#6B635B] leading-relaxed font-normal">
              Giao diện trang chủ đã được tái thiết kế tuân thủ nghiêm ngặt theo quy chuẩn mới nhất trong <code className="px-2 py-0.5 rounded-full bg-[#F6EEDC] text-[#1E4B43] border border-[#E8DFCB] text-xs font-mono font-semibold">document/design.md</code>:
            </p>

            <div className="space-y-3">
              {designSpecs.map((item, idx) => (
                <div key={idx} className="bg-[#FDFBF7] p-4 rounded-[16px] border border-[#E8DFCB] space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-base text-[#1E4B43]">
                      {item.title}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F6EEDC] text-[#1E4B43] text-[10px] font-semibold">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-[#8C6B28]">
                    {item.color}
                  </p>
                  <p className="text-xs text-[#6B635B] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-[16px] bg-[#BFE3EA]/25 border border-[#9FCED8] text-[#1E4B43] text-xs space-y-1">
              <strong className="block font-bold">✨ Lưu ý quản lý Asset:</strong>
              <p className="text-[#2C2523] font-normal">
                Các file asset (logo PNG trong suốt, icon sổ từ vựng, tranh minh họa phụ nữ &amp; sen, ảnh 4 thẻ chuyên đề) được định vị rõ ràng trong <code>document/design.md</code> để bạn chủ động bổ sung vào sau.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#E8DFCB]">
          <button
            onClick={onClose}
            className="btn-pill-primary w-full py-3 text-xs font-semibold"
          >
            Đóng bảng quy chuẩn thiết kế
          </button>
        </div>

      </div>
    </div>
  );
};
