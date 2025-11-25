import { ShoppingBasket, Apple, Smartphone, Home, Shirt, Package, Grid3x3 } from 'lucide-react';
import { cn } from '../lib/utils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Map categories to icons
const categoryIcons: Record<string, any> = {
  all: Grid3x3,
  groceries: ShoppingBasket,
  fruits: Apple,
  electronics: Smartphone,
  home: Home,
  fashion: Shirt,
  default: Package,
};

const getCategoryIcon = (category: string) => {
  const IconComponent = categoryIcons[category.toLowerCase()] || categoryIcons.default;
  return IconComponent;
};

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const AllIcon = getCategoryIcon('all');
  
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
        <button
          onClick={() => onSelectCategory('all')}
          className={cn(
            "flex flex-col items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-300 flex-shrink-0",
            "border backdrop-blur-sm active:scale-95 touch-manipulation min-w-[70px]",
            selectedCategory === 'all'
              ? 'bg-white text-black border-gray-300 shadow-md'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
          )}
        >
          <AllIcon size={20} strokeWidth={2} />
          <span className="text-xs font-semibold">All</span>
        </button>
        {categories.map((category) => {
          const Icon = getCategoryIcon(category);
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium capitalize transition-all duration-300 flex-shrink-0",
                "border backdrop-blur-sm active:scale-95 touch-manipulation min-w-[70px]",
                selectedCategory === category
                  ? 'bg-white text-black border-gray-300 shadow-md'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              )}
            >
              <Icon size={20} strokeWidth={2} />
              <span className="text-xs font-semibold">{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
