import React from 'react';
import { Heart, Mail } from 'lucide-react';
import logoImg from '../assets/logo/logo.jpg';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#12332B] text-[#FAF6EE] border-t-4 border-[#EAA22E] pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#FAF6EE]/15">
          
          {/* Col 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] border-2 border-[#EAA22E] overflow-hidden bg-white shrink-0 shadow-[2px_2px_0px_#EAA22E]">
                <img src={logoImg} alt="VieCultures Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-heading font-bold text-2xl text-[#FAF6EE]">
                VieCultures
              </span>
            </div>

            <p className="text-[#FAF6EE]/80 text-xs leading-relaxed max-w-sm">
              Cổng thông tin &amp; nền tảng học tiếng Anh theo phong cách mỹ thuật tranh khắc gỗ dân gian Đông Hồ. Tôn vinh vẻ đẹp văn hóa, di sản và đời sống Việt Nam.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="dongho-tag bg-[#1A7368] text-white border-[#FAF6EE]">
                ✓ Nền Giấy Điệp
              </span>
              <span className="dongho-tag bg-[#EAA22E] text-[#12332B] border-[#FAF6EE]">
                ✓ Nét Mộc Bản Than Tre
              </span>
            </div>
          </div>

          {/* Col 3: Topics */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#EAA22E] uppercase tracking-wider mb-4">
              Chủ Đề Tiêu Biểu
            </h4>
            <ul className="space-y-2.5 font-medium text-[#FAF6EE]/85">
              <li><a href="#discovery" className="hover:text-[#EAA22E] transition-colors">🎨 Tranh Dân Gian Đông Hồ</a></li>
              <li><a href="#discovery" className="hover:text-[#EAA22E] transition-colors">🏛️ Đại Nội Cố Đô Huế</a></li>
              <li><a href="#discovery" className="hover:text-[#EAA22E] transition-colors">🎋 Tà Áo Dài &amp; Lụa Tơ Tằm</a></li>
              <li><a href="#discovery" className="hover:text-[#EAA22E] transition-colors">🍜 Bánh Mì &amp; Ẩm Thực Đường Phố</a></li>
            </ul>
          </div>

          {/* Col 4: Core Features */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#EAA22E] uppercase tracking-wider mb-4">
              Phương Pháp EdTech
            </h4>
            <ul className="space-y-2.5 font-medium text-[#FAF6EE]/85">
              <li><span>📖 Bài Đọc Song Ngữ Cặp Đoạn</span></li>
              <li><span>🎧 Shadowing AI Từng Câu</span></li>
              <li><span>🎴 Flashcard 3D Spaced Repetition</span></li>
              <li><span>💬 Cảm Nghĩ No-Judgment Safe Zone</span></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#EAA22E] uppercase tracking-wider mb-4">
              Liên Hệ &amp; Hợp Tác
            </h4>
            <p className="text-[#FAF6EE]/80 leading-relaxed mb-3">
              Chào đón các nhà nghiên cứu văn hóa, nghệ nhân mộc bản và giáo viên tiếng Anh đồng hành.
            </p>
            <div className="flex items-center gap-2 text-[#EAA22E] font-bold">
              <Mail className="w-4 h-4" />
              <span>contact@viecultures.vn</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#FAF6EE]/60 font-medium">
          <p>© 2026 VieCultures. Thiết kế chuẩn phong cách tranh mộc bản dân gian Đông Hồ (design.md).</p>
          <p className="flex items-center gap-1.5 text-[#FAF6EE]/80">
            <span>Tự hào văn hóa &amp; mỹ thuật dân tộc Việt</span>
            <Heart className="w-4 h-4 text-[#E58396] fill-[#E58396]" />
          </p>
        </div>

      </div>
    </footer>
  );
};
