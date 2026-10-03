import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, Brain, Mic, ShieldCheck } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'VieCultures khác biệt gì so với các ứng dụng học tiếng Anh truyền thống?',
    answer:
      'Thay vì học qua các bài đọc mẫu phương Tây xa lạ, VieCultures kết hợp 100% ngữ liệu di sản văn hóa Việt Nam (ẩm thực, làng nghề, lịch sử triều đại, phong tục) với chuẩn tiếng Anh học thuật quốc tế (Level 1 - 3). Người học vừa nâng cao phản xạ tiếng Anh, vừa sở hữu vốn collocations chuẩn xác để tự hào chia sẻ văn hóa Việt với bạn bè thế giới.',
    category: 'Phương pháp',
    icon: <BookOpen className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-2',
    question: 'Tính năng Đọc Song Ngữ và tra từ 1 chạm hoạt động như thế nào?',
    answer:
      'Mỗi bài đọc trên VieCultures được biên soạn đối chiếu song ngữ chuẩn xác. Bạn có thể bấm vào bất kỳ từ vựng gạch chân nào để mở ngay bảng tra cứu IPA, từ loại, định nghĩa tiếng Việt, câu ví dụ thực tế và nghe phát âm AI bản ngữ chuẩn xác ở nhiều tốc độ (0.75x - 1.5x).',
    category: 'Bài đọc',
    icon: <Sparkles className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-3',
    question: 'Thuật toán Spaced Repetition (SRS) trong Flashcard giúp ghi nhớ ra sao?',
    answer:
      'VieCultures áp dụng biến thể tối ưu của thuật toán SM-2 (tương tự Anki). Dựa trên đánh giá của bạn sau mỗi lần lật thẻ ("Cần Ôn Lại", "Khó", "Đã Nhớ", "Rất Dễ"), hệ thống sẽ tự động tính toán thời điểm lặp lại lý tưởng (10 phút, 1 ngày, 3 ngày, 7 ngày...) theo đường cong quên lãng Ebbinghaus, giúp khắc sâu từ vựng vào trí nhớ dài hạn mà không tốn công ôn tập tràn lan.',
    category: 'Flashcard & Trí nhớ',
    icon: <Brain className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-4',
    question: 'AI Audio Shadowing hỗ trợ luyện phát âm ngữ điệu như thế nào?',
    answer:
      'Công nghệ tổng hợp giọng đọc chuẩn bản ngữ cho phép người học nghe từng câu đơn, nhại theo (shadowing) với tốc độ tùy chỉnh, chú trọng vào trọng âm từ (word stress), ngữ điệu câu (intonation) và nối âm bản xứ (connected speech) để nói tiếng Anh tự nhiên và trôi chảy.',
    category: 'Luyện âm',
    icon: <Mic className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-5',
    question: 'Không gian Safe Reflections là gì và tại sao không chấm điểm bằng bút đỏ?',
    answer:
      'Safe Reflections là không gian cộng đồng truyền cảm hứng, nơi người học tự do viết cảm nhận về bài đọc di sản mà không bị áp lực bởi những nét gạch đỏ soi lỗi ngữ pháp. Chúng tôi tin rằng sự tự tin và cảm xúc chân thực là chìa khóa để một người học trở thành Sứ Giả Văn Hóa thực thụ.',
    category: 'Cộng đồng',
    icon: <ShieldCheck className="w-4 h-4 text-antique-gold" />,
  },
  {
    id: 'faq-6',
    question: 'Tôi có thể bắt đầu học miễn phí trên VieCultures không?',
    answer:
      'Có! Toàn bộ bài đọc tiêu biểu, tính năng đọc song ngữ 1 chạm, nghe phát âm AI Shadowing và bộ thẻ Flashcards cốt lõi đều được mở miễn phí cho mọi người học. Bạn có thể tạo tài khoản chỉ trong vài giây để lưu lại tiến độ học tập của mình.',
    category: 'Tài khoản',
    icon: <Sparkles className="w-4 h-4 text-antique-gold" />,
  },
];

export const LandingFaqSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const handleToggle = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-surface border-t border-line">
      <div className="max-w-4xl mx-auto space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <HelpCircle className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-widest text-[11px] font-extrabold">
              GIẢI ĐÁP THẮC MẮC
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-text-main tracking-tight leading-tight">
            Câu Hỏi Thường Gặp <br className="hidden sm:inline" />
            <span className="italic text-antique-gold font-serif">Về VieCultures</span>
          </h2>

          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto font-normal leading-relaxed">
            Mọi điều bạn cần biết về phương pháp học tiếng Anh qua lăng kính di sản văn hóa Việt Nam cùng VieCultures.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-heritage-green/60 shadow-md ring-2 ring-antique-gold/20'
                    : 'bg-white/80 border-line hover:border-antique-gold/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggle(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-ring"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="p-2 rounded-xl bg-rice-paper shrink-0">
                      {faq.icon}
                    </span>
                    <span className="font-serif text-base sm:text-lg font-bold text-text-main">
                      {faq.question}
                    </span>
                  </div>

                  <span className="p-1 rounded-full text-heritage-green shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-antique-gold" /> : <ChevronDown className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-text-body leading-relaxed border-t border-line/40 animate-in fade-in duration-200">
                    <p className="pl-12 font-normal text-text-muted">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingFaqSection;
