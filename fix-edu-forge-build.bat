@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Committing EduForge component fix...
git add src/app/modules/edu-forge/edu-forge.component.ts

git commit -m "Fix EduForge component: remove non-existent InputGroupModule"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
