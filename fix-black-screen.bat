@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Committing black screen fix...
git add src/app/app.routes.ts

git commit -m "Fix black screen: redirect to dashboard component instead of scholar-graph"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
