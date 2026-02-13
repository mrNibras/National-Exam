# Deployment Configuration for National Exam Preparation System

## Frontend Deployment (Vercel)
- Platform: Vercel
- Directory: `/frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Create React App (or leave auto-detected)

### Frontend Environment Variables (Vercel Dashboard)
- `VITE_API_URL`: URL of your backend deployed on Render (e.g., `https://your-app-name.onrender.com`)

## Backend Deployment (Render)
- Platform: Render
- Directory: `/backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables needed:

### Backend Environment Variables (Render Dashboard)
- `MONGODB_URI`: Your MongoDB connection string (e.g., MongoDB Atlas)
- `JWT_SECRET`: A strong secret key for JWT tokens
- `FRONTEND_URL`: URL of your frontend deployed on Vercel (e.g., `https://your-app-name.vercel.app`)
- `NODE_ENV`: production
- `PORT`: 10000 (Render sets this automatically, but good to specify)

## Configuration Files

### Frontend (Vercel) - /frontend/vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run build",
        "outputDirectory": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Backend (Render) - /backend/Dockerfile (optional, or use Render's default Node.js support)
The backend should work with Render's default Node.js environment, but you can create a Dockerfile if needed:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]
```

## Deployment Steps

### 1. Deploy Backend on Render
1. Push your code to a GitHub repository
2. Connect Render to your GitHub repo
3. Create a new Web Service
4. Choose the backend directory
5. Set environment variables in Render dashboard
6. Deploy

### 2. Deploy Frontend on Vercel
1. Push your code to the same GitHub repository
2. Connect Vercel to your GitHub repo
3. Create a new project for the frontend directory
4. Set environment variables in Vercel dashboard
5. Deploy

### 3. Update Environment Variables After Deployment
1. Once backend is deployed on Render, note the URL
2. Update `VITE_API_URL` in Vercel dashboard to point to your Render backend URL
3. Once frontend is deployed on Vercel, note the URL
4. Update `FRONTEND_URL` in Render dashboard to point to your Vercel frontend URL

## Important Notes
- The backend on Render will need to expose the correct port (typically provided by Render via $PORT environment variable)
- The CORS configuration in the backend has been updated to allow only the specified frontend URL in production
- Both deployments will need to reference each other's URLs via environment variables