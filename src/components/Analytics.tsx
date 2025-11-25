import { useState, useEffect } from 'react';
import { TrendingUp, Package, DollarSign, ShoppingBag, Calendar, Users, Star } from 'lucide-react';
import { supabase, Order, OrderItem } from '../lib/supabase';
import { cn } from '../lib/utils';

interface OrderWithItems extends Order {
  items?: OrderItem[];
}

interface ProductSales {
  product_name: string;
  quantity: number;
  revenue: number;
}

export function Analytics() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('today');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'delivered')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          return { ...order, items: items || [] };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      switch (timeFilter) {
        case 'today':
          return orderDate >= today;
        case 'week':
          return orderDate >= weekAgo;
        case 'month':
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredOrders = getFilteredOrders();

  // Calculate analytics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate unique customers
  const uniqueCustomers = new Set(filteredOrders.map(order => order.customer_email)).size;

  // Calculate total items sold
  const totalItemsSold = filteredOrders.reduce((sum, order) => 
    sum + (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0), 0
  );

  // Calculate orders by hour
  const ordersByHour: { [key: number]: number } = {};
  filteredOrders.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    ordersByHour[hour] = (ordersByHour[hour] || 0) + 1;
  });
  const peakHour = Object.entries(ordersByHour)
    .sort((a, b) => b[1] - a[1])[0];


  // Calculate product sales
  const productSales: { [key: string]: ProductSales } = {};
  filteredOrders.forEach(order => {
    order.items?.forEach(item => {
      if (!productSales[item.product_name]) {
        productSales[item.product_name] = {
          product_name: item.product_name,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[item.product_name].quantity += item.quantity;
      productSales[item.product_name].revenue += item.subtotal;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Calculate revenue by time period
  const revenueByDay: { [key: string]: number } = {};
  filteredOrders.forEach(order => {
    const date = new Date(order.created_at).toLocaleDateString();
    revenueByDay[date] = (revenueByDay[date] || 0) + order.total_amount;
  });
  const dailyRevenue = Object.entries(revenueByDay)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-7); // Last 7 days

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['today', 'week', 'month', 'all'].map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter as typeof timeFilter)}
            className={cn(
              'px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0',
              'border backdrop-blur-sm text-sm touch-manipulation',
              timeFilter === filter
                ? 'bg-white text-black border-gray-300 shadow-lg'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
            )}
          >
            {filter === 'today' && <Calendar size={16} className="inline mr-1" />}
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-effect rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-white/10">
              <DollarSign className="text-white" size={24} />
            </div>
            <TrendingUp className="text-white/50" size={20} />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-white">₹{totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">from {totalOrders} orders</p>
        </div>

        <div className="glass-effect rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-white/10">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <Package className="text-white/50" size={20} />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Orders</h3>
          <p className="text-3xl font-bold text-white">{totalOrders}</p>
          <p className="text-xs text-gray-500 mt-2">{totalItemsSold} items sold</p>
        </div>

        <div className="glass-effect rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-white/10">
              <TrendingUp className="text-white" size={24} />
            </div>
            <DollarSign className="text-white/50" size={20} />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Avg Order Value</h3>
          <p className="text-3xl font-bold text-white">₹{averageOrderValue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">per order</p>
        </div>

        <div className="glass-effect rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl bg-white/10">
              <Users className="text-white" size={24} />
            </div>
            <Star className="text-white/50" size={20} />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Unique Customers</h3>
          <p className="text-3xl font-bold text-white">{uniqueCustomers}</p>
          <p className="text-xs text-gray-500 mt-2">
            {peakHour ? `Peak: ${peakHour[0]}:00 (${peakHour[1]} orders)` : 'No data'}
          </p>
        </div>
      </div>

      {/* Top Products */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Package size={24} />
          Top Selling Products
        </h2>

        {topProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No delivered orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.product_name}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full font-bold text-white",
                  index === 0 ? "bg-yellow-500/20 border-2 border-yellow-500/50" :
                  index === 1 ? "bg-gray-300/20 border-2 border-gray-300/50" :
                  index === 2 ? "bg-orange-500/20 border-2 border-orange-500/50" :
                  "bg-white/10"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{product.product_name}</h3>
                  <p className="text-sm text-gray-400">Sold: {product.quantity} units</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">₹{product.revenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">revenue</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Revenue Trend */}
      {dailyRevenue.length > 0 && (
        <div className="glass-effect rounded-2xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={24} />
            Revenue Trend (Last 7 Days)
          </h2>
          <div className="space-y-3">
            {dailyRevenue.map(([date, revenue]) => {
              const maxRevenue = Math.max(...dailyRevenue.map(d => d[1]));
              const percentage = (revenue / maxRevenue) * 100;
              return (
                <div key={date} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{date}</span>
                    <span className="text-white font-semibold">₹{revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-white to-gray-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Delivered Orders */}
      <div className="glass-effect rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <ShoppingBag size={24} />
          Recent Delivered Orders
        </h2>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">No delivered orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.slice(0, 10).map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-white">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                    <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-xl font-bold text-white">₹{order.total_amount.toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.quantity}x {item.product_name}</span>
                      <span className="text-white">₹{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
