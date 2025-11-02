@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing dashboard colors - white text on white background...
git add src/app/modules/dashboard/dashboard.component.ts src/app/shell/shell.component.scss

git commit -m "Fix black screen: fix dashboard colors, white background with proper text colors"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
