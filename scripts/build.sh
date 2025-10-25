#!/bin/bash
set -e

echo "🚀 Starting bulletproof build process..."

# Clean install approach
echo "🧹 Cleaning previous installations..."
rm -rf node_modules package-lock.json

# Install dependencies with maximum compatibility
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --force --no-audit --no-fund

# Install Angular CLI globally as backup
echo "🔧 Installing Angular CLI globally..."
npm install -g @angular/cli@16.2.0

# Force install Angular build tools with specific versions
echo "🔧 Force installing Angular build tools..."
npm install @angular-devkit/build-angular@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
npm install @angular-devkit/architect@0.1602.0 --save-dev --legacy-peer-deps --force --no-audit
npm install @angular-devkit/core@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
npm install @angular-devkit/schematics@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
npm install @schematics/angular@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
npm install @angular/compiler-cli@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
npm install typescript@5.1.3 --save-dev --legacy-peer-deps --force --no-audit

# Verify installation
echo "✅ Verifying Angular build tools installation..."
ls -la node_modules/@angular-devkit/build-angular/ || echo "❌ @angular-devkit/build-angular not found"
ls -la node_modules/@angular/compiler-cli/ || echo "❌ @angular/compiler-cli not found"

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
