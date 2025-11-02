@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing NG0908 hydration error...
git add src/app/app.ts src/app/app.config.ts src/main.ts

git commit -m "Fix NG0908 hydration error: skip hydration for client-side only app"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
