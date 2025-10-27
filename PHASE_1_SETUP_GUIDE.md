# Phase 1: Infrastructure Setup - Complete Guide
## OmniScholar Backend Development Environment

**Timeline**: Weeks 1-4  
**Status**: ✅ Foundation Files Created  
**Next**: Install Dependencies & Start Services

---

## 📋 WHAT'S BEEN CREATED

### Backend Project Structure
```
backend/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── app.controller.ts       # Root controller
│   ├── app.service.ts          # Root service
│   ├── modules/                # Feature modules (to be created)
│   ├── common/                 # Shared utilities
│   ├── config/                 # Configuration
│   └── database/               # Migrations & seeders
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── docker-compose.yml          # Local infrastructure
└── .env.example                # Environment variables
```

### Infrastructure Services (Docker Compose)
- ✅ PostgreSQL 15 (Database)
- ✅ Elasticsearch 8.10 (Search)
- ✅ Redis 7 (Caching)
- ✅ Kafka 7.5 (Event Streaming)
- ✅ Zookeeper (Kafka dependency)
- ✅ Prometheus (Metrics)
- ✅ Grafana (Visualization)

---

## 🚀 STEP-BY-STEP SETUP

### Step 1: Navigate to Backend Directory
```bash
cd c:\Users\basha\Desktop\omni-scholar\backend
```

### Step 2: Install Dependencies
```bash
npm install
```

**Expected Output**:
```
added 500+ packages in 2-3 minutes
```

### Step 3: Create Environment File
```bash
# Copy example to .env
cp .env.example .env

# Edit .env if needed (optional for local dev)
# Default values work for local development
```

### Step 4: Start Infrastructure Services
```bash
# Start all services in background
docker-compose up -d

# Verify services are running
docker-compose ps
```

**Expected Output**:
```
NAME                           STATUS
omni-scholar-postgres          Up (healthy)
omni-scholar-elasticsearch     Up (healthy)
omni-scholar-redis             Up (healthy)
omni-scholar-kafka             Up
omni-scholar-zookeeper         Up
omni-scholar-prometheus        Up
omni-scholar-grafana           Up
```

### Step 5: Verify Database Connection
```bash
# Test PostgreSQL connection
psql -h localhost -U scholar -d omni_scholar -c "SELECT 1"

# Expected: Should return "1"
```

### Step 6: Verify Elasticsearch
```bash
# Test Elasticsearch
curl http://localhost:9200

# Expected: JSON response with cluster info
```

### Step 7: Verify Redis
```bash
# Test Redis
redis-cli ping

# Expected: PONG
```

### Step 8: Start Backend Server
```bash
# Development mode with hot reload
npm run start:dev

# Expected output:
# [Nest] 12345  - 10/27/2025, 12:00:00 PM     LOG [NestFactory] Starting Nest application...
# [Nest] 12345  - 10/27/2025, 12:00:01 PM     LOG [InstanceLoader] AppModule dependencies initialized
# 🚀 Application is running on: http://localhost:3000/api
```

### Step 9: Test API
```bash
# In a new terminal, test the API
curl http://localhost:3000/api

# Expected response:
# {
#   "message": "Welcome to OmniScholar API",
#   "version": "1.0.0",
#   "timestamp": "2025-10-27T12:00:00.000Z"
# }
```

### Step 10: Access Monitoring Dashboards
- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Elasticsearch**: http://localhost:9200

---

## 📊 SERVICE ENDPOINTS

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:3000/api | Main API |
| PostgreSQL | localhost:5432 | Database |
| Elasticsearch | http://localhost:9200 | Search engine |
| Redis | localhost:6379 | Cache |
| Kafka | localhost:9092 | Event streaming |
| Prometheus | http://localhost:9090 | Metrics |
| Grafana | http://localhost:3001 | Dashboards |

---

## 🔧 USEFUL COMMANDS

### Docker Management
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f postgres

# Restart a service
docker-compose restart postgres

# Remove volumes (reset data)
docker-compose down -v
```

### Database Management
```bash
# Connect to PostgreSQL
psql -h localhost -U scholar -d omni_scholar

# List tables
\dt

# Exit psql
\q

# Run migrations (when ready)
npm run migration:run

# Generate migration
npm run migration:generate -- -n CreatePapersTable
```

### Backend Development
```bash
# Start in development mode
npm run start:dev

# Build for production
npm run build

# Run production build
npm run start:prod

# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

### Kafka Management
```bash
# List topics
docker exec omni-scholar-kafka kafka-topics --list --bootstrap-server localhost:9092

# Create topic
docker exec omni-scholar-kafka kafka-topics --create --topic paper.created --bootstrap-server localhost:9092

# Describe topic
docker exec omni-scholar-kafka kafka-topics --describe --topic paper.created --bootstrap-server localhost:9092
```

---

## ✅ VERIFICATION CHECKLIST

After setup, verify everything is working:

- [ ] Backend server running on port 3000
- [ ] PostgreSQL accessible on port 5432
- [ ] Elasticsearch accessible on port 9200
- [ ] Redis accessible on port 6379
- [ ] Kafka running on port 9092
- [ ] Prometheus running on port 9090
- [ ] Grafana running on port 3001
- [ ] API responds to GET /api
- [ ] All Docker containers healthy
- [ ] No errors in backend logs

---

## 🐛 TROUBLESHOOTING

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Docker Container Won't Start
```bash
# Check logs
docker-compose logs postgres

# Rebuild container
docker-compose up --build postgres

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Database Connection Failed
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check credentials in .env
cat .env | grep DB_

# Test connection
psql -h localhost -U scholar -d omni_scholar -c "SELECT 1"
```

### Elasticsearch Not Responding
```bash
# Check Elasticsearch logs
docker-compose logs elasticsearch

# Verify it's running
curl http://localhost:9200

# Restart if needed
docker-compose restart elasticsearch
```

### Redis Connection Issues
```bash
# Test Redis
redis-cli ping

# Check Redis logs
docker-compose logs redis

# Restart if needed
docker-compose restart redis
```

---

## 📁 NEXT FILES TO CREATE

### Phase 1.2: Database Schema
- [ ] Paper entity
- [ ] Author entity
- [ ] Citation entity
- [ ] User entity
- [ ] Database migrations

### Phase 1.3: Elasticsearch Setup
- [ ] Index configuration
- [ ] Mapping templates
- [ ] Index lifecycle management

### Phase 1.4: Redis Configuration
- [ ] Cache keys strategy
- [ ] TTL configuration
- [ ] Eviction policies

### Phase 1.5: Kafka Topics
- [ ] paper.created
- [ ] paper.updated
- [ ] citation.added
- [ ] search.performed

---

## 📚 DOCUMENTATION REFERENCES

- **NestJS Docs**: https://docs.nestjs.com
- **TypeORM Docs**: https://typeorm.io
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Elasticsearch Docs**: https://www.elastic.co/guide
- **Redis Docs**: https://redis.io/docs
- **Kafka Docs**: https://kafka.apache.org/documentation

---

## 🎯 SUCCESS CRITERIA

Phase 1 is complete when:

✅ Backend project initialized  
✅ All dependencies installed  
✅ Docker Compose running all services  
✅ API responding on localhost:3000  
✅ Database connected and accessible  
✅ Elasticsearch operational  
✅ Redis operational  
✅ Kafka operational  
✅ Monitoring dashboards accessible  
✅ No errors in logs  

---

## 📞 SUPPORT

If you encounter issues:

1. Check the troubleshooting section above
2. Review Docker logs: `docker-compose logs`
3. Verify all ports are available
4. Ensure Docker Desktop is running
5. Check environment variables in .env

---

## 🚀 NEXT PHASE

Once Phase 1 is complete:

1. Create database entities (Paper, Author, Citation, User)
2. Set up TypeORM migrations
3. Create authentication module
4. Build papers module with CRUD operations
5. Implement search functionality

---

**Phase 1 Status**: ✅ Foundation Ready  
**Next Step**: Run `npm install` in backend directory  
**Estimated Time**: 30 minutes for complete setup

Let's build! 🚀
