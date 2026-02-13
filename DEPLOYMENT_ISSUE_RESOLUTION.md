# Vercel Deployment Issues Resolution

## Problem
Vercel deployment is failing for the National Exam Preparation System with multiple production errors occurring in recent deployments.

## Root Causes
1. **Separation of Concerns**: The project has both frontend (React/Vite) and backend (Node.js/Express) in a monorepo structure, but Vercel needs to handle them separately
2. **Environment Variables**: Missing or incorrect environment variables for production deployment
3. **Proxy Configuration**: Vite proxy is configured for localhost development but not for production
4. **Build Process**: Frontend and backend have different build requirements

## Recommended Solution

### 1. Deploy Applications Separately
Deploy the frontend and backend as separate Vercel projects:

#### Backend Deployment
- Project directory: `/backend`
- Build command: `npm install && npm run build` (if needed)
- Install command: `npm install`
- Output directory: Leave empty (for Node.js API)
- Environment variables needed:
  - `MONGODB_URI`: Production MongoDB connection string
  - `JWT_SECRET`: Production JWT secret
  - `FRONTEND_URL`: URL of your frontend deployment
  - `NODE_ENV`: production

#### Frontend Deployment
- Project directory: `/frontend`
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: `dist`
- Environment variables needed:
  - `VITE_API_URL`: URL of your backend deployment

### 2. Update Frontend API Configuration
Update the frontend to use the production API URL:

```javascript
// In your frontend/src/api.js or similar file
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Use this base URL for all API calls
const apiCall = (endpoint) => `${API_BASE_URL}/api${endpoint}`;
```

### 3. Update Vite Configuration
Modify `frontend/vite.config.js` to handle production builds properly:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };

  // Only add proxy in development mode
  if (mode === 'development') {
    config.server = {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    };
  }

  return config;
});
```

### 4. Prepare Production Environment Files

#### Backend (.env in /backend/)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prod_database
JWT_SECRET=your_long_secure_production_secret
FRONTEND_URL=https://your-frontend-project.vercel.app
NODE_ENV=production
PORT=5000
```

#### Frontend (.env in /frontend/)
```
VITE_API_URL=https://your-backend-project.vercel.app
```

## Steps to Resolve Deployment Issues

1. Disconnect the current monorepo deployment from Vercel
2. Create separate Vercel projects for frontend and backend
3. Configure environment variables for each project
4. Update API calls in frontend to use the production backend URL
5. Redeploy both applications

## Benefits of This Approach
- Independent scaling of frontend and backend
- Better security (separate environment variables)
- Independent deployment cycles
- Easier debugging and monitoring
- More cost-effective resource usage