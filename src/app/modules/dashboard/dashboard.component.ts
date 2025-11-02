import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  status: 'active' | 'pending' | 'beta';
  endpoints: number;
  features: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressBarModule,
    MatBadgeModule,
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>🎓 OmniScholar - Unified Research Platform</h1>
        <p class="subtitle">Phase 1 Complete: 66+ Endpoints | 68+ Methods | 6 Entities</p>
      </div>

      <!-- Stats Overview -->
      <div class="stats-overview">
        <div class="stat-card">
          <div class="stat-number">66+</div>
          <div class="stat-label">API Endpoints</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">68+</div>
          <div class="stat-label">Repository Methods</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">6</div>
          <div class="stat-label">Database Entities</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">100%</div>
          <div class="stat-label">Phase 1 Complete</div>
        </div>
      </div>

      <!-- Tools Grid -->
      <div class="tools-section">
        <h2>Core Modules (Phase 1)</h2>
        <div class="tools-grid">
          <mat-card *ngFor="let tool of coreTools" class="tool-card" [ngClass]="tool.status">
            <mat-card-header>
              <div class="tool-icon">{{ tool.icon }}</div>
              <mat-card-title>{{ tool.name }}</mat-card-title>
              <mat-card-subtitle>
                <span class="status-badge" [ngClass]="tool.status">{{ tool.status }}</span>
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="description">{{ tool.description }}</p>
              <div class="endpoints-info">
                <span class="badge">{{ tool.endpoints }}+ Endpoints</span>
              </div>
              <div class="features">
                <strong>Features:</strong>
                <ul>
                  <li *ngFor="let feature of tool.features">{{ feature }}</li>
                </ul>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary" [routerLink]="tool.route">
                <mat-icon>arrow_forward</mat-icon>
                Explore
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- Bonus Tools Section -->
      <div class="tools-section">
        <h2>Bonus Features</h2>
        <div class="tools-grid">
          <mat-card *ngFor="let tool of bonusTools" class="tool-card" [ngClass]="tool.status">
            <mat-card-header>
              <div class="tool-icon">{{ tool.icon }}</div>
              <mat-card-title>{{ tool.name }}</mat-card-title>
              <mat-card-subtitle>
                <span class="status-badge" [ngClass]="tool.status">{{ tool.status }}</span>
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="description">{{ tool.description }}</p>
              <div class="endpoints-info">
                <span class="badge">{{ tool.endpoints }}+ Endpoints</span>
              </div>
              <div class="features">
                <strong>Features:</strong>
                <ul>
                  <li *ngFor="let feature of tool.features">{{ feature }}</li>
                </ul>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent" [routerLink]="tool.route">
                <mat-icon>arrow_forward</mat-icon>
                Explore
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- Planned Tools Section -->
      <div class="tools-section">
        <h2>Planned Tools (Phases 2-12)</h2>
        <div class="tools-grid">
          <mat-card *ngFor="let tool of plannedTools" class="tool-card" [ngClass]="tool.status">
            <mat-card-header>
              <div class="tool-icon">{{ tool.icon }}</div>
              <mat-card-title>{{ tool.name }}</mat-card-title>
              <mat-card-subtitle>
                <span class="status-badge" [ngClass]="tool.status">{{ tool.status }}</span>
              </mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p class="description">{{ tool.description }}</p>
              <div class="endpoints-info">
                <span class="badge">Coming Soon</span>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button disabled>
                <mat-icon>schedule</mat-icon>
                Coming Soon
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="quick-links-section">
        <h2>Quick Links & Documentation</h2>
        <div class="links-grid">
          <a href="/api/docs" class="link-card">
            <mat-icon>description</mat-icon>
            <span>API Documentation</span>
          </a>
          <a href="/docs/phase-1-complete.md" class="link-card">
            <mat-icon>check_circle</mat-icon>
            <span>Phase 1 Complete Report</span>
          </a>
          <a href="/docs/literature-review-agent-guide.md" class="link-card">
            <mat-icon>library_books</mat-icon>
            <span>Literature Review Guide</span>
          </a>
          <a href="/docs/omnischolar-complete-status.md" class="link-card">
            <mat-icon>dashboard</mat-icon>
            <span>Project Status</span>
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="dashboard-footer">
        <p>OmniScholar v1.0 | Phase 1 Complete | Ready for Phase 2</p>
        <p>Backend: NestJS | Frontend: Angular 16 | Database: PostgreSQL</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background: #ffffff;
      min-height: 100%;
      width: 100%;
    }

    .dashboard-header {
      text-align: center;
      color: #333;
      margin-bottom: 3rem;
      animation: slideDown 0.6s ease-out;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      border-radius: 12px;
      color: white;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      margin: 0;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .subtitle {
      font-size: 1.1rem;
      margin-top: 0.5rem;
      opacity: 0.95;
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.95rem;
      color: #666;
      font-weight: 500;
    }

    .tools-section {
      margin-bottom: 3rem;
    }

    .tools-section h2 {
      color: #333;
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      text-shadow: none;
    }

    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .tool-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .tool-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.2);
    }

    .tool-card.pending {
      opacity: 0.7;
    }

    .tool-card.beta {
      border-left: 4px solid #ff9800;
    }

    .tool-card.active {
      border-left: 4px solid #4caf50;
    }

    mat-card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .tool-icon {
      font-size: 2.5rem;
      min-width: 60px;
      text-align: center;
    }

    mat-card-title {
      margin: 0;
      font-size: 1.3rem;
    }

    mat-card-subtitle {
      margin-top: 0.5rem;
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      background: rgba(255,255,255,0.2);
      color: white;
    }

    .status-badge.active {
      background: #4caf50;
    }

    .status-badge.beta {
      background: #ff9800;
    }

    .status-badge.pending {
      background: #2196f3;
    }

    .description {
      color: #666;
      margin: 1rem 0;
      line-height: 1.5;
    }

    .endpoints-info {
      margin: 1rem 0;
    }

    .badge {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .features {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .features strong {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .features li {
      padding: 0.3rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .features li:before {
      content: "✓ ";
      color: #4caf50;
      font-weight: bold;
      margin-right: 0.5rem;
    }

    mat-card-actions {
      padding: 1rem;
      display: flex;
      gap: 0.5rem;
    }

    button {
      flex: 1;
    }

    .quick-links-section {
      margin-bottom: 3rem;
    }

    .quick-links-section h2 {
      color: #333;
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      text-shadow: none;
    }

    .links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .link-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 12px;
      text-decoration: none;
      color: #333;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .link-card:hover {
      transform: translateX(5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      color: #667eea;
    }

    .link-card mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: #667eea;
    }

    .dashboard-footer {
      text-align: center;
      color: #666;
      padding: 2rem;
      border-top: 1px solid rgba(255,255,255,0.2);
      margin-top: 3rem;
    }

    .dashboard-footer p {
      margin: 0.5rem 0;
      opacity: 0.9;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .dashboard-header h1 {
        font-size: 1.8rem;
      }

      .tools-grid {
        grid-template-columns: 1fr;
      }

      .stats-overview {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  coreTools: Tool[] = [
    {
      id: 'papers',
      name: 'Papers Module',
      description: 'Manage research papers with rich metadata, full-text search, and advanced filtering',
      icon: '📄',
      color: '#667eea',
      route: '/papers',
      status: 'active',
      endpoints: 15,
      features: [
        'Full-text search (title, abstract, keywords)',
        'Advanced filtering (author, journal, date)',
        'External ID support (DOI, arXiv, PubMed, Scopus)',
        'Trending papers detection',
        'Bulk import/update operations'
      ]
    },
    {
      id: 'citations',
      name: 'Citations Module',
      description: 'Track and analyze citation relationships with network graphs and path finding',
      icon: '🔗',
      color: '#764ba2',
      route: '/citations',
      status: 'active',
      endpoints: 12,
      features: [
        'Citation network graph (BFS algorithm)',
        'Shortest path finding between papers',
        'Citation type classification',
        'Citation metrics and counting',
        'Bulk citation import'
      ]
    },
    {
      id: 'authors',
      name: 'Authors Module',
      description: 'Manage author profiles with deduplication, metrics, and collaboration tracking',
      icon: '👥',
      color: '#f093fb',
      route: '/authors',
      status: 'active',
      endpoints: 18,
      features: [
        'Author search and filtering',
        'Duplicate detection and merging',
        'External ID support (ORCID, ResearchGate, Google Scholar)',
        'Research area filtering',
        'H-index range filtering'
      ]
    },
    {
      id: 'search',
      name: 'Search Module',
      description: 'Advanced search with BM25 ranking, autocomplete, and boolean operators',
      icon: '🔍',
      color: '#4facfe',
      route: '/search',
      status: 'active',
      endpoints: 5,
      features: [
        'BM25 relevance ranking algorithm',
        'Autocomplete suggestions',
        'Boolean search (AND, OR, NOT)',
        'Did you mean suggestions',
        'Trending searches'
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Module',
      description: 'Track usage, detect trends, and analyze research patterns',
      icon: '📊',
      color: '#43e97b',
      route: '/analytics',
      status: 'active',
      endpoints: 7,
      features: [
        'User action tracking',
        'Trending paper detection by timeframe',
        'Usage statistics',
        'Research trend analysis',
        'Search query analytics'
      ]
    }
  ];

  bonusTools: Tool[] = [
    {
      id: 'literature-review-agent',
      name: 'Literature Review Agent',
      description: 'NotebookLM-style AI tool for analyzing and synthesizing literature reviews',
      icon: '🤖',
      color: '#fa709a',
      route: '/literature-review-agent',
      status: 'active',
      endpoints: 6,
      features: [
        'Automatic section detection',
        'Citation extraction with context',
        'Theme analysis and extraction',
        'Research gap identification',
        'Multi-review comparison'
      ]
    }
  ];

  plannedTools: Tool[] = [
    {
      id: 'scholar-graph',
      name: 'ScholarGraph',
      description: 'Paper search with metadata visualization',
      icon: '📈',
      color: '#667eea',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Paper search', 'Metadata display', 'Graph visualization']
    },
    {
      id: 'citation-network',
      name: 'Citation Network',
      description: 'D3.js visualization of citation relationships',
      icon: '🕸️',
      color: '#764ba2',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Citation graphs', 'Author networks', 'Temporal evolution']
    },
    {
      id: 'library',
      name: 'Library',
      description: 'Collection management and organization',
      icon: '📚',
      color: '#f093fb',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Collections', 'Tagging', 'Sharing']
    },
    {
      id: 'paper-pilot',
      name: 'PaperPilot',
      description: 'Literature review assistance and guidance',
      icon: '✈️',
      color: '#4facfe',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Review guidance', 'Gap suggestions', 'Author recommendations']
    },
    {
      id: 'omni-ai-copilot',
      name: 'OmniAI Copilot',
      description: 'AI research assistant with advanced insights',
      icon: '🤖',
      color: '#43e97b',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['AI summarization', 'Insights', 'Recommendations']
    },
    {
      id: 'lab-sync',
      name: 'LabSync',
      description: 'Real-time collaboration for research teams',
      icon: '👫',
      color: '#fa709a',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Real-time sync', 'Annotations', 'Comments']
    },
    {
      id: 'grant-ai',
      name: 'GrantAI',
      description: 'Funding opportunities and grant matching',
      icon: '💰',
      color: '#feca57',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Grant matching', 'Writing assistance', 'Deadline tracking']
    },
    {
      id: 'meta-lab',
      name: 'MetaLab',
      description: 'Reproducibility tracking and methodology documentation',
      icon: '🔬',
      color: '#48dbfb',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Methodology tracking', 'Reproducibility', 'Limitations']
    },
    {
      id: 'data-verse',
      name: 'DataVerse',
      description: 'Data visualization and analysis',
      icon: '📊',
      color: '#1dd1a1',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Data viz', 'Charts', 'Dashboards']
    },
    {
      id: 'edu-forge',
      name: 'EduForge',
      description: 'Learning paths and educational content',
      icon: '🎓',
      color: '#5f27cd',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Learning paths', 'Modules', 'Assessments']
    },
    {
      id: 'trust-layer',
      name: 'TrustLayer',
      description: 'Credibility verification and authenticity checking',
      icon: '✅',
      color: '#00d2d3',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Author verification', 'Citation check', 'Journal ranking']
    },
    {
      id: 'global-knowledge-bridge',
      name: 'GlobalKnowledgeBridge',
      description: 'Multi-language support and cross-cultural research',
      icon: '🌍',
      color: '#ff6348',
      route: '#',
      status: 'pending',
      endpoints: 0,
      features: ['Translation', 'Multi-language search', 'Cultural context']
    }
  ];

  ngOnInit(): void {
    console.log('Dashboard initialized with all tools');
  }
}
