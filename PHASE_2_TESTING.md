# Phase 2: Testing Papers API
## Step 8 - Start Backend & Test

---

## ✅ ALL FILES CREATED!

All 14 files have been created and committed:

### Papers Module Files
- ✅ `paper.entity.ts` - Database entity
- ✅ `create-paper.dto.ts` - Data validation
- ✅ `papers.repository.ts` - Database access
- ✅ `papers.service.ts` - Business logic
- ✅ `papers.controller.ts` - API endpoints
- ✅ `papers.module.ts` - Module definition

### Stub Modules
- ✅ `auth.module.ts`
- ✅ `search.module.ts`
- ✅ `citations.module.ts`
- ✅ `authors.module.ts`
- ✅ `analytics.module.ts`
- ✅ `users.module.ts`
- ✅ `health.module.ts`

### Updated Files
- ✅ `app.module.ts` - Added PapersModule & Paper entity

---

## 🚀 STEP 8: START BACKEND

### Open PowerShell Terminal

Press: `Windows Key + R`  
Type: `powershell`  
Press: `Enter`

### Navigate to Backend
```powershell
cd c:\Users\basha\Desktop\omni-scholar\backend
```

### Start Backend Server
```powershell
npm run start:dev
```

### Wait for This Message
```
[Nest] 12345  - 10/27/2025, 1:00:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/27/2025, 1:00:01 PM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 10/27/2025, 1:00:02 PM     LOG [InstanceLoader] PapersModule dependencies initialized
🚀 Application is running on: http://localhost:3000/api
```

**If you see this, backend is running!** ✅

---

## 📝 STEP 9: TEST API ENDPOINTS

### Open Another PowerShell Terminal

Keep the first one running with backend.  
Open a new PowerShell window.

### Test 1: Create a Paper

```powershell
curl -X POST http://localhost:3000/api/papers `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Machine Learning Basics",
    "abstract": "Introduction to ML concepts and algorithms",
    "year": 2025,
    "authors": ["John Doe", "Jane Smith"],
    "doi": "10.1234/ml.2025"
  }'
```

**Expected Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Machine Learning Basics",
  "abstract": "Introduction to ML concepts and algorithms",
  "year": 2025,
  "authors": ["John Doe", "Jane Smith"],
  "doi": "10.1234/ml.2025",
  "citationCount": 0,
  "createdAt": "2025-10-27T13:00:00.000Z",
  "updatedAt": "2025-10-27T13:00:00.000Z"
}
```

**Copy the `id` value for next tests!**

---

### Test 2: Get All Papers

```powershell
curl http://localhost:3000/api/papers
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Machine Learning Basics",
    "abstract": "Introduction to ML concepts and algorithms",
    "year": 2025,
    "authors": ["John Doe", "Jane Smith"],
    "doi": "10.1234/ml.2025",
    "citationCount": 0,
    "createdAt": "2025-10-27T13:00:00.000Z",
    "updatedAt": "2025-10-27T13:00:00.000Z"
  }
]
```

---

### Test 3: Get Specific Paper

Replace `{id}` with the ID from Test 1:

```powershell
curl http://localhost:3000/api/papers/550e8400-e29b-41d4-a716-446655440000
```

**Expected Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Machine Learning Basics",
  "abstract": "Introduction to ML concepts and algorithms",
  "year": 2025,
  "authors": ["John Doe", "Jane Smith"],
  "doi": "10.1234/ml.2025",
  "citationCount": 0,
  "createdAt": "2025-10-27T13:00:00.000Z",
  "updatedAt": "2025-10-27T13:00:00.000Z"
}
```

---

### Test 4: Update Paper

Replace `{id}` with the ID from Test 1:

```powershell
curl -X PUT http://localhost:3000/api/papers/550e8400-e29b-41d4-a716-446655440000 `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Advanced Machine Learning",
    "citationCount": 5
  }'
```

**Expected Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Advanced Machine Learning",
  "abstract": "Introduction to ML concepts and algorithms",
  "year": 2025,
  "authors": ["John Doe", "Jane Smith"],
  "doi": "10.1234/ml.2025",
  "citationCount": 5,
  "createdAt": "2025-10-27T13:00:00.000Z",
  "updatedAt": "2025-10-27T13:00:02.000Z"
}
```

---

### Test 5: Get Stats

```powershell
curl http://localhost:3000/api/papers/stats
```

**Expected Response (200 OK):**
```json
{
  "totalPapers": 1
}
```

---

### Test 6: Delete Paper

Replace `{id}` with the ID from Test 1:

```powershell
curl -X DELETE http://localhost:3000/api/papers/550e8400-e29b-41d4-a716-446655440000
```

**Expected Response (204 No Content):**
```
(Empty response)
```

---

### Test 7: Verify Deletion

```powershell
curl http://localhost:3000/api/papers
```

**Expected Response (200 OK):**
```json
[]
```

(Empty array - paper was deleted)

---

## 📊 API ENDPOINTS SUMMARY

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | /api/papers | Create paper | ✅ |
| GET | /api/papers | Get all papers | ✅ |
| GET | /api/papers/:id | Get specific paper | ✅ |
| GET | /api/papers/stats | Get statistics | ✅ |
| PUT | /api/papers/:id | Update paper | ✅ |
| DELETE | /api/papers/:id | Delete paper | ✅ |

---

## 🎯 WHAT'S HAPPENING

```
Your Request (curl)
    ↓
Papers Controller (papers.controller.ts)
    ↓
Papers Service (papers.service.ts)
    ↓
Papers Repository (papers.repository.ts)
    ↓
TypeORM
    ↓
PostgreSQL Database (localhost:5432)
    ↓
Response Back to You ✅
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend running on localhost:3000
- [ ] Can create papers (Test 1)
- [ ] Can get all papers (Test 2)
- [ ] Can get specific paper (Test 3)
- [ ] Can update paper (Test 4)
- [ ] Can get stats (Test 5)
- [ ] Can delete paper (Test 6)
- [ ] Deletion verified (Test 7)
- [ ] All responses are correct
- [ ] Data persists in PostgreSQL

---

## 🐛 TROUBLESHOOTING

### Backend Won't Start
```
Error: Port 3000 already in use
```
**Solution:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
npm run start:dev
```

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Check Docker: `docker-compose ps postgres`
- Should show "Up"
- If not: `docker-compose restart postgres`

### Module Not Found Error
```
Error: Cannot find module '@nestjs/common'
```
**Solution:**
- Dependencies not installed
- Run: `npm install --legacy-peer-deps`

### API Returns 404
```
Error: Cannot POST /api/papers
```
**Solution:**
- Backend not running
- Check first terminal is still running
- Or restart: `npm run start:dev`

### Validation Error
```
Error: title should not be empty
```
**Solution:**
- Check your JSON data
- Make sure all required fields are included
- title, abstract, year, authors are required

---

## 💡 TIPS

1. **Keep Terminal Open**: Don't close the backend terminal
2. **Use New Terminal**: Open new PowerShell for testing
3. **Copy IDs**: Save the paper ID for testing updates/deletes
4. **Check Logs**: Backend terminal shows all requests
5. **Test Order**: Follow tests 1-7 in order

---

## 🎓 WHAT YOU LEARNED

- ✅ Created NestJS module structure
- ✅ Created TypeORM entity
- ✅ Created repository pattern
- ✅ Created service layer
- ✅ Created controller endpoints
- ✅ Created DTOs for validation
- ✅ Tested all CRUD operations
- ✅ Verified database persistence

---

## 🚀 NEXT AFTER THIS

Once all tests pass:

1. Create Author entity
2. Create Citation entity
3. Create User entity
4. Set up authentication
5. Connect to Elasticsearch
6. Add caching with Redis
7. Stream events to Kafka

---

## 📞 NEED HELP?

1. Check backend logs (first terminal)
2. Check error messages carefully
3. Verify Docker services running
4. Verify correct JSON format
5. Check file paths are correct

---

**Time to Complete**: 15 minutes  
**Difficulty**: Easy (just run commands)  
**Result**: Working Papers API! ✅

**Let's test!** 🚀
