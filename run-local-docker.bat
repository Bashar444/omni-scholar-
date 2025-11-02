@echo off
REM OmniScholar - Local Docker Development Script

echo.
echo ========================================
echo OmniScholar - Local Docker Setup
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

echo Building development image...
docker-compose build

echo.
echo ========================================
echo Starting OmniScholar on localhost:4200
echo ========================================
echo.
echo The app will be available at:
echo   http://localhost:4200
echo.
echo Press Ctrl+C to stop the container
echo.

REM Start the development server
docker-compose up

pause
