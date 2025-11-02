@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing all service injection issues...
git add -A

git commit -m "Fix: Remove all service instantiation issues and ensure proper dependency injection"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
