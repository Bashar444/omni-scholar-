#!/bin/bash
set -e

echo "🚀 Starting bulletproof build process..."

# Install dependencies with maximum compatibility
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --force --no-audit --no-fund

# Install Angular CLI globally as backup
echo "🔧 Installing Angular CLI globally..."
npm install -g @angular/cli@16.2.0

# Install Angular build tools explicitly
echo "🔧 Installing Angular build tools..."
npm install @angular-devkit/build-angular@16.2.0 @angular-devkit/architect@0.1602.0 @angular-devkit/core@16.2.0 @angular-devkit/schematics@16.2.0 @schematics/angular@16.2.0 --save-dev --legacy-peer-deps --force

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
