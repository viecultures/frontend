import React from 'react';
import { Heart, Mail } from 'lucide-react';
import Link from './Link';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-heritage-dark text-warm-ivory/80 border-t border-antique-gold/20 pt-14 pb-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-antique-gold/15">

          {/* Col 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" theme="dark" />

            <p className="text-warm-ivory/70 text-xs leading-relaxed max-w-sm font-normal">
              Cổng thông tin &amp; trải nghiệm học tiếng Anh văn hóa Việt Nam phong cách Vietnamese Heritage Editorial &amp; Glassmorphism.
            </p>
          </div>

          {/* Col 3: Topics */}
          <div>
            <h4 className="font-serif font-bold text-sm text-antique-gold uppercase tracking-wider mb-3">
              Chủ Đề Tiêu Biểu
            </h4>
            <ul className="space-y-2 font-normal text-warm-ivory/75">
              <li><span className="hover:text-antique-gold transition-colors cursor-pointer">Tranh Dân Gian Đông Hồ</span></li>
              <li><span className="hover:text-antique-gold transition-colors cursor-pointer">Đại Nội Cố Đô Huế</span></li>
              <li><span className="hover:text-antique-gold transition-colors cursor-pointer">Tà Áo Dài &amp; Lụa Tơ Tằm</span></li>
              <li><span className="hover:text-antique-gold transition-colors cursor-pointer">Bánh Mì &amp; Ẩm Thực Đường Phố</span></li>
            </ul>
          </div>

          {/* Col 4: Core Features */}
          <div>
            <h4 className="font-serif font-bold text-sm text-antique-gold uppercase tracking-wider mb-3">
              Phương Pháp EdTech
            </h4>
            <ul className="space-y-2 font-normal text-warm-ivory/75">
              <li><span>Bài Đọc Song Ngữ Cặp Đoạn</span></li>
              <li><span>Shadowing AI Từng Câu</span></li>
              <li><span>Flashcard 3D Spaced Repetition</span></li>
              <li><Link href="/community" className="hover:text-antique-gold transition-colors focus-ring">Cảm Nghĩ No-Judgment Safe Zone</Link></li>
              <li><Link href="/community-2" className="hover:text-antique-gold transition-colors focus-ring">Thử Thách Văn Hóa &amp; Tích Xu </Link></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="font-serif font-bold text-sm text-antique-gold uppercase tracking-wider mb-3">
              Liên Hệ &amp; Hợp Tác
            </h4>
            <p className="text-warm-ivory/70 leading-relaxed mb-3 font-normal">
              Chào đón các nhà nghiên cứu văn hóa, dịch giả và người yêu văn hóa Việt đồng hành.
            </p>
            <div className="flex items-center gap-2 text-antique-gold font-medium">
              <Mail className="w-4 h-4" />
              <span>contact@viecultures.vn</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-warm-ivory/50 font-normal">
          <p>© 2026 VieCultures</p>
          <p className="flex items-center gap-1.5 text-warm-ivory/70">
            <span>Tự hào văn hóa &amp; nghệ thuật Việt Nam</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
