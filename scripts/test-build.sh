#!/bin/bash
set -e

echo "🧪 Testing build locally..."

# Clean install
echo "🧹 Cleaning..."
rm -rf node_modules package-lock.json dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --force --no-audit --no-fund

# Install Angular CLI
echo "🔧 Installing Angular CLI..."
npm install -g @angular/cli@16.2.0

# Force install build tools
echo "🔧 Installing build tools..."
npm install @angular-devkit/build-angular@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
npm install @angular/compiler-cli@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
npm install typescript@5.1.3 --save-dev --legacy-peer-deps --force --no-audit

# Test build
echo "🏗️ Testing build..."
ng build --configuration production

echo "✅ Local build test completed!"
