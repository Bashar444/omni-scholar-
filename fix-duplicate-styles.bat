@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing duplicate styles property...
git add src/app/modules/dashboard/dashboard.component.ts

git commit -m "Fix: remove duplicate styles property in dashboard component"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
