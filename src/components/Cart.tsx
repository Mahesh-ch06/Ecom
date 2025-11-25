import { X, Minus, Plus, ShoppingBag, Trash2, CheckCircle2, Tag } from 'lucide-react';
import { CartItem, Coupon } from '../lib/supabase';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  onCouponApplied?: (discount: number, couponCode: string) => void;
}

export function Cart({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onCouponApplied,
}: CartProps) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [manualCouponCode, setManualCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Check if it's late night (after 12:00 AM)
  const isLateNight = () => {
    const hour = new Date().getHours();
    return hour >= 0 && hour < 6; // 12 AM to 6 AM
  };

  const lateNightFee = isLateNight() ? 10 : 0;

  // Auto-apply SAVE5 coupon when cart value > ₹100
  useEffect(() => {
    const checkAndApplySAVE5 = async () => {
      // Don't auto-apply if user manually applied a different coupon
      if (appliedCoupon && appliedCoupon.code !== 'SAVE5') return;

      if (subtotal > 100) {
        try {
          const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', 'SAVE5')
            .eq('is_active', true)
            .single();

          if (data && !error && subtotal >= data.min_order_value) {
            setAppliedCoupon(data);
            if (onCouponApplied) {
              const discountAmount =
                data.discount_type === 'percentage'
                  ? (subtotal * data.discount_value) / 100
                  : data.discount_value;
              onCouponApplied(discountAmount, data.code);
            }
          }
        } catch (error) {
          console.error('Error fetching SAVE5 coupon:', error);
        }
      } else {
        // Remove SAVE5 coupon if cart value drops below ₹100
        if (appliedCoupon && appliedCoupon.code === 'SAVE5') {
          setAppliedCoupon(null);
          if (onCouponApplied) {
            onCouponApplied(0, '');
          }
        }
      }
    };

    checkAndApplySAVE5();
  }, [subtotal, onCouponApplied]);

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    // Check minimum order value
    if (subtotal < appliedCoupon.min_order_value) return 0;

    if (appliedCoupon.discount_type === 'percentage') {
      return (subtotal * appliedCoupon.discount_value) / 100;
    }
    return appliedCoupon.discount_value;
  };

  const discount = calculateDiscount();
  const total = Math.max(0, subtotal - discount + lateNightFee);

  const handleApplyManualCoupon = async () => {
    const code = manualCouponCode.toUpperCase().trim();
    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setCouponError('Invalid or inactive coupon code');
        return;
      }

      if (subtotal < data.min_order_value) {
        setCouponError(`Minimum order value ₹${data.min_order_value} required`);
        return;
      }

      setAppliedCoupon(data);
      setCouponError('');
      setManualCouponCode('');

      if (onCouponApplied) {
        const discountAmount =
          data.discount_type === 'percentage'
            ? (subtotal * data.discount_value) / 100
            : data.discount_value;
        onCouponApplied(discountAmount, code);
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCouponError('Failed to apply coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setManualCouponCode('');
    setCouponError('');
    if (onCouponApplied) {
      onCouponApplied(0, '');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-md z-50 flex flex-col animate-slide-in">
        <div className="h-full flex flex-col glass-effect border-l border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Your Cart</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={onClose}
              className={cn(
                "p-2 sm:p-2.5 rounded-xl transition-all duration-300 touch-manipulation",
                "bg-white/5 hover:bg-white/10 border border-white/10",
                "active:scale-95 sm:hover:scale-110 sm:hover:rotate-90"
              )}
            >
              <X size={18} className="text-gray-400 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-white/20 blur-3xl animate-pulse"></div>
                  <div className="relative bg-white/5 p-6 sm:p-8 rounded-full border border-white/10">
                    <ShoppingBag size={48} className="text-gray-500 sm:w-16 sm:h-16" />
                  </div>
                </div>
                <p className="text-base sm:text-lg text-gray-400 font-medium">Your cart is empty</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Add some snacks to get started</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.product.id}
                    className={cn(
                      "group relative rounded-xl sm:rounded-2xl p-3 sm:p-4",
                      "bg-white/5 border border-white/10",
                      "hover:bg-white/[0.07] hover:border-white/30",
                      "transition-all duration-300 animate-scale-in"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-gray-500/10 rounded-2xl blur-xl"></div>
                    </div>

                    <div className="relative flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-white mb-1 truncate group-hover:text-white transition-colors">
                          {item.product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
                          ₹{item.product.price.toFixed(2)} each
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 rounded-lg border border-white/10 p-1">
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  Math.max(0, item.quantity - 1)
                                )
                              }
                              className="p-1.5 rounded-md hover:bg-white/10 transition-colors active:scale-95 touch-manipulation"
                            >
                              <Minus size={14} className="text-gray-400" />
                            </button>
                            <span className="w-7 sm:w-8 text-center font-semibold text-white text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(
                                  item.product.id,
                                  Math.min(item.product.stock, item.quantity + 1)
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="p-1.5 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 touch-manipulation"
                            >
                              <Plus size={14} className="text-gray-400" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className={cn(
                              "ml-auto p-1.5 sm:p-2 rounded-lg transition-all duration-300 touch-manipulation",
                              "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20",
                              "active:scale-95 sm:hover:scale-110"
                            )}
                          >
                            <Trash2 size={14} className="text-red-400 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="font-bold text-white text-base sm:text-lg">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-white/10 p-4 sm:p-6 space-y-3 sm:space-y-4 bg-black/20">
              {/* Show discount info if SAVE5 is applied */}
              {appliedCoupon && (
                <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-white/10 border border-white/30 rounded-lg sm:rounded-xl">
                  <CheckCircle2 size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-white">{appliedCoupon.code} applied!</p>
                    <p className="text-xs text-gray-400">{appliedCoupon.description}</p>
                  </div>
                </div>
              )}

              {/* Show late night fee notice */}
              {lateNightFee > 0 && (
                <div className="flex items-center gap-2 p-2.5 sm:p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg sm:rounded-xl">
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-orange-400">Late Night Order</p>
                    <p className="text-xs text-gray-400">₹10 fee applies for orders after 12:00 AM</p>
                  </div>
                </div>
              )}

              {/* Coupon Input Section */}
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300">
                  <Tag size={14} className="text-white sm:w-4 sm:h-4" />
                  Have a coupon code?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white/10 border border-white/30 rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-white">{appliedCoupon.code}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-400 hover:text-red-300 font-medium touch-manipulation active:scale-95 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualCouponCode}
                        onChange={(e) => {
                          setManualCouponCode(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleApplyManualCoupon()}
                        placeholder="Enter code"
                        className={cn(
                          "flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/5 border",
                          "text-sm sm:text-base text-white placeholder:text-gray-500 uppercase",
                          "focus:outline-none focus:ring-2 focus:ring-white/50",
                          "transition-all duration-300",
                          couponError ? "border-red-500/50" : "border-white/10"
                        )}
                      />
                      <button
                        onClick={handleApplyManualCoupon}
                        className={cn(
                          "px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base",
                          "bg-white text-black border border-gray-300",
                          "hover:bg-gray-200 transition-all duration-300 touch-manipulation active:scale-95"
                        )}
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-400">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-white">
                    <span>Discount:</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                {lateNightFee > 0 && (
                  <div className="flex justify-between text-orange-400">
                    <span>Late Night Fee:</span>
                    <span>+₹{lateNightFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-lg sm:text-xl border-t border-white/10 pt-3 sm:pt-4">
                <span className="text-gray-400 font-medium">Total:</span>
                <span className="font-bold text-white">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              
              <button
                onClick={onCheckout}
                className={cn(
                  "w-full py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base text-black",
                  "bg-white border border-gray-300",
                  "hover:bg-gray-200",
                  "transition-all duration-300 active:scale-[0.98] sm:hover:scale-[1.02]",
                  "shadow-lg shadow-white/30 hover:shadow-white/50",
                  "relative overflow-hidden group touch-manipulation"
                )}
              >
                <span className="relative z-10">Proceed to Checkout</span>
                <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
