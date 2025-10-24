import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PaperResult } from '../../modules/scholar-graph/state/scholar-graph.models';

export interface SavedPaperWithMetadata extends PaperResult {
  tags?: string[];
  folder?: string;
  notes?: string;
  savedAt?: Date;
}

interface SavedEntry extends SavedPaperWithMetadata {}

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly key = 'sg.library.v2'; // Updated version for migration
  private cache = new Map<string, SavedEntry>();

  constructor() {
    this.load();
  }

  private load() {
    if (!this.isBrowser) return;
    try {
      // Try loading v2 first
      let raw = window.localStorage.getItem(this.key);
      let needsMigration = false;
      
      // If v2 doesn't exist, try migrating from v1
      if (!raw) {
        raw = window.localStorage.getItem('sg.library.v1');
        needsMigration = true;
      }
      
      if (raw) {
        const arr: SavedEntry[] = JSON.parse(raw);
        // Convert date strings back to Date objects and add default metadata
        const entries = arr.map(e => ({
          ...e,
          savedAt: e.savedAt ? new Date(e.savedAt) : new Date(),
          tags: e.tags || [],
          notes: e.notes || '',
          folder: e.folder || undefined
        }));
        this.cache = new Map(entries.map(e => [this.mkKey(e), e]));
        
        // If we migrated, save to v2 and clear v1
        if (needsMigration) {
          this.persist();
          window.localStorage.removeItem('sg.library.v1');
        }
      }
    } catch { /* ignore */ }
  }

  private persist() {
    if (!this.isBrowser) return;
    try {
      const arr = Array.from(this.cache.values());
      window.localStorage.setItem(this.key, JSON.stringify(arr));
    } catch { /* ignore */ }
  }

  private mkKey(p: Pick<PaperResult, 'id' | 'source'>): string {
    return `${p.source}:${p.id}`;
  }

  isSaved(p: Pick<PaperResult, 'id' | 'source'>): boolean {
    return this.cache.has(this.mkKey(p));
  }

  toggle(p: PaperResult): boolean {
    const k = this.mkKey(p);
    if (this.cache.has(k)) {
      this.cache.delete(k);
      this.persist();
      return false;
    }
    // Add metadata when saving
    const entry: SavedEntry = {
      ...p,
      savedAt: new Date(),
      tags: [],
      notes: '',
      folder: undefined
    };
    this.cache.set(k, entry);
    this.persist();
    return true;
  }

  updateMetadata(
    p: Pick<PaperResult, 'id' | 'source'>,
    metadata: { tags?: string[]; folder?: string; notes?: string }
  ): void {
    const k = this.mkKey(p);
    const existing = this.cache.get(k);
    if (!existing) return;
    
    const updated: SavedEntry = {
      ...existing,
      tags: metadata.tags !== undefined ? metadata.tags : existing.tags,
      folder: metadata.folder !== undefined ? metadata.folder : existing.folder,
      notes: metadata.notes !== undefined ? metadata.notes : existing.notes
    };
    
    this.cache.set(k, updated);
    this.persist();
  }

  list(): SavedPaperWithMetadata[] {
    return Array.from(this.cache.values());
  }
}
