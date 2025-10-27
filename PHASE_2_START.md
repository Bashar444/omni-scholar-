# Phase 2: Backend Development - START NOW! 🚀
## Create Your First API in 30 Minutes

---

## ✅ WHAT YOU HAVE

All services running:
- ✅ PostgreSQL (Database)
- ✅ Elasticsearch (Search)
- ✅ Redis (Cache)
- ✅ Kafka (Events)
- ✅ Prometheus (Metrics)
- ✅ Grafana (Monitoring)

---

## 🎯 WHAT YOU'LL BUILD TODAY

A complete **Papers API** with:
- Create papers
- Read papers
- Update papers
- Delete papers
- List all papers

---

## 📝 STEP 1: Create Paper Entity (5 min)

Create file: `backend/src/modules/papers/entities/paper.entity.ts`

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('papers')
export class Paper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  abstract: string;

  @Column()
  year: number;

  @Column('simple-array')
  authors: string[];

  @Column({ nullable: true })
  doi: string;

  @Column({ default: 0 })
  citationCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 📝 STEP 2: Create DTO (5 min)

Create file: `backend/src/modules/papers/dto/create-paper.dto.ts`

```typescript
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreatePaperDto {
  @IsString()
  title: string;

  @IsString()
  abstract: string;

  @IsNumber()
  year: number;

  @IsArray()
  authors: string[];

  @IsOptional()
  @IsString()
  doi?: string;

  @IsOptional()
  @IsNumber()
  citationCount?: number;
}
```

---

## 📝 STEP 3: Create Repository (5 min)

Create file: `backend/src/modules/papers/papers.repository.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paper } from './entities/paper.entity';
import { CreatePaperDto } from './dto/create-paper.dto';

@Injectable()
export class PapersRepository {
  constructor(
    @InjectRepository(Paper)
    private repository: Repository<Paper>,
  ) {}

  async create(data: CreatePaperDto): Promise<Paper> {
    const paper = this.repository.create(data);
    return this.repository.save(paper);
  }

  async findAll(): Promise<Paper[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Paper> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<CreatePaperDto>): Promise<Paper> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
```

---

## 📝 STEP 4: Create Service (5 min)

Create file: `backend/src/modules/papers/papers.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PapersRepository } from './papers.repository';
import { CreatePaperDto } from './dto/create-paper.dto';

@Injectable()
export class PapersService {
  constructor(private readonly papersRepository: PapersRepository) {}

  async create(createPaperDto: CreatePaperDto) {
    return this.papersRepository.create(createPaperDto);
  }

  async findAll() {
    return this.papersRepository.findAll();
  }

  async findById(id: string) {
    const paper = await this.papersRepository.findById(id);
    if (!paper) {
      throw new NotFoundException(`Paper with ID ${id} not found`);
    }
    return paper;
  }

  async update(id: string, updatePaperDto: Partial<CreatePaperDto>) {
    await this.findById(id); // Verify exists
    return this.papersRepository.update(id, updatePaperDto);
  }

  async delete(id: string) {
    await this.findById(id); // Verify exists
    await this.papersRepository.delete(id);
  }
}
```

---

## 📝 STEP 5: Create Controller (5 min)

Create file: `backend/src/modules/papers/papers.controller.ts`

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PapersService } from './papers.service';
import { CreatePaperDto } from './dto/create-paper.dto';

@Controller('papers')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPaperDto: CreatePaperDto) {
    return this.papersService.create(createPaperDto);
  }

  @Get()
  findAll() {
    return this.papersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.papersService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaperDto: Partial<CreatePaperDto>,
  ) {
    return this.papersService.update(id, updatePaperDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.papersService.delete(id);
  }
}
```

---

## 📝 STEP 6: Create Module (5 min)

Create file: `backend/src/modules/papers/papers.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paper } from './entities/paper.entity';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';
import { PapersRepository } from './papers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Paper])],
  controllers: [PapersController],
  providers: [PapersService, PapersRepository],
  exports: [PapersService],
})
export class PapersModule {}
```

---

## 📝 STEP 7: Update App Module (2 min)

Edit: `backend/src/app.module.ts`

Add to imports:
```typescript
import { PapersModule } from './modules/papers/papers.module';

@Module({
  imports: [
    // ... existing imports ...
    PapersModule,  // Add this
  ],
  // ...
})
```

---

## 🚀 STEP 8: Start Backend (2 min)

In PowerShell:
```powershell
cd c:\Users\basha\Desktop\omni-scholar\backend
npm run start:dev
```

Wait for:
```
[Nest] 12345  - 10/27/2025, 1:00:00 PM     LOG [NestFactory] Starting Nest application...
🚀 Application is running on: http://localhost:3000/api
```

---

## ✅ STEP 9: Test Your API (5 min)

### Create a Paper
```powershell
curl -X POST http://localhost:3000/api/papers `
  -H "Content-Type: application/json" `
  -d '{
    "title": "Machine Learning Basics",
    "abstract": "Introduction to ML concepts",
    "year": 2025,
    "authors": ["John Doe", "Jane Smith"],
    "doi": "10.1234/ml.2025"
  }'
```

### Get All Papers
```powershell
curl http://localhost:3000/api/papers
```

### Get Specific Paper
```powershell
curl http://localhost:3000/api/papers/{id}
```

### Update Paper
```powershell
curl -X PUT http://localhost:3000/api/papers/{id} `
  -H "Content-Type: application/json" `
  -d '{"title": "Updated Title"}'
```

### Delete Paper
```powershell
curl -X DELETE http://localhost:3000/api/papers/{id}
```

---

## 📊 EXPECTED RESPONSES

### Create Paper (201)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Machine Learning Basics",
  "abstract": "Introduction to ML concepts",
  "year": 2025,
  "authors": ["John Doe", "Jane Smith"],
  "doi": "10.1234/ml.2025",
  "citationCount": 0,
  "createdAt": "2025-10-27T13:00:00.000Z"
}
```

### Get All Papers (200)
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Machine Learning Basics",
    "abstract": "Introduction to ML concepts",
    "year": 2025,
    "authors": ["John Doe", "Jane Smith"],
    "doi": "10.1234/ml.2025",
    "citationCount": 0,
    "createdAt": "2025-10-27T13:00:00.000Z"
  }
]
```

---

## 🎯 WHAT'S HAPPENING

```
Your Code (NestJS)
    ↓
API Endpoint (localhost:3000/api/papers)
    ↓
Papers Controller
    ↓
Papers Service
    ↓
Papers Repository
    ↓
TypeORM
    ↓
PostgreSQL Database (localhost:5432)
    ↓
Data Stored! ✅
```

---

## ✅ SUCCESS CHECKLIST

- [ ] Created Paper entity
- [ ] Created CreatePaperDto
- [ ] Created PapersRepository
- [ ] Created PapersService
- [ ] Created PapersController
- [ ] Created PapersModule
- [ ] Updated AppModule
- [ ] Backend running on localhost:3000
- [ ] Can create papers via API
- [ ] Can read papers via API
- [ ] Can update papers via API
- [ ] Can delete papers via API
- [ ] Data persists in PostgreSQL

---

## 🎓 WHAT YOU LEARNED

- ✅ NestJS module structure
- ✅ TypeORM entities
- ✅ Repository pattern
- ✅ Service layer
- ✅ Controller endpoints
- ✅ DTOs for validation
- ✅ API testing with curl

---

## 🚀 NEXT AFTER THIS

1. Create Author entity
2. Create Citation entity
3. Create User entity
4. Set up authentication
5. Connect to Elasticsearch for search
6. Add caching with Redis
7. Stream events to Kafka

---

## 📞 TROUBLESHOOTING

### Port 3000 Already in Use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error
```powershell
# Check PostgreSQL is running
docker-compose ps postgres

# Should show "Up"
```

### Module Not Found Error
- Make sure all files are created in correct locations
- Make sure PapersModule is imported in AppModule

### API Not Responding
- Check backend is running: `npm run start:dev`
- Check no errors in terminal
- Wait 5 seconds after startup

---

## 💡 REMEMBER

- ✅ All code is TypeScript
- ✅ All files follow NestJS conventions
- ✅ Database auto-creates tables
- ✅ API validates input with DTOs
- ✅ Errors are handled gracefully

---

**Time to Complete**: 30 minutes  
**Difficulty**: Easy (just copy-paste code)  
**Result**: Working Papers API!

**Let's build!** 🚀
