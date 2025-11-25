# Database Setup Guide

## Error: "relation 'products' does not exist"

This means the database tables haven't been created yet. You need to run the initial migration first.

## Solution: Create Tables in Supabase

### Step 1: Copy the Complete SQL

Copy ALL the SQL below (this creates the tables):

```sql
-- Hostel Snack Shop Database Schema
-- This creates all tables and policies

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

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for products (read and write)
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

-- Policies for orders
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policies for order_items
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
```

### Step 2: Run in Supabase

1. **Go to:** https://supabase.com/dashboard/project/wysdzeapploexrldqqlm/sql/new

2. **Click:** "New Query" (or + icon)

3. **Paste** all the SQL from above

4. **Click:** "Run" button (or press Ctrl+Enter)

5. **Wait** for success message: "Success. No rows returned"

### Step 3: Verify Tables Were Created

Run this verification query in the SQL Editor:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'orders', 'order_items');
```

You should see 3 tables listed.

### Step 4: Add Sample Products (Optional)

After tables are created, you can add some test products:

```sql
INSERT INTO products (name, description, price, image_url, category, stock, is_available) VALUES
('Lays Classic Chips', 'Crispy and salty potato chips', 20.00, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', 'snacks', 50, true),
('Coca Cola', 'Refreshing cold drink', 40.00, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', 'drinks', 30, true),
('KitKat Chocolate', 'Delicious chocolate wafer', 30.00, 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400', 'sweets', 40, true);
```

### Step 5: Test Your Website

1. Refresh http://localhost:5173/
2. You should now see the sample products
3. Login to admin (password: `admin123`)
4. Try adding a new product

## Troubleshooting

### "Permission denied" error?
Make sure you're logged into the correct Supabase account that owns this project.

### Still seeing errors?
1. Check the SQL Editor for red error messages
2. Make sure you copied the ENTIRE SQL block
3. Try running each CREATE TABLE statement one at a time

### Need to start fresh?
If you need to delete everything and start over:

```sql
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
```

Then run the CREATE TABLE statements again.

## Success!

Once you see "Success. No rows returned" after running the main SQL, your database is ready! 🎉
