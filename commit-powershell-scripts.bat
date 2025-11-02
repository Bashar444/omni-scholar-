@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Adding PowerShell scripts and quick start guide...
git add run-local-docker.ps1 run-production-docker.ps1 QUICK_START.md

git commit -m "Add: PowerShell scripts for Docker and quick start guide"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
