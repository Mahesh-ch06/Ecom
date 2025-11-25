-- Performance Optimization for Supabase
-- Run these commands in Supabase SQL Editor to speed up queries

-- ============================================================================
-- INDEXES (Already created in initial migration, but verify they exist)
-- ============================================================================

-- Ensure all indexes are present for fast queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Add new indexes for faster email and room searches
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_room ON orders(customer_room);

-- Composite index for email + created_at (common query pattern)
CREATE INDEX IF NOT EXISTS idx_orders_email_created ON orders(customer_email, created_at DESC);

-- ============================================================================
-- ENABLE RLS BYPASS FOR FASTER READS (Optional - less secure)
-- ============================================================================

-- If your queries are still slow, you can use service role key instead
-- Or optimize RLS policies:

-- More efficient policies using EXISTS (if you have auth later)
-- For now, the simple policies are fine for development

-- ============================================================================
-- VACUUM AND ANALYZE (Run periodically for maintenance)
-- ============================================================================

-- Supabase automatically handles this, but you can manually trigger:
-- VACUUM ANALYZE products;
-- VACUUM ANALYZE orders;
-- VACUUM ANALYZE order_items;

-- ============================================================================
-- CONNECTION POOLING
-- ============================================================================

-- Supabase automatically uses PgBouncer for connection pooling
-- Make sure you're using the connection pooling URL in production:
-- postgres://[user]:[password]@[host]:6543/postgres (port 6543 for pooling)

-- ============================================================================
-- QUERY OPTIMIZATION TIPS
-- ============================================================================

-- 1. Always use .select() with specific columns instead of *
-- 2. Use .limit() to reduce data transfer
-- 3. Use .order() efficiently with indexes
-- 4. Use .in() for bulk operations instead of multiple queries
-- 5. Fetch related data in parallel, not sequentially

-- Example of optimized query:
-- const { data } = await supabase
--   .from('orders')
--   .select('id, status, total_amount, created_at')
--   .eq('customer_email', email)
--   .order('created_at', { ascending: false })
--   .limit(10);

-- ============================================================================
-- VERIFY INDEXES
-- ============================================================================

-- Check all indexes on a table:
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
    AND tablename IN ('products', 'orders', 'order_items')
ORDER BY
    tablename,
    indexname;
