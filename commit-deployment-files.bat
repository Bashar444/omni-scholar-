@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Adding deployment documentation and scripts...
git add DOCKER_LOCAL_SETUP.md DEPLOYMENT_GUIDE.md run-local-docker.bat run-production-docker.bat

git commit -m "Add: comprehensive Docker and deployment documentation with scripts"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
