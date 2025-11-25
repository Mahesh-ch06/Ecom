/*
  # Fix Products Table Policies
  
  This migration adds missing RLS policies for the products table to allow:
  - INSERT: Anyone can add products (for admin functionality)
  - UPDATE: Anyone can update products (for admin functionality)
  - DELETE: Anyone can delete products (for admin functionality)
  
  Note: In production, these should be restricted to admin users only.
  For now, we're allowing public access for the admin panel to work.
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

-- Add policy to allow anyone to insert products
CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

-- Add policy to allow anyone to update products
CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add policy to allow anyone to delete products
CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

-- Also add missing policies for orders table (for admin to update status)
DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);
