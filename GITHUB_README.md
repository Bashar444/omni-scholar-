# 🎓 OmniScholar - Comprehensive Research Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-16+-red.svg)](https://angular.io/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Phase%201%20Complete-brightgreen.svg)]()

> **A unified AI-powered research platform with 66+ API endpoints, 12 integrated tools, and advanced literature analysis capabilities.**

---

## ✨ Features

### 🔬 Core Modules (Phase 1 - Complete ✅)

#### 📄 Papers Module
- Full-text search with BM25 ranking
- Advanced filtering (author, journal, date, keywords)
- External ID support (DOI, arXiv, PubMed, Scopus)
- Trending papers detection
- Bulk import/update operations
- **15+ Endpoints**

#### 🔗 Citations Module
- Citation network graph generation (BFS algorithm)
- Shortest path finding between papers
- Citation type classification
- Citation metrics and counting
- **12+ Endpoints**

#### 👥 Authors Module
- Author search and filtering
- Duplicate detection and merging
- External ID support (ORCID, ResearchGate, Google Scholar)
- Research area filtering
- H-index range filtering
- **18+ Endpoints**

#### 🔍 Search Module
- BM25 relevance ranking algorithm
- Autocomplete suggestions
- Boolean search (AND, OR, NOT)
- Did you mean suggestions
- **5+ Endpoints**

#### 📊 Analytics Module
- User action tracking
- Trending paper detection
- Usage statistics
- Research trend analysis
- **7+ Endpoints**

### 🤖 Bonus Features

#### 📚 Literature Review Agent
- NotebookLM-style AI integration
- Automatic section detection
- Citation extraction with context
- Theme analysis and extraction
- Research gap identification
- Multi-review comparison
- JSON/CSV export
- **6+ Endpoints**

### 📋 Planned Tools (Phases 2-12)

- **ScholarGraph** - Paper search with metadata visualization
- **Citation Network** - D3.js citation visualization
- **Library** - Collection management
- **PaperPilot** - Literature review assistance
- **OmniAI Copilot** - AI research assistant
- **LabSync** - Real-time collaboration
- **GrantAI** - Funding opportunities
- **MetaLab** - Reproducibility tracking
- **DataVerse** - Data visualization
- **EduForge** - Learning paths
- **TrustLayer** - Credibility verification
- **GlobalKnowledgeBridge** - Multi-language support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/omni-scholar.git
cd omni-scholar

# Install dependencies
npm install

# Backend setup
cd backend
npm install
cd ..

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start backend
cd backend
npm run start:dev

# Start frontend (in another terminal)
npm start
```

### Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/docs

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| **API Endpoints** | 66+ |
| **Repository Methods** | 68+ |
| **Database Entities** | 6 |
| **Database Indexes** | 23+ |
| **Lines of Code** | 6,000+ |
| **TypeScript Errors** | 0 |
| **Linting Issues** | 0 |
| **Phase 1 Completion** | 100% ✅ |

---

## 🏗️ Architecture

### Backend Stack
- **Framework**: NestJS 10
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Language**: TypeScript 5.3
- **Validation**: class-validator
- **API**: RESTful with 66+ endpoints

### Frontend Stack
- **Framework**: Angular 16
- **UI Library**: Angular Material
- **Styling**: SCSS
- **State Management**: Zustand
- **HTTP Client**: TanStack Query

### Database Schema
- **6 Entities**: Papers, Citations, Authors, UserActions, TrendingPapers, LiteratureReviews
- **23+ Indexes** for performance optimization
- **Proper normalization** and relationships

---

## 📚 API Endpoints

### Papers (15+ endpoints)
```
POST   /papers                          # Create paper
GET    /papers                          # List papers
GET    /papers/:id                      # Get paper
PUT    /papers/:id                      # Update paper
DELETE /papers/:id                      # Delete paper
GET    /papers/search/full-text         # Full-text search
GET    /papers/search/by-author         # Search by author
GET    /papers/trending/top-cited       # Top cited papers
GET    /papers/filter/open-access       # Open access papers
```

### Citations (12+ endpoints)
```
POST   /citations                       # Create citation
GET    /citations/:paperId/incoming     # Incoming citations
GET    /citations/:paperId/outgoing     # Outgoing citations
GET    /citations/:paperId/network      # Citation network
GET    /citations/:paperId/path/:targetId # Citation path
```

### Authors (18+ endpoints)
```
POST   /authors                         # Create author
GET    /authors/search                  # Search authors
GET    /authors/orcid/:orcid            # Find by ORCID
POST   /authors/merge-duplicates        # Merge duplicates
GET    /authors/trending/top            # Top authors
```

### Search (5+ endpoints)
```
GET    /search                          # Search papers
GET    /search/autocomplete             # Autocomplete
POST   /search/boolean                  # Boolean search
GET    /search/trending                 # Trending searches
```

### Analytics (7+ endpoints)
```
POST   /analytics/action                # Record action
GET    /analytics/trending/:timeframe   # Trending papers
GET    /analytics/usage-stats           # Usage statistics
GET    /analytics/research-trends       # Research trends
```

### Literature Review Agent (6+ endpoints)
```
POST   /literature-review-agent/analyze # Analyze PDF
GET    /literature-review-agent/user/:userId # Get reviews
POST   /literature-review-agent/compare # Compare reviews
GET    /literature-review-agent/:id/export/json # Export JSON
```

---

## 🧠 Key Algorithms

### BM25 Search Algorithm
- Term frequency calculation
- Inverse document frequency (IDF)
- Document length normalization
- Field boosting (title 3x, keywords 2x)

### Citation Network Analysis
- Graph generation using BFS
- Shortest path finding
- Citation type classification
- Network statistics

### Author Deduplication
- Name-based fuzzy matching
- Email-based matching
- ORCID verification
- Duplicate merging

### Literature Review Analysis
- Automatic section detection
- Citation extraction with context
- Theme analysis
- Gap identification
- Relevance scoring

---

## 🔐 Security Features

- ✅ Input validation on all endpoints
- ✅ TypeScript strict mode
- ✅ Prepared statements (TypeORM)
- ✅ Error handling with safe messages
- ✅ User data isolation
- ✅ GDPR compliance ready

### Authentication (Phase 2)
- JWT token generation & refresh
- OAuth2 (Google, GitHub)
- SAML 2.0
- Role-Based Access Control (RBAC)

---

## 📦 Deployment

### Docker
```bash
docker-compose up -d
```

### Vercel (Frontend)
```bash
vercel deploy
```

### Heroku (Backend)
```bash
heroku create omni-scholar-backend
git push heroku main
```

### AWS
```bash
aws s3 cp dist/ s3://omni-scholar/ --recursive
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
npm run test

# E2E tests
npm run e2e
```

---

## 📖 Documentation

- [Setup Guide](./GITHUB_SETUP_GUIDE.md)
- [Phase 1 Complete Report](./PHASE_1_COMPLETE.md)
- [Literature Review Agent Guide](./LITERATURE_REVIEW_AGENT_GUIDE.md)
- [Integration Guide](./LITERATURE_REVIEW_INTEGRATION_GUIDE.md)
- [Project Status](./OMNISCHOLAR_COMPLETE_STATUS.md)
- [API Documentation](http://localhost:3000/api/docs)

---

## 🗺️ Roadmap

### Phase 1 ✅ (Complete)
- Core Backend Modules
- Literature Review Agent
- 66+ API Endpoints

### Phase 2 (Next - 1 week)
- Authentication & Authorization
- JWT + OAuth2 + SAML
- RBAC System

### Phase 3-12
- Elasticsearch Integration
- External APIs (CrossRef, arXiv, Scopus, PubMed)
- Citation Metrics & Algorithms
- Recommendation Engine
- Advanced Analytics
- Frontend Tool Enhancement
- Caching & Performance
- Monitoring & Observability
- CI/CD & Deployment
- Testing & QA

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Write tests for new features
- Update documentation
- Use conventional commits

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Bashar** - Lead Developer & Architect

---

## 🙏 Acknowledgments

Built with:
- [NestJS](https://nestjs.com/)
- [Angular](https://angular.io/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Material Design](https://material.angular.io/)

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/omni-scholar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/omni-scholar/discussions)
- **Email**: support@omnischolar.dev

---

## 🎯 Project Status

```
Phase 1: Core Backend Modules ✅ 100% COMPLETE
├── Papers Module ✅
├── Citations Module ✅
├── Authors Module ✅
├── Search Module ✅
└── Analytics Module ✅

Bonus: Literature Review Agent ✅ 100% COMPLETE

Overall: 8.3% (1 of 12 phases)
```

---

<div align="center">

**Made with ❤️ by the OmniScholar Team**

[⭐ Star us on GitHub](https://github.com/yourusername/omni-scholar) | [📧 Contact Us](mailto:support@omnischolar.dev)

</div>

