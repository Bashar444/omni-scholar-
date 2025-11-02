@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo ========================================
echo RESETTING PROJECT - DELETING ALL TOOLS
echo ========================================
echo.

REM Delete all tool modules
echo Deleting tool modules...
rmdir /S /Q src\app\modules\scholar-graph 2>nul
rmdir /S /Q src\app\modules\paper-pilot 2>nul
rmdir /S /Q src\app\modules\trust-layer 2>nul
rmdir /S /Q src\app\modules\lab-sync 2>nul
rmdir /S /Q src\app\modules\grant-ai 2>nul
rmdir /S /Q src\app\modules\meta-lab 2>nul
rmdir /S /Q src\app\modules\data-verse 2>nul
rmdir /S /Q src\app\modules\edu-forge 2>nul
rmdir /S /Q src\app\modules\global-knowledge-bridge 2>nul
rmdir /S /Q src\app\modules\omni-ai 2>nul
rmdir /S /Q src\app\modules\library 2>nul

echo Deleted all tool modules.
echo.

REM Delete auth module
echo Deleting auth module...
rmdir /S /Q src\app\auth 2>nul

echo Deleted auth module.
echo.

REM Delete shared components that are not needed
echo Cleaning up shared components...
del /Q src\app\shared\components\rate-limit\* 2>nul
del /Q src\app\shared\components\forbidden\* 2>nul
del /Q src\app\shared\components\chat-message-skeleton\* 2>nul
del /Q src\app\shared\components\error-message\* 2>nul
del /Q src\app\shared\components\loading-spinner\* 2>nul
del /Q src\app\shared\components\task-item-skeleton\* 2>nul
del /Q src\app\shared\components\toast\* 2>nul

echo Cleaned up shared components.
echo.

echo ========================================
echo CLEANUP COMPLETE
echo ========================================
echo.
echo Next: Creating Research Paper Analysis tool...
echo.
pause
