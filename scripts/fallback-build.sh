#!/bin/bash
set -e

echo "🔄 Fallback build process starting..."

# Try multiple approaches
echo "📦 Approach 1: Clean install with force"
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps --force --no-audit --no-fund || {
    echo "❌ Approach 1 failed, trying approach 2..."
    
    echo "📦 Approach 2: Individual package installation"
    npm install @angular-devkit/build-angular@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
    npm install @angular-devkit/architect@0.1602.0 --save-dev --legacy-peer-deps --force --no-audit
    npm install @angular-devkit/core@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
    npm install @angular-devkit/schematics@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
    npm install @schematics/angular@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
    npm install @angular/compiler-cli@16.2.0 --save-dev --legacy-peer-deps --force --no-audit
    npm install typescript@5.1.3 --save-dev --legacy-peer-deps --force --no-audit || {
        echo "❌ Approach 2 failed, trying approach 3..."
        
        echo "📦 Approach 3: Yarn fallback"
        npm install -g yarn
        yarn add @angular-devkit/build-angular@16.2.0 @angular-devkit/architect@0.1602.0 @angular-devkit/core@16.2.0 @angular-devkit/schematics@16.2.0 @schematics/angular@16.2.0 @angular/compiler-cli@16.2.0 typescript@5.1.3 --dev --ignore-engines || {
            echo "❌ All approaches failed, using minimal build..."
            
            # Minimal build with just essential packages
            npm install @angular/cli@16.2.0 --save-dev
            npm install @angular-devkit/build-angular@16.2.0 --save-dev --legacy-peer-deps --force
            npx ng build --configuration production
        }
    }
}

# Try to build
echo "🏗️ Attempting build..."
ng build --configuration production || npx ng build --configuration production || ./node_modules/.bin/ng build --configuration production

echo "✅ Fallback build completed!"
