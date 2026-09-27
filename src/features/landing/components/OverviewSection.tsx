import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, MessageCircle, Globe2, Sparkles, BookOpenCheck } from 'lucide-react';

export const OverviewSection: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      step: '01',
      title: 'Vượt qua bẫy dịch nghĩa đen (Literal Traps)',
      description:
        'Dịch máy thường biến "Bánh chưng" thành "Sticky rice cake", làm mất đi ý nghĩa trời đất tròn vuông. Bạn sẽ học cách diễn đạt từng sắc thái văn hoá bằng các cụm danh từ cao cấp và chính xác.',
      badge: 'Chấm dứt lỗi dịch ngô nghê',
    },
    {
      icon: MessageCircle,
      step: '02',
      title: 'Thấu hiểu & Truyền tải triết lý Á Đông',
      description:
        'Học cách giải thích "Vị thanh" trong phở, "Tình làng nghĩa xóm", hay sự hòa quyện âm dương ngũ hành trên mâm cơm bằng ngôn từ lôi cuốn, đánh thức cảm xúc của người nghe quốc tế.',
      badge: 'Ngôn từ giàu hình ảnh & cảm xúc',
    },
    {
      icon: Globe2,
      step: '03',
      title: 'Tự tin làm Đại sứ Di sản Toàn cầu',
      description:
        'Chuẩn bị năng lực diễn đạt xuất sắc cho du học sinh, hướng dẫn viên di sản, nhà ngoại giao văn hoá và người đi làm trong các tổ chức quốc tế.',
      badge: 'Năng lực thuyết trình B2 – C1',
    },
  ];

  return (
    <section
      id="triet-ly"
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 bg-[#FBF7EE] dark:bg-[#102B26] text-[#1E4B43] dark:text-[#FBF7EE] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* Editorial Section Header */}
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6E9FA1] dark:text-[#9FCED8]">
            Triết lý Giáo Dục Ngôn Ngữ
          </p>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] text-[#1E4B43] dark:text-[#FBF7EE]">
            Tại sao người Việt thường bối rối khi giới thiệu quê hương mình bằng tiếng Anh?
          </h2>
          <p className="text-sm sm:text-base text-[#1E4B43]/80 dark:text-[#FBF7EE]/80 font-light leading-relaxed">
            Chúng ta có thể đạt 7.5 – 8.0 IELTS nhưng khi được hỏi: <em>&ldquo;Tại sao người Việt cúng rằm tháng Bảy?&rdquo;</em> hay <em>&ldquo;Bát phở này khác gì ramen?&rdquo;</em>, chúng ta thường ấp úng vì thiếu vốn từ văn hoá bản sắc.
          </p>
        </div>

        {/* 3 Pillars Grid with Single Elevation & Palette Harmony */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 sm:p-7 rounded-2xl bg-[#FAF6ED] dark:bg-[#143731] border border-[#E8DFCB] dark:border-[#1E4B43] flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold text-[#D9B76A]">
                      {pillar.step}
                    </span>
                    <div className="p-2.5 rounded-xl bg-[#EAF5F2] dark:bg-[#1E4B43] text-[#1E4B43] dark:text-[#D9B76A] border border-[#B8E0D7] dark:border-transparent">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-[#6E9FA1] dark:text-[#9FCED8]">
                      {pillar.badge}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl text-[#1E4B43] dark:text-[#FBF7EE] font-normal leading-snug">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#1E4B43]/80 dark:text-[#FBF7EE]/75 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DFCB] dark:border-[#1E4B43]/50 flex items-center gap-2 text-xs text-[#1E4B43] dark:text-[#D9B76A] font-medium">
                  <BookOpenCheck className="w-3.5 h-3.5 text-[#D9B76A]" />
                  <span>Ứng dụng ngay trong bài tập thực hành</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
