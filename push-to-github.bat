@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Configuring git user...
git config user.email "bashar@omnischolar.dev"
git config user.name "Bashar"

echo Committing changes...
git commit -m "Phase 1 Complete: Unified Frontend Dashboard with 66+ endpoints and Literature Review Agent"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
