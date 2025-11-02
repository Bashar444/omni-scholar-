@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing undefined CSS variables...
git add src/app/shell/shell.component.scss

git commit -m "Fix black screen: replace undefined CSS variables with actual colors"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
