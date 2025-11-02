@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing Angular schema error - buildTarget to browserTarget...
git add angular.json

git commit -m "CRITICAL FIX: change buildTarget to browserTarget in serve configuration (Angular schema requirement)"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo SCHEMA ERROR FIXED
echo ========================================
echo.
echo Now rebuild Docker:
echo 1. docker-compose down
echo 2. docker system prune -a
echo 3. docker-compose up --build
echo.
pause
