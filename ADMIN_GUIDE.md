# 🔐 Admin Dashboard Guide

## Admin Access

The admin dashboard is now **password-protected** and includes full product management capabilities.

### Default Admin Password
```
admin123
```

**⚠️ IMPORTANT: Change this password in `src/App.tsx` line 13:**
```typescript
const ADMIN_PASSWORD = 'your-secure-password-here';
```

## Features

### 🔒 Security
- ✅ Password-protected admin panel
- ✅ Hidden from regular users
- ✅ Session-based authentication
- ✅ Logout on returning to shop view

### 📦 Product Management
- ✅ Add new products with image URLs
- ✅ View all products in inventory
- ✅ Toggle product availability (Available/Unavailable)
- ✅ Delete products
- ✅ Real-time updates to user interface
- ✅ Stock quantity tracking
- ✅ Category management

### 📋 Order Management
- ✅ View all orders
- ✅ Filter by status (pending, confirmed, preparing, ready, delivered)
- ✅ Update order status
- ✅ View customer details
- ✅ View order items and totals
- ✅ Cancel orders

## How to Access Admin Panel

1. **Click "Admin" button** in the top-right corner
2. **Enter admin password**: `admin123` (or your custom password)
3. **Access granted!** You can now manage products and orders

## Adding Products

1. Go to **Products Management** tab
2. Click **"Add New Product"** button
3. Fill in the form:
   - **Product Name**: e.g., "Classic Potato Chips"
   - **Description**: Brief product description
   - **Price**: Product price in ₹
   - **Stock Quantity**: Available stock
   - **Category**: e.g., "snacks", "drinks", "sweets"
   - **Image URL**: Direct link to product image

### Sample Image URLs (for testing)
```
Chips: https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400
Cola: https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400
Cookies: https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400
Candy: https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400
Water: https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400
Chocolate: https://images.unsplash.com/photo-1511381939415-e44015466834?w=400
```

4. Click **"Add Product"**
5. Product appears **instantly** in the shop view! ✨

## Managing Products

### Make Product Available/Unavailable
- Click the **"Available"/"Unavailable"** button on any product
- Status updates immediately
- Unavailable products won't show in shop view

### Delete Product
- Click **"Delete"** button
- Confirm the action
- Product is permanently removed

## Managing Orders

### Order Workflow
1. **Pending** → Customer placed order
2. **Confirmed** → You confirmed the order
3. **Preparing** → You're preparing the items
4. **Ready** → Order is ready for delivery
5. **Delivered** → Order has been delivered
6. **Cancelled** → Order was cancelled

### Update Order Status
- Click the appropriate button on each order card
- Status updates in real-time
- Customers can see status via email (if email service is configured)

## Real-Time Updates

When you add or update products:
- ✅ Changes appear **instantly** in the shop view
- ✅ No page refresh needed
- ✅ Users see new products immediately
- ✅ Stock updates reflect in real-time

## Tab Navigation

### Orders Management Tab
- View and manage all customer orders
- Filter by order status
- Update order workflow
- View customer details

### Products Management Tab
- View all products in a grid
- See stock levels at a glance
- Quick toggle availability
- Add new products easily

## Security Best Practices

1. **Change Default Password**
   ```typescript
   // In src/App.tsx
   const ADMIN_PASSWORD = 'YourSecurePassword123!';
   ```

2. **Don't Share Password**
   - Keep admin credentials private
   - Only authorized staff should have access

3. **Regular Monitoring**
   - Check orders regularly
   - Monitor product stock levels
   - Update product availability

## Keyboard Shortcuts

- **Escape**: Close any modal
- **Tab**: Navigate form fields
- **Enter**: Submit forms

## Tips for Success

### Product Images
- Use direct image URLs (ending in .jpg, .png, etc.)
- Unsplash images work great for testing
- Image preview shows before adding
- Recommended size: 400x300px or larger

### Categories
- Keep categories consistent
- Common categories: snacks, drinks, sweets, instant
- Categories auto-populate filter buttons in shop

### Stock Management
- Update stock regularly
- Products with stock = 0 show "Out of Stock"
- Low stock (< 5) shows warning badge

### Order Processing
- Process orders promptly
- Update status as you progress
- Confirm before cancelling orders

## Troubleshooting

### "Invalid password" error
- Check you're using the correct password
- Password is case-sensitive
- Make sure no extra spaces

### Products not showing in shop
- Check product is marked "Available"
- Check stock quantity > 0
- Try refreshing the page

### Images not loading
- Verify image URL is correct
- Check URL ends with image extension
- Try a different image URL

## Advanced Configuration

### Change Admin Password
```typescript
// src/App.tsx (line 13)
const ADMIN_PASSWORD = 'your-new-password';
```

### Customize Product Fields
Edit `src/components/AddProductModal.tsx` to add:
- Discount fields
- Multiple images
- Product variants
- Custom attributes

### Add More Order Statuses
Edit `statusConfig` in `src/components/AdminPanel.tsx`

---

## 🎉 You're all set!

Now you can:
1. ✅ Securely access admin dashboard
2. ✅ Add products that appear instantly
3. ✅ Manage orders efficiently
4. ✅ Control product availability
5. ✅ Monitor inventory in real-time

**Happy managing!** 🚀
