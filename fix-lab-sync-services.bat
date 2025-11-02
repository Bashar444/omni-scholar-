@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing LabSync component service injection...
git add src/app/modules/lab-sync/lab-sync.component.ts

git commit -m "Fix LabSync component: use inject() for all services"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
