@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing Docker build issues...
git add Dockerfile.dev docker-compose.yml

git commit -m "Fix: ensure Angular CLI and dependencies installed in Docker, remove obsolete version from docker-compose"

echo Pushing to GitHub...
git push origin main

echo Done! Now rebuild Docker image...
echo.
echo Run: docker-compose down
echo Then: docker-compose up --build
echo.
pause
