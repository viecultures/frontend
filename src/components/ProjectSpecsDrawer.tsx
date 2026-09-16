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
      title: '1. Chất Nền Giấy Điệp (Texture & Ground)',
      color: '#FAF6EE & #F8E9CF',
      desc: 'Nền giấy quét bột vỏ sò điệp nếp, loại bỏ màu trắng công nghiệp để tạo cảm giác mộc bản cổ truyền ấm áp.',
      tag: 'Bản sắc'
    },
    {
      title: '2. Nét Khắc Than Tre (Woodblock Outlines)',
      color: '#12332B (2px solid)',
      desc: 'Viền đanh gọn dứt khoát như nhát dao khắc gỗ, bo góc rất nhẹ (2px - 4px), không bo tròn viên thuốc lạm dụng.',
      tag: 'Nét khắc'
    },
    {
      title: '3. Bóng Đổ Cứng (Hard Cut-out Shadows)',
      color: 'box-shadow: 4px 4px 0px #12332B',
      desc: 'Bóng đổ dịch chuyển góc cứng mô phỏng các tấm mộc bản xếp chồng nhau khi in tranh.',
      tag: 'Hiệu ứng'
    },
    {
      title: '4. Mảng Màu Khoáng Thô (Flat Natural Pigments)',
      color: 'Xanh Sơn Mài (#1A7368) • Hồng Sen (#E58396) • Vàng Hoa Hòe (#EAA22E)',
      desc: 'Màu tự nhiên từ lá tre, dành dành, gỉ đồng và vỏ sò điệp tạo nên bảng màu dân gian rực rỡ.',
      tag: 'Bảng màu'
    },
    {
      title: '5. Typography Thống Nhất',
      color: 'Cormorant Garamond & Be Vietnam Pro',
      desc: 'Phông tiêu đề mô phỏng nét khắc cổ điển kết hợp phông chữ sans-serif quốc dân chuẩn tiếng Việt.',
      tag: 'Kiểu chữ'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[#12332B]/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-full bg-[#FAF6EE] border-l-2 border-[#12332B] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b-2 border-[#12332B]">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-[3px] bg-[#EAA22E] text-[#12332B] flex items-center justify-center border-2 border-[#12332B] shadow-[2px_2px_0px_#12332B]">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <span className="dongho-tag bg-[#E58396] text-[#12332B] text-[10px]">
                  Tài Liệu Thiết Kế (DESIGN.MD)
                </span>
                <h2 className="font-heading text-2xl font-bold text-[#12332B]">
                  Hệ Thống Giao Diện Đông Hồ Đương Đại
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-[3px] border border-[#12332B] bg-[#FAF6EE] text-[#12332B] hover:bg-[#E58396] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description list */}
          <div className="py-6 space-y-4">
            <p className="text-xs sm:text-sm text-[#4A635D] leading-relaxed">
              Trang chủ được tái thiết kế tuân thủ nghiêm ngặt theo quy chuẩn <code className="px-2 py-0.5 rounded-[2px] bg-[#F8E9CF] text-[#12332B] border border-[#12332B] text-xs font-bold font-mono">document/design.md</code>:
            </p>

            <div className="space-y-3">
              {designSpecs.map((item, idx) => (
                <div key={idx} className="bg-[#FFFDF9] p-4 rounded-[3px] border-2 border-[#12332B] shadow-[3px_3px_0px_#12332B] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-base text-[#12332B]">
                      {item.title}
                    </span>
                    <span className="dongho-tag bg-[#F8E9CF] text-[#12332B] text-[10px]">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-bold text-[#1A7368]">
                    {item.color}
                  </p>
                  <p className="text-xs text-[#4A635D] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-[3px] bg-[#F8E9CF] border-2 border-[#12332B] text-[#12332B] text-xs space-y-1">
              <strong className="block font-bold">✨ Tài Nguyên Đã Tích Hợp:</strong>
              <p className="text-[#4A635D]">
                • Logo: <code>src/assets/logo/logo.jpg</code><br/>
                • Video Banner: <code>src/assets/banner.webm</code><br/>
                • Hình ảnh tranh mộc bản &amp; di sản: <code>src/assets/pictures/</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t-2 border-[#12332B]">
          <button
            onClick={onClose}
            className="dongho-btn dongho-btn-primary w-full py-3 text-xs font-bold"
          >
            Đóng bảng quy chuẩn thiết kế
          </button>
        </div>

      </div>
    </div>
  );
};
