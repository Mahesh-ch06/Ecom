import { cn } from '../lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-10">
      <button
        onClick={() => onSelectCategory('all')}
        className={cn(
          "px-6 py-2.5 rounded-full font-medium transition-all duration-300",
          "border backdrop-blur-sm hover:scale-105",
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/30'
            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            "px-6 py-2.5 rounded-full font-medium capitalize transition-all duration-300",
            "border backdrop-blur-sm hover:scale-105",
            selectedCategory === category
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/30'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
