import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  Study,
  ReplicationStudy,
  MetaAnalysis,
  ValidationNetwork,
  ReproducibilityMetrics,
  ProtocolComparison,
  Protocol,
  ResearchField,
  MOCK_STUDIES,
  MOCK_REPLICATIONS,
  NetworkNode,
  NetworkEdge,
  ReplicationOutcome,
  FieldMetrics,
  YearlyTrend
} from '../models/study.model';

@Injectable({
  providedIn: 'root'
})
export class StudyService {
  private studiesSubject = new BehaviorSubject<Study[]>(this.loadStudies());
  private replicationsSubject = new BehaviorSubject<ReplicationStudy[]>(this.loadReplications());

  public studies$ = this.studiesSubject.asObservable();
  public replications$ = this.replicationsSubject.asObservable();

  private readonly STORAGE_KEY_STUDIES = 'meta_lab_studies';
  private readonly STORAGE_KEY_REPLICATIONS = 'meta_lab_replications';

  constructor() {}

  // Study Management
  getAllStudies(): Observable<Study[]> {
    return of(this.studiesSubject.value).pipe(delay(400));
  }

  getStudyById(id: string): Observable<Study | undefined> {
    const study = this.studiesSubject.value.find(s => s.id === id);
    return of(study).pipe(delay(200));
  }

  searchStudies(query: string, filters?: {
    fields?: ResearchField[];
    minScore?: number;
    dataAvailable?: boolean;
    codeAvailable?: boolean;
    preregistered?: boolean;
  }): Observable<Study[]> {
    let results = this.studiesSubject.value;

    // Text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(study =>
        study.title.toLowerCase().includes(lowerQuery) ||
        study.authors.some(a => a.toLowerCase().includes(lowerQuery)) ||
        study.abstract.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply filters
    if (filters) {
      if (filters.fields && filters.fields.length > 0) {
        results = results.filter(s => filters.fields!.includes(s.field));
      }
      if (filters.minScore !== undefined) {
        results = results.filter(s => s.reproducibilityScore >= filters.minScore!);
      }
      if (filters.dataAvailable !== undefined) {
        results = results.filter(s => s.dataAvailable === filters.dataAvailable);
      }
      if (filters.codeAvailable !== undefined) {
        results = results.filter(s => s.codeAvailable === filters.codeAvailable);
      }
      if (filters.preregistered !== undefined) {
        results = results.filter(s => s.preregistered === filters.preregistered);
      }
    }

    return of(results).pipe(delay(500));
  }

  createStudy(study: Omit<Study, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newStudy: Study = {
      ...study,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const studies = [...this.studiesSubject.value, newStudy];
    this.studiesSubject.next(studies);
    this.saveStudies(studies);
  }

  updateStudy(id: string, updates: Partial<Study>): void {
    const studies = this.studiesSubject.value.map(study =>
      study.id === id
        ? { ...study, ...updates, updatedAt: new Date() }
        : study
    );
    this.studiesSubject.next(studies);
    this.saveStudies(studies);
  }

  deleteStudy(id: string): void {
    const studies = this.studiesSubject.value.filter(s => s.id !== id);
    this.studiesSubject.next(studies);
    this.saveStudies(studies);
  }

  // Replication Management
  getAllReplications(): Observable<ReplicationStudy[]> {
    return of(this.replicationsSubject.value).pipe(delay(400));
  }

  getReplicationsForStudy(studyId: string): Observable<ReplicationStudy[]> {
    const replications = this.replicationsSubject.value.filter(
      r => r.originalStudyId === studyId
    );
    return of(replications).pipe(delay(300));
  }

  createReplication(replication: Omit<ReplicationStudy, 'id'>): void {
    const newReplication: ReplicationStudy = {
      ...replication,
      id: this.generateId()
    };
    
    const replications = [...this.replicationsSubject.value, newReplication];
    this.replicationsSubject.next(replications);
    this.saveReplications(replications);

    // Update original study replication count
    const originalStudy = this.studiesSubject.value.find(
      s => s.id === replication.originalStudyId
    );
    if (originalStudy) {
      this.updateStudy(originalStudy.id, {
        replicationCount: originalStudy.replicationCount + 1
      });
    }
  }

  updateReplication(id: string, updates: Partial<ReplicationStudy>): void {
    const replications = this.replicationsSubject.value.map(rep =>
      rep.id === id ? { ...rep, ...updates } : rep
    );
    this.replicationsSubject.next(replications);
    this.saveReplications(replications);
  }

  deleteReplication(id: string): void {
    const replications = this.replicationsSubject.value.filter(r => r.id !== id);
    this.replicationsSubject.next(replications);
    this.saveReplications(replications);
  }

  // Reproducibility Metrics
  getReproducibilityMetrics(): Observable<ReproducibilityMetrics> {
    const studies = this.studiesSubject.value;
    const totalStudies = studies.length;
    
    const replicatedStudies = studies.filter(
      s => s.status === 'Replicated' || s.status === 'Partially Replicated'
    ).length;
    
    const failedReplications = studies.filter(
      s => s.status === 'Failed Replication'
    ).length;

    const averageReproducibilityScore = 
      studies.reduce((sum, s) => sum + s.reproducibilityScore, 0) / totalStudies;

    const openDataPercentage = 
      (studies.filter(s => s.dataAvailable).length / totalStudies) * 100;
    
    const openCodePercentage = 
      (studies.filter(s => s.codeAvailable).length / totalStudies) * 100;
    
    const preregisteredPercentage = 
      (studies.filter(s => s.preregistered).length / totalStudies) * 100;

    // By field
    const byField: Record<ResearchField, FieldMetrics> = {} as any;
    const fields: ResearchField[] = [
      'Psychology', 'Neuroscience', 'Medicine', 'Biology', 'Chemistry',
      'Physics', 'Computer Science', 'Social Sciences', 'Economics', 'Other'
    ];

    fields.forEach(field => {
      const fieldStudies = studies.filter(s => s.field === field);
      if (fieldStudies.length > 0) {
        const successful = fieldStudies.filter(
          s => s.status === 'Replicated'
        ).length;
        byField[field] = {
          totalStudies: fieldStudies.length,
          successRate: (successful / fieldStudies.length) * 100,
          averageScore: fieldStudies.reduce((sum, s) => sum + s.reproducibilityScore, 0) / fieldStudies.length
        };
      }
    });

    // Trend over time (mock data)
    const trendOverTime: YearlyTrend[] = [
      { year: 2019, totalStudies: 45, successfulReplications: 25, successRate: 55.6 },
      { year: 2020, totalStudies: 52, successfulReplications: 32, successRate: 61.5 },
      { year: 2021, totalStudies: 48, successfulReplications: 31, successRate: 64.6 },
      { year: 2022, totalStudies: 55, successfulReplications: 38, successRate: 69.1 },
      { year: 2023, totalStudies: 61, successfulReplications: 45, successRate: 73.8 },
      { year: 2024, totalStudies: 58, successfulReplications: 44, successRate: 75.9 }
    ];

    const metrics: ReproducibilityMetrics = {
      totalStudies,
      replicatedStudies,
      failedReplications,
      averageReproducibilityScore,
      openDataPercentage,
      openCodePercentage,
      preregisteredPercentage,
      byField,
      trendOverTime
    };

    return of(metrics).pipe(delay(600));
  }

  // Validation Network
  getValidationNetwork(studyId: string): Observable<ValidationNetwork> {
    const replications = this.replicationsSubject.value.filter(
      r => r.originalStudyId === studyId
    );

    const nodes: NetworkNode[] = [];
    const edges: NetworkEdge[] = [];

    // Central node (original study)
    const centralStudy = this.studiesSubject.value.find(s => s.id === studyId);
    if (centralStudy) {
      nodes.push({
        id: centralStudy.id,
        studyId: centralStudy.id,
        studyTitle: centralStudy.title,
        authors: centralStudy.authors[0],
        year: centralStudy.year,
        type: 'Original',
        outcome: this.mapStatusToOutcome(centralStudy.status),
        size: 100
      });

      // Replication nodes
      replications.forEach((rep, index) => {
        nodes.push({
          id: rep.id,
          studyId: rep.id,
          studyTitle: `Replication ${index + 1}`,
          authors: rep.replicatingTeam[0],
          year: rep.completionDate?.getFullYear() || new Date().getFullYear(),
          type: 'Replication',
          outcome: rep.outcome,
          size: 60
        });

        // Edge from original to replication
        edges.push({
          source: centralStudy.id,
          target: rep.id,
          relationship: this.getRelationship(rep.outcome),
          confidence: rep.confidence
        });
      });
    }

    const overallConfidence = replications.length > 0
      ? replications.reduce((sum, r) => sum + r.confidence, 0) / replications.length
      : 0;

    const network: ValidationNetwork = {
      id: this.generateId(),
      centralStudyId: studyId,
      nodes,
      edges,
      overallConfidence
    };

    return of(network).pipe(delay(500));
  }

  // Meta-Analysis (simplified mock)
  generateMetaAnalysis(studyIds: string[]): Observable<MetaAnalysis> {
    const studies = this.studiesSubject.value.filter(s => studyIds.includes(s.id));
    
    const totalParticipants = studies.reduce((sum, s) => sum + s.sampleSize, 0);
    const averageEffectSize = 0.45; // Mock
    
    const metaAnalysis: MetaAnalysis = {
      id: this.generateId(),
      title: 'Meta-Analysis of Selected Studies',
      description: 'Automated meta-analysis generated by MetaLab',
      researchQuestion: 'What is the overall effect across selected studies?',
      studies,
      totalStudies: studies.length,
      totalParticipants,
      averageEffectSize,
      confidenceInterval: [0.35, 0.55],
      heterogeneity: 45.2, // I² mock
      publicationBias: 'Medium',
      qualityScore: 75,
      forestPlotData: studies.map(s => ({
        studyName: `${s.authors[0]} (${s.year})`,
        effectSize: 0.4 + Math.random() * 0.3,
        lowerCI: 0.2 + Math.random() * 0.2,
        upperCI: 0.5 + Math.random() * 0.3,
        weight: s.sampleSize / totalParticipants * 100
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      author: 'MetaLab System'
    };

    return of(metaAnalysis).pipe(delay(1000));
  }

  // Protocol Comparison
  compareProtocols(
    originalProtocolId: string,
    replicationProtocolId: string
  ): Observable<ProtocolComparison> {
    // Mock implementation
    const mockOriginal: Protocol = {
      id: originalProtocolId,
      version: '1.0',
      title: 'Original Protocol',
      description: 'Original study protocol',
      steps: [],
      equipment: ['Equipment A', 'Equipment B'],
      materials: ['Material X', 'Material Y'],
      duration: '2 hours',
      difficulty: 'Medium',
      author: 'Original Author',
      createdAt: new Date(),
      lastModified: new Date()
    };

    const mockReplication: Protocol = {
      id: replicationProtocolId,
      version: '1.1',
      title: 'Replication Protocol',
      description: 'Modified protocol for replication',
      steps: [],
      equipment: ['Equipment A', 'Equipment C'],
      materials: ['Material X', 'Material Z'],
      duration: '2.5 hours',
      difficulty: 'Medium',
      author: 'Replication Team',
      createdAt: new Date(),
      lastModified: new Date()
    };

    const comparison: ProtocolComparison = {
      originalProtocol: mockOriginal,
      replicationProtocol: mockReplication,
      differences: [
        {
          section: 'Equipment',
          type: 'Modified',
          description: 'Equipment B replaced with Equipment C',
          impact: 'Moderate'
        },
        {
          section: 'Materials',
          type: 'Modified',
          description: 'Material Y replaced with Material Z',
          impact: 'Minor'
        },
        {
          section: 'Duration',
          type: 'Modified',
          description: 'Duration increased by 30 minutes',
          impact: 'Minor'
        }
      ],
      similarityScore: 85
    };

    return of(comparison).pipe(delay(700));
  }

  // Helper methods
  private mapStatusToOutcome(status: string): ReplicationOutcome {
    switch (status) {
      case 'Replicated': return 'Successful';
      case 'Failed Replication': return 'Failed';
      case 'Partially Replicated': return 'Partial';
      case 'Pending Replication': return 'Pending';
      default: return 'Pending';
    }
  }

  private getRelationship(outcome: ReplicationOutcome): 'Replicates' | 'Extends' | 'Contradicts' | 'Supports' {
    switch (outcome) {
      case 'Successful': return 'Replicates';
      case 'Failed': return 'Contradicts';
      case 'Partial': return 'Supports';
      default: return 'Supports';
    }
  }

  private generateId(): string {
    return 'id_' + Math.random().toString(36).substring(2, 11);
  }

  private loadStudies(): Study[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_STUDIES);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          updatedAt: new Date(s.updatedAt),
          badges: s.badges.map((b: any) => ({
            ...b,
            awardedDate: new Date(b.awardedDate)
          }))
        }));
      } catch (e) {
        console.error('Failed to load studies', e);
      }
    }
    return MOCK_STUDIES;
  }

  private saveStudies(studies: Study[]): void {
    localStorage.setItem(this.STORAGE_KEY_STUDIES, JSON.stringify(studies));
  }

  private loadReplications(): ReplicationStudy[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_REPLICATIONS);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((r: any) => ({
          ...r,
          startDate: new Date(r.startDate),
          completionDate: r.completionDate ? new Date(r.completionDate) : undefined
        }));
      } catch (e) {
        console.error('Failed to load replications', e);
      }
    }
    return MOCK_REPLICATIONS;
  }

  private saveReplications(replications: ReplicationStudy[]): void {
    localStorage.setItem(this.STORAGE_KEY_REPLICATIONS, JSON.stringify(replications));
  }
}
