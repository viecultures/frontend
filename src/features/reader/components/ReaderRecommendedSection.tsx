import Link from "@/components/Link";
import { ArrowRight } from "lucide-react";
import type { RecommendedArticle } from "@/data/readerData";

interface ReaderRecommendedSectionProps {
  articles: RecommendedArticle[];
  themeMode: "paper" | "dark";
}

export function ReaderRecommendedSection({
  articles,
  themeMode,
}: ReaderRecommendedSectionProps) {
  return (
    <div className="pt-8 border-t border-[rgba(217,183,106,0.2)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D9B76A]">
            Continue Reading
          </span>
          <h3
            className={`font-serif text-xl font-bold mt-0.5 ${
              themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
            }`}
          >
            Bài Đọc Đề Xuất Tiếp Theo
          </h3>
        </div>
        <Link
          href="/discovery"
          className={`text-xs font-bold inline-flex items-center gap-1 transition-colors ${
            themeMode === "dark"
              ? "text-[#D9B76A] hover:text-white"
              : "text-[#1E4B43] hover:text-[#D9B76A]"
          }`}
        >
          <span>Xem tất cả bài đọc</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href="/bilingual-reader"
            className={`group p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              themeMode === "dark"
                ? "bg-[#1E2925] border-[#D9B76A]/30 text-[#FBF7EE] shadow-md hover:border-[#D9B76A]"
                : "bg-[#FBF7EE] border-[rgba(30,75,67,0.12)] text-[#3F5550] shadow-sm hover:shadow-md"
            }`}
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4B43] bg-[#F6EEDC] px-2.5 py-1 rounded">
                {article.category} • {article.level}
              </span>
              <h4
                className={`font-serif text-base font-bold mt-3 group-hover:text-[#D9B76A] transition-colors ${
                  themeMode === "dark" ? "text-[#FBF7EE]" : "text-[#1E4B43]"
                }`}
              >
                {article.title}
              </h4>
              <p className="text-xs opacity-80 mt-1.5 line-clamp-2 leading-relaxed">
                {article.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(217,183,106,0.2)] flex items-center justify-between text-xs font-semibold opacity-80">
              <span>
                {article.readTime} • {article.vocabCount} Vocab
              </span>
              <span className="text-[#D9B76A] group-hover:translate-x-1 transition-transform inline-block font-bold">
                Đọc ngay →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
