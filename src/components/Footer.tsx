import React from 'react';
import { Heart, Mail } from 'lucide-react';
import Link from './Link';
import logoImg from '../assets/logo/logo.jpg';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-heritage-dark text-warm-ivory/80 border-t border-antique-gold/20 pt-14 pb-10 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-antique-gold/15">

          {/* Col 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-antique-gold/40 overflow-hidden bg-heritage-green shrink-0 shadow-md flex items-center justify-center text-warm-ivory font-serif font-bold text-lg">
              </div>
              <span className="font-serif font-bold text-2xl text-warm-ivory">
                Vie<span className="text-antique-gold">Cultures</span>
              </span>
            </div>

            <p className="text-warm-ivory/70 text-xs leading-relaxed max-w-sm font-normal">
              Cổng thông tin &amp; trải nghiệm học tiếng Anh văn hóa Việt Nam phong cách Vietnamese Heritage Editorial &amp; Glassmorphism.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full bg-heritage-green text-antique-gold border border-antique-gold/30 text-[11px] font-medium">
                ✓ Heritage Light Palette
              </span>
              <span className="px-3 py-1 rounded-full bg-heritage-green text-[#9FCED8] border border-antique-gold/30 text-[11px] font-medium">
                ✓ Dual Reader Engine
              </span>
            </div>
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
              <li><Link href="/community-2" className="hover:text-antique-gold transition-colors focus-ring">Thử Thách Văn Hóa &amp; Tích Xu 💎</Link></li>
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
          <p>© 2026 VieCultures.</p>
          <p className="flex items-center gap-1.5 text-warm-ivory/70">
            <span>Tự hào văn hóa &amp; nghệ thuật Việt Nam</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
