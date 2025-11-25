import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Plus, ShoppingBag, ListOrdered, Tag } from 'lucide-react';
import { supabase, Order, OrderItem, Product } from '../lib/supabase';
import { cn } from '../lib/utils';
import { AddProductModal } from './AddProductModal';
import { CouponManagement } from './CouponManagement';

interface OrderWithItems extends Order {
  items?: OrderItem[];
}

export function AdminPanel() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'coupons'>('orders');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
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

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(
    (order) => filter === 'all' || order.status === filter
  );

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    preparing: { label: 'Preparing', color: 'bg-purple-100 text-purple-800', icon: Package },
    ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    delivered: { label: 'Delivered', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  const toggleProductAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !currentStatus })
        .eq('id', productId);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddProductOpen(true);
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={cn(
            'px-6 py-3 rounded-xl font-medium transition-all duration-300',
            'border backdrop-blur-sm hover:scale-105 flex items-center gap-2',
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/30'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
          )}
        >
          <ListOrdered size={20} />
          Orders Management
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={cn(
            'px-6 py-3 rounded-xl font-medium transition-all duration-300',
            'border backdrop-blur-sm hover:scale-105 flex items-center gap-2',
            activeTab === 'products'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/30'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
          )}
        >
          <ShoppingBag size={20} />
          Products Management
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={cn(
            'px-6 py-3 rounded-xl font-medium transition-all duration-300',
            'border backdrop-blur-sm hover:scale-105 flex items-center gap-2',
            activeTab === 'coupons'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/30'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
          )}
        >
          <Tag size={20} />
          Coupons Management
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <>
          <div className="flex flex-wrap gap-3 mb-8">
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              "px-6 py-2.5 rounded-full font-medium capitalize transition-all duration-300",
              "border backdrop-blur-sm hover:scale-105",
              filter === status
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500/50 shadow-lg shadow-emerald-500/30'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-emerald-500/30'
            )}
          >
            {status === 'all' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4">
              <Package size={40} className="text-gray-500" />
            </div>
            <p className="text-lg text-gray-500">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon;
            return (
              <div key={order.id} className={cn(
                "glass-effect rounded-2xl p-6 border border-white/10",
                "hover:border-emerald-500/30 transition-all duration-300"
              )}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "px-3 py-1.5 rounded-full flex items-center gap-2 border",
                      order.status === 'pending' && 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
                      order.status === 'confirmed' && 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                      order.status === 'preparing' && 'bg-purple-500/10 text-purple-400 border-purple-500/30',
                      order.status === 'ready' && 'bg-green-500/10 text-green-400 border-green-500/30',
                      order.status === 'delivered' && 'bg-gray-500/10 text-gray-400 border-gray-500/30',
                      order.status === 'cancelled' && 'bg-red-500/10 text-red-400 border-red-500/30'
                    )}>
                      <StatusIcon size={16} />
                      <span className="text-sm font-medium">
                        {statusConfig[order.status].label}
                      </span>
                    </div>
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
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="font-medium text-white">{order.customer_email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <p className="font-medium text-white">{order.customer_phone}</p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-sm text-gray-400">Notes:</span>
                    <p className="text-sm text-white">{order.notes}</p>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4 mb-4">
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
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                  <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    Total: ₹{order.total_amount.toFixed(2)}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                          "bg-blue-500/10 text-blue-400 border border-blue-500/30",
                          "hover:bg-blue-500/20 hover:scale-105"
                        )}
                      >
                        Confirm
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                          "bg-purple-500/10 text-purple-400 border border-purple-500/30",
                          "hover:bg-purple-500/20 hover:scale-105"
                        )}
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                          "bg-green-500/10 text-green-400 border border-green-500/30",
                          "hover:bg-green-500/20 hover:scale-105"
                        )}
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                          "bg-gray-500/10 text-gray-400 border border-gray-500/30",
                          "hover:bg-gray-500/20 hover:scale-105"
                        )}
                      >
                        Mark Delivered
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                          "bg-red-500/10 text-red-400 border border-red-500/30",
                          "hover:bg-red-500/20 hover:scale-105"
                        )}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
        </>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-white">
              Product Inventory ({products.length})
            </h3>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-xl font-medium",
                "bg-gradient-to-r from-emerald-500 to-emerald-600",
                "hover:from-emerald-600 hover:to-emerald-700",
                "text-white transition-all duration-300 hover:scale-105",
                "shadow-lg shadow-emerald-500/30"
              )}
            >
              <Plus size={20} />
              Add New Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className={cn(
                  "glass-effect rounded-2xl p-5 border border-white/10",
                  "hover:border-emerald-500/30 transition-all duration-300"
                )}
              >
                <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-gray-800 to-gray-900">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-white text-lg">{product.name}</h4>
                    <span className="text-lg font-bold text-emerald-400">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Stock: {product.stock}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => toggleProductAvailability(product.id, product.is_available)}
                      className={cn(
                        "flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-300",
                        product.is_available
                          ? "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/30 hover:bg-gray-500/20"
                      )}
                    >
                      {product.is_available ? 'Available' : 'Unavailable'}
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300",
                        "bg-blue-500/10 text-blue-400 border border-blue-500/30",
                        "hover:bg-blue-500/20 hover:scale-105"
                      )}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300",
                        "bg-red-500/10 text-red-400 border border-red-500/30",
                        "hover:bg-red-500/20 hover:scale-105"
                      )}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && <CouponManagement />}

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setEditingProduct(null);
        }}
        onProductAdded={() => {
          fetchProducts();
          setEditingProduct(null);
          // Trigger a refresh on the main app
          window.dispatchEvent(new Event('productsUpdated'));
        }}
        editingProduct={editingProduct}
      />
    </div>
  );
}
