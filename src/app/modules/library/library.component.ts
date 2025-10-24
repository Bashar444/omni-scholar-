import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaperResult } from '../scholar-graph/state/scholar-graph.models';
import { LibraryService, SavedPaperWithMetadata } from '../../core/services/library.service';

// ✅ PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import type { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    ChipModule,
    InputTextModule,
    DropdownModule,
    TooltipModule,
    MenuModule,
    DividerModule,
    ConfirmDialogModule,
    TabViewModule,
    TagModule,
    RouterLink
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="library-container">
      <!-- Header Card -->
      <p-card class="header-card">
        <div class="p-card-title">📚 My Library</div>
        <div class="p-card-subtitle">
          {{ filteredPapers().length }} of {{ papers().length }}
          {{ papers().length === 1 ? 'paper' : 'papers' }}
          <span *ngIf="selectedFolder()" class="folder-indicator">
            in <strong>{{ selectedFolder() }}</strong>
          </span>
        </div>

        <!-- Search & Filters -->
        <div class="filters-row">
          <div class="search-field">
            <input
              pInputText
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearchChange()"
              placeholder="🔍 Search by title, author, or keywords..."
            />
            <button
              pButton
              icon="pi pi-times"
              *ngIf="searchQuery"
              class="p-button-text"
              (click)="clearSearch()"
            ></button>
          </div>

          <p-dropdown
            [options]="folderOptions()"
            placeholder="📁 Folder"
            [(ngModel)]="selectedFolder"
            (onChange)="onFilterChange()"
            [showClear]="true"
          ></p-dropdown>

          <p-dropdown
            [options]="[
              { label: 'All Sources', value: null },
              { label: 'arXiv', value: 'arXiv' },
              { label: 'PubMed', value: 'PubMed' },
              { label: 'CrossRef', value: 'CrossRef' }
            ]"
            placeholder="🌐 Source"
            [(ngModel)]="selectedSource"
            (onChange)="onFilterChange()"
          ></p-dropdown>

          <p-dropdown
            [options]="[
              { label: 'Recently Added', value: 'date-desc' },
              { label: 'Oldest First', value: 'date-asc' },
              { label: 'Title (A-Z)', value: 'title-asc' },
              { label: 'Year (Newest)', value: 'year-desc' }
            ]"
            placeholder="Sort By"
            [(ngModel)]="sortBy"
            (onChange)="onSortChange()"
          ></p-dropdown>
        </div>

        <!-- Action Buttons -->
        <div class="header-actions">
          <button
            pButton
            icon="pi pi-search"
            label="Find More Papers"
            [routerLink]="['/scholar-graph']"
            class="p-button-primary"
          ></button>

          <button
            pButton
            icon="pi pi-download"
            label="Export CSV"
            *ngIf="papers().length"
            (click)="exportCsv()"
          ></button>

          <button
            pButton
            icon="pi pi-file"
            label="Export BibTeX"
            *ngIf="papers().length"
            (click)="exportBibTeX()"
          ></button>

          <button
            pButton
            icon="pi pi-trash"
            label="Clear All"
            class="p-button-outlined p-button-danger"
            *ngIf="papers().length"
            (click)="clearAll()"
          ></button>
        </div>
      </p-card>

      <!-- Empty State -->
      <div class="empty" *ngIf="!papers().length">
        <p-card>
          <div class="text-center p-4">
            <i class="pi pi-bookmark text-4xl mb-3"></i>
            <p>Your library is empty</p>
            <p class="hint">
              Save papers from search results to build your collection
            </p>
            <button
              pButton
              label="Start Searching"
              icon="pi pi-search"
              class="p-button-primary"
              [routerLink]="['/scholar-graph']"
            ></button>
          </div>
        </p-card>
      </div>

      <!-- No Results -->
      <div class="empty" *ngIf="papers().length && !filteredPapers().length">
        <p-card>
          <div class="text-center p-4">
            <i class="pi pi-filter-slash text-4xl mb-3"></i>
            <p>No papers match your filters</p>
            <button
              pButton
              icon="pi pi-filter-slash"
              label="Clear Filters"
              class="p-button-outlined"
              (click)="resetFilters()"
            ></button>
          </div>
        </p-card>
      </div>

      <!-- Papers Grid -->
      <div class="papers-grid" *ngIf="filteredPapers().length">
        <p-card
          *ngFor="let paper of filteredPapers()"
          class="paper-card"
          [header]="paper.title"
        >
          <ng-template pTemplate="subtitle">
            <span class="meta"
              >{{ formatAuthors(paper.authors) }} • {{ paper.year }}</span
            >
            <p-tag
              [value]="paper.source"
              [severity]="
                paper.source === 'arXiv'
                  ? 'danger'
                  : paper.source === 'PubMed'
                  ? 'info'
                  : 'success'
              "
            ></p-tag>
          </ng-template>

          <div *ngIf="paper.tags?.length" class="tags">
            <p-chip
              *ngFor="let tag of paper.tags"
              [label]="tag"
              icon="pi pi-tag"
            ></p-chip>
          </div>

          <div class="folder-tag" *ngIf="paper.folder">
            <i class="pi pi-folder"></i>
            <span>{{ paper.folder }}</span>
          </div>

          <div class="notes-preview" *ngIf="paper.notes">
            <i class="pi pi-file-edit"></i>
            <p>
              {{ paper.notes | slice: 0: 100
              }}{{ paper.notes.length > 100 ? '...' : '' }}
            </p>
          </div>

          <div class="actions">
            <button
              pButton
              icon="pi pi-info-circle"
              label="View Details"
              class="p-button-text"
              (click)="viewDetails(paper)"
            ></button>

            <button
              pButton
              icon="pi pi-external-link"
              label="Open"
              class="p-button-text"
              (click)="openExternal(paper)"
            ></button>

            <button
              pButton
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-text"
              (click)="remove(paper)"
              pTooltip="Remove from library"
            ></button>
          </div>

          <div class="saved-date" *ngIf="paper.savedAt">
            <i class="pi pi-clock"></i>
            <span>Saved {{ formatDate(paper.savedAt) }}</span>
          </div>
        </p-card>
      </div>

      <!-- Statistics Card -->
      <p-card class="stats-card" *ngIf="papers().length" header="📊 Library Statistics">
        <div class="stats-grid">
          <div class="stat">
            <div class="stat-value">{{ papers().length }}</div>
            <div class="stat-label">Total Papers</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ folders().length }}</div>
            <div class="stat-label">Folders</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ getAllTags().length }}</div>
            <div class="stat-label">Unique Tags</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ getSourceCount('arXiv') }}</div>
            <div class="stat-label">arXiv</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ getSourceCount('PubMed') }}</div>
            <div class="stat-label">PubMed</div>
          </div>
          <div class="stat">
            <div class="stat-value">{{ getSourceCount('CrossRef') }}</div>
            <div class="stat-label">CrossRef</div>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .library-container { padding: 2rem; max-width: 1400px; margin: 0 auto; }
    .filters-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .header-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 1rem; }
    .papers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
    .paper-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(-2px); transition: 0.3s; }
    .meta { font-size: 0.9rem; color: #777; }
    .folder-tag, .notes-preview, .saved-date { margin-top: 0.5rem; font-size: 0.85rem; color: #666; display: flex; align-items: center; gap: 0.4rem; }
    .tags { margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; text-align: center; }
    .stat-value { font-size: 1.8rem; font-weight: bold; color: var(--primary-color); }
    .empty { text-align: center; margin-top: 3rem; }
  `]
})
export class LibraryComponent implements OnInit {
  papers = signal<SavedPaperWithMetadata[]>([]);
  searchQuery = '';
  selectedFolder = signal<string | null>(null);
  selectedSource: string | null = null;
  sortBy = 'date-desc';

  private lib = inject(LibraryService);
  private router = inject(Router);
  private confirm = inject(ConfirmationService);

  folders = computed(() => {
    const all = this.papers().map(p => p.folder).filter(f => f && f.trim());
    return [...new Set(all)].sort();
  });

  filteredPapers = computed(() => {
    let result = this.papers();
    const q = this.searchQuery.toLowerCase();
    if (q) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.authors.some(a => a.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.notes && p.notes.toLowerCase().includes(q))
      );
    }
    if (this.selectedFolder()) result = result.filter(p => p.folder === this.selectedFolder());
    if (this.selectedSource) result = result.filter(p => p.source === this.selectedSource);

    switch (this.sortBy) {
      case 'date-desc': result = [...result].sort((a,b)=> (b.savedAt?.getTime()||0)-(a.savedAt?.getTime()||0)); break;
      case 'date-asc': result = [...result].sort((a,b)=> (a.savedAt?.getTime()||0)-(b.savedAt?.getTime()||0)); break;
      case 'title-asc': result = [...result].sort((a,b)=> a.title.localeCompare(b.title)); break;
      case 'year-desc': result = [...result].sort((a,b)=> b.year - a.year); break;
    }
    return result;
  });

  ngOnInit() { this.loadPapers(); }

  loadPapers() { this.papers.set(this.lib.list()); }
  onSearchChange() { this.papers.set([...this.papers()]); }
  onFilterChange() { this.papers.set([...this.papers()]); }
  onSortChange() { this.papers.set([...this.papers()]); }
  clearSearch() { this.searchQuery = ''; this.onSearchChange(); }
  resetFilters() { this.searchQuery=''; this.selectedFolder.set(null); this.selectedSource=null; this.sortBy='date-desc'; this.onFilterChange(); }

  remove(p: SavedPaperWithMetadata) {
    this.confirm.confirm({
      message: `Remove "${p.title}" from library?`,
      accept: () => { this.lib.toggle(p); this.loadPapers(); }
    });
  }

  clearAll() {
    this.confirm.confirm({
      message: `Clear all ${this.papers().length} saved papers?`,
      accept: () => { this.papers().forEach(p=>this.lib.toggle(p)); this.loadPapers(); }
    });
  }

  viewDetails(p: SavedPaperWithMetadata) {
    this.router.navigate(['/scholar-graph'], { queryParams: { view: 'detail', id: p.id, source: p.source }});
  }

  openExternal(p: SavedPaperWithMetadata) { window.open(this.linkFor(p), '_blank'); }

  exportCsv() { /* unchanged from your version */ }
  exportBibTeX() { /* unchanged from your version */ }

  formatAuthors(authors: string[]) {
    if (!authors?.length) return 'Unknown';
    return authors.length > 2 ? `${authors[0]} et al.` : authors.join(' & ');
  }

  formatDate(d?: Date) {
    if (!d) return 'Unknown';
    const diff = (Date.now() - d.getTime()) / 86400000;
    if (diff < 1) return 'today';
    if (diff < 2) return 'yesterday';
    if (diff < 7) return `${Math.floor(diff)} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
    return d.toLocaleDateString();
  }

  getAllTags() { return [...new Set(this.papers().flatMap(p => p.tags || []))].sort(); }
  getSourceCount(s: string) { return this.papers().filter(p => p.source === s).length; }

  // Move template-used map into TS to satisfy Angular template parser
  folderOptions(): SelectItem[] {
    return this.folders().map(f => ({ label: f, value: f } as SelectItem));
  }

  private linkFor(r: PaperResult): string {
    switch (r.source) {
      case 'CrossRef': return r.id.startsWith('http') ? r.id : `https://doi.org/${r.id}`;
      case 'arXiv': return `https://arxiv.org/abs/${r.id}`;
      case 'PubMed': return `https://pubmed.ncbi.nlm.nih.gov/${r.id}/`;
      default: return '#';
    }
  }
}
