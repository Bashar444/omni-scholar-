import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PaperResult } from './state/scholar-graph.models';
import { LibraryService } from '../../core/services/library.service';

@Component({
  selector: 'app-paper-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule
  ],
  template: `
    <div class="detail-container">
      <p-card *ngIf="paper" styleClass="paper-detail-card">
        <ng-template pTemplate="header">
          <div class="flex align-items-center gap-3">
            <p-button 
              icon="pi pi-arrow-left" 
              (onClick)="goBack()" 
              styleClass="p-button-text p-button-rounded"
              class="back-btn">
            </p-button>
            <h2 class="m-0">{{ paper.title }}</h2>
          </div>
        </ng-template>

        <div class="meta-section">
          <p><strong>Authors:</strong> {{ paper.authors.join(', ') || 'Unknown' }}</p>
          <p><strong>Year:</strong> {{ paper.year }}</p>
          <p><strong>Source:</strong> {{ paper.source }}</p>
          <p><strong>ID:</strong> {{ paper.id }}</p>
        </div>

        <div class="actions-section">
          <p-button 
            icon="pi pi-external-link" 
            label="Open in {{ paper.source }}"
            (onClick)="openExternal()"
            severity="primary">
          </p-button>
          <p-button 
            [icon]="isSaved() ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'" 
            [label]="isSaved() ? 'Unsave' : 'Save'"
            (onClick)="toggleSave()"
            severity="secondary">
          </p-button>
          <p-button 
            icon="pi pi-search" 
            label="Back to Search"
            [routerLink]="['/scholar-graph']"
            styleClass="p-button-outlined">
          </p-button>
        </div>
      </p-card>

      <p-card *ngIf="!paper" styleClass="paper-detail-card">
        <div class="text-center">
          <p class="mb-3">Paper not found or data unavailable.</p>
          <p-button 
            icon="pi pi-search" 
            label="Back to Search"
            [routerLink]="['/scholar-graph']"
            severity="primary">
          </p-button>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .detail-container { 
      padding: 1.25rem;
      max-width: 56.25rem;
      margin: 0 auto;
    }
    
    :host ::ng-deep {
      .paper-detail-card {
        background: var(--surface-card);
        border-radius: var(--border-radius);
        box-shadow: var(--card-shadow);
      }
    }

    .meta-section { 
      margin: 1.5rem 0;
    }
    
    .meta-section p { 
      margin: 0.5rem 0; 
    }
    
    .actions-section { 
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }
  `]
})
export class PaperDetailComponent implements OnInit {
  paper?: PaperResult;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private lib = inject(LibraryService);

  ngOnInit() {
    // Try to get paper from router state
    const nav = this.router.getCurrentNavigation();
    this.paper = nav?.extras?.state?.['paper'] as PaperResult | undefined;

    // Fallback: reconstruct minimal paper from route params (if needed)
    if (!this.paper) {
      const source = this.route.snapshot.paramMap.get('source');
      const id = this.route.snapshot.paramMap.get('id');
      if (source && id) {
        // Minimal fallback: we don't have full data without a refetch
        this.paper = {
          id,
          source: source as any,
          title: 'Details unavailable (navigate from search for full info)',
          authors: [],
          year: new Date().getFullYear()
        };
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  openExternal(): void {
    if (!this.paper) return;
    const link = this.linkFor(this.paper);
    window.open(link, '_blank', 'noopener');
  }

  isSaved(): boolean {
    return this.paper ? this.lib.isSaved(this.paper) : false;
  }

  toggleSave(): void {
    if (!this.paper) return;
    this.lib.toggle(this.paper);
  }

  private linkFor(r: PaperResult): string {
    switch (r.source) {
      case 'CrossRef': {
        const id = r.id || '';
        if (id.startsWith('http')) return id;
        return `https://doi.org/${encodeURIComponent(id)}`;
      }
      case 'arXiv': {
        const id = r.id || '';
        if (id.startsWith('http')) {
          try {
            const u = new URL(id);
            const path = u.pathname.includes('/abs/')
              ? u.pathname
              : u.pathname.replace('/pdf/', '/abs/');
            return `https://arxiv.org${path}`;
          } catch {
            // fall through
          }
        }
        return `https://arxiv.org/abs/${encodeURIComponent(id)}`;
      }
      case 'PubMed': {
        return `https://pubmed.ncbi.nlm.nih.gov/${encodeURIComponent(r.id)}/`;
      }
      default:
        return '#';
    }
  }
}
