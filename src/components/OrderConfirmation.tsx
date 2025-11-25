import { CheckCircle, Package, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface OrderConfirmationProps {
  isOpen: boolean;
  orderId: string;
  onClose: () => void;
}

export function OrderConfirmation({
  isOpen,
  orderId,
  onClose,
}: OrderConfirmationProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-md p-8 text-center border border-white/10 animate-scale-in relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500/30 blur-3xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-full">
                <CheckCircle size={64} className="text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3 flex items-center justify-center gap-2">
              Order Placed!
              <Sparkles size={24} className="text-emerald-400 animate-pulse" />
            </h2>
            
            <p className="text-gray-400 mb-8 text-lg">
              Your order has been successfully placed and will be prepared shortly.
            </p>
            
            <div className="bg-white/5 rounded-xl p-5 mb-8 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Package size={20} className="text-emerald-400" />
                <span className="text-sm font-medium text-gray-400">
                  Order ID
                </span>
              </div>
              <p className="text-2xl font-mono font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                {orderId.slice(0, 8).toUpperCase()}
              </p>
            </div>
            
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              You will receive updates about your order status via email.
              Please wait at your room for delivery.
            </p>
            
            <button
              onClick={onClose}
              className={cn(
                "w-full py-4 rounded-xl font-semibold text-white",
                "bg-gradient-to-r from-emerald-500 to-emerald-600",
                "hover:from-emerald-600 hover:to-emerald-700",
                "transition-all duration-300 hover:scale-[1.02]",
                "shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50",
                "relative overflow-hidden group"
              )}
            >
              <span className="relative z-10">Continue Shopping</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
