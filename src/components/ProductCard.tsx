import { ShoppingCart, Package, Plus, Minus, Star, Bookmark } from 'lucide-react';
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
  
  // Calculate discount percentage for display
  const hasDiscount = product.stock < 10 && product.stock > 0;
  const discountPercent = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
  
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl sm:rounded-2xl",
      "bg-white/5 backdrop-blur-sm",
      "border border-white/10",
      "transition-all duration-300",
      "hover:border-white/20 hover:shadow-xl hover:shadow-white/5"
    )}>
      {/* Image container - Compact */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Bookmark Icon - Top Left */}
        <button className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all">
          <Bookmark size={14} className="text-white" />
        </button>
        
        {/* Discount Badge - Top Right */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-white text-black text-[10px] sm:text-xs font-bold shadow-lg">
            {discountPercent}% OFF
          </div>
        )}
        
        {/* Stock badge - Low stock warning */}
        {product.stock > 0 && product.stock < 5 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] sm:text-[10px] font-semibold">
            Only {product.stock} left
          </div>
        )}
        
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Package size={24} className="mx-auto mb-1 text-gray-400" />
              <span className="text-white text-xs font-semibold">Out of Stock</span>
            </div>
          </div>
        )}
      </div>

      {/* Content - Compact and Clean */}
      <div className="p-2.5 sm:p-3 space-y-2">
        {/* Product Name & Quantity/Weight */}
        <div className="space-y-0.5">
          <h3 className="font-semibold text-white text-xs sm:text-sm leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[2.8rem]">
            {product.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-400">
            {product.category}
          </p>
        </div>

        {/* Rating (Mock data for visual appeal) */}
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-yellow-500 text-yellow-500" />
          <span className="text-[10px] sm:text-xs text-gray-300 font-medium">
            4.{Math.floor(Math.random() * 5) + 3} ({Math.floor(Math.random() * 50) + 10}k)
          </span>
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-white leading-none">
              ₹{product.price.toFixed(0)}
            </span>
            {hasDiscount && (
              <span className="text-[9px] sm:text-[10px] text-gray-500 line-through">
                ₹{(product.price * 1.2).toFixed(0)}
              </span>
            )}
          </div>
          
          {/* Add to Cart / Quantity Controls */}
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-1 border border-white/20">
              <button
                onClick={() => onUpdateQuantity?.(product.id, quantityInCart - 1)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 touch-manipulation"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-[1.5rem] text-center font-bold text-white text-sm">
                {quantityInCart}
              </span>
              <button
                onClick={() => onUpdateQuantity?.(product.id, quantityInCart + 1)}
                disabled={quantityInCart >= product.stock}
                className={cn(
                  "p-1 rounded transition-all active:scale-90 touch-manipulation",
                  quantityInCart < product.stock
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-white/5 text-gray-500 cursor-not-allowed"
                )}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.is_available || product.stock === 0}
              className={cn(
                "p-2 rounded-lg transition-all active:scale-95 touch-manipulation",
                product.is_available && product.stock > 0
                  ? "bg-white text-black hover:bg-gray-200 shadow-lg"
                  : "bg-white/5 text-gray-500 cursor-not-allowed"
              )}
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
