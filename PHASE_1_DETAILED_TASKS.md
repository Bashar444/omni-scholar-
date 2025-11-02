# Phase 1: Complete Core Backend Modules - Detailed Tasks

**Duration**: 2 weeks  
**Priority**: CRITICAL  
**Status**: Starting

---

## Task Breakdown

### TASK 1.1: Extend Paper Entity & Repository

#### Subtasks
1. [ ] Update Paper entity with additional fields
   ```typescript
   // Add to Paper entity:
   - doi: string (unique)
   - url: string
   - publishedDate: Date
   - journal: string
   - volume: string
   - issue: string
   - pages: string
   - keywords: string[]
   - openAccess: boolean
   - preprint: boolean
   - fullTextUrl: string
   - metadata: JSON
   ```

2. [ ] Create database migration for new fields

3. [ ] Extend PapersRepository with new methods
   ```typescript
   async findByDOI(doi: string): Promise<Paper>
   async findByAuthor(authorId: string): Promise<Paper[]>
   async findByJournal(journal: string): Promise<Paper[]>
   async findByDateRange(start: Date, end: Date): Promise<Paper[]>
   async findByKeywords(keywords: string[]): Promise<Paper[]>
   async searchFullText(query: string): Promise<Paper[]>
   async findOpenAccess(): Promise<Paper[]>
   async findPreprints(): Promise<Paper[]>
   ```

4. [ ] Update PapersService with new methods

5. [ ] Update PapersController with new endpoints

#### Deliverables
- Extended Paper entity with 10+ new fields
- Database migration
- 8+ new repository methods
- API endpoints for new functionality

---

### TASK 1.2: Build Citations Module

#### Subtasks
1. [ ] Create Citation entity
   ```typescript
   @Entity('citations')
   export class Citation {
     @PrimaryGeneratedColumn('uuid')
     id: string;

     @Column('uuid')
     sourcePaperId: string;

     @Column('uuid')
     targetPaperId: string;

     @Column('text', { nullable: true })
     context: string;

     @Column('varchar')
     citationType: 'direct' | 'indirect' | 'related';

     @Column('int', { default: 1 })
     count: number;

     @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
     createdAt: Date;

     @Column('timestamp', { onUpdate: 'CURRENT_TIMESTAMP' })
     updatedAt: Date;
   }
   ```

2. [ ] Create CitationsRepository
   ```typescript
   async findCitationsBetween(source: string, target: string): Promise<Citation[]>
   async findCitationsFor(paperId: string): Promise<Citation[]>
   async findCitationsFrom(paperId: string): Promise<Citation[]>
   async getCitationCount(paperId: string): Promise<number>
   async getCitationNetwork(paperId: string): Promise<CitationGraph>
   async findCitationPath(source: string, target: string): Promise<Citation[]>
   ```

3. [ ] Create CitationsService
   - Implement citation graph algorithms
   - Path finding
   - Network analysis

4. [ ] Create CitationsController
   - GET /citations/:paperId/incoming
   - GET /citations/:paperId/outgoing
   - GET /citations/:paperId/network
   - GET /citations/path/:source/:target
   - POST /citations (create)
   - DELETE /citations/:id

5. [ ] Create database migration

#### Deliverables
- Citation entity
- CitationsRepository with graph methods
- CitationsService with algorithms
- CitationsController with 6+ endpoints
- Database migration

---

### TASK 1.3: Build Authors Module

#### Subtasks
1. [ ] Create Author entity
   ```typescript
   @Entity('authors')
   export class Author {
     @PrimaryGeneratedColumn('uuid')
     id: string;

     @Column('varchar')
     name: string;

     @Column('varchar', { nullable: true })
     email: string;

     @Column('varchar', { nullable: true })
     institution: string;

     @Column('varchar', { nullable: true })
     orcid: string;

     @Column('varchar', { nullable: true })
     researchGateId: string;

     @Column('varchar', { nullable: true })
     googleScholarId: string;

     @Column('int', { nullable: true })
     hIndex: number;

     @Column('int', { nullable: true })
     i10Index: number;

     @Column('int', { default: 0 })
     totalCitations: number;

     @Column('simple-array', { nullable: true })
     researchInterests: string[];

     @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
     createdAt: Date;
   }
   ```

2. [ ] Create AuthorsRepository
   ```typescript
   async findByName(name: string): Promise<Author[]>
   async findByORCID(orcid: string): Promise<Author>
   async findByInstitution(institution: string): Promise<Author[]>
   async findCollaborators(authorId: string): Promise<Author[]>
   async findByResearchArea(area: string): Promise<Author[]>
   async findTopAuthors(limit: number): Promise<Author[]>
   ```

3. [ ] Create AuthorsService
   - Implement deduplication logic
   - Collaboration network building
   - Author metrics calculation

4. [ ] Create AuthorsController
   - GET /authors/:id
   - GET /authors/search
   - GET /authors/:id/collaborators
   - GET /authors/:id/papers
   - GET /authors/:id/metrics
   - POST /authors (create)
   - PUT /authors/:id (update)

5. [ ] Create database migration

#### Deliverables
- Author entity with 10+ fields
- AuthorsRepository with 6+ methods
- AuthorsService with deduplication
- AuthorsController with 7+ endpoints
- Database migration

---

### TASK 1.4: Enhance Search Module

#### Subtasks
1. [ ] Implement basic search service
   ```typescript
   async search(query: string, filters?: SearchFilters): Promise<SearchResult[]>
   async autocomplete(query: string): Promise<string[]>
   async suggestCorrections(query: string): Promise<string[]>
   ```

2. [ ] Add search filters
   - By author
   - By journal
   - By date range
   - By keywords
   - By publication type
   - By citation count
   - By open access status

3. [ ] Implement BM25 ranking
   - Term frequency calculation
   - IDF calculation
   - Document length normalization

4. [ ] Create SearchController
   - GET /search (with query and filters)
   - GET /search/autocomplete
   - GET /search/suggestions
   - GET /search/trending
   - GET /search/history (user's search history)

5. [ ] Add search history tracking
   - Store user searches
   - Track popular searches
   - Trending searches endpoint

#### Deliverables
- Enhanced SearchService with 5+ methods
- SearchFilters interface
- BM25 ranking implementation
- SearchController with 5+ endpoints
- Search history tracking

---

### TASK 1.5: Build Analytics Module

#### Subtasks
1. [ ] Create analytics entities
   ```typescript
   // UserAction entity
   @Entity('user_actions')
   export class UserAction {
     id: string;
     userId: string;
     actionType: 'search' | 'view' | 'download' | 'save';
     paperId: string;
     timestamp: Date;
   }

   // Trending entity
   @Entity('trending_papers')
   export class TrendingPaper {
     id: string;
     paperId: string;
     score: number;
     timeframe: string;
     updatedAt: Date;
   }
   ```

2. [ ] Create AnalyticsRepository
   ```typescript
   async recordAction(action: UserAction): Promise<void>
   async getUserActions(userId: string): Promise<UserAction[]>
   async getTrendingPapers(timeframe: string): Promise<Paper[]>
   async getSearchTrends(): Promise<SearchTrend[]>
   async getUsageStats(): Promise<UsageStats>
   ```

3. [ ] Create AnalyticsService
   - Usage statistics calculation
   - Trending papers detection
   - Research trend analysis

4. [ ] Create AnalyticsController
   - GET /analytics/trending
   - GET /analytics/usage
   - GET /analytics/trends
   - GET /analytics/user/:userId
   - POST /analytics/action (record action)

5. [ ] Create database migrations

#### Deliverables
- UserAction and TrendingPaper entities
- AnalyticsRepository with 5+ methods
- AnalyticsService with calculations
- AnalyticsController with 5+ endpoints
- Database migrations

---

## Implementation Order

1. **Day 1-2**: Task 1.1 (Paper entity extension)
2. **Day 3-4**: Task 1.2 (Citations module)
3. **Day 5-6**: Task 1.3 (Authors module)
4. **Day 7-8**: Task 1.4 (Search enhancement)
5. **Day 9-10**: Task 1.5 (Analytics module)
6. **Day 11-14**: Testing, integration, and refinement

---

## Testing Checklist

- [ ] All entities have proper validation
- [ ] All repositories have error handling
- [ ] All services have business logic tests
- [ ] All controllers have endpoint tests
- [ ] Database migrations run successfully
- [ ] No TypeScript compilation errors
- [ ] All new endpoints documented in Swagger

---

## Success Criteria

✅ All 5 core modules fully implemented  
✅ 30+ new API endpoints  
✅ Full CRUD operations for all entities  
✅ Advanced search and filtering  
✅ Database properly normalized  
✅ All code follows NestJS best practices  
✅ 80%+ test coverage  

---

**Start Date**: November 1, 2025  
**Target Completion**: November 14, 2025
