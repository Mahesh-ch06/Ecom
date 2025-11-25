-- Add Coupons Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value decimal(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_value decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can insert coupons"
  ON coupons FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update coupons"
  ON coupons FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete coupons"
  ON coupons FOR DELETE
  USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);

-- Insert default 5% off coupon for orders above ₹100
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, is_active) 
VALUES ('SAVE5', '5% off on orders above ₹100', 'percentage', 5, 100, true)
ON CONFLICT (code) DO NOTHING;
