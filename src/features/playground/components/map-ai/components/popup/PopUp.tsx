/**
 * Welcome & Guide Modal for Cultural Speaking & Listening AI Tutor
 */

import React, { type FC } from 'react';
import { PlayCircle, BookOpen, Map, Sparkles } from 'lucide-react';
import './PopUp.css';

interface PopUpProps {
  onClose: () => void;
}

export const PopUp: React.FC<PopUpProps> = ({ onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
          <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          <h2 className="text-xl font-serif font-bold text-white m-0">
            Sứ Giả Văn Hóa AI — Luyện Nói &amp; Luyện Nghe
          </h2>
        </div>

        <div className="popup-scrollable-content">
          <p className="text-sm text-gray-300 leading-relaxed">
            Chào mừng bạn đến với phòng luyện đàm thoại tiếng Anh thời gian thực cùng <strong>Gia sư AI Văn Hóa</strong>, được thiết kế đồng bộ với thư viện bài đọc văn hóa của VieCultures và bản đồ 34 tỉnh thành Việt Nam.
          </p>
          <p className="text-sm font-bold text-white mt-3 mb-2">
            Hướng dẫn luyện tập:
          </p>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <PlayCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300 leading-relaxed">
                <strong className="text-white">Bật đàm thoại: </strong>Bấm nút <span className="px-2 py-0.5 rounded bg-[#1E4B43] text-[#D4AF37] font-bold">▶ Play</span> để bắt đầu nói chuyện tự nhiên qua micro bằng tiếng Anh hoặc gõ tin nhắn văn bản.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300 leading-relaxed">
                <strong className="text-white">Luyện theo bài đọc: </strong>Chọn bài đọc văn hóa mục tiêu (Tết Nguyên Đán, Bánh Mì Sài Gòn, Cố Đô Huế, Phở Hà Nội, v.v.) để gia sư AI hỏi đáp, giải thích từ vựng và đố vui đọc hiểu.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Map className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300 leading-relaxed">
                <strong className="text-white">Đồng bộ bản đồ tương tác: </strong>Khi bạn hoặc gia sư AI nhắc đến địa danh (Hà Nội, Huế, Sài Gòn, Tây Nguyên...), bản đồ Việt Nam bên phải sẽ tự động làm nổi bật tỉnh thành và mở hồ sơ di sản tương ứng.
              </div>
            </li>
          </ol>
        </div>

        <button onClick={onClose} className="mt-4 px-4 py-2 bg-[#1E4B43] hover:bg-[#153630] text-[#D4AF37] font-bold rounded-xl shadow cursor-pointer transition-all">
          Bắt Đầu Luyện Nói Ngay!
        </button>
      </div>
    </div>
  );
};

export default PopUp;