@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo ========================================
echo CLEANING UP STUCK FILES
echo ========================================
echo.

REM Remove stuck service files that reference deleted modules
echo Removing stuck service files...
del /Q src\app\core\services\library.service.ts 2>nul
del /Q src\app\core\services\api.service.ts 2>nul
del /Q src\app\core\services\auth.service.ts 2>nul
del /Q src\app\core\services\storage.service.ts 2>nul

REM Remove stuck guard files
echo Removing stuck guard files...
del /Q src\app\core\guards\auth.guard.ts 2>nul
del /Q src\app\core\guards\route.guard.ts 2>nul

REM Remove stuck store files
echo Removing stuck store files...
del /Q src\app\store\app.actions.ts 2>nul
del /Q src\app\store\app.effects.ts 2>nul
del /Q src\app\store\app.reducer.ts 2>nul
del /Q src\app\store\app.state.ts 2>nul

REM Remove stuck theme files
echo Removing stuck theme files...
del /Q src\app\theme\*.ts 2>nul
del /Q src\app\theme\*.html 2>nul
del /Q src\app\theme\*.scss 2>nul

REM Remove stuck shared components
echo Removing stuck shared components...
del /Q src\app\shared\components\*.ts 2>nul

REM Remove stuck interceptors
echo Removing stuck interceptors...
del /Q src\app\core\interceptors\*.ts 2>nul

REM Remove app.html (old template)
echo Removing old app template...
del /Q src\app\app.html 2>nul

echo.
echo ========================================
echo CLEANUP COMPLETE
echo ========================================
echo.
echo Removed all stuck files that reference deleted modules.
echo.
pause
