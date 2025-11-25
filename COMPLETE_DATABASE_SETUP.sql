-- ============================================================================
-- COMPLETE DATABASE SETUP FOR HOSTEL SNACK SHOP
-- ============================================================================
-- Copy and paste this ENTIRE file into Supabase SQL Editor and click Run
-- ============================================================================

-- Step 1: Create all tables
-- ============================================================================

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  image_url text DEFAULT '',
  category text DEFAULT 'snacks',
  stock integer DEFAULT 0 CHECK (stock >= 0),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_room text NOT NULL,
  customer_phone text NOT NULL,
  total_amount decimal(10,2) NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  product_price decimal(10,2) NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  subtotal decimal(10,2) NOT NULL CHECK (subtotal >= 0)
);

-- Step 2: Enable Row Level Security
-- ============================================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Step 3: Create Security Policies
-- ============================================================================

-- Products policies (full access for admin functionality)
DROP POLICY IF EXISTS "Anyone can view available products" ON products;
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert products" ON products;
CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update products" ON products;
CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete products" ON products;
CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

-- Orders policies
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view their orders" ON orders;
CREATE POLICY "Anyone can view their orders"
  ON orders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Order items policies
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view order items" ON order_items;
CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

-- Step 4: Create Performance Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Step 5: Add Sample Data (Optional - comment out if not needed)
-- ============================================================================

INSERT INTO products (name, description, price, image_url, category, stock, is_available) VALUES
('Lays Classic Chips', 'Crispy and salty potato chips', 20.00, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', 'snacks', 50, true),
('Coca Cola', 'Refreshing cold drink 330ml', 40.00, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', 'drinks', 30, true),
('KitKat Chocolate', 'Delicious chocolate wafer bar', 30.00, 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400', 'sweets', 40, true),
('Kurkure Masala Munch', 'Spicy and crunchy snack', 15.00, 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400', 'snacks', 60, true),
('Pepsi', 'Chilled Pepsi 330ml', 40.00, 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400', 'drinks', 25, true),
('Dairy Milk Silk', 'Smooth milk chocolate', 50.00, 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400', 'sweets', 35, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- After running this, refresh your website at http://localhost:5173/
-- You should see sample products and be able to add more via admin panel
-- Admin password: admin123
-- ============================================================================
