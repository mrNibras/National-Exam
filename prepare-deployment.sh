#!/bin/bash
# Deployment preparation script for National Exam Preparation System

echo "Preparing deployment configuration for separate Vercel (frontend) and Render (backend) deployments..."

# Check if we're in the right directory
if [ ! -f "backend/package.json" ] || [ ! -f "frontend/package.json" ]; then
    echo "Error: This script must be run from the project root directory."
    echo "Expected structure: ./backend/package.json and ./frontend/package.json"
    exit 1
fi

echo "✓ Verified project structure"

# Create production-ready environment examples
echo "Creating production environment examples..."

cat > backend/.env.production << 'EOF'
# Production environment variables for Render
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/national-exam-prod
JWT_SECRET=your-long-and-secure-jwt-secret-key-here
FRONTEND_URL=https://your-frontend-project.vercel.app
NODE_ENV=production
# PORT is provided by Render automatically
EOF

cat > frontend/.env.production.local << 'EOF'
# Production environment variables for Vercel
VITE_API_URL=https://your-backend-project.onrender.com
EOF

echo "✓ Created production environment examples"

# Verify vercel.json files exist
if [ ! -f "frontend/vercel.json" ]; then
    echo "Creating frontend/vercel.json..."
    cat > frontend/vercel.json << 'EOF'
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
EOF
fi

if [ ! -f "backend/vercel.json" ]; then
    echo "Note: backend/vercel.json exists (not needed for Render deployment)"
fi

echo "✓ Verified deployment configuration files"

echo ""
echo "Deployment Preparation Complete!"
echo "==============================="
echo ""
echo "NEXT STEPS FOR RENDER (Backend):"
echo "1. Push your code to GitHub"
echo "2. Go to https://render.com and connect your GitHub account"
echo "3. Create a new Web Service"
echo "4. Select your repository"
echo "5. Set root directory to: backend"
echo "6. Runtime: Node"
echo "7. Environment: production"
echo "8. Add these environment variables in the Render dashboard:"
echo "   - MONGODB_URI"
echo "   - JWT_SECRET" 
echo "   - FRONTEND_URL"
echo "   - NODE_ENV (set to 'production')"
echo "9. Deploy!"
echo ""
echo "NEXT STEPS FOR VERCEL (Frontend):"
echo "1. Go to https://vercel.com and connect your GitHub account"
echo "2. Import your repository"
echo "3. Set root directory to: frontend"
echo "4. Add this environment variable in the Vercel dashboard:"
echo "   - VITE_API_URL (set to your Render backend URL)"
echo "5. Deploy!"
echo ""
echo "AFTER BOTH DEPLOYMENTS:"
echo "- Update FRONTEND_URL in Render with your Vercel frontend URL"
echo "- Your applications will be properly connected!"