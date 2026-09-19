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
      title: '1. Unboxed Layout (Bố Cục Mở)',
      color: 'Loại bỏ viền đen hộp bao quanh',
      desc: 'Chữ được giải phóng hoàn toàn, hiển thị trực tiếp trên nền tranh/video với hiệu ứng đổ bóng mờ cực mịn (text-shadow: 0 2px 14px rgba(0,0,0,0.5)).',
      tag: 'Bố cục'
    },
    {
      title: '2. Soft Organic Forms (Pill Shapes)',
      color: 'border-radius: 9999px (Pill Shape)',
      desc: 'Nút bấm, nhãn tag, ô tìm kiếm đều dùng bo tròn viên thuốc mềm mại, loại bỏ góc vuông cứng nhắc.',
      tag: 'Hình thái'
    },
    {
      title: '3. Atmospheric Glassmorphism',
      color: 'backdrop-filter: blur(16px)',
      desc: 'Khối chức năng nổi sử dụng chất liệu kính mờ bán trong suốt kết hợp đường viền mảnh 1px tinh tế.',
      tag: 'Hiệu ứng'
    },
    {
      title: '4. Hệ Màu Đương Đại (Golden Sun & Jade Silk)',
      color: 'Sungold Cream (#FCE5B5) • Deep Jade Glass (rgba(18,42,34,0.65))',
      desc: 'Màu vàng nắng lúa chín ấm kết hợp xanh ngọc bích sẫm của tà áo dài trong tranh.',
      tag: 'Bảng màu'
    },
    {
      title: '5. Typography Tạp Chí Cao Cấp',
      color: 'Playfair Display & Plus Jakarta Sans',
      desc: 'Phông tiêu đề serif thanh lịch cổ điển kết hợp phông sans-serif hiện đại tròn trịa êm mắt.',
      tag: 'Kiểu chữ'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl h-full bg-[#0D1C18]/95 border-l border-white/15 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-white/10 text-[#F5D280] flex items-center justify-center border border-white/15">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#FCE5B5] text-[10px] font-medium border border-white/15">
                  Tài Liệu Thiết Kế (DESIGN.MD)
                </span>
                <h2 className="font-heading text-2xl font-bold text-white mt-1">
                  Modern Heritage Editorial System
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description list */}
          <div className="py-6 space-y-4">
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
              Trang chủ được tái thiết kế tuân thủ nghiêm ngặt theo quy chuẩn cập nhật trong <code className="px-2 py-0.5 rounded-full bg-white/10 text-[#FCE5B5] border border-white/15 text-xs font-mono">document/design.md</code>:
            </p>

            <div className="space-y-3">
              {designSpecs.map((item, idx) => (
                <div key={idx} className="bg-black/40 p-4 rounded-[16px] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-base text-white">
                      {item.title}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-medium">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-medium text-[#F5D280]">
                    {item.color}
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-[16px] bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-2">
              <strong className="block font-semibold text-emerald-300">✨ Layout Wireframe Prototypes (Đã áp dụng):</strong>
              <p className="text-white/75 font-normal">
                Các trang HTML/CSS wireframe từ thư mục <code>layout/</code> đã được tích hợp vào dự án:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a href="./layout/index.html" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-[#F5D280] text-[#FCE5B5] font-medium text-[11px] flex items-center justify-between">
                  <span>Trang Chủ (Index)</span>
                  <span>↗</span>
                </a>
                <a href="./layout/reader-1.html" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-[#F5D280] text-[#FCE5B5] font-medium text-[11px] flex items-center justify-between">
                  <span>Reader Layout 1 (Dual)</span>
                  <span>↗</span>
                </a>
                <a href="./layout/reader-2.html" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-[#F5D280] text-[#FCE5B5] font-medium text-[11px] flex items-center justify-between">
                  <span>Reader Layout 2 (Classic)</span>
                  <span>↗</span>
                </a>
                <a href="./layout/discovery.html" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-[#F5D280] text-[#FCE5B5] font-medium text-[11px] flex items-center justify-between">
                  <span>Discovery Catalog</span>
                  <span>↗</span>
                </a>
                <a href="./layout/flashcards.html" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-[#F5D280] text-[#FCE5B5] font-medium text-[11px] flex items-center justify-between">
                  <span>3D Flashcards</span>
                  <span>↗</span>
                </a>
                <a href="./layout/community.html" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-black/40 border border-white/10 hover:border-[#F5D280] text-[#FCE5B5] font-medium text-[11px] flex items-center justify-between">
                  <span>Community Page</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            <div className="p-4 rounded-[16px] bg-black/40 border border-white/10 text-xs space-y-1">
              <strong className="block font-semibold text-white">✨ Tài Nguyên Đã Tích Hợp:</strong>
              <p className="text-white/75 font-normal">
                • Logo: <code>src/assets/logo/logo.jpg</code><br/>
                • Video Banner: <code>src/assets/banner.webm</code> (Toàn màn hình, không hiển thị trình độ)<br/>
                • Hình ảnh tranh mộc bản &amp; di sản: <code>src/assets/pictures/</code>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10">
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
