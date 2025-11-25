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
    <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
      <button
        onClick={() => onSelectCategory('all')}
        className={cn(
          "px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 text-sm sm:text-base",
          "border backdrop-blur-sm active:scale-95 sm:hover:scale-105 touch-manipulation",
          selectedCategory === 'all'
            ? 'bg-white text-black border-gray-300 shadow-lg shadow-white/30'
            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30'
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            "px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium capitalize transition-all duration-300 whitespace-nowrap flex-shrink-0 text-sm sm:text-base",
            "border backdrop-blur-sm active:scale-95 sm:hover:scale-105 touch-manipulation",
            selectedCategory === category
              ? 'bg-white text-black border-gray-300 shadow-lg shadow-white/30'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30'
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
