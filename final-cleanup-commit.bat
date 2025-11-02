@echo off
cd c:\Users\basha\Desktop\omni-Scholar

del /Q cleanup-and-commit.bat 2>nul

git add -A
git commit -m "FINAL: Remove cleanup script - root directory is now clean"
git push origin main

echo.
echo ========================================
echo ROOT DIRECTORY CLEANUP COMPLETE
echo ========================================
echo.
pause
