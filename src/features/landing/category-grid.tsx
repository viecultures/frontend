import React from "react";
import { Card } from "@/components/ui/card";
import { Landmark, Utensils, Scroll, Drama } from "lucide-react";

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      name: "History & Legends",
      nameVi: "Lịch Sử & Truyền Thuyết",
      icon: <Landmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      desc: "Immerse in ancient dynasties, heroic legends, and resistance sagas.",
      count: "120+ Stories"
    },
    {
      name: "Heritage & Architecture",
      nameVi: "Di Sản & Kiến Trúc",
      icon: <Scroll className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      desc: "Explore imperial citadels, ancient pagodas, and iconic Áo Dài.",
      count: "150+ Stories"
    },
    {
      name: "Culinary Arts",
      nameVi: "Văn Hóa Ẩm Thực",
      icon: <Utensils className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      desc: "Savor the rich heritage behind Phở, Bánh Mì, and Egg Coffee.",
      count: "110+ Stories"
    },
    {
      name: "Traditional Arts",
      nameVi: "Nghệ Thuật Dân Gian",
      icon: <Drama className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      desc: "Discover Water Puppetry, Quan Họ folk singing, and lacquer craft.",
      count: "95+ Stories"
    }
  ];

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 dark:text-amber-200">
          Four Pillars of Cultural Learning
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Select a domain to filter authentic reading material matching your interest.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Card
            key={cat.name}
            onClick={() => onSelectCategory(cat.name)}
            className="cursor-pointer group hover:border-amber-500/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {cat.icon}
            </div>
            <h3 className="font-serif font-bold text-lg text-amber-950 dark:text-amber-300">
              {cat.name}
            </h3>
            <p className="text-xs text-amber-800/70 dark:text-amber-400/70 font-medium italic mb-2">
              {cat.nameVi}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              {cat.desc}
            </p>
            <span className="inline-block text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
              {cat.count}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};
