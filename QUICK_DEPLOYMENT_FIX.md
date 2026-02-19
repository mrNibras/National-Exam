# Quick Deployment Fix Guide

## Problem
Frontend shows white screen on Vercel because it can't connect to the backend.

## Solution

### Step 1: Configure Vercel Environment Variable

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your **national-exam** project
3. Click **Settings** → **Environment Variables**
4. Click **Add New**
5. Add this variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://national-exam-1.onrender.com`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
6. Click **Save**

### Step 2: Configure Render Environment Variables

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Select your **national-exam-1** service
3. Click **Environment** tab
4. Add/Update these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://mrnibras33_db_user:AllahuAkber1359@cluster0.oylm2zu.mongodb.net/national-exam-db?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-super-secret-jwt-key-change-this-in-production` |
| `FRONTEND_URL` | `https://your-vercel-url.vercel.app` (replace with your actual Vercel URL) |
| `NODE_ENV` | `production` |

5. Click **Save Changes** (this will trigger automatic redeployment)

### Step 3: Redeploy Vercel

1. Go to Vercel project
2. Click **Deployments** tab
3. Find the latest deployment
4. Click the **⋮** menu
5. Click **Redeploy**

### Step 4: Test

1. Wait for both deployments to complete (5-10 minutes)
2. Visit your Vercel URL
3. The white screen should be fixed

---

## Important Security Note

⚠️ **Change your MongoDB password!** You shared your credentials publicly.

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Database Access → Edit User → Edit Password
3. Set a new strong password
4. Update `MONGODB_URI` in Render with the new password

---

## Troubleshooting

### Backend Still Timing Out?

Render's free tier has these limitations:
- **Spin down after 15 minutes** of inactivity
- **Cold start** takes 30-60 seconds on first request

**Solutions:**
1. Use a service like https://uptimerobot.com to ping your backend every 10 minutes
2. Upgrade to Render's paid plan ($7/month)

### CORS Errors?

Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly:
- ✅ `https://your-app.vercel.app`
- ❌ `https://your-app.vercel.app/` (no trailing slash)

### Still White Screen?

Open browser console (F12) and check for errors:
- **CORS error** → Fix FRONTEND_URL in Render
- **404 errors** → Check VITE_API_URL in Vercel
- **Network errors** → Backend might still be spinning up

---

## Files Created

- `.env` - Root environment file (gitignored)
- `frontend/.env.production` - Production build environment

These ensure local builds use the correct API URL.
