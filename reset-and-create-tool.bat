@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo ========================================
echo RESETTING PROJECT TO SINGLE TOOL
echo ========================================
echo.

echo Adding changes to git...
git add -A

echo Committing reset...
git commit -m "RESET: Delete all tools and create single Research Paper Analysis tool"

echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo RESET COMPLETE
echo ========================================
echo.
echo Project Structure:
echo - Single Tool: Research Paper Analysis
echo - Route: /analysis
echo - URL: http://localhost:4200
echo.
echo Ready for next command.
echo.
pause
