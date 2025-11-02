@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Comprehensive fix: Angular builder paths and Docker configuration...
git add Dockerfile.dev angular.json

git commit -m "CRITICAL FIX: correct Angular builder paths (@angular-devkit/build-angular) and ensure devDependencies installed in Docker"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo COMPREHENSIVE FIX COMPLETE
echo ========================================
echo.
echo Changes:
echo 1. Fixed angular.json builder paths
echo 2. Updated Dockerfile.dev to verify packages
echo.
echo Next steps:
echo 1. docker-compose down
echo 2. docker rmi omni-scholar-dev omni-scholar-omni-scholar
echo 3. docker system prune -a
echo 4. docker-compose up --build
echo.
pause
