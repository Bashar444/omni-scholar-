# Docker Usage Guide for OmniScholar

This guide explains how to run OmniScholar using Docker for both development and production.

## Prerequisites

- Docker Desktop installed ([download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## Development Mode (with Hot Reload)

### Quick Start

```powershell
# Navigate to omni-scholar directory
cd omni-scholar

# Start the development container
docker-compose up
```

### Access the Application

Once the container starts (you'll see "Application bundle generation complete"), open your browser to:

**http://localhost:4200/**

### Hot Reload

The development setup includes volume mounts for:
- `src/` directory
- `angular.json`
- `tsconfig.json` files

Any changes you make to these files will automatically trigger a rebuild in the container.

### Stopping the Container

Press `Ctrl+C` in the terminal running docker-compose, or in a new terminal:

```powershell
docker-compose down
```

## Production Mode (Nginx)

### Build the Production Image

```powershell
cd omni-scholar
docker build -t omni-scholar-prod .
```

### Run the Production Container

```powershell
docker run -p 8080:80 omni-scholar-prod
```

### Access the Application

Open your browser to:

**http://localhost:8080/**

### Production Features

- Nginx web server
- Gzip compression enabled
- Static asset caching (1 year)
- SPA fallback routing
- Optimized Angular production build

## Docker Commands Reference

### Development

```powershell
# Start in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild and start (if you change package.json)
docker-compose up --build

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

### Production

```powershell
# Build with a specific tag
docker build -t omni-scholar:v1.0.0 .

# Run with custom port mapping
docker run -p 3000:80 omni-scholar-prod

# Run in detached mode
docker run -d -p 8080:80 omni-scholar-prod

# View running containers
docker ps

# Stop a container
docker stop <container_id>

# View container logs
docker logs <container_id>
```

## Troubleshooting

### Port Already in Use

If you get "port is already allocated" error:

```powershell
# Development: Change port in docker-compose.yml
ports:
  - "4201:4200"  # Use 4201 instead of 4200

# Production: Use a different port
docker run -p 8081:80 omni-scholar-prod
```

### Container Not Starting

```powershell
# Check container logs
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose up --build
```

### File Changes Not Reflecting

```powershell
# Restart the container
docker-compose restart

# If that doesn't work, rebuild
docker-compose down
docker-compose up --build
```

## Files Created

- **Dockerfile.dev**: Development container with Node.js and hot reload
- **docker-compose.yml**: Orchestrates development environment
- **Dockerfile**: Multi-stage production build with Nginx
- **nginx.conf**: Nginx configuration for SPA routing

## Next Steps

After running the application:

1. **Test authentication**: Navigate to http://localhost:4200/auth
2. **Try protected routes**: Access `/lab-sync` or `/omni-ai` (will redirect to auth)
3. **Explore modules**: Click through the 10 research modules in the sidebar
4. **Check Redux DevTools**: Install [Redux DevTools extension](https://github.com/reduxjs/redux-devtools) to inspect NgRx state

## Need Help?

- Docker issues: Check [Docker documentation](https://docs.docker.com/)
- Angular issues: See [Angular documentation](https://angular.dev/)
- OmniScholar questions: Refer to `START_HERE.md` in project root
