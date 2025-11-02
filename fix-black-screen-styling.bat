@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing black screen styling issues...
git add src/app/modules/dashboard/dashboard.component.ts src/app/shell/shell.component.scss

git commit -m "Fix black screen: add proper styling to dashboard and shell components"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
