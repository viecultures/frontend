import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Heart, Globe, BookOpen, Check } from 'lucide-react';

export const RoadmapHeritageSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <footer className="relative bg-[#1E4B43] text-[#FBF7EE] transition-colors duration-300">
      {/* Top Banner: Enrollment Invitation */}
      <div className="py-12 sm:py-16 px-4 sm:px-8 lg:px-12 border-b border-[#D9B76A]/20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D9B76A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đồng Hành Cùng Di Sản Việt</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] text-[#FBF7EE]" style={{ textWrap: 'balance' }}>
            Sẵn sàng kể câu chuyện quê hương bằng tiếng Anh đầy kiêu hãnh?
          </h2>

          <p className="text-sm sm:text-base text-[#FBF7EE]/80 font-light max-w-xl mx-auto leading-relaxed">
            Nhận trọn bộ cẩm nang <strong className="text-[#D9B76A]">100 Cụm Từ Vựng Bất Khả Dịch Của Văn Hoá Việt Nam</strong> (kèm audio phát âm) hoàn toàn miễn phí.
          </p>

          {/* Email Subscription Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            {isSubmitted ? (
              <div className="w-full p-4 rounded-2xl bg-[#BFE3EA]/20 border border-[#D9B76A] text-sm text-[#FBF7EE] flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-[#D9B76A]" />
                <span>Cảm ơn bạn! Cẩm nang đang được gửi tới email của bạn.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 rounded-2xl bg-[#143731] border border-[#D9B76A]/40 text-sm text-[#FBF7EE] placeholder-[#FBF7EE]/50 focus:outline-none focus:ring-2 focus:ring-[#D9B76A]"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-[#D9B76A] hover:bg-[#c6a355] text-[#102B26] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                >
                  Nhận Cẩm Nang Ngay
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
};
