@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing production Dockerfile output path...
git add Dockerfile

git commit -m "FIX: correct Dockerfile output path from dist/omni-scholar-app/browser to dist/omni-scholar-app"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo PRODUCTION DOCKERFILE FIXED
echo ========================================
echo.
echo Changed:
echo FROM: /app/dist/omni-scholar-app/browser
echo TO:   /app/dist/omni-scholar-app
echo.
echo Now rebuild production:
echo .\run-production-docker.ps1
echo.
pause
