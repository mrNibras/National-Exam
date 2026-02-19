# Vercel Deployment Guide - National Exam Preparation System

## Quick Fix for Build Error

**Error:** `Error: Command "cd frontend && npm install" exited with 1`

### ✅ Solution: Configure in Vercel Dashboard (Recommended)

Instead of using complex commands in `vercel.json`, configure the build settings in Vercel Dashboard:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Build & Development Settings**
2. Configure these settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: (leave default)
3. Click **Save**
4. Redeploy your project

---

## Architecture

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | Vercel | https://national-exam.vercel.app |
| Backend | Render | https://national-exam-1.onrender.com |
| Database | MongoDB Atlas | Cluster0 |

---

## Environment Variables

### Frontend (Vercel)

Set in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://national-exam-1.onrender.com` |

Set for: ✅ Production, ✅ Preview, ✅ Development

### Backend (Render)

Set in Render Dashboard → Environment:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your JWT secret key |
| `FRONTEND_URL` | `https://national-exam.vercel.app` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

---

## Deployment Steps

### 1. Deploy Backend (Render)

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `national-exam-1`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add environment variables (see above)
6. Click **Create Web Service**

### 2. Deploy Frontend (Vercel)

1. Go to https://vercel.com/dashboard
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable `VITE_API_URL`
6. Click **Deploy**

---

## Troubleshooting

### White Screen on Vercel

**Cause:** Frontend can't connect to backend

**Fix:**
1. Verify `VITE_API_URL` is set in Vercel
2. Check browser console (F12) for errors
3. Ensure backend is running (visit https://national-exam-1.onrender.com/)

### 500 Error from Backend

**Cause:** Missing environment variables or database connection issue

**Fix:**
1. Check all environment variables are set in Render
2. Verify MongoDB URI is correct
3. Check Render logs for errors

### CORS Errors

**Cause:** FRONTEND_URL doesn't match Vercel URL

**Fix:**
1. Set `FRONTEND_URL` in Render to exactly `https://national-exam.vercel.app`
2. No trailing slash!

### Build Command Fails

**Error:** `Command "cd frontend && npm install" exited with 1`

**Fix:** Use Vercel Dashboard settings instead of `vercel.json`:
- Settings → Build & Development Settings → Set Root Directory to `frontend`

---

## Current Configuration Files

### vercel.json (Root)

```json
{
  "version": 2,
  "buildCommand": "bash -c 'cd frontend && npm ci && npm run build'",
  "outputDirectory": "frontend/dist",
  "installCommand": "bash -c 'cd frontend && npm ci'"
}
```

Note: Using Vercel Dashboard settings is recommended over vercel.json for this project.

---

## Testing After Deployment

1. Visit https://national-exam.vercel.app
2. Open browser console (F12)
3. Check for any errors
4. Try logging in or registering
5. Verify API calls are going to `https://national-exam-1.onrender.com`

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to git
- Change MongoDB password if credentials were exposed
- Use strong JWT secrets in production
- Enable CORS only for your production domain
