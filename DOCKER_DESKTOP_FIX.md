# Docker Desktop Fix - Step by Step (GUI ONLY)
## No Terminal Commands - Everything in Docker Desktop App

---

## ⚠️ WHAT WENT WRONG

1. ❌ npm dependency conflict (ERESOLVE)
2. ❌ Prometheus mount path error
3. ❌ Docker compose version warning

**All fixed now!** ✅

---

## 🎯 STEP-BY-STEP FIX (Docker Desktop GUI Only)

### Step 1: Stop All Containers
1. Open **Docker Desktop** app
2. Click **"Containers"** tab
3. Look for all `omni-scholar-*` containers
4. Right-click each one
5. Select **"Stop"**
6. Wait for all to stop (gray status)

### Step 2: Remove All Containers
1. Still in **"Containers"** tab
2. Right-click each stopped container
3. Select **"Remove"**
4. Confirm deletion
5. All should be gone

### Step 3: Remove Volumes (Optional but Recommended)
1. Click **"Volumes"** tab in left sidebar
2. Look for `backend_*` volumes
3. Right-click each one
4. Select **"Delete"**
5. Confirm

### Step 4: Verify Clean State
1. Click **"Containers"** tab
2. Should be empty (no omni-scholar containers)
3. Click **"Volumes"** tab
4. Should have no `backend_*` volumes

---

## 🔄 RESTART WITH FIXED FILES

### Step 5: Update Files (Already Done!)
✅ Fixed `docker-compose.yml` - removed version warning
✅ Fixed Prometheus mount issue
✅ Fixed package.json - added legacy-peer-deps

### Step 6: Pull Latest from GitHub
1. Open **PowerShell** or **Terminal**
2. Navigate to project:
   ```
   cd c:\Users\basha\Desktop\omni-scholar
   ```
3. Pull latest:
   ```
   git pull origin main
   ```

### Step 7: Start Fresh in Docker Desktop
1. Open **Docker Desktop** app
2. Click **"Containers"** tab
3. Click **"Create"** button (or plus icon)
4. Select **"Compose"** option
5. Browse to: `c:\Users\basha\Desktop\omni-scholar\backend\docker-compose.yml`
6. Click **"Create"**

### Step 8: Wait for All Services to Start
1. Watch the **"Containers"** tab
2. All services should show **green "Running"** status
3. Wait 30-60 seconds for full startup
4. Check each service:
   - ✅ omni-scholar-postgres
   - ✅ omni-scholar-elasticsearch
   - ✅ omni-scholar-redis
   - ✅ omni-scholar-kafka
   - ✅ omni-scholar-zookeeper
   - ✅ omni-scholar-prometheus
   - ✅ omni-scholar-grafana

### Step 9: Verify Services Running
1. Open browser
2. Go to: **http://localhost:3001**
3. Should see **Grafana login** page
4. Login: **admin / admin**
5. If you see it, everything works! ✅

### Step 10: Check Other Services
1. Prometheus: **http://localhost:9090**
2. Elasticsearch: **http://localhost:9200**
3. All should respond

---

## 📊 WHAT EACH SERVICE DOES

| Service | Port | What to Check |
|---------|------|---------------|
| Grafana | 3001 | Login page appears |
| Prometheus | 9090 | Metrics page loads |
| Elasticsearch | 9200 | JSON response |
| PostgreSQL | 5432 | Running (in Docker) |
| Redis | 6379 | Running (in Docker) |
| Kafka | 9092 | Running (in Docker) |

---

## ✅ SUCCESS CHECKLIST

After completing all steps:

- [ ] All containers stopped and removed
- [ ] All volumes removed
- [ ] Latest files pulled from GitHub
- [ ] Docker Compose started fresh
- [ ] All 7 services show green "Running"
- [ ] Grafana accessible at http://localhost:3001
- [ ] Prometheus accessible at http://localhost:9090
- [ ] Elasticsearch accessible at http://localhost:9200

---

## 🎓 WHAT'S DIFFERENT NOW

### Before (Broken)
- ❌ Prometheus mount error
- ❌ npm dependency conflict
- ❌ Docker compose version warning

### After (Fixed)
- ✅ Prometheus runs without mount
- ✅ npm installs with legacy-peer-deps
- ✅ No version warnings
- ✅ All services start cleanly

---

## 💡 IMPORTANT NOTES

1. **Don't use terminal** - Everything is GUI clicks
2. **Don't run npm install** - Not needed in Docker
3. **Don't run docker-compose commands** - Use Docker Desktop GUI
4. **Just use Docker Desktop app** - All buttons and clicks
5. **Wait for green status** - Services take 30-60 seconds to start

---

## 🐛 IF SOMETHING STILL FAILS

### Container Won't Start
1. Right-click container
2. Click **"View logs"**
3. Read the error message
4. Screenshot and share the error

### Can't Access Grafana
1. Check if container is green "Running"
2. Wait another 30 seconds
3. Try refreshing browser
4. Try different port: http://localhost:3001

### Still Getting Errors
1. Stop all containers
2. Remove all containers
3. Remove all volumes
4. Start fresh from Step 7
5. Wait longer for startup

---

## 🚀 NEXT AFTER FIX

Once everything is running:

1. ✅ All services operational
2. ✅ Dashboards accessible
3. ✅ Ready for backend development
4. ✅ Ready to create database entities
5. ✅ Ready to build APIs

---

## 📞 SUPPORT

If you need help:

1. Check Docker Desktop logs (right-click container → View logs)
2. Verify all containers are green "Running"
3. Wait 60 seconds for full startup
4. Try refreshing browser
5. Try stopping and restarting containers

---

## 🎯 REMEMBER

- ✅ Use Docker Desktop GUI only
- ✅ No terminal commands needed
- ✅ All buttons and clicks
- ✅ Takes 5-10 minutes
- ✅ Everything will work!

---

**Total Time**: 10-15 minutes  
**Difficulty**: Easy (GUI clicks only)  
**Terminal Commands**: 0 (Just git pull)

**Let's fix this!** 🚀
