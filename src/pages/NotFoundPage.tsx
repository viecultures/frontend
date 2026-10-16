import React from 'react';
import { Compass, Home, BookOpen, ArrowLeft } from 'lucide-react';
import { PATHS } from '@/routes/paths';
import { Link } from '@/components/Link';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-heritage-green/10 border-2 border-antique-gold/40 flex items-center justify-center text-antique-gold mb-6 shadow-inner animate-pulse">
        <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-heritage-green dark:text-antique-gold" />
      </div>

      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-rice-paper text-heritage-green border border-antique-gold/50 mb-3">
        Lỗi 404 • Lạc Bước Hành Trình
      </span>

      <h1 className="font-serif text-3xl sm:text-5xl font-bold text-heritage-green dark:text-warm-ivory tracking-tight max-w-xl">
        Trang Không Tồn Tại
      </h1>

      <p className="text-sm sm:text-base text-text-body/80 dark:text-warm-ivory/80 max-w-md mt-4 leading-relaxed font-sans">
        Đường dẫn bạn vừa truy cập không tồn tại hoặc đã được chuyển sang địa chỉ mới trong không gian văn hóa VieCultures.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Link
          to={PATHS.home}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-heritage-green text-warm-ivory hover:bg-heritage-dark shadow-sm transition-all focus-ring"
        >
          <Home className="w-4 h-4 text-antique-gold" />
          <span>Về Phòng Học</span>
        </Link>

        <Link
          to={PATHS.discovery}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-warm-ivory text-heritage-green border border-antique-gold hover:bg-rice-paper shadow-sm transition-all focus-ring"
        >
          <BookOpen className="w-4 h-4 text-antique-rich" />
          <span>Khám Phá Bài Đọc</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
