import React from 'react';
import Link from '@/components/Link';
import { ArrowRight } from 'lucide-react';

export const DiscoveryHeroQuoteBanner: React.FC = () => {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-rice-paper via-warm-ivory to-rice-paper border border-antique-gold/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
      <div className="max-w-2xl mx-auto relative z-10">
        <span className="text-3xl mb-2 block">🪷</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-heritage-green">
          &ldquo;Mỗi bài học là một chuyến du hành văn hóa&rdquo;
        </h2>
        <p className="text-sm text-text-body mt-3 leading-relaxed">
          Hãy duy trì thói quen đọc 10 phút mỗi ngày để vừa am hiểu sâu sắc văn hóa dân tộc, vừa nâng tầm tiếng Anh chuẩn academic &amp; IELTS.
        </p>
        <div className="mt-6">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-heritage-green bg-warm-ivory hover:bg-rice-paper border border-antique-gold shadow-sm transition-all focus-ring"
          >
            <span>Quay về Phòng Học VieCultures</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryHeroQuoteBanner;
