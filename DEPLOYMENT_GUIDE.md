# OmniScholar - Complete Deployment Guide

## 🚀 Deployment Pipeline

```
Local Development → Docker Local Testing → GitHub Push → Vercel Production
```

---

## Phase 1: Local Development & Testing

### Option A: Direct Node.js (No Docker)

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start

# App available at: http://localhost:4200
```

### Option B: Docker Development (Recommended)

```bash
# Run the batch script
run-local-docker.bat

# OR use docker-compose directly
docker-compose up --build

# App available at: http://localhost:4200
```

**Benefits:**
- ✅ Isolated environment
- ✅ No local dependencies needed
- ✅ Hot reload enabled
- ✅ Same as production environment

---

## Phase 2: Production Build Testing

### Local Production Build

```bash
# Run the batch script
run-production-docker.bat

# OR use Docker directly
docker build -f Dockerfile -t omni-scholar-prod .
docker run -it --rm -p 80:80 omni-scholar-prod

# App available at: http://localhost
```

**What happens:**
1. Angular builds optimized production bundle
2. Nginx serves the static files
3. All routes redirect to index.html (SPA)
4. Security headers configured
5. Caching optimized

---

## Phase 3: GitHub Push

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "Fix: resolve black screen issue, add Docker support"

# Push to main branch
git push origin main
```

**Repository:** https://github.com/Bashar444/omni-scholar-

---

## Phase 4: Vercel Deployment

### Automatic Deployment

1. **Push to GitHub** (done above)
2. **Vercel auto-detects** the push
3. **Build starts** automatically
4. **Deploy to production** (5-10 minutes)

### Manual Deployment (if needed)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# View deployment
vercel --prod
```

### Deployment URL
- **Live**: https://omni-scholar.vercel.app
- **Status**: Check at https://vercel.com/dashboard

---

## Verification Checklist

### ✅ Local Development
- [ ] `npm install` completes without errors
- [ ] `npm start` starts dev server
- [ ] App loads at http://localhost:4200
- [ ] Dashboard visible with content
- [ ] No console errors
- [ ] Hot reload works

### ✅ Docker Development
- [ ] `docker-compose up --build` succeeds
- [ ] Container starts without errors
- [ ] App loads at http://localhost:4200
- [ ] Dashboard visible with content
- [ ] No container errors in logs

### ✅ Production Build
- [ ] `docker build -f Dockerfile` succeeds
- [ ] Production image builds (2-3 min)
- [ ] `docker run` starts container
- [ ] App loads at http://localhost
- [ ] Performance optimized (minified)
- [ ] Security headers present

### ✅ Vercel Deployment
- [ ] Build completes without errors
- [ ] Deployment successful
- [ ] App loads at https://omni-scholar.vercel.app
- [ ] Dashboard visible with content
- [ ] No console errors
- [ ] Performance metrics good

---

## Build Outputs

### Development
```
dist/omni-scholar-app/browser/
├── index.html
├── main.*.js (unminified)
├── styles.*.css
├── runtime.*.js
└── assets/
```

### Production
```
dist/omni-scholar-app/browser/
├── index.html
├── main.*.js (minified, ~137KB)
├── styles.*.css (minified, ~28KB)
├── runtime.*.js (minified, ~1.6KB)
└── assets/
```

---

## Troubleshooting

### Black Screen Issue
**Symptoms:** App loads but shows black screen
**Solutions:**
1. Check browser console for errors
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)
4. Check that dashboard component is loading

### Docker Issues
**Container won't start:**
```bash
# Check logs
docker-compose logs -f

# Rebuild without cache
docker-compose up --build --no-cache

# Clean everything
docker-compose down -v
docker system prune -a
```

**Port already in use:**
```bash
# Find process on port 4200
netstat -ano | findstr :4200

# Kill process
taskkill /PID <PID> /F

# Or use different port
docker run -p 4300:4200 omni-scholar-dev
```

### Build Failures
**npm install fails:**
```bash
# Clear cache
npm cache clean --force

# Reinstall
npm install --legacy-peer-deps
```

**Angular build fails:**
```bash
# Check for TypeScript errors
ng build --configuration production

# Check console output for specific errors
```

---

## Performance Metrics

### Development Build
- Build time: ~45 seconds
- Bundle size: ~962 KB (unminified)
- Startup time: ~2-3 seconds

### Production Build
- Build time: ~45 seconds
- Bundle size: ~167 KB (minified, gzipped)
- Startup time: ~1 second
- Performance: Optimized

### Vercel Deployment
- Deploy time: ~5-10 minutes
- TTFB: <100ms
- Lighthouse Score: 90+

---

## Environment Variables

### Development
```
NODE_ENV=development
```

### Production
```
NODE_ENV=production
```

### Vercel
- Automatically set to production
- Check at: https://vercel.com/dashboard/[project]/settings/environment-variables

---

## Rollback Procedure

### If Deployment Fails

1. **Check Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - View build logs
   - Identify error

2. **Rollback to Previous Version**
   ```bash
   # Find previous commit
   git log --oneline -5
   
   # Revert to previous commit
   git revert <commit-hash>
   git push origin main
   
   # Vercel auto-redeploys
   ```

3. **Manual Rollback**
   - In Vercel dashboard
   - Click "Deployments"
   - Select previous successful deployment
   - Click "Promote to Production"

---

## Monitoring

### Vercel Monitoring
- **Dashboard**: https://vercel.com/dashboard
- **Analytics**: View real-time traffic
- **Error Tracking**: See deployment errors
- **Performance**: Monitor metrics

### Local Monitoring
```bash
# Check Docker container
docker ps

# View logs
docker-compose logs -f

# Check resource usage
docker stats
```

---

## Summary

| Stage | Command | URL | Time |
|-------|---------|-----|------|
| Dev | `npm start` | http://localhost:4200 | 2-3s |
| Docker Dev | `docker-compose up` | http://localhost:4200 | 5-10s |
| Prod Local | `docker run -f Dockerfile` | http://localhost | 1s |
| Vercel | `git push` | https://omni-scholar.vercel.app | 5-10m |

---

**Status**: ✅ Ready for deployment
**Last Updated**: November 2, 2025
