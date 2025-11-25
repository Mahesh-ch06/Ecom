-- Fix Coupon RLS Policies
-- Run this in Supabase SQL Editor to fix the deactivate coupon issue

-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can view active coupons" ON coupons;

-- Create new SELECT policy that allows viewing ALL coupons (not just active ones)
CREATE POLICY "Anyone can view all coupons"
  ON coupons FOR SELECT
  USING (true);

-- The update policy is already correct, but let's ensure it exists
DROP POLICY IF EXISTS "Anyone can update coupons" ON coupons;

CREATE POLICY "Anyone can update coupons"
  ON coupons FOR UPDATE
  USING (true)
  WITH CHECK (true);
