#!/bin/bash
set -e

echo "🔄 Fallback build process starting..."

# Try multiple approaches
echo "📦 Approach 1: Standard npm install"
npm install --legacy-peer-deps --force --no-audit --no-fund || {
    echo "❌ Approach 1 failed, trying approach 2..."
    
    echo "📦 Approach 2: Clean install"
    rm -rf node_modules package-lock.json
    npm install --legacy-peer-deps --force --no-audit --no-fund || {
        echo "❌ Approach 2 failed, trying approach 3..."
        
        echo "📦 Approach 3: Install Angular build tools explicitly"
        npm install @angular-devkit/build-angular@16.2.0 @angular-devkit/architect@0.1602.0 @angular-devkit/core@16.2.0 @angular-devkit/schematics@16.2.0 @schematics/angular@16.2.0 --save-dev --legacy-peer-deps --force || {
            echo "❌ Approach 3 failed, trying approach 4..."
            
            echo "📦 Approach 4: Yarn fallback"
            npm install -g yarn
            yarn install --ignore-engines || {
                echo "❌ All approaches failed, using minimal build..."
                
                # Minimal build with just essential packages
                npm install @angular/cli@16.2.0 @angular-devkit/build-angular@16.2.0 --save-dev
                npx ng build --configuration production
            }
        }
    }
}

# Try to build
echo "🏗️ Attempting build..."
ng build --configuration production || npx ng build --configuration production || ./node_modules/.bin/ng build --configuration production

echo "✅ Fallback build completed!"
