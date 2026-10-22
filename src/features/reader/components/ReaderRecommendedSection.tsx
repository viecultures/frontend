import Link from "@/components/Link";
import { ArrowRight } from "lucide-react";
import type { RecommendedArticle } from "@/data/readerData";
import { paths } from '@/routes/paths';

interface ReaderRecommendedSectionProps {
  articles: RecommendedArticle[];
  themeMode: "paper" | "dark";
}

export function ReaderRecommendedSection({
  articles,
  themeMode,
}: ReaderRecommendedSectionProps) {
  return (
    <div data-practice-theme={themeMode} className="reader-practice-surface reader-recommended-component pt-8 border-t border-antique-gold/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-antique-gold">
            Continue reading
          </span>
          <h3
            className={`font-sans text-xl font-bold mt-0.5 ${themeMode === "dark" ? "text-warm-ivory" : "text-heritage-green"
              }`}
          >
            Recommended articles
          </h3>
        </div>
        <Link
          href="/discovery"
          className={`text-xs font-bold inline-flex items-center gap-1 transition-colors ${themeMode === "dark"
              ? "text-antique-gold hover:text-white"
              : "text-heritage-green hover:text-antique-gold"
            }`}
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}

            href={paths.reader({ story: article.id, level: article.level })}
            className={`reader-recommended-card group p-5 rounded-2xl border transition-all flex flex-col justify-between ${themeMode === "dark"
                ? "bg-[#1E2925] border-antique-gold/30 text-warm-ivory shadow-md hover:border-antique-gold"
                : "bg-warm-ivory border-heritage-green/12 text-ink-soft shadow-sm hover:shadow-md"
              }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-heritage-green bg-rice-paper px-2.5 py-1 rounded">
                {article.category}
              </span>
              <h4
                className={`font-sans text-base font-bold mt-3 group-hover:text-antique-gold transition-colors ${themeMode === "dark" ? "text-warm-ivory" : "text-heritage-green"
                  }`}
              >
                {article.title}
              </h4>
              <p className="text-xs opacity-80 mt-1.5 line-clamp-2 leading-relaxed">
                {article.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-antique-gold/20 flex items-center justify-between text-xs font-semibold opacity-80">
              <span>
                {article.readTime} • {article.vocabCount} words
              </span>
              <span className="text-antique-gold group-hover:translate-x-1 transition-transform inline-block font-bold">
                Read →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
