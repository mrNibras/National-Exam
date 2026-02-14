# Deploying Backend on Render

## Overview
This guide explains how to deploy the National Exam Preparation System backend on Render.com.

## Prerequisites
1. A Render account (sign up at https://render.com)
2. A MongoDB database (recommended: MongoDB Atlas)
3. Your GitHub repository containing the backend code

## Step-by-Step Deployment Guide

### 1. Prepare Your MongoDB Database
1. Sign up for MongoDB Atlas (https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Add your IP address to the whitelist (or use 0.0.0.0/0 for testing)
5. Copy the connection string, replacing `<password>` with your database user's password

### 2. Set Up Environment Variables
Before deploying, you'll need these environment variables:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A strong secret key for JWT authentication (use a random string)
- `FRONTEND_URL`: The URL of your frontend deployed on Vercel (e.g., https://your-frontend.vercel.app)
- `NODE_ENV`: Set to "production"

### 3. Deploy on Render

#### Option A: Using the Render Dashboard
1. Go to https://dashboard.render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub account and select your repository
4. Configure the following settings:
   - **Environment**: Node
   - **Branch**: main (or your default branch)
   - **Runtime**: Node 18.x (or latest LTS)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Name**: Choose a unique name for your service
   - **Region**: Choose a region close to your users

5. Add the environment variables in the "Advanced" section:
   - Click "Advanced" to reveal environment variables
   - Add each variable with its corresponding value:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `FRONTEND_URL`: Your frontend URL
     - `NODE_ENV`: production

6. Click "Create Web Service"

#### Option B: Using Render Blueprint (Infrastructure as Code)
Alternatively, you can create a `render.yaml` file in your repository root:

```yaml
services:
  - type: web
    name: national-exam-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGODB_URI
        sync: false  # Will be set in dashboard
      - key: JWT_SECRET
        sync: false  # Will be set in dashboard
      - key: FRONTEND_URL
        sync: false  # Will be set in dashboard
      - key: NODE_ENV
        value: production
```

### 4. Configure Environment Variables in Render Dashboard
After creating the service:
1. Go to your service in the Render dashboard
2. Click "Environment" tab
3. Add/update the environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret (should be at least 32 characters)
   - `FRONTEND_URL`: Your frontend URL (e.g., https://my-app.vercel.app)
   - `NODE_ENV`: production

### 5. Verify the Deployment
1. Wait for the build to complete (this may take a few minutes)
2. Once deployed, Render will provide a URL for your API
3. Test the deployment by visiting: `https://your-service-name.onrender.com/`
4. You should see the response: `API Running`

### 6. Connect Your Frontend
Update your frontend's environment variables to point to your deployed backend:
- In your frontend's `.env.production.local` file, set:
  ```
  VITE_API_URL=https://your-service-name.onrender.com
  ```

## Important Notes

### Security Considerations
- Use a strong, unique `JWT_SECRET` (recommend using a password generator)
- Restrict MongoDB access to only your Render service IP if possible
- Regularly rotate your secrets

### Scaling
- Free tier: 1GB RAM, 512MB storage, limited CPU
- Paid tier: Choose resources based on your expected traffic
- Render automatically scales based on traffic

### Health Checks
The application includes a basic health check at the root endpoint. You can add a dedicated health check endpoint if needed:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

### Logs and Monitoring
- Access logs through the Render dashboard under your service
- Monitor your MongoDB Atlas dashboard for database performance
- Set up alerts for critical errors

### Troubleshooting
Common issues and solutions:
- **Database connection errors**: Verify your MongoDB URI and IP whitelisting
- **Environment variable errors**: Double-check all environment variables are set correctly
- **CORS errors**: Ensure `FRONTEND_URL` matches your actual frontend URL exactly
- **Timeout errors**: Check if your free tier timeout limits are exceeded

## Updating Your Deployment
When you push changes to your GitHub repository (main branch), Render will automatically rebuild and redeploy your service if auto-deploy is enabled.

## Cost Considerations
- Render offers a free tier with limited resources
- MongoDB Atlas also offers a free tier (Atlas M0) for development
- Monitor usage to avoid unexpected charges as your application grows