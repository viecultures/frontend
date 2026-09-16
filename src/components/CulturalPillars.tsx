import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const CulturalPillars: React.FC = () => {
  const pillars = [
    {
      icon: '🪷',
      title: 'Chất Nền Giấy Điệp Tự Nhiên',
      subtitle: 'Texture & Natural Ground',
      description: 'Sắc trắng ngà và vàng nhạt của vỏ sò điệp nghiền mịn trộn hồ nếp, mang lại cảm giác mộc mạc, bảo vệ thị giác và gợi nhớ tranh mộc bản cổ truyền.',
      tag: 'Bản Sắc Điệp',
      bg: 'bg-[#F8E9CF]',
      border: 'border-[#12332B]'
    },
    {
      icon: '🪵',
      title: 'Nét Khắc Than Tre Đanh Gọn',
      subtitle: 'Woodblock Outlines & Ink',
      description: 'Thay vì các đường viền mỏng manh mờ nhạt, toàn bộ khung card và nút bấm sử dụng nét khắc dứt khoát mô phỏng nhát dao khắc trên phôi gỗ thị.',
      tag: 'Nét Mộc Bản',
      bg: 'bg-[#FFFDF9]',
      border: 'border-[#12332B]'
    },
    {
      icon: '🌿',
      title: 'Mảng Màu Khoáng Thô Thuần Khiết',
      subtitle: 'Flat Natural Mineral Pigments',
      description: 'Màu vàng hoa hòe, xanh gỉ đồng, đỏ son vỏ vang, lam chàm và đen than tre. Các khối thông tin đổ màu phẳng tạo nhịp điệu dân gian rực rỡ.',
      tag: 'Màu Tự Nhiên',
      bg: 'bg-[#F8E9CF]',
      border: 'border-[#12332B]'
    },
    {
      icon: '📜',
      title: 'Bố Cục Ước Lệ & Khoảng Trống',
      subtitle: 'Composition & Negative Space',
      description: 'Không gian ước lệ thoáng đãng tôn lên vẻ đẹp thanh thoát của tà áo dài, mái đình làng và chữ viết học thuật mà không nhồi nhét chi tiết.',
      tag: 'Mỹ Học Dân Gian',
      bg: 'bg-[#FFFDF9]',
      border: 'border-[#12332B]'
    }
  ];

  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#FAF6EE]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-[#F8E9CF] border-2 border-[#12332B] text-xs font-bold text-[#12332B] mb-4 shadow-[2px_2px_0px_#12332B]">
          <Sparkles className="w-3.5 h-3.5 text-[#EAA22E]" />
          <span>TRIẾT LÝ THIẾT KẾ ĐÔNG HỒ ĐƯƠNG ĐẠI (DESIGN.MD)</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#12332B] mb-4 tracking-tight">
          Hội Họa Dân Gian &amp; Mỹ Thuật Truyền Thống
        </h2>
        <p className="text-[#4A635D] text-sm sm:text-base leading-relaxed">
          Tái hiện hồn tranh mộc bản dân tộc trong một giao diện EdTech đương đại, tôn vinh tiếng Anh văn hóa Việt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, index) => (
          <div
            key={index}
            className={`dongho-card p-6 flex flex-col justify-between ${p.bg} ${p.border}`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{p.icon}</span>
                <span className="dongho-tag bg-[#FAF6EE] text-[#12332B] text-[10px]">
                  {p.tag}
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#12332B] mb-1 leading-snug">
                {p.title}
              </h3>
              <p className="text-xs font-bold text-[#1A7368] mb-3">
                {p.subtitle}
              </p>
              <p className="text-xs text-[#4A635D] leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#12332B]/10 flex items-center justify-between text-xs font-bold text-[#12332B]">
              <span>Xem chi tiết quy chuẩn</span>
              <ArrowRight className="w-4 h-4 text-[#1A7368]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
