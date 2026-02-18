#!/bin/bash
set -e

echo "Starting clean build..."
echo "Build timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"

cd frontend

# Clean build artifacts
echo "Cleaning build artifacts..."
rm -rf dist
rm -rf node_modules/.vite
rm -rf .vite

# Clear npm cache
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
    echo "Build contents:"
    ls -la dist/
    echo "Assets:"
    ls -la dist/assets/
else
    echo "ERROR: Build failed - dist directory not found"
    exit 1
fi
