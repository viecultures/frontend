import { BookOpen, Landmark, UtensilsCrossed, Palette, Mountain, Feather, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DictionaryCategoryFilterProps {
  categories: { label: string; value: string }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = { All: BookOpen, Heritage: Landmark, Cuisine: UtensilsCrossed, Crafts: Palette, Nature: Mountain, Folklore: Feather };

export function DictionaryCategoryFilter({ categories, selectedCategory, onSelectCategory }: DictionaryCategoryFilterProps) {
  const { t } = useTranslation('flashcards');

  return (
    <div className="vocab-category-filter" role="group" aria-label={t('dictionary.search_input_aria', 'Filter by topic')}>
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.value] || BookOpen;
        return (
          <button
            key={category.value}
            aria-pressed={selectedCategory === category.value}
            onClick={() => onSelectCategory(category.value)}
          >
            <Icon size={16} />
            <span>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
}
