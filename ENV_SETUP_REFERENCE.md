# Environment Variables Configuration

## Render Backend (https://national-exam-1.onrender.com)

Go to: https://dashboard.render.com → Select your service → Environment

Add these 4 variables:

```
MONGODB_URI=mongodb+srv://mrnibras33_db_user:AllahuAkber1359@cluster0.oylm2zu.mongodb.net/national-exam-db?retryWrites=true&w=majority
JWT_SECRET=national-exam-jwt-secret-key-2024-change-in-production
FRONTEND_URL=https://national-exam.vercel.app
NODE_ENV=production
```

**After saving, Render will automatically redeploy (takes 2-5 minutes)**

---

## Vercel Frontend (https://national-exam.vercel.app)

Go to: https://vercel.com/dashboard → Select project → Settings → Environment Variables

Add this variable:

```
VITE_API_URL=https://national-exam-1.onrender.com
```

Set for: ✅ Production, ✅ Preview, ✅ Development

**After saving, manually redeploy:**
1. Go to Deployments tab
2. Click ⋮ on latest deployment
3. Click Redeploy

---

## Testing After Deployment

1. Wait 5 minutes for both deployments to complete
2. Visit: https://national-exam.vercel.app
3. Open browser console (F12) to check for errors

### Expected Behavior:
- ✅ Login/Register pages should load
- ✅ API calls should connect to Render backend
- ✅ No CORS errors in console

### Common Issues:

**500 Error from backend:**
- Backend is still starting up (wait 2-3 minutes)
- MongoDB URI is incorrect
- Check Render logs: https://dashboard.render.com → Logs

**CORS Error:**
- FRONTEND_URL in Render doesn't match your Vercel URL exactly
- Make sure no trailing slash: `https://national-exam.vercel.app` ✅

**Network Error:**
- VITE_API_URL not set correctly in Vercel
- Backend is still on free tier cold start (wait 30-60 seconds)

---

## Current URLs

- **Frontend:** https://national-exam.vercel.app
- **Backend:** https://national-exam-1.onrender.com
- **Database:** MongoDB Atlas (Cluster0)

---

## ⚠️ SECURITY WARNING

Change your MongoDB password immediately:
1. Go to https://cloud.mongodb.com
2. Database Access → Edit User
3. Change password
4. Update MONGODB_URI in Render with new password

Your credentials were shared in this conversation and should be considered compromised.
