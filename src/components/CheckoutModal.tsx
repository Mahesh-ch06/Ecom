import { useState } from 'react';
import { X, User, Mail, Home, Phone, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customerInfo: CustomerInfo) => void;
  total: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  room: string;
  phone: string;
  notes: string;
}

export function CheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  total,
}: CheckoutModalProps) {
  const [formData, setFormData] = useState<CustomerInfo>({
    name: '',
    email: '',
    room: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="glass-effect rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/10 animate-scale-in">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 sticky top-0 glass-effect">
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Complete Your Order
            </h2>
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

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <User size={14} className="text-white sm:w-4 sm:h-4" />
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={cn(
                  "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10",
                  "text-sm sm:text-base text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50",
                  "transition-all duration-300"
                )}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <Mail size={14} className="text-white sm:w-4 sm:h-4" />
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={cn(
                  "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10",
                  "text-sm sm:text-base text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50",
                  "transition-all duration-300"
                )}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <Home size={14} className="text-white sm:w-4 sm:h-4" />
                Room Number *
              </label>
              <input
                type="text"
                required
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                className={cn(
                  "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10",
                  "text-sm sm:text-base text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50",
                  "transition-all duration-300"
                )}
                placeholder="A-201"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <Phone size={14} className="text-white sm:w-4 sm:h-4" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={cn(
                  "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10",
                  "text-sm sm:text-base text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50",
                  "transition-all duration-300"
                )}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-300 mb-2">
                <MessageSquare size={14} className="text-white sm:w-4 sm:h-4" />
                Special Instructions (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className={cn(
                  "w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10",
                  "text-sm sm:text-base text-white placeholder:text-gray-500 resize-none",
                  "focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50",
                  "transition-all duration-300"
                )}
                placeholder="Any special requests..."
              />
            </div>

            <div className="border-t border-white/10 pt-4 sm:pt-5 mt-4 sm:mt-5">
              <div className="flex justify-between items-center mb-4 sm:mb-5">
                <span className="text-base sm:text-lg font-semibold text-gray-300">Total Amount:</span>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base text-black",
                  "bg-white border border-gray-300",
                  "hover:bg-gray-200",
                  "transition-all duration-300 active:scale-[0.98] sm:hover:scale-[1.02]",
                  "shadow-lg shadow-white/30 hover:shadow-white/50",
                  "relative overflow-hidden group touch-manipulation",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
                  "flex items-center justify-center gap-3"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span className="relative z-10">Placing Order...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Place Order</span>
                    <div className="absolute inset-0 bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
