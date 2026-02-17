#!/bin/bash
set -e

cd frontend

# Clean build artifacts
rm -rf dist
rm -rf node_modules/.vite

# Install dependencies
npm install

# Run build
npm run build

echo "Build completed successfully"
