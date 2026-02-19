# Environment Variables Configuration Guide

## Quick Fix for Vercel White Screen Issue

### Problem
Your frontend works locally but shows a white screen on Vercel because:
1. The API URL defaults to `http://localhost:5000` which doesn't exist in production
2. Vercel needs the `VITE_API_URL` environment variable configured

---

## Step 1: Deploy Your Backend First

Your backend needs to be deployed before the frontend can work. You have a few options:

### Option A: Deploy Backend to Render (Recommended)

1. **Create a Render account** at https://render.com

2. **Create a new Web Service**:
   - Connect your GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node app.js`

3. **Add Environment Variables in Render**:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

4. **Get your Render URL** (e.g., `https://national-exam-api.onrender.com`)

### Option B: Deploy Backend to Vercel (Serverless)

Note: This requires refactoring to use serverless functions. Render is easier for Express apps.

---

## Step 2: Configure Frontend Environment in Vercel

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Add the following variables**:

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `VITE_API_URL` | `https://your-backend-url.onrender.com` | Production |
   | `VITE_API_URL` | `http://localhost:5000` | Preview/Development |

3. **Redeploy** your application after adding variables

---

## Step 3: Verify Backend CORS Settings

Your backend (`backend/server.js`) already has proper CORS configuration:

```javascript
if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = process.env.FRONTEND_URL || false;
} else {
  corsOptions.origin = true;
}
```

**In Render**, add the environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## Step 4: Test the Deployment

1. **Check Vercel Build Logs**:
   - Go to Vercel → Deployments → Click on latest deployment
   - Check for any build errors

2. **Check Browser Console**:
   - Open your Vercel URL
   - Press F12 → Console
   - Look for network errors (likely showing failed API calls to localhost)

3. **Check Network Tab**:
   - F12 → Network tab
   - Refresh the page
   - Check if API requests are going to the correct URL

---

## Environment Variables Reference

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.example.com` |

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://app.vercel.app` |
| `PORT` | Server port (Render sets this) | `5000` |
| `NODE_ENV` | Environment | `production` |
| `TWILIO_*` | SMS service (optional) | See `.env.example` |

---

## Troubleshooting

### White Screen Persists

1. **Check Vercel Function Logs**:
   - Vercel → Deployments → Click deployment → Function Logs

2. **Verify Environment Variables**:
   ```bash
   # In Vercel dashboard, ensure VITE_API_URL is set
   # It should NOT be http://localhost:5000 in production
   ```

3. **Check Build Output**:
   - Ensure `frontend/dist` contains `index.html` and `assets/` folder

### CORS Errors

If you see CORS errors in the browser console:

1. **Verify Backend CORS**:
   - Check `backend/server.js` has correct `FRONTEND_URL`
   - Ensure Render has `FRONTEND_URL` environment variable set

2. **Check URL Matching**:
   - `FRONTEND_URL` must exactly match your Vercel URL (no trailing slash)
   - Example: `https://national-exam.vercel.app` NOT `https://national-exam.vercel.app/`

### API 404 Errors

1. **Check API routes** - ensure backend is deployed and running
2. **Test backend directly** - visit `https://your-backend.onrender.com/api/auth/login` in browser
3. **Check VITE_API_URL** - ensure no trailing slash

---

## Quick Commands

### Local Development

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Build Test

```bash
# Test production build locally
cd frontend
npm install
npm run build
npm run preview
```

---

## File Structure Reference

```
National-Exam/
├── frontend/              # Vercel deployment (SPA)
│   ├── src/
│   │   └── api.js        # Uses VITE_API_URL
│   ├── dist/             # Build output
│   └── package.json
├── backend/               # Render deployment (Express API)
│   ├── server.js         # CORS configuration
│   ├── app.js            # Entry point
│   └── package.json
├── vercel.json            # Vercel config (updated)
└── .env.example           # Environment template
```

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Add `VITE_API_URL` to Vercel
3. ✅ Add `FRONTEND_URL` to Render
4. ✅ Redeploy both services
5. ✅ Test the full application
