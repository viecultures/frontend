import React from 'react';
import { Heart, Mail } from 'lucide-react';
import logoImg from '../assets/logo/logo.jpg';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#070F0D] text-white/80 border-t border-white/10 pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-white shrink-0 shadow-md">
                <img src={logoImg} alt="VieCultures Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                VieCultures
              </span>
            </div>

            <p className="text-white/70 text-xs leading-relaxed max-w-sm font-normal">
              Cổng thông tin &amp; trải nghiệm học tiếng Anh văn hóa Việt Nam phong cách Modern Heritage Editorial &amp; Atmospheric Glassmorphism.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[#FCE5B5] border border-white/15 text-[11px] font-medium">
                ✓ Unboxed Editorial
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-[#F5D280] border border-white/15 text-[11px] font-medium">
                ✓ Atmospheric Glass
              </span>
            </div>
          </div>

          {/* Col 3: Topics */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#FCE5B5] uppercase tracking-wider mb-4">
              Chủ Đề Tiêu Biểu
            </h4>
            <ul className="space-y-2.5 font-normal text-white/75">
              <li><a href="#discovery" className="hover:text-[#FCE5B5] transition-colors">🎨 Tranh Dân Gian Đông Hồ</a></li>
              <li><a href="#discovery" className="hover:text-[#FCE5B5] transition-colors">🏛️ Đại Nội Cố Đô Huế</a></li>
              <li><a href="#discovery" className="hover:text-[#FCE5B5] transition-colors">🎋 Tà Áo Dài &amp; Lụa Tơ Tằm</a></li>
              <li><a href="#discovery" className="hover:text-[#FCE5B5] transition-colors">🍜 Bánh Mì &amp; Ẩm Thực Đường Phố</a></li>
            </ul>
          </div>

          {/* Col 4: Core Features */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#FCE5B5] uppercase tracking-wider mb-4">
              Phương Pháp EdTech
            </h4>
            <ul className="space-y-2.5 font-normal text-white/75">
              <li><span>📖 Bài Đọc Song Ngữ Cặp Đoạn</span></li>
              <li><span>🎧 Shadowing AI Từng Câu</span></li>
              <li><span>🎴 Flashcard 3D Spaced Repetition</span></li>
              <li><span>💬 Cảm Nghĩ No-Judgment Safe Zone</span></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#FCE5B5] uppercase tracking-wider mb-4">
              Liên Hệ &amp; Hợp Tác
            </h4>
            <p className="text-white/70 leading-relaxed mb-3 font-normal">
              Chào đón các nhà nghiên cứu văn hóa, dịch giả và người yêu văn hóa Việt đồng hành.
            </p>
            <div className="flex items-center gap-2 text-[#FCE5B5] font-medium">
              <Mail className="w-4 h-4" />
              <span>contact@viecultures.vn</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 font-normal">
          <p>© 2026 VieCultures. Thiết kế chuẩn Modern Heritage Glassmorphism (design.md).</p>
          <p className="flex items-center gap-1.5 text-white/70">
            <span>Tự hào văn hóa &amp; nghệ thuật Việt Nam</span>
            <Heart className="w-4 h-4 text-[#E58396] fill-[#E58396]" />
          </p>
        </div>

      </div>
    </footer>
  );
};
