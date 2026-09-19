import React from 'react';
import { Heart, Mail } from 'lucide-react';
import { BRAND_ASSETS } from '../assets';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#1E4B43] text-[#FBF7EE] border-t border-[#3D6E70] pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3D6E70]/60">
          
          {/* Col 1 & 2: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#D9B76A]/50 overflow-hidden bg-white shrink-0 shadow-md">
                <img src={BRAND_ASSETS.logo} alt="VieCultures Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-heading font-bold text-2xl text-[#FBF7EE]">
                  VieCultures
                </span>
                <p className="text-[11px] text-[#D9B76A] italic font-medium">
                  Khắc ghi nguồn cội, gìn giữ văn hóa
                </p>
              </div>
            </div>

            <p className="text-[#FBF7EE]/80 text-xs leading-relaxed max-w-sm font-normal">
              Nền tảng học tiếng Anh qua văn hóa và bản sắc Việt Nam. Gom từng từ nhỏ, hiểu một Việt Nam lớn.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-[#D9B76A] border border-white/15 text-[11px] font-medium">
                ✓ Warm Heritage Editorial
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-[#BFE3EA] border border-white/15 text-[11px] font-medium">
                ✓ Bốn Miền Khám Phá
              </span>
            </div>
          </div>

          {/* Col 3: Topics */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#D9B76A] uppercase tracking-wider mb-4">
              Bốn Miền Khám Phá
            </h4>
            <ul className="space-y-2.5 font-normal text-[#FBF7EE]/85">
              <li><a href="#kham-pha" className="hover:text-[#D9B76A] transition-colors">🎋 Nếp sống &amp; văn hóa</a></li>
              <li><a href="#kham-pha" className="hover:text-[#D9B76A] transition-colors">🏛️ Truyền thuyết</a></li>
              <li><a href="#kham-pha" className="hover:text-[#D9B76A] transition-colors">🍜 Ẩm thực</a></li>
              <li><a href="#kham-pha" className="hover:text-[#D9B76A] transition-colors">🎨 Lễ hội &amp; sắc màu</a></li>
            </ul>
          </div>

          {/* Col 4: Core Features */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#D9B76A] uppercase tracking-wider mb-4">
              Phương Pháp EdTech
            </h4>
            <ul className="space-y-2.5 font-normal text-[#FBF7EE]/85">
              <li><span>📖 Bài Đọc Song Ngữ Cặp Đoạn</span></li>
              <li><span>🎧 Shadowing AI Chuẩn Ngữ Cảnh</span></li>
              <li><span>🎴 Flashcard 3D Spaced Repetition</span></li>
              <li><span>💬 Cảm Nghĩ No-Judgment Safe Zone</span></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="font-heading font-bold text-base text-[#D9B76A] uppercase tracking-wider mb-4">
              Liên Hệ &amp; Hợp Tác
            </h4>
            <p className="text-[#FBF7EE]/80 leading-relaxed mb-3 font-normal">
              Chào đón các nhà nghiên cứu văn hóa, dịch giả và người học đam mê bản sắc Việt đồng hành.
            </p>
            <div className="flex items-center gap-2 text-[#D9B76A] font-medium">
              <Mail className="w-4 h-4" />
              <span>contact@viecultures.vn</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#FBF7EE]/60 font-normal">
          <p>© 2026 VieCultures. Quy chuẩn thiết kế Warm Heritage Editorial (design.md).</p>
          <p className="flex items-center gap-1.5 text-[#FBF7EE]/85">
            <span>Tự hào văn hóa &amp; nghệ thuật Việt Nam</span>
            <Heart className="w-4 h-4 text-[#E8B7B2] fill-[#E8B7B2]" />
          </p>
        </div>

      </div>
    </footer>
  );
};
