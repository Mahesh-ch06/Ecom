# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Your Supabase project URL and Anon Key

## Step 1: Push Code to GitHub

1. **Create a new GitHub repository**
   - Go to https://github.com/new
   - Create a new repository (e.g., "hostel-snack-shop")
   - Don't initialize with README (we already have one)

2. **Push your code to GitHub**
   ```powershell
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit"
   
   # Add remote (replace with your repo URL)
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select "hostel-snack-shop" (or your repo name)

3. **Configure Project**
   - Framework Preset: **Vite**
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   - Name: `VITE_SUPABASE_URL`
     Value: `https://wysdzeapploexrldqqlm.supabase.co`
   
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: `[Your Supabase Anon Key - get from Supabase Dashboard → Settings → API]`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Option B: Via Vercel CLI

1. **Install Vercel CLI**
   ```powershell
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```powershell
   vercel login
   ```

3. **Deploy**
   ```powershell
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name: `hostel-snack-shop`
   - Directory: `./`
   - Override settings? `N`

4. **Add Environment Variables**
   ```powershell
   vercel env add VITE_SUPABASE_URL
   # Enter: https://wysdzeapploexrldqqlm.supabase.co
   
   vercel env add VITE_SUPABASE_ANON_KEY
   # Enter: [Your Supabase Anon Key]
   ```

5. **Deploy to Production**
   ```powershell
   vercel --prod
   ```

## Step 3: Update Supabase URL (if needed)

If your Supabase URL is hardcoded, update it to use environment variables:

**src/lib/supabase.ts:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wysdzeapploexrldqqlm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
```

## Step 4: Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

## Step 5: Enable Auto-Deployment

Vercel automatically deploys when you push to GitHub:
```powershell
git add .
git commit -m "Update feature"
git push
```
Vercel will automatically build and deploy!

## Environment Variables Needed

Make sure you have these in Vercel:

| Variable | Value | Where to Find |
|----------|-------|---------------|
| `VITE_SUPABASE_URL` | `https://wysdzeapploexrldqqlm.supabase.co` | Already known |
| `VITE_SUPABASE_ANON_KEY` | Your anon key | Supabase → Settings → API → anon public |

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure `npm run build` works locally
- Verify all dependencies are in package.json

### Environment Variables Not Working
- Make sure variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel → Project → Settings → Environment Variables

### 404 Errors
- Check vercel.json rewrites are configured
- Ensure SPA routing is enabled

### Database Connection Issues
- Verify Supabase credentials
- Check RLS policies allow public access where needed
- Ensure environment variables are set correctly

## Post-Deployment Checklist

- [ ] Test product browsing
- [ ] Test add to cart functionality
- [ ] Place a test order
- [ ] Verify WhatsApp redirect works
- [ ] Test admin panel (password: admin123)
- [ ] Test coupon system
- [ ] Check My Orders feature
- [ ] Test on mobile devices
- [ ] Verify late night fee applies correctly

## Quick Commands

```powershell
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls
```

## Support

If you encounter issues:
1. Check Vercel build logs
2. Test locally with `npm run build && npm run preview`
3. Verify environment variables are set
4. Check browser console for errors

Your site will be live at: `https://YOUR-PROJECT-NAME.vercel.app`
