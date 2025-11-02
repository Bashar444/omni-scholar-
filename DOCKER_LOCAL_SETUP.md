# OmniScholar - Docker Local Development Setup

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed

## Quick Start - Run Locally on Docker

### Option 1: Using Docker Compose (Recommended)

```bash
# Navigate to project root
cd c:\Users\basha\Desktop\omni-scholar

# Build and start the development container
docker-compose up --build

# The app will be available at: http://localhost:4200
```

**What happens:**
- Docker builds the development image
- Node.js container starts with Angular dev server
- Hot reload enabled (changes auto-refresh)
- Port 4200 exposed to localhost

### Option 2: Manual Docker Commands

```bash
# Build the development image
docker build -f Dockerfile.dev -t omni-scholar-dev .

# Run the container
docker run -it --rm \
  -p 4200:4200 \
  -v %cd%\src:/app/src \
  -v %cd%\angular.json:/app/angular.json \
  -v %cd%\tsconfig.json:/app/tsconfig.json \
  -v %cd%\tsconfig.app.json:/app/tsconfig.app.json \
  omni-scholar-dev
```

## Production Build - Docker

```bash
# Build production image
docker build -f Dockerfile -t omni-scholar-prod .

# Run production container
docker run -it --rm -p 80:80 omni-scholar-prod

# The app will be available at: http://localhost
```

## Accessing the App

### Development (Docker Compose)
- **URL**: http://localhost:4200
- **Hot Reload**: Enabled (auto-refresh on code changes)
- **Console**: Visible in terminal

### Production (Docker)
- **URL**: http://localhost
- **Performance**: Optimized
- **Served by**: Nginx

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 4200
netstat -ano | findstr :4200

# Kill the process
taskkill /PID <PID> /F

# Or use a different port
docker run -p 4300:4200 omni-scholar-dev
```

### Container Won't Start
```bash
# Check logs
docker-compose logs -f

# Rebuild without cache
docker-compose up --build --no-cache
```

### Clear Docker Cache
```bash
# Remove all containers
docker-compose down

# Remove images
docker rmi omni-scholar-dev omni-scholar-prod

# Rebuild
docker-compose up --build
```

## Deployment Flow

1. **Local Testing** (Docker Compose)
   - Test changes locally
   - Verify no errors
   - Hot reload for fast iteration

2. **Production Build** (Docker)
   - Build optimized production image
   - Test production build locally
   - Verify performance

3. **Vercel Deployment**
   - Push to GitHub
   - Vercel auto-deploys
   - Live at: https://omni-scholar.vercel.app

## Files Involved

- `Dockerfile` - Production build (Nginx)
- `Dockerfile.dev` - Development build (Node.js)
- `docker-compose.yml` - Development orchestration
- `nginx.conf` - Nginx configuration
- `vercel.json` - Vercel deployment config

## Next Steps

1. Run locally: `docker-compose up --build`
2. Verify at: http://localhost:4200
3. Make changes and test
4. Push to GitHub
5. Vercel auto-deploys to production

---

**Status**: ✅ Ready for local Docker testing
