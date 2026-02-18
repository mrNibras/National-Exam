#!/bin/bash
set -e

echo "Starting clean build..."

cd frontend

# Clean build artifacts
echo "Cleaning build artifacts..."
rm -rf dist
rm -rf node_modules/.vite
rm -rf .vite

# Clear npm cache if needed
npm cache clean --force 2>/dev/null || true

# Install dependencies
echo "Installing dependencies..."
npm install

# Run build
echo "Building application..."
npm run build

# Verify build output
if [ -d "dist" ]; then
    echo "Build completed successfully"
    ls -la dist/
else
    echo "ERROR: Build failed - dist directory not found"
    exit 1
fi
