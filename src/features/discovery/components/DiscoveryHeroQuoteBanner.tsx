import React from 'react';
import Link from '@/components/Link';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';

export const DiscoveryHeroQuoteBanner: React.FC = () => {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-rice-paper via-warm-ivory to-rice-paper border border-antique-gold/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-antique-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-heritage-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 space-y-3">
        {/* Cultural Sparkle Emblem */}
        <div className="w-10 h-10 rounded-2xl bg-heritage-green border border-antique-gold/50 flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-5 h-5 text-antique-gold" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-green">
          &ldquo;Mỗi bài học là một chuyến du hành văn hóa&rdquo;
        </h2>
        <p className="text-sm text-text-body mt-2 leading-relaxed max-w-xl mx-auto font-normal">
          Hãy duy trì thói quen đọc 10 phút mỗi ngày để vừa am hiểu sâu sắc văn hóa dân tộc, vừa nâng tầm tiếng Anh chuẩn academic &amp; IELTS.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap pt-2">
          <Link
            href="/bilingual-reader"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-warm-ivory bg-heritage-green hover:bg-heritage-dark shadow-sm transition-all focus-ring hover:scale-102"
          >
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span>Trải Nghiệm Đọc Song Ngữ</span>
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-warm-ivory hover:bg-rice-paper border border-antique-gold shadow-sm transition-all focus-ring hover:scale-102"
          >
            <span>Quay về Phòng Học</span>
            <ArrowRight className="w-3.5 h-3.5 text-antique-rich" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryHeroQuoteBanner;
