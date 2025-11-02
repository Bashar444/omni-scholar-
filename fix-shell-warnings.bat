@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing shell component warnings - removing unused imports and code...
git add src/app/shell/shell.component.ts

git commit -m "Fix: remove unused imports and code from shell component (RouterLink, RouterLinkActive, PrimeNG modules, unused methods)"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
