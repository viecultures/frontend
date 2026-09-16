import React from 'react';
import { Heart, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-[2px]">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-lg">🪷</span>
                </div>
              </div>
              <span className="font-serif font-bold text-lg text-white">
                VN Culture Reader
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Nền tảng EdTech học tiếng Anh học thuật qua ngữ cảnh văn hóa, lịch sử và danh lam Việt Nam. Nuôi dưỡng thế hệ "Sứ giả Văn hóa" tự tin kết nối bản sắc dân tộc ra thế giới.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                ✓ Chuẩn CEFR A2 - C1
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-semibold">
                ✓ Shadowing AI
              </span>
            </div>
          </div>

          {/* Col 3: Topics */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">
              Chủ Đề Bài Đọc
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#discovery" className="hover:text-amber-300 transition-colors">🏛️ Lịch sử & Cố đô Huế</a></li>
              <li><a href="#discovery" className="hover:text-amber-300 transition-colors">🍜 Ẩm thực Bánh mì & Phở</a></li>
              <li><a href="#discovery" className="hover:text-amber-300 transition-colors">⛰️ Kỳ quan Vịnh Hạ Long</a></li>
              <li><a href="#discovery" className="hover:text-amber-300 transition-colors">🎋 Áo Dài & Đời sống Việt</a></li>
            </ul>
          </div>

          {/* Col 4: Core Modules */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">
              Tính Năng Cốt Lõi
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-slate-300">📖 Song ngữ Cặp Đoạn</span></li>
              <li><span className="text-slate-300">🎧 Shadowing Player AI</span></li>
              <li><span className="text-slate-300">🎴 Flashcard 3D Nhị Phân</span></li>
              <li><span className="text-slate-300">💬 Cảm Nghĩ No-Judgment</span></li>
            </ul>
          </div>

          {/* Col 5: EdTech Philosophy */}
          <div>
            <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-4">
              Đồng Hành
            </h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Dự án chào đón sự đóng góp nội dung từ các thầy cô giáo, dịch giả và người yêu văn hóa Việt.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Mail className="w-3.5 h-3.5" />
              <span>contact@englishspace.vn</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & cultural tribute */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 VN Culture Reader (EnglishSpace). Tự hào tôn vinh văn hóa Việt Nam.</p>
          <p className="flex items-center gap-1.5">
            <span>Thiết kế vì người học tiếng Anh Việt Nam</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>

      </div>
    </footer>
  );
};
