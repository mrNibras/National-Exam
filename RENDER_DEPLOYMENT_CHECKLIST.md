# Render Backend Deployment Checklist

## Pre-Deployment
- [ ] MongoDB database created and connection string ready
- [ ] Strong JWT secret generated (at least 32 characters)
- [ ] Frontend URL decided (from Vercel deployment)
- [ ] GitHub repository ready with backend code
- [ ] Render account created

## Environment Variables to Set
- [ ] `MONGODB_URI` = Your MongoDB connection string
- [ ] `JWT_SECRET` = Strong secret key for JWT
- [ ] `FRONTEND_URL` = Your frontend URL (e.g., https://your-app.vercel.app)
- [ ] `NODE_ENV` = production

## Deployment Steps
- [ ] Create new Web Service on Render
- [ ] Connect to your GitHub repository
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Add environment variables
- [ ] Verify deployment succeeds
- [ ] Test API endpoint (should return "API Running")

## Post-Deployment
- [ ] Update frontend to use new backend URL
- [ ] Test API calls from frontend
- [ ] Monitor logs for any errors
- [ ] Verify database connections work
- [ ] Test user registration/login functionality

## Verification
- [ ] Backend responds at https://your-service.onrender.com
- [ ] Frontend can successfully call backend APIs
- [ ] Database operations work correctly
- [ ] CORS settings allow frontend requests