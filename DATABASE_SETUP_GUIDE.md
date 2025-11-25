# Database Setup Guide - Coupons Feature

## Step 1: Apply Coupons Table Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** from the left sidebar
4. Click **+ New query**
5. Copy and paste the entire contents of `supabase/migrations/20251125_add_coupons_table.sql`
6. Click **Run** or press `Ctrl+Enter`

## Step 2: Verify Table Creation

Run this query in SQL Editor to verify the table was created:

```sql
SELECT * FROM coupons;
```

You should see one row with the `SAVE5` coupon (5% off on orders above ₹100).

## Step 3: Test the Admin Panel

1. Go to your app: http://localhost:5173/
2. Enter admin password: `admin123`
3. Click on the **Coupons Management** tab
4. You should see the SAVE5 coupon
5. Try creating a new coupon with the "Create Coupon" button

## How the Coupon System Works

### User Experience:
- **No coupon input field** - Users don't manually enter codes
- **Auto-apply SAVE5**: When cart value exceeds ₹100, the SAVE5 coupon (5% off) is automatically applied
- **Discount shown**: Only displays discount line when SAVE5 is auto-applied

### Admin Experience:
- **Full Control**: Create, edit, delete, and activate/deactivate coupons
- **Coupon Properties**:
  - Code (e.g., SAVE5, WELCOME10)
  - Description
  - Discount Type (percentage or fixed amount)
  - Discount Value
  - Minimum Order Value (₹)
  - Active/Inactive status

### Business Logic:
1. System checks cart subtotal
2. If subtotal > ₹100 AND SAVE5 coupon exists AND is active:
   - Auto-apply 5% discount
   - Show discount in cart summary
3. If subtotal ≤ ₹100:
   - No discount applied
   - No coupon UI shown

## Troubleshooting

### "Table already exists" error
If you see this error, the table was already created. You can skip Step 1.

### Can't see coupons in admin panel
1. Check browser console for errors
2. Verify RLS policies are enabled
3. Ensure table was created successfully

### Coupons not applying
1. Check that SAVE5 coupon `is_active = true`
2. Verify `min_order_value = 100`
3. Check cart subtotal is greater than ₹100
