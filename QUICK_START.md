# OmniScholar - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Prerequisites
- Docker Desktop installed and running
- PowerShell or Command Prompt

---

## Option 1: PowerShell (Recommended)

### Local Development (Hot Reload)
```powershell
cd c:\Users\basha\Desktop\omni-scholar
.\run-local-docker.ps1
```

**Then open**: http://localhost:4200

### Production Build
```powershell
cd c:\Users\basha\Desktop\omni-scholar
.\run-production-docker.ps1
```

**Then open**: http://localhost

---

## Option 2: Command Prompt (CMD)

### Local Development
```cmd
cd c:\Users\basha\Desktop\omni-scholar
run-local-docker.bat
```

**Then open**: http://localhost:4200

### Production Build
```cmd
cd c:\Users\basha\Desktop\omni-scholar
run-production-docker.bat
```

**Then open**: http://localhost

---

## Option 3: Manual Docker Commands

### Local Development
```bash
cd c:\Users\basha\Desktop\omni-scholar
docker-compose up --build
```

### Production Build
```bash
cd c:\Users\basha\Desktop\omni-scholar
docker build -f Dockerfile -t omni-scholar-prod .
docker run -it --rm -p 80:80 omni-scholar-prod
```

---

## What You'll See

### Local Development (localhost:4200)
```
✓ Docker builds development image
✓ Node.js container starts
✓ Angular dev server runs
✓ App loads with hot reload
✓ Dashboard displays correctly
✓ No console errors
```

### Production Build (localhost)
```
✓ Angular builds optimized bundle
✓ Nginx starts serving files
✓ App loads with production performance
✓ All routes redirect to index.html
✓ Security headers configured
```

---

## Troubleshooting

### PowerShell Script Won't Run
```powershell
# If you get "cannot be loaded because running scripts is disabled"
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try again
.\run-local-docker.ps1
```

### Port Already in Use
```powershell
# Find process on port 4200
Get-NetTCPConnection -LocalPort 4200

# Kill the process
Stop-Process -Id <PID> -Force

# Or use different port in docker-compose.yml
```

### Docker Not Running
```powershell
# Start Docker Desktop
# Wait 30 seconds for it to fully start
# Then try again
```

### Clear Docker Cache
```powershell
# Stop all containers
docker-compose down

# Remove images
docker rmi omni-scholar-dev omni-scholar-prod

# Clean up
docker system prune -a

# Rebuild
.\run-local-docker.ps1
```

---

## Deployment

### After Local Testing
```powershell
# All changes already pushed to GitHub
# Vercel auto-deploys on push
# Check status at: https://vercel.com/dashboard
```

### Live URL
- **Development**: http://localhost:4200
- **Production Local**: http://localhost
- **Vercel Live**: https://omni-scholar.vercel.app

---

## Next Steps

1. ✅ Run local development: `.\run-local-docker.ps1`
2. ✅ Verify dashboard displays
3. ✅ Test in browser: http://localhost:4200
4. ✅ Make changes and test hot reload
5. ✅ Push to GitHub (auto-deploys to Vercel)

---

**Status**: ✅ Ready to run locally
**Time to Deploy**: 2 minutes
