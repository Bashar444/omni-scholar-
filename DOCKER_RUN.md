# Quick Docker Run Guide

## Issue Fixed
**Peer Dependency Conflict**: NgRx 17 requires Angular 17, but project uses Angular 16
- **Solution**: Downgraded NgRx from 17 to 16
- **Added**: `--legacy-peer-deps` flag to Docker builds as fallback

## Build and Run Docker Locally

### Step 1: Delete old image (if exists)
```bash
docker rmi my-windsurf-app
```

### Step 2: Build the Docker image
```bash
cd C:\Users\basha\Desktop\omni-scholar
docker build -t my-windsurf-app .
```

**Expected output**: Should complete successfully without ERESOLVE errors

### Step 3: Run the container
```bash
docker run -p 80:80 my-windsurf-app
```

### Step 4: Access the app
Open browser and navigate to: **http://localhost**

---

## Development Mode (with hot reload)

### Step 1: Build dev image
```bash
docker build -f Dockerfile.dev -t my-windsurf-app-dev .
```

### Step 2: Run dev container
```bash
docker run -p 4200:4200 my-windsurf-app-dev
```

### Step 3: Access the app
Open browser and navigate to: **http://localhost:4200**

---

## Troubleshooting

### Port already in use
```bash
# Use different port
docker run -p 8080:80 my-windsurf-app
# Then access at http://localhost:8080
```

### View container logs
```bash
# List running containers
docker ps

# View logs
docker logs <container_id> -f
```

### Stop container
```bash
docker stop <container_id>
```

### Remove all Docker artifacts
```bash
docker system prune -a
```

---

## Verify Success

1. ✅ Docker build completes without errors
2. ✅ Container starts successfully
3. ✅ App loads at http://localhost (or http://localhost:4200)
4. ✅ No black screen - page displays content
5. ✅ Browser console (F12) shows no critical errors

Once verified locally, the app is ready for Vercel redeployment.
