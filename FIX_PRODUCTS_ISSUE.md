# Fix: "Failed to add product" Error

## Problem
The products table has Row Level Security (RLS) enabled, but is missing INSERT, UPDATE, and DELETE policies. This prevents the admin panel from adding, editing, or deleting products.

## Solution
You need to run the SQL migration to add the missing policies to your Supabase database.

## Steps to Fix

### Option 1: Using Supabase Dashboard (Easiest)

1. Go to your Supabase project: https://wysdzeapploexrldqqlm.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **+ New Query**
4. Copy and paste the following SQL:

```sql
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

-- Add policy to allow anyone to update orders (for status updates)
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```powershell
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref wysdzeapploexrldqqlm

# Push the migration
supabase db push
```

## Verify the Fix

1. Refresh your browser at http://localhost:5173/
2. Login to admin panel with password: `admin123`
3. Click "Products Management" tab
4. Click "Add New Product" button
5. Fill in the form and submit

The product should now be added successfully!

## What This Does

The SQL commands create RLS policies that allow:
- ✅ **INSERT**: Add new products to the database
- ✅ **UPDATE**: Modify existing products (toggle availability, edit details)
- ✅ **DELETE**: Remove products from the database
- ✅ **UPDATE orders**: Change order status (pending → confirmed → preparing, etc.)

## Security Note

⚠️ **Important for Production**: These policies currently allow *anyone* to modify products. For a production environment, you should:

1. Add authentication to your Supabase setup
2. Create an `admin_users` table
3. Modify the policies to check if the user is an admin:

```sql
-- Example secure policy (requires auth setup)
CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));
```

For now, since this is a local development environment, the open policies are fine.

## Still Having Issues?

If you still see the error after running the SQL:

1. Check the browser console (F12) for detailed error messages
2. Verify the SQL ran successfully in Supabase dashboard
3. Try logging out and back into the admin panel
4. Restart the dev server: `Ctrl+C` then `npm run dev`

## Quick Test Query

To verify policies are working, run this in Supabase SQL Editor:

```sql
-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'products';
```

You should see 4 policies listed:
1. Anyone can view available products (SELECT)
2. Anyone can insert products (INSERT)
3. Anyone can update products (UPDATE)
4. Anyone can delete products (DELETE)
