@echo off
cd c:\Users\basha\Desktop\omni-scholar

echo Fixing final stuck imports...
git add -A
git commit -m "FIX: Remove stuck AuthService import from shell component - final Vercel fix"
git push origin main

echo.
echo ========================================
echo FINAL VERCEL FIX COMPLETE
echo ========================================
echo.
echo Fixed:
echo - Removed AuthService import from shell.component.ts
echo - Removed OnInit implementation
echo - Removed Router injection
echo - Cleaned up all stuck imports
echo.
echo Vercel should now deploy successfully!
echo.
pause
