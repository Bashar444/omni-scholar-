import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UploadedPaper, ExtractedMetadata, ComparisonView } from '../models/paper-comparison.model';

@Injectable({ providedIn: 'root' })
export class PaperService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly papersKey = 'pp.papers.v1';
  private readonly comparisonsKey = 'pp.comparisons.v1';
  
  private papersCache = new Map<string, UploadedPaper>();
  private comparisonsCache = new Map<string, ComparisonView>();

  constructor() {
    this.loadFromStorage();
  }

  // ============ Paper Management ============

  async uploadPaper(file: File, userId: string): Promise<UploadedPaper> {
    // Create paper entry
    const paper: UploadedPaper = {
      id: this.generateId(),
      userId,
      fileName: file.name,
      fileUrl: '', // Will be set after processing
      fileSize: file.size,
      uploadedAt: new Date(),
      processingStatus: 'pending'
    };

    // Store file in browser storage (for demo - in production use Supabase)
    try {
      const fileData = await this.readFileAsDataUrl(file);
      paper.fileUrl = fileData;
      paper.processingStatus = 'processing';
      
      this.papersCache.set(paper.id, paper);
      this.persist();

      // Simulate async processing
      this.processPaper(paper);
    } catch (error) {
      paper.processingStatus = 'error';
      paper.errorMessage = 'Failed to upload file';
      this.papersCache.set(paper.id, paper);
      this.persist();
    }

    return paper;
  }

  private async processPaper(paper: UploadedPaper): Promise<void> {
    // Simulate PDF text extraction (in production, use PDF.js or backend service)
    setTimeout(() => {
      const extractedData = this.simulateExtraction(paper.fileName);
      paper.extractedData = extractedData;
      paper.processingStatus = 'completed';
      this.papersCache.set(paper.id, paper);
      this.persist();
    }, 2000);
  }

  private simulateExtraction(fileName: string): ExtractedMetadata {
    // Simulate extracted metadata (in production, use AI/ML extraction)
    return {
      title: fileName.replace('.pdf', ''),
      authors: ['Author A', 'Author B'],
      year: new Date().getFullYear(),
      abstract: 'This paper presents a novel approach to...',
      methodology: 'We conducted a systematic review of...',
      results: 'Our findings indicate that...',
      conclusions: 'In conclusion, this study demonstrates...',
      keyFindings: [
        'Finding 1: Significant improvement observed',
        'Finding 2: Novel methodology validated',
        'Finding 3: Future research directions identified'
      ],
      citations: [
        { title: 'Related Work 1', authors: ['Smith et al.'], year: 2020 },
        { title: 'Related Work 2', authors: ['Jones et al.'], year: 2021 }
      ],
      citationCount: 15,
      keywords: ['machine learning', 'research', 'methodology'],
      fullText: 'Full extracted text would be here...'
    };
  }

  getPaper(id: string): UploadedPaper | undefined {
    return this.papersCache.get(id);
  }

  getAllPapers(userId?: string): UploadedPaper[] {
    const papers = Array.from(this.papersCache.values());
    return userId ? papers.filter(p => p.userId === userId) : papers;
  }

  deletePaper(id: string): void {
    this.papersCache.delete(id);
    // Also remove from any comparisons
    this.comparisonsCache.forEach(comp => {
      if (comp.paperIds.includes(id)) {
        comp.paperIds = comp.paperIds.filter(pid => pid !== id);
        comp.papers = comp.papers.filter(p => p.id !== id);
        comp.updatedAt = new Date();
      }
    });
    this.persist();
  }

  // ============ Comparison Management ============

  createComparison(name: string, paperIds: string[], userId: string): ComparisonView {
    const papers = paperIds
      .map(id => this.papersCache.get(id))
      .filter((p): p is UploadedPaper => p !== undefined);

    const comparison: ComparisonView = {
      id: this.generateId(),
      userId,
      name,
      paperIds,
      papers,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.comparisonsCache.set(comparison.id, comparison);
    this.persist();
    return comparison;
  }

  getComparison(id: string): ComparisonView | undefined {
    return this.comparisonsCache.get(id);
  }

  getAllComparisons(userId?: string): ComparisonView[] {
    const comparisons = Array.from(this.comparisonsCache.values());
    return userId ? comparisons.filter(c => c.userId === userId) : comparisons;
  }

  updateComparison(id: string, updates: Partial<ComparisonView>): void {
    const comparison = this.comparisonsCache.get(id);
    if (!comparison) return;

    Object.assign(comparison, updates, { updatedAt: new Date() });
    
    // Refresh papers if paperIds changed
    if (updates.paperIds) {
      comparison.papers = updates.paperIds
        .map(pid => this.papersCache.get(pid))
        .filter((p): p is UploadedPaper => p !== undefined);
    }

    this.comparisonsCache.set(id, comparison);
    this.persist();
  }

  deleteComparison(id: string): void {
    this.comparisonsCache.delete(id);
    this.persist();
  }

  addPaperToComparison(comparisonId: string, paperId: string): void {
    const comparison = this.comparisonsCache.get(comparisonId);
    if (!comparison) return;

    if (!comparison.paperIds.includes(paperId) && comparison.paperIds.length < 4) {
      comparison.paperIds.push(paperId);
      const paper = this.papersCache.get(paperId);
      if (paper) {
        comparison.papers.push(paper);
      }
      comparison.updatedAt = new Date();
      this.comparisonsCache.set(comparisonId, comparison);
      this.persist();
    }
  }

  removePaperFromComparison(comparisonId: string, paperId: string): void {
    const comparison = this.comparisonsCache.get(comparisonId);
    if (!comparison) return;

    comparison.paperIds = comparison.paperIds.filter(id => id !== paperId);
    comparison.papers = comparison.papers.filter(p => p.id !== paperId);
    comparison.updatedAt = new Date();
    this.comparisonsCache.set(comparisonId, comparison);
    this.persist();
  }

  // ============ Storage ============

  private loadFromStorage(): void {
    if (!this.isBrowser) return;
    try {
      const papersData = localStorage.getItem(this.papersKey);
      if (papersData) {
        const papers: UploadedPaper[] = JSON.parse(papersData);
        papers.forEach(p => {
          p.uploadedAt = new Date(p.uploadedAt);
          this.papersCache.set(p.id, p);
        });
      }

      const compsData = localStorage.getItem(this.comparisonsKey);
      if (compsData) {
        const comps: ComparisonView[] = JSON.parse(compsData);
        comps.forEach(c => {
          c.createdAt = new Date(c.createdAt);
          c.updatedAt = new Date(c.updatedAt);
          this.comparisonsCache.set(c.id, c);
        });
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
  }

  private persist(): void {
    if (!this.isBrowser) return;
    try {
      const papers = Array.from(this.papersCache.values());
      localStorage.setItem(this.papersKey, JSON.stringify(papers));

      const comps = Array.from(this.comparisonsCache.values());
      localStorage.setItem(this.comparisonsKey, JSON.stringify(comps));
    } catch (e) {
      console.error('Failed to persist to storage', e);
    }
  }

  // ============ Utilities ============

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
