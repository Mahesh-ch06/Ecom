import { useState, useEffect } from 'react';
import { ShoppingCart as CartIcon, Store, LayoutDashboard, Sparkles, Package } from 'lucide-react';
import { supabase, Product, CartItem } from './lib/supabase';
import { ProductCard } from './components/ProductCard';
import { CategoryFilter } from './components/CategoryFilter';
import { Cart } from './components/Cart';
import { CheckoutModal, CustomerInfo } from './components/CheckoutModal';
import { OrderConfirmation } from './components/OrderConfirmation';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { UserOrders } from './components/UserOrders';
import { cn } from './lib/utils';

// Admin password - change this to your desired password
const ADMIN_PASSWORD = 'admin123';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    
    // Listen for product updates
    const handleProductsUpdated = () => {
      fetchProducts();
    };
    
    window.addEventListener('productsUpdated', handleProductsUpdated);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, image_url, category, stock, is_available')
        .eq('is_available', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('Cannot add more items than available in stock');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSubmit = async (customerInfo: CustomerInfo) => {
    try {
      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const orderItems = cartItems.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }));

      // Single optimized query using RPC or batch insert
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_room: customerInfo.room,
          customer_phone: customerInfo.phone,
          total_amount: total,
          notes: customerInfo.notes || '',
          status: 'pending',
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // Insert order items with order_id
      const itemsWithOrderId = orderItems.map(item => ({
        ...item,
        order_id: orderData.id,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsWithOrderId);

      if (itemsError) throw itemsError;

      // Open WhatsApp with order details BEFORE updating UI
      const whatsappMessage = `Hey! New Order 🛒%0A%0AOrder ID: ${orderData.id}%0ARoom No: ${customerInfo.room}%0AName: ${customerInfo.name}%0APhone: ${customerInfo.phone}%0ATotal: ₹${total.toFixed(2)}`;
      const whatsappUrl = `https://wa.me/917382209714?text=${whatsappMessage}`;
      
      // Use location.href for better compatibility instead of window.open
      const newWindow = window.open(whatsappUrl, '_blank');
      if (!newWindow) {
        // Fallback if popup blocked
        window.location.href = whatsappUrl;
      }

      // Update UI after WhatsApp redirect
      setOrderId(orderData.id);
      setIsCheckoutOpen(false);
      setCartItems([]);
      setIsConfirmationOpen(true);
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Failed to place order: ${error?.message || 'Please try again'}`);
      throw error; // Re-throw to stop loading state
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleAdminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
    } else {
      alert('Invalid password!');
    }
  };

  const handleAdminToggle = () => {
    if (isAdminView) {
      // Switching back to shop view
      setIsAdminView(false);
      setIsAdminAuthenticated(false);
    } else {
      // Switching to admin view
      setIsAdminView(true);
      setShowMyOrders(false);
    }
  };

  const handleMyOrdersToggle = () => {
    setShowMyOrders(!showMyOrders);
    if (!showMyOrders) {
      setIsAdminView(false);
      setIsAdminAuthenticated(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
          <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-white">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <header className="sticky top-0 z-30 glass-effect border-b border-white/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                <div className="relative bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                  <Store className="text-black" size={20} />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-2xl font-bold text-white truncate">
                  Hostel Snack Shop
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
                  <Sparkles size={10} className="text-white flex-shrink-0" />
                  <span className="truncate">Order above ₹100 - Save 5%</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {!isAdminView && !showMyOrders && (
                <button
                  onClick={handleMyOrdersToggle}
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm",
                    "bg-white/5 hover:bg-white/10 border border-white/10",
                    "backdrop-blur-sm hover:scale-105"
                  )}
                >
                  <Package size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">My Orders</span>
                </button>
              )}
              {showMyOrders && (
                <button
                  onClick={handleMyOrdersToggle}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300",
                    "bg-white/5 hover:bg-white/10 border border-white/10",
                    "backdrop-blur-sm hover:scale-105"
                  )}
                >
                  <Store size={18} />
                  <span className="hidden sm:inline">Back to Shop</span>
                </button>
              )}
              <button
                onClick={handleAdminToggle}
                className={cn(
                  "flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm",
                  "bg-white/5 hover:bg-white/10 border border-white/10",
                  "backdrop-blur-sm hover:scale-105"
                )}
              >
                <LayoutDashboard size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">
                  {isAdminView ? 'Shop' : 'Admin'}
                </span>
              </button>
              {!isAdminView && !showMyOrders && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className={cn(
                    "relative flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm",
                    "bg-white text-black border border-gray-300",
                    "hover:bg-gray-200",
                    "transition-all duration-300 hover:scale-105"
                  )}
                >
                  <CartIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center animate-scale-in shadow-lg">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {isAdminView ? (
          <>
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent animate-fade-in">
              Admin Dashboard
            </h2>
            {isAdminAuthenticated ? (
              <AdminPanel />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )}
          </>
        ) : showMyOrders ? (
          <UserOrders />
        ) : (
          <>
            <div className="mb-6 sm:mb-12 animate-fade-in">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 text-white">
                Browse Our Products
              </h2>
              <p className="text-sm sm:text-lg text-gray-400">
                Fresh snacks and drinks delivered to your room
              </p>
              
              {/* Promotional Banner */}
              <div className="mt-4 sm:mt-6">
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl bg-white/10 border border-white/30 p-3 sm:p-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                  <div className="relative flex items-center justify-center gap-1.5 sm:gap-2 text-center">
                    <Sparkles size={14} className="text-white animate-pulse flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                    <p className="text-xs sm:text-base font-semibold text-white">
                      🎉 Order above ₹100 and get 5% OFF automatically!
                    </p>
                    <Sparkles size={14} className="text-white animate-pulse flex-shrink-0 sm:w-[18px] sm:h-[18px]" />
                  </div>
                </div>
              </div>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4">
                  <Store size={40} className="text-gray-500" />
                </div>
                <p className="text-lg text-gray-500">No products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={addToCart}
                      cartItems={cartItems}
                      onUpdateQuantity={updateQuantity}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleOrderSubmit}
        total={cartTotal}
      />

      <OrderConfirmation
        isOpen={isConfirmationOpen}
        orderId={orderId}
        onClose={() => setIsConfirmationOpen(false)}
      />
    </div>
  );
}

export default App;
