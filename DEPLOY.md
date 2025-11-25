# Hostel Snack Shop - Quick Deploy to Vercel

## 🚀 Quick Start (5 minutes)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub first:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Framework: **Vite** (auto-detected)
   - Click "Deploy"

3. **Add Environment Variables** (in Vercel dashboard):
   - Go to Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL = https://wysdzeapploexrldqqlm.supabase.co
     VITE_SUPABASE_ANON_KEY = [Get from Supabase Dashboard]
     ```

4. **Redeploy:**
   - Go to Deployments → Click "..." → Redeploy

### Get Supabase Anon Key:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy "anon public" key

## 🎉 Done!
Your site will be live at: `https://your-project.vercel.app`

---

For detailed instructions, see `DEPLOYMENT_GUIDE.md`
