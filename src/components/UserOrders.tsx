import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Search } from 'lucide-react';
import { supabase, Order, OrderItem } from '../lib/supabase';
import { cn } from '../lib/utils';

interface OrderWithItems extends Order {
  items?: OrderItem[];
}

export function UserOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchRoom, setSearchRoom] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Auto-search if user has saved their email in localStorage
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setSearchEmail(savedEmail);
      // We'll fetch when component mounts if email is saved
      setTimeout(() => {
        const email = localStorage.getItem('userEmail');
        if (email) {
          setSearchEmail(email);
          setHasSearched(true);
          performSearch(email, '');
        }
      }, 100);
    }
  }, []);

  const performSearch = async (email: string, room: string) => {
    if (!email && !room) {
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (email) {
        query = query.ilike('customer_email', `%${email}%`);
        localStorage.setItem('userEmail', email); // Save for future visits
      }
      if (room) {
        query = query.eq('customer_room', room);
      }

      const { data: ordersData, error: ordersError } = await query;

      if (ordersError) throw ordersError;

      // Fetch all order items in parallel for better performance
      const orderIds = (ordersData || []).map(order => order.id);
      
      const { data: allItems, error: itemsError } = await supabase
        .from('order_items')
        .select('id, order_id, product_name, product_price, quantity, subtotal')
        .in('order_id', orderIds);

      if (itemsError) throw itemsError;

      // Group items by order_id
      const itemsByOrderId = (allItems || []).reduce((acc, item) => {
        if (!acc[item.order_id]) acc[item.order_id] = [];
        acc[item.order_id].push(item);
        return acc;
      }, {} as Record<string, typeof allItems>);

      // Combine orders with their items
      const ordersWithItems = (ordersData || []).map(order => ({
        ...order,
        items: itemsByOrderId[order.id] || []
      }));

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchEmail, searchRoom);
  };

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: CheckCircle },
    preparing: { label: 'Preparing', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: Package },
    ready: { label: 'Ready for Pickup', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle },
    delivered: { label: 'Delivered', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: XCircle },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold mb-2 text-white">Track Your Orders</h2>
        <p className="text-gray-400">Search by your email or room number to view order status</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="glass-effect rounded-2xl p-6 border border-white/10 mb-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={cn(
                'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10',
                'text-white placeholder:text-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                'transition-all duration-300'
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room Number (Optional)
            </label>
            <input
              type="text"
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              placeholder="e.g., 101, A-202"
              className={cn(
                'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10',
                'text-white placeholder:text-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
                'transition-all duration-300'
              )}
            />
          </div>
        </div>
        <button
          type="submit"
          className={cn(
            'w-full py-3 rounded-xl font-semibold text-white',
            'bg-gradient-to-r from-emerald-500 to-emerald-600',
            'hover:from-emerald-600 hover:to-emerald-700',
            'transition-all duration-300 hover:scale-[1.02]',
            'shadow-lg shadow-emerald-500/30',
            'flex items-center justify-center gap-2'
          )}
        >
          <Search size={20} />
          Search Orders
        </button>
      </form>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
          </div>
        </div>
      ) : !hasSearched ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4">
            <Package size={40} className="text-gray-500" />
          </div>
          <p className="text-lg text-gray-400">Enter your email or room number to view orders</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4">
            <Package size={40} className="text-gray-500" />
          </div>
          <p className="text-lg text-gray-400">No orders found</p>
          <p className="text-sm text-gray-500 mt-2">Try a different email or room number</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <div
                key={order.id}
                className={cn(
                  'glass-effect rounded-2xl p-6 border border-white/10',
                  'hover:border-emerald-500/30 transition-all duration-300',
                  'animate-fade-in'
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className={cn(
                    'px-4 py-2 rounded-full flex items-center gap-2 border',
                    statusConfig[order.status].color
                  )}>
                    <StatusIcon size={16} />
                    <span className="text-sm font-medium">
                      {statusConfig[order.status].label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Customer:</span>
                    <p className="font-medium text-white">{order.customer_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Room:</span>
                    <p className="font-medium text-white">{order.customer_room}</p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-sm text-gray-400">Notes:</span>
                    <p className="text-sm text-white">{order.notes}</p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-semibold text-white mb-3">Items:</h4>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm bg-white/5 p-3 rounded-lg">
                        <span className="text-gray-300">
                          {item.quantity}x {item.product_name}
                        </span>
                        <span className="font-medium text-emerald-400">
                          ₹{item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-gray-400">Total Amount:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
