@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing lazy loading error - load dashboard eagerly...
git add src/app/app.ts src/app/app.routes.ts src/app/shell/shell.component.ts

git commit -m "Fix black screen: load dashboard eagerly instead of lazy, add error handling to shell"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
