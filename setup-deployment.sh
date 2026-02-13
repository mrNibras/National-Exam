#!/bin/bash
# Deployment setup script for National Exam Preparation System

echo "Setting up deployment configuration for National Exam Preparation System..."

# Check if we're in the right directory
if [ ! -f "backend/package.json" ] || [ ! -f "frontend/package.json" ]; then
    echo "Error: This script must be run from the project root directory."
    echo "Expected structure: ./backend/package.json and ./frontend/package.json"
    exit 1
fi

echo "Creating deployment configuration files..."

# Create backend vercel.json
cat > backend/vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.js"
    }
  ]
}
EOF

# Create frontend vercel.json
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

echo "Created vercel.json files for both frontend and backend."

echo "Deployment configuration setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up environment variables in Vercel dashboard for both projects"
echo "2. Deploy backend: cd backend && vercel"
echo "3. Deploy frontend: cd frontend && vercel"
echo "4. Update FRONTEND_URL in backend with the frontend deployment URL"
echo "5. Update VITE_API_URL in frontend with the backend deployment URL"