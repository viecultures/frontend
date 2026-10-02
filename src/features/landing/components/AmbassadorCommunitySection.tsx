import React from 'react';
import { Quote, Sparkles, Award, ShieldCheck, CheckCircle2, Users } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  avatarInitials: string;
  avatarBg: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Lê Thu Trang',
    role: 'Giáo viên Tiếng Anh & Tour Guide',
    location: 'Hà Nội',
    quote:
      'Học về lịch sử cà phê Sài Gòn và kiến trúc Thăng Long qua tiếng Anh học thuật giúp mình có vốn collocations bản xứ chuẩn xác để giới thiệu văn hóa Việt tới du khách quốc tế đầy tự hào!',
    avatarInitials: 'TT',
    avatarBg: 'bg-emerald-700 text-warm-ivory',
  },
  {
    name: 'Nguyễn Quốc Bảo',
    role: 'Sinh viên & Đại sứ Văn hóa Trẻ',
    location: 'TP. Hồ Chí Minh',
    quote:
      'Góc Safe Reflections cực kỳ giá trị. Viết cảm nhận bằng tiếng Anh mà không bị áp lực soi lỗi ngữ pháp hay điểm số đỏ giúp mình tự tin diễn đạt cảm xúc văn hóa sâu sắc.',
    avatarInitials: 'QB',
    avatarBg: 'bg-amber-700 text-warm-ivory',
  },
  {
    name: 'Mark Henderson',
    role: 'Chuyên gia Ngôn ngữ & Expat',
    location: 'Đà Nẵng',
    quote:
      'Là người nước ngoài sinh sống tại Việt Nam, VieCultures giúp tôi hiểu trọn vẹn biểu tượng văn hóa ngũ hành trong ẩm thực và di sản, đồng thời hỗ trợ các bạn trẻ luyện phát âm tự nhiên.',
    avatarInitials: 'MH',
    avatarBg: 'bg-sky-800 text-warm-ivory',
  },
  {
    name: 'Vũ Mai Linh',
    role: 'IELTS 8.0 & Nghiên cứu Di sản',
    location: 'Thừa Thiên Huế',
    quote:
      'Bộ Flashcard lặp ngắt quãng với thuật toán SM-2 giúp mình ghi nhớ hơn 500 thuật ngữ di sản kiến trúc cung đình mà không hề bị quên sau các kỳ thi.',
    avatarInitials: 'ML',
    avatarBg: 'bg-purple-800 text-warm-ivory',
  },
];

export const AmbassadorCommunitySection: React.FC = () => {
  return (
    <section
      id="trusted-community"
      className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line vn-pattern-bg"
    >
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <Users className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-widest text-[11px] font-extrabold">
              CỘNG ĐỒNG &amp; SỰ ĐỒNG HÀNH
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight leading-tight">
            Đồng Hành Cùng <br className="hidden sm:inline" />
            <span className="italic text-antique-gold font-serif">Hàng Ngàn Sứ Giả Văn Hóa</span>
          </h2>

          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Hơn 12,500 người học và đại sứ văn hóa trên toàn cầu đang lan tỏa bản sắc Việt Nam bằng tiếng Anh mỗi ngày.
          </p>
        </div>

        {/* Stats Bar Container */}
        <div className="rounded-3xl border-2 border-border-dark p-8 sm:p-10 bg-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-1.5">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-heritage-green tabular-nums">
              <AnimatedNumber value={500} />
              <span className="text-antique-gold font-light">+</span>
            </div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">
              Bài Đọc Di Sản Song Ngữ
            </p>
            <p className="text-[11px] text-mountain-teal font-medium">Chuẩn học thuật CEFR A2 - C1</p>
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 md:border-l md:border-r border-line pt-6 md:pt-0">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-heritage-green tabular-nums">
              <AnimatedNumber value={12500} />
              <span className="text-antique-gold font-light">+</span>
            </div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">
              Học Viên &amp; Đại Sứ Tích Cực
            </p>
            <p className="text-[11px] text-mountain-teal font-medium">Từ 32+ quốc gia trên thế giới</p>
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 border-line pt-6 md:pt-0">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-heritage-green tabular-nums">
              <AnimatedNumber value={150000} />
              <span className="text-antique-gold font-light">+</span>
            </div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-muted">
              Lượt Ôn Tập Thẻ Nhớ
            </p>
            <p className="text-[11px] text-mountain-teal font-medium">Tỷ lệ nhớ từ vựng đạt 94.8%</p>
          </div>
        </div>

        {/* 4 Testimonials Feedback Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-line shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              {/* Quote Body */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Quote className="w-6 h-6 text-antique-gold/60" />
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Đại Sứ Đã Xác Thực</span>
                  </span>
                </div>

                <p className="font-serif text-xs sm:text-sm text-text-main italic leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </div>

              {/* Author Row */}
              <div className="pt-3 border-t border-line flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-serif font-bold text-sm shadow-xs shrink-0 ${testimonial.avatarBg}`}
                >
                  {testimonial.avatarInitials}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-serif text-sm font-bold text-text-main truncate">
                    {testimonial.name}
                  </h4>
                  <p className="text-[11px] text-text-muted font-normal truncate">
                    {testimonial.role} • {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmbassadorCommunitySection;
