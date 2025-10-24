import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  MultilingualPaper,
  GlobalCollaboration,
  TranslationRequest,
  LanguageCode,
  TranslationStatus,
  CollaborationStatus,
  ResearchField,
  GeographicRegion,
  LanguageDetection,
  CrossLingualSearch,
  MOCK_MULTILINGUAL_PAPERS,
  MOCK_COLLABORATIONS,
  SUPPORTED_LANGUAGES
} from '../models/translation.model';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEYS = {
    papers: 'gkb_papers',
    collaborations: 'gkb_collaborations',
    translations: 'gkb_translations',
    searches: 'gkb_searches',
    preferences: 'gkb_preferences'
  };

  private papersSubject = new BehaviorSubject<MultilingualPaper[]>(this.loadFromStorage('papers', MOCK_MULTILINGUAL_PAPERS));
  private collaborationsSubject = new BehaviorSubject<GlobalCollaboration[]>(this.loadFromStorage('collaborations', MOCK_COLLABORATIONS));
  private translationsSubject = new BehaviorSubject<TranslationRequest[]>(this.loadFromStorage('translations', []));
  private searchesSubject = new BehaviorSubject<CrossLingualSearch[]>(this.loadFromStorage('searches', []));

  public papers$ = this.papersSubject.asObservable();
  public collaborations$ = this.collaborationsSubject.asObservable();
  public translations$ = this.translationsSubject.asObservable();
  public searches$ = this.searchesSubject.asObservable();

  constructor() {}

  // ============================================================================
  // Paper Discovery Methods
  // ============================================================================

  getAllPapers(): Observable<MultilingualPaper[]> {
    return of(this.papersSubject.value).pipe(delay(200));
  }

  getPaperById(id: string): Observable<MultilingualPaper | undefined> {
    const paper = this.papersSubject.value.find(p => p.id === id);
    return of(paper).pipe(delay(150));
  }

  searchPapers(filters: {
    query?: string;
    languages?: LanguageCode[];
    fields?: ResearchField[];
    regions?: GeographicRegion[];
    openAccessOnly?: boolean;
    minTranslationQuality?: number;
  }): Observable<MultilingualPaper[]> {
    let results = this.papersSubject.value;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(p => {
        // Search across all available language titles and abstracts
        return Object.values(p.title).some(title => title.toLowerCase().includes(query)) ||
               Object.values(p.abstract).some(abstract => abstract.toLowerCase().includes(query)) ||
               p.authors.some(a => a.originalName.toLowerCase().includes(query));
      });
    }

    if (filters.languages && filters.languages.length > 0) {
      results = results.filter(p => 
        filters.languages!.some(lang => p.availableLanguages.includes(lang))
      );
    }

    if (filters.fields && filters.fields.length > 0) {
      results = results.filter(p => filters.fields!.includes(p.field));
    }

    if (filters.regions && filters.regions.length > 0) {
      results = results.filter(p => 
        filters.regions!.some(region => p.regions.includes(region))
      );
    }

    if (filters.openAccessOnly) {
      results = results.filter(p => p.openAccess);
    }

    if (filters.minTranslationQuality !== undefined) {
      results = results.filter(p => {
        const qualities = Object.values(p.translationQuality);
        return qualities.some(q => q.score >= filters.minTranslationQuality!);
      });
    }

    return of(results).pipe(delay(300));
  }

  crossLingualSearch(query: string, sourceLanguage: LanguageCode, targetLanguages: LanguageCode[]): Observable<CrossLingualSearch> {
    // Simulate translation of query to target languages
    const translatedQueries: Partial<Record<LanguageCode, string>> = {
      [sourceLanguage]: query
    };

    targetLanguages.forEach(lang => {
      translatedQueries[lang] = `${query} (translated to ${SUPPORTED_LANGUAGES[lang].name})`;
    });

    // Search across all languages
    const results = this.papersSubject.value.filter(p => {
      const queryLower = query.toLowerCase();
      return Object.values(p.title).some(title => title.toLowerCase().includes(queryLower)) ||
             Object.values(p.abstract).some(abstract => abstract.toLowerCase().includes(queryLower));
    });

    const search: CrossLingualSearch = {
      id: `search_${Date.now()}`,
      query,
      sourceLanguage,
      targetLanguages,
      translatedQueries,
      results,
      resultCount: results.length,
      searchDate: new Date(),
      filters: [],
      relevanceScores: {}
    };

    // Calculate relevance scores
    results.forEach((paper, index) => {
      search.relevanceScores[paper.id] = 100 - (index * 5);
    });

    const searches = [...this.searchesSubject.value, search];
    this.searchesSubject.next(searches);
    this.saveToStorage('searches', searches);

    return of(search).pipe(delay(400));
  }

  detectLanguage(text: string): Observable<LanguageDetection> {
    // Simple language detection simulation
    const detection: LanguageDetection = {
      detectedLanguage: 'en',
      confidence: 92,
      alternativeLanguages: [
        { language: 'es', confidence: 5 },
        { language: 'fr', confidence: 3 }
      ],
      script: 'Latin',
      isReliable: true
    };

    // Basic heuristics for different scripts
    if (/[\u4e00-\u9fa5]/.test(text)) {
      detection.detectedLanguage = 'zh';
      detection.script = 'Chinese';
      detection.confidence = 95;
    } else if (/[\u0600-\u06FF]/.test(text)) {
      detection.detectedLanguage = 'ar';
      detection.script = 'Arabic';
      detection.confidence = 94;
    } else if (/[\u0400-\u04FF]/.test(text)) {
      detection.detectedLanguage = 'ru';
      detection.script = 'Cyrillic';
      detection.confidence = 93;
    } else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
      detection.detectedLanguage = 'ja';
      detection.script = 'Japanese';
      detection.confidence = 96;
    }

    return of(detection).pipe(delay(200));
  }

  // ============================================================================
  // Translation Methods
  // ============================================================================

  getAllTranslations(): Observable<TranslationRequest[]> {
    return of(this.translationsSubject.value).pipe(delay(200));
  }

  getTranslationById(id: string): Observable<TranslationRequest | undefined> {
    const translation = this.translationsSubject.value.find(t => t.id === id);
    return of(translation).pipe(delay(150));
  }

  requestTranslation(request: Omit<TranslationRequest, 'id' | 'requestedAt' | 'status' | 'confidence'>): Observable<TranslationRequest> {
    const newTranslation: TranslationRequest = {
      ...request,
      id: `trans_${Date.now()}`,
      requestedAt: new Date(),
      status: 'pending',
      confidence: 0
    };

    // Simulate translation process
    setTimeout(() => {
      this.processTranslation(newTranslation.id);
    }, 2000);

    const translations = [...this.translationsSubject.value, newTranslation];
    this.translationsSubject.next(translations);
    this.saveToStorage('translations', translations);

    return of(newTranslation).pipe(delay(300));
  }

  private processTranslation(id: string): void {
    const translations = this.translationsSubject.value.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'completed' as TranslationStatus,
          completedAt: new Date(),
          translatedText: `[Translated: ${t.sourceText.substring(0, 50)}...]`,
          confidence: Math.floor(Math.random() * 15) + 85 // 85-100
        };
      }
      return t;
    });

    this.translationsSubject.next(translations);
    this.saveToStorage('translations', translations);
  }

  getTranslationsByStatus(status: TranslationStatus): Observable<TranslationRequest[]> {
    const translations = this.translationsSubject.value.filter(t => t.status === status);
    return of(translations).pipe(delay(200));
  }

  // ============================================================================
  // Collaboration Methods
  // ============================================================================

  getAllCollaborations(): Observable<GlobalCollaboration[]> {
    return of(this.collaborationsSubject.value).pipe(delay(200));
  }

  getCollaborationById(id: string): Observable<GlobalCollaboration | undefined> {
    const collaboration = this.collaborationsSubject.value.find(c => c.id === id);
    return of(collaboration).pipe(delay(150));
  }

  searchCollaborations(filters: {
    query?: string;
    languages?: LanguageCode[];
    fields?: ResearchField[];
    regions?: GeographicRegion[];
    status?: CollaborationStatus;
  }): Observable<GlobalCollaboration[]> {
    let results = this.collaborationsSubject.value;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(c => 
        Object.values(c.title).some(title => title.toLowerCase().includes(query)) ||
        Object.values(c.description).some(desc => desc.toLowerCase().includes(query)) ||
        c.leader.name.toLowerCase().includes(query)
      );
    }

    if (filters.languages && filters.languages.length > 0) {
      results = results.filter(c => 
        filters.languages!.some(lang => c.languages.includes(lang))
      );
    }

    if (filters.fields && filters.fields.length > 0) {
      results = results.filter(c => filters.fields!.includes(c.field));
    }

    if (filters.regions && filters.regions.length > 0) {
      results = results.filter(c => 
        filters.regions!.some(region => c.regions.includes(region))
      );
    }

    if (filters.status) {
      results = results.filter(c => c.status === filters.status);
    }

    return of(results).pipe(delay(300));
  }

  createCollaboration(collaboration: Omit<GlobalCollaboration, 'id' | 'startDate' | 'status'>): Observable<GlobalCollaboration> {
    const newCollaboration: GlobalCollaboration = {
      ...collaboration,
      id: `collab_${Date.now()}`,
      startDate: new Date(),
      status: 'planning'
    };

    const collaborations = [...this.collaborationsSubject.value, newCollaboration];
    this.collaborationsSubject.next(collaborations);
    this.saveToStorage('collaborations', collaborations);

    return of(newCollaboration).pipe(delay(500));
  }

  updateCollaborationStatus(id: string, status: CollaborationStatus): Observable<GlobalCollaboration | undefined> {
    const collaborations = this.collaborationsSubject.value.map(c => 
      c.id === id ? { ...c, status } : c
    );

    this.collaborationsSubject.next(collaborations);
    this.saveToStorage('collaborations', collaborations);

    const updated = collaborations.find(c => c.id === id);
    return of(updated).pipe(delay(300));
  }

  joinCollaboration(collaborationId: string, userId: string): Observable<boolean> {
    // Simulate joining a collaboration
    return of(true).pipe(delay(300));
  }

  // ============================================================================
  // Statistics Methods
  // ============================================================================

  getPaperStatistics(): Observable<{
    totalPapers: number;
    byLanguage: Record<string, number>;
    byField: Record<string, number>;
    byRegion: Record<string, number>;
    averageTranslationQuality: number;
    openAccessPercentage: number;
  }> {
    const papers = this.papersSubject.value;
    
    const byLanguage: Record<string, number> = {};
    papers.forEach(p => {
      p.availableLanguages.forEach(lang => {
        byLanguage[lang] = (byLanguage[lang] || 0) + 1;
      });
    });

    const byField: Record<string, number> = {};
    papers.forEach(p => {
      byField[p.field] = (byField[p.field] || 0) + 1;
    });

    const byRegion: Record<string, number> = {};
    papers.forEach(p => {
      p.regions.forEach(region => {
        byRegion[region] = (byRegion[region] || 0) + 1;
      });
    });

    const totalQuality = papers.reduce((sum, p) => {
      const qualities = Object.values(p.translationQuality);
      const avgQuality = qualities.reduce((s, q) => s + q.score, 0) / qualities.length;
      return sum + avgQuality;
    }, 0);

    const openAccessCount = papers.filter(p => p.openAccess).length;

    const stats = {
      totalPapers: papers.length,
      byLanguage,
      byField,
      byRegion,
      averageTranslationQuality: papers.length > 0 ? totalQuality / papers.length : 0,
      openAccessPercentage: papers.length > 0 ? (openAccessCount / papers.length) * 100 : 0
    };

    return of(stats).pipe(delay(200));
  }

  getCollaborationStatistics(): Observable<{
    totalCollaborations: number;
    activeCollaborations: number;
    byLanguage: Record<string, number>;
    byField: Record<string, number>;
    byRegion: Record<string, number>;
    averageTeamSize: number;
  }> {
    const collaborations = this.collaborationsSubject.value;

    const byLanguage: Record<string, number> = {};
    collaborations.forEach(c => {
      c.languages.forEach(lang => {
        byLanguage[lang] = (byLanguage[lang] || 0) + 1;
      });
    });

    const byField: Record<string, number> = {};
    collaborations.forEach(c => {
      byField[c.field] = (byField[c.field] || 0) + 1;
    });

    const byRegion: Record<string, number> = {};
    collaborations.forEach(c => {
      c.regions.forEach(region => {
        byRegion[region] = (byRegion[region] || 0) + 1;
      });
    });

    const totalTeamSize = collaborations.reduce((sum, c) => sum + c.members.length + 1, 0);

    const stats = {
      totalCollaborations: collaborations.length,
      activeCollaborations: collaborations.filter(c => c.status === 'active').length,
      byLanguage,
      byField,
      byRegion,
      averageTeamSize: collaborations.length > 0 ? totalTeamSize / collaborations.length : 0
    };

    return of(stats).pipe(delay(200));
  }

  getTranslationStatistics(): Observable<{
    totalTranslations: number;
    completedTranslations: number;
    averageConfidence: number;
    bySourceLanguage: Record<string, number>;
    byTargetLanguage: Record<string, number>;
  }> {
    const translations = this.translationsSubject.value;

    const bySourceLanguage: Record<string, number> = {};
    const byTargetLanguage: Record<string, number> = {};

    translations.forEach(t => {
      bySourceLanguage[t.sourceLanguage] = (bySourceLanguage[t.sourceLanguage] || 0) + 1;
      byTargetLanguage[t.targetLanguage] = (byTargetLanguage[t.targetLanguage] || 0) + 1;
    });

    const completedTranslations = translations.filter(t => t.status === 'completed');
    const totalConfidence = completedTranslations.reduce((sum, t) => sum + t.confidence, 0);

    const stats = {
      totalTranslations: translations.length,
      completedTranslations: completedTranslations.length,
      averageConfidence: completedTranslations.length > 0 ? totalConfidence / completedTranslations.length : 0,
      bySourceLanguage,
      byTargetLanguage
    };

    return of(stats).pipe(delay(200));
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  getSupportedLanguages(): LanguageCode[] {
    return Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[];
  }

  getLanguageInfo(code: LanguageCode) {
    return SUPPORTED_LANGUAGES[code];
  }

  private loadFromStorage<T>(key: keyof typeof this.STORAGE_KEYS, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS[key]);
      if (stored) {
        const parsed = JSON.parse(stored);
        return this.reviveDates(parsed);
      }
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
    }
    return defaultValue;
  }

  private saveToStorage<T>(key: keyof typeof this.STORAGE_KEYS, data: T): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS[key], JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  private reviveDates<T>(obj: any): T {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (dateRegex.test(obj)) {
        return new Date(obj) as any;
      }
      return obj as any;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.reviveDates(item)) as any;
    }
    
    if (typeof obj === 'object') {
      const result: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = this.reviveDates(obj[key]);
        }
      }
      return result;
    }
    
    return obj as any;
  }
}
