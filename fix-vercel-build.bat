@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Committing Vercel build fix...
git commit -m "Fix Vercel build: include dev dependencies for Angular CLI"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
