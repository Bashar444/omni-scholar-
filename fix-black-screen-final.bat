@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing black screen - final critical fixes...
git add src/app/app.scss src/index.html

git commit -m "Fix black screen: add critical styling to app-root and html/body elements"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
