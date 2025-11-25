# Quick Start - Admin-Managed Coupons

## 🚀 Get Started in 3 Steps

### Step 1: Apply Database Migration (2 minutes)

1. Open **Supabase Dashboard**: https://supabase.com/dashboard
2. Go to **SQL Editor** → **+ New query**
3. Copy contents of `supabase/migrations/20251125_add_coupons_table.sql`
4. Paste and click **Run**
5. Done! ✅

### Step 2: Test Admin Panel (1 minute)

1. Go to http://localhost:5173/
2. Enter password: `admin123`
3. Click **Coupons Management** tab
4. You should see **SAVE5** coupon listed
5. Try clicking **Create Coupon** to add a new one

### Step 3: Test Auto-Apply (1 minute)

1. Exit admin panel (go back to main app)
2. Add items totaling **less than ₹100** to cart
   - No discount shown ✓
3. Add more items to exceed **₹100**
   - Green "SAVE5 applied!" badge appears ✓
   - 5% discount shows in total ✓

## ✅ What Changed?

| Before | After |
|--------|-------|
| Hardcoded coupons in code | Database-managed coupons |
| Users manually enter codes | Auto-applies SAVE5 at ₹100+ |
| Coupon list shown to users | No coupon UI for users |
| No admin management | Full admin CRUD interface |

## 🎯 Key Features

- **Admin creates/deletes/deactivates coupons** via dashboard
- **SAVE5 auto-applies** when cart > ₹100
- **No default discount** - only applies when conditions met
- **Clean user experience** - no coupon input fields

## 📖 Full Documentation

See `COUPON_SYSTEM_SUMMARY.md` for complete details.

---

**Need Help?** Check the console for errors or verify the database migration ran successfully.
