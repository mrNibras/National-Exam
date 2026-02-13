# Vercel Deployment Configuration

## Issue Description
The Vercel deployment is failing due to incorrect environment configuration and separation of concerns between frontend and backend.

## Solution

### 1. Separate Deployments
The National Exam Preparation System consists of two separate applications:
- **Frontend**: React application running on Vite
- **Backend**: Node.js/Express API server

These should be deployed separately on Vercel.

### 2. Backend Environment Variables Required
Create a `.env` file in the backend directory with these production variables:

```
MONGODB_URI=<your_production_mongodb_connection_string>
JWT_SECRET=<your_production_jwt_secret>
FRONTEND_URL=https://<your_frontend_domain>.vercel.app
PORT=5000
NODE_ENV=production
```

### 3. Frontend Environment Variables Required
Create a `.env` file in the frontend directory with these variables:

```
VITE_API_URL=https://<your_backend_domain>.vercel.app
```

### 4. Update Vite Configuration for Production
Modify `frontend/vite.config.js` to handle production differently:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Determine if we're in development
const isDevelopment = process.env.NODE_ENV === 'development';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: isDevelopment ? {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    } : undefined, // No proxy in production
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 5. Update API Calls in Frontend
Make sure all API calls in the frontend use the `VITE_API_URL` environment variable:

```javascript
// Example in api.js or wherever API calls are made
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 6. Vercel Deployment Instructions

#### For Backend:
1. Navigate to your backend directory
2. Connect to Vercel
3. Set build command to `npm run build` (though for a Node.js API this might not be necessary)
4. Set output directory to root
5. Add the required environment variables in Vercel dashboard

#### For Frontend:
1. Navigate to your frontend directory
2. Connect to Vercel
3. Set build command to `npm run build`
4. Set output directory to `dist`
5. Add the required environment variables in Vercel dashboard

### 7. Alternative: Monorepo Configuration
If you prefer to deploy as a monorepo, you can create a `vercel.json` file in the root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/**",
      "use": "@vercel/node",
      "config": { "includeFiles": ["backend/**"] }
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/app.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

However, the recommended approach is to deploy frontend and backend separately for better scalability and maintenance.