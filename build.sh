#!/bin/bash
cd frontend

# Install dependencies, filtering out deprecated warnings
npm install 2>&1 | grep -v 'npm warn deprecated' || true

# Run build
npm run build
