# Technical Implementation Guide
## OmniScholar - From Static to Dynamic Platform

---

## PART 1: BACKEND SETUP

### 1.1 NestJS Project Structure

```bash
# Create NestJS backend
npm i -g @nestjs/cli
nest new omni-scholar-backend
cd omni-scholar-backend
```

#### Directory Structure
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── dto/
│   ├── papers/
│   │   ├── papers.controller.ts
│   │   ├── papers.service.ts
│   │   ├── papers.module.ts
│   │   ├── entities/
│   │   │   └── paper.entity.ts
│   │   └── dto/
│   ├── search/
│   │   ├── search.controller.ts
│   │   ├── search.service.ts
│   │   ├── search.module.ts
│   │   └── elasticsearch.service.ts
│   ├── citations/
│   │   ├── citations.controller.ts
│   │   ├── citations.service.ts
│   │   ├── citations.module.ts
│   │   └── entities/
│   ├── authors/
│   │   ├── authors.controller.ts
│   │   ├── authors.service.ts
│   │   ├── authors.module.ts
│   │   └── entities/
│   ├── analytics/
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   └── analytics.module.ts
│   └── users/
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.module.ts
│       └── entities/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
│   ├── database.config.ts
│   ├── elasticsearch.config.ts
│   ├── redis.config.ts
│   └── kafka.config.ts
├── database/
│   ├── migrations/
│   └── seeders/
├── app.module.ts
└── main.ts
```

### 1.2 Core Dependencies

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/typeorm": "^9.0.0",
    "@nestjs/elasticsearch": "^10.0.0",
    "@nestjs/redis": "^9.0.0",
    "@nestjs/kafka": "^9.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.0.0",
    "elasticsearch": "^7.0.0",
    "redis": "^4.0.0",
    "kafkajs": "^2.0.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0"
  }
}
```

### 1.3 Database Schema (TypeORM)

```typescript
// src/modules/papers/entities/paper.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';

@Entity('papers')
export class Paper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  abstract: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  doi: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string;

  @Column({ type: 'date' })
  publishedDate: Date;

  @Column({ type: 'integer', default: 0 })
  citationCount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  journalName: string;

  @Column({ type: 'integer', nullable: true })
  volume: number;

  @Column({ type: 'integer', nullable: true })
  issue: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pages: string;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string; // 'scopus', 'arxiv', 'pubmed', etc.

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToMany(() => Author, author => author.papers)
  authors: Author[];

  @OneToMany(() => Citation, citation => citation.sourcePaper)
  citedBy: Citation[];

  @OneToMany(() => Citation, citation => citation.targetPaper)
  cites: Citation[];
}

// src/modules/authors/entities/author.entity.ts
@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  institution: string;

  @Column({ type: 'integer', default: 0 })
  hIndex: number;

  @Column({ type: 'integer', default: 0 })
  totalCitations: number;

  @Column({ type: 'integer', default: 0 })
  publicationCount: number;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @ManyToMany(() => Paper, paper => paper.authors)
  @JoinTable()
  papers: Paper[];
}

// src/modules/citations/entities/citation.entity.ts
@Entity('citations')
export class Citation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Paper, paper => paper.citedBy)
  sourcePaper: Paper;

  @ManyToOne(() => Paper, paper => paper.cites)
  targetPaper: Paper;

  @Column({ type: 'text', nullable: true })
  context: string;

  @Column({ type: 'integer', default: 1 })
  count: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
```

### 1.4 Core Services

```typescript
// src/modules/papers/papers.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paper } from './entities/paper.entity';

@Injectable()
export class PapersService {
  constructor(
    @InjectRepository(Paper)
    private papersRepository: Repository<Paper>,
  ) {}

  async create(createPaperDto: CreatePaperDto): Promise<Paper> {
    const paper = this.papersRepository.create(createPaperDto);
    return this.papersRepository.save(paper);
  }

  async findAll(skip = 0, take = 10): Promise<[Paper[], number]> {
    return this.papersRepository.findAndCount({
      skip,
      take,
      relations: ['authors'],
    });
  }

  async findById(id: string): Promise<Paper> {
    return this.papersRepository.findOne({
      where: { id },
      relations: ['authors', 'citedBy', 'cites'],
    });
  }

  async searchByTitle(title: string): Promise<Paper[]> {
    return this.papersRepository
      .createQueryBuilder('paper')
      .where('paper.title ILIKE :title', { title: `%${title}%` })
      .orWhere('paper.abstract ILIKE :title', { title: `%${title}%` })
      .limit(20)
      .getMany();
  }

  async updateCitationCount(paperId: string, count: number): Promise<void> {
    await this.papersRepository.update(paperId, {
      citationCount: count,
    });
  }
}

// src/modules/search/elasticsearch.service.ts
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPaper(paper: any): Promise<void> {
    await this.elasticsearchService.index({
      index: 'papers',
      id: paper.id,
      body: {
        title: paper.title,
        abstract: paper.abstract,
        authors: paper.authors.map(a => a.name),
        keywords: paper.keywords,
        publishedDate: paper.publishedDate,
        citationCount: paper.citationCount,
      },
    });
  }

  async search(query: string, filters?: any): Promise<any> {
    const searchBody = {
      query: {
        multi_match: {
          query,
          fields: ['title^3', 'abstract^2', 'keywords', 'authors'],
          fuzziness: 'AUTO',
        },
      },
      size: 20,
    };

    if (filters?.year) {
      searchBody.query = {
        bool: {
          must: searchBody.query,
          filter: {
            range: {
              publishedDate: {
                gte: `${filters.year}-01-01`,
                lte: `${filters.year}-12-31`,
              },
            },
          },
        },
      };
    }

    return this.elasticsearchService.search({
      index: 'papers',
      body: searchBody,
    });
  }

  async autocomplete(prefix: string): Promise<string[]> {
    const result = await this.elasticsearchService.search({
      index: 'papers',
      body: {
        query: {
          match_phrase_prefix: {
            title: prefix,
          },
        },
        _source: ['title'],
        size: 10,
      },
    });

    return result.body.hits.hits.map(hit => hit._source.title);
  }
}

// src/modules/analytics/analytics.service.ts
@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Paper)
    private papersRepository: Repository<Paper>,
  ) {}

  // Calculate H-Index
  async calculateHIndex(authorId: string): Promise<number> {
    const papers = await this.papersRepository
      .createQueryBuilder('paper')
      .leftJoinAndSelect('paper.authors', 'author')
      .where('author.id = :authorId', { authorId })
      .orderBy('paper.citationCount', 'DESC')
      .getMany();

    let hIndex = 0;
    for (let i = 0; i < papers.length; i++) {
      if (papers[i].citationCount >= i + 1) {
        hIndex = i + 1;
      }
    }
    return hIndex;
  }

  // Calculate I10-Index
  async calculateI10Index(authorId: string): Promise<number> {
    const result = await this.papersRepository
      .createQueryBuilder('paper')
      .leftJoinAndSelect('paper.authors', 'author')
      .where('author.id = :authorId', { authorId })
      .andWhere('paper.citationCount >= 10')
      .getCount();

    return result;
  }

  // Calculate M-Quotient
  async calculateMQuotient(authorId: string): Promise<number> {
    const hIndex = await this.calculateHIndex(authorId);
    const firstPaper = await this.papersRepository
      .createQueryBuilder('paper')
      .leftJoinAndSelect('paper.authors', 'author')
      .where('author.id = :authorId', { authorId })
      .orderBy('paper.publishedDate', 'ASC')
      .getOne();

    if (!firstPaper) return 0;

    const currentYear = new Date().getFullYear();
    const firstYear = firstPaper.publishedDate.getFullYear();
    const yearsActive = currentYear - firstYear + 1;

    return hIndex / yearsActive;
  }

  // Trending Papers (Last 30 days)
  async getTrendingPapers(limit = 10): Promise<Paper[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.papersRepository
      .createQueryBuilder('paper')
      .where('paper.updatedAt >= :date', { date: thirtyDaysAgo })
      .orderBy('paper.citationCount', 'DESC')
      .limit(limit)
      .getMany();
  }

  // Research Trends
  async getResearchTrends(keyword: string, years = 5): Promise<any> {
    const startYear = new Date().getFullYear() - years;

    const result = await this.papersRepository
      .createQueryBuilder('paper')
      .select('EXTRACT(YEAR FROM paper.publishedDate)', 'year')
      .addSelect('COUNT(*)', 'count')
      .where('paper.keywords ILIKE :keyword', { keyword: `%${keyword}%` })
      .andWhere('EXTRACT(YEAR FROM paper.publishedDate) >= :startYear', { startYear })
      .groupBy('EXTRACT(YEAR FROM paper.publishedDate)')
      .orderBy('year', 'ASC')
      .getRawMany();

    return result;
  }
}
```

---

## PART 2: DATA INTEGRATION

### 2.1 Scopus API Integration

```typescript
// src/modules/papers/integrations/scopus.integration.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ScopusIntegration {
  private readonly apiKey = process.env.SCOPUS_API_KEY;
  private readonly baseUrl = 'https://api.elsevier.com/content/search/scopus';

  async searchPapers(query: string, page = 1): Promise<any> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          query,
          start: (page - 1) * 25,
          count: 25,
          apiKey: this.apiKey,
        },
        headers: {
          'Accept': 'application/json',
        },
      });

      return response.data['search-results']['entry'].map(entry => ({
        title: entry['dc:title'],
        abstract: entry['dc:description'],
        doi: entry['prism:doi'],
        url: entry['prism:url'],
        publishedDate: entry['prism:coverDate'],
        citationCount: entry['citedby-count'],
        journalName: entry['prism:publicationName'],
        authors: entry['author']?.map(a => ({
          name: a['authname'],
          email: a['authid'],
        })) || [],
        source: 'scopus',
        externalId: entry['eid'],
      }));
    } catch (error) {
      console.error('Scopus API error:', error);
      throw error;
    }
  }
}
```

### 2.2 Kafka Event Streaming

```typescript
// src/modules/papers/kafka/paper-events.producer.ts
import { Injectable } from '@nestjs/common';
import { KafkaService } from '@nestjs/kafka';

@Injectable()
export class PaperEventsProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  async emitPaperCreated(paper: any): Promise<void> {
    await this.kafkaService.emit('paper.created', {
      paperId: paper.id,
      title: paper.title,
      timestamp: new Date(),
    });
  }

  async emitPaperUpdated(paper: any): Promise<void> {
    await this.kafkaService.emit('paper.updated', {
      paperId: paper.id,
      citationCount: paper.citationCount,
      timestamp: new Date(),
    });
  }

  async emitCitationAdded(citation: any): Promise<void> {
    await this.kafkaService.emit('citation.added', {
      sourcePaperId: citation.sourcePaperId,
      targetPaperId: citation.targetPaperId,
      timestamp: new Date(),
    });
  }
}

// src/modules/papers/kafka/paper-events.consumer.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class PaperEventsConsumer {
  @OnEvent('paper.created')
  async handlePaperCreated(payload: any): Promise<void> {
    // Index in Elasticsearch
    // Update analytics
    // Send notifications
  }

  @OnEvent('citation.added')
  async handleCitationAdded(payload: any): Promise<void> {
    // Update citation counts
    // Recalculate metrics
    // Update recommendations
  }
}
```

---

## PART 3: FRONTEND INTEGRATION

### 3.1 API Service Layer

```typescript
// src/app/services/api/papers.api.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PapersApiService {
  private readonly apiUrl = '/api/papers';

  constructor(private http: HttpClient) {}

  searchPapers(query: string, filters?: any): Observable<any> {
    let params = new HttpParams().set('q', query);

    if (filters?.year) {
      params = params.set('year', filters.year);
    }
    if (filters?.author) {
      params = params.set('author', filters.author);
    }

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  getPaperById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getTrendingPapers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trending`);
  }

  getAuthorMetrics(authorId: string): Observable<any> {
    return this.http.get(`/api/authors/${authorId}/metrics`);
  }

  getCitationNetwork(paperId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${paperId}/citations`);
  }
}
```

### 3.2 State Management (Zustand)

```typescript
// src/app/store/papers.store.ts
import { create } from 'zustand';

interface PapersStore {
  papers: any[];
  loading: boolean;
  error: string | null;
  searchPapers: (query: string) => Promise<void>;
  setPapers: (papers: any[]) => void;
  setLoading: (loading: boolean) => void;
}

export const usePapersStore = create<PapersStore>((set) => ({
  papers: [],
  loading: false,
  error: null,

  searchPapers: async (query: string) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/papers/search?q=${query}`);
      const data = await response.json();
      set({ papers: data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  setPapers: (papers: any[]) => set({ papers }),
  setLoading: (loading: boolean) => set({ loading }),
}));
```

### 3.3 Enhanced Components with shadcn/ui

```typescript
// src/app/modules/scholar-graph/components/paper-search.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { usePapersStore } from '../../../store/papers.store';

@Component({
  selector: 'app-paper-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <input
        type="text"
        placeholder="Search papers..."
        [(ngModel)]="searchQuery"
        (keyup.enter)="onSearch()"
        class="search-input"
      />
      <button (click)="onSearch()" class="search-button">
        Search
      </button>
    </div>

    <div *ngIf="loading" class="loading">
      Loading...
    </div>

    <div *ngIf="papers.length > 0" class="results">
      <div *ngFor="let paper of papers" class="paper-card">
        <h3>{{ paper.title }}</h3>
        <p>{{ paper.abstract }}</p>
        <div class="metadata">
          <span>Citations: {{ paper.citationCount }}</span>
          <span>Year: {{ paper.publishedDate | date: 'yyyy' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .search-button {
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .paper-card {
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .metadata {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }
  `]
})
export class PaperSearchComponent {
  searchQuery = '';
  papers: any[] = [];
  loading = false;

  constructor() {
    this.papers = usePapersStore(state => state.papers);
    this.loading = usePapersStore(state => state.loading);
  }

  async onSearch(): Promise<void> {
    if (!this.searchQuery.trim()) return;
    await usePapersStore.getState().searchPapers(this.searchQuery);
  }
}
```

---

## PART 4: DEPLOYMENT

### 4.1 Docker Compose (Development)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: omni_scholar
      POSTGRES_USER: scholar
      POSTGRES_PASSWORD: scholar_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.0.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  kafka:
    image: confluentinc/cp-kafka:7.0.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:7.0.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://scholar:scholar_pass@postgres:5432/omni_scholar
      ELASTICSEARCH_URL: http://elasticsearch:9200
      REDIS_URL: redis://redis:6379
      KAFKA_BROKERS: kafka:9092
    depends_on:
      - postgres
      - elasticsearch
      - redis
      - kafka

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "4200:4200"
    environment:
      API_URL: http://localhost:3000/api
    depends_on:
      - backend

volumes:
  postgres_data:
  elasticsearch_data:
  redis_data:
```

### 4.2 Terraform Infrastructure (AWS)

```hcl
# main.tf
provider "aws" {
  region = var.aws_region
}

# RDS PostgreSQL
resource "aws_db_instance" "omni_scholar" {
  identifier     = "omni-scholar-db"
  engine         = "postgres"
  engine_version = "15.0"
  instance_class = "db.t3.micro"
  allocated_storage = 100

  db_name  = "omni_scholar"
  username = var.db_username
  password = var.db_password

  skip_final_snapshot = true
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "omni_scholar_redis" {
  cluster_id           = "omni-scholar-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
}

# S3 Bucket for documents
resource "aws_s3_bucket" "omni_scholar_docs" {
  bucket = "omni-scholar-documents"
}

# ECS Cluster for backend
resource "aws_ecs_cluster" "omni_scholar" {
  name = "omni-scholar-cluster"
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "omni_scholar" {
  origin {
    domain_name = aws_s3_bucket.omni_scholar_docs.bucket_regional_domain_name
    origin_id   = "S3Origin"
  }

  enabled = true

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

---

## NEXT STEPS

1. **Backend Setup**: Initialize NestJS project
2. **Database**: Create PostgreSQL schema
3. **Search**: Set up Elasticsearch
4. **Integration**: Connect external APIs
5. **Frontend**: Update components with real data
6. **Deployment**: Configure infrastructure
7. **Monitoring**: Set up observability

---

**Ready to implement?** Let me know which phase to start with!
