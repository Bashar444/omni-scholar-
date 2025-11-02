@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Removing all unused NgModule files...

REM Remove old module files that are not used in standalone components
del /Q src\app\app.module.ts 2>nul
del /Q src\app\app-routing.module.ts 2>nul
del /Q src\app\shell\shell.module.ts 2>nul
del /Q src\app\theme\theme.module.ts 2>nul
del /Q src\app\modules\scholar-graph\scholar-graph.module.ts 2>nul
del /Q src\app\modules\trust-layer\trust-layer.module.ts 2>nul
del /Q src\app\modules\paper-pilot\paper-pilot.module.ts 2>nul
del /Q src\app\modules\data-verse\data-verse.module.ts 2>nul
del /Q src\app\modules\edu-forge\edu-forge.module.ts 2>nul
del /Q src\app\modules\global-knowledge-bridge\global-knowledge-bridge.module.ts 2>nul
del /Q src\app\modules\grant-ai\grant-ai.module.ts 2>nul
del /Q src\app\modules\lab-sync\lab-sync.module.ts 2>nul
del /Q src\app\modules\meta-lab\meta-lab.module.ts 2>nul
del /Q src\app\modules\omni-ai\omni-ai.module.ts 2>nul

echo Removed unused module files.
echo.
echo Adding changes to git...
git add -A

echo Committing cleanup...
git commit -m "CLEANUP: remove all unused NgModule files (using standalone components)"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo CLEANUP COMPLETE
echo ========================================
echo.
echo Removed unused module files:
echo - app.module.ts
echo - app-routing.module.ts
echo - shell.module.ts
echo - theme.module.ts
echo - All module files in modules/
echo.
echo This reduces compilation warnings and cleans up the codebase.
echo.
pause
