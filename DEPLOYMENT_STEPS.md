# Deployment Steps for National Exam Preparation System

## Part 1: Deploy Backend on Render

### Step 1: Prepare Your Code
1. Make sure your code is pushed to a GitHub repository
2. Verify all backend files are committed to the `backend` directory

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up or sign in to your account

### Step 3: Create Web Service on Render
1. Click "New +" button → Select "Web Service"
2. Connect your GitHub account if prompted
3. Select your repository containing the National Exam Preparation System
4. In the "Root Directory" field, enter: `backend`
5. Select your branch (usually `main` or `master`)
6. Runtime: Render should auto-detect Node.js
7. Name your service (e.g., "national-exam-backend")
8. Environment: Production
9. Region: Choose closest to your users

### Step 4: Configure Environment Variables on Render
Before deploying, click on "Advanced" and add these environment variables:
- `MONGODB_URI` = Your MongoDB connection string (e.g., from MongoDB Atlas)
- `JWT_SECRET` = A strong secret key for JWT tokens (generate a random string)
- `FRONTEND_URL` = Placeholder for now (we'll update this after frontend deployment)
- `NODE_ENV` = production

### Step 5: Deploy Backend
1. Click "Create Web Service"
2. Wait for the build and deployment to complete
3. Note the URL of your deployed backend (e.g., https://your-app-name.onrender.com)

### Step 6: Update Environment Variables
Once both deployments are done:
1. Go back to your Render dashboard
2. Update the `FRONTEND_URL` variable with your Vercel frontend URL
3. Redeploy the backend service

---

## Part 2: Deploy Frontend on Vercel

### Step 1: Prepare Your Code
1. Ensure your code is pushed to the same GitHub repository
2. Verify all frontend files are committed to the `frontend` directory

### Step 2: Create Vercel Account
1. Go to https://vercel.com
2. Sign up or sign in to your account

### Step 3: Import Your Project
1. Click "Add New..." → Select "Project"
2. Import your GitHub repository
3. Select the repository containing the National Exam Preparation System

### Step 4: Configure Project Settings
1. In the "Settings" section:
   - Framework Preset: Let Vercel auto-detect or select "Vite"
   - Root Directory: Set to `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: Leave empty

### Step 5: Configure Environment Variables on Vercel
In the "Environment Variables" section, add:
- `VITE_API_URL` = Your Render backend URL (from Step 5 of backend deployment)

Example: `VITE_API_URL=https://your-app-name.onrender.com`

### Step 6: Deploy Frontend
1. Click "Deploy"
2. Wait for the build and deployment to complete
3. Note the URL of your deployed frontend (e.g., https://your-app-name.vercel.app)

### Step 7: Final Configuration
1. Copy your Vercel frontend URL
2. Go back to Render dashboard
3. Update the `FRONTEND_URL` environment variable in your backend service
4. Trigger a new deployment for the backend

## Verification
1. Visit your frontend URL
2. Test user registration and login functionality
3. Verify that API calls are properly communicating with your backend
4. Check browser console for any CORS or API errors

## Troubleshooting Tips
- If you get CORS errors, double-check that `FRONTEND_URL` in Render matches your Vercel URL exactly
- If API calls fail, verify that `VITE_API_URL` in Vercel points to your Render backend URL
- Check the deployment logs in both platforms if you encounter issues