@echo off
REM OmniScholar - Production Docker Build & Run Script

echo.
echo ========================================
echo OmniScholar - Production Docker Build
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker daemon is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker daemon is not running
    echo Please start Docker Desktop
    pause
    exit /b 1
)

echo ✓ Docker is installed and running
echo.

REM Navigate to project root
cd /d "%~dp0"

echo Building production image...
docker build -f Dockerfile -t omni-scholar-prod .

if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Starting OmniScholar Production Build
echo ========================================
echo.
echo The app will be available at:
echo   http://localhost
echo.
echo Press Ctrl+C to stop the container
echo.

REM Run the production container
docker run -it --rm -p 80:80 omni-scholar-prod

pause
