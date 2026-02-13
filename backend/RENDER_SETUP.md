# Render.com Deployment Configuration

## Render Web Service Settings

### Environment Variables Required:
- `MONGODB_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas)
- `JWT_SECRET`: Strong secret key for JWT authentication
- `FRONTEND_URL`: URL of your frontend deployed on Vercel
- `NODE_ENV`: Set to "production"

### Build & Start Commands:
- Build Command: `npm install`
- Start Command: `npm start`

### Auto Deploy:
- Enable auto deploy from your connected GitHub repository
- Branch: main (or your default branch)

## Health Check
Consider adding a health check endpoint to your Express app:

```javascript
// Add to your server.js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

## Scaling Recommendations
- Free tier: 1GB RAM, 1 vCPU (sufficient for low traffic)
- Paid tier: 1GB+ RAM recommended for better performance

## Environment-Specific Configuration
The application is already configured to:
- Use the PORT environment variable provided by Render
- Apply production CORS settings based on FRONTEND_URL
- Connect to the MongoDB URI provided via environment variable