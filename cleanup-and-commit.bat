@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Removing old batch files...
del /Q commit-deployment-files.bat 2>nul
del /Q commit-fresh-start.bat 2>nul
del /Q commit-powershell-scripts.bat 2>nul
del /Q comprehensive-fix.bat 2>nul
del /Q final-commit.bat 2>nul
del /Q push-to-github.bat 2>nul
del /Q reset-and-create-tool.bat 2>nul
del /Q reset-to-single-tool.bat 2>nul
del /Q build.sh 2>nul
del /Q COMPLETION_SUMMARY.txt 2>nul
del /Q staticwebapp.config.json 2>nul
del /Q web.config 2>nul

echo Committing cleanup...
git add -A
git commit -m "CLEANUP: Remove all old batch files and unnecessary config files"
git push origin main

echo.
echo ========================================
echo ROOT DIRECTORY CLEANED
echo ========================================
echo.
pause
