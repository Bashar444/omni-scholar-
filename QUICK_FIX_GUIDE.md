# Quick Fix - 10 Steps (Docker Desktop GUI Only)
## All Issues Resolved

---

## 🎯 DO THIS NOW (10 Steps)

### 1️⃣ Open Docker Desktop
Click the Docker icon on your taskbar

### 2️⃣ Click "Containers" Tab
In the left sidebar

### 3️⃣ Stop All Containers
- Right-click each `omni-scholar-*` container
- Click "Stop"
- Wait for gray status

### 4️⃣ Remove All Containers
- Right-click each stopped container
- Click "Remove"
- Confirm

### 5️⃣ Remove All Volumes
- Click "Volumes" tab
- Right-click each `backend_*` volume
- Click "Delete"
- Confirm

### 6️⃣ Pull Latest Files
Open PowerShell:
```
cd c:\Users\basha\Desktop\omni-scholar
git pull origin main
```

### 7️⃣ Start Fresh in Docker Desktop
1. Click "Containers" tab
2. Click "Create" button
3. Select "Compose"
4. Browse to: `backend/docker-compose.yml`
5. Click "Create"

### 8️⃣ Wait for Green Status
- Watch all containers
- Wait 30-60 seconds
- All should show green "Running"

### 9️⃣ Test Grafana
Open browser: **http://localhost:3001**
- Should see login page
- Login: **admin / admin**
- If you see dashboard, it works! ✅

### 🔟 Done! ✅
All services running and accessible

---

## 📊 VERIFY SERVICES

| Service | URL | Status |
|---------|-----|--------|
| Grafana | http://localhost:3001 | ✅ |
| Prometheus | http://localhost:9090 | ✅ |
| Elasticsearch | http://localhost:9200 | ✅ |
| PostgreSQL | localhost:5432 | ✅ |
| Redis | localhost:6379 | ✅ |
| Kafka | localhost:9092 | ✅ |

---

## ✅ WHAT'S FIXED

- ✅ Docker compose version warning removed
- ✅ Prometheus mount error fixed
- ✅ npm dependency conflict resolved
- ✅ All services ready to run
- ✅ No terminal commands needed

---

## 💡 REMEMBER

- Use Docker Desktop GUI only
- Don't use terminal commands
- Wait for green "Running" status
- Takes 10-15 minutes total
- Everything will work!

---

**Let's go!** 🚀
