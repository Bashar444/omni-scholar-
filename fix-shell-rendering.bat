@echo off
cd c:\Users\basha\Desktop\omni-Scholar

echo Fixing shell rendering - simplifying to minimal layout...
git add src/app/shell/shell.component.html src/app/shell/shell.component.scss

git commit -m "Fix black screen: simplify shell to minimal layout, remove complex PrimeNG components"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
