@echo off
cd c:\Users\basha\Desktop\omni-Scholar

echo Committing stuck files cleanup...
git add -A
git commit -m "CLEANUP: Remove all stuck files referencing deleted modules - fix Vercel deployment"
git push origin main

echo.
echo ========================================
echo VERCEL DEPLOYMENT FIX COMPLETE
echo ========================================
echo.
echo Removed:
echo - All stuck service files
echo - All stuck guard files
echo - All stuck store files
echo - All stuck theme files
echo - All stuck shared components
echo - Old app template
echo.
echo Fixed app.config.ts to remove NgRx references
echo.
echo Vercel should now deploy successfully!
echo.
pause
