# OmniScholar - Production Docker Build & Run Script (PowerShell)

Write-Host ""
Write-Host "========================================"
Write-Host "OmniScholar - Production Docker Build"
Write-Host "========================================"
Write-Host ""

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker is installed: $dockerVersion"
} catch {
    Write-Host "ERROR: Docker is not installed or not in PATH"
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Docker daemon is running
try {
    docker ps | Out-Null
    Write-Host "✓ Docker daemon is running"
} catch {
    Write-Host "ERROR: Docker daemon is not running"
    Write-Host "Please start Docker Desktop"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Building production image..."
docker build -f Dockerfile -t omni-scholar-prod .

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "Starting OmniScholar Production Build"
Write-Host "========================================"
Write-Host ""
Write-Host "The app will be available at:"
Write-Host "  http://localhost"
Write-Host ""
Write-Host "Press Ctrl+C to stop the container"
Write-Host ""

# Run the production container
docker run -it --rm -p 80:80 omni-scholar-prod

Read-Host "Press Enter to exit"
