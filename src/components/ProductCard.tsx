import { ShoppingCart, Package, Plus, Minus } from 'lucide-react';
import { Product, CartItem } from '../lib/supabase';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  cartItems?: CartItem[];
  onUpdateQuantity?: (productId: string, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart, cartItems = [], onUpdateQuantity }: ProductCardProps) {
  const cartItem = cartItems.find(item => item.product.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl",
      "bg-gradient-to-br from-white/[0.07] to-white/[0.03]",
      "border border-white/10 backdrop-blur-sm",
      "transition-all duration-500 hover:scale-[1.02]",
      "hover:border-white/30 hover:shadow-2xl hover:shadow-white/10"
    )}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-gray-500/0 group-hover:from-white/5 group-hover:to-gray-500/5 transition-all duration-500 pointer-events-none" />
      
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Stock badge */}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-xs font-semibold text-white border border-orange-400/50">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Package size={40} className="mx-auto mb-2 text-gray-400" />
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          </div>
        )}
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="shimmer absolute inset-0" />
        </div>
      </div>

      {/* Content */}
      <div className="relative p-3 sm:p-5 space-y-3 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white text-sm sm:text-lg line-clamp-1 group-hover:text-white transition-colors duration-300">
              {product.name}
            </h3>
            <span className="text-base sm:text-xl font-bold text-white whitespace-nowrap">
              ₹{product.price.toFixed(2)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1.5 sm:pt-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              product.stock > 5 ? "bg-white" : product.stock > 0 ? "bg-orange-500" : "bg-gray-500"
            )} />
            <span className="text-xs text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onUpdateQuantity?.(product.id, quantityInCart - 1)}
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white",
                  "transition-all duration-300 active:scale-95 sm:hover:scale-110 border border-white/20",
                  "touch-manipulation"
                )}
              >
                <Minus size={14} className="sm:w-4 sm:h-4" />
              </button>
              <span className="min-w-[1.75rem] sm:min-w-[2rem] text-center font-bold text-white text-base sm:text-lg">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity?.(product.id, quantityInCart + 1)}
                disabled={quantityInCart >= product.stock}
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-all duration-300 active:scale-95 sm:hover:scale-110 border",
                  "touch-manipulation",
                  quantityInCart < product.stock
                    ? "bg-white hover:bg-gray-200 text-black border-gray-300"
                    : "bg-white/5 text-gray-500 cursor-not-allowed border-white/10"
                )}
              >
                <Plus size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.is_available || product.stock === 0}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm",
                "transition-all duration-300 active:scale-95 sm:hover:scale-105 touch-manipulation",
                product.is_available && product.stock > 0
                  ? "bg-white hover:bg-gray-200 text-black border border-gray-300 shadow-lg shadow-white/30"
                  : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
              )}
            >
              <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
