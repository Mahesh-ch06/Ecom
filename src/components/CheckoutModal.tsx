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
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="glass-effect rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-white/10 animate-scale-in">
          <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 glass-effect">
            <h2 className="text-2xl font-bold text-white">
              Complete Your Order
            </h2>
            <button
              onClick={onClose}
              className={cn(
                "p-2.5 rounded-xl transition-all duration-300",
                "bg-white/5 hover:bg-white/10 border border-white/10",
                "hover:scale-110 hover:rotate-90"
              )}
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User size={16} className="text-emerald-500" />
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
                  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50",
                  "transition-all duration-300"
                )}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Mail size={16} className="text-emerald-500" />
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
                  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50",
                  "transition-all duration-300"
                )}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Home size={16} className="text-emerald-500" />
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
                  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50",
                  "transition-all duration-300"
                )}
                placeholder="A-201"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Phone size={16} className="text-emerald-500" />
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
                  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50",
                  "transition-all duration-300"
                )}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <MessageSquare size={16} className="text-emerald-500" />
                Special Instructions (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500 resize-none",
                  "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50",
                  "transition-all duration-300"
                )}
                placeholder="Any special requests..."
              />
            </div>

            <div className="border-t border-white/10 pt-5 mt-5">
              <div className="flex justify-between items-center mb-5">
                <span className="text-lg font-semibold text-gray-300">Total Amount:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold text-white",
                  "bg-gradient-to-r from-emerald-500 to-emerald-600",
                  "hover:from-emerald-600 hover:to-emerald-700",
                  "transition-all duration-300 hover:scale-[1.02]",
                  "shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50",
                  "relative overflow-hidden group",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
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
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
