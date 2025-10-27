# Vercel Deployment Error Fix

## Problem
The deployment was failing with:
```
npm error could not determine executable to run
```

This occurred because Vercel's build system was unable to properly execute the build command, likely due to:
1. Incomplete npm install flags in the build command
2. Missing `--force`, `--no-audit`, and `--no-fund` flags that were being used during initial install

## Root Cause
The `vercel.json` buildCommand was:
```json
"buildCommand": "npm install --legacy-peer-deps && npm run vercel-build"
```

But Vercel's build logs showed it was trying to run:
```
npm install @angular-devkit/build-angular@16.2.0 @angular/compiler-cli@16.2.0 typescript@5.1.3 --save-dev --legacy-peer-deps --force --no-audit && npx ng build --configuration production
```

This mismatch caused the executable error.

## Solution Applied

### 1. Updated `vercel.json`
Changed the buildCommand to include all necessary npm flags:
```json
"buildCommand": "npm install --legacy-peer-deps --force --no-audit --no-fund && npm run vercel-build"
```

This ensures:
- `--legacy-peer-deps`: Allows peer dependency conflicts (Angular ecosystem requirement)
- `--force`: Forces installation even with conflicts
- `--no-audit`: Skips security audit (speeds up build)
- `--no-fund`: Skips funding messages (speeds up build)

### 2. Created `build.sh`
Added a fallback build script that explicitly handles the build process step-by-step for debugging purposes.

### 3. Verified Configuration
- `.npmrc` already had proper settings configured
- `package.json` has correct `vercel-build` script
- `angular.json` output path matches `vercel.json` configuration

## Next Steps
1. Trigger a new deployment on Vercel (push to main branch)
2. Monitor the build logs for successful completion
3. If issues persist, check Vercel's build logs for specific error messages

## Files Modified
- `vercel.json` - Updated buildCommand with complete npm flags
- `build.sh` - Created as fallback build script

## Deployment Command
The build will now execute:
```bash
npm install --legacy-peer-deps --force --no-audit --no-fund && npm run vercel-build
```

Which translates to:
```bash
npm install --legacy-peer-deps --force --no-audit --no-fund && ng build --configuration production
```
