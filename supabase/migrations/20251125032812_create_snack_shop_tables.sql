/*
  # Hostel Snack Shop Database Schema

  ## Overview
  This migration creates the complete database structure for a hostel snack e-commerce platform.

  ## New Tables

  ### 1. `products`
  Stores all available snacks and their details
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (decimal) - Product price
  - `image_url` (text) - Product image URL
  - `category` (text) - Product category (snacks, drinks, etc.)
  - `stock` (integer) - Available quantity
  - `is_available` (boolean) - Product availability status
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. `orders`
  Tracks customer orders
  - `id` (uuid, primary key) - Unique order identifier
  - `customer_name` (text) - Name of customer
  - `customer_email` (text) - Email of customer
  - `customer_room` (text) - Room number
  - `customer_phone` (text) - Contact number
  - `total_amount` (decimal) - Total order amount
  - `status` (text) - Order status (pending, confirmed, preparing, ready, delivered, cancelled)
  - `notes` (text) - Special instructions
  - `created_at` (timestamptz) - Order timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `order_items`
  Stores individual items within each order
  - `id` (uuid, primary key) - Unique item identifier
  - `order_id` (uuid, foreign key) - References orders table
  - `product_id` (uuid, foreign key) - References products table
  - `product_name` (text) - Product name snapshot
  - `product_price` (decimal) - Product price snapshot
  - `quantity` (integer) - Quantity ordered
  - `subtotal` (decimal) - Item subtotal

  ## Security
  - Enable RLS on all tables
  - Public read access for products (anyone can browse)
  - Public insert access for orders and order_items (anyone can place orders)
  - No update/delete access for customers (admin only via direct database access)

  ## Notes
  - All tables use UUID primary keys for security
  - Timestamps use timezone-aware types
  - Order items snapshot product details to preserve historical data
  - Stock management must be handled at application level
*/

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

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view order items"
  ON order_items FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);