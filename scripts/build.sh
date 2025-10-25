#!/bin/bash
set -e

echo "🚀 Starting bulletproof build process..."

# Install dependencies with maximum compatibility
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --force --no-audit --no-fund

# Install Angular CLI globally as backup
echo "🔧 Installing Angular CLI globally..."
npm install -g @angular/cli@16.2.0

# Verify Angular CLI is available
echo "✅ Verifying Angular CLI..."
ng version

# Build the project
echo "🏗️ Building Angular project..."
ng build --configuration production

# Verify build output
echo "📁 Verifying build output..."
ls -la dist/omni-scholar-app/

echo "✅ Build completed successfully!"
