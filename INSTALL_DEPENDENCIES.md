# Install Dependencies - FIX
## 'nest' command not found

---

## ❌ PROBLEM

```
'nest' is not recognized as an internal or external command
```

**Cause**: npm dependencies not installed

---

## ✅ SOLUTION

### Step 1: Install Dependencies

In PowerShell (in backend folder):

```powershell
npm install --legacy-peer-deps
```

**This will take 2-5 minutes**

Wait for:
```
added 500+ packages in 2m30s
```

---

## 🚀 Step 2: Start Backend

After installation completes:

```powershell
npm run start:dev
```

**Wait for this message:**
```
[Nest] 12345  - 10/27/2025, 1:00:00 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/27/2025, 1:00:01 PM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 10/27/2025, 1:00:02 PM     LOG [InstanceLoader] PapersModule dependencies initialized
🚀 Application is running on: http://localhost:3000/api
```

---

## 📊 WHAT'S HAPPENING

```
npm install --legacy-peer-deps
    ↓
Downloads all NestJS packages
    ↓
Installs TypeORM, PostgreSQL driver, etc.
    ↓
Creates node_modules folder
    ↓
Ready to run! ✅
```

---

## ✅ COMPLETE STEPS

1. ✅ Navigate to backend folder
2. ⏳ **Run: `npm install --legacy-peer-deps`** ← DO THIS NOW
3. ⏳ Wait for completion
4. ⏳ Run: `npm run start:dev`
5. ⏳ Wait for "Application is running" message
6. ⏳ Open new PowerShell for testing

---

## 💡 REMEMBER

- **Don't close PowerShell** while installing
- **Wait for "added X packages"** message
- **Then run** `npm run start:dev`
- **Keep it running** while testing

---

**Do this now!** 🚀
