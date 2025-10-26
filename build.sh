#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --legacy-peer-deps --force --no-audit --no-fund

echo "Building Angular application..."
npm run vercel-build

echo "Build completed successfully!"
